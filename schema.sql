-- Schema untuk D1 Database: CreatorBlueprint

-- Tabel Pengguna (Sudah terintegrasi di fungsi login/auth)
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'USER', -- 'ADMIN' atau 'USER'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Proyek/Topik (Opsional: Jika ingin menyimpan data yang saat ini di localStorage ke Cloudflare D1)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  global_topic TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Tabel Detail Langkah (Opsional: Menyimpan progress per langkah dari LocalStorage ke D1)
CREATE TABLE IF NOT EXISTS project_steps (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  section_id INTEGER NOT NULL,
  is_checked BOOLEAN DEFAULT 0,
  params_json TEXT, -- Menyimpan JSON dari parameter di UI
  result_text TEXT, -- Menyimpan hasil AI
  tip_result TEXT, -- Menyimpan tips
  visual_result TEXT, -- Menyimpan ide visual
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE(project_id, section_id)
);

-- Indexing untuk mempercepat query
CREATE INDEX IF NOT EXISTS idx_projects_user_email ON projects(user_email);
CREATE INDEX IF NOT EXISTS idx_project_steps_project_id ON project_steps(project_id);
