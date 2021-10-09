/**
 * {Object} Helper methods
 */

var Util =  {
    quantity: function(array) {
        var total = 0;
        for(var i = 0; i < array.length; i++) {
            total += parseInt(array[i].available_quantity);
        }
        return total;
    },
    toLocale: function(locale, value) {
        return value.toLocaleString(locale, {
            style: 'currency',
            currency: 'BRL',
        });
    }
}

export default Util;