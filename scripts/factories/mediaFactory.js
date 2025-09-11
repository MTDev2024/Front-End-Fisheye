export function mediaFactory(media, photographerFolder) {
  const article = document.createElement("article");
  article.classList.add("media-item");

  let mediaElement;
  const folderName = encodeURIComponent(photographerFolder);

  if (media.image) {
    mediaElement = document.createElement("img");
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.image}`;
    mediaElement.alt = media.title;
  } else if (media.video) {
    mediaElement = document.createElement("video");
    mediaElement.src = `assets/Sample Photos/${folderName}/${media.video}`;
    mediaElement.setAttribute("controls", "");
    mediaElement.setAttribute("aria-label", media.title);
  }

  // Footer média
  const mediaFooter = document.createElement("div");
  mediaFooter.classList.add("media-footer");

  const titleEl = document.createElement("h2");
  titleEl.textContent = media.title;

  const likeButton = document.createElement("button");
  likeButton.classList.add("like-button");
  likeButton.setAttribute("aria-label", `Aimer ${media.title}`);
  likeButton.innerHTML = `<span class="like-count">${media.likes}</span> ❤`;

  mediaFooter.append(titleEl, likeButton);
  article.append(mediaElement, mediaFooter);

  return article;
}
