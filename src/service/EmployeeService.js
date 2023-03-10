import axios from "axios";

export class EmployeeService {

    getEmployeeList(partnerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/employees-of-partner?partnerId=${partnerId}`).then(res => resolve(res.data));
        })
    }

    createEmployee(employee) {
        return new Promise(resolve => { axios.post(`${window.env.REACT_APP_GORESY_BACKEND_URL}/employee`, employee).then(res => resolve(res.data));
        })
    }

    updateEmployee(employee, employeeId) {
        return new Promise(resolve => { axios.put(`${window.env.REACT_APP_GORESY_BACKEND_URL}/employees/${employeeId}`, employee).then(res => resolve(res.data));
        })
    }

    removeEmployee(employeeId) {
        return new Promise(resolve => { axios.delete(`${window.env.REACT_APP_GORESY_BACKEND_URL}/employees/${employeeId}`).then(res => resolve(res.data));
        })
    }

    setEmployeeServices(employeeId, serviceIdList) {
        return new Promise(resolve => { axios.put(`${window.env.REACT_APP_GORESY_BACKEND_URL}/set-employee-services/${employeeId}`, serviceIdList).then(res => resolve(res.data));
        })
    }
}