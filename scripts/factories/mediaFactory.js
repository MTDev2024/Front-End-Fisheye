export function mediaFactory(media, photographerFolder) {
  const article = document.createElement("article");
  article.classList.add("media-item");

  const folderName = encodeURIComponent(photographerFolder);

  let mediaElement;
  let isVideo = false;

  // --- Création du média ---
  if (media.image) {
    // Image normale
    mediaElement = document.createElement("img");
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.image}`;
    mediaElement.alt = media.title; // accessibilité
    mediaElement.tabIndex = 0; // focus clavier
  } else if (media.video) {
    // Vidéo miniature
    isVideo = true;
    mediaElement = document.createElement("video");
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.video}`;
    mediaElement.setAttribute("aria-label", media.title);
    mediaElement.tabIndex = -1; // ne prend pas le focus, le bouton sert au focus
    mediaElement.removeAttribute("controls"); // pas de lecture dans la galerie
    mediaElement.muted = true; // auto-play silencieux si besoin
    mediaElement.preload = "metadata";
  }

  // --- Conteneur pour overlay play si vidéo ---
  const mediaContainer = document.createElement("div");
  mediaContainer.classList.add("media-container");
  mediaContainer.appendChild(mediaElement);

  if (isVideo) {
    // Création du bouton play overlay
    const playBtn = document.createElement("button");
    playBtn.classList.add("video-play-button");
    playBtn.setAttribute("aria-label", `Lire ${media.title}`);
    playBtn.innerHTML = `
      <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <polygon points="16,12 16,52 48,32" fill="#ffffff"/>
      </svg>
    `;
    playBtn.tabIndex = 0; // focus clavier
    mediaContainer.appendChild(playBtn);

    // Ouvrir la lightbox au clic ou au clavier
    playBtn.addEventListener("click", () => openLightbox(mediaElement.cloneNode(true)));
    playBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playBtn.click();
      }
    });

    mediaElement.addEventListener("click", () => openLightbox(mediaElement.cloneNode(true)));
  } else {
    // Click sur l'image ouvre la lightbox
    mediaElement.addEventListener("click", () => openLightbox(mediaElement.cloneNode(true)));
    mediaElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        mediaElement.click();
      }
    });
  }

  // --- Footer média ---
  const mediaFooter = document.createElement("div");
  mediaFooter.classList.add("media-footer");

  const titleEl = document.createElement("h2");
  titleEl.textContent = media.title;

  const likeButton = document.createElement("button");
  likeButton.classList.add("like-button");
  likeButton.setAttribute("aria-label", `Aimer ${media.title}`);
  likeButton.innerHTML = `<span class="like-count">${media.likes}</span> ❤`;

  mediaFooter.append(titleEl, likeButton);

  // --- Assemblage final ---
  article.append(mediaContainer, mediaFooter);

  return article;
}

// --- Fonction d'ouverture de la lightbox ---
function openLightbox(clone) {
  const lightbox = document.getElementById("lightbox");
  const content = lightbox.querySelector(".lightbox-content");

  // Si c'est une vidéo, on remet les controls et on lance la lecture
  if (clone.tagName === "VIDEO") {
    clone.setAttribute("controls", "");
    clone.autoplay = true;
  }

  content.innerHTML = "";
  content.appendChild(clone);

  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");

  // --- Fermer la lightbox en cliquant hors du contenu ---
  lightbox.addEventListener("click", (e) => {
    if (!content.contains(e.target)) closeLightbox();
  });

  // --- Bouton close ---
  const closeBtn = lightbox.querySelector(".lightbox-close");
  closeBtn.addEventListener("click", closeLightbox);
}

// --- Fonction de fermeture ---
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const content = lightbox.querySelector(".lightbox-content");
  content.innerHTML = "";
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
}
