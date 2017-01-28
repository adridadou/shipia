module.exports = {
  build: {
    "index.html": "index.html",
    "buyer.html": "buyer.html",
    "seller.html": "seller.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
