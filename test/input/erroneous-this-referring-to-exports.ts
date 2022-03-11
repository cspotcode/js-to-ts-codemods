/// <reference types="node" />
exports.foo = function() {
    this.bar();
    function inner() {
        this.what = 123; // should not be touched
    }
}

exports.foo2 = function() {
    exports.bar();
    function inner() {
        exports.bar(); // this *should* be touched
    }
}


exports.bar = function() {
    console.log('bar');
}
