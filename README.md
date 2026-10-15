# Encomendas 3D - PWA para Android + Computador

Aplicativo web progressivo (PWA) de gestão de encomendas para lojas de impressão 3D. Uma lista de tarefas profissional para acompanhar seus projetos do início ao fim, com sincronização em tempo real entre dispositivos (celular Android e computador).

## Visão Geral da Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Backend / Banco de Dados:** Supabase (Postgres, Auth, Storage, Edge Functions)
- **PWA:** vite-plugin-pwa (estratégia `injectManifest`, service worker com suporte a Web Push)
- **Hospedagem:** Cloudflare Pages (suporte a uso comercial e HTTPS obrigatório para PWA)

---

## Fases Concluídas

1. **Fundação:** Repositório, Vite + React + TS + Tailwind, cliente Supabase, migrations, login, rotas protegidas.
2. **CRUD Básico:** Lista (Ativas/Arquivadas), criar, editar, excluir, detalhe, máscara BRL, validações.
3. **Status e Alertas:** Avanço de status, arquivamento, etiquetas de prazo por cor, faixa de alertas no topo.
4. **Cores e Gramas:** `ColorPicker` (grade hex padrão, seletor livre com `react-colorful`, chips) e `GramsFields` (total + por cor com soma automática e aviso).
5. **WhatsApp:** Máscara brasileira e atalho direto para conversa com mensagem pré-preenchida.
6. **Arquivos:** Fotos (compressão client-side para WebP, máx. 2, URLs assinadas) e arquivos `.3mf` (upload, download, fatiador com protocolos `bambustudio://`, `orcaslicer://`, `prusaslicer://`).
7. **PWA e Push Diário:** Manifest, service worker customizado (`sw.ts`), Web Push subscriptions e Edge Function `daily-alerts`.
8. **Deploy e Documentação:** Cloudflare Pages, variáveis de ambiente e README completo.

---

## Como Rodar Localmente

```bash
# 1. Clonar repositório e instalar dependências
git clone <url-do-repositorio>
cd encomendas-3d
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Preencha .env com suas credenciais do Supabase

# 3. Rodar em desenvolvimento
npm run dev

# 4. Build de produção
npm run build
```

---

## Configuração do Supabase

1. **Criar Projeto** no [Supabase](https://supabase.com).
2. **Executar a Migration** do banco de dados (tabelas `orders` e `push_subscriptions` com RLS ativado) utilizando o script em `supabase/migrations/20261014000001_init.sql`.
3. **Criar Buckets Privados** no Storage:
   - `order-photos` (políticas por pasta `auth.uid()`)
   - `order-models` (políticas por pasta `auth.uid()`)
4. **Autenticação:** Desativar o cadastro público (Sign-up) nas configurações de Auth do Supabase e criar sua conta de usuário administrador manualmente.

---

## Deploy no Cloudflare Pages

1. Conecte seu repositório GitHub privado ao **Cloudflare Pages**.
2. **Build Settings:**
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
3. **Variáveis de Ambiente (Environment Variables):**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_VAPID_PUBLIC_KEY`
4. Crie um arquivo `public/_redirects` com o conteúdo `/* /index.html 200` para garantir o roteamento SPA.

---

## Como Instalar no Android

1. Abra o endereço do app no navegador **Google Chrome** no seu celular Android.
2. Toque no menu do navegador (três pontos).
3. Selecione **"Instalar app"** ou **"Adicionar à tela inicial"**.
4. O app será instalado como um aplicativo nativo independente (standalone).

---

## Comportamento do "Abrir no Fatiador"

- **Computador (Windows/Mac/Linux):** Gera uma URL assinada temporária (10 min) do arquivo `.3mf` e aciona o protocolo registrado pelo fatiador escolhido (`orcaslicer://`, `bambustudio://`, `prusaslicer://`). Caso o fatiador não abra automaticamente, o download do arquivo inicia como fallback automático.
- **Android:** Tenta realizar o download direto e sugere abrir com o aplicativo de fatiamento compatível instalado.

---

## Suposições (Assumptions)

- **Usuário único:** O app foi desenhado para uso pessoal e exclusivo do dono da loja (sem multi-usuário ou cadastro público).
- **Conexão com Internet:** O aplicativo exige conexão ativa para carregar e salvar dados no Supabase.
- **Segurança:** Chaves sensíveis (Service Role Key, VAPID Private Key, Cron Secret) ficam armazenadas exclusivamente nos segredos da Edge Function do Supabase.

---

## Sugestões (Não implementadas nesta versão)

- Cálculo automático de margem de lucro por encomenda.
- Relatórios gráficos de vendas mensais.
- Estoque de filamentos integrado.
- Cadastro reutilizável de clientes.
- Sistema de orçamentos e recibos em PDF.
- Tema escuro (Dark Mode).

---

*Gerado com [Claude Code](https://claude.com/claude-code)*
Co-Authored-By: Claude Code <noreply@anthropic.com>
