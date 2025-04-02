export const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  export const removeExtraSpaces = (str: string): string => {
    return str.replace(/\s+/g, ' ').trim();
  };