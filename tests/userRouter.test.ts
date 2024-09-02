import request from 'supertest';
import express from 'express';
import { userRouter, authenticateKey } from '../src/Authentication/user.Service'; 
import { users } from '../src/Authentication/user.Data'; 

const app = express();
app.use(express.json());
app.use('/', userRouter); 
describe('User Router', () => {
  beforeEach(() => {
    users.length = 0; 
  });

  describe('POST /user', () => {
    it('should create a new user with a valid username', async () => {
      const response = await request(app)
        .post('/user')
        .send({ username: 'testuser' })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('apikey');
      expect(response.body.user.username).toBe('testuser');
      expect(users.length).toBe(1); 
    });

    it('should return 400 if the username is missing or invalid', async () => {
      const response = await request(app)
        .post('/user')
        .send({ username: 123 }) 
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Invalid username parameter');
      expect(users.length).toBe(0); 
    });
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      // First, create a user
      users.push({ id: 1, apikey: 'testkey', username: 'testuser' });

      const response = await request(app).get('/users');
      expect(response.statusCode).toBe(200);
      expect(response.body.users).toHaveLength(1);
      expect(response.body.users[0].username).toBe('testuser');
    });
  });

  

    

});
