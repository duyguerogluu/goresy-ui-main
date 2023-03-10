import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import {Dropdown} from "primereact/dropdown";
import {ToggleButton} from "primereact/togglebutton";
import { GoogleLogin } from "react-google-login";
import { Toast } from 'primereact/toast';
import { PartnerService } from '../service/PartnerService';
import {connect} from "react-redux";

const AppointmentSettingsPage = (props) => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const [appointmentReminder, setAppointmentReminder] = useState(true);
    const [appointmentResolution, setAppointmentResolution] = useState(15);
    const [hourFormat, setHourFormat] = useState("hour_24");

    const hourFormats = [
        { label: t('24_hour') + " (23:59)", value: "hour_24" },
        { label: t('12_hour') + " (11:59 PM)", value: "hour_12" },
    ];
    const appointmentResolutions = [
        { label: t('every_x_prefix') + " 15 " + t('every_x_minutes_suffix'), value: 15 },
        { label: t('every_x_prefix') + " 30 " + t('every_x_minutes_suffix'), value: 30 },
        { label: t('every_x_prefix') + " 45 " + t('every_x_minutes_suffix'), value: 45 },
        { label: t('every_x_prefix') + " 60 " + t('every_x_minutes_suffix'), value: 60 },
        { label: t('every_x_prefix') + " 90 " + t('every_x_minutes_suffix'), value: 90 },
        { label: t('every_x_prefix') + " 120 " + t('every_x_minutes_suffix'), value: 120 },
    ];

    const partnerService = new PartnerService();

    useEffect(() => {
        partnerService.getPartnerById(props.partnerId).then((data) => {
        setAppointmentResolution(data.appointmentResolution);
        setHourFormat(data.hourFormat);
        setAppointmentReminder(data.appointmentReminder);
      });
    }, [t]);

    const updateAppointmentSettings = () => {
        let appointmentSettings = {
            hourFormat: hourFormat,
            appointmentResolution: appointmentResolution,
            appointmentReminder: appointmentReminder
        }
        partnerService.updateAppointmentSettingsByPartnerId(props.partnerId, appointmentSettings).then((data) => {
            setAppointmentResolution(data.appointmentResolution);
            setHourFormat(data.hourFormat);
            setAppointmentReminder(data.appointmentReminder);
            toast.current.show({severity:'success', summary: t('save_successed'),detail: t('save_completed_successfully'), life: 3000});
          });
    }

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="grid p-fluid">
                <div className='col-12'>
                    <div className="flex justify-content-start flex-wrap card-container col">
                        <h2><b>{t('appointment_settings')}</b></h2>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='grid p-fluid'>
                        <div className='col-3' style={{alignSelf: 'center'}}>
                            <label htmlFor="appointmentResolution">{t('appointment_resolution')}</label>
                        </div>
                        <div className='col-9'>
                            <Dropdown id="appointmentResolution" value={appointmentResolution} options={appointmentResolutions}  optionLabel="label" optionValue="value"
                                      onChange={e => setAppointmentResolution(e.target.value)} className='inputfield w-full'
                            />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='grid p-fluid'>
                        <div className='col-3' style={{alignSelf: 'center'}}>
                            <label htmlFor="hourFormat">{t('hour_format')}</label>
                        </div>
                        <div className='col-9'>
                            <Dropdown id="hourFormat" value={hourFormat} options={hourFormats} optionLabel="label" optionValue="value"
                                      onChange={e => setHourFormat(e.target.value)} className='inputfield w-full'
                            />
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='grid p-fluid'>
                        <div className='col-6' style={{alignSelf: 'center'}}>
                            <label htmlFor="google_calender_link">{t('google_calender_link')}</label>
                        </div>
                        <div className='col-6'>
                            <GoogleLogin
                                id="google_calender_link"
                                clientId={window.env.REACT_APP_GORESY_GOOGLE_CLIENT_ID}
                                buttonText={t('sign_in_with_google')}
                                isSignedIn={true}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <ToggleButton onLabel={t('appointment_reminder')} offLabel={t('appointment_reminder')}
                                  onIcon="pi pi-check" offIcon="pi pi-times" checked={appointmentReminder}
                                  onChange={(e) => setAppointmentReminder(e.value)}
                    />
                </div>
                <div className='col-12'>
                    <Button label={t('save')} className="p-button-success" onClick={updateAppointmentSettings}/>
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

export default connect(mapStateToProps, null)((AppointmentSettingsPage));