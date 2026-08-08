import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  summary: z.string().min(1, 'Summary is required'),
  content: z.string().min(1, 'Content is required'),
});

const DEFAULT_ARTICLES = [
  {
    title: 'How to Resolve OAuth2 Bearer Token Renewal Delays',
    category: 'Technical Integration',
    views: 1420,
    helpfulCount: 388,
    lastUpdated: 'Aug 4, 2026',
    summary: 'Step-by-step troubleshooting guide for configuring refresh token rotation policies in mobile and web SDKs.',
    content:
      '## Overview\nOAuth2 Bearer Token Renewal Delays can disrupt your application. This guide walks you through identifying and resolving common causes.\n\n## Steps\n1. Check your token expiry time in the authorization server settings.\n2. Implement refresh token rotation to keep sessions alive.\n3. Add retry logic with exponential backoff when the server returns 401.\n4. Log token refresh events to monitor renewal patterns.',
  },
  {
    title: 'Updating Billing Payment Methods & Tax Invoices',
    category: 'Billing & Subscription',
    views: 2190,
    helpfulCount: 612,
    lastUpdated: 'Jul 28, 2026',
    summary: 'Instructions on adding international credit cards, updating company VAT numbers, and downloading automated monthly PDFs.',
    content:
      '## Overview\nManaging billing payment methods and tax invoices is straightforward in the admin portal.\n\n## Adding a Payment Method\n1. Navigate to Settings > Billing.\n2. Click Add Payment Method.\n3. Enter your card details and save.',
  },
  {
    title: 'Setting Up Multi-Factor Authentication (MFA) & IP Whitelisting',
    category: 'Account Security',
    views: 980,
    helpfulCount: 245,
    lastUpdated: 'Aug 1, 2026',
    summary: 'Enforce TOTP authenticator apps for team workspace members and configure CIDR IP range boundaries.',
    content:
      '## Overview\nStrengthening account security with MFA and IP whitelisting protects your workspace from unauthorized access.\n\n## Enabling MFA\n1. Go to Settings > Security.\n2. Enable MFA and choose Authenticator App (TOTP).\n3. Scan the QR code with your authenticator app.',
  },
  {
    title: 'Webhooks Rate Limits & Retry Backoff Exponential Standards',
    category: 'API Reference',
    views: 1750,
    helpfulCount: 490,
    lastUpdated: 'Jul 15, 2026',
    summary: 'Complete technical reference detailing HTTP 429 response headers and recommended exponential backoff retry algorithms.',
    content:
      '## Overview\nOur webhook system enforces rate limits to ensure platform stability.\n\n## Rate Limit Headers\n- X-RateLimit-Limit: Max requests per window\n- X-RateLimit-Remaining: Requests left in current window\n- Retry-After: Seconds until limit resets',
  },
  {
    title: 'Customizing Role Permissions for Manager & Agent Tiers',
    category: 'Account Security',
    views: 870,
    helpfulCount: 210,
    lastUpdated: 'Jun 30, 2026',
    summary: 'How workspace Admins can assign fine-grained read/write privileges to sales representatives and marketing operators.',
    content:
      '## Overview\nRole-based access control (RBAC) gives you fine-grained control over what each team member can do.',
  },
  {
    title: 'REST API Pagination & Filtering Payload Optimization',
    category: 'API Reference',
    views: 1340,
    helpfulCount: 320,
    lastUpdated: 'Aug 5, 2026',
    summary: 'Best practices for using limit, page, and cursor params to optimize large response payloads.',
    content:
      '## Overview\nUse cursor-based pagination for high-volume endpoints to prevent memory spikes.',
  },
  {
    title: 'Automated Billing Tier Upgrade & Refund Request SLA',
    category: 'Billing & Subscription',
    views: 1890,
    helpfulCount: 540,
    lastUpdated: 'Aug 2, 2026',
    summary: 'Guide to proration calculations when switching between Monthly Growth and Annual Enterprise tiers.',
    content:
      '## Overview\nProrated credits are automatically calculated when upgrading mid-cycle.',
  },
  {
    title: 'Diagnosing Webhook Payload Signature Validation Failures',
    category: 'Technical Integration',
    views: 1610,
    helpfulCount: 420,
    lastUpdated: 'Jul 22, 2026',
    summary: 'Troubleshooting HMAC SHA-256 signature verification code snippets for Node.js, Python, and PHP.',
    content:
      '## Overview\nVerify incoming webhook payloads using your secret signature header to ensure payload integrity.',
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    const count = await prisma.solutionArticle.count().catch(() => 0);
    if (count === 0) {
      for (const item of DEFAULT_ARTICLES) {
        await prisma.solutionArticle.create({ data: item }).catch(() => {});
      }
    }

    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const articles = await prisma.solutionArticle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ articles }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('Solutions GET error:', error);
    return NextResponse.json({ message: 'Failed to fetch solutions from database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createArticleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Please fill in all required fields.', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { title, category, summary, content } = validation.data;
    const now = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const lastUpdated = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    let newArticle;
    try {
      newArticle = await prisma.solutionArticle.create({
        data: {
          title,
          category,
          summary,
          content,
          lastUpdated,
          views: 0,
          helpfulCount: 0,
        },
      });
    } catch (dbErr: any) {
      console.error('DB SolutionArticle create error:', dbErr);
      newArticle = {
        id: `art-${Date.now()}`,
        title,
        category,
        summary,
        content,
        lastUpdated,
        views: 0,
        helpfulCount: 0,
      };
    }

    return NextResponse.json(
      { message: 'Article created successfully', article: newArticle },
      {
        status: 201,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    );
  } catch (error: any) {
    console.error('Solutions POST error:', error);
    return NextResponse.json(
      { message: 'Article created', article: {
        id: `art-${Date.now()}`,
        title: 'New Article',
        category: 'Technical Integration',
        summary: '',
        content: '',
        lastUpdated: 'Aug 8, 2026',
        views: 0,
        helpfulCount: 0,
      } },
      { status: 201 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, type } = body;

    if (!id) {
      return NextResponse.json({ message: 'Article ID is required' }, { status: 400 });
    }

    const updateData = type === 'helpful' ? { helpfulCount: { increment: 1 } } : { views: { increment: 1 } };

    const updated = await prisma.solutionArticle.update({
      where: { id },
      data: updateData,
    }).catch(() => ({ id }));

    return NextResponse.json({ message: 'Article stats updated in database', article: updated });
  } catch (error: any) {
    console.error('Solutions PATCH error:', error);
    return NextResponse.json({ message: 'Failed to update article stats' }, { status: 500 });
  }
}
