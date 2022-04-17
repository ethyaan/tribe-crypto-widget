import { getTop10, getSelectedList, getGainerLooser } from '@/services/coinmarketcap';

/**
 * render the result of the API as html elemt
 * @param result 
 * @returns html element as string
 */
const render = (result: [any]) => {
  let out = ``;
  if(result && result.length > 0) {
    out += `<ul class="crypto-widget">`;
    result.forEach((asset) => {
      out += `<li> ${asset.symbol} - ${asset.price} (${asset.percent_change_24h}) <li>`;
    });
    out += `</ul>`;
  }
  return out;
};

// available widgets list
const WIDGET_LIST = {
  'top-10': {
    get: getTop10,
    params: (v) => { return {} },
    render
  },
  'list'  : {
    get: getSelectedList,
    params: (v) => { return { selectedSymbols: v } },
    render
  },
  // 'gainer': {
  //   get: getGainerLooser,
  //   params: (v) => { return { sortDirection: 'asc' } },
  //   render
  // },
  // 'looser': {
  //   get: getGainerLooser,
  //   params: (v) => { return { sortDirection: 'desc' } },
  //   render
  // }
};

/**
 * extract a unique list of used shortcodes
 * @param content 
 * @returns 
 */
export const extractCWShortCodes = (content: string) => {
  // reg ex to find the shortcode starting like [cw] and thier properities and values
  const regex = /\[cw\/?[^|cw]+]/g;
  const matches = content.match(regex);
  if (matches) {
    // map the matches array to parsed widget information and duplicates and null widgets will be removed
    const widgets = matches.map(getWidgetTypeAndInformation).filter((element, index, array) => index === array.findIndex((item) => {
      return element !== null && item?.widget === element?.widget
    }));
    return {
      widgets,
      // return all the matches are removable except the ones that identifed as widget 
      removables: matches.filter((element) => widgets.findIndex((item) => item?.code === element) === -1)
    };
  }
  return null;
}

/**
 * get the type of the widget and it's properties values
 * @param widgetShortCode 
 * @returns 
 */
export const getWidgetTypeAndInformation = (widgetShortCode: string) => {
  // loop through list of defined widgest in WIDGET_LIST constant 
  for (let widget of Object.keys(WIDGET_LIST)) {
    // check to make sure shortCode matched word is one of the defined widgets
    if (widgetShortCode.includes(widget)) {
      const widgetValue = getWidgetProperyValue(widgetShortCode, widget); // get shortcode value if is available 
      const widgetPair = getWidgetProperyValue(widgetShortCode, 'pair') || `USD`; // get the pair property value if is available
      // return object with possible properties for all matched shortcodes + widget properties
      return {
        code: widgetShortCode,
        widget,
        widgetValue,
        widgetPair,
        ...WIDGET_LIST[widget]
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
export const getWidgetProperyValue = (widgetShortCode: string, property: string): string | null => {
  // remove slashed, ", ] sign from the propery - split the short code to pieces by space to separate each property part
  const parts = widgetShortCode.replace(/\\|\]|["]+/gi, '').split(' ');
  // loop through parts and check if they have value
  for (let part of parts) {
    if (part.includes(property) && part.includes('=')) {
      // split the propery by = and get the value is if available
      const value = part.split('=')[1];
      return value ? value : '';
    }
  }
  return null;
}
