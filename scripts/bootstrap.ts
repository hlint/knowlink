import path from "node:path";
import { PrismaClient } from "@prisma/client";
import fs from "fs-extra";
import { nanoid } from "nanoid";

export const prisma = new PrismaClient();

async function initSecretKey() {
  const secretKeyFile = path.join(process.cwd(), "runtime", "secret.env");

  if (!fs.existsSync(secretKeyFile)) {
    const secretKey = crypto.randomUUID();
    fs.ensureFileSync(secretKeyFile);
    fs.writeFileSync(secretKeyFile, `SESSION_SECRET=${secretKey}`);
    console.log("Secret key is created and saved to runtime/secret.env");
  }
}

async function seedDatabase() {
  // flag to check if the database is seeded
  const entry = await prisma.entry.findFirst({
    where: {
      name: "database-seeded",
    },
  });
  if (entry) return;
  await prisma.entry.create({
    data: {
      name: "database-seeded",
    },
  });

  // init categories
  const defaultCategories = [
    {
      name: "💼 Work",
      subcategories: ["📋 Project Plans", "📝 Meetings", "✅ Task Tracking"],
    },
    {
      name: "🎓 Learning",
      subcategories: [
        "📖 Courses",
        "🔍 Research Materials",
        "🛠️ Skill Development",
      ],
    },
    {
      name: "🏡 Life",
      subcategories: [
        "🩺 Health Management",
        "✈️ Travel Planning",
        "📔 Daily Records",
      ],
    },
    {
      name: "💡 Inspiration",
      subcategories: [
        "✨ Creative Ideas",
        "📌 To-Do List",
        "💭 Thought Snippets",
      ],
    },
    {
      name: "📚 Resources",
      subcategories: ["📰 Articles", "🔗 Tools", "📚 Reference Materials"],
    },
  ];
  for (const category of defaultCategories) {
    const { id } = await prisma.category.create({
      data: {
        id: nanoid(6),
        name: category.name,
      },
    });
    for (const subcategory of category.subcategories) {
      await prisma.subcategory.create({
        data: {
          id: nanoid(6),
          name: subcategory,
          categoryId: id,
        },
      });
    }
  }

  // create a new event
  await prisma.calendarEvent.create({
    data: {
      id: nanoid(6),
      title: "Knowlink Installed",
      description: "Knowlink is installed and ready to use",
      start: new Date(),
      end: new Date(),
      allDay: true,
    },
  });
  console.log("Database is seeded");
}

async function main() {
  await initSecretKey();
  await seedDatabase();
}

main();
