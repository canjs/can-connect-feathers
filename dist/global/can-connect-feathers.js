/*[traceur-runtime]*/
this._System=this.System,function(t){"use strict";function e(t,e,r){for(var n=[e],u=0;u<r.length;u++)n[u+1]=r[u];var i=$(Function.prototype.bind,t,n);return i}function r(t,r){var n=new(e(t,null,r));return n}function n(){return"__$"+Math.floor(1e9*Math.random())+"$"+ ++P+"$__"}function u(t){return E[t]}function i(){var t=n();return E[t]=!0,t}function o(t,e,r){return[x,t,e,r]}function c(t){return t&&t[0]===x}function a(){M=i(),Function.prototype.call=s(function(t){var e=f(function(t){for(var e=[],r=1;r<arguments.length;++r)e[r-1]=arguments[r];var n=o(this,t,e);return n},this,arguments);return e}),Function.prototype.apply=s(function(t,e){var r=f(function(t,e){var r=o(this,t,e);return r},this,arguments);return r})}function s(t){return null===M&&a(),t[M]=!0,t}function l(t){return!!t[M]}function f(t,e,r){var n=r[0];if(c(n))return n=$(t,e,n[3]);for(n=o(t,e,r);;){if(n=l(t)?$(t,n[2],[n]):$(t,n[2],n[3]),!c(n))return n;t=n[1]}}function h(){var t;return t=l(this)?r(this,[o(null,null,arguments)]):r(this,arguments)}if(!t.$traceurRuntime){var m=Object,p=TypeError,b=m.create,y=m.defineProperties,v=m.defineProperty,g=m.freeze,d=m.getOwnPropertyDescriptor,j=m.getOwnPropertyNames,w=m.keys,O=m.prototype.hasOwnProperty,S=(m.prototype.toString,Object.preventExtensions),R=Object.seal,_=Object.isExtensible,$=Function.prototype.call.bind(Function.prototype.apply),P=0,E=b(null),x=Object.create(null),M=null;!function(){function e(t){return{configurable:!0,enumerable:!1,value:t,writable:!0}}function r(t){return"object"==typeof t&&t instanceof l}function c(t){return r(t)?"symbol":typeof t}function a(t){var e=new l(t);if(!(this instanceof a))return e;throw new TypeError("Symbol cannot be new'ed")}function l(t){var e=n();v(this,J,{value:this}),v(this,Q,{value:e}),v(this,X,{value:t}),P(this),Z[e]=this}function $(t){var e=t[tt];return e&&e.self===t?e:_(t)?(rt.hash.value=nt++,rt.self.value=t,et.value=b(null,rt),v(t,tt,et),et.value):void 0}function P(t){return $(t),g.apply(this,arguments)}function x(t){return $(t),S.apply(this,arguments)}function M(t){return $(t),R.apply(this,arguments)}function I(t){return Z[t]||E[t]}function N(t){return r(t)?t[Q]:t}function k(t){for(var e=[],r=0;r<t.length;r++)I(t[r])||e.push(t[r]);return e}function T(t){return k(j(t))}function A(t){return k(w(t))}function C(t){for(var e=[],r=j(t),n=0;n<r.length;n++){var u=Z[r[n]];u&&e.push(u)}return e}function F(t,e){return d(t,N(e))}function G(t){return O.call(this,N(t))}function H(e){return t.$traceurRuntime.options[e]}function U(t,e,n){return r(e)&&(e=e[Q]),v(t,e,n),t}function z(t){v(t,"defineProperty",{value:U}),v(t,"getOwnPropertyNames",{value:T}),v(t,"getOwnPropertyDescriptor",{value:F}),v(t.prototype,"hasOwnProperty",{value:G}),v(t,"freeze",{value:P}),v(t,"preventExtensions",{value:x}),v(t,"seal",{value:M}),v(t,"keys",{value:A})}function D(t){for(var e=1;e<arguments.length;e++)for(var r=j(arguments[e]),n=0;n<r.length;n++){var u=r[n];"__esModule"===u||"default"===u||I(u)||!function(e,r){v(t,r,{get:function(){return e[r]},enumerable:!0})}(arguments[e],r[n])}return t}function V(t){return null!=t&&("object"==typeof t||"function"==typeof t)}function q(t){if(null==t)throw p();return m(t)}function Y(t){if(null==t)throw new TypeError("Value cannot be converted to an Object");return t}function L(t,e){t.Symbol?ut=!0:(t.Symbol=e,Object.getOwnPropertySymbols=C,ut=!1),t.Symbol.iterator||(t.Symbol.iterator=e("Symbol.iterator")),t.Symbol.observer||(t.Symbol.observer=e("Symbol.observer"))}function W(){return ut}function K(t){L(t,a),t.Reflect=t.Reflect||{},t.Reflect.global=t.Reflect.global||t,z(t.Object)}var B=e,Q=n(),X=n(),J=n(),Z=b(null);v(a.prototype,"constructor",e(a)),v(a.prototype,"toString",B(function(){var t=this[J];return t[Q]})),v(a.prototype,"valueOf",B(function(){var t=this[J];if(!t)throw TypeError("Conversion from symbol to string");return H("symbols")?t:t[Q]})),v(l.prototype,"constructor",e(a)),v(l.prototype,"toString",{value:a.prototype.toString,enumerable:!1}),v(l.prototype,"valueOf",{value:a.prototype.valueOf,enumerable:!1});var tt=i(),et={value:void 0},rt={hash:{value:void 0},self:{value:void 0}},nt=0;P(l.prototype);var ut;K(t),t.$traceurRuntime={call:f,checkObjectCoercible:Y,construct:h,continuation:o,createPrivateName:i,defineProperties:y,defineProperty:v,exportStar:D,getOwnHashObject:$,getOwnPropertyDescriptor:d,getOwnPropertyNames:j,hasNativeSymbol:W,initTailRecursiveFunction:s,isObject:V,isPrivateName:u,isSymbolString:I,keys:w,options:{},setupGlobals:K,toObject:q,toProperty:N,"typeof":c}}()}}("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this),function(){function t(t,e,r,n,u,i,o){var c=[];return t&&c.push(t,":"),r&&(c.push("//"),e&&c.push(e,"@"),c.push(r),n&&c.push(":",n)),u&&c.push(u),i&&c.push("?",i),o&&c.push("#",o),c.join("")}function e(t){return t.match(c)}function r(t){if("/"===t)return"/";for(var e="/"===t[0]?"/":"",r="/"===t.slice(-1)?"/":"",n=t.split("/"),u=[],i=0,o=0;o<n.length;o++){var c=n[o];switch(c){case"":case".":break;case"..":u.length?u.pop():i++;break;default:u.push(c)}}if(!e){for(;i-->0;)u.unshift("..");0===u.length&&u.push(".")}return e+u.join("/")+r}function n(e){var n=e[a.PATH]||"";return n=r(n),e[a.PATH]=n,t(e[a.SCHEME],e[a.USER_INFO],e[a.DOMAIN],e[a.PORT],e[a.PATH],e[a.QUERY_DATA],e[a.FRAGMENT])}function u(t){var r=e(t);return n(r)}function i(t,r){var u=e(r),i=e(t);if(u[a.SCHEME])return n(u);u[a.SCHEME]=i[a.SCHEME];for(var o=a.SCHEME;o<=a.PORT;o++)u[o]||(u[o]=i[o]);if("/"==u[a.PATH][0])return n(u);var c=i[a.PATH],s=c.lastIndexOf("/");return c=c.slice(0,s+1)+u[a.PATH],u[a.PATH]=c,n(u)}function o(t){if(!t)return!1;if("/"===t[0])return!0;var r=e(t);return r[a.SCHEME]?!0:!1}var c=new RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$"),a={SCHEME:1,USER_INFO:2,DOMAIN:3,PORT:4,PATH:5,QUERY_DATA:6,FRAGMENT:7};$traceurRuntime.canonicalizeUrl=u,$traceurRuntime.isAbsolute=o,$traceurRuntime.removeDotSegments=r,$traceurRuntime.resolveUrl=i}(),function(t){"use strict";function e(t,e){this.url=t,this.value_=e}function r(t,e){this.message=this.constructor.name+": "+this.stripCause(e)+" in "+t,e instanceof r||!e.stack?this.stack="":this.stack=this.stripStack(e.stack)}function n(t,e){var r=[],n=e-3;0>n&&(n=0);for(var u=n;e>u;u++)r.push(t[u]);return r}function u(t,e){var r=e+1;r>t.length-1&&(r=t.length-1);for(var n=[],u=e;r>=u;u++)n.push(t[u]);return n}function i(t){for(var e="",r=0;t-1>r;r++)e+="-";return e}function o(t,r){e.call(this,t,null),this.func=r}function c(t){if(t){var e=v.normalize(t);return p[e]}}function a(t){var e=arguments[1],r=Object.create(null);return Object.getOwnPropertyNames(t).forEach(function(n){var u,i;if(e===y){var o=Object.getOwnPropertyDescriptor(t,n);o.get&&(u=o.get)}u||(i=t[n],u=function(){return i}),Object.defineProperty(r,n,{get:u,enumerable:!0})}),Object.preventExtensions(r),r}var s,l=$traceurRuntime,f=l.canonicalizeUrl,h=l.resolveUrl,m=l.isAbsolute,p=Object.create(null);s=t.location&&t.location.href?h(t.location.href,"./"):"",r.prototype=Object.create(Error.prototype),r.prototype.constructor=r,r.prototype.stripError=function(t){return t.replace(/.*Error:/,this.constructor.name+":")},r.prototype.stripCause=function(t){return t?t.message?this.stripError(t.message):t+"":""},r.prototype.loadedBy=function(t){this.stack+="\n loaded by "+t},r.prototype.stripStack=function(t){var e=[];return t.split("\n").some(function(t){return/UncoatedModuleInstantiator/.test(t)?!0:void e.push(t)}),e[0]=this.stripError(e[0]),e.join("\n")},o.prototype=Object.create(e.prototype),o.prototype.getUncoatedModule=function(){var e=this;if(this.value_)return this.value_;try{var o;return void 0!==typeof $traceurRuntime&&$traceurRuntime.require&&(o=$traceurRuntime.require.bind(null,this.url)),this.value_=this.func.call(t,o)}catch(c){if(c instanceof r)throw c.loadedBy(this.url),c;if(c.stack){var a=this.func.toString().split("\n"),s=[];c.stack.split("\n").some(function(t,r){if(t.indexOf("UncoatedModuleInstantiator.getUncoatedModule")>0)return!0;var o=/(at\s[^\s]*\s).*>:(\d*):(\d*)\)/.exec(t);if(o){var c=parseInt(o[2],10);s=s.concat(n(a,c)),1===r?s.push(i(o[3])+"^ "+e.url):s.push(i(o[3])+"^"),s=s.concat(u(a,c)),s.push("= = = = = = = = =")}else s.push(t)}),c.stack=s.join("\n")}throw new r(this.url,c)}};var b=Object.create(null),y={},v={normalize:function(t,e,r){if("string"!=typeof t)throw new TypeError("module name must be a string, not "+typeof t);if(m(t))return f(t);if(/[^\.]\/\.\.\//.test(t))throw new Error("module name embeds /../: "+t);return"."===t[0]&&e?h(e,t):f(t)},get:function(t){var e=c(t);if(!e)return void 0;var r=b[e.url];return r?r:(r=a(e.getUncoatedModule(),y),b[e.url]=r)},set:function(t,e){t=String(t),p[t]=new o(t,function(){return e}),b[t]=e},get baseURL(){return s},set baseURL(t){s=String(t)},registerModule:function(t,e,r){var n=v.normalize(t);if(p[n])throw new Error("duplicate module named "+n);p[n]=new o(n,r)},bundleStore:Object.create(null),register:function(t,e,r){e&&(e.length||r.length)?this.bundleStore[t]={deps:e,execute:function(){var t=arguments,n={};e.forEach(function(e,r){return n[e]=t[r]});var u=r.call(this,n);return u.execute.call(this),u.exports}}:this.registerModule(t,e,r)},getAnonymousModule:function(e){return new a(e.call(t),y)}},g=new a({ModuleStore:v});v.set("@traceur/src/runtime/ModuleStore.js",g);var d=$traceurRuntime.setupGlobals;$traceurRuntime.setupGlobals=function(t){d(t)},$traceurRuntime.ModuleStore=v,t.System={register:v.register.bind(v),registerModule:v.registerModule.bind(v),get:v.get,set:v.set,normalize:v.normalize}}("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this),System.registerModule("traceur-runtime@0.0.91/src/runtime/async.js",[],function(){"use strict";function t(){}function e(){}function r(t){return t.prototype=s(e.prototype),t.__proto__=e,t}function n(t,e){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];var u=s(e.prototype);return u[l]=this,u[f]=r,u[h]=t,u}function u(t,e){return new Promise(function(r,n){var u=t({next:function(t){return e.call(u,t)},"throw":function(t){n(t)},"return":function(t){r(t)}})})}function i(t){return Promise.resolve().then(t)}function o(t,e){return new y(t,e)}if("object"!=typeof $traceurRuntime)throw new Error("traceur runtime not found.");var c=$traceurRuntime.createPrivateName,a=$traceurRuntime.defineProperty,s=($traceurRuntime.defineProperties,Object.create),l=c(),f=c(),h=c();t.prototype=e,e.constructor=t,a(e,"constructor",{enumerable:!1});var m=function(){function t(t){var e=this;this.decoratedObserver=$traceurRuntime.createDecoratedGenerator(t,function(){e.done=!0}),this.done=!1,this.inReturn=!1}return $traceurRuntime.createClass(t,{"throw":function(t){if(!this.inReturn)throw t},"yield":function(t){if(this.done)throw void(this.inReturn=!0);var e;try{e=this.decoratedObserver.next(t)}catch(r){throw this.done=!0,r}if(void 0!==e){if(e.done)throw this.done=!0,void(this.inReturn=!0);return e.value}},yieldFor:function(t){var e=this;return $traceurRuntime.observeForEach(t[$traceurRuntime.toProperty(Symbol.observer)].bind(t),function(t){if(e.done)return void this["return"]();var r;try{r=e.decoratedObserver.next(t)}catch(n){throw e.done=!0,n}if(void 0!==r)return r.done&&(e.done=!0),r})}},{})}();e.prototype[Symbol.observer]=function(t){var e=this[h],r=new m(t);return $traceurRuntime.schedule(function(){return e(r)}).then(function(t){r.done||r.decoratedObserver["return"](t)})["catch"](function(t){r.done||r.decoratedObserver["throw"](t)}),r.decoratedObserver},a(e.prototype,Symbol.observer,{enumerable:!1});var p=Symbol(),b=Symbol(),y=function(){function t(t,e){this[p]=t,this[b]=e}return $traceurRuntime.createClass(t,{next:function(t){var e=this[p].next(t);return void 0!==e&&e.done&&this[b].call(this),e},"throw":function(t){return this[b].call(this),this[p]["throw"](t)},"return":function(t){return this[b].call(this),this[p]["return"](t)}},{})}();return Array.prototype[$traceurRuntime.toProperty(Symbol.observer)]=function(t){var e=!1,r=o(t,function(){return e=!0}),n=!0,u=!1,i=void 0;try{for(var c=void 0,a=this[$traceurRuntime.toProperty(Symbol.iterator)]();!(n=(c=a.next()).done);n=!0){var s=c.value;if(r.next(s),e)return}}catch(l){u=!0,i=l}finally{try{n||null==a["return"]||a["return"]()}finally{if(u)throw i}}return r["return"](),r},a(Array.prototype,$traceurRuntime.toProperty(Symbol.observer),{enumerable:!1}),$traceurRuntime.initAsyncGeneratorFunction=r,$traceurRuntime.createAsyncGeneratorInstance=n,$traceurRuntime.observeForEach=u,$traceurRuntime.schedule=i,$traceurRuntime.createDecoratedGenerator=o,{}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/classes.js",[],function(){"use strict";function t(t,e){var r=b(t);do{var n=p(r,e);if(n)return n;r=b(r)}while(r);return void 0}function e(t){return t.__proto__}function r(e,r,n){var u=t(r,n);if(u){var i=u.value;return i?i:u.get?u.get.call(e):i}return void 0}function n(e,r,n,u){var i=t(r,n);if(i&&i.set)return i.set.call(e,u),u;throw l("super has no setter '"+n+"'.")}function u(t,e){v(t).forEach(e),g(t).forEach(e)}function i(t){var e={};return u(t,function(r){e[r]=p(t,r),e[r].enumerable=!1}),e}function o(t){u(t,function(e){m(t,e,d)})}function c(t,e,r,n){return m(e,"constructor",{value:t,configurable:!0,enumerable:!1,writable:!0}),arguments.length>3?("function"==typeof n&&(t.__proto__=n),t.prototype=f(a(n),i(e))):(o(e),t.prototype=e),m(t,"prototype",{configurable:!1,writable:!1}),h(t,i(r))}function a(t){if("function"==typeof t){var e=t.prototype;if(s(e)===e||null===e)return t.prototype;throw new l("super prototype must be an Object or null")}if(null===t)return null;throw new l("Super expression must either be null or a function, not "+typeof t+".")}var s=Object,l=TypeError,f=s.create,h=$traceurRuntime.defineProperties,m=$traceurRuntime.defineProperty,p=$traceurRuntime.getOwnPropertyDescriptor,b=($traceurRuntime.getOwnPropertyNames,Object.getPrototypeOf),y=Object,v=y.getOwnPropertyNames,g=y.getOwnPropertySymbols,d={enumerable:!1};return $traceurRuntime.createClass=c,$traceurRuntime.superConstructor=e,$traceurRuntime.superGet=r,$traceurRuntime.superSet=n,{}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/destructuring.js",[],function(){"use strict";function t(t){for(var e,r=[],n=0;!(e=t.next()).done;)r[n++]=e.value;return r}return $traceurRuntime.iteratorToArray=t,{}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/generators.js",[],function(){"use strict";function t(t){return{configurable:!0,enumerable:!1,value:t,writable:!0}}function e(t){return new Error("Traceur compiler bug: invalid state in state machine: "+t)}function r(){this.state=0,this.GState=v,this.storedException=void 0,this.finallyFallThrough=void 0,this.sent_=void 0,this.returnValue=void 0,this.oldReturnValue=void 0,this.tryStack_=[]}function n(t,e,r,n){switch(t.GState){case g:throw new Error('"'+r+'" on executing generator');case j:if("next"==r)return{value:void 0,done:!0};if(n===S)return{value:t.returnValue,done:!0};throw n;case v:if("throw"===r){if(t.GState=j,n===S)return{value:t.returnValue,done:!0};throw n}if(void 0!==n)throw y("Sent value to newborn generator");case d:t.GState=g,t.action=r,t.sent=n;var u;try{u=e(t)}catch(i){if(i!==S)throw i;u=t}var o=u===t;return o&&(u=t.returnValue),t.GState=o?j:d,{value:u,done:o}}}function u(){}function i(){}function o(t,e,n){var u=l(t,n),i=new r,o=b(e.prototype);return o[R]=i,o[_]=u,o}function c(t){return t.prototype=b(i.prototype),t.__proto__=i,t}function a(){r.call(this),this.err=void 0;var t=this;t.result=new Promise(function(e,r){t.resolve=e,t.reject=r})}function s(t,e){var r=l(t,e),n=new a;return n.createCallback=function(t){return function(e){n.state=t,n.value=e,r(n)}},n.errback=function(t){f(n,t),r(n)},r(n),n.result}function l(t,e){return function(r){for(;;)try{return t.call(e,r)}catch(n){f(r,n)}}}function f(t,e){t.storedException=e;var r=t.tryStack_[t.tryStack_.length-1];return r?(t.state=void 0!==r["catch"]?r["catch"]:r["finally"],void(void 0!==r.finallyFallThrough&&(t.finallyFallThrough=r.finallyFallThrough))):void t.handleException(e)}if("object"!=typeof $traceurRuntime)throw new Error("traceur runtime not found.");var h=$traceurRuntime.createPrivateName,m=$traceurRuntime.defineProperties,p=$traceurRuntime.defineProperty,b=Object.create,y=TypeError,v=0,g=1,d=2,j=3,w=-2,O=-3,S={};r.prototype={pushTry:function(t,e){if(null!==e){for(var r=null,n=this.tryStack_.length-1;n>=0;n--)if(void 0!==this.tryStack_[n]["catch"]){r=this.tryStack_[n]["catch"];break}null===r&&(r=O),this.tryStack_.push({"finally":e,finallyFallThrough:r})}null!==t&&this.tryStack_.push({"catch":t})},popTry:function(){this.tryStack_.pop()},maybeUncatchable:function(){if(this.storedException===S)throw S},get sent(){return this.maybeThrow(),this.sent_},set sent(t){this.sent_=t},get sentIgnoreThrow(){return this.sent_},maybeThrow:function(){if("throw"===this.action)throw this.action="next",this.sent_},end:function(){switch(this.state){case w:return this;case O:throw this.storedException;default:throw e(this.state)}},handleException:function(t){throw this.GState=j,this.state=w,t},wrapYieldStar:function(t){var e=this;return{next:function(e){return t.next(e)},"throw":function(r){var n;if(r===S){if(t["return"]){if(n=t["return"](e.returnValue),!n.done)return e.returnValue=e.oldReturnValue,n;e.returnValue=n.value}throw r}if(t["throw"])return t["throw"](r);throw t["return"]&&t["return"](),y("Inner iterator does not have a throw method")}}}};var R=h(),_=h();return u.prototype=i,p(i,"constructor",t(u)),i.prototype={constructor:i,next:function(t){return n(this[R],this[_],"next",t)},"throw":function(t){return n(this[R],this[_],"throw",t)},"return":function(t){return this[R].oldReturnValue=this[R].returnValue,this[R].returnValue=t,n(this[R],this[_],"throw",S)}},m(i.prototype,{constructor:{enumerable:!1},next:{enumerable:!1},"throw":{enumerable:!1},"return":{enumerable:!1}}),Object.defineProperty(i.prototype,Symbol.iterator,t(function(){return this})),a.prototype=b(r.prototype),a.prototype.end=function(){switch(this.state){case w:this.resolve(this.returnValue);break;case O:this.reject(this.storedException);break;default:this.reject(e(this.state))}},a.prototype.handleException=function(){this.state=O},$traceurRuntime.asyncWrap=s,$traceurRuntime.initGeneratorFunction=c,$traceurRuntime.createGeneratorInstance=o,{}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/relativeRequire.js",[],function(){"use strict";function t(t,r){function n(t){return"/"===t.slice(-1)}function u(t){return"/"===t[0]}function i(t){return"."===t[0]}return e=e||"undefined"!=typeof require&&require("path"),n(r)||u(r)?void 0:i(r)?require(e.resolve(e.dirname(t),r)):require(r)}var e;return $traceurRuntime.require=t,{}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/spread.js",[],function(){"use strict";function t(){for(var t,e=[],r=0,n=0;n<arguments.length;n++){var u=$traceurRuntime.checkObjectCoercible(arguments[n]);if("function"!=typeof u[$traceurRuntime.toProperty(Symbol.iterator)])throw new TypeError("Cannot spread non-iterable object.");for(var i=u[$traceurRuntime.toProperty(Symbol.iterator)]();!(t=i.next()).done;)e[r++]=t.value}return e}return $traceurRuntime.spread=t,{}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/template.js",[],function(){"use strict";function t(t){var e=arguments[1],o=t.join("${}"),c=i[o];return c?c:(e||(e=u.call(t)),i[o]=n(r(e,"raw",{value:n(t)})))}var e=Object,r=e.defineProperty,n=e.freeze,u=Array.prototype.slice,i=Object.create(null);return $traceurRuntime.getTemplateObject=t,{}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/type-assertions.js",[],function(){"use strict";function t(t){for(var e=[],u=1;u<arguments.length;u++)e[u-1]=arguments[u];var i=n,o=$traceurRuntime.getOwnHashObject(t).hash;i[o]||(i[o]=Object.create(null)),i=i[o];for(var c=0;c<e.length-1;c++)o=$traceurRuntime.getOwnHashObject(e[c]).hash,i[o]||(i[o]=Object.create(null)),i=i[o];var a=e[e.length-1];return o=$traceurRuntime.getOwnHashObject(a).hash,i[o]||(i[o]=new r(t,e)),i[o]}var e={any:{name:"any"},"boolean":{name:"boolean"},number:{name:"number"},string:{name:"string"},symbol:{name:"symbol"},"void":{name:"void"}},r=function(){function t(t,e){this.type=t,this.argumentTypes=e}return $traceurRuntime.createClass(t,{},{})}(),n=Object.create(null);return $traceurRuntime.GenericType=r,$traceurRuntime.genericType=t,$traceurRuntime.type=e,{}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/runtime-modules.js",[],function(){"use strict";return System.get("traceur-runtime@0.0.91/src/runtime/relativeRequire.js"),System.get("traceur-runtime@0.0.91/src/runtime/spread.js"),System.get("traceur-runtime@0.0.91/src/runtime/destructuring.js"),System.get("traceur-runtime@0.0.91/src/runtime/classes.js"),System.get("traceur-runtime@0.0.91/src/runtime/async.js"),System.get("traceur-runtime@0.0.91/src/runtime/generators.js"),System.get("traceur-runtime@0.0.91/src/runtime/template.js"),System.get("traceur-runtime@0.0.91/src/runtime/type-assertions.js"),{}}),System.get("traceur-runtime@0.0.91/src/runtime/runtime-modules.js"),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js",[],function(){"use strict";function t(t){return t>>>0}function e(t){return t&&("object"==typeof t||"function"==typeof t)}function r(t){return"function"==typeof t}function n(t){return"number"==typeof t}function u(t){return t=+t,j(t)?0:0!==t&&d(t)?t>0?g(t):v(t):t}function i(t){var e=u(t);return 0>e?0:O(e,R)}function o(t){return e(t)?t[Symbol.iterator]:void 0}function c(t){return r(t)}function a(t,e){return{value:t,done:e}}function s(t,e,r){e in t||Object.defineProperty(t,e,r)}function l(t,e,r){s(t,e,{value:r,configurable:!0,enumerable:!1,writable:!0})}function f(t,e,r){s(t,e,{value:r,configurable:!1,enumerable:!1,writable:!1})}function h(t,e){for(var r=0;r<e.length;r+=2){var n=e[r],u=e[r+1];l(t,n,u)}}function m(t,e){for(var r=0;r<e.length;r+=2){var n=e[r],u=e[r+1];f(t,n,u)}}function p(t,e,r){r&&r.iterator&&!t[r.iterator]&&(t["@@iterator"]&&(e=t["@@iterator"]),Object.defineProperty(t,r.iterator,{value:e,configurable:!0,enumerable:!1,writable:!0}))}function b(t){_.push(t)}function y(t){_.forEach(function(e){return e(t)})}var v=Math.ceil,g=Math.floor,d=isFinite,j=isNaN,w=Math.pow,O=Math.min,S=$traceurRuntime.toObject,R=w(2,53)-1,_=[];return{get toObject(){return S},get toUint32(){return t},get isObject(){return e},get isCallable(){return r},get isNumber(){return n},get toInteger(){return u},get toLength(){return i},get checkIterable(){return o},get isConstructor(){return c},get createIteratorResultObject(){return a},get maybeDefine(){return s},get maybeDefineMethod(){return l},get maybeDefineConst(){return f},get maybeAddFunctions(){return h},get maybeAddConsts(){return m},get maybeAddIterator(){return p},get registerPolyfill(){return b},get polyfillAll(){return y}}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/Map.js",[],function(){"use strict";function t(t,e){if(i(e)){var r=a(e);return r&&t.objectIndex_[r.hash]}return"string"==typeof e?t.stringIndex_[e]:t.primitiveIndex_[e]}function e(t){t.entries_=[],t.objectIndex_=Object.create(null),t.stringIndex_=Object.create(null),t.primitiveIndex_=Object.create(null),t.deletedCount_=0}function r(t){var e=t,r=e.Map,n=e.Symbol;if(!(r&&$traceurRuntime.hasNativeSymbol()&&r.prototype[n.iterator]&&r.prototype.entries))return!0;try{return 1!==new r([[]]).size}catch(u){return!1}}function n(t){r(t)&&(t.Map=f)}var u=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js"),i=u.isObject,o=u.registerPolyfill,c=$traceurRuntime,a=c.getOwnHashObject,s=(c.hasNativeSymbol,Object.prototype.hasOwnProperty),l={},f=function(){function r(){var t,r,n=arguments[0];if(!i(this))throw new TypeError("Map called on incompatible type");if(s.call(this,"entries_"))throw new TypeError("Map can not be reentrantly initialised");if(e(this),null!==n&&void 0!==n){var u=!0,o=!1,c=void 0;try{for(var a=void 0,l=n[$traceurRuntime.toProperty(Symbol.iterator)]();!(u=(a=l.next()).done);u=!0){var f=a.value,h=(t=f[$traceurRuntime.toProperty(Symbol.iterator)](),(r=t.next()).done?void 0:r.value),m=(r=t.next()).done?void 0:r.value;this.set(h,m)}}catch(p){o=!0,c=p}finally{try{u||null==l["return"]||l["return"]()}finally{if(o)throw c}}}}return $traceurRuntime.createClass(r,{get size(){return this.entries_.length/2-this.deletedCount_},get:function(e){var r=t(this,e);return void 0!==r?this.entries_[r+1]:void 0},set:function(e,r){var n=i(e),u="string"==typeof e,o=t(this,e);if(void 0!==o)this.entries_[o+1]=r;else if(o=this.entries_.length,this.entries_[o]=e,this.entries_[o+1]=r,n){var c=a(e),s=c.hash;this.objectIndex_[s]=o}else u?this.stringIndex_[e]=o:this.primitiveIndex_[e]=o;return this},has:function(e){return void 0!==t(this,e)},"delete":function(t){var e,r,n=i(t),u="string"==typeof t;if(n){var o=a(t);o&&(e=this.objectIndex_[r=o.hash],delete this.objectIndex_[r])}else u?(e=this.stringIndex_[t],delete this.stringIndex_[t]):(e=this.primitiveIndex_[t],delete this.primitiveIndex_[t]);return void 0!==e?(this.entries_[e]=l,this.entries_[e+1]=void 0,this.deletedCount_++,!0):!1},clear:function(){e(this)},forEach:function(t){for(var e=arguments[1],r=0;r<this.entries_.length;r+=2){var n=this.entries_[r],u=this.entries_[r+1];n!==l&&t.call(e,u,n,this)}},entries:$traceurRuntime.initGeneratorFunction(function n(){var t,e,r;return $traceurRuntime.createGeneratorInstance(function(n){for(;;)switch(n.state){case 0:t=0,n.state=12;break;case 12:n.state=t<this.entries_.length?8:-2;break;case 4:t+=2,n.state=12;break;case 8:e=this.entries_[t],r=this.entries_[t+1],n.state=9;break;case 9:n.state=e===l?4:6;break;case 6:return n.state=2,[e,r];case 2:n.maybeThrow(),n.state=4;break;default:return n.end()}},n,this)}),keys:$traceurRuntime.initGeneratorFunction(function u(){var t,e,r;return $traceurRuntime.createGeneratorInstance(function(n){for(;;)switch(n.state){case 0:t=0,n.state=12;break;case 12:n.state=t<this.entries_.length?8:-2;break;case 4:t+=2,n.state=12;break;case 8:e=this.entries_[t],r=this.entries_[t+1],n.state=9;break;case 9:n.state=e===l?4:6;break;case 6:return n.state=2,e;case 2:n.maybeThrow(),n.state=4;break;default:return n.end()}},u,this)}),values:$traceurRuntime.initGeneratorFunction(function o(){var t,e,r;return $traceurRuntime.createGeneratorInstance(function(n){for(;;)switch(n.state){case 0:t=0,n.state=12;break;case 12:n.state=t<this.entries_.length?8:-2;break;case 4:t+=2,n.state=12;break;case 8:e=this.entries_[t],r=this.entries_[t+1],n.state=9;break;case 9:n.state=e===l?4:6;break;case 6:return n.state=2,r;case 2:n.maybeThrow(),n.state=4;break;default:return n.end()}},o,this)})},{})}();return Object.defineProperty(f.prototype,Symbol.iterator,{configurable:!0,writable:!0,value:f.prototype.entries}),o(n),{get Map(){return f},get polyfillMap(){return n}}}),System.get("traceur-runtime@0.0.91/src/runtime/polyfills/Map.js"),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/Set.js",[],function(){"use strict";function t(t){t.map_=new o}function e(t){var e=t,r=e.Set,n=e.Symbol;if(!(r&&$traceurRuntime.hasNativeSymbol()&&r.prototype[n.iterator]&&r.prototype.values))return!0;try{return 1!==new r([1]).size}catch(u){return!1}}function r(t){e(t)&&(t.Set=a)}var n=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js"),u=n.isObject,i=n.registerPolyfill,o=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/Map.js").Map,c=($traceurRuntime.getOwnHashObject,Object.prototype.hasOwnProperty),a=function(){function e(){var e=arguments[0];if(!u(this))throw new TypeError("Set called on incompatible type");if(c.call(this,"map_"))throw new TypeError("Set can not be reentrantly initialised");if(t(this),null!==e&&void 0!==e){var r=!0,n=!1,i=void 0;try{for(var o=void 0,a=e[$traceurRuntime.toProperty(Symbol.iterator)]();!(r=(o=a.next()).done);r=!0){var s=o.value;this.add(s)}}catch(l){n=!0,i=l}finally{try{r||null==a["return"]||a["return"]()}finally{if(n)throw i}}}}return $traceurRuntime.createClass(e,{get size(){return this.map_.size},has:function(t){return this.map_.has(t)},add:function(t){return this.map_.set(t,t),this},"delete":function(t){return this.map_["delete"](t)},clear:function(){return this.map_.clear()},forEach:function(t){var e=arguments[1],r=this;return this.map_.forEach(function(n,u){t.call(e,u,u,r)})},values:$traceurRuntime.initGeneratorFunction(function r(){var t,e;return $traceurRuntime.createGeneratorInstance(function(r){for(;;)switch(r.state){case 0:t=r.wrapYieldStar(this.map_.keys()[Symbol.iterator]()),r.sent=void 0,r.action="next",r.state=12;break;case 12:e=t[r.action](r.sentIgnoreThrow),r.state=9;break;case 9:r.state=e.done?3:2;break;case 3:r.sent=e.value,r.state=-2;break;case 2:return r.state=12,e.value;default:return r.end()}},r,this)}),entries:$traceurRuntime.initGeneratorFunction(function n(){var t,e;return $traceurRuntime.createGeneratorInstance(function(r){for(;;)switch(r.state){case 0:t=r.wrapYieldStar(this.map_.entries()[Symbol.iterator]()),r.sent=void 0,r.action="next",r.state=12;break;case 12:e=t[r.action](r.sentIgnoreThrow),r.state=9;break;case 9:r.state=e.done?3:2;break;case 3:r.sent=e.value,r.state=-2;break;case 2:return r.state=12,e.value;default:return r.end()}},n,this)})},{})}();return Object.defineProperty(a.prototype,Symbol.iterator,{configurable:!0,writable:!0,value:a.prototype.values}),Object.defineProperty(a.prototype,"keys",{configurable:!0,writable:!0,value:a.prototype.values}),i(r),{get Set(){return a},get polyfillSet(){return r}}}),System.get("traceur-runtime@0.0.91/src/runtime/polyfills/Set.js"),System.registerModule("traceur-runtime@0.0.91/node_modules/rsvp/lib/rsvp/asap.js",[],function(){"use strict";function t(t,e){v[l]=t,v[l+1]=e,l+=2,2===l&&s()}function e(){var t=process.nextTick,e=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);return Array.isArray(e)&&"0"===e[1]&&"10"===e[2]&&(t=setImmediate),function(){t(o)}}function r(){return function(){a(o)}}function n(){var t=0,e=new p(o),r=document.createTextNode("");return e.observe(r,{characterData:!0}),function(){r.data=t=++t%2}}function u(){var t=new MessageChannel;return t.port1.onmessage=o,function(){t.port2.postMessage(0)}}function i(){return function(){setTimeout(o,1)}}function o(){for(var t=0;l>t;t+=2){var e=v[t],r=v[t+1];e(r),v[t]=void 0,v[t+1]=void 0}l=0}function c(){try{var t=require,e=t("vertx");return a=e.runOnLoop||e.runOnContext,r()}catch(n){return i()}}var a,s,l=0,f=({}.toString,t),h="undefined"!=typeof window?window:void 0,m=h||{},p=m.MutationObserver||m.WebKitMutationObserver,b="undefined"!=typeof process&&"[object process]"==={}.toString.call(process),y="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,v=new Array(1e3);return s=b?e():p?n():y?u():void 0===h&&"function"==typeof require?c():i(),{get default(){return f}}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/Promise.js",[],function(){"use strict";function t(t){return t&&"object"==typeof t&&void 0!==t.status_}function e(t){return t}function r(t){throw t}function n(t){var n=void 0!==arguments[1]?arguments[1]:e,i=void 0!==arguments[2]?arguments[2]:r,o=u(t.constructor);switch(t.status_){case void 0:throw TypeError;case 0:t.onResolve_.push(n,o),t.onReject_.push(i,o);break;case 1:l(t.value_,[n,o]);break;case-1:l(t.value_,[i,o])}return o.promise}function u(t){if(this===d){var e=o(new d(v));return{promise:e,resolve:function(t){c(e,t)},reject:function(t){a(e,t)}}}var r={};return r.promise=new t(function(t,e){r.resolve=t,r.reject=e}),r}function i(t,e,r,n,u){return t.status_=e,t.value_=r,t.onResolve_=n,t.onReject_=u,t}function o(t){return i(t,0,void 0,[],[])}function c(t,e){s(t,1,e,t.onResolve_)}function a(t,e){s(t,-1,e,t.onReject_)}function s(t,e,r,n){0===t.status_&&(l(r,n),i(t,e,r))}function l(t,e){b(function(){for(var r=0;r<e.length;r+=2)f(t,e[r],e[r+1])})}function f(e,r,u){
try{var i=r(e);if(i===u.promise)throw new TypeError;t(i)?n(i,u.resolve,u.reject):u.resolve(i)}catch(o){try{u.reject(o)}catch(o){}}}function h(t){return t&&("object"==typeof t||"function"==typeof t)}function m(e,r){if(!t(r)&&h(r)){var n;try{n=r.then}catch(i){var o=j.call(e,i);return r[w]=o,o}if("function"==typeof n){var c=r[w];if(c)return c;var a=u(e);r[w]=a.promise;try{n.call(r,a.resolve,a.reject)}catch(i){a.reject(i)}return a.promise}}return r}function p(t){t.Promise||(t.Promise=g)}var b=System.get("traceur-runtime@0.0.91/node_modules/rsvp/lib/rsvp/asap.js")["default"],y=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js").registerPolyfill,v={},g=function(){function s(t){if(t!==v){if("function"!=typeof t)throw new TypeError;var e=o(this);try{t(function(t){c(e,t)},function(t){a(e,t)})}catch(r){a(e,r)}}}return $traceurRuntime.createClass(s,{"catch":function(t){return this.then(void 0,t)},then:function(u,i){"function"!=typeof u&&(u=e),"function"!=typeof i&&(i=r);var o=this,c=this.constructor;return n(this,function(e){return e=m(c,e),e===o?i(new TypeError):t(e)?e.then(u,i):u(e)},i)}},{resolve:function(e){return this===d?t(e)?e:i(new d(v),1,e):new this(function(t,r){t(e)})},reject:function(t){return this===d?i(new d(v),-1,t):new this(function(e,r){r(t)})},all:function(t){var e=u(this),r=[];try{var n=function(t){return function(n){r[t]=n,0===--i&&e.resolve(r)}},i=0,o=0,c=!0,a=!1,s=void 0;try{for(var l=void 0,f=t[$traceurRuntime.toProperty(Symbol.iterator)]();!(c=(l=f.next()).done);c=!0){var h=l.value,m=n(o);this.resolve(h).then(m,function(t){e.reject(t)}),++o,++i}}catch(p){a=!0,s=p}finally{try{c||null==f["return"]||f["return"]()}finally{if(a)throw s}}0===i&&e.resolve(r)}catch(b){e.reject(b)}return e.promise},race:function(t){var e=u(this);try{for(var r=0;r<t.length;r++)this.resolve(t[r]).then(function(t){e.resolve(t)},function(t){e.reject(t)})}catch(n){e.reject(n)}return e.promise}})}(),d=g,j=d.reject,w="@@thenable";return y(p),{get Promise(){return g},get polyfillPromise(){return p}}}),System.get("traceur-runtime@0.0.91/src/runtime/polyfills/Promise.js"),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/StringIterator.js",[],function(){"use strict";function t(t){var e=String(t),r=Object.create(a.prototype);return r[u(o)]=e,r[u(c)]=0,r}var e=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js"),r=e.createIteratorResultObject,n=e.isObject,u=$traceurRuntime.toProperty,i=Object.prototype.hasOwnProperty,o=Symbol("iteratedString"),c=Symbol("stringIteratorNextIndex"),a=function(){function t(){}var e;return $traceurRuntime.createClass(t,(e={},Object.defineProperty(e,"next",{value:function(){var t=this;if(!n(t)||!i.call(t,o))throw new TypeError("this must be a StringIterator object");var e=t[u(o)];if(void 0===e)return r(void 0,!0);var a=t[u(c)],s=e.length;if(a>=s)return t[u(o)]=void 0,r(void 0,!0);var l,f=e.charCodeAt(a);if(55296>f||f>56319||a+1===s)l=String.fromCharCode(f);else{var h=e.charCodeAt(a+1);l=56320>h||h>57343?String.fromCharCode(f):String.fromCharCode(f)+String.fromCharCode(h)}return t[u(c)]=a+l.length,r(l,!1)},configurable:!0,enumerable:!0,writable:!0}),Object.defineProperty(e,Symbol.iterator,{value:function(){return this},configurable:!0,enumerable:!0,writable:!0}),e),{})}();return{get createStringIterator(){return t}}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/String.js",[],function(){"use strict";function t(t){var e=String(this);if(null==this||"[object RegExp]"==p.call(t))throw TypeError();var r=e.length,n=String(t),u=(n.length,arguments.length>1?arguments[1]:void 0),i=u?Number(u):0;isNaN(i)&&(i=0);var o=Math.min(Math.max(i,0),r);return b.call(e,n,i)==o}function e(t){var e=String(this);if(null==this||"[object RegExp]"==p.call(t))throw TypeError();var r=e.length,n=String(t),u=n.length,i=r;if(arguments.length>1){var o=arguments[1];void 0!==o&&(i=o?Number(o):0,isNaN(i)&&(i=0))}var c=Math.min(Math.max(i,0),r),a=c-u;return 0>a?!1:y.call(e,n,a)==a}function r(t){if(null==this)throw TypeError();var e=String(this);if(t&&"[object RegExp]"==p.call(t))throw TypeError();var r=e.length,n=String(t),u=n.length,i=arguments.length>1?arguments[1]:void 0,o=i?Number(i):0;o!=o&&(o=0);var c=Math.min(Math.max(o,0),r);return u+c>r?!1:-1!=b.call(e,n,o)}function n(t){if(null==this)throw TypeError();var e=String(this),r=t?Number(t):0;if(isNaN(r)&&(r=0),0>r||r==1/0)throw RangeError();if(0==r)return"";for(var n="";r--;)n+=e;return n}function u(t){if(null==this)throw TypeError();var e=String(this),r=e.length,n=t?Number(t):0;if(isNaN(n)&&(n=0),0>n||n>=r)return void 0;var u,i=e.charCodeAt(n);return i>=55296&&56319>=i&&r>n+1&&(u=e.charCodeAt(n+1),u>=56320&&57343>=u)?1024*(i-55296)+u-56320+65536:i}function i(t){var e=t.raw,r=e.length>>>0;if(0===r)return"";for(var n="",u=0;;){if(n+=e[u],u+1===r)return n;n+=arguments[++u]}}function o(t){var e,r,n=[],u=Math.floor,i=-1,o=arguments.length;if(!o)return"";for(;++i<o;){var c=Number(arguments[i]);if(!isFinite(c)||0>c||c>1114111||u(c)!=c)throw RangeError("Invalid code point: "+c);65535>=c?n.push(c):(c-=65536,e=(c>>10)+55296,r=c%1024+56320,n.push(e,r))}return String.fromCharCode.apply(null,n)}function c(){var t=$traceurRuntime.checkObjectCoercible(this),e=String(t);return s(e)}function a(a){var s=a.String;f(s.prototype,["codePointAt",u,"endsWith",e,"includes",r,"repeat",n,"startsWith",t]),f(s,["fromCodePoint",o,"raw",i]),h(s.prototype,c,Symbol)}var s=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/StringIterator.js").createStringIterator,l=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js"),f=l.maybeAddFunctions,h=l.maybeAddIterator,m=l.registerPolyfill,p=Object.prototype.toString,b=String.prototype.indexOf,y=String.prototype.lastIndexOf;return m(a),{get startsWith(){return t},get endsWith(){return e},get includes(){return r},get repeat(){return n},get codePointAt(){return u},get raw(){return i},get fromCodePoint(){return o},get stringPrototypeIterator(){return c},get polyfillString(){return a}}}),System.get("traceur-runtime@0.0.91/src/runtime/polyfills/String.js"),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/ArrayIterator.js",[],function(){"use strict";function t(t,e){var r=i(t),n=new f;return n.iteratorObject_=r,n.arrayIteratorNextIndex_=0,n.arrayIterationKind_=e,n}function e(){return t(this,l)}function r(){return t(this,a)}function n(){return t(this,s)}var u=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js"),i=u.toObject,o=u.toUint32,c=u.createIteratorResultObject,a=1,s=2,l=3,f=function(){function t(){}var e;return $traceurRuntime.createClass(t,(e={},Object.defineProperty(e,"next",{value:function(){var t=i(this),e=t.iteratorObject_;if(!e)throw new TypeError("Object is not an ArrayIterator");var r=t.arrayIteratorNextIndex_,n=t.arrayIterationKind_,u=o(e.length);return r>=u?(t.arrayIteratorNextIndex_=1/0,c(void 0,!0)):(t.arrayIteratorNextIndex_=r+1,n==s?c(e[r],!1):n==l?c([r,e[r]],!1):c(r,!1))},configurable:!0,enumerable:!0,writable:!0}),Object.defineProperty(e,Symbol.iterator,{value:function(){return this},configurable:!0,enumerable:!0,writable:!0}),e),{})}();return{get entries(){return e},get keys(){return r},get values(){return n}}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/Array.js",[],function(){"use strict";function t(t){var e,r,n=arguments[1],u=arguments[2],i=this,o=j(t),c=void 0!==n,a=0;if(c&&!m(n))throw TypeError();if(h(o)){e=p(i)?new i:[];var s=!0,l=!1,f=void 0;try{for(var b=void 0,y=o[$traceurRuntime.toProperty(Symbol.iterator)]();!(s=(b=y.next()).done);s=!0){var v=b.value;c?e[a]=n.call(u,v,a):e[a]=v,a++}}catch(g){l=!0,f=g}finally{try{s||null==y["return"]||y["return"]()}finally{if(l)throw f}}return e.length=a,e}for(r=d(o.length),e=p(i)?new i(r):new Array(r);r>a;a++)c?e[a]="undefined"==typeof u?n(o[a],a):n.call(u,o[a],a):e[a]=o[a];return e.length=r,e}function e(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var r=this,n=t.length,u=p(r)?new r(n):new Array(n),i=0;n>i;i++)u[i]=t[i];return u.length=n,u}function r(t){var e=void 0!==arguments[1]?arguments[1]:0,r=arguments[2],n=j(this),u=d(n.length),i=g(e),o=void 0!==r?g(r):u;for(i=0>i?Math.max(u+i,0):Math.min(i,u),o=0>o?Math.max(u+o,0):Math.min(o,u);o>i;)n[i]=t,i++;return n}function n(t){var e=arguments[1];return i(this,t,e)}function u(t){var e=arguments[1];return i(this,t,e,!0)}function i(t,e){var r=arguments[2],n=void 0!==arguments[3]?arguments[3]:!1,u=j(t),i=d(u.length);if(!m(e))throw TypeError();for(var o=0;i>o;o++){var c=u[o];if(e.call(r,c,o,u))return n?o:c}return n?-1:void 0}function o(i){var o=i,c=o.Array,f=o.Object,h=o.Symbol,m=l;h&&h.iterator&&c.prototype[h.iterator]&&(m=c.prototype[h.iterator]),b(c.prototype,["entries",a,"keys",s,"values",m,"fill",r,"find",n,"findIndex",u]),b(c,["from",t,"of",e]),y(c.prototype,m,h),y(f.getPrototypeOf([].values()),function(){return this},h)}var c=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/ArrayIterator.js"),a=c.entries,s=c.keys,l=c.values,f=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js"),h=f.checkIterable,m=f.isCallable,p=f.isConstructor,b=f.maybeAddFunctions,y=f.maybeAddIterator,v=f.registerPolyfill,g=f.toInteger,d=f.toLength,j=f.toObject;return v(o),{get from(){return t},get of(){return e},get fill(){return r},get find(){return n},get findIndex(){return u},get polyfillArray(){return o}}}),System.get("traceur-runtime@0.0.91/src/runtime/polyfills/Array.js"),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/Object.js",[],function(){"use strict";function t(t,e){return t===e?0!==t||1/t===1/e:t!==t&&e!==e}function e(t){for(var e=1;e<arguments.length;e++){var r=arguments[e],n=null==r?[]:h(r),u=void 0,i=n.length;for(u=0;i>u;u++){var o=n[u];f(o)||(t[o]=r[o])}}return t}function r(t,e){var r,n,u=l(e),i=u.length;for(r=0;i>r;r++){var o=u[r];f(o)||(n=s(e,u[r]),a(t,u[r],n))}return t}function n(n){var u=n.Object;i(u,["assign",e,"is",t,"mixin",r])}var u=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js"),i=u.maybeAddFunctions,o=u.registerPolyfill,c=$traceurRuntime,a=c.defineProperty,s=c.getOwnPropertyDescriptor,l=c.getOwnPropertyNames,f=c.isPrivateName,h=c.keys;return o(n),{get is(){return t},get assign(){return e},get mixin(){return r},get polyfillObject(){return n}}}),System.get("traceur-runtime@0.0.91/src/runtime/polyfills/Object.js"),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/Number.js",[],function(){"use strict";function t(t){return o(t)&&h(t)}function e(e){return t(e)&&l(e)===e}function r(t){return o(t)&&m(t)}function n(e){if(t(e)){var r=l(e);if(r===e)return f(r)<=p}return!1}function u(u){var i=u.Number;c(i,["MAX_SAFE_INTEGER",p,"MIN_SAFE_INTEGER",b,"EPSILON",y]),a(i,["isFinite",t,"isInteger",e,"isNaN",r,"isSafeInteger",n])}var i=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js"),o=i.isNumber,c=i.maybeAddConsts,a=i.maybeAddFunctions,s=i.registerPolyfill,l=i.toInteger,f=Math.abs,h=isFinite,m=isNaN,p=Math.pow(2,53)-1,b=-Math.pow(2,53)+1,y=Math.pow(2,-52);return s(u),{get MAX_SAFE_INTEGER(){return p},get MIN_SAFE_INTEGER(){return b},get EPSILON(){return y},get isFinite(){return t},get isInteger(){return e},get isNaN(){return r},get isSafeInteger(){return n},get polyfillNumber(){return u}}}),System.get("traceur-runtime@0.0.91/src/runtime/polyfills/Number.js"),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/fround.js",[],function(){"use strict";function t(t,e,r){function n(t){var e=l(t),r=t-e;return.5>r?e:r>.5?e+1:e%2?e+1:e}var u,i,o,c,p,b,y,v=(1<<e-1)-1;for(t!==t?(i=(1<<e)-1,o=m(2,r-1),u=0):t===1/0||t===-(1/0)?(i=(1<<e)-1,o=0,u=0>t?1:0):0===t?(i=0,o=0,u=1/t===-(1/0)?1:0):(u=0>t,t=s(t),t>=m(2,1-v)?(i=h(l(f(t)/a),1023),o=n(t/m(2,i)*m(2,r)),o/m(2,r)>=2&&(i+=1,o=1),i>v?(i=(1<<e)-1,o=0):(i+=v,o-=m(2,r))):(i=0,o=n(t/m(2,1-v-r)))),p=[],c=r;c;c-=1)p.push(o%2?1:0),o=l(o/2);for(c=e;c;c-=1)p.push(i%2?1:0),i=l(i/2);for(p.push(u?1:0),p.reverse(),b=p.join(""),y=[];b.length;)y.push(parseInt(b.substring(0,8),2)),b=b.substring(8);return y}function e(t,e,r){var n,u,i,o,c,a,s,l,f=[];for(n=t.length;n;n-=1)for(i=t[n-1],u=8;u;u-=1)f.push(i%2?1:0),i>>=1;return f.reverse(),o=f.join(""),c=(1<<e-1)-1,a=parseInt(o.substring(0,1),2)?-1:1,s=parseInt(o.substring(1,1+e),2),l=parseInt(o.substring(1+e),2),s===(1<<e)-1?0!==l?NaN:a*(1/0):s>0?a*m(2,s-c)*(1+l/m(2,r)):0!==l?a*m(2,-(c-1))*(l/m(2,r)):0>a?-0:0}function r(t){return e(t,8,23)}function n(e){return t(e,8,23)}function u(t){return 0===t||!i(t)||o(t)?t:r(n(Number(t)))}var i=isFinite,o=isNaN,c=Math,a=c.LN2,s=c.abs,l=c.floor,f=c.log,h=c.min,m=c.pow;return{get fround(){return u}}}),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/Math.js",[],function(){"use strict";function t(t){if(t=S(+t),0==t)return 32;var e=0;return 0===(4294901760&t)&&(t<<=16,e+=16),0===(4278190080&t)&&(t<<=8,e+=8),0===(4026531840&t)&&(t<<=4,e+=4),0===(3221225472&t)&&(t<<=2,e+=2),0===(2147483648&t)&&(t<<=1,e+=1),e}function e(t,e){t=S(+t),e=S(+e);var r=t>>>16&65535,n=65535&t,u=e>>>16&65535,i=65535&e;return n*i+(r*i+n*u<<16>>>0)|0}function r(t){return t=+t,t>0?1:0>t?-1:t}function n(t){return.4342944819032518*I(t)}function u(t){return 1.4426950408889634*I(t)}function i(t){if(t=+t,-1>t||_(t))return NaN;if(0===t||t===1/0)return t;if(-1===t)return-(1/0);var e=0,r=50;if(0>t||t>1)return I(1+t);for(var n=1;r>n;n++)n%2===0?e-=N(t,n)/n:e+=N(t,n)/n;return e}function o(t){return t=+t,t===-(1/0)?-1:R(t)&&0!==t?x(t)-1:t}function c(t){return t=+t,0===t?1:_(t)?NaN:R(t)?(0>t&&(t=-t),t>21?x(t)/2:(x(t)+x(-t))/2):1/0}function a(t){return t=+t,R(t)&&0!==t?(x(t)-x(-t))/2:t}function s(t){if(t=+t,0===t)return t;if(!R(t))return r(t);var e=x(t),n=x(-t);return(e-n)/(e+n)}function l(t){return t=+t,1>t?NaN:R(t)?I(t+k(t+1)*k(t-1)):t}function f(t){return t=+t,0!==t&&R(t)?t>0?I(t+k(t*t+1)):-I(-t+k(t*t+1)):t}function h(t){return t=+t,-1===t?-(1/0):1===t?1/0:0===t?t:_(t)||-1>t||t>1?NaN:.5*I((1+t)/(1-t))}function m(t,e){for(var r=arguments.length,n=new Array(r),u=0,i=0;r>i;i++){var o=arguments[i];if(o=+o,o===1/0||o===-(1/0))return 1/0;o=P(o),o>u&&(u=o),n[i]=o}0===u&&(u=1);for(var c=0,a=0,i=0;r>i;i++){var o=n[i]/u,s=o*o-a,l=c+s;a=l-c-s,c=l}return k(c)*u}function p(t){return t=+t,t>0?M(t):0>t?E(t):t}function b(t){if(t=+t,0===t)return t;var e=0>t;e&&(t=-t);var r=N(t,1/3);return e?-r:r}function y(y){var g=y.Math;w(g,["acosh",l,"asinh",f,"atanh",h,"cbrt",b,"clz32",t,"cosh",c,"expm1",o,"fround",v,"hypot",m,"imul",e,"log10",n,"log1p",i,"log2",u,"sign",r,"sinh",a,"tanh",s,"trunc",p])}var v,g,d=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/fround.js").fround,j=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js"),w=j.maybeAddFunctions,O=j.registerPolyfill,S=j.toUint32,R=isFinite,_=isNaN,$=Math,P=$.abs,E=$.ceil,x=$.exp,M=$.floor,I=$.log,N=$.pow,k=$.sqrt;return"function"==typeof Float32Array?(g=new Float32Array(1),v=function(t){return g[0]=Number(t),g[0]}):v=d,O(y),{get clz32(){return t},get imul(){return e},get sign(){return r},get log10(){return n},get log2(){return u},get log1p(){return i},get expm1(){return o},get cosh(){return c},get sinh(){return a},get tanh(){return s},get acosh(){return l},get asinh(){return f},get atanh(){return h},get hypot(){return m},get trunc(){return p},get fround(){return v},get cbrt(){return b},get polyfillMath(){return y}}}),System.get("traceur-runtime@0.0.91/src/runtime/polyfills/Math.js"),System.registerModule("traceur-runtime@0.0.91/src/runtime/polyfills/polyfills.js",[],function(){"use strict";var t=System.get("traceur-runtime@0.0.91/src/runtime/polyfills/utils.js").polyfillAll;t(Reflect.global);var e=$traceurRuntime.setupGlobals;return $traceurRuntime.setupGlobals=function(r){e(r),t(r)},{}}),System.get("traceur-runtime@0.0.91/src/runtime/polyfills/polyfills.js"),this.System=this._System,delete this._System;
/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		modules[moduleName] = module && module.exports ? module.exports : result;
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*can-connect-feathers@1.1.5#utils*/
define('can-connect-feathers/utils', [], function () {
    'use strict';
    function stripSlashes(location) {
        return location.replace(/^(\/*)|(\/*)$/g, '');
    }
    function addAliases(service) {
        service.find = service.getListData;
        service.get = service.getData;
        service.create = service.createData;
        service.update = service.updateData;
        service.patch = service.patchData;
        service.remove = service.destroyData;
        return service;
    }
    function isEmptyObject(obj) {
        for (var prop in obj) {
            return false;
        }
        return true;
    }
    return {
        get stripSlashes() {
            return stripSlashes;
        },
        get addAliases() {
            return addAliases;
        },
        get isEmptyObject() {
            return isEmptyObject;
        },
        __esModule: true
    };
});
/*can-connect-feathers@1.1.5#can-connect-feathers*/
define('can-connect-feathers', [
    'steal-socket.io',
    'jquery',
    'cookie-storage',
    'jwt-decode',
    'can-connect-feathers/utils',
    'can-connect-feathers/utils',
    'can-connect-feathers/utils',
    'feathers-errors',
    'qs'
], function ($__0, $__2, $__4, $__6, $__8, $__10, $__12, $__14, $__16) {
    'use strict';
    if (!$__0 || !$__0.__esModule)
        $__0 = { default: $__0 };
    if (!$__2 || !$__2.__esModule)
        $__2 = { default: $__2 };
    if (!$__4 || !$__4.__esModule)
        $__4 = { default: $__4 };
    if (!$__6 || !$__6.__esModule)
        $__6 = { default: $__6 };
    if (!$__8 || !$__8.__esModule)
        $__8 = { default: $__8 };
    if (!$__10 || !$__10.__esModule)
        $__10 = { default: $__10 };
    if (!$__12 || !$__12.__esModule)
        $__12 = { default: $__12 };
    if (!$__14 || !$__14.__esModule)
        $__14 = { default: $__14 };
    if (!$__16 || !$__16.__esModule)
        $__16 = { default: $__16 };
    var io = $__0.default;
    var $ = $__2.default;
    var CookieStorage = $__4.CookieStorage;
    var decode = $__6.default;
    var stripSlashes = $__8.stripSlashes;
    var addAliases = $__10.addAliases;
    var isEmptyObject = $__12.isEmptyObject;
    var errors = $__14.default;
    var query = $__16.default;
    var cookieStorage = new CookieStorage();
    var Feathers = function () {
        function Feathers(config) {
            var defaults = {
                url: '',
                storeToken: true,
                storage: cookieStorage,
                tokenLocation: 'feathers-jwt',
                idProp: 'id',
                tokenEndpoint: 'auth/token',
                localEndpoint: 'auth/local',
                ssr: true,
                allowSocketIO: true,
                socketOptions: {}
            };
            $.extend(this, defaults, config);
            if (window.doneSsr) {
                this.allowSocketIO = false;
            }
            if (this.allowSocketIO) {
                this.connectSocket();
            } else {
                var noOp = function () {
                };
                this.io = {
                    on: noOp,
                    once: noOp,
                    off: noOp
                };
            }
        }
        return $traceurRuntime.createClass(Feathers, {
            connectSocket: function () {
                var $__21 = this;
                this.ioConnected = new Promise(function (resolve, reject) {
                    $__21.io = io($__21.url, $__21.socketOptions);
                    $__21.io.once('connect', resolve);
                    $__21.io.once('error', reject);
                });
            },
            makeUrl: function (location, params, id, type) {
                location = stripSlashes(location);
                params = params || {};
                var url = this.url + '/' + location;
                if (id !== null && id !== undefined) {
                    url += '/' + id;
                } else if (params[this.idProp]) {
                    url += '/' + params[this.idProp];
                    delete params[this.idProp];
                }
                if (Object.keys(params).length !== 0 && type === 'GET') {
                    url += '?' + query.stringify(params);
                }
                return url;
            },
            makeXhr: function (id, params, location) {
                var type = arguments[3] !== void 0 ? arguments[3] : 'GET';
                var url = this.makeUrl(location, params, id, type);
                var ajaxConfig = {
                    url: url,
                    type: type,
                    dataType: 'json'
                };
                if (type !== 'GET') {
                    ajaxConfig.contentType = 'application/json';
                }
                if (type !== 'DELETE' && type !== 'GET' && !isEmptyObject(params)) {
                    $.extend(ajaxConfig, { data: JSON.stringify(params) });
                }
                var token = this.getToken();
                if (token) {
                    $.extend(ajaxConfig, { headers: { 'Authorization': 'Bearer ' + token } });
                }
                return new Promise(function (resolve, reject) {
                    $.ajax(ajaxConfig).then(resolve).fail(function (err) {
                        if (!err.responseText) {
                            return reject(err);
                        }
                        try {
                            reject(errors.convert(JSON.parse(err.responseText)));
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            },
            rest: function (location, idProp) {
                var self = this;
                idProp = idProp || this.idProp;
                var service = {
                    getListData: function (params) {
                        return self.makeXhr(null, params, location);
                    },
                    getData: function (params) {
                        var id = null;
                        if (typeof params === 'string' || typeof params === 'number') {
                            id = params;
                            params = {};
                        }
                        return self.makeXhr(id, params, location);
                    },
                    createData: function (data) {
                        return self.makeXhr(null, data, location, 'POST');
                    },
                    updateData: function (data) {
                        return self.makeXhr(data[idProp], data, location, 'PUT');
                    },
                    patchData: function (data) {
                        return self.makeXhr(data[idProp], data, location, 'PATCH');
                    },
                    destroyData: function (data) {
                        return self.makeXhr(data[idProp], data, location, 'DELETE');
                    }
                };
                service = addAliases(service);
                return service;
            },
            socketio: function (location, idProp) {
                if (this.allowSocketIO === false) {
                    return this.rest(location, idProp);
                }
                var self = this;
                idProp = idProp || this.idProp;
                var service = {
                    getListData: function (params) {
                        return new Promise(function (resolve, reject) {
                            self.ioConnected.then(function () {
                                self.io.emit(location + '::find', params, function (error, data) {
                                    if (error) {
                                        return reject(error);
                                    }
                                    return resolve(data);
                                });
                            });
                        });
                    },
                    getData: function (params) {
                        return new Promise(function (resolve, reject) {
                            self.ioConnected.then(function () {
                                var id = null;
                                if (typeof params === 'string' || typeof params === 'number') {
                                    id = params;
                                    params = {};
                                }
                                self.io.emit(location + '::get', id, params, function (error, data) {
                                    if (error) {
                                        return reject(error);
                                    }
                                    return resolve(data);
                                });
                            });
                        });
                    },
                    createData: function (data) {
                        return new Promise(function (resolve, reject) {
                            self.ioConnected.then(function () {
                                self.io.emit(location + '::create', data, function (error, data) {
                                    if (error) {
                                        return reject(error);
                                    }
                                    return resolve(data);
                                });
                            });
                        });
                    },
                    updateData: function (data) {
                        return new Promise(function (resolve, reject) {
                            self.ioConnected.then(function () {
                                self.io.emit(location + '::update', data[idProp], data, function (error, data) {
                                    if (error) {
                                        return reject(error);
                                    }
                                    return resolve(data);
                                });
                            });
                        });
                    },
                    patchData: function (data) {
                        return new Promise(function (resolve, reject) {
                            self.ioConnected.then(function () {
                                self.io.emit(location + '::patch', data[idProp], data, function (error, data) {
                                    if (error) {
                                        return reject(error);
                                    }
                                    return resolve(data);
                                });
                            });
                        });
                    },
                    destroyData: function (data) {
                        return new Promise(function (resolve, reject) {
                            self.ioConnected.then(function () {
                                self.io.emit(location + '::remove', data[idProp], data, function (error, data) {
                                    if (error) {
                                        return reject(error);
                                    }
                                    return resolve(data);
                                });
                            });
                        });
                    }
                };
                service = addAliases(service);
                return service;
            },
            getToken: function () {
                var token;
                if (this.storage) {
                    token = this.storage.getItem(this.tokenLocation);
                    if (!token) {
                        token = cookieStorage.getItem(this.tokenLocation);
                    }
                }
                return token;
            },
            getSession: function () {
                var session, token;
                if (window.localStorage) {
                    token = this.getToken();
                    if (token) {
                        var tokenData = decode(token);
                        if (tokenData.exp * 1000 > new Date().getTime()) {
                            session = $.extend({}, tokenData);
                            delete session.exp;
                            delete session.iat;
                            delete session.iss;
                        }
                    }
                }
                return session;
            },
            prepareAuthParams: function (params) {
                var data = { type: 'token' };
                $.extend(data, params);
                var token = this.getToken();
                if (token && data.type === 'token') {
                    data.token = token;
                }
                return data;
            },
            authenticate: function (params) {
                var $__21 = this;
                var data = this.prepareAuthParams(params), location = data.type === 'token' ? this.tokenEndpoint : this.localEndpoint, authPromise;
                if (this.allowSocketIO) {
                    authPromise = this.authenticateSocket(params);
                } else {
                    authPromise = this.makeXhr(null, data, location, 'POST');
                }
                return authPromise.then(function (data) {
                    return $__21.persistToken(data);
                }).then(function (data) {
                    return $__21.makeSSRCookie(data);
                });
            },
            authenticateSocket: function (params) {
                var $__21 = this;
                var data = this.prepareAuthParams(params);
                return new Promise(function (resolve, reject) {
                    var sendSocketAuthRequest = function (data) {
                        var $__22 = this;
                        this.io.once('authenticated', function (res) {
                            if (!$__22._reconnectsHandled) {
                                $__22.handleSocketReconnects(data);
                                $__22._reconnectsHandled = true;
                            }
                            resolve(res);
                        });
                        this.io.once('unauthorized', function (res) {
                            reject(res);
                        });
                        this.io.emit('authenticate', data);
                    };
                    if ($__21.io.connected) {
                        sendSocketAuthRequest.call($__21, data);
                    } else {
                        $__21.io.once('connect', function () {
                            return sendSocketAuthRequest.call($__21, data);
                        });
                    }
                });
            },
            handleSocketReconnects: function (data) {
                var $__21 = this;
                this.io.on('reconnect', function () {
                    $__21.authenticateSocket(data).then(function (data) {
                        return $__21.persistToken(data);
                    }).then(function (data) {
                        return $__21.makeSSRCookie(data);
                    });
                });
            },
            persistToken: function (data) {
                if (this.storeToken && this.storage) {
                    this.storage.setItem(this.tokenLocation, data.token);
                }
                return data;
            },
            makeSSRCookie: function (data) {
                if (this.ssr) {
                    var tokenExp = decode(data.token).exp, options = { expires: new Date(tokenExp * 1000) };
                    cookieStorage.setItem(this.tokenLocation, data.token, options);
                }
                return data;
            },
            logout: function (data) {
                var $__21 = this;
                return new Promise(function (resolve) {
                    $__21.storage.removeItem($__21.tokenLocation);
                    cookieStorage.removeItem($__21.tokenLocation);
                    if ($__21.allowSocketIO) {
                        $__21.io.disconnect();
                        $__21.connectSocket();
                    }
                    resolve(data);
                });
            }
        }, {});
    }();
    var $__default = Feathers;
    return {
        get default() {
            return $__default;
        },
        __esModule: true
    };
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();