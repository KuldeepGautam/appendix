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
    return row.querySelector(`[data-field="${field}"]`);
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
      row.querySelector('td:first-child').textContent = index + 1;
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
    tbody?.querySelectorAll('[data-record-row]').forEach(row => {
      const haystack = row.textContent.toLowerCase();
      const rowStatus = row.querySelector('.row-status')?.value || '';
      row.hidden = Boolean((search && !haystack.includes(search)) || (status !== 'All' && rowStatus !== status));
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
  document.getElementById('yearFilter')?.addEventListener('change', applyFilters);

  window.clearFilters = () => {
    ['searchInput'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['statusFilter','yearFilter'].forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
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
