-- Criação das tabelas para o sistema de gerenciamento de atribuições

-- Tabela de produtos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  nickname VARCHAR(50),
  color VARCHAR(7), -- Para cores hex como #FF0000
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de gerentes
CREATE TABLE managers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  braip_name VARCHAR(255),
  braip_email VARCHAR(255),
  keed_name VARCHAR(255),
  keed_email VARCHAR(255),
  payt_name VARCHAR(255),
  payt_email VARCHAR(255),
  hest_name VARCHAR(255),
  hest_email VARCHAR(255),
  braip_document TEXT,
  keed_document TEXT,
  payt_document TEXT,
  hest_document TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atribuições
CREATE TABLE attributions (
  id SERIAL PRIMARY KEY,
  manager_id INTEGER REFERENCES managers(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- BRAIP, KEED, PAYT, HEST
  email VARCHAR(255) NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  is_attributed BOOLEAN DEFAULT true,
  attribution_type VARCHAR(50) DEFAULT 'product', -- 'product', 'todos', 'nao_atribuido', 'atribuido_outro'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir produtos de exemplo
INSERT INTO products (name, description, nickname, color, is_active) VALUES
('SECAPS', 'Produto SECAPS', 'SECAPS', '#3B82F6', true),
('CHÁ', 'Produto CHÁ', 'CHÁ', '#10B981', true),
('MAX', 'Produto MAX', 'MAX', '#F59E0B', true),
('LONG', 'Produto LONG', 'LONG', '#EF4444', true),
('TOOP', 'Produto TOOP', 'TOOP', '#8B5CF6', true),
('NEUMAX', 'Produto NEUMAX', 'NEUMAX', '#06B6D4', true);

-- Inserir gerentes de exemplo
INSERT INTO managers (name, phone) VALUES
('LARISSA MIRANDA', '(11) 99999-9999'),
('GERENTE A', '(11) 88888-8888'),
('GERENTE B', '(11) 77777-7777');

-- Habilitar RLS (Row Level Security) para as tabelas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE attributions ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso público (para desenvolvimento)
-- Em produção, você deve ajustar essas políticas conforme necessário
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on managers" ON managers FOR ALL USING (true);
CREATE POLICY "Allow all operations on attributions" ON attributions FOR ALL USING (true);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_managers_updated_at BEFORE UPDATE ON managers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attributions_updated_at BEFORE UPDATE ON attributions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

