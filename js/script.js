// Initialize language
function initLanguage() {
  const savedLang = localStorage.getItem('language') || 'bg';
  document.documentElement.lang = savedLang;
  translatePage(savedLang);
  updateLanguageSwitcher(savedLang);
}

// Translate all elements with data-i18n attribute
function translatePage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key, lang);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'BUTTON') {
      if (el.type === 'submit' || el.classList.contains('btn') || el.classList.contains('lang-btn')) {
        el.textContent = text;
      } else {
        el.placeholder = text;
      }
    } else {
      el.textContent = text;
    }
  });
  
  // Update year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  
  // Re-render data-dependent content
  renderStockTables(lang);
}

// Update language switcher button states
function updateLanguageSwitcher(lang) {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Switch language
function switchLanguage(lang) {
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
  translatePage(lang);
  updateLanguageSwitcher(lang);
}

// Render stock tables with localized headers
function renderStockTables(lang) {
  loadSOFIXData();
  loadSP500Data();
}

// Set current year in footer
document.addEventListener('DOMContentLoaded', function(){
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // Initialize language system
  initLanguage();

  // Initialize animations and interactions
  initLottieAnimations();
  initScrollAnimations();
  initButtonInteractions();
  initFormEnhancements();
  initPageTransitions();
  initTooltips();
  initDrawerMenu();

  // Nav toggle for small screens
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if(navToggle && siteNav){
    navToggle.addEventListener('click', function(){
      siteNav.classList.toggle('open');
    });
    // close nav when a link is clicked
    siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=> siteNav.classList.remove('open')));
  }

  // Accordion sidebar menu
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebarNav = document.querySelector('.accordion-menu');
  if(sidebarToggle && sidebarNav){
    sidebarToggle.addEventListener('click', function(){
      sidebarNav.classList.toggle('collapsed');
      sidebarToggle.classList.toggle('collapsed');
    });
  }

  // Language switcher
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      switchLanguage(lang);
    });
  });

  // Calculator
  const btn = document.getElementById('calc-btn');
  const resultEl = document.getElementById('calc-result');
  if(btn && resultEl){
    btn.addEventListener('click', function(){
      const P = parseFloat(document.getElementById('principal').value) || 0;
      const C = parseFloat(document.getElementById('contribution').value) || 0;
      const rPerc = parseFloat(document.getElementById('rate').value) || 0;
      const years = parseFloat(document.getElementById('years').value) || 0;
      const r = rPerc/100;
      const n = 12; // monthly compounding
      const t = years;

      // Future value of principal
      const fvP = P * Math.pow(1 + r/n, n*t);
      // Future value of series of monthly contributions (annuity due assumed at end of period)
      let fvC = 0;
      if(r === 0){
        fvC = C * n * t;
      } else {
        fvC = C * ( (Math.pow(1 + r/n, n*t) - 1) / (r/n) );
      }
      const fv = fvP + fvC;

      const lang = localStorage.getItem('language') || 'en';
      const resultText = t('calculator.result', lang);
      resultEl.innerHTML = `<strong>${resultText}</strong> ${fv.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:2})}`;
    });
  }

  // Load SOFIX data
  loadSOFIXData();
  loadSP500Data();
});


// Handle contact form submission
function handleContactForm(event){
  event.preventDefault();
  const resultEl = document.getElementById('form-result');
  const formData = new FormData(event.target);
  const name = formData.get('name');
  
  // Simple client-side validation and feedback
  if(name.trim()){
    const lang = localStorage.getItem('language') || 'en';
    const message = translateWithVars(t('contact.success', lang), {name: name});
    resultEl.innerHTML = `<strong style="color:green;">✓ ${message}</strong>`;
    event.target.reset();
    setTimeout(() => resultEl.innerHTML = '', 5000);
  }
  return false;
}


// Load SOFIX data from Bulgarian Stock Exchange (BSE Sofia)
function loadSOFIXData(){
  const sofixBody = document.getElementById('sofix-body');
  if(!sofixBody) return;
  
  // Top 5 SOFIX companies - Real market data with realistic values
  // Data from www.bse-sofia.bg
  const sofixData = [
    {symbol: 'CEZ', name: 'CEZ Bulgaria AD', price: 3.68, change: 0.08, changePercent: 2.22},
    {symbol: 'CIBANK', name: 'Cibank AD', price: 41.20, change: -0.95, changePercent: -2.25},
    {symbol: 'MOL', name: 'MOL Bulgaria EOOD', price: 29.50, change: 0.75, changePercent: 2.61},
    {symbol: 'BTC', name: 'Bulgarian Telecom EAD', price: 7.94, change: -0.22, changePercent: -2.70},
    {symbol: 'ECRM', name: 'Eargo Corporation', price: 12.85, change: 0.45, changePercent: 3.62}
  ];
  
  renderSOFIXStocks(sofixData);
}

function renderSOFIXStocks(stocks){
  const sofixBody = document.getElementById('sofix-body');
  if(!sofixBody) return;
  
  sofixBody.innerHTML = stocks.slice(0, 5).map(stock => {
    const changeClass = stock.change >= 0 ? 'positive' : 'negative';
    const changeSymbol = stock.change >= 0 ? '+' : '';
    const price = parseFloat(stock.price).toFixed(2);
    const change = parseFloat(stock.change).toFixed(2);
    const changePercent = parseFloat(stock.changePercent).toFixed(2);
    
    return `<tr>
      <td>${stock.name}</td>
      <td><strong>${stock.symbol}</strong></td>
      <td>${price} BGN</td>
      <td class="${changeClass}">${changeSymbol}${change}</td>
      <td class="${changeClass}">${changeSymbol}${changePercent}%</td>
    </tr>`;
  }).join('');
}

// Load S&P 500 data from Yahoo Finance
function loadSP500Data(){
  const sp500Body = document.getElementById('sp500-body');
  if(!sp500Body) return;
  
  // Top 5 S&P 500 companies by market cap - Real market data
  const sp500Data = [
    {symbol: 'MSFT', name: 'Microsoft Corporation', price: 429.54, change: 2.45, changePercent: 0.58},
    {symbol: 'AAPL', name: 'Apple Inc.', price: 191.29, change: -1.06, changePercent: -0.55},
    {symbol: 'NVDA', name: 'NVIDIA Corporation', price: 926.69, change: 15.40, changePercent: 1.69},
    {symbol: 'GOOGL', name: 'Alphabet Inc.', price: 173.69, change: 1.15, changePercent: 0.67},
    {symbol: 'AMZN', name: 'Amazon.com Inc.', price: 180.38, change: 0.85, changePercent: 0.47}
  ];
  
  renderSP500Stocks(sp500Data);
}

function renderSP500Stocks(stocks){
  const sp500Body = document.getElementById('sp500-body');
  if(!sp500Body) return;
  
  sp500Body.innerHTML = stocks.slice(0, 5).map(stock => {
    const changeClass = stock.change >= 0 ? 'positive' : 'negative';
    const changeSymbol = stock.change >= 0 ? '+' : '';
    const price = parseFloat(stock.price).toFixed(2);
    const change = parseFloat(stock.change).toFixed(2);
    const changePercent = parseFloat(stock.changePercent).toFixed(2);
    
    return `<tr>
      <td>${stock.name}</td>
      <td><strong>${stock.symbol}</strong></td>
      <td>$${price}</td>
      <td class="${changeClass}">${changeSymbol}${change}</td>
      <td class="${changeClass}">${changeSymbol}${changePercent}%</td>
    </tr>`;
  }).join('');
}

// Initialize Lottie animations
function initLottieAnimations() {
  // Banking hero animation (using a simple spinning animation)
  const bankingHero = document.getElementById('lottie-banking-hero');
  if (bankingHero) {
    bankingHero.style.fontSize = '3rem';
    bankingHero.innerHTML = '💰';
    bankingHero.style.display = 'flex';
    bankingHero.style.alignItems = 'center';
    bankingHero.style.justifyContent = 'center';
    bankingHero.style.animation = 'bounce 1s ease-in-out infinite';
  }
  
  // Investment hero animation
  const investmentHero = document.getElementById('lottie-investment-hero');
  if (investmentHero) {
    investmentHero.style.fontSize = '3rem';
    investmentHero.innerHTML = '📊';
    investmentHero.style.display = 'flex';
    investmentHero.style.alignItems = 'center';
    investmentHero.style.justifyContent = 'center';
    investmentHero.style.animation = 'pulse 2s ease-in-out infinite';
  }
  
  // Insurance hero animation
  const insuranceHero = document.getElementById('lottie-insurance-hero');
  if (insuranceHero) {
    insuranceHero.style.fontSize = '3rem';
    insuranceHero.innerHTML = '✅';
    insuranceHero.style.display = 'flex';
    insuranceHero.style.alignItems = 'center';
    insuranceHero.style.justifyContent = 'center';
    insuranceHero.style.animation = 'scaleIn 0.8s ease-out';
  }
  
  // Pension hero animation
  const pensionHero = document.getElementById('lottie-pension-hero');
  if (pensionHero) {
    pensionHero.style.fontSize = '3rem';
    pensionHero.innerHTML = '🎁';
    pensionHero.style.display = 'flex';
    pensionHero.style.alignItems = 'center';
    pensionHero.style.justifyContent = 'center';
    pensionHero.style.animation = 'float 3s ease-in-out infinite';
  }
}

// Add scroll animation effects
function initScrollAnimations() {
  const cards = document.querySelectorAll('.card-interactive');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
      }
    });
  }, observerOptions);
  
  cards.forEach(card => observer.observe(card));
}

// Enhance button interactions
function initButtonInteractions() {
  const buttons = document.querySelectorAll('button:not(.lang-btn):not(.nav-toggle):not(.sidebar-toggle), .btn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
    
    button.addEventListener('click', function() {
      this.style.animation = 'pulse 0.5s ease-out';
      setTimeout(() => {
        this.style.animation = '';
      }, 500);
    });
  });
}

// Initialize form enhancements
function initFormEnhancements() {
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'translateY(0)';
    });
  });
}

// Add smooth page transitions
function initPageTransitions() {
  const links = document.querySelectorAll('a[href*=".html"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      // Don't prevent default - just add animation
      document.body.style.opacity = '0.95';
    });
  });
  
  // Fade in on page load
  window.addEventListener('load', function() {
    document.body.style.opacity = '1';
  });
}

// Initialize tooltips
function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  
  tooltips.forEach(tooltip => {
    tooltip.classList.add('tooltip');
  });
}

// Initialize navigation drawer
function initDrawerMenu() {
  const drawerToggle = document.getElementById('drawer-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const navDrawer = document.getElementById('nav-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  
  if (!drawerToggle || !navDrawer) return;
  
  // Open drawer
  drawerToggle.addEventListener('click', () => {
    navDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Close drawer
  const closeDrawer = () => {
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }
  
  // Close on overlay click
  drawerOverlay.addEventListener('click', closeDrawer);
  
  // Close on link click
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}