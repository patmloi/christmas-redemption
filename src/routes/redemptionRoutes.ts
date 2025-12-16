import { Router } from 'express';
import { RedemptionController } from '../controllers/redemptionController';

export const RedemptionRoutes = (controller: RedemptionController) => {
    const router = Router();
    router.get('/eligibility/:teamName', controller.checkEligibility);
    router.get('/redeem/:staffPassId', controller.redeem);
    return router;
};
