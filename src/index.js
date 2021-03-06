/* eslint-disable no-param-reassign */
// https://gist.github.com/shannonmoeller/b4f6fbab2ffec56213e7
function rx (flags) {
    const trailingComments = /\s+\/\/.*$/gm;
    const surroundingWhitespace = /^\s+|\s+$/gm;
    const literalNewlines = /[\r\n]/g;

    return (strings, ...values) => {
        function toPattern (pattern, rawString, i) {
            let value = values[i];

            if (value == null) {
                return pattern + rawString;
            }

            if (value instanceof RegExp) {
                value = value.source;
            }

            return pattern + rawString + value;
        }

        const compiledPattern = strings.raw
            .reduce(toPattern, "")
            .replace(trailingComments, "")
            .replace(surroundingWhitespace, "")
            .replace(literalNewlines, "");

        return new RegExp(compiledPattern, flags);
    };
}

/**
 * This enormous regex will (mostly) parse any RFC-4646 string. Some post-
 * processing is required for those fields that are arrays, especially
 * extensions, which are a key/value pair
 *
 * @private
 * @constant RFC4646_PARSER
 */
const RFC4646_PARSER = rx("")`^
(?:
    (?:
        (?:
            ( // [1] language
                q? // private use
                [a-z]{2,3} // ISO-639
            )

            ( // [2] extlangs
                (?:
                    -
                    [a-z]{3} // language extension (reserved for future use)
                ){0,3}
            )
        |
            ([a-z]{4}) // [3] reserved for future use
        |
            ([a-z]{5,8}) // [4] registered language subtag
        )

        (?:
            -
            ([A-Z][a-z]{3}) // [5] ISO-15924 (script)
        )?

        (?:
            -
            ( // [6] region
                [A-Z]{2} // ISO-3166-2
            |
                \d{3} // UN M.49
            )
        )?

        (?:
            ( // [7] variants
                (?:
                    -
                    (?:
                        [a-z\d]{5,8}
                    |
                        \d[a-z]{3}
                    )
                )+
            )
        )?

        (?:
            ( // [8] extensions
                (?:
                    -
                    [a-wy-z] // extension indicator
                    (?:-\w{2,8})+ // extension
                )+
            )
        )?

        (?:
            -
            x // private use indicator
            ( // [9] private use
                (?:-\w{1,8})+
            )
        )?
    )?
|
    x // private use indicator
    ( // [10] private use
        (?:
            -
            \w{1,8}
        )+
    )
|
    i // (RFC-4646 only) grandfather indicator
    -
    (\w{2,8}) // [11] (RFC-4646 only) grandfathered
)
$`;

const RFC_5646_GRANDFATHER_REGISTRY = [
    // irregular:
    "en-GB-oed",
    "i-ami",
    "i-bnn",
    "i-default",
    "i-enochian",
    "i-hak",
    "i-klingon",
    "i-lux",
    "i-mingo",
    "i-navajo",
    "i-pwn",
    "i-tao",
    "i-tay",
    "i-tsu",
    "sgn-BE-FR",
    "sgn-BE-NL",
    "sgn-CH-DE",
    // regular:
    "art-lojban",
    "cel-gaulish",
    "no-bok",
    "no-nyn",
    "zh-guoyu",
    "zh-hakka",
    "zh-min",
    "zh-min-nan",
    "zh-xiang",
];

const EXTENSION_PARSER = /-(\w)((?:[_-]\w{2,8})+)/g;
const SPLITTER = /[_-]/g;

const compact = obj => (
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
);

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
   * - extlangs -- array
   * - script
   * - region
   * - variants -- array
   * - extensions -- hash
   * - private -- array
   * - grandfather
   */
export default function parseRFC5646String (text) {
    let tmp;
    let entry;

    text = text.replace(/_/g, "-");

    if (RFC_5646_GRANDFATHER_REGISTRY.includes(text)) {
        entry = {
            text,
            grandfather: text,
        };
    } else {
        tmp = text.match(RFC4646_PARSER);

        if (tmp) {
            entry = {};

            text = [];
            const [, lang, extlangs, reserved, subLang, script, region, variants,
                extensions, private1, private2, grandfather] = tmp;

            if (lang || reserved || subLang) {
                entry.language = lang || reserved || subLang;
                text.push(entry.language);
                if (extlangs) {
                    entry.extlangs = extlangs.substr(1).split(SPLITTER);
                    text.push(...entry.extlangs);
                }
            }
            if (script) {
                entry.script = script;
                text.push(script);
            }
            if (region) {
                entry.region = region;
                text.push(entry.region);
            }
            if (variants) {
                entry.variants = variants.substr(1).split(SPLITTER);
                text.push(...entry.variants);
            }
            if (extensions) {
                entry.extensions = {};
                extensions.replace(EXTENSION_PARSER, (all, name, data) => {
                    text.push(name);
                    entry.extensions[name] = data.substr(1).split(SPLITTER);
                    text.push(...entry.extensions[name]);
                });
            }
            if (private1 || private2) {
                text.push("x");
                entry.private = (private1 || private2).substr(1).split(SPLITTER);
                text.push(...entry.private);
            }
            if (grandfather) {
                entry.grandfather = grandfather;
                text.push("i", entry.grandfather);
            }

            entry.text = text.join("-");
        }
    }

    return entry;
}
