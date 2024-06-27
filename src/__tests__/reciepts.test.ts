// Example of Unit tests
// We can add more assertions and tests to increase coverage

import { processReceipts, calculatePoints, getPoints } from '@/controllers/receipt-controller';
import validateReceipt from '@/middleware/validation.middleware';
import { Request, Response, NextFunction } from 'express';

describe('processReceipt & validateReciept', () => {
    it('should return a valid receipt ID', () => {
        const receipt = {
            retailer: 'Test Retailer',
            purchaseDate: '2023-01-01',
            purchaseTime: '15:30',
            items: [
                { shortDescription: 'Item 1', price: '10.00' },
                { shortDescription: 'Item 2', price: '5.00' }
            ],
            total: '15.00'
        };

        const receiptId = processReceipts(receipt);
        expect(receiptId).toBeDefined();
        expect(typeof receiptId).toBe('string');
     
    });


});


describe('calculatePoints', () => {
  it('should return valid Points', () => {
      const input = {
        "retailer": "Target",
        "purchaseDate": "2022-01-01",
        "purchaseTime": "13:01",
        "items": [
          {
            "shortDescription": "Mountain Dew 12PK",
            "price": "6.49"
          },{
            "shortDescription": "Emils Cheese Pizza",
            "price": "12.25"
          },{
            "shortDescription": "Knorr Creamy Chicken",
            "price": "1.26"
          },{
            "shortDescription": "Doritos Nacho Cheese",
            "price": "3.35"
          },{
            "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
            "price": "12.00"
          }
        ],
        "total": "35.35"
      }
      const response = calculatePoints(input);
      expect(response).toBe(28);
  });



});




describe('validateReceipt function', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction>;

    beforeEach(() => {
        req = {
            body: {
              "retailer": "Target",
              "purchaseDate": "2022-01-01",
              "purchaseTime": "13:01",
              "items": [
                {
                  "shortDescription": "Mountain Dew 12PK",
                  "price": "6.49"
                },{
                  "shortDescription": "Emils Cheese Pizza",
                  "price": "12.25"
                },{
                  "shortDescription": "Knorr Creamy Chicken",
                  "price": "1.26"
                },{
                  "shortDescription": "Doritos Nacho Cheese",
                  "price": "3.35"
                },{
                  "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                  "price": "12.00"
                }
              ],
              "total": "35.35"
            }
        };
        res = {};
        next = jest.fn();
    });

    it('should call next if receipt is valid', () => {
        const response = validateReceipt(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(); // for valid receipt
    });

    it('should throw validation error if retailer is invalid', () => {
        req.body.retailer = 'InvalidRetailer@';
        validateReceipt(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error)); // Expect an error to be passed to next
    });   

    it('should throw validation error if date is invalid', () => {
      req.body.purchaseDate = "2022-01-010";
      validateReceipt(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error)); // Expect an error to be passed to next
  }); 

  it('should throw validation error if time is invalid', () => {
    req.body.purchaseTime = "13:60";
    validateReceipt(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error)); // Expect an error to be passed to next
}); 
});