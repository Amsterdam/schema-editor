# Amsterdam Schema Editor

Editor for [Amsterdam Schema](https://github.com/Amsterdam/amsterdam-schema), made with React.

See https://amsterdam.github.io/schema-editor/.

Variables such as the Amsterdam Schema base URI and version are stored in [`config.json`](config.json). The editor loads this file every time it runs.

To change the configuration, edit this file and build and deploy the app, or [edit the hosted version directly](https://github.com/Amsterdam/schema-editor/blob/gh-pages/config.json).

_Note: if you edit the hosted version and then later deploy a new version, your edits will be overwritten._

## Building & Deploying

First, clone this repository.

Then, install its dependencies:

    yarn install

Build the app:

    yarn build

Deploy to GitHub Pages (deploying also runs the build step):

    yarn run deploy

TODO:

- [ ] Don't just update Field state on `blur`, also _throttled_/_debounced_ on `change`
