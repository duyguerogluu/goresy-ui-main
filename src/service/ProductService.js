import axios from "axios";

export class ProductService {

    getProductSaleSmall() {
        return fetch('product-sale-small.json').then(res => res.json())
                .then(d => d.data);
    }

    getProductMedium() {
        return fetch('product-large.json').then(res => res.json())
                .then(d => d.data);
    }

    getProductsLarge() {
        return fetch(`${window.env.REACT_APP_GORESY_BACKEND_URL}/appointments?pageNumber=1`).then(res => res.json())
                .then(d => d);
    }

    getProductLarge() {
        return fetch('product-large.json').then(res => res.json())
                .then(d => d.data);
    }

    getProductXLarge() {
        return fetch('product-large.json').then(res => res.json())
                .then(d => d.data);
    }

    getProduct(params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        return fetch('https://www.primefaces.org/data/Product?' + queryParams).then(res => res.json())
    }
    
    getProductList(partnerId) {
        return new Promise((resolve) => {
            axios
              .get(
                `${window.env.REACT_APP_GORESY_BACKEND_URL}/products-of-partner?partnerId=${partnerId}`
              )
              .then((res) => resolve(res.data));
          });
    }

    updateProduct(productId, product) {
        return new Promise((resolve) => {
            axios
              .put(
                `${window.env.REACT_APP_GORESY_BACKEND_URL}/products/${productId}`, product
              )
              .then((res) => resolve(res.data));
          });
    }

    addProduct(product) {
        return new Promise((resolve) => {
            axios
              .post(
                `${window.env.REACT_APP_GORESY_BACKEND_URL}/product`, product
              )
              .then((res) => resolve(res.data));
          });
    }

    deleteProduct(productId) {
        return new Promise((resolve) => {
            axios
                .delete(`${window.env.REACT_APP_GORESY_BACKEND_URL}/products/${productId}`)
                .then((res) => resolve(res.data));
        });
    }
}