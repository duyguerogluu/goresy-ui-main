import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { FilterMatchMode } from 'primereact/api';
import { SplitButton } from 'primereact/splitbutton';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Fieldset } from 'primereact/fieldset';
import { Tree } from 'primereact/tree';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { colors } from "../../shared/colors";

import { PartnerService } from '../../service/PartnerService';
import { UsersService } from '../../service/UsersService';
import { EmployeeService } from '../../service/EmployeeService';
import { WorkingHoursPicker } from '../../components/WorkingHoursPicker';
import { LunchBreakHoursPicker } from '../../components/LunchBreakHoursPicker';
import {ColorPicker} from "primereact/colorpicker";
import {connect} from "react-redux";
import {ServiceListService} from "../../service/ServiceListService";


const NewEmployeeDialogue = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);

    const [newOrEditedEmployee, setNewOrEditedEmployee] = useState();

    const [employeeName, setEmployeeName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    
    const [selectedCountryCode, setSelectedCountryCode] = useState('+90');
    const [gsm, setGsm] = useState('');
    const [selectedEmployeeType, setSelectedEmployeeType] = useState('');
    const [employeeShouldReceiveSMS, setEmployeeShouldReceiveSMS] = useState(false);
    const [showInCalendar, setShowInCalendar] = useState(true);
    const [panelUser, setPanelUser] = useState(true);
    const [workingHoursPanelCollapsed, setWorkingHoursPanelCollapsed] = useState(true);
    const [lunchBreakPanelCollapsed, setLunchBreakPanelCollapsed] = useState(true);
    const [compensationPanelCollapsed, setCompensationPanelCollapsed] = useState(true);
    const [workingHoursPickerList, setWorkingHoursPickerList] = useState([]);
    const [lunchBreakHoursPickerList, setLunchBreakHoursPickerList] = useState([]);  
    const [workDayList, setWorkDayList] = useState([]);
    const [color, setColor] = useState();
    const [predefinedColors, setPredefinedColors] = useState([...colors]);
    const [isCustomColor, setIsCustomColor] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const countries = [
        { label: 'Australia (+123)', value: '+123' },
        { label: 'Brazil (+321)', value: '+321' },
        { label: 'China (+45)', value: '+45' },
        { label: 'Turkey (+90)', value: '+90' },
    ];

    const employeeTypes = [
        { label: t('employee'), value: 'employee' },
        { label: t('secretary'), value: 'secretary' },
        { label: t('device'), value: 'device' },
        { label: t('supervisor'), value: 'supervisor' },
    ];

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const filtersMap = {
        'filters': { value: filters, callback: setFilters },
    };

    const employeeService = new EmployeeService();
    const partnerService = new PartnerService();
    const usersService = new UsersService();
    const serviceListService = new ServiceListService();


    useEffect(() => {
        if(props.employee){
            setEmployeeName(props.employee.name);
            setGsm(props.employee.gsm);
            setPanelUser(props.employee.panelUser);
            setSelectedEmployeeType(props.employee.employeeType);
            setEmail(props.employee.email);
            setEmployeeShouldReceiveSMS(props.employee.sendSms)
            setShowInCalendar(props.employee.showInCalendar);
            setColor(props.employee.colorForCalendar);
            setWorkDayList(props.employee.employeeWorkDays);
            setNewOrEditedEmployee(props.employee);
            setWorkingHoursPickerList(workDayList.map((workDay) =>
                                    <div className='col-12' key={workDay.dayNumber}>
                                        <WorkingHoursPicker day={t(workDay.dayNumber)}  dayName={t(workDay.dayShortName)}  startHour={workDay.start} endHour={workDay.end} open={workDay.working} 
                                        handleAvailabilityChange={(e, dayNumber) => onAvailabilityChange(e, dayNumber)} handleStartingHourChange={(e, dayNumber) => onStartingHourChange(e, dayNumber)} 
                                        handleEndingHourChange={(e, dayNumber) => onEndingHourChange(e, dayNumber)}/>
                                    </div>
                                    ));
            setLunchBreakHoursPickerList(workDayList.map((workDay) =>
                                    <div className='col-12' key={workDay.dayNumber}>
                                        <LunchBreakHoursPicker day={t(workDay.dayNumber)} dayName={t(workDay.day)}  startHour={workDay.breakStart} endHour={workDay.breakEnd} 
                                        handleBreakStartingHourChange={(e, dayNumber) => onBreakStartingHourChange(e, dayNumber)} 
                                        handleBreakEndingHourChange={(e, dayNumber) => onBreakEndingHourChange(e, dayNumber)}/>
                                    </div>
                                    ));
        }

    }, [props.employee]);

    useEffect(() => {
        let colorOptions = [{
            type: 'custom',
            content: t('save')
        }];
        colors.forEach(color => {
            colorOptions.push({
                type: 'color',
                content: color
            });
        });
        setEmailError(false);
        setPredefinedColors(colorOptions);
        partnerService.getPartnerById(props.partnerId).then(data => { setWorkDayList(data.workDays);});
    }, []);

    const onGlobalFilterChange = (event, filtersKey) => {
        const value = event.target.value;
        let filters = { ...filtersMap[filtersKey].value };
        filters['global'].value = value;

        filtersMap[filtersKey].callback(filters);
    }

    const renderHeader = (filtersKey) => {
        const filters = filtersMap[`${filtersKey}`].value;

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={filters['global'].value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder="Ara" />
            </span>
        );
    }

    const onCountryCodeChange = (e) => {
        setSelectedCountryCode(e.value);
    }

    const onGsmChange = (e) => {
        setGsm(e.value);
    };

    const onNameChange = (e) => {
        setEmployeeName(e.target.value);
    };

    const onEmailChange = (e) => {
        console.log(e.target.value);
        setEmail(e.target.value);
    };

    const onEmailBlur = (e) => {
        if(validateEmail(e.target.value)){
            if(!props.employee.id){
                usersService.emailExists(e.target.value).then(emailExists => { 
                    if(emailExists){
                        setEmailError(true);
                        setEmail('');
                    } else {
                        setEmailError(false);
                        setEmail(e.target.value);
                    }
                });
            }
        } else {
            setEmailError(true);
            setEmail('');
        }
    };

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    };

    const onEmployeeTypeChange = (e) => {
        setSelectedEmployeeType(e.value);
    }

    const onEmployeeShouldReceiveSMSChange = (e) => {
        setEmployeeShouldReceiveSMS(e.checked);
    }
    
    const onPanelUserChange = (e) => {
        setPanelUser(e.checked);
    }

    const onShowInCalendarChange = (e) => {
        setShowInCalendar(e.checked);
    }

    const hideDialog = () => {
        props.onHide();
    };

    const addNewEmployee = () => {
        setSubmitted(true);
        newOrEditedEmployee.partnerId = props.partnerId;
        newOrEditedEmployee.name = employeeName;
        newOrEditedEmployee.gsm = gsm;
        newOrEditedEmployee.panelUser = panelUser;
        newOrEditedEmployee.employeeType = selectedEmployeeType;
        newOrEditedEmployee.email = email;
        newOrEditedEmployee.sendSms = employeeShouldReceiveSMS;
        newOrEditedEmployee.showInCalendar = showInCalendar;
        newOrEditedEmployee.colorForCalendar = color ? (color.startsWith('var') ? color : ('#' + color)) : undefined
        newOrEditedEmployee.employeeWorkDayDtoList = workDayList;
        setNewOrEditedEmployee(newOrEditedEmployee);
    
        if (newOrEditedEmployee.id) {
            employeeService.updateEmployee(newOrEditedEmployee, newOrEditedEmployee.id).then(() => {
                toast.current.show({
                    severity:'success',
                    summary: t('save_successed'),
                    detail: t('save_completed_successfully'),
                    life: 3000
                });
                    hideDialog();
                })
                .catch(() => {
                    toast.current.show({
                        severity: 'error',
                        summary: t('save_fail'),
                        detail: t('new_debt_save_fail')
                    });
                })
        } else {
            employeeService.createEmployee(newOrEditedEmployee).then((data) =>{

                toast.current.show({
                    severity:'success',
                    summary: t('save_successed'),
                    detail: t('save_completed_successfully'),
                    life: 3000
                });
                    hideDialog();
                })
                .catch(() => {
                    toast.current.show({
                        severity: 'error',
                        summary: t('save_fail'),
                        detail: t('new_debt_save_fail')
                    });
                })
        }
    }

    const employeeDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.onHide} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={addNewEmployee} />
        </React.Fragment>
    );
    
    const showErrorMessage = (summary, detail, severity, life) => {
        this.toast.show({
            severity: severity || 'warn',
            summary: t(summary),
            detail: t(detail),
            life: life
        });
    }

    const onAvailabilityChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber === Number(dayNumber)).working = e.target.value;
    }
    
    const onStartingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber === Number(dayNumber)).start = e.target.value;
    }

    const onEndingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber === Number(dayNumber)).end = e.target.value;
    }

    const onBreakStartingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber === Number(dayNumber)).breakStart = e.target.value;
    }

    const onBreakEndingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber === Number(dayNumber)).breakEnd = e.target.value;
    }

    return (
        <div>
            <Toast ref={toast} />
            
            <Dialog visible={props.visible} header={employeeName ? t('edit_employee') : t('new_employee')}  style={props.style} modal className="fluid" 
            footer={employeeDialogFooter} onHide={props.onHide}>
                <div className='grid' style={{ marginTop: '.5rem' }}>
                    <div className='col-12'>
                        <InputText className='inputfield w-full' value={employeeName} onChange={onNameChange} placeholder={t('name_surname')} />
                    </div>
                    <div className='col-12'>
                        <InputText value={email} onBlur={onEmailBlur} 
                        className={emailError ? "inputfield w-full p-invalid" : "inputfield w-full "}
                        readOnly={props.employee.id != null} onChange={onEmailChange} placeholder={t('email_address')} />
                        <small style={emailError ? {display:'block'} : {display:'none'}} className="p-error">{t('email_is_not_available')}</small>
                    </div>
                    <div className='col-4'>
                        <Dropdown className='inputfield w-full' value={selectedCountryCode} options={countries} onChange={onCountryCodeChange} optionLabel="label" filter showClear filterBy="label" placeholder="Select a Country" />
                    </div>
                    <div className='col-8'>
                        <InputNumber className='inputfield w-full' value={gsm} onChange={onGsmChange} useGrouping={false} placeholder={t('phone_number')} />
                    </div>
                    <div className='col-12'>
                        <Dropdown className='inputfield w-full' value={selectedEmployeeType} options={employeeTypes} onChange={onEmployeeTypeChange} required optionLabel="label" placeholder={t('select_employee_type')} />
                    </div>
                    <div className='col-12'>
                        <div className='grid'>
                            <div className='col-11'>
                                <Dropdown 
                                    className='inputfield w-full' 
                                    value={color} 
                                    options={predefinedColors}
                                    onChange={(e) => {
                                        if (e.value.type === 'custom') {
                                            setIsCustomColor(true);
                                        } else {
                                            setIsCustomColor(false);
                                            setColor(e.value.content);
                                        }
                                    }} 
                                    placeholder={t('pick_employee_color')} itemTemplate={(rowData) => {
                                        if (rowData.type === 'custom'){
                                            return (<div><p>{t('custom_color')}</p></div>)
                                        }
                                        return <div style={{background: rowData.content, height: '30px', marginTop: '-5px', marginBottom: '-5px', borderRadius: '3px'}}>&nbsp;</div>
                                    }} 
                                    valueTemplate={() => {
                                        if (!isCustomColor && !color) {
                                            return <div><p>{t('pick_employee_color')}</p></div>
                                        }
                                        if (isCustomColor) {
                                            return <div><p>{t('custom_color')}</p></div>
                                        }

                                        return <div style={{background: color, height: '30px', marginTop: '-5px', marginBottom: '-5px'}}>&nbsp;</div>
                                    }}
                                />
                            </div>
                            <div className='col-1' style={{textAlign: 'center'}} hidden={!isCustomColor}>
                                <ColorPicker id="colorPicker" value={color} style={{marginTop: '.3rem'}} onChange={(e) => {
                                    setColor(e.value);
                                }}></ColorPicker>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <Checkbox inputId="calendar" checked={panelUser} onChange={onPanelUserChange} />
                        <label style={{ marginLeft: '.5rem' }} htmlFor="calendar">{t('panel_user')}</label>
                    </div>
                    <div className="col-12">
                        <Checkbox inputId="sms" checked={employeeShouldReceiveSMS} onChange={onEmployeeShouldReceiveSMSChange} />
                        <label style={{ marginLeft: '.5rem' }} htmlFor="sms">{t('employee_should_receive_sms')}</label>
                    </div>
                    <div className="col-12">
                        <Checkbox inputId="calendar" checked={showInCalendar} onChange={onShowInCalendarChange} />
                        <label style={{ marginLeft: '.5rem' }} htmlFor="calendar">{t('show_in_calendar')}</label>
                    </div>
                    <div className="col-12">
                        <Fieldset legend={t('working_hours')} toggleable collapsed={workingHoursPanelCollapsed} onToggle={(e) => setWorkingHoursPanelCollapsed(e.value)}>
                            <div className="grid">
                                {workingHoursPickerList}
                            </div>
                            
                        </Fieldset>
                    </div>
                    <div className="col-12">
                        <Fieldset legend={t('lunch_break_hours')} toggleable collapsed={lunchBreakPanelCollapsed} onToggle={(e) => setLunchBreakPanelCollapsed(e.value)}>
                            <div className="grid">
                                {lunchBreakHoursPickerList}
                            </div>
                        </Fieldset>
                    </div>
                    <div className="col-12">
                        <Fieldset legend={t('compensation_settings')} toggleable collapsed={compensationPanelCollapsed} onToggle={(e) => setCompensationPanelCollapsed(e.value)}>
                        <div className="grid">
                                <div className='col-6'>
                                    <p style={{marginTop: '.5rem'}}>
                                        Sabit Maaş
                                    </p>  
                                </div>
                                <div className='col-6'>
                                    <Dropdown className='inputfield w-full' />
                                </div>
                                <Divider/>
                                <div className='col-6'>
                                    <p style={{marginTop: '.5rem'}}>
                                        Hizmet Primi Hak Ediş
                                    </p>  
                                </div>
                                <div className='col-6'>
                                    <Dropdown className='inputfield w-full' />
                                </div>
                                <Divider/>
                                <div className='col-6'>
                                    <p style={{marginTop: '.5rem'}}>
                                        Ürün Primi Hak Ediş
                                    </p>  
                                </div>
                                <div className='col-6'>
                                    <Dropdown className='inputfield w-full' />
                                </div>
                                <Divider/>
                                <div className='col-6'>
                                    <p style={{marginTop: '.5rem'}}>
                                        Paket Primi Hak Ediş
                                    </p>  
                                </div>
                                <div className='col-6'>
                                    <Dropdown className='inputfield w-full' />
                                </div>
                                <Divider/>
                            </div>
                        </Fieldset>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id
    };
};

export default connect(mapStateToProps, null)((NewEmployeeDialogue));