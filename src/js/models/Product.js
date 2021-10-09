/**
 * Product class
 * @param  {String}   id   Product's ID
 */

class Product {
    constructor(id) {
        this.id = id;
        this.title = "";
        this.new_item = false;
        this.available_quantity = "";
        this.free_shipping = false;
        this.product_value = "";
        this.shipping_value = "";
        this.shipping_date = "";
        this.listing_type_id = "";
        this.warranty = "";
    }
    static new(props) {
        return new this(props.name);
    }
}

export default Product;
