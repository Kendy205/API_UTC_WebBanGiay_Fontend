import { BaseServices } from '../BaseService'



class AdminDashboardService extends BaseServices {
    getSummary = () => this.get('/api/Dashboard/summary')
}
export const adminDashboardService = new AdminDashboardService()
