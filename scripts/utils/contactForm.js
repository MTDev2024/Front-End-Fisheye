document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("contact_modal");
  const nameSpan = document.getElementById("photographer-name");
  const openBtns = document.querySelectorAll(".modal-btn");
  const closeBtn = modal.querySelector(".modal-close");

  function openModal() {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    // on met le focus sur le premier champ
    const firstInput = modal.querySelector("input, textarea, button");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  // Ouverture via les boutons
  openBtns.forEach((btn) => btn.addEventListener("click", openModal));

  // Fermeture via le bouton X
  closeBtn.addEventListener("click", closeModal);

  // Fermeture via Échap
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // Fermeture si clic en dehors du contenu
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
});

// ---------------------- SÉLECTION DU FORMULAIRE ----------------------
const form = document.getElementById("form");

// ---------------------- VALIDATION CHAMPS ----------------------
function validateFirstname() {
  // Récupération de l'élément html dont l'ID est "firstname"
  const firstnameInput = document.getElementById("firstname");
  // Récupération de la div qui sert à afficher l'erreur
  const firstnameError = document.getElementById("firstname-error");
  // Récupération de la saisie, suppression des espaces avant et après
  // pour ne pas valider un champ contenant uniquement des espaces.
  const value = firstnameInput.value.trim();
  // Si l'input est vide on affiche l'erreur
  if (value === "") {
    firstnameError.textContent = "Veuillez entrer votre prénom.";
    return false;
  }
  // Si la saisie est < 2 caractères on affiche l'erreur
  if (value.length < 2) {
    firstnameError.textContent =
      "Le prénom doit contenir au moins 2 caractères.";
    // si ce n'est pas le cas la saisie n'est pas validée
    return false;
  }
  // On efface au cas où un message était présent d'une saisie antérieure
  firstnameError.textContent = "";
  // On valide la saisie
  return true;
}

function validateLastname() {
  const lastnameInput = document.getElementById("lastname");
  const lastnameError = document.getElementById("lastname-error");
  const value = lastnameInput.value.trim();

  if (value === "") {
    lastnameError.textContent = "Veuillez entrer votre nom.";
    return false;
  }
  if (value.length < 2) {
    lastnameError.textContent = "Le nom doit contenir au moins 2 caractères.";
    return false;
  }
  lastnameError.textContent = "";
  return true;
}

function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const value = emailInput.value.trim();
  // Regex adresse email :
  // ^                          -> début de la chaîne
  // [a-zA-Z0-9._%+-]+          -> au moins 1 caractère valide avant le @
  //                              (lettres, chiffres, point, underscore, %, +, -)
  // @                          -> caractère arobase obligatoire
  // [a-zA-Z0-9-]+              -> domaine (lettres, chiffres, tirets)
  // (\.[a-zA-Z]{2,10})+        -> au moins un point suivi de 2 à 10 lettres (extensions .fr, .com, .co.uk)
  // $                          -> fin de la chaîne
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,10})+$/;

  if (!emailRegex.test(value)) {
    emailError.textContent =
      "Veuillez entrer une adresse email valide (ex : nom@domaine.fr).";
    return false;
  }
  emailError.textContent = "";
  return true;
}

function validateMessage() {
  const messageInput = document.getElementById("message");
  const messageError = document.getElementById("message-error");
  const value = messageInput.value.trim();

  if (value === "") {
    messageError.textContent = "Veuillez entrer un message.";
    return false;
  }
  if (value.length < 10) {
    messageError.textContent =
      "Votre message doit contenir au moins 10 caractères.";
    return false;
  }
  messageError.textContent = "";
  return true;
}

// ---------------------- VALIDATION GLOBALE ----------------------
// vérifie le formulaire en appelant chaque fonction individuellement
function validate() {
  return (
    // && = ET logique
    // toutes les fonctions individuelles doivent retourner true -> validate() renvoie true
    // si une renvoie false -> validate() sera false et form invalide
    validateFirstname() &&
    validateLastname() &&
    validateEmail() &&
    validateMessage()
  );
}

// ---------------------- ÉVÉNEMENTS EN TEMPS RÉEL ----------------------
// Validation en direct lors de la saisie ou modification des champs
document
  .getElementById("firstname")
  .addEventListener("input", validateFirstname);
document.getElementById("lastname").addEventListener("input", validateLastname);
document.getElementById("email").addEventListener("input", validateEmail);

// ---------------------- SOUMISSION DU FORMULAIRE ----------------------
form.addEventListener("submit", (event) => {
  // empeche le reload de la page
  event.preventDefault();
  // validation globale de tous les champs
  const formIsValid = validate();
  // zone d'affichage du message de validation
  const validMessage = document.getElementById("valid-message");

  if (formIsValid) {
    // --- RÉCUPÉRATION DES DONNÉES DU FORMULAIRE ---
    const formData = {
      firstname: document.getElementById("firstname").value.trim(),
      lastname: document.getElementById("lastname").value.trim(),
      email: document.getElementById("email").value.trim(),
    };

    console.log("Données du formulaire :", formData);
    // --- AFFICHAGE MESSAGE SUCCÈS ---
    validMessage.classList.remove("form-error"); // supprime l'éventuelle classe d'erreur
    validMessage.classList.add("form-success"); // ajoute la classe succès
    validMessage.textContent = "Votre message a été envoyé, merci."; // message de validation affiché
  }
});
