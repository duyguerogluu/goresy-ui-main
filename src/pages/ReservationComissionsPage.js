
import React, { useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useTranslation } from 'react-i18next';
import {connect} from "react-redux";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Row} from "primereact/row";
import {ColumnGroup} from "primereact/columngroup";

const ReservationComissionsPage = (props) => {
    const { t } = useTranslation();

    const [selectedPackages, setSelectedPackages] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');


    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'serviceDate': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        'customer': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'price': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'commissionAmount': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'customerApproval': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'objectionStatus': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    });

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
                <h5 className="m-0">{t('booking_commissions')}</h5>
                <span className="p-input-icon-right">
                    <i className="pi pi-search"/>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t('search')}/>
                </span>
            </div>
        )
    }

    const header = renderHeader();

    let footerGroup = <ColumnGroup>
        <Row>
            <Column footer={t('total_commission_amount') + ": 0TL"} colSpan={7}/>
        </Row>
    </ColumnGroup>;

    return (
        <div className="datatable-doc-demo col-12">
            <div className="card">
                <DataTable value={[]} paginator rows={8} header={header} footerColumnGroup={footerGroup}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="id" rowHover selection={selectedPackages}
                    filters={filters} filterDisplay="menu" responsiveLayout="scroll"
                    globalFilterFields={['serviceDate', 'customer', 'price', 'commissionAmount', 'customerApproval', 'objectionStatus']}
                    currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                    <Column field="serviceDate" header={t('service_date')} sortable filter dataType="date"></Column>
                    <Column field="customer" header={t('customer')} sortable filter></Column>
                    <Column field="services" header={t('services')} sortable filter></Column>
                    <Column field="price" header={t('price')} sortable filter></Column>
                    <Column field="commissionAmount" header={t('commission_amount')} sortable filter></Column>
                    <Column field="customerApproval" header={t('customer_approval')} sortable filter></Column>
                    <Column field="objectionStatus" header={t('objection_status')} sortable filter></Column>
                </DataTable>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id
    };
};

export default connect(mapStateToProps, null)((ReservationComissionsPage));