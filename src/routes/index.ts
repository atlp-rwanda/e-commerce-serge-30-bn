import { Router } from "express";
import roleRoute from "./role.route";
import userRoute from "./user.route";
import authRoute from "./auth.route";



const router = Router();
const routers: Router[] = [
 roleRoute,
 userRoute,
 authRoute
];

router.use('/api/v1', routers);

export default router;