
const timeZone = 7;

export const getCurrentTime = () => {

    const timeZoneOffset = (new Date()).getTimezoneOffset();
    const currentDate = Date.now();
    
    return currentDate + (timeZoneOffset + (timeZone * 60)) * 60 * 1000;

    // function convertTZ(date, tzString) {
    //     return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
    // }
    
    // // Bonus: You can also put Date object to first arg
    // const date = new Date()
    // convertTZ(date, "Asia/Jakarta") // current date-time in jakarta.

    // console.log(convertTZ(date, "Asia/Jakarta"));

}