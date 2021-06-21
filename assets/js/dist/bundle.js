!function(e){var t={};function l(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,l),n.l=!0,n.exports}l.m=e,l.c=t,l.d=function(e,t,r){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},l.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(l.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)l.d(r,n,function(t){return e[t]}.bind(null,n));return r},l.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="",l(l.s=0)}([function(e,t,r){"use strict";r.r(t);const{stringify:n,parse:o}=(()=>{const e={stringify:function(t,l){(l=l||{}).transpose=l.transpose||!1,l.sanitise=l.sanitise||!1;let r=t;return r=e._shape(t,l),r=e._escape(r,l),r=e._join(r),r},_shape:function(e,t){const l=t.transpose,r=e.reduce((e,t)=>Math.max(e,t.length),0),n=l?r:e.length,o=l?e.length:r;let s=[];for(let t=0;t<n;t++){let r=[];for(let n=0;n<o;n++){let o=l?n:t,s=l?t:n,i=e[o][s];s>=e[o].length&&(i=""),r.push(i)}s.push(r)}return s},_escape:function(e,t){const l=t.sanitise;for(let t=0;t<e.length;t++){let r=e[t];for(let e=0;e<r.length;e++)void 0===r[e]?r[e]="":"string"!=typeof r[e]&&(r[e]=""+r[e]),l&&r[e].match(/^[=\-+@]/)&&(r[e]="\t"+r[e]),r[e].match(/,|"|\n/)&&(r[e]=r[e].replace(/"/g,'""'),r[e]='"'+r[e]+'"')}return e},_join:function(e){for(let t=0;t<e.length;t++)e[t]=e[t].join(",");return e=e.join("\n")},parse:function(t,l){let r=e._tokenise(t);return e._validate(r),l&&l.mapper&&(r=r.map(e=>e.map(l.mapper))),r},_tokenise:function(e){let t=[];e=e.replace(/\r/g,"");let l=!1,r=!1,n=0,o=[];for(let s=0;s<e.length;s++){let i=e[s],a=","===i,u='"'===i,f="\n"===i,c=s===e.length-1;if(l)if(u){if('"'===e[s+1]){s++;continue}if(l=!1,r=!0,!c)continue}else if(c)throw new Error("CSV parse: Reached end of file before ending quote. At index "+s);if(!l&&(a||f||c)){let l=e.substring(n,s+1);(a||f)&&(l=l.substring(0,l.length-1)),r&&(r=!1,l=l.substring(1,l.length-1),l=l.replace(/""/g,'"')),o.push(l),a&&c&&o.push(""),(f||c)&&(t.push(o),f&&(o=[])),n=s+1}else{if(r)throw new Error("CSV parse: A value must be complete immediately after closing a quote. At index "+s);u&&(l=!0)}}return t},_validate:function(e){if(e&&e.length>1){let t=e[0].length;for(let l=1;l<e.length;l++){if(e[l].length!==t)throw new Error(`CSV parse: Row ${l} does not have the same length as the first row (${t})`)}}}};return{stringify:e.stringify,parse:e.parse}})();class s extends Array{constructor(e){super(e.length);for(let t=0;t<e.length;t++)this[t]=e[t]}getCol(e){return this.map(t=>t[e])}addCol(e){if(this.length!==e.length)throw new Error(`Cannot add col of length ${e.length} to rows of length ${this.length}`);let t=this[0].length;for(let[t,l]of this.entries())l.push(e[t]);return t}getDerivedCol(e,...t){return this.map((l,r)=>{let n=[l];for(let e of t)n.push(e[r]);return e.apply(this,n)})}addDerivedCol(e,...t){let l=this.getDerivedCol.apply(this,arguments);return this.addCol(l)}createSubTable(e,t){return t=t||", ",this.map(l=>{let r={};for(let n in e){let o=l[e[n]];r[n]=o instanceof Array?o.join(t):o}return r})}createSubTableString(e){let t=this.createSubTable(e,",");return i._convertTableToString(t)}getColSummary(e,t){e instanceof Array||(e=[e]);let l={};for(let t of this)for(let r of e){let e=t[r];if(void 0!==e&&""!==e){let t;t=e instanceof Array?e:[e];for(let e of t)e in l?l[e]++:l[e]=1}}return void 0!==t&&(l=i._groupColSummaryByAliases(l,t)),l}getColAsDataSeries(e,t){let l=this.getColSummary(e),r=[];for(let e=0;e<t.length;e++)r[e]=0;for(let e in l){let n=l[e],o=t.indexOf(e);-1===o&&(o=t.indexOf(parseInt(e,10))),-1!==o&&(r[o]=n)}return r}getComparisonSummary(e,t,l,r){2===arguments.length?(l=t,t=void 0):3===arguments.length&&(t instanceof Array||(r=l,l=t,t=void 0)),console.log(this),console.trace();let n=this.getColSummary(e,t),o=this.getColSummary(l,r),s={};t&&(s.HEADERS=t),r&&(s.VARS=r);let a=i._getAliasFilters(s),u={};for(let t in o){u[t]={};for(let r in n)u[t][r]=a.filterRows(this,l,i._extractValue(t),e,i._extractValue(r)).length}return u}getComparisonSummaryString(e,t,l,r){let n=this.getComparisonSummary.apply(this,arguments);return i._convertTableToString(n,!0)}}const i={_loadFile:async function(e){let t=await fetch(e.path);if(t.ok){let l=await t.text(),r=i._parseCsv(l);return i._processData(r,e)}throw new Error(`Failed to fetch file at ${e.path}: ${t.status}`)},loadFile:function(...e){return new Promise((t,l)=>{let r=e.map(e=>i._loadFile(e));Promise.all(r).then(t)})},_processData:function(e,t){t.headerRows=t.headerRows||0,t.footerRows=t.footerRows||0,t.cols=t.cols||{},t.aliases=t.aliases||{},t.arrayCols=t.arrayCols||{},t.enumsMap=t.enumsMap||{},t.uniqueCols=t.uniqueCols||[];let l={};l.cols=t.cols,l.aliases=t.aliases,l.filters=i._getAliasFilters(t.aliases),l.enumsMap=t.enumsMap,0!==t.headerRows&&e.splice(0,t.headerRows),0!==t.footerRows&&e.splice(-t.footerRows),l.rows=new s(e);for(let e=0;e<l.rows.length;e++){let r=l.rows[e];for(let e in t.arrayCols)r[e]=(r[e]+"").trim().split(t.arrayCols[e]||" ");for(let e in t.defaultColValues)e in t.arrayCols||r[e]+""==t.defaultColValues[e]+""&&(r[e]="");for(let e in t.defaultCols)e in t.arrayCols||""===(r[e]+"").trim()&&(r[e]=t.defaultCols[e])}return i._createRowFilterFunctions(l.rows,l.filters),l.enums=i._buildEnums(e,t),l},_buildEnums:function(e,t){let l={};for(let r in t.cols){let n=!0;t.uniqueCols.includes(t.cols[r])&&(n=!1);for(let e in t.enumsMap)if(t.enumsMap[e].includes(t.cols[r])){n=!1;break}n&&(l[r]=[],i._collectEnums(e,l[r],t.cols[r]))}for(let r in t.enumsMap)l[r]=[],i._collectEnums.apply(this,[e,l[r]].concat(t.enumsMap[r]));return l},_collectEnums:function(e,t,...l){t=t||[];for(let r=0;r<e.length;r++){let n=e[r];for(let e=0;e<l.length;e++){let r=l[e];if(n[r]instanceof Array)for(let e=0;e<n[r].length;e++)""!==n[r][e]&&-1===t.indexOf(n[r][e])&&t.push(n[r][e]);else""!==n[r]&&-1===t.indexOf(n[r])&&t.push(n[r])}}return t},combineData:function(...e){let t={cols:{},rows:new s([]),aliases:{}};(!e||e.length<2)&&console.error("Invalid inputs passed to combineData",arguments);for(let l in e[0].cols)t.cols[l]=!0;for(let l=1;l<e.length;l++){let r=e[l];for(let e in t.cols)e in r.cols||delete t.cols[e]}let r=0;for(let e in t.cols)t.cols[e]=r,r++;for(let l=0;l<e.length;l++){let r=e[l];for(let e=0;e<r.rows.length;e++){let l=[];for(let n in t.cols)l[t.cols[n]]=r.rows[e][r.cols[n]];t.rows.push(l)}for(let e in r.aliases){e in t.aliases||(t.aliases[e]=[]);for(let l=0;l<r.aliases[e].length;l++){let n,o=r.aliases[e][l],s=[];for(n=0;n<t.aliases[e].length;n++)if(t.aliases[e][n][0]===o[0]){s=t.aliases[e][n];break}s=s.concat(o),s=s.filter((function(e,t,l){return l.indexOf(e)===t})),n<t.aliases[e].length?t.aliases[e][n]=s:t.aliases[e].push(s)}}}t.filters=i._getAliasFilters(t.aliases),i._createRowFilterFunctions(t.rows,t.filters),t.uniqueCols=[];for(let r=0;r<e.length;r++){let n=e[r];for(let e in n.uniqueCols){let r=n.uniqueCols[e],o=void 0;for(let e in n.cols)if(n.cols[l]===r){o=l;break}if(o){let e=t.cols[o];-1===t.uniqueCols.indexOf(e)&&t.uniqueCols.push(t.cols[o])}}}t.enumsMap={};for(let l=0;l<e.length;l++){let r=e[l];for(let e in r.enumsMap){let l=r.enumsMap[e];if(l){if(null!==t.enumsMap[e]){t.enumsMap[e]=t.enumsMap[e]||[];for(let n=0;n<l.length;n++){let o=l[n],s=void 0;for(let e in r.cols)if(r.cols[e]===o){s=e;break}if(s){let l=t.cols[s];-1===t.enumsMap[e].indexOf(l)&&t.enumsMap[e].push(t.cols[s])}}}}else t.enumsMap[e]=null}for(let e in t.enumsMap)null===t.enumsMap[e]&&delete t[enumsMap[e]]}return t.enums=i._buildEnums(t.rows,t),t},_parseCsv:function(e){return o(e,{mapper:i._extractValue})},_extractValue:function(e){return"true"===e||"false"!==e&&i._extractNumber(e)},_extractNumber:function(e){let t=e.replace(/,|%$/g,"");if(parseFloat(t)===+t){if(e.match(/%$/)){let e=t+"";e.replace(/^[^.]+/,""),e=e.length,t/=100,t=t.toFixed(e+2)}return+t}return e},_getAliasFilters:function(e){const t=function(t,l,r,n,o,a,u,f){let c=!l,p=2,g=[];if((arguments.length<4||(arguments.length-2)%2!=0)&&(c=!0,p=1,arguments.length<3||(arguments.length-1)%2!=0))return console.error("An invalid set of arguments was passed to filterRows"),[];let h=[];for(let e=p;e<arguments.length-1;e+=2){let t={colIndex:arguments[e],values:arguments[e+1]};Array.isArray(t.values)||t.values instanceof Function||(t.values=[t.values]),h.push(t)}for(let l=0;l<t.length;l++){let r=t[l],n=!!c;for(let t=0;t<h.length;t++){let l=h[t];n=c?n&&i._applyFilter(r,l.colIndex,l.values,e):n||i._applyFilter(r,l.colIndex,l.values,e)}n&&g.push(r)}return g=new s(g),g.filter=t.filter,g.filterAnd=t.filterAnd,g.filterOr=t.filterOr,g};return{filterRows:t,filterRowsAnd:function(e,l,r,n,o,s,i){let a=Array.prototype.slice.apply(arguments);return a=a.slice(1),a.splice(0,0,!1),a.splice(0,0,e),t.apply(this,a)},filterRowsOr:function(e,l,r,n,o,s,i){let a=Array.prototype.slice.apply(arguments);return a=a.slice(1),a.splice(0,0,!0),a.splice(0,0,e),t.apply(this,a)}}},_createRowFilterFunctions:function(e,t){e.filter=function(){var e=[this].concat(Array.from(arguments));return t.filterRows.apply(this,e)},e.filterOr=function(){var e=[this].concat(Array.from(arguments));return t.filterRowsOr.apply(this,e)},e.filterAnd=function(){var e=[this].concat(Array.from(arguments));return t.filterRowsAnd.apply(this,e)}},_applyFilter:function(e,t,l,r){if(l instanceof Function)return l(e[t]);l instanceof Array||(l=[l]);let n,o=e[t];n=o instanceof Array?o:[o];for(let e=0;e<n.length;e++){let t=n[e];for(let e=0;e<l.length;e++)if(i._matchAlias(l[e],t,r))return!0}return!1},_matchAlias:function(e,t,l){if(e===t)return!0;for(let r in l){let n=l[r];for(let l=0;l<n.length;l++){let r=n[l];if(-1!==r.indexOf(e)&&-1!==r.indexOf(t))return!0}}return!1},getColNumber:function(e){if(!("string"==typeof e||e instanceof String))return null;let t=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],l=-1;for(let r=0;r<e.length;r++){let n=e.toUpperCase()[r],o=t.indexOf(n);if(-1===o)return null;l+=(o+1)*Math.pow(t.length,e.length-(r+1))}return l},getColNumbers:function(e){let t={};for(let l in e){let r=e[l];("string"==typeof r||r instanceof String)&&(r=i.getColNumber(e[l])),Number.isInteger(r)&&r>=0&&(t[l]=r)}return t},_convertTableToString:function(e,t,l,r){const n=l||"\t",o=r||"\n";let s="",i=e=>{"string"!=typeof e&&(e=""+e),-1!==e.indexOf(n)&&(e='"'+e.replace(/"/g,'""')+'"'),s+=e+n},a=()=>{s=s.substr(0,s.length-n.length)+o};t&&(s+=n);let u=!1;for(let t in e){if(!0===u)break;u=!0;let l=e[t];for(let e in l)i(e)}a();for(let l in e){let r=!1,n=e[l];for(let e in n){let o=n[e];t&&(!1===r&&i(l),r=!0),i(o)}a()}return s},_groupColSummaryByAliases:function(e,t){let l={};for(let r in e){let n=!1;for(let o=0;o<t.length;o++){let s=t[o];-1!==s.indexOf(r)&&(n=!0,s[0]in l?l[s[0]]+=e[r]:l[s[0]]=e[r])}!1===n&&(l[r]=e[r])}return l}},{loadFile:a,combineData:u,getColNumber:f,getColNumbers:c,getCol:p}=i;!async function(){const e={path:"/assets/data/Prison Population - raw.csv",headerRows:1,cols:c({DATE:"A",REMAND_MALE:"B",REMAND_FEMALE:"C",REMAND_TOTAL:"D",SENTENCED_MALE:"E",SENTENCED_FEMALE:"F",SENTENCED_TOTAL:"G",TOTAL_MALE:"H",TOTAL_MALE:"I",TOTAL_TOTAL:"J",ETHNICITY_MAORI:"K",ETHNICITY_EUROPEAN:"L",ETHNICITY_PACIFIC:"M",ETHNICITY_ASIAN:"N",ETHNICITY_OTHER:"O",ETHNICITY_UNKNOWN:"P",ETHNICITY_TOTAL:"A",PER_100_000_POPULATION:"R"})},t={path:"/assets/data/Tactical Options 2014 - raw.csv",headerRows:1,cols:c({TACTICAL_OPTION:"A",EUROPEAN:"B",MAORI:"C",PACIFIC:"D",OTHER:"E"})};let l=await a(e,t);for(let e of l){let{rows:t,cols:l}=e;console.log(t),console.log(t.getCol(0))}let{rows:r,cols:n}=l[0],o=r.getCol(n.REMAND_MALE).map(e=>e/10),s=r.addCol(o);console.log(r.getCol(s));let i=r.addDerivedCol((e,t)=>e[1]+e[2]-t,o);console.log(r.getCol(i)),console.table(r.createSubTable(n)),console.log(r.createSubTableString(n)),r=l[1].rows,n=l[1].cols,console.log(r.getColSummary(n.TACTICAL_OPTION));let u=r.getColAsDataSeries(n.TACTICAL_OPTION,Object.keys(r.getColSummary(n.TACTICAL_OPTION)));console.log(u);let f=r.getComparisonSummary(n.TACTICAL_OPTION,n.MAORI);console.log(f);let p=r.getComparisonSummaryString(n.TACTICAL_OPTION,n.MAORI);console.log(p),console.log(r.getComparisonSummaryString(n.TACTICAL_OPTION,n.MAORI))}()}]);
//# sourceMappingURL=bundle.js.map