const Module = require("../models/Module");
const Enrollment = require("../models/Enrollment");

// Add Module
const addModule = async (req, res) => {
  try {
    const { title, course, order } = req.body;

    const module = await Module.create({
      title,
      course,
      order,
    });

    res.status(201).json(module);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Modules of a Course
const getModulesByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Enroll to access course content" });
    }

    const modules = await Module.find({ course: courseId }).sort({ order: 1 });

    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addModule,
  getModulesByCourse,
};

