import request from 'supertest';
import express from 'express';
import { horseOddsRouter } from '../src/HorseOdds/horseOdds.Router';
import { StatusCodes } from 'http-status-codes';



jest.mock('../src/HorseOdds/horseOdd.Service', () => ({
  scrapeEvent: jest.fn(),
  scrapeResults: jest.fn(),
}));



const { scrapeEvent, scrapeResults } = require('../src/HorseOdds/horseOdd.Service'); 

const mockUsers = [
  { id: 1, apikey: 'valid-api-key', username: 'testuser' },
];

jest.mock('../src/Authentication/user.Service', () => ({
  authenticateKey: (req, res, next) => {
    const api_key = req.header('x-api-key');
    const account = mockUsers.find(user => user.apikey === api_key);
    if (account) {
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).json({ error: 'Forbidden: Invalid API Key' });
    }
  },
}));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', horseOddsRouter);

describe('POST /odds', () => {

  it('Direct to Scrape Results ', async () => {
    scrapeResults.mockImplementation(() => Promise.resolve(["results"]));     
    const response = await request(app)
      .post('/odds')
      .set('x-api-key', 'valid-api-key') // Valid API key
      .send({ url: 'http://testhorses.com/res/' })

      expect(response.status).toBe(StatusCodes.OK);

    // Asserting that scrapeEvent was called during the request.
    expect(scrapeResults).toHaveBeenCalled();
    
    // Optionally, you can also check the content of the response.
    expect(response.body.data).toEqual(['results']);

  });


  it('Direct to Scrape Events', async () => {
    scrapeEvent.mockImplementation(() => Promise.resolve(["results"]));     
    const response = await request(app)
      .post('/odds')
      .set('x-api-key', 'valid-api-key') // Valid API key
      .send({ url: 'http://testhorses.com/evt/' })

      expect(response.status).toBe(StatusCodes.OK);

    // Asserting that scrapeEvent was called during the request.
    expect(scrapeEvent).toHaveBeenCalled();
    
    // Optionally, you can also check the content of the response.
    expect(response.body.data).toEqual(['results']);

  });


  
  it('Invalid UR: 400 Error', async () => {
    const response = await request(app)
      .post('/odds')
      .set('x-api-key', 'valid-api-key')
      .send({ url: 123 }) 
      .expect(StatusCodes.BAD_REQUEST);

    expect(response.body.error).toBe('Invalid URL parameter');
  });

  it('Invalid API key: 403 Error', async () => {
    const response = await request(app)
      .post('/odds')
      .set('x-api-key', 'invalid-api-key') // Invalid API key
      .send({ url: 'http://example.com' })
      .expect(StatusCodes.FORBIDDEN);

    expect(response.body.error).toBe('Forbidden: Invalid API Key');
  });

  it('Scraping Function Error', async () => {
    scrapeEvent.mockImplementation(() => Promise.reject(new Error('Scraping failed'))); 

    const response = await request(app)
      .post('/odds')
      .set('x-api-key', 'valid-api-key')
      .send({ url: 'http://example.com' })
      .expect(StatusCodes.INTERNAL_SERVER_ERROR);

  });
});
