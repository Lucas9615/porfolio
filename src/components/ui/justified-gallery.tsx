"use client"

import PhotoAlbum from "react-photo-album"
import { Gallery, GalleryImage, GalleryItem } from "./gallery"

export interface JustifiedGalleryProps {
  images: GalleryImage[]
  className?: string
  withCaption?: boolean
  targetRowHeight?: number
  spacing?: number
  containerWidth?: number
  options?: Record<string, unknown>
}

export function JustifiedGallery({
  images,
  className,
  withCaption = false,
  targetRowHeight = 200,
  spacing = 8,
  containerWidth,
  options = {}
}: JustifiedGalleryProps) {
  // Transformation des images pour react-photo-album
  const photos = images.map((image) => ({
    src: image.src,
    width: image.width,
    height: image.height,
    alt: image.alt,
    caption: image.caption
  }))

  return (
    <Gallery 
      images={images} 
      className={className} 
      withCaption={withCaption}
      options={options}
    >
      <div>
        {images.map((image, index) => (
          <GalleryItem key={index} image={image}>
            {({ ref, open }) => (
              <div style={{ display: 'none' }}>
                <div
                  ref={ref}
                  onClick={open}
                  style={{ 
                    width: '1px', 
                    height: '1px', 
                    opacity: 0,
                    pointerEvents: 'none'
                  }}
                />
              </div>
            )}
          </GalleryItem>
        ))}
        
        <PhotoAlbum
          photos={photos}
          layout="rows"
          targetRowHeight={targetRowHeight}
          spacing={spacing}
          defaultContainerWidth={containerWidth}
          onClick={({ index }) => {
            // Déclencher l'ouverture de PhotoSwipe pour l'image correspondante
            const galleryItems = document.querySelectorAll(`[data-gallery-index="${index}"]`)
            if (galleryItems[0]) {
              (galleryItems[0] as HTMLElement).click()
            }
          }}
        />
      </div>
    </Gallery>
  )
} 