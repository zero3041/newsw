import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const search = searchParams.get('search') || ''
        const slot = searchParams.get('slot') || ''

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {}

        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            }
        }

        if (slot) {
            where.slot = parseInt(slot)
        }

        // Get total count
        const total = await prisma.skill.count({ where })

        // Get skills with pagination
        const skills = await prisma.skill.findMany({
            where,
            skip,
            take: limit,
            orderBy: [{ slot: 'asc' }, { name: 'asc' }],
            include: {
                upgrades: true,
                scalingStats: true,
                effectDetails: {
                    include: {
                        effect: true,
                    },
                },
            },
        })

        return NextResponse.json({
            results: skills,
            count: total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error('Error fetching skills:', error)
        return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
