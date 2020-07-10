'use strict';

const extend = require( 'extend' );
const globby = require( 'globby' );

const METHODS = [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS' ];
const EXTENSIONS = [ 'js', 'cjs' ];

module.exports = async function( _options ) {
	const options = extend( true, {
		root: 'api',
		methods: METHODS,
		extensions: EXTENSIONS
	}, _options );

	const paths = await globby( options.root, {
		expandDirectories: {
			files: options.methods,
			extensions: options.extensions
		}
	} );

	const cwd = process.cwd();

	const fastify_objects = paths.map( ( path ) => {
		const [ _match, url, method ] = path.match( new RegExp( `^${ options.root }(.*?)/(${ options.methods.join( '|' )})\\.(${ options.extensions.join( '|' ) })`, 'i' ) );

		if ( !_match ) {
			return undefined;
		}

		const normalized = require( 'path' ).join( cwd, path );
		const handler = require( normalized );
		const route = typeof handler === 'function' ? {
			handler
		} : handler;

		return extend( true, {
			method: method.toUpperCase(),
			url
		}, route );
	} ).filter( ( object ) => typeof object !== 'undefined' );

	return fastify_objects || [];
};