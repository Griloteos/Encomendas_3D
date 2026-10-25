# 🗺️ Roadmap - Encomendas 3D

## 🎯 Visão de Longo Prazo

Transformar o sistema em uma plataforma completa de gestão de impressão 3D, com múltiplos usuários, integração com hardware e automação inteligente.

---

## 📅 Q4 2026 (Out-Dez)

### Outubro ✅
- [x] Sistema de lembretes
- [x] PWA básico com service worker
- [x] Push notifications
- [x] Integração Graphify + Obsidian

### Novembro 🔄
- [ ] **Modo offline completo**
  - Cache inteligente
  - Sincronização automática
  - Resolução de conflitos
  - *Componentes*: [[sw]], [[storage]], [[supabase]]

- [ ] **Dashboard de métricas**
  - Pedidos por status
  - Gráficos de volume
  - Timeline de produção
  - *Novos componentes*: Dashboard, Charts, Metrics

### Dezembro 📋
- [ ] **Sistema de anexos**
  - Upload de fotos
  - Galeria por pedido
  - Storage no Supabase
  - *Componentes*: [[OrderForm]], [[OrderCard]]

- [ ] **Filtros e busca avançada**
  - Filtros múltiplos
  - Busca full-text
  - Ordenação customizada
  - *Componentes*: [[OrderList]], [[ReminderList]]

---

## 📅 Q1 2027 (Jan-Mar)

### Janeiro
- [ ] **Multi-tenant básico**
  - Autenticação por organização
  - Permissões por usuário
  - Workspace separation
  - *Impacto*: [[Login]], [[supabase]], [[App]]

### Fevereiro
- [ ] **Templates de pedidos**
  - Pedidos recorrentes
  - Presets de configuração
  - Clonagem rápida
  - *Novos componentes*: TemplateLibrary, TemplateForm

### Março
- [ ] **Integração WhatsApp**
  - Notificações via WhatsApp
  - Status updates
  - API Twilio ou similar
  - *Novos componentes*: WhatsAppService

---

## 📅 Q2 2027 (Abr-Jun)

### Abril
- [ ] **Calculadora de orçamento**
  - Cálculo automático de custos
  - Tabela de materiais
  - Margem de lucro
  - *Novos componentes*: PriceCalculator, MaterialsDB

### Maio
- [ ] **Timeline visual**
  - Gantt de produção
  - Drag & drop de prazos
  - Dependências entre pedidos
  - *Novos componentes*: Timeline, GanttChart

### Junho
- [ ] **Relatórios e Analytics**
  - Exportação PDF/Excel
  - Relatórios customizados
  - Dashboards executivos
  - *Novos componentes*: ReportGenerator, ExportService

---

## 🚀 Visão Futura (H2 2027+)

### Fase: Automação Inteligente
- [ ] **Integração com impressoras**
  - OctoPrint/Klipper API
  - Status em tempo real
  - Queue automática
  
- [ ] **IA para estimativas**
  - Tempo de impressão ML
  - Detecção de problemas
  - Otimização de layout

- [ ] **App Mobile Nativo**
  - React Native ou Flutter
  - Câmera integrada
  - Notificações nativas

### Fase: Marketplace
- [ ] **Sistema de pedidos público**
  - Catálogo de produtos
  - Checkout integrado
  - Payment gateway

- [ ] **Multi-fornecedor**
  - Rede de impressoras
  - Roteamento inteligente
  - Logística integrada

---

## 🔍 Investigações Técnicas Necessárias

### Antes de Q1 2027
```bash
# Multi-tenant architecture
graphify query "authentication and authorization structure"

# Performance com múltiplos usuários
graphify query "database queries and indexes"
```

### Antes de Q2 2027
```bash
# Integração externa
graphify query "API integrations"

# Exportação de dados
graphify query "data export and reporting"
```

### Antes de H2 2027
```bash
# Arquitetura para escala
graphify god-nodes --top 30

# Dependências críticas
graphify affected "core-components"
```

---

## 📊 Métricas de Sucesso

### Q4 2026
- ✅ 100% features offline funcionando
- ✅ <2s tempo de carregamento
- ✅ 90% cobertura de testes

### Q1 2027
- 🎯 Suporte a 10+ usuários simultâneos
- 🎯 99% uptime
- 🎯 <100ms latência de queries

### Q2 2027
- 🎯 1000+ pedidos no sistema
- 🎯 10+ organizações ativas
- 🎯 Relatórios automatizados semanais

---

## 🔄 Processo de Revisão

- **Semanal**: Review de progresso vs. roadmap
- **Mensal**: Ajuste de prioridades baseado em feedback
- **Trimestral**: Planejamento do próximo quarter

**Próxima revisão**: 2026-11-01

---

## 💡 Como Contribuir com o Roadmap

1. Adicione ideias em [[01-Features-Pendentes]]
2. Marque prioridade e esforço estimado
3. Use Graphify para analisar impacto:
   ```bash
   graphify affected "ComponenteRelacionado"
   graphify path "NovaFeature" "ComponenteExistente"
   ```
4. Documente decisões em `ADRs/`

---

**Última atualização**: 2026-10-20  
**Versão do roadmap**: 1.0
