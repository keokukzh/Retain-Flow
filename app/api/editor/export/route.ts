import { NextRequest, NextResponse } from 'next/server';
import { EditorService } from '@/services/editor.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html, css, format, componentName } = body;

    // Validate required fields
    if (!html || !css || !format) {
      return NextResponse.json(
        { error: 'Missing required fields: html, css, format' },
        { status: 400 }
      );
    }

    let exportData: any = {};

    switch (format) {
      case 'html':
        exportData = {
          html,
          css,
          fullHtml: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RetainFlow Export</title>
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
</body>
</html>`,
        };
        break;

      case 'jsx':
        const jsxComponent = EditorService.exportToJSX(
          html,
          css,
          componentName || 'CustomComponent'
        );
        exportData = {
          jsx: jsxComponent,
          componentName: componentName || 'CustomComponent',
        };
        break;

      case 'css':
        exportData = {
          css,
        };
        break;

      case 'json':
        exportData = {
          html,
          css,
          metadata: {
            exportedAt: new Date().toISOString(),
            format: 'json',
            version: '1.0',
          },
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid format. Supported formats: html, jsx, css, json' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      format,
      data: exportData,
    });
  } catch (error) {
    // console.error('Error exporting editor content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
