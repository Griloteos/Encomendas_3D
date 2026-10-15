import { differenceInCalendarDays, parseISO } from 'date-fns'

export interface DeadlineInfo {
  label: string
  color: 'red' | 'orange' | 'yellow' | 'blue'
  days: number
}

export function getDeadlineInfo(deliveryDateStr: string): DeadlineInfo {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const deliveryDate = parseISO(deliveryDateStr)
  deliveryDate.setHours(0, 0, 0, 0)

  const diffDays = differenceInCalendarDays(deliveryDate, today)

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays)
    return {
      label: `Atrasada há ${absDays} ${absDays === 1 ? 'dia' : 'dias'}`,
      color: 'red',
      days: diffDays
    }
  }

  if (diffDays === 0) {
    return {
      label: 'Entrega hoje',
      color: 'orange',
      days: 0
    }
  }

  if (diffDays === 1) {
    return {
      label: 'Entrega amanhã',
      color: 'yellow',
      days: 1
    }
  }

  return {
    label: `Faltam ${diffDays} dias`,
    color: 'blue',
    days: diffDays
  }
}