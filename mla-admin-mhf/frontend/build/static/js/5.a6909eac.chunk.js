(this.webpackJsonpmla=this.webpackJsonpmla||[]).push([[5],{1106:function(e,t,n){},1122:function(e,t,n){"use strict";n.r(t);var i=n(19),o=n(12),r=n(13),a=n(7),l=n(16),s=n(15),c=n(0),u=n.n(c),d=n(126),f=n(822),p=n(837),m=n(833),h=n(829),v=n(830),b=n(832),g=(n(223),n(27)),y=n(24),C=n.n(y),E=n(3),k=n.n(E),w=n(11),S=n(888),x=n(18),N=n.n(x),O=(n(1106),n(226)),j=n.n(O),D=function(e){Object(l.a)(n,e);var t=Object(s.a)(n);function n(e){var r;return Object(o.a)(this,n),(r=t.call(this,e)).getAlbumDetails=function(e){var t=Object(a.a)(r);k.a.all([w.a.getAlbum(e)]).then((function(e){if(e[0]){var n=e[0].data;if(n.status){var i=n.data,o={},r=i.albumFiles?i.albumFiles.replace(/quot;/g,'"'):"";(o={id:i._id,albumTitle:i.albumTitle,albumFiles:JSON.parse(r),albumDate:i.createdAt}).albumFiles&&(o.albumFiles&&o.albumFiles.images&&(o.albumFileNames=o.albumFiles.images),o.albumFiles&&o.albumFiles.videos&&(o.albumVideoFileNames=o.albumFiles.videos)),console.log(o),t.setState({albumDetails:o}),t.setState({Success_msg:""})}else t.setState({apiError:n})}})).catch((function(e){console.log(e),e.message&&console.log("An error occurred in change Password")}))},r.updateEvent=function(e,t){e.preventDefault();var n=r.props.match,i=n.params.album_id,o=n.url;o=o.replace(i,"update/"+i),r.props.history.push(o)},r.onChange=function(e){r.setState(Object(i.a)({},e.target.name,e.target.value))},r.state={albumDetails:[],description:"",modal:!1},r.addevent=r.addevent.bind(Object(a.a)(r)),r.onChange=r.onChange.bind(Object(a.a)(r)),r.formSubmit=r.formSubmit.bind(Object(a.a)(r)),r}return Object(r.a)(n,[{key:"componentDidMount",value:function(){this.getAlbumDetails(this.props.match.params.album_id)}},{key:"addevent",value:function(){this.setState({modal:!this.state.modal})}},{key:"formSubmit",value:function(e){e.preventDefault(),console.log(this.state.description)}},{key:"render",value:function(){var e=this,t=this.state.albumDetails,n=this.props.config;return u.a.createElement("div",{className:"col-span-12 mla-albumdetails"},u.a.createElement("div",{className:"intro-y news p-5 box mt-8"},u.a.createElement("div",{className:"intro-y flex text-xs sm:text-sm flex-col sm:flex-row items-center border-t border-gray-200"},u.a.createElement("div",{className:"flex items-center"}),u.a.createElement("div",{className:"flex items-center text-gray-700 sm:ml-auto mt-5 sm:mt-0"},u.a.createElement("div",{className:"intro-y flex relative pt-16 sm:pt-6 items-center pb-6"},u.a.createElement("div",{className:"absolute sm:relative -mt-12 sm:mt-0 w-full flex text-gray-700 text-xs sm:text-sm"}),u.a.createElement("div",{className:"event-btn"},u.a.createElement(f.a,{className:"intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip",title:"Share",onClick:this.addevent},u.a.createElement("i",{className:"fa fa-share-alt","aria-hidden":"true"})),u.a.createElement(f.a,{className:"intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-theme-14 text-theme-10 ml-auto sm:ml-0 tooltip",title:"Share",onClick:this.updateEvent},u.a.createElement("i",{className:"fa fa-edit mlac-edit","aria-hidden":"true"})),u.a.createElement(p.a,{isOpen:this.state.modal,toggle:this.addevent,className:this.props.className},u.a.createElement(m.a,{ref:function(t){e.form=t},onSubmit:this.formSubmit},u.a.createElement(h.a,{toggle:this.addevent},u.a.createElement(N.a,{content:"add event"})," "),u.a.createElement(v.a,null,u.a.createElement("div",{class:"form-group"},u.a.createElement(S.a,{name:"description",onChange:this.onChange,className:"form-control",value:this.state.albumDetails.albumTitle,apiKey:"tw738oi7eejqelkvij9eko7n5fnt0xd7v90seimw8zjvehzc",init:{plugins:"link image code",toolbar:"undo redo | bold italic | alignleft aligncenter alignright | code",branding:!1}}))),u.a.createElement(b.a,null,u.a.createElement(f.a,{className:"button btn btn-secondary btn-xsmall",type:"submit"},u.a.createElement(N.a,{content:"add"}))," ",u.a.createElement(f.a,{className:"button black btn btn-secondary btn-xsmall",onClick:this.addevent},u.a.createElement(N.a,{content:"cancel"}))))))))),u.a.createElement("h2",{className:"intro-y font-medium text-xl sm:text-2xl mt-5"},t.albumTitle),u.a.createElement("div",{className:"intro-y text-gray-700 text-xs sm:text-sm"},C()(t.albumDate).format("Do MMM YYYY hh:mm A")),u.a.createElement("br",null),t.albumFileNames&&t.albumFileNames.length>0&&u.a.createElement(d.Carousel,null,t.albumFileNames.map((function(e,t){return u.a.createElement("div",{key:t},u.a.createElement("img",{className:"ep-eachimage",src:n.s3BasicPath+e,alt:"description"}))}))),u.a.createElement("br",null),t.albumVideoFileNames&&t.albumVideoFileNames.length>0&&u.a.createElement(d.Carousel,null,t.albumVideoFileNames.map((function(e,t){var i=e.split("||||");return u.a.createElement("div",{key:t,className:"player-wrapper"},u.a.createElement(j.a,{className:"react-player",url:"http"===e.substring(0,4)?i[0]:n.s3BasicPath+i[0],width:"100%",height:"100%",controls:!0,keyBoardControl:!0}))})))))}}]),n}(u.a.Component);t.default=Object(g.b)((function(e){return{config:e.auth.config}}),(function(e){return{}}))(D)},887:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return o}));var i=function(){return"undefined"!==typeof window?window:e},o=function(){var e=i();return e&&e.tinymce?e.tinymce:null}}).call(this,n(36))},888:function(e,t,n){"use strict";n.d(t,"a",(function(){return w}));var i=n(0),o=n(1),r=function(){return(r=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)},a={onActivate:o.func,onAddUndo:o.func,onBeforeAddUndo:o.func,onBeforeExecCommand:o.func,onBeforeGetContent:o.func,onBeforeRenderUI:o.func,onBeforeSetContent:o.func,onBeforePaste:o.func,onBlur:o.func,onChange:o.func,onClearUndos:o.func,onClick:o.func,onContextMenu:o.func,onCopy:o.func,onCut:o.func,onDblclick:o.func,onDeactivate:o.func,onDirty:o.func,onDrag:o.func,onDragDrop:o.func,onDragEnd:o.func,onDragGesture:o.func,onDragOver:o.func,onDrop:o.func,onExecCommand:o.func,onFocus:o.func,onFocusIn:o.func,onFocusOut:o.func,onGetContent:o.func,onHide:o.func,onInit:o.func,onKeyDown:o.func,onKeyPress:o.func,onKeyUp:o.func,onLoadContent:o.func,onMouseDown:o.func,onMouseEnter:o.func,onMouseLeave:o.func,onMouseMove:o.func,onMouseOut:o.func,onMouseOver:o.func,onMouseUp:o.func,onNodeChange:o.func,onObjectResizeStart:o.func,onObjectResized:o.func,onObjectSelected:o.func,onPaste:o.func,onPostProcess:o.func,onPostRender:o.func,onPreProcess:o.func,onProgressState:o.func,onRedo:o.func,onRemove:o.func,onReset:o.func,onSaveContent:o.func,onSelectionChange:o.func,onSetAttrib:o.func,onSetContent:o.func,onShow:o.func,onSubmit:o.func,onUndo:o.func,onVisualAid:o.func},l=r({apiKey:o.string,id:o.string,inline:o.bool,init:o.object,initialValue:o.string,onEditorChange:o.func,outputFormat:o.oneOf(["html","text"]),value:o.string,tagName:o.string,cloudChannel:o.string,plugins:o.oneOfType([o.string,o.array]),toolbar:o.oneOfType([o.string,o.array]),disabled:o.bool,textareaName:o.string,tinymceScriptSrc:o.string,rollback:o.oneOfType([o.number,o.oneOf([!1])]),scriptLoading:o.shape({async:o.bool,defer:o.bool,delay:o.number})},a),s=function(e){return"function"===typeof e},c=function(e){return e in a},u=function(e){return e.substr(2)},d=function(e,t,n,i,o){return function(e,t,n,i,o,r,a){var l=Object.keys(o).filter(c),s=Object.keys(r).filter(c),d=l.filter((function(e){return void 0===r[e]})),f=s.filter((function(e){return void 0===o[e]}));d.forEach((function(e){var t=u(e),i=a[t];n(t,i),delete a[t]})),f.forEach((function(n){var o=i(e,n),r=u(n);a[r]=o,t(r,o)}))}(o,e.on.bind(e),e.off.bind(e),(function(t,n){return function(i){var o;return null===(o=t(n))||void 0===o?void 0:o(i,e)}}),t,n,i)},f=0,p=function(e){var t=Date.now();return e+"_"+Math.floor(1e9*Math.random())+ ++f+String(t)},m=function(e){return null!==e&&("textarea"===e.tagName.toLowerCase()||"input"===e.tagName.toLowerCase())},h=function(e){return"undefined"===typeof e||""===e?[]:Array.isArray(e)?e:e.split(" ")},v=function(){return{listeners:[],scriptId:p("tiny-script"),scriptLoading:!1,scriptLoaded:!1}},b=function(){var e=v();return{load:function(t,n,i,o,r,a){var l=function(){return function(e,t,n,i,o,r){var a=t.createElement("script");a.referrerPolicy="origin",a.type="application/javascript",a.id=e,a.src=n,a.async=i,a.defer=o;a.addEventListener("load",(function e(){a.removeEventListener("load",e),r()})),t.head&&t.head.appendChild(a)}(e.scriptId,t,n,i,o,(function(){e.listeners.forEach((function(e){return e()})),e.scriptLoaded=!0}))};e.scriptLoaded?a():(e.listeners.push(a),e.scriptLoading||(e.scriptLoading=!0,r>0?setTimeout(l,r):l()))},reinitialize:function(){e=v()}}}(),g=n(887),y=function(){var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(t,n)};return function(t,n){if("function"!==typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function i(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),C=function(){return(C=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)},E=function(){var e,t,n;return(null===(n=null===(t=null===(e=Object(g.a)())||void 0===e?void 0:e.Env)||void 0===t?void 0:t.browser)||void 0===n?void 0:n.isIE())?"change keyup compositionend setcontent":"change input compositionend setcontent"},k=function(){return window.InputEvent&&"function"===typeof InputEvent.prototype.getTargetRanges?"beforeinput SelectionChange":"SelectionChange"},w=function(e){function t(t){var n,o,r,a=e.call(this,t)||this;return a.rollbackTimer=void 0,a.valueCursor=void 0,a.rollbackChange=function(){var e=a.editor,t=a.props.value;e&&t&&t!==a.currentContent&&e.undoManager.ignore((function(){if(e.setContent(t),a.valueCursor&&(!a.inline||e.hasFocus()))try{e.selection.moveToBookmark(a.valueCursor)}catch(n){}})),a.rollbackTimer=void 0},a.handleBeforeInput=function(e){if(void 0!==a.props.value&&a.props.value===a.currentContent&&a.editor&&(!a.inline||a.editor.hasFocus))try{a.valueCursor=a.editor.selection.getBookmark(3)}catch(t){}},a.handleBeforeInputSpecial=function(e){"Enter"!==e.key&&"Backspace"!==e.key&&"Delete"!==e.key||a.handleBeforeInput(e)},a.handleEditorChange=function(e){var t=a.editor;if(t&&t.initialized){var n=t.getContent();if(void 0!==a.props.value&&a.props.value!==n&&!1!==a.props.rollback&&(a.rollbackTimer||(a.rollbackTimer=window.setTimeout(a.rollbackChange,"number"===typeof a.props.rollback?a.props.rollback:200))),n!==a.currentContent&&(a.currentContent=n,s(a.props.onEditorChange))){var i=a.props.outputFormat,o="html"===i?n:t.getContent({format:i});a.props.onEditorChange(o,t)}}},a.handleEditorChangeSpecial=function(e){"Backspace"!==e.key&&"Delete"!==e.key||a.handleEditorChange(e)},a.initialise=function(e){var t,n,i;void 0===e&&(e=0);var o=a.elementRef.current;if(o)if(function(e){if(!("isConnected"in Node.prototype)){for(var t=e,n=e.parentNode;null!=n;)n=(t=n).parentNode;return t===e.ownerDocument}return e.isConnected}(o)){var r=Object(g.a)();if(!r)throw new Error("tinymce should have been loaded into global scope");var l,c,u=C(C({},a.props.init),{selector:void 0,target:o,readonly:a.props.disabled,inline:a.inline,plugins:(l=null===(t=a.props.init)||void 0===t?void 0:t.plugins,c=a.props.plugins,h(l).concat(h(c))),toolbar:null!==(n=a.props.toolbar)&&void 0!==n?n:null===(i=a.props.init)||void 0===i?void 0:i.toolbar,setup:function(e){a.editor=e,a.bindHandlers({}),a.inline&&!m(o)&&e.once("PostRender",(function(t){e.setContent(a.getInitialValue(),{no_events:!0})})),a.props.init&&s(a.props.init.setup)&&a.props.init.setup(e)},init_instance_callback:function(e){var t,n,i=a.getInitialValue();a.currentContent=null!==(t=a.currentContent)&&void 0!==t?t:e.getContent(),a.currentContent!==i&&(a.currentContent=i,e.setContent(i),e.undoManager.clear(),e.undoManager.add(),e.setDirty(!1));var o=null!==(n=a.props.disabled)&&void 0!==n&&n;e.setMode(o?"readonly":"design"),a.props.init&&s(a.props.init.init_instance_callback)&&a.props.init.init_instance_callback(e)}});a.inline||(o.style.visibility=""),m(o)&&(o.value=a.getInitialValue()),r.init(u)}else if(0===e)setTimeout((function(){return a.initialise(1)}),1);else{if(!(e<100))throw new Error("tinymce can only be initialised when in a document");setTimeout((function(){return a.initialise(e+1)}),100)}},a.id=a.props.id||p("tiny-react"),a.elementRef=i.createRef(),a.inline=null!==(r=null!==(n=a.props.inline)&&void 0!==n?n:null===(o=a.props.init)||void 0===o?void 0:o.inline)&&void 0!==r&&r,a.boundHandlers={},a}return y(t,e),t.prototype.componentDidUpdate=function(e){var t,n,i=this;if(this.rollbackTimer&&(clearTimeout(this.rollbackTimer),this.rollbackTimer=void 0),this.editor&&(this.bindHandlers(e),this.editor.initialized)){if(this.currentContent=null!==(t=this.currentContent)&&void 0!==t?t:this.editor.getContent(),"string"===typeof this.props.initialValue&&this.props.initialValue!==e.initialValue)this.editor.setContent(this.props.initialValue),this.editor.undoManager.clear(),this.editor.undoManager.add(),this.editor.setDirty(!1);else if("string"===typeof this.props.value&&this.props.value!==this.currentContent){var o=this.editor;o.undoManager.transact((function(){var e;if(!i.inline||o.hasFocus())try{e=o.selection.getBookmark(3)}catch(l){}var t=i.valueCursor;if(o.setContent(i.props.value),!i.inline||o.hasFocus())for(var n=0,r=[e,t];n<r.length;n++){var a=r[n];if(a)try{o.selection.moveToBookmark(a),i.valueCursor=a;break}catch(l){}}}))}if(this.props.disabled!==e.disabled){var r=null!==(n=this.props.disabled)&&void 0!==n&&n;this.editor.setMode(r?"readonly":"design")}}},t.prototype.componentDidMount=function(){var e,t,n,i,o,r;null!==Object(g.a)()?this.initialise():this.elementRef.current&&this.elementRef.current.ownerDocument&&b.load(this.elementRef.current.ownerDocument,this.getScriptSrc(),null!==(t=null===(e=this.props.scriptLoading)||void 0===e?void 0:e.async)&&void 0!==t&&t,null!==(i=null===(n=this.props.scriptLoading)||void 0===n?void 0:n.defer)&&void 0!==i&&i,null!==(r=null===(o=this.props.scriptLoading)||void 0===o?void 0:o.delay)&&void 0!==r?r:0,this.initialise)},t.prototype.componentWillUnmount=function(){var e=this,t=this.editor;t&&(t.off(E(),this.handleEditorChange),t.off(k(),this.handleBeforeInput),t.off("keypress",this.handleEditorChangeSpecial),t.off("keydown",this.handleBeforeInputSpecial),t.off("NewBlock",this.handleEditorChange),Object.keys(this.boundHandlers).forEach((function(n){t.off(n,e.boundHandlers[n])})),this.boundHandlers={},t.remove(),this.editor=void 0)},t.prototype.render=function(){return this.inline?this.renderInline():this.renderIframe()},t.prototype.renderInline=function(){var e=this.props.tagName,t=void 0===e?"div":e;return i.createElement(t,{ref:this.elementRef,id:this.id})},t.prototype.renderIframe=function(){return i.createElement("textarea",{ref:this.elementRef,style:{visibility:"hidden"},name:this.props.textareaName,id:this.id})},t.prototype.getScriptSrc=function(){if("string"===typeof this.props.tinymceScriptSrc)return this.props.tinymceScriptSrc;var e=this.props.cloudChannel;return"https://cdn.tiny.cloud/1/"+(this.props.apiKey?this.props.apiKey:"no-api-key")+"/tinymce/"+e+"/tinymce.min.js"},t.prototype.getInitialValue=function(){return"string"===typeof this.props.initialValue?this.props.initialValue:"string"===typeof this.props.value?this.props.value:""},t.prototype.bindHandlers=function(e){var t=this;if(void 0!==this.editor){d(this.editor,e,this.props,this.boundHandlers,(function(e){return t.props[e]}));var n=function(e){return void 0!==e.onEditorChange||void 0!==e.value},i=n(e),o=n(this.props);!i&&o?(this.editor.on(E(),this.handleEditorChange),this.editor.on(k(),this.handleBeforeInput),this.editor.on("keydown",this.handleBeforeInputSpecial),this.editor.on("keyup",this.handleEditorChangeSpecial),this.editor.on("NewBlock",this.handleEditorChange)):i&&!o&&(this.editor.off(E(),this.handleEditorChange),this.editor.off(k(),this.handleBeforeInput),this.editor.off("keydown",this.handleBeforeInputSpecial),this.editor.off("keyup",this.handleEditorChangeSpecial),this.editor.off("NewBlock",this.handleEditorChange))}},t.propTypes=l,t.defaultProps={cloudChannel:"5"},t}(i.Component)}}]);
//# sourceMappingURL=5.a6909eac.chunk.js.map