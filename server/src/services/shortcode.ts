import { getTop10, getSelectedList, getGainerLooser } from '@/services/coinmarketcap';

const WIDGET_LIST = {
  'top-10': { get: getTop10, params: (v) => { return {} } },
  'list'  : { get: getSelectedList, params: (v) => { return { selectedSymbols: v } } },
  'gainer': { get: getGainerLooser, params: (v) => { return { sortDirection: 'asc' } } },
  'looser': { get: getGainerLooser, params: (v) => { return { sortDirection: 'desc' } } }
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