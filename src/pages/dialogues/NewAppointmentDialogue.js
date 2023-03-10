import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";
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
import {TabPanel, TabView} from "primereact/tabview";
import {EmployeeService} from "../../service/EmployeeService";
import {ServiceListService} from "../../service/ServiceListService";
import {AutoComplete} from "primereact/autocomplete";
import {CustomerService} from "../../service/CustomerService";
import {AppointmentService} from "../../service/AppointmentService";
import {Toast} from "primereact/toast";
import NewCustomerDialogue from "./NewCustomerDialogue";

import * as actions from "../../store/actions";


const NewAppointmentDialogue = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const [newCustomerDialogue, setNewCustomerDialogue] = useState(false);
    const [person, setPerson] = useState({});
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedServicesMap, setSelectedServicesMap] = useState({});
    const [date, setDate] = useState(new Date())
    const [customer, setCustomer] = useState("");
    const [notes, setNotes] = useState("");
    const [services, setServices] = useState([]);
    const [smsReminder, setSmsReminder] = useState(true);
    const [repetitive, setRepetitive] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [repetitionOption, setRepetitionOption] = useState();
    const [repetitionCount, setRepetitionCount] = useState();
    const [repetitionCountOptions, setRepetitionCountOptions] = useState([]);
    const [repetitionOptions, setRepetitionOptions] = useState([]);

    const [employee, setEmployee] = useState();
    const [offHourDate, setOffHourDate] = useState(new Date())
    const [offHourBeginning, setOffHourBeginning] = useState(new Date())
    const [offHourEnding, setOffHourEnding] = useState(new Date())
    const [allDay, setAllDay] = useState(false);
    const [offHourRepetitive, setOffHourRepetitive] = useState(false);
    const [offHourNotes, setOffHourNotes] = useState("");
    const [offHourRepetitionOption, setOffHourRepetitionOption] = useState();
    const [offHourRepetitionCount, setOffHourRepetitionCount] = useState();
    const [staff, setStaff] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [newCustomerName, setNewCustomerName] = useState("");

    const appointmentService = new AppointmentService();
    const customerService = new CustomerService();
    const employeeService = new EmployeeService();
    const serviceListService = new ServiceListService();

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
            <Checkbox tooltip={t('check_to_join_services')} tooltipOptions={{showDelay: 300}} onChange={e => {
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
                <InputText size={3} className="inputfield w-full" keyfilter={"pint"} value={selectedServices[row.rowIndex].duration}
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
                <InputText size={3} className="inputfield w-full" keyfilter={"pint"} value={selectedServices[row.rowIndex].amount}
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

    const searchCustomer = (event) => {
        customerService.getCustomersOfPartner(props.partner.id, event.query).then(data => {
            let filteredCustomers = data.content ? [...data.content] : [];
            filteredCustomers.push({
                newCustomer: true,
                newCustomerName: event.query
            });

            setFilteredCustomers(filteredCustomers)
        })
    }

    const handleOnHideDialog = () => {
        setActiveIndex(0)
        
        setCustomer("")
        setDate(new Date())
        setNotes("")
        setSmsReminder(true)
        setRepetitive(false)
        setPerson({})
        setSelectedServices([])
        setSelectedServicesMap({})
        setOffHourDate(new Date())
        setAllDay(false)
        setOffHourBeginning(new Date())
        setOffHourEnding(new Date())

        if (props.onHide) {
            props.onHide(false)
        }
    }

    useEffect(() => {
        fillRepetitiveOptions();
    }, [t]);

    useEffect(() => {
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

    useEffect(() => {
        if (props.start) {
            setDate(props.start);
            setOffHourBeginning(props.start);
            setOffHourDate(props.start);
        }
    }, [props.start]);

    useEffect(() => {
        if (props.end) {
            setOffHourEnding(props.end);
        }
    }, [props.end]);

    useEffect(() => {
        if (props.employeeId) {
            setEmployee(staff.find(employee => employee.id === props.employeeId))
        }
    }, [props.employeeId]);

    const itemTemplate = (item) => {
        if (item.newCustomer) {
            return (
                <div className='p-clearfix' style={{fontWeight: 'bold', color: 'var(--primary-color)'}}>
                    {'+ ' + t('save_new_customer')}
                </div>
            );
        }

        return (
			<div className='p-clearfix'>
				{item.fullName} - {item.phone}
			</div>
		);
    } 

    const handleSaveNewAppointment = () => {
        let selectedServicesResult = [];

        selectedServices.forEach(service => {
            selectedServicesResult.push({
                amount: service.amount,
                duration: service.duration,
                rowOrder: 1,
                join: service.join,
                service: service.service,
                serviceLabel: service.serviceLabel,
                employeeId: service.person.id,
                serviceId: service.id
            })
        })

        if(selectedServicesResult.length > 0) {
            selectedServicesResult[0].join = false;
        }

        appointmentService.postAppointment({
            by: 'partner',
            customerId: customer.id,
            partnerId: props.partner.id,
            phoneNumber: props.partner.telephone,
            time: date,
            smsReminder: smsReminder,
            repetitive: repetitive,
            repetitionOption: repetitionOption,
            repetitionCount: repetitionCount,
            notes: notes,
            services: selectedServicesResult
        }).then((response) => {
            props.changeAppointments([...props.appointments, {
                ...response,
                start: new Date(response.startTime),
                end: new Date(response.endTime),
            }]);
            handleOnHideDialog()
        }).catch(() => {
            toast.current.show({
                severity: 'error',
                summary: t('save_fail'),
                detail: t('new_appointment_save_fail')
            });
        });
    }

    const handleSaveNewSetoffHour = () => {
        appointmentService.postOffHour({
            partnerId: props.partner.id,
            employeeId: employee && employee.id,
            date: offHourDate,
            allDay: allDay,
            startTime: offHourBeginning,
            endTime: offHourEnding,
            repetitive: offHourRepetitive,
            repetitionOption: offHourRepetitionOption,
            repetitionCount: offHourRepetitionCount,
            notes: offHourNotes
        }).then((data) => {
            props.changeAppointments([...props.appointments, {
                ...data,
                title: t('off_hour'),
                start: offHourBeginning,
                end: offHourEnding,
                resourceId: employee && employee.id,
                isOffHour: true
            }]);
            handleOnHideDialog()
        }).catch(() => {
            toast.current.show({
                severity: 'error',
                summary: t('save_fail'),
                detail: t('off_hour_save_fail')
            });
        });
    }

    return (
        <Dialog 
            header={t('new_appointment')} 
            visible={props.visible} 
            resizable={false} 
            draggable={false} 
            dismissableMask={true} 
            style={{ width: '900px' }} 
            onHide={handleOnHideDialog}
        >
            <NewCustomerDialogue visible={newCustomerDialogue} onHide={setNewCustomerDialogue} customerName={newCustomerName} />
            <Toast ref={toast} />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header={t('new_appointment')}>
                    <div className="grid p-fluid">
                        <div className='col-6'>
                            <AutoComplete
                                delay={500} minLength={3} value={customer} suggestions={filteredCustomers} field="fullName"
                                completeMethod={searchCustomer}  aria-label={t('person')} itemTemplate={itemTemplate}
                                onChange={(e) => {
                                    if (e.value.newCustomer) {
                                        setNewCustomerName(e.value.newCustomerName)
                                        setNewCustomerDialogue(true);
                                    } else {
                                        setCustomer(e.value);
                                    }
                                }} placeholder={t('customer')}
                            />
                        </div>
                        <div className='col-6'>
                            <Calendar value={date} stepMinute={5} onChange={(e) => setDate(e.value)} showTime  dateFormat="dd MM yy" showIcon placeholder={t('date')} style={{width: '100%'}}></Calendar>
                        </div>
                        <div className='col-12'>
                            <InputText className="inputfield w-full" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notes')} />
                        </div>
                        <div className='col-12'>
                            <ToggleButton onLabel={t('sms_reminder')} offLabel={t('sms_reminder')} onIcon="pi pi-check" offIcon="pi pi-times"
                                          checked={smsReminder} onChange={(e) => setSmsReminder(e.value)} />
                        </div>
                        <div className='col-12'>
                            <ToggleButton onLabel={t('repetitive')} offLabel={t('repetitive')} onIcon="pi pi-check" offIcon="pi pi-times"
                                          checked={repetitive} onChange={(e) => setRepetitive(e.value)} />
                        </div>
                        <div className='col-6' hidden={!repetitive}>
                            <Dropdown value={repetitionOption} options={repetitionOptions} filter
                                      onChange={e => {setRepetitionOption(e.target.value)}} placeholder={t('repetition_frequency')} className='inputfield w-full' />
                        </div>
                        <div className='col-6' hidden={!repetitive}>
                            <Dropdown value={repetitionCount} options={repetitionCountOptions} filter
                                      onChange={e => {setRepetitionCount(e.target.value)}} placeholder={t('repetition_count')} className='inputfield w-full' />
                        </div>
                        <div className='col-12'>
                            <Panel header={t('services')}>
                                <div className="grid p-fluid">
                                    <div className='col-6'>
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
                                    <div className='col-6'>
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
                                            <Column rowReorder style={{width: '3em'}} />
                                            <Column field="serviceLabel" header={t('service')}></Column>
                                            <Column field="duration" header={t('time')} body={durationBodyTemplate}></Column>
                                            <Column field="amount" header={t('amount')} body={amountBodyTemplate}></Column>
                                            <Column field="join" header={t('join')} body={joinBodyTemplate}></Column>
                                            <Column style={{width: '3em'}} body={deleteBodyTemplate}></Column>
                                        </DataTable></div>
                                </div>
                            </Panel>
                        </div>
                        <div className='col-12'>
                            <Button label={t('save')} className="p-button-success" onClick={handleSaveNewAppointment}/>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header={t('set_off_hours')}>
                    <div className="grid p-fluid">
                        <div className='col-6'>
                            <Dropdown value={employee} options={staff} filter
                                      onChange={e => {setEmployee(e.target.value); }} placeholder={t('employee')} className='inputfield w-full' />
                        </div>
                        <div className='col-6'>
                            <Calendar value={offHourDate} onChange={(e) => setOffHourDate(e.value)} dateFormat="dd MM yy" showIcon placeholder={t('date')} style={{width: '100%'}}></Calendar>
                        </div>
                        <div className='col-12'>
                            <ToggleButton onLabel={t('all_day')} offLabel={t('all_day')} onIcon="pi pi-check" offIcon="pi pi-times"
                                          checked={allDay} onChange={(e) => setAllDay(e.value)} />
                        </div>
                        <div className='col-6' hidden={allDay}>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon" style={{width: '100%'}}>{t('begins')}</span>
                                <Calendar value={offHourBeginning} onChange={(e) => setOffHourBeginning(e.value)}  timeOnly showTime stepMinute={5} placeholder={t('date')} style={{width: '100%', textAlignLast: 'center'}}></Calendar>
                            </div>
                        </div>
                        <div className='col-6' hidden={allDay}>
                            <div className="p-inputgroup" hidden={allDay}>
                                <span className="p-inputgroup-addon" style={{width: '100%'}}>{t('ends')}</span>
                                <Calendar value={offHourEnding} onChange={(e) => setOffHourEnding(e.value)}  timeOnly showTime stepMinute={5} placeholder={t('date')} style={{width: '100%', textAlignLast: 'center'}}></Calendar>
                            </div>
                        </div>
                        <div className='col-12'>
                            <ToggleButton onLabel={t('repetitive')} offLabel={t('repetitive')} onIcon="pi pi-check" offIcon="pi pi-times"
                                          checked={offHourRepetitive} onChange={(e) => setOffHourRepetitive(e.value)} />
                        </div>
                        <div className='col-6' hidden={!offHourRepetitive}>
                            <Dropdown value={offHourRepetitionOption} options={repetitionOptions} filter
                                      onChange={e => {setOffHourRepetitionOption(e.target.value)}} placeholder={t('repetition_frequency')} className='inputfield w-full' />
                        </div>
                        <div className='col-6' hidden={!offHourRepetitive}>
                            <Dropdown value={offHourRepetitionCount} options={repetitionCountOptions} filter
                                      onChange={e => {setOffHourRepetitionCount(e.target.value)}} placeholder={t('repetition_count')} className='inputfield w-full' />
                        </div>
                        <div className='col-12'>
                            <InputText className="inputfield w-full" value={offHourNotes} onChange={(e) => setOffHourNotes(e.target.value)} placeholder={t('notes')} />
                        </div>
                        <div className='col-12'>
                            <Button label={t('save')} className="p-button-success" onClick={handleSaveNewSetoffHour}/>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        changeAppointments: (appointments) => dispatch(actions.changeAppointments(appointments))
    };
};

const mapStateToProps = state => {
    return {
        partner: state.auth.userDetails.partner,
        appointments: state.appointments,
        // partner: state.partner
    };
};

export default connect(mapStateToProps, mapDispatchToProps)((NewAppointmentDialogue));

