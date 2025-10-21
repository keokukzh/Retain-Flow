import { NextRequest, NextResponse } from 'next/server';
import templatesData from '@/templates/landing-pages.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    let templates = templatesData.templates;

    // Filter by category if provided
    if (category) {
      templates = templates.filter(template => 
        template.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Limit results
    templates = templates.slice(0, limit);

    return NextResponse.json({
      success: true,
      templates,
      total: templatesData.templates.length,
    });
  } catch (error) {
    // console.error('Error getting templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
