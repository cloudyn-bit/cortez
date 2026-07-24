
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePersonalizationStore, ThemePreset, Intensity, CornerRadius, AnimationSpeed, Density } from '@/store/usePersonalizationStore'
import { Palette, Maximize, Circle, SunMoon, Activity, AlignLeft } from 'lucide-react'
import { StaggerReveal } from '@/components/ui/StaggerReveal'

export function PersonalizationPage() {
  const {
    themePreset, setThemePreset,
    accentColor, setAccentColor,
    glassIntensity, setGlassIntensity,
    backgroundIntensity, setBackgroundIntensity,
    cornerRadius, setCornerRadius,
    animationSpeed, setAnimationSpeed,
    density, setDensity,
    resetPersonalization
  } = usePersonalizationStore()

  const presetOptions: ThemePreset[] = ['Aurora', 'Midnight', 'Ocean', 'Carbon', 'Glass', 'Nebula', 'Minimal']
  const intensityOptions: { label: string; value: Intensity }[] = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ]
  const radiusOptions: { label: string; value: CornerRadius }[] = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra Large', value: 'xl' },
    { label: 'Full', value: 'full' }
  ]
  const speedOptions: { label: string; value: AnimationSpeed }[] = [
    { label: 'Slow', value: 'slow' },
    { label: 'Normal', value: 'normal' },
    { label: 'Fast', value: 'fast' }
  ]
  const densityOptions: { label: string; value: Density }[] = [
    { label: 'Compact', value: 'compact' },
    { label: 'Comfort', value: 'comfort' },
    { label: 'Spacious', value: 'spacious' }
  ]

  const predefinedColors = ['#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#10b981', '#f59e0b']

  return (
    <PageContainer
      title="Personalization"
      description="Customize your LifeOS experience with live updates."
      action={
        <Button variant="outline" size="sm" onClick={resetPersonalization}>
          Reset Defaults
        </Button>
      }
    >
      <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        
        {/* Presets & Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><SunMoon className="h-4 w-4 text-[var(--accent-hex)]" /> Theme Presets</CardTitle>
            <CardDescription>Choose a base color theme.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {presetOptions.map((preset) => (
                <Button
                  key={preset}
                  variant={themePreset === preset ? 'glow' : 'outline'}
                  size="sm"
                  onClick={() => setThemePreset(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>

            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-2"><Palette className="h-4 w-4" /> Accent Color</label>
              <div className="flex flex-wrap gap-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 active:scale-95"
                    style={{
                      backgroundColor: color,
                      borderColor: accentColor === color ? 'white' : 'transparent',
                      boxShadow: accentColor === color ? `0 0 10px ${color}` : 'none'
                    }}
                  />
                ))}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:scale-110 transition-transform">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="absolute -inset-4 w-[200%] h-[200%] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Maximize className="h-4 w-4 text-[var(--accent-hex)]" /> Glass & Background</CardTitle>
            <CardDescription>Adjust the depth and transparency.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">Glass Intensity</label>
              <div className="flex bg-white/5 p-1 rounded-lg">
                {intensityOptions.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setGlassIntensity(value)}
                    className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${glassIntensity === value ? 'bg-[var(--accent-hex)] text-white shadow' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">Background Intensity</label>
              <div className="flex bg-white/5 p-1 rounded-lg">
                {intensityOptions.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setBackgroundIntensity(value)}
                    className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${backgroundIntensity === value ? 'bg-[var(--accent-hex)] text-white shadow' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout & Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Circle className="h-4 w-4 text-[var(--accent-hex)]" /> Geometry & Layout</CardTitle>
            <CardDescription>Customize shapes and spacing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">Corner Radius</label>
              <div className="flex flex-wrap gap-2">
                {radiusOptions.map(({ label, value }) => (
                  <Button
                    key={value}
                    variant={cornerRadius === value ? 'glow' : 'outline'}
                    size="sm"
                    onClick={() => setCornerRadius(value)}
                    className="text-xs h-7 px-2.5"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-2"><AlignLeft className="h-4 w-4" /> Content Density</label>
              <div className="flex bg-white/5 p-1 rounded-lg">
                {densityOptions.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setDensity(value)}
                    className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${density === value ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motion Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4 text-[var(--accent-hex)]" /> Motion</CardTitle>
            <CardDescription>Adjust animation speeds and effects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">Animation Speed</label>
              <div className="flex bg-white/5 p-1 rounded-lg">
                {speedOptions.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setAnimationSpeed(value)}
                    className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${animationSpeed === value ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

      </StaggerReveal>
    </PageContainer>
  )
}
