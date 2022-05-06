import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateInstitutionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    institutionId: this.ctx.params.id,
  })

  public schema = schema.create({
    nome: schema.string({ trim: true }, [rules.minLength(5), rules.maxLength(500)]),
    cnpj: schema.string({ trim: true }, [
      rules.minLength(18),
      rules.maxLength(18),
      rules.unique({
        table: 'instituicao',
        column: 'cnpj',
        whereNot: { id: this.refs.institutionId },
      }),
    ]),
    email: schema.string({ trim: true }, [rules.email()]),
    is_active: schema.boolean.optional(),
  })

  public messages = {}
}
