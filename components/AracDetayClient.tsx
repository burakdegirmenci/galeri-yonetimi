'use client'

import { useRouter } from 'next/navigation'
import GiderEkleForm from './GiderEkleForm'
import IslemEkleForm from './IslemEkleForm'
import EkspertizPdfUpload from './EkspertizPdfUpload'
import AracFotograflari from './AracFotograflari'

interface Vehicle {
  id: string
  brand: string
  model: string
  licensePlate: string
  expertisePdfPath?: string | null
  images?: string | null
}

interface AracDetayClientProps {
  vehicle: Vehicle
}

export default function AracDetayClient({ vehicle }: AracDetayClientProps) {
  const router = useRouter()

  const handleSuccess = () => {
    router.refresh()
  }

  const images = vehicle.images ? JSON.parse(vehicle.images) : []

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <GiderEkleForm vehicleId={vehicle.id} onSuccess={handleSuccess} />
        <IslemEkleForm
          vehicleId={vehicle.id}
          vehicleBrand={vehicle.brand}
          vehicleModel={vehicle.model}
          onSuccess={handleSuccess}
        />
      </div>

      <AracFotograflari
        vehicleId={vehicle.id}
        currentImages={images}
        onSuccess={handleSuccess}
      />

      <EkspertizPdfUpload
        vehicleId={vehicle.id}
        currentPdfPath={vehicle.expertisePdfPath}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
