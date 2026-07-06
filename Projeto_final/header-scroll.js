// Encolhe o header conforme o usuário rola a página, e esconde/mostra
// o header (já encolhido) dependendo da direção do scroll.
// Adiciona/remove duas classes no <body>:
// - "is-scrolled": controla o encolhimento (padding/tamanho da logo)
// - "is-hidden": controla o esconder (transform), só usado enquanto
//   o header já está encolhido
//
// Regras:
// - Abaixo de EXIT_THRESHOLD (perto do topo): header sempre visível,
//   no tamanho normal.
// - Ao passar de ENTER_THRESHOLD: o header encolhe e já some na hora.
// - Enquanto estiver encolhido (mais embaixo na página): rolar para
//   baixo esconde o header; rolar para cima mostra ele de volta, já
//   encolhido (não volta ao tamanho normal até chegar perto do topo).
//
// Depende de "overflow-anchor: none" no CSS do header para evitar que o
// navegador ajuste sozinho a posição de scroll quando a altura do header
// muda (o que causava a vibração antiga).

(function () {
  const ENTER_THRESHOLD = 80; // px rolados para começar a encolher (e já esconder)
  const EXIT_THRESHOLD = 20; // px rolados para voltar ao tamanho normal
  const DIRECTION_BUFFER = 5; // ignora variações pequenas de scroll (evita tremedeira)

  let isScrolled = false;
  let isHidden = false;
  let lastY = window.scrollY;
  let ticking = false;

  function show() {
    if (isHidden) {
      isHidden = false;
      document.body.classList.remove("is-hidden");
    }
  }

  function hide() {
    if (!isHidden) {
      isHidden = true;
      document.body.classList.add("is-hidden");
    }
  }

  function updateState() {
    const y = window.scrollY;
    const delta = y - lastY;

    if (!isScrolled && y > ENTER_THRESHOLD) {
      isScrolled = true;
      document.body.classList.add("is-scrolled");
      hide(); // encolheu, já some
    } else if (isScrolled && y < EXIT_THRESHOLD) {
      isScrolled = false;
      document.body.classList.remove("is-scrolled");
      show(); // perto do topo, sempre visível no tamanho normal
    }

    // Enquanto já está encolhido: esconde ao descer, mostra (encolhido) ao subir
    if (isScrolled && Math.abs(delta) > DIRECTION_BUFFER) {
      if (delta > 0) {
        hide();
      } else {
        show();
      }
      lastY = y;
    }

    ticking = false;
  }

  function handleScroll() {
    // Agrupa todas as chamadas em um único frame de animação,
    // evitando cálculos repetidos durante o mesmo scroll.
    if (!ticking) {
      window.requestAnimationFrame(updateState);
      ticking = true;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  updateState(); // roda uma vez ao carregar, caso a página já abra rolada
})();
