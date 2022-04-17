import axios from "axios";
import { CMC_API_URL, CMC_KEY } from "@config"
import { logger } from '@/utils/logger';

// list of used coin market cap apis
const apiRoutes = {
    'listings-latest'   : '/v1/cryptocurrency/listings/latest',
    'quotes-latest'     : '/v2/cryptocurrency/quotes/latest',
    'gainers-losers'    : '/v1/cryptocurrency/trending/gainers-losers'
};

/**
 * this is for calling axios api with CMC_key mapped
 * @param rouetName base on apiRoutes defined apis
 * @param queryString optional query string
 * @returns axios instance
 */
const call = (rouetName: string, queryString: string = ``) => {
    const route = apiRoutes[rouetName];
    if(!route) return;
    return axios.get(
        `${CMC_API_URL}${route}${queryString}`,
        { headers: { 'X-CMC_PRO_API_KEY': CMC_KEY } }
    );
};

/**
 * generate response array based on api response object
 * @param responseArray 
 * @param pair 
 */
const generateResponseArray = (responseArray: any, pair: string) => {
    let response = [];
    (responseArray && responseArray.forEach(({ symbol, quote }) => {
        const { price, percent_change_24h } = quote[pair];
        response.push({
            symbol: `${symbol}/${pair}`,
            price: parseFloat(price).toFixed(2),
            percent_change_24h : parseFloat(percent_change_24h).toFixed(2)
        });
    }));
    return response;
}

/**
 * get top 10 from coin market cap based on cmc_rank and format as simpler object
 * @param { pair } 
 * @returns 
 */
export const getTop10 = ({ pair }: any): Promise<any> => {
    return new Promise(async(resolve, reject): Promise<any> => {
        try {
            let { data: { data }} = await call('listings-latest', `?start=1&limit=10&convert=${pair}`);
            const response = generateResponseArray(data, pair);
            resolve(response);
        } catch(error) {
            logger.error('Error while fetch data from CMC ', error)
            reject(null);
        }
    });
}

/**
 * it will return the selecte dsymbols information only
 * @param { selectedSymbols, pair } 
 * @returns 
 */
export const getSelectedList = ({ selectedSymbols, pair }: any):Promise<any> => {
    return new Promise(async(resolve, reject): Promise<any> => {
        try {
            let { data: { data }} = await call('quotes-latest', `?symbol=${selectedSymbols}&convert=${pair}`);
            const response = generateResponseArray(
                Object.keys(data).map((key) => data[key]),
                pair
            );
            resolve(response);
        } catch(error) {
            logger.error('Error while fetch data from CMC ', error)
            reject(null);
        }
    });
}

/**
 * get the list of top 10 gainers or loosers
 * @param { sortDirection, pair }
 * @returns 
 */
export const getGainerLooser = ({ sortDirection, pair }: any): Promise<any> => {
    return new Promise(async(resolve, reject) => {
        try {
            let { data: { data }} = await call('gainers-losers', `?start=1&limit=10&sort_dir=${sortDirection}&convert=${pair}`);
            const response = generateResponseArray(data, pair);
            resolve(response);
        } catch(error) {
            logger.error('Error while fetch data from CMC ', error)
            reject(null);
        }
    });
}