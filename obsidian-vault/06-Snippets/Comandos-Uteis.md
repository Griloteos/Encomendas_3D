# 🧩 Snippets Úteis - Graphify & Obsidian

## 🔍 Comandos Graphify Essenciais

### Investigação de Arquitetura
```bash
# Entender como funciona uma área
graphify query "como funciona [área/feature]?"

# Ver os nós mais importantes (hubs arquiteturais)
graphify god-nodes --top 20

# Explicar um componente específico
graphify explain "NomeDoComponente"
```

### Análise de Impacto
```bash
# Ver o que será afetado por mudanças
graphify affected "ComponenteQueVaiMudar"

# Ver dependências entre dois pontos
graphify path "ComponenteA" "ComponenteB"

# Ver todas as relações de um nó
graphify query "todas as conexões de ComponenteX"
```

### Manutenção do Grafo
```bash
# Atualizar após mudanças no código (rápido, sem API)
graphify update .

# Forçar rebuild após refactoring grande
graphify update . --force

# Regenerar relatórios e visualizações
graphify cluster-only .

# Exportar para Obsidian
graphify export obsidian --dir obsidian-vault

# Exportar wiki
graphify export wiki
```

### Visualizações
```bash
# Gerar HTML interativo
graphify export html

# Gerar árvore colapsável
graphify tree --output graphify-out/tree.html

# Gerar canvas para Obsidian
graphify export obsidian --dir obsidian-vault
```

---

## 📝 Templates Markdown

### Link para Componente
```markdown
Alteração no [[NomeDoComponente]] afetará [[OutroComponente]]
```

### Bloco de Investigação
```markdown
**Investigar com Graphify:**
\`\`\`bash
graphify query "questão específica"
graphify path "A" "B"
\`\`\`
```

### Checklist de Feature
```markdown
## [ ] Nome da Feature

**Componentes Afetados**: [[Comp1]], [[Comp2]]
**Estimativa**: X dias
**Bloqueadores**: Nenhum | [[Bloqueador]]

### Subtarefas
- [ ] Tarefa 1
- [ ] Tarefa 2
- [ ] Tarefa 3

**Análise de Impacto:**
\`\`\`bash
graphify affected "ComponentePrincipal"
\`\`\`
```

---

## 🎨 CSS Snippets para Obsidian

### Highlight de Status
Crie em `.obsidian/snippets/status-tags.css`:

```css
/* Status tags coloridos */
.tag[href="#proposto"] {
  background-color: #fbbf24;
  color: #000;
}

.tag[href="#aceito"] {
  background-color: #10b981;
  color: #fff;
}

.tag[href="#rejeitado"] {
  background-color: #ef4444;
  color: #fff;
}

.tag[href="#bug-critico"] {
  background-color: #dc2626;
  color: #fff;
  font-weight: bold;
}

.tag[href="#feature"] {
  background-color: #3b82f6;
  color: #fff;
}
```

### Melhor visualização de código
Crie em `.obsidian/snippets/code-blocks.css`:

```css
/* Code blocks com melhor contraste */
.theme-dark code[class*="language-"],
.theme-dark pre[class*="language-"] {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 6px;
}

.theme-light code[class*="language-"],
.theme-light pre[class*="language-"] {
  background: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 6px;
}
```

---

## 🔄 Workflows Git + Graphify

### Após commit
```bash
# Atualizar grafo automaticamente
git add .
git commit -m "feat: nova feature"
graphify update .
```

### Instalar hooks automáticos
```bash
# Graphify atualiza automaticamente após commits
graphify hook install
graphify hook status
```

### Antes de PR
```bash
# Verificar impacto das mudanças
graphify affected "$(git diff --name-only main | head -1)"

# Gerar documentação atualizada
graphify export wiki
graphify export obsidian --dir obsidian-vault
```

---

## 🔍 Queries Dataview (Plugin Obsidian)

### Listar ADRs por status
```dataview
TABLE status, date as "Data"
FROM "04-ADRs"
WHERE status = "🟢 Aceito"
SORT date DESC
```

### Listar features por prioridade
```dataview
TABLE estimativa, bloqueadores
FROM "01-Features-Pendentes"
WHERE contains(file.name, "Alta Prioridade")
```

### Timeline de reuniões
```dataview
TABLE participantes, objetivo
FROM "05-Reunioes"
WHERE file.name != "00-Template-Reuniao"
SORT file.name DESC
LIMIT 10
```

---

## 🚀 Scripts Úteis

### Backup do vault
```bash
# PowerShell
$date = Get-Date -Format "yyyy-MM-dd"
Compress-Archive -Path "obsidian-vault" -DestinationPath "backups/vault-$date.zip"
```

### Atualização completa
```bash
# Bash/PowerShell
graphify update . --force
graphify cluster-only .
graphify export wiki
graphify export obsidian --dir obsidian-vault
echo "✅ Documentação atualizada!"
```

### Verificar saúde do grafo
```bash
# Diagnóstico de problemas
graphify diagnose multigraph
graphify god-nodes --json | jq '.[:5]'
```

---

## 📊 Atalhos de Teclado Obsidian

| Atalho | Ação |
|--------|------|
| `Ctrl+O` | Quick switcher (buscar notas) |
| `Ctrl+G` | Abrir graph view |
| `Ctrl+E` | Toggle edit/preview |
| `Ctrl+P` | Command palette |
| `Ctrl+N` | Nova nota |
| `Ctrl+W` | Fechar aba |
| `Ctrl+Shift+F` | Busca global |
| `Ctrl+,` | Configurações |

---

## 💡 Dicas Rápidas

### Graphify
- Use `--budget` para limitar tamanho das respostas
- `--graph` especifica caminho customizado do graph.json
- Queries em português funcionam!
- DFS vs BFS: use `--dfs` para busca em profundidade

### Obsidian
- `[[arquivo#heading]]` - link para seção específica
- `![[arquivo]]` - embed de nota inteira
- `![[arquivo.png]]` - embed de imagem
- Use aliases: `[[arquivo|texto do link]]`
- Tags hierárquicas: `#projeto/feature/bug`

---

**Última atualização**: 2026-10-20  
**Adicione seus próprios snippets aqui!**
