import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const battleId = searchParams.get('battleId');

    if (!battleId) {
        return NextResponse.json({ error: 'Battle ID is required' }, { status: 400 });
    }

    try {
        const battleInfo = await prisma.battleRoom.findUnique({
            where: {
                id: battleId,
            },
            include: {
                participants: {
                    include: {
                        skills: {
                            include: {
                                skill: true,
                            },
                        },
                        inventory: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
                entities: {
                    include: {
                        skills: {
                            include: {
                                skill: true,
                            },
                        },
                        items: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
                queue: {
                    orderBy: {
                        order: 'asc',
                    },
                },
                chats: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 50,
                },
            },
        });

        if (!battleInfo) {
            return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: battleInfo });
    } catch (error) {
        console.error('Error fetching battle info:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
