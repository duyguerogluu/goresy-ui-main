import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useHistory } from "react-router-dom";
import { PartnerService } from '../../service/PartnerService';
import { SplitButton } from 'primereact/splitbutton';
import { Fieldset } from 'primereact/fieldset';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { NewPartnerDialogue } from '../../pages/dialogues/NewPartnerDialogue';

export const PartnerListPage = () => {
    const { t, i18n } = useTranslation();
    const toast = useRef(null);

    let history = useHistory();

    const [partnerList, setPartnerList] = useState([]);
    const [newPartnerDialog, setNewPartnerDialog] = useState(false);
    const [deletePartnerDialog, setDeletePartnerDialog] = useState(false);
    const [selectedPartnerIndex, setSelectedPartnerIndex] = useState(null);

    const [selectedPartner, setSelectedPartner] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const partnerService = new PartnerService();
    useEffect(() => {
        partnerService.getPartners().then(data => { setPartnerList(data); setLoading(false) });
    }, []);

    
    const filtersMap = {
        'filters': { value: filters, callback: setFilters },
    };
    const renderHeader = (filtersKey) => {
        const filters = filtersMap[`${filtersKey}`].value;
        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={filters['global'].value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder={t('search')} />
            </span>
        );
    }
    const header1 = renderHeader('filters');


    const onGlobalFilterChange = (event, filtersKey) => {
        const value = event.target.value;
        let filters = { ...filtersMap[filtersKey].value };
        filters['global'].value = value;

        filtersMap[filtersKey].callback(filters);
    }
    const deleteButtonTemplate = (rowData, info) => {
        return <div className="flex justify-content-end"><Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => { setDeletePartnerDialog(true); setSelectedPartnerIndex(info.rowIndex) }} />
        </div>;
    }

    const deletePartner = () => {
        setLoading(true);
        let partners = [...partnerList];
        partnerService.deletePartnerById(partners[selectedPartnerIndex].id)
            .then(data => { setPartnerList(partners); setLoading(false); setDeletePartnerDialog(false); });
        partners.splice(selectedPartnerIndex, 1);
    }

    const categoryBody = (rowData) => {
        return <span >{t(rowData.category)}</span>;
    }

    const genderBodyTemplate = (rowData) => {
        return <span >{t(rowData.customerGender)}</span>;
    };

    const hideDialog = () => {
        setDeletePartnerDialog(false);
        setNewPartnerDialog(false);
    }

    const detailsButtonItems = (partnerId) => [
        {
            label: t('staff_list'),
            icon: 'pi pi-users',
            command: () => { history.push('/admin/partners-staff-list/'+partnerId) },
        },
        {
            label: t('settings'),
            icon: 'pi pi-cog',
            command: () => { history.push('/admin/partners-settings/'+partnerId) }
        },
        {
            label: t('photos'),
            icon: 'pi pi-images',
            command: () => { history.push('/admin/partners-photos') }
        },
        {
            label: t('invoices'),
            icon: 'pi pi-money-bill',
            command: () => { history.push('/admin/partners-invoices') }
        },
        {
            label: t('use_panel'),
            icon: 'pi pi-window-maximize',
            command: () => { history.push('/admin/partners-use-panel') }
        }
    ];

    const deletePartnerDialogFooter = (
        <React.Fragment>
            <Button label={t('no')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('yes')} icon="pi pi-check" className="p-button-text" onClick={deletePartner} />
        </React.Fragment>
    );

    const editButtonTemplate = (rowData) => {

        return (
            <div className="flex justify-content-end">
                <SplitButton 
                    label={t('edit')} 
                    model={detailsButtonItems(rowData.id)}
                    onClick={(e)=>clickEditButton(e)}
                 />
            </div>
        );
    }

    const clickEditButton = (e) => {
        history.push({pathname: e.value.to + e.param, state: e});
    }

    return (
        <div>
            <div className="card">
                <div className="grid">
                    <div className="flex justify-content-start flex-wrap card-container col">
                        <h2><b>{t('partners')}</b></h2>
                    </div>
                    <div className="flex justify-content-end flex-wrap card-container col">
                        <Button label={t('add_new_partner')} icon="pi pi-plus" style={{ padding: '.45rem 1rem', marginBottom: "1rem", marginLeft: '1rem' }} className="p-button-success" onClick={() => setNewPartnerDialog(true)} />
                    </div>
                </div>
                <DataTable paginator value={partnerList} responsiveLayout="scroll" header={header1} filters={filters} onFilter={(e) => setFilters(e.filters)} rows={20}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[20, 50, 100]}
                    loading={loading} emptyMessage={t('no_records_found')} currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                    <Column field="name" header={t('partner')} sortable ></Column>
                    <Column field="city" header={t('city')} sortable ></Column>
                    <Column field="district" header={t('district')} sortable ></Column>
                    <Column field="category" body={categoryBody} header={t('category')} sortable filter></Column>
                    <Column field="customerGender" body={genderBodyTemplate} header={t('customer_gender')} sortable filter></Column>
                    <Column header="" body={deleteButtonTemplate}></Column>
                    <Column header="" body={editButtonTemplate}></Column>
                </DataTable>
            </div>
            <Dialog visible={deletePartnerDialog} style={{ width: '450px' }} header={t('confirm')} modal footer={deletePartnerDialogFooter} onHide={hideDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {<span>{t('confirm_delete')}</span>}
                </div>
            </Dialog>
            <NewPartnerDialogue visible={newPartnerDialog} partner={selectedPartner} onHide={hideDialog}></NewPartnerDialogue>
        </div>
    );
}
