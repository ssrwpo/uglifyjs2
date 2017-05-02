// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by uglifyjs2.js.
import { name as packageName } from "meteor/ssrwpo:uglifyjs2";

// Write your tests here!
// Here is an example.
Tinytest.add('uglifyjs2 - example', function (test) {
  test.equal(packageName, "uglifyjs2");
});
