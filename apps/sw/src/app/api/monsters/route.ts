import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '100')
        const search = searchParams.get('search') || ''
        const elements = searchParams.get('elements') || '' // Multiple elements (comma-separated)
        const archetypes = searchParams.get('archetypes') || '' // Multiple archetypes (comma-separated)
        const naturalStarsMin = searchParams.get('natural_stars_min') || ''
        const naturalStarsMax = searchParams.get('natural_stars_max') || ''
        const sort = searchParams.get('sort') || ''

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {
            obtainable: true, // Only show obtainable monsters by default
        }

        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            }
        }

        // Multiple elements filter
        if (elements) {
            const elementArray = elements
                .split(',')
                .map(e => e.trim())
                .filter(Boolean)
            if (elementArray.length > 0) {
                where.element = { in: elementArray }
            }
        }

        // Multiple archetypes filter
        if (archetypes) {
            const archetypeArray = archetypes
                .split(',')
                .map(a => a.trim())
                .filter(Boolean)
            if (archetypeArray.length > 0) {
                where.archetype = { in: archetypeArray }
            }
        }

        // Natural stars range filter
        if (naturalStarsMin || naturalStarsMax) {
            where.naturalStars = {}
            if (naturalStarsMin) {
                where.naturalStars.gte = parseInt(naturalStarsMin)
            }
            if (naturalStarsMax) {
                where.naturalStars.lte = parseInt(naturalStarsMax)
            }
        }

        // Build orderBy from sort parameter (format: "field;direction")
        // Django default: No sort parameter = sort by name ASC
        let orderBy: any[] = [{ name: 'asc' }]

        if (sort) {
            const [sortField, sortDirection] = sort.split(';')
            if (sortField && sortDirection) {
                // Map frontend field names to database field names (match Django logic)
                const fieldMap: Record<string, string> = {
                    name: 'name',
                    stars: 'baseStars',
                    element: 'element',
                    archetype: 'archetype',
                    natural_stars: 'naturalStars',
                    hp: 'maxLvlHp',
                    def: 'maxLvlDefense',
                    atk: 'maxLvlAttack',
                    spd: 'speed',
                    critRate: 'critRate',
                    critDamage: 'critDamage',
                    resistance: 'resistance',
                    accuracy: 'accuracy',
                    skillUps: 'skillUpsToMax',
                }
                const dbField = fieldMap[sortField] || sortField
                orderBy = [{ [dbField]: sortDirection }]
            }
        }

        // Get total count
        const total = await prisma.monster.count({ where })

        // Get monsters with pagination
        const monsters = await prisma.monster.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                leaderSkill: true,
                monstersSkills: {
                    include: {
                        skill: true,
                    },
                },
                awakensTo: true,
                awakensFrom: true,
            },
        })

        // Transform monsters to include skills array
        const transformedMonsters = monsters.map(monster => ({
            ...monster,
            skills:
                monster.monstersSkills?.map(ms => ({
                    id: ms.skill.id,
                    name: ms.skill.name,
                    description: ms.skill.description,
                    iconFilename: ms.skill.iconFilename,
                    maxLevel: ms.skill.maxLevel,
                    multiplierFormula: ms.skill.multiplierFormula,
                })) || [],
        }))

        return NextResponse.json({
            results: transformedMonsters,
            count: total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error('Error fetching monsters:', error)
        return NextResponse.json({ error: 'Failed to fetch monsters' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
