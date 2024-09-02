import puppeteer from 'puppeteer-extra';
import { scrapeEvent, scrapeResults } from '../src/HorseOdds/horseOdd.Service';

jest.mock('puppeteer-extra');

const mockPage = {
  setUserAgent: jest.fn(),
  setJavaScriptEnabled: jest.fn(),
  goto: jest.fn(),
  evaluate: jest.fn(),
  screenshot: jest.fn(),
};

const mockBrowser = {
  newPage: jest.fn().mockResolvedValue(mockPage),
  close: jest.fn(),
};

(puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

describe('Scrape Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Scrape and Return Horse Event Data', async () => {
    const mockHorses = [
      {
        name: 'Horse 1',
        trainer: 'Trainer A',
        jockee: 'Jockey A',
        rating: 85,
        age: 5,
        weight: 154,
        odds: 2.5,
      },
      {
        name: 'Horse 2',
        trainer: 'Trainer B',
        jockee: 'Jockey B',
        rating: 90,
        age: 4,
        weight: 140,
        odds: 1.8,
      },
    ];

    mockPage.evaluate.mockImplementationOnce(() => mockHorses);

    const url = 'https://testhorses.com';
    const result = await scrapeEvent(url);

    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockBrowser.newPage).toHaveBeenCalled();
    expect(mockPage.setUserAgent).toHaveBeenCalledWith(expect.any(String));
    expect(mockPage.setJavaScriptEnabled).toHaveBeenCalledWith(true);
    expect(mockPage.goto).toHaveBeenCalledWith(url, { waitUntil: ['networkidle2', 'load', 'networkidle0'] });
    expect(mockPage.evaluate).toHaveBeenCalled();
    expect(result).toEqual(mockHorses);
  });


  it('Scrape and Return Horse Result Data', async () => {
    const mockHorses = [
      {
        name: 'Horse 1',
        position: 81,
        odds: 2.5,
      },
      {
        name: 'Horse 2',
        position: 2,
        odds: 2,
      },
    ];

    mockPage.evaluate.mockImplementationOnce(() => mockHorses);

    const url = 'https://testhorses.com';
    const result = await scrapeResults(url);

    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockBrowser.newPage).toHaveBeenCalled();
    expect(mockPage.setUserAgent).toHaveBeenCalledWith(expect.any(String));
    expect(mockPage.setJavaScriptEnabled).toHaveBeenCalledWith(true);
    expect(mockPage.goto).toHaveBeenCalledWith(url, { waitUntil: ['networkidle2', 'load', 'networkidle0'] });
    expect(mockPage.evaluate).toHaveBeenCalled();
    expect(result).toEqual(mockHorses);
  });

  it('Handle Unknown Error', async () => {
    mockPage.evaluate.mockRejectedValueOnce(new Error('Evaluation failed'));

    const url = 'https://testhorses.com';
    const result = await scrapeEvent(url);

    expect(result).toBeUndefined();
    expect(mockBrowser.close).toHaveBeenCalled();
  });
});
