import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUser1631206419478 implements MigrationInterface {
  private table = new Table({
    name: 'users',
    columns: [
      {
        name: 'uid',
        type: 'varchar',
        isPrimary: true,
        length: '255',
        isUnique: true,
      },
      {
        name: 'name',
        type: 'varchar',
        length: '255',
        isUnique: true,
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        isPrimary: false,
        isNullable: false,
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        isPrimary: false,
        isNullable: false,
        default: 'now()',
      },
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
