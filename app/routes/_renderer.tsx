import { jsxRenderer } from 'hono/jsx-renderer'
import { Style } from 'hono/css'
import { Script, Link } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ?? 'My Wardrobe Deck'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <Link href="/app/static/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" />
        <Style />
      </head>
      <body class="bg-background text-text-main font-sans">
        {children}
      </body>
    </html>
  )
})
