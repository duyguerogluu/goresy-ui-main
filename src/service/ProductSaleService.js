import axios from "axios";

export class ProductSaleService {
  postProductSale(productSale) {
    return new Promise((resolve) => {
      axios
        .post(
          `${window.env.REACT_APP_GORESY_BACKEND_URL}/product-sale`,
          productSale
        )
        .then((res) => resolve(res.data));
    });
  }

  getProductSale(partnerId) {
    return new Promise(resolve => {
        axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/order-products-of-partner/${partnerId}?sort=id,desc`)
            .then(res => resolve(res.data));
    })
}
}