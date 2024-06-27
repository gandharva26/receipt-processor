import { ApiError } from "@/types/interfaces/interfaces.common";
import { NextFunction, Request, Response } from "express";

// @desc Handles error responses from throw errors

export const errorResponse = (error: ApiError, _req: Request, res: Response, next: NextFunction) => {

 return  res.status(error.statusCode).json(
      error.message,
   );
};

