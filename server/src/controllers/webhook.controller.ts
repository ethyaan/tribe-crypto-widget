import { NextFunction, Request, Response } from 'express';
import { Types } from '@tribeplatform/gql-client';
import { logger } from '@/utils/logger';
import { getTop10, getSelectedList, getGainerLooser } from '@services/coinmarktcap';

const WIDGET_LIST = {
  'top-10' : { get: getTop10 } ,
  'list'   : { get: getSelectedList },
  'looser' : { get: getGainerLooser },
  'gainer' : { get: getGainerLooser }
};

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
      const { key, value, type } = mappingFields.filter(({ key }) => key === 'content')[0];
      const shortCodes = this._extractCWShortCodes(value);
      console.log('_DEBUG_ =>', shortCodes);
    }
    // console.log('_DEBUG_ =>', mappingFields.filter( (e: any) =>{ console.log('_e_ =>', e); return e.type === 'content' }));
    return {
      type: type,
      status: 'SUCCEEDED',
      data: {}
    };
  }


  /**
   * extract a unique list of used shortcodes
   * @param content 
   * @returns 
   */
  private _extractCWShortCodes(content) {
    const regex = /\[cw\/?[^]+]/gi;
    const matches =  content.match(regex);
    if(matches) {
      const widgets = matches.map((widget) => {
         return this.getWidgetTypeAndInformation(widget);
      }).filter((element, index, array) => index === array.findIndex((item) => item.widget === element.widget));
      return widgets;
    }
    return null;
  }

  /**
   * get the type of the widget and it's properties values 
   * @param widgetShortCode 
   * @returns 
   */
  private getWidgetTypeAndInformation(widgetShortCode: string) {
    for(let widget of Object.keys(WIDGET_LIST)) {
      if(widgetShortCode.includes(widget)) {
        const widgetValue = this._getWidgetProperyValue(widgetShortCode, widget);
        const widgetPair  = this._getWidgetProperyValue(widgetShortCode, 'pair');
        return {
          code: widgetShortCode,
          widget,
          widgetValue,
          widgetPair
        };
      }
    }
    return null;
  }

  /**
   * get the propery value of the shortCode if value exists 
   * @param widgetShortCode 
   * @param property 
   * @returns 
   */
  private _getWidgetProperyValue(widgetShortCode: string, property: string): string|null {
    const parts = widgetShortCode.replace(/\[|\]|["]+/gi, '').split(' ');
    for(let part of parts) {
      if(part.includes(property) && part.includes('=')) {
        const value = part.split('=')[1];
        return value ? value: '';
      }
    }
    return null;
  }

}

export default WebhookController;
