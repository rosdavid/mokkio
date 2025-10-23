"use client"
import { Button } from "@/components/ui/button"
import { Smartphone, Monitor, Tablet, Globe } from "lucide-react"

interface DeviceFrameSelectorProps {
  selectedDevice: string
  setSelectedDevice: (device: string) => void
}

export function DeviceFrameSelector({ selectedDevice, setSelectedDevice }: DeviceFrameSelectorProps) {
  const deviceCategories = [
    {
      name: "Mobile",
      icon: Smartphone,
      devices: [
        { id: "iphone-15-pro", name: "iPhone 15 Pro", size: "393×852" },
        { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", size: "430×932" },
        { id: "android-pixel", name: "Pixel 8 Pro", size: "412×915" },
      ],
    },
    {
      name: "Desktop",
      icon: Monitor,
      devices: [
        { id: "macbook-pro-14", name: 'MacBook Pro 14"', size: "1512×982" },
        { id: "macbook-pro-16", name: 'MacBook Pro 16"', size: "1728×1117" },
        { id: "imac-24", name: 'iMac 24"', size: "1920×1080" },
      ],
    },
    {
      name: "Tablet",
      icon: Tablet,
      devices: [
        { id: "ipad-pro-11", name: 'iPad Pro 11"', size: "834×1194" },
        { id: "ipad-pro-13", name: 'iPad Pro 13"', size: "1024×1366" },
      ],
    },
    {
      name: "Browser",
      icon: Globe,
      devices: [
        { id: "chrome-browser", name: "Chrome", size: "1440×900" },
        { id: "safari-browser", name: "Safari", size: "1440×900" },
        { id: "firefox-browser", name: "Firefox", size: "1440×900" },
      ],
    },
  ]

  return (
    <div className="border-b border-border bg-card">
      <div className="flex gap-6 overflow-x-auto px-6 py-4">
        {deviceCategories.map((category) => (
          <div key={category.name} className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <category.icon className="h-4 w-4" />
              {category.name}
            </div>
            <div className="flex gap-2">
              {category.devices.map((device) => (
                <Button
                  key={device.id}
                  variant={selectedDevice === device.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDevice(device.id)}
                  className="shrink-0"
                >
                  <span className="font-medium">{device.name}</span>
                  <span className="ml-1.5 text-xs opacity-60">{device.size}</span>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
