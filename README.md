# Live Demo - Vanilla JS

A demo of a live coding environment using [websocket-text-relay](https://github.com/niels4/websocket-text-relay).

Built with Vanilla JS - No frameworks or external dependencies.

This is meant to be a simple tool for creating and publishing simple html/css/js examples.

Each page consists of exactly 1 html file, 1 css file, and 1 javascript file.

Its a tool similar to codepen or jsfiddle, except all the files are on your local computer and the browser
will update as you type, no refresh needed.

## Preview

This project can be served by any plain static http server.


Preview the demo using github pages by visitin the url [https://niels4.github.io/live-demo-vanillajs](https://niels4.github.io/live-demo-vanillajs)


## Developer Instructions

### Run project locally
To run the project locally, clone the directory and serve the root of the directory using any http server

```bash
git clone https://github.com/niels4/live-demo-vanillajs.git
cd live-demo-vanillajs
npx browser-sync --files "**/*.*" # browser-sync will automatically refresh your browser when you save a file
```

### Live updates

First install the [websocket-text-relay](https://github.com/niels4/websocket-text-relay?tab=readme-ov-file#1-install-the-extension-for-your-text-editor) extension for your text editor of choice.

Now when you edit any file in the `pages` directory, you should see the changes update live in your browser.
