/*! Carmen v0.1.0 2018-06-07 */
// ^ UMD stub
(function (root, factory) {
  if (typeof define === 'function' && define.amd) { // AMD

    define(['exports'/*, // begin dependencies list:
      'underscore'*/
    ], factory);
  } else if (typeof exports === 'object') { // CommonJS

    factory(exports/*, // begin dependencies list:
      require('underscore')*/
    );
  } else { // Browser globals

    factory((root.carmen = {})/*, // begin dependencies list:
      root._*/
    );
  }
}(this,

function (exports, undefined) {
  /**
   * Parses a string that conforms to RFC-4646 and returns a hash of data found
   * in the string.
   *
   * see: [RFC-4646](http://tools.ietf.org/html/rfc4646)
   *
   * @public
   * @method parseRFC4646String as "carmen.parse"
   *
   * @param  {String} text  A valid RFC-4646 string
   *
   * @return {Object}       An object containing fields from RFC-4646
   *
   * @usage:
   *    carmen.parse('en-US');
   *    //{
   *    //  text: 'en-US', // NOTE that this is NOT the original string passed
   *    //                 // in; this string is reconstructed from the original
   *    //                 // fields and normalized; as such, en_US (a common
   *    //                 // mistake found in internet exploder) will be "fixed"
   *    //  language: 'en',
   *    //  region: 'US'
   *    //}
   *
   *    carmen.parse('sl-Latn-IT-nedis');
   *    //{
   *    //  text: 'sl-Latn-IT-nedis',
   *    //  language: 'sl',
   *    //  script: 'Latn',
   *    //  region: 'IT',
   *    //  variants: ['nedis']
   *    //}
   *
   * # All possible fields:
   * - text
   * - language
   * - extlang -- array
   * - script
   * - region
   * - variants -- array
   * - extensions -- hash
   * - private -- array
   * - grandfather
   */
  function parseRFC5646String (text) {
    var tmp, entry;

    text = text.replace(/_/g, '-');

    if (arrayContains(RFC_5646_GRANDFATHER_REGISTRY, text)) {
      entry = {
        text: text,
        grandfather: text
      };
    } else {
      tmp = text.match(RFC4646_PARSER);

      if (tmp) {
        entry = {};

        text = [];

        if (tmp[1] || tmp[3] || tmp[4]) {
          text.push(entry.language = tmp[1] || tmp[3] || tmp[4]);
          if (tmp[2]) {
            [].push.apply(text, entry.extlang = tmp[2].substr(1).split(SPLITTER));
          }
        }
        if (tmp[5]) {
          text.push(entry.script = tmp[5]);
        }
        if (tmp[6]) {
          text.push(entry.region = tmp[6]);
        }
        if (tmp[7]) {
          [].push.apply(text, entry.variants = tmp[7].substr(1).split(SPLITTER));
        }
        if (tmp[8]) {
          entry.extensions = {};
          tmp[8].replace(EXTENSION_PARSER, function (all, name, data) {
            text.push(name);
            [].push.apply(text, entry.extensions[name] = data.substr(1).split(SPLITTER));
          });
        }
        if (tmp[9] || tmp[10]) {
          text.push('x');
          [].push.apply(text, entry.private = (tmp[9] || tmp[10]).substr(1).split(SPLITTER));
        }
        if (tmp[11]) {
          text.push('i', entry.grandfather = tmp[11]);
        }

        entry.text = text.join('-');
      }
    }

    return entry;
  }

  function arrayContains (array, element) {
    if (array.indexOf) {
      return array.indexOf(element) !== -1;
    } else {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i] === element) {
          return true;
        }
      }
      return false;
    }
  }

  var
    /**
     * This enormous regex will (mostly) parse any RFC-4646 string. Some post-
     * processing is required for those fields that are arrays, especially
     * extensions, which are a key/value pair
     *
     * @private
     * @constant RFC4646_PARSER
     */
    RFC4646_PARSER = new RegExp(
      '^' +
        '(?:' +
          '(?:' +
            '(?:' + // language

              '(' + // [1]
                'q?' + // private use
                '[a-z]{2,3}' + // ISO-639
              ')' +

              '(' + // [2] extlangs
                '(?:' +
                  '-' +
                  '[a-z]{3}' + // language extension (reserved for future use)
                '){0,3}' +
              ')' +

            '|' +
              '([a-z]{4})' + // [3] reserved for future use
            '|' +
              '([a-z]{5,8})' + // [4] registered language subtag
            ')' +

            '(?:' +
              '-' +
              '([A-Z][a-z]{3})' + // [5] ISO-15924 (script)
            ')?' + // script

            '(?:' +
              '-' +
              '(' + // [6] region
                '[A-Z]{2}' + // ISO-3166-2
              '|' +
                '\\d{3}' + // UN M.49
              ')' +
            ')?' + // region

            '(?:' +
              '(' + // [7] variants
                '(?:' +
                  '-' +
                  '(?:' +
                    '[a-z\\d]{5,8}' +
                  '|' +
                    '\\d[a-z]{3}' +
                  ')' +
                ')+' +
              ')' +
            ')?' +

            '(?:' +
              '(' + // [8] extensions
                '(?:' +
                  '-' +
                  '[a-wy-z]' + // extension indicator
                  '(?:-\\w{2,8})+' + // extension
                ')+' +
              ')' +
            ')?' +

            '(?:' +
              '-' +
              'x' + // private use indicator
              '(' + // [9] private use
                '(?:-\\w{1,8})+' +
              ')' +
            ')?' +

          ')?' +

        '|' +

          'x' + // private use indicator
          '(' + // [10] private use
            '(?:' +
              '-' +
              '\\w{1,8}' +
            ')+' +
          ')' +

        '|' +

          'i' + // (RFC-4646 only) grandfather indicator
          '-' +
          '(\\w{2,8})' + // [11] (RFC-4646 only) grandfathered
        ')' +
      '$'
    ),
    RFC_5646_GRANDFATHER_REGISTRY = [
    // irregular:
      'en-GB-oed',
      'i-ami',
      'i-bnn',
      'i-default',
      'i-enochian',
      'i-hak',
      'i-klingon',
      'i-lux',
      'i-mingo',
      'i-navajo',
      'i-pwn',
      'i-tao',
      'i-tay',
      'i-tsu',
      'sgn-BE-FR',
      'sgn-BE-NL',
      'sgn-CH-DE',
    // regular:
      'art-lojban',
      'cel-gaulish',
      'no-bok',
      'no-nyn',
      'zh-guoyu',
      'zh-hakka',
      'zh-min',
      'zh-min-nan',
      'zh-xiang'
    ],
    EXTENSION_PARSER = /-(\w)((?:[_-]\w{2,8})+)/g,
    SPLITTER = /[_-]/g;

  exports.parse = parseRFC5646String;

  exports.version = '0.1.0';
}));