const themeToggle = document.querySelector('.theme-toggle');

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
}

function updateThemeToggle() {
  const isDark = document.body.classList.contains('dark-theme');

  themeToggle.setAttribute('aria-pressed', isDark);

  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Switch to light theme' : 'Switch to dark theme'
  );
}

updateThemeToggle();

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  if (document.body.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }

  updateThemeToggle();
});

const burgerButton = document.querySelector('.burger-button');
const mobileMenu = document.querySelector('.mobile-menu');
if (burgerButton && mobileMenu) {
  burgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    burgerButton.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    mobileMenu.classList.remove('open');
    burgerButton.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    mobileMenu.classList.remove('open');
    burgerButton.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
});

const mobileLinks = document.querySelectorAll('.mobile-navigation a');

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burgerButton.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

const menuGrid = document.querySelector('.menu-grid');
const menuTabs = document.querySelectorAll('.menu-tab');
const loadMoreButton = document.querySelector('.load-more');

function renderProducts(products, category) {
  if (!menuGrid) return;

  menuGrid.innerHTML = '';

  const categoryProducts = products.filter(
    (product) => product.category === category
  );

  menuGrid.classList.remove('show-all');
  if (categoryProducts.length <= 4) {
    loadMoreButton.classList.add('is-hidden');
  } else {
    loadMoreButton.classList.remove('is-hidden');
  }

  categoryProducts.forEach((product, index) => {
    const card = document.createElement('article');
    card.classList.add('menu-card');

    const image = document.createElement('img');
    image.src = `assets/images/${category}-${index + 1}.jpg`;
    image.alt = product.name;

    const content = document.createElement('div');
    content.classList.add('menu-card-content');

    const title = document.createElement('h2');
    title.textContent = product.name;

    const description = document.createElement('p');
    description.textContent = product.description;

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;

    content.append(title, description, price);
    card.append(image, content);

    menuGrid.append(card);
  });
}

fetch('products.json')
  .then((response) => response.json())
  .then((products) => {
    renderProducts(products, 'coffee');
    menuTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.category;

        menuTabs.forEach((item) => {
          item.classList.remove('active');
        });
        tab.classList.add('active');
        renderProducts(products, category);
      });
    });
  })
  .catch((error) => {
    console.error('Failed to load products:', error);
  });

if (loadMoreButton) {
  loadMoreButton.addEventListener('click', () => {
    menuGrid.classList.add('show-all');
    loadMoreButton.classList.add('is-hidden');
  });
}
