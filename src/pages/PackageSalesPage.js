
import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { PackageService } from '../service/PackageService';
import {connect} from "react-redux";
import NewPackageSaleDialogue from "./dialogues/NewPackageSaleDialogue";

const PackageSalesPage = (props) => {
    const { t, i18n } = useTranslation();

    let emptyPackageSale = {
        id: null,
        name: '',
        phone: null,
        email: null,
        birthDate: null,
        registerDate: null,
        reservationCount: 0
    };

    const [packageSale, setPackage] = useState(emptyPackageSale);
    const [packageSales, setPackages] = useState(null);
    const [selectedPackages, setSelectedPackages] = useState(null);
    const [deletePackageDialog, setDeletePackageDialog] = useState(false);
    const [newPackageSaleDialogue, setNewPackageSaleDialogue] = useState(false);

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

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const dt = useRef(null);
    
    const packageSaleService = new PackageService();

    useEffect(() => {
        packageSaleService.getPackageSaleList(props.partnerId)
            .then(data => {
                data.forEach(sale => {
                    sale.saleDate = new Date(sale.saleDate).toLocaleDateString();
                })

                setPackages(data)
            })
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const confirmDeletePackage = (packageSale) => {
        setPackage(packageSale);
        setDeletePackageDialog(true);
    }

    const deletePackage = () => {
        let _packageSales = packageSales.filter(val => val.id !== packageSale.id);
        setPackages(_packageSales);
        setDeletePackageDialog(false);
        setPackage(emptyPackageSale);
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const onSelectionDetail = (e) => {
        setSelectedPackages(e.value)
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">{t('package_sales')}</h5>
                <span className="p-input-icon-right">
                    <i className="pi pi-add"/>
                    <Button label={t('add')} icon="pi pi-plus" className="p-button-success" onClick={() => {
                        setNewPackageSaleDialogue(true);
                    }}/>
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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => {

                }} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePackage(rowData)} />
            </React.Fragment>
        );
    }

    const deletePackageDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => {setDeletePackageDialog(false)}} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletePackage} />
        </React.Fragment>
    );

    return (
        <div className="datatable-doc-demo col-12">
            <NewPackageSaleDialogue visible={newPackageSaleDialogue} onHide={setNewPackageSaleDialogue} />
            <div className="card">
                <DataTable value={packageSales} ref={dt} paginator className="p-datatable-packageSales" header={header} rows={8}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="id" rowHover selection={selectedPackages} onSelectionChange={onSelectionDetail}
                    filters={filters} filterDisplay="menu" loading={loading} responsiveLayout="scroll"
                    globalFilterFields={['name', 'phone', 'reservationCount', 'registerDate', 'lastAppointmentDate', 'rewardPoints', 'restriction' ]} emptyMessage={t('no_package_sale_found')}
                    currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                    <Column field="clientName" header={t('name_surname')} sortable filter dataType="count"></Column>
                    <Column field="sellerName" header={t('seller_name')} sortable filter dataType="count"></Column>
                    <Column field="saleDate" header={t('sale_date')} sortable filter dataType="date"></Column>
                    <Column field="totalAmount" header={t('total_amount')} sortable filter dataType="totalAmount"></Column>
                    <Column field="paidAmount" header={t('paid_amount')} sortable filter dataType="paidAmount"></Column>
                    <Column field="unpaidAmount" header={t('unpaid_amount')} sortable filter dataType="unpaidAmount"></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={deletePackageDialog} style={{ width: '450px' }} header={t('confirm')} modal footer={deletePackageDialogFooter} onHide={() => {setDeletePackageDialog(false)}}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {packageSale && <span>{t('confirm_delete')}</span>}
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

export default connect(mapStateToProps, null)((PackageSalesPage));