"""
CodeWay Python harness.

يُستخدم هذا الملف نفسه في مكانين حتى يكون السلوك متطابقاً:
  1. داخل المتصفح عبر Pyodide (js/runners/pyodide-worker.js).
  2. في أداة فحص المحتوى tools/check_content.py (CPython) للتأكد من أن
     كل مثال يطبع فعلاً "النتيجة المتوقعة" المكتوبة في الدرس، وأن كل حل نموذجي
     يجتاز اختبارات التمرين.

الدالة run() تُرجع قاموساً بالشكل:
    {
        "stdout": "...",                       # كل ما طبعه الكود
        "error": None | {type, message, line, text},
        "tests": None | {"passed": bool, "message": str},
        "images": ["<base64 png>", ...],       # رسوم matplotlib التي أنشأها الكود
    }
"""
import base64
import builtins
import io
import os
import sys
import traceback
import warnings

# الرسوم تُحفظ كصور PNG (لا توجد نافذة عرض في المتصفح أو في أداة الفحص)
os.environ['MPLBACKEND'] = 'Agg'
warnings.filterwarnings('ignore', message='.*non-interactive.*')
warnings.filterwarnings('ignore', message='.*Glyph.*missing from.*font.*')

USER_FILENAME = '<main.py>'
TESTS_FILENAME = '<tests>'


def _format_error(exc):
    if isinstance(exc, SyntaxError):
        return {
            'type': type(exc).__name__,
            'message': exc.msg,
            'line': exc.lineno,
            'text': (exc.text or '').rstrip('\n'),
        }
    frames = [f for f in traceback.extract_tb(exc.__traceback__) if f.filename == USER_FILENAME]
    last = frames[-1] if frames else None
    return {
        'type': type(exc).__name__,
        'message': str(exc),
        'line': last.lineno if last else None,
        'text': (last.line or '') if last else '',
    }


def _collect_figures():
    plt = sys.modules.get('matplotlib.pyplot')
    if plt is None:
        return []
    images = []
    for num in plt.get_fignums():
        buf = io.BytesIO()
        plt.figure(num).savefig(buf, format='png', dpi=100, bbox_inches='tight')
        images.append(base64.b64encode(buf.getvalue()).decode('ascii'))
    plt.close('all')
    return images


def run(code, tests=None, stdin=None):
    out = io.StringIO()
    pending_input = list((stdin or '').splitlines())

    def fake_input(prompt=''):
        out.write(str(prompt))
        if not pending_input:
            raise EOFError('لا توجد مدخلات: هذا الكود يستخدم input()، اكتب القيم في مربع "المدخلات" قبل التشغيل.')
        value = pending_input.pop(0)
        out.write(value + '\n')
        return value

    namespace = {'__name__': '__main__', '__builtins__': builtins, 'input': fake_input}
    result = {'stdout': '', 'error': None, 'tests': None, 'images': []}

    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = out
    try:
        exec(compile(code, USER_FILENAME, 'exec'), namespace)
    except SystemExit:
        pass
    except BaseException as exc:  # noqa: BLE001 - نعرض أي خطأ للطالب
        result['error'] = _format_error(exc)
    finally:
        sys.stdout, sys.stderr = old_out, old_err

    result['stdout'] = out.getvalue()
    try:
        result['images'] = _collect_figures()
    except Exception:  # noqa: BLE001 - فشل حفظ الرسم لا يجب أن يخفي نتيجة الكود
        result['images'] = []

    if tests:
        if result['error'] is not None:
            result['tests'] = {
                'passed': False,
                'message': 'ظهر خطأ أثناء تشغيل كودك. صحّحه أولاً ثم أعد التحقق.',
            }
        else:
            namespace['__output__'] = result['stdout']
            namespace['__code__'] = code
            old_out = sys.stdout
            sys.stdout = io.StringIO()  # ما تطبعه دوال الطالب أثناء الاختبار لا يظهر في المخرجات
            try:
                exec(compile(tests, TESTS_FILENAME, 'exec'), namespace)
                result['tests'] = {'passed': True, 'message': ''}
            except AssertionError as exc:
                result['tests'] = {'passed': False, 'message': str(exc) or 'لم يتحقق أحد شروط التمرين.'}
            except Exception as exc:  # noqa: BLE001
                result['tests'] = {
                    'passed': False,
                    'message': f'تعذّر التحقق من الحل: {type(exc).__name__}: {exc}',
                }
            finally:
                sys.stdout = old_out

    return result
