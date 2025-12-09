import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'owner_sport_equipment'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Remove the old unique constraint that prevents multiple requests per user/equipment
      table.dropUnique(['owner_id', 'sport_equipment_id'])
    })

    // Add a partial unique index: only one approved ownership per equipment
    this.schema.raw(`
      CREATE UNIQUE INDEX owner_sport_equipment_approved_unique 
      ON ${this.tableName} (sport_equipment_id) 
      WHERE status = 'approved'
    `)
  }

  async down() {
    // Remove the partial unique index
    this.schema.raw(`DROP INDEX IF EXISTS owner_sport_equipment_approved_unique`)

    this.schema.alterTable(this.tableName, (table) => {
      // Restore the old unique constraint
      table.unique(['owner_id', 'sport_equipment_id'])
    })
  }
}
