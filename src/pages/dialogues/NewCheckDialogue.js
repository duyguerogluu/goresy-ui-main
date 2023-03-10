import React, {useEffect, useRef, useState} from 'react';
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
import {CheckService} from "../../service/CheckService";
import {CustomerService} from "../../service/CustomerService";
import {EmployeeService} from "../../service/EmployeeService";
import {ServiceListService} from "../../service/ServiceListService";
import {AutoComplete} from "primereact/autocomplete";
import {connect} from "react-redux";
import {Toast} from "primereact/toast";

const NewCheckDialogue = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);

    const [person, setPerson] = useState({});
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedServicesMap, setSelectedServicesMap] = useState({});
    const [date, setDate] = useState(new Date())
    const [customer, setCustomer] = useState("");
    const [notes, setNotes] = useState("");
    const [services, setServices] = useState([])
    const [staff, setStaff] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const checkService = new CheckService();
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

    const searchCustomer = (event) => {
        customerService.getCustomersOfPartner(props.partner.id, event.query).then(data => {
            if (data.content && data.content.length > 0) {
                setFilteredCustomers(data.content);
            }
        })
    }

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

    return (
        <Dialog header={t('new_check')} visible={props.visible} resizable={false} draggable={false} dismissableMask={true} style={{ width: '900px' }} onHide={props.onHide}>
            <Toast ref={toast} />
            <div className="grid p-fluid">
                <div className='col-6'>
                    <AutoComplete
                        delay={500} minLength={3} value={customer} suggestions={filteredCustomers}
                        completeMethod={searchCustomer} field="fullName" aria-label={t('person')}
                        onChange={(e) => setCustomer(e.value)} placeholder={t('customer')}
                    />
                </div>
                <div className='col-6'>
                    <Calendar value={date} onChange={(e) => setDate(e.value)} stepMinute={5} showTime  dateFormat="dd MM yy" showIcon placeholder={t('date')} style={{width: '100%'}}></Calendar>
                </div>
                <div className='col-12'>
                    <InputText className="inputfield w-full" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notes')} />
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
                    <Button label={t('save')} className="p-button-success" onClick={() => {
                        let selectedServicesResult = [];

                        selectedServices.forEach(service => {
                            selectedServicesResult.push({
                                amount: service.amount,
                                duration: service.duration,
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

                        checkService.postCheck({
                            by: 'partner',
                            customerId: customer.id,
                            partnerId: props.partner.id,
                            phoneNumber: props.partner.telephone,
                            time: date,
                            notes: notes,
                            services: selectedServicesResult
                        }).then(() => {
                            props.onHide(false);
                        }).catch(() => {
                            toast.current.show({
                                severity: 'error',
                                summary: t('save_fail'),
                                detail: t('new_check_save_fail')
                            });
                        });
                    }}/>
                </div>
            </div>
        </Dialog>
    );
}

const mapStateToProps = state => {
    return {
        partner: state.auth.userDetails.partner
    };
};

export default connect(mapStateToProps, null)((NewCheckDialogue));
