
import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { ReportService } from '../service/ReportService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

export const StaffReportPage = () => {
    const { t } = useTranslation();

    let emptyPackageSale = {
        id: null,
        name: '',
        phone: null,
        email: null,
        birthDate: null,
        registerDate: null,
        reservationCount: 0
    };

    const [packageSale, setPackage] = useState(emptyPackageSale);
    const [packageSales, setPackages] = useState(null);
    // const [selectedPackages, setSelectedPackages] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [packageSaleDialog, setPackageDialog] = useState(false);
    const [notes, setNotes] = useState('');
    const [clientName, setClientName] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [addSelectedClock, setSelectedClock] = useState('');
    const [addSelectedCost, setSelectedCost] = useState('');
    const [addSelectedCount, setSelectedCount] = useState('');
    const [selectedPackageName, setSelectedPackageName] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [deletePackageDialog, setDeletePackageDialog] = useState(false);

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'phone': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'registerDate': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        'lastAppointmentDate': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        'reservationCount': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'rewardPoints': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'restriction': { value: null, matchMode: FilterMatchMode.BETWEEN }
    });

    const packageSaleNames = [
        { label: 'Seans', value: 'Seans' },
        { label: 'Dakika', value: 'Dakika' }
    ];

    const packageServiceNames = [
        { label: 'Keratin Şampuanı', value: 'Keratin Şampuan' },
        { label: 'Bakım Şampuanı', value: 'Bakım Şampuanı' },
        { label: 'Saç Maskesi', value: 'Saç Maskesi' },
        { label: 'Tuzsuz Şampuan Sandra', value: 'Tuzsuz Şampuan Sandra' },
    ];

    const paymentMethods = [
        { label: 'Nakit', value: 'Nakit' },
        { label: 'Kredi Kartı', value: 'Kredi Kartı' }
    ];

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const dt = useRef(null);
    
    const reportService = new ReportService();

    useEffect(() => {
        reportService.getReportStaffSmall().then(data => { setPackages(getPackages(data)); setLoading(false) });
    }, []); 

    const getPackages = (data) => {
        return [...data || []].map(d => {
            d.date = new Date(d.date);
            return d;
        });
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const onPackageNameChange = (e) => {
        setSelectedPackageName(e.value);
    }

    const onServiceChange = (e) => {
        setSelectedService(e.value);
    }

    const hideDialog = () => {
        setPackageDialog(false);
        setDeletePackageDialog(false);
    }

    const savePackageSale = () => {
        let emptyPackageSale = {
            clientName: clientName,
            sellerName: sellerName,
            packageSale: selectedPackageName,
            count: addSelectedCount,
            cost: addSelectedCost,
            notes: notes
        }
        let packageSaleSaleCopy = [...packageSales, emptyPackageSale];
        setPackages(packageSaleSaleCopy);
        hideDialog();
    }


    // const onInputChange = (e, name) => {
    //     const val = (e.target && e.target.value) || '';
    //     let _packageSale = {...packageSale};
    //     _packageSale[`${name}`] = val;

    //     setPackage(_packageSale);
    // }

    // const confirmDeletePackage = (packageSale) => {
    //     setPackage(packageSale);
    //     setDeletePackageDialog(true);
    // }

    const deletePackage = () => {
        let _packageSales = packageSales.filter(val => val.id !== packageSale.id);
        setPackages(_packageSales);
        setDeletePackageDialog(false);
        setPackage(emptyPackageSale);
    }

    // const editPackage = (packageSale) => {
    //     setPackage({...packageSale});
    //     setPackageDialog(true);
    // }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    // const onSelectionDetail = (e) => {
    //     setSelectedPackages(e.value)
    //     setPackageDialog(false);
    // }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">{t('staff_reports')}</h5>
                <span className="p-input-icon-right">
                    <i className="pi pi-export"/>
                    <Button label={t('export')} icon="pi pi-upload" className="p-button-help" onClick={exportCSV}/>
                    <span> </span>  
                    <i className="pi pi-search"/>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t('search')}/>
                </span>
            </div>
        )
    }

    const header = renderHeader();

    // const actionBodyTemplate = (rowData) => {
    //     return (
    //         <React.Fragment>
    //             <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPackage(rowData)} />
    //             <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePackage(rowData)} />
    //         </React.Fragment>
    //     );
    // }

    const packageSaleDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePackageSale} />
        </React.Fragment>
    );

    const deletePackageDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletePackage} />
        </React.Fragment>
    );

    return (
        <div className="datatable-doc-demo col-12">
            <div className="card">
                <DataTable 
                    value={packageSales} 
                    ref={dt} 
                    paginator 
                    className="p-datatable-packageSales" 
                    header={header} 
                    rows={8}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    rowsPerPageOptions={[10,25,50]}
                    dataKey="id" 
                    rowHover 
                    // selectionMode="single" 
                    // selection={selectedPackages} 
                    // onSelectionChange={onSelectionDetail}
                    filters={filters} 
                    filterDisplay="menu" 
                    loading={loading} 
                    responsiveLayout="scroll"
                    globalFilterFields={['name', 'phone', 'reservationCount', 'registerDate', 'lastAppointmentDate', 'rewardPoints', 'restriction' ]} 
                    emptyMessage={t('no_staff_report_found')}
                    currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}
                >
                    {/* <Column selectionMode="single" headerStyle={{ width: '2rem' }}></Column> */}
                    <Column field="employee" header={t('name_surname')} sortable filter dataType="count"></Column>
                    <Column field="serviceTurnover" header={t('service_turnover')} sortable filter dataType="count"></Column>
                    <Column field="serviceCommission" header={t('service_commission')} sortable filter dataType="date"></Column>
                    <Column field="productSaleTurnover" header={t('product_sale_turnover')} sortable filter dataType="service"></Column>
                    <Column field="productSaleCommission" header={t('product_sale_commission')} sortable filter dataType="quantity"></Column>
                    <Column field="packageSaleTurnover" header={t('package_sale_turnover')} sortable filter dataType="totalUsage"></Column>
                    <Column field="packageSaleCommission" header={t('package_sale_commission')} sortable filter dataType="remainingUsage"></Column>
                    <Column field="totalTurnover" header={t('total_turnover')} sortable filter dataType="totalAmount"></Column>
                    <Column field="totalCommission" header={t('total_commission')} sortable filter dataType="paidAmount"></Column>
                    <Column field="fixedIncome" header={t('fixed_income')} sortable filter dataType="paidAmount"></Column>
                    <Column field="totalEarning" header={t('total_earning')} sortable filter dataType="paidAmount"></Column>
                    <Column field="paidAmount" header={t('paid_amount')} sortable filter dataType="paidAmount"></Column>
                    <Column field="remainingPayment" header={t('remaining_payment')} sortable filter dataType="paidAmount"></Column>
                </DataTable>
            </div>
            <Dialog visible={packageSaleDialog} style={{ width: '600px' }} header={t('detail_package_sale')} modal className="p-fluid" footer={packageSaleDialogFooter} onHide={hideDialog}>
                <div className='grid' style={{ marginTop: '.5rem' }}>
                    <div className="col-12">
                        <Calendar id="date" value={addSelectedClock} onChange={(e) => setSelectedClock(e.value)} dateFormat="dd/mm/yy" showIcon placeholder={t('date')} />
                    </div>
                    <div className='col-12'>
                        <InputText className='inputfield w-full' value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={t('customer_name_surname')} />
                    </div>
                    <div className="grid col-12">
                        <div className='col-6'>
                            <Dropdown className='inputfield w-full' value={selectedPackageName} options={packageSaleNames} onChange={onPackageNameChange} optionLabel="label" placeholder={t('package')} />
                        </div>
                        <div className='col-6'>
                            <Dropdown className='inputfield w-full' value={selectedService} options={packageServiceNames} onChange={onServiceChange} optionLabel="label" placeholder={t('service')} />
                        </div>
                    </div>
                    <div className="grid col-12">
                        <div className="col-3" style={{ marginTop: '.65rem' }}>
                            <label htmlFor="cost">{t('cost')}</label>
                        </div>
                        <div className="col-3">
                            <InputNumber inputId="currency-turkey" value={addSelectedCost} onValueChange={(e) => setSelectedCost(e.value)} mode="currency" currency="TRY" />
                        </div>
                        <div className="col-3" style={{ marginTop: '.65rem' }}>
                            <label htmlFor="cost">{t('count')}</label>
                        </div>
                        <div className="col-3">
                            <InputNumber inputId="horizontal" value={addSelectedCount} onValueChange={(e) => setSelectedCount(e.value)} showButtons buttonLayout="horizontal" step={1}
                                decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
                        </div>
                    </div>
                    <div className='col-12'>
                        <Dropdown className='inputfield w-full' value={selectedPaymentMethod} options={paymentMethods} onChange={(e) => setSelectedPaymentMethod(e.target.value)} optionLabel="label" placeholder={t('payment_method')} />
                    </div>
                    <div className='col-12'>
                        <InputText className='inputfield w-full' value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder={t('seller_name')} />
                    </div>
                    <div className='col-12'>
                        <InputTextarea className='inputfield w-full' value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notes')} />
                    </div>
                </div>    
            </Dialog>
            <Dialog visible={deletePackageDialog} style={{ width: '450px' }} header={t('confirm')} modal footer={deletePackageDialogFooter} onHide={hideDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {packageSale && <span>{t('confirm_delete')}</span>}
                </div>
            </Dialog>
        </div>
    );
}
                 