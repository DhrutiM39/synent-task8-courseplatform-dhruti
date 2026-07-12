import "../CourseDetails.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── Phase-1: always-available public data ──────────────────────────────────
  const [course, setCourse] = useState(null);
  const [publicModules, setPublicModules] = useState([]); // titles only, no videoUrl

  // ── Phase-2: enrollment-gated content ─────────────────────────────────────
  const [enrolled, setEnrolled] = useState(false);
  const [contentModules, setContentModules] = useState([]); // full lessons incl. videoUrl

  // ── Lesson completion tracking ─────────────────────────────────────────────
  // Set of lesson ID strings that the user has already completed.
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [marking, setMarking] = useState(false); // button loading state

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // ── Phase-1 fetch: public course details + curriculum (no videoUrl) ────────
  const fetchPublicDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
      setCourse(res.data.course);
      setPublicModules(res.data.modules || []);
    } catch (error) {
      console.error("Failed to load course details:", error?.response?.data || error.message);
      setCourse(null);
    }
  };

  // ── Phase-2 fetch: enrollment-gated full content (includes videoUrl) ───────
  // Also reads completedLessons from the enrollment record.
  const fetchContent = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // not logged in → skip silently

    try {
      // Fetch full lesson content (gated — 403 if not enrolled)
      const contentRes = await axios.get(
        `http://localhost:5000/api/courses/${id}/content`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolled(true);
      setContentModules(contentRes.data.modules || []);

      // Auto-select first lesson
      const firstLesson = contentRes.data.modules?.[0]?.lessons?.[0];
      if (firstLesson) setSelectedLesson(firstLesson);

      // Fetch the enrollment record to seed the completedLessons set
      const enrollRes = await axios.get(
        "http://localhost:5000/api/enrollments/my-courses",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const thisEnrollment = enrollRes.data.find(
        (e) => String(e.course?._id ?? e.course) === String(id)
      );
      if (thisEnrollment) {
        setCompletedLessons(
          new Set((thisEnrollment.completedLessons || []).map(String))
        );
        if (typeof thisEnrollment.progress === "number") {
          setProgress(thisEnrollment.progress);
        }
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403) {
        // Not enrolled — that's fine; public details are already loaded
        setEnrolled(false);
      } else {
        console.error("Content fetch error:", error?.response?.data || error.message);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchPublicDetails();
      await fetchContent();
      setLoading(false);
    };
    init();
  }, [id]);

  // ── Lesson click: look up the full lesson (with videoUrl) ──────────────────
  const handleLessonClick = (lessonId) => {
    if (!enrolled) return; // locked for non-enrolled users

    for (const mod of contentModules) {
      const full = mod.lessons.find((l) => String(l._id) === String(lessonId));
      if (full) {
        setSelectedLesson(full);
        return;
      }
    }
  };

  // ── Explicit "Mark as Complete" handler ────────────────────────────────────
  const handleMarkComplete = async () => {
    if (!selectedLesson || marking) return;
    setMarking(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/enrollments/mark-lesson-complete",
        { lessonId: selectedLesson._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update completed set and progress bar
      setCompletedLessons((prev) => new Set([...prev, String(selectedLesson._id)]));
      if (typeof res.data.progress === "number") {
        setProgress(res.data.progress);
      }
    } catch (e) {
      console.error(e?.response?.data || e.message);
      alert(e?.response?.data?.message || "Failed to mark lesson complete.");
    } finally {
      setMarking(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return <h2>Loading...</h2>;
  if (!course) return <h2>Course not found.</h2>;

  // Enrolled users get the full sidebar (videoUrl available); others get title-only list.
  const sidebarModules = enrolled ? contentModules : publicModules;

  const isCurrentLessonDone =
    selectedLesson && completedLessons.has(String(selectedLesson._id));

  return (
    <div className="course-page">

      <div className="course-left">

        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <h2>₹ {course.price}</h2>

        <button className="back-btn" onClick={() => navigate("/")}>
          Back
        </button>

        <hr />

        <h2>Course Content</h2>

        {sidebarModules.map((module) => (
          <div key={module._id} className="module-card">
            <h3>{module.title}</h3>

            {module.lessons.map((lesson) => {
              const isLocked = !enrolled;
              const isDone = completedLessons.has(String(lesson._id));
              const isActive = selectedLesson && String(selectedLesson._id) === String(lesson._id);

              return (
                <p
                  key={lesson._id}
                  className={[
                    "lesson-item",
                    isLocked ? "lesson-locked" : "",
                    isActive ? "lesson-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleLessonClick(lesson._id)}
                  title={isLocked ? "Enroll to unlock this lesson" : lesson.title}
                >
                  <span className="lesson-icon">
                    {isLocked ? "🔒" : isDone ? "✅" : "▶"}
                  </span>
                  {lesson.title}
                </p>
              );
            })}
          </div>
        ))}

        {!enrolled && (
          <p className="enroll-notice">
            Enroll in this course to access lessons and track your progress.
          </p>
        )}

      </div>

      <div className="course-right">

        {enrolled && selectedLesson ? (
          <>
            <iframe
              width="100%"
              height="400"
              src={selectedLesson.videoUrl.replace("watch?v=", "embed/")}
              title={selectedLesson.title}
              allowFullScreen
            ></iframe>

            <h2>{selectedLesson.title}</h2>

            {/* ── Explicit completion button ── */}
            <button
              className={`mark-complete-btn${isCurrentLessonDone ? " mark-complete-btn--done" : ""}`}
              onClick={handleMarkComplete}
              disabled={isCurrentLessonDone || marking}
            >
              {isCurrentLessonDone
                ? "✅ Completed"
                : marking
                ? "Saving…"
                : "Mark as Complete"}
            </button>

            <div className="progress-header" style={{ marginTop: 16 }}>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        ) : enrolled ? (
          <h2>Select a Lesson</h2>
        ) : (
          <div className="enroll-prompt">
            <h2>🔒 Enroll to Watch</h2>
            <p>Purchase or enroll in this course to start watching lessons.</p>
          </div>
        )}

      </div>

    </div>
  );
}

export default CourseDetails;
