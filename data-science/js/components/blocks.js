/**
 * تحويل كتل المحتوى (content blocks) إلى HTML.
 * الكتلة إما نص (فقرة) أو كائن: {h} {list} {ol} {table} {code}.
 */
import { escapeHtml, inline, joinLines } from '../core/dom.js';
import { codeBlock } from './quiz.js';

export function renderBlocks(blocks) {
    if (!blocks) return '';
    const list = Array.isArray(blocks) ? blocks : [blocks];
    return list.map((b) => {
        if (typeof b === 'string') return `<p>${inline(b)}</p>`;
        if (b.h) return `<h3>${inline(b.h)}</h3>`;
        if (b.list) return `<ul>${b.list.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
        if (b.ol) return `<ol>${b.ol.map((i) => `<li>${inline(i)}</li>`).join('')}</ol>`;
        if (b.table) {
            const { head = [], rows = [] } = b.table;
            return `<div class="table-wrap"><table>
                <thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead>
                <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody>
            </table></div>`;
        }
        if (b.code) return codeBlock(b.code, { language: b.language || 'python', label: b.label || '' });
        if (b.output) {
            return `<div class="output-box"><div class="cb-head"><span><i class="fas fa-terminal"></i> ${escapeHtml(b.label || 'المخرجات')}</span></div><pre>${escapeHtml(joinLines(b.output))}</pre></div>`;
        }
        return '';
    }).join('');
}
