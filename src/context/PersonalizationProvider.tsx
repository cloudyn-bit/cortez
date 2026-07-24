import React, { useEffect } from 'react'
import { usePersonalizationStore } from '@/store/usePersonalizationStore'

export function PersonalizationProvider({ children }: { children: React.ReactNode }) {
  const {
    themePreset,
    accentColor,
    glassIntensity,
    backgroundIntensity,
    cornerRadius,
    animationSpeed,
    density,
  } = usePersonalizationStore()

  useEffect(() => {
    const root = document.documentElement

    // Convert hex to HSL for Tailwind
    const hexToHSL = (hex: string) => {
      let r = 0, g = 0, b = 0;
      if (hex.length == 4) {
        r = parseInt(hex[1] + hex[1], 16)
        g = parseInt(hex[2] + hex[2], 16)
        b = parseInt(hex[3] + hex[3], 16)
      } else if (hex.length == 7) {
        r = parseInt(hex.substring(1, 3), 16)
        g = parseInt(hex.substring(3, 5), 16)
        b = parseInt(hex.substring(5, 7), 16)
      }
      r /= 255; g /= 255; b /= 255;
      let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
      if (delta == 0) h = 0;
      else if (cmax == r) h = ((g - b) / delta) % 6;
      else if (cmax == g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      l = (cmax + cmin) / 2;
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);
      return `${h} ${s}% ${l}%`;
    }

    // Accent Color
    root.style.setProperty('--accent-color', hexToHSL(accentColor))
    root.style.setProperty('--accent-hex', accentColor)

    // Glass Intensity
    const glassOpacities = { low: '0.08', medium: '0.15', high: '0.3' }
    const glassBlurs = { low: '8px', medium: '16px', high: '32px' }
    root.style.setProperty('--glass-opacity', glassOpacities[glassIntensity])
    root.style.setProperty('--glass-blur', glassBlurs[glassIntensity])

    // Background Intensity
    const bgOpacities = { low: '0.03', medium: '0.08', high: '0.15' }
    root.style.setProperty('--bg-intensity', bgOpacities[backgroundIntensity])

    // Corner Radius
    const radii = { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' }
    root.style.setProperty('--radius', radii[cornerRadius])

    // Animation Speed
    const animSpeeds = { slow: '1.5', normal: '1', fast: '0.5' }
    root.style.setProperty('--anim-speed', animSpeeds[animationSpeed])

    // Density
    const densities = { compact: '0.75', comfort: '1', spacious: '1.25' }
    root.style.setProperty('--density', densities[density])

    // Theme Preset base backgrounds (Deep Charcoal, Graphite, Midnight Blue, etc.)
    switch (themePreset) {
      case 'Aurora':
        root.style.setProperty('--background', '240 6% 2.5%') // Deep Charcoal
        root.style.setProperty('--card-base', '240 6% 4.5%')
        break
      case 'Midnight':
        root.style.setProperty('--background', '222 47% 4%') // Midnight Blue
        root.style.setProperty('--card-base', '222 47% 6%')
        break
      case 'Ocean':
        root.style.setProperty('--background', '200 50% 3%') // Deep Teal
        root.style.setProperty('--card-base', '200 50% 5%')
        break
      case 'Carbon':
        root.style.setProperty('--background', '0 0% 5%') // Graphite
        root.style.setProperty('--card-base', '0 0% 8%')
        break
      case 'Glass':
      case 'Nebula':
      case 'Minimal':
      default:
        root.style.setProperty('--background', '240 6% 2.5%')
        root.style.setProperty('--card-base', '240 6% 4.5%')
        break
    }

  }, [themePreset, accentColor, glassIntensity, backgroundIntensity, cornerRadius, animationSpeed, density])

  return <>{children}</>
}
