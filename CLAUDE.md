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
- **ui.html**: Simple UI with Create/Cancel buttons (runs in iframe)

### Core Flow
1. UI sends message to plugin code via `postMessage`
2. `createTypeSpecimen()` extracts properties from selected TextNode
3. Plugin creates auto-layout frames using `createLabelValuePair()` helper
4. Two-row layout: header row (Font Family, Weight) + metrics row (Size, Line Height, Letter Spacing)
5. Specimen positioned 20px below selected text

### Figma API Requirements
- Must call `figma.loadFontAsync()` before accessing/creating text nodes
- Plugin uses Inter font (Regular/Medium) for specimen labels/values
- Frame structure uses auto-layout (`layoutMode: 'VERTICAL'/'HORIZONTAL'`) for responsive sizing

### Unit Conversions
- **Line height**: Converts PIXELS and PERCENT units to percentage relative to font size
- **Letter spacing**: Converts PERCENT units to pixels (PIXELS units used directly)

## Customization Points
All visual styling is in [code.ts](code.ts):
- Colors: `fills` property (lines 68, 143, 151)
- Spacing: `itemSpacing`, padding values (lines 63-67, 77, 96)
- Typography: Font family/sizes for labels (lines 139-142, 146-150)
- Corner radius: Line 69
