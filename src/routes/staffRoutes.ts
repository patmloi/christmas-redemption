import { Router } from 'express';
import { StaffController } from '../controllers/staffController';

const StaffRoutes = (controller: StaffController) => {

    const router = Router();

    router.get('/:staffPassId', controller.lookup);

    return router;

};

export default StaffRoutes; // Export the function as default