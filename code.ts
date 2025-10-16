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
figma.showUI(__html__, { width: 300, height: 200 });

// Listen for the create specimen command from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-specimen') {
    await createTypeSpecimen();
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

async function createTypeSpecimen() {
  const selection = figma.currentPage.selection;

  // Check if a text node is selected
  if (selection.length === 0) {
    figma.notify('Please select a text object');
    return;
  }

  const node = selection[0];

  if (node.type !== 'TEXT') {
    figma.notify('Please select a text object');
    return;
  }

  const textNode = node as TextNode;

  // Load the font to access text properties
  await figma.loadFontAsync(textNode.fontName as FontName);

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

  // Create the specimen frame
  const specimenFrame = figma.createFrame();
  specimenFrame.name = 'Type Specimen';
  specimenFrame.layoutMode = 'VERTICAL';
  specimenFrame.primaryAxisSizingMode = 'AUTO';
  specimenFrame.counterAxisSizingMode = 'AUTO';
  specimenFrame.itemSpacing = 8;
  specimenFrame.paddingLeft = 16;
  specimenFrame.paddingRight = 16;
  specimenFrame.paddingTop = 16;
  specimenFrame.paddingBottom = 16;
  specimenFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  specimenFrame.cornerRadius = 8;
  specimenFrame.strokes = [{ type: 'SOLID', color: { r: 0.902, g: 0.902, b: 0.902 } }];
  specimenFrame.strokeWeight = 1;

  // Row 1: Font Family only
  const row1 = await createBorderedRow('Font Family', fontName.family, null, null, true);
  specimenFrame.appendChild(row1);

  // Row 2: Weight and Size
  const row2 = await createBorderedRow('Weight', fontName.style, null, `${fontSize}`, true);
  specimenFrame.appendChild(row2);

  // Row 3: Line Height and Letter Spacing (no border)
  const row3 = await createMetricsRow('Line height', lineHeightText, 'Letter spacing', letterSpacingText);
  specimenFrame.appendChild(row3);

  // Position the specimen frame near the selected text
  specimenFrame.x = textNode.x;
  specimenFrame.y = textNode.y + textNode.height + 20;

  // Add to the current page
  figma.currentPage.appendChild(specimenFrame);

  // Select the new specimen frame
  figma.currentPage.selection = [specimenFrame];
  figma.viewport.scrollAndZoomIntoView([specimenFrame]);

  figma.notify('Type specimen created successfully!');
  figma.closePlugin();
}

async function createBorderedRow(label: string, value: string, rightLabel: string | null, rightValue: string | null, useIcon: boolean = true): Promise<FrameNode> {
  const row = figma.createFrame();
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'AUTO';
  row.resize(240, 32);
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

async function createMetricsRow(leftLabel: string, leftValue: string, rightLabel: string, rightValue: string): Promise<FrameNode> {
  const row = figma.createFrame();
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'AUTO';
  row.resize(240, 48);
  row.itemSpacing = 0;
  row.paddingLeft = 12;
  row.paddingRight = 12;
  row.paddingTop = 8;
  row.paddingBottom = 8;
  row.fills = [];

  // Left column
  const leftCol = figma.createFrame();
  leftCol.layoutMode = 'VERTICAL';
  leftCol.primaryAxisSizingMode = 'AUTO';
  leftCol.counterAxisSizingMode = 'AUTO';
  leftCol.itemSpacing = 4;
  leftCol.fills = [];

  const leftLabelText = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  leftLabelText.fontName = { family: 'Inter', style: 'Regular' };
  leftLabelText.fontSize = 10;
  leftLabelText.characters = leftLabel;
  leftLabelText.fills = [{ type: 'SOLID', color: { r: 0.502, g: 0.502, b: 0.502 } }];
  leftCol.appendChild(leftLabelText);

  const leftValueContainer = await createIconTextPair(leftValue, 11, 'Medium');
  leftCol.appendChild(leftValueContainer);

  row.appendChild(leftCol);

  // Spacer
  const spacer = figma.createFrame();
  spacer.layoutMode = 'HORIZONTAL';
  spacer.primaryAxisSizingMode = 'FIXED';
  spacer.counterAxisSizingMode = 'FIXED';
  spacer.resize(1, 1);
  spacer.fills = [];
  spacer.layoutGrow = 1;
  row.appendChild(spacer);

  // Right column
  const rightCol = figma.createFrame();
  rightCol.layoutMode = 'VERTICAL';
  rightCol.primaryAxisSizingMode = 'AUTO';
  rightCol.counterAxisSizingMode = 'AUTO';
  rightCol.itemSpacing = 4;
  rightCol.fills = [];

  const rightLabelText = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  rightLabelText.fontName = { family: 'Inter', style: 'Regular' };
  rightLabelText.fontSize = 10;
  rightLabelText.characters = rightLabel;
  rightLabelText.fills = [{ type: 'SOLID', color: { r: 0.502, g: 0.502, b: 0.502 } }];
  rightCol.appendChild(rightLabelText);

  const rightValueContainer = await createIconTextPair(rightValue, 11, 'Medium');
  rightCol.appendChild(rightValueContainer);

  row.appendChild(rightCol);

  return row;
}
