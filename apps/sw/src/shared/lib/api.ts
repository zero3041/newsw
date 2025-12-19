import axios from 'axios'

export type * from '@workspace/lib/api'

/**
 * API client for Summoner's War bestiary
 * Connects to local Next.js API routes
 */
export const api = axios.create({
    baseURL: '/api', // Next.js API routes
})
