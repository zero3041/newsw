import { api } from './api'

export interface Monster {
    id: number
    name: string
    com2usId?: number
    familyId?: number
    skillGroupId?: number
    imageFilename?: string
    element: string
    archetype: string
    baseStars: number
    naturalStars: number
    obtainable: boolean
    canAwaken: boolean
    isAwakened: boolean
    awakenLevel: number
    awakenBonus?: string
    skillUpsToMax?: number
    rawHp?: number
    rawAttack?: number
    rawDefense?: number
    baseHp?: number
    baseAttack?: number
    baseDefense?: number
    maxLvlHp?: number
    maxLvlAttack?: number
    maxLvlDefense?: number
    speed?: number
    critRate?: number
    critDamage?: number
    resistance?: number
    accuracy?: number
    homunculus: boolean
    craftCost?: number
    farmable: boolean
    fusionFood: boolean
    bestiarySlug?: string
    awakensFromId?: number
    awakensToId?: number
    leaderSkillId?: number
    createdAt: string
    updatedAt: string
    leaderSkill?: LeaderSkill
    monstersSkills?: MonsterSkill[]
    awakensFrom?: Monster
    awakensTo?: Monster
}

export interface MonsterSkill {
    monsterId: number
    skillId: number
    monster: Monster
    skill: Skill
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
    com2usId?: number
    createdAt: string
    updatedAt: string
    upgrades?: SkillUpgrade[]
    scalingStats?: SkillScalingStats[]
    effectDetails?: SkillEffectDetail[]
}

export interface SkillUpgrade {
    id: number
    skillId: number
    effect: string
    amount: number
    skill: Skill
}

export interface SkillScalingStats {
    skillId: number
    stat: number
    skill: Skill
}

export interface LeaderSkill {
    id: number
    attribute: string
    amount: number
    area: string
    element: string
    monsters?: Monster[]
}

export interface SkillEffect {
    id: number
    name: string
    iconFilename?: string
    description?: string
    isBuff: boolean
    type: string
    details?: SkillEffectDetail[]
}

export interface SkillEffectDetail {
    id: number
    skillId: number
    effectId: number
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
    skill: Skill
    effect: SkillEffect
}

export interface ApiResponse<T> {
    results: T[]
    count: number
    page: number
    limit: number
    totalPages: number
}

// API functions
export const bestiaryApi = {
    // Monsters
    getMonsters: (params?: {
        page?: number
        limit?: number
        search?: string
        elements?: string // Comma-separated list of elements
        archetypes?: string // Comma-separated list of archetypes
        natural_stars_min?: string
        natural_stars_max?: string
        sort?: string
    }) => ({
        queryKey: ['monsters', params],
        queryFn: () => api.get<ApiResponse<Monster>>('/monsters', { params }).then(res => res.data),
    }),

    getMonster: (id: number) => ({
        queryKey: ['monster', id],
        queryFn: () => api.get<Monster>(`/monsters/${id}`).then(res => res.data),
    }),

    getMonsterBySlug: (slug: string) => ({
        queryKey: ['monster', 'slug', slug],
        queryFn: () => api.get<Monster>(`/monsters/slug/${slug}`).then(res => res.data),
    }),

    // Skills
    getSkills: (params?: { page?: number; limit?: number; search?: string; slot?: string }) => ({
        queryKey: ['skills', params],
        queryFn: () => api.get<ApiResponse<Skill>>('/skills', { params }).then(res => res.data),
    }),

    getSkill: (id: number) => ({
        queryKey: ['skill', id],
        queryFn: () => api.get<Skill>(`/skills/${id}`).then(res => res.data),
    }),

    // Leader Skills
    getLeaderSkills: (params?: {
        page?: number
        limit?: number
        attribute?: string
        area?: string
        element?: string
    }) => ({
        queryKey: ['leader-skills', params],
        queryFn: () => api.get<ApiResponse<LeaderSkill>>('/leader-skills', { params }).then(res => res.data),
    }),

    getLeaderSkill: (id: number) => ({
        queryKey: ['leader-skill', id],
        queryFn: () => api.get<LeaderSkill>(`/leader-skills/${id}`).then(res => res.data),
    }),
}
