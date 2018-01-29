/* eslint-disable no-unused-vars */
const postcss = require('postcss');
const parser = require('postcss-selector-parser');
const objectPath = require('object-path');
const fs = require('fs');

const DEFAULT_ELEMENT = '__';
const DEFAULT_MODIFIER = '--';

const toCamelCase = (str) =>
    str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const toUpperCamelCase = (str) => {
    const s = toCamelCase(str);
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const beginsWith = (haystack, needle) => haystack.indexOf(needle) === 0;

module.exports = postcss.plugin('postcss-bemit-to-json', (opts) => {
    opts = opts || {};
    const prefixMap = opts.prefixMap;
    const prefixKeys = prefixMap && Object.keys(prefixMap);

    const edel = DEFAULT_ELEMENT;
    const mdel = DEFAULT_MODIFIER;

    const ejsdel = '_';
    const mjsdel = '$';

    return (root, result) => {
        const output = {
        };

        const classNames = {};

        const elementKeyTransform = toCamelCase;
        const blockKeyTransform = toUpperCamelCase;

        const setOutput = (path, value) => {
            let prefix = undefined;
            if (prefixMap && path && path.length > 0) {
                prefixKeys.forEach((key) => {
                    if (beginsWith(path[0], key)) {
                        path[0] = path[0].substr(key.length);
                        prefix = prefixMap[key];
                    }
                });
            }
            const transformedPath = path.map((p, i) => {
                if (i === 0) {
                    return `${prefix ? prefix : ''}${blockKeyTransform(p)}`;
                }
                return elementKeyTransform(p);
            });
            // const finalPath = transformedPath;
                // prefix ?
                // [prefix].concat(transformedPath) :
                // transformedPath;

            // if (prefix) {}

            objectPath.set(output, transformedPath, value);
        };

        const processClassNode = (classNode) => {
            const className = classNode.value;
            if (!classNames[className]) {
                classNames[className] = className;

                const eloc = className.indexOf(edel);
                const mloc = className.indexOf(mdel);

                if (eloc > 0) {
                    if (mloc > eloc) {
                        // Element with modifier
                        const [block, element, modifier] = [
                            className.substr(0, eloc),
                            className.substr(
                                eloc + edel.length,
                                mloc - eloc - edel.length
                            ),
                            className.substr(mloc + mdel.length)
                        ];
                        // const ekey = genEKey(block);
                        // const mkey = genMKey(element);
                        setOutput(
                            [block, element, `$${modifier}`],
                            `${block}${edel}${element} ${className}`
                        );
                    } else {
                        // Element with no modifier
                        const [block, element] = className.split(edel);
                        setOutput(
                            [block, element, '$'],
                            className
                        );
                    }
                } else {
                    /* eslint-disable no-lonely-if */
                    if (mloc > 0) {
                        // Block with modifier
                        const [block, modifier] = className.split(mdel);
                        setOutput(
                            [block, `$${modifier}`],
                            `${block} ${className}`
                        );
                    } else {
                        // Block with no modifier
                        const bkey = className;
                        setOutput(
                            [className, '$'],
                            className
                        );
                    }
                    /* eslint-enable no-lonely-if */
                }
            }
        };

        const processor = (selectors) =>
            selectors.walkClasses(processClassNode);

        const selectorProcessor = parser(processor);

        root.walkRules(rule => selectorProcessor.process(rule));

        // console.log(JSON.stringify(output, null, 2));
        // fs.writeFileSync('output.json', JSON.stringify(output, null, 2));

        if (opts.getJson) {
            opts.getJson(output);
        }
    };
});
