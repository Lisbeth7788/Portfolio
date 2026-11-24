const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
const navigationLinks = [...document.querySelectorAll('.navigation a')];

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

const observedSections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navigationLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });

observedSections.forEach((section) => sectionObserver.observe(section));

const revealItems = [...document.querySelectorAll('.reveal')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const copyButton = document.querySelector('[data-copy-email]');
const copyFeedback = document.querySelector('.copy-feedback');

copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.copyEmail;

  try {
    await navigator.clipboard.writeText(email);
    copyFeedback.textContent = 'Adresse copiée dans le presse-papiers.';
    copyButton.querySelector('span').textContent = 'Adresse copiée';
  } catch {
    copyFeedback.textContent = `Copie impossible. Adresse : ${email}`;
  }
});

const contactForm = document.querySelector('#formulaire-contact');
const formFeedback = contactForm?.querySelector('.form-feedback');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    formFeedback.textContent = 'Merci de compléter les champs requis.';
    return;
  }

  const data = new FormData(contactForm);
  const name = data.get('nom').trim();
  const email = data.get('email').trim();
  const project = data.get('projet');
  const message = data.get('message').trim();
  const subject = `Demande de projet — ${project}`;
  const body = [
    `Bonjour Lisbeth,`,
    '',
    message,
    '',
    `Besoin : ${project}`,
    `Nom : ${name}`,
    `E-mail : ${email}`
  ].join('\n');

  formFeedback.textContent = 'Votre demande est prête dans votre messagerie.';
  window.location.href = `mailto:ducteillisbeth36@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelector('#annee').textContent = new Date().getFullYear();

if (window.location.hash === '#formulaire-contact') {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.querySelector('#formulaire-contact')?.scrollIntoView({ block: 'start' });
    });
  });
}
