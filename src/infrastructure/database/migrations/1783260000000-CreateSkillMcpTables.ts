import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSkillMcpTables1783260000000 implements MigrationInterface {
  name = 'CreateSkillMcpTables1783260000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "skill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "skill_code" character varying(64) NOT NULL, "skill_name" character varying(128) NOT NULL, "skill_desc" text, "skill_type" character varying(32) NOT NULL, "icon" character varying(255) NOT NULL DEFAULT '', "input_schema" text, "output_schema" text, "invoke_config" text, "timeout_seconds" integer NOT NULL DEFAULT 10, "max_invoke_times" integer NOT NULL DEFAULT 20, "status" character varying(16) NOT NULL DEFAULT 'enabled', "created_by" uuid NOT NULL, "updated_by" uuid, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_skill" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "agent_skill_rel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "agent_id" uuid NOT NULL, "skill_id" uuid NOT NULL, "alias_name" character varying(128) NOT NULL DEFAULT '', "invoke_filter" text, "enable_flag" boolean NOT NULL DEFAULT true, "sort" integer NOT NULL DEFAULT 0, "created_by" uuid NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_agent_skill_rel" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mcp_server" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "mcp_code" character varying(64) NOT NULL, "mcp_name" character varying(128) NOT NULL, "mcp_desc" text, "transport_type" character varying(16) NOT NULL, "endpoint" character varying(512) NOT NULL DEFAULT '', "auth_config" text, "tool_list" text, "timeout_seconds" integer NOT NULL DEFAULT 30, "max_concurrency" integer NOT NULL DEFAULT 5, "status" character varying(16) NOT NULL DEFAULT 'enabled', "created_by" uuid NOT NULL, "updated_by" uuid, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_mcp_server" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "agent_mcp_rel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "agent_id" uuid NOT NULL, "mcp_id" uuid NOT NULL, "allow_tools" text, "deny_tools" text, "enable_flag" boolean NOT NULL DEFAULT true, "sort" integer NOT NULL DEFAULT 0, "created_by" uuid NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_agent_mcp_rel" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_skill_tenant_code_active" ON "skill" ("tenant_id", "skill_code") WHERE "is_deleted" = false`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_skill_tenant_status" ON "skill" ("tenant_id", "status")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_agent_skill_rel_active" ON "agent_skill_rel" ("agent_id", "skill_id") WHERE "is_deleted" = false`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_skill_rel_agent" ON "agent_skill_rel" ("agent_id", "enable_flag", "is_deleted")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_skill_rel_skill" ON "agent_skill_rel" ("skill_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_mcp_server_tenant_code_active" ON "mcp_server" ("tenant_id", "mcp_code") WHERE "is_deleted" = false`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_mcp_server_tenant_status" ON "mcp_server" ("tenant_id", "status")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_agent_mcp_rel_active" ON "agent_mcp_rel" ("agent_id", "mcp_id") WHERE "is_deleted" = false`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_mcp_rel_agent" ON "agent_mcp_rel" ("agent_id", "enable_flag", "is_deleted")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_mcp_rel_mcp" ON "agent_mcp_rel" ("mcp_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "skill" ADD CONSTRAINT "FK_skill_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill" ADD CONSTRAINT "FK_skill_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_skill_rel" ADD CONSTRAINT "FK_agent_skill_rel_agent" FOREIGN KEY ("agent_id") REFERENCES "agent_main"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_skill_rel" ADD CONSTRAINT "FK_agent_skill_rel_skill" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_skill_rel" ADD CONSTRAINT "FK_agent_skill_rel_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mcp_server" ADD CONSTRAINT "FK_mcp_server_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mcp_server" ADD CONSTRAINT "FK_mcp_server_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_mcp_rel" ADD CONSTRAINT "FK_agent_mcp_rel_agent" FOREIGN KEY ("agent_id") REFERENCES "agent_main"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_mcp_rel" ADD CONSTRAINT "FK_agent_mcp_rel_mcp" FOREIGN KEY ("mcp_id") REFERENCES "mcp_server"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_mcp_rel" ADD CONSTRAINT "FK_agent_mcp_rel_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agent_mcp_rel" DROP CONSTRAINT "FK_agent_mcp_rel_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_mcp_rel" DROP CONSTRAINT "FK_agent_mcp_rel_mcp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_mcp_rel" DROP CONSTRAINT "FK_agent_mcp_rel_agent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mcp_server" DROP CONSTRAINT "FK_mcp_server_updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mcp_server" DROP CONSTRAINT "FK_mcp_server_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_skill_rel" DROP CONSTRAINT "FK_agent_skill_rel_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_skill_rel" DROP CONSTRAINT "FK_agent_skill_rel_skill"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_skill_rel" DROP CONSTRAINT "FK_agent_skill_rel_agent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "FK_skill_updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "FK_skill_created_by"`,
    );
    await queryRunner.query(`DROP TABLE "agent_mcp_rel"`);
    await queryRunner.query(`DROP TABLE "mcp_server"`);
    await queryRunner.query(`DROP TABLE "agent_skill_rel"`);
    await queryRunner.query(`DROP TABLE "skill"`);
  }
}
