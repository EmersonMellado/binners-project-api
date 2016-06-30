"use strict";

/**
 * Server
 * @description Creating a new hapi server passing the host/port
 * @author Samuel Castro
 * @since 1/14/2016
 */

var Hapi = require('hapi'),
    environment = require('./environment/environment.js'),
    plugins = require('./plugins'),
    routes = require('./routes'),
    db = require('./lib/db.js'),
    inspect = require('eyes').inspector({styles: {all: 'magenta'}}),
    server = new Hapi.Server();

/**
 * Creating a server connection passing host/port.
 */
var server_port = environment.server.port || process.env.PORT || 80;
var server_host = environment.server.host || '0.0.0.0';
console.log("server_port", server_port);
console.log("server_host", server_host);
server.connection({
    host: server_host,
    port: server_port,
    routes: {
        cors: true
    }
});

/**
 * Setup template views with handlebar, used to show the api documentation
 */
server.views({
    path: './src/public/templates',
    engines: { html: require('handlebars') },
    partialsPath: './src/public/templates/withPartials',
    helpersPath: './src/public/templates/helpers',
    isCached: false
});

/**
 * Registering all plugins
 */
server.register(plugins.concat(routes), function (err) {
    if (err)
        throw err;
});

/**
 * Listening start event
 */
server.on('start', function () {
    inspect('[ start ] SoundBitz server started at: ' + server.info.uri);
    db();
});

/**
 * Listening error events
 */
server.on('request-error', function (request, err) {
    inspect('[ error ] Error response (500) sent for request: ' + request.route.path + ' because: ' + err.message);
});

module.exports = server;
