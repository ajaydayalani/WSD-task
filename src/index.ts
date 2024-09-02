import express, {Request, Response} from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import { horseOddsRouter } from "./HorseOdds/horseOdds.Router"
import { userRouter } from "./Authentication/user.Service"
import { StatusCodes } from "http-status-codes"


dotevnv.config()

if (!process.env.PORT) {
    console.log(`No port value specified...`)
}

const PORT = parseInt(process.env.PORT as string, 10) || 8080

const app = express()




app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(helmet())

app.get('/health',(req:Request, res:Response)=>{
    return res.status(StatusCodes.OK).send('Server started');
})

app.use( userRouter)

app.use( horseOddsRouter)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})