CREATE TABLE IF NOT EXISTS "trip" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) UNIQUE NOT NULL,
    "description" TEXT,
    "links" TEXT,
    "status" VARCHAR(50) NOT NULL CHECK (status in ('TODO', 'DONE', 'REJECTED')),
    "type" VARCHAR(100) NOT NULL CHECK ("type" in ('FERRATA', 'CAMMINATA')),
    "rating" DOUBLE PRECISION,
    "createdAt" timestamp DEFAULT NOW(),
    "updatedAt" timestamp DEFAULT NOW()
);