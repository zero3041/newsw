import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkImportedData() {
    console.log('Checking imported data...')
    console.log('='.repeat(50))

    const leaderSkills = await prisma.leaderSkill.count()
    const skills = await prisma.skill.count()
    const gameItems = await prisma.gameItem.count()
    const monsters = await prisma.monster.count()
    const monsterSkills = await prisma.monsterSkill.count()
    const sources = await prisma.source.count()
    const skillEffects = await prisma.skillEffect.count()

    const users = await prisma.user.count()
    const userProfiles = await prisma.userProfile.count()
    const userMonsters = await prisma.userMonster.count()
    const userRunes = await prisma.userRune.count()
    const userArtifacts = await prisma.userArtifact.count()

    console.log('\n📊 Bestiary Data:')
    console.log(`  Leader Skills: ${leaderSkills} (expected: 250)`)
    console.log(`  Skills: ${skills} (expected: 4808)`)
    console.log(`  Game Items: ${gameItems} (expected: 125)`)
    console.log(`  Monsters: ${monsters} (expected: 2770)`)
    console.log(`  Monster Skills (junction): ${monsterSkills} (expected: ~18000)`)
    console.log(`  Sources: ${sources}`)
    console.log(`  Skill Effects: ${skillEffects} (expected: 128)`)

    console.log('\n👤 User Data:')
    console.log(`  Users: ${users} (expected: 3)`)
    console.log(`  User Profiles: ${userProfiles} (expected: 3)`)
    console.log(`  User Monsters: ${userMonsters} (expected: 1344)`)
    console.log(`  User Runes: ${userRunes} (expected: 8532)`)
    console.log(`  User Artifacts: ${userArtifacts} (expected: 4073)`)

    console.log('\n📈 Summary:')
    const totalImported =
        leaderSkills +
        skills +
        gameItems +
        monsters +
        monsterSkills +
        sources +
        skillEffects +
        users +
        userProfiles +
        userMonsters +
        userRunes +
        userArtifacts
    const totalExpected = 250 + 4808 + 125 + 2770 + 18000 + 0 + 128 + 3 + 3 + 1344 + 8532 + 4073
    console.log(`  Total imported: ${totalImported}`)
    console.log(`  Expected total: ~${totalExpected}`)
    console.log(`  Completion: ${((totalImported / totalExpected) * 100).toFixed(1)}%`)

    // Show sample data
    console.log('\n🎯 Sample Data:')
    const sampleMonster = await prisma.monster.findFirst()
    console.log(`  Sample Monster: ${sampleMonster?.name || 'None'}`)

    const sampleSkill = await prisma.skill.findFirst()
    console.log(`  Sample Skill: ${sampleSkill?.name || 'None'}`)

    await prisma.$disconnect()
}

checkImportedData()
    .catch(console.error)
    .finally(() => process.exit(0))
