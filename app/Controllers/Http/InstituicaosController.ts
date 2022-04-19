import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Instituicao from 'App/Models/Instituicao'
import StoreInstitutionValidator from 'App/Validators/StoreInstitutionValidator'
import UpdateInstitutionValidator from 'App/Validators/UpdateInstitutionValidator'

export default class InstituicaosController {
  public async index(ctx: HttpContextContract) {
    const institutions = await Instituicao.all()

    return ctx.response.ok({ data: institutions })
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(StoreInstitutionValidator)

    const institution = await Instituicao.create(payload)

    return response.created({ data: institution })
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params() as { id: number }
    const institution = await Instituicao.find(id)

    return response.ok({ data: institution })
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params() as { id: number }
    const payload = await request.validate(UpdateInstitutionValidator)

    const institution = await Instituicao.findOrFail(id)

    if (!institution) {
      return response.badRequest({
        data: { success: false, message: 'O código da instituição está errado.' },
      })
    }

    institution.nome = request.input('nome')
    institution.cnpj = request.input('cnpj')
    institution.email = request.input('email')
    institution.isActive = request.input('is_active')

    await institution.save()

    return response.created({ data: institution })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params() as { id: number }

    const institution = await Instituicao.findOrFail(id)

    if (!institution) {
      return response.badRequest({
        data: { success: false, message: 'O código da instituição está errado.' },
      })
    }

    await institution.delete()

    return response.created({
      data: { success: true, message: 'Instituição removida com sucesso!' },
    })
  }
}
