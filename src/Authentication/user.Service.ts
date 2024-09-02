import express, { Request, Response, NextFunction } from 'express';
import { users } from './user.Data';
import { User } from './user.model';
import { StatusCodes } from 'http-status-codes';


export const userRouter = express.Router()

// Function to generate a random API key
const genAPIKey = (): string => {
  return [...Array(30)]
    .map(() => ((Math.random() * 36) | 0).toString(36))
    .join('');
};

// Function to create a new user
userRouter.post( "/user",( req: Request, res:Response) => {

  
  const { username } = req.body;
  if (!username || typeof username !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid username parameter' });
}


  const user: User = {
    id: Date.now(),
    apikey: genAPIKey(),
    username: username,
  };


  users.push(user);
  return res.status(StatusCodes.OK).json({user:user});
});

userRouter.get('/users',  (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json({users:users});
});

export const authenticateKey = (req: Request, res: Response, next: NextFunction) => {
  const api_key = req.header("x-api-key");
  
  if (!api_key) {
    return res.status(400).send({ error: { code: 400, message: "API key is missing." } });
  }

  const account = users.find((user) => user.apikey === api_key);

  if (account) {
    console.log("Good API call", account.apikey);
    next();
  } else {
    res.status(403).send({ error: { code: 403, message: "You are not allowed." } });
  }
};

