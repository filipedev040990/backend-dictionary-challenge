-- DropIndex
DROP INDEX `tokens_token_idx` ON `tokens`;

-- DropIndex
DROP INDEX `tokens_token_key` ON `tokens`;

-- AlterTable
ALTER TABLE `tokens` MODIFY `token` TEXT NOT NULL;
