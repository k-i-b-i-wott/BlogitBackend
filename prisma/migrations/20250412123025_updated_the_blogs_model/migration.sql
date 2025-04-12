/*
  Warnings:

  - You are about to drop the `Blogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Blogs" DROP CONSTRAINT "Blogs_userId_fkey";

-- DropTable
DROP TABLE "Blogs";

-- CreateTable
CREATE TABLE "blogs" (
    "blogId" TEXT NOT NULL,
    "blogTitle" TEXT NOT NULL,
    "blogExcerpt" TEXT NOT NULL,
    "blogBody" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("blogId")
);

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
