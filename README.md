# fs-fastify

A module to drive your fastify setup via the filesystem.

## Example

```javascript
const fastify = require( 'fastify' )( {
	logger: true
} );
const fs_fastify = require( '@andyburke/fs-fastify' );

const routes = await fs_fastify();
for ( const route of routes ) {
	fastify.register( route );
}

fastify.listen( 3000, function ( err, address ) {
  if ( err ) {
    fastify.log.error( err );
    process.exit( 1 );
  }
  fastify.log.info( `server listening on ${address}` );
} );

```

This will load all files that match the required options and register them as
routes in your fastify server.

For example, you could lay out your files thusly:

```
./api
	foo/
		:bar/
			GET.js
		:baz/
			POST.js
		zip/
			PATCH.js
```

This would create the following routes:

```
GET /foo/:bar
POST /foo/:baz
PATCH /foo/zip
```

## Options

### root = 'api'

Sets the root folder to find routes in. By default this is set to 'api'.

### extensions = [ 'js', 'cjs' ]

Sets the extensions to search for.

### methods = [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS' ]

Sets the methods to look for in the file tree. Defaults to all normal HTTP
methods.

## Route Definitions

Your routes should export either a single function, eg:

```javascript
module.exports = function ( request, reply ) {
	return {
		hello: "world"
	};
};
```

Or you can export a fastify route object, eg:

```javascript
module.exports = {
	// you should omit the method, as it will be filled by fs-fastify based on
	// the filename
	// method: 'GET',

	// you should omit the url, as it will be filled by fs-fastify based on
	// the filename
	// url: '/',
	
	schema: {
		response: {
			200: {
				type: 'object',
				properties: {
					hello: { type: 'string' }
				}
			}
		}
	},

	handler: function (request, reply) {
		reply.send( { hello: 'world' } )
	}
};
```
