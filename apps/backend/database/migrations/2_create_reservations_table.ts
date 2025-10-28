import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.datetime('start_date').notNullable()
      table.datetime('end_date').notNullable()
      table.enum('status', ['waiting', 'confirmed', 'cancelled']).notNullable().defaultTo('waiting')
      table.string('sport_equipment_id').notNullable()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
