import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {ProductDetail} from "../../components/ProductDetail";
import {EmployeeService} from "../../service/EmployeeService";
import {AutoComplete} from "primereact/autocomplete";
import {CustomerService} from "../../service/CustomerService"
import {connect} from "react-redux";
import {ProductService} from "../../service/ProductService";
import {ProductSaleService} from "../../service/ProductSaleService";

const NewProductSaleDialogue = (props) => {

    const { t } = useTranslation();

    const [productSaleDate, setProductSaleDate] = useState(new Date());
    const [customer, setCustomer] = useState();
    const [person, setPerson] = useState();
    const [notes, setNotes] = useState("");
    const [savedProducts, setSavedProducts] = useState([]);
    const [staff, setStaff] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    const [products, setProducts] = useState([{}]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const productSaleService = new ProductSaleService();
    const productService = new ProductService();
    const employeeService = new EmployeeService();
    const customerService = new CustomerService();

    const paymentMethods = [
        { label: t('cash'), value: 'cash'},
        { label: t('credit_card'), value: 'credit_card'},
        { label: t('online_payment'), value: 'online_credit_card'}
    ];

    useEffect(() => {
        productService.getProductList(props.partnerId)
            .then(data => {
                let newProducts = [];

                data.forEach(productItem => {
                    newProducts.push({
                        label: productItem.title,
                        amount: productItem.price,
                        id: productItem.id
                    });
                })

                setSavedProducts(newProducts)
            });

        employeeService.getEmployeeList(props.partnerId)
            .then(data => {
                let newStaff = [];
                data.forEach(employee => {
                    newStaff.push({
                        label: employee.name,
                        ...employee
                    })
                })
                setStaff(newStaff);
            });
    }, [])

    const searchCustomer = (event) => {
        customerService.getCustomersOfPartner(props.partnerId, event.query).then(data => {
            if (data.content && data.content.length > 0) {
                setFilteredCustomers(data.content);
            }
        })
    }

    const itemTemplate = (item) => {
        return (
            <div className='p-clearfix'>
                {item.fullName} - {item.phone}
            </div>
        );
    }

    const onProductUpdate = (index, field, value) => {
        let newProducts = [
            ...products
        ];
        newProducts[index][field] = value;
        setProducts(newProducts);
    }

    const onProductDelete = (index) => {
        let newProducts = [
            ...products
        ];
        newProducts.splice(index, 1);
        setProducts(newProducts);
    }

    return (
        <Dialog header={t('new_product_sale')} visible={props.visible} resizable={false} draggable={false} dismissableMask={true} style={{ width: '700px' }} onHide={props.onHide}>

            <div className="grid p-fluid">
                <div className='col-12'>
                    <Calendar value={productSaleDate} onChange={(e) => setProductSaleDate(e.target.value)} dateFormat="dd MM yy" showButtonBar showIcon style={{width: '100%'}}></Calendar>
                </div>
                <div className='col-12'>
                    <AutoComplete
                        delay={500} minLength={3} value={customer} suggestions={filteredCustomers} field="fullName"
                        completeMethod={searchCustomer}  aria-label={t('person')} itemTemplate={itemTemplate}
                        onChange={(e) => setCustomer(e.value)} placeholder={t('customer')}
                    />
                </div>

                <div className='col-12'>
                    {
                        products.map((item, index) => (
                            <ProductDetail
                                key={index}
                                item={item}
                                deletable={products.length > 1}
                                onDelete={() => onProductDelete(index)}
                                onUpdate={(field, value) => onProductUpdate(index, field, value)}
                                savedProducts={savedProducts}
                            />
                        ))
                    }
                </div>
                <div className='col-12'>
                    <Button label={t('add_product')} className='p-button' icon="pi pi-plus" onClick={() => {
                        setProducts([
                            ...products,
                            {}
                        ]);
                    }} />
                </div>
                <div className='col-12'>
                    <Dropdown className='inputfield w-full' value={selectedPaymentMethod} options={paymentMethods} onChange={(e) => setSelectedPaymentMethod(e.target.value)} optionLabel="label" placeholder={t('payment_method')} />
                </div>
                <div className='col-12'>
                    <Dropdown value={person} options={staff} onChange={e => (setPerson(e.target.value))} placeholder={t('seller')} className='inputfield w-full' />
                </div>
                <div className='col-12'>
                    <InputText className="inputfield w-full" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notes')} />
                </div>
                <div className='col-12'>
                    <Button label={t('save')} className="p-button-success" onClick={() => {
                        
                        let totalAmount = 0;
                        let finalProducts = [];

                        products.forEach(productItem => {
                            if (!productItem.id) {
                                return;
                            }

                            totalAmount += parseInt(productItem.amount);
                            finalProducts.push({
                                amount: productItem.quantity,
                                partnerId: props.partnerId,
                                price: productItem.amount,
                                productId: productItem.id,
                                count: productItem.quantity
                            })
                        })

                        productSaleService.postProductSale({
                            clientName: customer.fullName,
                            customerId: customer.id,
                            notes: notes,
                            partnerId: props.partnerId,
                            saleDate: productSaleDate,
                            sellerName: person.name,
                            employeeId: person.id,
                            totalAmount: totalAmount,
                            paymentMethod: selectedPaymentMethod,
                            products: finalProducts
                        }).then(() => {
                            props.onHide(false);
                        });
                    }}/>
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

export default connect(mapStateToProps, null)((NewProductSaleDialogue));