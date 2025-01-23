"use client"

import Image, { ImageProps } from "next/image"
import { useEffect, useState } from "react"

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc: React.ReactNode
}

const ImageWithFallback = ({
  src,
  alt = "",
  fallbackSrc,
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [src])

  if (error) {
    return typeof fallbackSrc === "string" ? (
      <Image alt={alt} {...props} src={fallbackSrc as string} />
    ) : (
      <div className="w-10 h-10 flex items-center justify-center">
        {fallbackSrc}
      </div>
    )
  }

  return <Image alt={alt} {...props} src={src} onError={() => setError(true)} />
}

export default ImageWithFallback
