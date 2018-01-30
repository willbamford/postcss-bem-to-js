const util = require('../util');

it('should convert hyphenated string to camel case', () => {
    expect(util.toCamelCase('foo-bar-daz')).toBe('fooBarDaz');
    expect(util.toCamelCase('hello\\@world')).toBe('hello@World');
});
