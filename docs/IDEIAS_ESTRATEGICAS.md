---
name: ideias-estrategicas-produtividade
description: Ideias estratégicas e funcionais para aumentar a produtividade na gestão de encomendas 3D
metadata:
  type: project
---

# Ideias Estratégicas de Produtividade para a Oficina 3D

Registrado em 2026-10-25. Relacionado com [[sistema-de-encomendas]].

## 1. Modo "Fila de Impressão" (Kanban por Máquina)
- Organizar a visualização das encomendas ativas separadas por impressora física (ex: *Bambu Lab*, *Ender 3*, *Resina*).
- **Objetivo**: Saber instantaneamente qual arquivo está rodando em qual máquina da oficina sem precisar de anotações externas ou post-its.

## 2. Alerta de Fim de Bobina (Controle de Estoque de Filamento)
- Módulo de estoque onde o usuário cadastra as bobinas atuais (ex: *PLA Preto - 800g restantes*).
- **Objetivo**: O app subtrai automaticamente as gramas de cada pedido criado e emite um alerta preventivo quando o estoque de determinada cor/material estiver acabando.

## 3. Calculadora de Custo de Falha de Impressão (Taxa de Refugo)
- Atalho rápido de **"Registrar Falha / Refugo"** em um pedido.
- **Objetivo**: Abater o filamento perdido do estoque, contabilizar o prejuízo com falhas de impressão no mês e ajudar a calibrar margens de segurança para cobrir refugos.

## 4. Widget de Orçamento Relâmpago (Calculadora Rápida)
- Ferramenta flutuante na tela principal para respostas rápidas a clientes no WhatsApp.
- **Objetivo**: Digitar apenas gramas e tempo estimado para o app calcular o preço de venda sugerido na hora, agilizando o fechamento de vendas.

## 5. Integração com Calculadora de Custos da Planilha (Alternativa B)
- Incorporar a lógica exata de cálculo de custos do Excel do usuário diretamente no formulário de cadastro de pedidos (`OrderForm.tsx`).
- **Objetivo**: Automatizar custos de filamento, hora/máquina, energia e margem de lucro sem precisar de redigitação ou planilhas externas.
