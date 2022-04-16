import axios from "axios";
import { CMC_API_URL, CMC_KEY } from "@config"
import { logger } from '@/utils/logger';

// const Response = {
//     "data": [
//     {
//     "id": 1,
//     "name": "Bitcoin",
//     "symbol": "BTC",
//     "slug": "bitcoin",
//     "cmc_rank": 1,
//     "num_market_pairs": 500,
//     "circulating_supply": 17200062,
//     "total_supply": 17200062,
//     "max_supply": 21000000,
//     "last_updated": "2018-06-02T22:51:28.209Z",
//     "date_added": "2013-04-28T00:00:00.000Z",
//     "tags": [
//     "mineable"
//     ],
//     "platform": null,
//     "quote": {
//     "USD": {
//     "price": 9283.92,
//     "volume_24h": 7155680000,
//     "percent_change_1h": -0.152774,
//     "percent_change_24h": 0.518894,
//     "percent_change_7d": 0.986573,
//     "market_cap": 158055024432,
//     "last_updated": "2018-08-09T22:53:32.000Z"
//     },
//     "BTC": {
//     "price": 1,
//     "volume_24h": 772012,
//     "percent_change_1h": 0,
//     "percent_change_24h": 0,
//     "percent_change_7d": 0,
//     "market_cap": 17024600,
//     "last_updated": "2018-08-09T22:53:32.000Z"
//     }
//     }
//     },
//     {
//     "id": 1027,
//     "name": "Ethereum",
//     "symbol": "ETH",
//     "slug": "ethereum",
//     "num_market_pairs": 6089,
//     "circulating_supply": 17200062,
//     "total_supply": 17200062,
//     "max_supply": 21000000,
//     "last_updated": "2018-06-02T22:51:28.209Z",
//     "date_added": "2013-04-28T00:00:00.000Z",
//     "tags": [
//     "mineable"
//     ],
//     "platform": null,
//     "quote": {
//     "USD": {
//     "price": 1678.6501384942708,
//     "volume_24h": 7155680000,
//     "percent_change_1h": -0.152774,
//     "percent_change_24h": 0.518894,
//     "percent_change_7d": 0.986573,
//     "market_cap": 158055024432,
//     "last_updated": "2018-08-09T22:53:32.000Z"
//     },
//     "ETH": {
//     "price": 1,
//     "volume_24h": 772012,
//     "percent_change_1h": 0,
//     "percent_change_24h": 0,
//     "percent_change_7d": 0,
//     "market_cap": 17024600,
//     "last_updated": "2018-08-09T22:53:32.000Z"
//     }
//     }
//     }
//     ],
//     "status": {
//     "timestamp": "2019-04-02T22:44:24.200Z",
//     "error_code": 0,
//     "error_message": "",
//     "elapsed": 10,
//     "credit_count": 1
//     }
//     };

export const getTop10 = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let response = [];
            let basePair = `USD`;
            let { data: { data: responseData }} = await axios.get(
                `${CMC_API_URL}/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=${basePair}`,
                { headers: { 'X-CMC_PRO_API_KEY': CMC_KEY } }
            );

            responseData.forEach(({ symbol, quote }) => {
                const { price, percent_change_24h } = quote[basePair];
                response.push({
                    symbol: `${symbol}/${basePair}`,
                    price: parseFloat(price).toFixed(2),
                    percent_change_24h : parseFloat(percent_change_24h).toFixed(2)
                });
            });
            console.log('_geTop10_ =>', response);
            resolve(response);
        } catch(error) {
            logger.error('Error while fetch data from CMC ', error)
            reject(null);
        }
    });
}

