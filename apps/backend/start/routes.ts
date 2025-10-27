/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const SportEquipmentsController = () =>
  import('#sport_equipments/controllers/sport_equipments_controller')
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/sport-equipments', [SportEquipmentsController, 'index'])
router.get('/sport-equipments/:equip_numero', [SportEquipmentsController, 'show'])
