export class ReportService {

    getReportStaffSmall() {
        return fetch('staff-report.json').then(res => res.json())
                .then(d => d.data);
    }

    getCommentsSmall() {
        return fetch('comments-small.json').then(res => res.json())
                .then(d => d.data);
    }

    getReportMedium() {
        return fetch('report-large.json').then(res => res.json())
                .then(d => d.data);
    }

    getReportLarge() {
        return fetch('report-large.json').then(res => res.json())
                .then(d => d.data);
    }

    getReportXLarge() {
        return fetch('report-large.json').then(res => res.json())
                .then(d => d.data);
    }

    getReport(params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        return fetch('https://www.primefaces.org/data/Report?' + queryParams).then(res => res.json())
    }
}