'use client'

import './styles.css'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { bestiaryApi } from '@/features/bestiary/lib/api'
import { Card } from '@workspace/ui/components/Card'
import { Skeleton } from '@workspace/ui/components/Skeleton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ElementSwap } from '@/features/bestiary/components/ElementSwap'
import { MonsterDetailInfo } from '@/features/bestiary/components/MonsterDetailInfo'
import { MonsterSkills } from '@/features/bestiary/components/MonsterSkills'
import { MonsterStatsTable } from '@/features/bestiary/components/MonsterStatsTable'
import type { Monster, Skill } from '@/features/bestiary/types'
import { useEffect, useState } from 'react'

export default function MonsterDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const [mounted, setMounted] = useState(false)

    const { data: monster, isLoading, error } = useQuery(bestiaryApi.getMonsterBySlug(slug))

    useEffect(() => {
        setMounted(true)
    }, [])

    // Build awakening chain (only show awakened monsters)
    const buildMonsterChain = (mon: Monster | undefined): Monster[] => {
        if (!mon) return []

        // Only show the current monster (awakened form)
        return [mon]
    }

    const monsterChain = buildMonsterChain(monster)

    // Extract skills from monstersSkills relation
    const skills: Skill[] = monster?.monstersSkills?.map(ms => ms.skill) || []

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Link
                    href="/bestiary"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Bestiary
                </Link>
                <Card className="p-12 text-center">
                    <p className="text-destructive">Error loading monster details.</p>
                </Card>
            </div>
        )
    }

    if (!mounted || isLoading || !monster) {
        return (
            <div className="container mx-auto py-8">
                <Skeleton className="h-64 w-full mb-4" />
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-full" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <Link
                href="/bestiary"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Bestiary
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    {monster.element} {monsterChain[0]?.name}
                    {monster.canAwaken && monster.awakensTo && (
                        <span className="text-muted-foreground"> ({monster.awakensTo.name})</span>
                    )}
                </h1>
            </div>

            {/* Element Swap */}
            <ElementSwap currentMonsterId={monster.id} familyId={monster.familyId} currentSlug={slug} />

            <hr className="my-6" />

            {/* Display each monster in the awakening chain */}

            {monsterChain.map((mon, index) => (
                <div key={mon.id}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Left Column - Monster Info */}
                        <div>
                            <MonsterDetailInfo monster={mon} />
                            <div className="mt-6">
                                <MonsterSkills
                                    skills={mon.monstersSkills?.map(ms => ms.skill) || []}
                                    leaderSkill={mon.leaderSkill}
                                />
                            </div>
                        </div>

                        {/* Right Column - Stats */}
                        <div>
                            <MonsterStatsTable monster={mon} />

                            {/* Additional Stats Card */}
                            <Card className="mt-6 border-0 shadow-sm">
                                <div className="p-4 border-b bg-gray-50">
                                    <h3 className="font-semibold">Base Stats (6⭐ Level 40)</h3>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">HP</p>
                                            <p className="text-2xl font-bold">
                                                {mon.maxLvlHp?.toLocaleString() || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">ATK</p>
                                            <p className="text-2xl font-bold">
                                                {mon.maxLvlAttack?.toLocaleString() || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">DEF</p>
                                            <p className="text-2xl font-bold">
                                                {mon.maxLvlDefense?.toLocaleString() || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">SPD</p>
                                            <p className="text-2xl font-bold">{mon.speed || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Crit Rate</p>
                                            <p className="text-lg font-semibold">
                                                {mon.critRate !== undefined ? `${mon.critRate}%` : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Crit DMG</p>
                                            <p className="text-lg font-semibold">
                                                {mon.critDamage !== undefined ? `${mon.critDamage}%` : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Resistance</p>
                                            <p className="text-lg font-semibold">
                                                {mon.resistance !== undefined ? `${mon.resistance}%` : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Accuracy</p>
                                            <p className="text-lg font-semibold">
                                                {mon.accuracy !== undefined ? `${mon.accuracy}%` : '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Separator between monsters in chain */}
                    {index < monsterChain.length - 1 && <hr className="my-8" />}
                </div>
            ))}
        </div>
    )
}
