import Product from './models/Product.js';
import Seller from './models/Seller.js';
import API from './Api.js';
import XHR from './xhr.js';
import Util from './util.js';

export function main() { 

  let MLID = null,
      ZIP = '86084770',
      card_pm_fee = 0.0204,
      Seller1,
      Product1,
      Api1 = new API();

  const page_url = window.location.href,
        match = page_url.match(/MLB.[0-9]+/),
        locale = "pt-BR";

  if (match) {
    MLID = match[0].replace('-', '');
    
    XHR(Api1.url + '/items/' + MLID).then(function(data) {
      data = JSON.parse(data);

      Seller1 = Seller.new({ id: data.seller_id });
      Seller1.city = data.seller_address.city.name;
      Seller1.state = data.seller_address.state.name;
      
      Product1 = Product.new({ id: data.id });

      Product1.title = data.title;
      Product1.new_item = (data.condition == 'new' ? true : false);
      Product1.available_quantity = Util.quantity(data.variations);
      Product1.product_value = data.price;
      Product1.listing_type_id = data.listing_type_id;
      Product1.warranty = data.warranty;

      XHR(Api1.url + '/items/' + MLID + '/shipping_options?zip_code=' + ZIP + '&dimensions=null' + MLID).then(function(data) {
        data = JSON.parse(data);

        Product1.shipping_value = data.options[0].cost;
        Product1.free_shipping = (Product1.shipping_value == 0 ? true : false);
        Product1.shipping_date = new Date(data.options[0].estimated_delivery_time.date);

        CreateOverlay();
      });
    });
  }

  /**
   * Function that insert the Overlay Form in the target page, called in Main()
   */

  function CreateOverlay() {
    XHR(chrome.extension.getURL('src/html/overlay.html')).then(function(data) {
      data = data.replace('{{item_condition}}', (Product1.new_item ? 'Novo' : 'Usado'));
      data = data.replace('{{available_quantity}}', (Product1.available_quantity == 1 ? 'Último item!' : Product1.available_quantity + ' em estoque'));
      data = data.replace('{{free_shipping}}', (Product1.free_shipping ? "<li class='mplc_fs_badge'>Frete grátis</li>" : ''));
      data = data.replace('{{warranty}}', (Product1.warranty == null ? "<li class='mplc_fs_badge bg--red'>Sem garantia</li>" : ''));
      data = data.replace('{{full_total}}', Util.toLocale(locale, parseFloat(Product1.product_value) + parseFloat(Product1.shipping_value)));
      data = data.replace('{{creditcard_total}}', function() {
        var price = parseFloat(Product1.product_value);
        var shipping_value = parseFloat(Product1.shipping_value);
        switch(Product1.listing_type_id) {
          case 'gold_special':
            return '5x c/ juros + Frete: ' + Util.toLocale(locale, ((price * card_pm_fee * 5) + price) + shipping_value)
          break;
          case 'gold_pro':
            return '12x s/ juros + Frete: ' + Util.toLocale(price + shipping_value)
          break;
        }
      });
      data = data.replace('{{shipping_date}}', Product1.shipping_date.toLocaleDateString());

      data = data.replace('{{seller_city}}', Seller1.city);
      data = data.replace('{{seller_state}}', Seller1.state);

      document.body.insertAdjacentHTML('beforeend', data);

      CreateEvents();

    });
  }


  /**
   * Function that attach events and manipulate the DOM, called from CreateOverlay()
   */

  var details_visible = false;

  function CreateEvents() {
    var details_button = document.getElementById('mlpc_details_button');
    var details_block = document.getElementById('mlpc_details_block');
    details_button.addEventListener('click', function() {
      if(details_visible) {
        details_visible = false;
        details_block.style.display = "none";
      } else {
        details_visible = true;
        details_block.style.display = "block";
      }
    });
  }

}
