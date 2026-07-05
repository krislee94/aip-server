import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLlmModelAndAgentBinding1783270000000 implements MigrationInterface {
  name = 'CreateLlmModelAndAgentBinding1783270000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "llm_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "model_code" character varying(128) NOT NULL, "model_name" character varying(256) NOT NULL, "vendor" character varying(64) NOT NULL, "model_type" smallint NOT NULL, "base_url" character varying(512) NOT NULL DEFAULT '', "api_key_ref" character varying(256) NOT NULL DEFAULT '', "secret_key" character varying(512) NOT NULL DEFAULT '', "default_params" text, "support_function_call" boolean NOT NULL DEFAULT false, "support_stream" boolean NOT NULL DEFAULT true, "context_window" integer NOT NULL DEFAULT 8192, "price_input" numeric(10,6) NOT NULL DEFAULT '0', "price_output" numeric(10,6) NOT NULL DEFAULT '0', "status" smallint NOT NULL DEFAULT 1, "created_by" uuid NOT NULL, "updated_by" uuid, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_llm_model" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_llm_model_tenant_code_active" ON "llm_model" ("tenant_id", "model_code") WHERE "is_deleted" = false`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_llm_model_tenant_vendor" ON "llm_model" ("tenant_id", "vendor", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_llm_model_code" ON "llm_model" ("model_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "llm_model" ADD CONSTRAINT "FK_llm_model_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "llm_model" ADD CONSTRAINT "FK_llm_model_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`ALTER TABLE "agent_main" ADD "llm_model_id" uuid`);
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_main_llm_model" ON "agent_main" ("llm_model_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ADD CONSTRAINT "FK_agent_main_llm_model" FOREIGN KEY ("llm_model_id") REFERENCES "llm_model"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agent_main" DROP CONSTRAINT "FK_agent_main_llm_model"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_agent_main_llm_model"`);
    await queryRunner.query(
      `ALTER TABLE "agent_main" DROP COLUMN "llm_model_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "llm_model" DROP CONSTRAINT "FK_llm_model_updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "llm_model" DROP CONSTRAINT "FK_llm_model_created_by"`,
    );
    await queryRunner.query(`DROP TABLE "llm_model"`);
  }
}
