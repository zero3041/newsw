import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface DjangoFixture {
    model: string
    pk: number
    fields: Record<string, any>
}

async function importDjangoData(jsonFile: string) {
    console.log(`Reading JSON file: ${jsonFile}`)

    const content = fs.readFileSync(jsonFile, 'utf-8')
    const data: DjangoFixture[] = JSON.parse(content)

    console.log(`Found ${data.length} records`)
    console.log('='.repeat(50))

    // Separate by model
    const byModel = data.reduce(
        (acc, item) => {
            if (!acc[item.model]) acc[item.model] = []
            acc[item.model]!.push(item)
            return acc
        },
        {} as Record<string, DjangoFixture[]>,
    )

    console.log('Models found:')
    Object.keys(byModel).forEach(model => {
        console.log(`  - ${model}: ${byModel[model]!.length} records`)
    })

    // Import in dependency order
    // 1. Base data first
    await importLeaderSkills(byModel['bestiary.leaderskill'] || [])
    await importSkills(byModel['bestiary.skill'] || [])
    await importGameItems(byModel['bestiary.gameitem'] || [])
    await importSkillEffects(byModel['bestiary.skilleffect'] || [])
    await importSources(byModel['bestiary.source'] || [])

    // 2. Then monsters (with potential self-references, handle nulls)
    await importMonsters(byModel['bestiary.monster'] || [])

    // 3. Junction tables
    await importMonsterSkills(byModel['bestiary.monster_skills'] || [])
    await importMonsterSources(byModel['bestiary.monster_source'] || [])

    // 4. User data
    const skipUserProfiles = process.env.SKIP_USER_PROFILES === '1' || process.argv.includes('--skip-user-profiles')
    await importUsers(byModel['auth.user'] || [])
    if (skipUserProfiles) {
        console.log('\nSkipping user profiles import (flag enabled).')
        console.log('Skipping user-dependent data: user monsters, runes, artifacts (requires profiles).')
    } else {
        await importUserProfiles(byModel['bestiary.userprofile'] || [])
        await importUserMonsters(byModel['bestiary.usermonster'] || [])
        await importUserRunes(byModel['bestiary.userrune'] || [])
        await importUserArtifacts(byModel['bestiary.userartifact'] || [])
    }

    console.log('\n✓ Import complete!')
}

async function resetDatabase() {
    console.log('\nResetting existing data (deleteMany)...')
    // Delete in FK-safe order
    await prisma.monsterSkill.deleteMany({})
    await prisma.monsterSource.deleteMany({})
    await prisma.userArtifact.deleteMany({})
    await prisma.userRune.deleteMany({})
    await prisma.userMonster.deleteMany({})
    await prisma.userProfile.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.monster.deleteMany({})
    await prisma.skill.deleteMany({})
    await prisma.leaderSkill.deleteMany({})
    await prisma.skillEffect.deleteMany({})
    await prisma.source.deleteMany({})
    await prisma.gameItem.deleteMany({})
    console.log('✓ Data cleared')
}

async function importMonsters(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} monsters...`)

    // First pass: import all monsters without self-references
    let imported = 0
    let errors = 0

    for (const item of items) {
        try {
            const f = item.fields

            // Check if awakensFromId references exist
            let awakensFromId = null
            if (f.awakens_from) {
                const fromExists = await prisma.monster.findUnique({ where: { id: f.awakens_from } })
                if (fromExists) {
                    awakensFromId = f.awakens_from
                }
            }

            let awakensToId = null
            if (f.awakens_to) {
                const toExists = await prisma.monster.findUnique({ where: { id: f.awakens_to } })
                if (toExists) {
                    awakensToId = f.awakens_to
                }
            }

            // Upsert-like: update if com2usId exists, else create
            const existing = await prisma.monster.findUnique({ where: { com2usId: f.com2us_id } })
            if (existing) {
                await prisma.monster.update({
                    where: { com2usId: f.com2us_id },
                    data: {
                        name: f.name,
                        familyId: f.family_id,
                        skillGroupId: f.skill_group_id,
                        imageFilename: f.image_filename,
                        element: f.element,
                        archetype: f.archetype,
                        baseStars: f.base_stars,
                        naturalStars: f.natural_stars,
                        obtainable: f.obtainable !== false,
                        canAwaken: f.can_awaken !== false,
                        isAwakened: f.is_awakened === true,
                        awakenLevel: f.awaken_level || 0,
                        awakenBonus: f.awaken_bonus || '',
                        skillUpsToMax: f.skill_ups_to_max,
                        rawHp: f.raw_hp,
                        rawAttack: f.raw_attack,
                        rawDefense: f.raw_defense,
                        baseHp: f.base_hp,
                        baseAttack: f.base_attack,
                        baseDefense: f.base_defense,
                        maxLvlHp: f.max_lvl_hp,
                        maxLvlAttack: f.max_lvl_attack,
                        maxLvlDefense: f.max_lvl_defense,
                        speed: f.speed,
                        critRate: f.crit_rate,
                        critDamage: f.crit_damage,
                        resistance: f.resistance,
                        accuracy: f.accuracy,
                        homunculus: f.homunculus === true,
                        craftCost: f.craft_cost,
                        awakenMatsFireLow: f.awaken_mats_fire_low || 0,
                        awakenMatsFireMid: f.awaken_mats_fire_mid || 0,
                        awakenMatsFireHigh: f.awaken_mats_fire_high || 0,
                        awakenMatsWaterLow: f.awaken_mats_water_low || 0,
                        awakenMatsWaterMid: f.awaken_mats_water_mid || 0,
                        awakenMatsWaterHigh: f.awaken_mats_water_high || 0,
                        awakenMatsWindLow: f.awaken_mats_wind_low || 0,
                        awakenMatsWindMid: f.awaken_mats_wind_mid || 0,
                        awakenMatsWindHigh: f.awaken_mats_wind_high || 0,
                        awakenMatsLightLow: f.awaken_mats_light_low || 0,
                        awakenMatsLightMid: f.awaken_mats_light_mid || 0,
                        awakenMatsLightHigh: f.awaken_mats_light_high || 0,
                        awakenMatsDarkLow: f.awaken_mats_dark_low || 0,
                        awakenMatsDarkMid: f.awaken_mats_dark_mid || 0,
                        awakenMatsDarkHigh: f.awaken_mats_dark_high || 0,
                        awakenMatsMagicLow: f.awaken_mats_magic_low || 0,
                        awakenMatsMagicMid: f.awaken_mats_magic_mid || 0,
                        awakenMatsMagicHigh: f.awaken_mats_magic_high || 0,
                        source: false,
                        farmable: f.farmable === true,
                        fusionFood: f.fusion_food === true,
                        bestiarySlug: f.bestiary_slug,
                        awakensFromId,
                        awakensToId,
                        leaderSkillId: f.leader_skill || null,
                    },
                })
            } else {
                await prisma.monster.create({
                    data: {
                        name: f.name,
                        com2usId: f.com2us_id,
                        familyId: f.family_id,
                        skillGroupId: f.skill_group_id,
                        imageFilename: f.image_filename,
                        element: f.element,
                        archetype: f.archetype,
                        baseStars: f.base_stars,
                        naturalStars: f.natural_stars,
                        obtainable: f.obtainable !== false,
                        canAwaken: f.can_awaken !== false,
                        isAwakened: f.is_awakened === true,
                        awakenLevel: f.awaken_level || 0,
                        awakenBonus: f.awaken_bonus || '',
                        skillUpsToMax: f.skill_ups_to_max,
                        rawHp: f.raw_hp,
                        rawAttack: f.raw_attack,
                        rawDefense: f.raw_defense,
                        baseHp: f.base_hp,
                        baseAttack: f.base_attack,
                        baseDefense: f.base_defense,
                        maxLvlHp: f.max_lvl_hp,
                        maxLvlAttack: f.max_lvl_attack,
                        maxLvlDefense: f.max_lvl_defense,
                        speed: f.speed,
                        critRate: f.crit_rate,
                        critDamage: f.crit_damage,
                        resistance: f.resistance,
                        accuracy: f.accuracy,
                        homunculus: f.homunculus === true,
                        craftCost: f.craft_cost,
                        awakenMatsFireLow: f.awaken_mats_fire_low || 0,
                        awakenMatsFireMid: f.awaken_mats_fire_mid || 0,
                        awakenMatsFireHigh: f.awaken_mats_fire_high || 0,
                        awakenMatsWaterLow: f.awaken_mats_water_low || 0,
                        awakenMatsWaterMid: f.awaken_mats_water_mid || 0,
                        awakenMatsWaterHigh: f.awaken_mats_water_high || 0,
                        awakenMatsWindLow: f.awaken_mats_wind_low || 0,
                        awakenMatsWindMid: f.awaken_mats_wind_mid || 0,
                        awakenMatsWindHigh: f.awaken_mats_wind_high || 0,
                        awakenMatsLightLow: f.awaken_mats_light_low || 0,
                        awakenMatsLightMid: f.awaken_mats_light_mid || 0,
                        awakenMatsLightHigh: f.awaken_mats_light_high || 0,
                        awakenMatsDarkLow: f.awaken_mats_dark_low || 0,
                        awakenMatsDarkMid: f.awaken_mats_dark_mid || 0,
                        awakenMatsDarkHigh: f.awaken_mats_dark_high || 0,
                        awakenMatsMagicLow: f.awaken_mats_magic_low || 0,
                        awakenMatsMagicMid: f.awaken_mats_magic_mid || 0,
                        awakenMatsMagicHigh: f.awaken_mats_magic_high || 0,
                        source: false,
                        farmable: f.farmable === true,
                        fusionFood: f.fusion_food === true,
                        bestiarySlug: f.bestiary_slug,
                        awakensFromId,
                        awakensToId,
                        leaderSkillId: f.leader_skill || null,
                    },
                })
            }

            imported++
            if (imported % 100 === 0) {
                console.log(`  Imported ${imported}/${items.length}...`)
            }
        } catch (error) {
            errors++
            console.error(`  Error importing monster ${item.pk}:`, error)
        }
    }

    console.log(`  ✓ Imported: ${imported}, Errors: ${errors}`)
}

async function importSkills(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} skills...`)

    let imported = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Upsert-like by com2usId
            const existing = await prisma.skill.findUnique({ where: { com2usId: f.com2us_id } })
            if (existing) {
                await prisma.skill.update({
                    where: { com2usId: f.com2us_id },
                    data: {
                        name: f.name,
                        description: f.description,
                        slot: f.slot,
                        cooltime: f.cooltime,
                        hits: f.hits,
                        passive: f.passive === true,
                        aoe: f.aoe === true,
                        random: f.random === true,
                        maxLevel: f.max_level,
                        iconFilename: f.icon_filename,
                        levelProgressDesc: f.level_progress_description,
                        multiplierFormula: f.multiplier_formula,
                        multiplierFormulaRaw: f.multiplier_formula_raw,
                    },
                })
            } else {
                await prisma.skill.create({
                    data: {
                        name: f.name,
                        description: f.description,
                        slot: f.slot,
                        cooltime: f.cooltime,
                        hits: f.hits,
                        passive: f.passive === true,
                        aoe: f.aoe === true,
                        random: f.random === true,
                        maxLevel: f.max_level,
                        iconFilename: f.icon_filename,
                        levelProgressDesc: f.level_progress_description,
                        multiplierFormula: f.multiplier_formula,
                        multiplierFormulaRaw: f.multiplier_formula_raw,
                        com2usId: f.com2us_id,
                    },
                })
            }
            imported++
        } catch (error) {
            console.error(`Error importing skill ${item.pk}:`, error)
        }
    }
    console.log(`  ✓ Imported: ${imported}`)
}

// Leader skill mappings
const attributeMap: Record<number, string> = {
    1: 'HP',
    2: 'Attack Power',
    3: 'Defense',
    4: 'Attack Speed',
    5: 'Critical Rate',
    6: 'Critical DMG',
    7: 'Resistance',
    8: 'Accuracy',
}

const areaMap: Record<number, string> = {
    1: 'General',
    2: 'Dungeon',
    3: 'Element',
    4: 'Arena',
    5: 'Guild',
}

async function importLeaderSkills(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} leader skills...`)

    let imported = 0
    for (const item of items) {
        try {
            const f = item.fields

            await prisma.leaderSkill.create({
                data: {
                    attribute: attributeMap[f.attribute] || String(f.attribute),
                    amount: f.amount,
                    area: areaMap[f.area] || String(f.area),
                    element: f.element || 'pure',
                },
            })
            imported++
        } catch (error) {
            console.error(`Error importing leader skill ${item.pk}:`, error)
        }
    }
    console.log(`  ✓ Imported: ${imported}`)
}

async function importGameItems(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} game items...`)

    let imported = 0
    let skipped = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Use upsert to handle duplicates
            await prisma.gameItem.upsert({
                where: { com2usId: f.com2us_id },
                update: {
                    name: f.name,
                    icon: f.icon,
                    category: f.category,
                    description: f.description,
                    sellValue: f.sell_value || 0,
                },
                create: {
                    com2usId: f.com2us_id,
                    name: f.name,
                    icon: f.icon,
                    category: f.category,
                    description: f.description,
                    sellValue: f.sell_value || 0,
                },
            })
            imported++

            if (imported % 20 === 0) {
                console.log(`  Imported ${imported}/${items.length}...`)
            }
        } catch (error) {
            skipped++
        }
    }
    console.log(`  ✓ Imported: ${imported}, Skipped: ${skipped}`)
}

async function importSkillEffects(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} skill effects...`)

    let imported = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Map type integer to string
            const typeMap: Record<number, string> = {
                '-1': 'Debuff',
                '0': 'Neutral',
                '1': 'Buff',
            }
            const typeString = typeMap[f.type] || String(f.type)

            await prisma.skillEffect.create({
                data: {
                    type: typeString,
                    isBuff: f.is_buff === true,
                    name: f.name,
                    description: f.description,
                    iconFilename: f.icon_filename,
                },
            })
            imported++
        } catch (error) {
            console.error(`Error importing skill effect ${item.pk}:`, error)
        }
    }
    console.log(`  ✓ Imported: ${imported}`)
}

async function importSources(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} sources...`)

    let imported = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Upsert-like by name (name is not unique -> findFirst, then update by id)
            const existing = await prisma.source.findFirst({ where: { name: f.name } })
            if (existing) {
                await prisma.source.update({
                    where: { id: existing.id },
                    data: {
                        name: f.name,
                        description: f.description,
                        farmableSource: f.farmable_source === true,
                    },
                })
            } else {
                await prisma.source.create({
                    data: {
                        name: f.name,
                        description: f.description,
                        farmableSource: f.farmable_source === true,
                    },
                })
            }
            imported++
        } catch (error) {
            console.error(`Error importing source ${item.pk}:`, error)
        }
    }
    console.log(`  ✓ Imported: ${imported}`)
}

async function importUsers(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} users...`)

    let imported = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Upsert-like by username
            const existing = await prisma.user.findUnique({ where: { username: f.username } })
            if (existing) {
                await prisma.user.update({
                    where: { username: f.username },
                    data: {
                        username: f.username,
                        email: f.email || `${f.username}@example.com`,
                        password: f.password || '', // Store hashed password
                    },
                })
            } else {
                await prisma.user.create({
                    data: {
                        username: f.username,
                        email: f.email || `${f.username}@example.com`,
                        password: f.password || '', // Store hashed password
                    },
                })
            }
            imported++
        } catch (error) {
            console.error(`Error importing user ${item.pk}:`, error)
        }
    }
    console.log(`  ✓ Imported: ${imported}`)
}

async function importUserProfiles(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} user profiles...`)

    let imported = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Get user ID from username
            const username = Array.isArray(f.user) ? f.user[0] : f.user
            const user = await prisma.user.findUnique({ where: { username: String(username) } })

            if (!user) {
                console.log(`  Skipping profile ${item.pk}: User not found`)
                continue
            }

            // Upsert-like by userId (userId not unique -> findFirst, then update by id)
            const existing = await prisma.userProfile.findFirst({ where: { userId: user.id } })
            if (existing) {
                await prisma.userProfile.update({
                    where: { id: existing.id },
                    data: {
                        userId: user.id,
                        wizardId: f.wizard_id || null,
                        wizardName: f.wizard_name || '',
                        importSource: f.import_source || '',
                        lastImportDate: f.last_import_date ? new Date(f.last_import_date) : undefined,
                    },
                })
            } else {
                await prisma.userProfile.create({
                    data: {
                        userId: user.id,
                        wizardId: f.wizard_id || null,
                        wizardName: f.wizard_name || '',
                        importSource: f.import_source || '',
                        lastImportDate: f.last_import_date ? new Date(f.last_import_date) : undefined,
                    },
                })
            }
            imported++
        } catch (error) {
            console.error(`Error importing user profile ${item.pk}:`, error)
        }
    }
    console.log(`  ✓ Imported: ${imported}`)
}

async function importUserMonsters(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} user monsters...`)

    let imported = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Upsert-like by (profileId, com2usId)
            const existing = await prisma.userMonster.findFirst({
                where: { profileId: f.profile, com2usId: f.com2us_id?.toString() },
            })
            if (existing) {
                await prisma.userMonster.update({
                    where: { id: existing.id },
                    data: {
                        profileId: f.profile,
                        monsterId: f.monster,
                        level: f.level || 1,
                        grade: f.grade || 1,
                        awakened: f.awakened === true,
                        skillUps: f.skill_ups || 0,
                        locked: f.locked === true,
                        com2usId: f.com2us_id?.toString(),
                        hp: f.hp || 0,
                        attack: f.attack || 0,
                        defense: f.defense || 0,
                        speed: f.speed || 0,
                        critRate: f.crit_rate || 0,
                        critDamage: f.crit_damage || 0,
                        resistance: f.resistance || 0,
                        accuracy: f.accuracy || 0,
                        importDate: f.import_date ? new Date(f.import_date) : new Date(),
                    },
                })
            } else {
                await prisma.userMonster.create({
                    data: {
                        profileId: f.profile,
                        monsterId: f.monster,
                        level: f.level || 1,
                        grade: f.grade || 1,
                        awakened: f.awakened === true,
                        skillUps: f.skill_ups || 0,
                        locked: f.locked === true,
                        com2usId: f.com2us_id?.toString(),
                        hp: f.hp || 0,
                        attack: f.attack || 0,
                        defense: f.defense || 0,
                        speed: f.speed || 0,
                        critRate: f.crit_rate || 0,
                        critDamage: f.crit_damage || 0,
                        resistance: f.resistance || 0,
                        accuracy: f.accuracy || 0,
                        importDate: f.import_date ? new Date(f.import_date) : new Date(),
                    },
                })
            }
            imported++

            if (imported % 100 === 0) {
                console.log(`  Imported ${imported}/${items.length}...`)
            }
        } catch (error) {
            console.error(`Error importing user monster ${item.pk}:`, error)
        }
    }
    console.log(`  ✓ Imported: ${imported}`)
}

async function importUserRunes(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} user runes...`)

    let imported = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Upsert-like by (profileId, com2usId)
            const existing = await prisma.userRune.findFirst({
                where: { profileId: f.profile, com2usId: f.com2us_id?.toString() },
            })
            if (existing) {
                await prisma.userRune.update({
                    where: { id: existing.id },
                    data: {
                        profileId: f.profile,
                        equippedMonsterId: f.equipped_monster,
                        slot: f.slot,
                        setId: f.set_id,
                        grade: f.grade || 1,
                        level: f.level || 0,
                        mainStatType: f.main_stat_type,
                        mainStatValue: f.main_stat_value,
                        innateStatType: f.innate_stat_type,
                        innateStatValue: f.innate_stat_value,
                        substat1Type: f.substat_1_type,
                        substat1Value: f.substat_1_value,
                        substat2Type: f.substat_2_type,
                        substat2Value: f.substat_2_value,
                        substat3Type: f.substat_3_type,
                        substat3Value: f.substat_3_value,
                        substat4Type: f.substat_4_type,
                        substat4Value: f.substat_4_value,
                        efficiency: f.efficiency || 0,
                        efficiencyMax: f.efficiency_max || 0,
                        locked: f.locked === true,
                        com2usId: f.com2us_id?.toString(),
                        importDate: f.import_date ? new Date(f.import_date) : new Date(),
                    },
                })
            } else {
                await prisma.userRune.create({
                    data: {
                        profileId: f.profile,
                        equippedMonsterId: f.equipped_monster,
                        slot: f.slot,
                        setId: f.set_id,
                        grade: f.grade || 1,
                        level: f.level || 0,
                        mainStatType: f.main_stat_type,
                        mainStatValue: f.main_stat_value,
                        innateStatType: f.innate_stat_type,
                        innateStatValue: f.innate_stat_value,
                        substat1Type: f.substat_1_type,
                        substat1Value: f.substat_1_value,
                        substat2Type: f.substat_2_type,
                        substat2Value: f.substat_2_value,
                        substat3Type: f.substat_3_type,
                        substat3Value: f.substat_3_value,
                        substat4Type: f.substat_4_type,
                        substat4Value: f.substat_4_value,
                        efficiency: f.efficiency || 0,
                        efficiencyMax: f.efficiency_max || 0,
                        locked: f.locked === true,
                        com2usId: f.com2us_id?.toString(),
                        importDate: f.import_date ? new Date(f.import_date) : new Date(),
                    },
                })
            }
            imported++

            if (imported % 100 === 0) {
                console.log(`  Imported ${imported}/${items.length}...`)
            }
        } catch (error) {
            console.error(`Error importing user rune ${item.pk}:`, error)
        }
    }
    console.log(`  ✓ Imported: ${imported}`)
}

async function importUserArtifacts(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} user artifacts...`)

    let imported = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Upsert-like by (profileId, com2usId)
            const existing = await prisma.userArtifact.findFirst({
                where: { profileId: f.profile, com2usId: f.com2us_id?.toString() },
            })
            if (existing) {
                await prisma.userArtifact.update({
                    where: { id: existing.id },
                    data: {
                        profileId: f.profile,
                        equippedMonsterId: f.equipped_monster,
                        type: f.artifact_type,
                        element: f.element,
                        archetype: f.archetype,
                        grade: f.grade || 1,
                        level: f.level || 0,
                        mainStatType: f.main_stat_type,
                        mainStatValue: f.main_stat_value,
                        substat1Type: f.substat_1_type,
                        substat1Value: f.substat_1_value,
                        substat2Type: f.substat_2_type,
                        substat2Value: f.substat_2_value,
                        substat3Type: f.substat_3_type,
                        substat3Value: f.substat_3_value,
                        substat4Type: f.substat_4_type,
                        substat4Value: f.substat_4_value,
                        locked: f.locked === true,
                        com2usId: f.com2us_id?.toString(),
                        importDate: f.import_date ? new Date(f.import_date) : new Date(),
                    },
                })
            } else {
                await prisma.userArtifact.create({
                    data: {
                        profileId: f.profile,
                        equippedMonsterId: f.equipped_monster,
                        type: f.artifact_type,
                        element: f.element,
                        archetype: f.archetype,
                        grade: f.grade || 1,
                        level: f.level || 0,
                        mainStatType: f.main_stat_type,
                        mainStatValue: f.main_stat_value,
                        substat1Type: f.substat_1_type,
                        substat1Value: f.substat_1_value,
                        substat2Type: f.substat_2_type,
                        substat2Value: f.substat_2_value,
                        substat3Type: f.substat_3_type,
                        substat3Value: f.substat_3_value,
                        substat4Type: f.substat_4_type,
                        substat4Value: f.substat_4_value,
                        locked: f.locked === true,
                        com2usId: f.com2us_id?.toString(),
                        importDate: f.import_date ? new Date(f.import_date) : new Date(),
                    },
                })
            }
            imported++
        } catch (error) {
            console.error(`Error importing user artifact ${item.pk}:`, error)
        }
    }
    console.log(`  ✓ Imported: ${imported}`)
}

async function importMonsterSkills(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} monster skills (junction)...`)

    let imported = 0
    let skipped = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Check if monster and skill exist
            const monsterExists = await prisma.monster.findUnique({ where: { id: f.monster } })
            const skillExists = await prisma.skill.findUnique({ where: { id: f.skill } })

            if (!monsterExists || !skillExists) {
                skipped++
                continue
            }

            await prisma.monsterSkill.create({
                data: {
                    monsterId: f.monster,
                    skillId: f.skill,
                },
            })
            imported++

            if (imported % 1000 === 0) {
                console.log(`  Imported ${imported}/${items.length}...`)
            }
        } catch (error) {
            skipped++
        }
    }
    console.log(`  ✓ Imported: ${imported}, Skipped: ${skipped}`)
}

async function importMonsterSources(items: DjangoFixture[]) {
    if (items.length === 0) return

    console.log(`\nImporting ${items.length} monster sources...`)

    let imported = 0
    let skipped = 0
    for (const item of items) {
        try {
            const f = item.fields

            // Check if monster and source exist
            const monsterExists = await prisma.monster.findUnique({ where: { id: f.monster } })
            const sourceExists = await prisma.source.findUnique({ where: { id: f.source_id } })

            if (!monsterExists || !sourceExists) {
                skipped++
                continue
            }

            await prisma.monsterSource.create({
                data: {
                    monsterId: f.monster,
                    sourceId: f.source_id,
                },
            })
            imported++
        } catch (error) {
            skipped++
        }
    }
    console.log(`  ✓ Imported: ${imported}, Skipped: ${skipped}`)
}

async function main() {
    const jsonFile = process.argv[2] || '../../../pushsw/backup_django_20251027_171130.json'
    const shouldReset = process.env.RESET === '1' || process.argv.includes('--reset')

    console.log('Starting data import...')
    console.log('='.repeat(50))
    if (shouldReset) {
        await resetDatabase()
    }

    await importDjangoData(jsonFile)

    await prisma.$disconnect()
}

main()
    .catch(console.error)
    .finally(() => process.exit(0))
