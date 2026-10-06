/* ============================
   LABQUIM — App Principal (JS)
   ============================ */

// Determina a página atual (para destacar o item do menu)
function paginaAtual() {
  const path = window.location.pathname;
  if (path.includes('/linhas-pesquisa/')) return 'pesquisa';
  if (path.includes('/projetos/')) return 'projetos';
  if (path.includes('/tutoriais/')) return 'tutoriais';
  if (path.includes('/ferramentas/')) return 'ferramentas';
  const arq = path.split('/').pop() || 'index.html';
  const mapa = {
    'index.html': 'home',
    'laboratorio.html': 'laboratorio',
    'professores.html': 'equipe',
    'publicacoes.html': 'publicacoes',
  };
  return mapa[arq] || 'home';
}

// Injeta header e footer
document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');

  if (headerContainer) headerContainer.innerHTML = gerarHeader(paginaAtual());
  if (footerContainer) footerContainer.innerHTML = gerarFooter();

  inicializarNav();
  inicializarCarousel();
  inicializarFormulario();
});

/* ===== CAROUSEL ===== */
function inicializarCarousel() {
  const track = document.getElementById('carousel-track');
  const dots = document.querySelectorAll('.dot');
  if (!track) return;

  let atual = 0;
  const total = track.children.length;

  function irPara(idx) {
    atual = (idx + total) % total;
    track.style.transform = `translateX(-${atual * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('ativo', i === atual));
  }

  document.getElementById('carousel-prev')?.addEventListener('click', () => irPara(atual - 1));
  document.getElementById('carousel-next')?.addEventListener('click', () => irPara(atual + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => irPara(i)));

  // Auto play
  let timer = setInterval(() => irPara(atual + 1), 5000);
  track.parentElement?.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement?.addEventListener('mouseleave', () => {
    timer = setInterval(() => irPara(atual + 1), 5000);
  });
}

/* ===== FORMULÁRIO DE CONTATO ===== */
function inicializarFormulario() {
  const form = document.getElementById('form-contato');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('btn-enviar');
    const alerta = document.getElementById('form-alerta');

    // Validação básica
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !mensagem) {
      mostrarAlerta(alerta, 'erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!validarEmail(email)) {
      mostrarAlerta(alerta, 'erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    // Loading state
    btn.classList.add('carregando');
    btn.disabled = true;

    try {
      const dados = {
        nome,
        email,
        assunto: form.assunto.value.trim() || 'Contato via site',
        mensagem,
        copia: form.copia.checked,
      };

      const res = await fetch(ROOT + 'api/contato.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      const resultado = await res.json();

      if (resultado.sucesso) {
        mostrarAlerta(alerta, 'sucesso',
          '✓ Mensagem enviada com sucesso! Entraremos em contato em breve.');
        form.reset();
      } else {
        throw new Error(resultado.mensagem || 'Erro ao enviar');
      }
    } catch (err) {
      // Fallback: abre cliente de e-mail
      const assunto = encodeURIComponent(form.assunto.value || 'Contato via site LabQuim');
      const corpo = encodeURIComponent(
        `Nome: ${form.nome.value}\nE-mail: ${form.email.value}\n\nMensagem:\n${form.mensagem.value}`
      );
      mostrarAlerta(alerta, 'sucesso',
        '✓ Abrindo seu cliente de e-mail... Se não abrir, envie para <strong>labexa@uefs.br</strong>.');
      window.location.href = `mailto:labexa@uefs.br?subject=${assunto}&body=${corpo}`;
    } finally {
      btn.classList.remove('carregando');
      btn.disabled = false;
    }
  });
}

function mostrarAlerta(el, tipo, msg) {
  if (!el) return;
  el.style.display = 'block';
  el.className = `alerta alerta-${tipo}`;
  el.innerHTML = msg;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => { el.style.display = 'none'; }, 8000);
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ===== ANIMAÇÕES DE SCROLL ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animar').forEach(el => observer.observe(el));


/* ===== ALTO CONTRASTE & FONTE — inicialização global ===== */
(function() {
  // Restaurar fonte salva
  var fs = localStorage.getItem('labquim-fonte');
  if (fs) document.documentElement.style.fontSize = fs + 'px';

  // Restaurar alto contraste
  if (localStorage.getItem('labquim-contraste') === '1') {
    document.documentElement.classList.add('alto-contraste');
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Botão na barra-topo (link-alto-contraste)
    var linkAC = document.getElementById('link-alto-contraste');
    if (linkAC) {
      linkAC.addEventListener('click', function(e) {
        e.preventDefault();
        var ativo = document.documentElement.classList.toggle('alto-contraste');
        localStorage.setItem('labquim-contraste', ativo ? '1' : '0');
        linkAC.textContent = ativo ? '✓ Alto Contraste' : 'Alto Contraste';
      });
      if (localStorage.getItem('labquim-contraste') === '1') {
        linkAC.textContent = '✓ Alto Contraste';
      }
    }
  });
})();
