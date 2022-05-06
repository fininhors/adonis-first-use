import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Institution from 'App/Models/Institution'

export default class InstitutionSeeder extends BaseSeeder {
  public static developmentOnly = true
  public async run() {
    await Institution.createMany([
      {
        nome: 'Edson Rodrigo Antonio Baptista',
        cnpj: '11.570.154/0001-35',
        email: 'edson_baptista@live.com',
        isActive: false,
      },
      {
        nome: 'Alexandre Pedro Paulo Silva',
        cnpj: '94.598.742/0001-04',
        email: 'alexandre_silva@vbrasildigital.net',
        isActive: false,
      },
      {
        nome: 'Kauê Vitor Cauê da Luz',
        cnpj: '59.983.555/0001-43',
        email: 'kaue_vitor_daluz@cntbrasil.com.br',
        isActive: true,
      },
      {
        nome: 'Carolina Priscila Pietra Rezende',
        cnpj: '54.581.635/0001-59',
        email: 'carolina_priscila_rezende@tetrapark.com',
        isActive: true,
      },
      {
        nome: 'Rafaela Julia Vieira',
        cnpj: '59.983.555/0001-43',
        email: '55.616.710/0001-32m',
        isActive: true,
      },
    ])
  }
}

function getRandomCNPJ() {
  const cnpjs = [
    '62.252.212/0001-13',
    '83.228.713/0001-34',
    '37.992.393/0001-77',
    '43.019.349/0001-88',
    '86.466.000/0001-05',
    '05.407.136/0001-34',
    '99.776.149/0001-24',
    '40.081.936/0001-09',
    '43.264.842/0001-63',
    '08.880.492/0001-69',
    '19.691.327/0001-85',
    '84.858.305/0001-29',
    '06.722.401/0001-31',
    '94.955.027/0001-81',
    '41.849.513/0001-59',
  ]
  const random = Math.floor(Math.random() * cnpjs.length)

  return cnpjs[random]
}
