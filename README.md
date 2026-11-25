# Site-Recados

Sistema full-stack de recados pessoais desenvolvido como projeto semestral da disciplina de Laboratório de Desenvolvimento Web.

A aplicação permite que usuários realizem cadastro, autenticação e gerenciamento de recados pessoais, incluindo anexos. Também possui um perfil de administrador para moderação dos recados de todos os usuários.

## Tecnologias utilizadas

- **Frontend:** React 19 + Vite
- **Backend:** Laravel + PHP
- **Autenticação:** Laravel Sanctum
- **Banco de dados:** MySQL 8
- **Requisições HTTP:** Axios
- **Infraestrutura:** Docker e Docker Compose
- **API externa:** ViaCEP

## Funcionalidades

### Autenticação

- Cadastro de usuários.
- Login e logout.
- Autenticação utilizando Laravel Sanctum e cookies de sessão HttpOnly.
- Rotas protegidas.

### Gerenciamento de recados

- Criar recados com título e texto.
- Listar os próprios recados.
- Editar recados.
- Excluir recados.
- Visualizar datas de criação e modificação.

### Anexos

- Upload opcional de imagens JPG, JPEG, PNG e arquivos PDF.
- Validação de tipo e tamanho.
- Substituição e remoção de anexos.
- Download protegido por autorização.

### Administração

- Usuários comuns acessam somente seus próprios recados.
- Administradores podem visualizar os recados de todos os usuários.
- Tela separada para moderação.
- Administradores também podem baixar anexos.

### Integração com API externa

O sistema utiliza a API pública [ViaCEP](https://viacep.com.br/) para consultar informações de endereço a partir de um CEP.

Endpoint disponibilizado pelo backend:

`GET /api/cep/{cep}`

A rota exige autenticação.

## Estrutura do projeto

```text
Site-Recados/
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Pré-requisitos

- Docker Desktop instalado e em execução.
- Docker Compose disponível.
- Git.

## Como executar o projeto com Docker

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd Site-Recados
```

### 2. Configurar as variáveis de ambiente

Criar o arquivo `.env` do backend:

```bash
cp backend/.env.example backend/.env
```

No Windows CMD, também é possível utilizar:

```cmd
copy backend\.env.example backend\.env
```

Editar `backend/.env` e configurar as variáveis:

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=site_recados
DB_USERNAME=recados
DB_PASSWORD=sua_senha

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=null
```

Manter as demais configurações necessárias do arquivo original.

Criar também um arquivo `.env` na raiz do projeto, utilizado pelo Docker Compose:

```env
DB_DATABASE=site_recados
DB_USERNAME=recados
DB_PASSWORD=sua_senha
DB_ROOT_PASSWORD=sua_senha_root
```

Utilizar senhas próprias e manter os arquivos `.env` fora do repositório.

### 3. Construir e iniciar os containers

Na pasta raiz do projeto, executar:

```bash
docker compose up -d --build
```

O Docker Compose inicia:

- Backend Laravel: porta 8000.
- Frontend React: porta 5173.
- Banco MySQL: porta 3307 no computador e 3306 dentro da rede Docker.

### 4. Configurar a aplicação Laravel

Gerar a chave da aplicação:

```bash
docker compose exec backend php artisan key:generate
```

Executar as migrations:

```bash
docker compose exec backend php artisan migrate
```

### 5. Criar o primeiro administrador

Após executar as migrations, utilizar:

```bash
docker compose exec -it backend php artisan admin:criar
```

O terminal solicitará:

- Nome do administrador.
- E-mail do administrador.
- Senha.
- Confirmação da senha.

A senha deve possuir pelo menos 8 caracteres.

O administrador será criado diretamente no banco de dados, sem depender de um cadastro anterior pela interface.

Os demais usuários podem realizar seu próprio cadastro pela aplicação.

### 6. Acessar o sistema

**Frontend:**

http://localhost:5173

**Backend:**

http://localhost:8000

## Principais endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/register` | Cadastro |
| POST | `/api/login` | Login |
| POST | `/api/logout` | Logout |
| GET | `/api/user` | Usuário autenticado |
| GET | `/api/recados` | Listar recados |
| POST | `/api/recados` | Criar recado |
| PUT | `/api/recados/{id}` | Editar recado |
| DELETE | `/api/recados/{id}` | Excluir recado |
| POST | `/api/recados/{id}/anexo` | Enviar anexo |
| GET | `/api/recados/{id}/anexo` | Baixar anexo |
| GET | `/api/admin/recados` | Listar todos os recados (admin) |
| GET | `/api/cep/{cep}` | Consultar CEP |

As rotas protegidas exigem autenticação.

## Banco de dados

O projeto utiliza MySQL 8 com migrations do Laravel para criação e atualização da estrutura do banco.

O Docker Compose utiliza volumes persistentes para os dados do MySQL e para os anexos dos recados.

Em uma instalação nova, executar as migrations antes de criar o administrador.

## Encerrar a aplicação

Para parar os containers sem remover os dados persistidos:

```bash
docker compose stop
```

Para iniciar novamente:

```bash
docker compose start
```

## Equipe

Projeto desenvolvido para a disciplina de Laboratório de Desenvolvimento Web.

- Dimitri Barbera Guimaraes
- Marcela da Silva Bezerra
- Matheus Dedim
- Patricia Benedetti Soares
- Patricia Dreyer Secchiaroli
