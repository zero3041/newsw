'use client'

import { Button } from '@workspace/ui/components/Button'
import { toast } from '@workspace/ui/components/Sonner'
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher'
import Link from 'next/link'

export default function Page() {
    return (
        <div className="min-h-screen">
            <div className="absolute top-4 right-4">
                <ThemeSwitcher />
            </div>
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-2xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold my-6">Summoner's War Manager</h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        A modern interface for managing and exploring Summoner's War data
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/bestiary">
                            <Button size="lg" variant="default">
                                Explore Bestiary
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() =>
                                toast.success({
                                    title: 'Welcome',
                                    description: "Successfully launched Summoner's War Manager!",
                                })
                            }
                        >
                            Test Toast
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
