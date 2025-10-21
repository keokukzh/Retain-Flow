import { NextRequest, NextResponse } from 'next/server';
import templatesData from '@/templates/landing-pages.json';

export async function generateStaticParams() {
  return templatesData.templates.map((template) => ({
    id: template.id,
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id;

    const template = templatesData.templates.find(
      t => t.id === templateId
    );

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    // console.error('Error getting template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
