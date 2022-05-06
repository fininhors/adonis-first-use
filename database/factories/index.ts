import Institution from 'App/Models/Institution'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const InstitutionFactory = Factory.define(Institution, ({ faker }) => {
  return {
    nome: faker.name.findName(),
    cnpj: getRandomCNPJ(),
    email: faker.internet.email(),
    isActive: faker.datatype.boolean(),
  }
}).build()

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
