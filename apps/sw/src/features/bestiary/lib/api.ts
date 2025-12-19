import { api } from '@/shared/lib/api'
import type { Monster, ApiResponse } from '../types'

export const bestiaryApi = {
    // Monsters
    getMonsters: (params?: {
        page?: number
        limit?: number
        search?: string
        element?: string
        archetype?: string
        natural_stars?: string
    }) => ({
        queryKey: ['monsters', params],
        queryFn: () => api.get<ApiResponse<Monster>>('/monsters', { params }).then(res => res.data),
    }),

    getMonster: (id: number) => ({
        queryKey: ['monster', id],
        queryFn: () => api.get<Monster>(`/monsters/${id}`).then(res => res.data),
    }),

    getMonsterBySlug: (slug: string) => ({
        queryKey: ['monster', 'slug', slug],
        queryFn: () => api.get<Monster>(`/monsters/slug/${slug}`).then(res => res.data),
    }),
}
