import PaymentProcessor from "@/components/payment-processor"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-gray-300">
      <PaymentProcessor />
    </main>
  )
}

