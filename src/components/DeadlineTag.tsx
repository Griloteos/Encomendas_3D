import { getDeadlineInfo } from '../utils/deadline'

interface DeadlineTagProps {
  deliveryDate: string
}

const colorStyles = {
  red: 'bg-red-100 text-red-800 border-red-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200'
}

export default function DeadlineTag({ deliveryDate }: DeadlineTagProps) {
  const info = getDeadlineInfo(deliveryDate)

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorStyles[info.color]}`}>
      {info.label}
    </span>
  )
}