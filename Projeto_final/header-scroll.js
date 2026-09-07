// Controla o comportamento do cabeçalho durante a rolagem.
// - Usa requestAnimationFrame para agrupar eventos de scroll (evita jitter/bounce).
// - Só considera mudança de direção se |delta| >= DELTA_THRESHOLD (ignora micro-movimentos).
// - Sempre mostra o header no topo da página, no fim da página, ou quando o usuário sobe.
// - Só esconde o header quando o usuário está claramente descendo além do limite.
(function () {
  const DELTA_THRESHOLD = 6; // px mínimos para considerar mudança de direção
  const SCROLL_TOP_LIMIT = 40; // abaixo disso, header sempre visível (mesmo threshold de is-scrolled)
  const HIDE_ON_DOWN_ABOVE = 120; // só esconde depois de rolar mais do que isso

  let lastScrollY = window.scrollY;
  let accumulatedDelta = 0;
  let ticking = false;

  function updateHeader() {
    ticking = false;

    const currentScrollY = window.scrollY;
    const isDesktop = window.innerWidth > 1024;
    const delta = currentScrollY - lastScrollY;

    // is-scrolled: encolher o header depois do threshold de topo.
    document.body.classList.toggle(
      "is-scrolled",
      currentScrollY > SCROLL_TOP_LIMIT,
    );

    // Detecta "cheguei no fim da página" (tolerância de 2px para bounce/subpixel).
    const atBottom =
      currentScrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2;

    // Casos em que o header SEMPRE deve estar visível:
    //  - fora do desktop (no mobile o header vira menu lateral, não usa is-hidden)
    //  - próximo do topo
    //  - no fim da página (resolve o bug de scroll bounce que travava is-hidden)
    if (!isDesktop || currentScrollY <= SCROLL_TOP_LIMIT || atBottom) {
      document.body.classList.remove("is-hidden");
      accumulatedDelta = 0;
      lastScrollY = currentScrollY;
      return;
    }

    // Ignora micro-movimentos (jitter, inércia do trackpad, scroll bounce).
    // NÃO atualiza lastScrollY aqui, pra evitar drift acumulado por sub-pixels.
    if (Math.abs(delta) < DELTA_THRESHOLD) {
      return;
    }

    // Reseta o acumulador quando a direção muda.
    if (
      (delta > 0 && accumulatedDelta < 0) ||
      (delta < 0 && accumulatedDelta > 0)
    ) {
      accumulatedDelta = 0;
    }
    accumulatedDelta += delta;

    if (delta < 0) {
      // Subindo: sempre mostra o header de volta.
      document.body.classList.remove("is-hidden");
    } else if (
      currentScrollY > HIDE_ON_DOWN_ABOVE &&
      accumulatedDelta > DELTA_THRESHOLD
    ) {
      // Descendo, passou do limite e delta acumulado suficiente: esconde.
      document.body.classList.add("is-hidden");
    }

    lastScrollY = currentScrollY;
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  // Estado inicial.
  updateHeader();
})();
