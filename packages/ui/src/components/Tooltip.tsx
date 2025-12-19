'use client'

import {
    Tooltip as AriaTooltip,
    TooltipTrigger as AriaTooltipTrigger,
    composeRenderProps,
    type TooltipProps as AriaTooltipProps,
} from 'react-aria-components'
import { createContext, useContext } from 'react'

import { cn } from '@workspace/ui/lib/utils'

const TooltipTrigger = AriaTooltipTrigger

const Tooltip = ({ className, offset = 4, ...props }: AriaTooltipProps) => (
    <AriaTooltip
        offset={offset}
        className={composeRenderProps(className, className =>
            cn(
                'max-w-xs',
                'z-50 text-xs overflow-hidden rounded-sm bg-neutral-800 px-2.5 py-1.5 text-neutral-200 animate-in fade-in-0 dark:border',
                /* Exiting */
                'data-[exiting]:animate-out data-[exiting]:fade-out-0',
                className,
            ),
        )}
        {...props}
    />
)

// TooltipProvider context
const TooltipContext = createContext<{ delayDuration?: number }>({})

const TooltipProvider = ({ children, delayDuration = 200 }: { children: React.ReactNode; delayDuration?: number }) => (
    <TooltipContext.Provider value={{ delayDuration }}>{children}</TooltipContext.Provider>
)

// TooltipContent component
const TooltipContent = ({
    children,
    className,
    ...props
}: {
    children: React.ReactNode
    className?: string
    [key: string]: any
}) => (
    <div
        className={cn(
            'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className,
        )}
        {...props}
    >
        {children}
    </div>
)

export { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent }
