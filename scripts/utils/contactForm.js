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
