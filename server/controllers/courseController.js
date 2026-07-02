const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");


const addCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail } = req.body;

    const course = await Course.create({
      title,
      description,
      price,
      thumbnail,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCourseContent = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Gate course content behind enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Enroll to access course content",
      });
    }

    const modules = await Module.find({ course: courseId }).sort({ order: 1 });

    const courseContent = [];
    for (const module of modules) {
      const lessons = await Lesson.find({ module: module._id }).sort({ order: 1 });
      courseContent.push({ ...module.toObject(), lessons });
    }

    res.status(200).json({ course, modules: courseContent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  addCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseContent,
};