import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div class="min-h-screen bg-background">
      <header class="bg-primary text-white p-4">
        <h1 class="text-xl font-bold">My Wardrobe Deck</h1>
      </header>
      <main class="container mx-auto p-4">
        <p class="text-text-main">ワードローブ管理アプリへようこそ</p>
      </main>
    </div>
  )
})
