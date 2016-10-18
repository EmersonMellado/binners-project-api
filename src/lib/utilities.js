'use strict';

/**
 * Utilities
 * @description Some utilities
 * @author Samuel Castro
 * @since 1/14/2016
 */
var marked = require('marked'),
	hapi = require('hapi'),
	fs = require('fs'),
	config = require('config'),
	oAuth = require('oauth');

module.exports = {

	getErrorsCode: function() {
		return {
			DUPLICATED_USER: {
				errorCode: '001',
				message: 'Register using email already taken.'
			},
			USER_NOT_FOUND: {
				errorCode: '002',
				message: 'User not found.'
			},
			INVALID_PASSWORD: {
				errorCode: '003',
				message: 'Invalid password.'
			},
			EMAIL_NOT_FOUND: {
				errorCode: '004',
				message: 'Email not found.'
			},
			INVALID_EMAIL_FORMAT: {
				errorCode: '005',
				message: 'Invalid email format.'
			},
			NAME_IS_REQUIRED: {
				errorCode: '006',
				message: 'User Name is required.'
			},
			PICKUP_NOT_FOUND: {
				errorCode: '007',
				message: 'Pickup not found.'
			},
			PICKUP_INVALID_STATUS: {
				errorCode: '008',
				message: 'Invalid status changing.'
			},			
			INVALID_USER_FOR_REVIEW: {
				errorCode: '010',
				message: 'Only the requester can review this pickup.'
			}			
		}
	},

	// read a file and converts the markdown to HTML
	getMarkDownHTML: function( path, callback ){
		fs.readFile(path, 'utf8', function (err,data) {
			if (!err) {
				marked.setOptions({
					gfm: true,
					tables: true,
					breaks: false,
					pedantic: false,
					sanitize: true,
					smartLists: true,
					smartypants: false,
					langPrefix: 'language-',
					highlight: function(code, lang) {
						return code;
					}
				});
				data = marked(data);
			}
			callback( err, data );
		});
	},


	generateID: function() {
		return ('0000' + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
	},


	buildError: function( code, error ){
		var error = hapi.error.badRequest( error );
		error.output.statusCode = code
		error.reformat();
		return error;
	},

	clone: function( obj ){
		return( JSON.parse( JSON.stringify( obj ) ));
	},


	isString: function (obj) {
		return typeof (obj) == 'string';
	},


	trim: function (str) {
		return str.replace(/^\s+|\s+$/g, "");
	},


	isArray: function (obj) {
		return obj && !(obj.propertyIsEnumerable('length'))
			&& typeof obj === 'object'
			&& typeof obj.length === 'number';
	},

	twitterOAuth: (function (){
		var oauth = new oAuth.OAuth(
		  'https://api.twitter.com/oauth/request_token',
		  'https://api.twitter.com/oauth/access_token',
		  config.get('SOCIAL.TWITTER.CLIENT_ID'),
		  config.get('SOCIAL.TWITTER.CLIENT_SECRET'),
		  '1.0A',
		  null,
		  'HMAC-SHA1'
		);

		return oauth;
	})(),
	/* XXX: think it could be on the model */
	PickupStatus : {ON_GOING:'on_going', WAITING_REVIEW:'waiting_review', COMPLETED:'completed', CANCELED:'canceled'}
};
