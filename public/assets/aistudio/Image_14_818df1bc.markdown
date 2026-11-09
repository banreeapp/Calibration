---
name: Clinical Precision Interface
colors:
  surface: '#0e1515'
  surface-dim: '#0e1515'
  surface-bright: '#333b3a'
  surface-container-lowest: '#090f0f'
  surface-container-low: '#161d1d'
  surface-container: '#1a2121'
  surface-container-high: '#242b2b'
  surface-container-highest: '#2f3636'
  on-surface: '#dde4e3'
  on-surface-variant: '#bac9c9'
  inverse-surface: '#dde4e3'
  inverse-on-surface: '#2b3232'
  outline: '#859493'
  outline-variant: '#3b4949'
  surface-tint: '#2ddbde'
  primary: '#47eaed'
  on-primary: '#003738'
  primary-container: '#00ced1'
  on-primary-container: '#005354'
  inverse-primary: '#00696b'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#a4dcff'
  on-tertiary: '#00354a'
  tertiary-container: '#4bc5ff'
  on-tertiary-container: '#004f6d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#5af8fb'
  primary-fixed-dim: '#2ddbde'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f51'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#0e1515'
  on-background: '#dde4e3'
  surface-variant: '#2f3636'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  status-number:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar_width: 260px
  sidebar_collapsed: 80px
  container_padding: 2rem
  gutter: 1.5rem
  stack_sm: 0.5rem
  stack_md: 1rem
---

## Brand & Style

The design system is engineered for high-stakes medical environments where clarity, precision, and trust are paramount. The aesthetic merges **Glassmorphism** with a "Medical-Tech" discipline, creating an interface that feels advanced yet surgically clean.

The brand personality is authoritative and meticulous. By utilizing translucent layers and frosted glass effects, the system minimizes visual noise while maintaining a sense of depth and hierarchy. The target audience—biomedical engineers and lab managers—requires a "heads-up display" (HUD) feel that prioritizes data density without sacrificing legibility. 

The emotional response should be one of "Tech-Enabled Reliability," where the software feels like a sophisticated digital extension of the physical medical instruments it manages.

## Colors

The primary palette centers on **Blue-Teal**, specifically a "Medical Clean" spectrum that communicates sterility and high technology.

- **Primary:** A vibrant Cyan/Teal (#00CED1) used for primary actions and active states, providing a high-contrast focal point against dark backgrounds.
- **Surface:** Deep Navy and Slate (#0F172A) form the base of the "Tech Style" dark mode, providing a stable foundation for translucent overlays.
- **Semantic Status:** High-saturation indicators are used for calibration states:
  - **Normal (Green):** Safe, calibrated status.
  - **Due (Yellow):** 60-day warning period.
  - **Expired (Red):** Immediate action required.

In Dark Mode, the background uses a near-black "Void" (#020617) to allow glass surfaces to pop with subtle white inner glows.

## Typography

This design system utilizes a tiered sans-serif approach to balance modern aesthetics with technical utility.

- **Headlines (Manrope):** Chosen for its refined, geometric properties. It provides a modern, balanced look for dashboard titles and section headers.
- **Body (Inter):** The workhorse for data-heavy views. Its high x-height and systematic spacing ensure readability for calibration logs and device specifications.
- **Technical Labels (JetBrains Mono):** Used for serial numbers, timestamps, and status codes. The monospaced nature emphasizes the "tech" aesthetic and ensures numerical alignment in tables.

Scale is strictly managed to ensure high information density remains accessible.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a specific focus on the **Collapsible Sidebar** for navigational efficiency.

- **Sidebar:** Fixed left navigation. On desktop, it defaults to 260px. When collapsed, it reduces to 80px, displaying only Font Awesome icons.
- **Grid:** A 12-column layout with 24px (1.5rem) gutters. 
- **Content Areas:** Content is housed in "Glass Panels." Margins are generous (32px) to prevent the glass effects from feeling cluttered.
- **Breakpoints:**
  - **Desktop (1440px+):** Full dashboard with persistent expanded sidebar.
  - **Tablet (768px - 1439px):** Sidebar automatically collapses; 2-column card layout.
  - **Mobile (Below 768px):** Sidebar becomes a bottom-nav or hamburger drawer; single-column vertical stack.

## Elevation & Depth

Depth is achieved through **Glassmorphism** rather than traditional shadows. This creates a "layered crystal" effect.

- **Base Layer:** Solid dark background (#020617).
- **Surface Layer:** 40% opacity secondary color with a 20px `backdrop-filter: blur()`.
- **Borders:** 1px solid borders with 15% white opacity simulate the edge of a glass pane.
- **Glows:** Primary-colored subtle outer glows (spread 10px, opacity 5%) are used exclusively for active or "In-Calibration" cards to draw the eye.
- **Z-Index Strategy:** Higher elevation elements (like modals) increase their backdrop blur to 40px and background opacity to 60% to effectively dim the content beneath.

## Shapes

The shape language uses **Rounded (0.5rem)** corners to soften the technical nature of the data, making the system feel more modern and user-friendly.

- **Standard Components:** Buttons and input fields use a 0.5rem radius.
- **Dashboard Cards:** Use `rounded-lg` (1rem) to create clear containment for glass effects.
- **Status Pills:** Use fully rounded (pill-shaped) ends to differentiate them from interactive buttons.
- **Sidebar Selection:** A vertical "pill" indicator marks the active page, situated on the far left of the sidebar menu item.

## Components

- **Glass Cards:** The primary container. Features a translucent background, 1px subtle white border, and internal padding of 1.5rem.
- **Action Buttons:**
    - *Primary:* Solid Teal (#00CED1) with black text for maximum visibility.
    - *Secondary:* Ghost style with 1px Teal border and blurred background.
- **Status Indicators:** High-contrast badges. `Status: Expired` uses a heavy Red (#EF4444) text with a 10% red background tint and a pulsing 2px dot.
- **Input Fields:** Darker, semi-transparent fills with "active" states signaled by a Teal bottom-border glow.
- **Calibration Progress Bar:** A thin, sleek bar using a gradient from Primary to Tertiary colors, housed in a recessed track.
- **Icons:** Font Awesome "Light" or "Duotone" weight to maintain the sophisticated, airy medical-tech look.
- **Data Tables:** Zebra striping using subtle opacity shifts (5% vs 8%) instead of solid colors to maintain the glass aesthetic.