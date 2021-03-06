"use strict";

/**
 * Pickup Controller
 *
 * @description This controller has all functions/methods for pickup proccess.
 *
 * @author Leonardo Cabral <leocmabral@gmail.com>
 *
 * @since 2/29/2016
 */
var Boom = require('boom'),
        jwt = require('jsonwebtoken'),
        config = require('config'),
        models = require('../models'),
        errors = require('../lib/utilities').getErrorsCode(),
        Promise = require('bluebird'),
        fs = Promise.promisifyAll(require('fs')),
        inspect = require('eyes').inspector({styles: {all: 'green'}}),
        uuid = require('node-uuid'),
        PickupStatus = require('../lib/utilities').PickupStatus;

var pickupFolder = config.get("SERVER.UPLOAD_FOLDER") + "/pickups/";

function PickupController() {}

PickupController.prototype = (function () {

    var Pickup = models.Pickup;

    return {
        pickup: function (request, reply) {
            var payload = request.payload;
            var userId = request.auth.credentials.user;

            var newPickup = {
                requester: payload.requester,
                address: payload.address,
                time: payload.time,
                instructions: payload.instructions,
                items: payload.items
            };

            Pickup.create(newPickup).then(function (pickup) {

                var ret = pickup.toObject();
                var sInfo = request.server.info;
                ret.photoUploadURL = sInfo.protocol + '://' + sInfo.host + ':'+ sInfo.port + '/api/' + config.get('SERVER.API_VERSION') + '/pickups/' + userId + '/photos';

                reply(ret);

            }, function (error) {
                reply(Boom.badRequest(error));
            });

        },
        photoUpload: function (request, reply) {
            var userId = request.auth.credentials.user;

            var data = request.payload;
            data.userId = userId;

            Promise.resolve(data)
                    .then(createFolderForUserIfNotPresent)
                    .then(uploadFile)
                    .then(function (data) {
                        var sInfo = request.server.info;

                        reply({
                            status: '200',
                            msg: 'File uploaded succefully',
                            fileURL: sInfo.protocol + '://' + sInfo.host + ':'+ sInfo.port + '/api/' + config.get('SERVER.API_VERSION') + '/pickups/' + data.userId + '/photos/' + data.generatedFilename
                        });
                    })
                    .catch(function (err) {
                        reply(Boom.badRequest(err));
                    });

        }, 
        done: function (request, reply) {
            Pickup.findById(request.params._id)
                .then(changeStatus(PickupStatus.WAITING_REVIEW, request, reply))
                .catch(function (err) {
                    reply(Boom.badRequest(err));
                });
        },
        canceled: function (request, reply) {
            Pickup.findById(request.params._id)
                .then(changeStatus(PickupStatus.CANCELED, request, reply))
                .catch(function (err) {
                    reply(Boom.badRequest(err));
                });
        },
        review: function (request, reply) {
            Pickup.findById(request.params._id)
                .then(function(pickup) {

                    if (!pickup) {
                        var err = Boom.notFound('', errors.PICKUP_NOT_FOUND);
                        err.output.payload.details = err.data;
                        reply(err);
                    }

                    var userId = request.auth.credentials.user;
                    if (userId != pickup.requester) {
                        var err = Boom.badRequest('', errors.INVALID_USER_FOR_REVIEW);
                        err.output.payload.details = err.data;
                        reply(err);
                    }
                    
                    if (pickup.status != PickupStatus.WAITING_REVIEW) {
                        var err = Boom.badRequest('', errors.PICKUP_INVALID_STATUS);
                        err.output.payload.details = err.data;
                        reply(err);
                    }

                    pickup.status = PickupStatus.COMPLETED;
                    pickup.review.rate = request.payload.rate 
                    pickup.review.comment = request.payload.comment 

                    pickup.save(function (err) {
                        if (err) {
                            return reply(Boom.badImplementation(err));
                        }
                        reply(pickup);
                    });
                })
                .catch(function (err) {
                    reply(Boom.badRequest(err));
                });
        },
        list: function (request, reply) {
            var userId = request.auth.credentials.user;
            var limit = request.query['limit'] || 30;
            var path = request.path;
            var segments = path.split("/");
            var lastSegment = segments[segments.length-1];
            console.log(request.query['status']);
            Pickup.filterByStatus(userId, [resolveStatusFromRequest(lastSegment)])
                    .limit(limit)
                    .sort({createdAt: 'desc'})
                    .exec()
                    .then(function (pickups) {
                        reply(pickups);
                    });
        },
        tracking: function (request, reply) {
            var userId = request.auth.credentials.user;
            var limit = request.query['limit'] || 30;
            var statuses = request.query['status'] || [];
            Pickup.filterByStatus(userId, statuses.map(resolveStatusFromRequest))
                    .limit(limit)
                    .sort({createdAt: 'desc'})
                    .exec()
                    .then(function (pickups) {
                        reply(pickups);
                    });
        },
        update: function (request, reply) {
            Pickup.findByIdAndUpdate(request.params._id, request.payload)
            .exec()
            .then(
                function (pickup) {
                    if (pickup)
                        Pickup.findById(pickup.id)
                        .exec()
                        .then(function (updatedPickup) {
                            reply(updatedPickup);
                        });
                    else {
                        reply(Boom.notFound('User not found.'))
                    }
                },
                function (error) {
                    reply(Boom.badData(error.message));
                }
            );
        },
    };

})();

var createFolderForUserIfNotPresent = function (data) {
    var userPickupFolder = pickupFolder + '/' + data.userId;
    data.userPickupFolder = userPickupFolder;

    return new Promise(function (resolve, reject) {
        fs.stat(userPickupFolder, function (err, stat) {
            if (err) {
                inspect('[ Pickup ] Folder "' + userPickupFolder + '" not found. It will be created!');
                fs.mkdirSync(userPickupFolder);
                resolve(data);
            } else {
                inspect('[ Pickup ] Folder "' + userPickupFolder + '" already exists');
                resolve(data);
            }
        });
    });
};

var uploadFile = function (data) {
    var requestFilename = data.file.hapi.filename;
    var filename = uuid.v4 + '.' + requestFilename.substring(requestFilename.lastIndexOf('.') + 1, requestFilename.length);
    var filePath = data.userPickupFolder + '/' + filename;
    data.filePath = filePath;
    data.generatedFilename = filename;

    return new Promise(function (resolve, reject) {
        var file = fs.createWriteStream(filePath);

        file.on('error', function (err) {
            reject(err);
        });

        data.file.pipe(file);

        data.file.on('end', function (err) {
            resolve(data);
        });
    });
};

/**
 * This function is a mapping from the value 
 * provided on the HTTP request to domain 
 * value
 */
var resolveStatusFromRequest = function(statusFromRequest) {
 return {ongoing:       PickupStatus.ON_GOING, 
         waitingreview: PickupStatus.WAITING_REVIEW, 
         completed:     PickupStatus.COMPLETED,
         canceled: PickupStatus.CANCELED,
        }[statusFromRequest]
}

var changeStatus = function(status, request, reply) {
    return function(pickup) {
                    
            if (!pickup) {
                var err = Boom.notFound('', errors.PICKUP_NOT_FOUND);
                err.output.payload.details = err.data;
                reply(err);
            }
            
            if (pickup.status != PickupStatus.ON_GOING) {
                var err = Boom.badRequest('', errors.PICKUP_INVALID_STATUS);
                err.output.payload.details = err.data;
                reply(err);
            }

            pickup.status = status;
            pickup.save(function (err) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(pickup);
            });
        }
}

module.exports = new PickupController();
