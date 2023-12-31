define([
    'uiComponent',
    'ko',
    'Magento_Customer/js/customer-data',
    'underscore'
], function(
    Component,
    ko,
    customerData,
    _
) {
    'use strict';

    return Component.extend({

        defaults: {
            freeShippingThreshold: 100,
            subtotal: 0.00,
            template: 'Flavio_FreeShippingPromo/free-shipping-banner',
            tracks: {
                subtotal: true
            }
        },
        initialize() {
            this._super();

            let self = this;
            let cart = customerData.get('cart');

            customerData.getInitCustomerData().done(function () {
                if (!_.isEmpty(cart()) && !_.isUndefined(cart().subtotalAmount)) {
                    self.subtotal = parseFloat(cart().subtotalAmount);
                }
            });

            cart.subscribe(function (cart) {
                if (!_.isEmpty(cart) && !_.isUndefined(cart.subtotalAmount)) {
                    self.subtotal = parseFloat(cart.subtotalAmount);
                }
            });

            self.message = ko.computed(function () {
                if (_.isUndefined(self.subtotal) || self.subtotal === 0) {
                    return self.messageDefault.replace('{{freeShippingThreshold}}', self.freeShippingThreshold);
                }

                if (self.subtotal > 0 && self.subtotal < self.freeShippingThreshold) {
                    let subtotalRemaining = self.freeShippingThreshold - self.subtotal;
                    let formattedSubtotalRemaining = self.formatCurrency(subtotalRemaining);

                    return self.messageItemsInCart.replace('$XX.XX', formattedSubtotalRemaining);
                }

                if (self.subtotal > self.freeShippingThreshold) {
                    return self.messageFreeShipping;
                }
            });

        },
        formatCurrency: function (value) {
            return '$' + value.toFixed(2);
        }

    });
});
