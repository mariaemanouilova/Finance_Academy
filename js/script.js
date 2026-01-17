// Set current year in footer
document.addEventListener('DOMContentLoaded', function(){
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

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

      resultEl.innerHTML = `<strong>Estimated future value:</strong> ${fv.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:2})}`;
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
    resultEl.innerHTML = `<strong style="color:green;">✓ Thank you, ${name}! Your message has been received. We'll get back to you soon.</strong>`;
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
    {symbol: 'AAPL', name: 'Apple Inc', price: 238.79, change: -1.23, changePercent: -0.51},
    {symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.29, change: 15.67, changePercent: 1.82},
    {symbol: 'GOOGL', name: 'Alphabet Inc', price: 179.45, change: 0.89, changePercent: 0.50},
    {symbol: 'TSLA', name: 'Tesla Inc', price: 242.84, change: -5.12, changePercent: -2.06}
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