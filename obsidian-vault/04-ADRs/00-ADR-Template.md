# ADR Template

**Status**: 🟡 Proposto | 🟢 Aceito | 🔴 Rejeitado | ⚪ Obsoleto  
**Data**: YYYY-MM-DD  
**Autor**: Nome  
**Componentes Relacionados**: [[Component1]] [[Component2]]

---

## 🎯 Contexto

[Descreva o contexto técnico e de negócio que motivou esta decisão]

### Problema
[Qual problema específico estamos resolvendo?]

### Investigação Prévia
```bash
# Comandos Graphify usados para análise
graphify query "..."
graphify path "..." "..."
graphify affected "..."
```

---

## 🔍 Decisão

[Descreva claramente a decisão tomada]

### Justificativa
- Razão 1
- Razão 2
- Razão 3

### Implementação
[Como será implementado?]

---

## ⚖️ Alternativas Consideradas

### Opção A: [Nome]
**Prós:**
- Pró 1
- Pró 2

**Contras:**
- Contra 1
- Contra 2

**Por que não escolhemos:** [explicação]

### Opção B: [Nome]
**Prós:**
- Pró 1

**Contras:**
- Contra 1

**Por que não escolhemos:** [explicação]

---

## 📊 Consequências

### Positivas ✅
- Benefício 1 - impacta [[Component1]]
- Benefício 2 - melhora [[Component2]]

### Negativas ⚠️
- Trade-off 1 - afeta [[Component3]]
- Débito técnico em [[Component4]]

### Neutras
- Mudança 1
- Mudança 2

---

## 🔗 Componentes Afetados

Usar Graphify para mapear impacto:
```bash
graphify affected "ComponentePrincipal"
```

- [[Component1]] - como será afetado
- [[Component2]] - mudanças necessárias
- [[Component3]] - possível refactor

---

## 📈 Métricas de Sucesso

Como saberemos se a decisão foi boa?

- [ ] Métrica 1: [descrição e target]
- [ ] Métrica 2: [descrição e target]
- [ ] Métrica 3: [descrição e target]

**Prazo de avaliação**: [quando revisar]

---

## 🔄 Histórico de Revisões

- **YYYY-MM-DD**: Criado por [autor]
- **YYYY-MM-DD**: Aceito/Rejeitado por [autor]
- **YYYY-MM-DD**: Marcado como obsoleto por [autor] - [razão]

---

## 📚 Referências

- Link 1: [descrição]
- ADR relacionado: [[ADR-XXX-nome]]
- Issue/PR: #123
- Documentação: [link]

---

**Tags**: #adr #architecture #decisão
