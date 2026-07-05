import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAgentTables1783180000000 implements MigrationInterface {
  name = 'CreateAgentTables1783180000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "agent_main" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "project_id" uuid NOT NULL, "agent_code" character varying(64) NOT NULL, "agent_name" character varying(128) NOT NULL, "agent_desc" text, "avatar" character varying(255) NOT NULL DEFAULT '', "agent_type" character varying(32) NOT NULL DEFAULT 'standalone', "status" character varying(32) NOT NULL DEFAULT 'draft', "version" character varying(32) NOT NULL DEFAULT '1.0.0', "run_mode" character varying(16) NOT NULL DEFAULT 'sync', "timeout_seconds" integer NOT NULL DEFAULT 30, "max_context_length" integer NOT NULL DEFAULT 8000, "llm_model" character varying(128) NOT NULL DEFAULT '', "api_key_ref" character varying(128) NOT NULL DEFAULT '', "supports_sub_agents" boolean NOT NULL DEFAULT false, "default_prompt_id" uuid, "publishing_channel" character varying(255) NOT NULL DEFAULT '', "publishing_time" TIMESTAMP, "offline_time" TIMESTAMP, "created_by" uuid NOT NULL, "updated_by" uuid, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_agent_main" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "agent_prompt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "agent_id" uuid NOT NULL, "prompt_name" character varying(128) NOT NULL, "prompt_version" character varying(32) NOT NULL DEFAULT '1.0.0', "is_default" boolean NOT NULL DEFAULT false, "role_definition" text, "work_boundary" text, "limit_constraint" text, "system_prompt" text NOT NULL, "output_format" text, "temperature" numeric(3,2) NOT NULL DEFAULT '0.7', "top_p" numeric(3,2) NOT NULL DEFAULT '0.9', "max_tokens" integer NOT NULL DEFAULT 2000, "status" smallint NOT NULL DEFAULT 1, "created_by" uuid NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_agent_prompt" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "agent_a2a_protocol" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "agent_id" uuid NOT NULL, "protocol_name" character varying(128) NOT NULL, "protocol_code" character varying(64) NOT NULL, "protocol_version" character varying(32) NOT NULL DEFAULT '1.0.0', "publish_scope" smallint NOT NULL DEFAULT 1, "auth_type" smallint NOT NULL DEFAULT 1, "access_token" character varying(512) NOT NULL DEFAULT '', "call_limit_qps" integer NOT NULL DEFAULT 100, "call_daily_max" bigint NOT NULL DEFAULT 10000, "allow_agent_codes" text, "deny_agent_codes" text, "request_schema" text, "response_schema" text, "support_func" text, "timeout" integer NOT NULL DEFAULT 60, "status" smallint NOT NULL DEFAULT 0, "publish_time" TIMESTAMP, "created_by" uuid NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_agent_a2a_protocol" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "agent_rel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "main_agent_id" uuid NOT NULL, "sub_agent_id" uuid NOT NULL, "rel_name" character varying(128) NOT NULL DEFAULT '', "call_weight" integer NOT NULL DEFAULT 100, "call_permission" smallint NOT NULL DEFAULT 1, "max_call_times" integer NOT NULL DEFAULT 10, "input_filter" text, "output_merge_strategy" smallint NOT NULL DEFAULT 1, "sort" integer NOT NULL DEFAULT 0, "status" smallint NOT NULL DEFAULT 1, "created_by" uuid NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_agent_rel" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_agent_main_tenant_code_active" ON "agent_main" ("tenant_id", "agent_code") WHERE "is_deleted" = false`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_main_tenant_status" ON "agent_main" ("tenant_id", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_main_project" ON "agent_main" ("project_id", "is_deleted")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_main_code" ON "agent_main" ("agent_code")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_main_default_prompt" ON "agent_main" ("default_prompt_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_prompt_agent_deleted" ON "agent_prompt" ("agent_id", "is_deleted")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_prompt_tenant_default" ON "agent_prompt" ("tenant_id", "agent_id", "is_default", "is_deleted")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_agent_a2a_protocol_active" ON "agent_a2a_protocol" ("agent_id", "protocol_code") WHERE "is_deleted" = false`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_a2a_protocol_tenant_agent" ON "agent_a2a_protocol" ("tenant_id", "agent_id", "status")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_agent_rel_main_sub_active" ON "agent_rel" ("main_agent_id", "sub_agent_id") WHERE "is_deleted" = false`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_rel_main_agent" ON "agent_rel" ("main_agent_id", "status", "is_deleted")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_rel_sub_agent" ON "agent_rel" ("sub_agent_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "agent_main" ADD CONSTRAINT "FK_agent_main_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ADD CONSTRAINT "FK_agent_main_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ADD CONSTRAINT "FK_agent_main_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_prompt" ADD CONSTRAINT "FK_agent_prompt_agent" FOREIGN KEY ("agent_id") REFERENCES "agent_main"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_prompt" ADD CONSTRAINT "FK_agent_prompt_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" ADD CONSTRAINT "FK_agent_main_default_prompt" FOREIGN KEY ("default_prompt_id") REFERENCES "agent_prompt"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_a2a_protocol" ADD CONSTRAINT "FK_agent_a2a_protocol_agent" FOREIGN KEY ("agent_id") REFERENCES "agent_main"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_a2a_protocol" ADD CONSTRAINT "FK_agent_a2a_protocol_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_rel" ADD CONSTRAINT "FK_agent_rel_main_agent" FOREIGN KEY ("main_agent_id") REFERENCES "agent_main"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_rel" ADD CONSTRAINT "FK_agent_rel_sub_agent" FOREIGN KEY ("sub_agent_id") REFERENCES "agent_main"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_rel" ADD CONSTRAINT "FK_agent_rel_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agent_rel" DROP CONSTRAINT "FK_agent_rel_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_rel" DROP CONSTRAINT "FK_agent_rel_sub_agent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_rel" DROP CONSTRAINT "FK_agent_rel_main_agent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_a2a_protocol" DROP CONSTRAINT "FK_agent_a2a_protocol_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_a2a_protocol" DROP CONSTRAINT "FK_agent_a2a_protocol_agent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" DROP CONSTRAINT "FK_agent_main_default_prompt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_prompt" DROP CONSTRAINT "FK_agent_prompt_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_prompt" DROP CONSTRAINT "FK_agent_prompt_agent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" DROP CONSTRAINT "FK_agent_main_updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" DROP CONSTRAINT "FK_agent_main_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_main" DROP CONSTRAINT "FK_agent_main_project"`,
    );

    await queryRunner.query(`DROP TABLE "agent_rel"`);
    await queryRunner.query(`DROP TABLE "agent_a2a_protocol"`);
    await queryRunner.query(`DROP TABLE "agent_prompt"`);
    await queryRunner.query(`DROP TABLE "agent_main"`);
  }
}
