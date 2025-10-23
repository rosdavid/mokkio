"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Upload, Sparkles, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ControlsSidebarProps {
  backgroundColor: string
  setBackgroundColor: (color: string) => void
  backgroundType: "solid" | "gradient"
  setBackgroundType: (type: "solid" | "gradient") => void
  gradientStart: string
  setGradientStart: (color: string) => void
  gradientEnd: string
  setGradientEnd: (color: string) => void
  gradientAngle: number
  setGradientAngle: (angle: number) => void
  padding: number
  setPadding: (value: number) => void
  shadow: number
  setShadow: (value: number) => void
  borderRadius: number
  setBorderRadius: (value: number) => void
  rotation: number
  setRotation: (value: number) => void
  scale: number
  setScale: (value: number) => void
  inset: number
  setInset: (value: number) => void
  showReflection: boolean
  setShowReflection: (value: boolean) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedTemplate: string | null
  setSelectedTemplate: (template: string | null) => void
}

export function ControlsSidebar({
  backgroundColor,
  setBackgroundColor,
  backgroundType,
  setBackgroundType,
  gradientStart,
  setGradientStart,
  gradientEnd,
  setGradientEnd,
  gradientAngle,
  setGradientAngle,
  padding,
  setPadding,
  shadow,
  setShadow,
  borderRadius,
  setBorderRadius,
  rotation,
  setRotation,
  scale,
  setScale,
  inset,
  setInset,
  showReflection,
  setShowReflection,
  onImageUpload,
  selectedTemplate,
  setSelectedTemplate,
}: ControlsSidebarProps) {
  const resetToDefaults = () => {
    setBackgroundType("gradient")
    setGradientStart("#6366f1")
    setGradientEnd("#ec4899")
    setGradientAngle(135)
    setPadding(60)
    setShadow(40)
    setBorderRadius(12)
    setRotation(0)
    setScale(100)
    setInset(0)
    setShowReflection(false)
    setSelectedTemplate(null)
  }

  const gradients = [
    { start: "#6366f1", end: "#ec4899", name: "Indigo Pink" },
    { start: "#f59e0b", end: "#ef4444", name: "Sunset" },
    { start: "#10b981", end: "#3b82f6", name: "Ocean" },
    { start: "#8b5cf6", end: "#ec4899", name: "Purple Pink" },
    { start: "#06b6d4", end: "#8b5cf6", name: "Cyan Purple" },
    { start: "#f43f5e", end: "#fb923c", name: "Rose Orange" },
    { start: "#14b8a6", end: "#06b6d4", name: "Teal Cyan" },
    { start: "#6366f1", end: "#8b5cf6", name: "Indigo Purple" },
    { start: "#fbbf24", end: "#f59e0b", name: "Golden" },
    { start: "#34d399", end: "#10b981", name: "Emerald" },
    { start: "#fb7185", end: "#f43f5e", name: "Pink Rose" },
    { start: "#60a5fa", end: "#3b82f6", name: "Sky Blue" },
    { start: "#a78bfa", end: "#8b5cf6", name: "Violet" },
    { start: "#2dd4bf", end: "#14b8a6", name: "Turquoise" },
    { start: "#fb923c", end: "#f97316", name: "Orange" },
    { start: "#4ade80", end: "#22c55e", name: "Green" },
  ]

  const templates = [
    { id: null, name: "Single Device", icon: "📱" },
    { id: "triple-phone", name: "Triple Phone", icon: "📱📱📱" },
    { id: "laptop-phone", name: "Laptop + Phone", icon: "💻📱" },
    { id: "floating-devices", name: "Floating Mix", icon: "🎨" },
  ]

  return (
    <div className="w-80 overflow-y-auto border-r border-border bg-card p-6">
      <div className="space-y-6">
        {/* Upload Section */}
        <div>
          <Label className="text-sm font-medium">Upload Image</Label>
          <label htmlFor="image-upload">
            <div className="mt-2 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:bg-muted">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Click to upload</p>
              </div>
            </div>
          </label>
          <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
        </div>

        <div>
          <Label className="text-sm font-medium">
            <Layers className="mr-2 inline h-4 w-4" />
            Layout Template
          </Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <button
                key={template.id || "single"}
                onClick={() => setSelectedTemplate(template.id)}
                className={`rounded-lg border-2 p-3 text-center text-xs transition-all ${
                  selectedTemplate === template.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="mb-1 text-lg">{template.icon}</div>
                <div className="font-medium">{template.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Background Section */}
        <div>
          <Label className="text-sm font-medium">Background</Label>
          <Tabs
            value={backgroundType}
            onValueChange={(v) => setBackgroundType(v as "solid" | "gradient")}
            className="mt-2"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solid">Solid</TabsTrigger>
              <TabsTrigger value="gradient">Gradient</TabsTrigger>
            </TabsList>
            <TabsContent value="solid" className="mt-4">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-full cursor-pointer rounded-md border border-border"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            </TabsContent>
            <TabsContent value="gradient" className="mt-4 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Start</Label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="color"
                    value={gradientStart}
                    onChange={(e) => setGradientStart(e.target.value)}
                    className="h-10 w-full cursor-pointer rounded-md border border-border"
                  />
                  <input
                    type="text"
                    value={gradientStart}
                    onChange={(e) => setGradientStart(e.target.value)}
                    className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">End</Label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="color"
                    value={gradientEnd}
                    onChange={(e) => setGradientEnd(e.target.value)}
                    className="h-10 w-full cursor-pointer rounded-md border border-border"
                  />
                  <input
                    type="text"
                    value={gradientEnd}
                    onChange={(e) => setGradientEnd(e.target.value)}
                    className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Angle</Label>
                  <span className="text-xs text-muted-foreground">{gradientAngle}°</span>
                </div>
                <Slider
                  value={[gradientAngle]}
                  onValueChange={(v) => setGradientAngle(v[0])}
                  min={0}
                  max={360}
                  step={1}
                  className="mt-2"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Padding Control */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Padding</Label>
            <span className="text-sm text-muted-foreground">{padding}px</span>
          </div>
          <Slider
            value={[padding]}
            onValueChange={(v) => setPadding(v[0])}
            min={0}
            max={200}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Shadow Control */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Shadow</Label>
            <span className="text-sm text-muted-foreground">{shadow}px</span>
          </div>
          <Slider value={[shadow]} onValueChange={(v) => setShadow(v[0])} min={0} max={100} step={1} className="mt-2" />
        </div>

        {/* Border Radius Control */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Border Radius</Label>
            <span className="text-sm text-muted-foreground">{borderRadius}px</span>
          </div>
          <Slider
            value={[borderRadius]}
            onValueChange={(v) => setBorderRadius(v[0])}
            min={0}
            max={50}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Rotation Control */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Rotation</Label>
            <span className="text-sm text-muted-foreground">{rotation}°</span>
          </div>
          <Slider
            value={[rotation]}
            onValueChange={(v) => setRotation(v[0])}
            min={-45}
            max={45}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Scale Control */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Scale</Label>
            <span className="text-sm text-muted-foreground">{scale}%</span>
          </div>
          <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={50} max={150} step={1} className="mt-2" />
        </div>

        {/* Inset Control */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Inset</Label>
            <span className="text-sm text-muted-foreground">{inset}px</span>
          </div>
          <Slider value={[inset]} onValueChange={(v) => setInset(v[0])} min={0} max={100} step={1} className="mt-2" />
        </div>

        {/* Reflection Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Reflection</Label>
          <Switch checked={showReflection} onCheckedChange={setShowReflection} />
        </div>

        <div>
          <Label className="text-sm font-medium">Preset Gradients</Label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {gradients.map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setBackgroundType("gradient")
                  setGradientStart(preset.start)
                  setGradientEnd(preset.end)
                }}
                className="h-10 w-full rounded-md border border-border transition-transform hover:scale-105"
                style={{
                  background: `linear-gradient(${gradientAngle}deg, ${preset.start} 0%, ${preset.end} 100%)`,
                }}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" className="w-full bg-transparent" onClick={resetToDefaults}>
          <Sparkles className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
