//>>built
define("dojox/dtl/tag/misc",["dojo/_base/lang","dojo/_base/array","dojo/_base/connect","../_base"],function(f,k,h,g){var e=f.getObject("tag.misc",!0,g);e.DebugNode=f.extend(function(a){this.text=a},{render:function(a,b){for(var c=a.getKeys(),d=[],e={},f=0,g;g=c[f];f++)e[g]=a[g],d+="["+g+": "+typeof a[g]+"]\n";console.debug(e);return this.text.set(d).render(a,b,this)},unrender:function(a,b){return b},clone:function(a){return new this.constructor(this.text.clone(a))},toString:function(){return"ddtm.DebugNode"}});
e.FilterNode=f.extend(function(a,b){this._varnode=a;this._nodelist=b},{render:function(a,b){var c=this._nodelist.render(a,new dojox.string.Builder);a=a.update({"var":c.toString()});this._varnode.render(a,b);a.pop();return b},unrender:function(a,b){return b},clone:function(a){return new this.constructor(this._expression,this._nodelist.clone(a))}});e.FirstOfNode=f.extend(function(a,b){this._vars=a;this.vars=k.map(a,function(a){return new dojox.dtl._Filter(a)});this.contents=b},{render:function(a,b){for(var c=
0,d;d=this.vars[c];c++)if(d=d.resolve(a),"undefined"!=typeof d)return null===d&&(d="null"),this.contents.set(d),this.contents.render(a,b);return this.contents.unrender(a,b)},unrender:function(a,b){return this.contents.unrender(a,b)},clone:function(a){return new this.constructor(this._vars,this.contents.clone(a))}});e.SpacelessNode=f.extend(function(a,b){this.nodelist=a;this.contents=b},{render:function(a,b){if(b.getParent){var c=[h.connect(b,"onAddNodeComplete",this,"_watch"),h.connect(b,"onSetParent",
this,"_watchParent")];b=this.nodelist.render(a,b);h.disconnect(c[0]);h.disconnect(c[1])}else c=this.nodelist.dummyRender(a),this.contents.set(c.replace(/>\s+</g,"\x3e\x3c")),b=this.contents.render(a,b);return b},unrender:function(a,b){return this.nodelist.unrender(a,b)},clone:function(a){return new this.constructor(this.nodelist.clone(a),this.contents.clone(a))},_isEmpty:function(a){return 3==a.nodeType&&!a.data.match(/[^\s\n]/)},_watch:function(a){if(this._isEmpty(a))a.parentNode.firstChild==a&&
a.parentNode.removeChild(a);else{var b=a.parentNode.childNodes;if(1==a.nodeType&&2<b.length)for(var c=2;b[c];c++)if(1==b[c-2].nodeType&&this._isEmpty(b[c-1])){a.parentNode.removeChild(b[c-1]);break}}},_watchParent:function(a){if(a.childNodes.length)for(;a.childNodes.length;){var b=a.childNodes[a.childNodes.length-1];if(!this._isEmpty(b))break;a.removeChild(b)}}});e.TemplateTagNode=f.extend(function(a,b){this.tag=a;this.contents=b},{mapping:{openblock:"{%",closeblock:"%}",openvariable:"{{",closevariable:"}}",
openbrace:"{",closebrace:"}",opencomment:"{#",closecomment:"#}"},render:function(a,b){this.contents.set(this.mapping[this.tag]);return this.contents.render(a,b)},unrender:function(a,b){return this.contents.unrender(a,b)},clone:function(a){return new this.constructor(this.tag,this.contents.clone(a))}});e.WidthRatioNode=f.extend(function(a,b,c,d){this.current=new g._Filter(a);this.max=new g._Filter(b);this.width=c;this.contents=d},{render:function(a,b){var c=+this.current.resolve(a),d=+this.max.resolve(a);
"number"!=typeof c||"number"!=typeof d||!d?this.contents.set(""):this.contents.set(""+Math.round(c/d*this.width));return this.contents.render(a,b)},unrender:function(a,b){return this.contents.unrender(a,b)},clone:function(a){return new this.constructor(this.current.getExpression(),this.max.getExpression(),this.width,this.contents.clone(a))}});e.WithNode=f.extend(function(a,b,c){this.target=new g._Filter(a);this.alias=b;this.nodelist=c},{render:function(a,b){var c=this.target.resolve(a);a=a.push();
a[this.alias]=c;b=this.nodelist.render(a,b);a.pop();return b},unrender:function(a,b){return b},clone:function(a){return new this.constructor(this.target.getExpression(),this.alias,this.nodelist.clone(a))}});f.mixin(e,{comment:function(a,b){a.skip_past("endcomment");return g._noOpNode},debug:function(a,b){return new e.DebugNode(a.create_text_node())},filter:function(a,b){var c=b.contents.split(null,1)[1],c=a.create_variable_node("var|"+c),d=a.parse(["endfilter"]);a.next_token();return new e.FilterNode(c,
d)},firstof:function(a,b){var c=b.split_contents().slice(1);if(!c.length)throw Error("'firstof' statement requires at least one argument");return new e.FirstOfNode(c,a.create_text_node())},spaceless:function(a,b){var c=a.parse(["endspaceless"]);a.delete_first_token();return new e.SpacelessNode(c,a.create_text_node())},templatetag:function(a,b){var c=b.contents.split();if(2!=c.length)throw Error("'templatetag' statement takes one argument");var c=c[1],d=e.TemplateTagNode.prototype.mapping;if(!d[c]){var f=
[],g;for(g in d)f.push(g);throw Error("Invalid templatetag argument: '"+c+"'. Must be one of: "+f.join(", "));}return new e.TemplateTagNode(c,a.create_text_node())},widthratio:function(a,b){var c=b.contents.split();if(4!=c.length)throw Error("widthratio takes three arguments");var d=+c[3];if("number"!=typeof d)throw Error("widthratio final argument must be an integer");return new e.WidthRatioNode(c[1],c[2],d,a.create_text_node())},with_:function(a,b){var c=b.split_contents();if(4!=c.length||"as"!=
c[2])throw Error("do_width expected format as 'with value as name'");var d=a.parse(["endwith"]);a.next_token();return new e.WithNode(c[1],c[3],d)}});return e});