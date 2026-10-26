# 📐 Sistema de Orçamento e Precificação (Axiom 3D)

## 📋 Visão Geral

Módulo avançado de orçamento e precificação de impressão 3D implementado com base na planilha de custos da **Axiom 3D**. Permite montar orçamentos detalhados com múltiplos produtos (até 8 por pedido), aplicando automaticamente custos de máquina (depreciação, manutenção e energia), filamento (com percentual de perda), mão de obra, acabamentos, acessórios, embalagens e **descontos de atacado por quantidade**.

**Data de Implementação**: 2026-10-25  
**Versão**: 1.1.0  
**Rotas**: 
- `/orcamento` (Calculadora e precificação completa)
- `/orcamento/proposta` (Página executiva dedicada em formato A4 limpo para impressão e PDF)

**Arquivos principais**: 
- `src/lib/budgetEngine.ts` (Motor de cálculo com as fórmulas da planilha)
- `src/pages/BudgetPage.tsx` (Interface de cálculo e parâmetros)
- `src/pages/BudgetPrintPage.tsx` (Folha de proposta limpa otimizada para impressão em PDF)

---

## ⚙️ Regras de Cálculo Implementadas

1. **Custo de Máquina (R$/h)**:
   - Depreciação = Preço de compra / Vida útil estimada (h)
   - Manutenção = Manutenção anual / Horas de uso por ano
   - Energia = (Consumo em Watts / 1000) × Tarifa de energia (R$/kWh)

2. **Custo de Material**:
   - Preço por grama = Preço do rolo / Peso do rolo (g)
   - Custo total = Peso × Preço por grama × (1 + Perda padrão %)

3. **Preço de Venda (Margem sobre a Venda)**:
   - Preço base = Custo de Produção / (1 − Impostos% − Margem de Lucro%)
   - Preço com atacado = Preço base × (1 − Desconto de Atacado%)

4. **Desconto de Atacado Automático**:
   - Tabela progressiva baseada na quantidade mínima de peças por item (ex: 5+ peças = 3%, 10+ peças = 5%, até 100+ peças = 20%).

---

## 📄 Geração de Proposta Comercial para Cliente (`/orcamento/proposta`)

A nova página dedicada `/orcamento/proposta` oferece:
- **Preenchimento Rápido**: Informações do cliente (nome, telefone), validade da proposta em dias, observações e condições de pagamento.
- **Gerenciamento de Itens**: Adição rápida de até 8 produtos com nome, quantidade e peso.
- **Visualização A4 Limpa**: Um layout em papel branco corporativo contendo cabeçalho institucional, dados do cliente, tabela de itens detalhada, totais consolidados e espaço para assinatura.
- **Impressão Direta**: Botão dedicado para disparar a impressão nativa do navegador ou salvamento em PDF, ocultando automaticamente todos os controles interativos através de regras `@media print`.
