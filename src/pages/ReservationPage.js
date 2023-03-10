import React, { Component } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Toast } from 'primereact/toast';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './css/ReservationPage.css';
import {AppointmentService} from "../service/AppointmentService";
import {connect} from "react-redux";
import CustomChip from '../components/CustomChip';

class ReservationPage extends Component {

    constructor(props) {

        super(props);

        this.state = {
            reservation: null,
            selectedReservations: null,
            filters: {
                'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
                'customerFullname': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                'customerPhoneNumber': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                'by': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
            },
            globalFilterValue: '',
            loading: false
        
        };

        this.statuses = [
            'Onay Bekliyor', 'Onaylandı', 'İşlemde', 'Tamamlandı'
        ]
        this.appointmentServices = new AppointmentService();
        this.onGlobalFilterChange = this.onGlobalFilterChange.bind(this);
        this.serviceFilterTemplate = this.serviceFilterTemplate.bind(this);
        this.dateBodyTemplate = this.dateBodyTemplate.bind(this);
        this.dateFilterTemplate = this.dateFilterTemplate.bind(this);
        this.hourFilterTemplate = this.hourFilterTemplate.bind(this);
        this.statusBodyTemplate = this.statusBodyTemplate.bind(this);
        this.statusFilterTemplate = this.statusFilterTemplate.bind(this);
        this.statusItemTemplate = this.statusItemTemplate.bind(this);
        this.activityFilterTemplate = this.activityFilterTemplate.bind(this);
        this.onSelectionDetail = this.onSelectionDetail.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
    }

    componentDidMount() {
        const today = new Date();

        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setHours(0);
        startDate.setMinutes(0);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23);
        endDate.setMinutes(59);

        this.appointmentServices.getAppointments(this.props.partnerId, startDate, endDate)
            .then(data => this.setState({ reservation: this.getReservation(data.content), loading: false}));
    }

    getReservation(data) {
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
            reservation.time = this.formatDate(new Date(element.time));
            reservation.startTime = this.formatTime(new Date(element.time));
            reservation.totalCost = totalCost;
            reservations.push(reservation);
        });
        return reservations;
    }

    formatDate(value) {
        return value.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    formatTime(value) {
        return value.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute :  '2-digit',
            hour12: false,
        });
    }

    onGlobalFilterChange(e) {
        const value = e.target.value;
        let filters = { ...this.state.filters };
        filters['global'].value = value;

        this.setState({ filters, globalFilterValue: value });
    }

    renderHeader() {
        const { t } = this.props;
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">{t('appointments')}</h5>
                <span className="p-input-icon-right">
                    <Button label={t('export')} icon="pi pi-download" className="p-button-help" style={{marginRight: "10px"}} onClick={this.exportCSV}/>
                    <InputText value={this.state.globalFilterValue} onChange={this.onGlobalFilterChange} placeholder={t('search')}/>
                </span>
            </div>
        )
    }

    serviceFilterTemplate(options) {
        return (
            <React.Fragment>
                <div className="mb-3 font-bold">Agent Picker</div>
                <MultiSelect value={options.value} options={this.services} itemTemplate={this.servicesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
            </React.Fragment>
        );
    }

    servicesItemTemplate(option) {
        return (
            <div className="p-multiselect-service-option">
                <span>{option}</span>
            </div>
        );
    }

    dateBodyTemplate(rowData) {
        return this.formatDate(rowData.date);
    }

    dateFilterTemplate(options) {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    }

    hourFilterTemplate(options) {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="hh:mm" mask="99:99" timeOnly hourFormat="24"/>
    }

    servicesBodyTemplate(rowData) {
        return rowData.services && rowData.services.length > 0 && rowData.services.map((data, i) => (
            <CustomChip 
                key={`${data.name}${i}`} 
                label={data.name}
            />
        ))
    }

    statusBodyTemplate(rowData) {
        const { t } = this.props;
        return <span className={`appointment-badge status-${rowData.appointmentStatus}`}>{t(rowData.appointmentStatus)}</span>;
    }

    statusFilterTemplate(options) {
        return <Dropdown value={options.value} options={this.statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={this.statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    }

    statusItemTemplate(option) {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }

    activityFilterTemplate(options) {
        return (
            <React.Fragment>
                <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </React.Fragment>
        )
    }

    onSelectionDetail(event){
        this.props.history.push({pathname:'/reservation-detail-page/' + event.value.id});
    }

    exportCSV() {
        this.dt.exportCSV();
    }
    
    render() {
        const header = this.renderHeader();
        const { t } = this.props;

        return (
            <div className="datatable-doc-demo">
                 <Toast ref={(el) => this.toast = el} />
                <div className="card">
                    <DataTable value={this.state.reservation} ref={(el) => this.dt = el} paginator className="p-datatable-reservation" header={header} rows={10}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                        dataKey="id" rowHover selection={this.state.selectedReservation} onSelectionChange={this.onSelectionDetail}
                        filters={this.state.filters} filterDisplay="menu" responsiveLayout="scroll"
                        globalFilterFields={['customerFullname', 'customerPhoneNumber', 'by']} emptyMessage={t('no_customer_reservation_found')}
                        currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                        <Column selectionMode="single" hidden={true}></Column>
                        <Column field="customerFullname" header={t('customer')} sortable filterPlaceholder="Search by name" />
                        <Column field="customerPhoneNumber" header={t('phone')} sortable filterField="phone" filterPlaceholder="Search by phone" />
                        <Column field="services" body={this.servicesBodyTemplate} header={t('services')} sortable sortField="services" filterField="services" />
                        <Column field="time" header={t('date')} sortable filterField="date" dataType="date" filterElement={this.dateFilterTemplate} />
                        <Column field="startTime" header={t('clock')} sortablefilter filterElement={this.hourFilterTemplate} />
                        <Column field="appointmentStatus" header={t('status')} sortable body={this.statusBodyTemplate} filterElement={this.statusFilterTemplate}/>
                        <Column field="by" header={t('by')} sortable filterPlaceholder="Search by name" />
                        <Column field="totalCost" header={t('total_cost')} sortable />
                    </DataTable>
                </div>  
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id
    };
};

export default connect(mapStateToProps, null)((withTranslation()(withRouter(ReservationPage))));