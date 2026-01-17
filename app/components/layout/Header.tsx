import { Button } from '../ui/Button'

export function Header() {
  return (
    <header class="bg-primary text-white shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          {/* Logo / App Name */}
          <a href="/" class="flex items-center space-x-2 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary rounded">
            <i class="fa-solid fa-vest text-accent text-xl" aria-hidden="true"></i>
            <span class="text-lg md:text-xl font-bold tracking-wide">My Wardrobe Deck</span>
          </a>

          {/* Navigation - Always visible */}
          <nav class="flex items-center space-x-3 md:space-x-6">
            <a
              href="/"
              class="text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded p-1"
            >
              <i class="fa-solid fa-house" aria-hidden="true"></i>
              <span class="hidden md:inline ml-1">ホーム</span>
            </a>
            <Button variant="accent" size="sm" href="/items/new">
              <i class="fa-solid fa-plus md:mr-1" aria-hidden="true"></i>
              <span class="hidden md:inline">新規追加</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
