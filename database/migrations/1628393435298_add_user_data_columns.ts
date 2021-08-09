import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('name').notNullable()
      table.string('facebook')
      table.string('linkedin')
      table.string('twitter')
      table.string('github')
      table.string('phone')
      table.boolean('show_data').notNullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('name')
      table.dropColumn('facebook')
      table.dropColumn('linkedin')
      table.dropColumn('twitter')
      table.dropColumn('github')
      table.dropColumn('phone')
      table.dropColumn('showData')
    })
  }
}
