// Rôle : Gestion galerie, lightbox, likes, tri, modale de contact

import { photographerTemplate } from '../templates/photographer.js';
import { getData } from '../utils/api.js';
import { mediaFactory } from '../factories/mediaFactory.js';

// --- Variables globales ---
// Définies ici pour être utilisées partout
let allMedia = []; // Médias JSON
let medias = []; // Médias photographe courant
let gallery; // Conteneur galerie
let photographerData; // Données photographe courant
let currentIndex = 0; // Index média affiché dans la lightbox

// --- Initialisation ---
async function init() {
  // 1. Charger données JSON
  const data = await getData();
  const { photographers } = data;
  allMedia = data.media;

  // 2. Récupérer ID photographe dans URL
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  // 3. Trouver photographe correspondant
  photographerData = photographers.find((p) => p.id === id);
  if (!photographerData) return console.error('Photographe introuvable');

  // 4. Appeler chaque setup (certaines fonctions n’ont pas besoin de paramètres)
  setupHeader(); // pas besoin de paramètre : utilise photographerData globale
  setupGallery(); // idem
  setupLikesAndPrice(); // idem
  setupDropdown(); // idem
  setupLightbox(); // idem
  setupContactModal(photographerData); // nom du photographe
}

// --- Header photographe ---
function setupHeader() {
  const header = document.querySelector('.photograph-header');
  // Création header avec infos photographe courant
  header.appendChild(photographerTemplate(photographerData).getUserHeaderDOM());
}

// --- Galerie ---
function setupGallery() {
  gallery = document.querySelector('.photograph-gallery');
  gallery.innerHTML = '';

  // Filtrer médias photographe courant
  medias = allMedia.filter((m) => m.photographerId === photographerData.id);

  // Créer média avec mediaFactory
  medias.forEach((m) => {
    const article = mediaFactory(m, photographerData.folder);

    // Ajout événement perso "openLightbox" pour gérer ouverture
    article.addEventListener('openLightbox', (e) => {
      const mediaId = e.detail; // récupère ID média passé dans l'événement
      // findIndex = retourne index média correspondant
      const index = medias.findIndex((m) => m.id == mediaId);
      window.showLightbox(index); // Affiche média dans lightbox
    });

    gallery.appendChild(article);
  });

  // Gestion likes
  gallery.addEventListener('click', handleLikeClick);
  gallery.addEventListener('keydown', handleLikeKeydown);
}

// --- Gestion likes (clic souris) ---
function handleLikeClick(e) {
  const btn = e.target.closest('.like-button'); // trouve btn like cliqué
  if (!btn) return; // si pas de btn like cliqué → stop

  const mediaId = btn.dataset.id; // ID média stocké dans attribut data-id
  const countEl = btn.querySelector('.like-count'); // élément qui affiche le nombre
  let count = parseInt(countEl.textContent, 10); // convertit le texte en nombre

  // Vérifier si déjà liké (stocké en localStorage)
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

  countEl.textContent = count; // met à jour l'affichage du compteur

  // Recalculer total likes
  const totalLikesEl = document.querySelector('.likes');
  const totalLikes = Array.from(
    document.querySelectorAll('.like-count'),
  ).reduce(
    (sum, el) => sum + parseInt(el.textContent, 10), // somme de tous les nombres
    0,
  ); // valeur originelle de la somme
  totalLikesEl.textContent = `${totalLikes} ❤`;

  // Sauvegarde état like
  window.localStorage.setItem(`likes-${mediaId}`, count);
  window.localStorage.setItem(`liked-${mediaId}`, liked);
}

// --- Gestion des likes (clavier : entrée / espace) ---
function handleLikeKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    const btn = e.target.closest('.like-button');
    if (btn) {
      e.preventDefault(); // empêche le scroll si appui sur Espace
      btn.click(); // simule un clic
    }
  }
}

// --- Affichage encart likes + prix ---
function setupLikesAndPrice() {
  const container = document.querySelector('.container');
  container.innerHTML = ''; // vidage conteneur avant remplissage

  // Création compteur total de likes
  const likesEl = document.createElement('div');
  likesEl.classList.add('likes');
  const totalLikes = medias.reduce((sum, m) => sum + m.likes, 0);
  // reduce = addition des likes des médias (sum part de 0)
  likesEl.textContent = `${totalLikes} ❤`;

  // Création affichage tjm
  const priceContainer = document.createElement('div');
  priceContainer.classList.add('tjm');
  const priceElt = document.createElement('div');
  priceElt.textContent = `${photographerData.price} €/jour`;
  priceElt.classList.add('photographer-price');
  priceContainer.appendChild(priceElt);

  // Ajout des éléments au DOM
  container.append(likesEl, priceContainer);
}

// --- Lightbox ---
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const content = lightbox.querySelector('.lightbox-content');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  // Affichage média dans lightbox
  function showLightbox(index) {
    const mediaItems = gallery.querySelectorAll(
      '.media-item img, .media-item video',
    );
    const media = mediaItems[index];
    if (!media) return; // si index invalide -> stop
    currentIndex = index;

    // Clonage média
    const clone = media.cloneNode(true);
    if (clone.tagName === 'VIDEO') {
      clone.setAttribute('controls', 'true'); // Ajout contrôles
      clone.tabIndex = 0; // Focusable
      clone.setAttribute(
        'aria-label',
        media.alt || media.dataset.title || 'Vidéo', // Alt
      );
    }

    content.innerHTML = ''; // Vidage contenu avant ajout
    content.appendChild(clone);

    const title = document.createElement('div');
    title.classList.add('lightbox-title');
    title.textContent = media.dataset.title || '';
    content.appendChild(title);

    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');

    // Focus par défaut btn close
    closeBtn.focus();
  }

  // Fermer lightbox
  function closeLightbox() {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    content.innerHTML = ''; // vidage contenu
  }

  // Navigation boutons (clic souris + clavier)
  [prevBtn, nextBtn, closeBtn].forEach((btn) => {
    btn.tabIndex = 0; // Focusable
    btn.addEventListener('click', () => {
      if (btn === prevBtn)
        showLightbox((currentIndex - 1 + medias.length) % medias.length);
      if (btn === nextBtn) showLightbox((currentIndex + 1) % medias.length);
      if (btn === closeBtn) closeLightbox();
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // empêche le scroll si appui sur Espace
        btn.click(); // Simule un clic
      }
    });
  });

  // Navigation clavier globale (flèches + Échap)
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return; // si pas ouverte, on ignore
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        showLightbox((currentIndex + 1) % medias.length);
        break;
      case 'ArrowLeft':
        showLightbox((currentIndex - 1 + medias.length) % medias.length);
        break;
      default:
        break;
    }
  });

  // Expose showLightbox en global (utilisable ailleurs)
  window.showLightbox = showLightbox;
}

// --- Dropdown tri ---
function setupDropdown() {
  const button = document.getElementById('dropdownButton');
  const list = document.getElementById('myDropdown');
  const options = list.querySelectorAll('li');
  const icon = button.querySelector('img'); // flèche

  // Ouvrir / fermer dropdown
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    list.classList.toggle('show');
  });

  // Gérer chaque option (clic + clavier)
  options.forEach((option) => {
    const btn = option.querySelector('button');
    btn.tabIndex = 0;
    btn.addEventListener('click', () => selectOption(option));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(option);
      }
    });
  });

  // Applique le tri selon l’option choisie
  function selectOption(option) {
    const selectedText = option.innerText;
    switch (selectedText) {
      case 'Date':
        medias.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'Popularité':
        medias.sort((a, b) => b.likes - a.likes);
        break;
      case 'Titre':
        medias.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    // Réafficher la galerie avec le nouvel ordre
    gallery.innerHTML = '';
    medias.forEach((m) => {
      const article = mediaFactory(m, photographerData.folder);
      article.addEventListener('openLightbox', (e) => {
        const mediaId = e.detail;
        const index = medias.findIndex((m) => m.id == mediaId);
        window.showLightbox(index); // ✅ corrigé
      });
      gallery.appendChild(article);
    });

    // Mettre à jour le bouton avec le texte + flèche
    button.textContent = selectedText;
    if (icon) button.appendChild(icon);

    // Accessibilité
    options.forEach((opt) => opt.setAttribute('aria-selected', 'false'));
    option.setAttribute('aria-selected', 'true');

    button.setAttribute('aria-expanded', 'false');
    list.classList.remove('show');
  }

  // Fermer dropdown si clic à l’extérieur
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrapper')) {
      button.setAttribute('aria-expanded', 'false');
      list.classList.remove('show');
    }
  });
}

// --- Modale contact ---
function setupContactModal(photographerData) {
  // Récupérer le conteneur dans la modale
  const nameContainer = document.getElementById('photographer-name');
  if (nameContainer) {
    nameContainer.textContent = photographerData.name;
  }
}

// --- Lancement ---
init();
