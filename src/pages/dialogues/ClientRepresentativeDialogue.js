import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";
import {PartnerService} from "../../service/PartnerService";

export const ClientRepresentativeDialogue = (props) => {
    const { t } = useTranslation();

    const [clientRepresentative, setClientRepresentative] = useState({});
    const partnerService = new PartnerService();

    useEffect(() => {
        partnerService.getClientRepresentitive().then(data => { setClientRepresentative(data); });
    }, []);

    return (
        <Dialog header={t('client_representitive')} visible={props.visible} resizable={false} draggable={false}
                dismissableMask={true} style={{ width: '400px' }} onHide={props.onHide}>
            <div className="grid">
                <div className='col-5'>
                    <img src={clientRepresentative.imageURL} alt="logo" width={120} style={{borderRadius: '50%'}} />
                </div>
                <div className='col-7'>
                    <div className="grid">
                        <div className='col-12' style={{fontSize: 'x-large'}}>
                            <b>{clientRepresentative.name}</b>
                        </div>
                        <div className='col-12'>
                            {clientRepresentative.phoneNumber}
                        </div>
                        <div className='col-12'>
                            {clientRepresentative.email}
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}