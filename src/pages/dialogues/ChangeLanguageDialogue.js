import React from 'react';
import { useTranslation } from 'react-i18next';
import {Dialog} from "primereact/dialog";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import i18n from "i18next";
import {locale} from "primereact/api";

export const ChangeLanguageDialogue = (props) => {

    const { t } = useTranslation();

    let languages = [
        {
            title: t('turkish'),
            value: 'tr',
            image: 'assets/flags/tr.svg'
        },
        {
            title: t('english'),
            value: 'en',
            image: '../assets/flags/en.svg'
        }
        ];

    const languageBodyTemplate = (rowData) => {
        return <div style={{display: 'inline-flex', alignItems: 'flex-start'}}>
            <img width='40px' src={rowData.image} alt={rowData.image} className="product-image" style={{
                marginTop: '-.2rem', marginRight: '1rem'
            }} />
            <p style={{fontWeight: 'bold'}}>{rowData.title}</p>
        </div>;
    }

    return (
        <Dialog header={t('change_language')} visible={props.visible} resizable={false} draggable={false} dismissableMask={true} style={{ width: '500px' }} onHide={props.onHide}>
            <div className="grid p-fluid">
                <div className="col-12">
                    <DataTable value={languages} selectionMode="single" onSelectionChange={e => {
                        i18n.changeLanguage(e.value.value);
                        locale(e.value.value);
                        props.onHide(false);
                    }} responsiveLayout="scroll">
                        <Column body={languageBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </Dialog>
    );
}