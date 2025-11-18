import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'social_accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table.json('token').notNullable()
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('provider_name').notNullable()
      table.string('email').nullable()
      table.string('username').nullable()
      table.json('provider_data').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['user_id', 'provider_name'])
      table.index(['provider_name', 'id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
