import { queryOptions } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import {
    PaginatedResponse,
    Monster,
    Skill,
    LeaderSkill,
    SkillEffect,
    MonsterSource,
    HomunculusSkill,
    GameItem,
    Fusion,
    Dungeon,
    Level,
} from './bestiary.type'

export class BestiaryApi {
    constructor(private readonly client: AxiosInstance) {}

    getMonsters() {
        return queryOptions({
            queryKey: ['bestiary', 'monsters'],
            queryFn: async () => {
                const response = await this.client.get<PaginatedResponse<Monster>>('/api/v2/monsters/')
                return response.data
            },
        })
    }

    getMonster(id: number) {
        return queryOptions({
            queryKey: ['bestiary', 'monsters', id],
            queryFn: async () => {
                const response = await this.client.get<Monster>(`/api/v2/monsters/${id}/`)
                return response.data
            },
        })
    }

    getSkills() {
        return queryOptions({
            queryKey: ['bestiary', 'skills'],
            queryFn: async () => {
                const response = await this.client.get<PaginatedResponse<Skill>>('/api/v2/skills/')
                return response.data
            },
        })
    }

    getSkill(id: number) {
        return queryOptions({
            queryKey: ['bestiary', 'skills', id],
            queryFn: async () => {
                const response = await this.client.get<Skill>(`/api/v2/skills/${id}/`)
                return response.data
            },
        })
    }

    getSkillEffects() {
        return queryOptions({
            queryKey: ['bestiary', 'skill-effects'],
            queryFn: async () => {
                const response = await this.client.get<PaginatedResponse<SkillEffect>>('/api/v2/skill-effects/')
                return response.data
            },
        })
    }

    getSkillEffect(id: number) {
        return queryOptions({
            queryKey: ['bestiary', 'skill-effects', id],
            queryFn: async () => {
                const response = await this.client.get<SkillEffect>(`/api/v2/skill-effects/${id}/`)
                return response.data
            },
        })
    }

    getLeaderSkills() {
        return queryOptions({
            queryKey: ['bestiary', 'leader-skills'],
            queryFn: async () => {
                const response = await this.client.get<PaginatedResponse<LeaderSkill>>('/api/v2/leader-skills/')
                return response.data
            },
        })
    }

    getLeaderSkill(id: number) {
        return queryOptions({
            queryKey: ['bestiary', 'leader-skills', id],
            queryFn: async () => {
                const response = await this.client.get<LeaderSkill>(`/api/v2/leader-skills/${id}/`)
                return response.data
            },
        })
    }

    getMonsterSources() {
        return queryOptions({
            queryKey: ['bestiary', 'monster-sources'],
            queryFn: async () => {
                const response = await this.client.get<PaginatedResponse<MonsterSource>>('/api/v2/monster-sources/')
                return response.data
            },
        })
    }

    getHomunculusSkills() {
        return queryOptions({
            queryKey: ['bestiary', 'homunculus-skills'],
            queryFn: async () => {
                const response = await this.client.get<PaginatedResponse<HomunculusSkill>>('/api/v2/homunculus-skills/')
                return response.data
            },
        })
    }

    getItems() {
        return queryOptions({
            queryKey: ['bestiary', 'items'],
            queryFn: async () => {
                const response = await this.client.get<PaginatedResponse<GameItem>>('/api/v2/items/')
                return response.data
            },
        })
    }

    getFusions() {
        return queryOptions({
            queryKey: ['bestiary', 'fusions'],
            queryFn: async () => {
                const response = await this.client.get<PaginatedResponse<Fusion>>('/api/v2/fusions/')
                return response.data
            },
        })
    }

    getDungeons() {
        return queryOptions({
            queryKey: ['bestiary', 'dungeons'],
            queryFn: async () => {
                const response = await this.client.get<PaginatedResponse<Dungeon>>('/api/v2/dungeons/')
                return response.data
            },
        })
    }

    getLevels() {
        return queryOptions({
            queryKey: ['bestiary', 'levels'],
            queryFn: async () => {
                const response = await this.client.get<PaginatedResponse<Level>>('/api/v2/levels/')
                return response.data
            },
        })
    }
}
