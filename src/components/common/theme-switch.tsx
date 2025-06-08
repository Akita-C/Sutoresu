"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ThemeSwitchProps {
  showLabel?: boolean
  size?: "sm" | "default" | "lg"
}

export function ThemeSwitch({ showLabel = false }: ThemeSwitchProps) {
  const { isDark, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className="h-4 w-4" />
      {showLabel && (
        <Label className="text-sm font-medium">
          {isDark ? "Dark" : "Light"} mode
        </Label>
      )}
    </div>
  )
}
