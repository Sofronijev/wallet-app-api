import * as express from 'express';
import { tokenAuthorization } from '../auth/tokenAuth';
import { authRoute } from './auth';
import { transactionRoute } from './transaction';

const router = express()

router.use(authRoute);
router.use(tokenAuthorization, transactionRoute);

export default router;