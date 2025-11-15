import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';

const Assessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);

  const handleAssessmentComplete = (data) => {
    console.log('Assessment complete:', data);
    setAssessmentData(data);

    // Navigate to subcategory selection after a brief delay
    setTimeout(() => {
      navigate('/subcategory-selection', { state: { assessmentData: data } });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let's Discover Your Spark ✨
          </h1>
          <p className="text-xl text-gray-600">
            Answer a few questions to find your perfect career path in entertainment
          </p>
        </div>

        {assessmentData ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Assessment Complete!
            </h2>
            <p className="text-green-700 mb-4">
              We recommend: <span className="font-bold">{assessmentData.category}</span>
            </p>
            <p className="text-gray-600">Redirecting you to select your specific interests...</p>
          </div>
        ) : (
          <ChatBox
            userId={user?.userId}
            sessionType="assessment"
            onComplete={handleAssessmentComplete}
          />
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This assessment takes about 3-5 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
