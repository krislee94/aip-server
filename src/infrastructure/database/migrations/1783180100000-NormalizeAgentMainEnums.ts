import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeAgentMainEnums1783180100000 implements MigrationInterface {
  name = 'NormalizeAgentMainEnums1783180100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "agent_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "agent_type" TYPE character varying(32) USING "agent_type"::text`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "agent_type" SET DEFAULT 'standalone'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "status" TYPE character varying(32) USING "status"::text`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "run_mode" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "run_mode" TYPE character varying(16) USING "run_mode"::text`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "run_mode" SET DEFAULT 'sync'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_prompt" ALTER COLUMN "temperature" SET DEFAULT '0.7'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_prompt" ALTER COLUMN "top_p" SET DEFAULT '0.9'`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."agent_main_run_mode_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."agent_main_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."agent_main_agent_type_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."agent_main_agent_type_enum" AS ENUM('orchestrator', 'standalone', 'sub')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."agent_main_status_enum" AS ENUM('disabled', 'draft', 'enabled', 'offline', 'pending_publish', 'published')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."agent_main_run_mode_enum" AS ENUM('async', 'sync')`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "agent_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "agent_type" TYPE "public"."agent_main_agent_type_enum" USING "agent_type"::"public"."agent_main_agent_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "agent_type" SET DEFAULT 'standalone'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "status" TYPE "public"."agent_main_status_enum" USING "status"::"public"."agent_main_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "run_mode" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "run_mode" TYPE "public"."agent_main_run_mode_enum" USING "run_mode"::"public"."agent_main_run_mode_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ALTER COLUMN "run_mode" SET DEFAULT 'sync'`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_prompt" ALTER COLUMN "temperature" SET DEFAULT 0.7`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_prompt" ALTER COLUMN "top_p" SET DEFAULT 0.9`,
    );
  }
}
