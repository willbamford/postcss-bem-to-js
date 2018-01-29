const postcss = require('postcss');
const path = require('path');
const fs = require('fs');
const plugin = require('../');

const fixturesPath = path.resolve(__dirname, './fixtures');

const run = (name, opts) => {
    let resultJson;
    const sourceFile = path.join(fixturesPath, 'in', `${ name }.css`);
    const expectedFile = path.join(fixturesPath, 'out', name);
    const sourceCss = fs.readFileSync(sourceFile).toString();
    const expectedJson = fs.readFileSync(`${ expectedFile }.json`).toString();

    const options = opts || {};

    options.getJson = (json) => {
        resultJson = json;
    };

    const plugins = [plugin(options)];
    return postcss(plugins).process(sourceCss, { from: sourceFile })
        .then((result) => {

            console.log(JSON.stringify(resultJson, null, 2));

            // expect(result.css).toEqual(sourceCss); /* do not transform input */
            // expect(resultJson).toEqual(JSON.parse(expectedJson));
        });
};

it('should handle BEM syntax', () => {
    return run('bem');
});

it('should handle BEMIT syntax using prefix mapping', () => {
    return run('bemit', {
        prefixMap: {
            'o-': 'o',
            'c-': 'c',
            'u-': 'u'
        }
    });
});

it.only('should handle namespaced BEMIT syntax using prefix mapping', () => {
    return run('s', {
        prefixMap: {
            'ln-o-': 'o',
            'ln-c-': 'c',
            'ln-u-': 'u'
        }
    });
});
