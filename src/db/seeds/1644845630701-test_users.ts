import { User } from 'src/user/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class testUsers1644845630701 implements MigrationInterface {
  name = 'testUsers1644845630701';

  private users = [
    {
      name: 'Test',
      email: 'test@email.com',
      password: 'test1234',
    },
    {
      name: 'Test 2',
      email: 'test2@email.com',
      password: 'test1234',
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert(User, this.users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, this.users);
  }
}
