"use strict";

/**
 * payment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::payment.payment", ({ strapi }) => ({
  async create(ctx) {
    let req = ctx.request.body;

    let order = await strapi.db.query("api::order.order").findOne({
      where: { order_number: req.external_id },
    });
    let inputData = { data: { history: req } };
    const result = await strapi
      .service("api::payment.payment")
      .create(inputData);

    let params = {};

    if (req.status == "PAID") {
      params = { status: "paid", payment_ref: req.id };
    } else {
      params = { status: "canceled" };
    }

    let updateOrder = await strapi.db.query("api::order.order").update({
      where: { order_number: req.external_id },
      data: params,
    });
    return { data: updateOrder };
  },
}));
