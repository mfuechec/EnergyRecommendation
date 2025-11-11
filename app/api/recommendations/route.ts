import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/recommendationEngine';
import { RecommendationRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();

    // Validate request
    if (!body.customer_id) {
      return NextResponse.json(
        { error: 'customer_id is required' },
        { status: 400 }
      );
    }

    // Generate recommendations
    const recommendations = await generateRecommendations(body);

    return NextResponse.json(recommendations);
  } catch (error: any) {
    console.error('Error generating recommendations:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate recommendations',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Method not allowed. Use POST to generate recommendations.',
    },
    { status: 405 }
  );
}
