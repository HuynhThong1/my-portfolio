-- CreateTable
CREATE TABLE "AboutSection" (
    "id" TEXT NOT NULL,
    "sectionLabel" TEXT NOT NULL DEFAULT 'About Me',
    "title" TEXT NOT NULL DEFAULT 'Passionate Developer,',
    "titleHighlight" TEXT NOT NULL DEFAULT 'Problem Solver',
    "description" TEXT[],
    "skills" JSONB NOT NULL,
    "yearsExperience" INTEGER NOT NULL DEFAULT 3,
    "projectsCount" INTEGER NOT NULL DEFAULT 20,
    "highlights" JSONB NOT NULL,
    "profileEmoji" TEXT NOT NULL DEFAULT '👨‍💻',
    "showImage" BOOLEAN NOT NULL DEFAULT true,
    "showThreeBackground" BOOLEAN NOT NULL DEFAULT true,
    "imagePosition" TEXT NOT NULL DEFAULT 'right',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutSection_pkey" PRIMARY KEY ("id")
);
