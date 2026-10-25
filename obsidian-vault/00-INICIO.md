# 🏠 Sistema de Encomendas 3D - Início

Bem-vindo ao vault de documentação e planejamento do projeto **Encomendas 3D**.

## 🎯 Navegação Rápida

### 📊 Visão Geral do Projeto
- [[graph.canvas]] - Visualização completa do grafo
- Grafo interativo: `../graphify-out/graph.html`
- Relatório: `../graphify-out/GRAPH_REPORT.md`

### 🔑 Componentes Principais

**Autenticação:**
- [[Login]] - Sistema de login com Supabase
- [[App]] - Componente raiz e rotas protegidas

**Gestão de Pedidos:**
- [[OrderList]] - Lista de pedidos 3D
- [[OrderForm]] - Formulário de novos pedidos
- [[OrderCard]] - Card individual de pedido

**Sistema de Lembretes:**
- [[ReminderList]] - Lista de lembretes
- [[ReminderForm]] - Criação de lembretes
- [[ReminderCard]] - Card de lembrete

**PWA e Notificações:**
- [[sw]] - Service Worker
- [[push]] - Sistema de push notifications

**Database:**
- [[supabase]] - Cliente e configuração Supabase

### 🛠️ Utilidades
- [[format]] - Formatação de datas e valores
- [[deadline]] - Cálculo de prazos
- [[storage]] - Gerenciamento de localStorage

## 📝 Áreas de Planejamento

### Para Criar:
1. `01-Features-Pendentes.md` - Backlog
2. `02-Bugs-Conhecidos.md` - Issues tracker
3. `03-Melhorias-Futuras.md` - Roadmap
4. `04-ADRs/` - Decisões arquiteturais
5. `05-Reuniões/` - Notas de reuniões

## 🚀 Comandos Úteis

```bash
# Atualizar grafo após mudanças
graphify update .

# Consultar arquitetura
graphify query "sua pergunta"

# Ver dependências
graphify path "ComponenteA" "ComponenteB"

# Atualizar este vault
graphify export obsidian --dir obsidian-vault
```

## 📈 Estatísticas do Projeto

- **Nós no grafo**: 619
- **Conexões**: 960
- **Comunidades**: 51
- **Notas neste vault**: 670

## 🔗 Links Externos

- Repositório Git: (adicione aqui)
- Deploy: (adicione aqui)
- Documentação API: (adicione aqui)

---

**Dica**: Use `Ctrl+O` para busca rápida de notas, `Ctrl+G` para graph view.
