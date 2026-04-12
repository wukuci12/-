-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserVocabulary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "lastInterval" INTEGER,
    "lastReview" DATETIME,
    "nextReview" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserVocabulary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserVocabulary" ("createdAt", "id", "lastReview", "nextReview", "reviewCount", "status", "userId", "vocabularyId") SELECT "createdAt", "id", "lastReview", "nextReview", "reviewCount", "status", "userId", "vocabularyId" FROM "UserVocabulary";
DROP TABLE "UserVocabulary";
ALTER TABLE "new_UserVocabulary" RENAME TO "UserVocabulary";
CREATE UNIQUE INDEX "UserVocabulary_userId_vocabularyId_key" ON "UserVocabulary"("userId", "vocabularyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
