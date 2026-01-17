import type { Child } from 'hono/jsx'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: Child
}

export function Layout({ children }: LayoutProps) {
  return (
    <div class="min-h-screen flex flex-col bg-background">
      <Header />
      <main class="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
