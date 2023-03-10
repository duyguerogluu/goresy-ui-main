import React, {useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import * as actions from "../../store/actions";
import {connect} from "react-redux";
import {AutoComplete} from "primereact/autocomplete";
import { CustomerService } from "../../service/CustomerService";
import { DebtService } from "../../service/DebtService";
import {Toast} from "primereact/toast";

const NewDebtDialogue = (props) => {
    const { t } = useTranslation();
    const toast = useRef(null);

    const [newDebtDate, setNewDebtDate] = useState(new Date());
    const [newDebtPaymentDate, setNewDebtPaymentDate] = useState();
    const [newDebtPerson, setNewDebtPerson] = useState("");
    const [newDebtAmount, setNewDebtAmount] = useState("");
    const [newDebtNotes, setNewDebtNotes] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const customerService = new CustomerService();
    const debtService = new DebtService();

    const searchCustomer = (event) => {
        customerService.getCustomersOfPartner(props.partnerId, event.query).then(data => {
            if (data.content && data.content.length > 0) {
                setFilteredCustomers(data.content);
            }
        })
    }

    const postDebt = () => {
        debtService.postDebt({
            fullName: newDebtPerson.fullName,
            customerId: newDebtPerson.id,
            dueDate: newDebtPaymentDate,
            notes: newDebtNotes,
            totalAmount: newDebtAmount,
            partnerId: props.partnerId
        })
            .then(() => props.onHide(false))
            .catch(() => {
                toast.current.show({
                    severity: 'error',
                    summary: t('save_fail'),
                    detail: t('new_debt_save_fail')
                });
            });
    }

    return (
        <Dialog header={t('new_debt')} visible={props.visible} resizable={false} draggable={false} dismissableMask={true} style={{ width: '500px' }} onHide={props.onHide}>
            <Toast ref={toast} />
            <div className="grid p-fluid">
                <div className='col-12'>
                    <Calendar value={newDebtDate} onChange={(e) => setNewDebtDate(e.target.value)} dateFormat="dd MM yy" showButtonBar showIcon style={{width: '100%'}}></Calendar>
                </div>
                <div className='col-12'>
                    <AutoComplete
                        delay={500} minLength={3} value={newDebtPerson} suggestions={filteredCustomers}
                        completeMethod={searchCustomer} field="fullName" aria-label={t('person')}
                        onChange={(e) => setNewDebtPerson(e.value)} placeholder={t('person')}
                    />
                </div>
                <div className='col-12'>
                    <div className="p-inputgroup">
                        <InputText className="inputfield w-full" keyfilter={"pint"} value={newDebtAmount} onChange={(e) => setNewDebtAmount(e.target.value)} placeholder={t('amount')}  />
                        <span className="p-inputgroup-addon">₺</span>
                    </div>
                </div>
                <div className='col-5' style={{marginTop: '.5rem'}}>
                    <p>{t('estimated_payment_date')}: </p>
                </div>
                <div className='col-7'>
                    <Calendar value={newDebtPaymentDate} onChange={(e) => setNewDebtPaymentDate(e.target.value)} dateFormat="dd MM yy" showButtonBar showIcon style={{width: '100%'}}></Calendar>
                </div>
                <div className='col-12'>
                    <InputText className="inputfield w-full" value={newDebtNotes} onChange={(e) => setNewDebtNotes(e.target.value)} placeholder={t('notes')} />
                </div>
                <div className='col-12'>
                    <Button label={t('save')} className="p-button-success" onClick={() => {postDebt()}}/>
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

export default connect(mapStateToProps, null)((NewDebtDialogue));
