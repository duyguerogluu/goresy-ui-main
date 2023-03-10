import axios from "axios";

export class BasicSettingsService {
    async getBasicSettings(partnerId) {
        const res = await fetch(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partners/${partnerId}`);
        return await res.json();
    }

    updatePermissionAndPastMonth(partnerId, basicSettings){
        return new Promise(resolve => { axios.put(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partner-basic-settings/${partnerId}`, basicSettings).then(res => resolve(res.data));
        })
    }
}