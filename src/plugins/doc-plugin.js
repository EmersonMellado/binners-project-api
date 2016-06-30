"use strict";

/**
 * Doc Plugin
 * @description This plugin will create the swagger api documentation
 * @author Samuel Castro
 * @since 1/14/2016
 */
var Pack = require('../../package'),
	inspect = require('eyes').inspector({styles: {all: 'magenta'}});

var config = require('config');

/**
 * Setup swagger options
 * @type {{apiVersion: *, authorizations: {default: {type: string, passAs: string, keyname: string}}, info: {title: *, description: *, contact: (blogpost.author|{type, ref}|*), license: *, licenseUrl: string}}}
 */
var apiDocOptions = {
	host: config.get('SERVER.HOST'), //Fix for heroku deploy
	apiVersion: Pack.version,
	authorizations: {
		default: {
			type: "apiKey",
			passAs: "header",
			keyname: "authentication"
		}
	},
	info: {
		title: Pack.name,
		description: Pack.description,
		contact: Pack.author
	}
};

/**
 * Registering an api documentation plugin
 * @param server
 * @param options
 * @param next
 */
exports.register = function(server, options, next){
	console.log("server",server.info);
	server.register({
		register: require('hapi-swagger'),
		options: apiDocOptions
	}, function (err) {
		if (err) {
			inspect('[ error ] hapi-swagger load error: ' + err)
		}
	});

  next();

};

/**
 * Exporting plugin
 * @type {{name: string, version: string}}
 */
exports.register.attributes = {
  name: 'doc-plugin',
  version: '0.0.1'
};
