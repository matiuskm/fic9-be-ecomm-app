"use strict";

/**
 * order controller
 */
const { default: axios } = require("axios");
const { xenditHeaders } = require("../helpers/header");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const result = await super.create(ctx);

    const payload = {
      external_id: result.data.attributes.order_number,
      payer_email: "test@lzcdr.com",
      description: "Payment for LZCDR",
      amount: result.data.attributes.total,
    };

    const response = await axios({
      method: "POST",
      url: "https://api.xendit.co/v2/invoices",
      headers: xenditHeaders,
      data: JSON.stringify(payload),
    });

    return JSON.stringify(response.data);
  },
}));
