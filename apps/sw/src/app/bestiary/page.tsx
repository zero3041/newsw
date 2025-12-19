'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { bestiaryApi } from '@/shared/lib/bestiary-api'
import { Button } from '@workspace/ui/components/Button'
import { MonsterFilters as MonsterFiltersComponent } from '@/features/bestiary/components/MonsterFilters'
import { MonsterDataTable } from '@/features/bestiary/components/MonsterDataTable'
import type { MonsterFilters } from '@/features/bestiary/types'
import type { Monster as UIMonster } from '@/features/bestiary/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { DataTableSorting } from '@workspace/ui/components/DataTable'

export default function BestiaryPage() {
    const [filters, setFilters] = useState<MonsterFilters>({})
    const router = useRouter()
    const searchParams = useSearchParams()

    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || 1))
    const [pageSize, setPageSize] = useState(Number(searchParams.get('limit') || 100))
    const [sorting, setSorting] = useState<DataTableSorting | null>(() => {
        const sortParam = searchParams.get('sort')
        if (!sortParam) return null
        const [sortBy, sortDirection] = sortParam.split(';')
        if (!sortBy || !sortDirection) return null
        return { sortBy, sortDirection: sortDirection === 'desc' ? 'desc' : 'asc' }
    })

    const sortKeyMap: Record<string, string> = {
        name: 'name',
        stars: 'natural_stars',
        element: 'element',
        archetype: 'archetype',
        hp: 'max_lvl_hp',
        def: 'max_lvl_defense',
        atk: 'max_lvl_attack',
        spd: 'speed',
        critRate: 'crit_rate',
        critDamage: 'crit_damage',
        resistance: 'resistance',
        accuracy: 'accuracy',
    }

    const apiSort =
        sorting && sortKeyMap[sorting.sortBy] ? `${sortKeyMap[sorting.sortBy]};${sorting.sortDirection}` : undefined

    const { data, isLoading, error } = useQuery(
        bestiaryApi.getMonsters({
            page: currentPage,
            limit: pageSize,
            search: filters.name,
            elements: filters.element?.join(','), // Multiple elements
            archetypes: filters.archetype?.join(','), // Multiple archetypes
            natural_stars_min: filters.natural_stars_min?.toString(),
            natural_stars_max: filters.natural_stars_max?.toString(),
            sort: apiSort,
        }),
    )

    // Normalize API data → UI schema (skills array, leader icon filename)
    const normalizedResults: UIMonster[] = useMemo(() => {
        if (!data?.results) return []
        return (data.results as any[]).map((m: any) => {
            // skills may come as `skills` or `monstersSkills` with nested `skill`
            const skills = m.skills
                ? m.skills.map((s: any) => ({
                      id: s.id,
                      name: s.name,
                      description: s.description,
                      iconFilename: s.iconFilename,
                      maxLevel: s.maxLevel,
                      multiplierFormula: s.multiplierFormula,
                  }))
                : Array.isArray(m.monstersSkills)
                  ? m.monstersSkills.map((ms: any) => ({
                        id: ms.skill?.id ?? ms.id,
                        name: ms.skill?.name ?? ms.name,
                        description: ms.skill?.description ?? ms.description,
                        iconFilename: ms.skill?.iconFilename ?? ms.iconFilename,
                        maxLevel: ms.skill?.maxLevel ?? ms.maxLevel,
                        multiplierFormula: ms.skill?.multiplierFormula ?? ms.multiplierFormula,
                    }))
                  : []

            // leader skill icon filename generation if missing
            const leaderSkill = m.leaderSkill
                ? {
                      ...m.leaderSkill,
                      iconFilename:
                          m.leaderSkill.iconFilename ??
                          ((): string | undefined => {
                              const attr = String(m.leaderSkill.attribute || '').replaceAll(' ', '_')
                              const area = String(m.leaderSkill.area || '')
                              const element = String(m.leaderSkill.element || '')
                              if (!attr) return undefined
                              if (area === 'Element' && element) {
                                  return `leader_skill_${attr}_${element}` + '.png'
                              }
                              if (area && area !== 'General') {
                                  return `leader_skill_${attr}_${area}`.replaceAll(' ', '_') + '.png'
                              }
                              return `leader_skill_${attr}.png`
                          })(),
                  }
                : undefined

            return {
                ...m,
                // normalize casing for booleans / numbers commonly in snake_case
                isAwakened: m.isAwakened ?? m.is_awakened ?? (m.awaken_level === 1 || m.awakenLevel === 1),
                canAwaken: m.canAwaken ?? m.can_awaken ?? m.canAwaken,
                naturalStars: m.naturalStars ?? m.natural_stars ?? m.baseStars ?? m.base_stars,
                skills,
                leaderSkill,
                baseStars: m.baseStars ?? m.base_stars ?? m.naturalStars, // fallback
                // awakening materials mapping (camelCase <- snake_case)
                awakenMatsFireLow: m.awakenMatsFireLow ?? m.awaken_mats_fire_low,
                awakenMatsFireMid: m.awakenMatsFireMid ?? m.awaken_mats_fire_mid,
                awakenMatsFireHigh: m.awakenMatsFireHigh ?? m.awaken_mats_fire_high,
                awakenMatsWaterLow: m.awakenMatsWaterLow ?? m.awaken_mats_water_low,
                awakenMatsWaterMid: m.awakenMatsWaterMid ?? m.awaken_mats_water_mid,
                awakenMatsWaterHigh: m.awakenMatsWaterHigh ?? m.awaken_mats_water_high,
                awakenMatsWindLow: m.awakenMatsWindLow ?? m.awaken_mats_wind_low,
                awakenMatsWindMid: m.awakenMatsWindMid ?? m.awaken_mats_wind_mid,
                awakenMatsWindHigh: m.awakenMatsWindHigh ?? m.awaken_mats_wind_high,
                awakenMatsLightLow: m.awakenMatsLightLow ?? m.awaken_mats_light_low,
                awakenMatsLightMid: m.awakenMatsLightMid ?? m.awaken_mats_light_mid,
                awakenMatsLightHigh: m.awakenMatsLightHigh ?? m.awaken_mats_light_high,
                awakenMatsDarkLow: m.awakenMatsDarkLow ?? m.awaken_mats_dark_low,
                awakenMatsDarkMid: m.awakenMatsDarkMid ?? m.awaken_mats_dark_mid,
                awakenMatsDarkHigh: m.awakenMatsDarkHigh ?? m.awaken_mats_dark_high,
                awakenMatsMagicLow: m.awakenMatsMagicLow ?? m.awaken_mats_magic_low,
                awakenMatsMagicMid: m.awakenMatsMagicMid ?? m.awaken_mats_magic_mid,
                awakenMatsMagicHigh: m.awakenMatsMagicHigh ?? m.awaken_mats_magic_high,
            } as UIMonster
        })
    }, [data])

    // keep URL in sync
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(currentPage))
        params.set('limit', String(pageSize))
        if (sorting) {
            params.set('sort', `${sorting.sortBy};${sorting.sortDirection}`)
        } else {
            params.delete('sort')
        }
        router.replace(`/bestiary?${params.toString()}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize, sorting])

    // Reset page when filters change
    const handleFiltersChange = (newFilters: MonsterFilters) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setCurrentPage(1)
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Error Loading Monsters</h1>
                        <p className="text-muted-foreground mb-4">
                            {error instanceof Error ? error.message : 'Unknown error'}
                        </p>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Summoner's War Bestiary</h1>
                        <p className="text-muted-foreground">
                            {isLoading ? 'Loading...' : `${data?.count || 0} monsters`}
                        </p>
                    </div>
                </div>
            </div>

            <MonsterFiltersComponent
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={() => handleFiltersChange({})}
            />

            <MonsterDataTable
                monsters={normalizedResults}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                totalCount={data?.count || 0}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                sorting={sorting}
                setSorting={setSorting}
            />
        </div>
    )
}
