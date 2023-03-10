import React, { useState, useEffect, useRef, useParams } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
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
import { EmployeeService } from '../../service/EmployeeService';
import { WorkingHoursPicker } from '../../components/WorkingHoursPicker';
import { LunchBreakHoursPicker } from '../../components/LunchBreakHoursPicker';
import {ColorPicker} from "primereact/colorpicker";
import {connect} from "react-redux";
import {ServiceListService} from "../../service/ServiceListService";
import { AuthoritiesService } from '../../service/AuthoritiesService';
import { InputSwitch } from 'primereact/inputswitch';
import { UsersService } from '../../service/UsersService';

export const StaffListPage = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);

    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [employeeName, setEmployeeName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('+90');
    const [gsm, setGsm] = useState('');
    const [selectedEmployeeType, setSelectedEmployeeType] = useState('');
    const [employeeShouldReceiveSMS, setEmployeeShouldReceiveSMS] = useState(false);
    const [showInCalendar, setShowInCalendar] = useState(true);
    const [panelUser, setPanelUser] = useState(true);
    const [workingHoursPanelCollapsed, setWorkingHoursPanelCollapsed] = useState(true);
    const [lunchBreakPanelCollapsed, setLunchBreakPanelCollapsed] = useState(true);
    const [compensationPanelCollapsed, setCompensationPanelCollapsed] = useState(true);
    const [loading, setLoading] = useState(true);
    const [employeeList, setEmployeeList] = useState([]);
    const [workDayList, setWorkDayList] = useState([]);
    const [employeeId, setEmployeeId] = useState();
    const [color, setColor] = useState();
    const [predefinedColors, setPredefinedColors] = useState([...colors]);
    const [isCustomColor, setIsCustomColor] = useState(false);
    const [servicesDialog, setServicesDialog] = useState(false);
    const [authoritiesDialog, setAuthoritiesDialog] = useState(false);
    const [selectedAuthorities, setSelectedAuthorities] = useState([]);
    const [authorityPages, setAuthorityPages] = useState({});
    const [servicesList, setServicesList] = useState({});
    const [employeeServiceList, setEmployeeServiceList] = useState([]);
    const [servicesToCopy, setServicesToCopy] = useState([]);
    const [copyServicesButton, setCopyServicesButton] = useState(true);
    const [copyConfirmDialog, setCopyConfirmDialog] = useState(false);

    const detailsButtonItems = (employeeId) => [
        {
            label: t('services_provided'),
            icon: 'pi pi-list',
            command: () => servicesProvided(employeeId)
        },
        {
            label: t('authorities'),
            icon: 'pi pi-briefcase',
            command: () => getAuthorities(employeeId)
        },
        {
            label: t('renew_password_and_send'),
            icon: 'pi pi-key'
        },
        {
            label: t('delete'),
            icon: 'pi pi-trash',
            command: () => removeEmployee(employeeId)
        }
    ];

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
    const serviceListService = new ServiceListService();
    const authoritiesService = new AuthoritiesService();
    const usersService = new UsersService();

    useEffect(() => {
        employeeService.getEmployeeList(props.match.params.partnerId).then(data => { setEmployeeList(data); setLoading(false);});
        partnerService.getPartnerById(props.match.params.partnerId).then(data => { setWorkDayList(data.workDays);});
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

    const editButtonTemplate = (rowData) => {

        return (
            <div className="flex justify-content-end">
                <SplitButton 
                    label={t('edit')} 
                    model={detailsButtonItems(rowData.id)} 
                    onClick={() => {
                        setIsCustomColor(false);
                        setEmployeeName(rowData.name);
                        setEmail(rowData.email);
                        setGsm(rowData.gsm);
                        setSelectedEmployeeType(rowData.employeeType);
                        setEmployeeShouldReceiveSMS(rowData.sendSms);
                        setShowInCalendar(rowData.showInCalendar);
                        setEmployeeId(rowData.id);
                        setWorkDayList(rowData.employeeWorkDays);
                        if (rowData.colorForCalendar && rowData.colorForCalendar.startsWith('#')) {
                            setColor(rowData.colorForCalendar.slice(1));
                            setIsCustomColor(true);
                        } else if (rowData.colorForCalendar) {
                            setColor(rowData.colorForCalendar);
                        } else {
                            setColor(undefined)
                        }
                        setEmployeeDialog(true);
                }} />
            </div>
        );
    }

    const hideDialog = () => {
        setEmployeeDialog(false);
    }

    const onCountryCodeChange = (e) => {
        setSelectedCountryCode(e.value);
    }

    const onEmployeeTypeChange = (e) => {
        setSelectedEmployeeType(e.value);
    }

    const getAuthorities = (employeeId) => {
        authoritiesService.getAuthorities()
            .then(data => {
                setAuthorityPages(generateAuthorityPages(data))
                setAuthoritiesDialog(employeeId);
            });
    }

    const generateAuthorityPages = (authorities) => {
        let pages = {}
        if (authorities) {
            authorities.forEach(authority => {
                if (Object.keys(pages).includes(authority.pageName)) {
                    pages = {
                        ...pages,
                        [authority.pageName] : [...pages[authority.pageName], authority]
                    }
                } else {
                    pages = {
                        ...pages,
                        [authority.pageName] : [authority]
                    }
                }
            });
        }
        return pages;
    }

    const handleOnHideAuthoritiesDialog = () => {
        setAuthoritiesDialog(null)
        setSelectedAuthorities([])
    }

    const handleOnShowAuthoritiesDialog = () => {
        usersService.getUserDetail(authoritiesDialog)
            .then(user => {
                if (user.authorities && user.authorities.length > 0) {
                    setSelectedAuthorities(user.groups[0].authorities)
                }
            })
    }

    const isAuthorityChecked = (authority) => {
        return Boolean(selectedAuthorities.find(auth => auth.id === authority.id));
    }

    const handleSaveAuthorities = () => {
        const employee = employeeList && employeeList.length && employeeList.find(emp => emp.id === authoritiesDialog)
        if (employee) {
            const authObj = generateAuthorityPages(selectedAuthorities);
            usersService.setUserAuthorizations(employee.id, Object.keys(authObj).map(groupName => ({
                groupName,
                authorities: selectedAuthorities.filter(auth => auth.pageName === groupName)
            })))
            .then(() => {
                toast.current.show({
                    severity: 'success',
                    summary: t('save_successed'),
                    detail: t('save_authorizations_success')
                });
                setAuthoritiesDialog(null)
            })
        }
    }

    const servicesProvided = (employeeId) => {
        serviceListService.getServicesOfEmployee(employeeId)
            .then(data => {
                setServicesList({
                    employeeId: employeeId,
                    services: data
                });

                setCopyServicesButton(true);
                setServicesDialog(true);
            });
    }

    const removeEmployee = (employeeId) => {
        employeeService.removeEmployee(employeeId).then(() => {
            toast.current.show({
                severity:'success',
                summary: t('save_successed'),
                detail: t('save_completed_successfully'),
                life: 3000
            });

            let newEmployeeList = [...employeeList]
            setEmployeeList(newEmployeeList.filter(employee => employee.id !== employeeId));
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

    const addNewEmployee = () => {
        let newEmployee = {
            name: employeeName,
            partnerId: props.match.params.partnerId,
            email: email,
            panelUser: panelUser,
            gsm: gsm,
            employeeType: selectedEmployeeType,
            sendSms: employeeShouldReceiveSMS,
            showInCalendar: showInCalendar,
            employeeWorkDayDtoList: workDayList,
            colorForCalendar: color ? (color.startsWith('var') ? color : ('#' + color)) : undefined
        }

        if (employeeId) {
            employeeService.updateEmployee(newEmployee, employeeId).then(() => {
                toast.current.show({
                    severity:'success',
                    summary: t('save_successed'),
                    detail: t('save_completed_successfully'),
                    life: 3000
                });
                    setEmployeeList([...(employeeList.filter(employee => employee.id !== employeeId)), newEmployee]);
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
            employeeService.createEmployee(newEmployee).then((data) =>{

                toast.current.show({
                    severity:'success',
                    summary: t('save_successed'),
                    detail: t('save_completed_successfully'),
                    life: 3000
                });
                    setEmployeeList([...employeeList, data]);
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
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={addNewEmployee} />
        </React.Fragment>
    );

    const header1 = renderHeader('filters');
    
    const listItems = workDayList.map((workDay) =>
        <div className='col-12' key={workDay.dayNumber}>
            <WorkingHoursPicker day={t(workDay.dayNumber)}  dayName={t(workDay.dayShortName)}  startHour={workDay.start} endHour={workDay.end} open={workDay.working} 
            handleAvailabilityChange={(e, dayNumber) => onAvailabilityChange(e, dayNumber)} handleStartingHourChange={(e, dayNumber) => onStartingHourChange(e, dayNumber)} 
            handleEndingHourChange={(e, dayNumber) => onEndingHourChange(e, dayNumber)}/>
        </div>
    );

    const listItemsBreakHour = workDayList.map((workDay) =>
        <div className='col-12' key={workDay.dayNumber}>
            <LunchBreakHoursPicker day={t(workDay.dayNumber)} dayName={t(workDay.day)}  startHour={workDay.breakStart} endHour={workDay.breakEnd} 
            handleBreakStartingHourChange={(e, dayNumber) => onBreakStartingHourChange(e, dayNumber)} 
            handleBreakEndingHourChange={(e, dayNumber) => onBreakEndingHourChange(e, dayNumber)}/>
        </div>
    );

    const onAvailabilityChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber === dayNumber).working = e.target.value;
    }
    
    const onStartingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber === dayNumber).start = e.target.value;
    }

    const onEndingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber === dayNumber).end = e.target.value;
    }

    const onBreakStartingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber === dayNumber).breakStart = e.target.value;
    }

    const onBreakEndingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber === dayNumber).breakEnd = e.target.value;
    }

    const employeeTypeBody = (rowData) => {
        return <span className={` employee-type-${rowData.employeeType}`}>{t(rowData.employeeType)}</span>;
    }

    const copyConfirmDialogFooter = (
        <React.Fragment>
            <Button label={t('no')} icon="pi pi-times" className="p-button-text" onClick={() => setCopyConfirmDialog(false)} />
            <Button label={t('yes')} icon="pi pi-check" className="p-button-text" onClick={() => {
                employeeService.setEmployeeServices(servicesList.employeeId, {
                    serviceIdList: servicesToCopy
                })
                    .then(() => {
                        setCopyConfirmDialog(false);
                        setServicesDialog(false);
                        toast.current.show({
                            severity:'success',
                            summary: t('save_successed'),
                            detail: t('save_completed_successfully'),
                            life: 3000
                        });
                    })
            }} />
        </React.Fragment>
    );

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

        setPredefinedColors(colorOptions)

        serviceListService.getServiceListSmall(props.match.params.partnerId)
            .then(data => {

                setEmployeeServiceList(data);
            });
    }, [])

    return (
        <div>
            <Toast ref={toast} />
            <Dialog visible={copyConfirmDialog} style={{ width: '450px' }} header={t('confirm')} modal footer={copyConfirmDialogFooter} onHide={() => {setCopyConfirmDialog(false)}}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {<span>{t('confirm_copy_services')}</span>}
                </div>
            </Dialog>
            <Dialog header={t('services_provided')} visible={servicesDialog} resizable={false} draggable={false} dismissableMask={true} style={{ width: '500px' }} onHide={() => setServicesDialog(false)}>
                <div className="grid p-fluid">
                    <div className='col-12'>
                        <DataTable value={servicesList.services} responsiveLayout="scroll" >
                            <Column field="name" header={t('service')} filter={true}></Column>
                            <Column body={(service) => (
                                <div style={{textAlign: 'end'}}>
                                    <Button className='p-button-danger p-button-icon-only' icon="pi pi-trash" onClick={(item) => {
                                        serviceListService.getService(service.id)
                                            .then(data => {
                                                serviceListService.updateService(service.id, {
                                                    ...data,
                                                    selectedEmployees: employeeServiceList
                                                        .find(service => service.id === data.id).selectedEmployees
                                                        .filter(employeeId => employeeId !== servicesList.employeeId)
                                                }).then(() => {
                                                    setServicesList({
                                                        ...servicesList,
                                                        services: servicesList.services.filter(service => service.id !== data.id)
                                                    })
                                                })
                                            })
                                    }} />
                                </div>
                            )}/>
                        </DataTable>
                    </div>
                    <div className='col-12' hidden={!copyServicesButton}>
                        <Button label={t('copy_services_from_another_employee')} onClick={() => {setCopyServicesButton(false)}}/>
                    </div>
                    <div className='col-12' hidden={copyServicesButton}>
                        <Dropdown options={employeeList} optionLabel={'name'} optionValue={'id'} placeholder={t('select_employee_to_copy_services')} onChange={(e) => {
                            serviceListService.getServicesOfEmployee(e.value)
                                .then(data => {
                                    let serviceIdList = [];
                                    data.forEach(service => serviceIdList.push(service.id));
                                    setServicesToCopy(serviceIdList);

                                    setCopyConfirmDialog(true);
                                })
                        }} />
                    </div>
                </div>
            </Dialog>

            <Dialog 
                header={t('authorities')} 
                visible={Boolean(authoritiesDialog)} 
                resizable={false} 
                draggable={false} 
                dismissableMask={true} 
                style={{ width: '500px' }} 
                onHide={handleOnHideAuthoritiesDialog}
                onShow={handleOnShowAuthoritiesDialog}
                footer={(dialog) => (
                    <div 
                        className='flex'
                        style={{
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Button 
                            label={t('cancel')} 
                            icon="pi pi-times" 
                            className="p-button-text" 
                            onClick={dialog.onHide}
                        />
                        <Button 
                            label={t('save')} 
                            icon="pi pi-check" 
                            className="p-button-text" 
                            onClick={handleSaveAuthorities}
                        />
                    </div>
                )}
            >
                <Tree 
                    nodeTemplate={(node) => !node.authority ? (
                        <p>{node.label}</p>
                    ) : (
                        <div 
                            className='flex w-full'
                            style={{
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <p className='m-0 p-0'>
                                {node.description}
                            </p>
                            <InputSwitch 
                                checked={isAuthorityChecked(node)}
                                onChange={() => {
                                    if (isAuthorityChecked(node)) {
                                        setSelectedAuthorities(selectedAuthorities.filter(auth => auth.id !== node.id))
                                    } else {
                                        setSelectedAuthorities([...selectedAuthorities, node])
                                    }
                                }}
                            />
                        </div>
                    )} 
                    value={Object.keys(authorityPages).map((title, i) => {
                        const pages = authorityPages[title];
                        return {
                            key: i,
                            label: title,
                            children: pages && pages.length > 0 && pages.map(page => ({
                                ...page,
                                key: page.id,
                                label: page.pageName
                            }))
                        }
                    }) || []}
                />
            </Dialog>

            <div className="card">
                <div className="grid">
                    <div className="flex justify-content-start flex-wrap card-container col">
                        <h2><b>{t('staff')}</b></h2>
                    </div>
                    <div className="flex justify-content-end flex-wrap card-container col">
                        <Button label={t('new')} icon="pi pi-plus" style={{ padding: '.45rem 1rem', marginBottom: "1rem", marginLeft: '1rem' }} className="p-button-success" onClick={() => {
                            setEmployeeName('');
                            setEmail('');
                            setGsm('');
                            setSelectedEmployeeType('');
                            setEmployeeShouldReceiveSMS(false);
                            setShowInCalendar(true);
                            setColor(undefined);
                            setIsCustomColor(false)
                            setEmployeeDialog(true);
                        }} />
                    </div>
                </div>
                <DataTable value={employeeList} responsiveLayout="scroll" header={header1} filters={filters} loading={loading}  onFilter={(e) => setFilters(e.filters)}>
                    <Column field="name" header={t('employee')} sortable></Column>
                    <Column header={t('account_type')} body={employeeTypeBody} sortable></Column>
                    <Column field="gsm" header={t('telephone_number')} sortable></Column>
                    <Column header="" body={editButtonTemplate}></Column>
                </DataTable>
            </div>
            <Dialog visible={employeeDialog} header={employeeName ? t('edit_employee') : t('new_employee')} style={{ width: '600px' }} modal className="fluid" footer={employeeDialogFooter} onHide={hideDialog}>
                <div className='grid' style={{ marginTop: '.5rem' }}>
                    <div className='col-12'>
                        <InputText className='inputfield w-full' value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder={t('name_surname')} />
                    </div>
                    <div className='col-12'>
                        <InputText className='inputfield w-full' value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('email_address')} />
                    </div>
                    <div className='col-4'>
                        <Dropdown className='inputfield w-full' value={selectedCountryCode} options={countries} onChange={onCountryCodeChange} optionLabel="label" filter showClear filterBy="label" placeholder="Select a Country" />
                    </div>
                    <div className='col-8'>
                        <InputText className='inputfield w-full' value={gsm} onChange={(e) => setGsm(e.target.value)} placeholder={t('phone_number')} />
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
                        <Checkbox inputId="calendar" checked={panelUser} onChange={e => setPanelUser(e.checked)} />
                        <label style={{ marginLeft: '.5rem' }} htmlFor="calendar">{t('panel_user')}</label>
                    </div>
                    <div className="col-12">
                        <Checkbox inputId="sms" checked={employeeShouldReceiveSMS} onChange={e => setEmployeeShouldReceiveSMS(e.checked)} />
                        <label style={{ marginLeft: '.5rem' }} htmlFor="sms">{t('employee_should_receive_sms')}</label>
                    </div>
                    <div className="col-12">
                        <Checkbox inputId="calendar" checked={showInCalendar} onChange={e => setShowInCalendar(e.checked)} />
                        <label style={{ marginLeft: '.5rem' }} htmlFor="calendar">{t('show_in_calendar')}</label>
                    </div>
                    <div className="col-12">
                        <Fieldset legend={t('working_hours')} toggleable collapsed={workingHoursPanelCollapsed} onToggle={(e) => setWorkingHoursPanelCollapsed(e.value)}>
                            <div className="grid">
                            {listItems}
                            </div>
                            
                        </Fieldset>
                    </div>
                    <div className="col-12">
                        <Fieldset legend={t('lunch_break_hours')} toggleable collapsed={lunchBreakPanelCollapsed} onToggle={(e) => setLunchBreakPanelCollapsed(e.value)}>
                        <div className="grid">
                        {listItemsBreakHour}
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
