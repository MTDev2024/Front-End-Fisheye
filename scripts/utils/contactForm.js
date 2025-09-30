// ---------------------- MODALE ET FORMULAIRE ----------------------
document.addEventListener('DOMContentLoaded', () => {
  // console.log('contactForm.js chargé'); // Debug : script chargé

  // ---------------------- MODALE ----------------------
  const modal = document.getElementById('contact_modal');
  const closeBtn = modal ? modal.querySelector('.modal-close') : null;

  // console.log('modal :', modal); // Debug : modale trouvée ?
  // console.log('closeBtn :', closeBtn); // Debug : bouton fermer trouvé ?

  // ---------------------- MODALE ----------------------

  function openModal() {
    modal.classList.add('show');
    modal.removeAttribute('aria-hidden');
    modal.removeAttribute('inert');
    modal.querySelector('input, textarea, button')?.focus();
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('inert', ''); // empêche focus dans modale fermée
  }

  // Rattacher events sur les boutons dynamiques
  function bindOpenButtons() {
    const openBtns = document.querySelectorAll('.contact_button');
    // console.log('openBtns :', openBtns.length, 'bouton(s) trouvé(s)');

    openBtns.forEach((btn) => {
      btn.removeEventListener('click', openModal); // évite doublons
      btn.addEventListener('click', openModal);
    });
  }

  // Attacher events aux boutons présents au chargement
  bindOpenButtons();

  // Ferme modale au click sur croix
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Ferme modale avec Echap
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // Ferme si click hors de la modale
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  // Observer le DOM (détecte si un bouton est injecté après coup par JS)
  const observer = new MutationObserver(() => {
    bindOpenButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ---------------------- FORMULAIRE ----------------------
  const form = document.getElementById('form');
  // console.log('form :', form); // Debug : formulaire trouvé ?

  // Vérifie prénom
  function validateFirstname() {
    const firstnameInput = document.getElementById('firstname');
    const firstnameError = document.getElementById('firstname-error');
    const value = firstnameInput.value.trim();

    if (value === '') {
      firstnameError.textContent = 'Veuillez entrer votre prénom.';
      return false;
    }
    if (value.length < 2) {
      firstnameError.textContent =
        'Le prénom doit contenir au moins 2 caractères.';
      return false;
    }
    firstnameError.textContent = '';
    return true;
  }

  // Vérifie nom
  function validateLastname() {
    const lastnameInput = document.getElementById('lastname');
    const lastnameError = document.getElementById('lastname-error');
    const value = lastnameInput.value.trim();

    if (value === '') {
      lastnameError.textContent = 'Veuillez entrer votre nom.';
      return false;
    }
    if (value.length < 2) {
      lastnameError.textContent = 'Le nom doit contenir au moins 2 caractères.';
      return false;
    }
    lastnameError.textContent = '';
    return true;
  }

  // Vérifie email
  function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const value = emailInput.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,10})+$/;

    if (!emailRegex.test(value)) {
      emailError.textContent = 'Veuillez entrer une adresse email valide.';
      return false;
    }
    emailError.textContent = '';
    return true;
  }

  // Vérifie message
  function validateMessage() {
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    const value = messageInput.value.trim();

    if (value === '') {
      messageError.textContent = 'Veuillez entrer un message.';
      return false;
    }
    if (value.length < 10) {
      messageError.textContent =
        'Votre message doit contenir au moins 10 caractères.';
      return false;
    }
    messageError.textContent = '';
    return true;
  }

  // Vérifie tous les champs
  function validate() {
    return (
      validateFirstname() &&
      validateLastname() &&
      validateEmail() &&
      validateMessage()
    );
  }

  // Validation en temps réel
  document
    .getElementById('firstname')
    .addEventListener('input', validateFirstname);
  document
    .getElementById('lastname')
    .addEventListener('input', validateLastname);
  document.getElementById('email').addEventListener('input', validateEmail);
  document.getElementById('message').addEventListener('input', validateMessage);

  // Soumission du formulaire
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // empêche reload
    const formIsValid = validate();
    // console.log('Formulaire valide ?', formIsValid); // Debug

    const validMessage = document.getElementById('valid-message');

    if (formIsValid) {
      const formData = {
        firstname: document.getElementById('firstname').value.trim(),
        lastname: document.getElementById('lastname').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim(),
      };
      console.log('Données du formulaire :', formData);

      // Affiche succès
      validMessage.classList.remove('form-error');
      validMessage.classList.add('form-success');
      validMessage.textContent = 'Votre message a été envoyé, merci.';

      form.reset(); // reset formulaire

      // Effacement anciens messages d'erreur
      document.querySelectorAll('.form-error').forEach((div) => {
        if (div.id !== 'valid-message') div.textContent = '';
      });
    } else {
      // Afficher erreur si invalid
      validMessage.classList.remove('form-success');
      validMessage.classList.add('form-error');
      validMessage.textContent = 'Certains champs doivent être corrigés.';

      // Focus 1er champ invalide
      if (!validateFirstname()) {
        document.getElementById('firstname').focus();
      } else if (!validateLastname()) {
        document.getElementById('lastname').focus();
      } else if (!validateEmail()) {
        document.getElementById('email').focus();
      } else if (!validateMessage()) {
        document.getElementById('message').focus();
      }
    }
  });
});
