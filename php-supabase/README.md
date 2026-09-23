# Gerador de Assinatura AV CORE - Versão PHP + Supabase

Este pacote contém o projeto completo portado para **PHP 8.x + Supabase (PostgreSQL / PostgREST)**.

## Estrutura dos Arquivos

- `index.php`: Interface web completa com formulário, atualização em tempo real, renderização fiel do modelo visual da AV CORE e botões de cópia para Gmail/Outlook.
- `config.php`: Arquivo de credenciais de conexão com o Supabase (`SUPABASE_URL` e `SUPABASE_KEY`).
- `supabase.php`: Classe PHP nativa com métodos CRUD (`getSignatures`, `saveSignature`, `deleteSignature`, `getSignatureById`) usando cURL sem dependências externas pesadas.
- `schema.sql`: Script SQL para criar a tabela `signatures` e as políticas de segurança (RLS) no Supabase.

---

## Passo a Passo para Configurar e Rodar

### 1. Configurar o Banco no Supabase
1. Acesse seu painel no [Supabase](https://supabase.com/dashboard) e crie um novo projeto (ou use um existente).
2. No menu lateral, acesse **SQL Editor**.
3. Copie todo o conteúdo do arquivo `schema.sql` e clique em **Run**.
4. Vá em **Project Settings** > **API**:
   - Copie a **Project URL**.
   - Copie a chave **anon / public** (ou `service_role` para acesso total).

### 2. Configurar as credenciais no PHP
Abra o arquivo `config.php` e substitua:
```php
define('SUPABASE_URL', 'https://seu-projeto.supabase.co');
define('SUPABASE_KEY', 'sua-chave-anon-ou-service-role');
```
*(Você também pode definir como variáveis de ambiente no servidor se preferir).*

### 3. Rodar Localmente
Você pode rodar com o próprio servidor embutido do PHP:
```bash
cd php-supabase
php -S localhost:8000
```
Abra seu navegador em `http://localhost:8000`.

### 4. Como Usar a Assinatura Gerada
1. Preencha os dados do colaborador no formulário.
2. Clique em **"Salvar no Supabase"** para gravar no banco de dados.
3. Clique em **"Copiar Assinatura (Gmail / Outlook)"**.
4. Acesse as configurações de assinatura do seu cliente de e-mail e pressione `Ctrl + V`.
