/**
 * واجهة تشغيل الكود الموحدة.
 *
 *   const runner = await getRunner('python');
 *   const result = await runner.run({ code, tests, stdin });
 *
 * الشكل الموحد للنتيجة (من أي مشغّل):
 *   {
 *     stdout: string,
 *     error: null | { type, message, line, text },
 *     tests: null | { passed: boolean, message: string },
 *     durationMs: number
 *   }
 *
 * المشغّلات:
 *   - pyodide: Python داخل المتصفح (WebAssembly في Web Worker). الافتراضي.
 *   - remote:  POST إلى CONFIG.remote.endpoint (Backend معزول) بنفس الشكل.
 * لإضافة لغة (مثلاً SQL عبر sql.js في مستوى SQL) أضف مشغّلاً يطبّق نفس الدالة run().
 */
import { CONFIG } from '../core/config.js';

const runners = new Map();

export async function getRunner(language) {
    const kind = CONFIG.runners[language];
    if (!kind) throw new Error(`لا يوجد مشغّل مُعرّف للغة ${language}`);
    const key = `${language}:${kind}`;
    if (!runners.has(key)) {
        let runner;
        if (kind === 'pyodide') {
            const mod = await import('./pyodide-runner.js');
            runner = mod.createPyodideRunner();
        } else if (kind === 'remote') {
            const mod = await import('./remote-runner.js');
            runner = mod.createRemoteRunner(language);
        } else {
            throw new Error(`نوع مشغّل غير معروف: ${kind}`);
        }
        runners.set(key, runner);
    }
    return runners.get(key);
}

/** رسائل عربية تشرح أشهر أخطاء Python للمبتدئ. */
export const ERROR_HINTS = {
    SyntaxError: 'خطأ في كتابة الكود نفسه: تأكد من الأقواس وعلامات التنصيص والنقطتين `:` في نهاية if/for/def.',
    IndentationError: 'خطأ في المسافات البادئة: الأسطر داخل if/for/def يجب أن تبدأ بنفس عدد المسافات (4 عادةً).',
    NameError: 'استخدمت اسماً لم يُعرّف بعد: تأكد من كتابة اسم المتغير بنفس الحروف تماماً، ومن تعريفه قبل استخدامه.',
    TypeError: 'نوع القيمة لا يناسب العملية: مثل جمع نص مع رقم. حوّل النوع أولاً باستخدام int() أو str().',
    ValueError: 'النوع صحيح لكن القيمة غير مناسبة: مثل int("abc").',
    ZeroDivisionError: 'قسمة على صفر: تحقق من المقام قبل القسمة.',
    IndexError: 'رقم الموضع خارج حدود القائمة: تذكّر أن الترقيم يبدأ من 0 وآخر عنصر موضعه len - 1.',
    KeyError: 'المفتاح غير موجود في القاموس: استخدم .get() أو تحقق بـ in قبل القراءة.',
    AttributeError: 'هذا النوع لا يملك الدالة أو الخاصية التي استدعيتها: تحقق من نوع المتغير ومن اسم الدالة.',
    FileNotFoundError: 'الملف غير موجود في المسار المحدد: تحقق من الاسم والمسار.',
    ModuleNotFoundError: 'المكتبة غير متاحة أو اسمها مكتوب بشكل خاطئ.',
    EOFError: 'الكود ينتظر مدخلات من input(): اكتب القيم في مربع "المدخلات".',
    RecursionError: 'استدعاء ذاتي بلا نهاية: تأكد من وجود شرط توقف.',
    TimeoutError: 'استغرق التنفيذ وقتاً أطول من المسموح: غالباً توجد حلقة لا تنتهي.',
};
