# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma plugin that generates type specimen documentation for selected text objects. It extracts typography properties (font family, weight, size, line height, letter spacing, text decoration, text case) and creates a formatted frame displaying these values.

**Key Features:**
- Supports batch processing of up to 25 text objects at once
- Automatically filters non-text objects from selection
- Uses absolute positioning to work correctly with nested frames/sections
- Optional style name preview rendered in the actual font

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
2. `createTypeSpecimen()` filters selection to TEXT nodes only (up to 25 max)
3. Pre-loads all unique fonts for performance optimization
4. Calls `createSpecimenForTextNode()` for each text object
5. If style name provided, creates preview using `createStyleNamePreview()` with actual font properties
6. Plugin creates bordered rows using `createBorderedRow()` helper for Font Family and Weight/Size
7. Creates side-by-side metric cards using `createMetricCard()` for Line Height and Letter Spacing
8. Conditionally adds Decoration/Case row if either property is non-default (using `createMetricsRow()`)
9. Each specimen positioned 20px below its respective text using `absoluteBoundingBox` for accurate placement

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
- **Mixed values**: Shows "Mixed" when text has multiple different values applied to character ranges

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
