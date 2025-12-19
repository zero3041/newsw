/**
 * Leader Skill attribute và area mapping từ Django
 * Source: bestiary/models/skills.py LeaderSkill class
 */

export const LEADER_SKILL_ATTRIBUTES: Record<string, string> = {
    '1': 'HP',
    '2': 'Attack_Power',
    '3': 'Defense',
    '4': 'Attack_Speed',
    '5': 'Critical_Rate',
    '6': 'Resistance',
    '7': 'Accuracy',
}

export const LEADER_SKILL_AREAS: Record<string, string> = {
    '1': 'General',
    '2': 'Dungeon',
    '3': 'Element',
    '4': 'Arena',
    '5': 'Guild',
}

// Element names mapping (capitalize first letter)
export const LEADER_SKILL_ELEMENTS: Record<string, string> = {
    fire: 'Fire',
    water: 'Water',
    wind: 'Wind',
    light: 'Light',
    dark: 'Dark',
}

/**
 * Generate leader skill icon filename
 * Logic từ Django: bestiary/models/skills.py - icon_filename()
 * Format: leader_skill_{Attribute}_{Area/Element}.png
 * Example: leader_skill_Attack_Speed_Arena.png
 */
export function generateLeaderSkillIcon(attribute: string, area: string, element?: string | null): string {
    const attributeName = LEADER_SKILL_ATTRIBUTES[attribute] || attribute

    // Nếu area là Element (3) và có element, dùng element name
    if (area === '3' && element && element !== '\\N' && element !== 'null') {
        const elementName = LEADER_SKILL_ELEMENTS[element.toLowerCase()] || element
        return `leader_skill_${attributeName}_${elementName}.png`
    }

    // Nếu area là General (1), không có suffix
    if (area === '1') {
        return `leader_skill_${attributeName}.png`
    }

    // Các trường hợp khác, dùng area name
    const areaName = LEADER_SKILL_AREAS[area] || area
    return `leader_skill_${attributeName}_${areaName}.png`
}

/**
 * Format leader skill description
 */
export function formatLeaderSkillDescription(
    attribute: string,
    amount: number,
    area: string,
    element?: string | null,
): string {
    const attrName = LEADER_SKILL_ATTRIBUTES[attribute] || attribute
    const areaName = LEADER_SKILL_AREAS[area] || area

    if (area === '3' && element && element !== '\\N') {
        return `Increase ${attrName} of ${element} allies by ${amount}%`
    }

    if (area === '1') {
        return `Increase ${attrName} of all allies by ${amount}%`
    }

    return `Increase ${attrName} of allies in ${areaName} by ${amount}%`
}
