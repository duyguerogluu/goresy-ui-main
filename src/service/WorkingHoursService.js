import axios from "axios";

export class WorkingHoursService {
    getWorkingHours(partnerId) {
        return fetch(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partners/${partnerId}`).then(res => res.json())
    }

    updatePartnerWorkday(partnerId, workDayList) {
        return new Promise((resolve) => {
          axios
            .put(
              `${window.env.REACT_APP_GORESY_BACKEND_URL}/partner-work-hours/${partnerId}`, workDayList
            )
            .then((res) => resolve(res.data));
        });
      }
}