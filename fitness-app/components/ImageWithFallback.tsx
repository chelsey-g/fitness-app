"use client"

import Image, { ImageProps } from "next/image"
import { useEffect, useState } from "react"

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc: string
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

  return (
    <Image
      alt={alt}
      width={40}
      height={40}
      {...props}
      src={error ? fallbackSrc : src}
      onError={() => setError(true)}
    />
  )
}

export default ImageWithFallback
