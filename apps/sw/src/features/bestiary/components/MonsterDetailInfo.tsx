'use client'

import { Card } from '@workspace/ui/components/Card'
import Link from 'next/link'
import type { Monster } from '../types'

interface MonsterDetailInfoProps {
    monster: Monster
}

export function MonsterDetailInfo({ monster }: MonsterDetailInfoProps) {
    const baseStars = monster.baseStars || monster.naturalStars
    const awakenLevel = monster.awakenLevel ?? 0
    const isAwakened = awakenLevel >= 1
    const starAsset = isAwakened ? '/images/stars/star-awakened.png' : '/images/stars/star-unawakened.png'
    const starCount = isAwakened ? Math.min(baseStars + 1, 6) : baseStars

    // Check if should show awakening materials
    const shouldShowMaterials = monster.canAwaken && awakenLevel < 1

    return (
        <Card className="border-0 shadow-sm">
            <div className="p-4 border-b bg-white">
                <div className="flex items-start gap-2">
                    <img
                        src={`/images/elements/${monster.element}.png`}
                        alt={monster.element}
                        className="w-6 h-6"
                        loading="lazy"
                    />
                    <div className="flex-1">
                        <h3 className="text-xl font-bold">{monster.name}</h3>
                        <p className="text-sm text-muted-foreground">{monster.archetype}</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Monster Portrait with Stars */}
                <div className="flex justify-center mb-6">
                    <div className="relative inline-block">
                        {monster.imageFilename && (
                            <img
                                src={`/images/monsters/${monster.imageFilename}`}
                                alt={monster.name}
                                className="w-48 h-48 object-contain"
                                loading="lazy"
                            />
                        )}
                        {/* Stars overlay */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                            {Array.from({ length: starCount }).map((_, i) => (
                                <img key={i} src={starAsset} className="w-6 h-6" alt="star" loading="lazy" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Sections */}
                <div className="space-y-3">
                    {/* Transforms To */}
                    {monster.transformsTo && (
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm font-medium">Transforms Into</span>
                            <Link
                                href={`/bestiary/${monster.transformsTo.bestiarySlug || monster.transformsTo.id}`}
                                className="flex items-center gap-2 hover:underline"
                            >
                                <span className="text-sm">{monster.transformsTo.name}</span>
                                {monster.transformsTo.imageFilename && (
                                    <img
                                        src={`/images/monsters/${monster.transformsTo.imageFilename}`}
                                        alt={monster.transformsTo.name}
                                        className="w-8 h-8 object-contain"
                                        loading="lazy"
                                    />
                                )}
                            </Link>
                        </div>
                    )}

                    {/* Awakening Bonus */}
                    {monster.awakenBonus && (
                        <div className="py-2 border-b">
                            <div className="text-sm font-medium mb-1">Awakening Bonus</div>
                            <p className="text-sm text-muted-foreground">{monster.awakenBonus}</p>
                        </div>
                    )}

                    {/* Sources */}
                    {monster.source && monster.source.length > 0 && (
                        <div className="py-2 border-b">
                            <div className="text-sm font-medium mb-2">Sources</div>
                            <div className="flex flex-wrap gap-2">
                                {monster.source.map(source => (
                                    <div key={source.id} className="group relative">
                                        {source.iconFilename ? (
                                            <img
                                                src={`/images/icons/${source.iconFilename}`}
                                                alt={source.name}
                                                title={source.name}
                                                className="w-8 h-8 object-contain cursor-help"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800">
                                                {source.name}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Awakening Materials */}
                    {shouldShowMaterials && (
                        <div className="py-2 border-b">
                            <div className="text-sm font-medium mb-2">Awakening Essences</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {/* Magic */}
                                {(monster.awakenMatsMagicHigh ||
                                    monster.awakenMatsMagicMid ||
                                    monster.awakenMatsMagicLow) && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">Magic:</span>
                                        {monster.awakenMatsMagicHigh > 0 && (
                                            <span className="text-purple-600">H×{monster.awakenMatsMagicHigh}</span>
                                        )}
                                        {monster.awakenMatsMagicMid > 0 && (
                                            <span className="text-purple-500">M×{monster.awakenMatsMagicMid}</span>
                                        )}
                                        {monster.awakenMatsMagicLow > 0 && (
                                            <span className="text-purple-400">L×{monster.awakenMatsMagicLow}</span>
                                        )}
                                    </div>
                                )}
                                {/* Fire */}
                                {(monster.awakenMatsFireHigh ||
                                    monster.awakenMatsFireMid ||
                                    monster.awakenMatsFireLow) && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">Fire:</span>
                                        {monster.awakenMatsFireHigh > 0 && (
                                            <span className="text-red-600">H×{monster.awakenMatsFireHigh}</span>
                                        )}
                                        {monster.awakenMatsFireMid > 0 && (
                                            <span className="text-red-500">M×{monster.awakenMatsFireMid}</span>
                                        )}
                                        {monster.awakenMatsFireLow > 0 && (
                                            <span className="text-red-400">L×{monster.awakenMatsFireLow}</span>
                                        )}
                                    </div>
                                )}
                                {/* Water */}
                                {(monster.awakenMatsWaterHigh ||
                                    monster.awakenMatsWaterMid ||
                                    monster.awakenMatsWaterLow) && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">Water:</span>
                                        {monster.awakenMatsWaterHigh > 0 && (
                                            <span className="text-blue-600">H×{monster.awakenMatsWaterHigh}</span>
                                        )}
                                        {monster.awakenMatsWaterMid > 0 && (
                                            <span className="text-blue-500">M×{monster.awakenMatsWaterMid}</span>
                                        )}
                                        {monster.awakenMatsWaterLow > 0 && (
                                            <span className="text-blue-400">L×{monster.awakenMatsWaterLow}</span>
                                        )}
                                    </div>
                                )}
                                {/* Wind */}
                                {(monster.awakenMatsWindHigh ||
                                    monster.awakenMatsWindMid ||
                                    monster.awakenMatsWindLow) && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">Wind:</span>
                                        {monster.awakenMatsWindHigh > 0 && (
                                            <span className="text-green-600">H×{monster.awakenMatsWindHigh}</span>
                                        )}
                                        {monster.awakenMatsWindMid > 0 && (
                                            <span className="text-green-500">M×{monster.awakenMatsWindMid}</span>
                                        )}
                                        {monster.awakenMatsWindLow > 0 && (
                                            <span className="text-green-400">L×{monster.awakenMatsWindLow}</span>
                                        )}
                                    </div>
                                )}
                                {/* Light */}
                                {(monster.awakenMatsLightHigh ||
                                    monster.awakenMatsLightMid ||
                                    monster.awakenMatsLightLow) && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">Light:</span>
                                        {monster.awakenMatsLightHigh > 0 && (
                                            <span className="text-yellow-600">H×{monster.awakenMatsLightHigh}</span>
                                        )}
                                        {monster.awakenMatsLightMid > 0 && (
                                            <span className="text-yellow-500">M×{monster.awakenMatsLightMid}</span>
                                        )}
                                        {monster.awakenMatsLightLow > 0 && (
                                            <span className="text-yellow-400">L×{monster.awakenMatsLightLow}</span>
                                        )}
                                    </div>
                                )}
                                {/* Dark */}
                                {(monster.awakenMatsDarkHigh ||
                                    monster.awakenMatsDarkMid ||
                                    monster.awakenMatsDarkLow) && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">Dark:</span>
                                        {monster.awakenMatsDarkHigh > 0 && (
                                            <span className="text-gray-700">H×{monster.awakenMatsDarkHigh}</span>
                                        )}
                                        {monster.awakenMatsDarkMid > 0 && (
                                            <span className="text-gray-600">M×{monster.awakenMatsDarkMid}</span>
                                        )}
                                        {monster.awakenMatsDarkLow > 0 && (
                                            <span className="text-gray-500">L×{monster.awakenMatsDarkLow}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Fusion Ingredient For */}
                    {monster.fusionIngredientFor && monster.fusionIngredientFor.length > 0 && (
                        <div className="py-2 border-b">
                            <div className="text-sm font-medium mb-2">Fusion Ingredient For</div>
                            <div className="flex flex-wrap gap-2">
                                {monster.fusionIngredientFor.map(fusion => (
                                    <Link
                                        key={fusion.id}
                                        href={`/bestiary/${(fusion as any).product?.bestiarySlug || (fusion as any).product?.id}`}
                                        className="hover:opacity-80"
                                    >
                                        {(fusion as any).product?.imageFilename && (
                                            <div className="relative">
                                                <img
                                                    src={`/images/monsters/${(fusion as any).product.imageFilename}`}
                                                    alt={(fusion as any).product?.name || 'Fusion product'}
                                                    className="w-12 h-12 object-contain"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fusion Product Of */}
                    {monster.fusion && monster.fusion.ingredients && monster.fusion.ingredients.length > 0 && (
                        <div className="py-2 border-b">
                            <div className="text-sm font-medium mb-2">Fusion Product Of</div>
                            <div className="flex flex-wrap gap-2">
                                {monster.fusion.ingredients.map(ingredient => (
                                    <Link
                                        key={ingredient.id}
                                        href={`/bestiary/${ingredient.bestiarySlug || ingredient.id}`}
                                        className="hover:opacity-80"
                                    >
                                        {ingredient.imageFilename && (
                                            <div className="relative">
                                                <img
                                                    src={`/images/monsters/${ingredient.imageFilename}`}
                                                    alt={ingredient.name}
                                                    className="w-12 h-12 object-contain"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skill-ups to Max */}
                    {monster.skillUpsToMax && monster.skillUpsToMax > 0 && (
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-medium">Skill-ups to Max</span>
                            <div className="relative">
                                <img
                                    src="/images/monsters/devilmon_dark.png"
                                    alt="Devilmon"
                                    className="w-10 h-10 object-contain"
                                    loading="lazy"
                                />
                                <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {monster.skillUpsToMax}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
