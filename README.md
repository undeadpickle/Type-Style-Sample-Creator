# Type Style Sample Creator - Figma Plugin

A Figma plugin that automatically generates formatted type style sample documentation for selected text objects. Perfect for design systems and typography documentation.

## Features

- **Batch Processing**: Create specimens for up to 25 text objects at once
- **Smart Selection**: Automatically filters and processes only text objects
- **Accurate Positioning**: Works correctly with text in frames, sections, and groups
- Extract and display all typography properties from selected text
- Shows: Font Family, Weight, Size, Line Height, and Letter Spacing
- Optional style name preview rendered in the actual font
- Clean, formatted layout with auto-layout frames
- Automatically positioned 20px below each selected text

## Installation

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Build the plugin:
```bash
npm run build
```

3. In Figma:
   - Go to `Plugins` → `Development` → `Import plugin from manifest...`
   - Select the `manifest.json` file from this project
   - The plugin will now appear in your `Plugins` menu as "Type Style Sample Creator"

### Watch Mode (for development)

To automatically rebuild when you make changes:
```bash
npm run watch
```

## Usage

1. **Select one or more text objects** in your Figma file (up to 25 at once)
2. Run the plugin: `Plugins` → `Development` → `Type Style Sample Creator`
3. **(Optional)** Enter a style name (e.g., "H1", "Body Small") to preview the text in the actual font
   - The style name will be applied to all selected text objects
4. Click the **Create** button in the plugin window
5. Formatted type style samples will be generated for each text object showing:
   - Style name preview (if provided) rendered in the actual font
   - Font Family and Weight
   - Font Size
   - Line Height (as percentage)
   - Letter Spacing (in pixels)

**Batch Processing Notes:**
- Select up to 25 text objects for batch creation
- Non-text objects in your selection are automatically skipped
- Each specimen is positioned 20px below its respective text
- Works correctly with text inside frames, sections, and groups

## Type Style Sample Layout

The generated sample includes:

```
┌─────────────────────────────────────┐
│  [Style Name Preview]                │
│  ─────────────────────────────────   │
│  📝 Font Family/[Family]             │
│  📝 Weight/[Style]          [Size]   │
│                                       │
│  ┌─────────────┐  ┌─────────────┐   │
│  │ Line height │  │ Letter      │   │
│  │ 📝 [%]      │  │ spacing     │   │
│  └─────────────┘  │ 📝 [px]     │   │
│                   └─────────────┘   │
└─────────────────────────────────────┘
```

## Customization

You can modify the appearance in [code.ts](code.ts):

- **Colors**: Change the `fills` property in `specimenFrame` and text nodes
- **Spacing**: Adjust `itemSpacing` and padding values
- **Font**: Update the `fontName` used for labels and values
- **Corner Radius**: Modify `cornerRadius` for the sample frame

## Requirements

- Figma Desktop App or Browser
- The "Inter" font family (used for sample labels)

## Technical Details

- Built with TypeScript
- Uses Figma Plugin API
- Auto-layout frames for responsive design
- Supports all font weights and styles

## License

MIT
# Type-Style-Sample-Creator
