export const ELEMENTS = [
    { value: 'fire', label: 'Fire', icon: '🔥' },
    { value: 'water', label: 'Water', icon: '💧' },
    { value: 'wind', label: 'Wind', icon: '💨' },
    { value: 'light', label: 'Light', icon: '✨' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
] as const

export const ARCHETYPES = [
    { value: 'attack', label: 'Attack' },
    { value: 'defense', label: 'Defense' },
    { value: 'hp', label: 'HP' },
    { value: 'support', label: 'Support' },
    { value: 'material', label: 'Material' },
] as const

export const NATURAL_STARS = [
    { value: 1, label: '1 Star' },
    { value: 2, label: '2 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 5, label: '5 Stars' },
    { value: 6, label: '6 Stars' },
] as const

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const COLUMN_OPTIONS = [
    { id: 'image', name: 'Image', alwaysVisible: true },
    { id: 'name', name: 'Name' },
    { id: 'stars', name: 'Stars' },
    { id: 'element', name: 'Element' },
    { id: 'archetype', name: 'Archetype' },
    { id: 'awakensTo', name: 'Awakens To' },
    { id: 'awakensFrom', name: 'Awakens From' },
    { id: 'leaderSkill', name: 'Leader Skill' },
    { id: 'skills', name: 'Skills' },
    { id: 'skillUps', name: 'Skill-Ups' },
    { id: 'hp', name: 'HP (Lv.40)' },
    { id: 'def', name: 'DEF (Lv.40)' },
    { id: 'atk', name: 'ATK (Lv.40)' },
    { id: 'spd', name: 'SPD' },
    { id: 'critRate', name: 'CRI Rate' },
    { id: 'critDamage', name: 'CRI Dmg' },
    { id: 'resistance', name: 'RES' },
    { id: 'accuracy', name: 'ACC' },
    { id: 'awakeningMaterials', name: 'Awakening Materials' },
] as const
