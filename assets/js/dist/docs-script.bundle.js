(()=>{"use strict";var t={d:(n,e)=>{for(var r in e)t.o(e,r)&&!t.o(n,r)&&Object.defineProperty(n,r,{enumerable:!0,get:e[r]})},o:(t,n)=>Object.prototype.hasOwnProperty.call(t,n),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},n={};t.r(n),t.d(n,{parse:()=>_,stringify:()=>p});var e={};t.r(e),t.d(e,{array:()=>T,boolean:()=>L,booleanCustom:()=>O,enumValue:()=>F,number:()=>N,value:()=>P});var r={};t.r(r),t.d(r,{mean:()=>H,sum:()=>I});var o={};t.r(o),t.d(o,{bar:()=>K,fileConfig:()=>y,getColNumber:()=>$,getColNumbers:()=>w,line:()=>Q,loadFile:()=>R,statistics:()=>r,transformers:()=>e});const s=Object.freeze({block:".js-codebook__block",set:".js-codebook__set",inert:".js-codebook__inert"}),i=Object.freeze({set:"data-codebook-set",index:"data-codebook-index",log:"data-codebook-log",html:"data-codebook-html"}),a="default",l=document.createElement("textarea");async function c(t,n){let e,r;"string"==typeof t?(e=t,n&&(r=n)):(e=a,t&&(r=t));const o=function(t){const n=function(t){const n=document.querySelectorAll(s.block),e=[],r={};for(let o of n){const n=m(o);let s;e.includes(n)?s=r[n]:(e.push(n),s=f(t),r[n]=s),s.blocks.push(o)}return r}(t);for(let t in n)u(n[t]);return n}(r);if(e in o)return function(t){const n=t.blocks.reduce(h,"");!function(t){for(let n of t.blocks){const t=n.getAttribute(i.log);if(t){const n=document.getElementById(`${t}`);n&&(n.innerHTML="")}}}(t);const e=t.args,[r,o]=function(t){return[Object.keys(t),Object.values(t)]}(e);if(r.includes("_log")||r.includes("_$log")||r.includes("log")||r.includes("_html")||r.includes("_$html")||r.includes("html"))throw new Error("Codebook: The following argument names are reserved and cannot be used:\n'_log', '_$log', 'log', '_html', '_$html', 'html'");return Function.apply(null,r.concat(["_log","_html",`\n\t\treturn async () => {\n\t\t\t'use strict';\n\n\t\t\tlet _$log = null;\n\t\t\tlet log = function () {};\n\n\t\t\tlet _$html = null;\n\t\t\tlet html = function () {};\n\n\t\t\t${n}\n\t\t};\n\t`])).apply(null,o.concat([d,g]))()}(o[e]);throw new RangeError(`Codebook: Cannot run unrecognised set '${e}'`)}function u(t){t.blocks.sort(((t,n)=>{const e=t.getAttribute(i.index),r=n.getAttribute(i.index);return e===r?0:null!==e&&null===r?-1:null===e&&null!==r?1:+e-+r}))}function f(t){return t=t||{},{blocks:[],args:Object.assign({},t)}}function h(t,n){let e=(r=n.textContent||"",l.innerHTML=r,l.value);var r;const o=n.getAttribute(i.log);o&&(e=`\n\t\t\t_$log = document.getElementById('${o}');\n\t\t\tlog = function (...output) {\n\t\t\t\t_log(_$log, ...output);\n\t\t\t};\n\n\t\t\t${e}\n\n\t\t\tlog = function () {};\n\t\t`);const s=n.getAttribute(i.html);return s&&(e=`\n\t\t\t_$html = document.getElementById('${s}');\n\t\t\thtml = function (output) {\n\t\t\t\t_html(_$html, output);\n\t\t\t};\n\n\t\t\t${e}\n\n\t\t\thtml = function () {};\n\t\t`),`${t}\n${e}`}function m(t){let n=t.getAttribute(i.set);if(!n){const e=t.closest(s.set);e&&(n=e.getAttribute(i.set)),n||(n=a)}return n}function d(t,...n){t&&n.forEach((n=>{let e;if(n instanceof Date){function t(t,n=2){let e=t.toString();for(;e.length<n;)e=`0${e}`;return e}e=`${n.getFullYear()}-${t(n.getMonth()+1)}-${t(n.getDate())}`,(n.getHours()||n.getMinutes()||n.getSeconds())&&(e+=` ${t(n.getHours())}:${t(n.getMinutes())}:${t(n.getSeconds())}`)}else e="object"==typeof n?JSON.stringify(n,null,"\t"):"string"==typeof n?n:""+n;t.innerHTML+=`${e}\n`}))}function g(t,n){t&&(t.innerHTML=n)}function p(t,n){return(n=n||{}).transpose=n.transpose||!1,n.sanitise=n.sanitise||!1,function(t){const n=[];for(let e=0;e<t.length;e++)n.push(t[e].join(","));return n.join("\n")}(function(t,n){for(const e of t)for(let t=0;t<e.length;t++)e[t]=b(e[t],n);return t}(function(t,n){const e=n?.transpose??!1,r=t.reduce(((t,n)=>Math.max(t,n.length)),0),o=e?r:t.length,s=e?t.length:r,i=[];for(let n=0;n<o;n++){const r=[];for(let o=0;o<s;o++){const s=e?o:n,i=e?n:o;let a=t[s][i];i>=t[s].length&&(a=""),r.push(a)}i.push(r)}return i}(t,n),n))}function b(t,n){let e;return e=void 0===t?"":"string"!=typeof t?""+t:t,(n?.sanitise??!1)&&e.match(/^[=\-+@]/)&&(e="\t"+t),e.match(/,|"|\n|\r/)&&(e=e.replace(/"/g,'""'),e='"'+e+'"'),e}function _(t,n){const e=function(t){const n=[];t=t.replace(/\r/g,"");let e=!1,r=!1,o=0,s=[];for(let i=0;i<t.length;i++){const a=t[i],l=","===a,c='"'===a,u="\n"===a,f=i===t.length-1;if(e)if(c){if('"'===t[i+1]){i++;continue}if(e=!1,r=!0,!f)continue}else if(f)throw new SyntaxError(`CSV parse: Reached end of file before ending quote. At index ${i}`);if(!e&&(l||u||f)){let e=t.substring(o,i+1);(l||u)&&(e=e.substring(0,e.length-1)),r&&(r=!1,e=e.substring(1,e.length-1),e=e.replace(/""/g,'"')),s.push(e),l&&f&&s.push(""),(u||f)&&(n.push(s),u&&(s=[])),o=i+1}else{if(r)throw new SyntaxError(`CSV parse: A value must be complete immediately after closing a quote. At index ${i}`);c&&(e=!0)}}return n}(t);return function(t){if(t&&t.length>1){let n=t[0].length;for(let e=1;e<t.length;e++)if(t[e].length!==n)throw new SyntaxError(`CSV parse: Row ${e} does not have the same length as the first row (${n})`)}}(e),void 0!==n?e.map((t=>t.map(n))):e}const y=t=>t;class x extends Array{constructor(t){if(Array.isArray(t)){super(t.length);for(let n=0;n<t.length;n++)this[n]=t[n]}else"number"==typeof t?super(t):super()}getCol(t){if("number"!=typeof t)throw new TypeError("colNum must be a number.");if(t<0||t>=this[0]?.length)throw new RangeError("colNum out of range.");const n=[];for(const e of this)n.push(e[t]);return n}addCol(t){const n=this[0].length;if(Array.isArray(t)){if(this.length!==t.length)throw new Error(`New column of length ${t.length} cannot be added. It must be of length ${this.length}.`);for(const[n,e]of this.entries())e.push(t[n])}else for(const[n,e]of this.entries())e.push(t(e,n));return n}}function $(t){if("number"==typeof t)return Number.isInteger(t)&&t>=0?t:null;if(""===t)return null;if("string"!=typeof t)return null;const n=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];let e=-1;const r=t.toUpperCase();for(let o=0;o<r.length;o++){const s=r[o],i=n.indexOf(s);if(-1===i)return null;e+=(i+1)*Math.pow(n.length,t.length-(o+1))}return e}function w(t){const n={};for(const e in t){const r=$(t[e]);"number"==typeof r&&(n[e]=r)}return n}const v={Count:t=>t.length};class k extends Map{#discrete;constructor(t){super(),this.#discrete="boolean"!=typeof t?.discrete||t.discrete}summarise(t){const n=t??v,e=["Value",...Object.keys(n)];let r=[];for(const[t,e]of this.entries()){const o=[t];for(const[,r]of Object.entries(n)){const n=r(e,t);o.push(n)}r.push(o)}if(this.#discrete){const t=r.map((t=>t[0])).sort();r=r.sort(((n,e)=>t.indexOf(n[0])-t.indexOf(e[0])))}return[e,...r]}}function A(t){return function(n,e){return M((function(r,o,s){return j(r,n,e,t)}),t)}}function M(t,n){const e=t;return e.andBy=function(e,r){return M((function(o,s,i){return t(o,s,i)&&j(o,e,r,n)}),n)},e.orBy=function(e,r){return M((function(o,s,i){return t(o,s,i)||j(o,e,r,n)}),n)},e}function j(t,n,e,r){if("function"==typeof e)return e(t[n]);const o=Array.isArray(e)?e:[e],s=t[n],i=Array.isArray(s)?s:[s];for(const t of i)for(const n of o)if(E(n,t,r))return!0;return!1}function E(t,n,e){if(t===n)return!0;if(e&&"string"==typeof t&&"string"==typeof n)for(const r of e)if(r.includes(t)&&r.includes(n))return!0;return!1}function S(t){return t.replace(/,|%$/g,"")}function C(t){const n=S(t);return parseFloat(n)===+n}function T(t,n){return function(e){return e.split(t,n)}}function O(t="true",n="false"){return function(e,r){const o=e.trim().toLowerCase();if("string"==typeof t){if(o===t.trim().toLowerCase())return!0}else if(t.test(e))return!0;if("string"==typeof n){if(o===n.trim().toLowerCase())return!1}else if(n.test(e))return!1;return e&&console.warn(`Boolean value not found in '${e}', checking for ${t} or ${n} (${r})`),null}}const L=O(),N=(t,n)=>{if(C(t)){let n=S(t);if(function(t){return C(t)&&!!t.match(/%$/)}(t)){const t=+n/100,e=n.replace(/^[^.]+\.?/,"").length;n=t.toFixed(e+2)}return+n}return t&&console.warn(`Number value not found in '${t}' (${n})`),null},P=(t,n)=>function(t){return function(t){return"true"===t.trim().toLowerCase()}(t)||function(t){return"false"===t.trim().toLowerCase()}(t)}(t)?L(t):C(t)?N(t):(console.warn(`Boolean or number value not found in '${t}' (${n})`),null);function F(t,n){const e=Object.values(t);return(t,r)=>{return t?(o=t,e.includes(o)?t:n&&t in n?n[t]:(console.warn(`Value '${t}' does not exist within ${e.join(", ")} (${r})`),null)):null;var o}}async function R(t){const n=await fetch(t.path);if(n.ok)return function(t,n){n.headerRows&&t.splice(0,n.headerRows),n.footerRows&&t.splice(-n.footerRows);const e=A(n.aliases),r=function(t,n){return function(e,r,o,s=!0){const i=new Set;for(const t of e){const n=t[r];if(Array.isArray(n))for(const t of n)i.add(t);else i.add(n)}if(void 0===o){if(n)for(const t of i)if("string"==typeof t){let e=!1,r=!1;for(const o of n)o.includes(t)&&(o[0]===t?r=!0:(e=!0,!1===i.has(o[0])&&i.add(o[0])));!1===r&&!0===e&&i.delete(t)}const o=new k;for(const n of i){const s=e.filter(t(r,n));o.set(n,s)}return o}{const n=[];if("number"==typeof o){if(!1===Number.isInteger(o)||o<2)throw new RangeError("The 'numGroups' argument must be an integer greater than 1.");const t=new Array(...i);if(!t.every((t=>"number"==typeof t)))throw new TypeError("Cannot split values based on a number unless each of those values is a number.");{const e=t.sort(((t,n)=>t-n)),[r,s]=[e[0],e[e.length-1]],i=(s-r)/o;for(let t=0;t<o;t++){const e=r+t*i,o=r+(t+1)*i;n.push([e,o])}}n[0][0]=-1/0,n[n.length-1][1]=1/0}else{if(!Array.isArray(o))throw new TypeError("Invalid argument type: "+typeof o);{if(0===o.length)throw new RangeError("At least one number is required for the 'splitPoints' argument.");if(!1===o.every((t=>"number"==typeof t)))throw new TypeError("All 'splitPoints' must be numbers.");const t=o.concat().sort(((t,n)=>t-n));n.push([-1/0,t[0]]);for(let e=0;e<t.length-1;e++)n.push([t[e],t[e+1]]);n.push([t[t.length-1],1/0])}}const a=new k({discrete:!1});for(const o of n){let n,i="";s?(o[0]!==-1/0&&(i+=`${o[0]} < `),i+="x",o[1]!==1/0&&(i+=` <= ${o[1]}`),n=t(r,(t=>o[0]<t&&t<=o[1]))):(o[0]!==-1/0&&(i+=`${o[0]} <= `),i+="x",o[1]!==1/0&&(i+=` < ${o[1]}`),n=t(r,(t=>o[0]<=t&&t<o[1])));const l=e.filter(n);a.set(i,l)}return a}}}(e,n.aliases),o={rows:new x(t),cols:w(n.cols),addedCols:{},by:e,group:r};if(n.aliases&&(o.aliases=n.aliases),n.transform)for(const e in n.transform)if(e in o.cols){const r=o.cols[e],s=n.transform[e];if(s===T)throw new Error("The 'array' transformer cannot be used directly. Please pass a 'separator' argument.");if(s===O)throw new Error("The 'booleanCustom' transformer cannot be used directly. Please invoke it to create a transformer function.");if(s===F)throw new Error("The 'enumValue' transformer cannot be used directly. Please pass an 'enums' argument.");for(const[n,i]of t.entries())if(s){const t=`column ${e}, row ${n}`;o.rows[n][r]=s(i[r],t)}}else console.warn(`Column '${e}' specified in transform not found in cols.`);return o}(_(await n.text()),t);throw new Error(`Failed to fetch file at ${t.path}: ${n.status}`)}function D(t){return(t=>1===t.length&&Array.isArray(t[0]))(t)?t[0]:t}function I(...t){return D(t).reduce((function(t,n){return t+n}),0)}function H(...t){const n=D(t);return I(n)/n.length}function B(t,n){const[[,...e]]=t;let[,...r]=t;if(r.every((t=>t[0]instanceof Date||"number"==typeof t[0]))&&(r=r.sort(((t,n)=>+t[0]-+n[0]))),!r.every((t=>"number"==typeof t[0]||"string"==typeof t[0]||t[0]instanceof Date)))throw new TypeError("Charts can only be created from data that can be converted to numbers.");let o=r.map((t=>t[0]));if(n?.x&&"labels"in n.x&&n.x.labels){for(let t=0;t<o.length;t++){const e=o[t];!1===n.x.labels.includes(e)&&(o.splice(t,1),r.splice(t,1),t-=t)}for(let t=0;t<n.x.labels.length;t++){const e=n.x.labels[t];if(!1===o.includes(e)){const n=[e,...new Array(r[0].length-1).fill(0)];o.splice(t,0,e),r.splice(t,0,n)}}o=n.x.labels,r=r.sort(((t,n)=>{const e=t[0],r=o.indexOf(e),s=n[0];return r-o.indexOf(s)}))}const s=[];for(let t=0;t<r.length;t++)for(let n=1;n<r[t].length;n++)void 0===s[n]&&(s[n]=[]),s[n][t]=r[t][n];s.splice(0,1);const i=s.filter((t=>t.every((t=>"number"==typeof t)))),a=e.filter(((t,n)=>i.includes(s[n]))),l={labels:o,groupNames:a,groups:i};return n&&"stacked"in n&&(l.stacked=n.stacked),l}class V{min;max;get width(){return this.max-this.min}constructor(t,n,e){[this.min,this.max]=function(t,n,e){let r,o;if([r,o]="groups"in t?"x"===e?function(t){let n,e;const{labels:r}=t;if(!r.length)throw new TypeError("Cannot extract minimum or maximum values from empty chart data.");const o=r.map((t=>"number"==typeof t?t:+t));if(!o.every((t=>!1===isNaN(t))))throw new TypeError("Cannot extract minimum or maximum values from labels that aren't all numbers.");return n=void 0===t.min?Math.min(...o):t.min,e=void 0===t.max?Math.max(...o):t.max,[n,e]}(t):function(t){let n,e;const{groups:r}=t;if(!r.length||!r[0].length)throw new TypeError("Cannot extract minimum or maximum values from empty chart data.");let o;return o="stacked"in t&&t.stacked?r[0].map(((t,n)=>r.reduce(((t,e)=>t+e[n]),0))):[].concat(...r),n=void 0===t.min?Math.min(...o):t.min,e=void 0===t.max?Math.max(...o):t.max,[n,e]}(t):function(t){const{min:n,max:e}=t;return[n,e]}(t),r>o&&([r,o]=[o,r]),e&&n){const t=n[e];if(t&&("min"in t||"max"in t||"values"in t)){const n="x"!==e;[r,o]=function(t,n,e,r=!0){if(Array.isArray(t.values)&&t.values.length||Array.isArray(t.gridlines)&&t.gridlines.length){let r=[];Array.isArray(t.values)&&(r=r.concat(t.values.map((t=>+t)))),Array.isArray(t.gridlines)&&(r=r.concat(t.gridlines.map((t=>+t)))),n=Math.min(n,...r),e=Math.max(e,...r)}if("number"==typeof t.min)n=t.min;else if(r&&("auto"===t.min||void 0===t.min)){const t=Math.floor(Math.log10(Math.max(Math.abs(e),Math.abs(n)))),r=Math.pow(10,t);n=Math.floor(n/r)*r,t<0&&(n=+n.toFixed(-t))}if("number"==typeof t.max)e=t.max;else if(r&&("auto"===t.max||void 0===t.max)){const r=Math.floor(Math.log10(Math.max(Math.abs(e),Math.abs(n))));e-=n;let o=Math.pow(10,r);if(e=Math.ceil(e/o)*o,"number"==typeof t.values){if(!1===Number.isInteger(t.values))throw new TypeError("axisOptions.values must be an integer.");const n=r-1;let s=Math.pow(10,n)*t.values;n<0&&(s=Math.round(s/Math.pow(10,n)),o=Math.round(o/Math.pow(10,n)),e=Math.round(e/Math.pow(10,n)));for(let t=0;t<1e3&&!(0==e%s&&e>0);t++)e+=o;n<0&&(e=+(e*Math.pow(10,n)).toFixed(-n))}e+=n}return[n,e]}(t,r,o,n)}}return[r,o]}(t,n,e)}getProportion(t){return(t-this.min)/this.width}getValue(t){return this.width*t+this.min}getSeries(t){t<2&&(t=2);const n=this.width/(t-1),e=[this.min];for(let r=0;r<t-2;r++)e.push(e[e.length-1]+n);return e.push(this.max),e}}function q(t,n,e){return`\n\t\t<figure class="chart">\n\t\t\t${e?.title?function(t){return`<figcaption class="chart__title">${t.title}</figcaption>`}(e):""}\n\n\t\t\t<div class="chart__area">\n\t\t\t\t${e?.legend?function(t,n){return`\n\t\t<div class="chart__legend">\n\t\t\t<span class="chart__legend__title">Legend</span>\n\n\t\t\t<ul class="chart__legend__items">\n\t\t\t\t${t.groupNames.map(((t,e)=>{const r=n?.colours&&n.colours[t];return`<li class="chart__legend__item">\n\t\t\t\t\t\t<span class="chart__legend__item__swatch"${r?` style="background-color: ${r};"`:""}></span>\n\t\t\t\t\t\t<span class="chart__legend__item__name">${t}</span>\n\t\t\t\t\t</li>`})).join("")}\n\t\t\t</ul>\n\t\t</div>\n\t`}(t,e):""}\n\n\t\t\t\t${function(t,n){const e=new V(t,n,"y"),{values:r}=G(e,n?.y);return`\n\t\t<ul class="chart__y-gridlines" role="presentation">\n\t\t\t${r.map(((t,n)=>n>0||t>e.min?`\n\t\t\t\t\t<li class="chart__y-gridline" style="bottom: ${100*Math.max(0,e.getProportion(t))}%;"></li>`:"")).join("")}\n\t\t</ul>\n\t`}(t,e)}\n\n\t\t\t\t${function(t,n){const e=n?.x;if(e&&("values"in e||"gridlines"in e)){const r=new V(t,n,"x"),{values:o}=G(r,e);return`\n\t\t\t<ul class="chart__x-gridlines" role="presentation">\n\t\t\t\t${o.map(((t,n)=>n>0||t>r.min?`\n\t\t\t\t\t\t<li class="chart__x-gridline" style="left: ${100*Math.max(0,r.getProportion(t))}%;"></li>`:"")).join("")}\n\t\t\t</ul>\n\t\t`}return""}(t,e)}\n\n\t\t\t\t${n}\n\t\t\t</div>\n\n\t\t\t${function(t,n){const e=n?.y,r=new V(t,n,"y"),{values:o,dates:s}=U(r,e);return`\n\t<div class="chart__y-axis">\n\t\t${e?.title?`\n\t\t<span class="chart__y-axis__title">${e.title}</span>\n\t\t`:""}\n\n\t\t<ul class="chart__y-axis__value-list">\n\t\t\t${o.map((t=>`\n\t\t\t<li class="chart__y-axis__value" style="bottom: ${100*Math.max(0,r.getProportion(t))}%;">\n\t\t\t\t${Y(s?new Date(t):t,e)}\n\t\t\t</li>\n\t\t\t`)).join("")}\n\t\t</ul>\n\t</div>`}(t,e)}\n\n\t\t\t${function(t,n){const e=n?.x;if(e){if("labels"in e)return function(t,n){const e=n?.x,{labels:r}=t;return`\n\t<div class="chart__x-axis">\n\t\t${e?.title?`<span class="chart__x-axis__title">${e.title}</span>`:""}\n\t\t<ul class="chart__x-axis__label-list">\n\t\t\t${r.map((t=>`<li class="chart__x-axis__label">${Y(t,e)}</li>`)).join("")}\n\t\t</ul>\n\t</div>`}(t,n);if("values"in e)return function(t,n){const e=n?.x,r=new V(t,n,"x"),{values:o,dates:s}=U(r,e);return`\n\t<div class="chart__x-axis">\n\t\t${e?.title?`<span class="chart__x-axis__title">${e.title}</span>`:""}\n\t\t<ul class="chart__x-axis__value-list">\n\t\t\t${o.map((t=>`\n\t\t\t<li class="chart__x-axis__value" style="left: ${100*Math.max(0,r.getProportion(t))}%;">\n\t\t\t\t${Y(s?new Date(t):t,e)}\n\t\t\t</li>\n\t\t\t`)).join("")}\n\t\t</ul>\n\t</div>`}(t,n)}return function(t,n){const e=n?.x;return`\n\t<div class="chart__x-axis">\n\t\t${e?.title?`<span class="chart__x-axis__title">${e.title}</span>`:""}\n\t</div>`}(0,n)}(t,e)}\n\t\t</figure>\n\t`}function z(t,n,e,r){const{labels:o,groups:s,groupNames:i}=t,a=s.indexOf(n);if(-1===a)throw new Error("Cannot render tooltip: unrecognised group");const l=i[a],c=o.indexOf(e);if(-1===c)throw new Error("Cannot render tooltip: unrecognised label");const u=n[c];return`\n\t<div class="chart__tooltip">\n\t\t${s.length>1?l:""} ${e}: ${Y(u,r?.y)}\n\t</div>`}function U(t,n){let e,r=!1;if(void 0!==n?.values){const o=J(t,n.values);e=o.values,r=o.dates}else e=t.getSeries(2);return{values:e,dates:r}}function G(t,n){let e,r=!1;if(void 0!==n?.gridlines){const o=J(t,n.gridlines);e=o.values,r=o.dates}else{const o=U(t,n);e=o.values,r=o.dates}return{values:e,dates:r}}function J(t,n){let e,r=!1;if("number"==typeof n){const r=n+1;e=t.getSeries(r)}else n.length>0?n.every((t=>"number"==typeof t))?e=n:(r=!0,e=n.map((t=>+t))):e=n;return{values:e,dates:r}}function Y(t,n){return"number"==typeof t?n?.numberFormat?n.numberFormat instanceof Intl.NumberFormat?n.numberFormat.format(t):n.numberFormat(t):t.toString():t instanceof Date?n?.dateFormat?n.dateFormat instanceof Intl.DateTimeFormat?n.dateFormat.format(t):n.dateFormat(t):t.toString():""+t}function K(t,n){const e=B(t,n);return q(e,function(t,n){const{labels:e,groups:r,groupNames:o}=t,{colours:s}=n||{},i=new V(t,n,"y");return`\n\t\t<ul class="chart__bar-groups">\n\t\t\t${e.map(((e,a)=>`<li class="chart__bar-group">\n\t\t\t\t<ul class="chart__bar-group-bars${n?.stacked?" chart__bar-group-bars--stacked":""}">\n\t\t\t\t\t${r.map(((r,l)=>{const c=o[l],u=s&&s[c],f=r[a];return`\n\t\t\t\t\t\t\t<li\n\t\t\t\t\t\t\t\tclass="chart__bar"\n\t\t\t\t\t\t\t\t${n?.stacked?` style="flex-basis: ${100*Math.max(0,i.getProportion(f))}%;"`:""}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tclass="chart__bar__area"\n\t\t\t\t\t\t\t\tstyle="\n\t\t\t\t\t\t\t\t\t${u?`background: ${u}; `:""}\n\t\t\t\t\t\t\t\t\t${n?.stacked?"":`flex-basis: ${100*Math.max(0,i.getProportion(f))}%;`}" data-value="${f}"\n\t\t\t\t\t\t\t\t\ttabindex="0"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t${z(t,r,e,n)}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>`})).join("")}\n\t\t\t\t</ul>\n\t\t\t</li>`)).join("")}\n\t\t</ul>\n\t`}(e,n),n)}function Q(t,n){const e=B(t,n);return q(e,function(t,n){const{labels:e,groups:r,groupNames:o}=t,{colours:s}=n||{},i=new V(t,n,"y"),a=new V(t,n,"x");return`\n\t\t<svg class="chart__lines" viewBox="0 0 100 100" preserveAspectRatio="none">\n\t\t\t<g transform="translate(0, 100) scale(1, -1)">\n\t\t\t\t${r.map(((t,n)=>{const r=o[n],l=s&&s[r];return`\n\t\t\t\t\t\t<polyline class="chart__line" points="${e.map(((n,e)=>{const r=100*a.getProportion(+n),o=t[e];return`${r},${100*i.getProportion(o)}`})).join(" ")}"${l?` style="stroke: ${l};"`:""}></polyline>\n\t\t\t\t\t`})).join("")}\n\t\t\t</g>\n\t\t</svg>\n\n\t\t${r.map(((r,o)=>`\n\t\t\t\t<ul class="chart__line__points">\n\t\t\t\t\t${e.map(((e,o)=>{const s=100*a.getProportion(+e),l=r[o];return`\n\t\t\t\t\t\t\t<li class="chart__line__point" style="left: ${s}%; bottom: ${100*i.getProportion(l)}%" tabindex="0">\n\t\t\t\t\t\t\t\t${z(t,r,e,n)}\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t`})).join("")}\n\t\t\t\t</ul>\n\t\t\t`)).join("")}\n\t`}(e,n),n)}const W=Object.freeze({example:".js-docs__example",block:".js-docs__example .js-codebook__block[contenteditable]",run:".js-docs__run",log:".js-docs__log",codebookSet:".js-codebook__set"}),X=Object.freeze({codebookSet:"data-codebook-set"}),Z=Object.freeze({error:"docs-example__control--error"});let tt=null;function nt(t){const e=this,r=e.closest(W.codebookSet)?.getAttribute(X.codebookSet);e.setAttribute("aria-busy","true");const s={csv:n,analyser:o};(r?c(r,s):c(s)).then((()=>{e.classList.remove(Z.error)})).catch((t=>{e.classList.add(Z.error);const n=e.closest(W.example)?.querySelector(W.log);n&&(console.error(t),n.innerHTML=t.toString())})).finally((()=>{e.setAttribute("aria-busy","false")}))}function et(t){tt=this}function rt(t){"ArrowUp"!==t.key&&"ArrowRight"!==t.key&&"ArrowDown"!==t.key&&"ArrowLeft"!==t.key||et.call(this,t)}function ot(t){tt=null}document.querySelectorAll(W.run).forEach((t=>{t.addEventListener("click",nt)})),document.querySelectorAll(W.block).forEach((t=>{t.addEventListener("blur",ot),t.addEventListener("input",et),t.addEventListener("keydown",rt)})),document.addEventListener("keydown",(function(t){if("Tab"!==t.key)return;if(null===tt)return;t.preventDefault();const n=this.getSelection()?.getRangeAt(0);n&&(n.deleteContents(),n.insertNode(document.createTextNode("\t")),n.collapse(!1))})),function(){const t=document.querySelectorAll(`${s.block}, ${s.inert}`);for(let n of t){const t=n.innerHTML,e=t.match(/^(\t*)\S/m);if(e){const r=e[1].length,o=new RegExp(`^\\t{${r}}`,"gm");n.innerHTML=t.replace(o,"").trim()}}}(),c("example-data",{csv:n})})();
//# sourceMappingURL=docs-script.bundle.js.map