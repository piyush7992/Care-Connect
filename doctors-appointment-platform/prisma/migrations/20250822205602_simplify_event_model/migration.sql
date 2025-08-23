/*
  Warnings:

  - You are about to drop the column `coverImageUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `locationType` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `vonageRoomUrl` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "coverImageUrl",
DROP COLUMN "locationType",
DROP COLUMN "vonageRoomUrl",
ALTER COLUMN "startsAt" DROP NOT NULL,
ALTER COLUMN "endsAt" DROP NOT NULL;
