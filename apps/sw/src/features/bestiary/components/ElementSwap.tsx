'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card } from '@workspace/ui/components/Card'
import { api } from '@/shared/lib/api'

interface ElementSwapProps {
    currentMonsterId: number
    familyId?: number
    currentSlug?: string
}

interface FamilyMonster {
    id: number
    name: string
    element: string
    imageFilename?: string
    bestiarySlug?: string
    isAwakened: boolean
    awakenLevel: number
    baseStars?: number
    naturalStars: number
}

export function ElementSwap({ currentMonsterId, familyId, currentSlug }: ElementSwapProps) {
    const { data: family, isLoading } = useQuery({
        queryKey: ['monster-family', familyId],
        queryFn: async () => {
            if (!familyId) return []
            const response = await api.get<FamilyMonster[]>(`/monsters/family/${familyId}`)
            return response.data
        },
        enabled: !!familyId,
    })

    if (isLoading || !family || family.length <= 1) {
        return null
    }

    return (
        <div className="mb-6">
            <div className="flex justify-center flex-wrap gap-4">
                {family.map(monster => {
                    const isActive = monster.bestiarySlug === currentSlug || monster.id === currentMonsterId
                    const starAsset =
                        monster.awakenLevel >= 1
                            ? '/images/stars/star-awakened.png'
                            : '/images/stars/star-unawakened.png'
                    const starCount =
                        monster.awakenLevel >= 1
                            ? Math.min((monster.baseStars || monster.naturalStars) + 1, 6)
                            : monster.baseStars || monster.naturalStars

                    return (
                        <Card
                            key={monster.id}
                            className={`border-2 shadow-sm transition-all hover:shadow-md ${
                                isActive ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                            <Link
                                href={`/bestiary/${monster.bestiarySlug || monster.id}`}
                                className={`block p-4 ${isActive ? 'pointer-events-none' : ''}`}
                            >
                                <div className="flex flex-col items-center gap-2 min-w-[120px]">
                                    <div className="relative w-16 h-16">
                                        {monster.imageFilename && (
                                            <img
                                                src={`/images/monsters/${monster.imageFilename}`}
                                                alt={monster.name}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                            />
                                        )}
                                        {/* Stars overlay */}
                                        <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-1 gap-0.5">
                                            {Array.from({ length: starCount }).map((_, i) => (
                                                <img
                                                    key={i}
                                                    src={starAsset}
                                                    className="w-3 h-3"
                                                    alt="star"
                                                    loading="lazy"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p
                                            className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-900'}`}
                                        >
                                            {monster.name}
                                        </p>
                                        {monster.isAwakened && (
                                            <p className="text-xs text-muted-foreground">({monster.element})</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
