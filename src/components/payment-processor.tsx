"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { PeriodSection } from "./payment-processor/PeriodSection"
import { DataSourceSection } from "./payment-processor/DataSourceSection"
import { SuppliersTable } from "./payment-processor/SuppliersTable"

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

export default function PaymentProcessor() {
  const [fromDate, setFromDate] = useState<Date>(new Date())
  const [toDate, setToDate] = useState<Date>(new Date())
  const [processDate, setProcessDate] = useState<Date>(new Date())
  const [account, setAccount] = useState<string>("0104")
  const [sequence, setSequence] = useState<string>("")
  const [filePath, setFilePath] = useState<string>("C:\\")
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  const toggleSelectAll = (checked: boolean) => {
    setSuppliers(
      suppliers.map((supplier) => ({
        ...supplier,
        selected: checked,
      })),
    )
  }

  const toggleSupplier = (id: number, checked: boolean) => {
    setSuppliers(suppliers.map((supplier) => (supplier.id === id ? { ...supplier, selected: checked } : supplier)))
  }

  const calculateTotal = () => {
    return suppliers.filter((supplier) => supplier.selected).reduce((sum, supplier) => sum + supplier.amount, 0)
  }

  const handleLoadData = () => {
    // Aquí simularemos la carga de datos basada en el período seleccionado
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, "0")
    const date = format(new Date(), "ddMM")
    setSequence(date + randomNum)

    // Simulamos la carga de datos con los proveedores de ejemplo
    setSuppliers([
      {
        id: 1,
        document: "",
        name: "INMOBILIARIA FAIDA C.A.",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 575070.2,
        selected: false,
        status: "pending",
        error: "",
      },
      {
        id: 2,
        document: "",
        name: "CORPORACION INMOBILIARIA,C.A.",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 52106.04,
        selected: false,
        status: "pending",
        error: "",
      },
      {
        id: 3,
        document: "",
        name: "LUIS PUCHADES CUBER",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 34798.2798,
        selected: false,
        status: "pending",
        error: "",
      },
      {
        id: 4,
        document: "",
        name: "HERRERA DE BENACERRAF MERCEDES",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 10360.5599,
        selected: false,
        status: "pending",
        error: "",
      },
      {
        id: 5,
        document: "",
        name: "HERRERA LUIS FELIPE",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 9799.9998,
        selected: false,
        status: "pending",
        error: "",
      },
      {
        id: 6,
        document: "",
        name: "BENACERRAF HERRERA ANDReS",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 796.8796,
        selected: false,
        status: "pending",
        error: "",
      },
      {
        id: 7,
        document: "",
        name: "BENACERRAF HERRERA JORGE FORTUN",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 796.8796,
        selected: false,
        status: "pending",
        error: "",
      },
      {
        id: 8,
        document: "",
        name: "BENACERRAF DE NOGUERA MERCEDES",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 796.8796,
        selected: false,
        status: "pending",
        error: "",
      },
      {
        id: 9,
        document: "",
        name: "CORPORACION TAPAYOSA C.A.",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 147432.6,
        selected: false,
        status: "pending",
        error: "",
      },
      {
        id: 10,
        document: "",
        name: "iCORPORACION TAPAYOSA C.A.",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 147432.6,
        selected: false,
        status: "pending",
        error: "",
      },
      {
        id: 11,
        document: "",
        name: "bORPORACION TAPAYOSA C.A.",
        date: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: 147432.6,
        selected: false,
        status: "pending",
        error: "",
      },

    ])
  }

  const handleProcess = async () => {
    const selectedSuppliers = suppliers.filter((supplier) => supplier.selected)

    if (selectedSuppliers.length === 0) {
      alert("Por favor seleccione al menos un proveedor")
      return
    }

    if (!filePath) {
      alert("Por favor seleccione una ruta de destino")
      return
    }

    let content = `Fecha de Proceso: ${format(processDate, "dd-MM-yyyy")}\n`
    content += `Cuenta: ${account}\n`
    content += `Secuencia: ${sequence}\n\n`
    content += "DOCUMENTO\tPROVEEDOR\tFECHA\tMONTO\n"

    selectedSuppliers.forEach((supplier) => {
      content += `${supplier.document}\t${supplier.name}\t${supplier.date}\t${supplier.amount.toFixed(4)}\n`
    })

    content += `\nTOTAL: ${calculateTotal().toFixed(4)} BSS`

    try {
      // Crear el nombre del archivo
      const fileName = `Pago_Proveedores_${format(new Date(), "yyyyMMdd")}.txt`
      const fullPath = `${filePath}${fileName}`

      // Crear el Blob y guardarlo
      const blob = new Blob([content], { type: "text/plain" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = fileName
      // Establecer el atributo download con la ruta completa
      a.setAttribute("download", fullPath)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(a.href)

      alert(`Archivo generado exitosamente en: ${fullPath}`)
    } catch (error) {
      alert("Error al generar el archivo: " + error)
    }
  }

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-md shadow-md w-full max-w-4xl">
      <div className="flex items-center justify-between bg-gray-200 p-2 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-banknote"
          >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
          </svg>
          <h2 className="text-sm font-semibold">Pago a Proveedores BVC (4.5.0-04)</h2>
        </div>
        <div className="flex gap-1">
          <button className="w-5 h-5 flex items-center justify-center border border-gray-400 bg-gray-200 text-xs">
            _
          </button>
          <button className="w-5 h-5 flex items-center justify-center border border-gray-400 bg-gray-200 text-xs">
            □
          </button>
          <button className="w-5 h-5 flex items-center justify-center border border-gray-400 bg-gray-200 text-xs">
            ×
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-3 gap-4">
        <PeriodSection
          fromDate={fromDate}
          toDate={toDate}
          processDate={processDate}
          account={account}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setProcessDate={setProcessDate}
          setAccount={setAccount}
          onLoadData={handleLoadData}
        />

        <div className="border border-gray-300 p-2 rounded flex flex-col">
          <div className="text-xs font-semibold mb-2">Secuencia generada:</div>
          <div className="text-xs">{sequence || "No se ha generado secuencia"}</div>
        </div>

        <DataSourceSection filePath={filePath} setFilePath={setFilePath} />

        <SuppliersTable
          suppliers={suppliers}
          toggleSelectAll={toggleSelectAll}
          toggleSupplier={toggleSupplier}
          calculateTotal={calculateTotal}
        />

        <div className="col-span-3 mt-2">
          <div className="flex justify-between">
            <Button
              onClick={handleProcess}
              className="bg-gray-200 text-black hover:bg-gray-300 border border-gray-400 text-xs h-8"
              disabled={suppliers.length === 0}
            >
              Procesar
            </Button>
            <div className="w-full ml-2 h-8 bg-gray-200 border border-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

