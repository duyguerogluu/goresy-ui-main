import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useTranslation } from 'react-i18next';
import {CheckService} from "../service/CheckService";
import moment from 'moment'
import {connect} from "react-redux";
import CustomChip from '../components/CustomChip';

const HomePage = (props) => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const dt = useRef(null);

    const checkServices = new CheckService();

    useEffect(() => {
        checkServices.getChecks(props.partnerId)
            .then(data => { setData(getData(data.content)); setLoading(false) })
    }, []);

    const getData = (data) => {
        return [...data || []].map(d => {
            d.time = new Date(d.time);
            return d;
        });
    }

    const dateBodyTemplate = (date) => {
        return moment(date).format('DD/MM/YYYY')
    }

    const servicesBodyTemplate = (rowData) => {
        return rowData.services && rowData.services.length > 0 && rowData.services.map((data, i) => (
            <CustomChip 
                key={`${data.name}${i}`} 
                label={data.name}
            />
        ))
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">{t('home')}</h5>
            </div>
        )
    }

    return (
        <div className="datatable-doc-demo col-12">
            <div className="card">
                <DataTable value={data} ref={dt} paginator className="p-datatable-data" header={renderHeader} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="id" rowHover 
                    filterDisplay="menu" loading={loading} responsiveLayout="scroll"
                    currentPageReportTemplate={t('Showing {first} to {last} of {totalRecords} entries')}>
                    <Column field="createdDate" header={t('date')} body={dateBodyTemplate()} sortable filter dataType="date"></Column>
                    <Column field="customerFullname" header={t('customers')} sortable></Column>
                    <Column field="services" body={servicesBodyTemplate}  header={t('services')} sortable ></Column>
                    <Column field="product" header={t('products')} sortable ></Column>
                    <Column field="totalAmount" header={t('total_cost')} sortable ></Column>
                </DataTable>
            </div>
        </div>
    );
}



const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id
    };
};

export default connect(mapStateToProps, null)((HomePage));