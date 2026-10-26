# 📐 Sistema de Orçamento e Precificação (Axiom 3D)

## 📋 Visão Geral

Módulo avançado de orçamento e precificação de impressão 3D implementado com base na planilha de custos da **Axiom 3D**. Permite montar orçamentos detalhados com múltiplos produtos (até 8 por pedido), aplicando automaticamente custos de máquina (depreciação, manutenção e energia), filamento (com percentual de perda), mão de obra, acabamentos, acessórios, embalagens e **descontos de atacado por quantidade**.

**Data de Implementação**: 2026-10-25  
**Versão**: 1.0.0  
**Rota**: `/orcamento`  
**Arquivos principais**: 
- `src/lib/budgetEngine.ts` (Motor de cálculo com as fórmulas da planilha)
- `src/pages/BudgetPage.tsx` (Interface de orçamento e proposta para cliente)

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

## 📄 Geração de Proposta para Cliente

Na tela de orçamento (`/orcamento`), o usuário pode preencher os dados do cliente, ajustar parâmetros financeiros e clicar em **"Imprimir / Salvar Proposta PDF"** para gerar um documento formatado profissionalmente pronto para exportação em PDF.
