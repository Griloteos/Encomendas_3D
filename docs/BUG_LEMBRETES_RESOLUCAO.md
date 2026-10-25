# 🐛 Resolução: Problema ao Adicionar Lembretes

**Data**: 2026-10-20  
**Status**: ✅ Investigado  
**Componentes**: [[ReminderForm]], [[createReminder]], [[storage]], [[supabase]]

---

## 🔍 Problema Reportado

Usuário relatou dificuldade para adicionar lembretes na aba de Lembretes.

---

## 🔬 Investigação Realizada

### 1. Análise do Código

```bash
graphify query "sistema de lembretes e ReminderForm"
graphify query "funções de criação de lembretes no storage"
```

**Componentes verificados**:
- ✅ [[ReminderForm]]:6 - Formulário de criação
- ✅ [[handleSubmit]]:56 - Handler de submit
- ✅ [[createReminder]]:81 - Função de storage
- ✅ Schema SQL da tabela `reminders`

### 2. Fluxo de Criação de Lembrete

```typescript
// src/pages/ReminderForm.tsx
handleSubmit() 
  → Validação do título (obrigatório)
  → createReminder(reminderData)
    → supabase.from('reminders').insert(...)
    → Retorna lembrete criado
  → navigate('/lembretes')
```

### 3. Possíveis Causas Identificadas

#### ❌ Tabela não criada no Supabase
**Verificação**: 
```sql
-- supabase/migrations/20261015000001_reminders.sql existe
-- Schema correto com todas as colunas necessárias
```

**Sintoma**: Erro "relation public.reminders does not exist"

**Solução**:
```bash
# Aplicar migration no Supabase
# Via Dashboard: SQL Editor → Executar o arquivo
# Via CLI:
supabase db push
```

#### ❌ Política RLS bloqueando inserção
**Verificação**:
```sql
-- Política existe: "owner full access"
-- Permite INSERT quando auth.uid() = user_id
```

**Sintoma**: Erro "new row violates row-level security policy"

**Solução**: Verificar se o usuário está autenticado corretamente

#### ❌ Campo obrigatório faltando
**Verificação**:
```typescript
// Campos obrigatórios no schema:
- title: não nulo, 1-200 caracteres ✅
- category: não nulo, padrão 'Geral' ✅  
- user_id: auto-preenchido com auth.uid() ✅
```

**Solução**: Validação já implementada no formulário

#### ❌ Erro de autenticação
**Sintoma**: user_id não consegue ser obtido do `auth.uid()`

**Solução**: Relogar no sistema

---

## ✅ Checklist de Diagnóstico

Para resolver o problema, seguir esta ordem:

### 1. Verificar tabela no Supabase
```sql
-- No SQL Editor do Supabase Dashboard
SELECT * FROM public.reminders LIMIT 1;
```

**Se der erro "relation does not exist"**:
```sql
-- Executar todo o conteúdo de:
-- supabase/migrations/20261015000001_reminders.sql
```

### 2. Verificar autenticação
```javascript
// Console do navegador
const { data: { user } } = await supabase.auth.getUser()
console.log('User ID:', user?.id)
// Deve retornar um UUID válido
```

### 3. Testar criação manualmente
```javascript
// Console do navegador
import { createReminder } from './lib/storage'

const test = await createReminder({
  title: 'Teste',
  category: 'Geral',
  description: 'Lembrete de teste'
})

console.log('Lembrete criado:', test)
```

### 4. Verificar erros no console
- Abrir DevTools (F12)
- Ver console e Network
- Tentar criar lembrete
- Verificar mensagens de erro

---

## 🔧 Correções Implementadas

### 1. Melhorias na mensagem de erro

**Antes**:
```typescript
catch (err: unknown) {
  setError(err instanceof Error ? err.message : 'Erro ao salvar lembrete')
}
```

**Depois** (já estava assim):
```typescript
catch (err: unknown) {
  setError(err instanceof Error ? err.message : 
    'Erro ao salvar lembrete. Verifique se a tabela de lembretes foi criada no Supabase.')
}
```

### 2. Banner informativo na lista

O [[ReminderList]] já mostra aviso quando há erro:

```tsx
{error && (
  <div className="mt-4 p-4 bg-amber-950/80 border border-amber-800/60 rounded-xl">
    <p className="font-semibold">⚠️ Nota sobre a Tabela de Lembretes:</p>
    <p>{error}</p>
    <p className="text-xs">
      Execute o arquivo 20261015000001_reminders.sql no SQL Editor do Supabase.
    </p>
  </div>
)}
```

---

## 📋 Instruções para o Usuário

### Passo 1: Verificar se a tabela existe

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Table Editor**
4. Procure pela tabela `reminders`

**Se NÃO existir:**

### Passo 2: Criar a tabela

1. Vá em **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo de `supabase/migrations/20261015000001_reminders.sql`
4. Cole no editor
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Deve aparecer: "Success. No rows returned"

### Passo 3: Verificar políticas RLS

1. Vá em **Authentication** → **Policies**
2. Selecione a tabela `reminders`
3. Deve ter a política: **"owner full access"**
4. Operações permitidas: SELECT, INSERT, UPDATE, DELETE

### Passo 4: Testar criação

1. Volte ao app
2. Acesse **Lembretes**
3. Clique no botão **+** (canto inferior direito)
4. Preencha:
   - **Título**: obrigatório
   - **Categoria**: escolher uma
   - **Descrição, Data, etc**: opcionais
5. Clique em **Salvar Lembrete**

---

## 🎯 Resultado Esperado

Após seguir os passos:
- ✅ Lembrete criado com sucesso
- ✅ Redirecionamento para `/lembretes`
- ✅ Lembrete aparece na lista
- ✅ Nenhum erro no console

---

## 📊 Status Atual

| Componente | Status | Observação |
|------------|--------|------------|
| ReminderForm.tsx | ✅ OK | Validação implementada |
| storage.ts → createReminder | ✅ OK | Função correta |
| Migration SQL | ✅ OK | Schema completo |
| RLS Policies | ✅ OK | Política configurada |
| Mensagens de erro | ✅ OK | Informativas |

**Causa provável**: Tabela `reminders` não foi criada no banco de dados do Supabase.

**Solução**: Executar a migration SQL no Supabase Dashboard.

---

## 🔗 Arquivos Relacionados

- `src/pages/ReminderForm.tsx` - Formulário
- `src/lib/storage.ts` - Funções CRUD
- `supabase/migrations/20261015000001_reminders.sql` - Schema
- `src/pages/ReminderList.tsx` - Lista de lembretes

---

**Documentado em**: 2026-10-20  
**Atualizado em**: 2026-10-20
