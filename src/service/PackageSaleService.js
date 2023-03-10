import axios from "axios";

export class PackageSaleService {
  postPackageSale(packageSale) {
    return new Promise((resolve) => {
      axios
        .post(
          `${window.env.REACT_APP_GORESY_BACKEND_URL}/package-sale`,
          packageSale
        )
        .then((res) => resolve(res.data));
    });
  }
}