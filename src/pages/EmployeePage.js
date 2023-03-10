import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { SplitButton } from 'primereact/splitbutton';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Tree } from 'primereact/tree';
import { Toast } from 'primereact/toast';
import { colors } from "../shared/colors";

import { PartnerService } from '../service/PartnerService';
import { EmployeeService } from '../service/EmployeeService';
import NewEmployeeDialogue from '../pages/dialogues/NewEmployeeDialogue';

import {connect} from "react-redux";
import {ServiceListService} from "../service/ServiceListService";
import { AuthoritiesService } from '../service/AuthoritiesService';
import { InputSwitch } from 'primereact/inputswitch';
import { UsersService } from '../service/UsersService';

import { PartnerUserService } from '../service/PartnerUserService';

const EmployeePage = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);

    let emptyEmployee = {
        id: null,
        name: '',
        partnerId: props.partnerId,
        email: '',
        panelUser: true,
        gsm: '',
        employeeType: null,
        sendSms: false,
        showInCalendar: true,
        employeeWorkDays: null,
        colorForCalendar:  null
    }

    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [employee, setEmployee] = useState(emptyEmployee);
    const [selectedPartnerUser, setSelectedPartnerUser] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [employeeList, setEmployeeList] = useState([]);
    const [workDayList, setWorkDayList] = useState([]);
    
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
    const partnerUserService = new PartnerUserService();

    useEffect(() => {
        employeeService.getEmployeeList(props.partnerId).then(data => { setEmployeeList(data); setLoading(false);});
        partnerService.getPartnerById(props.partnerId, emptyEmployee).then(data => { 
            setWorkDayList(data.workDays);
        });
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

    const openNew = () => {
        emptyEmployee.employeeWorkDays = workDayList;
        setEmployee(emptyEmployee);
        setEmployeeDialog(true);
    }

    const hideDialog = () => {
        setEmployeeDialog(false);
    }

    const editButtonTemplate = (rowData) => {

        return (
            <div className="flex justify-content-end">
                <SplitButton 
                    label={t('edit')} 
                    model={detailsButtonItems(rowData.id)} 
                    onClick={() => {
                        setEmployee(rowData);
                        setEmployeeDialog(true);
                }} />
            </div>
        );
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
      usersService
        .getPartnerUserByEmployeeId(authoritiesDialog)
        .then((partnerUser) => {
          setSelectedPartnerUser(partnerUser);
            usersService.getUserDetail(partnerUser.userId).then((user) => {
                if (user.authorities && user.authorities.length > 0) {
                setSelectedAuthorities(user.authorities);
                    setSelectedAuthorities(user.authorities);
                }
            });
        });
    };

    const isAuthorityChecked = (authority) => {
        return Boolean(selectedAuthorities.find(auth => auth.id === authority.id));
    }

    const handleSaveAuthorities = () => {
        const employee = employeeList && employeeList.length && employeeList.find(emp => emp.id === authoritiesDialog)
        if (employee) {
            const authObj = generateAuthorityPages(selectedAuthorities);
            usersService.setUserAuthorizations(selectedPartnerUser.userId, Object.keys(authObj).map(groupName => ({
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

    const header1 = renderHeader('filters');
    
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
        serviceListService.getServiceListSmall(props.partnerId)
            .then(data => {

                setEmployeeServiceList(data);
            });
    }, [])

    return (
        <div>
            <Toast ref={toast} />
            <NewEmployeeDialogue employee={employee} visible={employeeDialog} onHide={hideDialog}
            style={{ width: '600px' }} modal className="fluid" ></NewEmployeeDialogue>

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
                        <Button label={t('new')} icon="pi pi-plus" style={{ padding: '.45rem 1rem', marginBottom: "1rem", marginLeft: '1rem' }} className="p-button-success" onClick={openNew} />
                    </div>
                </div>
                <DataTable value={employeeList} responsiveLayout="scroll" header={header1} filters={filters} loading={loading}  onFilter={(e) => setFilters(e.filters)}>
                    <Column field="name" header={t('employee')} sortable></Column>
                    <Column header={t('account_type')} body={employeeTypeBody} sortable></Column>
                    <Column field="gsm" header={t('telephone_number')} sortable></Column>
                    <Column header="" body={editButtonTemplate}></Column>
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

export default connect(mapStateToProps, null)((EmployeePage));