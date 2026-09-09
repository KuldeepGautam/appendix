/* UBIS page-level interaction layer
 * The drawer form and table rows are static HTML.
 * JavaScript only wires DOM events; no record dataset/state is used.
 */
tailwind.config = {
  theme: { extend: {
    colors: {
      ubis: {
        navy: '#312E81', dark: '#1E1B4B', teal: '#0891B2', tealLight: '#ECFEFF',
        blue: '#4F46E5', bg: '#F6F7FB', border: '#DDE1EE', text: '#1E293B',
        muted: '#64748B', success: '#16A34A', warning: '#F59E0B', error: '#DC2626'
      }
    },
    boxShadow: {
      panel: '0 10px 32px rgba(49,46,129,.08)',
      drawer: '-18px 0 55px rgba(30,27,75,.18)'
    }
  }}
};

document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const form = document.getElementById('recordForm');
  const tbody = document.getElementById('gridBody');
  let editingRow = null;

  window.openDrawer = function () {
    if (!drawer) return;
    form?.reset();
    resetDrawerMode();
    drawer.classList.remove('drawer-closed');
    drawer.classList.add('drawer-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-page-locked');
    backdrop?.classList.remove('backdrop-hide');
    backdrop?.classList.add('backdrop-show');
    setTimeout(() => document.getElementById('year')?.focus(), 320);
  };

  window.closeDrawer = function () {
    if (!drawer) return;
    drawer.classList.remove('drawer-open');
    drawer.classList.add('drawer-closed');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-page-locked');
    backdrop?.classList.remove('backdrop-show');
    backdrop?.classList.add('backdrop-hide');
  };

  backdrop?.addEventListener('click', closeDrawer);
  document.getElementById('cancelDrawer')?.addEventListener('click', closeDrawer);

  function updateCounter() {
    const remarks = document.getElementById('remarks');
    const counter = document.getElementById('charCount');
    if (remarks && counter) counter.textContent = remarks.value.length;
  }
  document.getElementById('remarks')?.addEventListener('input', updateCounter);

  document.querySelectorAll('.seg-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll(`.seg-btn[data-group="${button.dataset.group}"]`).forEach((item) => {
        const active = item === button;
        item.classList.toggle('seg-active', active);
        item.classList.toggle('border-slate-300', !active);
        item.classList.toggle('text-slate-600', !active);
      });
    });
  });

  function nextId() {
    let max = 0;
    tbody?.querySelectorAll('[data-record-id]').forEach(row => {
      const number = Number((row.dataset.recordId || '').replace(/\D/g, ''));
      if (number > max) max = number;
    });
    return `UC-${String(max + 1).padStart(6, '0')}`;
  }

  function cell(row, field) {
    let el = row.querySelector(`[data-field="${field}"]`) || row.querySelector(`[data-column="${field}"]`);
    if (!el && field) {
      const btn = document.querySelector(`[data-sort="${field}"]`);
      const th = btn?.closest('th');
      if (th && th.parentElement) {
        const index = Array.from(th.parentElement.children).indexOf(th);
        if (index !== -1 && row.children[index]) {
          el = row.children[index];
        }
      }
    }
    return el;
  }

  function value(row, field) {
    const el = cell(row, field);
    return el?.tagName === 'SELECT' ? el.value : (el?.textContent.trim() || '');
  }

  function createRow(id, year, revBE, revRE, revActuals, capBE, capRE, capActuals, data = null) {
    const row = document.createElement('tr');
    row.className = 'group border-b border-slate-100 transition odd:bg-white even:bg-slate-50/60 hover:bg-cyan-50/60';
    row.dataset.recordRow = '';
    row.dataset.recordId = id;
    
    if (data && data.v_item !== undefined) {
      row.innerHTML = `
        <td data-label="Item" data-column="item" data-field="item" class="editable-cell break-words px-3 py-2 text-xs font-medium text-slate-800 text-left">${escapeHtml(data.v_item || '')}</td>
        <td data-label="Actual 2024-2025" data-column="actual_2024_2025" data-field="actual_2024_2025" class="editable-cell tabular break-words px-2 py-2 text-xs leading-5 text-slate-600 text-right">${Number(data.v_act_2425 || 0).toFixed(2)}</td>
        <td data-label="Actuals upto 9/2024" data-column="actuals_upto_09_2024" data-field="actuals_upto_09_2024" class="editable-cell tabular break-words px-2 py-2 text-xs leading-5 text-slate-600 text-right">${Number(data.v_act_upto_924 || 0).toFixed(2)}</td>
        <td data-label="B.E. 2025-2026" data-column="be_2025_2026" data-field="be_2025_2026" class="editable-cell tabular break-words px-2 py-2 text-xs leading-5 text-slate-600 text-right">${Number(data.v_be_2526 || 0).toFixed(2)}</td>
        <td data-label="Actuals upto 9/2025" data-column="actuals_upto_09_2025" data-field="actuals_upto_09_2025" class="editable-cell tabular break-words px-2 py-2 text-xs leading-5 text-slate-600 text-right">${Number(data.v_act_upto_925 || 0).toFixed(2)}</td>
        <td data-label="% w.r.t. B.E. 2025-2026" data-column="pct_wrt_be_2025_2026" data-field="pct_wrt_be_2025_2026" class="editable-cell tabular break-words px-2 py-2 text-xs leading-5 text-slate-600 text-right">${Number(data.v_pct_be_2526 || 0).toFixed(2)}</td>
        <td data-label="R.E. 2025-2026 prop. by Min/Dep" data-column="re_2025_2026_prop" data-field="re_2025_2026_prop" class="editable-cell tabular break-words px-2 py-2 text-xs leading-5 text-slate-600 text-right">${Number(data.v_re_2526_prop || 0).toFixed(2)}</td>
        <td data-label="B.E. 2026-2027 prop. by Min/Dep" data-column="be_2026_2027_prop" data-field="be_2026_2027_prop" class="editable-cell tabular break-words px-2 py-2 text-xs leading-5 text-slate-600 text-right">${Number(data.v_be_2627_prop || 0).toFixed(2)}</td>
        <td data-label="Action" class="grid-action-cell px-1 py-2 text-center">
          <div class="grid-action-menu">
            <button type="button" data-row-menu class="grid-more-button inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700" title="More actions" aria-label="More actions" aria-expanded="false"><i data-lucide="ellipsis-vertical" class="h-4 w-4"></i></button>
            <div data-row-actions class="grid-row-actions hidden absolute right-0 top-9 z-30 min-w-[130px] rounded-lg bg-white p-1 text-left shadow-lg">
              <button type="button" data-row-edit class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" title="Edit row"><i data-lucide="pencil" class="h-3.5 w-3.5"></i>Edit</button>
              <button type="button" data-row-save class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50" title="Save row"><i data-lucide="check" class="h-3.5 w-3.5"></i>Save</button>
              <button type="button" data-row-delete class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50" title="Delete row"><i data-lucide="trash-2" class="h-3.5 w-3.5"></i>Delete</button>
            </div>
          </div>
        </td>`;
      return row;
    }
    
    if (data && (data.q1_2425_qep !== undefined || data.rev2526BE !== undefined)) {
      if (data.q1_2425_qep !== undefined) {
        row.innerHTML = `
          <td data-label="S.No." class="px-1 py-2 text-center text-xs font-semibold text-slate-600"></td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.q1_2425_qep || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.q1_2425_act || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.q2_2425_qep || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.q2_2425_act || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.q1_2526_qep || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.q1_2526_act || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.q2_2526_qep || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.q2_2526_act || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td data-label="Action" class="grid-action-cell px-1 py-2 text-center"><div class="grid-action-menu">
            <button type="button" data-row-menu class="grid-more-button inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700" title="More actions" aria-label="More actions" aria-expanded="false"><i data-lucide="ellipsis-vertical" class="h-4 w-4"></i></button>
            <div data-row-actions class="grid-row-actions hidden absolute right-0 top-9 z-30 min-w-[130px] rounded-lg bg-white p-1 text-left shadow-lg">
              <button type="button" data-row-edit class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" title="Edit row"><i data-lucide="pencil" class="h-3.5 w-3.5"></i>Edit</button>
              <button type="button" data-row-save class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50" title="Save row"><i data-lucide="check" class="h-3.5 w-3.5"></i>Save</button>
              <button type="button" data-row-delete class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50" title="Delete row"><i data-lucide="trash-2" class="h-3.5 w-3.5"></i>Delete</button>
            </div>
          </div></td>`;
      } else {
        row.innerHTML = `
          <td data-label="S.No." class="px-1 py-2 text-center text-xs font-semibold text-slate-600"></td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.rev2526BE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.rev2526RE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.cap2526BE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.cap2526RE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.rev2627BE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="editable-cell tabular break-words px-1 py-2 text-xs leading-5 text-slate-600 text-center">${Number(data.cap2627BE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td data-label="Action" class="grid-action-cell px-1 py-2 text-center"><div class="grid-action-menu">
            <button type="button" data-row-menu class="grid-more-button inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700" title="More actions" aria-label="More actions" aria-expanded="false"><i data-lucide="ellipsis-vertical" class="h-4 w-4"></i></button>
            <div data-row-actions class="grid-row-actions hidden absolute right-0 top-9 z-30 min-w-[130px] rounded-lg bg-white p-1 text-left shadow-lg">
              <button type="button" data-row-edit class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" title="Edit row"><i data-lucide="pencil" class="h-3.5 w-3.5"></i>Edit</button>
              <button type="button" data-row-save class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50" title="Save row"><i data-lucide="check" class="h-3.5 w-3.5"></i>Save</button>
              <button type="button" data-row-delete class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50" title="Delete row"><i data-lucide="trash-2" class="h-3.5 w-3.5"></i>Delete</button>
            </div>
          </div></td>`;
      }
    } else {
      row.innerHTML = `
        <td data-label="S.No." class="border border-slate-200 px-2 py-3 text-center text-xs font-semibold text-slate-600"></td>
        <td data-label="Year" data-column="charge" data-field="charge" contenteditable="false" spellcheck="false" class="editable-cell break-words border border-slate-200 px-2 py-3 text-xs font-bold leading-5 text-slate-800">${escapeHtml(year || '')}</td>
        <td data-label="Revenue BE" data-column="services" data-field="services" contenteditable="false" spellcheck="false" class="editable-cell tabular break-words border border-slate-200 px-2 py-3 text-xs leading-5 text-slate-600">${Number(revBE || 0).toFixed(2)}</td>
        <td data-label="Revenue RE" data-column="department" data-field="department" contenteditable="false" spellcheck="false" class="editable-cell tabular break-words border border-slate-200 px-2 py-3 text-xs leading-5 text-slate-600">${Number(revRE || 0).toFixed(2)}</td>
        <td data-label="Actuals upto Sept" data-column="status" data-field="status" class="border border-slate-200 tabular px-2 py-3 text-xs font-medium text-slate-700">${Number(revActuals || 0).toFixed(2)}</td>
        <td data-label="Capital BE" data-column="rev22" data-field="rev22" contenteditable="false" spellcheck="false" class="editable-cell tabular border border-slate-200 px-2 py-3 text-xs font-semibold text-slate-800">${Number(capBE || 0).toFixed(2)}</td>
        <td data-label="Capital RE 2022–23" data-column="rev23" data-field="rev23" contenteditable="false" spellcheck="false" class="editable-cell tabular border border-slate-200 px-2 py-3 text-xs font-semibold text-slate-800">${Number(capRE || 0).toFixed(2)}</td>
        <td data-label="Capital Actuals 2023–24" data-column="rev23" data-field="rev23" contenteditable="false" spellcheck="false" class="editable-cell tabular border border-slate-200 px-2 py-3 text-xs font-semibold text-slate-800">${Number(capActuals || 0).toFixed(2)}</td>
        <td data-label="Action" class="grid-action-cell border border-slate-200 px-2 py-3 text-center"><div class="grid-action-menu">
          <button type="button" data-row-menu class="grid-more-button inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700" title="More actions" aria-label="More actions" aria-expanded="false"><i data-lucide="ellipsis-vertical" class="h-4 w-4"></i></button>
          <div data-row-actions class="grid-row-actions hidden absolute right-0 top-9 z-30 min-w-[130px] rounded-lg border border-slate-200 bg-white p-1 text-left shadow-lg">
            <button type="button" data-row-edit class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" title="Edit row"><i data-lucide="pencil" class="h-3.5 w-3.5"></i>Edit</button>
            <button type="button" data-row-save class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50" title="Save row"><i data-lucide="check" class="h-3.5 w-3.5"></i>Save</button>
            <button type="button" data-row-delete class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50" title="Delete row"><i data-lucide="trash-2" class="h-3.5 w-3.5"></i>Delete</button>
          </div>
        </div></td>`;
    }
    return row;
  }

  function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  function renumberRows() {
    tbody?.querySelectorAll('[data-record-row]').forEach((row, index) => {
      const sno = row.querySelector('td[data-label="S.No."]');
      if (sno) sno.textContent = index + 1;
    });
    const count = tbody?.querySelectorAll('[data-record-row]').length || 0;
    document.getElementById('totalText')?.replaceChildren(document.createTextNode(count));
    document.getElementById('recordCountBadge')?.replaceChildren(document.createTextNode(`${count} Records`));
    document.getElementById('rangeText')?.replaceChildren(document.createTextNode(count ? `1–${count}` : '0'));
  }

  function setFormValue(name, value) {
    const field = document.getElementById(name);
    if (!field) return;
    field.value = value ?? '';
  }

  function readFormData() {
    const data = {};
    form?.querySelectorAll('input, textarea, select').forEach((field) => {
      if (field.name) data[field.name] = field.value;
    });
    return data;
  }

  function storeFormData(row, data) {
    Object.entries(data).forEach(([key, value]) => {
      row.dataset[`form${key.charAt(0).toUpperCase()}${key.slice(1)}`] = value ?? '';
    });
  }

  function getStoredFormValue(row, name, fallback = '') {
    const key = `form${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    return row.dataset[key] ?? fallback;
  }

  function openEditDrawer(row) {
    if (!row || !form) return;

    editingRow = row;
    const tds = row.querySelectorAll('td');

    setFormValue('year', cell(row, 'charge')?.textContent.trim() || tds[1]?.textContent.trim() || getStoredFormValue(row, 'year'));
    setFormValue('revBE', cell(row, 'services')?.textContent.trim() || tds[2]?.textContent.trim() || getStoredFormValue(row, 'revBE', '0.00'));
    setFormValue('revRE', cell(row, 'department')?.textContent.trim() || tds[3]?.textContent.trim() || getStoredFormValue(row, 'revRE', '0.00'));
    setFormValue('revActuals', cell(row, 'status')?.textContent.trim() || tds[4]?.textContent.trim() || getStoredFormValue(row, 'revActuals', '0.00'));
    setFormValue('capBE', cell(row, 'rev22')?.textContent.trim() || tds[5]?.textContent.trim() || getStoredFormValue(row, 'capBE', '0.00'));
    setFormValue('capRE', cell(row, 'rev23')?.textContent.trim() || tds[6]?.textContent.trim() || getStoredFormValue(row, 'capRE', '0.00'));
    setFormValue('capActuals', tds[7]?.textContent.trim() || getStoredFormValue(row, 'capActuals', '0.00'));

    // Support new Appendix-IA and Appendix II fields
    if (document.getElementById('rev2526BE')) {
      setFormValue('rev2526BE', tds[1]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'rev2526BE', '0.00'));
      setFormValue('rev2526RE', tds[2]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'rev2526RE', '0.00'));
      setFormValue('cap2526BE', tds[3]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'cap2526BE', '0.00'));
      setFormValue('cap2526RE', tds[4]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'cap2526RE', '0.00'));
      setFormValue('rev2627BE', tds[5]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'rev2627BE', '0.00'));
      setFormValue('cap2627BE', tds[6]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'cap2627BE', '0.00'));
    }
    
    if (document.getElementById('q1_2425_qep')) {
      setFormValue('q1_2425_qep', tds[1]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'q1_2425_qep', '0.00'));
      setFormValue('q1_2425_act', tds[2]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'q1_2425_act', '0.00'));
      setFormValue('q2_2425_qep', tds[3]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'q2_2425_qep', '0.00'));
      setFormValue('q2_2425_act', tds[4]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'q2_2425_act', '0.00'));
      setFormValue('q1_2526_qep', tds[5]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'q1_2526_qep', '0.00'));
      setFormValue('q1_2526_act', tds[6]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'q1_2526_act', '0.00'));
      setFormValue('q2_2526_qep', tds[7]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'q2_2526_qep', '0.00'));
      setFormValue('q2_2526_act', tds[8]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'q2_2526_act', '0.00'));
    }

    if (document.getElementById('scheme_name')) {
      setFormValue('scheme_name', tds[1]?.textContent.trim() || getStoredFormValue(row, 'scheme_name', ''));
      setFormValue('sub_scheme_name', tds[2]?.textContent.trim() || getStoredFormValue(row, 'sub_scheme_name', ''));
      setFormValue('be_2025_26', tds[3]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'be_2025_26', '0.00'));
      setFormValue('cna_bal_01_04_2025', tds[4]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'cna_bal_01_04_2025', '0.00'));
      setFormValue('rel_curr_fy_30_09_2025', tds[5]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'rel_curr_fy_30_09_2025', '0.00'));
      setFormValue('cna_bal_30_09_2025', tds[6]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'cna_bal_30_09_2025', '0.00'));
      setFormValue('date_last_release', tds[7]?.textContent.trim() || getStoredFormValue(row, 'date_last_release', ''));
      setFormValue('amt_last_release', tds[8]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'amt_last_release', '0.00'));
    }

    if (document.getElementById('entity_name')) {
      setFormValue('financial_year', tds[1]?.textContent.trim() || getStoredFormValue(row, 'financial_year', ''));
      setFormValue('entity_name', tds[2]?.textContent.trim() || getStoredFormValue(row, 'entity_name', ''));
      setFormValue('be_2025_26', tds[3]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'be_2025_26', '0.00'));
      setFormValue('tsa_assignment', tds[4]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'tsa_assignment', '0.00'));
      setFormValue('actual_expenditure', tds[5]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'actual_expenditure', '0.00'));
      setFormValue('unspent_assignment', tds[6]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'unspent_assignment', '0.00'));
      setFormValue('date_last_assignment', tds[7]?.textContent.trim() || getStoredFormValue(row, 'date_last_assignment', ''));
      setFormValue('amount_last_assignment', tds[8]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'amount_last_assignment', '0.00'));
    }

    if (document.getElementById('appraisal_category')) {
      setFormValue('appraisal_category', tds[1]?.textContent.trim() || getStoredFormValue(row, 'appraisal_category', ''));
      setFormValue('appraisal_scheme_name', tds[2]?.textContent.trim() || getStoredFormValue(row, 'appraisal_scheme_name', ''));
      setFormValue('appraisal_status', tds[3]?.textContent.trim() || getStoredFormValue(row, 'appraisal_status', ''));
      setFormValue('appraisal_valid_upto', tds[4]?.textContent.trim() || getStoredFormValue(row, 'appraisal_valid_upto', ''));
      setFormValue('appraisal_remarks', tds[5]?.textContent.trim() || getStoredFormValue(row, 'appraisal_remarks', ''));
    }

    if (document.getElementById('v_item')) {
      setFormValue('v_item', cell(row, 'item')?.textContent.trim() || tds[0]?.textContent.trim() || getStoredFormValue(row, 'v_item'));
      setFormValue('v_act_2425', cell(row, 'actual_2024_2025')?.textContent.trim().replace(/,/g, '') || tds[1]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_act_2425', '0.00'));
      setFormValue('v_act_upto_924', cell(row, 'actuals_upto_09_2024')?.textContent.trim().replace(/,/g, '') || tds[2]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_act_upto_924', '0.00'));
      setFormValue('v_be_2526', cell(row, 'be_2025_2026')?.textContent.trim().replace(/,/g, '') || tds[3]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_be_2526', '0.00'));
      setFormValue('v_act_upto_925', cell(row, 'actuals_upto_09_2025')?.textContent.trim().replace(/,/g, '') || tds[4]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_act_upto_925', '0.00'));
      setFormValue('v_pct_be_2526', cell(row, 'pct_wrt_be_2025_2026')?.textContent.trim().replace(/,/g, '') || tds[5]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_pct_be_2526', '0.00'));
      setFormValue('v_re_2526_prop', cell(row, 're_2025_2026_prop')?.textContent.trim().replace(/,/g, '') || tds[6]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_re_2526_prop', '0.00'));
      setFormValue('v_be_2627_prop', cell(row, 'be_2026_2027_prop')?.textContent.trim().replace(/,/g, '') || tds[7]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_be_2627_prop', '0.00'));
    }

    const heading = drawer?.querySelector('h2');
    const subtitle = heading?.nextElementSibling;
    if (heading) heading.textContent = 'Edit Record';
    if (subtitle) subtitle.textContent = 'Update the selected budget and expenditure trend record';

    drawer.classList.remove('drawer-closed');
    drawer.classList.add('drawer-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-page-locked');
    backdrop?.classList.remove('backdrop-hide');
    backdrop?.classList.add('backdrop-show');

    setTimeout(() => document.getElementById('year')?.focus(), 320);
  }

  function resetDrawerMode() {
    editingRow = null;
    const heading = drawer?.querySelector('h2');
    const subtitle = heading?.nextElementSibling;
    if (heading) heading.textContent = 'Add Record';
    if (subtitle) subtitle.textContent = 'Enter a new budget and expenditure trend record';
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = readFormData();

    if (editingRow) {
      const row = editingRow;
      const tds = row.querySelectorAll('td');

      if (cell(row, 'charge')) cell(row, 'charge').textContent = data.year || '—';
      else if (tds[1] && data.year !== undefined) tds[1].textContent = data.year || '—';

      if (cell(row, 'services')) cell(row, 'services').textContent = Number(data.revBE || 0).toFixed(2);
      else if (tds[2] && data.revBE !== undefined) tds[2].textContent = Number(data.revBE || 0).toFixed(2);

      if (cell(row, 'department')) cell(row, 'department').textContent = Number(data.revRE || 0).toFixed(2);
      else if (tds[3] && data.revRE !== undefined) tds[3].textContent = Number(data.revRE || 0).toFixed(2);

      if (cell(row, 'status')) cell(row, 'status').textContent = Number(data.revActuals || 0).toFixed(2);
      else if (tds[4] && data.revActuals !== undefined) tds[4].textContent = Number(data.revActuals || 0).toFixed(2);

      if (cell(row, 'rev22')) cell(row, 'rev22').textContent = Number(data.capBE || 0).toFixed(2);
      else if (tds[5] && data.capBE !== undefined) tds[5].textContent = Number(data.capBE || 0).toFixed(2);

      if (cell(row, 'rev23')) cell(row, 'rev23').textContent = Number(data.capRE || 0).toFixed(2);
      else if (tds[6] && data.capRE !== undefined) tds[6].textContent = Number(data.capRE || 0).toFixed(2);

      if (tds[7] && data.capActuals !== undefined) tds[7].textContent = Number(data.capActuals || 0).toFixed(2);

      // Support new Appendix-IA fields
      if (data.rev2526BE !== undefined && !cell(row, 'charge')) {
        if (tds[1]) tds[1].textContent = Number(data.rev2526BE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[2]) tds[2].textContent = Number(data.rev2526RE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[3]) tds[3].textContent = Number(data.cap2526BE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[4]) tds[4].textContent = Number(data.cap2526RE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[5]) tds[5].textContent = Number(data.rev2627BE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[6]) tds[6].textContent = Number(data.cap2627BE || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      }

      if (data.q1_2425_qep !== undefined && !cell(row, 'charge')) {
        if (tds[1]) tds[1].textContent = Number(data.q1_2425_qep || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[2]) tds[2].textContent = Number(data.q1_2425_act || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[3]) tds[3].textContent = Number(data.q2_2425_qep || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[4]) tds[4].textContent = Number(data.q2_2425_act || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[5]) tds[5].textContent = Number(data.q1_2526_qep || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[6]) tds[6].textContent = Number(data.q1_2526_act || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[7]) tds[7].textContent = Number(data.q2_2526_qep || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (tds[8]) tds[8].textContent = Number(data.q2_2526_act || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      }

      if (data.scheme_name !== undefined && document.getElementById('scheme_name')) {
        if (tds[1]) tds[1].textContent = data.scheme_name || '—';
        if (tds[2]) tds[2].textContent = data.sub_scheme_name || '—';
        if (tds[3]) tds[3].textContent = Number(data.be_2025_26 || 0).toFixed(2);
        if (tds[4]) tds[4].textContent = Number(data.cna_bal_01_04_2025 || 0).toFixed(2);
        if (tds[5]) tds[5].textContent = Number(data.rel_curr_fy_30_09_2025 || 0).toFixed(2);
        if (tds[6]) tds[6].textContent = Number(data.cna_bal_30_09_2025 || 0).toFixed(2);
        if (tds[7]) tds[7].textContent = data.date_last_release || '—';
        if (tds[8]) tds[8].textContent = Number(data.amt_last_release || 0).toFixed(2);
      }

      if (data.entity_name !== undefined && document.getElementById('entity_name')) {
        if (tds[1]) tds[1].textContent = data.financial_year || '—';
        if (tds[2]) tds[2].textContent = data.entity_name || '—';
        if (tds[3]) tds[3].textContent = Number(data.be_2025_26 || 0).toFixed(2);
        if (tds[4]) tds[4].textContent = Number(data.tsa_assignment || 0).toFixed(2);
        if (tds[5]) tds[5].textContent = Number(data.actual_expenditure || 0).toFixed(2);
        if (tds[6]) tds[6].textContent = Number(data.unspent_assignment || 0).toFixed(2);
        if (tds[7]) tds[7].textContent = data.date_last_assignment || '—';
        if (tds[8]) tds[8].textContent = Number(data.amount_last_assignment || 0).toFixed(2);
      }

      if (data.appraisal_category !== undefined && document.getElementById('appraisal_category')) {
        if (tds[1]) tds[1].textContent = data.appraisal_category || '—';
        if (tds[2]) tds[2].textContent = data.appraisal_scheme_name || '—';
        if (tds[3]) tds[3].textContent = data.appraisal_status || '—';
        if (tds[4]) tds[4].textContent = data.appraisal_valid_upto || '—';
        if (tds[5]) tds[5].textContent = data.appraisal_remarks || '—';
      }

      if (data.v_item !== undefined && document.getElementById('v_item')) {
        const itemEl = cell(row, 'item') || tds[0];
        if (itemEl) itemEl.textContent = data.v_item || '—';
        const setCell = (col, fallbackIdx, val) => {
          const el = cell(row, col) || tds[fallbackIdx];
          if (el) el.textContent = val;
        };
        setCell('actual_2024_2025', 1, Number(data.v_act_2425 || 0).toFixed(2));
        setCell('actuals_upto_09_2024', 2, Number(data.v_act_upto_924 || 0).toFixed(2));
        setCell('be_2025_2026', 3, Number(data.v_be_2526 || 0).toFixed(2));
        setCell('actuals_upto_09_2025', 4, Number(data.v_act_upto_925 || 0).toFixed(2));
        setCell('pct_wrt_be_2025_2026', 5, Number(data.v_pct_be_2526 || 0).toFixed(2));
        setCell('re_2025_2026_prop', 6, Number(data.v_re_2526_prop || 0).toFixed(2));
        setCell('be_2026_2027_prop', 7, Number(data.v_be_2627_prop || 0).toFixed(2));
      }

      storeFormData(row, data);
      row.querySelectorAll('td').forEach((el) => el.classList.add('row-saved'));
      setTimeout(() => row.querySelectorAll('td').forEach((el) => el.classList.remove('row-saved')), 900);

      closeDrawer();
      editingRow = null;
      form.reset();
      resetDrawerMode();
      return;
    }

    const id = nextId();
    const row = createRow(
      id,
      data.year,
      data.revBE,
      data.revRE,
      data.revActuals,
      data.capBE,
      data.capRE,
      data.capActuals,
      data
    );

    storeFormData(row, data);
    tbody.prepend(row);
    renumberRows();
    closeDrawer();
    form.reset();
    resetDrawerMode();
    window.lucide?.createIcons();
  });

  tbody?.addEventListener('click', (event) => {
    const row = event.target.closest('[data-record-row]');
    if (!row) return;

    const menuButton = event.target.closest('[data-row-menu]');
    if (menuButton) {
      const menu = row.querySelector('[data-row-actions]');
      document.querySelectorAll('[data-row-actions]').forEach(item => {
        if (item !== menu) item.classList.add('hidden');
      });
      menu?.classList.toggle('hidden');
      menuButton.setAttribute('aria-expanded', String(menu && !menu.classList.contains('hidden')));
      return;
    }

    if (event.target.closest('[data-row-edit]')) {
      row.querySelector('[data-row-actions]')?.classList.add('hidden');
      row.querySelector('[data-row-menu]')?.setAttribute('aria-expanded', 'false');
      openEditDrawer(row);
      return;
    }

    if (event.target.closest('[data-row-delete]')) {
      row.remove();
      renumberRows();
      return;
    }

    if (event.target.closest('[data-row-save]')) {
      row.querySelectorAll('[contenteditable="false"]').forEach(el => {
        el.classList.add('row-saved');
        setTimeout(() => el.classList.remove('row-saved'), 900);
      });
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-row-menu]') || event.target.closest('[data-row-actions]')) return;
    document.querySelectorAll('[data-row-actions]').forEach(menu => menu.classList.add('hidden'));
    document.querySelectorAll('[data-row-menu]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  });

  tbody?.addEventListener('change', (event) => {
    const select = event.target.closest('.row-status');
    if (!select) return;
    const styles = {
      Active: ['bg-emerald-50','text-emerald-700'],
      Draft: ['bg-slate-100','text-slate-600'],
      Review: ['bg-amber-50','text-amber-700'],
      Frozen: ['bg-slate-800','text-white']
    };
    select.className = 'row-status rounded-full border-0 px-2.5 py-1 text-[10px] font-bold';
    (styles[select.value] || styles.Draft).forEach(c => select.classList.add(c));
  });

  function applyFilters() {
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const status = document.getElementById('statusFilter')?.value || 'All';
    const category = document.getElementById('categoryFilter')?.value || 'All';
    tbody?.querySelectorAll('[data-record-row]').forEach(row => {
      const haystack = row.textContent.toLowerCase();
      const rowStatus = row.querySelector('.row-status')?.value || '';
      const rowCategory = row.dataset.category || '';
      const matchSearch = !search || haystack.includes(search);
      const matchStatus = status === 'All' || rowStatus === status;
      const matchCategory = category === 'All' || rowCategory === 'All' || rowCategory === category || haystack.includes(category.toLowerCase());
      row.hidden = !(matchSearch && matchStatus && matchCategory);
    });
  }

  document.getElementById('searchInput')?.addEventListener('input', applyFilters);
  document.querySelectorAll('[data-sort]').forEach(button => {
    button.addEventListener('click', () => window.sortBy(button.dataset.sort));
  });
  document.querySelector('[data-refresh-grid]')?.addEventListener('click', applyFilters);
  window.toggleMobileNav = () => {
    document.getElementById('sidebar')?.classList.toggle('mobile-open');
    document.getElementById('mobileOverlay')?.classList.toggle('hidden');
  };

  document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
  document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
  document.getElementById('yearFilter')?.addEventListener('change', applyFilters);

  window.clearFilters = () => {
    ['searchInput'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['statusFilter','yearFilter','categoryFilter'].forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
    applyFilters();
  };

  // Column chooser stays page-level and only toggles CSS visibility.
  document.querySelectorAll('[data-column-toggle]').forEach(box => {
    box.addEventListener('change', () => {
      const column = box.dataset.columnToggle;
      document.querySelectorAll(`[data-column="${column}"]`).forEach(cell => cell.classList.toggle('column-hidden', !box.checked));
    });
  });
  document.getElementById('columnsButton')?.addEventListener('click', (event) => {
    event.stopPropagation();
    const menu = document.getElementById('columnsMenu');
    menu?.classList.toggle('hidden');
  });
  document.addEventListener('click', event => {
    const menu = document.getElementById('columnsMenu');
    if (menu && !event.target.closest('#columnsButton') && !event.target.closest('#columnsMenu')) menu.classList.add('hidden');
  });

  window.toggleColumnsMenu = () => document.getElementById('columnsMenu')?.classList.toggle('hidden');
  window.toggleColumn = (column, show) => {
    document.querySelectorAll(`[data-column="${column}"]`).forEach(cell => cell.classList.toggle('column-hidden', !show));
  };
  window.resetColumns = () => document.querySelectorAll('[data-column-toggle]').forEach(box => {
    box.checked = true;
    window.toggleColumn(box.dataset.columnToggle, true);
  });

  window.renderGrid = applyFilters;
  window.changePage = () => {};
  window.changePageSize = () => {};
  window.sortBy = (field) => {
    const rows = [...(tbody?.querySelectorAll('[data-record-row]') || [])];
    const get = row => value(row, field);
    rows.sort((a,b) => {
      const av=get(a), bv=get(b);
      const an=Number(av), bn=Number(bv);
      return Number.isNaN(an) || Number.isNaN(bn) ? av.localeCompare(bv) : an-bn;
    });
    rows.forEach(row => tbody.appendChild(row));
    renumberRows();
  };
  window.saveDraft = () => form?.reset();

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer?.classList.contains('drawer-open')) closeDrawer();
  });

  renumberRows();
  window.lucide?.createIcons();
});
