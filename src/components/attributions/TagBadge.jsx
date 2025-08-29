const tagColors = {
  'TODOS': 'bg-green-500 text-white',
  'CHÁ': 'bg-blue-500 text-white',
  'BLACK': 'bg-gray-900 text-white',
  'MAX': 'bg-green-600 text-white',
  'LONG': 'bg-red-500 text-white',
  'TOOP': 'bg-amber-700 text-white'
}

export function TagBadge({ tag, className = '' }) {
  const colorClass = tagColors[tag] || 'bg-gray-500 text-white'
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {tag}
    </span>
  )
}

