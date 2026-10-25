# Integração Graphify + Obsidian

## 📊 Visão Geral

Este projeto agora possui integração completa entre Graphify e Obsidian para documentação e planejamento.

## 🗂️ Estrutura Criada

```
encomendas-3d/
├── graphify-out/           # Saídas do Graphify
│   ├── graph.json          # Grafo de conhecimento (619 nós, 960 arestas)
│   ├── graph.html          # Visualização interativa do grafo
│   ├── GRAPH_REPORT.md     # Relatório completo (51 comunidades)
│   └── wiki/               # Wiki navegável (61 artigos)
│       └── index.md        # Ponto de entrada
└── obsidian-vault/         # Vault do Obsidian (670 notas)
    ├── graph.canvas        # Canvas visual do grafo
    └── *.md                # Notas individuais dos nós
```

## 🚀 Como Usar

### 1. Abrir no Obsidian

1. Abra o Obsidian
2. Clique em "Open folder as vault"
3. Selecione: `C:\Users\Kerem-1\Documents\PROJETOSAXIOM\encomendas-3d\obsidian-vault`

### 2. Explorar o Grafo

**No Obsidian:**
- `Ctrl+G` para abrir o graph view
- Clique em qualquer nota para ver suas conexões
- Use `graph.canvas` para visualização estruturada

**No Navegador:**
- Abra `graphify-out/graph.html` para visualização interativa
- Zoom, filtros e busca disponíveis

### 3. Comandos Graphify para Planejamento

```bash
# Consultas sobre arquitetura
graphify query "como funciona o sistema de autenticação?"

# Encontrar caminho entre componentes
graphify path "Login" "OrderList"

# Explicar conceito específico
graphify explain "Supabase"

# Ver nós mais importantes (hubs)
graphify god-nodes

# Verificar impacto de mudanças
graphify affected "ReminderForm"
```

### 4. Manter Atualizado

```bash
# Após modificar código (rápido, sem API)
graphify update .

# Forçar atualização completa após refatorações grandes
graphify update . --force

# Regenerar relatório e visualizações
graphify cluster-only .

# Atualizar exports
graphify export wiki
graphify export obsidian --dir obsidian-vault
```

## 📋 Workflows Recomendados

### Planejamento de Features

1. **Investigar**: `graphify query "feature relacionada"`
2. **Mapear**: `graphify path "ComponenteA" "ComponenteB"`
3. **Documentar no Obsidian**: criar nota de planejamento linkando os componentes
4. **Implementar**: desenvolver a feature
5. **Atualizar**: `graphify update .`

### Documentação de Decisões (ADR)

Crie notas no Obsidian seguindo o template:

```markdown
# ADR: [Título da Decisão]

**Status**: Proposto | Aceito | Rejeitado | Obsoleto
**Data**: 2026-10-20
**Contexto**: [[Component1]] [[Component2]]

## Problema

[Descreva o problema]

## Decisão

[Descreva a decisão tomada]

## Consequências

- [[ComponenteAfetado1]] precisará de...
- [[ComponenteAfetado2]] será modificado para...

## Alternativas Consideradas

1. Opção A - [[relacionado]]
2. Opção B - [[outro-relacionado]]
```

### Debug e Troubleshooting

```bash
# Encontrar onde algo é usado
graphify affected "função_com_problema"

# Ver estrutura de dependências
graphify god-nodes --top 20

# Entender um componente complexo
graphify explain "ComponenteComplexo"
```

## 🎯 Estrutura do Projeto (51 Comunidades)

O grafo identificou 51 comunidades de código relacionado:

- **Autenticação e Usuários**: Login, perfis, sessões
- **Pedidos 3D**: OrderList, OrderForm, Order tracking
- **Lembretes**: ReminderForm, ReminderList, notificações
- **PWA e Service Workers**: Cache, push notifications
- **Componentes UI**: Shared components, layouts
- **Utilidades**: Formatação, validação, helpers
- **Database**: Supabase, queries, schemas

Veja `graphify-out/GRAPH_REPORT.md` para detalhes completos.

## 💡 Dicas

### Obsidian Plugins Recomendados

- **Dataview**: consultar notas como banco de dados
- **Excalidraw**: diagramas e wireframes
- **Kanban**: boards de planejamento
- **Calendar**: timeline de features
- **Mind Map**: visualização alternativa do grafo

### Personalização do Vault

Crie pastas temáticas no vault:

```
obsidian-vault/
├── 00-Planejamento/
│   ├── Roadmap.md
│   └── Features-Pendentes.md
├── 01-ADRs/
│   └── [decisões arquiteturais]
├── 02-Código/
│   └── [notas geradas pelo graphify]
└── 03-Reuniões/
    └── [notas de reuniões]
```

### Automação com Git Hooks

O Graphify pode se integrar com git hooks para atualização automática:

```bash
# Instalar hooks (atualiza grafo após commits)
graphify hook install
```

## 🔄 Sincronização Bidirecional

**Graphify → Obsidian:**
- Execute `graphify export obsidian` após mudanças no código
- Novas notas são criadas, existentes são atualizadas

**Obsidian → Planejamento:**
- Suas notas de planejamento podem referenciar `[[componentes]]`
- Use o graph view para ver relações entre planos e código

## 🆘 Troubleshooting

### Vault muito grande
```bash
# Exportar apenas comunidades principais
graphify export obsidian --dir obsidian-vault-small --node-limit 200
```

### Grafo desatualizado
```bash
# Força rebuild completo
graphify update . --force
graphify export obsidian --dir obsidian-vault
```

### Obsidian não reconhece links
- Use "Rebuild graph" no Obsidian (Ctrl+Shift+P)
- Verifique se os `[[links]]` correspondem a nomes de arquivos

## 📚 Recursos Adicionais

- **Wiki do Projeto**: `graphify-out/wiki/index.md`
- **Relatório Completo**: `graphify-out/GRAPH_REPORT.md`
- **Visualização Interativa**: `graphify-out/graph.html`
- **Graphify Docs**: https://github.com/williamcotton/graphify

---

**Criado em**: 2026-10-20  
**Última atualização**: 2026-10-20
