// === 1. SÉLECTION DES ÉLÉMENTS DU DOM : Récupération des nœuds interactifs ===
const htmlElement = document.documentElement;
const siteHeader = document.getElementById('site-header');
const themeToggleBtn = document.getElementById('theme-toggle');
const heroTitle = document.querySelector('.hero-title');
const productCards = document.querySelectorAll('.product-card');
const emptySearchMsg = document.getElementById('empty-search-msg');

// Éléments de la Navbar (Filtres, Recherche, Menu Mobile)
const navLinks = document.querySelectorAll('.nav-link');
const navLinksContainer = document.getElementById('nav-links');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const brandResetLink = document.querySelector('[data-filter-reset]');
const searchBox = document.getElementById('search-box');
const searchToggleBtn = document.getElementById('search-toggle');
const searchInput = document.getElementById('search-input');

// Éléments de la Modale et du Tiroir Panier
const openModalButtons = document.querySelectorAll('.open-modal-btn');
const modalBackdrop = document.getElementById('product-modal');
const modalCloseBtn = document.getElementById('modal-close');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const cartOpenBtn = document.getElementById('cart-open-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartDrawerBackdrop = document.getElementById('cart-drawer-backdrop');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPriceEl = document.getElementById('cart-total-price');
const cartCountEl = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Détails internes de la modale
const modalImg = document.getElementById('modal-img');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalStory = document.getElementById('modal-story');
const modalMaterials = document.getElementById('modal-materials');

// Canvas particules
const canvas = document.getElementById('ambient-particles');
const ctx = canvas ? canvas.getContext('2d') : null;

let activeCategory = 'all';
let currentProduct = null;
let cart = [];

// === 2. GESTION DU THÈME CLAIR / SOMBRE : Initialisation et sauvegarde ===
function initTheme() {
  const savedTheme = localStorage.getItem('akwaba-theme');
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

  localStorage.setItem('akwaba-theme', nextTheme);
});

initTheme();

// === 3. NAVBAR FONCTIONNELLE : Ombre au défilement, filtres, recherche et menu mobile ===
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 20);
});

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = navLinksContainer.classList.toggle('open');
  mobileMenuBtn.setAttribute('aria-expanded', isOpen);
});

function filterGallery() {
  const query = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const category = card.dataset.category;
    const textContent = card.textContent.toLowerCase();
    const matchesCategory = activeCategory === 'all' || category === activeCategory;
    const matchesSearch = textContent.includes(query);

    if (matchesCategory && matchesSearch) {
      card.classList.remove('hidden-card');
      visibleCount++;
    } else {
      card.classList.add('hidden-card');
    }
  });

  emptySearchMsg.hidden = visibleCount > 0;
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((btn) => btn.classList.remove('active'));
    link.classList.add('active');
    activeCategory = link.dataset.filter;
    navLinksContainer.classList.remove('open');
    filterGallery();
  });
});

brandResetLink.addEventListener('click', (event) => {
  event.preventDefault();
  activeCategory = 'all';
  searchInput.value = '';
  navLinks.forEach((btn) => btn.classList.toggle('active', btn.dataset.filter === 'all'));
  filterGallery();
});

searchToggleBtn.addEventListener('click', () => {
  searchBox.classList.toggle('open');
  if (searchBox.classList.contains('open')) {
    searchInput.focus();
  } else {
    searchInput.value = '';
    filterGallery();
  }
});

searchInput.addEventListener('input', filterGallery);

// === 4. RÉVÉLATION DU TITRE MOT PAR MOT : Entrée cinématographique ===
function animateHeroTitle() {
  if (!heroTitle) return;
  const words = heroTitle.textContent.trim().split(' ');
  heroTitle.innerHTML = words
    .map((word) => `<span class="word">${word}</span>`)
    .join(' ');

  heroTitle.querySelectorAll('.word').forEach((span, index) => {
    setTimeout(() => span.classList.add('visible'), 120 + index * 75);
  });
}

animateHeroTitle();

// === 5. PHYSIQUE 3D, SPOTLIGHT & PARALLAXE D'IMAGE : Vie tactile au survol ===
productCards.forEach((card) => {
  const cardInner = card.querySelector('.card-inner');
  const cardImg = card.querySelector('.card-image-wrapper img');

  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    cardInner.style.setProperty('--mouse-x', `${x}px`);
    cardInner.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;

    const moveX = ((x - centerX) / centerX) * -10;
    const moveY = ((y - centerY) / centerY) * -10;
    cardImg.style.transform = `scale(1.1) translate(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    cardImg.style.transform = 'scale(1) translate(0px, 0px)';
  });
});

// === 6. BOUTONS MAGNÉTIQUES : Attraction subtile vers le curseur ===
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

// === 7. PARTICULES DORÉES FLOTTANTES (CANVAS) : Atmosphère chaleureuse ===
if (canvas && ctx) {
  let particles = [];
  const particleCount = 30;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class GoldParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 1.8 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = -Math.random() * 0.4 - 0.1;
      this.alpha = Math.random() * 0.45 + 0.12;
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
        ? `rgba(229, 178, 84, ${this.alpha})`
        : `rgba(200, 90, 50, ${this.alpha * 0.8})`;
      ctx.fill();
    }
  }

  function initParticles() {
    resizeCanvas();
    particles = Array.from({ length: particleCount }, () => new GoldParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', resizeCanvas);
  initParticles();
  animateParticles();
}

// === 8. MODALE PRODUIT & TIROIR PANIER : Gestion complète de la sélection ===
openModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentProduct = {
      title: button.dataset.title,
      price: button.dataset.price,
      priceNum: Number(button.dataset.priceNum),
      image: button.dataset.image
    };

    modalImg.src = currentProduct.image;
    modalImg.alt = currentProduct.title;
    modalCategory.textContent = button.dataset.category;
    modalTitle.textContent = currentProduct.title;
    modalPrice.textContent = currentProduct.price;
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
modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });

function renderCart() {
  cartCountEl.textContent = cart.length;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Votre sélection est vide pour l'instant.</p>`;
    cartTotalPriceEl.textContent = '0 FCFA';
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart
    .map((item, index) => {
      total += item.priceNum;
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-info">
            <h4>${item.title}</h4>
            <span>${item.price}</span>
          </div>
          <button class="remove-item-btn" data-remove-index="${index}" aria-label="Retirer">&times;</button>
        </div>
      `;
    })
    .join('');

  cartTotalPriceEl.textContent = `${total.toLocaleString('fr-FR')} FCFA`;

  document.querySelectorAll('[data-remove-index]').forEach((btn) => {
    btn.addEventListener('click', () => {
      cart.splice(Number(btn.dataset.removeIndex), 1);
      renderCart();
    });
  });
}

addToCartBtn.addEventListener('click', () => {
  if (!currentProduct || addToCartBtn.classList.contains('added')) return;

  cart.push(currentProduct);
  renderCart();

  addToCartBtn.classList.add('added');
  addToCartBtn.querySelector('.btn-text').textContent = '✓ Pièce ajoutée à votre sélection';

  cartOpenBtn.classList.add('bump');
  setTimeout(() => cartOpenBtn.classList.remove('bump'), 350);
});

cartOpenBtn.addEventListener('click', () => {
  cartDrawerBackdrop.classList.add('active');
  cartDrawerBackdrop.setAttribute('aria-hidden', 'false');
});

function closeCartDrawer() {
  cartDrawerBackdrop.classList.remove('active');
  cartDrawerBackdrop.setAttribute('aria-hidden', 'true');
}

cartCloseBtn.addEventListener('click', closeCartDrawer);
cartDrawerBackdrop.addEventListener('click', (e) => { if (e.target === cartDrawerBackdrop) closeCartDrawer(); });

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  checkoutBtn.textContent = '✓ Akwaba ! Commande enregistrée';
  setTimeout(() => {
    cart = [];
    renderCart();
    checkoutBtn.textContent = 'Commander ma sélection';
    closeCartDrawer();
  }, 1500);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    closeCartDrawer();
  }
});