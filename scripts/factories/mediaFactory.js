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
    mediaElement.alt = media.title; // Accessibilité
    mediaElement.setAttribute('loading', 'lazy'); // Lazy load
    mediaElement.tabIndex = 0; // Focusable dans la galerie
  } else if (media.video) {
    // Vidéo
    isVideo = true;
    mediaElement = document.createElement('video');
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.video}`;
    mediaElement.setAttribute('aria-label', media.title);
    mediaElement.setAttribute('loading', 'lazy');
    mediaElement.preload = 'metadata';
    mediaElement.muted = true;
    mediaElement.tabIndex = 0; // Focusable
  }

  mediaElement.dataset.title = media.title;
  mediaElement.dataset.id = media.id;

  // --- Conteneur média ---
  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');
  mediaContainer.appendChild(mediaElement);

  // --- Bouton play overlay pour vidéo ---
  if (isVideo) {
    const playBtn = document.createElement('button');
    playBtn.classList.add('video-play-button');
    playBtn.setAttribute('aria-label', `Lire ${media.title}`);
    playBtn.innerHTML = `
      <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <polygon points="16,12 16,52 48,32" fill="#ffffff"/>
      </svg>
    `;
    playBtn.tabIndex = 0; // Focusable

    mediaContainer.appendChild(playBtn);

    // Fonction émettre événement openLightbox
    const openEvent = () => {
      const event = new CustomEvent('openLightbox', { detail: media.id });
      article.dispatchEvent(event);
    };

    // Clic ou clavier sur vidéo
    mediaElement.addEventListener('click', openEvent);
    mediaElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEvent();
      }
    });

    // Clic ou clavier sur bouton play
    playBtn.addEventListener('click', openEvent);
    playBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEvent();
      }
    });
  } else {
    // --- Image : clic ou clavier pour lightbox ---
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

  // --- Footer média : titre + bouton like ---
  const mediaFooter = document.createElement('div');
  mediaFooter.classList.add('media-footer');

  const titleEl = document.createElement('h2');
  titleEl.textContent = media.title;

  const likeButton = document.createElement('button');
  likeButton.classList.add('like-button');
  likeButton.setAttribute('aria-label', `Aimer ${media.title}`);
  likeButton.setAttribute('aria-pressed', 'false');
  likeButton.innerHTML = `<span class="like-count">${media.likes}</span> ❤`;
  likeButton.dataset.id = media.id;

  mediaFooter.append(titleEl, likeButton);
  article.append(mediaContainer, mediaFooter);

  return article;
}
