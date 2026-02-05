import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProposal } from "../services/proposals";
import { getSlots, claimSlot } from "../services/slots";
import { format, eachDayOfInterval } from "date-fns";
import validator from 'validator';

function InviteResponse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    const [selectedDays, setSelectedDays] = useState({});
    const [busyTimes, setBusyTimes] = useState({});

    useEffect(() => {
        loadProposalData();
    }, [id]);

    const loadProposalData = async () => {
        try {
            const [proposalData, slotsData] = await Promise.all([
                getProposal(id),
                getSlots(id)
            ]);

            setProposal(proposalData.proposal);
            setSlots(slotsData.slots);
        } catch (err) {
            setError('Failed to load proposal');
        } finally {
            setLoading(false);
        }
    };

    const allDays = proposal ? eachDayOfInterval({
        start: new Date(proposal.date_range_start),
        end: new Date(proposal.date_range_end)
    }) : [];

    const handleDayToggle = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        setSelectedDays(prev => ({
            ...prev,
            [dateStr]: !prev[dateStr]
        }));
    };

    const handleBusyTimeChange = (date, field, value) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        setBusyTimes(prev => ({
            ...prev,
            [dateStr]: {
                ...prev[dateStr],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!validator.isEmail(formData.email)) {
            setError('Name and email are required');
            return;
        }

        if (!validator.isEmail(formData.email)) {
            setError('Invalid email address');
            return;
        }

        const selectedDates = Object.keys(selectedDays).filter(date => selectedDays[date]);

        if (selectedDates.length === 0) {
            setError('Please select at least one availability day');
            return;
        }

        // Build availability array
        const availability = selectedDates.map(date => {
            const busy = busyTimes[date];
            const busyTimesArray = [];

            if (busy && busy.start && busy.end) {
                busyTimesArray.push({
                    start: busy.start,
                    end: busy.end
                });
            }

            return {
                date,
                busyTimes: busyTimesArray
            };
        });

        setSubmitting(true);

        try {
            await claimSlot({
                proposalId: id,
                name: formData,
                email: formData.email,
                availability
            });

            // Show success message and redirect or show results
            alert('Your availability has been submitted!');
            loadProposalData(); // Reload to show you updated slots
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit availability');
        } finally {
            setSubmitting(false);
        }
    };

   if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error && !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const slotsFilled = slots.length;
  const slotsAvailable = proposal.num_slots - slotsFilled;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg border  border-soft-periwinkle shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
          <p className="text-gray-600 mb-4">
            By {proposal.creator_name} • {format(new Date(proposal.date_range_start), 'MMM d')} - {format(new Date(proposal.date_range_end), 'MMM d, yyyy')}
          </p>
          
          {proposal.description && (
            <p className="text-gray-700 mb-4">{proposal.description}</p>
          )}

          <div className="bg-periwinkle border border-soft-periwinkle rounded p-4">
            <p className="text-sm font-medium text-slate-blue">
              {slotsAvailable > 0 
                ? `${slotsAvailable} of ${proposal.num_slots} slots available`
                : 'All slots are filled'}
            </p>
          </div>
        </div>

        {slotsAvailable === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-center text-gray-600">
              Sorry, all slots for this hangout have been filled.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-soft-periwinkle p-6">
            <h2 className="text-xl font-bold mb-4">Submit Your Availability</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-soft-periwinkle rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-soft-periwinkle rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  We'll use this to identify you if you need to update your availability later
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Days You're Available</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check the days you're free. You can optionally add specific times you're busy.
              </p>
              
              <div className="space-y-3">
                {allDays.map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const isSelected = selectedDays[dateStr];
                  
                  return (
                    <div key={dateStr} className="border border-soft-periwinkle rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={dateStr}
                          checked={isSelected || false}
                          onChange={() => handleDayToggle(date)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={dateStr} className="ml-3 text-sm font-medium text-gray-900">
                          {format(date, 'EEEE, MMMM d, yyyy')}
                        </label>
                      </div>
                      
                      {isSelected && (
                        <div className="ml-7 mt-2 flex gap-4 items-center">
                          <span className="text-sm text-gray-600">Busy time (optional):</span>
                          <input
                            type="time"
                            value={busyTimes[dateStr]?.start || ''}
                            onChange={(e) => handleBusyTimeChange(date, 'start', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span className="text-sm text-gray-600">to</span>
                          <input
                            type="time"
                            value={busyTimes[dateStr]?.end || ''}
                            onChange={(e) => handleBusyTimeChange(date, 'end', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2 bg-soft-periwinkle text-white rounded-md hover:bg-slate-blue disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Availability'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default InviteResponse;