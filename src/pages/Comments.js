
import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { ReportService } from '../service/ReportService';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';


export const Comments = () => {
    const { t, i18n } = useTranslation();

    let emptyComment = {
        id: null,
        name: '',
        phone: null,
        email: null,
        birthDate: null,
        registerDate: null,
        reservationCount: 0
    };

    const [commentSale, setComment] = useState(emptyComment);
    const [comment, setComments] = useState(null);
    const [selectedComments, setSelectedComments] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [commentDialog, setCommentDialog] = useState(false);
    const [commentDetailDialog, setCommentDetailDialog] = useState(false);
    const [reply, setReply] = useState('');
    const [clientName, setClientName] = useState('');
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(null);
    const [addSelectedCost, setSelectedCost] = useState('');
    const [addSelectedCount, setSelectedCount] = useState('');
    const [selectedCommentName, setSelectedCommentName] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [deleteCommentDialog, setDeleteCommentDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

    const commentNames = [
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
    const toast = useRef(null);
    const dt = useRef(null);
    
    const reportService = new ReportService();

    useEffect(() => {
        reportService.getCommentsSmall().then(data => { setComments(getComments(data)); setLoading(false) });
    }, []); 

    const getComments = (data) => {
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

    const onCommentNameChange = (e) => {
        setSelectedCommentName(e.value);
    }

    const onServiceChange = (e) => {
        setSelectedService(e.value);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCommentDialog(false);
        setCommentDetailDialog(false);
        setDeleteCommentDialog(false);
    }

    const saveEditedComment = () => {
        /*let emptyComment = {
            clientName: clientName,
            feedback: feedback,
            service: selectedService,
            rating: rating,
            cost: addSelectedCost,
            reply: reply
        }
        let commentCopy = [...comment, emptyComment];*/
        setComment({...comment});
        //setComments(commentCopy);
        hideDialog();
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _comment = {...comment};
        _comment[`${name}`] = val;

        setComment(_comment);
    }

    const confirmDeleteComment = (comment) => {
        setComment(comment);
        setDeleteCommentDialog(true);
    }

    const deleteComment = () => {
        let _comment = comment.filter(val => val.id !== comment.id);
        setComments(_comment);
        setDeleteCommentDialog(false);
        setComment(emptyComment);
    }

    const editComment = (comment) => {
        setComment({...comment});
        setCommentDialog(true);
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const onSelectionDetail = (e) => {
        setSelectedComments(e.value)
        setCommentDialog(false);
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">{t('comments')}</h5>
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
    let history = useHistory();

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                 <Button label={t('reply')} onClick={() => editComment(rowData)} />
            </React.Fragment>
        );
    }

    const commentDialogFooter = (
        <React.Fragment>
            <Button label={t('cancel')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('save')} icon="pi pi-check" className="p-button-text" onClick={saveEditedComment} />
        </React.Fragment>
    );

    const deleteCommentDialogFooter = (
        <React.Fragment>
            <Button label={t('no')} icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={t('yes')} icon="pi pi-check" className="p-button-text" onClick={deleteComment} />
        </React.Fragment>
    );

    return (
        <div className="datatable-doc-demo col-12">
            <div className="card">
                <DataTable value={comment} ref={dt} paginator className="p-datatable-comment" header={header} rows={8}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="id" rowHover selection={selectedComments} onSelectionChange={onSelectionDetail}
                    filters={filters} filterDisplay="menu" loading={loading} responsiveLayout="scroll"
                    globalFilterFields={['name', 'phone', 'reservationCount', 'registerDate', 'lastAppointmentDate', 'rewardPoints', 'restriction' ]} emptyMessage={t('no_comments_found')}
                    currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                    <Column field="clientName" header={t('name_surname')} sortable filter dataType="count"></Column>
                    <Column field="rating" header={t('rating')} sortable filter dataType="count"></Column>
                    <Column field="service" header={t('service')} sortable filter dataType="service"></Column>
                    <Column field="creationDate" header={t('creation_date')} sortable filter dataType="date"></Column>
                    <Column field="serviceDate" header={t('service_date')} sortable filter dataType="date"></Column>
                    <Column field="feedback" header={t('feedback')} sortable filter dataType="totalUsage"></Column>
                    <Column field="reply" header={t('reply')} sortable filter dataType="remainingUsage"></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '5rem' }}></Column>
                </DataTable>
                <Dialog visible={commentDialog} style={{ width: '400px' }} header={t('comment_detail')} modal className="p-fluid" footer={commentDialogFooter} onHide={hideDialog}>
                <div className='grid' style={{ marginTop: '.5rem' }}>
                    <div className='col-12'>
                        <InputText className='inputfield w-full' value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={t('customer_name_surname')} />
                    </div>
                    <div className="grid col-12">
                        <div className="col-2" style={{ marginTop: '.10rem' }}>
                            <label htmlFor="rating">{t('rating')}:</label>
                        </div>
                        <div className='col-10'>
                            <Rating value={rating} cancel={false} onChange={(e) => setRating(e.value)} />
                        </div>
                    </div>
                    <div className='col-12'>
                        <Dropdown className='inputfield w-full' value={selectedService} options={packageServiceNames} onChange={onServiceChange} optionLabel="label" placeholder={t('service')} />
                    </div>
                    <div className='col-12'>
                        <InputText className='inputfield w-full' value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={t('feedback')} />
                    </div>
                    <div className='col-12'>
                        <InputTextarea className='inputfield w-full' value={reply} onChange={(e) => setReply(e.target.value)} placeholder={t('reply')} />
                    </div>
                </div>
                </Dialog>
            </div>
        </div>
    );
}
                 