import Route from '@ioc:Adonis/Core/Route'
import InstituicaosController from 'App/Controllers/Http/InstituicaosController'

Route.get('/institutions', 'InstituicaosController.index')
Route.post('/institutions', 'InstituicaosController.store')
Route.get('/institutions/:id', 'InstituicaosController.show')
Route.put('/institutions/:id', 'InstituicaosController.update')
Route.delete('/institutions/:id', 'InstituicaosController.destroy')
