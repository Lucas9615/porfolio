"use client"

import Image from "next/image"
import { Gallery, GalleryImage, GalleryItem } from "./gallery"
import { cn } from "@/lib/utils"

export interface MasonryGalleryProps {
  images: GalleryImage[]
  className?: string
  withCaption?: boolean
  columns?: number | { [key: string]: number }
  spacing?: number
  options?: Record<string, unknown>
}

export function MasonryGallery({
  images,
  className,
  withCaption = false,
  columns = 3,
  spacing = 8,
  options = {}
}: MasonryGalleryProps) {
  // Pour l'instant, utilisons une approche simple avec CSS Grid masonry-like
  // En attendant une meilleure intégration avec react-photo-album
  
  const colsClass = typeof columns === 'number' 
    ? `columns-${columns}` 
    : Object.entries(columns).map(([key, value]) => 
        key === 'default' ? `columns-${value}` : `${key}:columns-${value}`
      ).join(' ')

  return (
    <Gallery 
      images={images} 
      className={className} 
      withCaption={withCaption}
      options={options}
    >
      <div 
        className={cn(
          colsClass,
          `gap-${spacing}`,
          "space-y-4",
          className
        )}
      >
        {images.map((image, index) => (
          <GalleryItem key={index} image={image}>
            {({ ref, open }) => (
              <div 
                className="break-inside-avoid cursor-pointer group mb-4"
                onClick={open}
              >
                <div className="rounded-lg overflow-hidden">
                  <Image
                    ref={ref}
                    src={image.src}
                    alt={image.alt || `Image ${index + 1}`}
                    width={image.width}
                    height={image.height}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {withCaption && image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.caption}
                    </div>
                  )}
                </div>
              </div>
            )}
          </GalleryItem>
        ))}
      </div>
    </Gallery>
  )
} 