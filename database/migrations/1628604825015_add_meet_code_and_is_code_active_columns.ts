import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('meet_code')
      table.boolean('is_code_active')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('meet_code')
      table.dropColumn('is_code_active')
    })
  }
}
