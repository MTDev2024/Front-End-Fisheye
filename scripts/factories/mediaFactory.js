export function mediaFactory(media, photographerFolder) {
  // --- Création article ---
  const article = document.createElement("article");
  article.classList.add("media-item");

  const folderName = encodeURIComponent(photographerFolder);

  let mediaElement;
  let isVideo = false;

  // --- Création du média - image / vidéo ---
  if (media.image) {
    // Image
    mediaElement = document.createElement("img");
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.image}`;
    mediaElement.alt = media.title; // Pour accessibilité
    mediaElement.setAttribute("loading", "lazy"); // Lazy load
    mediaElement.tabIndex = 0; // Navigation clavier
  } else if (media.video) {
    // Vidéo
    isVideo = true;
    mediaElement = document.createElement("video");
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.video}`;
    mediaElement.setAttribute("aria-label", media.title); // Accessibilité
    mediaElement.setAttribute("loading", "lazy"); 
    mediaElement.preload = "metadata"; 
    mediaElement.muted = true; // Lecture silencieuse si autoplay
    mediaElement.removeAttribute("controls"); // Pas de lecture directe
    mediaElement.tabIndex = -1; // Focus bouton ou conteneur
  }

  // --- Ajout data-title pour la lightbox ---
  mediaElement.dataset.title = media.title;

  // --- Conteneur overlay play si vidéo ---
  const mediaContainer = document.createElement("div");
  mediaContainer.classList.add("media-container");
  mediaContainer.appendChild(mediaElement);

  if (isVideo) {
    // Bouton play overlay pour vidéo
    const playBtn = document.createElement("button");
    playBtn.classList.add("video-play-button");
    playBtn.setAttribute("aria-label", `Lire ${media.title}`);
    playBtn.innerHTML = `
      <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <polygon points="16,12 16,52 48,32" fill="#ffffff"/>
      </svg>
    `;
    playBtn.tabIndex = 0; // Focus clavier
    mediaContainer.appendChild(playBtn);

    // Ouverture lightbox
    playBtn.addEventListener("click", () => openLightbox(mediaElement.cloneNode(true)));
    playBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playBtn.click();
      }
    });

    // Clic sur l’image/vidéo pour ouvrir la lightbox
    mediaElement.addEventListener("click", () => openLightbox(mediaElement.cloneNode(true)));
  } else {
    // Image : clic ou clavier pour ouvrir lightbox
    mediaElement.addEventListener("click", () => openLightbox(mediaElement.cloneNode(true)));
    mediaElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        mediaElement.click();
      }
    });
  }

  // --- Footer du média (titre + bouton like) ---
  const mediaFooter = document.createElement("div");
  mediaFooter.classList.add("media-footer");

  // Titre du média
  const titleEl = document.createElement("h2");
  titleEl.textContent = media.title;

  // Bouton Like
  const likeButton = document.createElement("button");
  likeButton.classList.add("like-button");
  likeButton.setAttribute("aria-label", `Aimer ${media.title}`);
  // Contenu du bouton : nombre de likes + cœur
  likeButton.innerHTML = `<span class="like-count">${media.likes}</span> ❤`;

  // Ajout id unique / bouton pour lier le bouton à son média pour stockage localStorage
  likeButton.dataset.id = media.id;

  // Assemblage  footer
  mediaFooter.append(titleEl, likeButton);

  // --- Assemblage final article ---
  article.append(mediaContainer, mediaFooter);

  return article;
}

// --- Fonction ouverture lightbox ---
function openLightbox(clone) {
  const lightbox = document.getElementById("lightbox");
  const content = lightbox.querySelector(".lightbox-content");

  // Si vidéo -> ajout controles & lecture automatique
  if (clone.tagName === "VIDEO") {
    clone.setAttribute("controls", "");
    clone.autoplay = true;
  }

  content.innerHTML = "";
  content.appendChild(clone);

  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");

  // Fermer lightbox si clic hors contenu
  lightbox.addEventListener("click", (e) => {
    if (!content.contains(e.target)) closeLightbox();
  });

  // Bouton close
  const closeBtn = lightbox.querySelector(".lightbox-close");
  closeBtn.addEventListener("click", closeLightbox);
}

// --- Fonction fermeture lightbox ---
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const content = lightbox.querySelector(".lightbox-content");
  content.innerHTML = "";
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
}
