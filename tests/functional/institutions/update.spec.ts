import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { InstitutionFactory } from 'Database/factories'

test.group('Institutions update', (group) => {
  /**
   * O método setup() roda antes de todos os testes.
   * Ele permite que façamos algumas configurações.
   */
  group.setup(async () => {
    /**
     * Aqui abrimos uma Transação com o banco de Dados
     */
    await Database.beginGlobalTransaction()
    /**
     * Aqui finalizamos a transação após os testes finalizarem,
     * ou um dos testes causar uma exceção que impeça a realização do(s) próximo(s) teste(s).
     */
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should not be possible to update an institution if the information is not sent', async ({
    assert,
    client,
  }) => {
    /**
     * Aqui utilizamos uma Factory para criar uma Instituição.
     * Depois recuperamos apenas o ID para utilizarmos na chamada de atualização.
     */
    const { id } = await InstitutionFactory.create()
    /**
     * Aqui fazemos uma chamada http do tipo PUT sem passando o corpo vazio dentro do método json()
     * O client sempre retorna uma response, seja erro ou acerto
     */
    const response = await client.put(`/institutions/${id}`).json({})
    /**
     * Neste caso como esperamos que o método nos retorne um array de erros no corpo da resposta,
     * fazemos uma desestruturação dos erros.
     */
    const { errors } = response.body()

    // console.log(response.body())
    // console.warn(Object.keys(errors[0]))

    /**
     * O método assertStatus valida o status code de retorno da chamada http,
     * neste caso esperamos um código 422, ou seja, recurso não processado.
     */
    response.assertStatus(422)
    /**
     * Verifica se o Objeto(1º argumento) contém as propriedades(2º argumento).
     * As propriedades devem sempre ser passadas dentro de um array.
     */
    assert.properties(errors[0], ['rule', 'field', 'message'])
    /**
     * Este método verifica se uma(1) propriedade existe,
     * caso não exista retorna a mensagem informada no 2º argumento da função
     * Ele faz exatamente a mesma coisa que o método properties acima,
     * porém verifica cada propriedade individualmente.
     */
    assert.equal(errors[0].field, 'nome')
    assert.equal(errors[1].field, 'cnpj')
    assert.equal(errors[2].field, 'email')
  })

  test('it should not be possible to update an institution when the information is outside the expected standard', async ({
    assert,
    client,
  }) => {
    /**
     * Aqui utilizamos uma Factory para criar uma Instituição.
     * Depois recuperamos apenas o ID para utilizarmos na chamada de atualização.
     */
    const { id } = await InstitutionFactory.create()
    /**
     * Aqui criamos um objeto com os dados que serão passados no corpo da chamada à API.
     */
    const institutionPayload = {
      nome: '+A',
      cnpj: '53.286.693/0001',
      email: 'manager@',
      is_active: true,
    }
    /**
     * Aqui fazemos uma chamada http do tipo PUT passando o corpo dentro do método json()
     * O client sempre retorna uma response, seja erro ou acerto
     */
    const response = await client.put(`/institutions/${id}`).json(institutionPayload)
    /**
     * Neste caso como esperamos que o método nos retorne um array de erros no corpo da resposta,
     * fazemos uma desestruturação dos erros.
     */
    const { errors } = response.body()
    // console.log(response.body())
    // console.warn(Object.keys(errors[0]))

    /**
     * O método assertStatus valida o status code de retorno da chamada http,
     * neste caso esperamos um código 422, ou seja, recurso não processado.
     */
    response.assertStatus(422)
    /**
     * Verifica se o Objeto(1º argumento) contém as propriedades(2º argumento).
     * As propriedades devem sempre ser passadas dentro de um array.
     */
    assert.properties(errors[0], ['rule', 'field', 'message'])
    /**
     * Este método verifica se o Objeto(1º argumento) contém
     * as propriedades e os valores exatos informados no objeto(2º argumento).
     */
    assert.include(errors[0], {
      rule: 'minLength',
      field: 'nome',
      message: 'minLength validation failed',
    })
    assert.include(errors[1], {
      rule: 'minLength',
      field: 'cnpj',
      message: 'minLength validation failed',
    })
    assert.include(errors[2], { rule: 'email', field: 'email', message: 'email validation failed' })
  })

  test('it should not be possible to update an institution when cnpj is already used', async ({
    assert,
    client,
  }) => {
    /**
     * Aqui utilizamos uma Factory para criar uma Instituição,
     * utilizamos o método merge para passar o CNPJ,
     * desta forma sobrescrevemos o padrão da factory.
     * Depois recuperamos apenas o CNPJ para utilizarmos em uma chamada API.
     */
    const { id } = await InstitutionFactory.merge({ cnpj: '30.981.775/0001-56' }).create()
    const { cnpj } = await InstitutionFactory.merge({ cnpj: '77.888.999/0001-44' }).create()
    /**
     * Aqui fazemos uma chamada http do tipo PUT passando o corpo dentro do método json()
     * O client sempre retorna uma response, seja erro ou acerto
     */
    const response = await client.put(`/institutions/${id}`).json({
      nome: 'Louise e Juan Telas ME',
      cnpj,
      email: 'pesquisa@louiseejuantelasme.com.br',
      is_active: true,
    })
    /**
     * Neste caso como esperamos que o método nos retorne um array de erros no corpo da resposta,
     * fazemos uma desestruturação dos erros.
     */
    const { errors } = response.body()
    /**
     * O método assertStatus valida o status code de retorno da chamada http,
     * neste caso esperamos um código 422, ou seja, recurso não processado.
     */
    response.assertStatus(422)
    /**
     * Verifica se o Objeto(1º argumento) contém as propriedades(2º argumento).
     * As propriedades devem sempre ser passadas dentro de um array.
     */
    assert.properties(errors[0], ['rule', 'field', 'message'])
    /**
     * Este método verifica se o Objeto(1º argumento) contém
     * as propriedades e os valores exatos informados no objeto(2º argumento).
     */
    assert.include(errors[0], {
      rule: 'unique',
      field: 'cnpj',
      message: 'unique validation failure',
    })
  })

  test('it should be possible to update an institution', async ({ assert, client }) => {
    /**
     * Aqui utilizamos uma Factory para criar uma Instituição.
     * Depois recuperamos apenas o ID para utilizarmos na chamada de atualização.
     */
    const { id } = await InstitutionFactory.create()
    /**
     * Aqui criamos um objeto com os dados que serão passados no corpo da chamada à API.
     */
    const institutionPayload = {
      nome: 'Alamos Educacao CO',
      cnpj: '77.836.301/0002-68',
      email: 'manager@teste.me',
      is_active: true,
    }
    /**
     * Aqui fazemos uma chamada http do tipo PUT passando o corpo dentro do método json()
     * O client sempre retorna uma reponse, seja erro ou acerto
     */
    const response = await client.put(`/institutions/${id}`).json(institutionPayload)
    /**
     * Neste caso como esperamos que o método nos retorne um array de erros no corpo da resposta,
     * fazemos uma desestruturação dos erros.
     */
    const body = response.body()
    /**
     * O método assertStatus valida o status code de retorno da chamada http,
     * neste caso esperamos um código 201, ou seja, recurso criado.
     */
    response.assertStatus(201)
    /**
     * O método assertBodyContains() valida se o corpo do retorno da chamada http
     * contém as propriedades e valores passados dentro de um objeto como argumento da função.
     * OBS: Podemos passar quantas propriedades acharmos necessários, o método valida um subset,
     * ou seja, apenas uma parte do corpo da respoosta.
     */
    assert.properties(body, ['id', 'nome', 'cnpj', 'email', 'is_active', 'created_at'])
    response.assertBodyContains({
      id,
      nome: 'Alamos Educacao CO',
      cnpj: '77.836.301/0002-68',
      email: 'manager@teste.me',
      is_active: true,
    })
  })
})
