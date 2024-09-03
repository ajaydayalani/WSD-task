import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';

puppeteer.use(StealthPlugin());

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

interface Horse {
    name: string;
    trainer?: string;
    jockee?: string;
    rating?: number;
    age?: number;
    weight?: number;
    odds:string;

}

interface HorseRes{
    name: string,
    position: number;
    odds: string;
}


export const scrapeResults = async (url: string): Promise<HorseRes[]> => {
    let browser: Browser | undefined;
    try {
        browser = await puppeteer.launch();
        const UA = USER_AGENT;

        const page: Page = await browser.newPage();
        await page.setUserAgent(UA);
        await page.setJavaScriptEnabled(true);

        await page.goto(url, { waitUntil: ['networkidle2', 'load', 'networkidle0'] }); 

        await page.screenshot({
            path: 'screenshot'+Date.now()+'.jpg'
          });
                  
        const horses: HorseRes[] = await page.evaluate(() => {
            const firstHorse = Array.from(document.querySelectorAll('.sc-kUbfpu.gkPulh'));
            const first: HorseRes[] = firstHorse.map(element => {
                const name = (element.querySelector('.sc-fubDmA.bHRPAw.sc-dlfmHC.VnIYO')?.textContent || '').trim();
                const position=parseFloat((element.querySelector('.sc-fubDmA.bHRPAw.sc-dlfmHC.hwrwlF')?.textContent || '').trim());
                const odds = (element.querySelector('.sc-fubDmA.dkMOSI.sc-dlfmHC.bxakJD')?.textContent || ' ').trim()
                

                return { name: name,  position:position, odds:odds };
            });

            const nexthorses = Array.from(document.querySelectorAll('.sc-gKsecS.dnNfiV.sc-dlfmHC.hqvt'));
            const rest: HorseRes[] = nexthorses.map(element => {
                const name = (element.querySelector('.sc-fubDmA.bHRPAw.sc-dlfmHC.VnIYO')?.textContent || '').trim();
                const position=parseFloat((element.querySelector('.sc-fubDmA.bHRPAw.sc-dlfmHC.hwrwlF')?.textContent || '').trim());
                const odds = (element.querySelector('.sc-fubDmA.dkMOSI.sc-dlfmHC.bxakJD')?.textContent || ' ').trim()
                

                return { name: name,  position:position, odds:odds };
            });
           

            return first.concat(rest)

        
        
        
        
        
        
        
        });

        return horses;
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

export const scrapeEvent = async (url: string): Promise<Horse[]> => {
    let browser: Browser | undefined;
    try {
        browser = await puppeteer.launch();
        const UA = USER_AGENT;

        const page: Page = await browser.newPage();
        await page.setUserAgent(UA);
        await page.setJavaScriptEnabled(true);

        await page.goto(url, { waitUntil: ['networkidle2', 'load', 'networkidle0'] }); 

        await page.screenshot({
            path: 'screenshot'+Date.now()+'.jpg'
          });

        
          
                  
        const horses: Horse[] = await page.evaluate(() => {
            const horseElements = Array.from(document.querySelectorAll('.racerComponent'));


            return horseElements.map(element => {
                const name = (element.querySelector('.racerTitle')?.textContent || ' ').trim();

                const TJ = (element.querySelector('.racerSubtitle')?.textContent || ' ').trim().split('/');
                const rating = parseInt(element.querySelector('.starRating.StarRating')?.getAttribute("rating") || ' ')
                const age = parseInt((element.querySelector('.racerAge')?.textContent || ' ').trim().split(" ")[0])
                
                const [_, stones, pounds] = (element.querySelector('.racerWeight')?.textContent || ' ').trim().match(/(\d+)st (\d+)lbs/) || []
                const weight = (parseInt(stones, 10) * 14) + parseInt(pounds, 10);

                const odds = (element.querySelector('.odds')?.textContent || ' ').trim()
                

                return { 
                    name: name, 
                    ...(TJ[0] && {trainer: TJ[0]}) , 
                    ...(TJ[1] && {jockee: TJ[1]}), 
                    ...(rating && {rating: rating} ), 
                    ...(age && {age: age}), 
                    ...(weight && {weight:weight}), 
                    odds:odds };
            });
        });
        const filteredHorses = horses.filter(horse => horse.trainer !== "");

        return filteredHorses;
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
