import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { InstitutionFactory } from 'Database/factories'

test.group('Institutions list', async (group) => {
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

  test('an empty list should be returned if there are no records of institutions', async ({
    assert,
    client,
  }) => {
    /**
     * Aqui fazemos uma chamada http do tipo GET.
     * O client sempre retorna uma response, seja erro ou acerto.
     */
    const response = await client.get('/institutions')
    /**
     * O método assertStatus valida o status code de retorno da chamada http,
     * neste caso esperamos um código 200.
     */
    response.assertStatus(200)
    /**
     * Este método verifica se o corpo da resposta não está vazio.
     */
    assert.isEmpty(response.body())
  })

  test('it should response a list of institutions', async ({ assert, client }) => {
    /**
     * Aqui utilizamos uma Factory para criar duas Instituições com o método createMany()
     * passamos como argumento a quantidade de registros que queremos criar
     */
    await InstitutionFactory.createMany(2)
    /**
     * Aqui fazemos uma chamada http do tipo GET.
     * O client sempre retorna uma response, seja erro ou acerto.
     */
    const response = await client.get('/institutions')
    /**
     * Criamos uma constante para receber o corpo da resposta.
     */
    const body = response.body()
    /**
     * Este método verifica se o valor da propriedade(1º argumento),
     * é igual ao valor informado no 2º argumento da função.
     */
    response.assertHeader('content-type', 'application/json; charset=utf-8')
    /**
     * O método assertStatus valida o status code de retorno da chamada http,
     * neste caso esperamos um código 200.
     */
    response.assertStatus(200)
    /**
     * Este método verifica se o corpo da resposta não está vazio.
     */
    assert.notEmpty(body)
  })

  test('the information of an institution should be returned according to the code informed', async ({
    assert,
    client,
  }) => {
    /**
     * Aqui utilizamos uma Factory para criar duas Instituições com o método createMany()
     * passamos como argumento a quantidade de registros que queremos criar
     */
    const { id } = await InstitutionFactory.merge({ cnpj: '52.882.967/0001-48' }).create()
    /**
     * Aqui fazemos uma chamada http do tipo GET.
     * O client sempre retorna uma response, seja erro ou acerto.
     */
    const response = await client.get(`/institutions/${id}`)
    /**
     * Aqui criamos uma constante para receber os dados do corpo da resposta da requisição.
     */
    const body = response.body()
    /**
     * O método assertStatus valida o status code de retorno da chamada http,
     * neste caso esperamos um código 200.
     */
    response.assertStatus(200)
    /**
     * Este método verifica se o corpo da resposta não está vazio.
     */
    assert.notEmpty(body)
    /**
     * Verifica se o Objeto(1º argumento) contém as propriedades(2º argumento).
     * As propriedades devem sempre ser passadas dentro de um array.
     */
    assert.properties(body, ['id', 'nome', 'cnpj', 'email', 'is_active', 'created_at'])
  })

  test('an error should be returned if the institution code does not exist on database', async ({
    assert,
    client,
  }) => {
    /**
     * Aqui fazemos uma chamada http do tipo GET.
     * O client sempre retorna uma response, seja erro ou acerto.
     */
    const response = await client.get('/institutions/888')
    /**
     * Aqui criamos uma constante para receber os dados do corpo da resposta da requisição.
     */
    const errors = response.body()
    /**
     * O método assertStatus valida o status code de retorno da chamada http,
     * neste caso esperamos um código 200.
     */
    response.assertStatus(404)
    /**
     * Este método verifica se o Objeto(1º argumento) contém
     * as propriedades e os valores exatos informados no objeto(2º argumento).
     */
    assert.include(errors, {
      code: 'BAD_REQUEST',
      status: 404,
      message: 'resource not found',
    })
  })
})
