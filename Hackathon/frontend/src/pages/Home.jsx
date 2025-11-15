import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  getMatchedStories,
  getPathway,
  getMatchedMentors,
  getRecommendedCourses
} from '../services/api';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [pathway, setPathway] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storiesRes, pathwayRes, mentorsRes, coursesRes] = await Promise.all([
        getMatchedStories(),
        getPathway(user.userId),
        getMatchedMentors(),
        getRecommendedCourses(user.userId)
      ]);

      setStories(storiesRes.data.stories || []);
      setPathway(pathwayRes.data.pathway);
      setMentors(mentorsRes.data.mentors || []);
      setCourses(coursesRes.data.courses || []);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Your career path: <span className="font-semibold text-primary-600">{user?.category}</span>
          </p>
        </div>

        {/* Success Stories Carousel */}
        {stories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-6">
                <button
                  onClick={prevStory}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  ←
                </button>

                <div className="flex-1 flex items-center space-x-6">
                  {stories[currentStoryIndex]?.imageUrl && (
                    <img
                      src={stories[currentStoryIndex].imageUrl}
                      alt={stories[currentStoryIndex].name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {stories[currentStoryIndex]?.name}
                    </h3>
                    <p className="text-primary-600 font-medium">
                      {stories[currentStoryIndex]?.currentRole}
                    </p>
                    <p className="text-gray-600 mt-2">
                      {stories[currentStoryIndex]?.story}
                    </p>
                  </div>
                </div>

                <button
                  onClick={nextStory}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Career Pathway */}
        {pathway && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Career Pathway</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-4">
                {pathway.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                      <p className="text-primary-600 text-sm mt-1">
                        ⏱ {step.estimatedTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Matched Mentors */}
        {mentors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect with Mentors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mentors.map((mentor) => (
                <div key={mentor.mentorId} className="bg-white rounded-xl shadow-lg p-6">
                  {mentor.imageUrl && (
                    <img
                      src={mentor.imageUrl}
                      alt={mentor.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                  )}
                  <h3 className="text-lg font-bold text-center">{mentor.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-2">{mentor.location}</p>
                  <p className="text-sm text-gray-700 mb-4">{mentor.bio}</p>
                  <a
                    href={mentor.availability || mentor.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full btn-primary text-center"
                  >
                    Schedule Meeting
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Courses */}
        {courses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.courseId} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.difficulty}</span>
                    <span>{course.estimatedHours}h</span>
                  </div>
                  <button
                    onClick={() => navigate(`/course/${course.courseId}`)}
                    className="w-full btn-primary"
                  >
                    Take Course
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
