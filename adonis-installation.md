# Instalação do Adonis

Acesse um terminal e dentro do seu diretório de projetos digite o comando abaixo:
```bash
npm init adonis-ts-app@latest <NOME-DO-PROJETO>
```

Entre no diretório onde foi criado o projeto:
```bash
cd <NOME-DO-PROJETO>
```

Verifique se está tudo funcionando corretamente:
```bash
node ace serve --watch
```

Se tudo estiver funcionando corretamente você receberá a seguinte mensagem:
```bash
[ info ]  watching file system for changes
╭─────────────────────────────────────────────────╮
│                                                 │
│    Server address: http://127.0.0.1:3333        │
│    Watching filesystem for changes: YES         │
│                                                 │
╰─────────────────────────────────────────────────╯
```

## Vamos criar o primeiro CRUD de exemplo

Primeiro vamos instalar o pacote que proporciona acesso a camada de dados
```bash
npm i @adonisjs/lucid
```

Após a instalação vamos configurar o driver de conexão com a base de dados.
```bash
node ace configure @adonisjs/lucid
```

Durante a configuração devemos selecionar qual o tipo de Banco de Dados. Exemplo: PostgreSQL, MySQL, etc...

No nosso caso como trabalharemos com o PostgreSQL o selecionamos na lista e pressionamos a tecla <kbd>Enter</kbd>
```bash
> Select the database driver you want to use ...  Press <SPACE> to select
( ) SQLite
( ) MySQL / MariaDB
(*) PostgreSQL
( ) OracleDB
( ) Microsoft SQL Server
```

Serão gerados e/ou atualizados os seguintes arquivos abaixo:
```bash
CREATE: config/database.ts
UPDATE: .env,.env.example
[ wait ]  Installing: luxon, pg
CREATE: database\factories\index.ts
UPDATE: tsconfig.json { types += "@adonisjs/lucid" }
UPDATE: .adonisrc.json { commands += "@adonisjs/lucid/build/commands" }
UPDATE: .adonisrc.json { providers += "@adonisjs/lucid" }
```

Em seguida devemos indicar onde serão exibidos os campos de configuração de acesso ao base de dados.<br/>
Neste caso optamos por exibir no terminal.
```bash
> Select where to display instructions ...  Press <ENTER> to select
  In the browser
> In the terminal
```

E para finalizar são gerados os dados de acesso ao banco que preferencialmente devem ser salvos em variáveis de ambiente.<br/>
Então abrimos o arquivo env.ts e colamos os dados abaixo:
```bash
DB_CONNECTION: Env.schema.string(),
PG_HOST: Env.schema.string({ format: 'host' }),
PG_PORT: Env.schema.number(),
PG_USER: Env.schema.string(),
PG_PASSWORD: Env.schema.string.optional(),
PG_DB_NAME: Env.schema.string(),
```

Dentro do arquivo `.env` que fica na raíz do projeto devemos informar os dados de acesso ao Banco de dados
```bash
// outras variáveis ...
DB_CONNECTION=pg
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=12345
PG_DB_NAME=adonis
```

Vamos criar nossa classe Modelo e junto com ela a migração e o controlador.
Para isso colocamos a flag `-mc` no final da instrução.
```bash
node ace make:model Instituicao -mc
```

Assim foram criados os seguintes arquivos:
```bash
CREATE: app\Models\Instituicao.ts
CREATE: database\migrations\1650379903911_instituicaos.ts
CREATE: app\Controllers\Http\InstituicaosController.ts
```
