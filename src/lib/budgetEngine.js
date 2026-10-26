 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * Módulo de Orçamento e Precificação (Lógica da Planilha Axiom 3D)
 */











































// Tabelas padrão Axiom 3D
export const DEFAULT_PRINTERS = [
  { model: 'Anycubic', purchasePrice: 3000, usefulLifeHours: 8000, powerWatts: 250, annualMaintenance: 180, annualHours: 1500 },
  { model: 'A1', purchasePrice: 3400, usefulLifeHours: 10000, powerWatts: 180, annualMaintenance: 220, annualHours: 1800 }
]

export const DEFAULT_MATERIALS = [
  { name: 'PLA', spoolPrice: 100, spoolWeightGrams: 1000, wastePercent: 0.07 },
  { name: 'PETG', spoolPrice: 100, spoolWeightGrams: 1000, wastePercent: 0.07 }
]

export const DEFAULT_FINISHES = [
  { name: 'Nenhum', unitCost: 0 },
  { name: 'Lixamento', unitCost: 3 },
  { name: 'Pintura', unitCost: 8 },
  { name: 'Cola / Montagem', unitCost: 2 },
  { name: 'Verniz / Primer', unitCost: 4 }
]

export const DEFAULT_ACCESSORIES = [
  { name: 'Nenhum', unitCost: 0 },
  { name: 'Ímã de neodímio (pequeno)', unitCost: 0.8 },
  { name: 'Argola de chaveiro', unitCost: 0.6 },
  { name: 'Corrente/mosquetão de chaveiro', unitCost: 1.2 },
  { name: 'Cola quente/instantânea', unitCost: 0.5 },
  { name: 'Switch de teclado mecânico', unitCost: 3.5 },
  { name: 'Estabilizador (switch)', unitCost: 1.5 },
  { name: 'Fita dupla-face / Velcro', unitCost: 0.7 },
  { name: 'Ímã de neodímio (Grande)', unitCost: 10 }
]

export const DEFAULT_PACKAGING = [
  { name: 'Nenhuma', unitCost: 0 },
  { name: 'Saco plástico', unitCost: 0.5 },
  { name: 'Caixa pequena', unitCost: 2.5 },
  { name: 'Caixa média', unitCost: 4 },
  { name: 'Caixa grande + preenchimento', unitCost: 7 }
]

export const DEFAULT_WHOLESALE = [
  { minQuantity: 1, discountPercent: 0 },
  { minQuantity: 5, discountPercent: 0.03 },
  { minQuantity: 10, discountPercent: 0.05 },
  { minQuantity: 20, discountPercent: 0.08 },
  { minQuantity: 30, discountPercent: 0.10 },
  { minQuantity: 50, discountPercent: 0.12 },
  { minQuantity: 75, discountPercent: 0.15 },
  { minQuantity: 100, discountPercent: 0.20 }
]









export const DEFAULT_BUDGET_PARAMS = {
  electricityTariff: 0.95,
  laborCostPerHour: 15,
  taxPercent: 0.06,
  marginPercent: 0.40,
  manualDiscountPercent: 0
}

// Funções de cálculo por item
export function calculateItemCosts(
  item,
  params,
  printers = DEFAULT_PRINTERS,
  materials = DEFAULT_MATERIALS,
  finishes = DEFAULT_FINISHES,
  accessories = DEFAULT_ACCESSORIES,
  packaging = DEFAULT_PACKAGING,
  wholesale = DEFAULT_WHOLESALE
) {
  // Impressora
  const printer = printers.find(p => p.model === item.printerModel) || printers[0]
  const depreciationPerHour = printer.purchasePrice / printer.usefulLifeHours
  const maintenancePerHour = printer.annualMaintenance / printer.annualHours
  const energyPerHour = (printer.powerWatts / 1000) * params.electricityTariff
  const machineCostPerHour = depreciationPerHour + maintenancePerHour + energyPerHour
  const machineCostUnit = machineCostPerHour * item.printHours

  // Material
  const mat = materials.find(m => m.name === item.materialName) || materials[0]
  const pricePerGram = mat.spoolPrice / mat.spoolWeightGrams
  const materialCostUnit = item.weightGrams * pricePerGram * (1 + mat.wastePercent)

  // Mão de Obra
  const laborCostUnit = item.laborHours * params.laborCostPerHour

  // Acabamento
  const fin1 = _optionalChain([finishes, 'access', _ => _.find, 'call', _2 => _2(f => f.name === item.finish1), 'optionalAccess', _3 => _3.unitCost]) || 0
  const fin2 = _optionalChain([finishes, 'access', _4 => _4.find, 'call', _5 => _5(f => f.name === item.finish2), 'optionalAccess', _6 => _6.unitCost]) || 0
  const finishCostUnit = fin1 + fin2

  // Embalagem
  const packCostUnit = _optionalChain([packaging, 'access', _7 => _7.find, 'call', _8 => _8(p => p.name === item.packaging), 'optionalAccess', _9 => _9.unitCost]) || 0

  // Acessórios
  const acc1 = _optionalChain([accessories, 'access', _10 => _10.find, 'call', _11 => _11(a => a.name === item.accessory1), 'optionalAccess', _12 => _12.unitCost]) || 0
  const acc2 = _optionalChain([accessories, 'access', _13 => _13.find, 'call', _14 => _14(a => a.name === item.accessory2), 'optionalAccess', _15 => _15.unitCost]) || 0
  const accessoryCostUnit = acc1 + acc2

  // Custo de Produção Total por Unidade (P)
  const productionCostUnit = machineCostUnit + materialCostUnit + laborCostUnit + finishCostUnit + packCostUnit + accessoryCostUnit

  // Desconto de Atacado por Quantidade (Q)
  let wholesaleDiscount = 0
  const sortedTiers = [...wholesale].sort((a, b) => b.minQuantity - a.minQuantity)
  for (const tier of sortedTiers) {
    if (item.quantity >= tier.minQuantity) {
      wholesaleDiscount = tier.discountPercent
      break
    }
  }

  // Preço Base /un (R) e Preço com Atacado /un (S)
  const divisor = 1 - params.taxPercent - params.marginPercent
  const basePriceUnit = divisor > 0 ? productionCostUnit / divisor : 0
  const wholesalePriceUnit = basePriceUnit * (1 - wholesaleDiscount)

  // Total do Item (T)
  const itemTotal = wholesalePriceUnit * item.quantity

  return {
    machineCostUnit,
    materialCostUnit,
    laborCostUnit,
    finishCostUnit,
    packCostUnit,
    accessoryCostUnit,
    productionCostUnit,
    wholesaleDiscount,
    basePriceUnit,
    wholesalePriceUnit,
    itemTotal
  }
}
