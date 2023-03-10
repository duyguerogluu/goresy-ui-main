import axios from "axios";
export class CheckListService {

    getCheckListSmall(partnerId) {
        return new Promise((resolve) => {
          axios
            .get(
              `${window.env.REACT_APP_GORESY_BACKEND_URL}/checks-of-partner?partnerId=${partnerId}`
            )
            .then((res) => resolve(res.data));
        });
      }

}