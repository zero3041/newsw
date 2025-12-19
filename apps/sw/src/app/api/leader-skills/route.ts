import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const attribute = searchParams.get('attribute') || ''
        const area = searchParams.get('area') || ''
        const element = searchParams.get('element') || ''

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {}

        if (attribute) {
            where.attribute = attribute
        }

        if (area) {
            where.area = area
        }

        if (element) {
            where.element = element
        }

        // Get total count
        const total = await prisma.leaderSkill.count({ where })

        // Get leader skills with pagination
        const leaderSkills = await prisma.leaderSkill.findMany({
            where,
            skip,
            take: limit,
            orderBy: [{ attribute: 'asc' }, { amount: 'desc' }],
            include: {
                monsters: {
                    select: {
                        id: true,
                        name: true,
                        element: true,
                        naturalStars: true,
                    },
                },
            },
        })

        return NextResponse.json({
            results: leaderSkills,
            count: total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error('Error fetching leader skills:', error)
        return NextResponse.json({ error: 'Failed to fetch leader skills' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
