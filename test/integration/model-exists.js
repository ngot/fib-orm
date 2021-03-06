var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("Model.exists()", function() {
    var db = null;
    var Person = null;
    var good_id, bad_id;

    var setup = function() {
        return function(done) {
            Person = db.define("person", {
                name: String
            });

            return helper.dropSync(Person, function() {
                var people = Person.createSync([{
                    name: "Jeremy Doe"
                }, {
                    name: "John Doe"
                }, {
                    name: "Jane Doe"
                }]);
                good_id = people[0][Person.id];

                if (typeof good_id == "number") {
                    // numeric ID
                    bad_id = good_id * 100;
                } else {
                    // string ID, keep same length..
                    bad_id = good_id.split('').reverse().join('');
                }
            });
        };
    };

    before(function(done) {
        db = helper.connect();
    });

    after(function() {
        db.closeSync();
    });

    describe("with an id", function() {
        before(setup());

        it("should return true if found", function() {
            var exists = Person.existsSync(good_id);
            assert.ok(exists);
        });

        it("should return false if not found", function() {
            var exists = Person.existsSync(bad_id);
            assert.notOk(exists);
        });
    });

    describe("with a list of ids", function() {
        before(setup());

        it("should return true if found", function() {
            var exists = Person.existsSync([good_id]);
            assert.ok(exists);
        });

        it("should return false if not found", function() {
            var exists = Person.existsSync([bad_id]);
            assert.notOk(exists);
        });
    });

    describe("with a conditions object", function() {
        before(setup());

        it("should return true if found", function() {
            var exists = Person.existsSync({ name: "John Doe" });
            assert.ok(exists);
        });

        it("should return false if not found", function() {
            var exists = Person.existsSync({ name: "Jack Doe" });
            assert.notOk(exists);
        });
    });
});
