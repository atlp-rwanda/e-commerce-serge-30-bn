import { Router } from "express";
import roleRoute from "./role.route";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import { profileRouter } from "./profile.route";



const router = Router();
const routers: Router[] = [
 roleRoute,
 userRoute,
 authRoute,
 profileRouter
];

router.use('/api/v1', routers);

export default router;
