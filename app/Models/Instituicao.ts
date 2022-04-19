import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Instituicao extends BaseModel {
  public static table = 'instituicao'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public cnpj: string

  @column()
  public email: string

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
