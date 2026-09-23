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

const slides = document.querySelectorAll('.coffee-slide');
const prevButton = document.querySelector('.slider-button-left');
const nextButton = document.querySelector('.slider-button-right');
const sliderIndicators = document.querySelectorAll('.slider-controls span');

const modalOverlay = document.querySelector('.modal-overlay');
const modalImage = document.querySelector('.modal-image');
const modalTitle = document.querySelector('#modal-title');
const modalDescription = document.querySelector('.modal-description');
const modalPrice = document.querySelector('.modal-price');
const modalSizes = document.querySelector('.modal-sizes');
const modalAdditives = document.querySelector('.modal-additives');
const modalClose = document.querySelector('.modal-close');

let currentSlide = 0;

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

function showSlide(index) {
  slides.forEach((slide) => {
    slide.classList.remove('active');
  });

  sliderIndicators.forEach((indicator) => {
    indicator.classList.remove('active');
  });

  slides[index].classList.add('active');
  sliderIndicators[index].classList.add('active');
}

if (nextButton && prevButton && slides.length) {
  nextButton.addEventListener('click', () => {
    currentSlide++;

    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }

    showSlide(currentSlide);
  });

  prevButton.addEventListener('click', () => {
    currentSlide--;

    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
  });
}

let touchStartX = 0;
let touchEndX = 0;
slides.forEach((slide) => {
  slide.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  });
});

slides.forEach((slide) => {
  slide.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].clientX;

    handleSwipe();
  });
});

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;

  if (swipeDistance < -50) {
    currentSlide++;

    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }

    showSlide(currentSlide);
  }

  if (swipeDistance > 50) {
    currentSlide--;

    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
  }
}

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

    card.addEventListener('click', () => {
      modalImage.src = `assets/images/${category}-${index + 1}.jpg`;
      modalImage.alt = product.name;
      modalTitle.textContent = product.name;
      modalDescription.textContent = product.description;
      modalPrice.textContent = `$${product.price}`;
      let selectedSizePrice = 0;
      let selectedAdditivesPrice = 0;

      function updateModalPrice() {
        const total =
          Number(product.price) + selectedSizePrice + selectedAdditivesPrice;

        modalPrice.textContent = `$${total.toFixed(2)}`;
      }

      modalSizes.innerHTML = '';

      Object.entries(product.sizes).forEach(([key, value], index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('modal-option');
        const badge = document.createElement('span');
        badge.classList.add('modal-option-badge');
        badge.textContent = key.toUpperCase();

        const label = document.createElement('span');
        label.textContent = value.size;

        button.append(badge, label);
        if (index === 0) {
          button.classList.add('active');
        }

        button.addEventListener('click', () => {
          modalSizes
            .querySelectorAll('.modal-option')
            .forEach((item) => item.classList.remove('active'));
          button.classList.add('active');
          selectedSizePrice = Number(value['add-price']);

          updateModalPrice();
        });
        modalSizes.append(button);
      });
      modalAdditives.innerHTML = '';

      product.additives.forEach((additive, index) => {
        const button = document.createElement('button');

        button.type = 'button';
        button.classList.add('modal-option');

        const badge = document.createElement('span');
        badge.classList.add('modal-option-badge');
        badge.textContent = index + 1;

        const label = document.createElement('span');
        label.textContent = additive.name;

        button.append(badge, label);

        button.addEventListener('click', () => {
          button.classList.toggle('active');

          const additivePrice = Number(additive['add-price']);

          if (button.classList.contains('active')) {
            selectedAdditivesPrice += additivePrice;
          } else {
            selectedAdditivesPrice -= additivePrice;
          }

          updateModalPrice();
        });

        modalAdditives.append(button);
      });
      updateModalPrice();
      modalOverlay.classList.add('open');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    });
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalOverlay?.classList.contains('open')) {
    closeModal();
  }
});

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
