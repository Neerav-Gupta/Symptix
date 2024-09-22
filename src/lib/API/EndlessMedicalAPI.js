import axios from 'axios';

export async function getSessionID() {
    const options = {
        method: 'GET',
        url: 'https://api-prod.endlessmedical.com/v1/dx/InitSession'
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        if (response.data.status == "ok") {
            return response.data.SessionID;
        } else {
            console.error("Something went wrong!");
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

export async function acceptTermsOfUse(SessionID) {
    const options = {
        method: 'POST',
        url: 'https://api-prod.endlessmedical.com/v1/dx/AcceptTermsOfUse',
        params: {
            SessionID: SessionID,
            passphrase: 'I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI and Endless Medical services. The Terms of Use are available on endlessmedical.com'
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: {}
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

export async function updateFeature(SessionID, name, value) {
    const options = {
        method: 'POST',
        url: 'https://api-prod.endlessmedical.com/v1/dx/UpdateFeature',
        params: {
            name: name,
            value: value,
            SessionID: SessionID
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: {}
    };

    try {
        const response = await axios.request(options);
        console.log(response.data, "update");
    } catch (error) {
        console.error(error);
    }
}

export async function deleteFeature(SessionID, name) {
    const options = {
        method: 'POST',
        url: 'https://api-prod.endlessmedical.com/v1/dx/DeleteFeature',
        params: {
            name: name,
            SessionID: SessionID
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: {}
    };

    try {
        const response = await axios.request(options);
        console.log(response.data, "Delete");
    } catch (error) {
        console.error(error);
    }
}

export async function getResults(SessionID) {
    const options = {
        method: 'GET',
        url: 'https://api-prod.endlessmedical.com/v1/dx/Analyze',
        params: { SessionID: SessionID },
        headers: {
            'Content-Type': 'application/json'
        },
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return null;
}