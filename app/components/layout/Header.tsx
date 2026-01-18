import { Button } from '../ui/Button'

export function Header() {
  return (
    <header class="bg-primary text-white shadow-elegant">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18 md:h-22">
          {/* Logo / App Name */}
          <a
            href="/"
            class="flex items-center space-x-3 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary rounded-lg py-2"
          >
            <i class="fa-solid fa-vest text-accent text-2xl md:text-3xl" aria-hidden="true"></i>
            <div class="flex flex-col">
              <span class="text-lg md:text-xl font-bold tracking-wider">My Wardrobe Deck</span>
              <span class="text-xs text-white/50 hidden md:block tracking-wide">Your personal wardrobe manager</span>
            </div>
          </a>

          {/* Navigation */}
          <nav class="flex items-center space-x-4 md:space-x-6">
            <a
              href="/"
              class="flex items-center space-x-1 text-white/70 hover:text-white transition-colors duration-250 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-2"
            >
              <i class="fa-solid fa-house text-sm" aria-hidden="true"></i>
              <span class="hidden md:inline text-sm font-medium">ホーム</span>
            </a>
            <Button variant="accent" size="sm" href="/items/new">
              <i class="fa-solid fa-plus" aria-hidden="true"></i>
              <span class="hidden md:inline">新規追加</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
