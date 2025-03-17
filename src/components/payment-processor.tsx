"use client"

import { useState, useEffect } from "react"
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
  montoSTR: string
  ctaBanco: string
  cedula: string
  descripcion: string
  referencia: string
  email: string
}

// Función para generar espacios en blanco
const generateSpaces = (length: number): string => {
  return ' '.repeat(length);
}

export default function PaymentProcessor() {
  const [fromDate, setFromDate] = useState<Date>(new Date())
  const [toDate, setToDate] = useState<Date>(new Date())
  const [processDate, setProcessDate] = useState<Date>(new Date())
  const [account, setAccount] = useState<string>("01910035942135009859")
  const [sequence, setSequence] = useState<string>("")
  const [filePath, setFilePath] = useState<string>("C:\\")
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

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
    const total = suppliers.filter((supplier) => supplier.selected)
      .reduce((sum, supplier) => sum + (supplier.montoSTR ? parseFloat(supplier.montoSTR) : 0), 0);
    return total ;
  }

  /*
  const calculateTotalaes = () => {
    return suppliers.filter((supplier) => supplier.selected).reduce((sum, supplier) => sum + supplier.montoSTRamount, 0)
  }
*/
  const handleLoadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const fechaDesde = format(fromDate, "yyyy-MM-dd")
      const fechaHasta = format(toDate, "yyyy-MM-dd")

      const url = "http://127.0.0.1:8080/lagunita/crearTXTBancoWS.do"
      //Í
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=ISO-8859-1',
          'Accept': 'application/json',
          'Accept-Charset': 'UTF-8'
        },
        body: JSON.stringify({
          fechaDesde,
          fechaHasta
        })
      })
      
      if (!response.ok) {
        throw new Error(`Error al cargar datos: ${response.statusText}`)
      }

      // Mostrar información sobre el charset y headers de la respuesta
      //console.log('Content-Type de la respuesta:', response.headers.get('content-type'));
      //console.log('Headers de la respuesta:', Object.fromEntries(response.headers.entries()));

      // Decodificar la respuesta como texto y luego como JSON
      const textData = await response.text()
      console.log('Datos recibidos (raw):', textData);
      
      // Función para decodificar caracteres especiales
      const decodeSpecialCharacters = (text: string) => {
        // Convertir el texto a un array de caracteres y procesar cada uno
        const processedChars = Array.from(text).map(char => {
          const code = char.charCodeAt(0);
          // Si el código ASCII es mayor a 127, es un carácter especial
          if (code > 127) {
            console.log(`Carácter especial encontrado: "${char}" (código ASCII: ${code})`);
            return '-';
          }
          return char;
        });
        return processedChars.join('');
      };

      console.log('Iniciando decodificación...');
      const decodedText = decodeSpecialCharacters(textData);
      console.log('Texto decodificado:', decodedText);

      // Intentar parsear el JSON decodificado
      const data = JSON.parse(decodedText);
      console.log('Datos parseados:', data);

      // Generar secuencia
      const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, "0")
      const date = format(new Date(), "ddMM")
      setSequence(date + randomNum)

      // Definir la interfaz para los datos recibidos
      interface SupplierData {
        id?: number
        document?: string
        name?: string
        date?: string
        amount?: string | number
        email?:string
        montoSTR?:string
        ctaBanco?:string
        cedula?:string
        descripcion?:string
        referencia?:string
      }

      // Transformar los datos recibidos al formato esperado
      const transformedSuppliers = (Array.isArray(data) ? data : []).map((item: SupplierData) => ({
        id: item.id || Math.random(),
        document: (item.document || "").trim(),
        name: item.name || "",
        date: item.date || format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        amount: typeof item.amount === 'string' ? parseFloat(item.amount) : (typeof item.amount === 'number' ? item.amount : 0),
        selected: false,
        status: "pending",
        email: item.email || generateSpaces(100),
        montoSTR: item.montoSTR || "",
        ctaBanco: item.ctaBanco || "",
        cedula: item.cedula || "",
        descripcion: item.descripcion || "",
        referencia: item.referencia || "",
        error: ""
      }))

      setSuppliers(transformedSuppliers)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los datos")
      console.error("Error al cargar datos:", err)
      alert("Error al cargar los datos. Por favor intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
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

    // Formatear el total con 15 dígitos y los últimos 2 como decimales
    const totalAmount = calculateTotal() ; // Multiplicar por 100 para manejar los decimales
    const totalStr = totalAmount.toFixed(0).padStart(15, '0'); // Ya no necesitamos .toFixed(2) porque ya manejamos los decimales
    
    
    let content = `C${selectedSuppliers.length.toString().padStart(5, '0')}${totalStr}${sequence}SNN00\n`
    //content += `Cuenta: ${account}\n`
    //content += `Secuencia: ${sequence}\n`
    //content += `Total Registros Seleccionados: ${selectedSuppliers.length.toString().padStart(5, '0')}\n`
    //content += "DOCUMENTO\tPROVEEDOR\tFECHA\tMONTO\tEMAIL\n"

    selectedSuppliers.forEach((supplier) => {
      // Extraer los componentes de la fecha del string (asumiendo formato dd-MM-yyyy HH:mm:ss)
      const [datePart] = supplier.date.split(' '); // Separar la fecha de la hora
      const [day, month, year] = datePart.split('-').map(Number);
      
      // Crear la fecha usando los componentes
      const date = new Date(year, month - 1, day); // month - 1 porque los meses en JS van de 0-11
      const formattedDate = format(date, "ddMMyyyy");
      
      content += `D${formattedDate}${account}${supplier.ctaBanco}${supplier.montoSTR}${supplier.descripcion}${supplier.cedula}${supplier.name}${supplier.email}${supplier.referencia}\n`
    })

    
    
    //content += `\nTOTAL: ${totalStr} BSS`
   // content += `\nC000020000255525512510000000000SNN00`
   //content += `\nC${selectedSuppliers.length.toString().padStart(5, '0')}\n`

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

  const handleExit = () => {
    // Usar una variable para evitar acceso directo a window durante SSR
    const shouldExit = typeof window !== 'undefined' && window.confirm('¿Está seguro que desea salir de la aplicación?');
    if (shouldExit) {
      // Redirigir a una URL en blanco o cerrar si es una ventana popup
      if (window.opener) {
        window.close();
      } else {
        window.location.href = 'about:blank';
      }
    }
  };

  // Manejar el evento de cierre de ventana
  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      const message = '¿Está seguro que desea salir de la aplicación?';
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, []);

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
          <button 
            onClick={handleExit}
            className="w-5 h-5 flex items-center justify-center border border-gray-400 bg-gray-200 text-xs hover:bg-red-500 hover:text-white"
          >
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
          isLoading={isLoading}
        />

        <div className="border border-gray-300 p-2 rounded flex flex-col">
          <div className="text-xs font-semibold mb-2">Secuencia generada:</div>
          <div className="text-xs">{sequence || "No se ha generado secuencia"}</div>
          {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
        </div>

        <DataSourceSection filePath={filePath} setFilePath={setFilePath} />

        <SuppliersTable
          suppliers={suppliers}
          toggleSelectAll={toggleSelectAll}
          toggleSupplier={toggleSupplier}
          calculateTotal={calculateTotal}
          isLoading={isLoading}
        />

        <div className="col-span-3 mt-2">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                onClick={handleProcess}
                className="bg-gray-200 text-black hover:bg-gray-300 border border-gray-400 text-xs h-8"
                disabled={suppliers.length === 0}
              >
                Procesar
              </Button>
              <Button
                onClick={handleExit}
                className="bg-red-500 text-white hover:bg-red-600 border border-red-600 text-xs h-8"
              >
                Salir
              </Button>
            </div>
            <div className="w-full ml-2 h-8 bg-gray-200 border border-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

