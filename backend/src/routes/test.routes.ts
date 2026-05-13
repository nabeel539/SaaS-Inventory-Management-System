import { Router } from 'express';
import { testDatabaseConnection } from '../controllers/test.controller';

const router = Router();

router.get('/test-db', testDatabaseConnection);

export default router;
