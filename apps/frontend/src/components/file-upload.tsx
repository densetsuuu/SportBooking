import { FileIcon, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'

type FileUploadProps = {
  onChange: (files: File[]) => void
  accept?: string
  multiple?: boolean
}

export default function FileUpload({
  onChange,
  accept = '*',
  multiple = false,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
    onChange(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setSelectedFiles(files)
    onChange(files)
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onChange(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="w-full">
      <div
        className={`flex justify-center rounded-md border-2 border-dashed px-6 py-10 transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-input hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload
            className="mx-auto h-12 w-12 text-muted-foreground"
            aria-hidden={true}
          />
          <div className="mt-4 flex text-sm leading-6 text-foreground">
            <Label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-sm font-medium text-primary hover:underline hover:underline-offset-4"
            >
              <span>Choisir {multiple ? 'des fichiers' : 'un fichier'}</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
              />
            </Label>
            <p className="pl-1">ou glisser-déposer</p>
          </div>
          <p className="text-xs leading-5 text-muted-foreground mt-2">
            {accept === '*' ? 'Tous types de fichiers' : accept}
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative rounded-lg bg-muted p-3 flex items-center space-x-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-input">
                <FileIcon
                  className="size-5 text-foreground"
                  aria-hidden={true}
                />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-sm p-2 text-muted-foreground hover:text-foreground"
                onClick={() => removeFile(index)}
                aria-label="Supprimer"
              >
                <X className="size-4 shrink-0" aria-hidden={true} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
