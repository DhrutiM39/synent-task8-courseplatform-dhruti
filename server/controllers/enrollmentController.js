const Enrollment = require("../models/Enrollment");

const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const enrollmentExists = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (enrollmentExists) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user.id,
    }).populate("course");

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = 
{ 
    enrollCourse,
    getMyEnrollments,
 };