import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProposal, updateProposal, cancelProposal } from "../services/proposals";
import { format } from 'date-fns';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

function ProposalDetail({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        loadProposal();
    }, [id]);

    const loadProposal = async () => {
        try{
            const data = await getProposal(id);
            setProposal(data.proposal);
            setEditData({
                title: data.proposal.title,
                description: data.proposal.description || '',
                dateRangeStart: data.proposal.date_range_start,
                dateRangeEnd: data.proposal.date_range_end,
                numSlots: data.proposal.num_slots
            });
        } catch (err) {
            setError('Failed to load proposal');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        const inviteUrl = `${window.location.origin}/invite/${id}`;
        navigator.clipboard.writeText(inviteUrl);
        alert('Link copied to clipboard');
    };

    const handleEdit = async () => {
        try {
            await updateProposal(id, editData);
            setEditing(false);
            loadProposal();
        } catch (err) {
            setError('Failed to update proposal');
        }
    };

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this proposal?')) {
            try {
                await cancelProposal(id);
                navigate('/dashboard');
            } catch (err) {
                setError('Failed to cancel proposal');
            }
        }
    };

    const isCreator = user && proposal && proposal.creator_email === user.email;

    if (loading) {
        return(
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (error || !proposal) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                <p className="text-xl text-red-600 mb-4">{error || 'Proposal not found'}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-blue-600 hover:text-blue-700"
                >
                    ← Back to Dashboard
                </button>
                </div>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
            <div className="mb-6">
            <button
                onClick={() => navigate('/dashboard')}
                className="text-soft-periwinkle hover:text-slate-blue"
            >
                ← Back to Dashboard
            </button>
            </div>

            {editing ? (
            <div className="bg-white rounded-lg border-2 border-periwinkle p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Edit Proposal</h2>
                
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                    </label>
                    <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-blue rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                    </label>
                    <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-blue rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={editData.dateRangeStart}
                        onChange={(e) => setEditData({ ...editData, dateRangeStart: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-blue rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={editData.dateRangeEnd}
                        onChange={(e) => setEditData({ ...editData, dateRangeEnd: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-blue rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Slots
                    </label>
                    <input
                    type="number"
                    min="1"
                    value={editData.numSlots}
                    onChange={(e) => setEditData({ ...editData, numSlots: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-blue rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                </div>

                <div className="flex gap-4 mt-6">
                <button
                    onClick={() => setEditing(false)}
                    className="flex-1 px-4 py-2 border-2 border-periwinkle rounded-md text-soft-periwinkle hover:bg-lavender-veil"
                >
                    Cancel
                </button>
                <button
                    onClick={handleEdit}
                    className="flex-1 px-4 py-2 bg-soft-periwinkle text-white rounded-md hover:bg-slate-blue"
                >
                    Save Changes
                </button>
                </div>
            </div>
            ) : (
            <div className="bg-white rounded-lg border-2 border-lavender-veil p-6 mb-6">
                <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{proposal.title}</h1>
                    <p className="text-gray-600 mt-2">
                    By {proposal.creator_name} • {format(new Date(proposal.date_range_start), 'MMM d')} - {format(new Date(proposal.date_range_end), 'MMM d, yyyy')}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    proposal.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    new Date(proposal.date_range_end) < new Date() ? 'bg-gray-100 text-gray-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {proposal.status === 'cancelled' ? 'Cancelled' :
                    new Date(proposal.date_range_end) < new Date() ? 'Past' :
                    'Active'}
                </span>
                </div>

                {proposal.description && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-gray-700">{proposal.description}</p>
                </div>
                )}

                <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Slots</h3>
                <p className="text-gray-700">
                    {proposal.filled_slots} of {proposal.num_slots} slots filled
                </p>
                </div>

                {isCreator && proposal.status === 'active' && (
                <div className="space-y-4">
                    <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Share this link</h3>
                    <div className="flex gap-2">
                        <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/invite/${id}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                        <button
                        onClick={handleCopyLink}
                        className="px-4 py-2 bg-soft-periwinkle text-white rounded-md hover:bg-slate-blue"
                        >
                        Copy Link
                        </button>
                    </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-blue">
                    <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 border-2 border-periwinkle rounded-md text-soft-periwinkle hover:bg-gray-50"
                    >
                        Edit Details
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                    >
                        Cancel Proposal
                    </button>
                    </div>
                </div>
                )}
            </div>
            )}

            <div className="bg-white rounded-lg border-2 border-lavender-veil p-6">
                <h2 className=" text-xl font-bold mb-4">Availability Calendar</h2>
                <AvailabilityCalendar proposalId={id} />
            </div>
        </div>
        </div>
  );
}

export default ProposalDetail;