exports.StatusType = {
    PROPOSED: 'proposed',
    CANCELLED: 'cancelled',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    SENDER_ACK: 'sender_acknowledged',
    RECIPIENT_ACK: 'recipient_acknowledged',
    COMPLETE: 'complete',
};

exports.RequestType = {
    LEARN: 'receive', // Requester is receiving service
    SHARE: 'give', // Requester is giving service
    EXCHANGE: 'exchange', // Requester is both giving and receiving service
};
