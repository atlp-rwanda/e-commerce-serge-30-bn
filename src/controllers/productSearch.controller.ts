import { Request, Response } from 'express';
import { ProductService } from '../service/product.service';


export class ProductController {
    static async searchProducts(req: Request, res: Response): Promise<void> {
        try {
            const { name, minPrice, maxPrice, category } = req.body;

            const products = await ProductService.searchProducts({
                name: name as string,
                minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
                category: category as string,
            });
            if (products.length > 0) {
                 res.status(200).json(products);
              } else {
                 res.status(404).json({ message: 'No products found' });
              }
        } catch (error) {
            console.error('Error in searchProducts:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
