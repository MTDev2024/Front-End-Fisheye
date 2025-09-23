export function mediaFactory(media, photographerFolder) {
  // --- Création article ---
  const article = document.createElement('article');
  article.classList.add('media-item');

  const folderName = encodeURIComponent(photographerFolder);

  let mediaElement;
  let isVideo = false;

  // --- Création du média ---
  if (media.image) {
    // Image
    mediaElement = document.createElement('img');
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.image}`;
    mediaElement.alt = media.title; // accessibilité
    mediaElement.setAttribute('loading', 'lazy'); // lazy load
    mediaElement.tabIndex = 0; // focusable dans galerie
  } else if (media.video) {
    // Vidéo
    isVideo = true;
    mediaElement = document.createElement('video');
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.video}`;
    mediaElement.setAttribute('aria-label', media.title);
    mediaElement.setAttribute('loading', 'lazy');
    mediaElement.preload = 'metadata';
    mediaElement.muted = true;
    mediaElement.removeAttribute('controls'); // pas focusable dans galerie
    mediaElement.tabIndex = -1;
  }

  mediaElement.dataset.title = media.title;

  // --- Conteneur média ---
  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');
  mediaContainer.appendChild(mediaElement);

  if (isVideo) {
    // Bouton play overlay
    const playBtn = document.createElement('button');
    playBtn.classList.add('video-play-button');
    playBtn.setAttribute('aria-label', `Lire ${media.title}`);
    playBtn.innerHTML = `
      <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <polygon points="16,12 16,52 48,32" fill="#ffffff"/>
      </svg>
    `;
    playBtn.tabIndex = 0; // focusable

    mediaContainer.appendChild(playBtn);

    // Ouvrir lightbox avec vidéo
    playBtn.addEventListener('click', () =>
      openLightbox(mediaElement.cloneNode(true)),
    );
    playBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playBtn.click();
      }
    });

    // Clic sur vidéo pour ouvrir lightbox
    mediaElement.addEventListener('click', () =>
      openLightbox(mediaElement.cloneNode(true)),
    );
  } else {
    // Image : clic ou clavier pour lightbox
    mediaElement.addEventListener('click', () =>
      openLightbox(mediaElement.cloneNode(true)),
    );
    mediaElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mediaElement.click();
      }
    });
  }

  // --- Footer du média (titre + bouton like) ---
  const mediaFooter = document.createElement('div');
  mediaFooter.classList.add('media-footer');

  const titleEl = document.createElement('h2');
  titleEl.textContent = media.title;

  const likeButton = document.createElement('button');
  likeButton.classList.add('like-button');
  likeButton.setAttribute('aria-label', `Aimer ${media.title}`);
  likeButton.innerHTML = `<span class="like-count">${media.likes}</span> ❤`;
  likeButton.dataset.id = media.id;

  mediaFooter.append(titleEl, likeButton);
  article.append(mediaContainer, mediaFooter);

  return article;
}

// --- Lightbox ---
function openLightbox(clone) {
  const lightbox = document.getElementById('lightbox');
  const content = lightbox.querySelector('.lightbox-content');

  if (clone.tagName === 'VIDEO') {
    clone.setAttribute('controls', '');
    clone.autoplay = true;
    clone.tabIndex = 0; // vidéo focusable dans lightbox
  }

  content.innerHTML = '';
  content.appendChild(clone);

  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden', 'false');

  // Fermer lightbox si clic hors contenu
  lightbox.addEventListener('click', (e) => {
    if (!content.contains(e.target)) closeLightbox();
  });

  // Bouton close
  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.focus(); // focus sur fermeture lightbox
  closeBtn.addEventListener('click', closeLightbox);
}

// --- Fermer lightbox ---
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const content = lightbox.querySelector('.lightbox-content');
  content.innerHTML = '';
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden', 'true');
}
