import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { PackageService } from '../service/PackageService';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { ServiceListService } from '../service/ServiceListService';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import {connect} from "react-redux";

const PackagesPage = (props) => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const [packageList, setPackageList] = useState(null);
    const [newPackageDialog, setNewPackageDialog] = useState(false);
    const [updatePackageDialog, setUpdatePackageDialog] = useState(false);
    const [deletePackageDialog, setDeletePackageDialog] = useState(false);
    const [selectedPackageIndex, setSelectedPackageIndex] = useState(null);
    const [count, setCount] = useState(null);
    const [price, setPrice] = useState(null);
    const [type, setType] = useState(null);
    const [service, setService] = useState(null);
    const [serviceOptions, setServiceOptions] = useState(null);

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const filtersMap = {
        'filters': { value: filters, callback: setFilters },
    };

    const packageService = new PackageService();
    const serviceListService = new ServiceListService();

    useEffect(() => {
        packageService.getPackageList(props.partnerId).then(data => { setPackageList(data); setLoading(false) });
        serviceListService.getServiceList(props.partnerId).then(data => { setServiceOptions(data) });
    }, []);

    const typeOptions = [
        { label: t('session'), value: "session" },
        { label: t('minute'), value: "minute" },
    ];
    
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
            <Button style={{ marginRight: '.5rem' }} icon="pi pi-pencil" className="p-button-rounded" onClick={() => { setUpdatePackageDialog(true); setSelectedPackageIndex(info.rowIndex); setUpdateFields(info.rowIndex) }} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => { setDeletePackageDialog(true); setSelectedPackageIndex(info.rowIndex) }} />
        </div>;
    }

    const hideDialog = () => {
        setDeletePackageDialog(false);
        setNewPackageDialog(false);
        setUpdatePackageDialog(false);
    }

    const deletePackage = () => {
        packageService.deletePackage(packageList[selectedPackageIndex].id)
            .then(() => {
                let packages = [...packageList];
                packages.splice(selectedPackageIndex, 1)
                setPackageList(packages);
                setDeletePackageDialog(false);
            })
    }

    const addNewPackage = () => {
        let newPackage = {
            partnerId: props.partnerId,
            amount: count,
            packageUnit: type,
            price: price,
            serviceId: service
        };

        let packageListCopy = [...packageList];
        packageService.addPackage(newPackage).then((data) => {
            packageListCopy.push(data);
            setPackageList(packageListCopy);
            setNewPackageDialog(false);
            toast.current.show({
                severity:'success', 
                summary: t('save_successed'),
                detail: t('save_completed_successfully'), 
                life: 3000
            })
      });
    }

    const updatePackage = () => {
        let packageId = packageList[selectedPackageIndex].id;
        let updatedPackage = {
            partnerId: props.partnerId,
            amount: count,
            packageUnit: type,
            price: price,
            serviceId: service
        };
        let packages = [...packageList];

        packageService.updatePackage(packageId, updatedPackage).then((data) => {
            packages[selectedPackageIndex] = data;
            setPackageList(packages);
            setUpdatePackageDialog(false);
            toast.current.show({
                severity:'success', 
                summary: t('save_successed'),
                detail: t('save_completed_successfully'), 
                life: 3000
            })
        });
    }

    const setUpdateFields = (index) => {
        setCount(packageList[index].amount);
        setPrice(packageList[index].price);
        setType(packageList[index].packageUnit);
        setService(packageList[index].service.id)
    }

    const clearAllFields = () => {
        setCount(null);
        setPrice(null);
        setType(null);
        setService(null);
    }

    const onTypeChange = (e) => {
        setType(e.value);
    }

    const onServiceChange = (e) => {
        setService(e.value);
    }

    const deletePackageDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletePackage} />
        </React.Fragment>
    );

    const newPackageDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={addNewPackage} />
        </React.Fragment>
    );

    const updatePackageDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={updatePackage} />
        </React.Fragment>
    );

    const header1 = renderHeader('filters');

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <div className="grid">
                    <div className="flex justify-content-start flex-wrap card-container col">
                        <h2><b>{t('packages')}</b></h2>
                    </div>
                    <div className="flex justify-content-end flex-wrap card-container col">
                        <Button label={t('add_new_package')} icon="pi pi-plus" style={{ padding: '.45rem 1rem', marginBottom: "1rem", marginLeft: '1rem' }} className="p-button-success" onClick={() => { setNewPackageDialog(true); clearAllFields(); }} />
                    </div>
                </div>
                <DataTable paginator value={packageList} responsiveLayout="scroll" header={header1} filters={filters} onFilter={(e) => setFilters(e.filters)} rows={10} loading={loading}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}
                    currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                    <Column field="amount" header={t("count")} sortable filter></Column>
                    <Column field="packageUnit" header={t("type")} sortable body={(item) => <div>{t(item.packageUnit)}</div>}></Column>
                    <Column field="service.name" header={t("service")} sortable></Column>
                    <Column field="price" header={t("price")} sortable filter></Column>
                    <Column header="" body={deleteButtonTemplate}></Column>
                </DataTable>
            </div>
            <Dialog visible={deletePackageDialog} style={{ width: '450px' }} header={t('confirm')} modal footer={deletePackageDialogFooter} onHide={hideDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {<span>{t('confirm_delete')}</span>}
                </div>
            </Dialog>
            <Dialog visible={newPackageDialog} style={{ width: '450px' }} header={t('add_new_package')} modal className="p-fluid" footer={newPackageDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <InputNumber id="count" value={count} onChange={(e) => setCount(e.value)} required placeholder={t('count')} />
                </div>
                <div className="field">
                    <Dropdown value={type} options={typeOptions} onChange={onTypeChange} optionLabel="label" placeholder={t('type')} />
                </div>
                <div className="field">
                    <Dropdown value={service} options={serviceOptions} onChange={onServiceChange}  optionLabel="name" optionValue='id' placeholder={t('service')} />
                </div>
                <div className="field">
                    <InputNumber id="price" value={price} onChange={(e) => setPrice(e.value)} required placeholder={t('price')} suffix={" " + t('TL')} />
                </div>
            </Dialog>
            <Dialog visible={updatePackageDialog} style={{ width: '450px' }} header={t('update_package')} modal className="p-fluid" footer={updatePackageDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <InputText id="count" value={count} onChange={(e) => setCount(e.target.value)} required placeholder={t('count')} />
                </div>
                <div className="field">
                    <Dropdown value={type} options={typeOptions} onChange={onTypeChange} optionLabel="label" placeholder={t('type')} />
                </div>
                <div className="field">
                    <Dropdown value={service} options={serviceOptions} onChange={onServiceChange} optionLabel="name" optionValue='id' placeholder={t('service')} />
                </div>
                <div className="field">
                    <InputNumber id="price" value={price} onChange={(e) => setPrice(e.value)} required placeholder={t('price')} suffix={" " + t('TL')} />
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

export default connect(mapStateToProps, null)((PackagesPage));