// Bestiary filters type definitions

export interface MonsterFilters {
    name?: string
    element?: ('fire' | 'wind' | 'water' | 'light' | 'dark')[]
    archetype?: ('attack' | 'hp' | 'support' | 'defense' | 'material')[]
    natural_stars_min?: number
    natural_stars_max?: number
    awaken_level?: number[]
    fusion_food?: boolean | null
    leader_skill_stat?: string[]
    leader_skill_area?: string[]
    obtainable?: boolean
}

export interface SortOptions {
    field: string
    direction: 'asc' | 'desc'
}

export const ELEMENTS = [
    { value: 'fire', label: 'Fire', icon: '🔥' },
    { value: 'wind', label: 'Wind', icon: '💨' },
    { value: 'water', label: 'Water', icon: '💧' },
    { value: 'light', label: 'Light', icon: '✨' },
    { value: 'dark', label: 'Dark', icon: '🌑' },
] as const

export const ARCHETYPES = [
    { value: 'attack', label: 'Attack' },
    { value: 'hp', label: 'HP' },
    { value: 'support', label: 'Support' },
    { value: 'defense', label: 'Defense' },
    { value: 'material', label: 'Material' },
] as const

export const AWAKEN_LEVELS = [
    { value: 0, label: 'Unawakened' },
    { value: 1, label: 'Awakened' },
    { value: 2, label: 'Second Awakening' },
] as const
