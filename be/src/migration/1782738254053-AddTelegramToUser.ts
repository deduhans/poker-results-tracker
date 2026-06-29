import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTelegramToUser1782738254053 implements MigrationInterface {
    name = 'AddTelegramToUser1782738254053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "telegram_id" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "telegram_username" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telegram_username"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telegram_id"`);
    }

}
