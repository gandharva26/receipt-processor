// validationMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { Receipt } from '@/types/types/types.common';
import { ApiError } from '@/utils/ApiError';

const retailerRegex = /^[\w\s\-&]+$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const priceRegex = /^\d+\.\d{2}$/;
const shortDescriptionRegex = /^[\w\s\-]+$/

const validationError = () =>  {throw new ApiError({}, 400, 'The receipt is invalid' )}


export const validateReceipt = (req: Request, res: Response, next: NextFunction) => {

    try{
    const receipt: Receipt = req.body;
    if (!receipt || !retailerRegex.test(receipt.retailer) || !dateRegex.test(receipt.purchaseDate) || 
    !timeRegex.test(receipt.purchaseTime) || !Array.isArray(receipt.items) || receipt.items.length === 0) {
        validationError()
    }

    for (const item of receipt.items) {
        if (typeof item.shortDescription !== 'string' || !shortDescriptionRegex.test(item.shortDescription)) {
           console.log('here', item.shortDescription, shortDescriptionRegex.test(item.shortDescription))
           validationError()
        }
        if (typeof item.price !== 'string' || !priceRegex.test(item.price)) {
            validationError()
        }
    }

    // Validate total
    if (typeof receipt.total !== 'string' || !priceRegex.test(receipt.total)) {
        validationError()
    }

    next();
}
catch(e){
    next(e)
}
};

export default validateReceipt;
