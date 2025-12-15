const axios = require('axios');

const getBaseUrl = () => {
    return process.env.INSTAMOJO_ENV === 'PROD'
        ? 'https://www.instamojo.com/api/1.1'
        : 'https://test.instamojo.com/api/1.1';
};

const getHeaders = () => {
    return {
        'X-Api-Key': process.env.INSTAMOJO_API_KEY,
        'X-Auth-Token': process.env.INSTAMOJO_AUTH_TOKEN
    };
};

const createPaymentRequest = async (paymentData) => {
    try {
        const url = `${getBaseUrl()}/payment-requests/`;

        const response = await axios.post(url, paymentData, {
            headers: getHeaders()
        });

        // API 1.1 returns { success: true, payment_request: { ... } }
        return response.data.payment_request;
    } catch (error) {
        console.error('Instamojo Create Request Error:', error.response?.data || error.message);
        throw new Error('Failed to create payment request');
    }
};

const getPaymentStatus = async (paymentRequestId) => {
    try {
        const url = `${getBaseUrl()}/payment-requests/${paymentRequestId}/`;

        const response = await axios.get(url, {
            headers: getHeaders()
        });

        return response.data.payment_request;
    } catch (error) {
        console.error('Instamojo Status Error:', error.response?.data || error.message);
        throw new Error('Failed to get payment status');
    }
};

module.exports = {
    createPaymentRequest,
    getPaymentStatus
};
