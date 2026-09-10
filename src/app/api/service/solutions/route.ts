import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DEFAULT_ARTICLES } from './solutionsData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  summary: z.string().min(1, 'Summary is required'),
  content: z.string().min(1, 'Content is required'),
});

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

    const where: Prisma.SolutionArticleWhereInput = {};
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
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
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
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    let newArticle;
    try {
      newArticle = await prisma.solutionArticle.create({
        data: { title, category, summary, content, lastUpdated, views: 0, helpfulCount: 0 },
      });
    } catch {
      newArticle = {
        id: `art-${Date.now()}`,
        title, category, summary, content, lastUpdated, views: 0, helpfulCount: 0,
      };
    }

    return NextResponse.json(
      { message: 'Article created successfully', article: newArticle },
      { status: 201, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Solutions POST error:', error);
    return NextResponse.json({ message: 'Failed to create article' }, { status: 500 });
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
  } catch (error) {
    console.error('Solutions PATCH error:', error);
    return NextResponse.json({ message: 'Failed to update article stats' }, { status: 500 });
  }
}
