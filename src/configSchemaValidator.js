
    export {validate10 as validate};
    function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.include === undefined) && (missing0 = "include")){
validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.include !== undefined){
let data0 = data.include;
const _errs1 = errors;
if(errors === _errs1){
if(Array.isArray(data0)){
var valid1 = true;
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
const _errs3 = errors;
if(typeof data0[i0] !== "string"){
validate10.errors = [{instancePath:instancePath+"/include/" + i0,schemaPath:"#/properties/include/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs3 === errors;
if(!valid1){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/include",schemaPath:"#/properties/include/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.exclude !== undefined){
let data2 = data.exclude;
const _errs5 = errors;
if(errors === _errs5){
if(Array.isArray(data2)){
var valid2 = true;
const len1 = data2.length;
for(let i1=0; i1<len1; i1++){
const _errs7 = errors;
if(typeof data2[i1] !== "string"){
validate10.errors = [{instancePath:instancePath+"/exclude/" + i1,schemaPath:"#/properties/exclude/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid2 = _errs7 === errors;
if(!valid2){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/exclude",schemaPath:"#/properties/exclude/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.transforms !== undefined){
let data4 = data.transforms;
const _errs9 = errors;
if(errors === _errs9){
if(Array.isArray(data4)){
var valid3 = true;
const len2 = data4.length;
for(let i2=0; i2<len2; i2++){
const _errs11 = errors;
if(typeof data4[i2] !== "string"){
validate10.errors = [{instancePath:instancePath+"/transforms/" + i2,schemaPath:"#/properties/transforms/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid3 = _errs11 === errors;
if(!valid3){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/transforms",schemaPath:"#/properties/transforms/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.rootDir !== undefined){
const _errs13 = errors;
if(typeof data.rootDir !== "string"){
validate10.errors = [{instancePath:instancePath+"/rootDir",schemaPath:"#/properties/rootDir/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outDir !== undefined){
const _errs15 = errors;
if(typeof data.outDir !== "string"){
validate10.errors = [{instancePath:instancePath+"/outDir",schemaPath:"#/properties/outDir/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.filesList !== undefined){
const _errs17 = errors;
if(typeof data.filesList !== "string"){
validate10.errors = [{instancePath:instancePath+"/filesList",schemaPath:"#/properties/filesList/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs17 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.cloneFrom !== undefined){
let data9 = data.cloneFrom;
const _errs19 = errors;
if(errors === _errs19){
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
let missing1;
if(((data9.ref === undefined) && (missing1 = "ref")) || ((data9.remote === undefined) && (missing1 = "remote"))){
validate10.errors = [{instancePath:instancePath+"/cloneFrom",schemaPath:"#/properties/cloneFrom/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
if(data9.remote !== undefined){
const _errs21 = errors;
if(typeof data9.remote !== "string"){
validate10.errors = [{instancePath:instancePath+"/cloneFrom/remote",schemaPath:"#/properties/cloneFrom/properties/remote/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid4 = _errs21 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data9.ref !== undefined){
const _errs23 = errors;
if(typeof data9.ref !== "string"){
validate10.errors = [{instancePath:instancePath+"/cloneFrom/ref",schemaPath:"#/properties/cloneFrom/properties/ref/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid4 = _errs23 === errors;
}
else {
var valid4 = true;
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/cloneFrom",schemaPath:"#/properties/cloneFrom/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.pushTo !== undefined){
let data12 = data.pushTo;
const _errs25 = errors;
if(errors === _errs25){
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
if(data12.remote !== undefined){
const _errs27 = errors;
if(typeof data12.remote !== "string"){
validate10.errors = [{instancePath:instancePath+"/pushTo/remote",schemaPath:"#/properties/pushTo/properties/remote/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid5 = _errs27 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data12.refPrefix !== undefined){
const _errs29 = errors;
if(typeof data12.refPrefix !== "string"){
validate10.errors = [{instancePath:instancePath+"/pushTo/refPrefix",schemaPath:"#/properties/pushTo/properties/refPrefix/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid5 = _errs29 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data12.diffViewerTemplate !== undefined){
const _errs31 = errors;
if(typeof data12.diffViewerTemplate !== "string"){
validate10.errors = [{instancePath:instancePath+"/pushTo/diffViewerTemplate",schemaPath:"#/properties/pushTo/properties/diffViewerTemplate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid5 = _errs31 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data12.treeBrowserTemplate !== undefined){
const _errs33 = errors;
if(typeof data12.treeBrowserTemplate !== "string"){
validate10.errors = [{instancePath:instancePath+"/pushTo/treeBrowserTemplate",schemaPath:"#/properties/pushTo/properties/treeBrowserTemplate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid5 = _errs33 === errors;
}
else {
var valid5 = true;
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/pushTo",schemaPath:"#/properties/pushTo/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.prePatch !== undefined){
let data17 = data.prePatch;
const _errs35 = errors;
const _errs36 = errors;
let valid6 = false;
const _errs37 = errors;
if(errors === _errs37){
if(data17 && typeof data17 == "object" && !Array.isArray(data17)){
let missing2;
if((data17.cherryPick === undefined) && (missing2 = "cherryPick")){
const err0 = {instancePath:instancePath+"/prePatch",schemaPath:"#/properties/prePatch/anyOf/0/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data17.cherryPick !== undefined){
let data18 = data17.cherryPick;
const _errs39 = errors;
if(errors === _errs39){
if(data18 && typeof data18 == "object" && !Array.isArray(data18)){
let missing3;
if((data18.range === undefined) && (missing3 = "range")){
const err1 = {instancePath:instancePath+"/prePatch/cherryPick",schemaPath:"#/properties/prePatch/anyOf/0/properties/cherryPick/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
if(data18.remote !== undefined){
const _errs41 = errors;
if(typeof data18.remote !== "string"){
const err2 = {instancePath:instancePath+"/prePatch/cherryPick/remote",schemaPath:"#/properties/prePatch/anyOf/0/properties/cherryPick/properties/remote/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid8 = _errs41 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data18.range !== undefined){
const _errs43 = errors;
if(typeof data18.range !== "string"){
const err3 = {instancePath:instancePath+"/prePatch/cherryPick/range",schemaPath:"#/properties/prePatch/anyOf/0/properties/cherryPick/properties/range/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var valid8 = _errs43 === errors;
}
else {
var valid8 = true;
}
}
}
}
else {
const err4 = {instancePath:instancePath+"/prePatch/cherryPick",schemaPath:"#/properties/prePatch/anyOf/0/properties/cherryPick/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
}
}
else {
const err5 = {instancePath:instancePath+"/prePatch",schemaPath:"#/properties/prePatch/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var _valid0 = _errs37 === errors;
valid6 = valid6 || _valid0;
if(!valid6){
const _errs45 = errors;
if(data17 !== null){
const err6 = {instancePath:instancePath+"/prePatch",schemaPath:"#/properties/prePatch/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid0 = _errs45 === errors;
valid6 = valid6 || _valid0;
}
if(!valid6){
const err7 = {instancePath:instancePath+"/prePatch",schemaPath:"#/properties/prePatch/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs36;
if(vErrors !== null){
if(_errs36){
vErrors.length = _errs36;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs35 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postPatch !== undefined){
let data21 = data.postPatch;
const _errs47 = errors;
const _errs48 = errors;
let valid9 = false;
const _errs49 = errors;
if(errors === _errs49){
if(data21 && typeof data21 == "object" && !Array.isArray(data21)){
let missing4;
if((data21.cherryPick === undefined) && (missing4 = "cherryPick")){
const err8 = {instancePath:instancePath+"/postPatch",schemaPath:"#/properties/postPatch/anyOf/0/required",keyword:"required",params:{missingProperty: missing4},message:"must have required property '"+missing4+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
else {
if(data21.cherryPick !== undefined){
let data22 = data21.cherryPick;
const _errs51 = errors;
if(errors === _errs51){
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
let missing5;
if(((data22.range === undefined) && (missing5 = "range")) || ((data22.remote === undefined) && (missing5 = "remote"))){
const err9 = {instancePath:instancePath+"/postPatch/cherryPick",schemaPath:"#/properties/postPatch/anyOf/0/properties/cherryPick/required",keyword:"required",params:{missingProperty: missing5},message:"must have required property '"+missing5+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
else {
if(data22.remote !== undefined){
const _errs53 = errors;
if(typeof data22.remote !== "string"){
const err10 = {instancePath:instancePath+"/postPatch/cherryPick/remote",schemaPath:"#/properties/postPatch/anyOf/0/properties/cherryPick/properties/remote/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
var valid11 = _errs53 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data22.range !== undefined){
const _errs55 = errors;
if(typeof data22.range !== "string"){
const err11 = {instancePath:instancePath+"/postPatch/cherryPick/range",schemaPath:"#/properties/postPatch/anyOf/0/properties/cherryPick/properties/range/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
var valid11 = _errs55 === errors;
}
else {
var valid11 = true;
}
}
}
}
else {
const err12 = {instancePath:instancePath+"/postPatch/cherryPick",schemaPath:"#/properties/postPatch/anyOf/0/properties/cherryPick/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
}
}
else {
const err13 = {instancePath:instancePath+"/postPatch",schemaPath:"#/properties/postPatch/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
var _valid1 = _errs49 === errors;
valid9 = valid9 || _valid1;
if(!valid9){
const _errs57 = errors;
if(data21 !== null){
const err14 = {instancePath:instancePath+"/postPatch",schemaPath:"#/properties/postPatch/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
var _valid1 = _errs57 === errors;
valid9 = valid9 || _valid1;
}
if(!valid9){
const err15 = {instancePath:instancePath+"/postPatch",schemaPath:"#/properties/postPatch/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs48;
if(vErrors !== null){
if(_errs48){
vErrors.length = _errs48;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs47 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate10.errors = vErrors;
return errors === 0;
}

