// /*
// |--------------------------------------------------------------------------
// | Routes file
// |--------------------------------------------------------------------------
// |
// | The routes file is used for defining the HTTP routes.
// |
// */
//
// const SportEquipmentsController = () =>
//   import('#sport_equipments/controllers/sport_equipments_controller')
// const ReservationsController = () => import('#reservation/controllers/reservations_controller')
// import router from '@adonisjs/core/services/router'
// import { middleware } from './kernel.js'
//
// router.get('/', async () => {
//   return {
//     hello: 'world',
//   }
// })
//
// router.get('/sport-equipments', [SportEquipmentsController, 'index'])
// router.get('/sport-equipments/:equip_numero', [SportEquipmentsController, 'show'])
//
// // Reservation routes
// router
//   .group(() => {
//     router.post('/reservations', [ReservationsController, 'store'])
//     router.delete('/reservations/:id', [ReservationsController, 'destroy'])
//     router.patch('/reservations/:id/invitation', [ReservationsController, 'updateInvitationStatus'])
//     // router.get('/users/me/reservations', [ReservationsController, 'getUserReservations'])
//   })
//   .use(middleware.auth())
//
// router.post('/reservationsTest', [ReservationsController, 'storee'])
// router.get('/reservations', [ReservationsController, 'index'])
// router.get('/reservations/:id', [ReservationsController, 'show'])
// router.get('/users/:userId/reservations', [ReservationsController, 'getUserReservationsById'])
// router.get('/sport-equipments/:equip_numero/reservations', [
//   ReservationsController,
//   'getByEquipment',
// ])
// router.patch('  ', [ReservationsController, 'updateStatus'])
// router.post('/reservations/cleanup-started', [ReservationsController, 'cleanupStartedReservations'])

import router from '@adonisjs/core/services/router'

router.attachments()
