import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { InstitutionFactory } from 'Database/factories'

test.group('Institutions delete', (group) => {
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

  test('it should not be possible to delete an institution when the code entered is invalid', async ({
    assert,
    client,
  }) => {
    /**
     * Aqui fazemos uma chamada http do tipo DELETE passando um ID inválido como parâmetro
     */
    const response = await client.delete('/institutions/999')
    /**
     * Criamos uma constante para receber o corpo da resposta.
     */
    const body = response.body()
    /**
     * O método assertStatus valida o status code de retorno da chamada http,
     * neste caso esperamos um código 404, ou seja, recurso não encontrado.
     */
    response.assertStatus(404)
    /**
     * Verifica se o Objeto(1º argumento) contém as propriedades(2º argumento).
     * As propriedades devem sempre ser passadas dentro de um array.
     */
    assert.properties(body, ['code', 'status', 'message'])
    /**
     * O método notEmpty() verifica se o parâmetro passado não está vazio
     */
    assert.notEmpty(body)
    /**
     * Este método verifica se o Objeto(1º argumento) contém
     * as propriedades e os valores exatos informados no objeto(2º argumento).
     */
    assert.include(body, {
      code: 'BAD_REQUEST',
      message: 'resource not found',
      status: 404,
    })
  })

  test('it should be possible to exclude an institution when the code entered is valid', async ({
    assert,
    client,
  }) => {
    /**
     * Aqui utilizamos uma Factory para criar uma Instituição.
     * Depois recuperamos apenas o ID para utilizarmos na chamada de atualização.
     */
    const { id } = await InstitutionFactory.create()
    /**
     * Aqui fazemos uma chamada http do tipo DELETE passando um ID inválido como parâmetro
     */
    const response = await client.delete(`/institutions/${id}`)
    /**
     * Criamos uma constante para receber o corpo da resposta.
     */
    const body = response.body()
    /**
     * O método assertStatus valida o status code de retorno da chamada http,
     * neste caso esperamos um código 204.
     */
    response.assertStatus(204)

    assert.isEmpty(body)
  })
})
