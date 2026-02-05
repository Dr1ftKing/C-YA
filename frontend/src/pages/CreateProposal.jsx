import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProposal } from "../services/proposals";
import { addDays, format } from "date-fns";

function CreateProposal() {
    const navigate = useNavigate();
    const today = format(new Date(), 'yyyy-MM-dd');
    const fourWeeksOut = format(addDays(new Date(), 28), 'yyyy-MM-dd');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dateRangeStart: today,
        dateRangeEnd: fourWeeksOut,
        numSlots: 5
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handlePreview = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        if (formData.numSlots < 1) {
            setError('Number of slots must be at least 1');
            return;
        }

        if (new Date(formData.dateRangeStart) > new Date(formData.dateRangeEnd)) {
            setError('End date must be after start date');
            return;
        }

        setShowPreview(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const response =  await createProposal(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create proposal');
            setShowPreview(false);
        }finally {
            setLoading(false);
        }
    };

    if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Preview Your Proposal</h2>
          
          <div className="border border-soft-periwinkle bg-white rounded-lg shadow p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="text-lg font-semibold">{formData.title}</p>
            </div>

            {formData.description && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-gray-700">{formData.description}</p>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Date Range</h3>
              <p className="text-gray-700">
                {format(new Date(formData.dateRangeStart), 'MMMM d, yyyy')} - {format(new Date(formData.dateRangeEnd), 'MMMM d, yyyy')}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Number of Slots</h3>
              <p className="text-gray-700">{formData.numSlots} people</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 px-4 py-2 border border-soft-periwinkle rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-soft-periwinkle text-white rounded-md hover:bg-slate-blue disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Proposal'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-soft-periwinkle hover:text-slate-blue"
          >
            ← Back to Dashboard
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">Create New Hangout Proposal</h2>
        
        <form onSubmit={handlePreview} className="bg-white rounded-lg border border-soft-periwinkle p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Weekend Hiking Trip"
                className="w-full px-3 py-2 border border-soft-periwinkle rounded-md focus:outline-none focus:ring-blue-500 focus:border-slate-blue"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any details about the hangout..."
                className="w-full px-3 py-2 border border-soft-periwinkle rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateRangeStart" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  id="dateRangeStart"
                  name="dateRangeStart"
                  type="date"
                  required
                  value={formData.dateRangeStart}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-soft-periwinkle rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="dateRangeEnd" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  id="dateRangeEnd"
                  name="dateRangeEnd"
                  type="date"
                  required
                  value={formData.dateRangeEnd}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-soft-periwinkle rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="numSlots" className="block text-sm font-medium text-gray-700 mb-1">
                Number of People to Invite *
              </label>
              <input
                id="numSlots"
                name="numSlots"
                type="number"
                min="1"
                required
                value={formData.numSlots}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-soft-periwinkle rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-soft-periwinkle text-white rounded-md hover:bg-slate-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Preview Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProposal;