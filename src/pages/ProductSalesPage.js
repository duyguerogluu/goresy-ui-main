
import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProductSaleService } from '../service/ProductSaleService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import {connect} from "react-redux";
import moment from 'moment';


const ProductSalesPage = (props) => {
    const { t, i18n } = useTranslation();

    let emptyProductSale = {
        id: null,
        name: '',
        phone: null,
        email: null,
        birthDate: null,
        registerDate: null,
        reservationCount: 0
    };

    const [product, setProduct] = useState(emptyProductSale);
    const [products, setProducts] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [productDetailDialog, setProductDetailDialog] = useState(false);
    const [notes, setNotes] = useState('');
    const [clientName, setClientName] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [addSelectedClock, setSelectedClock] = useState('');
    const [addSelectedCost, setSelectedCost] = useState('');
    const [addSelectedCount, setSelectedCount] = useState('');
    const [selectedProductName, setSelectedProductName] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'phone': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'registerDate': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        'lastAppointmentDate': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        'reservationCount': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'rewardPoints': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'restriction': { value: null, matchMode: FilterMatchMode.BETWEEN }
    });

    const productNames = [
        { label: 'Keratin Şampuanı', value: 'Keratin Şampuan' },
        { label: 'Bakım Şampuanı', value: 'Bakım Şampuanı' },
        { label: 'Saç Maskesi', value: 'Saç Maskesi' },
        { label: 'Tuzsuz Şampuan Sandra', value: 'Tuzsuz Şampuan Sandra' },
    ];

    const paymentMethods = [
        { label: 'Nakit', value: 'Nakit' },
        { label: 'Kredi Kartı', value: 'Kredi Kartı' }
    ];

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    
    const productSaleService = new ProductSaleService();

    useEffect(() => {
        productSaleService.getProductSale(props.partnerId).then(data => { setProducts(getProducts(data.content)); setLoading(false) });
    }, []); 

    const getProducts = (data) => {
        return [...data || []].map(d => {
            d.date = new Date(d.date);
            return d;
        });
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const onProductNameChange = (e) => {
        setSelectedProductName(e.value);
    }

    const addProduct = () => {
        setProduct(emptyProductSale);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setProductDetailDialog(false);
        setDeleteProductDialog(false);
    }

    const saveProductSale = () => {
        let emptyProductSale = {
            clientName: clientName,
            sellerName: sellerName,
            product: selectedProductName,
            count: addSelectedCount,
            cost: addSelectedCost,
            notes: notes
        }
        let productSaleCopy = [...products, emptyProductSale];
        setProducts(productSaleCopy);
        hideDialog();
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = {...product};
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {
        let _products = products.filter(val => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProductSale);
    }

    const editProduct = (product) => {
        setProduct({...product});
        setProductDialog(true);
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const onSelectionDetail = (e) => {
        setSelectedProducts(e.value)
        setProductDialog(true);
    }

    const saleDateBodyTemplate = (rowData) => {
        if(rowData.saleDate!=null){
            return moment(rowData.saleDate).format('DD.MM.YYYY HH:mm')
        }
        return ''
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">{t('product_sales')}</h5>
                <span className="p-input-icon-right">
                    <i className="pi pi-add"/>
                    <Button label={t('add')} icon="pi pi-plus" className="p-button-success" onClick={addProduct}/>
                    <span> </span> 
                    <i className="pi pi-export"/>
                    <Button label={t('export')} icon="pi pi-upload" className="p-button-help" onClick={exportCSV}/>
                    <span> </span>  
                    <i className="pi pi-search"/>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t('search')}/>
                </span>
            </div>
        )
    }

    const header = renderHeader();
    let history = useHistory();

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProductSale} />
        </React.Fragment>
    );

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );

    return (
        <div className="datatable-doc-demo col-12">
            <div className="card">
                <DataTable value={products} ref={dt} paginator className="p-datatable-products" header={header} rows={8}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="id" rowHover selection={selectedProducts} onSelectionChange={onSelectionDetail}
                    filters={filters} filterDisplay="menu" loading={loading} responsiveLayout="scroll"
                    globalFilterFields={['name', 'phone', 'reservationCount', 'registerDate', 'lastAppointmentDate', 'rewardPoints', 'restriction' ]} emptyMessage={t('no_product_found')}
                    currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                    <Column field="saleDate" header={t('sale_date')} sortable dataType="date" body={saleDateBodyTemplate}></Column>
                    <Column field="clientName" header={t('name_surname')} sortable filter dataType="count"></Column>
                    <Column field="title" header={t('product')} sortable filter dataType="title"></Column>
                    <Column field="totalAmount" header={t('cost')} sortable></Column>
                    <Column field="count" header={t('count')} sortable filter dataType="count"></Column>
                    <Column field="sellerName" header={t('seller_name')} sortable filter dataType="count"></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={productDialog} style={{ width: '600px' }} header={t('add_product_sale')} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className='grid' style={{ marginTop: '.5rem' }}>
                    <div className="col-12">
                        <Calendar id="date" value={addSelectedClock} onChange={(e) => setSelectedClock(e.value)} dateFormat="dd/mm/yy" showIcon placeholder={t('date')} />
                    </div>
                    <div className='col-12'>
                        <InputText className='inputfield w-full' value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={t('customer_name_surname')} />
                    </div>
                    <div className="grid col-12">
                        <div className='col-4'>
                            <Dropdown className='inputfield w-full' value={selectedProductName} options={productNames} onChange={onProductNameChange} optionLabel="label" placeholder={t('product')} />
                        </div>
                        <div className="col-1" style={{ marginTop: '.65rem' }}>
                            <label htmlFor="cost">{t('cost')}</label>
                        </div>
                        <div className="col-3">
                            <InputNumber inputId="currency-turkey" value={addSelectedCost} onValueChange={(e) => setSelectedCost(e.value)} mode="currency" currency="TRY" />
                        </div>
                        <div className="col-1" style={{ marginTop: '.65rem' }}>
                            <label htmlFor="cost">{t('count')}</label>
                        </div>
                        <div className="col-3">
                            <InputNumber inputId="horizontal" value={addSelectedCount} onValueChange={(e) => setSelectedCount(e.value)} showButtons buttonLayout="horizontal" step={1}
                                decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
                        </div>
                    </div>
                    <div className='col-12'>
                        <Dropdown className='inputfield w-full' value={selectedPaymentMethod} options={paymentMethods} onChange={(e) => setSelectedPaymentMethod(e.target.value)} optionLabel="label" placeholder={t('payment_method')} />
                    </div>
                    <div className='col-12'>
                        <InputText className='inputfield w-full' value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder={t('seller_name')} />
                    </div>
                    <div className='col-12'>
                        <InputTextarea className='inputfield w-full' value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notes')} />
                    </div>
                </div>    
            </Dialog>
            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header={t('confirm')} modal footer={deleteProductDialogFooter} onHide={hideDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>{t('confirm_delete')}</span>}
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

export default connect(mapStateToProps, null)((ProductSalesPage));
