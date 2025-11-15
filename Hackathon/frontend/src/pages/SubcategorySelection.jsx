import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveSubcategories } from '../services/api';

const SubcategorySelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const assessmentData = location.state?.assessmentData;

  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!assessmentData) {
    navigate('/assessment');
    return null;
  }

  const toggleSubcategory = (subcategory) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategory)) {
        return prev.filter(s => s !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedSubcategories.length === 0) {
      alert('Please select at least one subcategory');
      return;
    }

    setLoading(true);
    try {
      await saveSubcategories(assessmentData.assessmentId, selectedSubcategories);

      // Update user context
      updateUser({
        category: assessmentData.category,
        subcategories: selectedSubcategories,
        isNewUser: false
      });

      navigate('/home');
    } catch (error) {
      console.error('Failed to save subcategories:', error);
      alert('Failed to save your selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Path in {assessmentData.category}
          </h1>
          <p className="text-xl text-gray-600">
            Select the roles that interest you most (you can choose multiple)
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessmentData.subcategories.map((subcategory) => (
              <button
                key={subcategory}
                onClick={() => toggleSubcategory(subcategory)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSubcategories.includes(subcategory)
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-primary-300 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{subcategory}</span>
                  {selectedSubcategories.includes(subcategory) && (
                    <span className="text-primary-600 text-xl">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading || selectedSubcategories.length === 0}
              className="btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Continue to Dashboard'}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Selected: {selectedSubcategories.length} subcategories</p>
        </div>
      </div>
    </div>
  );
};

export default SubcategorySelection;
