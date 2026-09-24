/* ===================================
   SpendPulse — Application Logic
   =================================== */

// ─── Categories ────────────────────
const CATEGORIES = [
  { id: 'food',          emoji: '🍕', label: 'Food',          color: '#f97316' },
  { id: 'transport',     emoji: '🚗', label: 'Transport',     color: '#0ea5e9' },
  { id: 'shopping',      emoji: '🛍️', label: 'Shopping',      color: '#a855f7' },
  { id: 'entertainment', emoji: '🎬', label: 'Entertainment', color: '#ec4899' },
  { id: 'health',        emoji: '💊', label: 'Health',        color: '#10b981' },
  { id: 'education',     emoji: '📚', label: 'Education',     color: '#6366f1' },
  { id: 'bills',         emoji: '📄', label: 'Bills',         color: '#f43f5e' },
  { id: 'groceries',     emoji: '🛒', label: 'Groceries',     color: '#22d3ee' },
  { id: 'rent',          emoji: '🏠', label: 'Rent',          color: '#f59e0b' },
  { id: 'travel',        emoji: '✈️', label: 'Travel',        color: '#8b5cf6' },
  { id: 'subscriptions', emoji: '🔁', label: 'Subscriptions', color: '#14b8a6' },
  { id: 'other',         emoji: '📦', label: 'Other',         color: '#64748b' },
];

// ─── Currency Locale Mapping ───────
const CURRENCY_LOCALES = {
  INR: 'en-IN', JPY: 'ja-JP', CNY: 'zh-CN', KRW: 'ko-KR',
  SGD: 'en-SG', THB: 'th-TH', MYR: 'ms-MY', IDR: 'id-ID',
  PHP: 'en-PH', BDT: 'bn-BD', PKR: 'ur-PK', AED: 'ar-AE',
  SAR: 'ar-SA', USD: 'en-US', CAD: 'en-CA', BRL: 'pt-BR',
  MXN: 'es-MX', ARS: 'es-AR', EUR: 'de-DE', GBP: 'en-GB',
  CHF: 'de-CH', SEK: 'sv-SE', NOK: 'nb-NO', PLN: 'pl-PL',
  TRY: 'tr-TR', RUB: 'ru-RU', ZAR: 'en-ZA', NGN: 'en-NG',
  EGP: 'ar-EG', KES: 'en-KE', AUD: 'en-AU', NZD: 'en-NZ',
};

// ─── Financial Quotes ──────────────
const FINANCIAL_QUOTES = [
  { quote: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
  { quote: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { quote: "Beware of little expenses. A small leak will sink a great ship.", author: "Benjamin Franklin" },
  { quote: "Money is a terrible master but an excellent servant.", author: "P.T. Barnum" },
  { quote: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" },
  { quote: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.", author: "Warren Buffett" },
  { quote: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.", author: "Albert Einstein" },
  { quote: "The secret to wealth is simple: Find a way to do more for others than anyone else does.", author: "Tony Robbins" },
];

// ─── State ─────────────────────────
let state = {
  currentUser: null, // { id: '...', name: '...', avatar: '...' }
  expenses: [],
  budgets: [],
  recurring: [],
  funds: [],
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  currentView: 'dashboard',
  currency: 'INR',
  editingId: null,
  deletingId: null,
  trendMode: 'daily',
  quoteIndex: 0,
  authMode: 'login', // 'login' or 'signup'
  selectedAvatar: '😎',
};

// ─── DOM Cache ─────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
  sidebar:        $('#sidebar'),
  menuToggle:     $('#menu-toggle'),
  headerTitle:    $('#header-title'),
  headerDate:     $('#header-date'),
  monthLabel:     $('#current-month-label'),
  prevMonth:      $('#prev-month'),
  nextMonth:      $('#next-month'),
  btnAddExpense:  $('#btn-add-expense'),
  currencySelect: $('#currency-select'),

  // Stats
  totalSpent:       $('#total-spent'),
  dailyAvg:         $('#daily-avg'),
  highestExpense:   $('#highest-expense'),
  transactionCount: $('#transaction-count'),
  totalChange:      $('#total-change'),

  // Charts
  trendChart:     $('#trend-chart'),
  categoryChart:  $('#category-chart'),
  donutTotal:     $('#donut-total'),
  categoryLegend: $('#category-legend'),
  monthlyChart:   $('#monthly-comparison-chart'),
  categoryBars:   $('#category-bars'),
  topExpenses:    $('#top-expenses'),
  insightsList:   $('#insights-list'),

  // Expenses
  recentExpenses: $('#recent-expenses'),
  allExpenses:    $('#all-expenses'),
  emptyExpenses:  $('#empty-expenses'),
  searchInput:    $('#search-input'),
  filterCategory: $('#filter-category'),
  sortBy:         $('#sort-by'),
  viewAllBtn:     $('#view-all-expenses'),

  // Budgets
  budgetsGrid:    $('#budgets-grid'),
  emptyBudgets:   $('#empty-budgets'),
  btnAddBudget:   $('#btn-add-budget'),

  // Recurring
  recurringGrid:         $('#recurring-grid'),
  emptyRecurring:        $('#empty-recurring'),
  btnAddRecurring:       $('#btn-add-recurring'),
  recurringMonthlyTotal: $('#recurring-monthly-total'),
  // Quote Banner
  quoteText:      $('#quote-text'),
  quoteAuthor:    $('#quote-author'),
  btnNextQuote:   $('#btn-next-quote'),

  // Mutual Funds
  fundsGrid:          $('#funds-grid'),
  emptyFunds:         $('#empty-funds'),
  btnAddFund:         $('#btn-add-fund'),
  fundInvestedTotal:  $('#fund-invested-total'),
  fundCurrentTotal:   $('#fund-current-total'),
  fundReturnsTotal:   $('#fund-returns-total'),

  // Modals
  expenseModal:     $('#expense-modal'),
  modalTitle:       $('#modal-title'),
  expenseForm:      $('#expense-form'),
  expenseId:        $('#expense-id'),
  expenseTitle:     $('#expense-title'),
  expenseAmount:    $('#expense-amount'),
  expenseDate:      $('#expense-date'),
  expenseNotes:     $('#expense-notes'),
  categoryPicker:   $('#category-picker'),
  amountPrefix:     $('#amount-prefix'),
  modalClose:       $('#modal-close'),
  btnCancel:        $('#btn-cancel'),

  budgetModal:      $('#budget-modal'),
  budgetForm:       $('#budget-form'),
  budgetCategory:   $('#budget-category'),
  budgetAmount:     $('#budget-amount'),
  budgetModalClose: $('#budget-modal-close'),
  btnBudgetCancel:  $('#btn-budget-cancel'),

  recurringModal:      $('#recurring-modal'),
  recurringForm:       $('#recurring-form'),
  recurringTitle:      $('#recurring-title'),
  recurringAmount:     $('#recurring-amount'),
  recurringFrequency:  $('#recurring-frequency'),
  recurringDate:       $('#recurring-date'),
  recurringCategory:   $('#recurring-category'),
  recurringModalClose: $('#recurring-modal-close'),
  btnRecurringCancel:  $('#btn-recurring-cancel'),

  fundModal:      $('#fund-modal'),
  fundForm:       $('#fund-form'),
  fundName:       $('#fund-name'),
  fundCategory:   $('#fund-category'),
  fundType:       $('#fund-type'),
  fundInvested:   $('#fund-invested'),
  fundCurrent:    $('#fund-current'),
  fundModalClose: $('#fund-modal-close'),
  btnFundCancel:  $('#btn-fund-cancel'),

  deleteModal:      $('#delete-modal'),
  deleteModalClose: $('#delete-modal-close'),
  btnDeleteCancel:  $('#btn-delete-cancel'),
  btnDeleteConfirm: $('#btn-delete-confirm'),

  // Auth Overlay & User Profile
  authOverlay:      $('#auth-overlay'),
  tabLogin:         $('#tab-login'),
  tabSignup:        $('#tab-signup'),
  authForm:         $('#auth-form'),
  authUsername:     $('#auth-username'),
  groupAvatar:      $('#group-avatar'),
  authSubmitBtn:    $('#auth-submit-btn'),
  btnGuestLogin:    $('#btn-guest-login'),
  userAvatar:       $('#user-avatar'),
  userName:         $('#user-name'),
  btnLogout:        $('#btn-logout'),

  toastContainer:   $('#toast-container'),
};

// ─── Theme ─────────────────────────
function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ef_theme', next);
  // Re-render charts with new theme colors
  if (state.currentView === 'dashboard') {
    renderTrendChart();
    renderCategoryChart();
  }
  if (state.currentView === 'analytics') {
    renderMonthlyComparison();
  }
}

function loadTheme() {
  const saved = localStorage.getItem('ef_theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
}

function getThemeColors() {
  const isDark = getTheme() === 'dark';
  return {
    grid: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)',
    label: isDark ? '#5a5a6e' : '#9090a8',
    textPrimary: isDark ? '#f0f0f5' : '#1a1a2e',
    textSecondary: isDark ? '#8b8b9e' : '#5e5e7a',
    dotStroke: isDark ? '#0a0a0f' : '#ffffff',
    emptyText: isDark ? '#5a5a6e' : '#9090a8',
    donutEmpty: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
    barInactiveStart: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.25)',
    barInactiveEnd: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)',
  };
}

// ─── Ripple Effect ─────────────────
function createRipple(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
  button.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

// ─── Animated Counter ──────────────
function animateCounter(element, targetText, duration = 600) {
  // Extract numeric value from formatted currency
  const numMatch = targetText.replace(/[^0-9.]/g, '');
  const targetNum = parseFloat(numMatch) || 0;
  if (targetNum === 0) {
    element.textContent = targetText;
    return;
  }
  const startTime = performance.now();
  const startNum = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startNum + (targetNum - startNum) * eased;

    // Reconstruct the formatted string with animated number
    const prefix = targetText.substring(0, targetText.indexOf(numMatch.charAt(0)));
    element.textContent = prefix + Math.round(current).toLocaleString('en-IN');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = targetText;
    }
  }
  requestAnimationFrame(update);
}

// ─── Helpers ───────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

function formatCurrency(amount) {
  const locale = CURRENCY_LOCALES[state.currency] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: state.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getCurrencySymbol() {
  const locale = CURRENCY_LOCALES[state.currency] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: state.currency,
  }).formatToParts(0)
    .find(p => p.type === 'currency')?.value || state.currency;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getCategory(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

function getMonthName(month, year) {
  return new Date(year, month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function getMonthExpenses() {
  return state.expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === state.currentMonth && d.getFullYear() === state.currentYear;
  });
}

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function showToast(message, type = 'success') {
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── Persistence (User Isolated) ───
function getUserKey(key) {
  if (!state.currentUser) return null;
  return `sp_user_${state.currentUser.id}_${key}`;
}

function saveState() {
  if (!state.currentUser) return;
  const prefix = `sp_user_${state.currentUser.id}_`;
  localStorage.setItem(prefix + 'expenses', JSON.stringify(state.expenses));
  localStorage.setItem(prefix + 'budgets', JSON.stringify(state.budgets));
  localStorage.setItem(prefix + 'recurring', JSON.stringify(state.recurring));
  localStorage.setItem(prefix + 'funds', JSON.stringify(state.funds));
  localStorage.setItem(prefix + 'currency', state.currency);
}

function loadState() {
  if (!state.currentUser) return;
  const prefix = `sp_user_${state.currentUser.id}_`;
  try {
    const expenses = localStorage.getItem(prefix + 'expenses');
    const budgets = localStorage.getItem(prefix + 'budgets');
    const recurring = localStorage.getItem(prefix + 'recurring');
    const funds = localStorage.getItem(prefix + 'funds');
    const currency = localStorage.getItem(prefix + 'currency');

    state.expenses = expenses ? JSON.parse(expenses) : [];
    state.budgets = budgets ? JSON.parse(budgets) : [];
    state.recurring = recurring ? JSON.parse(recurring) : [];
    state.funds = funds ? JSON.parse(funds) : [];

    if (currency) {
      state.currency = currency;
      if (DOM.currencySelect) DOM.currencySelect.value = currency;
    }
  } catch (e) {
    console.warn('Failed to load state for user:', e);
  }
}

// ─── Navigation ────────────────────
function switchView(view) {
  state.currentView = view;

  // Deactivate all views and activate target
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(`view-${view}`);
  if (targetView) targetView.classList.add('active');

  // Update sidebar active item
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const targetNav = document.querySelector(`[data-view="${view}"]`);
  if (targetNav) targetNav.classList.add('active');

  const titles = {
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    analytics: 'Analytics',
    budgets: 'Budgets',
    recurring: 'Recurring Subscriptions & Bills',
    'mutual-funds': 'Mutual Funds & SIP Portfolio',
  };

  const titleText = titles[view] || 'Dashboard';
  if (DOM.headerTitle) DOM.headerTitle.textContent = titleText;
  document.title = `${titleText} — SpendPulse`;

  try {
    if (view === 'dashboard') renderDashboard();
    else if (view === 'expenses') renderAllExpenses();
    else if (view === 'analytics') renderAnalytics();
    else if (view === 'budgets') renderBudgets();
    else if (view === 'recurring') renderRecurring();
    else if (view === 'mutual-funds') renderMutualFunds();
  } catch (err) {
    console.error('Error rendering view:', err);
  }

  // Close sidebar & backdrop on mobile
  if (DOM.sidebar) DOM.sidebar.classList.remove('open');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (backdrop) backdrop.classList.remove('active');
}

// ─── Month Selector ────────────────
function updateMonthLabel() {
  DOM.monthLabel.textContent = getMonthName(state.currentMonth, state.currentYear);
}

function changeMonth(delta) {
  state.currentMonth += delta;
  if (state.currentMonth > 11) {
    state.currentMonth = 0;
    state.currentYear++;
  } else if (state.currentMonth < 0) {
    state.currentMonth = 11;
    state.currentYear--;
  }
  updateMonthLabel();
  refreshCurrentView();
}

function refreshCurrentView() {
  if (state.currentView === 'dashboard') renderDashboard();
  else if (state.currentView === 'expenses') renderAllExpenses();
  else if (state.currentView === 'analytics') renderAnalytics();
  else if (state.currentView === 'budgets') renderBudgets();
  else if (state.currentView === 'recurring') renderRecurring();
  else if (state.currentView === 'mutual-funds') renderMutualFunds();
}

// ─── Render: Dashboard Stats ───────
function renderStats() {
  const expenses = getMonthExpenses();
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const days = getDaysInMonth(state.currentMonth, state.currentYear);
  const today = new Date();
  const elapsedDays = (state.currentMonth === today.getMonth() && state.currentYear === today.getFullYear())
    ? today.getDate()
    : days;
  const avg = elapsedDays > 0 ? total / elapsedDays : 0;
  const highest = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;

  animateCounter(DOM.totalSpent, formatCurrency(total));
  animateCounter(DOM.dailyAvg, formatCurrency(Math.round(avg)));
  animateCounter(DOM.highestExpense, formatCurrency(highest));
  DOM.transactionCount.textContent = expenses.length;

  // Compare to last month
  const lastMonth = state.currentMonth === 0 ? 11 : state.currentMonth - 1;
  const lastYear = state.currentMonth === 0 ? state.currentYear - 1 : state.currentYear;
  const lastExpenses = state.expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
  });
  const lastTotal = lastExpenses.reduce((s, e) => s + e.amount, 0);

  if (lastTotal > 0) {
    const pctChange = ((total - lastTotal) / lastTotal * 100).toFixed(1);
    if (total > lastTotal) {
      DOM.totalChange.textContent = `↑ ${Math.abs(pctChange)}% vs last month`;
      DOM.totalChange.className = 'stat-change up';
    } else if (total < lastTotal) {
      DOM.totalChange.textContent = `↓ ${Math.abs(pctChange)}% vs last month`;
      DOM.totalChange.className = 'stat-change down';
    } else {
      DOM.totalChange.textContent = 'Same as last month';
      DOM.totalChange.className = 'stat-change';
    }
  } else {
    DOM.totalChange.textContent = '';
  }
}

// ─── Render: Trend Chart ───────────
function renderTrendChart() {
  const canvas = DOM.trendChart;
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const w = rect.width;
  const h = rect.height;
  const expenses = getMonthExpenses();
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  ctx.clearRect(0, 0, w, h);

  let data = [];
  let labels = [];

  if (state.trendMode === 'daily') {
    const days = getDaysInMonth(state.currentMonth, state.currentYear);
    for (let i = 1; i <= days; i++) {
      const dayTotal = expenses
        .filter(e => new Date(e.date).getDate() === i)
        .reduce((s, e) => s + e.amount, 0);
      data.push(dayTotal);
      labels.push(i.toString());
    }
  } else {
    // Weekly
    const days = getDaysInMonth(state.currentMonth, state.currentYear);
    let week = 0;
    for (let i = 1; i <= days; i++) {
      if (!data[week]) data[week] = 0;
      const dayTotal = expenses
        .filter(e => new Date(e.date).getDate() === i)
        .reduce((s, e) => s + e.amount, 0);
      data[week] += dayTotal;
      if (i % 7 === 0) week++;
    }
    labels = data.map((_, i) => `Week ${i + 1}`);
  }

  const themeClr = getThemeColors();

  if (data.length === 0 || data.every(d => d === 0)) {
    ctx.fillStyle = themeClr.emptyText;
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No data for this month', w / 2, h / 2);
    return;
  }

  const maxVal = Math.max(...data) * 1.15 || 100;
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Grid lines
  const gridLines = 5;
  ctx.strokeStyle = themeClr.grid;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    // Y labels
    const val = maxVal - (maxVal / gridLines) * i;
    ctx.fillStyle = themeClr.label;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(formatCurrency(Math.round(val)), padding.left - 8, y + 4);
  }
  ctx.setLineDash([]);

  // X labels
  const step = Math.max(1, Math.floor(data.length / 10));
  ctx.fillStyle = themeClr.label;
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  data.forEach((_, i) => {
    if (i % step === 0 || i === data.length - 1) {
      const x = padding.left + (chartW / (data.length - 1 || 1)) * i;
      ctx.fillText(labels[i], x, h - padding.bottom + 20);
    }
  });

  // Area fill
  const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

  ctx.beginPath();
  data.forEach((val, i) => {
    const x = padding.left + (chartW / (data.length - 1 || 1)) * i;
    const y = padding.top + chartH - (val / maxVal) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else {
      // Smooth curve
      const prevX = padding.left + (chartW / (data.length - 1 || 1)) * (i - 1);
      const prevY = padding.top + chartH - (data[i - 1] / maxVal) * chartH;
      const cpx = (prevX + x) / 2;
      ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
    }
  });
  const lastX = padding.left + chartW;
  const firstX = padding.left;
  ctx.lineTo(lastX, h - padding.bottom);
  ctx.lineTo(firstX, h - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((val, i) => {
    const x = padding.left + (chartW / (data.length - 1 || 1)) * i;
    const y = padding.top + chartH - (val / maxVal) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else {
      const prevX = padding.left + (chartW / (data.length - 1 || 1)) * (i - 1);
      const prevY = padding.top + chartH - (data[i - 1] / maxVal) * chartH;
      const cpx = (prevX + x) / 2;
      ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
    }
  });
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots
  data.forEach((val, i) => {
    if (val > 0) {
      const x = padding.left + (chartW / (data.length - 1 || 1)) * i;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.strokeStyle = themeClr.dotStroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
}

// ─── Render: Category Donut Chart ──
function renderCategoryChart() {
  const canvas = DOM.categoryChart;
  const ctx = canvas.getContext('2d');
  const size = 200;
  canvas.width = size * window.devicePixelRatio;
  canvas.height = size * window.devicePixelRatio;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const expenses = getMonthExpenses();
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  DOM.donutTotal.textContent = formatCurrency(total);

  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = 90;
  const innerR = 62;

  if (total === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
    ctx.fillStyle = getThemeColors().donutEmpty;
    ctx.fill();
    DOM.categoryLegend.innerHTML = '<span style="color:var(--text-muted);font-size:0.8rem;">No data</span>';
    return;
  }

  // Calculate per-category totals
  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });

  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  let startAngle = -Math.PI / 2;
  const gap = 0.03;

  sorted.forEach(([catId, amount]) => {
    const cat = getCategory(catId);
    const sliceAngle = (amount / total) * Math.PI * 2 - gap;
    if (sliceAngle <= 0) return;

    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
    ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = cat.color;
    ctx.fill();

    startAngle += sliceAngle + gap;
  });

  // Legend
  DOM.categoryLegend.innerHTML = sorted.map(([catId, amount]) => {
    const cat = getCategory(catId);
    const pct = ((amount / total) * 100).toFixed(1);
    return `<div class="legend-item">
      <span class="legend-dot" style="background:${cat.color}"></span>
      <span>${cat.emoji} ${cat.label} (${pct}%)</span>
    </div>`;
  }).join('');
}

// ─── Render: Recent Expenses ───────
function renderRecentExpenses() {
  const expenses = getMonthExpenses()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (expenses.length === 0) {
    DOM.recentExpenses.innerHTML = `
      <div class="empty-state" style="padding:30px 10px;">
        <p style="color:var(--text-muted);font-size:0.85rem;">No expenses this month</p>
      </div>`;
    return;
  }

  DOM.recentExpenses.innerHTML = expenses.map(e => createExpenseItemHTML(e)).join('');
  attachExpenseActions(DOM.recentExpenses);
}

function createExpenseItemHTML(e) {
  const cat = getCategory(e.category);
  return `
    <div class="expense-item" data-id="${e.id}">
      <div class="expense-cat-icon" style="background:${cat.color}20;">
        <span>${cat.emoji}</span>
      </div>
      <div class="expense-details">
        <div class="expense-title">${escapeHtml(e.title)}</div>
        <div class="expense-meta">${cat.label} • ${formatDateShort(e.date)}${e.notes ? ' • ' + escapeHtml(e.notes) : ''}</div>
      </div>
      <div class="expense-amount">${formatCurrency(e.amount)}</div>
      <div class="expense-actions">
        <button class="expense-action-btn edit" title="Edit" data-id="${e.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="expense-action-btn delete" title="Delete" data-id="${e.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function attachExpenseActions(container) {
  container.querySelectorAll('.expense-action-btn.edit').forEach(btn => {
    btn.addEventListener('click', () => openEditExpense(btn.dataset.id));
  });
  container.querySelectorAll('.expense-action-btn.delete').forEach(btn => {
    btn.addEventListener('click', () => openDeleteConfirm(btn.dataset.id));
  });
}

// ─── Render: All Expenses ──────────
function renderAllExpenses() {
  if (!DOM.allExpenses) return;
  let expenses = getMonthExpenses();
  const search = DOM.searchInput ? DOM.searchInput.value.toLowerCase().trim() : '';
  const filterCat = DOM.filterCategory ? DOM.filterCategory.value : 'all';
  const sortVal = DOM.sortBy ? DOM.sortBy.value : 'date-desc';

  if (search) {
    expenses = expenses.filter(e =>
      e.title.toLowerCase().includes(search) ||
      getCategory(e.category).label.toLowerCase().includes(search) ||
      (e.notes && e.notes.toLowerCase().includes(search))
    );
  }

  if (filterCat !== 'all') {
    expenses = expenses.filter(e => e.category === filterCat);
  }

  switch (sortVal) {
    case 'date-desc': expenses.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
    case 'date-asc':  expenses.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
    case 'amount-desc': expenses.sort((a, b) => b.amount - a.amount); break;
    case 'amount-asc':  expenses.sort((a, b) => a.amount - b.amount); break;
  }

  if (expenses.length === 0) {
    DOM.allExpenses.innerHTML = '';
    if (DOM.emptyExpenses) DOM.emptyExpenses.style.display = 'flex';
  } else {
    if (DOM.emptyExpenses) DOM.emptyExpenses.style.display = 'none';
    DOM.allExpenses.innerHTML = expenses.map(e => createExpenseItemHTML(e)).join('');
    attachExpenseActions(DOM.allExpenses);
  }
}

// ─── Render: Dashboard ────────────
function renderDashboard() {
  renderStats();
  renderTrendChart();
  renderCategoryChart();
  renderRecentExpenses();
}

// ─── Render: Analytics ─────────────
function renderAnalytics() {
  renderMonthlyComparison();
  renderCategoryBars();
  renderTopExpenses();
  renderInsights();
}

function renderMonthlyComparison() {
  const canvas = DOM.monthlyChart;
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const w = rect.width;
  const h = rect.height;
  const padding = { top: 20, right: 20, bottom: 50, left: 60 };

  ctx.clearRect(0, 0, w, h);

  // Last 6 months data
  const months = [];
  for (let i = 5; i >= 0; i--) {
    let m = state.currentMonth - i;
    let y = state.currentYear;
    while (m < 0) { m += 12; y--; }
    const total = state.expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === m && d.getFullYear() === y;
      })
      .reduce((s, e) => s + e.amount, 0);
    months.push({
      label: new Date(y, m).toLocaleDateString('en-IN', { month: 'short' }),
      total,
    });
  }

  const maxVal = Math.max(...months.map(m => m.total), 100) * 1.15;
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const barW = Math.min(50, (chartW / months.length) * 0.5);
  const barGap = chartW / months.length;

  // Grid
  const gridLines = 5;
  const mThemeClr = getThemeColors();
  ctx.strokeStyle = mThemeClr.grid;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    const val = maxVal - (maxVal / gridLines) * i;
    ctx.fillStyle = mThemeClr.label;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(formatCurrency(Math.round(val)), padding.left - 8, y + 4);
  }
  ctx.setLineDash([]);

  // Bars
  months.forEach((m, i) => {
    const x = padding.left + barGap * i + barGap / 2 - barW / 2;
    const barH = (m.total / maxVal) * chartH;
    const y = padding.top + chartH - barH;

    // Bar gradient
    const grad = ctx.createLinearGradient(0, y, 0, padding.top + chartH);
    const isCurrentMonth = i === months.length - 1;
    if (isCurrentMonth) {
      grad.addColorStop(0, '#6366f1');
      grad.addColorStop(1, '#a855f7');
    } else {
      grad.addColorStop(0, mThemeClr.barInactiveStart);
      grad.addColorStop(1, mThemeClr.barInactiveEnd);
    }

    // Rounded rect
    const radius = 6;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + barW - radius, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
    ctx.lineTo(x + barW, padding.top + chartH);
    ctx.lineTo(x, padding.top + chartH);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // X label
    ctx.fillStyle = isCurrentMonth ? mThemeClr.textPrimary : mThemeClr.label;
    ctx.font = `${isCurrentMonth ? '600' : '400'} 12px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(m.label, padding.left + barGap * i + barGap / 2, h - padding.bottom + 20);

    // Amount on top
    if (m.total > 0) {
      ctx.fillStyle = isCurrentMonth ? mThemeClr.textPrimary : mThemeClr.textSecondary;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(formatCurrency(Math.round(m.total)), padding.left + barGap * i + barGap / 2, y - 8);
    }
  });
}

function renderCategoryBars() {
  const expenses = getMonthExpenses();
  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });

  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const maxVal = sorted.length > 0 ? sorted[0][1] : 0;

  if (sorted.length === 0) {
    DOM.categoryBars.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:20px;">No data</p>';
    return;
  }

  DOM.categoryBars.innerHTML = sorted.map(([catId, amount]) => {
    const cat = getCategory(catId);
    const pct = maxVal > 0 ? (amount / maxVal) * 100 : 0;
    return `
      <div class="cat-bar-item">
        <div class="cat-bar-header">
          <span class="cat-bar-label">${cat.emoji} ${cat.label}</span>
          <span class="cat-bar-amount">${formatCurrency(amount)}</span>
        </div>
        <div class="cat-bar-track">
          <div class="cat-bar-fill" style="width:${pct}%;background:${cat.color};"></div>
        </div>
      </div>`;
  }).join('');
}

function renderTopExpenses() {
  const expenses = getMonthExpenses()
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  if (expenses.length === 0) {
    DOM.topExpenses.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:20px;">No data</p>';
    return;
  }

  DOM.topExpenses.innerHTML = expenses.map((e, i) => {
    const cat = getCategory(e.category);
    return `
      <div class="top-expense-item">
        <div class="top-expense-rank">${i + 1}</div>
        <div class="top-expense-info">
          <div class="top-expense-name">${cat.emoji} ${escapeHtml(e.title)}</div>
          <div class="top-expense-date">${formatDate(e.date)}</div>
        </div>
        <div class="top-expense-amount">${formatCurrency(e.amount)}</div>
      </div>`;
  }).join('');
}

function renderInsights() {
  const expenses = getMonthExpenses();
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const insights = [];

  if (expenses.length === 0) {
    DOM.insightsList.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:20px;">Add expenses to see insights</p>';
    return;
  }

  // Top category
  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCat) {
    const cat = getCategory(topCat[0]);
    const pct = ((topCat[1] / total) * 100).toFixed(1);
    insights.push({
      icon: cat.emoji,
      text: `Your biggest spending category is <strong>${cat.label}</strong>, accounting for <strong>${pct}%</strong> of total expenses.`
    });
  }

  // Average transaction
  const avgTransaction = total / expenses.length;
  insights.push({
    icon: '📊',
    text: `Average transaction amount: <strong>${formatCurrency(Math.round(avgTransaction))}</strong> across ${expenses.length} transactions.`
  });

  // Most expensive day
  const dayTotals = {};
  expenses.forEach(e => {
    const day = new Date(e.date).toLocaleDateString('en-IN', { weekday: 'long' });
    dayTotals[day] = (dayTotals[day] || 0) + e.amount;
  });
  const topDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];
  if (topDay) {
    insights.push({
      icon: '📅',
      text: `You spend the most on <strong>${topDay[0]}s</strong> — totaling <strong>${formatCurrency(Math.round(topDay[1]))}</strong> this month.`
    });
  }

  // Budget warnings
  state.budgets.forEach(b => {
    const spent = catTotals[b.category] || 0;
    if (spent > b.amount) {
      const cat = getCategory(b.category);
      insights.push({
        icon: '⚠️',
        text: `You've <strong>exceeded</strong> your ${cat.label} budget by <strong>${formatCurrency(Math.round(spent - b.amount))}</strong>.`
      });
    } else if (spent > b.amount * 0.8) {
      const cat = getCategory(b.category);
      const pct = ((spent / b.amount) * 100).toFixed(0);
      insights.push({
        icon: '🔔',
        text: `You've used <strong>${pct}%</strong> of your ${cat.label} budget. <strong>${formatCurrency(Math.round(b.amount - spent))}</strong> remaining.`
      });
    }
  });

  DOM.insightsList.innerHTML = insights.map(i => `
    <div class="insight-item">
      <div class="insight-icon">${i.icon}</div>
      <div class="insight-text">${i.text}</div>
    </div>`).join('');
}

// ─── Render: Budgets ───────────────
function renderBudgets() {
  const expenses = getMonthExpenses();
  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });

  if (state.budgets.length === 0) {
    DOM.budgetsGrid.innerHTML = '';
    DOM.emptyBudgets.style.display = 'flex';
    return;
  }

  DOM.emptyBudgets.style.display = 'none';
  DOM.budgetsGrid.innerHTML = state.budgets.map(b => {
    const cat = getCategory(b.category);
    const spent = catTotals[b.category] || 0;
    const pct = Math.min((spent / b.amount) * 100, 100);
    const isOver = spent > b.amount;
    const remaining = b.amount - spent;

    let barColor = cat.color;
    if (isOver) barColor = '#f43f5e';
    else if (pct > 80) barColor = '#f59e0b';

    return `
      <div class="budget-card">
        <div class="budget-card-header">
          <div class="budget-cat-info">
            <span class="budget-cat-emoji">${cat.emoji}</span>
            <span class="budget-cat-name">${cat.label}</span>
          </div>
          <button class="budget-delete-btn" data-category="${b.category}" title="Remove budget">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="budget-amounts">
          <span class="budget-spent" style="color:${isOver ? '#f43f5e' : 'var(--text-primary)'}">${formatCurrency(spent)}</span>
          <span class="budget-limit"> / ${formatCurrency(b.amount)}</span>
        </div>
        <div class="budget-bar-track" style="margin-top:12px;">
          <div class="budget-bar-fill" style="width:${pct}%;background:${barColor};"></div>
        </div>
        <div class="budget-status ${isOver ? 'over' : ''}">
          ${isOver
            ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
            : `${formatCurrency(remaining)} remaining (${pct.toFixed(0)}% used)`
          }
        </div>
      </div>`;
  }).join('');

  // Attach delete handlers
  DOM.budgetsGrid.querySelectorAll('.budget-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.budgets = state.budgets.filter(b => b.category !== btn.dataset.category);
      saveState();
      renderBudgets();
      showToast('Budget removed', 'info');
    });
  });
}

// ─── Modal: Expense ────────────────
function openAddExpense() {
  state.editingId = null;
  DOM.modalTitle.textContent = 'Add Expense';
  DOM.expenseForm.reset();
  DOM.expenseId.value = '';
  DOM.expenseDate.value = new Date().toISOString().split('T')[0];
  DOM.amountPrefix.textContent = getCurrencySymbol();
  renderCategoryPicker(null);
  openModal(DOM.expenseModal);
}

function openEditExpense(id) {
  const expense = state.expenses.find(e => e.id === id);
  if (!expense) return;
  state.editingId = id;
  DOM.modalTitle.textContent = 'Edit Expense';
  DOM.expenseId.value = id;
  DOM.expenseTitle.value = expense.title;
  DOM.expenseAmount.value = expense.amount;
  DOM.expenseDate.value = expense.date;
  DOM.expenseNotes.value = expense.notes || '';
  DOM.amountPrefix.textContent = getCurrencySymbol();
  renderCategoryPicker(expense.category);
  openModal(DOM.expenseModal);
}

function renderCategoryPicker(selectedId) {
  DOM.categoryPicker.innerHTML = CATEGORIES.map(cat => `
    <div class="cat-option ${cat.id === selectedId ? 'selected' : ''}" data-cat="${cat.id}">
      <span class="cat-option-emoji">${cat.emoji}</span>
      <span class="cat-option-label">${cat.label}</span>
    </div>`).join('');

  DOM.categoryPicker.querySelectorAll('.cat-option').forEach(opt => {
    opt.addEventListener('click', () => {
      DOM.categoryPicker.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

function saveExpense(e) {
  e.preventDefault();

  const title = DOM.expenseTitle.value.trim();
  const amount = parseFloat(DOM.expenseAmount.value);
  const date = DOM.expenseDate.value;
  const notes = DOM.expenseNotes.value.trim();
  const selectedCat = DOM.categoryPicker.querySelector('.cat-option.selected');

  if (!title || !amount || !date) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  if (!selectedCat) {
    showToast('Please select a category', 'error');
    return;
  }

  const category = selectedCat.dataset.cat;

  if (state.editingId) {
    const idx = state.expenses.findIndex(exp => exp.id === state.editingId);
    if (idx !== -1) {
      state.expenses[idx] = { ...state.expenses[idx], title, amount, date, category, notes };
    }
    showToast('Expense updated successfully');
  } else {
    state.expenses.push({ id: generateId(), title, amount, date, category, notes });
    showToast('Expense added successfully');
    if (typeof window.launchConfetti === 'function') {
      window.launchConfetti(e.clientX, e.clientY);
    }
  }

  saveState();
  closeModal(DOM.expenseModal);
  refreshCurrentView();
}

// ─── Modal: Delete ─────────────────
function openDeleteConfirm(id) {
  state.deletingId = id;
  openModal(DOM.deleteModal);
}

function confirmDelete() {
  if (state.deletingId) {
    state.expenses = state.expenses.filter(e => e.id !== state.deletingId);
    state.deletingId = null;
    saveState();
    closeModal(DOM.deleteModal);
    refreshCurrentView();
    showToast('Expense deleted', 'info');
  }
}

// ─── Modal: Budget ─────────────────
function openBudgetModal() {
  DOM.budgetForm.reset();
  const existingCats = state.budgets.map(b => b.category);
  DOM.budgetCategory.innerHTML = CATEGORIES
    .filter(c => !existingCats.includes(c.id))
    .map(c => `<option value="${c.id}">${c.emoji} ${c.label}</option>`)
    .join('');

  if (DOM.budgetCategory.options.length === 0) {
    showToast('All categories already have budgets', 'info');
    return;
  }

  document.querySelector('.budget-prefix').textContent = getCurrencySymbol();
  openModal(DOM.budgetModal);
}

function saveBudget(e) {
  e.preventDefault();
  const category = DOM.budgetCategory.value;
  const amount = parseFloat(DOM.budgetAmount.value);

  if (!category || !amount) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  state.budgets.push({ category, amount });
  saveState();
  closeModal(DOM.budgetModal);
  renderBudgets();
  showToast('Budget set successfully');
  if (typeof window.launchConfetti === 'function') {
    window.launchConfetti(e.clientX, e.clientY);
  }
}

// ─── Modal Helpers ─────────────────
function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ─── Populate Filter Dropdown ──────
function populateFilterDropdown() {
  DOM.filterCategory.innerHTML = '<option value="all">All Categories</option>' +
    CATEGORIES.map(c => `<option value="${c.id}">${c.emoji} ${c.label}</option>`).join('');
}

// ─── Date Display ──────────────────
function updateHeaderDate() {
  const now = new Date();
  DOM.headerDate.textContent = now.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ─── Window Resize Handling ────────
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (state.currentView === 'dashboard') {
      renderTrendChart();
      renderCategoryChart();
    }
  }, 200);
});
// ─── Render: Financial Quote Banner ──
function renderNextQuote() {
  state.quoteIndex = (state.quoteIndex + 1) % FINANCIAL_QUOTES.length;
  const q = FINANCIAL_QUOTES[state.quoteIndex];
  if (DOM.quoteText && DOM.quoteAuthor) {
    DOM.quoteText.style.opacity = '0';
    setTimeout(() => {
      DOM.quoteText.textContent = `"${q.quote}"`;
      DOM.quoteAuthor.textContent = `— ${q.author}`;
      DOM.quoteText.style.opacity = '1';
    }, 200);
  }
}

// ─── Render: Recurring Subscriptions & Bills ──
function renderRecurring() {
  if (!DOM.recurringGrid) return;

  const totalMonthly = state.recurring.reduce((s, r) => {
    if (r.frequency === 'yearly') return s + (r.amount / 12);
    if (r.frequency === 'weekly') return s + (r.amount * 4);
    return s + r.amount;
  }, 0);

  if (DOM.recurringMonthlyTotal) {
    animateCounter(DOM.recurringMonthlyTotal, formatCurrency(Math.round(totalMonthly)));
  }
  if (DOM.recurringCount) {
    DOM.recurringCount.textContent = state.recurring.length;
  }

  if (state.recurring.length === 0) {
    DOM.recurringGrid.innerHTML = '';
    if (DOM.emptyRecurring) DOM.emptyRecurring.style.display = 'flex';
    return;
  }

  if (DOM.emptyRecurring) DOM.emptyRecurring.style.display = 'none';
  DOM.recurringGrid.innerHTML = state.recurring.map(r => {
    const cat = getCategory(r.category);
    const dueDate = new Date(r.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0;

    let dueText = `Due in ${daysUntilDue} days`;
    if (daysUntilDue < 0) dueText = `Overdue by ${Math.abs(daysUntilDue)} days`;
    else if (daysUntilDue === 0) dueText = `Due Today!`;

    return `
      <div class="budget-card">
        <div class="budget-card-header">
          <div class="budget-cat-info">
            <span class="budget-cat-emoji">${cat.emoji}</span>
            <div>
              <span class="budget-cat-name">${escapeHtml(r.title)}</span>
              <div style="margin-top:2px;"><span class="due-badge ${isUrgent || daysUntilDue < 0 ? 'urgent' : ''}">${dueText}</span></div>
            </div>
          </div>
          <button class="budget-delete-btn delete-recurring-btn" data-id="${r.id}" title="Remove recurring item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="budget-amounts">
          <span class="budget-spent" style="color:var(--text-primary)">${formatCurrency(r.amount)}</span>
          <span class="budget-limit"> / ${r.frequency}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:10px;border-top:1px solid var(--border);">
          <span style="font-size:0.75rem;color:var(--text-muted)">Next: ${formatDateShort(r.dueDate)}</span>
          <button class="btn-pay-now pay-recurring-btn" data-id="${r.id}" title="Log bill payment into expenses">
            Log Payment
          </button>
        </div>
      </div>`;
  }).join('');

  // Attach recurring event handlers
  DOM.recurringGrid.querySelectorAll('.delete-recurring-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.recurring = state.recurring.filter(r => r.id !== btn.dataset.id);
      saveState();
      renderRecurring();
      showToast('Subscription removed', 'info');
    });
  });

  DOM.recurringGrid.querySelectorAll('.pay-recurring-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = state.recurring.find(r => r.id === btn.dataset.id);
      if (!item) return;
      state.expenses.push({
        id: generateId(),
        title: item.title,
        amount: item.amount,
        date: new Date().toISOString().split('T')[0],
        category: item.category,
        notes: `Recurring Payment for ${item.title}`,
      });
      saveState();
      showToast(`${item.title} payment logged into expenses!`);
      if (typeof window.launchConfetti === 'function') {
        window.launchConfetti(e.clientX, e.clientY);
      }
    });
  });
}

function openRecurringModal() {
  if (DOM.recurringForm) DOM.recurringForm.reset();
  if (DOM.recurringDate) DOM.recurringDate.value = new Date().toISOString().split('T')[0];
  if (DOM.recurringCategory) {
    DOM.recurringCategory.innerHTML = CATEGORIES
      .map(c => `<option value="${c.id}">${c.emoji} ${c.label}</option>`)
      .join('');
  }
  const prefix = document.querySelector('.recurring-prefix');
  if (prefix) prefix.textContent = getCurrencySymbol();
  openModal(DOM.recurringModal);
}

function saveRecurring(e) {
  e.preventDefault();
  const title = DOM.recurringTitle ? DOM.recurringTitle.value.trim() : '';
  const amount = DOM.recurringAmount ? parseFloat(DOM.recurringAmount.value) : 0;
  const frequency = DOM.recurringFrequency ? DOM.recurringFrequency.value : 'monthly';
  const dueDate = DOM.recurringDate ? DOM.recurringDate.value : new Date().toISOString().split('T')[0];
  const category = DOM.recurringCategory ? DOM.recurringCategory.value : 'bills';

  if (!title || !amount || !dueDate) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  state.recurring.push({ id: generateId(), title, amount, frequency, dueDate, category });
  saveState();
  closeModal(DOM.recurringModal);
  renderRecurring();
  showToast('Recurring bill added!');
  if (typeof window.launchConfetti === 'function') {
    window.launchConfetti(e.clientX, e.clientY);
  }
}

// ─── Render: Mutual Funds ──────────
function renderMutualFunds() {
  if (!DOM.fundsGrid) return;

  const totalInvested = state.funds.reduce((s, f) => s + f.invested, 0);
  const totalCurrent = state.funds.reduce((s, f) => s + f.current, 0);
  const totalReturns = totalCurrent - totalInvested;

  animateCounter(DOM.fundInvestedTotal, formatCurrency(totalInvested));
  animateCounter(DOM.fundCurrentTotal, formatCurrency(totalCurrent));
  
  if (DOM.fundReturnsTotal) {
    const sign = totalReturns >= 0 ? '+' : '';
    const pct = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : '0';
    DOM.fundReturnsTotal.textContent = `${sign}${formatCurrency(totalReturns)} (${sign}${pct}%)`;
    DOM.fundReturnsTotal.className = totalReturns >= 0 ? 'summary-value fund-profit' : 'summary-value fund-loss';
  }

  if (state.funds.length === 0) {
    DOM.fundsGrid.innerHTML = '';
    DOM.emptyFunds.style.display = 'flex';
    return;
  }

  DOM.emptyFunds.style.display = 'none';
  DOM.fundsGrid.innerHTML = state.funds.map(f => {
    const returns = f.current - f.invested;
    const isProfit = returns >= 0;
    const pct = f.invested > 0 ? ((returns / f.invested) * 100).toFixed(2) : '0';

    return `
      <div class="budget-card">
        <div class="budget-card-header">
          <div class="budget-cat-info">
            <span class="budget-cat-emoji">📈</span>
            <div>
              <span class="budget-cat-name">${escapeHtml(f.name)}</span>
              <div style="margin-top:2px;"><span class="fund-badge">${escapeHtml(f.category)} • ${escapeHtml(f.type)}</span></div>
            </div>
          </div>
          <button class="budget-delete-btn delete-fund-btn" data-id="${f.id}" title="Remove fund">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="budget-amounts">
          <span class="budget-spent" style="color:var(--text-primary)">${formatCurrency(f.current)}</span>
          <span class="budget-limit"> / Invested: ${formatCurrency(f.invested)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:10px;border-top:1px solid var(--border);">
          <div class="${isProfit ? 'fund-profit' : 'fund-loss'}" style="font-size:0.85rem;">
            ${isProfit ? '▲ Profit' : '▼ Loss'}: ${isProfit ? '+' : ''}${formatCurrency(returns)} (${isProfit ? '+' : ''}${pct}%)
          </div>
          ${f.type === 'Monthly SIP' ? `
            <button class="btn-pay-now pay-sip-btn" data-id="${f.id}" title="Log Monthly SIP into Expenses">
              Log SIP Expense
            </button>` : ''}
        </div>
      </div>`;
  }).join('');

  // Attach fund event handlers
  DOM.fundsGrid.querySelectorAll('.delete-fund-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.funds = state.funds.filter(f => f.id !== btn.dataset.id);
      saveState();
      renderMutualFunds();
      showToast('Mutual Fund removed from portfolio', 'info');
    });
  });

  DOM.fundsGrid.querySelectorAll('.pay-sip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const fund = state.funds.find(f => f.id === btn.dataset.id);
      if (!fund) return;
      state.expenses.push({
        id: generateId(),
        title: `SIP Investment: ${fund.name}`,
        amount: fund.invested,
        date: new Date().toISOString().split('T')[0],
        category: 'other',
        notes: `Automated SIP Log for ${fund.name}`,
      });
      saveState();
      showToast(`SIP of ${formatCurrency(fund.invested)} logged into expenses!`);
      if (typeof window.launchConfetti === 'function') {
        window.launchConfetti(e.clientX, e.clientY);
      }
    });
  });
}

// ─── Event Listeners ───────────────
function initEvents() {
  // Navigation
  $$('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
      if (DOM.sidebar) DOM.sidebar.classList.remove('open');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (backdrop) backdrop.classList.remove('active');
    });
  });

  // Mobile menu & backdrop overlay
  const backdrop = document.getElementById('sidebar-backdrop');
  if (DOM.menuToggle) {
    DOM.menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.sidebar.classList.toggle('open');
      if (backdrop) backdrop.classList.toggle('active', DOM.sidebar.classList.contains('open'));
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      DOM.sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    });
  }

  // Month navigation
  DOM.prevMonth.addEventListener('click', () => changeMonth(-1));
  DOM.nextMonth.addEventListener('click', () => changeMonth(1));

  // Add expense
  DOM.btnAddExpense.addEventListener('click', openAddExpense);

  // Expense form
  DOM.expenseForm.addEventListener('submit', saveExpense);
  DOM.modalClose.addEventListener('click', () => closeModal(DOM.expenseModal));
  DOM.btnCancel.addEventListener('click', () => closeModal(DOM.expenseModal));

  // Delete modal
  DOM.deleteModalClose.addEventListener('click', () => closeModal(DOM.deleteModal));
  DOM.btnDeleteCancel.addEventListener('click', () => closeModal(DOM.deleteModal));
  DOM.btnDeleteConfirm.addEventListener('click', confirmDelete);

  // Budget
  DOM.btnAddBudget.addEventListener('click', openBudgetModal);
  DOM.budgetForm.addEventListener('submit', saveBudget);
  DOM.budgetModalClose.addEventListener('click', () => closeModal(DOM.budgetModal));
  DOM.btnBudgetCancel.addEventListener('click', () => closeModal(DOM.budgetModal));

  // Search & filters
  DOM.searchInput.addEventListener('input', renderAllExpenses);
  DOM.filterCategory.addEventListener('change', renderAllExpenses);
  DOM.sortBy.addEventListener('change', renderAllExpenses);

  // View all expenses
  DOM.viewAllBtn.addEventListener('click', () => switchView('expenses'));

  // Chart toggle
  $$('.chart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.chart-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.trendMode = btn.dataset.chart;
      renderTrendChart();
    });
  });

  // Currency
  DOM.currencySelect.addEventListener('change', () => {
    state.currency = DOM.currencySelect.value;
    saveState();
    refreshCurrentView();
  });

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Ripple effects on primary buttons
  document.querySelectorAll('.btn-add-expense, .btn-primary, .btn-danger').forEach(btn => {
    btn.addEventListener('click', createRipple);
  });

  // Quote Next Button
  if (DOM.btnNextQuote) {
    DOM.btnNextQuote.addEventListener('click', renderNextQuote);
  }

  // Recurring Subscriptions Modal
  if (DOM.btnAddRecurring) {
    DOM.btnAddRecurring.addEventListener('click', openRecurringModal);
  }
  if (DOM.recurringForm) {
    DOM.recurringForm.addEventListener('submit', saveRecurring);
  }
  if (DOM.recurringModalClose) {
    DOM.recurringModalClose.addEventListener('click', () => closeModal(DOM.recurringModal));
  }
  if (DOM.btnRecurringCancel) {
    DOM.btnRecurringCancel.addEventListener('click', () => closeModal(DOM.recurringModal));
  }

  // Mutual Funds Modal
  if (DOM.btnAddFund) {
    DOM.btnAddFund.addEventListener('click', openFundModal);
  }
  if (DOM.fundForm) {
    DOM.fundForm.addEventListener('submit', saveFund);
  }
  if (DOM.fundModalClose) {
    DOM.fundModalClose.addEventListener('click', () => closeModal(DOM.fundModal));
  }
  if (DOM.btnFundCancel) {
    DOM.btnFundCancel.addEventListener('click', () => closeModal(DOM.fundModal));
  }

  // Auth Event Listeners
  if (DOM.tabLogin) {
    DOM.tabLogin.addEventListener('click', () => setAuthMode('login'));
  }
  if (DOM.tabSignup) {
    DOM.tabSignup.addEventListener('click', () => setAuthMode('signup'));
  }
  if (DOM.authForm) {
    DOM.authForm.addEventListener('submit', handleAuthSubmit);
  }
  if (DOM.btnGuestLogin) {
    DOM.btnGuestLogin.addEventListener('click', handleGuestLogin);
  }
  if (DOM.btnLogout) {
    DOM.btnLogout.addEventListener('click', logoutUser);
  }

  // Avatar picker
  document.querySelectorAll('.avatar-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      state.selectedAvatar = opt.dataset.avatar || '😎';
    });
  });
}

// ─── Modal: Fund ───────────────────
function openFundModal() {
  DOM.fundForm.reset();
  document.querySelector('.fund-prefix').textContent = getCurrencySymbol();
  openModal(DOM.fundModal);
}

function saveFund(e) {
  e.preventDefault();
  const name = DOM.fundName.value.trim();
  const category = DOM.fundCategory.value;
  const type = DOM.fundType.value;
  const invested = parseFloat(DOM.fundInvested.value);
  const current = parseFloat(DOM.fundCurrent.value);

  if (!name || isNaN(invested) || isNaN(current)) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  state.funds.push({ id: generateId(), name, category, type, invested, current });
  saveState();
  closeModal(DOM.fundModal);
  renderMutualFunds();
  showToast('Mutual Fund added to portfolio!');
  if (typeof window.launchConfetti === 'function') {
    window.launchConfetti(e.clientX, e.clientY);
  }
}

// ─── Authentication Logic ──────────
function setAuthMode(mode) {
  state.authMode = mode;
  if (mode === 'login') {
    DOM.tabLogin.classList.add('active');
    DOM.tabSignup.classList.remove('active');
    DOM.groupAvatar.style.display = 'none';
    DOM.authSubmitBtn.textContent = 'Sign In to Account';
  } else {
    DOM.tabSignup.classList.add('active');
    DOM.tabLogin.classList.remove('active');
    DOM.groupAvatar.style.display = 'block';
    DOM.authSubmitBtn.textContent = 'Create Fresh Account';
  }
}

function loginUser(user) {
  state.currentUser = user;
  localStorage.setItem('sp_active_user', JSON.stringify(user));

  // Record user login into User Database (Local & Cloud Firebase)
  try {
    if (typeof UserDBManager !== 'undefined') {
      UserDBManager.recordLogin(user);
    }
  } catch (e) {
    console.warn('UserDB record error:', e);
  }

  if (DOM.userAvatar) DOM.userAvatar.textContent = user.avatar || '👤';
  if (DOM.userName) DOM.userName.textContent = user.name || 'User';

  if (DOM.authOverlay) DOM.authOverlay.classList.add('hidden');

  loadState();
  refreshCurrentView();
  window.dispatchEvent(new Event('resize'));
  showToast(`Welcome to SpendPulse, ${user.name}! ${user.avatar || ''}`);
  if (typeof window.launchConfetti === 'function') {
    window.launchConfetti();
  }
}

function logoutUser() {
  state.currentUser = null;
  localStorage.removeItem('sp_active_user');

  state.expenses = [];
  state.budgets = [];
  state.recurring = [];
  state.funds = [];

  if (DOM.authOverlay) DOM.authOverlay.classList.remove('hidden');
  refreshCurrentView();
  showToast('Logged out. Your data is secure and locked.', 'info');
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const rawName = DOM.authUsername.value.trim();
  if (!rawName) return;

  const id = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const user = {
    id: id || 'user_' + Date.now(),
    name: rawName,
    avatar: state.authMode === 'signup' ? state.selectedAvatar : '😎',
  };

  loginUser(user);
}

function handleGuestLogin() {
  const guestUser = { id: 'demo_guest', name: 'Demo Guest', avatar: '⚡' };
  
  // Preload demo expenses if guest user is completely new
  const prefix = `sp_user_${guestUser.id}_`;
  if (!localStorage.getItem(prefix + 'expenses')) {
    const demoExpenses = [
      { id: 'exp_1', title: 'Groceries Supermarket', amount: 1450, date: new Date().toISOString().split('T')[0], category: 'groceries', notes: 'Monthly items' },
      { id: 'exp_2', title: 'Coffee & Snacks', amount: 320, date: new Date().toISOString().split('T')[0], category: 'food', notes: 'Work café' },
    ];
    localStorage.setItem(prefix + 'expenses', JSON.stringify(demoExpenses));
  }

  loginUser(guestUser);
}

// ─── PulseAI Chatbot Engine ───────────────────
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initPulseAIChatbot() {
  const triggerBtn = document.getElementById('chatbot-trigger');
  const chatWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const chatForm = document.getElementById('chatbot-form');
  const chatInput = document.getElementById('chatbot-input');
  const chatMessages = document.getElementById('chatbot-messages');
  const chatBadge = document.getElementById('chat-badge');
  const chipsContainer = document.getElementById('chatbot-chips');
  const settingsToggle = document.getElementById('chatbot-settings-toggle');
  const keyPopover = document.getElementById('chatbot-key-popover');
  const popoverCloseBtn = document.getElementById('popover-close-btn');

  // AI Provider Switcher Elements
  const tabGroq = document.getElementById('tab-provider-groq');
  const tabGemini = document.getElementById('tab-provider-gemini');
  const panelGroq = document.getElementById('panel-groq');
  const panelGemini = document.getElementById('panel-gemini');

  // Groq Controls
  const groqApiKeyInput = document.getElementById('groq-api-key');
  const groqModelSelect = document.getElementById('groq-model-select');
  const toggleGroqVisibility = document.getElementById('toggle-groq-visibility');

  // Gemini Controls
  const geminiApiKeyInput = document.getElementById('gemini-api-key');
  const geminiModelSelect = document.getElementById('gemini-model-select');
  const toggleGeminiVisibility = document.getElementById('toggle-gemini-visibility');

  // Action Buttons & Badges
  const saveKeyBtn = document.getElementById('btn-save-key');
  const clearKeyBtn = document.getElementById('btn-clear-key');
  const aiModelBadge = document.getElementById('ai-model-badge');
  const aiStatusText = document.getElementById('ai-status-text');
  const sendBtn = document.getElementById('chatbot-send');

  if (!triggerBtn || !chatWindow) return;

  // Ensure key popover starts hidden
  keyPopover?.classList.add('hidden');

  // Load saved state
  let activeProvider = localStorage.getItem('sp_ai_provider') || 'groq';
  let userGroqKey = localStorage.getItem('sp_groq_key') || '';
  let userGroqModel = localStorage.getItem('sp_groq_model') || 'llama-3.3-70b-versatile';
  let userGeminiKey = localStorage.getItem('sp_gemini_key') || '';
  let userGeminiModel = localStorage.getItem('sp_gemini_model') || 'gemini-2.0-flash';

  function updateProviderUI() {
    if (activeProvider === 'groq') {
      tabGroq?.classList.add('active');
      tabGemini?.classList.remove('active');
      panelGroq?.classList.remove('hidden');
      panelGemini?.classList.add('hidden');

      if (aiModelBadge) {
        let label = 'Llama 3.3';
        if (userGroqModel.includes('8b')) label = 'Llama 3.1 8B';
        else if (userGroqModel.includes('mixtral')) label = 'Mixtral 8x7B';
        aiModelBadge.textContent = userGroqKey ? `⚡ Groq ${label}` : `⚡ Groq (Offline Mode)`;
        aiModelBadge.className = 'gemini-badge groq-badge';
      }
      if (aiStatusText) {
        aiStatusText.innerHTML = userGroqKey
          ? `<span class="status-dot"></span> Powered by Groq AI (${escapeHTML(userGroqModel)})`
          : `<span class="status-dot" style="background:#eab308"></span> Built-in Smart Co-pilot`;
      }
    } else {
      tabGemini?.classList.add('active');
      tabGroq?.classList.remove('active');
      panelGemini?.classList.remove('hidden');
      panelGroq?.classList.add('hidden');

      if (aiModelBadge) {
        const label = userGeminiModel.includes('2.0') ? 'Gemini 2.0' : 'Gemini 1.5';
        aiModelBadge.textContent = userGeminiKey ? `✨ ${label}` : `✨ Gemini (Offline Mode)`;
        aiModelBadge.className = 'gemini-badge';
      }
      if (aiStatusText) {
        aiStatusText.innerHTML = userGeminiKey
          ? `<span class="status-dot"></span> Powered by Google Gemini`
          : `<span class="status-dot" style="background:#eab308"></span> Built-in Smart Co-pilot`;
      }
    }

    if (groqApiKeyInput) groqApiKeyInput.value = userGroqKey;
    if (groqModelSelect) groqModelSelect.value = userGroqModel;
    if (geminiApiKeyInput) geminiApiKeyInput.value = userGeminiKey;
    if (geminiModelSelect) geminiModelSelect.value = userGeminiModel;
  }

  // Initial UI sync
  updateProviderUI();

  // Tab switching
  tabGroq?.addEventListener('click', () => {
    activeProvider = 'groq';
    localStorage.setItem('sp_ai_provider', 'groq');
    updateProviderUI();
  });

  tabGemini?.addEventListener('click', () => {
    activeProvider = 'gemini';
    localStorage.setItem('sp_ai_provider', 'gemini');
    updateProviderUI();
  });

  // Password visibility toggles
  toggleGroqVisibility?.addEventListener('click', () => {
    if (!groqApiKeyInput) return;
    const isPass = groqApiKeyInput.type === 'password';
    groqApiKeyInput.type = isPass ? 'text' : 'password';
    toggleGroqVisibility.textContent = isPass ? '🙈' : '👁️';
  });

  toggleGeminiVisibility?.addEventListener('click', () => {
    if (!geminiApiKeyInput) return;
    const isPass = geminiApiKeyInput.type === 'password';
    geminiApiKeyInput.type = isPass ? 'text' : 'password';
    toggleGeminiVisibility.textContent = isPass ? '🙈' : '👁️';
  });

  // Save Key & Settings Handler
  saveKeyBtn?.addEventListener('click', () => {
    if (activeProvider === 'groq') {
      userGroqKey = (groqApiKeyInput?.value || '').trim();
      userGroqModel = groqModelSelect?.value || 'llama-3.3-70b-versatile';
      localStorage.setItem('sp_groq_key', userGroqKey);
      localStorage.setItem('sp_groq_model', userGroqModel);
      localStorage.setItem('sp_ai_provider', 'groq');

      keyPopover?.classList.add('hidden');
      updateProviderUI();

      if (userGroqKey) {
        showToast('⚡ Groq API Key saved successfully!', 'success');
        appendMessage('bot', `⚡ <strong>Groq API Key Saved!</strong> PulseAI is now powered by <strong>${groqModelSelect?.options[groqModelSelect.selectedIndex]?.text || userGroqModel}</strong> with ultra-fast inference. Ask me any financial question or budget query!`);
      } else {
        showToast('ℹ️ Groq Key cleared — using built-in co-pilot', 'info');
      }
    } else {
      userGeminiKey = (geminiApiKeyInput?.value || '').trim();
      userGeminiModel = geminiModelSelect?.value || 'gemini-2.0-flash';
      localStorage.setItem('sp_gemini_key', userGeminiKey);
      localStorage.setItem('sp_gemini_model', userGeminiModel);
      localStorage.setItem('sp_ai_provider', 'gemini');

      keyPopover?.classList.add('hidden');
      updateProviderUI();

      if (userGeminiKey) {
        showToast('🔑 Google Gemini API Key saved!', 'success');
        appendMessage('bot', `🔑 <strong>Google Gemini Key Saved!</strong> Connected to <strong>${geminiModelSelect?.options[geminiModelSelect.selectedIndex]?.text || userGeminiModel}</strong>. Ask me any question!`);
      } else {
        showToast('ℹ️ Gemini Key cleared — using built-in co-pilot', 'info');
      }
    }
  });

  // Clear Key Handler
  clearKeyBtn?.addEventListener('click', () => {
    if (activeProvider === 'groq') {
      userGroqKey = '';
      localStorage.removeItem('sp_groq_key');
      if (groqApiKeyInput) groqApiKeyInput.value = '';
      showToast('ℹ️ Groq API Key cleared', 'info');
    } else {
      userGeminiKey = '';
      localStorage.removeItem('sp_gemini_key');
      if (geminiApiKeyInput) geminiApiKeyInput.value = '';
      showToast('ℹ️ Gemini API Key cleared', 'info');
    }
    updateProviderUI();
  });

  // Save on Enter inside key inputs
  [groqApiKeyInput, geminiApiKeyInput].forEach(inp => {
    inp?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveKeyBtn?.click();
      }
    });
  });

  settingsToggle?.addEventListener('click', () => {
    keyPopover?.classList.toggle('hidden');
  });

  popoverCloseBtn?.addEventListener('click', () => {
    keyPopover?.classList.add('hidden');
  });

  function getCatLabel(catId) {
    const c = CATEGORIES.find(x => x.id === catId);
    return c ? `${c.emoji} ${c.label}` : catId;
  }

  // Toggle Chat Window
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chatWindow.classList.toggle('hidden');
    const isVisible = !chatWindow.classList.contains('hidden');
    triggerBtn.parentElement?.classList.toggle('active', isVisible);
    if (isVisible) {
      if (chatBadge) chatBadge.style.display = 'none';
      if (keyPopover) keyPopover.classList.add('hidden');
      setTimeout(() => chatInput?.focus(), 150);
    }
  });

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    chatWindow.classList.add('hidden');
    triggerBtn.parentElement?.classList.remove('active');
  });

  // Close when tapping outside on mobile
  document.addEventListener('click', (e) => {
    if (!chatWindow.classList.contains('hidden')) {
      if (!chatWindow.contains(e.target) && !triggerBtn.contains(e.target)) {
        chatWindow.classList.add('hidden');
        triggerBtn.parentElement?.classList.remove('active');
      }
    }
  });

  function executeQuery(q) {
    const query = (q || '').trim();
    if (!query) return;
    if (chatInput) chatInput.value = '';
    processUserQuery(query);
  }

  // Expose globally for instant button/console invocation
  window.sendPulseAIChat = executeQuery;

  // Handle Chips
  chipsContainer?.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-btn');
    if (!btn) return;
    const query = btn.dataset.query;
    if (query) {
      executeQuery(query);
    }
  });

  // Handle Form Submit
  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    executeQuery(chatInput.value);
  });

  // Handle Send Button Click directly
  sendBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    executeQuery(chatInput.value);
  });

  // Handle Enter Key inside chat input directly
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeQuery(chatInput.value);
    }
  });

  function appendMessage(sender, textHTML) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    if (sender === 'bot') {
      msgDiv.innerHTML = `
        <div class="chat-avatar-sm">✨</div>
        <div class="chat-bubble">${textHTML}</div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="chat-bubble">${escapeHTML(textHTML)}</div>
      `;
    }
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.id = 'chat-typing';
    typingDiv.innerHTML = `
      <div class="chat-avatar-sm">✨</div>
      <div class="chat-bubble" style="display:flex;gap:4px;align-items:center;padding:12px 18px;">
        <span style="width:6px;height:6px;background:#c7d2fe;border-radius:50%;animation:pulseDot 1s infinite"></span>
        <span style="width:6px;height:6px;background:#c7d2fe;border-radius:50%;animation:pulseDot 1s infinite 0.2s"></span>
        <span style="width:6px;height:6px;background:#c7d2fe;border-radius:50%;animation:pulseDot 1s infinite 0.4s"></span>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    document.getElementById('chat-typing')?.remove();
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/^Rule \d+.*$/gim, '')
      .replace(/^INSTRUCTIONS.*$/gim, '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n+/g, '<br><br>')
      .replace(/\n/g, '<br>');
    return html.trim();
  }

  function buildFinancialContext() {
    const cur = state.currency || '₹';
    const monthExp = getMonthExpenses();
    const totalSpent = monthExp.reduce((s, e) => s + e.amount, 0);
    const catTotals = {};
    monthExp.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });

    const recentTxns = monthExp.slice(0, 15).map(e => ({
      title: e.title,
      amount: `${cur}${e.amount}`,
      category: CATEGORIES.find(c => c.id === e.category)?.label || e.category,
      date: e.date,
      notes: e.notes || ''
    }));

    const budgetStatus = state.budgets.map(b => {
      const spent = catTotals[b.category] || 0;
      const pct = Math.round((spent / b.limit) * 100);
      return {
        category: CATEGORIES.find(c => c.id === b.category)?.label || b.category,
        limit: `${cur}${b.limit}`,
        spent: `${cur}${spent}`,
        percentage_used: `${pct}%`,
        status: pct >= 100 ? 'OVER BUDGET 🚨' : pct >= 80 ? 'WARNING ⚠️' : 'HEALTHY ✅'
      };
    });

    const context = {
      app: 'SpendPulse Personal Finance Dashboard',
      user: state.currentUser?.name || 'User',
      currency: cur,
      this_month_total_spent: `${cur}${totalSpent.toFixed(2)}`,
      transaction_count: monthExp.length,
      category_totals: Object.fromEntries(
        Object.entries(catTotals).map(([k, v]) => [CATEGORIES.find(c => c.id === k)?.label || k, `${cur}${v.toFixed(2)}`])
      ),
      recent_transactions: recentTxns,
      budget_health: budgetStatus,
      investment_portfolio: state.funds.map(f => ({ name: f.name, current_val: `${cur}${f.current}` }))
    };

    const systemPrompt = `You are PulseAI, a smart personal financial advisor embedded in SpendPulse.
User's Live Financial Snapshot:
${JSON.stringify(context, null, 2)}

Provide a direct, helpful, and beautifully formatted response using the live financial data above. Reference exact transaction names, amounts, top categories, and budget percentages. Do not mention rule numbers or instructions. Use bold text, bullet points, and emojis.`;

    return { context, systemPrompt };
  }

  async function callGroqAPI(query) {
    let activeKey = (localStorage.getItem('sp_groq_key') || groqApiKeyInput?.value?.trim() || userGroqKey || '').trim();
    activeKey = activeKey.replace(/^["']|["']$/g, '');

    if (!activeKey) {
      return generateLocalAIResponse(query);
    }

    const { systemPrompt } = buildFinancialContext();
    const selectedModel = localStorage.getItem('sp_groq_model') || groqModelSelect?.value || 'llama-3.3-70b-versatile';
    const modelsToTry = [selectedModel, 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
    const uniqueModels = [...new Set(modelsToTry)];

    let lastError = '';

    for (const model of uniqueModels) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: query }
            ],
            temperature: 0.6,
            max_tokens: 800
          })
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.choices?.[0]?.message?.content) {
          return formatMarkdown(data.choices[0].message.content);
        }

        if (data.error?.message) {
          lastError = data.error.message;
          if (res.status === 401 || data.error.code === 'invalid_api_key') {
            return `⚠️ <strong>Groq API Error:</strong> Invalid API Key. Please verify your Groq key (starts with <code>gsk_...</code>) in Settings (⚙️).<br><br>${generateLocalAIResponse(query)}`;
          }
        }
      } catch (err) {
        lastError = err.message || 'Network Error';
      }
    }

    return `⚠️ <strong>Groq Notice:</strong> Could not connect to Groq servers (${escapeHTML(lastError)}). Falling back to built-in co-pilot:<br><br>${generateLocalAIResponse(query)}`;
  }

  async function callGeminiAPI(query) {
    let activeKey = (localStorage.getItem('sp_gemini_key') || geminiApiKeyInput?.value?.trim() || userGeminiKey || '').trim();
    activeKey = activeKey.replace(/^["']|["']$/g, '');

    if (!activeKey) {
      return generateLocalAIResponse(query);
    }

    const { systemPrompt } = buildFinancialContext();
    const selectedModel = localStorage.getItem('sp_gemini_model') || geminiModelSelect?.value || 'gemini-2.0-flash';
    const modelsToTry = [selectedModel, 'gemini-2.0-flash', 'gemini-1.5-flash'];
    const uniqueModels = [...new Set(modelsToTry)];
    let lastError = '';

    for (const model of uniqueModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(activeKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }] }
            ],
            generationConfig: { maxOutputTokens: 600, temperature: 0.7 }
          })
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return formatMarkdown(data.candidates[0].content.parts[0].text);
        }

        if (data.error?.message) {
          lastError = data.error.message;
          if (data.error.status === 'INVALID_ARGUMENT' || data.error.message.includes('API key')) {
            return `⚠️ <strong>Gemini API Error:</strong> Invalid Google Gemini API Key. Please verify in Settings (⚙️).<br><br>${generateLocalAIResponse(query)}`;
          }
        }
      } catch (err) {
        lastError = err.message || 'Network Error';
      }
    }

    return `⚠️ <strong>Gemini Notice:</strong> Could not connect to Google Gemini servers (${escapeHTML(lastError)}). Falling back to built-in co-pilot:<br><br>${generateLocalAIResponse(query)}`;
  }

  async function processUserQuery(rawQuery) {
    appendMessage('user', rawQuery);
    showTypingIndicator();

    try {
      // Check instant action command first
      const lower = rawQuery.toLowerCase();
      const addMatch = lower.match(/(?:add|create|spent|save)\s+(?:expense\s+)?(?:(\d+(?:\.\d+)?)\s+(?:for\s+)?([a-z0-9\s]+)|([a-z0-9\s]+)\s+(?:for\s+)?(\d+(?:\.\d+)?))/i);
      if (addMatch) {
        setTimeout(() => {
          removeTypingIndicator();
          const response = generateLocalAIResponse(rawQuery);
          appendMessage('bot', response);
        }, 300);
        return;
      }

      // Route to active provider
      const responseHTML = (activeProvider === 'groq')
        ? await callGroqAPI(rawQuery)
        : await callGeminiAPI(rawQuery);

      removeTypingIndicator();
      appendMessage('bot', responseHTML);
    } catch (err) {
      removeTypingIndicator();
      appendMessage('bot', `⚠️ <strong>Notice:</strong> ${escapeHTML(err.message)}<br><br>${generateLocalAIResponse(rawQuery)}`);
    }
  }

  function generateLocalAIResponse(q) {
    if (!q || !q.trim()) {
      return `Please ask a question! For example: <em>"How to avoid overspending?"</em>, <em>"Monthly summary"</em>, or <em>"How much did I spend on Food?"</em>`;
    }

    const raw = q.trim();
    // Normalize typos and common variations
    let lower = raw.toLowerCase()
      .replace(/\baviod\b/g, 'avoid')
      .replace(/\bspeend\w*\b/g, 'spend')
      .replace(/\boverspen\w*\b/g, 'overspend')
      .replace(/\bexpen\w*\b/g, 'expense')
      .replace(/\bbudg\w*\b/g, 'budget')
      .replace(/\bcatg\w*\b/g, 'category')
      .replace(/\breduc\w*\b/g, 'reduce')
      .replace(/\bsav\w*\b/g, 'save')
      .replace(/\binves\w*\b/g, 'invest');

    const cur = state.currency || '₹';
    const monthExp = getMonthExpenses();
    const totalSpent = monthExp.reduce((s, e) => s + e.amount, 0);
    const catTotals = {};
    monthExp.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
    const topCatKey = Object.keys(catTotals).length > 0
      ? Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b)
      : null;
    const highestExp = monthExp.length > 0
      ? [...monthExp].sort((a, b) => b.amount - a.amount)[0]
      : null;

    // 0. Greetings / Casual interaction
    if (lower.match(/^(hi|hello|hey|greetings|hola|sup|who are you|what can you do|what are you)/i)) {
      return `👋 Hello! I'm <strong>PulseAI</strong>, your intelligent financial co-pilot.<br><br>
        Ask me anything about your finances or money management, such as:<br>
        • <em>"How to avoid overspending?"</em><br>
        • <em>"How much have I spent this month?"</em><br>
        • <em>"How can I save more money?"</em><br>
        • <em>"What is my highest expense?"</em><br>
        • <em>"Add 50 for Lunch"</em>`;
    }

    // 1. Natural Language Action: Add Expense ("Add 50 for Coffee", "Spent 100 on groceries")
    const addMatch = lower.match(/(?:add|create|spent|save|record|paid)\s+(?:expense\s+)?(?:(\d+(?:\.\d+)?)\s+(?:for|on|in)?\s+([a-z0-9\s]+)|([a-z0-9\s]+)\s+(?:for|on|in)?\s+(\d+(?:\.\d+)?))/i);
    if (addMatch && !lower.includes('how') && !lower.includes('should') && !lower.includes('can i')) {
      let amount = parseFloat(addMatch[1] || addMatch[4]);
      let title = (addMatch[2] || addMatch[3] || 'Expense').trim();
      title = title.charAt(0).toUpperCase() + title.slice(1);

      if (!isNaN(amount) && amount > 0) {
        let category = 'other';
        if (title.match(/coffee|food|lunch|dinner|breakfast|snack|burger|pizza|restaurant|grocery|groceries|swiggy|zomato/i)) category = 'food';
        else if (title.match(/bus|uber|cab|metro|fuel|gas|petrol|diesel|taxi|train|flight|ola|auto/i)) category = 'transport';
        else if (title.match(/movie|game|netflix|spotify|party|ticket|concert|cinema/i)) category = 'entertainment';
        else if (title.match(/electricity|water|wifi|internet|rent|bill|recharge|mobile/i)) category = 'bills';
        else if (title.match(/shirt|shoes|clothes|amazon|flipkart|shopping|mall|dress/i)) category = 'shopping';
        else if (title.match(/doctor|medicine|health|gym|pharmacy|hospital|fitness/i)) category = 'health';

        const newExp = {
          id: 'exp_' + Date.now(),
          title: title,
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          category: category,
          notes: 'Added via PulseAI'
        };

        state.expenses.unshift(newExp);
        saveState();
        renderCurrentView();

        return `✅ <strong>Expense Logged!</strong><br>Added <strong>${cur}${amount.toFixed(2)}</strong> for <strong>${escapeHTML(title)}</strong> categorized under <em>${getCatLabel(category)}</em>. Your updated total for this month is <strong>${cur}${(totalSpent + amount).toFixed(2)}</strong>.`;
      }
    }

    // 2. OVERSPENDING / Avoiding impulse spending / Controlling expenses
    if (lower.includes('overspend') || (lower.includes('avoid') && (lower.includes('spend') || lower.includes('expense'))) ||
        lower.includes('impulse') || lower.includes('stop spend') || lower.includes('cut spend') ||
        lower.includes('reduce spend') || lower.includes('control spend') || lower.includes('too much spend') ||
        lower.includes('waste money') || lower.includes('curb spend') || lower.includes('spending too much')) {
      
      const topCatText = topCatKey
        ? `Your highest spending category right now is <strong>${getCatLabel(topCatKey)}</strong> at <strong>${cur}${catTotals[topCatKey].toFixed(2)}</strong> (${Math.round((catTotals[topCatKey] / (totalSpent || 1)) * 100)}% of total spending).`
        : `You haven't recorded expenses yet this month, which is the perfect time to build healthy habits!`;

      const highestExpText = highestExp
        ? `Your single largest expense so far is <strong>"${escapeHTML(highestExp.title)}"</strong> at <strong>${cur}${highestExp.amount.toFixed(2)}</strong>.`
        : ``;

      return `🛡️ <strong>Masterplan: How to Avoid Overspending</strong><br><br>
        ${topCatText} ${highestExpText}<br><br>
        Here are <strong>5 actionable strategies</strong> to immediately regain control:<br><br>
        <strong>1. Implement the 48-Hour Cooling Rule:</strong><br>
        Before buying anything non-essential, enforce an intentional 48-hour wait. In 75% of cases, the emotional impulse fades and you will decide against buying it.<br><br>
        <strong>2. Target Your #1 Spending Leak:</strong><br>
        ${topCatKey ? `Focus strictly on reducing your <strong>${getCatLabel(topCatKey)}</strong> expenses by just 15%. That will save you <strong>${cur}${(catTotals[topCatKey] * 0.15).toFixed(0)}</strong> right away.` : `Pick your top discretionary spending category and set a firm limit.`}<br><br>
        <strong>3. Delete Stored Payment Methods:</strong><br>
        Remove saved credit cards and auto-fill payment credentials from shopping and delivery apps. Adding physical friction stops unconscious 1-click purchases.<br><br>
        <strong>4. The 50/30/20 Budgeting Rule:</strong><br>
        Keep <strong>Needs</strong> capped at 50%, allow a maximum of <strong>30% for Wants</strong>, and automatically send <strong>20% to Savings</strong> the moment your salary arrives.<br><br>
        <strong>5. Set Hard Category Budgets:</strong><br>
        Go to the <strong>Budgets</strong> tab in SpendPulse and set spending caps on Dining, Shopping, and Entertainment so you get alerts before overspending.`;
    }

    // 3. SAVINGS / How to save money / Frugal living
    if (lower.includes('how to save') || lower.includes('save money') || lower.includes('saving tip') ||
        lower.includes('save more') || lower.includes('saving advice') || lower.includes('frugal') ||
        lower.includes('ways to save') || lower.includes('increase saving')) {

      const target20 = (totalSpent * 0.25).toFixed(0);

      return `💡 <strong>Proven Strategies to Save More Money:</strong><br><br>
        Your current month's recorded expenditure is <strong>${cur}${totalSpent.toFixed(2)}</strong>. To maintain optimal financial health, your recommended monthly savings target should be at least <strong>${cur}${target20}</strong>.<br><br>
        <strong>Top 4 Practical Tactics:</strong><br>
        • <strong>Pay Yourself First:</strong> Move your savings into an investment account on day 1 of the month, not whatever is left at the end of the month.<br>
        • <strong>Subscription Audit:</strong> Go to the <em>Recurring & Bills</em> section and cancel any service you haven't used in the past 30 days.<br>
        • <strong>Cook at Home Challenge:</strong> Preparing meals at home 5 days a week typically saves an average household ${cur}3,000–${cur}8,000 per month compared to food delivery.<br>
        • <strong>Automate Micro-SIPs:</strong> Put savings on autopilot in low-cost index funds so compounding works for you 24/7.`;
    }

    // 4. BUDGETING / How to create a budget / Budget status
    if (lower.includes('budget') || lower.includes('limit') || lower.includes('50/30/20') || lower.includes('envelope')) {
      if (state.budgets.length > 0) {
        let budgetList = '';
        state.budgets.forEach(b => {
          const spent = catTotals[b.category] || 0;
          const pct = Math.round((spent / b.limit) * 100);
          const badge = pct >= 100 ? '🚨 OVER BUDGET' : pct >= 80 ? '⚠️ WARNING' : '✅ HEALTHY';
          budgetList += `<li><strong>${getCatLabel(b.category)}</strong>: ${cur}${spent.toFixed(0)} / ${cur}${b.limit} (${pct}%) — <em>${badge}</em></li>`;
        });

        return `🎯 <strong>Your Current Budget Status:</strong><br>
          <ul>${budgetList}</ul>
          <strong>Rule of thumb:</strong> If any category reaches 80%, pause non-critical purchases in that category until next month!`;
      } else {
        return `🎯 <strong>How to Create an Effective Budget (50/30/20 Method):</strong><br><br>
          <strong>1. 50% Needs:</strong> Essential living expenses (Rent, Groceries, Utilities, Health).<br>
          <strong>2. 30% Wants:</strong> Lifestyle choices (Dining out, Entertainment, Shopping).<br>
          <strong>3. 20% Savings:</strong> Emergency fund, Mutual Fund SIPs, and investments.<br><br>
          👉 <em>Tip: You don't have any budgets configured yet! Click on the <strong>Budgets</strong> tab in the sidebar to add your first monthly spending limit.</em>`;
      }
    }

    // 5. EMERGENCY FUND / Safety Net
    if (lower.includes('emergency') || lower.includes('safety net') || lower.includes('rainy day') || lower.includes('contingency')) {
      const runRate = totalSpent > 0 ? totalSpent : 15000;
      const threeMo = (runRate * 3).toLocaleString('en-US');
      const sixMo = (runRate * 6).toLocaleString('en-US');

      return `🛡️ <strong>Emergency Fund Blueprint:</strong><br><br>
        An emergency fund protects you against sudden medical bills, unexpected repairs, or job loss without going into high-interest debt.<br><br>
        • <strong>Minimum Target (3 Months):</strong> <strong>${cur}${threeMo}</strong><br>
        • <strong>Recommended Target (6 Months):</strong> <strong>${cur}${sixMo}</strong><br><br>
        <strong>Where to keep it:</strong><br>
        Keep this money in a liquid fund or auto-sweep bank account that is accessible within 24 hours but kept separate from your everyday spending account!`;
    }

    // 6. INVESTMENTS / Mutual Funds / SIP / Stocks / Compounding / Wealth
    if (lower.includes('invest') || lower.includes('mutual fund') || lower.includes('sip') ||
        lower.includes('stock') || lower.includes('wealth') || lower.includes('compound') || lower.includes('portfolio')) {
      
      const fundCount = state.funds ? state.funds.length : 0;
      const totalFundVal = state.funds ? state.funds.reduce((s, f) => s + f.current, 0) : 0;
      const fundInfo = fundCount > 0
        ? `You currently have <strong>${fundCount} active funds</strong> tracked in SpendPulse worth <strong>${cur}${totalFundVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>.`
        : `You haven't added any investments yet. Check the <em>Mutual Funds & SIPs</em> view to start tracking your portfolio.`;

      return `📈 <strong>Smart Investing & Wealth Creation:</strong><br><br>
        ${fundInfo}<br><br>
        <strong>Core Investment Principles:</strong><br>
        • <strong>Start with Low-Cost Index Funds:</strong> Over 80% of active funds fail to beat broad market indices over a 10-year horizon.<br>
        • <strong>Power of Systematic Investment Plans (SIP):</strong> Investing a fixed sum monthly provides rupee-cost averaging, smoothing out market volatility.<br>
        • <strong>Rule of 72:</strong> Divide 72 by your expected annual return rate (e.g., 12% return = 72/12 = 6 years) to see how fast your money doubles.<br>
        • <strong>Never invest your emergency fund:</strong> Only invest money you won't need for at least 3–5 years.`;
    }

    // 7. DEBT / Credit cards / Loans / EMI
    if (lower.includes('debt') || lower.includes('loan') || lower.includes('credit card') ||
        lower.includes('emi') || lower.includes('interest rate') || lower.includes('pay off')) {
      return `💳 <strong>Debt Elimination Masterplan:</strong><br><br>
        High-interest debt (like credit card rollover at 36–42% APR) is the #1 destroyer of wealth.<br><br>
        <strong>Two Proven Strategies to Clear Debt:</strong><br>
        • <strong>Debt Avalanche (Mathematically Optimal):</strong> Pay minimums on all debts, then put all extra cash toward the balance with the <em>highest interest rate</em>. Saves the most money in interest.<br>
        • <strong>Debt Snowball (Psychologically Motivating):</strong> Pay off the <em>smallest debt first</em> regardless of interest rate. Quick wins build momentum!<br><br>
        👉 <em>Golden Rule: Always pay credit card balances in full before the due date. Never pay just the minimum amount due.</em>`;
    }

    // 8. CATEGORY SPECIFIC QUERIES ("How much did I spend on food?", "Shopping costs", etc.)
    const categoryKeywords = {
      food: ['food', 'dining', 'restaurant', 'groceries', 'coffee', 'lunch', 'dinner', 'snacks'],
      transport: ['transport', 'travel', 'fuel', 'cab', 'uber', 'petrol', 'bus', 'train', 'flight'],
      entertainment: ['entertainment', 'movies', 'netflix', 'party', 'games', 'fun'],
      shopping: ['shopping', 'clothes', 'amazon', 'shoes', 'gadgets', 'mall'],
      bills: ['bill', 'bills', 'electricity', 'wifi', 'internet', 'rent', 'utilities', 'recharge'],
      health: ['health', 'medical', 'medicine', 'doctor', 'gym', 'fitness', 'pharmacy']
    };

    for (const [catId, words] of Object.entries(categoryKeywords)) {
      if (words.some(w => lower.includes(w))) {
        const matchingExp = monthExp.filter(e => e.category === catId);
        const catSum = matchingExp.reduce((s, e) => s + e.amount, 0);
        const pct = totalSpent > 0 ? Math.round((catSum / totalSpent) * 100) : 0;
        const recentItems = matchingExp.slice(0, 3).map(e => `${escapeHTML(e.title)} (${cur}${e.amount})`).join(', ');

        return `📊 <strong>${getCatLabel(catId)} Spending Breakdown:</strong><br><br>
          • Total Spent This Month: <strong>${cur}${catSum.toFixed(2)}</strong> (${pct}% of total expenses)<br>
          • Total Transactions: <strong>${matchingExp.length}</strong><br>
          • Recent Items: ${recentItems || 'None yet'}<br><br>
          💡 <em>Tip: If this is higher than planned, try setting a monthly category cap in the <strong>Budgets</strong> section to prevent overspending!</em>`;
      }
    }

    // 9. HIGHEST / LARGEST EXPENSE
    if (lower.includes('highest') || lower.includes('biggest') || lower.includes('largest') || lower.includes('maximum')) {
      if (!highestExp) {
        return `You have no recorded expenses for this month yet.`;
      }
      return `🔥 <strong>Highest Expense This Month:</strong><br><br>
        Your single largest expenditure was <strong>"${escapeHTML(highestExp.title)}"</strong> for <strong>${cur}${highestExp.amount.toFixed(2)}</strong> on ${highestExp.date} under <em>${getCatLabel(highestExp.category)}</em>.<br><br>
        This single purchase accounted for <strong>${Math.round((highestExp.amount / (totalSpent || 1)) * 100)}%</strong> of your total spending this month.`;
    }

    // 10. MONTHLY SUMMARY / OVERVIEW
    if (lower.includes('summary') || lower.includes('total') || lower.includes('spent') ||
        lower.includes('overview') || lower.includes('how much') || lower.includes('analytics')) {
      if (monthExp.length === 0) {
        return `You haven't recorded any expenses for this month yet. Start by asking me to <code>Add 50 for Lunch</code> or clicking the <strong>+</strong> button!`;
      }

      const recent3 = monthExp.slice(0, 3).map(e => `<em>${escapeHTML(e.title)}</em> (${cur}${e.amount})`).join(', ');
      const daysSoFar = Math.max(new Date().getDate(), 1);
      const dailyAvg = (totalSpent / daysSoFar).toFixed(2);

      return `📊 <strong>This Month's Financial Summary:</strong><br><br>
        • Total Expenditure: <strong>${cur}${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong><br>
        • Transactions Count: <strong>${monthExp.length} transactions</strong><br>
        • Daily Average: <strong>${cur}${dailyAvg}</strong>/day<br>
        • Top Category: <strong>${topCatKey ? getCatLabel(topCatKey) : 'None'}</strong> (${cur}${(catTotals[topCatKey] || 0).toFixed(2)})<br>
        • Recent Activity: ${recent3 || 'None'}`;
    }

    // 11. DYNAMIC INTELLIGENT ADVISOR for Any Other Financial Question
    // Instead of giving a canned fallback, provide tailored financial guidance directly!
    return `⚡ <strong>PulseAI Financial Insight:</strong><br><br>
      Regarding <em>"${escapeHTML(raw)}"</em>:<br><br>
      <strong>1. Evaluate Need vs. Want:</strong><br>
      Before committing financial resources, check if this directly impacts your foundational needs (housing, food, health) or lifestyle preferences. Maintain a 50/30/20 balance.<br><br>
      <strong>2. Current Cashflow Context:</strong><br>
      You have spent <strong>${cur}${totalSpent.toFixed(2)}</strong> this month across ${monthExp.length} transactions. Keep discretionary spending capped so you preserve at least 20% for future goals.<br><br>
      <strong>3. Actionable Next Step:</strong><br>
      Track this decision in SpendPulse by adding any planned expenditure or checking your budget limits in the <strong>Budgets</strong> tab!<br><br>
      💬 <em>Need specifics? Ask me about <strong>"How to avoid overspending"</strong>, <strong>"Top category"</strong>, or <strong>"How to budget"</strong>!</em>`;
  }
}

// ─── Header Date Formatter ─────────
function updateHeaderDate() {
  if (DOM.headerDate) {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    DOM.headerDate.textContent = today.toLocaleDateString('en-GB', options);
  }
}

// Re-render responsive charts on viewport resize/orientation
window.addEventListener('resize', () => {
  if (state.currentView === 'dashboard') {
    renderTrendChart();
    renderCategoryChart();
  } else if (state.currentView === 'analytics') {
    renderMonthlyComparison();
  }
});

// ─── Silent Google Sheets User Database & Login Tracker ─────────
// Set your deployed Google Apps Script Web App URL below:
const GOOGLE_SHEETS_WEBHOOK_URL = ''; 

const UserDBManager = {
  init() {
    // Ready
  },

  recordLogin(user) {
    if (!user || !user.name) return;

    const isMobile = window.innerWidth <= 768 || /mobile|iphone|ipad|android/i.test(navigator.userAgent);
    const platform = isMobile ? 'Mobile' : 'Desktop';
    const browser = navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Browser';
    const deviceStr = `${platform} (${browser})`;
    
    // Formatted date and time (IST)
    const timestamp = new Date().toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });

    // 1. Calculate user login count
    let loginCount = 1;
    try {
      let users = JSON.parse(localStorage.getItem('sp_users_db') || '[]');
      let existing = users.find(u => u.username.toLowerCase() === user.name.toLowerCase());
      if (existing) {
        existing.loginCount = (existing.loginCount || 1) + 1;
        existing.lastActive = timestamp;
        loginCount = existing.loginCount;
      } else {
        users.push({
          username: user.name,
          loginCount: 1,
          firstRegistered: timestamp,
          lastActive: timestamp,
          device: deviceStr
        });
      }
      localStorage.setItem('sp_users_db', JSON.stringify(users));
    } catch (e) {
      console.warn('Local log error:', e);
    }

    // 2. Silently send login record to Google Sheets in background
    const webhookUrl = localStorage.getItem('sp_sheets_url') || GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      const payload = {
        username: user.name,
        accountType: user.id === 'demo_guest' ? 'Demo Guest' : 'Registered Member',
        loginCount: loginCount,
        device: deviceStr,
        timestamp: timestamp
      };

      try {
        fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => {
          // Silent catch — never interrupts regular user experience
        });
      } catch (err) {
        // Silent catch
      }
    }
  }
};

// ─── Initialize ────────────────────
function init() {
  try {
    initPulseAIChatbot();
  } catch (err) {
    console.error('PulseAI Chatbot init error:', err);
  }
  loadTheme();
  updateHeaderDate();
  updateMonthLabel();
  populateFilterDropdown();
  initEvents();
  UserDBManager.init();

  // Check saved session
  const savedUser = localStorage.getItem('sp_active_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      loginUser(user);
    } catch (e) {
      if (DOM.authOverlay) DOM.authOverlay.classList.remove('hidden');
    }
  } else {
    // Show Auth Overlay
    if (DOM.authOverlay) DOM.authOverlay.classList.remove('hidden');
  }

  // Welcome Toast with Financial Quote
  setTimeout(() => {
    const q = FINANCIAL_QUOTES[Math.floor(Math.random() * FINANCIAL_QUOTES.length)];
    showToast(`💡 Wisdom: "${q.quote}" — ${q.author}`, 'info');
  }, 800);
}

document.addEventListener('DOMContentLoaded', init);
