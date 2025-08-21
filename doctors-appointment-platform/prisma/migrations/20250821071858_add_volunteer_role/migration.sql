-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."UserRole" ADD VALUE 'ORGANIZATION';
ALTER TYPE "public"."UserRole" ADD VALUE 'VOLUNTEER';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "orgAddress" TEXT,
ADD COLUMN     "orgContactNumber" TEXT,
ADD COLUMN     "orgMission" TEXT,
ADD COLUMN     "orgName" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "volExperienceLevel" TEXT,
ADD COLUMN     "volLanguages" TEXT,
ADD COLUMN     "volSkills" TEXT;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
