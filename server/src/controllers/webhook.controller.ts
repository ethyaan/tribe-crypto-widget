import { NextFunction, Request, Response } from 'express';

import { Types } from '@tribeplatform/gql-client';
import { logger } from '@/utils/logger';

const DEFAULT_SETTINGS = {}

class WebhookController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    const input = req.body;
    try {

      // check if this is challenge request for verification or not, ifyes, perform it and stop oing further
      if(this.challengePassResponse({...input, res }))  { return null };

      let result: any = {
        type: input.type,
        status: 'SUCCEEDED',
        data: {},
      };

      // if request type is 'SUBSCRIPTION' since we are going to check post.created, post.updated
      if(input.type === 'SUBSCRIPTION') {
        result = await this.cryptoWidgetHandler(input);
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

  private challengePassResponse({ data, res }) {
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

  
  private async cryptoWidgetHandler({ type , data }) {
    const { name, object: { mappingFields } } = data;
    if(name === 'post.created') {
      const { key, value, type } = mappingFields.filter( (e: any) => e.type === 'content')[0];

    }
    console.log('_DEBUG_ =>', mappingFields);
    console.log('_DEBUG_ =>', data);
    return {
      type: type,
      status: 'SUCCEEDED',
      data: {}
    };
  }

  // /\[cw\/?[^]]+]/gi

  // {
  //      time: '2022-04-16T19:24:11.043Z',
  //      verb: 'CREATED',
  //      verbAction: 'ADDED',
  //      actor: {
  //        id: 'sxTN0O5QuB',
  //        roleId: 'kxFMlTeA0b',
  //        roleType: 'admin',
  //        sessionInfo: {
  //          ip: '159.146.43.248',
  //          country: 'Turkey',
  //          locale: 'en-US',
  //          client: 0,
  //          clientVersion: '1.0.0',
  //          os: 'Mac OS',
  //          osVersion: '10.15.7',
  //          deviceBrand: '',
  //          trackerGlobalSessionId: null,
  //          trackerSessionId: null
  //        },
  //        spaceRoleId: 'FuOMhVeFaFbH',
  //        spaceRoleType: 'member'
  //      },
  //      object: {
  //        id: 'uieW9EUM12X0xml',
  //        networkId: 'SwnvrFguXX',
  //        templateId: null,
  //        spaceId: 'R4MQJSHTFb12',
  //        postTypeId: 'vZtvQRvIwVwAYRG',
  //        createdAt: '2022-04-16T19:24:11.043Z',
  //        updatedAt: '2022-04-16T19:24:11.043Z',
  //        publishedAt: '2022-04-16T19:24:11.214Z',
  //        status: 'PUBLISHED',
  //        createdById: 'sxTN0O5QuB',
  //        ownerId: 'sxTN0O5QuB',
  //        isAnonymous: false,
  //        mentionedMembers: [],
  //        embedIds: [],
  //        imageIds: [],
  //        pinnedInto: [],
  //        repliedToId: null,
  //        repliedToIds: [],
  //        repliesCount: 0,
  //        totalRepliesCount: 0,
  //        seoDetail: { title: 'Second test' },
  //        customSeoDetail: {},
  //        topRepliers: [],
  //        title: 'Second test',
  //        slug: 'second-test',
  //        key: 'uieW9EUM12X0xml',
  //        shortContent: '<p>test hook call</p>',
  //        language: 'en',
  //        hasMoreContent: false,
  //        isReply: false,
  //        mappingFields: [ [Object], [Object], [Object] ],
  //        primaryReactionType: 'EMOJI_BASE',
  //        positiveReactionsCount: 0,
  //        negativeReactionsCount: 0,
  //        reactionsCount: 0,
  //        singleChoiceReactions: [],
  //        isHidden: false,
  //        positiveReactions: null,
  //        negativeReactions: null,
  //        allowedEmojis: null,
  //        forbiddenEmojis: null,
  //        tagIds: [],
  //        attachmentIds: [],
  //        searchFields: [ 'title', 'content' ]
  //      },
  //      with: {},
  //      target: {
  //        organizationId: '43MFLbqLot',
  //        networkId: 'SwnvrFguXX',
  //        collectionId: 'fgundhqCKBm1',
  //        postTypeId: 'vZtvQRvIwVwAYRG',
  //        spaceId: 'R4MQJSHTFb12',
  //        memberId: 'sxTN0O5QuB'
  //      },
  //      id: '297ad49dbd36c2a8c86dccefa110c565',
  //      name: 'post.created',
  //      noun: 'POST',
  //      shortDescription: 'Create Post',
  //      secretInfo: null
  //    }


}

export default WebhookController;
