  # ワードローブ管理アプリ MVP 実装計画                                                              
                                                                                                     
  ## 概要                                                                                            
                                                                                                     
  カードデッキのように洋服を俯瞰して管理するアプリのMVP（CRUD+一覧機能）を実装する。                 
                                                                                                     
  ## 確定仕様                                                                                        
                                                                                                     
  | 項目 | 内容 |                                                                                    
  |------|------|                                                                                    
  | カテゴリ | 5分類（アウター・トップス・ボトムス・シューズ・アクセサリー） |                       
  | 認証 | 簡易認証（パスワードのみ、全ページ必須） |                                                
  | 画像 | なし（アイコン+色背景+テキスト情報でカード表示） |                                        
  | 初回スコープ | CRUD+一覧のみ（タグ・フィルター機能は後回し） |                                   
                                                                                                     
  ## 技術スタック                                                                                    
                                                                                                     
  - TypeScript / HonoX / Cloudflare Workers / D1 / Tailwind CSS                                      
                                                                                                     
  ---                                                                                                
                                                                                                     
  ## プロジェクト構造                                                                                
                                                                                                     
  ```                                                                                                
  my-wardrobe-deck/                                                                                  
  ├── app/                                                                                           
  │   ├── routes/                                                                                    
  │   │   ├── index.tsx              # ホーム（カテゴリ別一覧）                                      
  │   │   ├── login.tsx              # ログイン                                                      
  │   │   ├── items/                                                                                 
  │   │   │   ├── new.tsx            # 新規作成                                                      
  │   │   │   └── [id]/                                                                              
  │   │   │       ├── index.tsx      # 詳細                                                          
  │   │   │       └── edit.tsx       # 編集                                                          
  │   │   └── api/                                                                                   
  │   │       ├── items/             # CRUD API                                                      
  │   │       └── auth/              # 認証API                                                       
  │   ├── components/                                                                                
  │   │   ├── items/                 # ItemCard, ItemForm等                                          
  │   │   ├── layout/                # Header, Footer                                                
  │   │   └── ui/                    # Button, Input等                                               
  │   ├── db/                        # D1アクセス層                                                  
  │   ├── middleware/                # 認証                                                          
  │   ├── lib/                       # 定数・バリデーション                                          
  │   └── types/                     # 型定義                                                        
  ├── tests/                         # Vitestテスト                                                  
  ├── migrations/                    # D1マイグレーション                                            
  └── 設定ファイル群                                                                                 
  ```                                                                                                
                                                                                                     
  ---                                                                                                
                                                                                                     
  ## データモデル                                                                                    
                                                                                                     
  ```sql                                                                                             
  CREATE TABLE items (                                                                               
  id INTEGER PRIMARY KEY AUTOINCREMENT,                                                              
  name TEXT NOT NULL,                                                                                
  category TEXT NOT NULL CHECK (category IN                                                          
  ('outer','tops','bottoms','shoes','accessories')),                                                 
  color TEXT NOT NULL,                                                                               
  brand TEXT,                                                                                        
  description TEXT,                                                                                  
  created_at TEXT DEFAULT (datetime('now')),                                                         
  updated_at TEXT DEFAULT (datetime('now'))                                                          
  );                                                                                                 
  ```                                                                                                
                                                                                                     
  ---                                                                                                
                                                                                                     
  ## フェーズ分割（CLAUDE.md準拠）                                                                   
                                                                                                     
  ### Phase 0: 環境セットアップ                                                                      
  - HonoXプロジェクト初期化                                                                          
  - 依存パッケージ（hono, zod, vitest, tailwindcss等）                                               
  - wrangler.toml, vite.config.ts, vitest.config.ts設定                                              
  - 基本ディレクトリ構造作成                                                                         
  - **完了条件**: `npm run dev`で起動、`npm run test`で実行可能                                      
                                                                                                     
  ### Phase 1: データベース・モデル層                                                                
  - D1スキーマ・マイグレーション作成                                                                 
  - 型定義・定数定義                                                                                 
  - DBアクセス層（CRUD関数）                                                                         
  - **TDD**: テスト先行で実装                                                                        
  - **完了条件**: DB操作テスト全パス                                                                 
                                                                                                     
  ### Phase 2: API/バックエンド                                                                      
  - RESTful APIエンドポイント実装                                                                    
  - バリデーション統合（zod）                                                                        
  - **TDD**: テスト先行で実装                                                                        
  - **完了条件**: API全テストパス、curl動作確認                                                      
                                                                                                     
  ### Phase 3: フロントエンド（一覧・カード表示）                                                    
  - UIコンポーネント作成                                                                             
  - カテゴリ別一覧ページ                                                                             
  - hotel-uro.jp風デザイン適用                                                                       
  - **完了条件**: カテゴリ別カード表示、レスポンシブ対応                                             
                                                                                                     
  ### Phase 4: フロントエンド（CRUD画面）                                                            
  - 新規作成/編集/詳細/削除画面                                                                      
  - フォームバリデーション                                                                           
  - **完了条件**: 全CRUD操作がUIから実行可能                                                         
                                                                                                     
  ### Phase 5: 簡易認証                                                                              
  - パスワード認証ミドルウェア                                                                       
  - ログイン/ログアウト機能                                                                          
  - **完了条件**: 未認証時リダイレクト、セッション維持                                               
                                                                                                     
  ### Phase 6: 最終調整・デプロイ                                                                    
  - 全テスト確認                                                                                     
  - Cloudflareデプロイ                                                                               
  - **完了条件**: 本番環境動作確認                                                                   
                                                                                                     
  ---                                                                                                
                                                                                                     
  ## 重要ファイル                                                                                    
                                                                                                     
  | ファイル | 役割 |                                                                                
  |---------|------|                                                                                 
  | `app/db/items.ts` | D1へのCRUD操作（コアロジック） |                                             
  | `app/routes/api/items/index.ts` | APIエンドポイント |                                            
  | `app/components/items/ItemCard.tsx` | カード表示コンポーネント |                                 
  | `app/routes/index.tsx` | ホームページ（一覧表示） |                                              
  | `app/middleware/auth.ts` | 認証ミドルウェア |                                                    
                                                                                                     
  ---                                                                                                
                                                                                                     
  ## 開発フロー（各フェーズ共通）                                                                    
                                                                                                     
  1. 実装サブエージェントがTDDで実装                                                                 
  2. レビューサブエージェントがレビュー                                                              
  3. 指摘対応                                                                                        
  4. ユーザー確認・承認                                                                              
  5. Dev Log作成                                                                                     
  6. 次フェーズへ                                                                                    
                                                                                                     
  ---                                                                                                
                                                                                                     
  ## 検証方法                                                                                        
                                                                                                     
  - **ユニットテスト**: Vitest（Cloudflare Workers pool）                                            
  - **手動確認**: ローカル環境でブラウザ/curl動作確認                                                
  - **本番確認**: Cloudflareデプロイ後の動作確認                                                     
                                                  