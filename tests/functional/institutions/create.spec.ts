import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { InstitutionFactory } from 'Database/factories'

test.group('Institutions create', (group) => {
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

  test('it should not be possible to create an institution if the information is not sent', async ({
    assert,
    client,
  }) => {
    /**
     * Aqui fazemos uma chamada http do tipo POST sem passando o corpo vazio dentro do método json()
     * O client sempre retorna uma response, seja erro ou acerto
     */
    const response = await client.post('/institutions').json({})
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
      rule: 'required',
      field: 'nome',
      message: 'required validation failed',
    })
    assert.include(errors[1], {
      rule: 'required',
      field: 'cnpj',
      message: 'required validation failed',
    })
    assert.include(errors[2], {
      rule: 'required',
      field: 'email',
      message: 'required validation failed',
    })
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

  test('it should not be possible to create an institution when the information is outside the expected standard', async ({
    assert,
    client,
  }) => {
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
    const response = await client.post('/institutions').json(institutionPayload)
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

  test('it should be create a new institution', async ({ assert, client }) => {
    /**
     * Aqui criamos um objeto com os dados que serão passados no corpo da chamada à API.
     */
    const institutionPayload = {
      nome: 'Pietro Erick Educacao SA',
      cnpj: '26.930.647/0001-06',
      email: 'bento_ramos@serteccontabil.com.br',
      is_active: true,
    }
    /**
     * Aqui fazemos uma chamada http do tipo POST passando o corpo dentro do método json()
     * O client sempre retorna uma response, seja erro ou acerto
     */
    const response = await client.post('/institutions').json(institutionPayload)
    /**
     * Aqui fazemos uma desestruturação do corpo da resposta
     */
    const { id, created_at: createdAt } = response.body()
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
    response.assertBodyContains({
      nome: 'Pietro Erick Educacao SA',
      cnpj: '26.930.647/0001-06',
      email: 'bento_ramos@serteccontabil.com.br',
      is_active: true,
    })
    assert.exists(id, 'Id indefinido')
    assert.exists(createdAt, 'Data de criação indefinida')
  })

  test('it should return 422 when cnpj is already in use', async ({ assert, client }) => {
    /**
     * Aqui utilizamos uma Factory para criar uma Instituição,
     * utilizamos o método merge para passar o CNPJ,
     * desta forma sobrescrevemos o padrão da factory.
     * Depois recuperamos apenas o CNPJ para utilizarmos em uma chamada API.
     */
    const { cnpj } = await InstitutionFactory.merge({ cnpj: '51.847.808/0001-40' }).create()
    /**
     * Aqui fazemos uma chamada http do tipo POST passando o corpo dentro do método json()
     * O client sempre retorna uma response, seja erro ou acerto
     */
    const response = await client.post('/institutions').json({
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
     * Este método verifica se uma(1) propriedade existe,
     * caso não exista retorna a mensagem informada no 2º argumento da função
     * Ele faz exatamente a mesma coisa que o método properties acima,
     * porém verifica cada propriedade individualmente.
     */
    assert.exists(errors[0].message, 'Mensagem Indefinida')
    assert.exists(errors[0].rule, 'Regra Indefinida')
    assert.exists(errors[0].field, 'Campo Indefinido')
    /**
     * Este método verifica se o Objeto(1º argumento) contém
     * as propriedades e os valores exatos informados no objeto(2º argumento).
     */
    assert.include(errors[0], {
      rule: 'unique',
      field: 'cnpj',
      message: 'unique validation failure',
    })
    /**
     * Este método verifica se o valor da propriedade(1º argumento),
     * é igual ao valor informado no 2º argumento da função.
     * Ele faz exatamente a mesma coisa que o método include,
     * porém verifica cada propriedade individualmente
     */
    assert.equal(errors[0].field, 'cnpj')
    assert.equal(errors[0].message, 'unique validation failure')
    assert.equal(errors[0].rule, 'unique')
  })
})
