basic-node-chat
===============

After finishing the nodejs course at codeschool, I made this application just for the purpose of learning.

## Setup

After cloning run `npm install && bower install`.

Use `grunt` to run the application.

If you want to use it in your LAN, don't forget to replace your server ip from `public/js/main.js` in line 33.

```javascript
var socket = io.connect('http://localhost:3000'); // http://yourip:port
```

And comment or remove line 14 from `views/layout.jade`:

```
script(src='http://localhost:35729/livereload.js') // remove or comment this line
```
