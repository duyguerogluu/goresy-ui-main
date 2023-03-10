import axios from "axios";

export class ServiceListService {

  getServicesOfEmployee(employeeId) {
    return axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/services-of-employee?employee=${employeeId}`)
        .then(res => res.data);
  }

  getServiceListSmall(partnerId) {
    return new Promise((resolve) => {
      axios
        .get(
          `${window.env.REACT_APP_GORESY_BACKEND_URL}/services/small-list-of-partner?partnerId=${partnerId}`
        )
        .then((res) => resolve(res.data));
    });
  }

  getService(serviceId) {
    return new Promise((resolve) => {
      axios
          .get(
              `${window.env.REACT_APP_GORESY_BACKEND_URL}/services/${serviceId}`
          )
          .then((res) => resolve(res.data));
    });
  }

  createService(service) {
    return new Promise((resolve) => {
      axios
        .post(
          `${window.env.REACT_APP_GORESY_BACKEND_URL}/service`, service
        )
        .then((res) => resolve(res.data));
    });
  }

  updateService(serviceId, service) {
    return new Promise((resolve) => {
      axios
        .put(
          `${window.env.REACT_APP_GORESY_BACKEND_URL}/services/${serviceId}`,
          service
        )
        .then((res) => resolve(res.data));
    });
  }

  deleteService(serviceId) {
    return new Promise((resolve) => {
      axios
        .delete(
          `${window.env.REACT_APP_GORESY_BACKEND_URL}/services/${serviceId}`
        )
        .then((res) => resolve(res.data));
    });
  }
  
  getServiceList(partnerId) {
    return new Promise((resolve) => {
        axios
          .get(
            `${window.env.REACT_APP_GORESY_BACKEND_URL}/services-of-partner?partnerId=${partnerId}`
          )
          .then((res) => resolve(res.data));
      });
  }

  updateServiceDuration(serviceId, serviceDuration) {
    return new Promise((resolve) => {
      axios
        .put(
          `${window.env.REACT_APP_GORESY_BACKEND_URL}/services/${serviceId}/duration`, serviceDuration
        )
        .then((res) => resolve(res.data));
    });
  }

  updateServicePrice(serviceId, servicePrice) {
    return new Promise((resolve) => {
      axios
        .put(
          `${window.env.REACT_APP_GORESY_BACKEND_URL}/services/${serviceId}/price`, servicePrice
        )
        .then((res) => resolve(res.data));
    });
  }

  getServicePriceList() {
    return fetch("service-price-list.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }

  getServiceOptions() {
    return fetch("service-options-small.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }
}
