import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

export const ProductDetail = (props) => {

    const { t } = useTranslation();

    return (
        <div className="grid">
            <div className='col-6'>
                <Dropdown value={props.item.label} options={props.savedProducts} onChange={(e) => {
                    props.onUpdate("label", e.target.value);
                    props.onUpdate("amount", e.target.value.amount)
                    props.onUpdate("id", e.target.value.id)
                }} placeholder={t('product')} className='inputfield w-full' />
            </div>
            <div className='col-2'>
                <InputText className="inputfield w-full" keyfilter={"pint"} value={props.item.quantity ? props.item.quantity : ""} onChange={(e) => props.onUpdate("quantity", e.target.value)} placeholder={t('quantity')}  />
            </div>
            <div className='col-3'>
                <div className="p-inputgroup">
                    <InputText className="inputfield w-full" keyfilter={"pint"} value={props.item.amount ? props.item.amount : ""} onChange={(e) => props.onUpdate("amount", e.target.value)} placeholder={t('amount')}  />
                    <span className="p-inputgroup-addon">₺</span>
                </div>
            </div>
            <div className='col-1'>
                <Button className='p-button-danger p-button-icon-only' icon="pi pi-trash" onClick={() => {props.onDelete()}} disabled={!props.deletable} />
            </div>
        </div>
    );
}
