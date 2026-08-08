import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createCsatSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  company: z.string().min(1, 'Company is required'),
  rating: z.number().min(1).max(5).default(5),
  agentName: z.string().default('Chris Evans'),
  comment: z.string().min(1, 'Comment is required'),
  tag: z.enum(['Technical', 'Billing', 'Onboarding']).default('Technical'),
});

const DEFAULT_REVIEWS = [
  {
    customerName: 'Marcus Vance',
    company: 'Bright Solutions',
    avatar: '/avatars/user1.jpg',
    rating: 5,
    agentName: 'Chris Evans',
    date: '2026-08-06',
    comment: 'Chris resolved our API rate limit configuration in under 10 minutes. Stellar customer support!',
    tag: 'Technical',
  },
  {
    customerName: 'Sarah Jenkins',
    company: 'GlobalMart Inc.',
    avatar: '/avatars/user2.jpg',
    rating: 5,
    agentName: 'Shirley.H',
    date: '2026-08-05',
    comment: 'Very clear explanation of our enterprise invoice details and tier discounts. Thank you Shirley!',
    tag: 'Billing',
  },
  {
    customerName: 'David K.',
    company: 'Pi Enterprises',
    avatar: '/avatars/user3.jpg',
    rating: 4,
    agentName: 'Andy Chen',
    date: '2026-08-04',
    comment: 'Great guidance on setting up custom domain SSL certificates. Highly responsive support team.',
    tag: 'Onboarding',
  },
  {
    customerName: 'Elena Rostova',
    company: 'Visionary Tech',
    avatar: '/avatars/user4.jpg',
    rating: 5,
    agentName: 'Lucy Tan',
    date: '2026-08-03',
    comment: 'Smooth resolution to our webhook payload retry delay. The agent followed up proactive twice!',
    tag: 'Technical',
  },
  {
    customerName: 'Robert Sterling',
    company: 'Delta Industries',
    avatar: '/avatars/user5.jpg',
    rating: 5,
    agentName: 'Chris Evans',
    date: '2026-08-02',
    comment: 'The team helped us migrate 50,000 customer records without any downtime. World-class onboarding assistance.',
    tag: 'Onboarding',
  },
  {
    customerName: 'Amanda Lin',
    company: 'Alpha Solutions',
    avatar: '/avatars/user6.jpg',
    rating: 5,
    agentName: 'Lucy Tan',
    date: '2026-08-01',
    comment: 'Quick response on our subscription VAT invoice adjustment. Extremely helpful and friendly staff.',
    tag: 'Billing',
  },
  {
    customerName: 'Jonathan Hayes',
    company: 'Nexus Software Ltd',
    avatar: '/avatars/user7.jpg',
    rating: 4,
    agentName: 'Andy Chen',
    date: '2026-07-30',
    comment: 'Detailed response with working code snippets for OAuth token refresh integration. Solved our issue!',
    tag: 'Technical',
  },
];

export async function GET(request: Request) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('CSAT POST error:', error);
    return NextResponse.json({ message: 'Failed to create CSAT review in database' }, { status: 500 });
  }
}
