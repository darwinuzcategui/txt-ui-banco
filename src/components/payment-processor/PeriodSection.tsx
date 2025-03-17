"use client"

import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"

interface PeriodSectionProps {
  fromDate: Date
  toDate: Date
  processDate: Date
  account: string
  setFromDate: (date: Date) => void
  setToDate: (date: Date) => void
  setProcessDate: (date: Date) => void
  setAccount: (value: string) => void
  onLoadData: () => void
  isLoading: boolean
}

export function PeriodSection({
  fromDate,
  toDate,
  processDate,
  account,
  setFromDate,
  setToDate,
  setProcessDate,
  setAccount,
  onLoadData,
  isLoading,
}: PeriodSectionProps) {
  return (
    <div className="col-span-2 border border-gray-300 p-2 rounded">
      <div className="text-sm font-semibold mb-2">- Periodo</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fromDate" className="text-xs">
            Desde:
          </Label>
          <div className="flex">
            <Input id="fromDate" value={format(fromDate, "dd-MM-yyyy")} className="text-xs h-8" readOnly />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-8 p-0 ml-1" disabled={isLoading}>
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fromDate} onSelect={(date) => date && setFromDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <Label htmlFor="toDate" className="text-xs">
            Hasta:
          </Label>
          <div className="flex">
            <Input id="toDate" value={format(toDate, "dd-MM-yyyy")} className="text-xs h-8" readOnly />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-8 p-0 ml-1" disabled={isLoading}>
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={toDate} onSelect={(date) => date && setToDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <Label htmlFor="account" className="text-xs">
            Cuentas
          </Label>
          <Select value={account} onValueChange={setAccount} disabled={isLoading}>
            <SelectTrigger id="account" className="h-8 text-xs">
              <SelectValue placeholder="Seleccionar cuenta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0191">01910035942135009859</SelectItem>
              <SelectItem value="0105">01910035942135009859</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="processDate" className="text-xs">
            Fecha a Procesar
          </Label>
          <div className="flex">
            <Input id="processDate" value={format(processDate, "dd-MM-yyyy")} className="text-xs h-8" readOnly />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-8 p-0 ml-1" disabled={isLoading}>
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={processDate}
                  onSelect={(date) => date && setProcessDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button
          onClick={onLoadData}
          className="w-full bg-gray-200 text-black hover:bg-gray-300 border border-gray-400 text-xs h-8"
          disabled={isLoading}
        >
          {isLoading ? "Cargando datos..." : "Cargar Datos"}
        </Button>
      </div>
    </div>
  )
} 