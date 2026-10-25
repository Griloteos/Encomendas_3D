# 🐛 Bugs Conhecidos

## 🔴 Críticos

### [ ] Service Worker - Cache não persiste corretamente
**Arquivo**: [[sw]]  
**Descrição**: Em alguns browsers, o cache do SW é limpo inesperadamente  
**Reprodução**: 
1. Usar app offline
2. Fechar navegador
3. Reabrir - dados perdidos

**Impacto**: Alto - afeta experiência offline  
**Workaround**: Recarregar página online  
**Relacionado**: [[storage]]

---

## 🟡 Médios

### [ ] OrderList - Scroll não preserva posição
**Arquivo**: [[OrderList]]  
**Descrição**: Ao voltar da tela de detalhes, scroll volta para o topo  
**Impacto**: Médio - UX prejudicada em listas longas  
**Workaround**: Nenhum conhecido

### [ ] ReminderForm - Validação de data inconsistente
**Arquivo**: [[ReminderForm]]  
**Descrição**: Permite criar lembretes com datas passadas  
**Impacto**: Médio - notificações não funcionam  
**Workaround**: Usuário precisa validar manualmente

### [ ] Push notifications - Não funciona no iOS Safari
**Arquivo**: [[push]]  
**Descrição**: Push API não suportada no iOS < 16.4  
**Impacto**: Médio - feature não disponível em iOS antigos  
**Workaround**: Usar lembretes do sistema operacional

---

## 🟢 Baixos

### [ ] OrderCard - Overflow de texto longo
**Arquivo**: [[OrderCard]]  
**Descrição**: Nomes muito longos quebram layout  
**Impacto**: Baixo - visual apenas  
**Workaround**: Usar text-overflow: ellipsis

### [ ] Login - Mensagem de erro genérica
**Arquivo**: [[Login]]  
**Descrição**: Não diferencia erro de credencial vs. erro de rede  
**Impacto**: Baixo - UX levemente prejudicada

---

## 🔵 Melhorias de Performance

### [ ] OrderList - Re-render desnecessário
**Arquivo**: [[OrderList]]  
**Descrição**: Lista inteira re-renderiza ao atualizar um item  
**Solução proposta**: React.memo + useMemo  
**Impacto**: Performance em listas grandes

### [ ] Supabase - Queries não otimizadas
**Arquivo**: [[supabase]]  
**Descrição**: Faltam índices em algumas queries  
**Solução proposta**: Adicionar índices no banco  
**Investigar com**: `graphify query "supabase queries"`

---

## 📝 Para Investigar

```bash
# Verificar dependências do componente com problema
graphify affected "ComponenteComBug"

# Ver estrutura relacionada
graphify explain "ComponenteComBug"

# Encontrar uso de APIs problemáticas
graphify query "push notifications implementation"
```

---

**Última atualização**: 2026-10-20  
**Issues rastreados**: 9
