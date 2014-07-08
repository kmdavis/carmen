# Carmen
###### What in the world is en-US-sandiego?
[![Build Status](https://api.travis-ci.org/kmdavis/carmen.png?branch=master)](https://travis-ci.org/kmdavis/carmen)
[![Coverage Status](https://coveralls.io/repos/kmdavis/carmen/badge.png)](https://coveralls.io/r/kmdavis/carmen)
[![Dev Dependencies](https://david-dm.org/kmdavis/carmen/dev-status.svg)](https://david-dm.org/kmdavis/carmen#dev-badge-embed)

Usage
=====

Carmen.js is, in a nutshell, a [RFC-4646](http://tools.ietf.org/html/rfc4646)
parser. In other words, Carmen will parse strings like 'en-US-sandiego' and tell
you that it refers to the english language, in the United States, specifically,
the variant spoken in San Diego.

```js
carmen.parse('en-US');
```
will return
```js
{
  text: 'en-US',
  language: 'en',
  region: 'US'
}
```
and
```js
carmen.parse('sl-Latn-IT-nedis');
```
will return
```js
{
  text: 'sl-Latn-IT-nedis',
  language: 'sl',
  script: 'Latn',
  region: 'IT',
  variants: ['nedis']
}
```

The full list of fields that Carmen can return is:
```js
{
  text:        String,
  language:    String,
  extlang:    [String],
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

Contributing
============

We use grunt for running tests and such, so, if you want to contribute, you'll
want to install grunt's cli `sudo npm install -g grunt-cli`. Once you have done
so, you can run any of our grunt tasks: `grunt watch`, `grunt test`, `grunt build`,
`grunt release:(major or minor or patch)`

TODO
====
- [ ] Support [RFC-5656](http://tools.ietf.org/html/rfc5646)
- [ ] Exhaustive test suite

License
=======

Copyright 2014 Kevan Davis.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
