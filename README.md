# Live Demo - Vanilla JS

A demo of a live coding environment using [websocket-text-relay](https://github.com/niels4/websocket-text-relay).

Built with Vanilla JS - No frameworks or external dependencies.

This is meant to be a simple tool for creating and publishing simple html/css/js examples.

Each page consists of exactly 1 html file, 1 css file, and 1 javascript file.

Its a tool similar to codepen or jsfiddle, except all the files are on your local computer and the browser
will update as you type, no refresh needed.

## Preview

This project can be served by any plain static http server.

Preview the demo using github pages by visiting the url [https://niels4.github.io/live-demo-vanillajs/](https://niels4.github.io/live-demo-vanillajs/)

## Developer Instructions

### Run project locally

To run the project locally, clone the directory and serve the root of the directory using any http server

This example uses `browser-sync` (which requires nodejs), however you may use another http server of your choice. EG: `python3 -m http.server`

```bash
git clone https://github.com/niels4/live-demo-vanillajs.git
cd live-demo-vanillajs
npx browser-sync --files "**/*.*" # browser-sync will automatically refresh your browser when you save a file
```

### Live updates

Install the [websocket-text-relay](https://github.com/niels4/websocket-text-relay?tab=readme-ov-file#1-install-the-extension-for-your-text-editor) extension for your text editor of choice.

Now when you edit any file in the `live-pages` directory, you should see the changes update live in your browser as you type. No saving or refreshing necessary.

### Make it your own

Feel free to delete all the existing live-pages and create your own.

Create a fresh git repo and push your project to github. If you are just practicing, then keep your repo as private.
If you wish to publish the repo as a portfolio, make it public and follow the publishing instructions below.

```bash
# remove all included examples
rm -rf live-pages/*

# create a simple root page
echo "<h1>Hello World</h1>" > live-pages/main.html
echo "h1 { color: hsl(320 90% 40%); }" > live-pages/main.css
echo "console.log('hello world')" > live-pages/main.js

# create a fresh git repository
rm -rf .git
git init

# create a new blank repository in github
# push your repository
git origin add main git@github.com:\<github username\>/\<repo name\>
```

### Publish using github pages

Because this project is just static files, it can be published using github pages.

Next login to the github website and navigate to the settings page of your repository. Click the `Pages` link in the menu
on the left side of the window.

Under `Build and deployment` make sure `Source` is set to "Deploy from a branch" and `Branch` is set to "main" and "/(root)"

Click save.

Now visit the URL by pressing the `Visit site` button toward the top of the page.

It will be published using the following URL pattern: https://\<github username\>.github.io/\<repository-name\>

## Long term maintenance

This project doesn't use any external dependencies, as long as browsers still exist this code will work forever without any need for updates.

## Live demo with Typescript and React

Check out [live-demo-vite](https://github.com/niels4/live-demo-vite) for an example of a live demo environment
that uses [vite-plugin-websocket-text-relay](https://github.com/niels4/vite-plugin-websocket-text-relay)
