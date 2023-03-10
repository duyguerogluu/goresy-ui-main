import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { BasicSettingsService } from '../../service/BasicSettingsService';
import { Fieldset } from 'primereact/fieldset';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import {connect} from "react-redux";

export const SettingsPage = (props) => {
    const { t, i18n } = useTranslation();
    const toast = useRef(null);
    const [partner, setPartner] = useState({});
    const [billingInformationPanelCollapsed, setBillingInformationPanelCollapsed] = useState(true);
    const [authorizationPanelCollapsed, setAuthorizationPanelCollapsed] = useState(true);
    
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [customerGender, setCustomerGender] = useState('');
    const [taxName, setTaxname] = useState('');
    const [taxNumber, setTaxNumber] = useState('');
    const [taxAdministration, setTaxAdministration] = useState('');
    const [taxAddress, setTaxAddress] = useState('');
    const [vatRate, setVatRate] = useState('');
    const [agentAccessPermission, setAgentAccessPermission] = useState(false);
    const [pastMonthData, setPastMonthData] = useState(false);

    const basicSettingsService = new BasicSettingsService();

    useEffect(() => {
        basicSettingsService.getBasicSettings(props.match.params.partnerId).then(data => {
            setPartner(data); 
            setName(data.name);
            setAddress(data.address);
            setEmail(data.email);
            setCategory(data.category);
            setCity(data.city);
            setDistrict(data.district);
            setCustomerGender(data.customerGender);
            setTaxname(data.taxName);
            setTaxNumber(data.taxNumber);
            setTaxAdministration(data.taxAdministration);
            setTaxAddress(data.taxAddress);
            setVatRate(data.vatRate);
            setAgentAccessPermission(data.agentAccessPermission);
            setPastMonthData(data.pastMonthData);
        });
    }, []);

    const updatePermissionAndPastMonth = () => {
        let basicSettingsDto = {
            agentAccessPermission: agentAccessPermission,
            pastMonthData: pastMonthData,
        }
        basicSettingsService.updatePermissionAndPastMonth(props.partnerId, basicSettingsDto).then(date=>{
            toast.current.show({severity:'success', summary: t('save_successed'),detail: t('save_completed_successfully'), life: 3000});
        });
    }

    return (
        <div className="card">
            <div className="grid">
                <Toast ref={toast} />
                <div className="flex justify-content-start flex-wrap card-container col">
                    <h2><b>{t('basic_settings')}</b></h2>
                </div>
                <div className='col-12'>
                    <InputText value={name} className='inputfield w-full' />
                </div>
                <div className='col-12'>
                    <InputText value={address} className='inputfield w-full' />
                </div>
                <div className='col-12'>
                    <InputText value={email} className='inputfield w-full' />
                </div>
                <div className='col-12'>
                    <InputText value={category} className='inputfield w-full' />
                </div>
                <div className='col-12'>
                    <InputText value={city} className='inputfield w-full' />
                </div>
                <div className='col-12'>
                    <InputText value={district} className='inputfield w-full' />
                </div>
                <div className='col-6'>
                    <p> {t('customer_gender')} </p>
                </div>
                <div className='col-6'>
                    <InputText value={t(customerGender)} className='inputfield w-full' />
                </div>
                <div className='col-12'>
                    <Fieldset legend={t('billing_information')} toggleable collapsed={billingInformationPanelCollapsed} onToggle={(e) => setBillingInformationPanelCollapsed(e.value)}>
                        <div className="grid">
                            <div className='col-6'>
                                <p> {t('tax_name')} </p>
                            </div>
                            <div className='col-6'>
                                <InputText value={taxName} className='inputfield w-full' />
                            </div>
                            <div className='col-6'>
                                <p> {t('tax_number')} </p>
                            </div>
                            <div className='col-6'>
                                <InputText value={taxNumber} className='inputfield w-full' />
                            </div>
                            <div className='col-6'>
                                <p> {t('tax_administration')} </p>
                            </div>
                            <div className='col-6'>
                                <InputText value={taxAdministration} className='inputfield w-full' />
                            </div>
                            <div className='col-6'>
                                <p> {t('tax_address')} </p>
                            </div>
                            <div className='col-6'>
                                <InputText value={taxAddress} className='inputfield w-full' />
                            </div>
                            <div className='col-6'>
                                <p> {t('vat_rate')} </p>
                            </div>
                            <div className='col-6'>
                                <InputText value={vatRate} className='inputfield w-full' />
                            </div>
                            <div className='col-6'>
                                <p> {t('tax_logo')} </p>
                            </div>
                            <div className='col-6'>
                                <Button icon="pi pi-plus" label={t('pick_and_upload')} />
                            </div>
                        </div>
                    </Fieldset>
                </div>
                <div className='col-12'>
                    <Fieldset legend={t('authorization')} toggleable collapsed={authorizationPanelCollapsed} onToggle={(e) => setAuthorizationPanelCollapsed(e.value)}>
                        <div className="grid">
                            <div className='col-6'>
                                <p> {t('agent_access_permission')} </p>
                            </div>
                            <div className='col-6'>
                                <div className='flex justify-content-end flex-wrap'>
                                    <InputSwitch checked={agentAccessPermission} onChange={e => setAgentAccessPermission(e.target.value)}/>
                                </div>
                            </div>
                            <div className='col-6'>
                                <p> {t('past_month_data')} </p>
                            </div>
                            <div className='col-6'>
                                <div className='flex justify-content-end flex-wrap'>
                                    <InputSwitch checked={pastMonthData} onChange={e => setPastMonthData(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                    </Fieldset>
                </div>
                <div className='col-12'>
                    <Button className='inputfield w-full' label={t('save')} onClick={updatePermissionAndPastMonth} />
                </div>
            </div>
        </div>
    );
}
