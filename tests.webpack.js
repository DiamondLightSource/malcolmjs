var context = require.context('./js', true, /-test\.js$/); //make sure you have your directory and regex test set correctly!
console.log("tests.webpack.js...");
context.keys().forEach(context);
