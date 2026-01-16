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
});