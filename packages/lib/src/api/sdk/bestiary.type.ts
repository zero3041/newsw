// Bestiary API Types
// Based on pushsw/bestiary models and serializers

export interface PaginationMetadata {
    count: number
    next: string | null
    previous: string | null
}

export interface PaginatedResponse<T> {
    results: T[]
    count: number
    next: string | null
    previous: string | null
}

export interface Monster {
    id: number
    url: string
    bestiary_slug: string
    com2us_id: number
    family_id: number
    skill_group_id: number
    name: string
    image_filename: string
    element: string
    archetype: string
    base_stars: number
    natural_stars: number
    obtainable: boolean
    can_awaken: boolean
    awaken_level: number
    awaken_bonus: string
    skills: number[]
    skill_ups_to_max: number
    leader_skill: LeaderSkill | null
    homunculus_skills: number[]
    base_hp: number
    base_attack: number
    base_defense: number
    speed: number
    crit_rate: number
    crit_damage: number
    resistance: number
    accuracy: number
    raw_hp: number
    raw_attack: number
    raw_defense: number
    max_lvl_hp: number
    max_lvl_attack: number
    max_lvl_defense: number
    awakens_from: number | null
    awakens_to: number | null
    awaken_cost: AwakenCost[]
    transforms_to: number | null
    source: MonsterSource[]
    fusion_food: boolean
    homunculus: boolean
    craft_cost: number
    craft_materials: MonsterCraftCost[]
}

export interface AwakenCost {
    item: GameItem
    quantity: number
}

export interface MonsterCraftCost {
    item: GameItem
    quantity: number
}

export interface GameItem {
    id: number
    com2us_id: number
    url: string
    name: string
    category: string
    icon: string
    description: string
    sell_value: number
}

export interface MonsterSource {
    id: number
    url: string
    name: string
    description: string
    farmable_source: boolean
}

export interface LeaderSkill {
    id: number
    url: string
    attribute: string
    amount: number
    area: string
    element: string
}

export interface Skill {
    id: number
    com2us_id: number
    name: string
    description: string
    slot: number
    cooltime: number | null
    hits: number
    passive: boolean
    aoe: boolean
    random: boolean
    max_level: number
    upgrades: SkillUpgrade[]
    effects: SkillEffectDetail[]
    multiplier_formula: string | null
    multiplier_formula_raw: string | null
    scales_with: string[]
    icon_filename: string
    used_on: number[]
    level_progress_description: string[]
    other_skill: number | null
}

export interface SkillUpgrade {
    effect: string
    amount: number
}

export interface SkillEffectDetail {
    effect: SkillEffect
    aoe: boolean
    single_target: boolean
    self_effect: boolean
    chance: number | null
    on_crit: boolean
    on_death: boolean
    random: boolean
    quantity: number | null
    all: boolean
    self_hp: boolean
    target_hp: boolean
    damage: number | null
    note: string | null
}

export interface SkillEffect {
    id: number
    url: string
    name: string
    is_buff: boolean
    type: string
    description: string
    icon_filename: string
}

export interface HomunculusSkill {
    id: number
    url: string
    skill: number
    craft_materials: HomunculusSkillCraftCost[]
    prerequisites: number[]
    used_on: number[]
}

export interface HomunculusSkillCraftCost {
    item: GameItem
    quantity: number
}

export interface Fusion {
    id: number
    url: string
    product: number
    cost: number
    ingredients: number[]
}

export interface Dungeon {
    id: number
    url: string
    enabled: boolean
    name: string
    slug: string
    category: string
    icon: string
    levels: number[]
}

export interface Level {
    id: number
    url: string
    dungeon: number
    floor: number
    difficulty: string
    energy_cost: number
    xp: number
    frontline_slots: number
    backline_slots: number
    total_slots: number
    waves: Wave[]
}

export interface Wave {
    enemies: Enemy[]
}

export interface Enemy {
    id: number
    monster: number
    stars: number
    level: number
    hp: number
    attack: number
    defense: number
    speed: number
    resist: number
    crit_bonus: number
    crit_damage_reduction: number
    accuracy_bonus: number
}
