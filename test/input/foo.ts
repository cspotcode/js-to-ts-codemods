// leading comments
/** more leading comments */
interface Foo {}
export function foo(b) {
    const a = /** @type {Foo} */ (
        b(/** @type {Promise<Foo> | undefined} */(what))
    );
}

/**
 * @param foo
 */
exports.foo2 = function bar<A>(foo) {

}
exports.foo3 = function <A>(arg) {

}
exports.foo4 = foo4;
/**
 * @param a JSDoc for foo4
 */
function foo4<A>(a: A) {
    // body
}

function local() {

}

/**
 * @template A,B
 * @template {number} C
 * @template D keep this comment
 * @param {A} foo Keep this comment
 * @param {B} bar
 * @param {D} biff
 * @param {C} baz
 * @return {string} name
 */
function jsdocGenerics(bar, foo, baz, biff) {}

/**
 * @returns {string}
 */
function _returns() {}
/**
 * @return {string}
 */
function _return() {}

{
    /**
     * used to declare stuff
     * @type {number}
     */
    const asdf = 123;
    /**
     * @type {number}
     * comment
     */
    const asdf2 = 123;
}
