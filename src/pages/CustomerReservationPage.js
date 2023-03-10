import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { CustomerService } from '../service/CustomerService';
import { CustomerMenu } from '../components/CustomerMenu';
import {connect} from "react-redux";
import CustomChip from '../components/CustomChip';


const CustomerReservationPage = (props) => {
    const { t } = useTranslation();
    const [customerReservation, setCustomerReservation] = useState(null);
    // const [selectedCustomerReservation, setSelectedCustomerReservation] = useState(null);

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
    const [activeIndex] = useState(1);
    const dt = useRef(null);
    
    const customerService = new CustomerService();

    useEffect(() => {
        customerService.getCustomerReservation(props.partnerId, props.match.params.id).then(data => { setCustomerReservation(getReservation(data.content)); setLoading(false) });
    }, []); 

    // const getCustomerReservation = (data) => {
    //     return [...data || []].map(d => {
    //         d.date = new Date(d.date);
    //         return d;
    //     });
    // }

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
                <h5 className="m-0">{t('customer_reservations')}</h5>
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

    const onSelectionDetail = (e) => {
        history.push({pathname:'/reservation-detail-page/' + e.value.id})
    }

    const header = renderHeader();
    let history = useHistory();

    const getReservation = (data) => {
        let reservations = [];
        data.forEach(element => {
            let reservation = {};
            let totalCost = 0;
            element.services.forEach(service => {
                totalCost += service.price;
            });
            reservation.id = element.id;
            reservation.customerFullname = element.customerFullname;
            reservation.services = element.services;
            reservation.customerPhoneNumber = element.customerPhoneNumber;
            reservation.appointmentStatus = element.appointmentStatus;
            reservation.by = element.by;
            reservation.time = formatDate(new Date(element.time));
            reservation.startTime = formatTime(new Date(element.time));
            reservation.creationDate = formatDateAndTime(new Date(element.createdDate));
            reservation.totalCost = totalCost;
            reservations.push(reservation);
        });
        return reservations;
    }
    const servicesBodyTemplate=(rowData) => {
        return rowData.services && rowData.services.length > 0 && rowData.services.map((data, i) => (
            <CustomChip 
                key={`${data.name}${i}`} 
                label={data.name}
            />
        ))
    }

    const formatDate = (value) => {
        return value.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    const formatTime = (value) => {
        return value.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute :  '2-digit',
            hour12: false,
        });
    }

    const formatDateAndTime = (value) => {
        return value.toLocaleTimeString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute :  '2-digit',
            hour12: false,
        });
    }

    const statusBodyTemplate=(rowData)=>{
        return <span className={`appointment-badge status-${rowData.appointmentStatus}`}>{t(rowData.appointmentStatus)}</span>;
    }

    return (
        <div className="grid">
            <div className="col-12"> 
            <CustomerMenu activeIndex={activeIndex} customerId={props.match.params.id}/>
            </div>
            <div className="datatable-doc-demo col-12">
                <div className="card">
                    <DataTable 
                        value={customerReservation} 
                        ref={dt} 
                        paginator 
                        className="p-datatable-customers" 
                        header={header} 
                        rows={8}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[10,25,50]}
                        dataKey="id" 
                        rowHover 
                        selectionMode="single"
                        // selection={selectedCustomerReservation} 
                        onSelectionChange={onSelectionDetail}
                        filters={filters} 
                        filterDisplay="menu" 
                        loading={loading} 
                        responsiveLayout="scroll"
                        globalFilterFields={['name', 'phone', 'reservationCount', 'registerDate', 'lastAppointmentDate', 'rewardPoints', 'restriction' ]} 
                        emptyMessage={t('no_customer_reservation_found')}
                        currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}
                    >
                        {/* <Column selectionMode="single" headerStyle={{ width: '2rem' }}></Column> */}
                        <Column field="startTime" header={t('clock')} sortable/>
                        <Column field="time" header={t('date')} sortable dataType="date" />
                        <Column field="creationDate" header={t('creation_date')} sortable dataType="date"></Column>
                        <Column field="services" body={servicesBodyTemplate} header={t('services')} sortable sortField="services" filterField="services" />
                        <Column field="appointmentStatus" header={t('status')} sortable body={statusBodyTemplate}/>
                        <Column field="by" header={t('by')} sortable filterPlaceholder="Search by name" />
                        <Column field="totalCost" header={t('total_cost')} sortable />
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

export default connect(mapStateToProps, null)((CustomerReservationPage));