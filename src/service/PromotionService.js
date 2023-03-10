import axios from "axios";

export class PromotionService {

    getPromotionsOfPartner(partnerId) {
        return new Promise((resolve) => {
            axios
              .get(
                `${window.env.REACT_APP_GORESY_BACKEND_URL}/promotions-of-partner?partnerId=${partnerId}`
              )
              .then((res) => resolve(res.data));
          });
    }

    updatePromotions(promotionId, promotion) {
        return new Promise((resolve) => {
            axios
              .put(
                `${window.env.REACT_APP_GORESY_BACKEND_URL}/promotions/${promotionId}`, promotion
              )
              .then((res) => resolve(res.data));
          });
    }

    addPromotions(promotion) {
        return new Promise((resolve) => {
            axios
              .post(
                `${window.env.REACT_APP_GORESY_BACKEND_URL}/promotion`, promotion
              )
              .then((res) => resolve(res.data));
          });
    }
}