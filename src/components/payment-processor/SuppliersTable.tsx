"use client"

import { useRef } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Supplier {
  id: number
  document: string
  name: string
  date: string
  amount: number
  selected: boolean
  status: string
  error: string
}

interface SuppliersTableProps {
  suppliers: Supplier[]
  toggleSelectAll: (checked: boolean) => void
  toggleSupplier: (id: number, checked: boolean) => void
  calculateTotal: () => number
  isLoading: boolean
}

export function SuppliersTable({ 
  suppliers, 
  toggleSelectAll, 
  toggleSupplier, 
  calculateTotal,
  isLoading 
}: SuppliersTableProps) {
  const tableRef = useRef<HTMLDivElement>(null)

  // Verificar si todos los proveedores están seleccionados
  const areAllSelected = suppliers.length > 0 && suppliers.every((supplier) => supplier.selected)
  
  // Calcular cuántos proveedores están seleccionados
  const selectedCount = suppliers.filter(supplier => supplier.selected).length

  return (
    <div className="col-span-3">
      <div className="flex justify-between mb-1">
        <div className="text-xs">
          {selectedCount > 0 && (
            <span>
              {selectedCount} proveedor{selectedCount !== 1 ? 'es' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Checkbox 
            id="selectAll" 
            checked={areAllSelected}
            onCheckedChange={(checked) => toggleSelectAll(checked === true)}
            disabled={isLoading || suppliers.length === 0}
          />
          <Label htmlFor="selectAll" className="text-xs">
            Todos
          </Label>
        </div>
      </div>

      <div className="border border-gray-300 rounded overflow-hidden">
        <div 
          ref={tableRef}
          className="h-[200px] overflow-auto relative"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #f1f1f1'
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center z-50">
              <div className="text-sm">Cargando datos...</div>
            </div>
          )}
          
          <table className="w-full text-xs">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="p-1 border-r border-gray-300 w-10">Item</th>
                <th className="p-1 border-r border-gray-300">Documento</th>
                <th className="p-1 border-r border-gray-300">Proveedor</th>
                <th className="p-1 border-r border-gray-300">Fecha</th>
                <th className="p-1 border-r border-gray-300">Estado</th>
                <th className="p-1 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No hay datos disponibles. Seleccione un período y haga clic en "Cargar Datos".
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t border-gray-300 hover:bg-gray-100">
                    <td className="p-1 border-r border-gray-300 text-center">
                      <Checkbox
                        checked={supplier.selected}
                        onCheckedChange={(checked) => toggleSupplier(supplier.id, checked === true)}
                        disabled={isLoading}
                      />
                    </td>
                    <td className="p-1 border-r border-gray-300">{supplier.document}</td>
                    <td className="p-1 border-r border-gray-300">{supplier.name}</td>
                    <td className="p-1 border-r border-gray-300">{supplier.date}</td>
                    <td className="p-1 border-r border-gray-300">
                      {supplier.error ? (
                        <span className="text-red-500">{supplier.error}</span>
                      ) : (
                        supplier.status
                      )}
                    </td>
                    <td className="p-1 text-right">{supplier.amount.toFixed(4)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <div className="text-xs">
          <div>
            Nota: Este Proceso Generara un Archivo Plano de Extension TXT Ubicandolo en la ruta especificada.
          </div>
          <div className="mt-1">
            Total de proveedores: {suppliers.length}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold">Total:</div>
          <div className="text-lg font-bold">{calculateTotal().toFixed(4)} BSS</div>
        </div>
      </div>
    </div>
  )
} 