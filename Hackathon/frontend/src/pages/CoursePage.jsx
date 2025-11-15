import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { getCourse, getProgress, startCourse, updateProgress } from '../services/api';

const CoursePage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        getCourse(courseId),
        getProgress(user.userId, courseId)
      ]);

      setCourse(courseRes.data.course);
      setProgress(progressRes.data.progress);

      // Start course if not started
      if (progressRes.data.progress.status === 'not_started') {
        const startRes = await startCourse(user.userId, courseId);
        setProgress(startRes.data.progress);
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async () => {
    const currentLesson = course.modules[currentModuleIndex].lessons[currentLessonIndex];
    const lessonId = currentLesson.lessonId;

    try {
      const res = await updateProgress(user.userId, courseId, lessonId);
      setProgress(res.data.progress);

      // Check if wellness check is needed
      if (res.data.needsWellnessCheck) {
        alert('You\'ve reached 25% completion! Time for a wellness check.');
        navigate('/wellness-check', { state: { courseId } });
        return;
      }

      // Check if course complete
      if (res.data.progress.percentComplete >= 100) {
        navigate('/certification', { state: { courseId } });
        return;
      }

      // Move to next lesson
      const currentModule = course.modules[currentModuleIndex];
      if (currentLessonIndex < currentModule.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else if (currentModuleIndex < course.modules.length - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1);
        setCurrentLessonIndex(0);
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p>Course not found</p>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule.lessons[currentLessonIndex];
  const isLessonCompleted = progress?.completedLessons?.includes(currentLesson.lessonId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-bold text-primary-600">
                {progress?.percentComplete || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all"
                style={{ width: `${progress?.percentComplete || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Module List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-bold text-lg mb-4">Modules</h2>
              <div className="space-y-2">
                {course.modules.map((module, moduleIdx) => (
                  <button
                    key={module.moduleId}
                    onClick={() => {
                      setCurrentModuleIndex(moduleIdx);
                      setCurrentLessonIndex(0);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      moduleIdx === currentModuleIndex
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{module.title}</div>
                    <div className="text-sm text-gray-500">
                      {module.lessons.length} lessons
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Lesson */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentLesson.title}
              </h2>

              {/* Lesson Content */}
              <div className="mb-6">
                {currentLesson.videoUrl && (
                  <div className="mb-6 bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                    <p className="text-white">Video Player: {currentLesson.videoUrl}</p>
                  </div>
                )}

                <div className="prose max-w-none">
                  <p>{currentLesson.content || 'Lesson content goes here...'}</p>
                </div>
              </div>

              {/* Lesson Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  onClick={() => {
                    if (currentLessonIndex > 0) {
                      setCurrentLessonIndex(currentLessonIndex - 1);
                    } else if (currentModuleIndex > 0) {
                      setCurrentModuleIndex(currentModuleIndex - 1);
                      setCurrentLessonIndex(
                        course.modules[currentModuleIndex - 1].lessons.length - 1
                      );
                    }
                  }}
                  disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                  className="btn-secondary disabled:opacity-50"
                >
                  ← Previous
                </button>

                <button
                  onClick={markLessonComplete}
                  className={`btn-primary ${isLessonCompleted ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {isLessonCompleted ? '✓ Completed' : 'Mark as Complete'}
                </button>

                <button
                  onClick={() => {
                    if (currentLessonIndex < currentModule.lessons.length - 1) {
                      setCurrentLessonIndex(currentLessonIndex + 1);
                    } else if (currentModuleIndex < course.modules.length - 1) {
                      setCurrentModuleIndex(currentModuleIndex + 1);
                      setCurrentLessonIndex(0);
                    }
                  }}
                  disabled={
                    currentModuleIndex === course.modules.length - 1 &&
                    currentLessonIndex === currentModule.lessons.length - 1
                  }
                  className="btn-secondary disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
