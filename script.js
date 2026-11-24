// === 1. SÉLECTION DES ÉLÉMENTS DU DOM : Récupération des nœuds interactifs de la page ===
const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const heroTitle = document.querySelector('.hero-title');
const productCards = document.querySelectorAll('[data-tilt]');
const openModalButtons = document.querySelectorAll('.open-modal-btn');
const modalBackdrop = document.getElementById('product-modal');
const modalCloseBtn = document.getElementById('modal-close');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const cartCountEl = document.getElementById('cart-count');
const cartIndicator = document.getElementById('cart-indicator');
const canvas = document.getElementById('ambient-particles');
const ctx = canvas ? canvas.getContext('2d') : null;

// Éléments internes de la modale
const modalImg = document.getElementById('modal-img');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalStory = document.getElementById('modal-story');
const modalMaterials = document.getElementById('modal-materials');

let cartTotal = 0;

// === 2. GESTION DU THÈME CLAIR / SOMBRE : Initialisation et sauvegarde dans le localStorage ===
function initTheme() {
  const savedTheme = localStorage.getItem('aurelia-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    htmlElement.setAttribute('data-theme', 'dark');
  }
}

themeToggleBtn.addEventListener('click', () => {
  const isDark = htmlElement.getAttribute('data-theme') === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  if (nextTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
  } else {
    htmlElement.removeAttribute('data-theme');
  }

  localStorage.setItem('aurelia-theme', nextTheme);
});

initTheme();

// === 3. RÉVÉLATION CINÉMATOGRAPHIQUE DU TITRE : Apparition mot par mot au chargement ===
function animateHeroTitle() {
  if (!heroTitle) return;
  const words = heroTitle.textContent.trim().split(' ');
  heroTitle.innerHTML = words
    .map((word) => `<span class="word">${word}</span>`)
    .join(' ');

  const wordSpans = heroTitle.querySelectorAll('.word');
  wordSpans.forEach((span, index) => {
    setTimeout(() => {
      span.classList.add('visible');
    }, 120 + index * 75);
  });
}

animateHeroTitle();

// === 4. PHYSIQUE 3D, SPOTLIGHT & PARALLAXE D'IMAGE : Vie tactile sur chaque carte ===
productCards.forEach((card) => {
  const cardInner = card.querySelector('.card-inner');
  const cardImg = card.querySelector('.card-image-wrapper img');

  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Coordonnées pour le halo lumineux dynamique (Spotlight)
    cardInner.style.setProperty('--mouse-x', `${x}px`);
    cardInner.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Inclinaison 3D douce (max 5.5 degrés)
    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;

    // Parallaxe interne : l'image glisse légèrement en sens inverse du curseur
    const moveX = ((x - centerX) / centerX) * -10;
    const moveY = ((y - centerY) / centerY) * -10;
    cardImg.style.transform = `scale(1.1) translate(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    cardImg.style.transform = 'scale(1) translate(0px, 0px)';
  });
});

// === 5. BOUTONS MAGNÉTIQUES : Attraction subtile vers le curseur au survol ===
openModalButtons.forEach((button) => {
  button.addEventListener('mousemove', (event) => {
    const rect = button.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left - rect.width / 2) * 0.22;
    const offsetY = (event.clientY - rect.top - rect.height / 2) * 0.28;
    button.style.transform = `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px)`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0px, 0px)';
  });
});

// === 6. PARTICULES DORÉES FLOTTANTES (CANVAS) : Atmosphère vivante en arrière-plan ===
if (canvas && ctx) {
  let particles = [];
  const particleCount = 32;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class GoldParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 1.8 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = -Math.random() * 0.4 - 0.1;
      this.alpha = Math.random() * 0.45 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
        this.y = canvas.height + 10;
      }
    }

    draw() {
      const isDark = htmlElement.getAttribute('data-theme') === 'dark';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(212, 175, 106, ${this.alpha})`
        : `rgba(184, 147, 86, ${this.alpha * 0.85})`;
      ctx.fill();
    }
  }

  function initParticles() {
    resizeCanvas();
    particles = Array.from({ length: particleCount }, () => new GoldParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', resizeCanvas);
  initParticles();
  animateParticles();
}

// === 7. GESTION DE LA MODALE & FEEDBACK PANIER : Aperçu narratif et confirmation visuelle ===
openModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modalImg.src = button.dataset.image;
    modalImg.alt = button.dataset.title;
    modalCategory.textContent = button.dataset.category;
    modalTitle.textContent = button.dataset.title;
    modalPrice.textContent = button.dataset.price;
    modalStory.textContent = button.dataset.story;
    modalMaterials.textContent = button.dataset.materials;

    addToCartBtn.classList.remove('added');
    addToCartBtn.querySelector('.btn-text').textContent = 'Ajouter à ma sélection';

    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
  });
});

function closeModal() {
  modalBackdrop.classList.remove('active');
  modalBackdrop.setAttribute('aria-hidden', 'true');
}

modalCloseBtn.addEventListener('click', closeModal);

modalBackdrop.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalBackdrop.classList.contains('active')) {
    closeModal();
  }
});

addToCartBtn.addEventListener('click', () => {
  if (addToCartBtn.classList.contains('added')) return;

  cartTotal += 1;
  cartCountEl.textContent = cartTotal;

  addToCartBtn.classList.add('added');
  addToCartBtn.querySelector('.btn-text').textContent = '✓ Pièce réservée dans votre sélection';

  cartIndicator.classList.add('bump');
  setTimeout(() => cartIndicator.classList.remove('bump'), 350);
});