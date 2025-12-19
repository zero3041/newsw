import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, context: { params: Promise<{ familyId: string }> }) {
    try {
        const { familyId } = await context.params
        const familyIdNum = parseInt(familyId)

        if (isNaN(familyIdNum)) {
            return NextResponse.json({ error: 'Invalid family ID' }, { status: 400 })
        }

        // Get all monsters in the family
        // Show all obtainable monsters in the family
        const monsters = await prisma.monster.findMany({
            where: {
                familyId: familyIdNum,
                obtainable: true,
            },
            select: {
                id: true,
                name: true,
                element: true,
                imageFilename: true,
                bestiarySlug: true,
                isAwakened: true,
                awakenLevel: true,
                baseStars: true,
                naturalStars: true,
                com2usId: true,
            },
            orderBy: {
                com2usId: 'asc',
            },
        })

        return NextResponse.json(monsters)
    } catch (error) {
        console.error('Error fetching monster family:', error)
        return NextResponse.json({ error: 'Failed to fetch monster family' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
