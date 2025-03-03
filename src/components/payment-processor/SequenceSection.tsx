"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

interface SequenceSectionProps {
  sequence: string
  setSequence: (value: string) => void
}

export function SequenceSection({ sequence, setSequence }: SequenceSectionProps) {
  const generateSequence = () => {
    const randomNum = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
    const date = format(new Date(), "ddMM")
    setSequence(date + randomNum)
  }

  return (
    <div className="border border-gray-300 p-2 rounded flex flex-col">
      <Button
        onClick={generateSequence}
        className="mb-4 bg-gray-200 text-black hover:bg-gray-300 border border-gray-400 text-xs h-8"
      >
        Generar Secuencia
      </Button>
      <Input value={sequence} onChange={(e) => setSequence(e.target.value)} className="text-xs h-8 mt-auto" />
    </div>
  )
} 