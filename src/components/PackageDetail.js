import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

export const PackageDetail = (props) => {

    const { t } = useTranslation();

    return (
        <div className="grid">
            <div className='col-2'>
                <InputText className="inputfield w-full" keyfilter={"pint"} value={props.item.quantity ? props.item.quantity : ""} onChange={(e) => props.onUpdate("quantity", e.target.value)} placeholder={t('quantity')}  />
            </div>
            <div className='col-3'>
                <Dropdown value={props.item.packageType} options={props.packageTypes} onChange={e => props.onUpdate("packageType", e.target.value)} placeholder={t('package_type')} className='inputfield w-full' />
            </div>
            <div className='col-3'>
                <Dropdown value={props.item.service} filter={true} options={props.services} onChange={e => props.onUpdate("service", e.target.value)} placeholder={t('service')} className='inputfield w-full' />
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
