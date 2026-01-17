export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer class="bg-primary text-white/70 mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo / Brand */}
          <div class="flex items-center space-x-2">
            <i class="fa-solid fa-vest text-accent"></i>
            <span class="font-medium">My Wardrobe Deck</span>
          </div>

          {/* Links */}
          <nav class="flex items-center space-x-6 text-sm">
            <a href="/" class="hover:text-white transition-colors">
              ホーム
            </a>
            <a href="/items/new" class="hover:text-white transition-colors">
              新規追加
            </a>
          </nav>

          {/* Copyright */}
          <p class="text-sm text-white/50">
            &copy; {currentYear} My Wardrobe Deck
          </p>
        </div>
      </div>
    </footer>
  )
}
