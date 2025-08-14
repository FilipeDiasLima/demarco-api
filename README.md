# PS API DeMarco

API para gestão de atestados médicos com integração à API de Classificação Internacional de Doenças (CID) da OMS.

## 🚀 Funcionalidades

- ✅ Autenticação JWT com isolamento por empresa
- ✅ CRUD completo de usuários, empresas e colaboradores
- ✅ Gestão de atestados médicos com soft delete
- ✅ Integração com API CID da OMS
- ✅ Controle de acesso baseado em empresa
- ✅ Validação de dados com Zod
- ✅ Ambiente Docker para desenvolvimento e produção

## 🛠️ Tecnologias

- **Backend**: NestJS, TypeScript
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, Passport
- **Validation**: Zod
- **External API**: WHO ICD API
- **Container**: Docker, Docker Compose

## 🐳 Executando com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Configuração do Ambiente

1. **Clone o repositório**

```bash
git clone <repository-url>
cd ps-api-demarco
```

2. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL=mongodb://admin:password@mongodb:27017/ps_api_demarco?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# WHO API (Opcional - para integração CID)
WHO_CLIENT_ID=your-who-client-id
WHO_CLIENT_SECRET=your-who-client-secret
```

### Desenvolvimento

**Iniciar ambiente de desenvolvimento:**

```bash
npm run docker:dev
```

**Outros comandos úteis:**

```bash
# Build apenas
npm run docker:dev:build

# Parar containers
npm run docker:dev:down

# Ver logs da API
npm run docker:logs:dev
```

A API estará disponível em: `http://localhost:3000`
Mongo Express (admin DB) em: `http://localhost:8081`

### Produção

**Iniciar ambiente de produção:**

```bash
npm run docker:prod
```

**Outros comandos:**

```bash
# Build apenas
npm run docker:prod:build

# Parar containers
npm run docker:prod:down

# Ver logs da API
npm run docker:logs
```

## 📡 Endpoints da API

### Autenticação

- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login

### Usuários

- `GET /users/me` - Dados do usuário logado
- `GET /users/company` - Dados da empresa

### Colaboradores

- `POST /colaborators` - Criar colaborador
- `GET /colaborators` - Listar colaboradores
- `GET /colaborators/:id` - Buscar colaborador
- `PUT /colaborators/:id` - Atualizar colaborador
- `DELETE /colaborators/:id` - Deletar colaborador

### Atestados Médicos

- `POST /medical-certificates` - Criar atestado
- `GET /medical-certificates` - Listar atestados
- `GET /medical-certificates/:id` - Buscar atestado
- `PUT /medical-certificates/:id` - Atualizar atestado
- `DELETE /medical-certificates/:id` - Deletar atestado (soft delete)

### CID (Classificação Internacional de Doenças)

- `GET /cids` - Listar CIDs
- `GET /cids/:id` - Buscar CID específico

## 🗂️ Estrutura do Projeto

```
src/
├── common/           # Entidades base
├── core/            # Lógica de domínio
│   ├── entities/    # Entidades de domínio
│   └── application/ # Casos de uso e repositórios
├── infra/           # Infraestrutura
│   ├── database/    # Configuração MongoDB
│   ├── env/         # Configuração de ambiente
│   └── http/        # Controllers e DTOs
```

## 🧪 Desenvolvimento

### Sem Docker

1. **Instalar dependências:**

```bash
npm install
```

2. **Configurar MongoDB local:**

```bash
# Certifique-se que o MongoDB está rodando localmente
# e ajuste a DATABASE_URL no .env
```

3. **Executar em modo desenvolvimento:**

```bash
npm run start:dev
```

### Comandos úteis

```bash
# Formatar código
npm run format

# Linting
npm run lint

# Testes
npm run test
npm run test:watch
npm run test:e2e

# Build para produção
npm run build
npm run start:prod
```

## 🔐 Autenticação

A API usa JWT com isolamento por empresa. Cada usuário pertence a uma empresa e só pode acessar dados da sua própria empresa.

**Exemplo de registro:**

```json
{
  "name": "João Silva",
  "email": "joao@empresa.com",
  "password": "senha123",
  "company": {
    "name": "Empresa LTDA",
    "cnpj": "12345678000123"
  }
}
```

**Exemplo de login:**

```json
{
  "email": "joao@empresa.com",
  "password": "senha123"
}
```

## 🏥 Integração CID

A API integra com a WHO ICD API para busca de códigos CID. Configure as credenciais `WHO_CLIENT_ID` e `WHO_CLIENT_SECRET` no `.env` para habilitar esta funcionalidade.

## 📝 Licença

Este projeto é privado e proprietário.

---

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.
