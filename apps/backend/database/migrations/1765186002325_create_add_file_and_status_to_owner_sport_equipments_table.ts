import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'owner_sport_equipment'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('file_identification').nullable()
      table.enum('status', ['approved', 'refused', 'waiting']).defaultTo('waiting').notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('file_identification')
      table.dropColumn('status')
    })
  }
}
