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
  'gainer': {
    get: getGainerLooser,
    params: (v) => { return { sortDirection: 'asc' } },
    render
  },
  'looser': {
    get: getGainerLooser,
    params: (v) => { return { sortDirection: 'desc' } },
    render
  }
};

/**
 * extract a unique list of used shortcodes
 * @param content 
 * @returns 
 */
export const extractCWShortCodes = (content: string) => {
  const regex = /\[cw\/?[^|cw]+]/gi;
  const matches = content.match(regex);
  console.log('_matches_ =>', matches);
  if (matches) {
    const widgets = matches.map((widget) => {
      return getWidgetTypeAndInformation(widget);
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
export const getWidgetTypeAndInformation = (widgetShortCode: string) => {
  for (let widget of Object.keys(WIDGET_LIST)) {
    if (widgetShortCode.includes(widget)) {
      const widgetValue = getWidgetProperyValue(widgetShortCode, widget);
      const widgetPair = getWidgetProperyValue(widgetShortCode, 'pair') || `USD`;
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
  const parts = widgetShortCode.replace(/\[|\]|["]+/gi, '').split(' ');
  for (let part of parts) {
    if (part.includes(property) && part.includes('=')) {
      const value = part.split('=')[1];
      return value ? value : '';
    }
  }
  return null;
}
