'use strict';

const assert = require( 'assert' );
const fs_fastify = require( '../index.js' );
const test = require( 'baretest' )( 'fs-fastify' );

test.quiet( false );
test.bail( false );

test( 'should recursively load paths', async () => {
	const fastify_objects = await fs_fastify( {
		root: 'test'
	} );

	for ( const fastify_object of fastify_objects ) {
		assert.ok( fastify_object.method );
	}
} );

( async function() {
	await test.run();
} )();