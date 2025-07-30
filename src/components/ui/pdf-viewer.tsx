'use client'

import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Configuration de pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  url: string
  title?: string
  className?: string
  height?: number
  showToolbar?: boolean
  allowDownload?: boolean
}

export function PdfViewer({ 
  url, 
  title, 
  className,
  height = 600,
  showToolbar = true,
  allowDownload = true
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    setError(`Erreur lors du chargement du PDF: ${error.message}`)
    setIsLoading(false)
  }, [])

  const goToPreviousPage = useCallback(() => {
    setPageNumber(prev => Math.max(prev - 1, 1))
  }, [])

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(prev + 1, numPages))
  }, [numPages])

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.2, 3.0))
  }, [])

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }, [])

  const resetZoom = useCallback(() => {
    setScale(1.0)
  }, [])

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6 text-center">
          <p className="text-destructive mb-4">{error}</p>
          {allowDownload && (
            <Button variant="outline" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Télécharger le PDF
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      {showToolbar && (
        <div className="border-b p-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {title && <Badge variant="outline">{title}</Badge>}
            {!isLoading && (
              <span className="text-sm text-muted-foreground">
                Page {pageNumber} sur {numPages}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {/* Navigation */}
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Zoom */}
            <div className="h-4 w-px bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetZoom}
              disabled={scale === 1.0}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={scale >= 3.0}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            {/* Téléchargement */}
            {allowDownload && (
              <>
                <div className="h-4 w-px bg-border mx-1" />
                <Button variant="ghost" size="sm" asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <CardContent className="p-0 overflow-auto" style={{ height }}>
        <div className="flex justify-center p-4">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="border rounded-md shadow-sm"
            />
          </Document>
        </div>
      </CardContent>
    </Card>
  )
} 