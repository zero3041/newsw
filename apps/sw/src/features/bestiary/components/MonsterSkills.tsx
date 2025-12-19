'use client'

import { Card } from '@workspace/ui/components/Card'
import type { Skill, SkillEffectDetail } from '../types'
import { useMemo } from 'react'

interface MonsterSkillsProps {
    skills: Skill[]
    leaderSkill?: {
        id: number
        attribute: string
        amount: number
        area: string
        element?: string
        iconFilename?: string
    }
}

const formatUpgradeEffect = (effect: string): string => {
    const effectMap: Record<string, string> = {
        damage: 'Damage',
        effect_rate: 'Effect Rate',
        cooltime: 'Cooltime Turn',
        harmful_effect_rate: 'Harmful Effect Rate',
        beneficial_effect_turns: 'Beneficial Effect Turn',
        shield_strength: 'Shield Strength',
        attack_bar: 'Attack Bar',
        recovery: 'Recovery',
    }
    return effectMap[effect] || effect
}

const formatLeaderSkillDescription = (attribute: string, amount: number, area: string, element?: string): string => {
    const areaText = area === 'Element' && element ? `${element} Monsters in ` : ''
    const locationText = area === 'General' ? 'All Areas' : area
    return `Increase ${attribute} of ${areaText}${locationText} by ${amount}%`
}

export function MonsterSkills({ skills, leaderSkill }: MonsterSkillsProps) {
    // Parse level progress description
    const parseSkillUpgrades = (skill: Skill): string[] => {
        if (!skill.levelProgressDesc) {
            // Generate default level progress based on maxLevel
            const upgrades: string[] = []
            for (let i = 1; i < skill.maxLevel; i++) {
                if (skill.multiplierFormula) {
                    upgrades.push(`Damage +${i * 5}%`)
                } else if (skill.cooltime && skill.cooltime > 0) {
                    upgrades.push(`Cooltime Turn -${i}`)
                } else {
                    upgrades.push(`Effect Rate +${i * 10}%`)
                }
            }
            return upgrades
        }
        return skill.levelProgressDesc.split('\n').filter(line => line.trim())
    }

    // Get distinct effects from skill effect details
    const getDistinctEffects = (effectDetails?: SkillEffectDetail[]): SkillEffectDetail[] => {
        if (!effectDetails) return []
        const seen = new Set<number>()
        return effectDetails.filter(detail => {
            if (!detail.effectId || seen.has(detail.effectId)) return false
            seen.add(detail.effectId)
            return true
        })
    }

    return (
        <div className="space-y-4">
            {/* Leader Skill */}
            {leaderSkill && (
                <Card className="border-0 shadow-sm">
                    <div className="p-4 border-b bg-gray-50">
                        <h4 className="font-semibold text-lg">Leader Skill</h4>
                    </div>
                    <div className="p-4 flex gap-4">
                        <div className="flex-shrink-0">
                            {leaderSkill.iconFilename && (
                                <img
                                    src={`/images/skills/leader/${leaderSkill.iconFilename}`}
                                    alt="Leader Skill"
                                    className="w-16 h-16 object-contain"
                                    loading="lazy"
                                />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-base">
                                {formatLeaderSkillDescription(
                                    leaderSkill.attribute,
                                    leaderSkill.amount,
                                    leaderSkill.area,
                                    leaderSkill.element,
                                )}
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Skills Grid - Same row layout like Django template */}
            <div className="row condensed">
                {skills.map(skill => {
                    const upgrades = parseSkillUpgrades(skill)
                    const effects = getDistinctEffects(skill.effectDetails)
                    const hasContent = upgrades.length > 0 || effects.length > 0 || skill.aoe || skill.multiplierFormula

                    return (
                        <div key={skill.id} className={`${skills.length < 4 ? 'col-lg-4' : 'col-lg-3'}`}>
                            <Card className="border-0 shadow mb-3">
                                {/* Header */}
                                <div className="card-header bg-white">
                                    <p className="card-title font-bold text-base mb-0">{skill.name}</p>
                                </div>

                                {/* Description */}
                                <div className={`${hasContent ? 'card-header' : 'card-footer border-0'} bg-white`}>
                                    <div className="card-bestiary-monster-details">
                                        <div className="monster-skill-thumb float-left relative">
                                            {skill.iconFilename && (
                                                <img
                                                    src={`/images/skills/${skill.iconFilename}`}
                                                    alt={skill.name}
                                                    className="w-12 h-12 object-contain"
                                                    loading="lazy"
                                                />
                                            )}
                                            {skill.maxLevel > 1 && (
                                                <span className="image-plus image-plus-right absolute -right-1 -bottom-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {skill.maxLevel}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm">
                                            {skill.description}
                                            {skill.cooltime && skill.cooltime > 0 && (
                                                <span className="text-muted-foreground">
                                                    (Reusable in {skill.cooltime} turn{skill.cooltime > 1 ? 's' : ''})
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Level-up Progress */}
                                {upgrades.length > 0 && (
                                    <div
                                        className={`${effects.length > 0 || skill.aoe ? 'card-header' : 'card-footer border-0'} bg-white`}
                                    >
                                        <strong className="fw-bolder text-sm">Level-up Progress</strong>
                                        <ul className="list-unstyled mt-2">
                                            {upgrades.map((upgrade, idx) => (
                                                <li key={idx} className="text-sm text-muted-foreground">
                                                    {upgrade}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Skill Effects */}
                                {(effects.length > 0 || skill.aoe) && (
                                    <div
                                        className={`${skill.multiplierFormula ? 'card-header' : 'card-footer border-0'} bg-white`}
                                    >
                                        <strong className="fw-bolder text-sm">Skill effects</strong>
                                        <div className="d-flex flex-wrap mt-2">
                                            {skill.aoe && (
                                                <span className="skill-effect skill-effect-buff p-1 mb-1">
                                                    <span>AOE</span>
                                                </span>
                                            )}
                                            {effects.map(effectDetail => {
                                                const effect = effectDetail.effect
                                                if (!effect) return null

                                                if (effect.iconFilename && effect.name !== 'Absorb ATB') {
                                                    return (
                                                        <div
                                                            key={effectDetail.id}
                                                            className="skill-effect-wrapper relative group"
                                                        >
                                                            <img
                                                                src={`/images/buffs/${effect.iconFilename}`}
                                                                alt={effect.name}
                                                                className="skill-effect float-left mb-1 w-8 h-8 object-contain cursor-help"
                                                                loading="lazy"
                                                                title={effect.description || effect.name}
                                                                aria-label={effect.name}
                                                            />
                                                            {/* Custom tooltip */}
                                                            <div className="skill-effect-tooltip">
                                                                <div className="font-bold text-sm text-blue-300 mb-1">
                                                                    {effect.name}
                                                                </div>
                                                                <div className="text-gray-300 text-xs">
                                                                    {effect.description || ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                return (
                                                    <span
                                                        key={effectDetail.id}
                                                        className={`skill-effect p-1 mb-1 ${
                                                            effect.isBuff ? 'skill-effect-buff' : 'skill-effect-debuff'
                                                        }`}
                                                        title={effect.description || ''}
                                                        data-bs-toggle="popover"
                                                        data-bs-trigger="hover"
                                                        data-bs-placement="top"
                                                        data-bs-container="body"
                                                        data-bs-content={effect.description || ''}
                                                        data-bs-original-title={effect.name}
                                                        aria-label={effect.name}
                                                    >
                                                        <span>{effect.name}</span>
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Multiplier Formula */}
                                {skill.multiplierFormula && (
                                    <div className="card-footer border-0 bg-white">
                                        <strong className="fw-bolder text-sm">Multiplier Formula</strong>
                                        <p className="text-sm mt-1 font-mono text-orange-600">
                                            {skill.multiplierFormula} {skill.hits > 1 && `x${skill.hits}`}
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
