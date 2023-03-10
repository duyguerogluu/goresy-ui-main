import React, {useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {CustomerService} from "../../service/CustomerService";
import {CreditService} from "../../service/CreditService";
import {Toast} from "primereact/toast";
import {AutoComplete} from "primereact/autocomplete";
import {connect} from "react-redux";

const NewClaimDialogue = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);

    const [newClaimDate, setNewClaimDate] = useState(new Date());
    const [newClaimPaymentDate, setNewClaimPaymentDate] = useState();
    const [newClaimPerson, setNewClaimPerson] = useState("");
    const [newClaimAmount, setNewClaimAmount] = useState("");
    const [newClaimNotes, setNewClaimNotes] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const customerService = new CustomerService();
    const creditService = new CreditService();

    const searchCustomer = (event) => {
        customerService.getCustomersOfPartner(props.partnerId, event.query).then(data => {
            if (data.content && data.content.length > 0) {
                setFilteredCustomers(data.content);
            }
        })
    }

    const postClaim = () => {
        creditService.postCredit({
            fullName: newClaimPerson.fullName,
            customerId: newClaimPerson.id,
            dueDate: newClaimPaymentDate,
            notes: newClaimNotes,
            totalAmount: newClaimAmount,
            partnerId: props.partnerId
        })
            .then(() => props.onHide(false))
            .catch(() => {
                toast.current.show({
                    severity: 'error',
                    summary: t('save_fail'),
                    detail: t('new_claim_save_fail')
                });
            });
    }

    return (
        <Dialog header={t('new_claim')} visible={props.visible} resizable={false} draggable={false} dismissableMask={true} style={{ width: '500px' }} onHide={props.onHide}>
            <Toast ref={toast} />
            <div className="grid p-fluid">
                <div className='col-12'>
                    <Calendar value={newClaimDate} onChange={(e) => setNewClaimDate(e.target.value)} dateFormat="dd MM yy" showButtonBar showIcon style={{width: '100%'}}></Calendar>
                </div>
                <div className='col-12'>
                    <AutoComplete
                        delay={500} minLength={3} value={newClaimPerson} suggestions={filteredCustomers}
                        completeMethod={searchCustomer} field="fullName" aria-label={t('person')}
                        onChange={(e) => setNewClaimPerson(e.value)} placeholder={t('person')}
                    />
                </div>
                <div className='col-12'>
                    <div className="p-inputgroup">
                        <InputText className="inputfield w-full" keyfilter={"pint"} value={newClaimAmount} onChange={(e) => setNewClaimAmount(e.target.value)} placeholder={t('amount')} />
                        <span className="p-inputgroup-addon">₺</span>
                    </div>
                </div>
                <div className='col-5' style={{marginTop: '.5rem'}}>
                    <p>{t('estimated_payment_date')}: </p>
                </div>
                <div className='col-7'>
                    <Calendar value={newClaimPaymentDate} onChange={(e) => setNewClaimPaymentDate(e.target.value)} dateFormat="dd MM yy" showButtonBar showIcon style={{width: '100%'}}></Calendar>
                </div>
                <div className='col-12'>
                    <InputText className="inputfield w-full" value={newClaimNotes} onChange={(e) => setNewClaimNotes(e.target.value)} placeholder={t('notes')} />
                </div>
                <div className='col-12'>
                    <Button label={t('save')} className="p-button-success" onClick={() => {postClaim()}}/>
                </div>
            </div>
        </Dialog>
    );
}

const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id
    };
};

export default connect(mapStateToProps, null)((NewClaimDialogue));
