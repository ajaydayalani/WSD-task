import express, {Request, Response} from "express"
//import { UnitUser, User } from "./user.interface"
import {StatusCodes} from "http-status-codes"
import {  scrapeEvent, scrapeResults } from "./horseOdd.Service"
import { authenticateKey } from '../Authentication/user.Service';


export const horseOddsRouter = express.Router()

horseOddsRouter.post("/odds", authenticateKey ,async (req: Request, res: Response) => {
    try {
        const { url } = req.body;


        if (!url || typeof url !== 'string') {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid URL parameter' });
        }

        console.log("Starting to scrape: ", url)
        let result=[];
        if(url.includes("/res/")){result = await scrapeResults(url);}
        else if(url.includes("/evt/")) {result= await scrapeEvent(url);}

        console.log("result", result)

        if (result.length==0){throw new Error("Data not found")}

        return res.status(StatusCodes.OK).json({data:result});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});
