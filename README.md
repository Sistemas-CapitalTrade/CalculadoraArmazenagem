# Motivação 💻

Essa ferramenta foi desenvolvida a fim de reduzir erros operacionais na etapa de faturamentos dos serviços prestados pelos recintos e cobrados da Capital Trade.

# Tecnologias 💻

Docker

NextJS (React)

Flask (Python)

OracleDB

# Como rodar 💻

## ENV

### Front end
Criar arquivo .env.production no root do projeto com essas variáveis

NEXT_PUBLIC_API_URL =  API_URL

### Back end
Criar arquivo .env no root do projeto com essas váriaveis

DB_HOST = HOST IP

DB_PORT = HOST PORT

DB_SERVICE = Nome do serviço

DB_USER = nome do user

DB_PASS = Senha

Após isso, no root do projeto, rodar:

### docker compose up
