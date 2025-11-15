import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ChatBox from '../components/ChatBox';

const WellnessCheck = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const courseId = location.state?.courseId;

  const [outcome, setOutcome] = useState(null);

  const handleWellnessComplete = (data) => {
    console.log('Wellness check complete:', data);
    setOutcome(data);
  };

  const handleContinue = () => {
    if (outcome?.outcome === 'HAPPY_WITH_PATH') {
      navigate(`/course/${courseId}`);
    } else if (outcome?.outcome === 'UNHAPPY_WITH_COURSE') {
      navigate('/home'); // Show mentor scheduling
    } else if (outcome?.outcome === 'UNHAPPY_WITH_CATEGORY') {
      navigate('/advisor'); // Redirect to advisor
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Wellness Check-In 🌟
          </h1>
          <p className="text-xl text-gray-600">
            Let's see how you're feeling about your learning journey
          </p>
        </div>

        {!outcome ? (
          <ChatBox
            userId={user?.userId}
            sessionType="wellness"
            onComplete={handleWellnessComplete}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Check-In Complete
            </h2>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">{outcome.reasoning}</p>
              <div className="bg-primary-50 border-l-4 border-primary-600 p-4 mb-4">
                <p className="font-medium text-primary-900">Recommendation:</p>
                <p className="text-primary-800">{outcome.recommendation}</p>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="btn-primary"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessCheck;
