var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore'),
    PickupStatus = require('../lib/utilities').PickupStatus;
/**
 * Items subdocument for {@link Pickup}.
 * @type Schema
 */
var itemsSchema = new Schema({
    type: {
        type: String
    },
    packageSize: {
        type: String
    },
    quantity: {
        type: String
    }
});
/**
 * Pickup schema.
 *
 * @type Schema
 */
var Pickup = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        street: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        zip: {
            type: String
        },
        location: {
            type: {
                type: String
            },
            coordinates: [Number]
        }
    },
    time: {
        type: Date
    },
    instructions: {
        type: String
    },
    items: [itemsSchema],
    status: {
        type: String, 
        default: PickupStatus.ON_GOING
    },
    review: {
        rate: {
            type: Number
        },
        comment: {
            type: String
        }   
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pickup', Pickup);