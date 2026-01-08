interface IstatistikKartProps {
  baslik: string
  deger: string | number
  icon: string
  renk?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

export default function IstatistikKart({
  baslik,
  deger,
  icon,
  renk = 'blue',
}: IstatistikKartProps) {
  const renkler = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{baslik}</p>
          <p className="text-3xl font-bold text-gray-900">{deger}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${renkler[renk]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}
