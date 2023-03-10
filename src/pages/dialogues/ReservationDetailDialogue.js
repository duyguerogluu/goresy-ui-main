import React from 'react';
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";

export const ReservationDetailDialogue = (props) => {

    const { t } = useTranslation();

    return (
        <Dialog header={t('appointment_details')} visible={props.visible} resizable={false} draggable={false} dismissableMask={true} style={{ width: '500px' }} onHide={props.onHide}>
            <div className="grid p-fluid">
                <div className="col-4">
                    <p style={{fontWeight: 'bold'}}>{t('customer')}</p>
                </div>
                <div className="col-8">
                    {props.reservationDetails.customerFullname}
                </div>
                <div className="col-4">
                    <p style={{fontWeight: 'bold'}}>{t('services')}</p>
                </div>
                <div className="col-8">
                    {props.reservationDetails.servicesString}
                </div>
                <div className="col-4">
                    <p style={{fontWeight: 'bold'}}>{t('date')}</p>
                </div>
                <div className="col-8">
                    {new Date(props.reservationDetails.time).toLocaleString()}
                </div>
                <div className="col-4">
                    <p style={{fontWeight: 'bold'}}>{t('duration')}</p>
                </div>
                <div className="col-8">
                    {props.reservationDetails.duration + " " + t('minutes')}
                </div>
                <div className="col-4">
                    <p style={{fontWeight: 'bold'}}>{t('by')}</p>
                </div>
                <div className="col-8">
                    {props.reservationDetails.by}
                </div>
                <div className="col-4">
                    <p style={{fontWeight: 'bold'}}>{t('notes')}</p>
                </div>
                <div className="col-8">
                    {props.reservationDetails.notes}
                </div>
                <div className="col-12">
                    <Button label={t('detail')} onClick={() => {
                        props.history.push({pathname:'/reservation-detail-page/' + props.reservationDetails.appointmentId});
                    }}/>
                </div>
            </div>
        </Dialog>
    );
}