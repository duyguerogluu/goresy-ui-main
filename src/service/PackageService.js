import axios from "axios";

export class PackageService {
  getPackageSaleList(partnerId) {
    return new Promise((resolve) => {
      axios
          .get(
              `${window.env.REACT_APP_GORESY_BACKEND_URL}/package-sales-of-partner/${partnerId}`
          )
          .then((res) => resolve(res.data));
    });
  }

  getPackageList(partnerId) {
    return new Promise((resolve) => {
      axios
          .get(
              `${window.env.REACT_APP_GORESY_BACKEND_URL}/packages-of-partner?partnerId=${partnerId}`
          )
          .then((res) => resolve(res.data));
    });
  }

  updatePackage(packageId, packageOfPartner) {
    return new Promise((resolve) => {
      axios
        .put(
          `${window.env.REACT_APP_GORESY_BACKEND_URL}/packages/${packageId}`,
          packageOfPartner
        )
        .then((res) => resolve(res.data));
    });
  }

  addPackage(packageOfPartner) {
    return new Promise((resolve) => {
      axios
        .post(
          `${window.env.REACT_APP_GORESY_BACKEND_URL}/package`,
          packageOfPartner
        )
        .then((res) => resolve(res.data));
    });
  }

  deletePackage(packageId) {
    return new Promise((resolve) => {
      axios
          .delete(`${window.env.REACT_APP_GORESY_BACKEND_URL}/packages/${packageId}`)
          .then((res) => resolve(res.data));
    });
  }
}