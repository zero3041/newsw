'use client'

import { Button } from '@workspace/ui/components/Button'
import { Grid, List } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'

interface ViewToggleProps {
    currentView: 'grid' | 'list' | 'table'
    onViewChange: (view: 'grid' | 'list' | 'table') => void
    className?: string
}

export function ViewToggle({ currentView, onViewChange, className }: ViewToggleProps) {
    // Filter to only show grid/list for ViewToggle
    const toggleCurrentView = currentView === 'table' ? 'grid' : (currentView as 'grid' | 'list')

    return (
        <div className={cn('flex items-center gap-1', className)}>
            <Button
                variant={toggleCurrentView === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewChange('grid')}
                className="h-8 w-8 p-0"
            >
                <Grid className="h-4 w-4" />
            </Button>
            <Button
                variant={toggleCurrentView === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewChange('list')}
                className="h-8 w-8 p-0"
            >
                <List className="h-4 w-4" />
            </Button>
        </div>
    )
}
