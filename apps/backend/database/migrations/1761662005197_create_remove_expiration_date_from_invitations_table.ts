import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invitations'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('expiration_date')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('expiration_date').nullable()
    })
  }
}
