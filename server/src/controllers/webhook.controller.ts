import { NextFunction, Request, Response } from 'express';
import { Types } from '@tribeplatform/gql-client';
import { logger } from '@/utils/logger';
import { extractCWShortCodes } from '@/services/shortcode';

class WebhookController {

  constructor() {
    console.log('test =>');
    // getSelectedList('BTC,ETH');
  }
  public index = async (req: Request, res: Response, next: NextFunction) => {
    const input = req.body;
    try {

      // check if this is challenge request for verification or not, ifyes, perform it and stop oing further
      if(this._challengePassResponse({...input, res }))  { return null };

      let result: any = {
        type: input.type,
        status: 'SUCCEEDED',
        data: {},
      };

      // if request type is 'SUBSCRIPTION' since we are going to check post.created, post.updated
      if(input.type === 'SUBSCRIPTION') {
        result = await this._cryptoWidgetHandler(input);
      }

      res.status(200).json(result);
    } catch (error) {
      logger.error(error);
      return {
        type: input.type,
        status: 'FAILED',
        data: {},
      };
    }
  };

  /**
   * return the challenge required response to verify the webhook api before update
   * @returns boolean
   */
  private _challengePassResponse({ data, res }): boolean {
    if (data?.challenge) {
      res.json({
        type: 'TEST',
        status: 'SUCCEEDED',
        data: {
          challenge: data?.challenge,
        },
      });
      return true;
    } else return false;
  }

  
  /**
   * the maim method to handle crypto widgets inside a post
   * @param param0 
   * @returns 
   */
  private async _cryptoWidgetHandler({ type , data }) {
    const { name, object: { mappingFields } } = data;
    if(['post.created', 'post.updated'].indexOf(name)> -1) {
      const { value } = mappingFields.filter(({ key }) => key === 'content')[0];
      const shortCodes = extractCWShortCodes(value);
      let htmlValue = value;
      for (let shortCode of shortCodes) {
        let result = await shortCode.get({ pair: shortCode.widgetPair, ...shortCode.params(shortCode.widgetValue) });
        console.log('_result_ =>', result);
        // htmlValue = htmlValue.replace(shortCode.code, result);
      }
      console.log('_DEBUG_ =>', shortCodes);
    }
    return {
      type: type,
      status: 'SUCCEEDED',
      data: {}
    };
  }

}

export default WebhookController;
