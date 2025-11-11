import { NextResponse } from 'next/server';
import { loadCustomerList } from '@/lib/dataLoader';

export async function GET() {
  try {
    const customers = await loadCustomerList();

    return NextResponse.json({
      customers,
      count: customers.length,
    });
  } catch (error: any) {
    console.error('Error loading customer list:', error);

    return NextResponse.json(
      {
        error: 'Failed to load customer list',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
