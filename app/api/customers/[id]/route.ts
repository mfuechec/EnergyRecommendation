import { NextRequest, NextResponse } from 'next/server';
import { loadEnrichedCustomer } from '@/lib/dataLoader';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await loadEnrichedCustomer(params.id);

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error(`Error loading customer ${params.id}:`, error);

    if (error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Customer not found',
          customer_id: params.id,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to load customer',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
