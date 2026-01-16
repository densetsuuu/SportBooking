import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'owner_sport_equipment'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('sport_equipment_id').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.json('file_identification').nullable()
      table.enum('status', ['approved', 'refused', 'waiting']).defaultTo('waiting').notNullable()
      table.string('phone_number').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
