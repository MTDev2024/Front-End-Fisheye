export function photographerTemplate(data) {
  const { id, name, portrait, city, country, tagline, price } = data;
  const picture = `assets/photographers/${portrait}`;

  // Création card page d'accueil
  function getUserCardDOM() {
    const article = document.createElement('article');
    article.classList.add('photographer-card');
    article.dataset.id = id;

    const img = document.createElement('img');
    img.src = picture;
    img.alt = `Portrait de ${name}, photographe à ${city}, ${country}`;
    img.classList.add('photographer-portrait');

    const h2 = document.createElement('h2');
    h2.textContent = name;
    h2.classList.add('photographer-name');

    const link = document.createElement('a');
    link.href = `photographer.html?id=${id}`;
    link.ariaLabel = `${name}, photographe à ${city}, ${country}`;
    link.append(img, h2);

    const location = document.createElement('p');
    location.textContent = `${city}, ${country}`;
    location.classList.add('photographer-location');

    const taglineElt = document.createElement('p');
    taglineElt.textContent = tagline;
    taglineElt.classList.add('photographer-tagline');

    const priceElt = document.createElement('p');
    priceElt.textContent = `${price} €/jour`;
    priceElt.classList.add('photographer-price');

    article.append(link, location, taglineElt, priceElt);
    return article;
  }

  // Création header page photographe
  function getUserHeaderDOM() {
    const heroContainer = document.createElement('div');
    heroContainer.classList.add('photograph-hero');

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('photograph-info');

    // Nom photographe
    const h1 = document.createElement('h1');
    h1.textContent = name;
    h1.classList.add('photograph-name');

    // Localisation
    const locationEl = document.createElement('p');
    locationEl.textContent = `${city}, ${country}`;
    locationEl.classList.add('photograph-location');

    // Slogan
    const taglineEl = document.createElement('p');
    taglineEl.textContent = tagline;
    taglineEl.classList.add('photograph-tagline');

    infoContainer.append(h1, locationEl, taglineEl);

    // Bouton "Contactez-moi"
    const contactBtn = document.createElement('button');
    contactBtn.textContent = 'Contactez-moi';
    contactBtn.classList.add('contact_button');
    contactBtn.setAttribute(
      'aria-label',
      `Ouvrir le formulaire de contact pour ${name}`,
    );

    // Portrait
    const portraitImg = document.createElement('img');
    portraitImg.src = picture;
    portraitImg.alt = `Portrait de ${name}`;
    portraitImg.classList.add('photograph-portrait');

    // Ordre : infos → bouton → portrait
    heroContainer.append(infoContainer, contactBtn, portraitImg);

    return heroContainer;
  }

  return {
    id,
    name,
    picture,
    city,
    country,
    tagline,
    price,
    getUserCardDOM,
    getUserHeaderDOM,
  };
}
