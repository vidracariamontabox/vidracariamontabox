# Checklist Montabox

Documento único. Junta o checklist de segurança e o guia de rastreamento/domínio.

Estado: repositório privado, site no domínio provisório da Vercel (`https://vidracariamontabox.vercel.app/`). Sem domínio definitivo, sem Cloudflare e sem rastreador instalado.

Ordem: de cima para baixo. Não pular uma fase sem motivo.

---

## Já feito — segurança de conta, repo e dependências

- [x] **GitHub**: 2FA com passkey na conta pessoal.
- [x] **Vercel**: 2FA na conta pessoal, além do team.
- [x] **Registrador do domínio**: 2FA e bloqueio de transferência. (Só vale de verdade depois que o domínio for comprado; conferir de novo na compra.)
- [x] **Recovery codes**: GitHub, Vercel e registrador guardados fora do computador.
- [x] **`.gitignore`**: `.env*` (manter `.env.example` se existir).
- [x] **Histórico do Git**: ZIPs antigos (Cables.gl e backups `Trionn/`) inspecionados. Sem `.env` ou chave para revogar.
- [x] **Dependabot**: alertas e security updates em *Settings → Code security*.
- [x] **Dependabot (rotina)**: `.github/dependabot.yml` com atualização semanal.
- [x] **`npm audit`**: rodado. Não usar `npm audit fix --force` sem ler antes.
- [x] **PRs do Dependabot (regra)**: quando mexer em `three`, `@react-three/fiber`, `next` ou `gsap`, validar o Hero visualmente antes do merge.
- [x] **Tailwind 3 → 4**: não fazer agora. PR de major fechado / ignorado. Ficar no 3.4.x.

---

## Fase 1 — Conteúdo do site (antes do domínio)

O domínio só entra quando o conteúdo visível estiver fechado. Medir performance com placeholder não vale.

- [ ] **Work and Services**: trocar as imagens atuais pelas definitivas (arquivo, peso, `alt` e ordem dos cards).
- [ ] **FAQ**: revisar perguntas e respostas. Tirar marcação de rascunho (ex.: “revisar”, “coletar depoimento”) do texto publicado.
- [ ] **Depoimentos**: conferir se ainda existe texto placeholder (“Coletar depoimento…”, “Nome do Cliente”). O que não estiver real, tira ou substitui.
- [ ] **Textos institucionais**: Hero, Serviços, Footer, horário, endereço e links (WhatsApp, Instagram, Maps) conferidos.
- [ ] **Imagens sociais**: Open Graph / ícone prontos, mesmo que a URL absoluta ainda seja a da Vercel.

---

## Fase 2 — Performance (ainda no domínio provisório)

Rodar no preview da Vercel, desktop e mobile.

- [ ] **Lighthouse** (Chrome): Performance, Acessibilidade, Boas práticas, SEO.
- [ ] **PageSpeed Insights**: mesma URL, mobile e desktop.
- [ ] Anotar só o que dá para corrigir agora: imagem pesada, `sizes` faltando no `next/image`, fonte, contraste, título/H1.
- [ ] **Não perseguir nota 100** se o Hero 3D for o custo. Registrar o que ficou de propósito.

---

## Fase 3 — Configuração do Next que não depende de domínio

- [x] **`next.config`**: `productionBrowserSourceMaps: false` (hoje publica o código-fonte).
- [x] **Cabeçalhos HTTP**: `headers()` com `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`.
- [x] **CSP**: começar em `Content-Security-Policy-Report-Only`. Olhar o console por alguns dias. **Não** virar bloqueio ainda — o rastreio da Fase 5 muda a política.

---

## Fase 4 — Privacidade e cookies (antes de qualquer script)

Não instalar Google Analytics, Tag Manager, Meta Pixel nem outro rastreador antes disto.

- [ ] **Política de privacidade**: página publicada no site (quem é a Montabox, quais dados, para quê, contato).
- [ ] **Política de cookies**: só se for usar cookie de analytics, publicidade ou preferência. Se o site não gravar cookie nenhum, registrar isso na privacidade e pular o banner.
- [ ] **Banner / painel** (`components/CookieConsent.jsx`, se for o caso): aceitar, recusar e guardar a escolha em cookie ou `localStorage`.
- [ ] Script de analytics **só depois** da autorização.
- [ ] Ponto global: `app/layout.jsx` (metadata + consentimento). Não criar `sw.js` por causa de rastreio — Service Worker é cache/offline, outra coisa.

Arquivos que entram quando o rastreio for ligado:

| Arquivo ou área | Função |
|---|---|
| `components/CookieConsent.jsx` | Banner e preferências. |
| `app/layout.jsx` | Metadata, consentimento e carga controlada dos scripts. |
| `public/robots.txt` | Manter o que a política permitir. |
| `public/llms.txt` | Só se canal oficial ou texto institucional mudar. |
| Política de privacidade | Antes de ligar qualquer ferramenta. |
| Política de cookies | Se houver cookie de analytics, anúncio ou preferência. |

---

## Fase 5 — Rastreamento (opcional, depois da Fase 4)

- [ ] Escolher o mínimo: em geral só Analytics (ou Tag Manager). Pixel só se for usar anúncio.
- [ ] Cadastrar a propriedade **ainda** na URL provisória, sabendo que troca na Fase 7.
- [ ] Carregar o script só com consentimento.
- [ ] Atualizar a CSP (continua em Report-Only até o console ficar limpo; aí vira `Content-Security-Policy`).
- [ ] Conferir que, sem aceitar, o script **não** dispara.

Hoje não há rastreador neste projeto.

---

## Fase 6 — Comprar e apontar o domínio

Só depois das fases 1–4 (e 5, se o rastreio for entrar junto com o lançamento).

- [ ] Comprar o domínio no registrador já com 2FA e bloqueio de transferência.
- [ ] Guardar recovery codes novos, se o registrador gerar outros.
- [ ] Na Vercel: adicionar o domínio, SSL automático, domínio principal.
- [ ] Redirecionar `www` ↔ apex (um só canônico).
- [ ] Confirmar que abre em **HTTPS** sem aviso.
- [ ] Decidir o que fazer com `vidracariamontabox.vercel.app` (redirect para o domínio novo).
- [ ] **HSTS**: não ativar nesta fase. Só com o domínio final em HTTPS.

---

## Fase 7 — Trocar o domínio provisório no código

Enquanto o definitivo não existe, a URL canônica é:

```text
https://vidracariamontabox.vercel.app/
```

Ela aparece em:

```text
app/layout.jsx
public/llms.txt
public/robots.txt
public/sitemap.xml
```

Substituir pelo domínio oficial:

| Arquivo | O que revisar |
|---|---|
| `app/layout.jsx` | `metadataBase`, canonical, Open Graph, imagens sociais, qualquer URL absoluta. |
| `public/robots.txt` | Linha `Sitemap`. |
| `public/sitemap.xml` | Todos os `<loc>`. |
| `public/llms.txt` | Página principal, sitemap e links institucionais absolutos. |
| Componentes | Links absolutos (Instagram, WhatsApp, Maps) só se o canal mudar. |
| Vercel | Domínio principal, aliases e redirect do domínio antigo. |
| Rastreio | Propriedade no Analytics, Tag Manager, Search Console e Pixel. |

URLs relativas (`/icon.png`, `/images/...`) não mudam. O `metadataBase` resolve o resto.

- [ ] Busca no projeto por `vercel.app` e por `vidracariamontabox` — não pode sobrar URL provisória no canônico.
- [ ] **HSTS** agora sim, com o HTTPS do domínio final estável.
- [ ] CSP: se o Report-Only ficou limpo (incluindo scripts da Fase 5), promover para `Content-Security-Policy`.

---

## Fase 8 — Checklist do deploy definitivo

- [ ] Domínio abre em HTTPS.
- [ ] Canonical aponta para a URL oficial.
- [ ] Open Graph mostra o endereço definitivo (validador de OG).
- [ ] `robots.txt` acessível.
- [ ] `sitemap.xml` acessível.
- [ ] Nenhuma referência restante ao domínio provisório.
- [ ] Lighthouse e PageSpeed de novo, na URL final.
- [ ] Search Console: propriedade nova + sitemap enviado.
- [ ] Se houver rastreio: consentimento bloqueia o script antes do aceite.
- [ ] Preview da Vercel testado **antes** do merge na `main`.

---

## Fase 9 — Como alterar o site daqui pra frente

- [ ] **Branch de trabalho**: não editar direto na `main`. Uma branch por alteração.
- [ ] **Preview da Vercel**: testar a URL da branch antes do merge.
- [ ] **Merge na `main`**: dispara o deploy de produção.
- [ ] **Rollback**: em *Deployments* na Vercel, promover a versão anterior.
- [ ] **Variáveis de ambiente**: só em *Settings → Environment Variables* na Vercel, nunca no código.

---

## Revisão

- [ ] Reabrir este arquivo a cada mudança grande ou a cada 3 meses.
- [ ] Dependabot: um PR por vez, do mais seguro ao mais arriscado. Não mergear major (Tailwind 4, Framer major) sem testar o site inteiro.
