import React, {useState, useRef, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import { Toast } from 'primereact/toast';
import { CustomerService } from '../../service/CustomerService';
import {connect} from "react-redux";

const NewCustomerDialogue = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);

    const [phoneCode, setPhoneCode] = useState('+90');
    const [birthDate, setBirthDate] = useState()
    const [fullName, setFullName] = useState("");
    const [mailAddress, setMailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [gender, setGender] = useState("");
    const [notes, setNotes] = useState("");

    const phoneCodes = [
        { label: 'United States (+1)', value: '+1' },
        { label: 'Turkey (+90)', value: '+90' }
    ]
    const genders = [
        { label: t('undefined'), value: 'undefined' },
        { label: t('male'), value: 'male' },
        { label: t('female'), value: 'female' }
    ]

    const customerService = new CustomerService();

    useEffect(() => {
        if (props.customerName) {
            setFullName(props.customerName);
        }
    }, [props.customerName]);

    const phoneCodeTemplate = (item) => {
        return <div>{item ? item.value : ""}</div> ;
    };

    const saveCustomer = () => {
      let customer = {
        partnerId: props.partnerId,
        fullName: fullName,
        email: mailAddress,
        phone: phoneCode+phoneNumber,
        dateOfBirth: birthDate,
        gender: gender,
        notes: notes,
      };
      customerService.postCustomer(customer).then((data) => {
        props.onHide(false);
        toast.current.show({
          severity: "success",
          summary: t("save_successed"),
          detail: t("save_completed_successfully"),
          life: 3000,
        });
      });
    };

    return (
        <Dialog header={t('new_customer')} visible={props.visible} resizable={false} draggable={false} dismissableMask={true} style={{ width: '500px' }} onHide={props.onHide}>
            <Toast ref={toast} />
            <div className="grid p-fluid">
                <div className='col-12'>
                    <InputText className="inputfield w-full" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t('name_surname')} />
                </div>
                <div className='col-3'>
                    <Dropdown value={phoneCode} filter={true} options={phoneCodes} onChange={e => setPhoneCode(e.target.value)} valueTemplate={phoneCodeTemplate} className='inputfield w-full' />
                </div>
                <div className='col-9'>
                    <InputText className="inputfield w-full" keyfilter={"pint"} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={t('phone_number')}  />
                </div>
                <div className='col-12'>
                    <InputText className="inputfield w-full" value={mailAddress} onChange={(e) => setMailAddress(e.target.value)} placeholder={t('email_address')} />
                </div>
                <div className='col-12'>
                    <Calendar value={birthDate} onChange={(e) => setBirthDate(e.target.value)} monthNavigator yearNavigator yearRange="1940:2010"  dateFormat="dd MM yy" showButtonBar showIcon placeholder={t('date_of_birth')} style={{width: '100%'}}></Calendar>
                </div>
                <div className='col-12'>
                    <Dropdown value={gender} options={genders} onChange={e => setGender(e.target.value)} placeholder={t('gender')} className='inputfield w-full' />
                </div>
                <div className='col-12'>
                    <InputText className="inputfield w-full" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notes')} maxLength="255"/>
                </div>
                <div className='col-12'>
                    <Button label={t('save')} className="p-button-success" onClick={saveCustomer}/>
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

export default connect(mapStateToProps, null)((NewCustomerDialogue));