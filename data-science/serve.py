#!/usr/bin/env python3
"""
خادم محلي لتشغيل منصة CodeWay علم البيانات.

لماذا لا نستخدم `python -m http.server` مباشرة؟
  1. على Windows قد يقرأ Python نوع ملفات .js من الـ Registry كـ text/plain،
     فيرفض المتصفح تشغيلها كوحدات JavaScript وتظهر الصفحة فارغة.
  2. المتصفح قد يحتفظ بنسخ قديمة من الملفات بعد git pull.
هذا الخادم يحدد أنواع الملفات الصحيحة ويمنع التخزين المؤقت.

التشغيل (من أي مجلد):
    python data-science/serve.py          ثم افتح http://localhost:8000/data-science/
    python data-science/serve.py 8080     لتغيير المنفذ
"""
import functools
import http.server
import os
import sys
import webbrowser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.py': 'text/plain; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.wasm': 'application/wasm',
}


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, **TYPES}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


def main():
    handler = functools.partial(Handler, directory=ROOT)
    url = f'http://localhost:{PORT}/data-science/'
    with http.server.ThreadingHTTPServer(('127.0.0.1', PORT), handler) as server:
        print(f'CodeWay يعمل على: {url}')
        print('لإيقاف الخادم اضغط Ctrl + C')
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print('\nتم إيقاف الخادم')


if __name__ == '__main__':
    main()
