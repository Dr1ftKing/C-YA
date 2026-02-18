import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import { getProposals } from '../services/proposals';
import { format } from 'date-fns';

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState({ created: [], responded: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const data = await getProposals();
      setProposals(data);
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getStatusBadge = (proposal) => {
    const now = new Date();
    const endDate = new Date(proposal.date_range_end);
    
    if (proposal.status === 'cancelled') {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>;
    }
    if (endDate < now) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Past</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
  };

  return (
    <div className="min-h-screen bg-white">

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-soft-periwinkle">My Proposals</h2>
            <button
              onClick={() => navigate('/create-proposal')}
              className="px-4 py-2 bg-soft-periwinkle text-white rounded-md hover:bg-slate-blue"
            >
              + Create Proposal
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <>
              <div className="mb-8 ">
                <h3 className="text-lg font-semibold mb-4">Created by Me</h3>
                {proposals.created.length === 0 ? (
                  <p className="text-gray-500">No proposals yet. Create one to get started!</p>
                ) : (
                  <div className="grid gap-4">
                    {proposals.created.map((proposal) => (
                      <div
                        key={proposal.id}
                        onClick={() => navigate(`/proposal/${proposal.id}`)}
                        className="border-3 border-periwinkle bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{proposal.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {format(new Date(proposal.date_range_start), 'MMM d')} - {format(new Date(proposal.date_range_end), 'MMM d, yyyy')}
                            </p>
                          </div>
                          {getStatusBadge(proposal)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">I've Responded To</h3>
                {proposals.responded.length === 0 ? (
                  <p className="text-gray-500">No responses yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {proposals.responded.map((proposal) => (
                      <div
                        key={proposal.id}
                        onClick={() => navigate(`/proposal/${proposal.id}`)}
                        className="border-3 border-periwinkle bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{proposal.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              By {proposal.creator_name} • {format(new Date(proposal.date_range_start), 'MMM d')} - {format(new Date(proposal.date_range_end), 'MMM d, yyyy')}
                            </p>
                          </div>
                          {getStatusBadge(proposal)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;