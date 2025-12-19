import { AxiosInstance } from 'axios'
import { BestiaryApi } from './sdk/bestiary.api'
import { ExampleApi } from './sdk/example.api'

/**
 * API class for the application
 * @example
 * const api = new Api(
 * axios.create({
        baseURL: 'http://localhost:8080',
    }),
 * )
 * api.bestiary.getMonsters()
 */
export class Api {
    example: ExampleApi
    bestiary: BestiaryApi

    constructor(private readonly client: AxiosInstance) {
        this.example = new ExampleApi(this.client)
        this.bestiary = new BestiaryApi(this.client)
    }
}
