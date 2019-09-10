(function () {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    window.addEventListener('load', calculate);

    function calculate() {
        const MIN_YEAR = 1900;
        const MAX_YEAR = 2100;

        const currentDate = new Date();

        let statusMessage = '';
        let countdownDate = null;

        const yearsPast = findYearsWithUnluckyProgrammersDay(MIN_YEAR, currentDate.getFullYear() - 1);
        const yearsFuture = findYearsWithUnluckyProgrammersDay(currentDate.getFullYear() + 1, MAX_YEAR);

        if (isUnluckyProgrammersDay(currentDate)) {
            // today!
            yearsPast.push(currentDate.getFullYear());
            statusMessage = `Hooray! Today is the Unlucky Programmer's Day!`;
        } else {
            let checkDate = getSeptemberThirteenDate(currentDate.getFullYear());
            if (isUnluckyProgrammersDay(checkDate)) {
                // this year
                if (checkDate > currentDate) {
                    // will be this year
                    yearsFuture.unshift(currentDate.getFullYear());
                    statusMessage = 'The closest one will come this year!';
                } else {
                    // already been this year
                    yearsPast.push(currentDate.getFullYear());
                    statusMessage = 'This day has already been in this year';
                }
                countdownDate = checkDate;
            } else {
                // not this year
                countdownDate = getSeptemberThirteenDate(yearsFuture[0]);
            }
        }

        if (countdownDate) {
            startCountdown(countdownDate);
        }

        document.getElementById('current-status').innerText = statusMessage;
        document.getElementById('years-past').innerText = yearsPast.join(', ');
        document.getElementById('years-future').innerText = yearsFuture.join(', ');
    }

    function startCountdown(toDate) {
        const daysElem = document.getElementById('days');
        const hoursElem = document.getElementById('hours');
        const minutesElem = document.getElementById('minutes');
        const secondsElem = document.getElementById('seconds');

        const currentDate = new Date();
        let timeRemaining = toDate - currentDate;
        const int = setInterval(step, SECOND);
        step();

        function step() {
            if (timeRemaining >= SECOND) {
                timeRemaining -= SECOND;

                const days = Math.floor(timeRemaining / DAY).toString();
                setInnerText(daysElem, days);

                const hours = doubleDigit(Math.floor((timeRemaining % DAY) / HOUR));
                setInnerText(hoursElem, hours);

                const minutes = doubleDigit(Math.floor((timeRemaining % HOUR) / MINUTE));
                setInnerText(minutesElem, minutes);

                const seconds = doubleDigit(Math.floor((timeRemaining % MINUTE) / SECOND));
                setInnerText(secondsElem, seconds);
            } else {
                clearInterval(int);
                setTimeout(calculate, SECOND);
            }
        }
    }

    function findYearsWithUnluckyProgrammersDay (fromYear, toYear) {
        const years = [];
        for (let year = fromYear; year <= toYear; year++) {
            const date = getSeptemberThirteenDate(year);
            if (isUnluckyProgrammersDay(date)) {
                years.push(year);
            }
        }
        return years;
    }

    function getSeptemberThirteenDate(year) {
        return new Date(year, 8, 13); // September 13
    }

    function doubleDigit(num) {
        return num.toString().padStart(2, 0);
    }

    function setInnerText(elem, text) {
        if (elem.innerText !== text) {
            elem.innerText = text;
        }
    };

    function isUnluckyDay(date) {
        return date.getDay() === 5 && date.getDate() === 13; // Friday the 13th.
    }

    function isProgrammersDay(date) {
        return getDayOfTheYear(date) === 256; // 256 day in the Year
    }

    function isUnluckyProgrammersDay(date) {
        return isUnluckyDay(date) && isProgrammersDay(date);
    }

    function getDayOfTheYear(date) {
        const start = new Date(date.getFullYear(), 0 , 0);

        // To take timezones and daylight savings into account (https://stackoverflow.com/a/8619946)
        const timezoneOffsetsDiff = start.getTimezoneOffset() - date.getTimezoneOffset();

        const daysDiff = (date-start) + (timezoneOffsetsDiff * MINUTE);
        const dayNumber = Math.floor(daysDiff / DAY);
        return dayNumber;
    }

}());
