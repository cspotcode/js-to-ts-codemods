// leading comments
/** more leading comments */
interface Foo {}
export function foo(b) {
    const a = (
        b((what) as Promise<Foo> | undefined)
    ) as Foo;
}

export { bar as foo2 };

/**
 * @param foo
 */
function bar<A>(foo) {

}

export function foo3<A>(arg) {

}

/**
 * @param a JSDoc for foo4
 */
export function foo4<A>(a: A) {
    // body
}

function local() {

}

/**
 * @template D keep this comment
 * @param  foo Keep this comment
 * */
function jsdocGenerics<A, B, C extends number, D>(bar: B, foo: A, baz: C, biff: D) {}

{
    /**
     * used to declare stuff
     * */
    const asdf: number = 123;
    /**
     * comment*/
    const asdf2: number = 123;
}
