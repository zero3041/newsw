export interface MonsterFilters {
    name?: string
    element?: string[]
    archetype?: string[]
    natural_stars_min?: number
    natural_stars_max?: number
}

export interface SkillEffect {
    id: number
    name: string
    iconFilename?: string
    description?: string
    isBuff: boolean
    type?: string
}

export interface SkillEffectDetail {
    id: number
    skillId: number
    effectId: number
    effect?: SkillEffect
    aoe: boolean
    singleTarget: boolean
    selfEffect: boolean
    chance?: number
    onCrit: boolean
    onDeath: boolean
    random: boolean
    quantity?: number
    all: boolean
    selfHp: boolean
    targetHp: boolean
    damage?: number
    note?: string
}

export interface SkillUpgrade {
    id: number
    skillId: number
    effect: string
    amount: number
}

export interface Skill {
    id: number
    name: string
    description?: string
    slot: number
    cooltime?: number
    hits: number
    passive: boolean
    aoe: boolean
    random: boolean
    maxLevel: number
    iconFilename?: string
    levelProgressDesc?: string
    multiplierFormula?: string
    multiplierFormulaRaw?: string
    upgrades?: SkillUpgrade[]
    effectDetails?: SkillEffectDetail[]
}

export interface LeaderSkill {
    id: number
    attribute: string
    amount: number
    area: string
    element?: string
    iconFilename?: string
}

export interface Source {
    id: number
    name: string
    description?: string
    iconFilename?: string
    farmableSource: boolean
}

export interface FusionIngredient {
    id: number
    name: string
    element: string
    imageFilename?: string
    bestiarySlug?: string
}

export interface Fusion {
    id: number
    cost: number
    ingredients?: FusionIngredient[]
}

export interface Monster {
    id: number
    name: string
    element: string
    archetype: string
    baseStars?: number
    naturalStars: number
    imageFilename?: string
    bestiarySlug?: string
    isAwakened: boolean
    awakenLevel: number
    awakenBonus?: string
    familyId?: number
    com2usId?: number
    // Base stats (raw)
    rawHp?: number
    rawAttack?: number
    rawDefense?: number
    // Stats at base stars
    baseHp?: number
    baseAttack?: number
    baseDefense?: number
    // Stats at 6⭐ lvl 40
    maxLvlHp?: number
    maxLvlAttack?: number
    maxLvlDefense?: number
    speed?: number
    critRate?: number
    critDamage?: number
    resistance?: number
    accuracy?: number
    // Relations
    leaderSkill?: LeaderSkill
    skills?: Skill[]
    monstersSkills?: Array<{
        skill: Skill
    }>
    awakensTo?: {
        id: number
        name: string
        element: string
        imageFilename?: string
        bestiarySlug?: string
    }
    awakensFrom?: {
        id: number
        name: string
        element: string
        imageFilename?: string
        bestiarySlug?: string
    }
    transformsTo?: {
        id: number
        name: string
        imageFilename?: string
        bestiarySlug?: string
    }
    source?: Source[]
    fusion?: Fusion
    fusionIngredientFor?: Fusion[]
    // Awakening materials
    canAwaken?: boolean
    awakenMatsFireLow?: number
    awakenMatsFireMid?: number
    awakenMatsFireHigh?: number
    awakenMatsWaterLow?: number
    awakenMatsWaterMid?: number
    awakenMatsWaterHigh?: number
    awakenMatsWindLow?: number
    awakenMatsWindMid?: number
    awakenMatsWindHigh?: number
    awakenMatsLightLow?: number
    awakenMatsLightMid?: number
    awakenMatsLightHigh?: number
    awakenMatsDarkLow?: number
    awakenMatsDarkMid?: number
    awakenMatsDarkHigh?: number
    awakenMatsMagicLow?: number
    awakenMatsMagicMid?: number
    awakenMatsMagicHigh?: number
    // Skill ups
    skillUpsToMax?: number
    // Flags
    obtainable: boolean
    farmable?: boolean
    fusionFood?: boolean
    homunculus?: boolean
}

export interface MonsterFamily {
    baseMonster: Monster
    variants: Monster[]
}

export interface ApiResponse<T> {
    results: T[]
    count: number
    page: number
    limit: number
    totalPages: number
}
