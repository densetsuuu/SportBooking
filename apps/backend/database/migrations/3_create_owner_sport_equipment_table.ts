import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'owner_sportequipment'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('sport_equipment_id').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Ensure a proprietaire can't be assigned to the same terrain multiple times
      table.unique(['owner_id', 'sport_equipment_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
