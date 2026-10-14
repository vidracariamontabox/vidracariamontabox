# Checklist de Segurança: Montabox

Estado: git privado + Vercel. Sem hospedagem externa e sem Cloudflare por enquanto.

Ordem de prioridade: resolver de cima para baixo.

## Prioridade 1: Contas (2FA)

- [ ] **GitHub**: confirmar 2FA com passkey na conta pessoal.
- [ ] **Vercel**: confirmar 2FA na conta pessoal, além do team.
- [ ] **Registrador do domínio**: ativar 2FA e bloqueio de transferência.
- [ ] **Recovery codes**: gerar e guardar GitHub, Vercel e registrador fora do computador.

## Prioridade 2: Repositório

- [ ] **`.gitignore`**: adicionar `.env*` (manter `.env.example` se existir).
- [ ] **Histórico do Git**: ZIPs antigos (Cables.gl e backups `Trionn/`) continuam no histórico. Inspecionar o conteúdo de `sitetrionn BK.zip` e procurar `.env` ou chaves.
- [ ] **Revogação**: só se algum segredo for encontrado no histórico. Apagar do Git não invalida a chave, é preciso trocá-la no provedor.
- [ ] **Dependabot**: ativar alertas e security updates em *Settings → Code security*.
- [ ] **Dependabot (rotina)**: criar `.github/dependabot.yml` com atualização semanal.

## Prioridade 3: Dependências

- [ ] **`npm audit`**: rodar agora e revisar o que aparecer. Não usar `npm audit fix --force` sem ler antes.
- [ ] **Testar PRs do Dependabot**: quando mexerem em `three`, `@react-three/fiber`, `next` ou `gsap`, validar o Hero visualmente antes do merge.

## Prioridade 4: Configuração do Next.js

- [ ] **`next.config.mjs`**: trocar `productionBrowserSourceMaps` para `false` (hoje publica o código-fonte).
- [ ] **Cabeçalhos HTTP**: adicionar `headers()` com X-Frame-Options, X-Content-Type-Options, Referrer-Policy e Permissions-Policy.
- [ ] **Content-Security-Policy**: começar em `Content-Security-Policy-Report-Only`, observar o console por uma semana e só depois virar `Content-Security-Policy`.
- [ ] **HSTS**: ativar só quando o domínio final estiver em HTTPS e funcionando.

## Prioridade 5: Fluxo de alterações no site publicado

- [ ] **Branch de trabalho**: nunca editar direto na `main`. Criar uma branch por alteração.
- [ ] **Preview da Vercel**: cada branch gera uma URL de preview. Testar nela antes do merge.
- [ ] **Merge na `main`**: o merge dispara o deploy de produção automaticamente.
- [ ] **Rollback**: se algo quebrar, usar *Deployments* na Vercel para voltar à versão anterior com um clique.
- [ ] **Variáveis de ambiente**: segredos ficam só em *Settings → Environment Variables* na Vercel, nunca no código.

## Prioridade 6: Rastreamento e privacidade

- [ ] **Política de privacidade e aviso de cookies**: fazer antes de instalar Google Analytics ou qualquer script de rastreio.
- [ ] **Scripts de terceiros**: instalar só os necessários e atualizar a CSP quando adicionar algum.

## Revisão

- [ ] **Revisar este checklist** a cada mudança grande no site ou a cada 3 meses.
