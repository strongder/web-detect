"use client"

import {  Eye, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"



export default function GraphVisualization({ imageUrl }: any) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleDownload = () => {
     window.open(imageUrl, "_blank")
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Graph Visualization</h2>
      </div>

      <div className="relative overflow-hidden border rounded-lg border-[#1e293b] bg-[#0f172a]">
        <div className="flex items-center justify-between p-3 border-b border-[#1e293b]">
          <h3 className="text-sm font-medium text-white">APK Structure Graph</h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400 hover:text-white"
              onClick={handleDownload}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400 hover:text-white"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 h-[400px]">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="APK Structure Graph"
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=400&width=400"
              target.alt = "Failed to load graph image"
            }}
          />
        </div>
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-[1000px]">
          <DialogHeader>
            <DialogTitle>APK Structure Visualization</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 h-[80vh]">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="APK Structure Graph"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=600&width=600"
                target.alt = "Failed to load graph image"
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
