
import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { CustomerService } from '../service/CustomerService';
import NewCustomerDialogue from "./dialogues/NewCustomerDialogue";
import moment from 'moment'
import {connect} from "react-redux";

const CustomerPage = (props) => {
    const { t, i18n } = useTranslation();

    let emptyCustomer = {
        phone: null,
        email: null,
        dateOfBirth: null,
        fullName: null,
        partnerId: 0
    };

    const [customer, setCustomer] = useState(emptyCustomer);
    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [customerDialog, setCustomerDialog] = useState(false);
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

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);
    const dt = useRef(null);
    
    const customerService = new CustomerService();

    useEffect(() => {
        customerService.getCustomers(props.partnerId).then(data => { setCustomers(getCustomers(data)); setLoading(false) });
    }, []); 

    const getCustomers = (data) => {
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

    const addCustomer = () => {
        setCustomer(emptyCustomer);
        setSubmitted(false);
        setCustomerDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCustomerDialog(false);
    }

    const saveCustomer = () => {
        customerService.postCustomer(customer).then(); 
        let customersCopy = [...customers, customer];
        setCustomers(customersCopy);
        setSubmitted(true);
        setCustomerDialog(false);
    }
      
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _customer = {...customer};
        _customer[`${name}`] = val;
        _customer[`dateOfBirth`] =  moment().format(); 
        _customer[`partnerId`] = 402
        
        setCustomer(_customer);
    }

    const createdDateBodyTemplate = (rowData) => {
        if(rowData.createdDate!=null){
            return moment(rowData.createdDate).format('DD.MM.YYYY')
        }
        return ''
    }
    const lastAppointmentDateBodyTemplate = (rowData) => {
        if(rowData.lastAppointmentDate!=null){
            return moment(rowData.lastAppointmentDate).format('DD.MM.YYYY')
        }
        return ''
    }
    const statusBodyTemplate = (rowData) => {
        /*if(rowData.restriction != null){
            return <span className={`product-badge status-${rowData.restriction}`}>{rowData.restriction}</span>;
        }*/
        return rowData.restriction
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">{t('customers')}</h5>
                <span className="p-input-icon-right">
                    <i className="pi pi-add"/>
                    <Button label={t('add')} icon="pi pi-plus" className="p-button-success" onClick={addCustomer}/>
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

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const onSelectionDetail = (e) => {
        history.push({pathname:'/customer-details-page/' + e.value.id})
    }

    const header = renderHeader();
    let history = useHistory();

    const customerDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCustomer} />
        </React.Fragment>
    );

    return (
        <div className="datatable-doc-demo col-12">
            <div className="card">
                <DataTable value={customers} ref={dt} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={onSelectionDetail}
                    filters={filters} filterDisplay="menu" loading={loading} responsiveLayout="scroll" selectionMode="single"
                    globalFilterFields={['fullName', 'phone', 'reservationCount', 'createdDate', 'lastAppointmentDate', 'rewardPoints', 'restriction' ]} emptyMessage={t('no_customer_found')}
                    currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                    <Column field="fullName" header={t('customers')} sortable style={{ width: '13rem' }}></Column>
                    <Column field="phone" header={t('phone')} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="reservationCount" header={t('reservation_count')} sortable ></Column>
                    <Column field="createdDate" header={t('register_date')} body={createdDateBodyTemplate} sortable dataType="date"></Column>
                    <Column field="lastAppointmentDate" header={t('last_appointment_date')} body={lastAppointmentDateBodyTemplate} sortable dataType="date"></Column>
                    <Column field="rewardPoints" header={t('reward_points')} sortable></Column>
                    <Column field="restriction" header={t('restriction')} body={statusBodyTemplate} sortable></Column>
                </DataTable>
            </div>
            <NewCustomerDialogue visible={customerDialog} onHide={setCustomerDialog} />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id
    };
};

export default connect(mapStateToProps, null)((CustomerPage));