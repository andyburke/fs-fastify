'use strict';

const extend = require( 'extend' );
const globby = require( 'globby' );
const path = require( 'path' );

const METHODS = [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS' ];
const EXTENSIONS = [ 'js', 'cjs' ];

module.exports = async function( _options ) {
	const options = extend( true, {
		root: 'api',
		methods: METHODS,
		extensions: EXTENSIONS
	}, _options );

	const cwd = options.cwd ?? process.cwd();
	const root = path.join( cwd, options.root );

	const paths = await globby( root, {
		expandDirectories: {
			files: options.methods,
			extensions: options.extensions
		}
	} );

	const fastify_objects = paths.map( ( path ) => {
		const [ _match, url, method ] = path.match( new RegExp( `^${ root }(.*?)/(${ options.methods.join( '|' )})\\.(${ options.extensions.join( '|' ) })`, 'i' ) );

		if ( !_match ) {
			return undefined;
		}

		const handler = require( path );
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