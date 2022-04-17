import { NextFunction, Request, Response } from 'express';
import { Types } from '@tribeplatform/gql-client';
import { logger } from '@/utils/logger';
import { extractCWShortCodes } from '@/services/shortcode';
import { gClient } from '@/services/graphql';

class WebhookController {

  public index = async (req: Request, res: Response, next: NextFunction) => {
    const input = req.body;
    try {

      // check if this is challenge request for verification or not, ifyes, perform it and stop oing further
      if (this._challengePassResponse({ ...input, res })) { return null };

      let result: any = {
        type: input.type,
        status: 'SUCCEEDED',
        data: {},
      };

      // if request type is 'SUBSCRIPTION' since we are going to check post.created, post.updated
      if (input.type === 'SUBSCRIPTION') {
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
   * how it works: 
   * firs we check for 'post.created' & 'post.updated' hook, then we extract the 'content' feild from mappingFields
   * then we start for checkign all possible `cw` shortcodes with extractCWShortCodes method 
   * then we have list of valid and invalid widgets knows as { widgets & removable }
   * we remove the removable from html content since those are invalid 
   * and we call the widgets getters & render method to fetch the final template for shortcode 
   * in case api call fails due to any reason, we ignore that widget and replace it with null
   * and finally we replace it with new template and update the mappingFields 
   * and thenwe call the update post mutation
   * note: after we update a post again same update hook for the same post will be triggered
   * but since there is no shortcode, action will be ignored
   * @param param0 
   * @returns 
   */
  private async _cryptoWidgetHandler({ type, data }) {
    try {
      const { name, object: { mappingFields, id } } = data;
      if (['post.created', 'post.updated'].indexOf(name) > -1) {
        const contentIndex = mappingFields.findIndex(({ key }) => key === 'content');
        const { value } = mappingFields[contentIndex];
        const widgetsObject = extractCWShortCodes(value);
        if(widgetsObject) {
          const { widgets, removables } = extractCWShortCodes(value);
          let htmlValue = value;
          // replace the widget templates
          for (let widget of widgets) {
            let result = await widget.get({ pair: widget.widgetPair, ...widget.params(widget.widgetValue) });
            let template = widget.render(result);
            htmlValue = htmlValue.replace(widget.code, template);
          }

          // remove the removables
          for (let remove of removables) {
            htmlValue = htmlValue.replace(remove, '');
          }

          mappingFields[contentIndex] = { ...mappingFields[contentIndex], value: htmlValue };
          await this._updatePost(id, { mappingFields });
        }
      }
    } catch (error) {
      logger.error('Error in _cryptoWidgetHandler => ', error);
    }
    return {
      type: type,
      status: 'SUCCEEDED',
      data: {}
    };
  }

  /**
   * update post by calling graphql mutation
   * @param id 
   * @param input 
   */
  private async _updatePost(id: Types.Scalars['ID'], input: Types.UpdatePostInput) {
    const client = await gClient.getClient();
    const updatePost = await client.posts.update({ id, input });
  }

}

export default WebhookController;
