-- アイテムテーブル作成
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('outer','tops','bottoms','shoes','accessories')),
  color TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- カテゴリ検索用インデックス
CREATE INDEX idx_items_category ON items(category);
