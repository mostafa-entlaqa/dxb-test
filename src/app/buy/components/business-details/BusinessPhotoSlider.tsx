"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"



export default function BusinessPhotoSlider({photos}: {photos: string[]}) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
  }

  return (
    <div className="relative">
      <img
        src={photos[currentPhotoIndex] || "/placeholder.svg"}
        alt={`Business photo ${currentPhotoIndex + 1}`}
        className="w-full h-[400px] object-cover rounded-lg"
      />
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={prevPhoto}
      >
        <ChevronLeft className="h-4 w-4 text-blue-600" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={nextPhoto}
      >
        <ChevronRight className="h-4 w-4 text-blue-600" />
      </Button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {photos.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentPhotoIndex ? "bg-blue-600" : "bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  )
}

