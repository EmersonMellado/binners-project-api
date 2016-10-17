"use strict";

var Joi = require('joi'),
        schemas = require('../schemas');

function PickupValidator() {}

PickupValidator.prototype = (function () {
    var schema = new schemas.PickupSchema().schema;

    return {
        pickup: {
            payload: {
                requester: schema.requester.required(),
                address: schema.address,
                time: schema.time.required(),
                instructions: schema.instructions.optional(),
                items: schema.items.required(),
            },
            headers: schema.authorization.required()
        },
        update: {
            payload: {
                address: schema.address,
                time: schema.time.optional(),
            },
            headers: schema.authorization.required()
        },
        list: {
            query: {
                limit: Joi.number().integer().optional().description('Limit total of items returned - Default: 30').example(10),
            },
            headers: schema.authorization.required()
        },
        changeStatus: {
            params: {
                _id: schema._id.required()
            },
            headers: schema.authorization.required()
        },
        review: {
            payload: {
                rate: schema.review.rate.required(),
                comment: schema.review.comment.optional(),
            },
            params: {
                _id: schema._id.required()
            },
            headers: schema.authorization.required()
        }
    };
})();

module.exports = new PickupValidator();
