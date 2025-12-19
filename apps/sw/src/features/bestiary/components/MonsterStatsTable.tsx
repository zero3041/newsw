'use client'

import { Card } from '@workspace/ui/components/Card'
import type { Monster } from '../types'

interface MonsterStatsTableProps {
    monster: Monster
}

export function MonsterStatsTable({ monster }: MonsterStatsTableProps) {
    const baseStars = monster.baseStars || monster.naturalStars

    // Generate stats for all star levels (1-6 stars)
    const statsForAllStars: Record<number, { HP: number | null; ATK: number | null; DEF: number | null }> = {}

    for (let grade = 1; grade <= 6; grade++) {
        if (grade === baseStars) {
            // Sử dụng base stats từ API cho grade chính xác
            statsForAllStars[grade] = {
                HP: monster.baseHp || monster.maxLvlHp || null,
                ATK: monster.baseAttack || monster.maxLvlAttack || null,
                DEF: monster.baseDefense || monster.maxLvlDefense || null,
            }
        } else {
            // Tính toán đơn giản cho các grade khác dựa trên raw stats
            const multiplier = grade / baseStars
            statsForAllStars[grade] = {
                HP: monster.rawHp ? Math.round(monster.rawHp * 15 * multiplier * 10) : null,
                ATK: monster.rawAttack ? Math.round(monster.rawAttack * multiplier * 10) : null,
                DEF: monster.rawDefense ? Math.round(monster.rawDefense * multiplier * 10) : null,
            }
        }
    }

    const grades = Object.keys(statsForAllStars).map(Number)

    return (
        <Card className="border-0 shadow-sm">
            <div className="p-4">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-3 font-semibold text-sm">Grade</th>
                                {grades.map(grade => (
                                    <th key={grade} className="text-center py-2 px-3 font-semibold text-sm">
                                        {grade}⭐
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium text-sm">HP</td>
                                {grades.map(grade => (
                                    <td key={grade} className="text-center py-2 px-3 text-sm">
                                        {statsForAllStars[grade].HP?.toLocaleString() || '-'}
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium text-sm">ATK</td>
                                {grades.map(grade => (
                                    <td key={grade} className="text-center py-2 px-3 text-sm">
                                        {statsForAllStars[grade].ATK?.toLocaleString() || '-'}
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium text-sm">DEF</td>
                                {grades.map(grade => (
                                    <td key={grade} className="text-center py-2 px-3 text-sm">
                                        {statsForAllStars[grade].DEF?.toLocaleString() || '-'}
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium text-sm">SPD</td>
                                <td colSpan={grades.length} className="text-center py-2 px-3 text-sm">
                                    {monster.speed || '-'}
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium text-sm">CRIT Rate</td>
                                <td colSpan={grades.length} className="text-center py-2 px-3 text-sm">
                                    {monster.critRate !== undefined ? `${monster.critRate}%` : '-'}
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium text-sm">CRIT DMG</td>
                                <td colSpan={grades.length} className="text-center py-2 px-3 text-sm">
                                    {monster.critDamage !== undefined ? `${monster.critDamage}%` : '-'}
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium text-sm">Accuracy</td>
                                <td colSpan={grades.length} className="text-center py-2 px-3 text-sm">
                                    {monster.accuracy !== undefined ? `${monster.accuracy}%` : '-'}
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium text-sm">Resistance</td>
                                <td colSpan={grades.length} className="text-center py-2 px-3 text-sm">
                                    {monster.resistance !== undefined ? `${monster.resistance}%` : '-'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    )
}
