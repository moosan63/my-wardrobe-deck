export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer class="bg-primary-dark text-white/60 mt-auto">
      {/* Separator line */}
      <div class="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo / Brand */}
          <div class="flex items-center space-x-3">
            <i class="fa-solid fa-vest text-accent text-xl" aria-hidden="true"></i>
            <div>
              <span class="font-medium text-white/80 tracking-wide">My Wardrobe Deck</span>
              <p class="text-xs text-white/40 mt-0.5">Organize your style</p>
            </div>
          </div>

          {/* Links */}
          <nav class="flex items-center space-x-8 text-sm">
            <a href="/" class="hover:text-accent transition-colors duration-250 tracking-wide">
              ホーム
            </a>
            <a href="/items/new" class="hover:text-accent transition-colors duration-250 tracking-wide">
              新規追加
            </a>
          </nav>

          {/* Copyright */}
          <p class="text-xs text-white/40 tracking-wide">
            &copy; {currentYear} My Wardrobe Deck. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
