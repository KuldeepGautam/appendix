/* UBIS page-level interaction layer
 * The drawer form and table rows are static HTML.
 * JavaScript only wires DOM events; no record dataset/state is used.
 */
tailwind.config = {
  theme: {
    extend: {
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
    }
  }
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
    updateAppendixIITotals();
    drawer.classList.remove('drawer-closed');
    drawer.classList.add('drawer-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-page-locked');
    backdrop?.classList.remove('backdrop-hide');
    backdrop?.classList.add('backdrop-show');
    setTimeout(() => {
      const focusTarget = document.getElementById('q1_2425_qep') || document.getElementById('year');
      focusTarget?.focus();
    }, 320);
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

  function updateAppendixIITotals() {
    if (!document.getElementById('tot_2425_qep')) return;
    const q1_2425_qep = parseFloat(document.getElementById('q1_2425_qep')?.value) || 0;
    const q2_2425_qep = parseFloat(document.getElementById('q2_2425_qep')?.value) || 0;
    const tot_2425_qep = document.getElementById('tot_2425_qep');
    if (tot_2425_qep) tot_2425_qep.value = (q1_2425_qep + q2_2425_qep).toFixed(2);

    const q1_2425_act = parseFloat(document.getElementById('q1_2425_act')?.value) || 0;
    const q2_2425_act = parseFloat(document.getElementById('q2_2425_act')?.value) || 0;
    const tot_2425_act = document.getElementById('tot_2425_act');
    if (tot_2425_act) tot_2425_act.value = (q1_2425_act + q2_2425_act).toFixed(2);

    const q1_2526_qep = parseFloat(document.getElementById('q1_2526_qep')?.value) || 0;
    const q2_2526_qep = parseFloat(document.getElementById('q2_2526_qep')?.value) || 0;
    const tot_2526_qep = document.getElementById('tot_2526_qep');
    if (tot_2526_qep) tot_2526_qep.value = (q1_2526_qep + q2_2526_qep).toFixed(2);

    const q1_2526_act = parseFloat(document.getElementById('q1_2526_act')?.value) || 0;
    const q2_2526_act = parseFloat(document.getElementById('q2_2526_act')?.value) || 0;
    const tot_2526_act = document.getElementById('tot_2526_act');
    if (tot_2526_act) tot_2526_act.value = (q1_2526_act + q2_2526_act).toFixed(2);
  }

  ['q1_2425_qep', 'q2_2425_qep', 'q1_2425_act', 'q2_2425_act', 'q1_2526_qep', 'q2_2526_qep', 'q1_2526_act', 'q2_2526_act'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateAppendixIITotals);
  });
  form?.addEventListener('reset', () => setTimeout(updateAppendixIITotals, 20));

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
    row.className = 'data-grid__row';
    row.dataset.recordRow = '';
    row.dataset.recordId = id;

    const actionCellHtml = `
        <td data-label="Action" class="grid-action-cell">
          <div class="grid-action-menu">
            <button type="button" data-row-menu class="grid-more-button icon-button row-more-button"
              title="More actions" aria-label="More actions" aria-expanded="false">
              <i data-lucide="ellipsis-vertical" class="h-4 w-4"></i>
            </button>
            <div data-row-actions class="grid-row-actions row-action-menu is-hidden">
              <button type="button" data-row-edit class="menu-action" title="Edit row"><i data-lucide="pencil"
                  class="h-3.5 w-3.5"></i>Edit</button>
              <button type="button" data-row-save class="menu-action menu-action--primary" title="Save row"><i
                  data-lucide="check" class="h-3.5 w-3.5"></i>Save</button>
              <button type="button" data-row-delete class="menu-action menu-action--danger"
                title="Delete row"><i data-lucide="trash-2" class="h-3.5 w-3.5"></i>Delete</button>
            </div>
          </div>
        </td>`;

    if (data && data.v_item !== undefined) {
      const isTotal = /total/i.test(data.v_item);
      row.innerHTML = `
        <td ${isTotal ? '' : 'data-label="S.No."'} data-column="sno" class="grid-cell grid-cell--center grid-cell--strong">${isTotal ? '' : (data.v_sno || '')}</td>
        <td data-label="Item" data-column="item" data-field="item" class="editable-cell grid-cell grid-cell--strong">${escapeHtml(data.v_item || '')}</td>
        <td data-label="Actual 2024-2025" data-column="actual_2024_2025" data-field="actual_2024_2025" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.v_act_2425 || 0).toFixed(2)}</td>
        <td data-label="Actuals upto 9/2024" data-column="actuals_upto_09_2024" data-field="actuals_upto_09_2024" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.v_act_upto_924 || 0).toFixed(2)}</td>
        <td data-label="B.E. 2025-2026" data-column="be_2025_2026" data-field="be_2025_2026" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.v_be_2526 || 0).toFixed(2)}</td>
        <td data-label="Actuals upto 9/2025" data-column="actuals_upto_09_2025" data-field="actuals_upto_09_2025" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.v_act_upto_925 || 0).toFixed(2)}</td>
        <td data-label="% w.r.t. B.E. 2025-2026" data-column="pct_wrt_be_2025_2026" data-field="pct_wrt_be_2025_2026" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.v_pct_be_2526 || 0).toFixed(2)}</td>
        <td data-label="R.E. 2025-2026 prop. by Min/Dep" data-column="re_2025_2026_prop" data-field="re_2025_2026_prop" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.v_re_2526_prop || 0).toFixed(2)}</td>
        <td data-label="B.E. 2026-2027 prop. by Min/Dep" data-column="be_2026_2027_prop" data-field="be_2026_2027_prop" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.v_be_2627_prop || 0).toFixed(2)}</td>
        ${actionCellHtml}`;
      return row;
    }

    if (data && data.va_autonomous_body !== undefined) {
      row.innerHTML = `
        <td data-label="Autonomous Body" data-column="autonomous_body" data-field="autonomous_body" class="editable-cell grid-cell grid-cell--strong">${escapeHtml(data.va_autonomous_body || '')}</td>
        <td data-label="GiA General (A) B.E. 2026-2027" data-column="gia_general" data-field="gia_general" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.va_gia_general || 0).toFixed(2)}</td>
        <td data-label="GiA for Creation of Capital Assets (B) B.E. 2026-2027" data-column="gia_capital" data-field="gia_capital" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.va_gia_capital || 0).toFixed(2)}</td>
        <td data-label="GiA for Salary (C) B.E. 2026-2027" data-column="gia_salary" data-field="gia_salary" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.va_gia_salary || 0).toFixed(2)}</td>
        ${actionCellHtml}`;
      return row;
    }

    if (data && data.vb_object_head !== undefined) {
      row.innerHTML = `
        <td data-label="OBJECT HEAD" data-column="object_head" data-field="object_head" class="editable-cell grid-cell grid-cell--strong">${escapeHtml(data.vb_object_head || '')}</td>
        <td data-label="ACTUAL 2024-2025" data-column="actual_2024_2025" data-field="actual_2024_2025" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vb_act_2425 || 0).toFixed(2)}</td>
        <td data-label="ACTUALS UPTO 9/2024" data-column="actuals_upto_09_2024" data-field="actuals_upto_09_2024" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vb_act_upto_924 || 0).toFixed(2)}</td>
        <td data-label="B.E. 2025-2026" data-column="be_2025_2026" data-field="be_2025_2026" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vb_be_2526 || 0).toFixed(2)}</td>
        <td data-label="ACTUALS UPTO 9/2025" data-column="actuals_upto_09_2025" data-field="actuals_upto_09_2025" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vb_act_upto_925 || 0).toFixed(2)}</td>
        <td data-label="PROPOSED R.E. 2025-2026" data-column="proposed_re_2025_2026" data-field="proposed_re_2025_2026" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vb_re_2526_prop || 0).toFixed(2)}</td>
        <td data-label="PROPOSED B.E. 2026-2027" data-column="proposed_be_2026_2027" data-field="proposed_be_2026_2027" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vb_be_2627_prop || 0).toFixed(2)}</td>
        <td data-label="REMARKS" data-column="remarks" data-field="remarks" class="editable-cell grid-cell grid-cell--body">${escapeHtml(data.vb_remarks || '')}</td>
        ${actionCellHtml}`;
      return row;
    }

    if (data && data.vc_name !== undefined) {
      row.innerHTML = `
        <td data-label="NAME" data-column="name" data-field="name" class="editable-cell grid-cell grid-cell--strong">${escapeHtml(data.vc_name || '')}</td>
        <td data-label="ACTUAL 2024-2025" data-column="actual_2024_2025" data-field="actual_2024_2025" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vc_act_2425 || 0).toFixed(2)}</td>
        <td data-label="ACTUALS UPTO 9/2024" data-column="actuals_upto_09_2024" data-field="actuals_upto_09_2024" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vc_act_upto_924 || 0).toFixed(2)}</td>
        <td data-label="B.E. 2025-2026" data-column="be_2025_2026" data-field="be_2025_2026" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vc_be_2526 || 0).toFixed(2)}</td>
        <td data-label="ACTUALS UPTO 9/2025" data-column="actuals_upto_09_2025" data-field="actuals_upto_09_2025" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vc_act_upto_925 || 0).toFixed(2)}</td>
        <td data-label="PROPOSED R.E. 2025-2026" data-column="proposed_re_2025_2026" data-field="proposed_re_2025_2026" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vc_re_2526_prop || 0).toFixed(2)}</td>
        <td data-label="PROPOSED B.E. 2026-2027" data-column="proposed_be_2026_2027" data-field="proposed_be_2026_2027" class="editable-cell grid-cell grid-cell--right tabular">${Number(data.vc_be_2627_prop || 0).toFixed(2)}</td>
        <td data-label="REMARKS" data-column="remarks" data-field="remarks" class="editable-cell grid-cell grid-cell--body">${escapeHtml(data.vc_remarks || '')}</td>
        ${actionCellHtml}`;
      return row;
    }

    if (data && (data.q1_2425_qep !== undefined || data.rev2526BE !== undefined)) {
      if (data.q1_2425_qep !== undefined) {
        row.innerHTML = `
          <td data-label="S.No." class="grid-cell grid-cell--center grid-cell--strong"></td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.q1_2425_qep || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.q1_2425_act || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.q2_2425_qep || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.q2_2425_act || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.q1_2526_qep || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.q1_2526_act || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.q2_2526_qep || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.q2_2526_act || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          ${actionCellHtml}`;
      } else {
        row.innerHTML = `
          <td data-label="S.No." class="grid-cell grid-cell--center grid-cell--strong"></td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.rev2526BE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.rev2526RE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.cap2526BE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.cap2526RE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.rev2627BE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="editable-cell grid-cell grid-cell--center tabular">${Number(data.cap2627BE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          ${actionCellHtml}`;
      }
    } else {
      row.innerHTML = `
        <td data-label="S.No." class="grid-cell grid-cell--center grid-cell--strong"></td>
        <td data-label="Year" data-column="charge" data-field="charge" contenteditable="false" spellcheck="false" class="editable-cell grid-cell grid-cell--strong">${escapeHtml(year || '')}</td>
        <td data-label="Revenue BE" data-column="services" data-field="services" contenteditable="false" spellcheck="false" class="editable-cell grid-cell grid-cell--right tabular">${Number(revBE || 0).toFixed(2)}</td>
        <td data-label="Revenue RE" data-column="department" data-field="department" contenteditable="false" spellcheck="false" class="editable-cell grid-cell grid-cell--right tabular">${Number(revRE || 0).toFixed(2)}</td>
        <td data-label="Actuals upto Sept" data-column="status" data-field="status" class="editable-cell grid-cell grid-cell--right tabular">${Number(revActuals || 0).toFixed(2)}</td>
        <td data-label="Capital BE" data-column="rev22" data-field="rev22" contenteditable="false" spellcheck="false" class="editable-cell grid-cell grid-cell--right tabular">${Number(capBE || 0).toFixed(2)}</td>
        <td data-label="Capital RE 2022–23" data-column="rev23" data-field="rev23" contenteditable="false" spellcheck="false" class="editable-cell grid-cell grid-cell--right tabular">${Number(capRE || 0).toFixed(2)}</td>
        <td data-label="Capital Actuals 2023–24" data-column="rev23" data-field="rev23" contenteditable="false" spellcheck="false" class="editable-cell grid-cell grid-cell--right tabular">${Number(capActuals || 0).toFixed(2)}</td>
        ${actionCellHtml}`;
    }
    return row;
  }

  function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function renumberRows() {
    if (document.getElementById('v_item')) {
      const count = tbody?.querySelectorAll('[data-record-row]').length || 0;
      document.getElementById('totalText')?.replaceChildren(document.createTextNode(count));
      document.getElementById('recordCountBadge')?.replaceChildren(document.createTextNode(`${count} Records`));
      document.getElementById('rangeText')?.replaceChildren(document.createTextNode(count ? `1–${count}` : '0'));
      return;
    }
    let counter = 1;
    tbody?.querySelectorAll('[data-record-row]').forEach((row) => {
      const itemCell = cell(row, 'item');
      const isTotal = itemCell && /total/i.test(itemCell.textContent.trim());
      const sno = row.querySelector('td[data-label="S.No."]');
      if (sno && !isTotal) {
        sno.textContent = counter++;
      }
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
      setFormValue('q1_2425_dev', getStoredFormValue(row, 'q1_2425_dev', ''));
      setFormValue('q2_2425_dev', getStoredFormValue(row, 'q2_2425_dev', ''));
      setFormValue('q1_2526_dev', getStoredFormValue(row, 'q1_2526_dev', ''));
      setFormValue('q2_2526_dev', getStoredFormValue(row, 'q2_2526_dev', ''));
      updateAppendixIITotals();
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
      setFormValue('v_item', cell(row, 'item')?.textContent.trim() || tds[1]?.textContent.trim() || tds[0]?.textContent.trim() || getStoredFormValue(row, 'v_item'));
      setFormValue('v_act_2425', cell(row, 'actual_2024_2025')?.textContent.trim().replace(/,/g, '') || tds[2]?.textContent.trim().replace(/,/g, '') || tds[1]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_act_2425', '0.00'));
      setFormValue('v_act_upto_924', cell(row, 'actuals_upto_09_2024')?.textContent.trim().replace(/,/g, '') || tds[3]?.textContent.trim().replace(/,/g, '') || tds[2]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_act_upto_924', '0.00'));
      setFormValue('v_be_2526', cell(row, 'be_2025_2026')?.textContent.trim().replace(/,/g, '') || tds[4]?.textContent.trim().replace(/,/g, '') || tds[3]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_be_2526', '0.00'));
      setFormValue('v_act_upto_925', cell(row, 'actuals_upto_09_2025')?.textContent.trim().replace(/,/g, '') || tds[5]?.textContent.trim().replace(/,/g, '') || tds[4]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_act_upto_925', '0.00'));
      setFormValue('v_pct_be_2526', cell(row, 'pct_wrt_be_2025_2026')?.textContent.trim().replace(/,/g, '') || tds[6]?.textContent.trim().replace(/,/g, '') || tds[5]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'v_pct_be_2526', '0.00'));
      setFormValue('v_re_2526_prop', cell(row, 're_2025_2026_prop')?.textContent.trim() || tds[7]?.textContent.trim() || tds[6]?.textContent.trim() || getStoredFormValue(row, 'v_re_2526_prop', '0.00'));
      setFormValue('v_be_2627_prop', cell(row, 'be_2026_2027_prop')?.textContent.trim() || tds[8]?.textContent.trim() || tds[7]?.textContent.trim() || getStoredFormValue(row, 'v_be_2627_prop', '0.00'));
    }

    if (document.getElementById('va_autonomous_body')) {
      setFormValue('va_autonomous_body', cell(row, 'autonomous_body')?.textContent.trim() || tds[0]?.textContent.trim() || getStoredFormValue(row, 'va_autonomous_body'));
      setFormValue('va_gia_general', cell(row, 'gia_general')?.textContent.trim().replace(/,/g, '') || tds[1]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'va_gia_general', '0.00'));
      setFormValue('va_gia_capital', cell(row, 'gia_capital')?.textContent.trim().replace(/,/g, '') || tds[2]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'va_gia_capital', '0.00'));
      setFormValue('va_gia_salary', cell(row, 'gia_salary')?.textContent.trim().replace(/,/g, '') || tds[3]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'va_gia_salary', '0.00'));
      // GiA General Breakdown
      setFormValue('va_gen_actual_2024_2025', getStoredFormValue(row, 'va_gen_actual_2024_2025', ''));
      setFormValue('va_gen_actuals_upto_09_2024', getStoredFormValue(row, 'va_gen_actuals_upto_09_2024', ''));
      setFormValue('va_gen_be_2025_2026', getStoredFormValue(row, 'va_gen_be_2025_2026', ''));
      setFormValue('va_gen_actuals_upto_09_2025', getStoredFormValue(row, 'va_gen_actuals_upto_09_2025', ''));
      setFormValue('va_gen_re_2025_2026', getStoredFormValue(row, 'va_gen_re_2025_2026', ''));
      // GiA Capital Breakdown
      setFormValue('va_cap_actual_2024_2025', getStoredFormValue(row, 'va_cap_actual_2024_2025', ''));
      setFormValue('va_cap_actuals_upto_09_2024', getStoredFormValue(row, 'va_cap_actuals_upto_09_2024', ''));
      setFormValue('va_cap_be_2025_2026', getStoredFormValue(row, 'va_cap_be_2025_2026', ''));
      setFormValue('va_cap_actuals_upto_09_2025', getStoredFormValue(row, 'va_cap_actuals_upto_09_2025', ''));
      setFormValue('va_cap_re_2025_2026', getStoredFormValue(row, 'va_cap_re_2025_2026', ''));
      // GiA Salary Breakdown
      setFormValue('va_sal_actual_2024_2025', getStoredFormValue(row, 'va_sal_actual_2024_2025', ''));
      setFormValue('va_sal_actuals_upto_09_2024', getStoredFormValue(row, 'va_sal_actuals_upto_09_2024', ''));
      setFormValue('va_sal_be_2025_2026', getStoredFormValue(row, 'va_sal_be_2025_2026', ''));
      setFormValue('va_sal_actuals_upto_09_2025', getStoredFormValue(row, 'va_sal_actuals_upto_09_2025', ''));
      setFormValue('va_sal_re_2025_2026', getStoredFormValue(row, 'va_sal_re_2025_2026', ''));
      setFormValue('va_sal_total_salary_accounts', getStoredFormValue(row, 'va_sal_total_salary_accounts', ''));
    }

    if (document.getElementById('vb_object_head')) {
      setFormValue('vb_object_head', cell(row, 'object_head')?.textContent.trim() || tds[0]?.textContent.trim() || getStoredFormValue(row, 'vb_object_head'));
      setFormValue('vb_act_2425', cell(row, 'actual_2024_2025')?.textContent.trim().replace(/,/g, '') || tds[1]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'vb_act_2425', '0.00'));
      setFormValue('vb_act_upto_924', cell(row, 'actuals_upto_09_2024')?.textContent.trim().replace(/,/g, '') || tds[2]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'vb_act_upto_924', '0.00'));
      setFormValue('vb_be_2526', cell(row, 'be_2025_2026')?.textContent.trim().replace(/,/g, '') || tds[3]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'vb_be_2526', '0.00'));
      setFormValue('vb_act_upto_925', cell(row, 'actuals_upto_09_2025')?.textContent.trim().replace(/,/g, '') || tds[4]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'vb_act_upto_925', '0.00'));
      setFormValue('vb_re_2526_prop', cell(row, 'proposed_re_2025_2026')?.textContent.trim().replace(/,/g, '') || tds[5]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'vb_re_2526_prop', '0.00'));
      setFormValue('vb_be_2627_prop', cell(row, 'proposed_be_2026_2027')?.textContent.trim().replace(/,/g, '') || tds[6]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'vb_be_2627_prop', '0.00'));
      setFormValue('vb_remarks', cell(row, 'remarks')?.textContent.trim() || tds[7]?.textContent.trim() || getStoredFormValue(row, 'vb_remarks', ''));
    }

    if (document.getElementById('vc_name')) {
      setFormValue('vc_name', cell(row, 'name')?.textContent.trim() || tds[0]?.textContent.trim() || getStoredFormValue(row, 'vc_name'));
      setFormValue('vc_act_2425', cell(row, 'actual_2024_2025')?.textContent.trim().replace(/,/g, '') || tds[1]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'vc_act_2425', '0.00'));
      setFormValue('vc_act_upto_924', cell(row, 'actuals_upto_09_2024')?.textContent.trim().replace(/,/g, '') || tds[2]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'vc_act_upto_924', '0.00'));
      setFormValue('vc_be_2526', cell(row, 'be_2025_2026')?.textContent.trim().replace(/,/g, '') || tds[3]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'vc_be_2526', '0.00'));
      setFormValue('vc_act_upto_925', cell(row, 'actuals_upto_09_2025')?.textContent.trim().replace(/,/g, '') || tds[4]?.textContent.trim().replace(/,/g, '') || getStoredFormValue(row, 'vc_act_upto_925', '0.00'));
      setFormValue('vc_re_2526_prop', cell(row, 'proposed_re_2025_2026')?.textContent.trim() || tds[5]?.textContent.trim() || getStoredFormValue(row, 'vc_re_2526_prop', '0.00'));
      setFormValue('vc_be_2627_prop', cell(row, 'proposed_be_2026_2027')?.textContent.trim() || tds[6]?.textContent.trim() || getStoredFormValue(row, 'vc_be_2627_prop', '0.00'));
      setFormValue('vc_remarks', cell(row, 'remarks')?.textContent.trim() || tds[7]?.textContent.trim() || getStoredFormValue(row, 'vc_remarks', ''));
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
        if (tds[1]) tds[1].textContent = Number(data.rev2526BE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[2]) tds[2].textContent = Number(data.rev2526RE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[3]) tds[3].textContent = Number(data.cap2526BE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[4]) tds[4].textContent = Number(data.cap2526RE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[5]) tds[5].textContent = Number(data.rev2627BE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[6]) tds[6].textContent = Number(data.cap2627BE || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      if (data.q1_2425_qep !== undefined && !cell(row, 'charge')) {
        if (tds[1]) tds[1].textContent = Number(data.q1_2425_qep || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[2]) tds[2].textContent = Number(data.q1_2425_act || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[3]) tds[3].textContent = Number(data.q2_2425_qep || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[4]) tds[4].textContent = Number(data.q2_2425_act || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[5]) tds[5].textContent = Number(data.q1_2526_qep || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[6]) tds[6].textContent = Number(data.q1_2526_act || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[7]) tds[7].textContent = Number(data.q2_2526_qep || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (tds[8]) tds[8].textContent = Number(data.q2_2526_act || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        const itemEl = cell(row, 'item') || tds[1] || tds[0];
        if (itemEl) itemEl.textContent = data.v_item || '—';
        const setCell = (col, fallbackIdx, val) => {
          const el = cell(row, col) || tds[fallbackIdx];
          if (el) el.textContent = val;
        };
        setCell('actual_2024_2025', 2, Number(data.v_act_2425 || 0).toFixed(2));
        setCell('actuals_upto_09_2024', 3, Number(data.v_act_upto_924 || 0).toFixed(2));
        setCell('be_2025_2026', 4, Number(data.v_be_2526 || 0).toFixed(2));
        setCell('actuals_upto_09_2025', 5, Number(data.v_act_upto_925 || 0).toFixed(2));
        setCell('pct_wrt_be_2025_2026', 6, Number(data.v_pct_be_2526 || 0).toFixed(2));
        setCell('re_2025_2026_prop', 7, Number(data.v_re_2526_prop || 0).toFixed(2));
        setCell('be_2026_2027_prop', 8, Number(data.v_be_2627_prop || 0).toFixed(2));
      }

      if (data.va_autonomous_body !== undefined && document.getElementById('va_autonomous_body')) {
        const bodyEl = cell(row, 'autonomous_body') || tds[0];
        if (bodyEl) bodyEl.textContent = data.va_autonomous_body || '—';
        const setCell = (col, fallbackIdx, val) => {
          const el = cell(row, col) || tds[fallbackIdx];
          if (el) el.textContent = val;
        };
        setCell('gia_general', 1, Number(data.va_gia_general || 0).toFixed(2));
        setCell('gia_capital', 2, Number(data.va_gia_capital || 0).toFixed(2));
        setCell('gia_salary', 3, Number(data.va_gia_salary || 0).toFixed(2));
      }

      if (data.vb_object_head !== undefined && document.getElementById('vb_object_head')) {
        const objEl = cell(row, 'object_head') || tds[0];
        if (objEl) objEl.textContent = data.vb_object_head || '—';
        const setCell = (col, fallbackIdx, val) => {
          const el = cell(row, col) || tds[fallbackIdx];
          if (el) el.textContent = val;
        };
        setCell('actual_2024_2025', 1, Number(data.vb_act_2425 || 0).toFixed(2));
        setCell('actuals_upto_09_2024', 2, Number(data.vb_act_upto_924 || 0).toFixed(2));
        setCell('be_2025_2026', 3, Number(data.vb_be_2526 || 0).toFixed(2));
        setCell('actuals_upto_09_2025', 4, Number(data.vb_act_upto_925 || 0).toFixed(2));
        setCell('proposed_re_2025_2026', 5, Number(data.vb_re_2526_prop || 0).toFixed(2));
        setCell('proposed_be_2026_2027', 6, Number(data.vb_be_2627_prop || 0).toFixed(2));
        setCell('remarks', 7, data.vb_remarks || '');
      }

      if (data.vc_name !== undefined && document.getElementById('vc_name')) {
        const nameEl = cell(row, 'name') || tds[0];
        if (nameEl) nameEl.textContent = data.vc_name || '—';
        const setCell = (col, fallbackIdx, val) => {
          const el = cell(row, col) || tds[fallbackIdx];
          if (el) el.textContent = val;
        };
        setCell('actual_2024_2025', 1, Number(data.vc_act_2425 || 0).toFixed(2));
        setCell('actuals_upto_09_2024', 2, Number(data.vc_act_upto_924 || 0).toFixed(2));
        setCell('be_2025_2026', 3, Number(data.vc_be_2526 || 0).toFixed(2));
        setCell('actuals_upto_09_2025', 4, Number(data.vc_act_upto_925 || 0).toFixed(2));
        setCell('proposed_re_2025_2026', 5, Number(data.vc_re_2526_prop || 0).toFixed(2));
        setCell('proposed_be_2026_2027', 6, Number(data.vc_be_2627_prop || 0).toFixed(2));
        setCell('remarks', 7, data.vc_remarks || '');
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
        if (item !== menu) {
          item.classList.add('hidden');
          item.classList.add('is-hidden');
        }
      });
      const isHidden = menu?.classList.contains('hidden') || menu?.classList.contains('is-hidden');
      if (isHidden) {
        menu?.classList.remove('hidden');
        menu?.classList.remove('is-hidden');
        menuButton.setAttribute('aria-expanded', 'true');
      } else {
        menu?.classList.add('hidden');
        menu?.classList.add('is-hidden');
        menuButton.setAttribute('aria-expanded', 'false');
      }
      return;
    }

    if (event.target.closest('[data-row-edit]')) {
      const menu = row.querySelector('[data-row-actions]');
      menu?.classList.add('hidden');
      menu?.classList.add('is-hidden');
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
    document.querySelectorAll('[data-row-actions]').forEach(menu => {
      menu.classList.add('hidden');
      menu.classList.add('is-hidden');
    });
    document.querySelectorAll('[data-row-menu]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  });

  tbody?.addEventListener('change', (event) => {
    const select = event.target.closest('.row-status');
    if (!select) return;
    const styles = {
      Active: ['bg-emerald-50', 'text-emerald-700'],
      Draft: ['bg-slate-100', 'text-slate-600'],
      Review: ['bg-amber-50', 'text-amber-700'],
      Frozen: ['bg-slate-800', 'text-white']
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

  window.toggleSidebar = () => {
    const isCollapsed = document.body.classList.toggle('nav-collapsed');
    try {
      localStorage.setItem('ubis-sidebar-collapsed', isCollapsed ? 'true' : 'false');
    } catch (e) { }

    const toggleBtns = document.querySelectorAll('#sidebarToggleBtn, [onclick*="toggleSidebar"]');
    toggleBtns.forEach(btn => {
      btn.setAttribute('title', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
      btn.setAttribute('aria-label', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
      btn.innerHTML = `<i data-lucide="${isCollapsed ? 'panel-left-open' : 'panel-left-close'}" class="h-4 w-4"></i>`;
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
  document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
  document.getElementById('yearFilter')?.addEventListener('change', applyFilters);

  window.clearFilters = () => {
    ['searchInput'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['statusFilter', 'yearFilter', 'categoryFilter'].forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
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
    if (menu && !event.target.closest('#columnsButton') && !event.target.closest('#columnsMenu')) {
      menu.classList.add('hidden');
    }
    const exportMenu = document.getElementById('exportMenu');
    if (exportMenu && !event.target.closest('#exportButton') && !event.target.closest('#exportMenu')) {
      exportMenu.classList.add('hidden');
    }
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
  window.changePage = () => { };
  window.changePageSize = () => { };
  window.sortBy = (field) => {
    if (document.getElementById('v_item')) return;
    const rows = [...(tbody?.querySelectorAll('[data-record-row]') || [])];
    const get = row => value(row, field);
    rows.sort((a, b) => {
      const av = get(a), bv = get(b);
      const an = Number(av), bn = Number(bv);
      return Number.isNaN(an) || Number.isNaN(bn) ? av.localeCompare(bv) : an - bn;
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
