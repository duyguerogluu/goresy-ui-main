import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import { useTranslation } from 'react-i18next';
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {Panel} from "primereact/panel";
import {MultiSelect} from "primereact/multiselect";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Checkbox} from "primereact/checkbox";
import {ToggleButton} from "primereact/togglebutton";
import {EmployeeService} from "../service/EmployeeService";
import {ServiceListService} from "../service/ServiceListService";
import {CustomerService} from "../service/CustomerService";
import {CheckService} from "../service/CheckService";
import {Toast} from "primereact/toast";
import {SelectButton} from "primereact/selectbutton";
import {Rating} from "primereact/rating";

const CheckDetailsPage = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const [person, setPerson] = useState({});
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedServicesMap, setSelectedServicesMap] = useState({});
    const [date, setDate] = useState()
    const [customer, setCustomer] = useState({});
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [services, setServices] = useState([]);
    const [smsReminder, setSmsReminder] = useState(true);
    const [repetitive, setRepetitive] = useState(false);
    const [repetitionOption, setRepetitionOption] = useState();
    const [repetitionCount, setRepetitionCount] = useState();
    const [repetitionCountOptions, setRepetitionCountOptions] = useState([]);
    const [repetitionOptions, setRepetitionOptions] = useState([]);
    const [staff, setStaff] = useState([]);
    const [attendStatus, setAttendStatus] = useState('');
    const [point, setPoint] = useState(1);
    const attendStatuses = [
        {label: t('undefined'), value: 'undefined'},
        {label: t('attended'), value: 'attended'},
        {label: t('did_not_attend'), value: 'did_not_attend'}
    ]

    const checkService = new CheckService();
    const employeeService = new EmployeeService();
    const serviceListService = new ServiceListService();
    const customerService = new CustomerService();

    const convertSelectedServicesMap = (map) => {
        let newSelectedServices = [...selectedServices];
        newSelectedServices = newSelectedServices.filter(service => (service.person !== person));

        map[person.id].forEach(service => {
            newSelectedServices.push({
                id: service.id,
                person: person,
                service: service.label,
                serviceLabel: service.label + ' (' + person.name + ')',
                duration: service.duration,
                amount: service.price,
                join: false
            });

        })

        setSelectedServices(newSelectedServices);
    }

    const joinBodyTemplate = (rowData, row) => {
        if (row.rowIndex === 0) {
            return <div></div>
        }
        return <div style={{textAlign: 'center'}}>
            <Checkbox disabled={true} tooltip={t('check_to_join_services')} tooltipOptions={{showDelay: 300}} onChange={e => {
                let newSelectedServices = selectedServices;
                newSelectedServices[row.rowIndex].join = e.checked
                setSelectedServices(newSelectedServices);
                forceUpdate();
            }} checked={selectedServices[row.rowIndex].join} />
        </div>;
    }

    const durationBodyTemplate = (rowData, row) => {
        return (
            <div className="p-inputgroup">
                <InputText disabled={true} size={3} className="inputfield w-full" keyfilter={"pint"} value={selectedServices[row.rowIndex].duration}
                           onChange={(e) => {
                               let newSelectedServices = selectedServices;
                               selectedServices[row.rowIndex].duration = e.target.value;
                               setSelectedServices(newSelectedServices);

                               forceUpdate();
                           }} placeholder={t('time')}
                />
                <span className="p-inputgroup-addon">{t('min')}</span>
            </div>
        );
    }

    const amountBodyTemplate = (rowData, row) => {
        return (
            <div className="p-inputgroup">
                <InputText disabled={true} size={3} className="inputfield w-full" keyfilter={"pint"} value={selectedServices[row.rowIndex].amount}
                           onChange={(e) => {
                               let newSelectedServices = selectedServices;
                               selectedServices[row.rowIndex].amount = e.target.value;
                               setSelectedServices(newSelectedServices);

                               forceUpdate();
                           }} placeholder={t('amount')}
                />
                <span className="p-inputgroup-addon">₺</span>
            </div>
        );
    }

    const deleteBodyTemplate = (rowData, row) => {
        return (
            <Button className='p-button-danger p-button-icon-only' icon="pi pi-trash" onClick={() => {
                const deletedService = selectedServices[row.rowIndex];
                let newSelectedServices = [...selectedServices];
                newSelectedServices.splice(row.rowIndex, 1);
                setSelectedServices(newSelectedServices);

                let newSelectedServicesMap = {...selectedServicesMap};
                newSelectedServicesMap[deletedService.person.id] =
                    selectedServicesMap[deletedService.person.id]
                        .filter(item => item.label !== deletedService.service);
                setSelectedServicesMap(newSelectedServicesMap);
            }}/>
        );
    }

    const fillRepetitiveOptions = () => {
        setRepetitionOptions([
            {label: t('every_day'), value: 'every_day'},
            {label: t('every_x_prefix') + " 2 " + t('every_x_day_suffix'), value: 'every_2_days'},
            {label: t('every_x_prefix') + " 3 " + t('every_x_day_suffix'), value: 'every_3_days'},
            {label: t('every_x_prefix') + " 4 " + t('every_x_day_suffix'), value: 'every_4_days'},
            {label: t('every_x_prefix') + " 5 " + t('every_x_day_suffix'), value: 'every_5_days'},
            {label: t('every_week'), value: 'every_week'},
            {label: t('every_x_prefix') + " 2 " + t('every_x_week_suffix'), value: 'every_2_weeks'},
            {label: t('every_x_prefix') + " 3 " + t('every_x_week_suffix'), value: 'every_3_weeks'},
            {label: t('every_x_prefix') + " 4 " + t('every_x_week_suffix'), value: 'every_4_weeks'},
            {label: t('every_month'), value: 'every_month'},
            {label: t('every_x_prefix') + " 45 " + t('every_x_day_suffix'), value: 'every_45_days'},
            {label: t('every_x_prefix') + " 2 " + t('every_x_month_suffix'), value: 'every_2_months'},
            {label: t('every_x_prefix') + " 3 " + t('every_x_month_suffix'), value: 'every_3_months'},
            {label: t('every_x_prefix') + " 6 " + t('every_x_month_suffix'), value: 'every_6_months'}
        ]);

        let options = [];
        for (let i = 1; 52 >= i; i++) {
            options.push(i);
        }
        setRepetitionCountOptions(options);
    }

    useEffect(() => {
        fillRepetitiveOptions();
    }, [t]);

    useEffect(() => {

        checkService.getCheck(props.match.params.id)
            .then(data => {
                const fullName = data.customerFullname;

                setCustomerName(fullName)
                setCustomerPhone(data.customerPhoneNumber)
                setDate(new Date(data.time));
                setNotes(data.notes)
                setRepetitive(data.repetitive)
                setRepetitionOption(data.repetitionOption)
                setRepetitionCount(data.repetitionCount)
                setSmsReminder(data.smsReminder)
                setNotes(data.notes)
                setSelectedServices(data.services)
                setAttendStatus(data.attend)
                setPoint(data.point)

                customerService.getCustomersOfPartner(props.partner.id)
                    .then(data => {
                        data.content.forEach(customer => {
                            if(customer.fullName === fullName) {
                                setCustomer(customer);
                            }
                        })
                    })
            })

        employeeService.getEmployeeList(props.partner.id)
            .then((data) => {
                let newStaff = [];

                data.forEach(employee => {
                    newStaff.push({
                        label: employee.name,
                        ...employee
                    })
                })

                setStaff(newStaff)
            })

    }, []);


    return (
        <div className="grid p-fluid">
            <div className='col-12'>
                <h2><b>{t('check_details')}</b></h2>
            </div>
            <Toast ref={toast} />
            <div className='col-4'>
                <Button className="p-button-text" style={{fontWeight: "bold"}} label={customerName + " (" + customerPhone + ")"}
                        icon="pi pi-arrow-up-right" iconPos="right" onClick={() => {
                    props.history.push({pathname:'/customer-details-page/' + customer.id});
                }} />
            </div>
            <div className='col-2' style={{alignSelf: 'center', textAlign: 'center'}}>
                <Rating value={point} onChange={(e) => setPoint(e.value)} stars={5} />
            </div>
            <div className='col-6'>
                <Calendar value={date} disabled={true} onChange={(e) => setDate(e.value)} stepMinute={5} showTime  dateFormat="dd MM yy" showIcon placeholder={t('date')} style={{width: '100%'}}></Calendar>
            </div>
            <div className='col-6' >
                <InputText readOnly={true} className="inputfield w-full" value={notes} placeholder={t('notes')}/>
            </div>
            <div className='col-6'>
                <ToggleButton onLabel={t('sms_reminder')} offLabel={t('sms_reminder')} onIcon="pi pi-check" offIcon="pi pi-times"
                              checked={smsReminder} onChange={(e) => {}} />
            </div>
            <div className='col-6'>
                <SelectButton value={attendStatus} unselectable={false} options={attendStatuses} onChange={(e) => {e.value !== 'undefined' && setAttendStatus(e.value)}}/>
            </div>
            <div className='col-6'>
                <ToggleButton onLabel={t('repetitive')} offLabel={t('repetitive')} onIcon="pi pi-check" offIcon="pi pi-times"
                              checked={repetitive} onChange={(e) => {}} />
            </div>
            <div className='col-6' hidden={!repetitive}>
                <Dropdown value={repetitionOption} options={repetitionOptions} filter disabled={true}
                          onChange={e => {setRepetitionOption(e.target.value)}} placeholder={t('repetition_frequency')} className='inputfield w-full' />
            </div>
            <div className='col-6' hidden={!repetitive}>
                <Dropdown value={repetitionCount} options={repetitionCountOptions} filter disabled={true}
                          onChange={e => {setRepetitionCount(e.target.value)}} placeholder={t('repetition_count')} className='inputfield w-full' />
            </div>
            <div className='col-12'>
                <Panel header={t('services')}>
                    <div className="grid p-fluid">
                        <div className='col-6' hidden={true}>
                            <Dropdown value={person} options={staff} filter tooltip={t('select_another_employee')}
                                      tooltipOptions={{showDelay: 500}} onChange={e => {
                                const employee = e.target.value;
                                setPerson(employee);
                                serviceListService.getServicesOfEmployee(employee.id)
                                    .then(data => {
                                        let newServices = [];

                                        data.forEach(service => {
                                            newServices.push({
                                                label: service.name,
                                                ...service,
                                                duration: service.duration || 0,
                                                amount: service.amount || 0
                                            })
                                        });
                                        setServices(newServices);
                                    })
                            }} placeholder={t('employee')} className='inputfield w-full' />
                        </div>
                        <div className='col-6' hidden={true}>
                            <MultiSelect filter showSelectAll={false} value={selectedServicesMap[person.id]}
                                         options={services} onChange={(e) =>{
                                let newSelectedServicesMap = {...selectedServicesMap};
                                newSelectedServicesMap[person.id] = e.target.value;
                                setSelectedServicesMap(newSelectedServicesMap);
                                convertSelectedServicesMap(newSelectedServicesMap);
                            }} placeholder={t('services')} maxSelectedLabels={3} />
                        </div>
                        <div className='col-12' hidden={selectedServices.length < 1}>
                            <DataTable value={selectedServices} size="small" onRowReorder={(e) => setSelectedServices(e.value)} responsiveLayout="scroll">
                                {/*<Column rowReorder style={{width: '3em'}} />*/}
                                <Column field="serviceLabel" header={t('service')}></Column>
                                <Column field="duration" header={t('time')} body={durationBodyTemplate}></Column>
                                <Column field="amount" header={t('amount')} body={amountBodyTemplate}></Column>
                                <Column field="join" header={t('join')} body={joinBodyTemplate}></Column>
                                {/*<Column style={{width: '3em'}} body={deleteBodyTemplate}></Column>*/}
                            </DataTable>
                        </div>
                    </div>
                </Panel>
            </div>
            <div className='col-12'>
                <Button label={t('save')} className="p-button-success" onClick={() => {
                    //ToDo

                    // checkService.updateCheckAttendStatus(props.match.params.id, attendStatus)
                    //     .then(() => {
                    //         props.history.push({pathname:'/check-page'});
                    //     })
                }}/>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        partner: state.auth.userDetails.partner
    };
};

export default connect(mapStateToProps, null)((CheckDetailsPage));

