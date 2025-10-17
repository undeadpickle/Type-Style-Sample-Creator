# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma plugin that generates type specimen documentation for selected text objects. It extracts typography properties (font family, weight, size, line height, letter spacing, text decoration, text case, color) and creates a formatted frame displaying these values.

**Key Features:**
- Supports batch processing of up to 25 text objects at once
- Automatically filters non-text objects from selection
- Uses absolute positioning to work correctly with nested frames/sections
- Optional preview text rendered with exact text properties (color, decoration, case)
- Optional color display with hex, RGB, and color swatch
- Responsive UI that auto-resizes based on content

## Build Commands

- **Install dependencies**: `npm install`
- **Build plugin**: `npm run build` (compiles TypeScript to JavaScript)
- **Watch mode**: `npm run watch` (auto-rebuild on file changes)

## Architecture

### Entry Points
- **code.ts**: Main plugin logic (runs in Figma's sandbox environment)
- **ui.html**: UI with preview text input, color checkbox, and Create/Cancel buttons (runs in iframe)

### Core Flow
1. UI sends message with optional preview text and showColor flag to plugin code via `postMessage`
2. UI auto-resizes based on content height using `figma.ui.resize()`
3. `createTypeSpecimen()` filters selection to TEXT nodes only (up to 25 max)
4. Pre-loads all unique fonts for performance optimization
5. Calls `createSpecimenForTextNode()` for each text object
6. If preview text provided, creates preview using `createStyleNamePreview()` with exact text properties (color, decoration, case)
7. Plugin creates bordered rows using `createBorderedRow()` helper for Font Family and Weight/Size
8. Creates side-by-side metric cards using `createMetricCard()` for Line Height and Letter Spacing
9. Conditionally adds Decoration/Case row if either property is non-default (using `createMetricsRow()`)
10. Conditionally adds Color row if showColor enabled (using `createColorRow()` with hex, RGB, and swatch)
11. Each specimen positioned 20px below its respective text using `absoluteBoundingBox` for accurate placement

### Figma API Requirements
- Must call `figma.loadFontAsync()` before accessing/creating text nodes
- Plugin uses Inter font (Regular/Medium) for specimen labels/values
- Frame structure uses auto-layout (`layoutMode: 'VERTICAL'/'HORIZONTAL'`)
- Specimen frame: Fixed width (280px), auto height (hugs contents)
- Child containers: Fixed width (248px), auto height

### Unit Conversions
- **Line height**: Converts PIXELS and PERCENT units to percentage relative to font size
- **Letter spacing**: Converts PERCENT units to pixels (PIXELS units used directly)

### Text Properties
- **Text decoration**: Displays "Underline" or "Strikethrough" when applied, hidden when "NONE"
- **Text case**: Displays transformation (Uppercase, Lowercase, Title Case, Small Caps) when applied, hidden when "ORIGINAL"
- **Text color**: Extracts first solid fill, displays as hex (#RRGGBB) and RGB(r, g, b) with color swatch (16×16px, 2px corner radius)
- **Mixed values**: Shows "Mixed" when text has multiple different values applied to character ranges
- **Preview text**: Applies all properties from original text (color, decoration, case) for accurate representation

## UI Features
- **Responsive height**: Automatically resizes based on content using `figma.ui.resize()`
- **Preview text input**: Optional text field to show sample with actual font properties
- **Show color values checkbox**: Toggle to include/exclude color information
- **Color scheme**: Purple theme (#5E00FF) for primary actions
- **Button states**: Disables all controls during specimen creation to prevent duplicate requests

## Batch Processing
- **Maximum batch size**: 25 text objects (defined as `MAX_BATCH_SIZE` constant)
- **Font optimization**: Pre-loads all unique fonts once before processing
- **Auto-filtering**: Non-text objects in selection are automatically skipped
- **Positioning**: Uses `absoluteBoundingBox` to correctly position specimens for text in nested frames/sections
- **Feedback**: Clear messages show count of created specimens and skipped objects

## Customization Points
All visual styling is in [code.ts](code.ts):
- **Batch limit**: Line 2 (`MAX_BATCH_SIZE = 25`)
- **Specimen frame width**: Line 201 (`resize(280, ...)`)
- **Colors**: `fills` property throughout
- **Spacing**: `itemSpacing` (8px between rows), padding (16px frame, 12px rows)
- **Typography**: Inter font for labels (Regular 10-11px) and values (Medium 11px)
- **Corner radius**: 8px for specimen frame, 4px for bordered containers
- **Metric card width**: 120px each (split 248px content width)
- **Positioning offset**: Line 243 (20px below text)
