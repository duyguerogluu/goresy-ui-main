import React, {useEffect, useState, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {ExpenseCategoryService} from "../../service/ExpenseCategoryService";
import {ExpenseService} from "../../service/ExpenseService";
import {EmployeeService} from "../../service/EmployeeService";
import {connect} from "react-redux";
import {Toast} from "primereact/toast";

const NewCostDialogue = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);

    const [costCategoriesDialog, setCostCategoriesDialog] = useState(false);
    const [addCategoryDialog, setAddCategoryDialog] = useState(false);
    const [costDate, setCostDate] = useState(new Date());
    const [costAmount, setCostAmount] = useState("");
    const [costNotes, setCostNotes] = useState("");
    const [costDescription, setCostDescription] = useState("");
    const [costCategory, setCostCategory] = useState()
    const [person, setPerson] = useState()
    const [paymentMethod, setPaymentMethod] = useState()
    const [categoryDescription, setCategoryDescription] = useState("");
    const [costCategories, setCostCategories] = useState([]);
    const [staff, setStaff] = useState([]);
    const expenseCategoryService = new ExpenseCategoryService();
    const expenseService = new ExpenseService();
    const employeeService = new EmployeeService();

    const paymentMethods = [
        { label: t('cash'), value: 'cash'},
        { label: t('credit_card'), value: 'credit_card'},
        { label: t('online_payment'), value: 'online_credit_card'}
    ];

    useEffect(() => {
        expenseCategoryService.getExpenseCategoriesSortedBCreationDate(props.partnerId)
            .then((data) => {
                let newCostCategories = [];

                data.content.forEach(category => {
                    newCostCategories.push({
                        label: category.title,
                        main: category.main,
                        id: category.id
                    });
                })

                setCostCategories(newCostCategories);
            });

        employeeService.getEmployeeList(props.partnerId)
            .then((data) => {
                let newStaff = [];
                data.forEach(employee => {
                    newStaff.push({
                        label: employee.name,
                        id: employee.id
                    })
                })
                setStaff(newStaff);
            })
    }, []);


    const addNewExpense = () => {
        expenseService.postExpense({
            amount: costAmount,
            date: costDate,
            description: costDescription,
            expenseCategoryId: costCategory.id,
            notes: costNotes,
            partnerId: props.partnerId,
            paymentMethod: paymentMethod,
            spenderId: person.id
        }).then(() => {
            toast.current.show({
                severity: 'success',
                summary: t('save_successed'),
                detail: t('save_completed_successfully'),
                life: 3000
            });
            props.onHide(false);
        });
    }

    const deleteBodyTemplate = (rowData) => {
        return (
            <Button disabled={rowData.main} className='p-button-danger p-button-icon-only' icon="pi pi-trash"
                    onClick={() => {
                        // ToDo: Should we ask 'are you sure?'
                        expenseCategoryService.deleteExpenseCategories(rowData.id)
                            .then(() => {
                                let newCostCategories = costCategories.filter(
                                    (item) => {return item.id !== rowData.id}
                                );
                                setCostCategories(newCostCategories);
                            })
            }} />
        );
    };

    return (
        <Dialog header={t('new_cost')} visible={props.visible} resizable={false} draggable={false} dismissableMask={true} style={{ width: '500px' }} onHide={props.onHide}>
            <Toast ref={toast} />
            <Dialog header={t('cost_categories')} visible={costCategoriesDialog} resizable={false} draggable={false} dismissableMask={true} style={{ width: '400px' }} onHide={() => setCostCategoriesDialog(false)}>
                <Dialog header={t('add_category')} visible={addCategoryDialog} resizable={false} draggable={false} dismissableMask={true} style={{ width: '500px' }} onHide={() => setAddCategoryDialog(false)}>
                    <div className="grid p-fluid">
                        <div className='col-12'>
                            <div className='col-12'>
                                <InputText className="inputfield w-full" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder={t('description')} />
                            </div>
                            <div className='col-12'>
                                <Button label={t('save')} className='p-button' icon="pi pi-plus" onClick={() => {
                                    expenseCategoryService.postExpenseCategory({
                                        title: categoryDescription,
                                        main: false,
                                        partnerId: props.partnerId
                                    }).then((res) => {
                                        let newCostCategories = [
                                            {
                                                label: categoryDescription,
                                                main: false,
                                                id: res.id
                                            },
                                            ...costCategories
                                        ];
                                        setCostCategories(newCostCategories);
                                        setAddCategoryDialog(false);
                                    });
                                }} />
                            </div>
                        </div>
                    </div>
                </Dialog>
                <div className="grid p-fluid">
                    <div className='col-12'>
                        <DataTable value={costCategories} responsiveLayout="scroll" paginator={true} rows={5}>
                            <Column field="label" header={t('cost_category')} filter={true}></Column>
                            <Column body={deleteBodyTemplate}></Column>
                        </DataTable>
                    </div>
                    <div className='col-12'>
                        <Button label={t('add_category')} className='p-button' icon="pi pi-plus" onClick={() => setAddCategoryDialog(true)} />
                    </div>
                </div>
            </Dialog>
            <div className="grid p-fluid">
                <div className='col-12'>
                    <Calendar value={costDate} onChange={(e) => setCostDate(e.target.value)} dateFormat="dd MM yy" showButtonBar showIcon style={{width: '100%'}}></Calendar>
                </div>
                <div className='col-11' style={{width: '88%'}}>
                    <Dropdown filter value={costCategory} options={costCategories} onChange={e => (setCostCategory(e.target.value))} placeholder={t('cost_category')} className='inputfield w-full'/>
                </div>
                <div className='col-1'>
                    <Button className='p-button-rounded' icon="pi pi-cog" onClick={() => setCostCategoriesDialog(true)} />
                </div>
                <div className='col-12'>
                    <InputText className="inputfield w-full" value={costDescription} onChange={(e) => setCostDescription(e.target.value)} placeholder={t('description')} />
                </div>
                <div className='col-12'>
                    <div className="p-inputgroup">
                        <InputText className="inputfield w-full" keyfilter={"pint"} value={costAmount} onChange={(e) => setCostAmount(e.target.value)} placeholder={t('amount')}  />
                        <span className="p-inputgroup-addon">₺</span>
                    </div>
                </div>
                <div className='col-12'>
                    <Dropdown value={paymentMethod} options={paymentMethods} onChange={e => (setPaymentMethod(e.target.value))} placeholder={t('payment_method')} className='inputfield w-full' />
                </div>
                <div className='col-12'>
                    <Dropdown value={person} options={staff} onChange={e => (setPerson(e.target.value))} placeholder={t('spends')} className='inputfield w-full' />
                </div>
                <div className='col-12'>
                    <InputText className="inputfield w-full" value={costNotes} onChange={(e) => setCostNotes(e.target.value)} placeholder={t('notes')} />
                </div>
                <div className='col-12'>
                    <Button label={t('save')} className="p-button-success" onClick={addNewExpense}/>
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

export default connect(mapStateToProps, null)((NewCostDialogue));
