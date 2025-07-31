import { useMemo } from "react"
import { GalleryImage } from "@/components/ui/gallery"

export interface ProjectGalleryItem {
  image: string
  caption?: string
}

export interface UseGalleryOptions {
  defaultWidth?: number
  defaultHeight?: number
}

export function useGallery(
  items: ProjectGalleryItem[] | undefined,
  options: UseGalleryOptions = {}
) {
  const { defaultWidth = 800, defaultHeight = 600 } = options

  const galleryImages = useMemo<GalleryImage[]>(() => {
    if (!items || items.length === 0) return []
    
    return items.map((item, index) => ({
      src: item.image,
      width: defaultWidth, // En production, ces dimensions devraient être récupérées des métadonnées de l'image
      height: defaultHeight,
      alt: `Image ${index + 1}`,
      caption: item.caption
    }))
  }, [items, defaultWidth, defaultHeight])

  return {
    images: galleryImages,
    hasImages: galleryImages.length > 0,
    count: galleryImages.length
  }
}

// Fonction utilitaire pour transformer une galerie de projet
export function transformProjectGallery(
  gallery: ProjectGalleryItem[] | undefined,
  options: UseGalleryOptions = {}
): GalleryImage[] {
  if (!gallery || gallery.length === 0) return []
  
  const { defaultWidth = 800, defaultHeight = 600 } = options
  
  return gallery.map((item, index) => ({
    src: item.image,
    width: defaultWidth,
    height: defaultHeight,
    alt: `Image ${index + 1}`,
    caption: item.caption
  }))
} 