import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useTranslation } from 'react-i18next';
import { InputNumber } from 'primereact/inputnumber';
import { ServiceListService } from '../service/ServiceListService';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import {connect} from "react-redux";

const ServiceDurationsPage = (props) => {

    const { t, i18n } = useTranslation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const [serviceDurations, setServiceDurations] = useState(null);
    const serviceListService = new ServiceListService();

    useEffect(() => {
        serviceListService.getServiceListSmall(props.partnerId).then(data => { setServiceDurations(data); setLoading(false) });
    }, []);

    const onRowEditComplete = (e) => {
        let _serviceDurations = [...serviceDurations];
        let { newData, index } = e;
        let updateDto = { duration: newData.duration };
        serviceListService.updateServiceDuration(newData.id, updateDto)
            .then(data => { 
                _serviceDurations[index] = data; 
                setServiceDurations(_serviceDurations);
                toast.current.show({
                    severity:'success', 
                    summary: t('save_successed'),
                    detail: t('save_completed_successfully'), 
                    life: 3000
                })
            });
    }

    const textEditor = (options) => {
        return <InputNumber value={options.value} suffix={t('_min')} onValueChange={(e) => options.editorCallback(e.value)} />;
    }

    const onGlobalFilterChange = (event, filtersKey) => {
        const value = event.target.value;
        let filters = { ...filtersMap[filtersKey].value };
        filters['global'].value = value;

        filtersMap[filtersKey].callback(filters);
    }

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const filtersMap = {
        'filters': { value: filters, callback: setFilters },
    };

    const renderHeader = (filtersKey) => {
        const filters = filtersMap[`${filtersKey}`].value;

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={filters['global'].value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder={t('search')} />
            </span>
        );
    }

    const header = renderHeader('filters');

    return (

        <div className="card">
            <Toast ref={toast} />
            <div className="flex justify-content-start flex-wrap card-container col">
                <h2><b>{t('durations')}</b></h2>
            </div>

            <DataTable value={serviceDurations} header={header} editMode="row" dataKey="id" loading={loading} 
            onRowEditComplete={onRowEditComplete} filters={filters} onFilter={(e) => setFilters(e.filters)} responsiveLayout="scroll" >
                <Column field="name" header={t('service')} sortable filter></Column>
                <Column field="gender" header={t('service_gender')} sortable filter></Column>
                <Column field="duration" header={t('service_duration')} editor={(options) => textEditor(options)} sortable filter></Column>
                <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
            <br />
            
        </div>
    );
}

const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id
    };
};

export default connect(mapStateToProps, null)((ServiceDurationsPage));