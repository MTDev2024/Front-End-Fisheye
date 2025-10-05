export function mediaFactory(media, photographerFolder) {
  // --- Article conteneur ---
  const article = document.createElement('article');
  article.classList.add('media-item');
  // PAS de tabIndex article -> focus sur média lui-même

  // encodeURIComponent : sécurise valeurs URL en remplaçant espaces, caractères spéciaux
  const folderName = encodeURIComponent(photographerFolder);

  let mediaElement;
  let isVideo = false; // état par défaut

  // --- Création média ---
  if (media.image) {
    mediaElement = document.createElement('img');
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.image}`;
    mediaElement.alt = media.title; // Accessibilité : description
    mediaElement.setAttribute('loading', 'lazy');
    mediaElement.tabIndex = 0; // Navigable au clavier
    mediaElement.setAttribute('role', 'button'); // Cliquable
    mediaElement.setAttribute('aria-label', `${media.title} — Ouvrir en grand`); // Accessibilité : description
  } else if (media.video) {
    isVideo = true;
    mediaElement = document.createElement('video');
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.video}`;
    mediaElement.setAttribute('aria-label', media.title);
    mediaElement.setAttribute('loading', 'lazy'); // Optimisation chargement
    mediaElement.preload = 'metadata'; // Optimisation chargement
    mediaElement.muted = true; // Pas de son auto
    mediaElement.tabIndex = 0;
    mediaElement.setAttribute('role', 'button');
    mediaElement.setAttribute('aria-label', `${media.title} — Ouvrir en grand`);
  }

  // Données pour lightbox
  mediaElement.dataset.title = media.title;
  mediaElement.dataset.id = media.id;

  // --- Conteneur du média ---
  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');
  mediaContainer.appendChild(mediaElement);

  // --- Si vidéo : ajouter bouton play overlay ---
  if (isVideo) {
    const playBtn = document.createElement('button');
    playBtn.classList.add('video-play-button');
    playBtn.setAttribute('aria-label', `Lire ${media.title}`);
    playBtn.innerHTML = `
      <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <polygon points="16,12 16,52 48,32" fill="#ffffff"/>
      </svg>
    `;
    playBtn.tabIndex = 0;
    mediaContainer.appendChild(playBtn);

    const openEvent = () => {
      const event = new CustomEvent('openLightbox', { detail: media.id });
      article.dispatchEvent(event);
    };

    mediaElement.addEventListener('click', openEvent);
    // Ouvre lightbox au clic
    mediaElement.addEventListener('keydown', (e) => {
      // Ouvre lightbox au clavier
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEvent();
      }
    });

    playBtn.addEventListener('click', openEvent);
    playBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEvent();
      }
    });
  } else {
    const openEvent = () => {
      const event = new CustomEvent('openLightbox', { detail: media.id });
      article.dispatchEvent(event);
    };

    mediaElement.addEventListener('click', openEvent);
    mediaElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEvent();
      }
    });
  }

  // --- Classe .focused sur l'article pour fallback si besoin ---
  mediaElement.addEventListener('focus', () =>
    article.classList.add('focused'),
  );
  mediaElement.addEventListener('blur', () =>
    article.classList.remove('focused'),
  );

  // --- Footer du média (titre + like button) ---
  const mediaFooter = document.createElement('div');
  mediaFooter.classList.add('media-footer');

  const titleEl = document.createElement('h2');
  titleEl.textContent = media.title;

  const likeButton = document.createElement('button');
  likeButton.classList.add('like-button');
  likeButton.setAttribute('aria-label', `Aimer ${media.title}`);
  likeButton.setAttribute('aria-pressed', 'false'); // État du bouton
  likeButton.innerHTML = `<span class="like-count">${media.likes}</span> ❤`;
  likeButton.dataset.id = media.id; //Stockage ID du média dans attribut data-id

  mediaFooter.append(titleEl, likeButton);

  // Assemblage final
  article.append(mediaContainer, mediaFooter);

  return article;
}
