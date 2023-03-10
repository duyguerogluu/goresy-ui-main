import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {PackageDetail} from "../../components/PackageDetail";
import {PackageService} from "../../service/PackageService";
import {ServiceListService} from "../../service/ServiceListService";
import {EmployeeService} from "../../service/EmployeeService";
import {AutoComplete} from "primereact/autocomplete";
import {CustomerService} from "../../service/CustomerService";
import {PackageSaleService} from "../../service/PackageSaleService";
import {connect} from "react-redux";

const NewPackageSaleDialogue = (props) => {

    const { t } = useTranslation();

    const [savedPackagesDialog, setSavedPackagesDialog] = useState(false);
    const [createSavedPackageDialog, setCreateSavedPackageDialog] = useState(false);
    const [packageSaleDate, setPackageSaleDate] = useState(new Date());
    const [customer, setCustomer] = useState();
    const [person, setPerson] = useState();
    const [notes, setNotes] = useState("");
    const [staff, setStaff] = useState([{}])
    const [packages, setPackages] = useState([{}])
    const [savedPackages, setSavedPackages] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [quantity, setQuantity] = useState("");
    const [packageType, setPackageType] = useState();
    const [service, setService] = useState();
    const [services, setServices] = useState();
    const [amount, setAmount] = useState("");

    const packageSaleService = new PackageSaleService();
    const packageService = new PackageService();
    const serviceListService = new ServiceListService();
    const employeeService = new EmployeeService();
    const customerService = new CustomerService();

    const packageTypes = [
        { label: t('session'), value: "session" },
        { label: t('minute'), value: "minute" },
    ];

    useEffect(() => {
        serviceListService.getServiceList(props.partnerId)
            .then(data => {
                data.forEach(service => {
                    service.label = service.name;
                });

                setServices(data);
            });

        packageService.getPackageList(props.partnerId)
            .then(data => {
                let newPackages = [];

                data.forEach(packageItem => {
                    packageItem.service.label = packageItem.service.name;

                    newPackages.push({
                        quantity: packageItem.amount,
                        packageType: packageItem.packageUnit,
                        service: packageItem.service,
                        amount: packageItem.price
                    });
                })

                setSavedPackages(newPackages)
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

    const onPackageUpdate = (index, field, value) => {
        let newPackages = [
            ...packages
        ];
        newPackages[index][field] = value;
        setPackages(newPackages);
    }

    const onPackageDelete = (index) => {

        let newPackages = [
            ...packages
        ];
        newPackages.splice(index, 1);
        setPackages(newPackages);
    }

    return (
        <Dialog header={t('new_package_sale')} visible={props.visible} resizable={false} draggable={false} dismissableMask={true} style={{ width: '700px' }} onHide={props.onHide}>
            <Dialog header={t('saved_packages')} visible={savedPackagesDialog} resizable={false} draggable={false} dismissableMask={true} style={{ width: '700px' }} onHide={() => setSavedPackagesDialog(false)}>
                <Dialog header={t('create_saved_package')} visible={createSavedPackageDialog} resizable={false} draggable={false} dismissableMask={true} style={{ width: '700px' }} onHide={() => setCreateSavedPackageDialog(false)}>
                    <div className="grid p-fluid">
                        <div className='col-3'>
                            <InputText className="inputfield w-full" keyfilter={"pint"} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder={t('quantity')}  />
                        </div>
                        <div className='col-3'>
                            <Dropdown value={packageType} options={packageTypes} onChange={e => setPackageType(e.target.value)} placeholder={t('package_type')} className='inputfield w-full' />
                        </div>
                        <div className='col-3'>
                            <Dropdown value={service} filter={true} options={services} onChange={e => setService(e.target.value)} placeholder={t('service')} className='inputfield w-full' />
                        </div>
                        <div className='col-3'>
                            <div className="p-inputgroup">
                                <InputText className="inputfield w-full" keyfilter={"pint"} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t('amount')}  />
                                <span className="p-inputgroup-addon">₺</span>
                            </div>
                        </div>
                        <div className='col-12'>
                            <Button label={t('save')} className="p-button-success" onClick={() => {
                                const newPackage = {
                                    partnerId: props.partnerId,
                                    amount: quantity,
                                    packageUnit: packageType,
                                    price: amount,
                                    serviceId: service.id
                                };

                                packageService.addPackage(newPackage).then((data) => {
                                    let newSavedPackages = [...savedPackages];
                                    newSavedPackages.push({
                                        quantity: quantity,
                                        packageType: packageType,
                                        service: service,
                                        amount: amount
                                    });
                                    setSavedPackages(newSavedPackages);
                                    setCreateSavedPackageDialog(false);
                                });
                            }}/>
                        </div>
                    </div>
                </Dialog>
                <div className="grid p-fluid">
                    <div className='col-12'>
                        <DataTable value={savedPackages} responsiveLayout="scroll" paginator={true} rows={5}>
                            <Column field="quantity" header={t('quantity')} filter={true}></Column>
                            <Column field="packageType" header={t('package_type')} body={(item) => (<div>{t(item.packageType)}</div>)} filter={true}></Column>
                            <Column field="service" header={t('service')} body={(item) => (<div>{item.service.name}</div>)} filter={true}></Column>
                            <Column field="amount" header={t('amount')} filter={true} body={(item) => item.amount + " ₺"} ></Column>
                            <Column body={(item) => (
                                <Button className='p-button-success p-button-icon-only' icon="pi pi-plus" onClick={() => {
                                    let newPackages = [...packages];
                                    if (Object.keys(newPackages[newPackages.length - 1]).length === 0) {
                                        newPackages.pop();
                                    }
                                    newPackages.push(item);
                                    setPackages(newPackages);
                                    setSavedPackagesDialog(false);
                                }} />
                            )}/>
                        </DataTable>
                    </div>
                    <div className='col-12'>
                        <Button label={t('create_saved_package')} onClick={() => setCreateSavedPackageDialog(true)}/>
                    </div>
                </div>
            </Dialog>

            <div className="grid p-fluid">
                <div className='col-12'>
                    <Calendar value={packageSaleDate} onChange={(e) => setPackageSaleDate(e.target.value)} dateFormat="dd MM yy" showButtonBar showIcon style={{width: '100%'}}></Calendar>
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
                        packages.map((item, index) => (
                            <PackageDetail
                                key={index}
                                item={item}
                                deletable={packages.length > 1}
                                onDelete={() => onPackageDelete(index)}
                                onUpdate={(field, value) => onPackageUpdate(index, field, value)}
                                services={services}
                                packageTypes={packageTypes}
                            />
                        ))
                    }
                </div>
                <div className='col-6'>
                    <Button label={t('add_package')} className='p-button' icon="pi pi-plus" onClick={() => {
                        setPackages([
                            ...packages,
                            {}
                        ]);
                    }} />
                </div>
                <div className='col-6'>
                    <Button label={t('select_package')} className='p-button' icon="pi pi-history" onClick={() => {
                        setSavedPackagesDialog(true)
                    }} />
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
                        let finalPackages = [];

                        packages.forEach(packageItem => {
                            totalAmount += parseInt(packageItem.amount);
                            finalPackages.push({
                                amount: packageItem.quantity,
                                packageUnit: packageItem.packageType,
                                partnerId: props.partnerId,
                                price: packageItem.amount,
                                serviceId: packageItem.service.id
                            })
                        })

                        packageSaleService.postPackageSale({
                            clientName: customer.fullName,
                            customerId: customer.id,
                            employeeId: person.id,
                            notes: notes,
                            partnerId: props.partnerId,
                            saleDate: packageSaleDate,
                            sellerName: person.name,
                            totalAmount: totalAmount,
                            packages: finalPackages
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

export default connect(mapStateToProps, null)((NewPackageSaleDialogue));

