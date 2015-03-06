var lib = {
  vocab: require('../vocab.js'),
  date: require('../date.js')
};


/**
 * This function inspect dates written with letters, following this order:
 * year, month, day.
 *
 * @param {String} text – Text to search in.
 * @param {Object} result
 */

module.exports = function (text, result) {

  var currentYear = new Date().getUTCFullYear();

  var regex = new RegExp(

    // day name
      '('
      + '(?:' + lib.vocab.days.names.join('|') + ')'
      + '(?: |(?:, ))'
    + '){0,1}'


    // year
    + '([0-9]{4})'
    + ' '

    // month
    + '(' + lib.vocab.months.bothForm.join('|') + ')'
    + '[^0-9]{0,5}'

    // day
    + '('
      + lib.vocab.days.letters.join('|') + '|'
      + lib.vocab.days.numbersAndLetters.join('|') + '|'
      + lib.vocab.days.numbers.join('|')
    + ')'

    , 'ig'
  );

  var arr, obj;
  var year, month, day;

  while ((arr = regex.exec(text)) !== null) {

    year = arr[2];

    // The year is too high.
    if (parseInt(year, 10) > currentYear + 100)
      continue;

    month = arr[3].toLowerCase();
    day = arr[4].toLowerCase();

    obj = {
      "type": 'letters',
      "format": 'year month day',
      "text": {
        "value": arr[0],
        "index": regex.lastIndex - arr[0].length
      },
      "standardDate": year + '-'
                + lib.vocab.months.map[month] + '-'
                + lib.vocab.days.map[day],
    };

    obj.timeInMs = lib.date.standardDateInMs(obj.standardDate);

    result.datesFound.push(obj);
    result.yearMonthDayDatesCount++;

  }

};