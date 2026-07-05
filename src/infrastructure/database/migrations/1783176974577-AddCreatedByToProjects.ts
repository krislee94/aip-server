import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByToProjects1783176974577 implements MigrationInterface {
  name = 'AddCreatedByToProjects1783176974577';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" ADD "created_by" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "created_by"`);
  }
}
