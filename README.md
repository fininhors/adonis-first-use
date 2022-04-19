# Passo a passo para utilizar este código

* Clone o repositório
```bash
git clone https://github.com/fininhors/adonis-first-use.git
```

* Entre no diretório do projeto
```bash
cd adonis-first-use
```

* Faça a instalação dos pacotes do projeto
```bash
npm install
```

* Copie o arquivo `.env.example`para `.env`
```bash
cp .env.example .env
```

* Adicione os dados de conexão com o seu banco de dados
```bash
DB_CONNECTION=pg
PG_HOST=localhost
PG_PORT=5432
PG_USER=<NOME-DE-USUARIO>
PG_PASSWORD=<SENHA>
PG_DB_NAME=<NOME-DO-BANCO>
```

* E finalizando rode o comando
```bash
node ace serve --watch
```
