"use strict";
var Joi = require('joi');
/**
 * Pickup schema.
 *
 * @description Pickup definition schema.
 *
 * @author Leonardo Cabral <leomcabral@gmail.com>
 * @since 02/28/2016
 */
function PickupSchema() {
    this.schema = {
        _id: Joi.string(),
        requester: Joi.string().description('User id that requested the pickup'),
        address: {
            street: Joi.string(),
            //TODO: this field is candidate to return 
            // city: Joi.string(),
            //TODO: this field is candidate to return 
            // state: Joi.string(),
            //TODO: this field is candidate to return 
            // zip: Joi.string(),
            location: Joi.object({
                //TODO: this field is candidate to return 
                // type: Joi.string(),
                coordinates: Joi.array().items(Joi.number())
            })
        },
        time: Joi.date().description('Date/time to the pickup'),
        instructions: Joi.string().description('Instructions to the binner'),
        items: Joi.array().items(Joi.object({
            //TODO: this field is candidate to return 
            // type: Joi.string().valid('can', 'bottle').description('Type of item'),
            //TODO: this field is candidate to return 
            // packageSize: Joi.string().valid('small', 'medium', 'large').description('Size classification of the units'),
            quantity: Joi.string().description('Number of packages of this type and size. May be a string.')
        })),
        status: Joi.string().description('Status of the pickup'),
        review: {
            rate: Joi.number().integer().min(1).max(5).description('Rate provided by the requester after pickup is completed.'),
            comment: Joi.string().description('Comment provided by the requester after pickup is completed.')
        },
        authorization: Joi.object({
            'Authorization': Joi.string().description('Authorization Token')
        }).unknown()
    };
}
module.exports = PickupSchema;