/*!
 * Copyright 2021 Ethan Elliott
 */


export const recursiveEventNameParser: (_o, _key) => Array<string | Array<any> | null> = (_o, _key) => {
    return Object.keys(_o).map(key => {
        if (_o.hasOwnProperty(key)) {
            if (typeof _o[key] === 'string') {
                return _key ? [_key, key].join('.') : key;
            }
            return recursiveEventNameParser(_o[key], _key ? [_key, key].join('.') : key);
        }
        return null;
    });
};

export const traverseApply = (obj, key, value) => {
    const path = key.split('.');
    const finalIndex = path.pop();
    while (path.length && obj) {
        const index = path.shift();
        if (obj.hasOwnProperty(index)) {
            obj = obj[index];
        }
    }
    obj[finalIndex] = value;
};
