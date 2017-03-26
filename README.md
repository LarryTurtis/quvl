# ServerBid

A few notes:

1. The Auth0 keys are currently included in the `development.json` config file. Once we have
a functional deployment we should re-generate these keys and start reading them from an
environment variable rather than having them in the codebase.
2. The S3 bucket name that we're going to use to deploy the client side is currently left
blank in `Makefile`. This will need to be filled in before we can deploy.

## Development

Requires [yarn](https://yarnpkg.com) for package management. This is a quick install on OS X,
just follow the installation instructions on the Yarn website.

To install dependencies and start the dev server:

```
yarn install
npm run dev
```

The site will then be available at `http://localhost:7000`. Hot module reloading is set up
for both client- and server-side code, so no refresh should be required.

## Makefile

A Makefile is provided for deployment-oriented tasks:

* `make build`: Create webpack bundle for JS and CSS in `dist`.
* `make compress`: GZIP JS/CSS bundles in preparation for deployment to Amazon S3.
* `make deploy`: Using s3cmd, push JS/CSS bundles to Amazon S3.

There's also a task, `make cert`, which will regenerate the self-signed certificate
used by the development server. You shouldn't need this, but it's here if necessary.

## Testing

To run development tests:

`npm test`


