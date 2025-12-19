'use client'

import { useState } from 'react'
import { DataTable } from '@workspace/ui/components/DataTable'
import type { DataTableSorting } from '@workspace/ui/components/DataTable'
import { Card } from '@workspace/ui/components/Card'
import { Button } from '@workspace/ui/components/Button'
import { Popover, PopoverDialog, PopoverTrigger } from '@workspace/ui/components/Popover'
import { Switch } from '@workspace/ui/components/Switch'
import { Input } from '@workspace/ui/components/Textfield'
import { Pagination, PaginationPageSizeSelector } from '@workspace/ui/components/Pagination'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { ChevronDown, Settings, Search, Check } from 'lucide-react'
import type { Monster } from '../types'
import { COLUMN_OPTIONS } from '../consts'
import { generateLeaderSkillIcon, formatLeaderSkillDescription } from '../consts/leaderSkillMapping'

interface MonsterDataTableProps {
    monsters: (Monster & {
        leaderSkill?: {
            id: number
            attribute: string
            amount: number
            area: string
            iconFilename?: string
        }
        skills?: Array<{
            id: number
            name: string
            iconFilename?: string
            maxLevel: number
        }>
        awakensTo?: {
            id: number
            name: string
            imageFilename?: string
            bestiarySlug?: string
        }
        awakensFrom?: {
            id: number
            name: string
            imageFilename?: string
            bestiarySlug?: string
        }
    })[]
    isLoading: boolean
    currentPage: number
    totalPages: number
    totalCount?: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    sorting: DataTableSorting | null
    setSorting: (sorting: DataTableSorting | null) => void
}

const DEFAULT_VISIBLE_COLUMNS = {
    image: true,
    name: true,
    stars: true,
    element: true,
    archetype: true,
    awakensTo: true,
    awakensFrom: true,
    leaderSkill: true,
    skills: true,
    skillUps: true,
    hp: true,
    def: true,
    atk: true,
    spd: true,
    critRate: true,
    critDamage: true,
    resistance: true,
    accuracy: true,
    awakeningMaterials: true,
}

const columnOptions = COLUMN_OPTIONS

export function MonsterDataTable({
    monsters,
    isLoading,
    currentPage,
    totalPages,
    totalCount = 0,
    pageSize,
    onPageChange,
    onPageSizeChange,
    sorting,
    setSorting,
}: MonsterDataTableProps) {
    const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS)
    const [columnSearch, setColumnSearch] = useState('')

    const handleColumnToggle = (column: string, visible: boolean) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: visible,
        }))
    }

    const handleSelectAll = () => {
        const allColumns = columnOptions.reduce(
            (acc, col) => {
                if (!('alwaysVisible' in col) || !col.alwaysVisible) {
                    acc[col.id] = true
                }
                return acc
            },
            {} as Record<string, boolean>,
        )
        setVisibleColumns(prev => ({ ...prev, ...allColumns }))
    }

    const handleDeselectAll = () => {
        const allColumns = columnOptions.reduce(
            (acc, col) => {
                if (!('alwaysVisible' in col) || !col.alwaysVisible) {
                    acc[col.id] = false
                }
                return acc
            },
            {} as Record<string, boolean>,
        )
        setVisibleColumns(prev => ({ ...prev, ...allColumns }))
    }

    // Define columns based on visibleColumns
    const columns: ColumnDef<any>[] = []

    if (visibleColumns.image) {
        columns.push({
            id: 'image',
            header: '',
            cell: ({ row }: { row: any }) => {
                const baseStars: number = row.original.baseStars ?? row.original.naturalStars
                const awakenLevel: number = row.original.awakenLevel ?? 0
                // Logic từ Django: awakenLevel >= 1 → awakened stars
                const isAwakened: boolean = awakenLevel >= 1
                const starAsset = isAwakened ? '/images/stars/star-awakened.png' : '/images/stars/star-unawakened.png'
                const starCount = isAwakened ? Math.min((baseStars || 0) + 1, 6) : baseStars
                return (
                    <div className="monster-image relative">
                        <Link href={`/bestiary/${row.original.bestiarySlug || row.original.id}`}>
                            {row.original.imageFilename ? (
                                <img
                                    src={`/images/monsters/${row.original.imageFilename}`}
                                    alt={`${row.original.name} portrait`}
                                    className="monster-thumb"
                                    loading="lazy"
                                    onError={e => {
                                        ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                                    }}
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-lg text-gray-400">
                                    {row.original.name[0]}
                                </div>
                            )}
                            {/* Stars overlay */}
                            <span className="absolute inset-0 pointer-events-none">
                                {Array.from({ length: starCount }).map((_, i) => (
                                    <img
                                        key={i}
                                        src={starAsset}
                                        className={`monster-star monster-star-${i + 1}`}
                                        alt="star"
                                        loading="lazy"
                                    />
                                ))}
                            </span>
                        </Link>
                    </div>
                )
            },
            size: 60,
        })
    }

    if (visibleColumns.name) {
        columns.push({
            id: 'name',
            header: 'Name',
            enableSorting: true,
            cell: ({ row }: { row: any }) => (
                <Link href={`/bestiary/${row.original.bestiarySlug || row.original.id}`}>{row.original.name}</Link>
            ),
            size: 120,
        })
    }

    if (visibleColumns.stars) {
        columns.push({
            id: 'stars',
            header: 'Stars',
            enableSorting: true,
            cell: ({ row }: { row: any }) => (
                <span>
                    {row.original.baseStars ?? row.original.naturalStars}
                    <i className="fas fa-star"></i>
                </span>
            ),
            size: 80,
        })
    }

    if (visibleColumns.element) {
        columns.push({
            id: 'element',
            header: 'Element',
            enableSorting: true,
            cell: ({ row }: { row: any }) => (
                <div className="monster-element">
                    <img
                        src={`/images/elements/${row.original.element}.png`}
                        className="monster-element"
                        loading="lazy"
                        alt={row.original.element}
                    />
                    <span className="visually-hidden">{row.original.element}</span>
                </div>
            ),
            size: 80,
        })
    }

    if (visibleColumns.archetype) {
        columns.push({
            id: 'archetype',
            header: 'Archetype',
            enableSorting: true,
            cell: ({ row }: { row: any }) => <span className="monster-type">{row.original.archetype}</span>,
            size: 100,
        })
    }

    if (visibleColumns.awakensTo) {
        columns.push({
            id: 'awakensTo',
            header: 'Awakens To',
            cell: ({ row }: { row: any }) => (
                <div className="monster-awakens">
                    {row.original.awakensTo ? (
                        <Link href={`/bestiary/${row.original.awakensTo.bestiarySlug || row.original.awakensTo.id}`}>
                            <img
                                src={`/images/monsters/${row.original.awakensTo.imageFilename}`}
                                className="monster-thumb"
                                loading="lazy"
                                alt={row.original.awakensTo.name}
                                onError={e => {
                                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                                }}
                            />
                            {row.original.awakensTo.name}
                        </Link>
                    ) : null}
                </div>
            ),
            size: 120,
        })
    }

    if (visibleColumns.awakensFrom) {
        columns.push({
            id: 'awakensFrom',
            header: 'Awakens From',
            cell: ({ row }: { row: any }) => (
                <div className="monster-awakens">
                    {row.original.awakensFrom ? (
                        <Link
                            href={`/bestiary/${row.original.awakensFrom.bestiarySlug || row.original.awakensFrom.id}`}
                        >
                            <img
                                src={`/images/monsters/${row.original.awakensFrom.imageFilename}`}
                                className="monster-thumb"
                                loading="lazy"
                                alt={row.original.awakensFrom.name}
                                onError={e => {
                                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                                }}
                            />
                            <span className="absolute inset-0 pointer-events-none">
                                {Array.from({ length: row.original.baseStars ?? row.original.naturalStars }).map(
                                    (_, i) => (
                                        <img
                                            key={i}
                                            src={'/images/stars/star-unawakened.png'}
                                            className={`monster-star monster-star-${i + 1}`}
                                            alt="star"
                                            loading="lazy"
                                        />
                                    ),
                                )}
                            </span>
                            {row.original.awakensFrom.name}
                        </Link>
                    ) : null}
                </div>
            ),
            size: 120,
        })
    }

    if (visibleColumns.leaderSkill) {
        columns.push({
            id: 'leaderSkill',
            header: 'Leader Skill',
            cell: ({ row }: { row: any }) => {
                if (!row.original.leaderSkill) return null

                const leaderSkill = row.original.leaderSkill
                const iconFilename = generateLeaderSkillIcon(
                    leaderSkill.attribute,
                    leaderSkill.area,
                    leaderSkill.element,
                )
                const description = formatLeaderSkillDescription(
                    leaderSkill.attribute,
                    leaderSkill.amount,
                    leaderSkill.area,
                    leaderSkill.element,
                )

                return (
                    <div className="monster-leader-skill">
                        <div>
                            <img
                                src={`/images/skills/leader/${iconFilename}`}
                                loading="lazy"
                                alt="Leader Skill"
                                className="cursor-help"
                                title={description}
                                onError={e => {
                                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                                }}
                            />
                            <span className="image-plus image-plus-top-left">{leaderSkill.amount}%</span>
                            <span className="visually-hidden">{description}</span>
                        </div>
                    </div>
                )
            },
            size: 100,
        })
    }

    if (visibleColumns.skills) {
        columns.push({
            id: 'skills',
            header: 'Skills',
            cell: ({ row }: { row: any }) => (
                <div className="monster-awaken-materials">
                    <div className="d-flex">
                        {row.original.skills?.map((skill: any) => {
                            // Debug: log skills to check if description exists
                            if (typeof window !== 'undefined' && !(window as any).__skillsDebugLogged) {
                                console.log('Skills data sample:', row.original.skills[0])
                                ;(window as any).__skillsDebugLogged = true
                            }

                            const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                const tooltipWrapper = e.currentTarget.querySelector(
                                    '.skill-tooltip-wrapper',
                                ) as HTMLElement
                                if (tooltipWrapper) {
                                    tooltipWrapper.style.setProperty('--tooltip-x', `${rect.left + rect.width / 2}px`)
                                    tooltipWrapper.style.setProperty('--tooltip-y', `${rect.top}px`)
                                }
                            }

                            return (
                                <div
                                    key={skill.id}
                                    className="monster-skill-thumb pull-left skill-popover group/skill relative inline-block"
                                    style={{ zIndex: 1 }}
                                    onMouseEnter={handleMouseEnter}
                                >
                                    <img
                                        src={`/images/skills/${skill.iconFilename}`}
                                        loading="lazy"
                                        alt={skill.name}
                                        onError={e => {
                                            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                                        }}
                                    />
                                    {skill.maxLevel > 1 && (
                                        <span className="image-plus image-plus-right">{skill.maxLevel}</span>
                                    )}
                                    {/* Custom tooltip with description - shows on hover */}
                                    <div
                                        className="skill-tooltip-wrapper invisible group-hover/skill:visible opacity-0 group-hover/skill:opacity-100 transition-opacity duration-200 pointer-events-none"
                                        style={{
                                            position: 'fixed',
                                            zIndex: 99999,
                                            transform: 'translate(-50%, -100%)',
                                            marginTop: '-8px',
                                            left: 'var(--tooltip-x, 50%)',
                                            top: 'var(--tooltip-y, 0)',
                                        }}
                                    >
                                        <div
                                            className="skill-tooltip p-3 bg-gray-900 text-white text-xs rounded-lg shadow-2xl border border-gray-700"
                                            style={{
                                                width: '280px',
                                                maxWidth: '90vw',
                                                whiteSpace: 'normal',
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            <div className="font-bold mb-1.5 text-sm text-blue-300 break-words">
                                                {skill.name}
                                            </div>

                                            {/* Multiplier Formula - % tỷ lệ tấn công */}
                                            {skill.multiplierFormula && (
                                                <div className="text-yellow-300 font-mono text-xs mb-2 bg-gray-800 px-2 py-1 rounded break-words">
                                                    ⚔️ {skill.multiplierFormula}
                                                </div>
                                            )}

                                            {/* Description */}
                                            {skill.description && (
                                                <div className="text-gray-300 leading-relaxed break-words whitespace-normal">
                                                    {skill.description}
                                                </div>
                                            )}

                                            {/* Arrow pointing down */}
                                            <div
                                                className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '-6px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ),
            size: 250,
        })
    }

    if (visibleColumns.skillUps) {
        columns.push({
            id: 'skillUps',
            header: 'Skill-Ups',
            enableSorting: true,
            cell: ({ row }: { row: any }) => (
                <div>
                    {row.original.skillUpsToMax && row.original.skillUpsToMax > 0 ? (
                        <div className="monster-image">
                            <img
                                src="/images/monsters/devilmon_dark.png"
                                className="monster-thumb"
                                loading="lazy"
                                alt="Devilmon"
                            />
                            <span className="image-plus image-plus-main">{row.original.skillUpsToMax}</span>
                        </div>
                    ) : (
                        <span className="glyphicon glyphicon-ok-circle text-success"></span>
                    )}
                </div>
            ),
            size: 80,
        })
    }

    if (visibleColumns.hp) {
        columns.push({
            id: 'hp',
            header: 'HP (Lv.40)',
            enableSorting: true,
            cell: ({ row }: { row: any }) => <span>{row.original.maxLvlHp}</span>,
            size: 100,
        })
    }

    if (visibleColumns.def) {
        columns.push({
            id: 'def',
            header: 'DEF (Lv.40)',
            enableSorting: true,
            cell: ({ row }: { row: any }) => <span>{row.original.maxLvlDefense}</span>,
            size: 100,
        })
    }

    if (visibleColumns.atk) {
        columns.push({
            id: 'atk',
            header: 'ATK (Lv.40)',
            enableSorting: true,
            cell: ({ row }: { row: any }) => <span>{row.original.maxLvlAttack}</span>,
            size: 100,
        })
    }

    if (visibleColumns.spd) {
        columns.push({
            id: 'spd',
            header: 'SPD',
            enableSorting: true,
            cell: ({ row }: { row: any }) => <span>{row.original.speed}</span>,
            size: 80,
        })
    }

    if (visibleColumns.critRate) {
        columns.push({
            id: 'critRate',
            header: 'CRI Rate',
            enableSorting: true,
            cell: ({ row }: { row: any }) => <span>{row.original.critRate}%</span>,
            size: 80,
        })
    }

    if (visibleColumns.critDamage) {
        columns.push({
            id: 'critDamage',
            header: 'CRI Dmg',
            enableSorting: true,
            cell: ({ row }: { row: any }) => <span>{row.original.critDamage}%</span>,
            size: 80,
        })
    }

    if (visibleColumns.resistance) {
        columns.push({
            id: 'resistance',
            header: 'RES',
            enableSorting: true,
            cell: ({ row }: { row: any }) => <span>{row.original.resistance}%</span>,
            size: 80,
        })
    }

    if (visibleColumns.accuracy) {
        columns.push({
            id: 'accuracy',
            header: 'ACC',
            enableSorting: true,
            cell: ({ row }: { row: any }) => <span>{row.original.accuracy}%</span>,
            size: 80,
        })
    }

    if (visibleColumns.awakeningMaterials) {
        columns.push({
            id: 'awakeningMaterials',
            header: 'Awakening Materials',
            cell: ({ row }: { row: any }) => {
                // Logic từ Django: Chỉ hiển thị nếu canAwaken=true VÀ awakenLevel < 1
                const awakenLevel = row.original.awakenLevel ?? 0
                const shouldShowMaterials = row.original.canAwaken && awakenLevel < 1

                return (
                    <div className="monster-awaken-materials">
                        {shouldShowMaterials ? (
                            <div className="flex gap-1">
                                {/* Fire Materials */}
                                {row.original.awakenMatsFireHigh > 0 && (
                                    <div className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                                        F{row.original.awakenMatsFireHigh}
                                    </div>
                                )}
                                {row.original.awakenMatsFireMid > 0 && (
                                    <div className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                                        f{row.original.awakenMatsFireMid}
                                    </div>
                                )}
                                {row.original.awakenMatsFireLow > 0 && (
                                    <div className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                                        f{row.original.awakenMatsFireLow}
                                    </div>
                                )}

                                {/* Water Materials */}
                                {row.original.awakenMatsWaterHigh > 0 && (
                                    <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                        W{row.original.awakenMatsWaterHigh}
                                    </div>
                                )}
                                {row.original.awakenMatsWaterMid > 0 && (
                                    <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                        w{row.original.awakenMatsWaterMid}
                                    </div>
                                )}
                                {row.original.awakenMatsWaterLow > 0 && (
                                    <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                        w{row.original.awakenMatsWaterLow}
                                    </div>
                                )}

                                {/* Wind Materials */}
                                {row.original.awakenMatsWindHigh > 0 && (
                                    <div className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                                        W{row.original.awakenMatsWindHigh}
                                    </div>
                                )}
                                {row.original.awakenMatsWindMid > 0 && (
                                    <div className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                                        w{row.original.awakenMatsWindMid}
                                    </div>
                                )}
                                {row.original.awakenMatsWindLow > 0 && (
                                    <div className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                                        w{row.original.awakenMatsWindLow}
                                    </div>
                                )}

                                {/* Light Materials */}
                                {row.original.awakenMatsLightHigh > 0 && (
                                    <div className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                                        L{row.original.awakenMatsLightHigh}
                                    </div>
                                )}
                                {row.original.awakenMatsLightMid > 0 && (
                                    <div className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                                        l{row.original.awakenMatsLightMid}
                                    </div>
                                )}
                                {row.original.awakenMatsLightLow > 0 && (
                                    <div className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                                        l{row.original.awakenMatsLightLow}
                                    </div>
                                )}

                                {/* Dark Materials */}
                                {row.original.awakenMatsDarkHigh > 0 && (
                                    <div className="text-xs bg-gray-100 text-gray-800 px-1 py-0.5 rounded">
                                        D{row.original.awakenMatsDarkHigh}
                                    </div>
                                )}
                                {row.original.awakenMatsDarkMid > 0 && (
                                    <div className="text-xs bg-gray-100 text-gray-800 px-1 py-0.5 rounded">
                                        d{row.original.awakenMatsDarkMid}
                                    </div>
                                )}
                                {row.original.awakenMatsDarkLow > 0 && (
                                    <div className="text-xs bg-gray-100 text-gray-800 px-1 py-0.5 rounded">
                                        d{row.original.awakenMatsDarkLow}
                                    </div>
                                )}

                                {/* Magic Materials */}
                                {row.original.awakenMatsMagicHigh > 0 && (
                                    <div className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded">
                                        M{row.original.awakenMatsMagicHigh}
                                    </div>
                                )}
                                {row.original.awakenMatsMagicMid > 0 && (
                                    <div className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded">
                                        m{row.original.awakenMatsMagicMid}
                                    </div>
                                )}
                                {row.original.awakenMatsMagicLow > 0 && (
                                    <div className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded">
                                        m{row.original.awakenMatsMagicLow}
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                )
            },
            size: 150,
        })
    }

    return (
        <div className="space-y-4">
            <Card className="mb-3">
                <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Monster Inventory</h3>
                        <PopoverTrigger>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Columns
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Popover className="w-80 p-0" placement="bottom end">
                                <PopoverDialog className="p-0">
                                    <div className="flex flex-col">
                                        {/* Header */}
                                        <div className="flex items-center justify-between border-b px-4 py-3">
                                            <span className="font-semibold text-sm">Toggle columns</span>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleSelectAll}
                                                    className="text-xs h-7 px-2"
                                                >
                                                    All
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleDeselectAll}
                                                    className="text-xs h-7 px-2"
                                                >
                                                    None
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Search */}
                                        <div className="border-b px-4 py-3">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search columns..."
                                                    value={columnSearch}
                                                    onChange={e => setColumnSearch(e.target.value)}
                                                    className="pl-9 h-9 text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Column list */}
                                        <div className="flex flex-col gap-2 p-4 max-h-[300px] overflow-y-auto">
                                            {columnOptions
                                                .filter(col => !('alwaysVisible' in col) || !col.alwaysVisible)
                                                .filter(
                                                    col =>
                                                        columnSearch === '' ||
                                                        col.name.toLowerCase().includes(columnSearch.toLowerCase()),
                                                )
                                                .map(column => {
                                                    const isSelected =
                                                        visibleColumns[column.id as keyof typeof visibleColumns]
                                                    return (
                                                        <button
                                                            key={column.id}
                                                            onClick={() => handleColumnToggle(column.id, !isSelected)}
                                                            className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                                                        >
                                                            <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-300">
                                                                {isSelected && (
                                                                    <Check className="h-4 w-4 text-primary" />
                                                                )}
                                                            </div>
                                                            <span>{column.name}</span>
                                                        </button>
                                                    )
                                                })}
                                        </div>
                                    </div>
                                </PopoverDialog>
                            </Popover>
                        </PopoverTrigger>
                    </div>
                </div>

                <div className="table-responsive">
                    <DataTable
                        data={monsters}
                        columns={columns}
                        isLoading={isLoading}
                        enableSorting={true}
                        sorting={sorting}
                        setSorting={setSorting}
                        containerClassName="monster-table"
                    />
                </div>

                <div className="card-footer">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full p-4">
                        {/* Left side: Page size selector and item count info */}
                        <div className="flex items-center gap-4">
                            <PaginationPageSizeSelector value={pageSize} onChange={onPageSizeChange} />
                            <div className="text-sm text-muted-foreground">
                                {isLoading ? (
                                    'Loading...'
                                ) : totalCount > 0 ? (
                                    <>
                                        Showing {(currentPage - 1) * pageSize + 1}-
                                        {Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()}{' '}
                                        monsters
                                    </>
                                ) : (
                                    'No monsters found'
                                )}
                            </div>
                        </div>

                        {/* Right side: Pagination controls */}
                        <Pagination value={currentPage} onChange={onPageChange} pageCount={totalPages} />
                    </div>
                </div>
            </Card>
        </div>
    )
}
