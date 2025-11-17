-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'BROKER', 'ADVERTISER', 'AGENT');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SALE', 'RENT');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISION');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('REAL_ESTATE', 'BROKER_SALE', 'BROKER_CAPTURE', 'CONTRACT_FEE');

-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- CreateEnum
CREATE TYPE "TypeOfProperty" AS ENUM ('HOUSE', 'APARTMENT', 'STUDIO', 'LOFT', 'LOT', 'LAND', 'FARM', 'SHOPS', 'GARAGE', 'NO_RESIDENCIAL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "personType" "PersonType" NOT NULL DEFAULT 'INDIVIDUAL',
    "role" "Role" NOT NULL DEFAULT 'ADVERTISER',
    "photo" TEXT,
    "creci" TEXT,
    "photoCreci" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "Category" NOT NULL,
    "typeOfProperty" "TypeOfProperty",
    "iptu" DOUBLE PRECISION,
    "price" DOUBLE PRECISION NOT NULL,
    "condoFee" DOUBLE PRECISION NOT NULL,
    "photos" JSONB,
    "builtArea" TEXT NOT NULL,
    "bedrooms" TEXT NOT NULL,
    "suites" TEXT NOT NULL,
    "bathrooms" TEXT,
    "parkingSpots" TEXT NOT NULL,
    "updatedRegistry" TEXT,
    "address" TEXT NOT NULL,
    "addressNumber" TEXT,
    "uf" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "stairFlights" TEXT,
    "elevator" BOOLEAN NOT NULL,
    "airConditioning" BOOLEAN NOT NULL,
    "pool" BOOLEAN NOT NULL,
    "sevantsRoom" BOOLEAN NOT NULL,
    "terrace" BOOLEAN NOT NULL,
    "closet" BOOLEAN NOT NULL,
    "residential" BOOLEAN NOT NULL,
    "gourmetArea" BOOLEAN NOT NULL,
    "gym" BOOLEAN NOT NULL,
    "coworking" BOOLEAN NOT NULL,
    "playroom" BOOLEAN NOT NULL,
    "petArea" BOOLEAN NOT NULL,
    "partyRoom" BOOLEAN NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'PENDING',
    "usersId" TEXT,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "authorizationDocument" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "owners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "properties_code_key" ON "properties"("code");

-- CreateIndex
CREATE UNIQUE INDEX "owners_email_key" ON "owners"("email");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
