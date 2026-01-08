import api from './api';

export const getSlots = async (proposalId) => {
    const response = await api.get(`/slots/proposal/${proposalId}`);
    return response.data;
};

export const claimSlot = async (slotData) => {
    const response = await api.post('/slots', slotData);
    return response.data;
};

export const updateAvailability = async (slotId, availability) => {
    const response = await api.patch(`/slots/${slotId}/availability`, { availability });
    return response.data;
};