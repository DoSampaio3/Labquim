/* ============================
   LABQUIM — Componentes compartilhados
   ============================ */

/* Caminho da raiz do site (funciona em qualquer profundidade de pasta) */
const ROOT = (() => {
  const src = document.currentScript && document.currentScript.src;
  return src ? src.replace(/assets\/js\/[^\/]*$/, '') : '';
})();


function gerarHeader(paginaAtiva) {
  const navItens = [
    { texto: 'Home', href: ROOT + 'index.html', id: 'home' },
    { texto: 'Laboratório', href: ROOT + 'pages/laboratorio.html', id: 'laboratorio' },
    {
      texto: 'Linhas de Pesquisa', id: 'pesquisa', dropdown: [
        { texto: 'Biocombustíveis e Quimiometria', href: ROOT + 'pages/linhas-pesquisa/biocombustiveis-quimiometria.html' },
        { texto: 'Fitoquímica e Produtos Naturais', href: ROOT + 'pages/linhas-pesquisa/fitoquimica.html' },
        { texto: 'Gerenciamento de Resíduos Químicos', href: ROOT + 'pages/linhas-pesquisa/residuos-quimicos.html' },
        { texto: 'Materiais e Adsorção', href: ROOT + 'pages/linhas-pesquisa/materiais-adsorcao.html' },
        { texto: 'Química Analítica Ambiental', href: ROOT + 'pages/linhas-pesquisa/quimica-analitica-ambiental.html' },
      ]
    },
    { texto: 'Equipe', href: ROOT + 'pages/professores.html', id: 'equipe' },
    {
      texto: 'Projetos', id: 'projetos', dropdown: [
        { texto: 'Prof. Dr. Clayton Queiroz Alves', href: ROOT + 'pages/projetos/clayton.html' },
        { texto: 'Profa. Dra. Humbervânia Silva', href: ROOT + 'pages/projetos/humbervania.html' },
        { texto: 'Profa. Dra. Ivanice Santos', href: ROOT + 'pages/projetos/ivanice.html' },
        { texto: 'Prof. Dr. Marcos Melo', href: ROOT + 'pages/projetos/marcos.html' },
        { texto: 'Profa. Dra. Vânia Rastelly de Sousa', href: ROOT + 'pages/projetos/vania.html' },
      ]
    },
    { texto: 'Publicações', href: ROOT + 'pages/publicacoes.html', id: 'publicacoes' },
    {
      texto: 'Tutoriais', id: 'tutoriais', dropdown: [
        { texto: 'Instalação e uso do R', href: ROOT + 'pages/tutoriais/r.html' },
        { texto: 'Softwares para Análise de RMN', href: ROOT + 'pages/tutoriais/rmn.html' },
      ]
    },
    {
      texto: 'Ferramentas', id: 'ferramentas', dropdown: [
        { texto: 'Desenhador de Moléculas', href: ROOT + 'pages/ferramentas/moleculas.html' },
        { texto: 'Calculadora de Soluções', href: ROOT + 'pages/ferramentas/solucoes.html' },
        { texto: 'Tabela Periódica', href: ROOT + 'pages/ferramentas/tabela.html' },
        { texto: 'Analisador IC₅₀', href: ROOT + 'pages/ferramentas/ic50.html' },
      ]
    },
    { texto: 'Contato', href: ROOT + 'index.html#contato', id: 'contato' },
  ];

  const listaNav = navItens.map(item => {
    const ativo = item.id === paginaAtiva ? 'ativo' : '';
    if (item.dropdown) {
      const links = item.dropdown.map(d =>
        `<a href="${d.href}">${d.texto}</a>`
      ).join('');
      return `
        <li class="${ativo}">
          <a href="#" class="dropdown-toggle" data-menu="${item.id}">
            ${item.texto} <i class="fa fa-chevron-down" style="font-size:0.65rem; margin-left:4px;"></i>
          </a>
          <div class="dropdown-menu-custom" id="menu-${item.id}">${links}</div>
        </li>`;
    }
    return `<li class="${ativo}"><a href="${item.href}">${item.texto}</a></li>`;
  }).join('');

  return `
    <div class="barra-topo">
      <div class="container">
        <a href="${ROOT}pages/mapa-do-site.html">Mapa do Site</a>
        <a href="${ROOT}pages/acessibilidade.html">Acessibilidade</a>
        <a id="link-alto-contraste" href="${ROOT}pages/acessibilidade.html#alto-contraste">Alto Contraste</a>
      </div>
    </div>

    <header class="site-header">
      <div class="container header-inner">
        <div class="header-logos">
          <img src="${ROOT}assets/img/logo.jpg" alt="Logo LabQuim" class="logo-lab">
          <div class="header-divider"></div>
          <img src="${ROOT}assets/img/logo_uefs.png" alt="Logo UEFS" class="logo-uefs">
        </div>
        <div class="header-title">
          <h1>LabQuim</h1>
          <span>Laboratório de Química | UEFS</span>
        </div>
      </div>
    </header>

    <nav class="nav-principal">
      <div class="container" style="position:relative;">
        <ul class="nav-lista" id="nav-lista">
          ${listaNav}
        </ul>
        <button class="nav-toggle" id="nav-toggle" aria-label="Menu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </nav>
    <span id="conteudo" tabindex="-1"></span>
  `;
}

function gerarFooter() {
  return `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div>
            <img src="${ROOT}assets/img/logo_uefs.png" alt="Logo UEFS" style="height:64px; filter:brightness(0) invert(1); opacity:0.9; display:block; margin-bottom:16px;">
            <p class="footer-desc">
              Laboratório de Pesquisa em Química da Universidade Estadual de Feira de Santana (UEFS)
            </p>
          </div>
          <div>
            <h4>Navegação</h4>
            <ul>
              <li><a href="${ROOT}index.html">Home</a></li>
              <li><a href="${ROOT}pages/laboratorio.html">Laboratório</a></li>
                            <li><a href="${ROOT}pages/linhas-pesquisa/fitoquimica.html">Fitoquímica</a></li>
              <li><a href="${ROOT}pages/professores.html">Equipe</a></li>
              <li><a href="${ROOT}pages/projetos/index.html">Projetos</a></li>
              <li><a href="${ROOT}pages/publicacoes.html">Publicações</a></li>
              <li><a href="${ROOT}index.html#contato">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4>Localização</h4>
            <ul>
              <li style="color:rgba(255,255,255,0.7); font-size:0.88rem; line-height:1.7; margin-bottom:0;">
                Universidade Estadual de Feira de Santana<br>
                Av. Transnordestina, s/n - Novo Horizonte<br>
                CEP 44036-900 — Feira de Santana, BA<br>
                Tel.: (75) 3161-8086
              </li>
            </ul>
            <div style="margin-top:18px;">
              <h4>Fomento</h4>
              <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
                <img src="${ROOT}assets/img/cnpq.png" alt="CNPq" style="height:32px; filter:brightness(0) invert(1); opacity:0.7;">
                <img src="${ROOT}assets/img/capes.png" alt="CAPES" style="height:28px; filter:brightness(0) invert(1); opacity:0.7;">
                <span style="font-weight:700; letter-spacing:.08em; color:rgba(255,255,255,.75); font-size:.95rem;">FAPESB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span>© ${new Date().getFullYear()} LabQuim — Laboratório de Química, UEFS. Todos os direitos reservados.</span>
          <span>Dados baseados nos Currículos Lattes — podem estar desatualizados; consulte o Lattes ou o <a href="${ROOT}index.html#contato" style="color:inherit; text-decoration:underline;">laboratório</a>.</span>
        </div>
      </div>
    </footer>
  `;
}

function inicializarNav() {
  const toggle = document.getElementById('nav-toggle');
  const lista  = document.getElementById('nav-lista');
  if (!toggle || !lista) return;

  /* ── Hambúrguer: abre/fecha menu ── */
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();                       // impede que o click chegue ao document
    const aberta = lista.classList.toggle('aberta');
    toggle.innerHTML = aberta
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  /* ── Dropdowns: desktop = hover (CSS), mobile = click ── */
  document.querySelectorAll('.dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth > 768) return;     // desktop usa hover CSS

      const menuId = `menu-${btn.dataset.menu}`;
      const menu   = document.getElementById(menuId);
      if (!menu) return;

      // Fecha todos os outros dropdowns abertos
      document.querySelectorAll('.dropdown-menu-custom.aberto').forEach(m => {
        if (m.id !== menuId) m.classList.remove('aberto');
      });

      menu.classList.toggle('aberto');
    });
  });

  /* ── Fecha menu ao clicar fora ── */
  document.addEventListener('click', (e) => {
    if (!lista.contains(e.target) && !toggle.contains(e.target)) {
      lista.classList.remove('aberta');
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
      document.querySelectorAll('.dropdown-menu-custom.aberto').forEach(m => m.classList.remove('aberto'));
    }
  });

  /* ── Links simples: fecha menu ao navegar ── */
  lista.querySelectorAll('a:not(.dropdown-toggle)').forEach(a => {
    a.addEventListener('click', () => {
      lista.classList.remove('aberta');
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

function gerarBreadcrumb(itens) {
  const lista = itens.map((item, i) => {
    if (i === itens.length - 1) {
      return `<li><a href="#">${item.texto}</a></li>`;
    }
    return `<li><a href="${item.href}">${item.texto}</a></li>`;
  }).join('');
  return `
    <div class="breadcrumb">
      <div class="container">
        <ul class="breadcrumb-lista">${lista}</ul>
      </div>
    </div>
  `;
}
