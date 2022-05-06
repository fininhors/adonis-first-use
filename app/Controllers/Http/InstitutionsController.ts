import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Institution from 'App/Models/Institution'
import StoreInstitutionValidator from 'App/Validators/StoreInstitutionValidator'
import UpdateInstitutionValidator from 'App/Validators/UpdateInstitutionValidator'

export default class InstitutionsController {
  public async index({ response }: HttpContextContract) {
    const institutions = await Institution.all()

    return response.ok(institutions)
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(StoreInstitutionValidator)

    const userByCNPJ = await Institution.findBy('cnpj', payload.cnpj)
    if (userByCNPJ) throw new BadRequestException('This CNPJ is already in use.', 409)

    const institution = await Institution.create(payload)

    return response.created(institution)
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params() as { id: number }
    const institution = await Institution.findOrFail(id)

    return response.ok(institution)
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params() as { id: number }
    const payload = await request.validate(UpdateInstitutionValidator)

    const institution = await Institution.findOrFail(id)

    if (!institution) throw new BadRequestException('O código da instituição está errado.', 404)

    institution.nome = payload.nome
    institution.cnpj = payload.cnpj
    institution.email = payload.email
    institution.isActive = payload.is_active || true

    await institution.save()

    return response.created(institution)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params() as { id: number }

    const institution = await Institution.findOrFail(id)

    await institution.delete()

    return response.noContent()
    // data: { success: true, message: 'Instituição removida com sucesso!' },
  }
}
