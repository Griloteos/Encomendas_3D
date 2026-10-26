/**
 * Módulo de Orçamento e Precificação (Lógica da Planilha Axiom 3D)
 */

export interface PrinterSpec {
  model: string
  purchasePrice: number
  usefulLifeHours: number
  powerWatts: number
  annualMaintenance: number
  annualHours: number
}

export interface MaterialSpec {
  name: string
  spoolPrice: number
  spoolWeightGrams: number
  wastePercent: number // ex: 0.07 para 7%
}

export interface FinishesSpec {
  name: string
  unitCost: number
}

export interface WholesaleTier {
  minQuantity: number
  discountPercent: number // ex: 0.05 para 5%
}

export interface BudgetLineItem {
  id: string
  productName: string
  printerModel: string
  materialName: string
  weightGrams: number
  printHours: number
  laborHours: number
  finish1: string
  finish2: string
  packaging: string
  quantity: number
  accessory1: string
  accessory2: string
}

// Tabelas padrão Axiom 3D
export const DEFAULT_PRINTERS: PrinterSpec[] = [
  { model: 'Anycubic', purchasePrice: 3000, usefulLifeHours: 8000, powerWatts: 250, annualMaintenance: 180, annualHours: 1500 },
  { model: 'A1', purchasePrice: 3400, usefulLifeHours: 10000, powerWatts: 180, annualMaintenance: 220, annualHours: 1800 }
]

export const DEFAULT_MATERIALS: MaterialSpec[] = [
  { name: 'PLA', spoolPrice: 100, spoolWeightGrams: 1000, wastePercent: 0.07 },
  { name: 'PETG', spoolPrice: 100, spoolWeightGrams: 1000, wastePercent: 0.07 }
]

export const DEFAULT_FINISHES: FinishesSpec[] = [
  { name: 'Nenhum', unitCost: 0 },
  { name: 'Lixamento', unitCost: 3 },
  { name: 'Pintura', unitCost: 8 },
  { name: 'Cola / Montagem', unitCost: 2 },
  { name: 'Verniz / Primer', unitCost: 4 }
]

export const DEFAULT_ACCESSORIES: FinishesSpec[] = [
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

export const DEFAULT_PACKAGING: FinishesSpec[] = [
  { name: 'Nenhuma', unitCost: 0 },
  { name: 'Saco plástico', unitCost: 0.5 },
  { name: 'Caixa pequena', unitCost: 2.5 },
  { name: 'Caixa média', unitCost: 4 },
  { name: 'Caixa grande + preenchimento', unitCost: 7 }
]

export const DEFAULT_WHOLESALE: WholesaleTier[] = [
  { minQuantity: 1, discountPercent: 0 },
  { minQuantity: 5, discountPercent: 0.03 },
  { minQuantity: 10, discountPercent: 0.05 },
  { minQuantity: 20, discountPercent: 0.08 },
  { minQuantity: 30, discountPercent: 0.10 },
  { minQuantity: 50, discountPercent: 0.12 },
  { minQuantity: 75, discountPercent: 0.15 },
  { minQuantity: 100, discountPercent: 0.20 }
]

export interface BudgetParameters {
  electricityTariff: number // 0.95
  laborCostPerHour: number // 15
  taxPercent: number // 0.06
  marginPercent: number // 0.40
  manualDiscountPercent: number // 0.12
}

export const DEFAULT_BUDGET_PARAMS: BudgetParameters = {
  electricityTariff: 0.95,
  laborCostPerHour: 15,
  taxPercent: 0.06,
  marginPercent: 0.40,
  manualDiscountPercent: 0
}

// Funções de cálculo por item
export function calculateItemCosts(
  item: BudgetLineItem,
  params: BudgetParameters,
  printers: PrinterSpec[] = DEFAULT_PRINTERS,
  materials: MaterialSpec[] = DEFAULT_MATERIALS,
  finishes: FinishesSpec[] = DEFAULT_FINISHES,
  accessories: FinishesSpec[] = DEFAULT_ACCESSORIES,
  packaging: FinishesSpec[] = DEFAULT_PACKAGING,
  wholesale: WholesaleTier[] = DEFAULT_WHOLESALE
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
  const fin1 = finishes.find(f => f.name === item.finish1)?.unitCost || 0
  const fin2 = finishes.find(f => f.name === item.finish2)?.unitCost || 0
  const finishCostUnit = fin1 + fin2

  // Embalagem
  const packCostUnit = packaging.find(p => p.name === item.packaging)?.unitCost || 0

  // Acessórios
  const acc1 = accessories.find(a => a.name === item.accessory1)?.unitCost || 0
  const acc2 = accessories.find(a => a.name === item.accessory2)?.unitCost || 0
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
