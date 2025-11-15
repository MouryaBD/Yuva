import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getSimilarUsers } from '../services/api';

const Networking = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimilarUsers();
  }, []);

  const loadSimilarUsers = async () => {
    try {
      const res = await getSimilarUsers();
      setUsers(res.data.users || []);
    } catch (error) {
      console.error('Failed to load similar users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Network & Connect 🤝
          </h1>
          <p className="text-xl text-gray-600">
            Connect with others who share your career interests
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Complete a course to connect with peers who have similar career paths!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.userId}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                    👤
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                  <p className="text-primary-600 font-medium">{user.category}</p>
                  {user.location && (
                    <p className="text-sm text-gray-500">📍 {user.location}</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Interested in: {user.subcategories?.join(', ')}
                  </p>
                  <p className="text-sm text-primary-600 font-medium mb-4">
                    {user.commonCourses} common course{user.commonCourses !== 1 ? 's' : ''}
                  </p>

                  <button className="w-full btn-primary">
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Networking;
