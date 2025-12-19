'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@workspace/ui/components/Button'
import { Swords } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'

export function Navigation() {
    const pathname = usePathname()

    const links = [
        { href: '/', label: 'Home' },
        { href: '/bestiary', label: 'Bestiary' },
    ]

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Swords className="h-6 w-6" />
                        <span className="font-bold text-xl">SW Manager</span>
                    </div>
                    <div className="flex gap-2">
                        {links.map(link => (
                            <Link key={link.href} href={link.href}>
                                <Button variant={pathname === link.href ? 'default' : 'ghost'} size="sm">
                                    {link.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}
