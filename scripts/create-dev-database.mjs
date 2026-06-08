import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe("CREATE DATABASE neondb_dev");
  console.log("Created database: neondb_dev");
}

main()
  .catch((error) => {
    if (String(error.message).includes("already exists")) {
      console.log("Database neondb_dev already exists.");
      return;
    }

    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
