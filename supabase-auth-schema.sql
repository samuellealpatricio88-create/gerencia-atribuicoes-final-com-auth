-- Criar tabela para gerenciar roles dos usuários
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'operator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seus próprios roles
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Política para permitir que admins vejam todos os roles
CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Política para permitir que admins insiram/atualizem roles
CREATE POLICY "Admins can manage roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Função para criar role padrão quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'operator');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função quando um novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir um usuário admin padrão (opcional)
-- Você pode criar um usuário admin manualmente através da interface do Supabase
-- e depois executar este comando para torná-lo admin:
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('USER_ID_AQUI', 'admin') 
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Comentário: Para criar o primeiro admin, você deve:
-- 1. Registrar um usuário através da interface de login
-- 2. Pegar o ID do usuário na tabela auth.users
-- 3. Executar: UPDATE user_roles SET role = 'admin' WHERE user_id = 'USER_ID_AQUI';

