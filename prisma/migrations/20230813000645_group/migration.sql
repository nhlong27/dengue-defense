-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groupId" INTEGER;

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
