function photographerTemplate(data) {
  // Décomposition (destructuring) de l'objet `data` :
  // on extrait directement les propriétés dont on a besoin
  const { id, name, portrait, city, country, tagline, price } = data;

  // Construit le chemin de l'image à partir du nom de fichier `portrait`.
  const picture = `assets/photographers/${portrait}`;

  // Fonction interne qui crée et retourne la carte DOM pour photographe
  function getUserCardDOM() {
    // Création d'un <article> qui contiendra la carte photographe
    const article = document.createElement("article");
    article.classList.add("photographer-card");
    article.dataset.id = id; // facultatif : stocke l'id dans un attribut data-id

    // Création d'une balise <img>
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute(
      "alt",
      `Portrait de ${name}, photographe à ${city}, ${country}`
    );
    img.classList.add("photographer-portrait");

    // Création d'un <h2> pour afficher le nom
    const h2 = document.createElement("h2");
    h2.textContent = name;
    h2.classList.add("photographer-name");

    // Création du lien autour de l'image et du nom
    const link = document.createElement("a");
    link.setAttribute("href", `photographer.html?id=${id}`);
    link.setAttribute(
      "aria-label",
      `${name}, photographe à ${city}, ${country}`
    );
    link.appendChild(img);
    link.appendChild(h2);

    // Création d'un <p> pour afficher "Ville, Pays"
    const location = document.createElement("p");
    location.textContent = `${city}, ${country}`;
    location.classList.add("photographer-location");

    // Création d'un <p> pour la tagline
    const taglineElt = document.createElement("p");
    taglineElt.textContent = tagline;
    taglineElt.classList.add("photographer-tagline");

    // Création d'un <p> pour le prix
    const priceElt = document.createElement("p");
    priceElt.textContent = `${price} €/jour`;
    priceElt.classList.add("photographer-price");

    // On assemble la carte
    article.appendChild(link);
    article.appendChild(location);
    article.appendChild(taglineElt);
    article.appendChild(priceElt);

    // On retourne l'élément <article> complet
    return article;
  }

  return { id, name, picture, city, country, tagline, price, getUserCardDOM };
}
