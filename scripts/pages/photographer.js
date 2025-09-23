// Import modules
import { photographerTemplate } from '../templates/photographer.js';
import { getData } from '../utils/api.js';
import { mediaFactory } from '../factories/mediaFactory.js';

// 1 - Variables globales
let allMedia = []; // Tous les médias du JSON
let medias = []; // Médias filtrés pour le photographe courant
let gallery; // Galerie photographe courant

// 2 - Fonction principale init()
async function init() {
  // ---- 2.1 - Récupération données ----
  const data = await getData();
  const { photographers } = data;
  allMedia = data.media;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10); // ID photographe

  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) {
    console.error('Photographe introuvable');
    return;
  }

  // ---- 2.2 - Header photographe ----
  const header = document.querySelector('.photograph-header');
  header.appendChild(photographerTemplate(photographer).getUserHeaderDOM());

  const nameP = document.getElementById('photographer-name');
  if (nameP) nameP.textContent = photographer.name;

  // ---- 2.3 - Galerie ----
  gallery = document.querySelector('.photograph-gallery');
  gallery.innerHTML = '';

  medias = allMedia.filter((m) => m.photographerId === id);

  medias.forEach((m) => {
    gallery.appendChild(mediaFactory(m, photographer.folder));
  });

  // ---- 2.4 - Likes et prix ----
  const container = document.querySelector('.container');
  container.innerHTML = '';

  const likesEl = document.createElement('div');
  likesEl.classList.add('likes');
  const totalLikes = medias.reduce((sum, m) => sum + m.likes, 0);
  likesEl.textContent = `${totalLikes} ❤`;

  const priceContainer = document.createElement('div');
  priceContainer.classList.add('tjm');
  const priceElt = document.createElement('div');
  priceElt.textContent = `${photographer.price} €/jour`;
  priceElt.classList.add('photographer-price');
  priceContainer.appendChild(priceElt);

  container.append(likesEl, priceContainer);

  // ---- 2.5 - Gestion likes / event delegation ----
  gallery.addEventListener('click', (e) => {
    const btn = e.target.closest('.like-button');
    if (!btn) return;

    const mediaId = btn.dataset.id;
    const countEl = btn.querySelector('.like-count');
    let count = parseInt(countEl.textContent, 10);

    let liked = window.localStorage.getItem(`liked-${mediaId}`) === 'true';

    if (!liked) {
      count += 1;
      liked = true;
      btn.setAttribute('aria-pressed', 'true');
    } else {
      count -= 1;
      liked = false;
      btn.setAttribute('aria-pressed', 'false');
    }

    countEl.textContent = count;

    // Recalcul total likes
    const totalLikes = Array.from(
      document.querySelectorAll('.like-count'),
    ).reduce((sum, el) => sum + parseInt(el.textContent, 10), 0);
    likesEl.textContent = `${totalLikes} ❤`;

    window.localStorage.setItem(`likes-${mediaId}`, count);
    window.localStorage.setItem(`liked-${mediaId}`, liked);
  });

  // Support clavier pour likes
  gallery.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const btn = e.target.closest('.like-button');
      if (btn) {
        e.preventDefault();
        btn.click();
      }
    }
  });

  // ---- 2.6 - Lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = lightbox.querySelector('.lightbox-content');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  const mediaItems = document.querySelectorAll(
    '.media-item img, .media-item video',
  );

  function showMedia(index) {
    const media = mediaItems[index];
    if (!media) return;

    // Clone pour lightbox
    const clone = media.cloneNode(true);

    // Si vidéo : controls et focusable
    if (clone.tagName === 'VIDEO') {
      clone.setAttribute('controls', 'true');
      clone.tabIndex = 0;
      clone.setAttribute(
        'aria-label',
        media.alt || media.dataset.title || 'Vidéo',
      );
    }

    lightboxContent.innerHTML = '';
    lightboxContent.appendChild(clone);

    const title = document.createElement('div');
    title.classList.add('lightbox-title');
    title.textContent = media.dataset.title || '';
    lightboxContent.appendChild(title);

    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');

    // Focus automatique sur bouton close
    closeBtn.focus();
  }

  // Ouvrir lightbox
  mediaItems.forEach((media, index) => {
    media.addEventListener('click', () => {
      currentIndex = index;
      showMedia(currentIndex);
    });
  });

  // Fermeture lightbox
  function closeLightbox() {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxContent.innerHTML = '';
  }

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', closeLightbox);
  lightboxContent.addEventListener('click', (e) => e.stopPropagation());

  // Navigation clavier (Escape / flèches)
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        currentIndex = (currentIndex + 1) % mediaItems.length;
        showMedia(currentIndex);
        break;
      case 'ArrowLeft':
        currentIndex =
          (currentIndex - 1 + mediaItems.length) % mediaItems.length;
        showMedia(currentIndex);
        break;
      default:
        break;
    }
  });

  // Navigation avec boutons flèches
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    showMedia(currentIndex);
  });
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % mediaItems.length;
    showMedia(currentIndex);
  });

  // Support clavier pour boutons flèches
  [prevBtn, nextBtn].forEach((btn) => {
    btn.tabIndex = 0; // Assure focus
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // ---- 2.7 - Dropdown tri ----
  const button = document.getElementById('dropdownButton');
  const list = document.getElementById('myDropdown');
  const options = list.querySelectorAll('li');

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    list.classList.toggle('show');
  });

  options.forEach((option) => {
    option.addEventListener('click', () => {
      const selectedText = option.innerText;

      if (selectedText === 'Date')
        medias.sort((a, b) => new Date(b.date) - new Date(a.date));
      if (selectedText === 'Popularité')
        medias.sort((a, b) => b.likes - a.likes);
      if (selectedText === 'Titre')
        medias.sort((a, b) =>
          a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
        );

      gallery.innerHTML = '';
      medias.forEach((m) =>
        gallery.appendChild(mediaFactory(m, photographer.folder)),
      );

      const img = button.querySelector('img');
      button.textContent = selectedText;
      button.appendChild(img);

      options.forEach((opt) => opt.setAttribute('aria-selected', 'false'));
      option.setAttribute('aria-selected', 'true');

      button.setAttribute('aria-expanded', 'false');
      list.classList.remove('show');
    });
  });

  window.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown-wrapper')) {
      button.setAttribute('aria-expanded', 'false');
      list.classList.remove('show');
    }
  });

  return true;
}

// 3 - Lancement
init();
