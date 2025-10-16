# 📦 Nuvra CRM - Guia de Migração e Portabilidade

Este documento fornece instruções completas para exportar, importar e migrar o Nuvra CRM entre diferentes contas Bolt ou ambientes de desenvolvimento, **incluindo dados do Supabase**.

## 🎯 Visão Geral

O Nuvra CRM foi projetado para ser **completamente portável**, permitindo que você:
- Migre entre contas Bolt sem perder dados
- Faça backup completo do banco de dados Supabase
- Compartilhe o projeto com outros desenvolvedores
- Restaure dados em novos ambientes
- Trabalhe com dados reais ou modo demo

---

## 📋 Checklist de Migração

### Antes de Trocar de Conta Bolt

- [ ] Exportar o projeto completo como ZIP
- [ ] **CRÍTICO:** Fazer backup do Supabase via `/api/dev/export-all?key=SERVICE_KEY`
- [ ] Salvar arquivo `.env` com todas as variáveis configuradas
- [ ] Verificar o arquivo `.env.example` está presente
- [ ] Documentar quaisquer configurações personalizadas

### Após Importar em Nova Conta

- [ ] Fazer upload do ZIP no novo Bolt
- [ ] Configurar novo Supabase (criar projeto e obter credenciais)
- [ ] Executar migration SQL para criar schema (veja seção "Database Setup")
- [ ] Copiar `.env.example` para `.env` e configurar com novas credenciais
- [ ] Popular banco de dados: `POST /api/dev/seed?key=SERVICE_KEY` ou usar script
- [ ] Verificar conectividade: `GET /api/health`
- [ ] Testar criação de leads via API

---

## 🔧 Instruções Passo a Passo

### 1. Database Setup (Primeira Vez)

Antes de começar, você precisa configurar o Supabase:

#### 1.1 Criar Projeto Supabase
1. Acesse https://supabase.com e crie uma conta
2. Crie um novo projeto
3. Aguarde o provisionamento (2-3 minutos)
4. Anote as credenciais: URL, anon key, service_role key

#### 1.2 Executar Migration SQL
1. No dashboard Supabase, vá em **SQL Editor**
2. Crie uma nova query e cole o conteúdo do schema abaixo
3. Execute a query para criar as tabelas

**Schema SQL (copie e execute no Supabase SQL Editor):**

```sql
-- Cria tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  pricing text DEFAULT '',
  features jsonb DEFAULT '[]'::jsonb,
  api_enabled boolean DEFAULT false,
  api_key text UNIQUE,
  icon text DEFAULT 'box',
  color text DEFAULT 'blue',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cria tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  company text DEFAULT '',
  origin text DEFAULT 'direct',
  metadata jsonb DEFAULT '{}'::jsonb,
  qualification text DEFAULT 'cold' CHECK (qualification IN ('cold', 'warm', 'hot')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  value numeric DEFAULT 0,
  notes text DEFAULT '',
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cria tabela de interações
CREATE TABLE IF NOT EXISTS interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  source text NOT NULL,
  content text DEFAULT '',
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Cria índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_qualification ON leads(qualification);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_api_key ON products(api_key) WHERE api_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_interactions_lead_id ON interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_interactions_timestamp ON interactions(timestamp DESC);

-- Habilita RLS em todas as tabelas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Políticas para products
CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE TO authenticated USING (true);

-- Políticas para leads
CREATE POLICY "Authenticated users can view leads"
  ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert leads"
  ON leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete leads"
  ON leads FOR DELETE TO authenticated USING (true);

-- Políticas para interactions
CREATE POLICY "Authenticated users can view interactions"
  ON interactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert interactions"
  ON interactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update interactions"
  ON interactions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete interactions"
  ON interactions FOR DELETE TO authenticated USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 1.3 Configurar Variáveis de Ambiente
Copie `.env.example` para `.env` e configure:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SERVICE_KEY=um-token-seguro-qualquer
```

#### 1.4 Popular Banco de Dados Inicial

**Opção A: Via API (Recomendado)**
```bash
curl -X POST "http://localhost:3000/api/dev/seed?key=SEU_SERVICE_KEY"
```

**Opção B: Via Script**
```bash
npx ts-node scripts/seed_db.ts
```

#### 1.5 Verificar Conectividade
```bash
curl http://localhost:3000/api/health
```

Você deve ver:
```json
{
  "status": "healthy",
  "checks": {
    "supabase": {
      "configured": true,
      "connected": true,
      "message": "Connected successfully"
    }
  }
}
```

---

### 2. Exportar Projeto da Conta Atual

#### Opção A: Via Interface Bolt
1. No Bolt, clique em **"Download ZIP"** ou equivalente
2. Salve o arquivo ZIP em local seguro
3. O arquivo contém todo o código-fonte do projeto

#### Opção B: Via Git (se disponível)
```bash
git clone <seu-repositorio>
cd nuvra-crm
```

### 3. Exportar Dados do Supabase (Backup)

**CRÍTICO:** Antes de trocar de conta Bolt, faça backup de todos os dados!

#### Via API (Recomendado)
```bash
# Substitua SEU_SERVICE_KEY pela chave configurada em .env
curl "http://localhost:3000/api/dev/export-all?key=SEU_SERVICE_KEY" \
  -o backup-$(date +%Y-%m-%d).json
```

Ou abra no navegador:
```
http://localhost:3000/api/dev/export-all?key=SEU_SERVICE_KEY
```

O arquivo JSON contém:
- Todos os produtos
- Todos os leads
- Todas as interações
- Timestamps e metadados

**Salve este arquivo em local seguro!** Você vai precisar dele para restaurar na nova conta.

### 4. Importar em Nova Conta Bolt

#### Passo 4.1: Upload do Projeto
1. Acesse sua nova conta Bolt
2. Use a opção **"Upload Project"** ou **"Import ZIP"**
3. Selecione o arquivo ZIP exportado
4. Aguarde o upload e processamento

#### Passo 4.2: Configurar Novo Supabase
1. Crie um novo projeto Supabase (veja seção 1.1)
2. Execute o schema SQL no SQL Editor (veja seção 1.2)
3. Anote as novas credenciais

#### Passo 4.3: Configurar Variáveis de Ambiente
Edite `.env` com as novas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://novo-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=nova-anon-key
SUPABASE_SERVICE_ROLE_KEY=nova-service-role-key
SERVICE_KEY=novo-token-seguro
N8N_WEBHOOK_URL=
```

#### Passo 4.4: Instalar Dependências
```bash
npm install
```

#### Passo 4.5: Restaurar Dados do Backup

**Opção A: Via Script (Recomendado)**
```bash
npx ts-node scripts/import_dump.ts backup-2025-10-15.json
```

**Opção B: Popular com dados padrão**
```bash
npx ts-node scripts/seed_db.ts
```

#### Passo 4.6: Verificar Migração
```bash
# Verificar saúde do sistema
curl http://localhost:3000/api/health

# Verificar leads
curl http://localhost:3000/api/leads?page=1&limit=10
```

---

## 🔐 Configuração de Ambiente

### Variáveis Obrigatórias (Produção)

```env
# Supabase (obrigatório para backend funcionar)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key

# Admin (para operações privilegiadas)
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Dev (para endpoints de seed/export)
SERVICE_KEY=token-seguro-qualquer
```

### Variáveis Opcionais

```env
# n8n webhook (opcional, para automação)
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/leads

# Demo mode (modo desenvolvimento sem Supabase)
NEXT_PUBLIC_DEV_BOOTSTRAP=true
```

### Comportamento por Configuração

| Configuração | Comportamento |
|-------------|---------------|
| **Supabase configurado** | APIs funcionam, dados persistem no banco |
| **Supabase não configurado** | APIs retornam dados mock (se `DEV_BOOTSTRAP=true`) |
| **N8N configurado** | Novos leads disparam webhook |
| **N8N não configurado** | Webhook é ignorado (não falha) |

---

## 📁 Estrutura de Dados de Backup

O arquivo JSON exportado via `/api/dev/export-all` tem a seguinte estrutura:

```json
{
  "exported_at": "2025-10-15T12:00:00.000Z",
  "version": "1.0.0",
  "tables": {
    "products": [
      {
        "id": "uuid",
        "name": "CRM Core",
        "slug": "crm-core",
        "api_key": "demo_key_123",
        ...
      }
    ],
    "leads": [
      {
        "id": "uuid",
        "name": "Carlos Silva",
        "email": "carlos@example.com",
        "qualification": "hot",
        ...
      }
    ],
    "interactions": [...]
  },
  "counts": {
    "products": 4,
    "leads": 25,
    "interactions": 12
  }
}
```

---

## 🛠️ Solução de Problemas

### Problema: API retorna "supabase_not_configured"

**Solução:**
1. Verifique que as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão no `.env`
2. Reinicie o servidor Next.js após editar `.env`
3. Verifique `/api/health` para confirmar conectividade

### Problema: Erro "Missing Supabase credentials" nos scripts

**Solução:**
1. Verifique que `SUPABASE_SERVICE_ROLE_KEY` está configurado no `.env`
2. Certifique-se de estar usando a **service role key**, não a anon key
3. Obtenha a key correta em: Supabase Dashboard → Settings → API

### Problema: Tabelas não existem no Supabase

**Solução:**
1. Acesse o SQL Editor no dashboard Supabase
2. Execute o script SQL completo da seção "1.2 Executar Migration SQL"
3. Verifique se as tabelas aparecem na aba "Table Editor"
4. Se já existirem políticas com mesmo nome, delete-as primeiro

### Problema: Projeto não builda

**Solução:**
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install

# Verifique erros de TypeScript
npm run typecheck

# Tente buildar novamente
npm run build
```

### Problema: Página em branco após migração

**Solução:**
1. Verifique se todas as dependências foram instaladas
2. Confirme que não há erros no console do navegador (F12)
3. Tente acessar `/login` diretamente
4. Limpe o sessionStorage e tente novamente:
   ```javascript
   sessionStorage.clear();
   location.reload();
   ```

---

## 🚀 Migração para Produção

### Checklist de Produção

- [ ] Remover ou desabilitar `NEXT_PUBLIC_DEV_BOOTSTRAP`
- [ ] Configurar variáveis de ambiente de produção
- [ ] Conectar backend real via `NEXT_PUBLIC_API_BASE`
- [ ] Implementar autenticação real (substituir mocks)
- [ ] Configurar persistência de dados (Supabase, etc.)
- [ ] Testar fluxos sem dados mock
- [ ] Configurar variáveis secretas no host (Vercel, etc.)

### Variáveis de Ambiente de Produção

```env
# NÃO usar em produção:
# NEXT_PUBLIC_DEV_BOOTSTRAP=true

# Usar em produção:
NEXT_PUBLIC_APP_NAME=Nuvra CRM
NEXT_PUBLIC_API_BASE=https://api.producao.com
NEXT_PUBLIC_SUPABASE_URL=https://projeto-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=chave-producao-aqui
```

---

## 📝 Notas Importantes

### Sobre SessionStorage
- Dados armazenados em `sessionStorage` são **temporários**
- Dados são perdidos ao fechar o navegador
- Use a página `/backup` frequentemente para preservar dados

### Sobre Segurança
- Nunca commite arquivos `.env` ou `.env.local`
- O `.env.example` serve apenas como template
- Chaves de API reais devem estar em variáveis de ambiente seguras

### Sobre Portabilidade
- O projeto é **100% frontend** até que o backend seja integrado
- Todos os dados mock são gerenciados no cliente
- Não há dependências de servidores externos no modo demo

---

## 📞 Suporte

Para dúvidas sobre migração ou portabilidade:

1. Verifique a seção "Solução de Problemas" acima
2. Revise o código em `lib/DevBootstrap.tsx`
3. Inspecione o console do navegador para erros
4. Confirme que todas as variáveis de ambiente estão corretas

---

## 🔄 Atualizações Futuras

Ao integrar o backend (Parte 2):
- A página `/backup` poderá exportar dados reais da API
- O DevBootstrap será usado apenas em desenvolvimento
- O fluxo de autenticação usará tokens JWT reais
- Os dados persistirão no banco de dados

---

## ✅ Checklist Final

Antes de considerar a migração completa:

- [ ] Projeto roda sem erros (`npm run dev`)
- [ ] Build funciona (`npm run build`)
- [ ] Login em modo demo funciona
- [ ] Todas as páginas carregam corretamente
- [ ] Dados mock aparecem no dashboard
- [ ] Exportar/importar backup funciona
- [ ] Variáveis de ambiente estão configuradas
- [ ] Projeto pode ser baixado como ZIP

---

**Versão do Documento:** 1.0.0
**Última Atualização:** 2025-10-15
**Projeto:** Nuvra CRM Frontend
