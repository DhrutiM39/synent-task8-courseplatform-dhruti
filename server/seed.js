const mongoose = require("mongoose");
require("dotenv").config();
const Course = require("./models/Course");
const Module = require("./models/Module");
const Lesson = require("./models/Lesson");

const seedData = [
  {
    course: {
      title: "The Ultimate React 18 Course",
      description: "Master modern React from fundamentals to advanced concepts like hooks, context API, and performance optimization.",
      price: 49,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
    },
    modules: [
      {
        title: "Module 1: React Fundamentals",
        order: 1,
        lessons: [
          { title: "Introduction to React", videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk", order: 1 },
          { title: "Components and Props", videoUrl: "https://www.youtube.com/watch?v=cla1W4oM370", order: 2 },
          { title: "State and useState Hook", videoUrl: "https://www.youtube.com/watch?v=O6P86uwfdR0", order: 3 },
        ],
      },
      {
        title: "Module 2: Intermediate Concepts",
        order: 2,
        lessons: [
          { title: "The useEffect Hook", videoUrl: "https://www.youtube.com/watch?v=0ZJgIjIuY7U", order: 1 },
          { title: "Handling Events & Forms", videoUrl: "https://www.youtube.com/watch?v=IkMND33x0qQ", order: 2 },
        ],
      },
    ],
  },
  {
    course: {
      title: "Fullstack Node.js Bootcamp",
      description: "Learn to build scalable backend architectures using Node.js, Express, MongoDB, and RESTful APIs.",
      price: 69,
      thumbnail: "https://images.unsplash.com/photo-1627398240309-08a9a279ce7e?q=80&w=1000&auto=format&fit=crop",
    },
    modules: [
      {
        title: "Module 1: Node Core Basics",
        order: 1,
        lessons: [
          { title: "What is Node.js?", videoUrl: "https://www.youtube.com/watch?v=TlB_eWDSMt4", order: 1 },
          { title: "Modules and Require", videoUrl: "https://www.youtube.com/watch?v=xHLd36QoS4k", order: 2 },
        ],
      },
      {
        title: "Module 2: Building Servers with Express",
        order: 2,
        lessons: [
          { title: "Intro to Express.js", videoUrl: "https://www.youtube.com/watch?v=SccSCuHhOw0", order: 1 },
          { title: "Middleware & Routing", videoUrl: "https://www.youtube.com/watch?v=l8WPWK9mS5M", order: 2 },
          { title: "Connecting to MongoDB", videoUrl: "https://www.youtube.com/watch?v=WDrU305z1yw", order: 3 },
        ],
      },
    ],
  },
  {
    course: {
      title: "UI/UX Design for Developers",
      description: "Stop building ugly apps. Learn color theory, typography, spacing, and Figma basics specifically tailored for software engineers.",
      price: 39,
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
    },
    modules: [
      {
        title: "Module 1: Design Fundamentals",
        order: 1,
        lessons: [
          { title: "Color Theory Basics", videoUrl: "https://www.youtube.com/watch?v=_2LlHjz-IEQ", order: 1 },
          { title: "Typography Rules", videoUrl: "https://www.youtube.com/watch?v=qrOQE-qg3xQ", order: 2 },
        ],
      },
      {
        title: "Module 2: Practical Figma",
        order: 2,
        lessons: [
          { title: "Figma Crash Course", videoUrl: "https://www.youtube.com/watch?v=jwLlTEApKIQ", order: 1 },
          { title: "Designing a Landing Page", videoUrl: "https://www.youtube.com/watch?v=4W4LvJnNdHA", order: 2 },
        ],
      },
    ],
  },
];

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "test",
    });
    console.log("Connected to MongoDB.");

    console.log("Clearing existing content data...");
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});

    console.log("Seeding new courses...");

    for (const c of seedData) {
      const courseRecord = await Course.create(c.course);
      console.log(`- Created Course: ${courseRecord.title}`);

      for (const m of c.modules) {
        const moduleRecord = await Module.create({
          title: m.title,
          course: courseRecord._id,
          order: m.order,
        });

        for (const l of m.lessons) {
          await Lesson.create({
            title: l.title,
            videoUrl: l.videoUrl,
            module: moduleRecord._id,
            order: l.order,
          });
        }
      }
    }

    console.log("Database seeded successfully! Your platform is now ALIVE!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDB();
