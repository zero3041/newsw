import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await context.params

        const monster = await prisma.monster.findFirst({
            where: { bestiarySlug: slug },
            include: {
                leaderSkill: true,
                monstersSkills: {
                    include: {
                        skill: {
                            include: {
                                effectDetails: {
                                    include: {
                                        effect: true,
                                    },
                                },
                            },
                        },
                    },
                },
                awakensFrom: {
                    select: {
                        id: true,
                        name: true,
                        element: true,
                        imageFilename: true,
                        bestiarySlug: true,
                    },
                },
                awakensTo: {
                    select: {
                        id: true,
                        name: true,
                        element: true,
                        imageFilename: true,
                        bestiarySlug: true,
                    },
                },
            },
        })

        if (!monster) {
            return NextResponse.json({ error: `Monster not found with slug: ${slug}` }, { status: 404 })
        }

        return NextResponse.json(monster)
    } catch (error) {
        console.error('Error fetching monster by slug:', error)
        if (error instanceof Error) {
            console.error('Error details:', error.message)
            console.error('Error stack:', error.stack)
        }
        return NextResponse.json(
            {
                error: 'Failed to fetch monster',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        )
    } finally {
        await prisma.$disconnect()
    }
}
