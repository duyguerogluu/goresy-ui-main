import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { CustomerService } from '../service/CustomerService';
import { useLocation } from 'react-router-dom';
import moment from "moment";
import { CustomerMenu } from '../components/CustomerMenu';
import {connect} from "react-redux";


const CustomerDebts = (props) => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [customerDebts, setCustomerDebts] = useState(null);

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'phone': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        'lastAppointmentDate': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        'reservationCount': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'rewardPoints': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'restriction': { value: null, matchMode: FilterMatchMode.BETWEEN }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(5);
    const dt = useRef(null);
    
    const customerService = new CustomerService();

    useEffect(() => {
        customerService.getCustomerDebts(props.partnerId, props.match.params.id).then(data => { setCustomerDebts(getCustomerDebts(data.content)); setLoading(false) });
    }, []); 

    const getCustomerDebts = (data) => {
        return [...data || []].map(d => {
            d.date = new Date(d.date);
            return d;
        });

    }

    const dateBodyTemplate = (date) => {
        return moment(date).format('DD/MM/YYYY')
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">{t('customer_debts')}</h5>
                <span className="p-input-icon-right">
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

    const header = renderHeader();
    let history = useHistory();


    return (
        <div className="grid">
            <div className="col-12"> 
            <CustomerMenu activeIndex={activeIndex} customerId={props.match.params.id}/>
            </div>
            <div className="datatable-doc-demo col-12">
                <div className="card">
                    <DataTable value={customerDebts} ref={dt} paginator className="p-datatable-customers" header={header} rows={8}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                        dataKey="id" rowHover
                        filters={filters} filterDisplay="menu" loading={loading} responsiveLayout="scroll"
                        globalFilterFields={['name', 'phone', 'reservationCount', 'registerDate', 'lastAppointmentDate', 'rewardPoints', 'restriction' ]} emptyMessage={t('no_customer_product_sales')}
                        currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                        <Column field="type" header={t('type')} sortable filter dataType="type"></Column>
                        <Column field="dueDate" header={t('planned_payment_date')} sortable body={dateBodyTemplate()}  dataType="date"></Column>
                        <Column field="totalAmount" header={t('amount')} sortable dataType="amount"></Column>
                        <Column field="createdDate" header={t('creation_date')} sortable body={dateBodyTemplate()} dataType="date"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id
    };
};

export default connect(mapStateToProps, null)((CustomerDebts));