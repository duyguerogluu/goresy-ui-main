import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useHistory } from "react-router-dom";
import { ServiceListService } from '../service/ServiceListService';
import { ServiceCategoryService } from '../service/ServiceCategoryService';
import { EmployeeService } from '../service/EmployeeService';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import {Toast} from "primereact/toast";
import {connect} from "react-redux";

const ServicesPage = (props) => {
    const { t } = useTranslation();
    const toast = useRef(null);

    const [serviceList, setServiceList] = useState(null);
    const [newServiceDialog, setNewServiceDialog] = useState(false);
    const [deleteServiceDialog, setDeleteServiceDialog] = useState(false);
    const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
    const [newServiceTitle, setNewServiceTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [duration, setDuration] = useState(0);
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);

    const genders = [
        {label:t("women"), value:"women"},
        {label:t("men"), value:"men"},
        {label:t("women_and_men"), value:"women_and_men"}
    ];

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const filtersMap = {
        'filters': { value: filters, callback: setFilters },
    };

    const serviceListService = new ServiceListService();
    const serviceCategoryService = new ServiceCategoryService();

    useEffect(() => {
        serviceListService.getServiceListSmall(props.partnerId).then(data => { setServiceList(data) });
        serviceCategoryService.getServiceCategoryList(props.partnerId).then(data => { setCategories(data); setLoading(false)});
    }, []);

    const onGlobalFilterChange = (event, filtersKey) => {
        const value = event.target.value;
        let filters = { ...filtersMap[filtersKey].value };
        filters['global'].value = value;

        filtersMap[filtersKey].callback(filters);
    }
    const onGenderChange = (e) => {
        setSelectedGender(e.value);
    }

    const onCategoryChange = (e) => {
        setSelectedCategory(e.value);
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
        return <div className="flex justify-content-end"><Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => { setDeleteServiceDialog(true); setSelectedServiceIndex(info.rowIndex) }} />
        </div>;
    }

    const onSelectedEmployeesChange = (e, index) => {
        let serviceListCopy = [...serviceList];
        serviceListCopy[index].selectedEmployees = e.value
        serviceListService.updateService(serviceListCopy[index].id, serviceListCopy[index])
            .then(data => {
                setServiceList(serviceListCopy);
                toast.current.show({
                    severity: 'success',
                    summary: t('save_successed'),
                    detail: t('save_completed_successfully'),
                    life: 3000
                });
            });
    }

    const offeredByBodyTemplate = (rowData, info) => {
        return <div>
            <MultiSelect value={serviceList[info.rowIndex].selectedEmployees} options={rowData.employees} onChange={(e) => onSelectedEmployeesChange(e, info.rowIndex)} optionLabel="label" placeholder={t('select_an_employee')} display="chip" />
        </div>;
    }

    const hideDialog = () => {
        setDeleteServiceDialog(false);
        setNewServiceDialog(false);
    }

    const deleteService = () => {
        setLoading(true);
        let services = [...serviceList];
        serviceListService.deleteService(services[selectedServiceIndex].id)
        .then(data=>{setServiceList(services); setLoading(false);setDeleteServiceDialog(false);});
        services.splice(selectedServiceIndex, 1);
    }

    const addNewService = () => {
        let newService = {
            partnerId: props.partnerId,
            name: newServiceTitle,
            selectedEmployees: [],
            categoryId: selectedCategory,
            gender: selectedGender,
            duration: duration
        };
        serviceListService.createService(newService)
        .then(data => {
            let serviceListCopy = [...serviceList, data];
            setServiceList(serviceListCopy);
            setNewServiceDialog(false);
            setNewServiceTitle('');
            setSelectedCategory(null);
            setSelectedGender(null);
            setDuration(0);
            setCategories(null);
        });
    }

    const deleteServiceDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteService} />
        </React.Fragment>
    );

    const newServiceDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={addNewService} />
        </React.Fragment>
    );

    const header1 = renderHeader('filters');
    let history = useHistory();

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <div className="grid">
                    <div className="flex justify-content-start flex-wrap card-container col">
                        <h2><b>{t('services')}</b></h2>
                    </div>
                    <div className="flex justify-content-end flex-wrap card-container col">
                        <Button label={t('add_new_service')} icon="pi pi-plus" style={{ padding: '.45rem 1rem', marginBottom: "1rem", marginLeft: '1rem' }} className="p-button-success" onClick={() => setNewServiceDialog(true)} />
                    </div>
                </div>
                <DataTable paginator value={serviceList} responsiveLayout="scroll" header={header1} filters={filters} onFilter={(e) => setFilters(e.filters)} rows={20}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[20, 50, 100]} 
                    loading={loading}  emptyMessage={t('no_records_found')} currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                    <Column field="name" header={t('service')} sortable filter></Column>
                    <Column header={t("offered_by")} body={offeredByBodyTemplate} ></Column>
                    <Column header="" body={deleteButtonTemplate}></Column>
                </DataTable>
            </div>
            <Dialog visible={deleteServiceDialog} style={{ width: '450px' }} header={t('confirm')} modal footer={deleteServiceDialogFooter} onHide={hideDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {<span>{t('confirm_delete')}</span>}
                </div>
            </Dialog>
            <Dialog visible={newServiceDialog} style={{ width: '450px' }} header={t('add_new_service')} modal className="p-fluid" footer={newServiceDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <InputText id="name" value={newServiceTitle} onChange={(e) => setNewServiceTitle(e.target.value)} required autoFocus placeholder={t('service_title')} />
                </div>
                <div className="field">
                    <Dropdown value={selectedCategory} options={categories} onChange={onCategoryChange} optionLabel="name" optionValue='id' placeholder={t('select_a_category')} />
                </div>
                <div className="field">
                    <Dropdown value={selectedGender} options={genders} onChange={onGenderChange} optionLabel="label" optionValue='value' placeholder={t('select_a_gender')} />
                </div>
                <div className="field">
                    <InputNumber id="duration" value={duration} onChange={(e) => setDuration(e.value)} required placeholder={t('service_duration')} suffix={" " + t('min')} />
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

export default connect(mapStateToProps, null)((ServicesPage));