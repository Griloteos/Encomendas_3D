# Encomendas 3D - PWA para Android + Computador

Aplicativo de gestão de encomendas de impressão 3D. Uma lista de tarefas profissional para acompanhar seus projetos do início ao fim, com sincronização em tempo real entre Android e computador.

## Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Backend/Banco:** Supabase (Postgres + Auth + Storage + Edge Functions)
- **PWA:** vite-plugin-pwa (Web Push, instalável no Android)
- **Hospedagem:** Cloudflare Pages

## Fases de Desenvolvimento

- [x] **Fase 1:** Fundação (repositório, Vite, cliente Supabase, login, rotas protegidas)
- [ ] **Fase 2:** CRUD básico (lista, criar, editar, excluir, máscaras)
- [ ] **Fase 3:** Status e alertas (avanço de status, arquivamento, etiquetas de prazo)
- [ ] **Fase 4:** Cores e gramas (color picker, validações)
- [ ] **Fase 5:** WhatsApp (máscara, botão de contato)
- [ ] **Fase 6:** Arquivos (fotos, 3MF, abrir no fatiador)
- [ ] **Fase 7:** PWA e push diário (manifest, service worker, notificações)
- [ ] **Fase 8:** Deploy (Cloudflare Pages, README final)

## Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Criar arquivo .env com as variáveis do Supabase
cp .env.example .env

# Editar .env com suas credenciais
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
# VITE_VAPID_PUBLIC_KEY=...

# Rodар desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Suposições

- **Usuário único:** o app é apenas para uso pessoal do dono da loja (sem multi-usuário).
- **Sem funcionalidade offline:** requer conexão com internet para funcionar.
- **Armazenamento:** fotos e arquivos 3MF são armazenados no Supabase Storage.
- **Notificações:** push notifications só funcionam no PWA instalado no Android e desktop (Edge/Chrome).

## Próximos Passos (Fase 2)

- [ ] Página de lista de encomendas com abas (Ativas/Arquivadas)
- [ ] Criar nova encomenda
- [ ] Editar encomenda
- [ ] Excluir encomenda
- [ ] Card com informações resumidas
- [ ] Validações de formulário em tempo real
- [ ] Máscaras para moeda (BRL) e datas

---

*Construído com ❤️ para impressoras 3D*
