import api from './api'

export const createProposal = async (proposalData) => {
    const response = await api.post('/proposals', proposalData);
    return response.data;
};

export const getProposals = async () => {
    const response = await api.get('/proposals');
    return response.data;
};

export const getProposal = async (id) => {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
};

export const updateProposal = async (id, updates) => {
    const response = await api.patch(`/proposals/${id}`, updates);
    return response.data;
};

export const cancelProposal = async (id) => {
    const response = await api.delete(`/proposals/${id}`);
    return response.data;
};