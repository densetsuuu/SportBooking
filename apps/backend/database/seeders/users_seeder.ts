import OwnerSportEquipment from '#sport_equipments/models/owner_sport_equipment'
import { UserFactory } from '#users/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const user = await UserFactory.merge({
      email: 'john.doe@example.com',
      fullName: 'John Doe',
    }).create()

    // Assign the user as owner of a sample sport equipment
    const sampleEquipmentId = '147350'
    await OwnerSportEquipment.create({
      ownerId: user.id,
      sportEquipmentId: sampleEquipmentId,
    })

    console.log(
      `✅ Created user ${user.email} and assigned as owner of equipment ${sampleEquipmentId}`
    )
  }
}
