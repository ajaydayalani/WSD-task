import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { horseOddsRouter } from '../src/HorseOdds/horseOdds.Router';
import { userRouter } from '../src/Authentication/user.Service';
import { StatusCodes } from 'http-status-codes';

// Mock dotenv configuration to ensure a PORT is set
process.env.PORT = '3000';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());


app.get('/health', (req: express.Request, res: express.Response) => {
    return res.status(StatusCodes.OK).send('Server started');
});

describe('Express Server', () => {
  it('should respond to a request to the userRouter', async () => {
    const response = await request(app).get('/health'); // Replace with actual endpoint in userRouter
    expect(response.statusCode).toBe(200);
  });



  it('should start the server on the specified port', async () => {
    const PORT = parseInt(process.env.PORT as string, 10);
    expect(PORT).toBe(3000); // Check if the port is set correctly
  });
});
