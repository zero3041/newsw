import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

interface MonsterData {
    id: number
    name: string
    com2us_id: number | null
    family_id: number | null
    image_filename: string | null
    element: string
    archetype: string
    base_stars: number
    natural_stars: number
    obtainable: boolean
    can_awaken: boolean
    is_awakened: boolean
    awaken_level: number
    // ... and all other fields
}

function parsePostgresLine(line: string): (string | number | boolean | null)[] {
    // Parse tab-separated values from PostgreSQL COPY format
    const values: (string | number | boolean | null)[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '\\' && i + 1 < line.length && line[i + 1] === 'N') {
            values.push(null)
            i++
            continue
        }

        if (char === '\\' && i + 1 < line.length) {
            current += line[i + 1]
            i++
            continue
        }

        if (char === '\t' && !inQuotes) {
            // Try to parse as number or boolean
            const parsed = parseValue(current)
            values.push(parsed)
            current = ''
            continue
        }

        current += char
    }

    // Last value
    if (current) {
        const parsed = parseValue(current)
        values.push(parsed)
    }

    return values
}

function parseValue(value: string): string | number | boolean | null {
    if (value === '\\N' || value === '') return null
    if (value === 't') return true
    if (value === 'f') return false
    if (!isNaN(Number(value))) return Number(value)
    return value
}

async function extractDataFromSQL(sqlFile: string) {
    console.log(`Reading SQL file: ${sqlFile}`)
    const content = fs.readFileSync(sqlFile, 'utf-8')

    // Extract COPY statements and their data
    const monsters: any[] = []

    // Find monster data section
    const monsterPattern = /COPY public\.bestiary_monster[^\n]+\n([\s\S]+?)\n\\\./g
    let match

    console.log('Extracting monster data...')

    while ((match = monsterPattern.exec(content)) !== null) {
        const dataLines = match[1]!.trim().split('\n')

        for (const line of dataLines) {
            if (line.trim()) {
                const values = parsePostgresLine(line)

                monsters.push({
                    id: values[0],
                    name: values[1],
                    com2us_id: values[2],
                    family_id: values[3],
                    skill_group_id: values[4],
                    image_filename: values[5],
                    element: values[6],
                    archetype: values[7],
                    base_stars: values[8],
                    natural_stars: values[9],
                    obtainable: values[10],
                    can_awaken: values[11],
                    is_awakened: values[12],
                    awaken_level: values[13],
                    awaken_bonus: values[14],
                    skill_ups_to_max: values[15],
                    raw_hp: values[16],
                    raw_attack: values[17],
                    raw_defense: values[18],
                    base_hp: values[19],
                    base_attack: values[20],
                    base_defense: values[21],
                    max_lvl_hp: values[22],
                    max_lvl_attack: values[23],
                    max_lvl_defense: values[24],
                    speed: values[25],
                    crit_rate: values[26],
                    crit_damage: values[27],
                    resistance: values[28],
                    accuracy: values[29],
                    homunculus: values[30],
                    craft_cost: values[31],
                    // ... awakening materials
                    awaken_mats_fire_low: values[32],
                    awaken_mats_fire_mid: values[33],
                    awaken_mats_fire_high: values[34],
                    awaken_mats_water_low: values[35],
                    awaken_mats_water_mid: values[36],
                    awaken_mats_water_high: values[37],
                    awaken_mats_wind_low: values[38],
                    awaken_mats_wind_mid: values[39],
                    awaken_mats_wind_high: values[40],
                    awaken_mats_light_low: values[41],
                    awaken_mats_light_mid: values[42],
                    awaken_mats_light_high: values[43],
                    awaken_mats_dark_low: values[44],
                    awaken_mats_dark_mid: values[45],
                    awaken_mats_dark_high: values[46],
                    awaken_mats_magic_low: values[47],
                    awaken_mats_magic_mid: values[48],
                    awaken_mats_magic_high: values[49],
                    farmable: values[50],
                    fusion_food: values[51],
                    bestiary_slug: values[52],
                    awakens_from_id: values[53],
                    awakens_to_id: values[54],
                    leader_skill_id: values[55],
                    transforms_to_id: values[56],
                })
            }
        }
    }

    console.log(`Extracted ${monsters.length} monsters`)
    return monsters
}

async function importMonsters(monsters: any[]) {
    console.log('Importing monsters to SQLite...')

    let imported = 0
    let errors = 0

    for (const monster of monsters) {
        try {
            await prisma.monster.create({
                data: {
                    name: monster.name,
                    com2usId: monster.com2us_id,
                    familyId: monster.family_id,
                    skillGroupId: monster.skill_group_id,
                    imageFilename: monster.image_filename,
                    element: monster.element,
                    archetype: monster.archetype,
                    baseStars: monster.base_stars,
                    naturalStars: monster.natural_stars,
                    obtainable: monster.obtainable,
                    canAwaken: monster.can_awaken,
                    isAwakened: monster.is_awakened,
                    awakenLevel: monster.awaken_level,
                    awakenBonus: monster.awaken_bonus,
                    skillUpsToMax: monster.skill_ups_to_max,
                    rawHp: monster.raw_hp,
                    rawAttack: monster.raw_attack,
                    rawDefense: monster.raw_defense,
                    baseHp: monster.base_hp,
                    baseAttack: monster.base_attack,
                    baseDefense: monster.base_defense,
                    maxLvlHp: monster.max_lvl_hp,
                    maxLvlAttack: monster.max_lvl_attack,
                    maxLvlDefense: monster.max_lvl_defense,
                    speed: monster.speed,
                    critRate: monster.crit_rate,
                    critDamage: monster.crit_damage,
                    resistance: monster.resistance,
                    accuracy: monster.accuracy,
                    homunculus: monster.homunculus,
                    craftCost: monster.craft_cost,
                    awakenMatsFireLow: monster.awaken_mats_fire_low || 0,
                    awakenMatsFireMid: monster.awaken_mats_fire_mid || 0,
                    awakenMatsFireHigh: monster.awaken_mats_fire_high || 0,
                    awakenMatsWaterLow: monster.awaken_mats_water_low || 0,
                    awakenMatsWaterMid: monster.awaken_mats_water_mid || 0,
                    awakenMatsWaterHigh: monster.awaken_mats_water_high || 0,
                    awakenMatsWindLow: monster.awaken_mats_wind_low || 0,
                    awakenMatsWindMid: monster.awaken_mats_wind_mid || 0,
                    awakenMatsWindHigh: monster.awaken_mats_wind_high || 0,
                    awakenMatsLightLow: monster.awaken_mats_light_low || 0,
                    awakenMatsLightMid: monster.awaken_mats_light_mid || 0,
                    awakenMatsLightHigh: monster.awaken_mats_light_high || 0,
                    awakenMatsDarkLow: monster.awaken_mats_dark_low || 0,
                    awakenMatsDarkMid: monster.awaken_mats_dark_mid || 0,
                    awakenMatsDarkHigh: monster.awaken_mats_dark_high || 0,
                    awakenMatsMagicLow: monster.awaken_mats_magic_low || 0,
                    awakenMatsMagicMid: monster.awaken_mats_magic_mid || 0,
                    awakenMatsMagicHigh: monster.awaken_mats_magic_high || 0,
                    source: false,
                    farmable: monster.farmable,
                    fusionFood: monster.fusion_food,
                    bestiarySlug: monster.bestiary_slug,
                    awakensFromId: monster.awakens_from_id,
                    awakensToId: monster.awakens_to_id,
                    leaderSkillId: monster.leader_skill_id,
                },
            })
            imported++

            if (imported % 100 === 0) {
                console.log(`Imported ${imported} monsters...`)
            }
        } catch (error) {
            errors++
            console.error(`Error importing monster ${monster.id}:`, error)
        }
    }

    console.log(`\n✓ Import complete!`)
    console.log(`✓ Successfully imported: ${imported}`)
    console.log(`✗ Errors: ${errors}`)
}

async function main() {
    const sqlFile = process.argv[2] || '../../../pushsw/backup_full_20251027_170316.sql'

    console.log('Starting SQL import...')
    console.log(`SQL file: ${sqlFile}`)
    console.log('='.repeat(50))

    const monsters = await extractDataFromSQL(sqlFile)
    await importMonsters(monsters)

    await prisma.$disconnect()
}

main()
    .catch(console.error)
    .finally(() => process.exit(0))
