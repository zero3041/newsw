const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Mapping patterns từ skill description đến skill effects
const effectMappings = [
    // Branding effects
    { pattern: /brand/i, effectName: 'Brand' },
    { pattern: /branding/i, effectName: 'Brand' },

    // Defense effects
    { pattern: /decrease defense/i, effectName: 'Decrease DEF' },
    { pattern: /decrease def/i, effectName: 'Decrease DEF' },
    { pattern: /increase defense/i, effectName: 'Increase DEF' },
    { pattern: /increase def/i, effectName: 'Increase DEF' },

    // Attack effects
    { pattern: /decrease attack/i, effectName: 'Decrease ATK' },
    { pattern: /decrease atk/i, effectName: 'Decrease ATK' },
    { pattern: /increase attack/i, effectName: 'Increase ATK' },
    { pattern: /increase atk/i, effectName: 'Increase ATK' },

    // Speed effects
    { pattern: /decrease speed/i, effectName: 'Decrease SPD' },
    { pattern: /decrease spd/i, effectName: 'Decrease SPD' },
    { pattern: /slow/i, effectName: 'Decrease SPD' },
    { pattern: /increase speed/i, effectName: 'Increase SPD' },
    { pattern: /increase spd/i, effectName: 'Increase SPD' },

    // Beneficial effects blocked
    { pattern: /beneficial effects blocked/i, effectName: 'Beneficial Effects Blocked' },
    { pattern: /block.*beneficial/i, effectName: 'Beneficial Effects Blocked' },

    // AOE
    { pattern: /all enemies/i, effectName: 'AOE' },
    { pattern: /all allies/i, effectName: 'AOE' },

    // Stun effects
    { pattern: /stun/i, effectName: 'Stun' },

    // Sleep effects
    { pattern: /sleep/i, effectName: 'Sleep' },

    // Freeze effects
    { pattern: /freeze/i, effectName: 'Freeze' },

    // Silence effects
    { pattern: /silence/i, effectName: 'Silence' },

    // Immunity effects
    { pattern: /immunity/i, effectName: 'Immunity' },

    // Shield effects
    { pattern: /shield/i, effectName: 'Shield' },

    // Recovery effects
    { pattern: /recovery/i, effectName: 'Recovery' },
    { pattern: /heal/i, effectName: 'Recovery' },

    // Continuous damage
    { pattern: /continuous damage/i, effectName: 'Continuous DMG' },
    { pattern: /dot/i, effectName: 'Continuous DMG' },

    // Provoke effects
    { pattern: /provoke/i, effectName: 'Provoke' },

    // Bomb effects
    { pattern: /bomb/i, effectName: 'Bomb' },

    // Glancing hit
    { pattern: /glancing hit/i, effectName: 'Glancing Hit' },

    // Block heal
    { pattern: /block.*heal/i, effectName: 'Disturb HP Recovery' },
    { pattern: /unrecoverable/i, effectName: 'Disturb HP Recovery' },

    // Oblivion
    { pattern: /oblivion/i, effectName: 'Oblivion' },
    { pattern: /passive.*disabled/i, effectName: 'Oblivion' },

    // Suppression
    { pattern: /suppression/i, effectName: 'Suppression' },

    // Absorb ATB
    { pattern: /absorb.*atb/i, effectName: 'Absorb ATB' },
    { pattern: /absorb.*attack bar/i, effectName: 'Absorb ATB' },

    // Irresistible
    { pattern: /irresistible/i, effectName: 'Irresistible' },
    { pattern: /cannot resist/i, effectName: 'Irresistible' },
]

async function mapSkillEffects() {
    try {
        console.log('Starting skill effect mapping...')

        // Get all skills
        const skills = await prisma.skill.findMany({
            where: {
                description: {
                    not: null,
                },
            },
        })

        console.log(`Found ${skills.length} skills to process`)

        let mappedCount = 0

        for (const skill of skills) {
            const effects = []

            // Check each mapping pattern
            for (const mapping of effectMappings) {
                if (mapping.pattern.test(skill.description)) {
                    // Find the effect in database
                    const effect = await prisma.skillEffect.findFirst({
                        where: {
                            name: mapping.effectName,
                        },
                    })

                    if (effect) {
                        effects.push(effect)
                    }
                }
            }

            // Check for AOE
            if (skill.aoe) {
                // AOE is handled separately in the component
            }

            // Create SkillEffectDetail records
            for (const effect of effects) {
                // Check if already exists
                const existing = await prisma.skillEffectDetail.findFirst({
                    where: {
                        skillId: skill.id,
                        effectId: effect.id,
                    },
                })

                if (!existing) {
                    await prisma.skillEffectDetail.create({
                        data: {
                            skillId: skill.id,
                            effectId: effect.id,
                            aoe: skill.aoe,
                            singleTarget: false,
                            selfEffect: false,
                            chance: null,
                            onCrit: false,
                            onDeath: false,
                            random: skill.random,
                            quantity: null,
                            all: false,
                            selfHp: false,
                            targetHp: false,
                            damage: null,
                            note: null,
                        },
                    })
                    mappedCount++
                }
            }
        }

        console.log(`Successfully mapped ${mappedCount} skill effects`)

        // Test query
        const totalDetails = await prisma.skillEffectDetail.count()
        console.log(`Total skill effect details in database: ${totalDetails}`)

        // Show some examples
        const examples = await prisma.skill.findMany({
            take: 3,
            include: {
                effectDetails: {
                    include: {
                        effect: true,
                    },
                },
            },
            where: {
                effectDetails: {
                    some: {},
                },
            },
        })

        console.log('\nExamples of mapped skills:')
        examples.forEach(skill => {
            console.log(`- ${skill.name}: ${skill.effectDetails.map(ed => ed.effect.name).join(', ')}`)
        })
    } catch (error) {
        console.error('Error mapping skill effects:', error)
    } finally {
        await prisma.$disconnect()
    }
}

mapSkillEffects()
