import React, { Component } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { withTranslation } from 'react-i18next';

class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reservationInfo: this.props.reservationInfo   
        };
        this.onCategoryChange = this.onCategoryChange.bind(this);
    }

    componentDidMount() {
    }

    onCategoryChange(e) {
        let reservationInfo = {...this.state.reservationInfo};
        reservationInfo['status'] = e.value;
        this.setState({ reservationInfo });
    }
   
    render() {
        const { t } = this.props;
        return (
            <div className="card">     
                    <div className="col-12">   
                        <div className="grid">
                            <div className="col-3">
                                <label style={{ fontWeight:'bold'}} htmlFor="name">{t('name_surname')}</label>
                            </div>
                            <div className="col-3">
                                <label htmlFor="name">{this.state.reservationInfo.name}</label>
                            </div>
                            <div className="col-3">
                                <label style={{ fontWeight:'bold'}} htmlFor="phone">{t('phone')}</label>
                            </div>
                            <div className="col-3">
                                <label htmlFor="phone">{this.state.reservationInfo.phone}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="grid">
                            <div className="col-3">
                                <label style={{ fontWeight:' bold'}} htmlFor="date">{t('date')}</label>
                            </div>
                            <div className="col-3">
                                <Calendar id="date" value={this.state.reservationInfo.date} showIcon />
                            </div>   
                            <div className="col-3">
                                <label  style={{ fontWeight:'bold'}} htmlFor="clock">{t('clock')}</label>
                            </div>
                            <div className="col-3">
                                <Calendar id="clock" value={this.state.reservationInfo.clock} timeOnly hourFormat="24" />
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="grid">
                            <div className="col-3">
                                <label style={{ fontWeight:' bold'}} htmlFor="by">{t('by')}</label>
                            </div>
                            <div className="col-3">
                                <label htmlFor="by">{this.state.reservationInfo.by}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="grid">
                            <div className="col-3">
                                <label style={{ fontWeight:' bold' }}>{t('status')}</label>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="field-radiobutton col-3">
                                <RadioButton inputId="category1" name="category" value="Onay Bekliyor" onChange={this.onCategoryChange} checked={this.state.reservationInfo.status === 'Onay Bekliyor'} />
                                <label htmlFor="category1">{t('waiting_approval')}</label>
                            </div>
                            <div className="field-radiobutton col-3">
                                <RadioButton inputId="category2" name="category" value="Onaylandı" onChange={this.onCategoryChange} checked={this.state.reservationInfo.status === 'Onaylandı'} />
                                <label htmlFor="category2">{t('approved')}</label>
                            </div>
                            <div className="field-radiobutton col-3">
                                <RadioButton inputId="category3" name="category" value="İşlemde" onChange={this.onCategoryChange} checked={this.state.reservationInfo.status === 'İşlemde'} />
                                <label htmlFor="category3">{t('active')}</label>
                            </div>
                            <div className="field-radiobutton col-3">
                                <RadioButton inputId="category4" name="category" value="Tamamlandı" onChange={this.onCategoryChange} checked={this.state.reservationInfo.status === 'Tamamlandı'} />
                                <label htmlFor="category4">{t('done')}</label>
                            </div>
                        </div>
                    </div>        
            </div>
        );
    }
}

export default withTranslation()(Detail);