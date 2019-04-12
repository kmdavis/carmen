# Carmen
> What in the world is en-US-sandiego?

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]

Carmen.js is, in a nutshell, a [RFC-4646](http://tools.ietf.org/html/rfc4646) &
[RFC-5646](http://tools.ietf.org/html/rfc5646) parser. In other words, Carmen
will parse strings like "en-US-sandiego" and tell you that it refers to the
english language, in the United States, specifically, the variant spoken in
San Diego.

## Installation

```sh
npm install @kmdavis/carmen
```

## Usage

```js
import carmen from "@kmdavis/carmen";
carmen("en-US");
```
will return
```js
{
  text: "en-US",
  language: "en",
  region: "US",
}
```
and
```js
carmen("sl-Latn-IT-nedis");
```
will return
```js
{
  text: "sl-Latn-IT-nedis",
  language: "sl",
  script: "Latn'"
  region: "IT",
  variants: ["nedis"],
}
```

The full list of fields that Carmen can return is:
```js
{
  text:        String,
  language:    String,
  extlangs:    [String],
  script:      String,
  region:      String,
  variants:   [String],
  extensions:  Object,
  private:    [String],
  grandfather: String
}
```

Please note that the "text" field is **Not** the original string that is passed in.
This string is reconstructed from the parsed values; as such, any minor
formatting errors (such as the common Internet Exploder bug where en-US becomes
en_US) will be normalized.

## Development setup

```sh
npm install
npm test
```

## Release History

* 0.1.0
    * Initial public release
* 0.2.0
    * Rewrite using modern javascript

## Meta

Kevan Davis <kevan.davis@me.com>

Distributed under the MIT license.

[https://github.com/kmdavis/carmen](https://github.com/kmdavis/carmen/)

## Contributing

1. Fork it (<https://github.com/kmdavis/carmen/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/@kmdavis/carmen.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@kmdavis/carmen
[npm-downloads]: https://img.shields.io/npm/dm/@kmdavis/carmen.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/kmdavis/carmen/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/kmdavis/carmen
