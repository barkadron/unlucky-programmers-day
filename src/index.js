(function () {

    /*
        https://en.wikipedia.org/wiki/Friday_the_13th
        https://en.wikipedia.org/wiki/Day_of_the_Programmer
    */

    window.findYearsWithUnluckyProgrammerDay = findYearsWithUnluckyProgrammerDay;

    function findYearsWithUnluckyProgrammerDay (fromYear, toYear) {
        const years = [];
        for (let year = fromYear; year <= toYear; year++) {
            const date = new Date(year, 8, 13) // September 13
            if (isUnluckyDay(date)) {
                if (isProgrammerDay(date)) {
                    years.push(year);
                }
            }
        }
        return years;
    }

    function isUnluckyDay(date) {
        return date.getDay() === 5 && date.getDate() === 13; // Friday the 13th.
    }

    function isProgrammerDay(date) {
        const dayNumber = getDayOfTheYear(date);
        return dayNumber === 256; // 256 day in the Year
    }

    function getDayOfTheYear(date) {
        const oneDay = 1000 * 60 * 60 * 24;
        const start = new Date(date.getFullYear(), 0 , 0);

        // To take timezones and daylight savings into account (https://stackoverflow.com/a/8619946)
        const timezoneOffsetsDiff = start.getTimezoneOffset() - date.getTimezoneOffset();

        const daysDiff = (date-start) + (timezoneOffsetsDiff * 60 * 1000);
        const dayNumber = Math.floor(daysDiff / oneDay);
        return dayNumber;
    }

}());

/*
    > window.findYearsWithUnluckyProgrammerDay(2000, 2100);
    < (11) [2002, 2013, 2019, 2030, 2041, 2047, 2058, 2069, 2075, 2086, 2097]
*/
