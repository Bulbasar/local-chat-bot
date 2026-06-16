CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

DROP TABLE IF EXISTS memory_clusters;
DROP TABLE IF EXISTS memory;
DROP TABLE IF EXISTS messages;

-- =========================
-- MESSAGES
-- =========================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  sessionid TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_sessionid ON messages(sessionid);

-- =========================
-- MEMORY
-- =========================
CREATE TABLE memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  content TEXT NOT NULL,

  -- pgvector FIX
  embedding VECTOR(768),

  sessionid TEXT NOT NULL,

  type TEXT NOT NULL DEFAULT 'episodic'
    CHECK (type IN ('identity', 'preference', 'goal', 'project', 'episodic')),

  importance FLOAT DEFAULT 0.5 CHECK (importance >= 0 AND importance <= 1),
  confidence FLOAT DEFAULT 0.7 CHECK (confidence >= 0 AND confidence <= 1),

  access_count INT DEFAULT 0,
  last_accessed TIMESTAMP DEFAULT NOW(),

  decay_rate FLOAT DEFAULT 0.01,

  content_hash TEXT NOT NULL,

  is_active BOOLEAN DEFAULT TRUE,

  version INT DEFAULT 1,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX memory_embedding_idx
ON memory USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX memory_session_idx ON memory(sessionid);
CREATE INDEX memory_type_idx ON memory(type);
CREATE INDEX memory_importance_idx ON memory(importance);
CREATE INDEX memory_access_idx ON memory(access_count);
CREATE INDEX memory_active_idx ON memory(is_active);
CREATE INDEX memory_hash_idx ON memory(content_hash);

-- =========================
-- CLUSTERS
-- =========================
CREATE TABLE memory_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessionid TEXT NOT NULL,
  cluster_type TEXT,
  summary TEXT NOT NULL,

  centroid VECTOR(768),

  strength FLOAT DEFAULT 0.5,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX memory_clusters_session_idx ON memory_clusters(sessionid);