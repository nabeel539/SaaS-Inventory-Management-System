---
name: StockFlow
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '450'
    lineHeight: '1'
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2.5rem
  container-max: 1440px
  sidebar-width: 240px
---

## Brand & Style

This design system is built on a foundation of high-precision minimalism, drawing inspiration from the technical sophistication of modern developer tools and financial platforms. The visual narrative centers on clarity and "data-as-interface," where the inventory information remains the hero while the UI provides a quiet, professional framework.

The aesthetic utilizes a high-contrast monochromatic base to establish authority, punctuated by surgical applications of semantic color to guide user attention. The emotional response is one of calm control—transforming complex logistical data into a streamlined, actionable experience.

## Colors

The palette is anchored by a "Pure White" surface and "Deep Black" primary actions, creating a crisp, high-contrast environment. 

- **Primary & Neutrals:** We use a refined scale of cool grays (Slate) to define hierarchy without adding visual noise. Backgrounds utilize a subtle off-white to reduce eye strain.
- **Semantic Accents:** Color is used exclusively for utility. **Emerald-500** indicates healthy stock levels and completed syncs. **Amber-500** is reserved for low-stock thresholds. **Rose-500** highlights critical stock-outs or system errors.
- **Interactions:** Hover states move through the neutral scale (e.g., Gray-50 to Gray-100) to maintain a tactile but understated feel.

## Typography

This design system employs a dual-sans approach. **Inter** handles the primary interface and reading tasks due to its exceptional legibility and neutral tone. For technical data points, SKU numbers, and quantities, we use **Geist** to provide a distinct, "developer-tool" precision.

Hierarchy is established through weight and spacing rather than size alone. Large display headings use tight tracking (-0.02em) for a modern, compact appearance. Labels utilize uppercase styling with increased tracking to differentiate them from interactive body text.

## Layout & Spacing

The system follows a strict 4px baseline grid. 

- **Sidebar Navigation:** A fixed 240px sidebar on desktop provides top-level navigation. On mobile, this transitions to a bottom-sheet or a collapsed drawer to maximize content real estate.
- **Content Area:** The main dashboard uses a fluid grid with a maximum width of 1440px. 
- **Margins & Gutters:** Page margins are 24px (lg) on desktop, scaling down to 16px (md) on mobile. 
- **Grouping:** Elements within a card use 'sm' spacing, while cards themselves are separated by 'lg' gaps to emphasize modularity.

## Elevation & Depth

Depth is conveyed through a "Layered Flat" philosophy. We avoid heavy shadows in favor of structural clarity:

1.  **Level 0 (Canvas):** The base background layer (#FAFAFA).
2.  **Level 1 (Cards/Sidebar):** Pure white surfaces (#FFFFFF) with a 1px border (#E2E8F0).
3.  **Level 2 (Overlays/Dropdowns):** Elevated surfaces featuring a "Soft Bloom" shadow (0px 4px 12px rgba(0,0,0,0.05)) to suggest interactivity and focus.

We utilize subtle 1px internal strokes on buttons and cards to provide a "tucked-in" technical appearance typical of high-end SaaS platforms.

## Shapes

The shape language balances professional rigidity with approachable modernity. 

- **Containers:** Large cards and primary layout containers use `rounded-xl` (1.5rem) to create a distinct, contemporary "frame" for data.
- **Interactive Elements:** Buttons, inputs, and selectors use a more precise 0.5rem (base roundedness) to maintain a tool-like feel.
- **Status Indicators:** Use a full pill-shape (9999px) for badges and tags to contrast against the structured rectangular layout.

## Components

- **Primary Buttons:** High-contrast Black background with White text. Includes a subtle top-inner-shadow to create a slightly tactile, "pressed" appearance.
- **Secondary Buttons:** Ghost-style with a 1px Gray-200 border. Transitions to a Gray-50 background on hover.
- **Inventory Cards:** Use `rounded-xl` corners. Headers should be separated by a subtle horizontal rule. Use semantic "Glow Dots" (4px circles with a soft outer blur) next to stock quantities to indicate status.
- **Data Tables:** Minimalist approach with no vertical lines. Row headers use `body-sm` in Semi-bold. Use "Zebras" (alternating row colors) only when data exceeds 15 rows.
- **Inputs:** Clean, 1px bordered fields. Focus states use a 2px Black ring with a 2px offset to ensure high visibility and accessibility.
- **Stock Badges:** Small, uppercase labels with low-opacity semantic backgrounds (e.g., 10% Emerald background with 100% Emerald text) for "In Stock" and "Low Stock" indicators.