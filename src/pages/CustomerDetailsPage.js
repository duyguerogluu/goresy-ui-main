import React, {useEffect, useState} from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { CustomerMenu } from '../components/CustomerMenu';
import moment from 'moment';
import {CustomerService} from "../service/CustomerService";

export const CustomerDetailsPage = (props) => {
    const { t } = useTranslation();
    const [customer, setCustomer] = useState({});
    const [activeIndex, setActiveIndex] = useState(0);

    const customerService = new CustomerService();

    const dateBodyTemplate = (date) => {
        return moment(date).format('DD/MM/YYYY')
    }

    useEffect(() => {
        customerService.getCustomerById(props.match.params.id)
            .then(data => {
                setCustomer(data);
            })
    }, [props.match.params.id])

    return (
        <div className="grid">
            <div className="col-12">
                <CustomerMenu activeIndex={activeIndex} customerId={props.match.params.id}/>
            </div>
            <div className="col-6">
                <div className="flex flex-row flex-wrap">
                    <div className="flex align-items-center justify-content-center">
                        <h4><b>{t('customer_detail')}</b></h4>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div className="flex flex-row-reverse flex-wrap">
                    <div className="flex align-items-center justify-content-center">
                        <Button label={t('save_changes')} className="p-button-success" />
                    </div>
                </div>
            </div>
            <div className="col-6">
               <div className="card">
                    <h5>{t('customer_infos')}</h5>
                    <div className="grid">
                        <div className="col-6">
                            <label style={{ fontWeight:'bold'}} htmlFor="name">{t('name_surname')}</label>
                        </div>
                        <div className="col-6">
                            <label htmlFor="name">{customer.fullName}</label>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="col-6">
                            <label style={{ fontWeight:'bold'}} htmlFor="phone">{t('phone')}</label>
                        </div>
                        <div className="col-6">
                            <label htmlFor="phone">{customer.phone}</label>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="col-6">
                            <label style={{ fontWeight:'bold'}} htmlFor="email">{t('email')}</label>
                        </div>
                        <div className="col-6">
                            <label htmlFor="email">{customer.email}</label>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="col-6">
                            <label style={{ fontWeight:'bold'}} htmlFor="birthDate">{t('date_of_birth')}</label>
                        </div>
                        <div className="col-6">
                            <label htmlFor="birthDate">{dateBodyTemplate(customer.dateOfBirth)}</label>
                        </div>
                    </div>
                    <Button label={t('edit')} className="p-button-success" style={{ width:'32%', marginTop: '.5rem'}} />
                    <Button label={t('restriction')} className="p-button-danger" style={{ width:'32%', marginLeft: '.5rem'}}/>
                    <Button label={t('delete')} className="p-button-info"style={{ width:'32%', marginLeft: '.5rem'}} />
                </div>
            </div>
            <div className="col-6">
                <div className="card">
                    <h5>{t('service_notes')}</h5>
                        <div className="grid">
                            <div className="col-6">
                                <label style={{ fontWeight:'bold'}} htmlFor="date">{t('last_appointment_date')}</label>
                            </div>
                            <div className="col-6">
                                <label htmlFor="date">{dateBodyTemplate(customer.lastAppointmentDate)}</label>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-6">
                                <label style={{ fontWeight:'bold'}} htmlFor="service">{t('services')}</label>
                            </div>
                            <div className="col-6">
                                <label htmlFor="service">Saç Bakım</label>
                            </div>
                        </div>
                </div>
            </div>
        </div>
                       
    );


}