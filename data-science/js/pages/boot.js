/**
 * تشغيل أي صفحة: تحميل الكتالوج، رسم الهيكل المشترك، ثم استدعاء دالة الصفحة.
 */
import { loadCatalog } from '../core/catalog.js';
import { renderError, renderLayout } from '../components/layout.js';

export async function boot(active, render) {
    let catalog;
    try {
        catalog = await loadCatalog();
    } catch (err) {
        const target = document.querySelector('main') || document.body;
        renderError(target, err);
        return;
    }
    renderLayout(catalog, { active });
    try {
        await render(catalog);
    } catch (err) {
        console.error(err);
        const target = document.querySelector('main') || document.body;
        renderError(target, err);
    }
}
