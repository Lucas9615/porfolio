# Système de Galeries - Documentation

Ce système de galeries offre trois types de dispositions élégantes avec PhotoSwipe lightbox intégré, selon les recommandations techniques modernes.

## Installation

Les dépendances nécessaires sont déjà installées :
- `react-photoswipe-gallery` - Wrapper React pour PhotoSwipe
- `photoswipe` - Bibliothèque lightbox
- `react-photo-album` - Dispositions avancées (justifiée, masonry)

## Types de Galeries Disponibles

### 1. GridGallery - Grille CSS Classique

Utilise CSS Grid natif pour des performances optimales. Idéal pour des images de taille similaire.

```tsx
import { GridGallery } from "@/components/ui/grid-gallery"

const images = [
  { src: "/image1.jpg", width: 800, height: 600, alt: "Image 1" },
  { src: "/image2.jpg", width: 800, height: 600, alt: "Image 2" }
]

<GridGallery
  images={images}
  columns={{ default: 2, md: 3, lg: 4 }}
  aspectRatio="square" // "square" | "video" | "auto"
  withCaption={true}
/>
```

### 2. JustifiedGallery - Grille Justifiée

Utilise `react-photo-album` pour créer des rangées harmonieuses comme Google Photos.

```tsx
import { JustifiedGallery } from "@/components/ui/justified-gallery"

<JustifiedGallery
  images={images}
  targetRowHeight={200}
  spacing={8}
  withCaption={true}
/>
```

### 3. MasonryGallery - Disposition Maçonnerie

Style "Pinterest" avec colonnes de largeur égale.

```tsx
import { MasonryGallery } from "@/components/ui/masonry-gallery"

<MasonryGallery
  images={images}
  columns={3}
  spacing={8}
  withCaption={true}
/>
```

## Composant Intégré pour Projets

Le composant `ProjectGallery` combine les trois types avec un sélecteur de disposition.

```tsx
import { ProjectGallery } from "@/components/ui/project-gallery"

<ProjectGallery
  gallery={project.gallery}
  title="Galerie du projet"
  defaultLayout="grid"
  showLayoutSwitcher={true}
/>
```

## Hook Utilitaire

Le hook `useGallery` transforme les données de projet en format `GalleryImage`.

```tsx
import { useGallery } from "@/hooks/use-gallery"

const { images, hasImages, count } = useGallery(project.gallery, {
  defaultWidth: 800,
  defaultHeight: 600
})
```

## Interface GalleryImage

```tsx
interface GalleryImage {
  src: string
  width: number
  height: number
  alt?: string
  caption?: string
}
```

## Configuration PhotoSwipe

Toutes les galeries acceptent des options PhotoSwipe via la prop `options` :

```tsx
<GridGallery
  images={images}
  options={{
    bgOpacity: 0.9,
    loop: true,
    zoom: false
  }}
/>
```

## Bonnes Pratiques

### Performance
- **GridGallery** : Le plus performant pour des grilles simples
- **JustifiedGallery** : Bon compromis pour des images variées
- **MasonryGallery** : Utilise CSS columns, performant mais moins flexible

### Responsive
- Toutes les galeries sont responsive par défaut
- GridGallery offre le contrôle le plus fin avec les breakpoints Tailwind
- JustifiedGallery et MasonryGallery s'adaptent automatiquement

### Images
- Spécifiez toujours `width` et `height` pour éviter le layout shift
- Utilisez `next/image` en interne pour l'optimisation
- Les captions s'affichent au survol et dans la lightbox

## Migration depuis l'ancienne galerie

Remplacez l'ancienne implémentation dans `src/app/projects/[slug]/page.tsx` :

```tsx
// Ancien code
{project.gallery && project.gallery.length > 0 && (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-6">Galerie</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {project.gallery.map((item, index) => (
        <div key={index} className="rounded-lg overflow-hidden">
          <img src={item.image} alt={`${project.title} - Image ${index + 1}`} />
        </div>
      ))}
    </div>
  </div>
)}

// Nouveau code
<ProjectGallery gallery={project.gallery} />
```

## Architecture

Le système suit le pattern de découplage recommandé :
- **Logique de disposition** : react-photo-album ou CSS Grid
- **Logique lightbox** : react-photoswipe-gallery
- **Stylisation** : Tailwind CSS avec contrôle total
- **Optimisation** : next/image intégré

Cette architecture modulaire permet d'interchanger facilement les types de galeries sans impact sur la lightbox. 