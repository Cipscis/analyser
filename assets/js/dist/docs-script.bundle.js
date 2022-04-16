(()=>{"use strict";var t={d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{parse:()=>_,stringify:()=>p});var n={};t.r(n),t.d(n,{array:()=>T,boolean:()=>L,booleanCustom:()=>O,enumValue:()=>F,number:()=>N,value:()=>P});var r={};t.r(r),t.d(r,{mean:()=>H,sum:()=>I});var o={};t.r(o),t.d(o,{bar:()=>K,fileConfig:()=>y,getColNumber:()=>x,getColNumbers:()=>w,line:()=>Q,loadFile:()=>R,statistics:()=>r,transformers:()=>n});const s=Object.freeze({block:".js-codebook__block",set:".js-codebook__set",inert:".js-codebook__inert"}),i=Object.freeze({set:"data-codebook-set",index:"data-codebook-index",log:"data-codebook-log",html:"data-codebook-html"}),a="default",l=document.createElement("textarea");async function c(t,e){let n,r;"string"==typeof t?(n=t,e&&(r=e)):(n=a,t&&(r=t));const o=function(t){const e=function(t){const e=document.querySelectorAll(s.block),n=[],r={};for(let o of e){const e=m(o);let s;n.includes(e)?s=r[e]:(n.push(e),s=f(t),r[e]=s),s.blocks.push(o)}return r}(t);for(let t in e)u(e[t]);return e}(r);if(n in o)return function(t){const e=t.blocks.reduce(h,"");!function(t){for(let e of t.blocks){const t=e.getAttribute(i.log);if(t){const e=document.getElementById(`${t}`);e&&(e.innerHTML="")}}}(t);const n=t.args,[r,o]=function(t){return[Object.keys(t),Object.values(t)]}(n);if(r.includes("_log")||r.includes("_$log")||r.includes("log")||r.includes("_html")||r.includes("_$html")||r.includes("html"))throw new Error("Codebook: The following argument names are reserved and cannot be used:\n'_log', '_$log', 'log', '_html', '_$html', 'html'");return Function.apply(null,r.concat(["_log","_html",`\n\t\treturn async () => {\n\t\t\t'use strict';\n\n\t\t\tlet _$log = null;\n\t\t\tlet log = function () {};\n\n\t\t\tlet _$html = null;\n\t\t\tlet html = function () {};\n\n\t\t\t${e}\n\t\t};\n\t`])).apply(null,o.concat([d,g]))()}(o[n]);throw new RangeError(`Codebook: Cannot run unrecognised set '${n}'`)}function u(t){t.blocks.sort(((t,e)=>{const n=t.getAttribute(i.index),r=e.getAttribute(i.index);return n===r?0:null!==n&&null===r?-1:null===n&&null!==r?1:+n-+r}))}function f(t){return t=t||{},{blocks:[],args:Object.assign({},t)}}function h(t,e){let n=(r=e.textContent||"",l.innerHTML=r,l.value);var r;const o=e.getAttribute(i.log);o&&(n=`\n\t\t\t_$log = document.getElementById('${o}');\n\t\t\tlog = function (...output) {\n\t\t\t\t_log(_$log, ...output);\n\t\t\t};\n\n\t\t\t${n}\n\n\t\t\tlog = function () {};\n\t\t`);const s=e.getAttribute(i.html);return s&&(n=`\n\t\t\t_$html = document.getElementById('${s}');\n\t\t\thtml = function (output) {\n\t\t\t\t_html(_$html, output);\n\t\t\t};\n\n\t\t\t${n}\n\n\t\t\thtml = function () {};\n\t\t`),`${t}\n${n}`}function m(t){let e=t.getAttribute(i.set);if(!e){const n=t.closest(s.set);n&&(e=n.getAttribute(i.set)),e||(e=a)}return e}function d(t,...e){t&&e.forEach((e=>{let n;if(e instanceof Date){function t(t,e=2){let n=t.toString();for(;n.length<e;)n=`0${n}`;return n}n=`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}`,(e.getHours()||e.getMinutes()||e.getSeconds())&&(n+=` ${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}`)}else n="object"==typeof e?JSON.stringify(e,null,"\t"):"string"==typeof e?e:""+e;t.innerHTML+=`${n}\n`}))}function g(t,e){t&&(t.innerHTML=e)}function p(t,e){return(e=e||{}).transpose=e.transpose||!1,e.sanitise=e.sanitise||!1,function(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].join(","));return e.join("\n")}(function(t,e){for(const n of t)for(let t=0;t<n.length;t++)n[t]=b(n[t],e);return t}(function(t,e){const n=e?.transpose??!1,r=t.reduce(((t,e)=>Math.max(t,e.length)),0),o=n?r:t.length,s=n?t.length:r,i=[];for(let e=0;e<o;e++){const r=[];for(let o=0;o<s;o++){const s=n?o:e,i=n?e:o;let a=t[s][i];i>=t[s].length&&(a=""),r.push(a)}i.push(r)}return i}(t,e),e))}function b(t,e){let n;return n=void 0===t?"":"string"!=typeof t?""+t:t,(e?.sanitise??!1)&&n.match(/^[=\-+@]/)&&(n="\t"+t),n.match(/,|"|\n|\r/)&&(n=n.replace(/"/g,'""'),n='"'+n+'"'),n}function _(t,e){const n=function(t){const e=[];t=t.replace(/\r/g,"");let n=!1,r=!1,o=0,s=[];for(let i=0;i<t.length;i++){const a=t[i],l=","===a,c='"'===a,u="\n"===a,f=i===t.length-1;if(n)if(c){if('"'===t[i+1]){i++;continue}if(n=!1,r=!0,!f)continue}else if(f)throw new SyntaxError(`CSV parse: Reached end of file before ending quote. At index ${i}`);if(!n&&(l||u||f)){let n=t.substring(o,i+1);(l||u)&&(n=n.substring(0,n.length-1)),r&&(r=!1,n=n.substring(1,n.length-1),n=n.replace(/""/g,'"')),s.push(n),l&&f&&s.push(""),(u||f)&&(e.push(s),u&&(s=[])),o=i+1}else{if(r)throw new SyntaxError(`CSV parse: A value must be complete immediately after closing a quote. At index ${i}`);c&&(n=!0)}}return e}(t);return function(t){if(t&&t.length>1){let e=t[0].length;for(let n=1;n<t.length;n++)if(t[n].length!==e)throw new SyntaxError(`CSV parse: Row ${n} does not have the same length as the first row (${e})`)}}(n),void 0!==e?n.map((t=>t.map(e))):n}const y=t=>t;class $ extends Array{constructor(t){if(Array.isArray(t)){super(t.length);for(let e=0;e<t.length;e++)this[e]=t[e]}else"number"==typeof t?super(t):super()}getCol(t){if("number"!=typeof t)throw new TypeError("colNum must be a number.");if(t<0||t>=this[0]?.length)throw new RangeError("colNum out of range.");const e=[];for(const n of this)e.push(n[t]);return e}addCol(t){const e=this[0].length;if(Array.isArray(t)){if(this.length!==t.length)throw new Error(`New column of length ${t.length} cannot be added. It must be of length ${this.length}.`);for(const[e,n]of this.entries())n.push(t[e])}else for(const[e,n]of this.entries())n.push(t(n,e));return e}}function x(t){if("number"==typeof t)return Number.isInteger(t)&&t>=0?t:null;if(""===t)return null;if("string"!=typeof t)return null;const e=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];let n=-1;const r=t.toUpperCase();for(let o=0;o<r.length;o++){const s=r[o],i=e.indexOf(s);if(-1===i)return null;n+=(i+1)*Math.pow(e.length,t.length-(o+1))}return n}function w(t){const e={};for(const n in t){const r=x(t[n]);"number"==typeof r&&(e[n]=r)}return e}const v={Count:t=>t.length};class k extends Map{#discrete;constructor(t){super(),this.#discrete="boolean"!=typeof t?.discrete||t.discrete}summarise(t){const e=t??v,n=["Value",...Object.keys(e)];let r=[];for(const[t,n]of this.entries()){const o=[t];for(const[,r]of Object.entries(e)){const e=r(n,t);o.push(e)}r.push(o)}if(this.#discrete){const t=r.map((t=>t[0])).sort();r=r.sort(((e,n)=>t.indexOf(e[0])-t.indexOf(n[0])))}return[n,...r]}}function A(t){return function(e,n){return M((function(r,o,s){return j(r,e,n,t)}),t)}}function M(t,e){const n=t;return n.andBy=function(n,r){return M((function(o,s,i){return t(o,s,i)&&j(o,n,r,e)}),e)},n.orBy=function(n,r){return M((function(o,s,i){return t(o,s,i)||j(o,n,r,e)}),e)},n}function j(t,e,n,r){if("function"==typeof n){const r=n(t[e]);if("boolean"==typeof r)return r;throw new TypeError("The `by` filter method only accepts a function for its `values` argument if it returns a boolean value.")}const o=Array.isArray(n)?n:[n],s=t[e],i=Array.isArray(s)?s:[s];for(const t of i)for(const e of o)if(E(e,t,r))return!0;return!1}function E(t,e,n){if(t===e)return!0;if(n&&"string"==typeof t&&"string"==typeof e)for(const r of n)if(r.includes(t)&&r.includes(e))return!0;return!1}function S(t){return t.replace(/,|%$/g,"")}function C(t){const e=S(t);return parseFloat(e)===+e}function T(t,e){return function(n){return n.split(t,e)}}function O(t="true",e="false"){return function(n,r){const o=n.trim().toLowerCase();if("string"==typeof t){if(o===t.trim().toLowerCase())return!0}else if(t.test(n))return!0;if("string"==typeof e){if(o===e.trim().toLowerCase())return!1}else if(e.test(n))return!1;return n&&console.warn(`Boolean value not found in '${n}', checking for ${t} or ${e}${r?`(${r})`:""}`),null}}const L=O(),N=(t,e)=>{if(C(t)){let e=S(t);if(function(t){return C(t)&&!!t.match(/%$/)}(t)){const t=+e/100,n=e.replace(/^[^.]+\.?/,"").length;e=t.toFixed(n+2)}return+e}return t&&console.warn(`Number value not found in '${t}'${e?`(${e})`:""}`),null},P=(t,e)=>function(t){return function(t){return"true"===t.trim().toLowerCase()}(t)||function(t){return"false"===t.trim().toLowerCase()}(t)}(t)?L(t):C(t)?N(t):(console.warn(`Boolean or number value not found in '${t}'${e?`(${e})`:""}`),null);function F(t,e){const n=Object.values(t);return(t,r)=>{return t?(o=t,n.includes(o)?t:e&&t in e?e[t]:(console.warn(`Value '${t}' does not exist within ${n.join(", ")}${r?`(${r})`:""}`),null)):null;var o}}async function R(t){const e=await fetch(t.path);if(e.ok)return function(t,e){e.headerRows&&t.splice(0,e.headerRows),e.footerRows&&t.splice(-e.footerRows);const n=A(e.aliases),r=function(t,e){return function(n,r,o,s=!0){const i=new Set;for(const t of n){const e=t[r];if(Array.isArray(e))for(const t of e)i.add(t);else i.add(e)}if(void 0===o){if(e)for(const t of i)if("string"==typeof t){let n=!1,r=!1;for(const o of e)o.includes(t)&&(o[0]===t?r=!0:(n=!0,!1===i.has(o[0])&&i.add(o[0])));!1===r&&!0===n&&i.delete(t)}const o=new k;for(const e of i){const s=n.filter(t(r,e));o.set(e,s)}return o}{const e=[];if("number"==typeof o){if(!1===Number.isInteger(o)||o<2)throw new RangeError("The 'numGroups' argument must be an integer greater than 1.");const t=new Array(...i);if(!t.every((t=>"number"==typeof t)))throw new TypeError("Cannot split values based on a number unless each of those values is a number.");{const n=t.sort(((t,e)=>t-e)),[r,s]=[n[0],n[n.length-1]],i=(s-r)/o;for(let t=0;t<o;t++){const n=r+t*i,o=r+(t+1)*i;e.push([n,o])}}e[0][0]=-1/0,e[e.length-1][1]=1/0}else{if(!Array.isArray(o))throw new TypeError("Invalid argument type: "+typeof o);{if(0===o.length)throw new RangeError("At least one number is required for the 'splitPoints' argument.");if(!1===o.every((t=>"number"==typeof t)))throw new TypeError("All 'splitPoints' must be numbers.");const t=o.concat().sort(((t,e)=>t-e));e.push([-1/0,t[0]]);for(let n=0;n<t.length-1;n++)e.push([t[n],t[n+1]]);e.push([t[t.length-1],1/0])}}const a=new k({discrete:!1});for(const o of e){let e,i="";s?(o[0]!==-1/0&&(i+=`${o[0]} < `),i+="x",o[1]!==1/0&&(i+=` <= ${o[1]}`),e=t(r,(t=>o[0]<t&&t<=o[1]))):(o[0]!==-1/0&&(i+=`${o[0]} <= `),i+="x",o[1]!==1/0&&(i+=` < ${o[1]}`),e=t(r,(t=>o[0]<=t&&t<o[1])));const l=n.filter(e);a.set(i,l)}return a}}}(n,e.aliases),o={rows:new $(t),cols:w(e.cols),addedCols:{},by:n,group:r};if(e.aliases&&(o.aliases=e.aliases),e.transform)for(const n in e.transform)if(n in o.cols){const r=o.cols[n],s=e.transform[n];if(s===T)throw new Error("The 'array' transformer cannot be used directly. Please pass a 'separator' argument.");if(s===O)throw new Error("The 'booleanCustom' transformer cannot be used directly. Please invoke it to create a transformer function.");if(s===F)throw new Error("The 'enumValue' transformer cannot be used directly. Please pass an 'enums' argument.");for(const[e,i]of t.entries())if(s){const t=`column ${n}, row ${e}`;o.rows[e][r]=s(i[r],t)}}else console.warn(`Column '${n}' specified in transform not found in cols.`);return o}(_(await e.text()),t);throw new Error(`Failed to fetch file at ${t.path}: ${e.status}`)}function D(t){return(t=>1===t.length&&Array.isArray(t[0]))(t)?t[0]:t}function I(...t){return D(t).reduce((function(t,e){return t+e}),0)}function H(...t){const e=D(t);return I(e)/e.length}function B(t,e){const[[,...n]]=t;let[,...r]=t;if(r.every((t=>t[0]instanceof Date||"number"==typeof t[0]))&&(r=r.sort(((t,e)=>+t[0]-+e[0]))),!r.every((t=>"number"==typeof t[0]||"string"==typeof t[0]||t[0]instanceof Date)))throw new TypeError("Charts can only be created from data that can be converted to numbers.");let o=r.map((t=>t[0]));if(e?.x&&"labels"in e.x&&e.x.labels){for(let t=0;t<o.length;t++){const n=o[t];!1===e.x.labels.includes(n)&&(o.splice(t,1),r.splice(t,1),t-=t)}for(let t=0;t<e.x.labels.length;t++){const n=e.x.labels[t];if(!1===o.includes(n)){const e=[n,...new Array(r[0].length-1).fill(0)];o.splice(t,0,n),r.splice(t,0,e)}}o=e.x.labels,r=r.sort(((t,e)=>{const n=t[0],r=o.indexOf(n),s=e[0];return r-o.indexOf(s)}))}const s=[];for(let t=0;t<r.length;t++)for(let e=1;e<r[t].length;e++)void 0===s[e]&&(s[e]=[]),s[e][t]=r[t][e];s.splice(0,1);const i=s.filter((t=>t.every((t=>"number"==typeof t)))),a=n.filter(((t,e)=>i.includes(s[e]))),l={labels:o,groupNames:a,groups:i};return e&&"stacked"in e&&(l.stacked=e.stacked),l}class V{min;max;get width(){return this.max-this.min}constructor(t,e,n){[this.min,this.max]=function(t,e,n){let r,o;if([r,o]="groups"in t?"x"===n?function(t){let e,n;const{labels:r}=t;if(!r.length)throw new TypeError("Cannot extract minimum or maximum values from empty chart data.");const o=r.map((t=>"number"==typeof t?t:+t));if(!o.every((t=>!1===isNaN(t))))throw new TypeError("Cannot extract minimum or maximum values from labels that aren't all numbers.");return e=void 0===t.min?Math.min(...o):t.min,n=void 0===t.max?Math.max(...o):t.max,[e,n]}(t):function(t){let e,n;const{groups:r}=t;if(!r.length||!r[0].length)throw new TypeError("Cannot extract minimum or maximum values from empty chart data.");let o;return o="stacked"in t&&t.stacked?r[0].map(((t,e)=>r.reduce(((t,n)=>t+n[e]),0))):[].concat(...r),e=void 0===t.min?Math.min(...o):t.min,n=void 0===t.max?Math.max(...o):t.max,[e,n]}(t):function(t){const{min:e,max:n}=t;return[e,n]}(t),r>o&&([r,o]=[o,r]),n&&e){const t=e[n];if(t&&("min"in t||"max"in t||"values"in t)){const e="x"!==n;[r,o]=function(t,e,n,r=!0){if(Array.isArray(t.values)&&t.values.length||Array.isArray(t.gridlines)&&t.gridlines.length){let r=[];Array.isArray(t.values)&&(r=r.concat(t.values.map((t=>+t)))),Array.isArray(t.gridlines)&&(r=r.concat(t.gridlines.map((t=>+t)))),e=Math.min(e,...r),n=Math.max(n,...r)}if("number"==typeof t.min)e=t.min;else if(r&&("auto"===t.min||void 0===t.min)){const t=Math.floor(Math.log10(Math.max(Math.abs(n),Math.abs(e)))),r=Math.pow(10,t);e=Math.floor(e/r)*r,t<0&&(e=+e.toFixed(-t))}if("number"==typeof t.max)n=t.max;else if(r&&("auto"===t.max||void 0===t.max)){const r=Math.floor(Math.log10(Math.max(Math.abs(n),Math.abs(e))));n-=e;let o=Math.pow(10,r);if(n=Math.ceil(n/o)*o,"number"==typeof t.values){if(!1===Number.isInteger(t.values))throw new TypeError("axisOptions.values must be an integer.");const e=r-1;let s=Math.pow(10,e)*t.values;e<0&&(s=Math.round(s/Math.pow(10,e)),o=Math.round(o/Math.pow(10,e)),n=Math.round(n/Math.pow(10,e)));for(let t=0;t<1e3&&!(0==n%s&&n>0);t++)n+=o;e<0&&(n=+(n*Math.pow(10,e)).toFixed(-e))}n+=e}return[e,n]}(t,r,o,e)}}return[r,o]}(t,e,n)}getProportion(t){return(t-this.min)/this.width}getValue(t){return this.width*t+this.min}getSeries(t){t<2&&(t=2);const e=this.width/(t-1),n=[this.min];for(let r=0;r<t-2;r++)n.push(n[n.length-1]+e);return n.push(this.max),n}}function q(t,e,n){return`\n\t\t<figure class="chart">\n\t\t\t${n?.title?function(t){return t.title?`<figcaption class="chart__title">${t.title}</figcaption>`:""}(n):""}\n\n\t\t\t<div class="chart__area">\n\t\t\t\t${n?.legend?function(t,e){return`\n\t\t<div class="chart__legend">\n\t\t\t<span class="chart__legend__title">Legend</span>\n\n\t\t\t<ul class="chart__legend__items">\n\t\t\t\t${t.groupNames.map(((t,n)=>{const r=e?.colours&&e.colours[t];return`<li class="chart__legend__item">\n\t\t\t\t\t\t<span class="chart__legend__item__swatch"${r?` style="background-color: ${r};"`:""}></span>\n\t\t\t\t\t\t<span class="chart__legend__item__name">${t}</span>\n\t\t\t\t\t</li>`})).join("")}\n\t\t\t</ul>\n\t\t</div>\n\t`}(t,n):""}\n\n\t\t\t\t${function(t,e){const n=new V(t,e,"y"),{values:r}=G(n,e?.y);return`\n\t\t<ul class="chart__y-gridlines" role="presentation">\n\t\t\t${r.map(((t,e)=>e>0||t>n.min?`\n\t\t\t\t\t<li class="chart__y-gridline" style="bottom: ${100*Math.max(0,n.getProportion(t))}%;"></li>`:"")).join("")}\n\t\t</ul>\n\t`}(t,n)}\n\n\t\t\t\t${function(t,e){const n=e?.x;if(n&&("values"in n||"gridlines"in n)){const r=new V(t,e,"x"),{values:o}=G(r,n);return`\n\t\t\t<ul class="chart__x-gridlines" role="presentation">\n\t\t\t\t${o.map(((t,e)=>e>0||t>r.min?`\n\t\t\t\t\t\t<li class="chart__x-gridline" style="left: ${100*Math.max(0,r.getProportion(t))}%;"></li>`:"")).join("")}\n\t\t\t</ul>\n\t\t`}return""}(t,n)}\n\n\t\t\t\t${e}\n\t\t\t</div>\n\n\t\t\t${function(t,e){const n=e?.y,r=new V(t,e,"y"),{values:o,dates:s}=U(r,n);return`\n\t<div class="chart__y-axis">\n\t\t${n?.title?`\n\t\t<span class="chart__y-axis__title">${n.title}</span>\n\t\t`:""}\n\n\t\t<ul class="chart__y-axis__value-list">\n\t\t\t${o.map((t=>`\n\t\t\t<li class="chart__y-axis__value" style="bottom: ${100*Math.max(0,r.getProportion(t))}%;">\n\t\t\t\t${Y(s?new Date(t):t,n)}\n\t\t\t</li>\n\t\t\t`)).join("")}\n\t\t</ul>\n\t</div>`}(t,n)}\n\n\t\t\t${function(t,e){const n=e?.x;if(n){if("labels"in n)return function(t,e){const n=e?.x,{labels:r}=t;return`\n\t<div class="chart__x-axis">\n\t\t${n?.title?`<span class="chart__x-axis__title">${n.title}</span>`:""}\n\t\t<ul class="chart__x-axis__label-list">\n\t\t\t${r.map((t=>`<li class="chart__x-axis__label">${Y(t,n)}</li>`)).join("")}\n\t\t</ul>\n\t</div>`}(t,e);if("values"in n)return function(t,e){const n=e?.x,r=new V(t,e,"x"),{values:o,dates:s}=U(r,n);return`\n\t<div class="chart__x-axis">\n\t\t${n?.title?`<span class="chart__x-axis__title">${n.title}</span>`:""}\n\t\t<ul class="chart__x-axis__value-list">\n\t\t\t${o.map((t=>`\n\t\t\t<li class="chart__x-axis__value" style="left: ${100*Math.max(0,r.getProportion(t))}%;">\n\t\t\t\t${Y(s?new Date(t):t,n)}\n\t\t\t</li>\n\t\t\t`)).join("")}\n\t\t</ul>\n\t</div>`}(t,e)}return function(t,e){const n=e?.x;return`\n\t<div class="chart__x-axis">\n\t\t${n?.title?`<span class="chart__x-axis__title">${n.title}</span>`:""}\n\t</div>`}(0,e)}(t,n)}\n\t\t</figure>\n\t`}function z(t,e,n,r){const{labels:o,groups:s,groupNames:i}=t,a=s.indexOf(e);if(-1===a)throw new Error("Cannot render tooltip: unrecognised group");const l=i[a],c=o.indexOf(n);if(-1===c)throw new Error("Cannot render tooltip: unrecognised label");const u=e[c];return`\n\t<div class="chart__tooltip">\n\t\t${s.length>1?l:""} ${n}: ${Y(u,r?.y)}\n\t</div>`}function U(t,e){let n,r=!1;if(void 0!==e?.values){const o=J(t,e.values);n=o.values,r=o.dates}else n=t.getSeries(2);return{values:n,dates:r}}function G(t,e){let n,r=!1;if(void 0!==e?.gridlines){const o=J(t,e.gridlines);n=o.values,r=o.dates}else{const o=U(t,e);n=o.values,r=o.dates}return{values:n,dates:r}}function J(t,e){let n,r=!1;if("number"==typeof e){const r=e+1;n=t.getSeries(r)}else e.length>0?e.every((t=>"number"==typeof t))?n=e:(r=!0,n=e.map((t=>+t))):n=e;return{values:n,dates:r}}function Y(t,e){return"number"==typeof t?e?.numberFormat?e.numberFormat instanceof Intl.NumberFormat?e.numberFormat.format(t):e.numberFormat(t):t.toString():t instanceof Date?e?.dateFormat?e.dateFormat instanceof Intl.DateTimeFormat?e.dateFormat.format(t):e.dateFormat(t):t.toString():""+t}function K(t,e){const n=B(t,e);return q(n,function(t,e){const{labels:n,groups:r,groupNames:o}=t,{colours:s}=e||{},i=new V(t,e,"y");return`\n\t\t<ul class="chart__bar-groups">\n\t\t\t${n.map(((n,a)=>`<li class="chart__bar-group">\n\t\t\t\t<ul class="chart__bar-group-bars${e?.stacked?" chart__bar-group-bars--stacked":""}">\n\t\t\t\t\t${r.map(((r,l)=>{const c=o[l],u=s&&s[c],f=r[a];return`\n\t\t\t\t\t\t\t<li\n\t\t\t\t\t\t\t\tclass="chart__bar"\n\t\t\t\t\t\t\t\t${e?.stacked?` style="flex-basis: ${100*Math.max(0,i.getProportion(f))}%;"`:""}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tclass="chart__bar__area"\n\t\t\t\t\t\t\t\tstyle="\n\t\t\t\t\t\t\t\t\t${u?`background: ${u}; `:""}\n\t\t\t\t\t\t\t\t\t${e?.stacked?"":`flex-basis: ${100*Math.max(0,i.getProportion(f))}%;`}" data-value="${f}"\n\t\t\t\t\t\t\t\t\ttabindex="0"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t${z(t,r,n,e)}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>`})).join("")}\n\t\t\t\t</ul>\n\t\t\t</li>`)).join("")}\n\t\t</ul>\n\t`}(n,e),e)}function Q(t,e){const n=B(t,e);return q(n,function(t,e){const{labels:n,groups:r,groupNames:o}=t,{colours:s}=e||{},i=new V(t,e,"y"),a=new V(t,e,"x");return`\n\t\t<svg class="chart__lines" viewBox="0 0 100 100" preserveAspectRatio="none">\n\t\t\t<g transform="translate(0, 100) scale(1, -1)">\n\t\t\t\t${r.map(((t,e)=>{const r=o[e],l=s&&s[r];return`\n\t\t\t\t\t\t<polyline class="chart__line" points="${n.map(((e,n)=>{const r=100*a.getProportion(+e),o=t[n];return`${r},${100*i.getProportion(o)}`})).join(" ")}"${l?` style="stroke: ${l};"`:""}></polyline>\n\t\t\t\t\t`})).join("")}\n\t\t\t</g>\n\t\t</svg>\n\n\t\t${r.map(((r,o)=>`\n\t\t\t\t<ul class="chart__line__points">\n\t\t\t\t\t${n.map(((n,o)=>{const s=100*a.getProportion(+n),l=r[o];return`\n\t\t\t\t\t\t\t<li class="chart__line__point" style="left: ${s}%; bottom: ${100*i.getProportion(l)}%" tabindex="0">\n\t\t\t\t\t\t\t\t${z(t,r,n,e)}\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t`})).join("")}\n\t\t\t\t</ul>\n\t\t\t`)).join("")}\n\t`}(n,e),e)}const W=Object.freeze({example:".js-docs__example",block:".js-docs__example .js-codebook__block[contenteditable]",run:".js-docs__run",log:".js-docs__log",codebookSet:".js-codebook__set"}),X=Object.freeze({codebookSet:"data-codebook-set"}),Z=Object.freeze({error:"docs-example__control--error"});let tt=null;function et(t){const n=this,r=n.closest(W.codebookSet)?.getAttribute(X.codebookSet);n.setAttribute("aria-busy","true");const s={csv:e,analyser:o};(r?c(r,s):c(s)).then((()=>{n.classList.remove(Z.error)})).catch((t=>{n.classList.add(Z.error);const e=n.closest(W.example)?.querySelector(W.log);e&&(console.error(t),e.innerHTML=t.toString())})).finally((()=>{n.setAttribute("aria-busy","false")}))}function nt(t){tt=this}function rt(t){"ArrowUp"!==t.key&&"ArrowRight"!==t.key&&"ArrowDown"!==t.key&&"ArrowLeft"!==t.key||nt.call(this,t)}function ot(t){tt=null}document.querySelectorAll(W.run).forEach((t=>{t.addEventListener("click",et)})),document.querySelectorAll(W.block).forEach((t=>{t.addEventListener("blur",ot),t.addEventListener("input",nt),t.addEventListener("keydown",rt)})),document.addEventListener("keydown",(function(t){if("Tab"!==t.key)return;if(null===tt)return;t.preventDefault();const e=this.getSelection()?.getRangeAt(0);e&&(e.deleteContents(),e.insertNode(document.createTextNode("\t")),e.collapse(!1))})),function(){const t=document.querySelectorAll(`${s.block}, ${s.inert}`);for(let e of t){const t=e.innerHTML,n=t.match(/^(\t*)\S/m);if(n){const r=n[1].length,o=new RegExp(`^\\t{${r}}`,"gm");e.innerHTML=t.replace(o,"").trim()}}}(),c("example-data",{csv:e})})();
//# sourceMappingURL=docs-script.bundle.js.map