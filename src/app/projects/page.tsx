import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, ExternalLink } from "lucide-react"
import { getAllProjects, type Project } from "@/lib/content"
import ProjectsClient from "./projects-client"

export default function ProjectsPage() {
  const allProjects = getAllProjects()

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Mes Réalisations
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez une sélection de projets qui illustrent ma passion pour le design 
            et mon expertise dans différents domaines créatifs.
          </p>
        </div>

        {/* Contenu avec filtres côté client */}
        <ProjectsClient projects={allProjects} />
      </div>
    </div>
  )
} 