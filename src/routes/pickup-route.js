"use strict";

var controllers = require('../controllers'),
        validators = require('../validators'),
        config = require('config'),
        version = config.get('SERVER.API_VERSION');

exports.register = function (server, options, next) {

    server.route({
        method: 'POST',
        path: '/api/' + version + '/pickup',
        config: {
            handler: controllers.PickupController.pickup,
            validate: validators.PickupValidator.pickup,
            description: 'Place a pickup',
            notes: 'Place a pickup request',
            tags: ['api', 'pickup'],
            auth: 'jwt'
        }
    });

	server.route({
		method: 'PUT', 
		path: '/api/' + version + '/pickups/{_id}',
		config: {
			handler: controllers.PickupController.update,
			validate: validators.PickupValidator.update,
			description: 'Update some pickup by id',
			notes: 'Updating pickup',
			tags: ['api'],
			auth: 'jwt'
		}
	});

    server.route({
        method: 'POST',
        path: '/api/' + version + '/pickups/{_id}/photos',
        config: {
            payload: {
                maxBytes:  50 * 1024 * 1024, // 50 MB
                output: 'stream',
                parse: true
            },
            handler: controllers.PickupController.photoUpload,
            description: 'Upload photo to specified pickup id (max file size 50MB)',
            notes: 'Upload photo to specified pickup id (max file size 50MB)',
            tags: ['api'],
            auth: 'jwt'
        }
    });

    server.route({
        method: 'PATCH',
        path: '/api/' + version + '/pickups/{_id}/done',
        config: {
            handler: controllers.PickupController.done,
            validate: validators.PickupValidator.changeStatus,
            description: 'Puts a pickup as done, status is set to \'waiting review\'',
            notes: 'Puts a pickup as done, status is set to \'waiting review\'',
            tags: ['api'],
            auth: 'jwt'
        }
    });

    server.route({
        method: 'PATCH',
        path: '/api/' + version + '/pickups/{_id}/canceled',
        config: {
            handler: controllers.PickupController.canceled,
            validate: validators.PickupValidator.changeStatus,
            description: 'Puts a pickup as canceled, status is set to \'canceled\'',
            notes: 'Puts a pickup as canceled, status is set to \'canceled\'',
            tags: ['api'],
            auth: 'jwt'
        }
    });

    server.route({
        method: 'POST',
        path: '/api/' + version + '/pickups/{_id}/review',
        config: {
            handler: controllers.PickupController.review,
            validate: validators.PickupValidator.review,
            description: 'Place a review for a pickup and status is set to \'completed\'',
            notes: 'Place a review for a pickup and status is set to \'completed\'',
            tags: ['api'],
            auth: 'jwt'
        }
    });

    server.route({
        method: 'GET',
        path: '/api/' + version + '/pickups',
        config: {
            handler: controllers.PickupController.list,
            validate: validators.PickupValidator.list,
            description: 'List last 6 months user\'s pickups',
            notes: 'List last 6 months user\'s pickups',
            tags: ['api'],
            auth: 'jwt'
        }
    });

    server.route({
        method: 'GET',
        path: '/api/' + version + '/pickups/completed',
        config: {
            handler: controllers.PickupController.list,
            validate: validators.PickupValidator.list,
            description: 'List last 6 months user\'s pickups completed',
            notes: 'List last 6 months user\'s pickups completed',
            tags: ['api'],
            auth: 'jwt'
        }
    });

    server.route({
        method: 'GET',
        path: '/api/' + version + '/pickups/ongoing',
        config: {
            handler: controllers.PickupController.list,
            validate: validators.PickupValidator.list,
            description: 'List last 6 months user\'s pickups on going',
            notes: 'List last 6 months user\'s pickups on going',
            tags: ['api'],
            auth: 'jwt'
        }
    });
    
    server.route({
        method: 'GET',
        path: '/api/' + version + '/pickups/waitingreview',
        config: {
            handler: controllers.PickupController.list,
            validate: validators.PickupValidator.list,
            description: 'List last 6 months user\'s pickups waiting for review',
            notes: 'List last 6 months user\'s pickups waiting for review',
            tags: ['api'],
            auth: 'jwt'
        }
    });

    server.route({
        method: 'GET',
        path: '/api/' + version + '/pickups/status-tracking',
        config: {
            handler: controllers.PickupController.tracking,
            validate: validators.PickupValidator.tracking,
            description: 'Filter pickups by status ordered by date',
            notes: 'Filter pickups by status ordered by date',
            tags: ['api'],
            auth: 'jwt'
        }
    });

    next();

};

/**
 * Exporting plugin
 * @type {{name: string, version: string}}
 */
exports.register.attributes = {
    name: 'pickup-route',
    version: '0.0.1'
};
