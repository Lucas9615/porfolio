"use client"

import { useState } from "react"
import { GridGallery } from "./grid-gallery"
import { JustifiedGallery } from "./justified-gallery"
import { MasonryGallery } from "./masonry-gallery"
import { useGallery, ProjectGalleryItem } from "@/hooks/use-gallery"
import { Button } from "./button"
import { Grid, LayoutGrid, Columns } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ProjectGalleryProps {
  gallery: ProjectGalleryItem[] | undefined
  title?: string
  className?: string
  defaultLayout?: "grid" | "justified" | "masonry"
  showLayoutSwitcher?: boolean
}

export type GalleryLayout = "grid" | "justified" | "masonry"

export function ProjectGallery({
  gallery,
  title = "Galerie",
  className,
  defaultLayout = "grid",
  showLayoutSwitcher = true
}: ProjectGalleryProps) {
  const [currentLayout, setCurrentLayout] = useState<GalleryLayout>(defaultLayout)
  const { images, hasImages } = useGallery(gallery)

  if (!hasImages) {
    return null
  }

  const layoutIcons = {
    grid: Grid,
    justified: LayoutGrid,
    masonry: Columns
  }

  const layoutLabels = {
    grid: "Grille",
    justified: "Justifiée", 
    masonry: "Maçonnerie"
  }

  const renderGallery = () => {
    const commonProps = {
      images,
      className: "mt-6",
      withCaption: true
    }

    switch (currentLayout) {
      case "justified":
        return <JustifiedGallery {...commonProps} targetRowHeight={200} />
      case "masonry":
        return <MasonryGallery {...commonProps} columns={3} />
      case "grid":
      default:
        return (
          <GridGallery 
            {...commonProps} 
            columns={{ default: 2, md: 3, lg: 4 }}
            aspectRatio="auto"
          />
        )
    }
  }

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        
        {showLayoutSwitcher && (
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(Object.keys(layoutIcons) as GalleryLayout[]).map((layout) => {
              const Icon = layoutIcons[layout]
              const isActive = currentLayout === layout
              
              return (
                <Button
                  key={layout}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentLayout(layout)}
                  className={cn(
                    "h-8 w-8 p-0",
                    isActive && "bg-background shadow-sm"
                  )}
                  title={layoutLabels[layout]}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}
          </div>
        )}
      </div>
      
      {renderGallery()}
    </div>
  )
} 