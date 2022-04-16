import axios from "axios";
import { CMC_API_URL, CMC_KEY } from "@config"
import { logger } from '@/utils/logger';

const apiRoutes = {
    'listings-latest'   : '/v1/cryptocurrency/listings/latest',
    'quotes-latest'     : '/v2/cryptocurrency/quotes/latest',
    'gainers-losers'    : '/v1/cryptocurrency/trending/gainers-losers'
};

enum sortDirection {
    gainer = 'asc',
    looser = 'desc'
}

const call = (rouetName: string, queryString: string, basePair = 'USD') => {
    const route = apiRoutes[rouetName];
    if(!route) return;
    return axios.get(
        `${CMC_API_URL}${route}${queryString}`,
        { headers: { 'X-CMC_PRO_API_KEY': CMC_KEY } }
    );
};


/**
 * get top 10 from coin market cap based on cmc_rank and format as simpler object
 * @returns 
 */
export const getTop10 = (): Promise<any> => {
    return new Promise(async(resolve, reject): Promise<any> => {
        try {
            let response = [];
            let basePair = `USD`;
            let { data: { data }} = await call('listings-latest', `?start=1&limit=10&convert=${basePair}`);
            data.forEach(({ symbol, quote }) => {
                const { price, percent_change_24h } = quote[basePair];
                response.push({
                    symbol: `${symbol}/${basePair}`,
                    price: parseFloat(price).toFixed(2),
                    percent_change_24h : parseFloat(percent_change_24h).toFixed(2)
                });
            });
            resolve(response);
        } catch(error) {
            logger.error('Error while fetch data from CMC ', error)
            reject(null);
        }
    });
}

/**
 * it will return the selecte dsymbols information only
 * @param selectedSymbols 
 * @returns 
 */
export const getSelectedList = (selectedSymbols: String):Promise<any> => {
    return new Promise(async(resolve, reject): Promise<any> => {
        try {
            let response = [];
            let basePair = `USD`;
            let { data: { data }} = await call('quotes-latest', `?symbol=${selectedSymbols}&convert=${basePair}`);
            console.log('_DEBUG_ =>', data);
            Object.keys(data).forEach((key) => {
                const { symbol, quote } = data[key];
                const { price, percent_change_24h } = quote[basePair];
                response.push({
                    symbol: `${symbol}/${basePair}`,
                    price: parseFloat(price).toFixed(2),
                    percent_change_24h : parseFloat(percent_change_24h).toFixed(2)
                });
            });
            resolve(response);
        } catch(error) {
            logger.error('Error while fetch data from CMC ', error)
            reject(null);
        }
    });
}

export const getGainerLooser = (sortDirection: sortDirection) => {
    return new Promise(async(resolve, reject) => {
        try {let response = [];
            let basePair = `USD`;
            let { data: { data }} = await call('gainers-losers', `?start=1&limit=10&sort_dir=${sortDirection}&convert=${basePair}`);
            data.forEach(({ symbol, quote }) => {
                const { price, percent_change_24h } = quote[basePair];
                response.push({
                    symbol: `${symbol}/${basePair}`,
                    price: parseFloat(price).toFixed(2),
                    percent_change_24h : parseFloat(percent_change_24h).toFixed(2)
                });
            });
            resolve(response);
        } catch(error) {
            logger.error('Error while fetch data from CMC ', error)
            reject(null);
        }
    });
}