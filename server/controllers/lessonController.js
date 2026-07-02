const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const Enrollment = require("../models/Enrollment");


// Add Lesson
const addLesson = async (req, res) => {
  try {
    const { title, videoUrl, module, order } = req.body;

    const lesson = await Lesson.create({
      title,
      videoUrl,
      module,
      order,
    });

    res.status(201).json(lesson);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Lessons by Module
const getLessonsByModule = async (req, res) => {
  try {
    const moduleId = req.params.moduleId;

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: module.course,
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Enroll to access course content" });
    }

    const lessons = await Lesson.find({ module: moduleId }).sort({ order: 1 });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addLesson,
  getLessonsByModule,
};

