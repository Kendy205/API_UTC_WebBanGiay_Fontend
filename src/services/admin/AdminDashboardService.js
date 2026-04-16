import { baseServices } from '../user/BaseService'



class AdminDashboardService {
    getSummary = () => baseServices.get('/api/Dashboard/summary')
}
export const adminDashboardService = new AdminDashboardService()
