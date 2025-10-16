# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma plugin that generates type specimen documentation for selected text objects. It extracts typography properties (font family, weight, size, line height, letter spacing) and creates a formatted frame displaying these values.

## Build Commands

- **Install dependencies**: `npm install`
- **Build plugin**: `npm run build` (compiles TypeScript to JavaScript)
- **Watch mode**: `npm run watch` (auto-rebuild on file changes)

## Architecture

### Entry Points
- **code.ts**: Main plugin logic (runs in Figma's sandbox environment)
- **ui.html**: UI with style name input field and Create/Cancel buttons (runs in iframe)

### Core Flow
1. UI sends message with optional style name to plugin code via `postMessage`
2. `createTypeSpecimen()` extracts properties from selected TextNode
3. If style name provided, creates preview using `createStyleNamePreview()` with actual font properties
4. Plugin creates bordered rows using `createBorderedRow()` helper for Font Family and Weight/Size
5. Creates side-by-side metric cards using `createMetricCard()` for Line Height and Letter Spacing
6. Specimen positioned 20px below selected text

### Figma API Requirements
- Must call `figma.loadFontAsync()` before accessing/creating text nodes
- Plugin uses Inter font (Regular/Medium) for specimen labels/values
- Frame structure uses auto-layout (`layoutMode: 'VERTICAL'/'HORIZONTAL'`)
- Specimen frame: Fixed width (280px), auto height (hugs contents)
- Child containers: Fixed width (248px), auto height

### Unit Conversions
- **Line height**: Converts PIXELS and PERCENT units to percentage relative to font size
- **Letter spacing**: Converts PERCENT units to pixels (PIXELS units used directly)

## Customization Points
All visual styling is in [code.ts](code.ts):
- **Specimen frame width**: Line 160 (`resize(280, ...)`)
- **Colors**: `fills` property throughout
- **Spacing**: `itemSpacing` (8px between rows), padding (16px frame, 12px rows)
- **Typography**: Inter font for labels (Regular 10-11px) and values (Medium 11px)
- **Corner radius**: 8px for specimen frame, 4px for bordered containers
- **Metric card width**: 120px each (split 248px content width)
