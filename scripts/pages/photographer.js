// Import modules
import { photographerTemplate } from '../templates/photographer.js'; // Template pour photographe
import { getData } from '../utils/api.js';
import { mediaFactory } from '../factories/mediaFactory.js';

// 1 - Variables globales

// Stocke tous les médias du JSON
let allMedia = [];

// Médias filtrés du photographe courant
let medias = [];

// Galerie photographe courant (déclarée ici pour être accessible depuis le tri)
let gallery;

// 2 - Fonction principale init()

async function init() {
  // ---- 2.1 - Récupération des données ----
  const data = await getData(); // récupération du JSON
  const { photographers } = data; // tableau de tous les photographes
  allMedia = data.media; // tableau de tous les médias

  // Récupération id photographe depuis URL
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10); // Convertir en nombre

  // Trouver photographe correspondant
  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) {
    console.error('Photographe introuvable');
    return;
  }

  // ---- 2.2 - Header photographe ----
  const header = document.querySelector('.photograph-header');
  header.appendChild(photographerTemplate(photographer).getUserHeaderDOM());

  // Injecter nom photographe modale contact
  const nameP = document.getElementById('photographer-name');
  if (nameP) {
    nameP.textContent = photographer.name;
    // console.log(`Nom photographe injecté dans modale : ${photographer.name}`);
  }

  // ---- 2.3 - Galerie ----
  gallery = document.querySelector('.photograph-gallery');
  gallery.innerHTML = ''; // Reset galerie avant ajout médias

  // Filtrer médias photographe courant
  medias = allMedia.filter((m) => m.photographerId === id);

  // Afficher chaque média
  medias.forEach((m) => {
    gallery.appendChild(mediaFactory(m, photographer.folder));
  });

  // ---- 2.4 - Likes et prix ----
  const container = document.querySelector('.container');
  container.innerHTML = '';

  // Bloc total likes
  const likesEl = document.createElement('div');
  likesEl.classList.add('likes');
  let totalLikes = medias.reduce((sum, m) => sum + m.likes, 0);
  likesEl.textContent = `${totalLikes} ❤`;

  // Bloc prix (TJM)
  const priceContainer = document.createElement('div');
  priceContainer.classList.add('tjm');
  const priceElt = document.createElement('div');
  priceElt.textContent = `${photographer.price} €/jour`;
  priceElt.classList.add('photographer-price');
  priceContainer.appendChild(priceElt);

  container.append(likesEl, priceContainer);

  // ---- 2.5 - Gestion likes / média ----
  const likeButtons = document.querySelectorAll('.like-button');

  likeButtons.forEach((btn) => {
    // Identifier média via data-id du bouton
    const mediaId = btn.dataset.id;

    // Récupérer nbre de likes sauvegardé dans localStorage (si présent)
    const savedLikes = window.localStorage.getItem(`likes-${mediaId}`);

    let liked = false; // état (liké ou non)

    // Si des likes étaient déjà sauvegardés -> on les restaure
    if (savedLikes) {
      btn.querySelector('.like-count').textContent = savedLikes;
      liked = true; // déjà aimé
    }

    btn.addEventListener('click', () => {
      const countEl = btn.querySelector('.like-count');
      let count = parseInt(countEl.textContent, 10);

      if (!liked) {
        // Si média pas déjà aimé ->
        count += -1; // incrémenter
        totalLikes += -1; // màj total global
        liked = true;
        btn.setAttribute('aria-pressed', 'true'); // accessibilité
      } else {
        // Si déjà aimé ->
        count -= 1; // décrémenter
        totalLikes -= 1;
        liked = false;
        btn.setAttribute('aria-pressed', 'false');
      }

      // Màj affichage compteur
      countEl.textContent = count;
      likesEl.textContent = `${totalLikes} ❤`;

      // Sauvegarde nouveau nombre de likes dans localStorage
      window.localStorage.setItem(`likes-${mediaId}`, count);
    });

    // Support clavier Entrer ou Espace
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // ---- 2.6 - Lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = lightbox.querySelector('.lightbox-content');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // Sélection de tous les médias visibles (images + vidéos)
  const mediaItems = document.querySelectorAll(
    '.media-item img, .media-item video',
  );
  // console.log(mediaItems); // Vérification console

  let currentIndex = 0; // Index média affiché dans lightbox

  // --- Fonction affichage média dans lightbox ---
  function showMedia(index) {
    const media = mediaItems[index];
    if (!media) return; // sécurité si index invalide

    const clone = media.cloneNode(true); // clone pour ne pas déplacer l'original

    // Si média = vidéo, ajout contrôles + aria-label
    if (clone.tagName === 'VIDEO') {
      clone.setAttribute('controls', 'true');
      clone.setAttribute(
        'aria-label',
        media.alt || media.getAttribute('aria-label') || 'Vidéo',
      );
    }

    lightboxContent.innerHTML = ''; // vider contenu actuel
    lightboxContent.appendChild(clone); // afficher média cloné
    lightbox.classList.add('show'); // montrer lightbox
    lightbox.setAttribute('aria-hidden', 'false');
    // Affichage du titre en bas
    const title = document.createElement('div');
    title.classList.add('lightbox-title');
    title.textContent = media.dataset.title || '';
    lightboxContent.appendChild(title);
  }

  // --- Ouvrir lightbox au clic sur un média ---
  mediaItems.forEach((media, index) => {
    media.addEventListener('click', () => {
      currentIndex = index; // maj index actuel
      showMedia(currentIndex);
    });
  });

  // --- Fermer lightbox ---
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // éviter que le clic remonte à l'overlay
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxContent.innerHTML = '';
  });

  // --- Fermer lightbox en cliquant sur l'overlay ---
  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxContent.innerHTML = '';
  });

  // --- Empêcher fermeture lors du clic sur le contenu ---
  lightboxContent.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // --- Navigation clavier dans la lightbox ---
  document.addEventListener('keydown', (e) => {
    // Ignorer si la lightbox est fermée
    if (!lightbox.classList.contains('show')) return;

    switch (e.key) {
      case 'Escape':
        // Fermer lightbox avec Échap
        lightbox.classList.remove('show');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxContent.innerHTML = '';
        break;

      case 'ArrowRight':
        // Média suivant
        currentIndex = (currentIndex + 1) % mediaItems.length;
        showMedia(currentIndex);
        break;

      case 'ArrowLeft':
        // Média précédent
        currentIndex =
          (currentIndex - 1 + mediaItems.length) % mediaItems.length;
        showMedia(currentIndex);
        break;

      default:
        // Ignorer les autres touches
        // Règle "default-case"
        break;
    }
  });

  // --- Navigation avec boutons flèches ---
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  // Clic boutons
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // éviter propagation au clic sur overlay
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    showMedia(currentIndex);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % mediaItems.length;
    showMedia(currentIndex);
  });

  // Navigation clavier sur boutons
  prevBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // éviter scroll page
      prevBtn.click();
    }
  });

  nextBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      nextBtn.click();
    }
  });

  // ---- 2.7 - Dropdown tri (dans init pour avoir accès à gallerie et medias) ----
  const button = document.getElementById('dropdownButton');
  const list = document.getElementById('myDropdown');
  const options = list.querySelectorAll('li');

  // Ouvrir / fermer le menu
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    list.classList.toggle('show');
  });

  // Clic option tri
  options.forEach((option) => {
    option.addEventListener('click', () => {
      const selectedText = option.innerText;
      console.log('Critère choisi :', selectedText);
      console.log('Tableau des médias filtré :', medias);

      // --- Tri selon l'option ---
      if (selectedText === 'Date') {
        // Tri décroissant date
        medias.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      if (selectedText === 'Popularité') {
        // Tri décroissant likes
        medias.sort((a, b) => b.likes - a.likes);
      }
      if (selectedText === 'Titre') {
        // Tri alphabétique, insensible à la casse
        medias.sort((a, b) =>
          a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
        );
      }

      // --- Recréation galerie après tri ---
      gallery.innerHTML = '';
      medias.forEach((m) =>
        gallery.appendChild(mediaFactory(m, photographer.folder)),
      );

      // --- Màj texte bouton ---
      const img = button.querySelector('img');
      button.textContent = selectedText;
      button.appendChild(img);

      // --- Accessibilité ---
      options.forEach((opt) => opt.setAttribute('aria-selected', 'false'));
      option.setAttribute('aria-selected', 'true');

      // Fermer menu
      button.setAttribute('aria-expanded', 'false');
      list.classList.remove('show');
    });
  });

  // Fermer menu si clic extérieur
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
