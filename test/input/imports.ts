const mfj = require('./main_jorb_functions'); // homsar
const {a} = require('./main_jorb_functions'); // homsar
const {sortBy} = require('lodash');
const {helper} = require('./utils.js');
const {date} = require('date.js');
const stuff = require('utility').create(); // It cannot transform this
const {grabbed} = mfj;

mfj.doGoodJorb();
mfj.tukOurJrbs();

const job: import('./main_jorb_functions').Jorb = 1;
const foo: import('./bar').Foo = 1;
const bar: import('./bar').Bar = 1;
