/**
 * XHR HTTP REQUEST
 * @param  {String}   url   The URL that contains data
 * @returns {Function}
 */

export default function XHR(url) {
    return new Promise((res, rej) => {
        var x = new XMLHttpRequest();
        x.addEventListener('load', e => res(x.response, x));
        x.addEventListener('error', e => {
            console.warn('XHR Error', url, e);
            rej(x.response, x);
        });
        x.open('GET', url);
        x.send();
    });
};