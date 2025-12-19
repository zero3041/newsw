#!/usr/bin/env tsx

/**
 * Import bestiary data from PostgreSQL SQL dump
 * This script extracts ONLY bestiary-related tables:
 * - monsters (bestiary_monster)
 * - skills (bestiary_skill)
 * - leader_skills (bestiary_leaderskill)
 * - monster_skills (bestiary_monster_skills junction)
 * - skill_effects (bestiary_effect)
 * - skill_effect_details (bestiary_skilleffectdetail)
 * - game_items (bestiary_gameitem)
 *
 * User data will be SKIPPED
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as readline from 'readline'

const prisma = new PrismaClient()

interface ImportStats {
    monsters: number
    skills: number
    leaderSkills: number
    monsterSkills: number
    skillEffects: number
    skillEffectDetails: number
    gameItems: number
    awakenCosts: number
    errors: number
}

const stats: ImportStats = {
    monsters: 0,
    skills: 0,
    leaderSkills: 0,
    monsterSkills: 0,
    skillEffects: 0,
    skillEffectDetails: 0,
    gameItems: 0,
    awakenCosts: 0,
    errors: 0,
}

async function clearExistingData() {
    console.log('🗑️  Clearing existing bestiary data...')

    // Delete in correct order to respect foreign keys
    await prisma.monsterSkill.deleteMany({})
    await prisma.skillEffectDetail.deleteMany({})
    await prisma.skillUpgrade.deleteMany({})
    await prisma.skillScalingStats.deleteMany({})
    await prisma.awakenCost.deleteMany({})
    await prisma.monsterCraftCost.deleteMany({})
    await prisma.monsterSource.deleteMany({})

    await prisma.monster.deleteMany({})
    await prisma.skill.deleteMany({})
    await prisma.leaderSkill.deleteMany({})
    await prisma.skillEffect.deleteMany({})
    await prisma.gameItem.deleteMany({})
    await prisma.source.deleteMany({})

    console.log('✅ Existing data cleared')
}

async function extractTableData(filePath: string, tableName: string): Promise<string[][]> {
    console.log(`📖 Extracting ${tableName}...`)

    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })

    const rows: string[][] = []
    let inTable = false
    let columns: string[] = []

    for await (const line of rl) {
        // Find the COPY command for this table
        if (line.includes(`COPY public.${tableName}`) && line.includes('FROM stdin')) {
            inTable = true
            // Extract column names from COPY command
            const match = line.match(/\(([^)]+)\)/)
            if (match) {
                columns = match[1].split(',').map(col => col.trim())
            }
            continue
        }

        // End of table data
        if (inTable && line === '\\.') {
            inTable = false
            break
        }

        // Process data rows
        if (inTable) {
            const values = line.split('\t')
            rows.push(values)
        }
    }

    console.log(`  ✓ Found ${rows.length} rows in ${tableName}`)
    return rows
}

async function importMonsters(sqlPath: string) {
    console.log('\n🦁 Importing Monsters (Pass 1: Without Foreign Keys)...')

    const rows = await extractTableData(sqlPath, 'bestiary_monster')

    // Pass 1: Create all monsters without foreign keys
    for (const row of rows) {
        try {
            // COPY public.bestiary_monster columns (from SQL backup line 10662):
            // id, name, com2us_id, family_id, skill_group_id, image_filename, element, archetype,
            // base_stars, natural_stars, obtainable, can_awaken, is_awakened, awaken_level,
            // awaken_bonus, skill_ups_to_max, raw_hp, raw_attack, raw_defense,
            // base_hp, base_attack, base_defense, max_lvl_hp, max_lvl_attack, max_lvl_defense,
            // speed, crit_rate, crit_damage, resistance, accuracy, homunculus, craft_cost,
            // awaken_mats_fire_low, awaken_mats_fire_mid, awaken_mats_fire_high,
            // awaken_mats_water_low, awaken_mats_water_mid, awaken_mats_water_high,
            // awaken_mats_wind_low, awaken_mats_wind_mid, awaken_mats_wind_high,
            // awaken_mats_light_low, awaken_mats_light_mid, awaken_mats_light_high,
            // awaken_mats_dark_low, awaken_mats_dark_mid, awaken_mats_dark_high,
            // awaken_mats_magic_low, awaken_mats_magic_mid, awaken_mats_magic_high,
            // farmable, fusion_food, bestiary_slug, awakens_from_id, awakens_to_id,
            // leader_skill_id, transforms_to_id

            const [
                id,
                name,
                com2usId,
                familyId,
                skillGroupId,
                imageFilename,
                element,
                archetype,
                baseStars,
                naturalStars,
                obtainable,
                canAwaken,
                isAwakened,
                awakenLevel,
                awakenBonus,
                skillUpsToMax,
                rawHp,
                rawAttack,
                rawDefense,
                baseHp,
                baseAttack,
                baseDefense,
                maxLvlHp,
                maxLvlAttack,
                maxLvlDefense,
                speed,
                critRate,
                critDamage,
                resistance,
                accuracy,
                homunculus,
                craftCost,
                awakenMatsFireLow,
                awakenMatsFireMid,
                awakenMatsFireHigh,
                awakenMatsWaterLow,
                awakenMatsWaterMid,
                awakenMatsWaterHigh,
                awakenMatsWindLow,
                awakenMatsWindMid,
                awakenMatsWindHigh,
                awakenMatsLightLow,
                awakenMatsLightMid,
                awakenMatsLightHigh,
                awakenMatsDarkLow,
                awakenMatsDarkMid,
                awakenMatsDarkHigh,
                awakenMatsMagicLow,
                awakenMatsMagicMid,
                awakenMatsMagicHigh,
                farmable,
                fusionFood,
                bestiarySlug,
                awakensFromId,
                awakensToId,
                leaderSkillId,
                transformsToId,
            ] = row

            await prisma.monster.create({
                data: {
                    id: parseInt(id),
                    name: name || '',
                    com2usId: com2usId && com2usId !== '\\N' ? parseInt(com2usId) : null,
                    familyId: familyId && familyId !== '\\N' ? parseInt(familyId) : null,
                    skillGroupId: skillGroupId && skillGroupId !== '\\N' ? parseInt(skillGroupId) : null,
                    imageFilename: imageFilename && imageFilename !== '\\N' ? imageFilename : null,
                    element: element || 'fire',
                    archetype: archetype || 'attack',
                    baseStars: parseInt(baseStars) || 1,
                    naturalStars: parseInt(naturalStars) || 1,
                    obtainable: obtainable === 't',
                    canAwaken: canAwaken === 't',
                    isAwakened: isAwakened === 't',
                    awakenLevel: parseInt(awakenLevel) || 0,
                    // Skip foreign keys in first pass
                    skillUpsToMax: skillUpsToMax && skillUpsToMax !== '\\N' ? parseInt(skillUpsToMax) : null,
                    rawHp: rawHp && rawHp !== '\\N' ? parseInt(rawHp) : null,
                    rawAttack: rawAttack && rawAttack !== '\\N' ? parseInt(rawAttack) : null,
                    rawDefense: rawDefense && rawDefense !== '\\N' ? parseInt(rawDefense) : null,
                    baseHp: baseHp && baseHp !== '\\N' ? parseInt(baseHp) : null,
                    baseAttack: baseAttack && baseAttack !== '\\N' ? parseInt(baseAttack) : null,
                    baseDefense: baseDefense && baseDefense !== '\\N' ? parseInt(baseDefense) : null,
                    maxLvlHp: maxLvlHp && maxLvlHp !== '\\N' ? parseInt(maxLvlHp) : null,
                    maxLvlAttack: maxLvlAttack && maxLvlAttack !== '\\N' ? parseInt(maxLvlAttack) : null,
                    maxLvlDefense: maxLvlDefense && maxLvlDefense !== '\\N' ? parseInt(maxLvlDefense) : null,
                    speed: speed && speed !== '\\N' ? parseInt(speed) : null,
                    critRate: critRate && critRate !== '\\N' ? parseInt(critRate) : null,
                    critDamage: critDamage && critDamage !== '\\N' ? parseInt(critDamage) : null,
                    resistance: resistance && resistance !== '\\N' ? parseInt(resistance) : null,
                    accuracy: accuracy && accuracy !== '\\N' ? parseInt(accuracy) : null,
                    awakenMatsFireLow: parseInt(awakenMatsFireLow) || 0,
                    awakenMatsFireMid: parseInt(awakenMatsFireMid) || 0,
                    awakenMatsFireHigh: parseInt(awakenMatsFireHigh) || 0,
                    awakenMatsWaterLow: parseInt(awakenMatsWaterLow) || 0,
                    awakenMatsWaterMid: parseInt(awakenMatsWaterMid) || 0,
                    awakenMatsWaterHigh: parseInt(awakenMatsWaterHigh) || 0,
                    awakenMatsWindLow: parseInt(awakenMatsWindLow) || 0,
                    awakenMatsWindMid: parseInt(awakenMatsWindMid) || 0,
                    awakenMatsWindHigh: parseInt(awakenMatsWindHigh) || 0,
                    awakenMatsLightLow: parseInt(awakenMatsLightLow) || 0,
                    awakenMatsLightMid: parseInt(awakenMatsLightMid) || 0,
                    awakenMatsLightHigh: parseInt(awakenMatsLightHigh) || 0,
                    awakenMatsDarkLow: parseInt(awakenMatsDarkLow) || 0,
                    awakenMatsDarkMid: parseInt(awakenMatsDarkMid) || 0,
                    awakenMatsDarkHigh: parseInt(awakenMatsDarkHigh) || 0,
                    awakenMatsMagicLow: parseInt(awakenMatsMagicLow) || 0,
                    awakenMatsMagicMid: parseInt(awakenMatsMagicMid) || 0,
                    awakenMatsMagicHigh: parseInt(awakenMatsMagicHigh) || 0,
                    farmable: farmable === 't',
                    fusionFood: fusionFood === 't',
                    homunculus: homunculus === 't',
                    craftCost: craftCost && craftCost !== '\\N' ? parseInt(craftCost) : null,
                    bestiarySlug: bestiarySlug && bestiarySlug !== '\\N' ? bestiarySlug : null,
                },
            })

            stats.monsters++
            if (stats.monsters % 100 === 0) {
                console.log(`  → Imported ${stats.monsters} monsters...`)
            }
        } catch (error: any) {
            console.error(`  ✗ Error importing monster ${row[0]}: ${error.message}`)
            stats.errors++
        }
    }

    console.log(`✅ Pass 1: Imported ${stats.monsters} monsters`)

    // Pass 2: Update foreign key relationships
    console.log('\n🔗 Pass 2: Updating foreign key relationships...')
    let updated = 0
    for (const row of rows) {
        try {
            const [
                id,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                bestiarySlug,
                awakensFromId,
                awakensToId,
                leaderSkillId,
                transformsToId,
            ] = row

            await prisma.monster.update({
                where: { id: parseInt(id) },
                data: {
                    awakensFromId: awakensFromId && awakensFromId !== '\\N' ? parseInt(awakensFromId) : null,
                    awakensToId: awakensToId && awakensToId !== '\\N' ? parseInt(awakensToId) : null,
                    leaderSkillId: leaderSkillId && leaderSkillId !== '\\N' ? parseInt(leaderSkillId) : null,
                },
            })

            updated++
            if (updated % 100 === 0) {
                console.log(`  → Updated ${updated} monsters...`)
            }
        } catch (error: any) {
            console.error(`  ✗ Error updating monster ${row[0]}: ${error.message}`)
            stats.errors++
        }
    }

    console.log(`✅ Pass 2: Updated ${updated} monster relationships`)
}

async function importLeaderSkills(sqlPath: string) {
    console.log('\n👑 Importing Leader Skills...')

    const rows = await extractTableData(sqlPath, 'bestiary_leaderskill')

    for (const row of rows) {
        try {
            const [id, attribute, amount, area, element] = row

            await prisma.leaderSkill.create({
                data: {
                    id: parseInt(id),
                    attribute: attribute || '',
                    amount: parseInt(amount) || 0,
                    area: area || '',
                    element: element || '',
                },
            })

            stats.leaderSkills++
        } catch (error: any) {
            console.error(`  ✗ Error importing leader skill: ${error.message}`)
            stats.errors++
        }
    }

    console.log(`✅ Imported ${stats.leaderSkills} leader skills`)
}

async function importSkills(sqlPath: string) {
    console.log('\n⚔️  Importing Skills...')

    const rows = await extractTableData(sqlPath, 'bestiary_skill')

    for (const row of rows) {
        try {
            // COPY public.bestiary_skill columns (from SQL backup line 20994):
            // id, com2us_id, name, description, slot, cooltime, hits, aoe, random, passive,
            // max_level, icon_filename, multiplier_formula, multiplier_formula_raw,
            // level_progress_description, other_skill_id
            const [
                id,
                com2usId,
                name,
                description,
                slot,
                cooltime,
                hits,
                aoe,
                random,
                passive,
                maxLevel,
                iconFilename,
                multiplierFormula,
                multiplierFormulaRaw,
                levelProgressDesc,
                otherSkillId,
            ] = row

            await prisma.skill.create({
                data: {
                    id: parseInt(id),
                    name: name || '',
                    description: description && description !== '\\N' ? description : null,
                    slot: parseInt(slot) || 1,
                    cooltime: cooltime && cooltime !== '\\N' ? parseInt(cooltime) : null,
                    hits: parseInt(hits) || 0,
                    passive: passive === 't',
                    aoe: aoe === 't',
                    random: random === 't',
                    maxLevel: parseInt(maxLevel) || 1,
                    iconFilename: iconFilename && iconFilename !== '\\N' ? iconFilename : null,
                    levelProgressDesc: levelProgressDesc && levelProgressDesc !== '\\N' ? levelProgressDesc : null,
                    multiplierFormula: multiplierFormula && multiplierFormula !== '\\N' ? multiplierFormula : null,
                    multiplierFormulaRaw:
                        multiplierFormulaRaw && multiplierFormulaRaw !== '\\N' ? multiplierFormulaRaw : null,
                    com2usId: com2usId && com2usId !== '\\N' ? parseInt(com2usId) : null,
                },
            })

            stats.skills++
            if (stats.skills % 500 === 0) {
                console.log(`  → Imported ${stats.skills} skills...`)
            }
        } catch (error: any) {
            console.error(`  ✗ Error importing skill: ${error.message}`)
            stats.errors++
        }
    }

    console.log(`✅ Imported ${stats.skills} skills`)
}

async function importMonsterSkills(sqlPath: string) {
    console.log('\n🔗 Importing Monster-Skill Relations...')

    const rows = await extractTableData(sqlPath, 'bestiary_monster_skills')

    for (const row of rows) {
        try {
            const [id, monsterId, skillId] = row

            await prisma.monsterSkill.create({
                data: {
                    monsterId: parseInt(monsterId),
                    skillId: parseInt(skillId),
                },
            })

            stats.monsterSkills++
            if (stats.monsterSkills % 1000 === 0) {
                console.log(`  → Imported ${stats.monsterSkills} monster-skill relations...`)
            }
        } catch (error: any) {
            console.error(`  ✗ Error importing monster-skill relation: ${error.message}`)
            stats.errors++
        }
    }

    console.log(`✅ Imported ${stats.monsterSkills} monster-skill relations`)
}

async function main() {
    const sqlPath = '/home/bss/Documents/SW/pushsw/backup_full_20251027_170316.sql'

    if (!fs.existsSync(sqlPath)) {
        console.error(`❌ SQL file not found: ${sqlPath}`)
        process.exit(1)
    }

    console.log('🚀 Starting Bestiary Data Import from SQL...\n')
    console.log(`📁 Source: ${sqlPath}\n`)

    try {
        // Clear existing data
        await clearExistingData()

        // Import in correct order to respect foreign keys
        await importLeaderSkills(sqlPath)
        await importSkills(sqlPath)
        await importMonsters(sqlPath)
        await importMonsterSkills(sqlPath)

        // Print summary
        console.log('\n' + '='.repeat(60))
        console.log('📊 IMPORT SUMMARY')
        console.log('='.repeat(60))
        console.log(`✅ Monsters:              ${stats.monsters.toLocaleString()}`)
        console.log(`✅ Skills:                ${stats.skills.toLocaleString()}`)
        console.log(`✅ Leader Skills:         ${stats.leaderSkills.toLocaleString()}`)
        console.log(`✅ Monster-Skill Links:   ${stats.monsterSkills.toLocaleString()}`)
        console.log(`❌ Errors:                ${stats.errors.toLocaleString()}`)
        console.log('='.repeat(60))
        console.log('\n✨ Import completed!')
    } catch (error: any) {
        console.error('❌ Import failed:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
