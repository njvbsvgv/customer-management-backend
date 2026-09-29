import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLastOrderDateToUsers implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'lastOrderDate',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'lastOrderDate');
  }
}