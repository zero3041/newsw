'use client'

import { Button } from '@workspace/ui/components/Button'
import { Input } from '@workspace/ui/components/Textfield'
import { BsSelect as Select } from '@workspace/ui/components/Select'
import { Checkbox } from '@workspace/ui/components/Checkbox'
import { Card } from '@workspace/ui/components/Card'
import { Separator } from '@workspace/ui/components/Separator'
import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'
import type { MonsterFilters } from '../types'
import { ELEMENTS, ARCHETYPES, NATURAL_STARS } from '../consts'

interface MonsterFiltersProps {
    filters: MonsterFilters
    onFiltersChange: (filters: MonsterFilters) => void
    onReset: () => void
}

export function MonsterFilters({ filters, onFiltersChange, onReset }: MonsterFiltersProps) {
    const [isOpen, setIsOpen] = useState(true)

    const updateFilters = (updates: Partial<MonsterFilters>) => {
        onFiltersChange({ ...filters, ...updates })
    }

    return (
        <Card className="mb-6">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? 'Collapse' : 'Expand'}
                    </Button>
                </div>

                {isOpen && (
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search monsters..."
                                value={filters.name || ''}
                                onChange={e => updateFilters({ name: e.target.value || undefined })}
                                className="pl-10"
                            />
                        </div>

                        <Separator />

                        {/* Stars */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Natural Stars</label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                                    <Select
                                        selectedKey={filters.natural_stars_min?.toString() || '1'}
                                        onSelectionChange={key =>
                                            updateFilters({ natural_stars_min: parseInt(key as string) })
                                        }
                                        options={[1, 2, 3, 4, 5, 6].map(star => ({
                                            id: star.toString(),
                                            name: `${star}⭐`,
                                        }))}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                                    <Select
                                        selectedKey={filters.natural_stars_max?.toString() || '6'}
                                        onSelectionChange={key =>
                                            updateFilters({ natural_stars_max: parseInt(key as string) })
                                        }
                                        options={[1, 2, 3, 4, 5, 6].map(star => ({
                                            id: star.toString(),
                                            name: `${star}⭐`,
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Elements */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Elements</label>
                            <div className="grid grid-cols-5 gap-2">
                                {ELEMENTS.map(element => (
                                    <Checkbox
                                        key={element.value}
                                        isSelected={(filters.element || []).includes(element.value as any)}
                                        onChange={(selected: boolean) => {
                                            const current = filters.element || []
                                            const updated = selected
                                                ? [...current, element.value]
                                                : current.filter(e => e !== element.value)
                                            updateFilters({ element: updated.length > 0 ? updated : undefined })
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span>{element.icon}</span>
                                            <span className="text-xs">{element.label}</span>
                                        </div>
                                    </Checkbox>
                                ))}
                            </div>
                        </div>

                        {/* Archetypes */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Archetypes</label>
                            <div className="grid grid-cols-3 gap-2">
                                {ARCHETYPES.map(archetype => (
                                    <Checkbox
                                        key={archetype.value}
                                        isSelected={(filters.archetype || []).includes(archetype.value as any)}
                                        onChange={(selected: boolean) => {
                                            const current = filters.archetype || []
                                            const updated = selected
                                                ? [...current, archetype.value]
                                                : current.filter(a => a !== archetype.value)
                                            updateFilters({ archetype: updated.length > 0 ? updated : undefined })
                                        }}
                                    >
                                        {archetype.label}
                                    </Checkbox>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onReset} className="w-full">
                                <X className="h-4 w-4 mr-2" />
                                Reset All Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
