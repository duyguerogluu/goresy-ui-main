import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { useHistory } from "react-router-dom";
import { InvoiceService } from '../../service/InvoiceService';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import {connect} from "react-redux";
import moment from 'moment';

export const InvoiceListPage = () => {
    const { t, i18n } = useTranslation();
    const toast = useRef(null);

    let emptyPayment = {
        amount: null,
        cardOwnerName: null,
        cardNumber: null,
        cvv: null,
        partnerId: 0
    };

    const [selectedInvoice, setSelectedInvioce] = useState(emptyPayment);
    const [invoiceList, setInvoiceList] = useState(null);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [saveTheCard, setSaveTheCard] = useState(false);

    const months = [
        { label: t('1'), value: '1'},
        { label: t('2'), value: '2'},
        { label: t('3'), value: '3'},
        { label: t('4'), value: '4'},
        { label: t('5'), value: '5'},
        { label: t('6'), value: '6'},
        { label: t('7'), value: '7'},
        { label: t('8'), value: '8'},
        { label: t('9'), value: '9'},
        { label: t('10'), value: '10'},
        { label: t('11'), value: '11'},
        { label: t('12'), value: '12'}
    ];

    const years = [
        { label: t('2021'), value: '2021'},
        { label: t('2022'), value: '2022'},
        { label: t('2023'), value: '2023'},
        { label: t('2024'), value: '2024'},
        { label: t('2025'), value: '2025'},
        { label: t('2026'), value: '2026'},
        { label: t('2027'), value: '2027'},
        { label: t('2028'), value: '2028'},
        { label: t('2029'), value: '2029'},
        { label: t('2030'), value: '2030'},
        { label: t('2031'), value: '2031'},
        { label: t('2032'), value: '2032'}
    ];

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const filtersMap = {
        'filters': { value: filters, callback: setFilters },
    };

    const invoiceService = new InvoiceService();

    const dt = useRef(null);

    useEffect(() => {
        invoiceService.getInvoices().then(data => { setInvoiceList(data.content) });
    }, []); 

    const onGlobalFilterChange = (event, filtersKey) => {
        const value = event.target.value;
        let filters = { ...filtersMap[filtersKey].value };
        filters['global'].value = value;

        filtersMap[filtersKey].callback(filters);
    }

    const dateBodyTemplateCreation = (date) => {
        return moment(date.createdDate).format('DD/MM/YYYY')
    }

    const dateBodyTemplateDue = (date) => {
        return moment(date.dueDate).format('DD/MM/YYYY')
    }

    const dateBodyTemplatePayment = (date) => {
        return moment(date.paymentDate).format('DD/MM/YYYY')
    }

    const renderHeader = (filtersKey) => {
        const filters = filtersMap[`${filtersKey}`].value;

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={filters['global'].value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder={t('search')}/>
            </span>
        );
    }

    const detailsBodyTemplate = (rowData, info) => {
       return (
            <div className="flex justify-content-between align-items-center">
                <span className="p-input-icon-right">
                    <i className="pi pi-add"/>
                    <Button label={t('pay')} icon="pi pi-money-bill" className="p-button-success" onClick={() => { payTheBill(rowData)} }/>
                </span>
                <span className="p-input-icon-right" style={{ marginLeft: '1rem' }}>
                    <i className="pi pi-export"/>
                    <Button label={t('export')} icon="pi pi-download" className="p-button-help" onClick={exportCSV}/>
                </span>
            </div>
        )
    }

    const payTheBill = (rowData) => {
        setSelectedInvioce(rowData)
        showInfo()
        setSubmitted(false);
        setPaymentDialog(true); 
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const hideDialog = () => {
        setSubmitted(false);
        setPaymentDialog(false);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let emptyPayment = {...emptyPayment};
        emptyPayment[`${name}`] = val;
        
        selectedInvoice(emptyPayment);
    }

    const showInfo = () => {
        toast.current.show({severity: 'info', summary: 'Sticky Message', detail: 'Message Content', life: 3000, content: (
            <div className="flex flex-column" style={{flex: '1'}}>
                <div className="text-center">
                    <p>{t('bills_2')}</p>
                </div>
            </div>
        )});
    }

    const clear = () => {
        toast.current.clear();
    }

    const header1 = renderHeader('filters');
    let history = useHistory();
    
    return (
        <div>
            <Toast ref={toast} position="top-center"/>
            <div className="card">
                <h2><b>{t('invoices')}</b></h2>
                <DataTable value={invoiceList} ref={dt} responsiveLayout="scroll" header={header1}>
                    <Column field="invoiceTitle" header={t('invoice_title')} sortable></Column>
                    <Column field="amount" header={t('amount')} sortable></Column>
                    <Column body={dateBodyTemplateCreation} header={t('creation_date')} sortable></Column>
                    <Column body={dateBodyTemplateDue} header={t('due_date')} sortable></Column>
                    <Column field="invoiceStatus" header={t('invoice_status')} sortable></Column>
                    <Column field="paymentStatus" header={t('payment_status')} sortable></Column>
                    <Column body={dateBodyTemplatePayment} field="paymentDate" header={t('payment_date')} sortable></Column>
                    <Column header="" body={detailsBodyTemplate}></Column>
                </DataTable>
            </div>
            <Dialog header={t('payment')} visible={paymentDialog} resizable={false} draggable={false} dismissableMask={true} style={{ width: '700px' }} onHide={hideDialog}>
                <div className="grid p-fluid">
                    <div className="grid col-12" style={{marginTop: '.5rem'}}>
                        <div className='col-4'>
                            <label style={{ fontWeight:'bold'}} htmlFor="name">{t('amount_of_payment')} :</label>    
                        </div>
                        <div className="col-8">
                            <label htmlFor="amount">{selectedInvoice.amount} TL</label>    
                        </div>
                    </div>
                    <div className='col-12'>
                        <Button label={t('use_saved_card')} className="p-button-info"/>
                    </div>
                    <div className="col-12">
                         <InputText id="name" value={selectedInvoice.cardOwnerName} onChange={(e) => onInputChange(e, 'cardOwnerName')} required autoFocus placeholder={t('card_owner_name')}/>
                    </div>
                    <div className="col-12">
                         <InputText id="card" value={selectedInvoice.cardNumber} onChange={(e) => onInputChange(e, 'cardNumber')} required autoFocus placeholder={t('card_number')}/>
                    </div>
                    <div className="grid col-12">
                        <div className='col-4' style={{marginTop: '.5rem'}}>
                            <label style={{ fontWeight:'bold'}}  htmlFor="date">{t('expire_date')}</label>    
                        </div>
                        <div className="col-4">
                            <Dropdown value={selectedMonth} options={months} onChange={(e) => onInputChange(e, 'selectedMonth')} optionLabel="label" placeholder={t('month')}/>
                        </div>
                        <div className="col-4">
                            <Dropdown value={selectedYear} options={years} onChange={(e) => onInputChange(e, 'selectedYear')} optionLabel="label" placeholder={t('year')}/>
                        </div>
                    </div>
                    <div className="grid col-12">
                        <div className='col-4' style={{marginTop: '.5rem'}}>
                            <label style={{ fontWeight:'bold'}}  htmlFor="date">{t('CVV')}</label>    
                        </div>
                        <div className="col-8">
                            <InputText id="name" value={selectedInvoice.cvv} onChange={(e) => onInputChange(e, 'cvv')} required autoFocus placeholder={t('XXX')}/>
                        </div>
                    </div>
                    <div className="col-12">
                        <Checkbox inputId="save" checked={saveTheCard} onChange={e => setSaveTheCard(e.checked)} />
                        <label style={{ marginLeft: '.5rem', marginBottom: '5rem' }} htmlFor="save">{t('save_the_card')}</label>
                    </div>
                    <div className='col-12'>
                        <Button label={t('save')} className="p-button-success" onClick={hideDialog}/>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
