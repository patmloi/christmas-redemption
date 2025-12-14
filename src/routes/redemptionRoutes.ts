import { Router } from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from '../controllers/itemController';

import { RedemptionController } from '../controllers/redemptionController';

export const RedemptionRoutes = (controller: RedemptionController) => {

    const router = Router();

    router.get('/', getItems);
    router.get('/:id', getItemById);
    router.post('/', createItem);
    router.put('/:id', updateItem);
    router.delete('/:id', deleteItem);

    return router;

};
