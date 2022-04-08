
const timeZone = 7;

export const getCurrentTime = () => {

    const timeZoneOffset = (new Date()).getTimezoneOffset();
    const currentDate = Date.now();
    
    return currentDate + (timeZoneOffset + (timeZone * 60)) * 60 * 1000;

}