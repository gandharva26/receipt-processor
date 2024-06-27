import express from "express";

// Import controllers from
import { getReceipts, getPoints } from "@/controllers/receipt-controller";
import { errorResponse } from "@/middleware/error-middleware";
import validateReceipt from "@/middleware/validation.middleware";
// Setup router

const router = express.Router();

// Setup all routes for Receipts

// adds middleware validateReceipt only for getReceipts
router.post('/process', validateReceipt, getReceipts)

router.get('/:id/points', getPoints)



// Export router; should always export as default
export default router;
