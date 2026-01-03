CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    text_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_created_at ON documents(created_at);
