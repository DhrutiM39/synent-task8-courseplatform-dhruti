const Lesson = require("../models/Lesson");

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
    const lessons = await Lesson.find({
      module: req.params.moduleId,
    }).sort({ order: 1 });

    res.status(200).json(lessons);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addLesson,
  getLessonsByModule,
};

