
import { NextFunction, Request, Response } from "express";
import { v7 as uuidv7 } from 'uuid';
import { Receipt } from "@/types/types/types.common";
import { ApiError } from "@/utils/ApiError";
// Generate UUID v7


let points: Record<string, number> = {};



export const getReceipts = async (req: Request, res: Response, next: NextFunction)=> {
    try{
        const receipt: Receipt  = req.body;
        const id = processReceipts(receipt)
        return res.status(200).send({id:id})
    }
    catch(e){
        
        next(new ApiError({}, 500, 'Something went wrong!' ))
    }

}

export const  processReceipts = (receipt: Receipt): string => {
  
    const id = uuidv7() // Generate unique ID to send
    points[id] = calculatePoints(receipt); // stores the points in the points object
    return id

}

export const getPoints = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.params.id;
        console.log(points, points[id])
       if(!points[id]){
        throw new ApiError({}, 404, 'No receipt found for that id' )   // propogate error to catch
       }
       
        res.status(200).send({ points: points[id]});
    }
    catch(e){
next(e)    // propogate error to error Handling middleware
    }
  }


 export const calculatePoints = (receipt: Receipt): number => {
    let points = 0;
  
    // Rule 1: One point for every alphanumeric character in the retailer name
    points += receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length;
  
    // Rule 2: 50 points if the total is a round dollar amount with no cents
    if (parseFloat(receipt.total) % 1 === 0) {
      points += 50;
    }
  
    // Rule 3: 25 points if the total is a multiple of 0.25
    if (parseFloat(receipt.total) % 0.25 === 0) {
      points += 25;
    }
  
    // Rule 4: 5 points for every two items on the receipt
    points += Math.floor(receipt.items.length / 2) * 5;
  
    // Rule 5: Points for item descriptions
    //If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
    receipt.items.forEach((item) => {
      if (item.shortDescription.trim().length % 3 === 0) {
        points += Math.ceil(parseFloat(item.price) * 0.2);
      }
    });
  
    // Rule 6: 6 points if the day in the purchase date is odd
    const day = parseInt(receipt.purchaseDate.split('-')[2], 10);
    if (day % 2 !== 0) {
      points += 6;
    }
  
    // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm
    const hour = parseInt(receipt.purchaseTime.split(':')[0], 10);
    if (hour >= 14 && hour < 16) {
      points += 10;
    }
  
    return points;
  }
  