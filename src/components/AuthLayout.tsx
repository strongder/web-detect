import { Outlet } from "react-router-dom"
import { Shield } from "lucide-react"

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#0c1220] flex flex-col">
      <header className="flex items-center justify-center h-16 bg-[#2563eb]">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-white" />
          <h1 className="text-xl font-bold text-white">APK Malware Detector</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Outlet />
      </main>

      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2025 APK Malware Detector. All rights reserved.</p>
      </footer>
    </div>
  )
}
