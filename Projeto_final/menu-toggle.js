// Menu mobile: abre/fecha o painel de navegação pelo botão hambúrguer.
(function () {
  function initMenu() {
    const menuIcon = document.querySelector(".menu-icon");
    const navMenu = document.querySelector(".nav-menu");

    if (!menuIcon || !navMenu) return;

    function setOpen(isOpen) {
      document.body.classList.toggle("is-menu-open", isOpen);
      menuIcon.setAttribute("aria-expanded", String(isOpen));
      menuIcon.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
      );
    }

    menuIcon.addEventListener("click", function () {
      const isOpen = document.body.classList.contains("is-menu-open");
      setOpen(!isOpen);
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    // Fecha o menu ao voltar para desktop.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) {
        setOpen(false);
      }
    });

    // Fecha com Esc.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMenu);
  } else {
    initMenu();
  }
})();
