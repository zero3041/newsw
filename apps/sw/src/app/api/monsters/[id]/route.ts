import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id: idParam } = await context.params
        const id = parseInt(idParam)

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid monster ID' }, { status: 400 })
        }

        const monster = await prisma.monster.findUnique({
            where: { id },
            include: {
                leaderSkill: true,
                monstersSkills: {
                    include: {
                        skill: true,
                    },
                },
                awakenCostItems: {
                    include: {
                        item: true,
                    },
                },
                craftMaterials: {
                    include: {
                        item: true,
                    },
                },
                awakensFrom: true,
                awakensTo: true,
            },
        })

        if (!monster) {
            return NextResponse.json({ error: 'Monster not found' }, { status: 404 })
        }

        return NextResponse.json(monster)
    } catch (error) {
        console.error('Error fetching monster:', error)
        return NextResponse.json({ error: 'Failed to fetch monster' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
