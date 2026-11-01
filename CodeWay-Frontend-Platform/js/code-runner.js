/* ==========================================================
   CodeWay — مشغّل JavaScript داخل المتصفح (معزول)
   - يعمل لـ JavaScript فقط، داخل Web Worker مع مهلة زمنية تمنع الحلقات اللانهائية.
   - إن تعذّر إنشاء Worker (بعض المتصفحات مع file://) يُستخدم iframe معزول (sandbox).
   - بقية اللغات تحتاج خادم تنفيذ (Backend) وتعرض الواجهة رسالة واضحة بذلك.
   ========================================================== */
(function () {
  "use strict";
  var TIMEOUT = 3000;

  /* الشيفرة التي تعمل داخل البيئة المعزولة */
  var RUNTIME = [
    "function __fmt(v){ if (typeof v === 'string') return v; if (v === undefined) return 'undefined';",
    " if (typeof v === 'function') return '[Function ' + (v.name || 'anonymous') + ']';",
    " try { return JSON.stringify(v); } catch (e) { return String(v); } }",
    "function __run(data, post){",
    " var logs = [], t0 = Date.now();",
    " var push = function(type){ return function(){ logs.push({ type: type, text: Array.prototype.map.call(arguments, __fmt).join(' ') }); }; };",
    " var con = { log: push('log'), info: push('log'), warn: push('warn'), error: push('error') };",
    " var tests = (data.tests || []).map(function(t){ return '(function(){try{return {ok:true,v:(' + t.call + ')}}catch(e){return {ok:false,e:String(e)}}})()'; });",
    " var src = data.code + '\\n;return [' + tests.join(',') + '];';",
    " try { var res = new Function('console', src)(con); post({ logs: logs, results: res, time: Date.now() - t0 }); }",
    " catch (err) { post({ logs: logs, error: (err && err.name ? err.name + ': ' : '') + (err && err.message ? err.message : String(err)), time: Date.now() - t0 }); }",
    "}"
  ].join("\n");

  function viaWorker(data) {
    return new Promise(function (resolve, reject) {
      var url, w;
      try {
        url = URL.createObjectURL(new Blob([RUNTIME + "\nself.onmessage=function(e){__run(e.data,function(r){self.postMessage(r);});};"], { type: "text/javascript" }));
        w = new Worker(url);
      } catch (e) { reject(e); return; }
      var timer = setTimeout(function () { w.terminate(); URL.revokeObjectURL(url); resolve({ logs: [], error: "انتهت المهلة (" + TIMEOUT / 1000 + " ثوانٍ): قد تحتوي الشيفرة على حلقة لا تنتهي.", timeout: true }); }, TIMEOUT);
      w.onmessage = function (e) { clearTimeout(timer); w.terminate(); URL.revokeObjectURL(url); resolve(e.data); };
      w.onerror = function (e) { clearTimeout(timer); w.terminate(); URL.revokeObjectURL(url); e.preventDefault(); reject(e); };
      w.postMessage(data);
    });
  }

  function viaIframe(data) {
    return new Promise(function (resolve) {
      var token = "cw" + Math.random().toString(36).slice(2);
      var f = document.createElement("iframe");
      f.setAttribute("sandbox", "allow-scripts");
      f.style.display = "none";
      f.srcdoc = "<script>" + RUNTIME + "\nwindow.addEventListener('message',function(e){__run(e.data,function(r){r.token='" + token + "';parent.postMessage(r,'*');});});<\/script>";
      function done(r) { clearTimeout(timer); window.removeEventListener("message", onMsg); f.remove(); resolve(r); }
      function onMsg(e) { if (e.data && e.data.token === token) done(e.data); }
      var timer = setTimeout(function () { done({ logs: [], error: "انتهت المهلة: تعذّر إكمال التنفيذ.", timeout: true }); }, TIMEOUT + 500);
      window.addEventListener("message", onMsg);
      f.onload = function () { f.contentWindow.postMessage(data, "*"); };
      document.body.appendChild(f);
    });
  }

  CW.runJS = function (code, tests) {
    var data = { code: code, tests: tests || [] };
    return viaWorker(data).catch(function () { return viaIframe(data); });
  };

  /* اللغات المعروضة في المحرر */
  CW.editorLanguages = [
    { id: "javascript", name: "JavaScript", runnable: true, file: "main.js",
      sample: "// جرّب تعديل الشيفرة ثم اضغط «تشغيل»\nfunction greet(name) {\n  return \"مرحباً \" + name + \"!\";\n}\n\nconsole.log(greet(\"CodeWay\"));\nconsole.log([1, 2, 3].map(n => n * 2));" },
    { id: "python", name: "Python", file: "main.py", sample: "# ستعمل لغة Python بعد ربط خادم التنفيذ\nprint(\"Hello, CodeWay!\")" },
    { id: "java", name: "Java", file: "Main.java", sample: "// يحتاج تشغيل Java إلى خادم تنفيذ\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, CodeWay!\");\n    }\n}" },
    { id: "cpp", name: "C++", file: "main.cpp", sample: "// يحتاج تشغيل C++ إلى خادم تنفيذ\n#include <iostream>\n\nint main() {\n    std::cout << \"Hello, CodeWay!\";\n    return 0;\n}" },
    { id: "csharp", name: "C#", file: "Program.cs", sample: "// يحتاج تشغيل C# إلى خادم تنفيذ\nConsole.WriteLine(\"Hello, CodeWay!\");" },
    { id: "go", name: "Go", file: "main.go", sample: "// يحتاج تشغيل Go إلى خادم تنفيذ\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, CodeWay!\")\n}" },
    { id: "php", name: "PHP", file: "index.php", sample: "<?php\n// يحتاج تشغيل PHP إلى خادم تنفيذ\necho \"Hello, CodeWay!\";" },
    { id: "sql", name: "SQL", file: "query.sql", sample: "-- يحتاج تنفيذ SQL إلى قاعدة بيانات\nSELECT name, level\nFROM languages\nWHERE level = 'beginner';" }
  ];

  /* محرر نصي بسيط مع أرقام أسطر ودعم مفتاح Tab */
  CW.mountEditor = function (textarea, gutter) {
    function sync() {
      var n = textarea.value.split("\n").length, s = "";
      for (var i = 1; i <= n; i++) s += i + "\n";
      gutter.textContent = s;
      gutter.scrollTop = textarea.scrollTop;
    }
    textarea.addEventListener("input", sync);
    textarea.addEventListener("scroll", function () { gutter.scrollTop = textarea.scrollTop; });
    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        var s = textarea.selectionStart, en = textarea.selectionEnd;
        textarea.value = textarea.value.slice(0, s) + "  " + textarea.value.slice(en);
        textarea.selectionStart = textarea.selectionEnd = s + 2; sync();
      }
    });
    sync();
    return { sync: sync };
  };
})();
