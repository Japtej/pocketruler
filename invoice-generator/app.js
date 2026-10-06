/**
 * PocketRuler Client-Side Invoice & Estimate Generator
 * 100% In-Browser Privacy, Vector PDF Print, LocalStorage Persistence
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'pocketruler_invoice_profile';

  const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'AU$',
    JPY: '¥',
    INR: '₹',
    CHF: 'CHF ',
    SGD: 'SG$',
    AED: 'AED ',
    BRL: 'R$'
  };

  // State
  let state = {
    docType: 'INVOICE',
    currency: 'USD',
    docNumber: 'INV-2026-001',
    issueDate: new Date().toISOString().split('T')[0],
    paymentTerms: 'Net 15',
    fromName: 'Studio Nova Design',
    fromEmail: 'alex@studionova.co',
    fromAddress: '71-75 Shelton Street, London, WC2H 9JQ\nVAT: GB 982 4410 23',
    toName: 'Acme Global Inc.',
    toEmail: 'ap@acmeglobal.com',
    toAddress: '548 Market St, Suite 300\nSan Francisco, CA 94104, USA',
    items: [
      { id: 1, desc: 'Brand Identity & Web Design Sprint', qty: 1, rate: 4500 },
      { id: 2, desc: 'Design System & Figma Component Tokens', qty: 1, rate: 2200 },
      { id: 3, desc: 'Quarterly Advisory Retainer (October)', qty: 1, rate: 1500 }
    ],
    taxPercent: 0,
    discountAmount: 0,
    paymentNotes: 'Bank: Wise Europe SA\nIBAN: BE68 5390 0754 7034\nBIC/SWIFT: TRWIBEB1\nPayment Reference: INV-2026-001'
  };

  function formatCurrency(val) {
    const sym = CURRENCY_SYMBOLS[state.currency] || '$';
    return sym + Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const msg = document.getElementById('toastMessage');
    if (!toast || !msg) return;

    msg.textContent = message || 'Action completed!';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Render Line Item Input Rows
  function renderItemInputs() {
    const container = document.getElementById('itemsContainer');
    if (!container) return;

    container.innerHTML = state.items.map((item, idx) => `
      <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2" data-item-id="${item.id}">
        <div class="flex items-center justify-between gap-2">
          <input type="text" value="${item.desc}" class="item-desc-input w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Description of service or product" />
          ${state.items.length > 1 ? `
            <button type="button" class="remove-item-btn p-1 text-slate-400 hover:text-red-500 transition-colors" title="Delete line item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          ` : ''}
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-[10px] text-slate-400">Qty / Hrs</label>
            <input type="number" min="0.1" step="0.5" value="${item.qty}" class="item-qty-input w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label class="block text-[10px] text-slate-400">Rate</label>
            <input type="number" min="0" step="10" value="${item.rate}" class="item-rate-input w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div class="text-right flex flex-col justify-end">
            <span class="text-[10px] text-slate-400">Total</span>
            <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              ${formatCurrency(item.qty * item.rate)}
            </span>
          </div>
        </div>
      </div>
    `).join('');

    // Attach listeners
    container.querySelectorAll('.item-desc-input').forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        state.items[idx].desc = e.target.value;
        updatePreview();
      });
    });

    container.querySelectorAll('.item-qty-input').forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        state.items[idx].qty = parseFloat(e.target.value) || 0;
        updatePreview();
        renderItemInputs();
      });
    });

    container.querySelectorAll('.item-rate-input').forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        state.items[idx].rate = parseFloat(e.target.value) || 0;
        updatePreview();
        renderItemInputs();
      });
    });

    container.querySelectorAll('.remove-item-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        state.items.splice(idx, 1);
        renderItemInputs();
        updatePreview();
      });
    });
  }

  // Update Live Vector Document Preview
  function updatePreview() {
    // Header & Meta
    const previewDocType = document.getElementById('previewDocType');
    if (previewDocType) previewDocType.textContent = state.docType;

    const previewDocNum = document.getElementById('previewDocNumber');
    if (previewDocNum) previewDocNum.textContent = state.docNumber;

    const previewIssueDate = document.getElementById('previewIssueDate');
    if (previewIssueDate) previewIssueDate.textContent = state.issueDate;

    const previewTerms = document.getElementById('previewPaymentTerms');
    if (previewTerms) previewTerms.textContent = state.paymentTerms;

    // From details
    const pFromName = document.getElementById('previewFromName');
    if (pFromName) pFromName.textContent = state.fromName || 'Your Business Name';

    const pFromEmail = document.getElementById('previewFromEmail');
    if (pFromEmail) pFromEmail.textContent = state.fromEmail || '';

    const pFromAddress = document.getElementById('previewFromAddress');
    if (pFromAddress) pFromAddress.textContent = state.fromAddress || '';

    // To details
    const pToName = document.getElementById('previewToName');
    if (pToName) pToName.textContent = state.toName || 'Client Name';

    const pToEmail = document.getElementById('previewToEmail');
    if (pToEmail) pToEmail.textContent = state.toEmail || '';

    const pToAddress = document.getElementById('previewToAddress');
    if (pToAddress) pToAddress.textContent = state.toAddress || '';

    // Table rows
    const tbody = document.getElementById('previewItemsTbody');
    if (tbody) {
      tbody.innerHTML = state.items.map(item => `
        <tr class="py-2.5">
          <td class="py-3 font-semibold text-slate-800">${item.desc || 'Service Item'}</td>
          <td class="py-3 text-right font-mono text-slate-600">${item.qty}</td>
          <td class="py-3 text-right font-mono text-slate-600">${formatCurrency(item.rate)}</td>
          <td class="py-3 text-right font-mono font-bold text-slate-900">${formatCurrency(item.qty * item.rate)}</td>
        </tr>
      `).join('');
    }

    // Totals Math
    const subtotal = state.items.reduce((acc, curr) => acc + (curr.qty * curr.rate), 0);
    const discount = Math.min(state.discountAmount, subtotal);
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * (state.taxPercent / 100);
    const totalDue = taxableAmount + tax;

    const pSub = document.getElementById('previewSubtotal');
    if (pSub) pSub.textContent = formatCurrency(subtotal);

    const discountRow = document.getElementById('previewDiscountRow');
    const pDisc = document.getElementById('previewDiscount');
    if (discountRow && pDisc) {
      if (discount > 0) {
        discountRow.classList.remove('hidden');
        pDisc.textContent = '-' + formatCurrency(discount);
      } else {
        discountRow.classList.add('hidden');
      }
    }

    const pTaxRate = document.getElementById('previewTaxRate');
    if (pTaxRate) pTaxRate.textContent = state.taxPercent + '%';

    const pTax = document.getElementById('previewTax');
    if (pTax) pTax.textContent = formatCurrency(tax);

    const pTotal = document.getElementById('previewTotalDue');
    if (pTotal) pTotal.textContent = formatCurrency(totalDue);

    // Payment notes
    const pNotes = document.getElementById('previewPaymentNotes');
    if (pNotes) pNotes.textContent = state.paymentNotes || 'No notes specified.';
  }

  // Load Saved Profile from LocalStorage
  function loadSavedProfile() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fromName) state.fromName = parsed.fromName;
        if (parsed.fromEmail) state.fromEmail = parsed.fromEmail;
        if (parsed.fromAddress) state.fromAddress = parsed.fromAddress;
        if (parsed.paymentNotes) state.paymentNotes = parsed.paymentNotes;

        // Sync inputs
        const elName = document.getElementById('fromName');
        if (elName) elName.value = state.fromName;

        const elEmail = document.getElementById('fromEmail');
        if (elEmail) elEmail.value = state.fromEmail;

        const elAddr = document.getElementById('fromAddress');
        if (elAddr) elAddr.value = state.fromAddress;

        const elNotes = document.getElementById('paymentNotes');
        if (elNotes) elNotes.value = state.paymentNotes;
      }
    } catch (e) {}
  }

  // Save Profile to LocalStorage
  function saveProfile() {
    try {
      const toSave = {
        fromName: state.fromName,
        fromEmail: state.fromEmail,
        fromAddress: state.fromAddress,
        paymentNotes: state.paymentNotes
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      showToast('Business details saved to browser storage!');
    } catch (e) {
      alert('Could not save to local storage.');
    }
  }

  function init() {
    // Set initial date
    const dateInput = document.getElementById('issueDate');
    if (dateInput) dateInput.value = state.issueDate;

    loadSavedProfile();
    renderItemInputs();
    updatePreview();

    // Document Type Buttons
    document.querySelectorAll('.doc-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.doc-type-btn').forEach(b => {
          b.classList.remove('active', 'bg-white', 'dark:bg-slate-700', 'text-emerald-600', 'dark:text-emerald-400', 'shadow-2xs');
          b.classList.add('text-slate-600', 'dark:text-slate-300');
        });
        btn.classList.add('active', 'bg-white', 'dark:bg-slate-700', 'text-emerald-600', 'dark:text-emerald-400', 'shadow-2xs');
        btn.classList.remove('text-slate-600', 'dark:text-slate-300');
        state.docType = btn.getAttribute('data-type');
        updatePreview();
      });
    });

    // Currency Change
    const currSelect = document.getElementById('invoiceCurrency');
    if (currSelect) {
      currSelect.addEventListener('change', (e) => {
        state.currency = e.target.value;
        renderItemInputs();
        updatePreview();
      });
    }

    // Doc Number
    const docNum = document.getElementById('docNumber');
    if (docNum) {
      docNum.addEventListener('input', (e) => {
        state.docNumber = e.target.value;
        updatePreview();
      });
    }

    // Date
    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        state.issueDate = e.target.value;
        updatePreview();
      });
    }

    // Terms
    const termsSelect = document.getElementById('paymentTerms');
    if (termsSelect) {
      termsSelect.addEventListener('change', (e) => {
        state.paymentTerms = e.target.value;
        updatePreview();
      });
    }

    // From fields
    const fromName = document.getElementById('fromName');
    if (fromName) fromName.addEventListener('input', (e) => { state.fromName = e.target.value; updatePreview(); });

    const fromEmail = document.getElementById('fromEmail');
    if (fromEmail) fromEmail.addEventListener('input', (e) => { state.fromEmail = e.target.value; updatePreview(); });

    const fromAddr = document.getElementById('fromAddress');
    if (fromAddr) fromAddr.addEventListener('input', (e) => { state.fromAddress = e.target.value; updatePreview(); });

    // To fields
    const toName = document.getElementById('toName');
    if (toName) toName.addEventListener('input', (e) => { state.toName = e.target.value; updatePreview(); });

    const toEmail = document.getElementById('toEmail');
    if (toEmail) toEmail.addEventListener('input', (e) => { state.toEmail = e.target.value; updatePreview(); });

    const toAddr = document.getElementById('toAddress');
    if (toAddr) toAddr.addEventListener('input', (e) => { state.toAddress = e.target.value; updatePreview(); });

    // Add Item Button
    const addBtn = document.getElementById('addItemBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        state.items.push({
          id: Date.now(),
          desc: 'Consulting & Development Service',
          qty: 1,
          rate: 500
        });
        renderItemInputs();
        updatePreview();
      });
    }

    // Tax & Discount
    const taxIn = document.getElementById('taxPercent');
    if (taxIn) {
      taxIn.addEventListener('input', (e) => {
        state.taxPercent = parseFloat(e.target.value) || 0;
        updatePreview();
      });
    }

    const discIn = document.getElementById('discountAmount');
    if (discIn) {
      discIn.addEventListener('input', (e) => {
        state.discountAmount = parseFloat(e.target.value) || 0;
        updatePreview();
      });
    }

    // Notes
    const notesIn = document.getElementById('paymentNotes');
    if (notesIn) {
      notesIn.addEventListener('input', (e) => {
        state.paymentNotes = e.target.value;
        updatePreview();
      });
    }

    // Save Profile
    const saveBtn = document.getElementById('saveBusinessProfileBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveProfile);

    // Print Button
    const printBtn = document.getElementById('printInvoiceBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
