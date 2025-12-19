import { Providers } from '@/shared/components/Providers'
import { Navigation } from '@/shared/components/Navigation'
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher'
import '@workspace/ui/globals.css'
import './globals.css'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" translate="no" suppressHydrationWarning>
            <body className={`font-sans antialiased`} suppressHydrationWarning>
                <Providers>
                    <Navigation />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
