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
- **Banco**: MongoDB, Mongoose
- **Auth**: JWT, Passport
- **Validação**: Zod
- **API Externa**: WHO ICD API
- **Container**: Docker, Docker Compose

## 🐳 Executando com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Configuração do Ambiente

1. **Clone o repositório**

```bash
git clone https://github.com/FilipeDiasLima/demarco-api.git
cd demarco-api
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
docker-compose up --build -d

docker-compose -f docker-compose.yml up

```

A API estará disponível em: `http://localhost:3000`
Mongo Express (admin DB) em: `http://localhost:8081`

Você poderá testar as rotas na pasta **client-http**, na raíz do projeto.

## 📡 Endpoints da API

### Autenticação

- `POST /register` - Registro de usuário
- `POST /login` - Login

### Usuários

- `GET /user` - Dados do usuário logado

### Colaboradores

- `POST /colaborators` - Criar colaborador
- `GET /colaborators` - Listar colaboradores
- `PUT /colaborators/toggle-status/:id` - Atualizar status colaborador
- `DELETE /colaborators/:id` - Deletar colaborador

### Atestados Médicos

- `POST /medical-certificates` - Criar atestado
- `GET /medical-certificates` - Listar atestados

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
│   └── http/        # Controllers
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

## 🔐 Autenticação

A API usa JWT com isolamento por empresa. Cada usuário pertence a uma empresa e só pode acessar dados da sua própria empresa.

**Exemplo de registro:**

```json
{
  "companyName": "Filipe's Company",
  "fullname": "Filipe Dias",
  "email": "filipe@email.com",
  "password": "123123",
  "birthdate": "1999-04-12",
  "cpf": "12345278901"
}
```

**Exemplo de login:**

```json
{
  "email": "filipe@email.com",
  "password": "123123"
}
```

## 🏥 Integração CID

A API integra com a OMS API para busca de códigos CID. Configure as credenciais `OMS_CLIENT_ID` e `OMS_SECRET` no `.env` para habilitar esta funcionalidade.

## 📝 Licença

Projeto de analise para Demarco
