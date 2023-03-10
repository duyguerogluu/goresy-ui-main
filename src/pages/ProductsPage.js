import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { ProductService } from '../service/ProductService';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import {connect} from "react-redux";

const ProductsPage = (props) => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const [productList, setProductList] = useState(null);
    const [newProductDialog, setNewProductDialog] = useState(false);
    const [updateProductDialog, setUpdateProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);
    const [productTitle, setProductTitle] = useState(null);
    const [price, setPrice] = useState(null);
    const [stockQuantity, setStockQuantity] = useState(null);
    const [barcode, setBarcode] = useState(null);

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const filtersMap = {
        'filters': { value: filters, callback: setFilters },
    };

    const productService = new ProductService();

    useEffect(() => {
        productService.getProductList(props.partnerId).then(data => { setProductList(data); setLoading(false) });
    }, []);

    const onGlobalFilterChange = (event, filtersKey) => {
        const value = event.target.value;
        let filters = { ...filtersMap[filtersKey].value };
        filters['global'].value = value;

        filtersMap[filtersKey].callback(filters);
    }

    const renderHeader = (filtersKey) => {
        const filters = filtersMap[`${filtersKey}`].value;

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={filters['global'].value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder={t('search')} />
            </span>
        );
    }

    const deleteButtonTemplate = (rowData, info) => {
        return <div className="flex justify-content-end">
            <Button style={{ marginRight: '.5rem' }} icon="pi pi-pencil" className="p-button-rounded" onClick={() => { setUpdateProductDialog(true); setSelectedProductIndex(info.rowIndex); setUpdateFields(info.rowIndex) }} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => { setDeleteProductDialog(true); setSelectedProductIndex(info.rowIndex) }} />
        </div>;
    }

    const hideDialog = () => {
        setDeleteProductDialog(false);
        setNewProductDialog(false);
        setUpdateProductDialog(false);
    }

    const deleteProduct = () => {
        productService.deleteProduct(productList[selectedProductIndex].id)
            .then(() => {
                let products = [...productList];
                products.splice(selectedProductIndex, 1)
                setProductList(products);
                setDeleteProductDialog(false);
            })
    }

    const addNewProduct = () => {
      let newProduct = {
        partnerId: props.partnerId,
        title: productTitle,
        stockCount: stockQuantity,
        price: price,
        barcode: barcode,
      };

      let productListCopy = [...productList];
      productService.addProduct(newProduct).then((data) => {
        productListCopy.push(data);
        setProductList(productListCopy);
        setNewProductDialog(false);
        toast.current.show({
            severity:'success', 
            summary: t('save_successed'),
            detail: t('save_completed_successfully'), 
            life: 3000
        })
      });
    };

    const updateProduct = () => {
      let productId = productList[selectedProductIndex].id;
      let updatedProduct = {
        partnerId: props.partnerId,
        title: productTitle,
        stockCount: stockQuantity,
        price: price,
        barcode: barcode,
      };
      let products = [...productList];

      productService.updateProduct(productId, updatedProduct).then((data) => {
        products[selectedProductIndex] = data;
        setProductList(products);
        setUpdateProductDialog(false);
        toast.current.show({
            severity:'success', 
            summary: t('save_successed'),
            detail: t('save_completed_successfully'), 
            life: 3000
        })
      });
    };

    const setUpdateFields = (index) => {
        setProductTitle(productList[index].title);
        setPrice(productList[index].price);
        setStockQuantity(productList[index].stockCount);
        setBarcode(productList[index].barcode)
    }

    const clearAllFields = () => {
        setProductTitle("");
        setPrice(null);
        setStockQuantity(null);
        setBarcode(null);
    }

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );

    const newProductDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={addNewProduct} />
        </React.Fragment>
    );

    const updateProductDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={updateProduct} />
        </React.Fragment>
    );

    const header1 = renderHeader('filters');

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <div className="grid">
                    <div className="flex justify-content-start flex-wrap card-container col">
                        <h2><b>{t('products')}</b></h2>
                    </div>
                    <div className="flex justify-content-end flex-wrap card-container col">
                        <Button label={t('add_new_product')} icon="pi pi-plus" style={{ padding: '.45rem 1rem', marginBottom: "1rem", marginLeft: '1rem' }} className="p-button-success" onClick={() => { setNewProductDialog(true); clearAllFields(); }} />
                    </div>
                </div>
                <DataTable paginator value={productList} responsiveLayout="scroll" header={header1} filters={filters} onFilter={(e) => setFilters(e.filters)} rows={10} loading={loading} 
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}
                    currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                    <Column field="title" header={t("product")} sortable filter></Column>
                    <Column field="stockCount" header={t("stock")} sortable></Column>
                    <Column field="price" header={t("price")} sortable></Column>
                    <Column field="barcode" header={t("barcode")} sortable filter></Column>
                    <Column header="" body={deleteButtonTemplate}></Column>
                </DataTable>
            </div>
            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header={t('confirm')} modal footer={deleteProductDialogFooter} onHide={hideDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {<span>{t('confirm_delete')}</span>}
                </div>
            </Dialog>
            <Dialog visible={newProductDialog} style={{ width: '450px' }} header={t('add_new_product')} modal className="p-fluid" footer={newProductDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <InputText id="name" value={productTitle} onChange={(e) => setProductTitle(e.target.value)} required autoFocus placeholder={t('product_title')} />
                </div>
                <div className="field">
                    <InputNumber id="price" value={price} onChange={(e) => setPrice(e.value)} required placeholder={t('price')} suffix={" " + t('TL')} />
                </div>
                <div className="field">
                    <InputNumber id="stock_quantity" value={stockQuantity} onChange={(e) => setStockQuantity(e.value)} placeholder={t('stock_quantity')} />
                </div>
                <div className="field">
                    <InputNumber id="barcode" value={barcode} onChange={(e) => setBarcode(e.value)} placeholder={t('barcode')}  useGrouping={false} />
                </div>
            </Dialog>
            <Dialog visible={updateProductDialog} style={{ width: '450px' }} header={t('update_product')} modal className="p-fluid" footer={updateProductDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <InputText id="name" value={productTitle} onChange={(e) => setProductTitle(e.target.value)} required autoFocus placeholder={t('product_title')} />
                </div>
                <div className="field">
                    <InputNumber id="price" value={price} onChange={(e) => setPrice(e.value)} required placeholder={t('price')} suffix={" " + t('TL')} />
                </div>
                <div className="field">
                    <InputNumber id="stock_quantity" value={stockQuantity} onChange={(e) => setStockQuantity(e.value)} placeholder={t('stock_quantity')} />
                </div>
                <div className="field">
                    <InputNumber id="barcode" value={barcode} onChange={(e) => setBarcode(e.value)} placeholder={t('barcode')}  useGrouping={false} />
                </div>
            </Dialog>
        </div>

    );
}

const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id
    };
};

export default connect(mapStateToProps, null)((ProductsPage));