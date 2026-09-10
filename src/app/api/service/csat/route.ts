import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { DEFAULT_REVIEWS } from './csatSeedData';

export const dynamic = 'force-dynamic';

const createCsatSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  company: z.string().min(1, 'Company is required'),
  rating: z.number().min(1).max(5).default(5),
  agentName: z.string().default('Chris Evans'),
  comment: z.string().min(1, 'Comment is required'),
  tag: z.enum(['Technical', 'Billing', 'Onboarding']).default('Technical'),
});

export async function GET() {
  try {
    const count = await prisma.csatReview.count();
    if (count === 0) {
      for (const item of DEFAULT_REVIEWS) {
        await prisma.csatReview.create({ data: item });
      }
    }

    const reviews = await prisma.csatReview.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const totalCount = reviews.length;
    const avgRating = totalCount > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1) : '4.9';
    const positiveCount = reviews.filter((r) => r.rating >= 4).length;
    const csatPercent = totalCount > 0 ? ((positiveCount / totalCount) * 100).toFixed(1) : '96.5';

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews: totalCount,
        avgRating,
        csatScore: `${csatPercent}%`,
      },
    });
  } catch (error) {
    console.error('CSAT GET error:', error);
    return NextResponse.json({ message: 'Failed to fetch CSAT reviews from database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createCsatSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid feedback input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { customerName, company, rating, agentName, comment, tag } = validation.data;
    const date = new Date().toISOString().split('T')[0];
    const avatar = `/avatars/user${Math.floor(Math.random() * 8) + 1}.jpg`;

    const newReview = await prisma.csatReview.create({
      data: {
        customerName,
        company,
        avatar,
        rating,
        agentName,
        date,
        comment,
        tag,
      },
    });

    return NextResponse.json({ message: 'CSAT review added and saved in database', review: newReview }, { status: 201 });
  } catch (error) {
    console.error('CSAT POST error:', error);
    return NextResponse.json({ message: 'Failed to create CSAT review in database' }, { status: 500 });
  }
}
