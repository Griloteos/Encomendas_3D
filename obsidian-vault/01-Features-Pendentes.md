# 📋 Features Pendentes

## 🔴 Alta Prioridade

### [ ] PWA - Modo Offline Completo
**Componentes Afetados**: [[sw]], [[OrderList]], [[ReminderList]]
- [ ] Cache de dados de pedidos
- [ ] Queue de sincronização
- [ ] Indicador visual de modo offline
- [ ] Conflitos de sincronização

**Estimativa**: 3-5 dias  
**Bloqueadores**: Nenhum

### [ ] Notificações Push - Melhorias
**Componentes Afetados**: [[push]], [[ReminderForm]]
- [ ] Personalização de horários
- [ ] Sons customizados
- [ ] Agrupamento de notificações
- [ ] Ações rápidas nas notificações

**Estimativa**: 2-3 dias  
**Bloqueadores**: Nenhum

## 🟡 Média Prioridade

### [ ] Dashboard de Estatísticas
**Novos Componentes**: Dashboard, Charts
**Relacionados**: [[OrderList]], [[ReminderList]]
- [ ] Pedidos por status
- [ ] Prazos mais próximos
- [ ] Gráfico de volume mensal
- [ ] Tempo médio de conclusão

**Estimativa**: 4-5 dias  
**Bloqueadores**: Nenhum

### [ ] Sistema de Anexos
**Componentes Afetados**: [[OrderForm]], [[OrderCard]]
- [ ] Upload de imagens/arquivos
- [ ] Preview de imagens
- [ ] Storage no Supabase
- [ ] Galeria de fotos do pedido

**Estimativa**: 3-4 dias  
**Bloqueadores**: Configuração Storage Supabase

### [ ] Filtros Avançados
**Componentes Afetados**: [[OrderList]], [[ReminderList]]
- [ ] Filtro por data
- [ ] Filtro por status
- [ ] Busca por cliente
- [ ] Ordenação customizada

**Estimativa**: 2 dias  
**Bloqueadores**: Nenhum

## 🟢 Baixa Prioridade

### [ ] Modo Escuro Aprimorado
**Componentes Afetados**: [[index]], CSS global
- [ ] Toggle manual
- [ ] Persistência da preferência
- [ ] Transições suaves

**Estimativa**: 1 dia  
**Bloqueadores**: Nenhum

### [ ] Exportação de Dados
**Novos Componentes**: ExportButton
**Relacionados**: [[OrderList]]
- [ ] Exportar pedidos para PDF
- [ ] Exportar para Excel
- [ ] Backup completo

**Estimativa**: 2-3 dias  
**Bloqueadores**: Nenhum

### [ ] Tutoriais e Onboarding
**Novos Componentes**: Tutorial, Walkthrough
- [ ] Tour inicial para novos usuários
- [ ] Dicas contextuais
- [ ] Help inline

**Estimativa**: 3 dias  
**Bloqueadores**: Nenhum

## 💡 Ideias Futuras (Não Priorizadas)

- [ ] Multi-usuário e colaboração
- [ ] Integração com WhatsApp
- [ ] App mobile nativo
- [ ] Sistema de comentários por pedido
- [ ] Templates de pedidos recorrentes
- [ ] Integração com impressoras 3D
- [ ] Calculadora de orçamento automática
- [ ] Timeline visual de produção

## 🔄 Para Investigar

Antes de implementar, usar Graphify:

```bash
# Entender impacto de mudanças
graphify affected "ComponenteAlvo"

# Ver dependências
graphify path "NovoComponente" "ComponenteExistente"

# Consultar arquitetura atual
graphify query "como funciona [área]?"
```

---

**Última atualização**: 2026-10-20  
**Próxima revisão**: A definir
