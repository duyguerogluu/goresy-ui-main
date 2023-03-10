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
import './css/ChecksPage.css';
import {CheckService} from "../service/CheckService";
import {t} from "i18next";
import {Rating} from "primereact/rating";
import {SplitButton} from "primereact/splitbutton";
import {connect} from "react-redux";
import CustomChip from '../components/CustomChip';

class CheckPage extends Component {

    constructor(props) {

        super(props);

        this.state = {
            check: null,
            selectedChecks: [],
            filters: {
                'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
                'customerFullname': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                'customerPhoneNumber': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                'by': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
            },
            globalFilterValue: '',
            loading: false,
        
        };

        this.statuses = [
            'Onay Bekliyor', 'Onaylandı', 'İşlemde', 'Tamamlandı'
        ]

        this.checkServices = new CheckService();
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
        this.closeChecks = this.closeChecks.bind(this);
    }

    componentDidMount() {
        this.checkServices.getChecks(this.props.partnerId)
            .then(data => this.setState({ check: this.getCheck(data.content), loading: false}));
    }

    getCheck(data) {
        let checks = [];
        data.forEach(element => {
            let check = {};
            let totalCost = 0;
            element.services.forEach(service => {
                totalCost += service.price;
            });
            check.id = element.id;
            check.customerFullname = element.customerFullname;
            check.services = element.services;
            check.customerPhoneNumber = element.customerPhoneNumber;
            check.checkStatus = element.checkStatus;
            check.by = element.by;
            check.time = this.formatDate(new Date(element.time));
            check.startTime = this.formatTime(new Date(element.time));
            check.totalCost = totalCost;
            check.attend = element.attend;
            check.point = element.point;
            check.paidAmount = element.paidAmount;
            check.remainingAmount = totalCost - element.paidAmount;
            checks.push(check);
        });
        return checks;
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
                <h5 className="m-0">{t('checks')}</h5>
                <span className="p-input-icon-right">
                    <Button label={t('complete_without_payment') + " (" + this.state.selectedChecks.length + ")"} icon="pi pi-money-bill"
                            disabled={this.state.selectedChecks.length === 0} className="p-button-success" style={{marginRight: "10px"}} onClick={this.closeChecks}/>
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
        return <span className={`check-badge status-${rowData.checkStatus}`}>{t(rowData.checkStatus)}</span>;
    }

    attendBodyTemplate(rowData) {
        return <span className={`check-badge status-${rowData.attend}`}>{t(rowData.attend)}</span>;
    }

    statusFilterTemplate(options) {
        return <Dropdown value={options.value} options={this.statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={this.statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    }

    statusItemTemplate(option) {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }

    pointItemTemplate(rowData) {
        return <Rating value={rowData.point} readOnly stars={5} cancel={false} />
    }

    detailItemTemplate(rowData, history) {
        return <SplitButton label={t('detail')} onClick={(event) => {
            history.push({pathname:'/check-details-page/' + rowData.id});
        }} model={[
            {
                label: t('complete_without_payment'),
                icon: 'pi pi-money-bill',
                command: (event) => {
                    console.log(event)
                    //ToDo
                }
            },
            {
                label: t('cancel'),
                icon: 'pi pi-times',
                command: (event) => {
                    console.log(event)
                    //ToDo
                }
            },
        ]}/>
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
        this.setState({
            ...this.state,
            selectedChecks: event.value
        })
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    closeChecks() {
        // ToDo
    }
    
    render() {
        const header = this.renderHeader();
        const { t } = this.props;

        return (
            <div className="datatable-doc-demo">
                 <Toast ref={(el) => this.toast = el} />
                <div className="card">
                    <DataTable 
                        value={this.state.check} 
                        ref={(el) => this.dt = el} 
                        paginator 
                        className="p-datatable-check" 
                        header={header} 
                        rows={10}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[10,25,50]}
                        dataKey="id" 
                        rowHover 
                        selection={this.state.selectedChecks} 
                        onSelectionChange={this.onSelectionDetail}
                        filters={this.state.filters} 
                        filterDisplay="menu" 
                        responsiveLayout="scroll"
                        globalFilterFields={['customerFullname', 'customerPhoneNumber', 'by']} 
                        emptyMessage={t('no_customer_check_found')}
                        currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')} 
                        selectionMode="multiple" 
                        showSelectAll={false}
                    >
                        <Column selectionMode="multiple" hidden={false}></Column>
                        <Column field="checkStatus" header={t('status')} sortable body={this.statusBodyTemplate} filterElement={this.statusFilterTemplate}/>
                        <Column field="customerFullname" header={t('customer')} sortable filterPlaceholder="Search by name" />
                        {/*<Column field="customerPhoneNumber" header={t('phone')} sortable filterField="phone" filterPlaceholder="Search by phone" />*/}
                        <Column field="services" body={this.servicesBodyTemplate} header={t('services')} sortable sortField="services" filterField="services" />
                        <Column field="time" header={t('date')} sortable filterField="date" dataType="date" filterElement={this.dateFilterTemplate} />
                        <Column field="startTime" header={t('clock')} sortablefilter filterElement={this.hourFilterTemplate} />
                        <Column field="by" header={t('by')} sortable filterPlaceholder="Search by name" />
                        <Column field="attend" header={t('attend')} sortable body={this.attendBodyTemplate}/>
                        <Column field="point" header={t('point')} sortable body={this.pointItemTemplate} style={{minWidth:'10rem'}} />
                        <Column field="totalCost" header={t('total_cost')} sortable />
                        <Column field="paidAmount" header={t('paid_amount')} sortable />
                        <Column field="remainingAmount" header={t('remaining_amount')} sortable />
                        <Column body={(event) => this.detailItemTemplate(event, this.props.history)} />
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

export default connect(mapStateToProps, null)((withTranslation()(withRouter(CheckPage))));