// Maximum number of text objects that can be processed in a single batch to prevent performance issues
const MAX_BATCH_SIZE = 25;

// Helper function to create Type icon from Lucide (simplified version)
async function createTypeIcon(size: number = 12, color: RGB = { r: 0.102, g: 0.102, b: 0.102 }): Promise<FrameNode> {
  const iconFrame = figma.createFrame();
  iconFrame.name = 'Type Icon';
  iconFrame.resize(size, size);
  iconFrame.fills = [];
  iconFrame.clipsContent = false;

  // Scale factor to fit the icon from 24x24 to desired size
  const scale = size / 24;
  const strokeWidth = 2 * scale;

  // Path 1: Vertical line (M12 4v16)
  const verticalLine = figma.createVector();
  await verticalLine.setVectorNetworkAsync({
    vertices: [
      { x: 12 * scale, y: 4 * scale },
      { x: 12 * scale, y: 20 * scale }
    ],
    segments: [
      { start: 0, end: 1, tangentStart: { x: 0, y: 0 }, tangentEnd: { x: 0, y: 0 } }
    ],
    regions: []
  });
  verticalLine.strokes = [{ type: 'SOLID', color: color }];
  verticalLine.strokeWeight = strokeWidth;
  verticalLine.strokeCap = 'ROUND';
  iconFrame.appendChild(verticalLine);

  // Path 2: Top serif (M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2)
  const topSerif = figma.createVector();
  await topSerif.setVectorNetworkAsync({
    vertices: [
      { x: 4 * scale, y: 7 * scale },
      { x: 4 * scale, y: 5 * scale },
      { x: 5 * scale, y: 4 * scale },
      { x: 19 * scale, y: 4 * scale },
      { x: 20 * scale, y: 5 * scale },
      { x: 20 * scale, y: 7 * scale }
    ],
    segments: [
      { start: 0, end: 1, tangentStart: { x: 0, y: 0 }, tangentEnd: { x: 0, y: 0 } },
      { start: 1, end: 2, tangentStart: { x: 0, y: 0 }, tangentEnd: { x: 0, y: 0 } },
      { start: 2, end: 3, tangentStart: { x: 0, y: 0 }, tangentEnd: { x: 0, y: 0 } },
      { start: 3, end: 4, tangentStart: { x: 0, y: 0 }, tangentEnd: { x: 0, y: 0 } },
      { start: 4, end: 5, tangentStart: { x: 0, y: 0 }, tangentEnd: { x: 0, y: 0 } }
    ],
    regions: []
  });
  topSerif.strokes = [{ type: 'SOLID', color: color }];
  topSerif.strokeWeight = strokeWidth;
  topSerif.strokeCap = 'ROUND';
  topSerif.strokeJoin = 'ROUND';
  iconFrame.appendChild(topSerif);

  // Path 3: Bottom line (M9 20h6)
  const bottomLine = figma.createVector();
  await bottomLine.setVectorNetworkAsync({
    vertices: [
      { x: 9 * scale, y: 20 * scale },
      { x: 15 * scale, y: 20 * scale }
    ],
    segments: [
      { start: 0, end: 1, tangentStart: { x: 0, y: 0 }, tangentEnd: { x: 0, y: 0 } }
    ],
    regions: []
  });
  bottomLine.strokes = [{ type: 'SOLID', color: color }];
  bottomLine.strokeWeight = strokeWidth;
  bottomLine.strokeCap = 'ROUND';
  iconFrame.appendChild(bottomLine);

  return iconFrame;
}

// Helper function to create a frame containing Type icon + text
async function createIconTextPair(text: string, fontSize: number = 11, fontWeight: 'Regular' | 'Medium' = 'Regular'): Promise<FrameNode> {
  const container = figma.createFrame();
  container.layoutMode = 'HORIZONTAL';
  container.primaryAxisSizingMode = 'AUTO';
  container.counterAxisSizingMode = 'AUTO';
  container.itemSpacing = 4;
  container.fills = [];

  // Create and add the Type icon
  const icon = await createTypeIcon(12);
  container.appendChild(icon);

  // Create and add the text
  const textNode = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: fontWeight });
  textNode.fontName = { family: 'Inter', style: fontWeight };
  textNode.fontSize = fontSize;
  textNode.characters = text;
  textNode.fills = [{ type: 'SOLID', color: { r: 0.102, g: 0.102, b: 0.102 } }];
  container.appendChild(textNode);

  return container;
}

// Show UI for potential future options
figma.showUI(__html__, { width: 300, height: 240 });

// Listen for the create specimen command from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-specimen') {
    await createTypeSpecimen(msg.styleName);
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

async function createTypeSpecimen(styleName?: string) {
  const selection = figma.currentPage.selection;

  // Check if any nodes are selected
  if (selection.length === 0) {
    figma.notify('Please select one or more text objects');
    return;
  }

  // Filter selection to only TEXT nodes
  const textNodes = selection.filter(node => node.type === 'TEXT') as TextNode[];

  // Check if any text nodes were found
  if (textNodes.length === 0) {
    figma.notify('No text objects selected. Please select at least one text object.');
    return;
  }

  // Check if selection exceeds the maximum batch size
  if (textNodes.length > MAX_BATCH_SIZE) {
    figma.notify(`Selection exceeds limit of ${MAX_BATCH_SIZE} text objects. Please select fewer items.`);
    return;
  }

  // Pre-load all unique fonts to optimize performance
  const uniqueFonts = new Set<string>();
  for (const textNode of textNodes) {
    const fontName = textNode.fontName as FontName;
    const fontKey = `${fontName.family}-${fontName.style}`;
    if (!uniqueFonts.has(fontKey)) {
      uniqueFonts.add(fontKey);
      await figma.loadFontAsync(fontName);
    }
  }

  // Create specimens for all text nodes
  const createdSpecimens: FrameNode[] = [];
  for (const textNode of textNodes) {
    const specimen = await createSpecimenForTextNode(textNode, styleName);
    createdSpecimens.push(specimen);
  }

  // Select all created specimens
  figma.currentPage.selection = createdSpecimens;
  figma.viewport.scrollAndZoomIntoView(createdSpecimens);

  // Show success message
  const skippedCount = selection.length - textNodes.length;
  if (skippedCount > 0) {
    figma.notify(`Created ${textNodes.length} specimen(s) (${skippedCount} non-text object(s) skipped)`);
  } else {
    figma.notify(`Created ${textNodes.length} type specimen(s) successfully!`);
  }

  figma.closePlugin();
}

// Helper function to create a specimen for a single text node
async function createSpecimenForTextNode(textNode: TextNode, styleName?: string): Promise<FrameNode> {
  // Extract text properties
  const fontName = textNode.fontName as FontName;
  const fontSize = textNode.fontSize as number;
  const lineHeight = textNode.lineHeight;
  const letterSpacing = textNode.letterSpacing;

  // Calculate line height percentage
  let lineHeightText = 'Auto';
  if (typeof lineHeight !== 'symbol' && lineHeight.unit === 'PIXELS') {
    const percentage = Math.round((lineHeight.value / fontSize) * 100);
    lineHeightText = `${percentage}%`;
  } else if (typeof lineHeight !== 'symbol' && lineHeight.unit === 'PERCENT') {
    lineHeightText = `${Math.round(lineHeight.value)}%`;
  }

  // Calculate letter spacing value
  let letterSpacingText = '0';
  if (typeof letterSpacing !== 'symbol' && letterSpacing.unit === 'PIXELS') {
    letterSpacingText = letterSpacing.value.toFixed(2);
  } else if (typeof letterSpacing !== 'symbol' && letterSpacing.unit === 'PERCENT') {
    letterSpacingText = (letterSpacing.value / 100 * fontSize).toFixed(2);
  }

  // Extract text decoration
  const textDecoration = textNode.textDecoration;
  let decorationText: string | null = null;
  if (typeof textDecoration !== 'symbol' && textDecoration !== 'NONE') {
    decorationText = textDecoration === 'UNDERLINE' ? 'Underline' : 'Strikethrough';
  } else if (typeof textDecoration === 'symbol') {
    decorationText = 'Mixed';
  }

  // Extract text case
  const textCase = textNode.textCase;
  let caseText: string | null = null;
  if (typeof textCase !== 'symbol' && textCase !== 'ORIGINAL') {
    const caseMap: { [key: string]: string } = {
      'UPPER': 'Uppercase',
      'LOWER': 'Lowercase',
      'TITLE': 'Title Case',
      'SMALL_CAPS': 'Small Caps',
      'SMALL_CAPS_FORCED': 'Small Caps Forced'
    };
    caseText = caseMap[textCase] || textCase;
  } else if (typeof textCase === 'symbol') {
    caseText = 'Mixed';
  }

  // Create the specimen frame
  const specimenFrame = figma.createFrame();
  specimenFrame.name = 'Type Specimen';
  specimenFrame.resize(280, 100); // Set initial size
  specimenFrame.layoutMode = 'VERTICAL';
  specimenFrame.primaryAxisSizingMode = 'AUTO'; // Height hugs contents
  specimenFrame.counterAxisSizingMode = 'FIXED'; // Width fixed at 280
  specimenFrame.itemSpacing = 8;
  specimenFrame.paddingLeft = 16;
  specimenFrame.paddingRight = 16;
  specimenFrame.paddingTop = 16;
  specimenFrame.paddingBottom = 16;
  specimenFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  specimenFrame.cornerRadius = 8;
  specimenFrame.strokes = [{ type: 'SOLID', color: { r: 0.902, g: 0.902, b: 0.902 } }];
  specimenFrame.strokeWeight = 1;

  // Add style name preview if provided
  if (styleName && styleName.length > 0) {
    const stylePreview = await createStyleNamePreview(
      styleName,
      fontName,
      fontSize,
      typeof lineHeight === 'symbol' ? { unit: 'AUTO' } : lineHeight,
      typeof letterSpacing === 'symbol' ? { unit: 'PIXELS', value: 0 } : letterSpacing
    );
    specimenFrame.appendChild(stylePreview);
  }

  // Row 1: Font Family only
  const row1 = await createBorderedRow('Font Family', fontName.family, null, null, true);
  specimenFrame.appendChild(row1);

  // Row 2: Weight and Size
  const row2 = await createBorderedRow('Weight', fontName.style, null, `${fontSize}`, true);
  specimenFrame.appendChild(row2);

  // Row 3: Line Height and Letter Spacing
  const row3 = await createMetricsRow('Line height', lineHeightText, 'Letter spacing', letterSpacingText);
  specimenFrame.appendChild(row3);

  // Row 4: Decoration and Case (only if at least one exists)
  if (decorationText !== null || caseText !== null) {
    const row4 = await createMetricsRow(
      'Decoration',
      decorationText || '-',
      'Case',
      caseText || '-'
    );
    specimenFrame.appendChild(row4);
  }

  // Position the specimen frame using absolute coordinates (fixes positioning in nested frames)
  const bounds = textNode.absoluteBoundingBox;
  if (bounds) {
    specimenFrame.x = bounds.x;
    specimenFrame.y = bounds.y + bounds.height + 20;
  } else {
    // Fallback to relative positioning if absoluteBoundingBox is not available
    specimenFrame.x = textNode.x;
    specimenFrame.y = textNode.y + textNode.height + 20;
  }

  // Add to the current page
  figma.currentPage.appendChild(specimenFrame);

  return specimenFrame;
}

async function createStyleNamePreview(
  styleName: string,
  fontName: FontName,
  fontSize: number,
  lineHeight: LineHeight,
  letterSpacing: LetterSpacing
): Promise<FrameNode> {
  const previewContainer = figma.createFrame();
  previewContainer.name = 'Style Preview';
  previewContainer.resize(248, 100); // Set initial size
  previewContainer.layoutMode = 'VERTICAL';
  previewContainer.primaryAxisSizingMode = 'AUTO'; // Hug content vertically
  previewContainer.counterAxisSizingMode = 'AUTO';
  previewContainer.itemSpacing = 8;
  previewContainer.fills = [];

  // Create the text node with the actual font properties
  const previewText = figma.createText();
  await figma.loadFontAsync(fontName);

  previewText.fontName = fontName;
  previewText.fontSize = fontSize;
  previewText.characters = styleName;
  previewText.fills = [{ type: 'SOLID', color: { r: 0.102, g: 0.102, b: 0.102 } }];

  // Apply line height
  if (typeof lineHeight !== 'symbol') {
    previewText.lineHeight = lineHeight;
  }

  // Apply letter spacing
  if (typeof letterSpacing !== 'symbol') {
    previewText.letterSpacing = letterSpacing;
  }

  previewContainer.appendChild(previewText);

  return previewContainer;
}

async function createBorderedRow(label: string, value: string, rightLabel: string | null, rightValue: string | null, useIcon: boolean = true): Promise<FrameNode> {
  const row = figma.createFrame();
  row.resize(248, 32); // Set initial size
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'AUTO';
  row.itemSpacing = 8;
  row.paddingLeft = 12;
  row.paddingRight = 12;
  row.paddingTop = 8;
  row.paddingBottom = 8;
  row.fills = [];
  row.strokes = [{ type: 'SOLID', color: { r: 0.902, g: 0.902, b: 0.902 } }];
  row.strokeWeight = 1;
  row.strokeAlign = 'INSIDE';
  row.cornerRadius = 4;

  // Left side with icon
  if (useIcon) {
    const leftContainer = await createIconTextPair(`${label}/${value}`, 11, 'Regular');
    row.appendChild(leftContainer);
  } else {
    const leftText = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    leftText.fontName = { family: 'Inter', style: 'Regular' };
    leftText.fontSize = 11;
    leftText.characters = `${label}/${value}`;
    leftText.fills = [{ type: 'SOLID', color: { r: 0.102, g: 0.102, b: 0.102 } }];
    row.appendChild(leftText);
  }

  // Spacer
  const spacer = figma.createFrame();
  spacer.layoutMode = 'HORIZONTAL';
  spacer.primaryAxisSizingMode = 'FIXED';
  spacer.counterAxisSizingMode = 'FIXED';
  spacer.resize(1, 1);
  spacer.fills = [];
  spacer.layoutGrow = 1;
  row.appendChild(spacer);

  // Right side (if provided)
  if (rightValue !== null) {
    const rightText = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    rightText.fontName = { family: 'Inter', style: 'Regular' };
    rightText.fontSize = 11;
    rightText.characters = rightValue;
    rightText.fills = [{ type: 'SOLID', color: { r: 0.102, g: 0.102, b: 0.102 } }];
    row.appendChild(rightText);
  }

  return row;
}

async function createMetricCard(label: string, value: string): Promise<FrameNode> {
  const card = figma.createFrame();
  card.resize(120, 45); // Set initial size
  card.layoutMode = 'VERTICAL';
  card.primaryAxisSizingMode = 'FIXED';
  card.counterAxisSizingMode = 'AUTO';
  card.itemSpacing = 4;
  card.paddingLeft = 12;
  card.paddingRight = 12;
  card.paddingTop = 8;
  card.paddingBottom = 8;
  card.fills = [];
  card.strokes = [{ type: 'SOLID', color: { r: 0.902, g: 0.902, b: 0.902 } }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';
  card.cornerRadius = 4;

  // Label text
  const labelText = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  labelText.fontName = { family: 'Inter', style: 'Regular' };
  labelText.fontSize = 10;
  labelText.characters = label;
  labelText.fills = [{ type: 'SOLID', color: { r: 0.502, g: 0.502, b: 0.502 } }];
  card.appendChild(labelText);

  // Value with icon
  const valueContainer = await createIconTextPair(value, 11, 'Medium');
  card.appendChild(valueContainer);

  return card;
}

async function createMetricsRow(leftLabel: string, leftValue: string, rightLabel: string, rightValue: string): Promise<FrameNode> {
  const row = figma.createFrame();
  row.resize(248, 45); // Set initial size
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'AUTO';
  row.itemSpacing = 8;
  row.fills = [];

  // Left card
  const leftCard = await createMetricCard(leftLabel, leftValue);
  row.appendChild(leftCard);

  // Right card
  const rightCard = await createMetricCard(rightLabel, rightValue);
  row.appendChild(rightCard);

  return row;
}
