# Como Rodar a Aplicação

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🚀 Passos para Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar em Modo Desenvolvimento

```bash
npm run dev
```

### 3. Acessar a Aplicação

- Abra seu navegador em: **http://localhost:3000**

## 🎯 Pronto!

A aplicação estará rodando e você poderá:

- Cadastrar clientes
- Cadastrar veículos
- Associar veículos aos clientes
- Gerenciar todos os dados

## 📱 URLs Disponíveis

- **Dashboard:** http://localhost:3000
- **Clientes:** http://localhost:3000/clientes
- **Veículos:** http://localhost:3000/veiculos

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Verificar código
npm run lint
```

## ⚙️ Configuração da API

A aplicação está configurada para usar a API em:

```
http://177.153.58.12:12000/api
```

Se precisar alterar, edite o arquivo `src/services/api.ts`

---

**Status:** ✅ Aplicação rodando em http://localhost:3000
