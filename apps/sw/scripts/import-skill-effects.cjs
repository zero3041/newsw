const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Data skill effects từ backup SQL
const skillEffectsData = [
    {
        id: 1,
        type: 1,
        is_buff: true,
        name: 'Increase ATK',
        description: "The target's Attack Power will be increased by 50%.",
        icon_filename: 'buff_attack_up.png',
    },
    {
        id: 2,
        type: 1,
        is_buff: true,
        name: 'Increase DEF',
        description: "The target's defense will be increased by 70%.",
        icon_filename: 'buff_defence_up.png',
    },
    {
        id: 3,
        type: 1,
        is_buff: true,
        name: 'Increase CRI Rate',
        description: "The target's Critical Rate will be increased by 30%.",
        icon_filename: 'buff_crit_up.png',
    },
    {
        id: 4,
        type: 1,
        is_buff: true,
        name: 'Increase CRI Resist',
        description: 'Critical Hit Rate against the monster is reduced by 50%',
        icon_filename: 'buff_crit_down.png',
    },
    {
        id: 5,
        type: 1,
        is_buff: true,
        name: 'Increase SPD',
        description: "The target's Attack Speed will be increased by 30%.",
        icon_filename: 'buff_speed.png',
    },
    {
        id: 6,
        type: 1,
        is_buff: true,
        name: 'Recovery',
        description: "The target's HP will be recovered by 15% on each turn.",
        icon_filename: 'buff_heal.png',
    },
    {
        id: 7,
        type: 1,
        is_buff: true,
        name: 'Counter',
        description: 'When attacked, the target will counterattack to inflict 75% of the Attack Power as damage.',
        icon_filename: 'buff_counter.png',
    },
    {
        id: 8,
        type: 1,
        is_buff: true,
        name: 'Immunity',
        description: 'The target will gain immunity against all harmful effects.',
        icon_filename: 'buff_immune.png',
    },
    {
        id: 9,
        type: 1,
        is_buff: true,
        name: 'Invincible',
        description: 'The target will be invincible and receive no damage.',
        icon_filename: 'buff_invinciblity.png',
    },
    {
        id: 10,
        type: 1,
        is_buff: true,
        name: 'Reflect DMG',
        description: 'The target will return 30% of the incoming damage to the attacker when attacked.',
        icon_filename: 'buff_reflect.png',
    },
    {
        id: 11,
        type: 1,
        is_buff: true,
        name: 'Shield',
        description: 'The Shield will absorb a fixed amount of damage.',
        icon_filename: 'buff_shield.png',
    },
    {
        id: 12,
        type: 1,
        is_buff: true,
        name: 'Endure',
        description: "The target's HP will not drop below 1 even when attacked.",
        icon_filename: 'buff_endure.png',
    },
    {
        id: 13,
        type: 1,
        is_buff: true,
        name: 'Defend',
        description:
            'The caster of this skill will receive half of the damage inflicted on the escorted target while making the damage dealt to the defended target to 0 and counterattack the enemy target.',
        icon_filename: 'buff_protect.png',
    },
    {
        id: 14,
        type: 1,
        is_buff: true,
        name: 'Protect Soul',
        description: 'The target will revive with 30% HP when defeated.',
        icon_filename: 'buff_soul_protect.png',
    },
    {
        id: 15,
        type: 0,
        is_buff: true,
        name: 'Increase ATB',
        description:
            'The ATK bar of ally monsters is filled by a set amount. This allows ally monsters to attack again sooner.',
        icon_filename: '',
    },
    {
        id: 16,
        type: -1,
        is_buff: false,
        name: 'Glancing Hit',
        description:
            'The chance of landing a glancing hit will be increased by 50%. Glancing Hits will decrease the damage by 30% and if the attacker has attribute disadvantage, damage will be decreased additionally by 16%.',
        icon_filename: 'debuff_glancing_hit.png',
    },
    {
        id: 17,
        type: -1,
        is_buff: false,
        name: 'Decrease ATK',
        description: "The target's Attack Power will be decreased by 50%.",
        icon_filename: 'debuff_attack_down.png',
    },
    {
        id: 18,
        type: -1,
        is_buff: false,
        name: 'Decrease DEF',
        description: "The target's Defense will be decreased by 70%.",
        icon_filename: 'debuff_defence_down.png',
    },
    {
        id: 19,
        type: -1,
        is_buff: false,
        name: 'Decrease SPD',
        description: "The target's Attack Speed will be decreased by 30%.",
        icon_filename: 'debuff_slow.png',
    },
    {
        id: 20,
        type: -1,
        is_buff: false,
        name: 'Beneficial Effects Blocked',
        description: 'All beneficial effects will be blocked',
        icon_filename: 'debuff_block_buffs.png',
    },
    {
        id: 21,
        type: -1,
        is_buff: false,
        name: 'Bomb',
        description:
            "When remaining turns reach 0, the bomb explodes to deal damage that ignores Defense and stuns for 1 turn. The damage is affected by the caster's Attack Power, and the chance of stunning is affected by the caster's Accuracy and the target's Resistance.",
        icon_filename: 'debuff_bomb.png',
    },
    {
        id: 22,
        type: -1,
        is_buff: false,
        name: 'Provoke',
        description: 'The target is forced to attack the Monster that is provoked.',
        icon_filename: 'debuff_provoke.png',
    },
    {
        id: 23,
        type: -1,
        is_buff: false,
        name: 'Sleep',
        description:
            "The target will be put to sleep and won't be able to attack. The sleeping target wakes up when attacked or damaged. In addition, you won't receive glancing Hits when you are attacked.",
        icon_filename: 'debuff_sleep.png',
    },
    {
        id: 24,
        type: -1,
        is_buff: false,
        name: 'Continuous DMG',
        description:
            "The target's HP will be damaged by 5% of the MAX HP whenever the target's turn returns. (Ignores Defense)",
        icon_filename: 'debuff_dot.png',
    },
    {
        id: 25,
        type: -1,
        is_buff: false,
        name: 'Freeze',
        description: "The target will be frozen and won't be able to attack.",
        icon_filename: 'debuff_freeze.png',
    },
    {
        id: 26,
        type: -1,
        is_buff: false,
        name: 'Stun',
        description: "The target will be stunned and won't be able to attack.",
        icon_filename: 'debuff_stun.png',
    },
    {
        id: 27,
        type: -1,
        is_buff: false,
        name: 'Disturb HP Recovery',
        description: "The target's HP cannot be recovered.",
        icon_filename: 'debuff_block_heal.png',
    },
    {
        id: 28,
        type: -1,
        is_buff: false,
        name: 'Silence',
        description: 'Skills with cooldowns will be locked. (Passive skills not included)',
        icon_filename: 'debuff_silence.png',
    },
    {
        id: 29,
        type: -1,
        is_buff: false,
        name: 'Brand',
        description: 'The target will receive 25% increased damage.',
        icon_filename: 'debuff_brand.png',
    },
    {
        id: 30,
        type: -1,
        is_buff: false,
        name: 'Decrease ATB',
        description: "The target's Attack Bar will be decreased by 30%.",
        icon_filename: 'debuff_atb_down.png',
    },
    {
        id: 31,
        type: -1,
        is_buff: false,
        name: 'Block Beneficial Effects',
        description: 'All beneficial effects will be blocked.',
        icon_filename: 'debuff_block_buffs.png',
    },
    {
        id: 32,
        type: -1,
        is_buff: false,
        name: 'Oblivion',
        description: 'Passive skills will be disabled.',
        icon_filename: 'debuff_oblivion.png',
    },
    {
        id: 33,
        type: -1,
        is_buff: false,
        name: 'Unrecoverable',
        description: "The target's HP cannot be recovered.",
        icon_filename: 'debuff_block_heal.png',
    },
    {
        id: 34,
        type: -1,
        is_buff: false,
        name: 'Suppression',
        description:
            'The HP is reduced by 50% of the MAX HP if the target uses a skill with cooldown time, and the MAX cooldown time of the used skill is increased by 3 turns.',
        icon_filename: 'debuff_suppress.png',
    },
    {
        id: 35,
        type: -1,
        is_buff: false,
        name: 'Absorb ATB',
        description: "The target's Attack Bar will be absorbed by 35%.",
        icon_filename: 'debuff_atb_absorb.png',
    },
    {
        id: 36,
        type: -1,
        is_buff: false,
        name: 'Irresistible',
        description: 'The target cannot resist any types of harmful effects.',
        icon_filename: 'debuff_irresistible.png',
    },
]

async function importSkillEffects() {
    try {
        console.log('Starting import of skill effects...')

        // Clear existing data
        await prisma.skillEffectDetail.deleteMany()
        await prisma.skillEffect.deleteMany()

        // Import skill effects
        for (const effectData of skillEffectsData) {
            await prisma.skillEffect.create({
                data: {
                    id: effectData.id,
                    name: effectData.name,
                    iconFilename: effectData.icon_filename || null,
                    description: effectData.description,
                    isBuff: effectData.is_buff,
                    type: effectData.type === 1 ? 'buff' : effectData.type === -1 ? 'debuff' : 'neutral',
                },
            })
        }

        console.log(`Successfully imported ${skillEffectsData.length} skill effects`)

        // Test query
        const count = await prisma.skillEffect.count()
        console.log(`Total skill effects in database: ${count}`)
    } catch (error) {
        console.error('Error importing skill effects:', error)
    } finally {
        await prisma.$disconnect()
    }
}

importSkillEffects()
