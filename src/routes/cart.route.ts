import express from "express"
import { isAuthenticated } from "../middleware/authentication/auth.middleware";
import addItemToCart from "../controllers/cart.controller";
import { dataSchema, validateSchema } from "../validations/cart.validation";


const cartRoute = express.Router();

cartRoute.post("/cart/addtocart",[isAuthenticated, validateSchema(dataSchema)], addItemToCart)


export default cartRoute;