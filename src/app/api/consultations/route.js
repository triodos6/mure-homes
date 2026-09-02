import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(request) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(1000, Math.max(1, parseInt(limitParam, 10))) : undefined;

    const consultations = await prisma.consultation.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      ...(limit ? { take: limit } : {}),
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        address: true,
        city: true,
        state: true,
        pinCode: true,
        items: true,
        totalPrice: true,
        currency: true,
        locale: true,
        market: true,
        status: true,
        invoiceUrl: true,
        invoiceShared: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(consultations, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Consultation Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}
