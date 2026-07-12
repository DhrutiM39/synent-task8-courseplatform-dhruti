const Enrollment = require("../models/Enrollment");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");

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

const computeCourseProgressPct = async ({ enrollment, courseId }) => {
  const completedSet = new Set((enrollment.completedLessons || []).map(String));

  const modules = await Module.find({ course: courseId }).select("_id");
  const moduleIds = modules.map((m) => m._id);

  const totalLessons = await Lesson.countDocuments({ module: { $in: moduleIds } });

  if (!totalLessons) return 0;

  let completedCount = 0;
  for (const lessonId of completedSet) {
    // only count ids that actually belong to course lessons
    const exists = await Lesson.exists({ _id: lessonId, module: { $in: moduleIds } });
    if (exists) completedCount += 1;
  }

  return Math.round((completedCount / totalLessons) * 100);
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user.id,
    }).populate("course");

    const enriched = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progressPct = await computeCourseProgressPct({
          enrollment,
          courseId: enrollment.course._id,
        });

        return {
          ...enrollment.toObject(),
          progress: progressPct,
        };
      })
    );

    res.status(200).json(enriched);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Marks a single lesson as completed for the current user's enrollment.
// Expects: { lessonId }
const markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.body;
    if (!lessonId) {
      return res.status(400).json({ message: "lessonId is required" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const module = await Module.findById(lesson.module).select("course");
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

    const completed = new Set((enrollment.completedLessons || []).map(String));
    completed.add(String(lessonId));

    enrollment.completedLessons = Array.from(completed);
    await enrollment.save();

    const progressPct = await computeCourseProgressPct({
      enrollment,
      courseId: module.course,
    });

    res.status(200).json({
      message: "Lesson marked complete",
      enrollmentId: enrollment._id,
      progress: progressPct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Legacy endpoint kept but no longer increments +25.
// Returns computed progress based on completedLessons.
const updateProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    // compute on the fly
    const progressPct = await computeCourseProgressPct({
      enrollment,
      courseId: enrollment.course,
    });

    enrollment.progress = progressPct;
    await enrollment.save();

    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "title price");

    const enriched = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progressPct = await computeCourseProgressPct({
          enrollment,
          courseId: enrollment.course._id,
        });

        return {
          ...enrollment.toObject(),
          progress: progressPct,
        };
      })
    );

    res.status(200).json(enriched);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  updateProgress,
  markLessonComplete,
  getAllEnrollments,
};
