import { useState, useCallback } from 'react'
import type { MonsterFilters } from '../types'

export function useMonsterFilters() {
    const [filters, setFilters] = useState<MonsterFilters>({})

    const updateFilters = useCallback((newFilters: MonsterFilters) => {
        setFilters(newFilters)
    }, [])

    const resetFilters = useCallback(() => {
        setFilters({})
    }, [])

    return {
        filters,
        updateFilters,
        resetFilters,
    }
}
