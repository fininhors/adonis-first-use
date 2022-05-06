import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Instituicaos extends BaseSchema {
  protected tableName = 'instituicao'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome', 500).notNullable()
      table.string('cnpj', 18).unique().notNullable()
      table.string('email', 255).notNullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
