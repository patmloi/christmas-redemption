import { Router } from 'express';
import { StaffController } from '../controllers/staffController';

export const StaffRoutes = (controller: StaffController) => {
    const router = Router();
    router.get('/:staffPassId', controller.lookup);
    return router;
};
