import React from 'react';
import {connect} from "react-redux";
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";

import * as actions from "../../store/actions";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import CustomChip from "../../components/CustomChip";
import {Button} from "primereact/button";


const AwaitingAppointmentDialogue = (props) => {

    const { t } = useTranslation();

    const replyBodyTemplate = (rowData, row) => {
        return <div>
            <Button
                style={{marginRight: '.3rem'}}
                className="p-button-icon-only p-button-success"
                icon="pi pi-check"
                tooltip={t('approve')}
            />
            <Button
                style={{marginRight: '.3rem'}}
                className="p-button-icon-only p-button-danger"
                icon="pi pi-times"
                tooltip={t('reject')}
            />
            <Button
                className="p-button-warning"
                icon="pi pi-pencil"
                tooltip={t('suggest_new_time')}
            />
        </div>
    }

    const servicesBodyTemplate = (rowData) => {
        return rowData.services && rowData.services.length > 0 && rowData.services.map((data, i) => (
            <CustomChip
                key={`${data.name}${i}`}
                label={data.name}
            />
        ))
    }

    const dateBodyTemplate = (rowData) => {
        return new Date(rowData.startTime).toLocaleDateString();
    }

    const timeBodyTemplate = (rowData) => {
        return new Date(rowData.startTime).toLocaleTimeString();
    }

    return (
        <Dialog 
            header={t('awaiting_appointments')}
            visible={props.visible} 
            resizable={false} 
            draggable={false} 
            dismissableMask={true} 
            style={{ width: '900px' }} 
            onHide={props.onHide}
        >
            <div>
                <DataTable value={props.awaitingAppointments} responsiveLayout="scroll">
                    <Column field="customerFullname" header={t('customer')} filter filterField={"customerFullname"}></Column>
                    <Column header={t('services')} body={servicesBodyTemplate}  filter filterField={"services"}/>
                    <Column header={t('date')} body={dateBodyTemplate} sortable></Column>
                    <Column header={t('clock')} body={timeBodyTemplate} sortable></Column>
                    <Column header={t('reply')} body={replyBodyTemplate}></Column>
                </DataTable>
            </div>

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
        partner: state.auth.userDetails.partner
    };
};

export default connect(mapStateToProps, mapDispatchToProps)((AwaitingAppointmentDialogue));

