"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DataSourceSectionProps {
  filePath: string
  setFilePath: (value: string) => void
}

export function DataSourceSection({ filePath, setFilePath }: DataSourceSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Obtener la ruta completa del archivo
      const fullPath = file.path || file.name
      // Obtener solo el directorio
      const directory = fullPath.substring(0, fullPath.lastIndexOf("\\") + 1)
      setFilePath(directory)
    }
  }

  return (
    <div className="col-span-3 border border-gray-300 p-2 rounded">
      <div className="text-sm font-semibold mb-2">- Origen de los Datos</div>
      <div className="flex gap-2">
        <Label htmlFor="filePath" className="text-xs whitespace-nowrap">
          Ruta
        </Label>
        <Input
          id="filePath"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          className="text-xs h-8 flex-grow"
        />
        <Button
          onClick={handleBrowse}
          className="bg-gray-200 text-black hover:bg-gray-300 border border-gray-400 text-xs h-8"
        >
          Examinar
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".txt"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
} 