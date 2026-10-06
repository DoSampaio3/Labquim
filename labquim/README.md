# LabQuim — Laboratório de Química | UEFS

Site estático (HTML + CSS + JavaScript) do LabQuim.

## Estrutura

```
labquim/
├── index.html                  # Página inicial
├── pages/
│   ├── laboratorio.html
│   ├── professores.html        # Equipe
│   ├── publicacoes.html
│   ├── mapa-do-site.html
│   ├── acessibilidade.html
│   ├── linhas-pesquisa/        # fitoquimica, quimica-analitica-ambiental,
│   │                           # materiais-adsorcao, biocombustiveis-quimiometria,
│   │                           # residuos-quimicos
│   ├── projetos/               # index + um arquivo por professor
│   ├── tutoriais/              # r.html, rmn.html
│   └── ferramentas/            # moleculas, solucoes, tabela, ic50
├── assets/
│   ├── css/style.css
│   ├── js/                     # app.js, componentes.js e bibliotecas
│   └── img/                    # logos e fotos
└── api/
    └── contato.php             # formulário de contato (requer PHP)
```

## Como funciona

- Cabeçalho, menu e rodapé são gerados por `assets/js/componentes.js`.
  Os links usam a variável `ROOT`, calculada a partir do caminho do próprio
  script, então funcionam em qualquer pasta (e abrindo os arquivos direto no navegador).
- Para criar uma página nova: coloque o arquivo em `pages/` (ou subpasta),
  inclua `assets/js/componentes.js` e `assets/js/app.js` (com `../` conforme a profundidade)
  e adicione o link em `componentes.js`.

## Publicação

- **Vercel / GitHub Pages / Netlify:** publique a raiz do repositório
  (Framework: *Other*, sem build).
- **Formulário de contato:** `api/contato.php` só funciona em servidor com PHP.
  Na Vercel é preciso trocar por uma função serverless ou um serviço de formulários.
