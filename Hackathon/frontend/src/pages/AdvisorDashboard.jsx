import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { overridePathway } from '../services/api';

const CATEGORIES = [
  'BUSINESS & MANAGEMENT',
  'ANIMATION & VISUAL EFFECTS',
  'WRITING & JOURNALISM',
  'MUSIC',
  'SPORTS',
  'FILM & TELEVISION'
];

const SUBCATEGORIES = {
  'BUSINESS & MANAGEMENT': [
    'Talent Management', 'Talent Agency', 'Production Management',
    'Event Management', 'Marketing & PR', 'Business Development',
    'Legal', 'Accounting/Finance', 'Casting', 'Administrative Support'
  ],
  'ANIMATION & VISUAL EFFECTS': ['Animator', 'Graphic Design Artist'],
  'WRITING & JOURNALISM': ['Entertainment Journalist', 'Publicist', 'Content Creator'],
  'MUSIC': ['Musician/Singer', 'Producer', 'Songwriter', 'Audio Engineer'],
  'SPORTS': [
    'Broadcasting', 'Game Day Operations', 'Events Coordinator',
    'Sound Engineer', 'Advertising', 'Marketing', 'Digital Design',
    'Merchandising', 'Content Production', 'Talent Recruitment'
  ],
  'FILM & TELEVISION': [
    'Acting', 'Directing', 'Writing', 'Casting', 'Cinematography',
    'Editing', 'Sound Design', 'Sound Engineer', 'Costume Design',
    'Set Design/Engineer', 'Equipment Operations', 'Makeup Artists'
  ]
};

const AdvisorDashboard = () => {
  const [pathwayId, setPathwayId] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await overridePathway(pathwayId, {
        newCategory,
        newSubcategory,
        advisorNotes: notes
      });

      setSuccess(true);
      // Reset form
      setPathwayId('');
      setNewCategory('');
      setNewSubcategory('');
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to override pathway');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Career Advisor Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Override and adjust user career pathways
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              Career pathway successfully updated!
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pathway ID
              </label>
              <input
                type="text"
                value={pathwayId}
                onChange={(e) => setPathwayId(e.target.value)}
                required
                className="input-field"
                placeholder="Enter pathway ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setNewSubcategory('');
                }}
                required
                className="input-field"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {newCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Subcategory
                </label>
                <select
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="">Select a subcategory</option>
                  {SUBCATEGORIES[newCategory].map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advisor Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="input-field"
                placeholder="Explain why this pathway was changed..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Update Career Pathway'}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">How to use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Get the pathway ID from the user's profile</li>
            <li>Select the new recommended category and subcategory</li>
            <li>Add notes explaining your recommendation</li>
            <li>Submit to update the user's career path</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
