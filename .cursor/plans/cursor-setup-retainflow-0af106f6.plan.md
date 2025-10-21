<!-- 0af106f6-70e8-4b89-8da6-9fa76e87cf86 90f2fe5f-9176-4c26-be1e-c57988b8f7eb -->
# p5.js Interactive Logo Animation Fix

## Problem

- Syntax Error in P5AnimatedHeader.tsx (Zeile 240: `.catch()` ohne Promise)
- Mehrfache/doppelte "AIDEVELO.AI" Texte sichtbar
- Debug-Code (rotes Rechteck) noch aktiv
- Schnur-Physik muss verbessert werden

## Lösung

### 1. P5AnimatedHeader.tsx komplett neu schreiben

**Datei: `components/P5AnimatedHeader.tsx`**

Korrekte CDN-Implementierung ohne Syntax-Fehler:

```typescript
// script.onload statt import/Promise
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
script.onload = () => {
  // p5.js sketch hier
};
document.head.appendChild(script);
```

**Wichtige Fixes:**

- Entferne `.catch()` Syntax Error (Zeile 240)
- Entferne Debug-Rechteck (Zeilen 357-361)
- Entferne `console.log` (Zeile 325)
- Verbessere Schnur-Physik mit realistischer Gravitation und Dämpfung

**Physik-Verbesserungen:**

```typescript
// Realistische Werte
this.gravity = p.createVector(0, 0.6); // Stärkere Gravitation
this.stiffness = 0.12; // Weichere Feder
this.damping = 0.94; // Mehr Dämpfung für realistisches Schwingen
this.pullThreshold = this.restLength * 1.8; // Längerer Zug nötig
```

### 2. Header.tsx überprüfen

**Datei: `components/layout/Header.tsx`**

Sicherstellen dass:

- NUR `<P5AnimatedHeader>` gerendert wird
- KEINE zusätzlichen Logo-Elemente
- Navigation als Overlay (keine Logo-Duplikate)

### 3. Hero.tsx anpassen

**Datei: `components/Hero.tsx`**

- `pt-[350px]` beibehalten für korrekten Abstand zum Header
- Sicherstellen dass KEIN Logo im Hero ist

### 4. Alle anderen Logo-Referenzen entfernen

Suchen und entfernen in:

- `components/layout/Footer.tsx` - Kein Logo
- `public/veloa-logo.png` - Löschen falls existiert
- `public/aidevelo-logo.png` - Behalten für spätere Verwendung

### 5. Visual Test

Nach den Fixes:

- Screenshot nehmen mit `node screenshot.js`
- Visual Check durchführen
- Verifizieren: NUR eine Canvas, KEIN doppelter Text
- Schnur-Physik testen (Pull-Down für Theme Toggle)

## Kern-Änderungen

### P5AnimatedHeader.tsx - Komplette Neuschreibung

```typescript
'use client';

export default function P5AnimatedHeader({ className = '' }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
    
    script.onload = () => {
      const sketch = (p: any) => {
        // Nur ein "AIDEVELO.AI" Text in der Canvas
        // Physikalisch korrekte Schnur mit PullCord Klasse
        // Keine Debug-Elemente
        // Realistische Gravitation und Dämpfung
      };
      
      p5InstanceRef.current = new (window as any).p5(sketch, containerRef.current);
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (p5InstanceRef.current) p5InstanceRef.current.remove();
    };
  }, [theme, toggleTheme]);
  
  return <div ref={containerRef} className={className} />;
}
```

## Erfolgs-Kriterien

- Keine Syntax-Errors im Terminal
- NUR eine Canvas mit "AIDEVELO.AI"
- KEINE doppelten Texte
- Schnur schwingt physikalisch korrekt
- Pull-Down (>150px) togglet Theme
- Smooth Animationen
- Keine Debug-Elemente sichtbar

### To-dos

- [ ] Install react-spring for physics-based animations
- [ ] Create ThemeContext with localStorage persistence and useTheme hook
- [ ] Build InteractiveLogo component with drag interaction, pull cord, and physics animations
- [ ] Refactor Header to center large AIDEVELO.AI logo and prepare for dropdown menu
- [ ] Update globals.css with theme CSS variables and animation keyframes
- [ ] Wrap app with ThemeProvider in layout.tsx
- [ ] Add theme support to Hero, PricingTable, and Footer components
- [ ] Copy new AIDEVELO.AI logo to public directory
- [ ] Test pull cord physics, theme toggle, and animations across devices