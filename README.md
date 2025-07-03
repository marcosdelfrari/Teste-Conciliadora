# Sistema de Cadastro de Clientes e Veículos

Uma aplicação React Next.js para gerenciar clientes e seus veículos, permitindo cadastrar clientes, associar múltiplos veículos a cada cliente e gerenciar essas informações de forma simples e intuitiva.

## 🚀 Funcionalidades

### Clientes

- ✅ Cadastrar novos clientes (Nome e Telefone)
- ✅ Listar todos os clientes
- ✅ Editar informações dos clientes
- ✅ Excluir clientes (apenas se não possuírem veículos)
- ✅ Visualizar quantidade de veículos por cliente

### Veículos

- ✅ Cadastrar novos veículos (Placa e Modelo)
- ✅ Associar veículos a clientes existentes
- ✅ Listar todos os veículos com informações do proprietário
- ✅ Editar informações dos veículos
- ✅ Excluir veículos
- ✅ Um cliente pode ter múltiplos veículos

### Interface

- ✅ Design moderno e responsivo com Tailwind CSS
- ✅ Dashboard com estatísticas
- ✅ Navegação intuitiva
- ✅ Feedback visual com toasts
- ✅ Validação de formulários
- ✅ Estados de loading e confirmações

## 🛠️ Tecnologias Utilizadas

- **Frontend:**

  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Hook Form
  - Yup (validação)
  - Lucide React (ícones)
  - React Hot Toast (notificações)

- **HTTP Client:**

  - Axios

- **API Backend:**
  - Configurada para: `http://177.153.58.12:12000/api`

## 🚀 Como Rodar

### ⚡ Instalação Rápida:

```bash
# 1. Instalar dependências
npm install

# 2. Executar aplicação
npm run dev

# 3. Acessar http://localhost:3000
```

### 📖 Instalação Detalhada:

1. **Clone o repositório:**

```bash
git clone [url-do-repositorio]
cd teste-conciliadora
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Execute a aplicação:**

```bash
npm run dev
```

4. **Acesse no navegador:**
   - Abra [http://localhost:3000](http://localhost:3000)

> **📌 Configuração:** API configurada para `http://177.153.58.12:12000/api` (altere em `src/services/api.ts` se necessário)

## 📖 Como Usar

### Dashboard

- Acesse a página principal para ver estatísticas gerais
- Visualize total de clientes, veículos e média de veículos por cliente
- Use as ações rápidas para cadastrar novos clientes ou veículos

### Gerenciar Clientes

1. **Listar:** Vá em "Clientes" no menu superior
2. **Cadastrar:** Clique em "Novo Cliente" e preencha nome e telefone
3. **Editar:** Clique no ícone de edição ao lado do cliente
4. **Excluir:** Clique no ícone de lixeira (só funciona se o cliente não tiver veículos)

### Gerenciar Veículos

1. **Listar:** Vá em "Veículos" no menu superior
2. **Cadastrar:** Clique em "Novo Veículo" e preencha placa, modelo e selecione o cliente
3. **Editar:** Clique no ícone de edição ao lado do veículo
4. **Excluir:** Clique no ícone de lixeira

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Páginas do Next.js (App Router)
│   ├── clientes/          # Páginas dos clientes
│   ├── veiculos/          # Páginas dos veículos
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Dashboard
├── components/            # Componentes reutilizáveis
│   ├── Layout.tsx         # Layout principal
│   ├── ClienteForm.tsx    # Formulário de cliente
│   └── VeiculoForm.tsx    # Formulário de veículo
├── services/              # Serviços de API
│   ├── api.ts            # Configuração do Axios
│   ├── clienteService.ts # Serviços dos clientes
│   └── veiculoService.ts # Serviços dos veículos
└── types/                 # Tipos TypeScript
    └── index.ts          # Interfaces e tipos
```

## 🔌 API Endpoints

A aplicação consome os seguintes endpoints da API:

### Clientes

- `GET /clientes` - Listar clientes
- `GET /clientes/{id}` - Buscar cliente por ID
- `POST /clientes` - Criar cliente
- `PUT /clientes/{id}` - Atualizar cliente
- `DELETE /clientes/{id}` - Excluir cliente

### Veículos

- `GET /veiculos` - Listar veículos
- `GET /veiculos/{id}` - Buscar veículo por ID
- `GET /clientes/{clienteId}/veiculos` - Listar veículos de um cliente
- `POST /veiculos` - Criar veículo
- `PUT /veiculos/{id}` - Atualizar veículo
- `DELETE /veiculos/{id}` - Excluir veículo

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona bem em:

- 📱 Dispositivos móveis (smartphones)
- 📱 Tablets
- 💻 Desktops

## 🎨 Design

- Interface moderna e limpa
- Paleta de cores profissional
- Ícones intuitivos
- Feedback visual claro
- Animações suaves

## 🚀 Build para Produção

```bash
# Fazer build
npm run build

# Executar em produção
npm start
```

## 📝 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Faz build para produção
- `npm start` - Executa a versão de produção
- `npm run lint` - Executa o linter

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ em React + Next.js**
