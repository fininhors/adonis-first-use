import Route from '@ioc:Adonis/Core/Route'
import InstitutionsController from 'App/Controllers/Http/InstitutionsController'

Route.get('/institutions', 'InstitutionsController.index')
Route.post('/institutions', 'InstitutionsController.store')
Route.get('/institutions/:id', 'InstitutionsController.show')
Route.put('/institutions/:id', 'InstitutionsController.update')
Route.delete('/institutions/:id', 'InstitutionsController.destroy')
