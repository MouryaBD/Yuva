import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { generateCertification, getUserCertifications } from '../services/api';

const Certification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const courseId = location.state?.courseId;

  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      // If coming from course completion, generate certificate
      if (courseId) {
        setGenerating(true);
        await generateCertification(user.userId, courseId);
      }

      const res = await getUserCertifications(user.userId);
      setCertifications(res.data.certifications || []);
    } catch (error) {
      console.error('Failed to load certifications:', error);
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  if (loading || generating) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              {generating ? 'Generating your certificate...' : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Certifications 🏆
          </h1>
          <p className="text-xl text-gray-600">
            Celebrate your achievements!
          </p>
        </div>

        {certifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Complete a course to earn your first certification!
            </p>
            <button
              onClick={() => navigate('/home')}
              className="btn-primary mt-4"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <>
            {/* Celebration if just completed */}
            {courseId && (
              <div className="bg-gradient-to-r from-primary-500 to-accent-600 text-white rounded-xl p-8 mb-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                <p className="text-lg">You've completed the course and earned a certificate!</p>
                <button
                  onClick={() => navigate('/networking')}
                  className="mt-4 bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
                >
                  Connect with Peers →
                </button>
              </div>
            )}

            {/* Certifications List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.certificationId}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-primary-200"
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">📜</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Certificate of Completion
                    </h3>
                    <p className="text-lg text-primary-600 font-medium">
                      {cert.courseName}
                    </p>
                  </div>

                  <div className="border-t pt-4 text-center">
                    <p className="text-gray-600">
                      Awarded to: <span className="font-bold">{cert.userName}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Certificate #{cert.certificateNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                    </p>

                    {cert.pdfUrl && (
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary mt-4 inline-block"
                      >
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Certification;
