'use client'

import { useLanguage } from '@/contexts/language-context'
import { useEffect, useRef } from 'react'
// ... other imports

export function Dialog({ ...props }) {
  const { translateElement } = useLanguage()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (dialogRef.current && props.open) {
      translateElement(dialogRef.current)
    }
  }, [props.open])

  return (
    <div ref={dialogRef} className="rtl:text-right">
      {/* ... existing dialog content ... */}
    </div>
  )
} 