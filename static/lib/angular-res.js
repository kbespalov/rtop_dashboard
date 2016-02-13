/*
 AngularJS v1.5.0-build.4422+sha.e94b37e
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(N,e,E){'use strict';function F(t,b){b=b||{};e.forEach(b,function(e,g){delete b[g]});for(var g in t)!t.hasOwnProperty(g)||"$"===g.charAt(0)&&"$"===g.charAt(1)||(b[g]=t[g]);return b}var y=e.$$minErr("$resource"),K=/^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;e.module("ngResource",["ng"]).provider("$resource",function(){var t=/^https?:\/\/[^\/]*/,b=this;this.defaults={stripTrailingSlashes:!0,actions:{get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},"delete":{method:"DELETE"}}};
this.$get=["$http","$log","$q",function(g,J,G){function z(e,f){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,f?"%20":"+")}function A(e,f){this.template=e;this.defaults=r({},b.defaults,f);this.urlParams={}}function H(u,f,m,h){function d(a,c){var d={};c=r({},f,c);v(c,function(c,k){x(c)&&(c=c());var q;if(c&&c.charAt&&"@"==c.charAt(0)){q=a;var n=c.substr(1);if(null==n||""===n||"hasOwnProperty"===n||!K.test("."+n))throw y("badmember",
n);for(var n=n.split("."),f=0,l=n.length;f<l&&e.isDefined(q);f++){var h=n[f];q=null!==q?q[h]:E}}else q=c;d[k]=q});return d}function L(a){return a.resource}function l(a){F(a||{},this)}var t=new A(u,h);m=r({},b.defaults.actions,m);l.prototype.toJSON=function(){var a=r({},this);delete a.$promise;delete a.$resolved;return a};v(m,function(a,c){var f=/^(POST|PUT|PATCH)$/i.test(a.method),u=!1;e.isNumber(a.timeout)||(a.timeout&&(J.debug("ngResource:\n  Only numeric values are allowed as `timeout`.\n  Promises are not supported in $resource, because the same value has to be re-used for multiple requests. If you are looking for a way to cancel requests, you should use the `cancellable` option."),
delete a.timeout),u=e.isDefined(a.cancellable)?a.cancellable:h&&e.isDefined(h.cancellable)?h.cancellable:b.defaults.cancellable);l[c]=function(k,q,n,h){var b={},m,w,B;switch(arguments.length){case 4:B=h,w=n;case 3:case 2:if(x(q)){if(x(k)){w=k;B=q;break}w=q;B=n}else{b=k;m=q;w=n;break}case 1:x(k)?w=k:f?m=k:b=k;break;case 0:break;default:throw y("badargs",arguments.length);}var C=this instanceof l,p=C?m:a.isArray?[]:new l(m),s={},z=a.interceptor&&a.interceptor.response||L,A=a.interceptor&&a.interceptor.responseError||
E,D;v(a,function(a,c){switch(c){default:s[c]=M(a);case "params":case "isArray":case "interceptor":case "cancellable":}});!C&&u&&(D=G.defer(),s.timeout=D.promise);f&&(s.data=m);t.setUrlParams(s,r({},d(m,a.params||{}),b),a.url);b=g(s).then(function(d){var k=d.data;if(k){if(e.isArray(k)!==!!a.isArray)throw y("badcfg",c,a.isArray?"array":"object",e.isArray(k)?"array":"object",s.method,s.url);if(a.isArray)p.length=0,v(k,function(a){"object"===typeof a?p.push(new l(a)):p.push(a)});else{var b=p.$promise;
F(k,p);p.$promise=b}}d.resource=p;return d},function(a){(B||I)(a);return G.reject(a)});b.finally(function(){p.$resolved=!0;!C&&u&&(p.$cancelRequest=e.noop,D=s.timeout=null)});b=b.then(function(a){var c=z(a);(w||I)(c,a.headers);return c},A);return C?b:(p.$promise=b,p.$resolved=!1,u&&(p.$cancelRequest=D.resolve),p)};l.prototype["$"+c]=function(a,d,b){x(a)&&(b=d,d=a,a={});a=l[c].call(this,a,this,d,b);return a.$promise||a}});l.bind=function(a){return H(u,r({},f,a),m)};return l}var I=e.noop,v=e.forEach,
r=e.extend,M=e.copy,x=e.isFunction;A.prototype={setUrlParams:function(b,f,m){var h=this,d=m||h.template,g,l,r="",a=h.urlParams={};v(d.split(/\W/),function(c){if("hasOwnProperty"===c)throw y("badname");!/^\d+$/.test(c)&&c&&(new RegExp("(^|[^\\\\]):"+c+"(\\W|$)")).test(d)&&(a[c]={isQueryParamValue:(new RegExp("\\?.*=:"+c+"(?:\\W|$)")).test(d)})});d=d.replace(/\\:/g,":");d=d.replace(t,function(a){r=a;return""});f=f||{};v(h.urlParams,function(a,b){g=f.hasOwnProperty(b)?f[b]:h.defaults[b];e.isDefined(g)&&
null!==g?(l=a.isQueryParamValue?z(g,!0):z(g,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+"),d=d.replace(new RegExp(":"+b+"(\\W|$)","g"),function(a,b){return l+b})):d=d.replace(new RegExp("(/?):"+b+"(\\W|$)","g"),function(a,b,c){return"/"==c.charAt(0)?c:b+c})});h.defaults.stripTrailingSlashes&&(d=d.replace(/\/+$/,"")||"/");d=d.replace(/\/\.(?=\w+($|\?))/,".");b.url=r+d.replace(/\/\\\./,"/.");v(f,function(a,d){h.urlParams[d]||(b.params=b.params||{},b.params[d]=a)})}};return H}]})})(window,
window.angular);
//# sourceMappingURL=angular-resource.min.js.map