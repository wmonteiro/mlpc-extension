/**
 * Seller class
 * @param  {String}   id   Seller's ID
 */

class Seller {
    constructor(id) {
        this.id = id;
        this.city = "";
        this.state = "";
    }
    static new(props) {
        return new this(props.id);
    }
}

export default Seller;
