import { inizializzaUI } from './js/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    inizializzaUI();
    inizializzaTransizioniNav();
});

function inizializzaTransizioniNav() {
  const overlay = document.getElementById('overlay-transizione');
  const linkNav = document.querySelectorAll('.nav-link');

  if (!overlay || linkNav.length === 0) return;

  linkNav.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('attivo')) return;

      e.preventDefault();
      overlay.classList.add('attiva');

      setTimeout(() => {
        window.location.href = link.getAttribute('href');
      }, 350);
    });
  });
}