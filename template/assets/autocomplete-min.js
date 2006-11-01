YAHOO.widget.AutoComplete=function(_1,_2,_3,_4){
if(_1&&_2&&_3){
if(_3&&(_3 instanceof YAHOO.widget.DataSource)){
this.dataSource=_3;
}else{
alert("1");
return;
}
if(YAHOO.util.Dom.inDocument(_1)){
if(typeof _1=="string"){
this._sName="instance"+YAHOO.widget.AutoComplete._nIndex+" "+_1;
this._oTextbox=document.getElementById(_1);
}else{
this._sName=(_1.id)?"instance"+YAHOO.widget.AutoComplete._nIndex+" "+_1.id:"instance"+YAHOO.widget.AutoComplete._nIndex;
this._oTextbox=_1;
}
}else{
alert(_1);
return;
}
if(YAHOO.util.Dom.inDocument(_2)){
if(typeof _2=="string"){
this._oContainer=document.getElementById(_2);
}else{
this._oContainer=_2;
}
if(this._oContainer.style.display=="none"){
}
}else{
alert("3");
return;
}
if(typeof _4=="object"){
for(var _5 in _4){
if(_5){
this[_5]=_4[_5];
}
}
}
this._initContainer();
this._initProps();
this._initList();
this._initContainerHelpers();
var _6=this;
var _7=this._oTextbox;
var _8=this._oContainer._oContent;
YAHOO.util.Event.addListener(_7,"keyup",_6._onTextboxKeyUp,_6);
YAHOO.util.Event.addListener(_7,"keydown",_6._onTextboxKeyDown,_6);
YAHOO.util.Event.addListener(_7,"focus",_6._onTextboxFocus,_6);
YAHOO.util.Event.addListener(_7,"blur",_6._onTextboxBlur,_6);
YAHOO.util.Event.addListener(_8,"mouseover",_6._onContainerMouseover,_6);
YAHOO.util.Event.addListener(_8,"mouseout",_6._onContainerMouseout,_6);
YAHOO.util.Event.addListener(_8,"scroll",_6._onContainerScroll,_6);
YAHOO.util.Event.addListener(_8,"resize",_6._onContainerResize,_6);
if(_7.form){
YAHOO.util.Event.addListener(_7.form,"submit",_6._onFormSubmit,_6);
}
YAHOO.util.Event.addListener(_7,"keypress",_6._onTextboxKeyPress,_6);
this.textboxFocusEvent=new YAHOO.util.CustomEvent("textboxFocus",this);
this.textboxKeyEvent=new YAHOO.util.CustomEvent("textboxKey",this);
this.dataRequestEvent=new YAHOO.util.CustomEvent("dataRequest",this);
this.dataReturnEvent=new YAHOO.util.CustomEvent("dataReturn",this);
this.dataErrorEvent=new YAHOO.util.CustomEvent("dataError",this);
this.containerExpandEvent=new YAHOO.util.CustomEvent("containerExpand",this);
this.typeAheadEvent=new YAHOO.util.CustomEvent("typeAhead",this);
this.itemMouseOverEvent=new YAHOO.util.CustomEvent("itemMouseOver",this);
this.itemMouseOutEvent=new YAHOO.util.CustomEvent("itemMouseOut",this);
this.itemArrowToEvent=new YAHOO.util.CustomEvent("itemArrowTo",this);
this.itemArrowFromEvent=new YAHOO.util.CustomEvent("itemArrowFrom",this);
this.itemSelectEvent=new YAHOO.util.CustomEvent("itemSelect",this);
this.unmatchedItemSelectEvent=new YAHOO.util.CustomEvent("unmatchedItemSelect",this);
this.selectionEnforceEvent=new YAHOO.util.CustomEvent("selectionEnforce",this);
this.containerCollapseEvent=new YAHOO.util.CustomEvent("containerCollapse",this);
this.textboxBlurEvent=new YAHOO.util.CustomEvent("textboxBlur",this);
_7.setAttribute("autocomplete","off");
YAHOO.widget.AutoComplete._nIndex++;
}else{
}
};
YAHOO.widget.AutoComplete.prototype.dataSource=null;
YAHOO.widget.AutoComplete.prototype.minQueryLength=1;
YAHOO.widget.AutoComplete.prototype.maxResultsDisplayed=10;
YAHOO.widget.AutoComplete.prototype.queryDelay=0.5;
YAHOO.widget.AutoComplete.prototype.highlightClassName="yui-ac-highlight";
YAHOO.widget.AutoComplete.prototype.prehighlightClassName=null;
YAHOO.widget.AutoComplete.prototype.delimChar=null;
YAHOO.widget.AutoComplete.prototype.autoHighlight=true;
YAHOO.widget.AutoComplete.prototype.typeAhead=false;
YAHOO.widget.AutoComplete.prototype.animHoriz=false;
YAHOO.widget.AutoComplete.prototype.animVert=true;
YAHOO.widget.AutoComplete.prototype.animSpeed=0.3;
YAHOO.widget.AutoComplete.prototype.forceSelection=false;
YAHOO.widget.AutoComplete.prototype.allowBrowserAutocomplete=true;
YAHOO.widget.AutoComplete.prototype.alwaysShowContainer=false;
YAHOO.widget.AutoComplete.prototype.useIFrame=false;
YAHOO.widget.AutoComplete.prototype.useShadow=false;
YAHOO.widget.AutoComplete.prototype.toString=function(){
return "AutoComplete "+this._sName;
};
YAHOO.widget.AutoComplete.prototype.getListItems=function(){
return this._aListItems;
};
YAHOO.widget.AutoComplete.prototype.getListItemData=function(_9){
if(_9._oResultData){
return _9._oResultData;
}else{
return false;
}
};
YAHOO.widget.AutoComplete.prototype.setHeader=function(_10){
if(_10){
if(this._oContainer._oContent._oHeader){
this._oContainer._oContent._oHeader.innerHTML=_10;
this._oContainer._oContent._oHeader.style.display="block";
}
}else{
this._oContainer._oContent._oHeader.innerHTML="";
this._oContainer._oContent._oHeader.style.display="none";
}
};
YAHOO.widget.AutoComplete.prototype.setFooter=function(_11){
if(_11){
if(this._oContainer._oContent._oFooter){
this._oContainer._oContent._oFooter.innerHTML=_11;
this._oContainer._oContent._oFooter.style.display="block";
}
}else{
this._oContainer._oContent._oFooter.innerHTML="";
this._oContainer._oContent._oFooter.style.display="none";
}
};
YAHOO.widget.AutoComplete.prototype.setBody=function(_12){
if(_12){
if(this._oContainer._oContent._oBody){
this._oContainer._oContent._oBody.innerHTML=_12;
this._oContainer._oContent._oBody.style.display="block";
this._oContainer._oContent.style.display="block";
}
}else{
this._oContainer._oContent._oBody.innerHTML="";
this._oContainer._oContent.style.display="none";
}
this._maxResultsDisplayed=0;
};
YAHOO.widget.AutoComplete.prototype.formatResult=function(_13,_14){
var _15=_13[0];
if(_15){
return _15;
}else{
return "";
}
};
YAHOO.widget.AutoComplete.prototype.sendQuery=function(_16){
this._sendQuery(_16);
};
YAHOO.widget.AutoComplete.prototype.textboxFocusEvent=null;
YAHOO.widget.AutoComplete.prototype.textboxKeyEvent=null;
YAHOO.widget.AutoComplete.prototype.dataRequestEvent=null;
YAHOO.widget.AutoComplete.prototype.dataReturnEvent=null;
YAHOO.widget.AutoComplete.prototype.dataErrorEvent=null;
YAHOO.widget.AutoComplete.prototype.containerExpandEvent=null;
YAHOO.widget.AutoComplete.prototype.typeAheadEvent=null;
YAHOO.widget.AutoComplete.prototype.itemMouseOverEvent=null;
YAHOO.widget.AutoComplete.prototype.itemMouseOutEvent=null;
YAHOO.widget.AutoComplete.prototype.itemArrowToEvent=null;
YAHOO.widget.AutoComplete.prototype.itemArrowFromEvent=null;
YAHOO.widget.AutoComplete.prototype.itemSelectEvent=null;
YAHOO.widget.AutoComplete.prototype.unmatchedItemSelectEvent=null;
YAHOO.widget.AutoComplete.prototype.selectionEnforceEvent=null;
YAHOO.widget.AutoComplete.prototype.containerCollapseEvent=null;
YAHOO.widget.AutoComplete.prototype.textboxBlurEvent=null;
YAHOO.widget.AutoComplete._nIndex=0;
YAHOO.widget.AutoComplete.prototype._sName=null;
YAHOO.widget.AutoComplete.prototype._oTextbox=null;
YAHOO.widget.AutoComplete.prototype._bFocused=true;
YAHOO.widget.AutoComplete.prototype._oAnim=null;
YAHOO.widget.AutoComplete.prototype._oContainer=null;
YAHOO.widget.AutoComplete.prototype._bContainerOpen=false;
YAHOO.widget.AutoComplete.prototype._bOverContainer=false;
YAHOO.widget.AutoComplete.prototype._aListItems=null;
YAHOO.widget.AutoComplete.prototype._nDisplayedItems=0;
YAHOO.widget.AutoComplete.prototype._maxResultsDisplayed=0;
YAHOO.widget.AutoComplete.prototype._sCurQuery=null;
YAHOO.widget.AutoComplete.prototype._sSavedQuery=null;
YAHOO.widget.AutoComplete.prototype._oCurItem=null;
YAHOO.widget.AutoComplete.prototype._bItemSelected=false;
YAHOO.widget.AutoComplete.prototype._nKeyCode=null;
YAHOO.widget.AutoComplete.prototype._nDelayID=-1;
YAHOO.widget.AutoComplete.prototype._iFrameSrc="javascript:false;";
YAHOO.widget.AutoComplete.prototype._queryInterval=null;
YAHOO.widget.AutoComplete.prototype._sLastTextboxValue=null;
YAHOO.widget.AutoComplete.prototype._initProps=function(){
var _17=this.minQueryLength;
if(isNaN(_17)||(_17<1)){
_17=1;
}
var _18=this.maxResultsDisplayed;
if(isNaN(this.maxResultsDisplayed)||(this.maxResultsDisplayed<1)){
this.maxResultsDisplayed=10;
}
var _19=this.queryDelay;
if(isNaN(this.queryDelay)||(this.queryDelay<0)){
this.queryDelay=0.5;
}
var _20=(this.delimChar)?this.delimChar:null;
if(_20){
if(typeof _20=="string"){
this.delimChar=[_20];
}else{
if(_20.constructor!=Array){
this.delimChar=null;
}
}
}
var _21=this.animSpeed;
if((this.animHoriz||this.animVert)&&YAHOO.util.Anim){
if(isNaN(_21)||(_21<0)){
_21=0.3;
}
if(!this._oAnim){
oAnim=new YAHOO.util.Anim(this._oContainer._oContent,{},this.animSpeed);
this._oAnim=oAnim;
}else{
this._oAnim.duration=_21;
}
}
if(this.forceSelection&&this.delimChar){
}
};
YAHOO.widget.AutoComplete.prototype._initContainerHelpers=function(){
if(this.useShadow&&!this._oContainer._oShadow){
var _22=document.createElement("div");
_22.className="yui-ac-shadow";
this._oContainer._oShadow=this._oContainer.appendChild(_22);
}
if(this.useIFrame&&!this._oContainer._oIFrame){
var _23=document.createElement("iframe");
_23.src=this._iFrameSrc;
_23.frameBorder=0;
_23.scrolling="no";
_23.style.position="absolute";
_23.style.width="100%";
_23.style.height="100%";
_23.tabIndex=-1;
this._oContainer._oIFrame=this._oContainer.appendChild(_23);
}
};
YAHOO.widget.AutoComplete.prototype._initContainer=function(){
if(!this._oContainer._oContent){
var _24=document.createElement("div");
_24.className="yui-ac-content";
_24.style.display="none";
this._oContainer._oContent=this._oContainer.appendChild(_24);
var _25=document.createElement("div");
_25.className="yui-ac-hd";
_25.style.display="none";
this._oContainer._oContent._oHeader=this._oContainer._oContent.appendChild(_25);
var _26=document.createElement("div");
_26.className="yui-ac-bd";
this._oContainer._oContent._oBody=this._oContainer._oContent.appendChild(_26);
var _27=document.createElement("div");
_27.className="yui-ac-ft";
_27.style.display="none";
this._oContainer._oContent._oFooter=this._oContainer._oContent.appendChild(_27);
}else{
}
};
YAHOO.widget.AutoComplete.prototype._initList=function(){
this._aListItems=[];
while(this._oContainer._oContent._oBody.hasChildNodes()){
var _28=this.getListItems();
if(_28){
for(var _29=_28.length-1;_29>=0;i--){
_28[_29]=null;
}
}
this._oContainer._oContent._oBody.innerHTML="";
}
var _30=document.createElement("ul");
_30=this._oContainer._oContent._oBody.appendChild(_30);
for(var i=0;i<this.maxResultsDisplayed;i++){
var _32=document.createElement("li");
_32=_30.appendChild(_32);
this._aListItems[i]=_32;
this._initListItem(_32,i);
}
this._maxResultsDisplayed=this.maxResultsDisplayed;
};
YAHOO.widget.AutoComplete.prototype._initListItem=function(_33,_34){
var _35=this;
_33.style.display="none";
_33._nItemIndex=_34;
_33.mouseover=_33.mouseout=_33.onclick=null;
YAHOO.util.Event.addListener(_33,"mouseover",_35._onItemMouseover,_35);
YAHOO.util.Event.addListener(_33,"mouseout",_35._onItemMouseout,_35);
YAHOO.util.Event.addListener(_33,"click",_35._onItemMouseclick,_35);
};
YAHOO.widget.AutoComplete.prototype._onItemMouseover=function(v,_37){
if(_37.prehighlightClassName){
_37._togglePrehighlight(this,"mouseover");
}else{
_37._toggleHighlight(this,"to");
}
_37.itemMouseOverEvent.fire(_37,this);
};
YAHOO.widget.AutoComplete.prototype._onItemMouseout=function(v,_38){
if(_38.prehighlightClassName){
_38._togglePrehighlight(this,"mouseout");
}else{
_38._toggleHighlight(this,"from");
}
_38.itemMouseOutEvent.fire(_38,this);
};
YAHOO.widget.AutoComplete.prototype._onItemMouseclick=function(v,_39){
_39._toggleHighlight(this,"to");
_39._selectItem(this);
};
YAHOO.widget.AutoComplete.prototype._onContainerMouseover=function(v,_40){
_40._bOverContainer=true;
};
YAHOO.widget.AutoComplete.prototype._onContainerMouseout=function(v,_41){
_41._bOverContainer=false;
if(_41._oCurItem){
_41._toggleHighlight(_41._oCurItem,"to");
}
};
YAHOO.widget.AutoComplete.prototype._onContainerScroll=function(v,_42){
_42._oTextbox.focus();
};
YAHOO.widget.AutoComplete.prototype._onContainerResize=function(v,_43){
_43._toggleContainerHelpers(_43._bContainerOpen);
};
YAHOO.widget.AutoComplete.prototype._onTextboxKeyDown=function(v,_44){
var _45=v.keyCode;
switch(_45){
case 9:
if(_44.delimChar&&(_44._nKeyCode!=_45)){
if(_44._bContainerOpen){
YAHOO.util.Event.stopEvent(v);
}
}
if(_44._oCurItem){
_44._selectItem(_44._oCurItem);
}else{
_44._toggleContainer(false);
}
break;
case 13:
if(_44._nKeyCode!=_45){
if(_44._bContainerOpen){
YAHOO.util.Event.stopEvent(v);
}
}
if(_44._oCurItem){
_44._selectItem(_44._oCurItem);
}else{
_44._toggleContainer(false);
}
break;
case 27:
_44._toggleContainer(false);
return;
case 39:
_44._jumpSelection();
break;
case 38:
YAHOO.util.Event.stopEvent(v);
_44._moveSelection(_45);
break;
case 40:
YAHOO.util.Event.stopEvent(v);
_44._moveSelection(_45);
break;
default:
break;
}
};
YAHOO.widget.AutoComplete.prototype._onTextboxKeyPress=function(v,_46){
var _47=v.keyCode;
var _48=(navigator.userAgent.toLowerCase().indexOf("mac")!=-1);
if(_48){
switch(_47){
case 9:
if(_46.delimChar&&(_46._nKeyCode!=_47)){
if(_46._bContainerOpen){
YAHOO.util.Event.stopEvent(v);
}
}
break;
case 13:
if(_46._nKeyCode!=_47){
if(_46._bContainerOpen){
YAHOO.util.Event.stopEvent(v);
}
}
break;
case 38:
case 40:
YAHOO.util.Event.stopEvent(v);
break;
default:
break;
}
}
switch(_47){
case 229:
_46._queryInterval=setInterval(function(){
_46._onIMEDetected(_46);
},500);
break;
}
};
YAHOO.widget.AutoComplete.prototype._onIMEDetected=function(_49){
_49._enableIntervalDetection();
};
YAHOO.widget.AutoComplete.prototype._enableIntervalDetection=function(){
var _50=this._oTextbox.value;
var _51=this._sLastTextboxValue;
if(_50!=_51){
this._sLastTextboxValue=_50;
this._sendQuery(_50);
}
};
YAHOO.widget.AutoComplete.prototype._cancelIntervalDetection=function(_52){
if(_52._queryInterval){
clearInterval(_52._queryInterval);
}
};
YAHOO.widget.AutoComplete.prototype._onTextboxKeyUp=function(v,_53){
_53._initProps();
var _54=v.keyCode;
_53._nKeyCode=_54;
var _55=this.value;
if(_53._isIgnoreKey(_54)||(_55.toLowerCase()==_53._sCurQuery)){
return;
}else{
_53.textboxKeyEvent.fire(_53,_54);
}
if(_53.queryDelay>0){
var _56=setTimeout(function(){
_53._sendQuery(_55);
},(_53.queryDelay*1000));
if(_53._nDelayID!=-1){
clearTimeout(_53._nDelayID);
}
_53._nDelayID=_56;
}else{
_53._sendQuery(_55);
}
};
YAHOO.widget.AutoComplete.prototype._isIgnoreKey=function(_57){
if((_57==9)||(_57==13)||(_57==16)||(_57==17)||(_57>=18&&_57<=20)||(_57==27)||(_57>=33&&_57<=35)||(_57>=36&&_57<=38)||(_57==40)||(_57>=44&&_57<=45)){
return true;
}
return false;
};
YAHOO.widget.AutoComplete.prototype._onTextboxFocus=function(v,_58){
_58._oTextbox.setAttribute("autocomplete","off");
_58._bFocused=true;
_58.textboxFocusEvent.fire(_58);
};
YAHOO.widget.AutoComplete.prototype._onTextboxBlur=function(v,_59){
if(!_59._bOverContainer||(_59._nKeyCode==9)){
if(!_59._bItemSelected){
if(!_59._bContainerOpen||(_59._bContainerOpen&&!_59._textMatchesOption())){
if(_59.forceSelection){
_59._clearSelection();
}else{
_59.unmatchedItemSelectEvent.fire(_59,_59._sCurQuery);
}
}
}
if(_59._bContainerOpen){
_59._toggleContainer(false);
}
_59._cancelIntervalDetection(_59);
_59._bFocused=false;
_59.textboxBlurEvent.fire(_59);
}
};
YAHOO.widget.AutoComplete.prototype._onFormSubmit=function(v,_60){
if(_60.allowBrowserAutocomplete){
_60._oTextbox.setAttribute("autocomplete","on");
}else{
_60._oTextbox.setAttribute("autocomplete","off");
}
};
YAHOO.widget.AutoComplete.prototype._sendQuery=function(_61){
var _62=(this.delimChar)?this.delimChar:null;
if(_62){
var _63=-1;
for(var i=_62.length-1;i>=0;i--){
var _64=_61.lastIndexOf(_62[i]);
if(_64>_63){
_63=_64;
}
}
if(_62[i]==" "){
for(var j=_62.length-1;j>=0;j--){
if(_61[_63-1]==_62[j]){
_63--;
break;
}
}
}
if(_63>-1){
var _66=_63+1;
while(_61.charAt(_66)==" "){
_66+=1;
}
this._sSavedQuery=_61.substring(0,_66);
_61=_61.substr(_66);
}else{
if(_61.indexOf(this._sSavedQuery)<0){
this._sSavedQuery=null;
}
}
}
if(_61&&(_61.length<this.minQueryLength)){
if(this._nDelayID!=-1){
clearTimeout(this._nDelayID);
}
this._toggleContainer(false);
return;
}
_61=encodeURIComponent(_61);
this._nDelayID=-1;
this.dataRequestEvent.fire(this,_61);
this.dataSource.getResults(this._populateList,_61,this);
};
YAHOO.widget.AutoComplete.prototype._populateList=function(_67,_68,_69){
if(_68===null){
_69.dataErrorEvent.fire(_69,_67);
}
if(!_69._bFocused||!_68){
return;
}
var _70=(navigator.userAgent.toLowerCase().indexOf("opera")!=-1);
var _71=_69._oContainer._oContent.style;
_71.width=(!_70)?null:"";
_71.height=(!_70)?null:"";
var _72=decodeURIComponent(_67);
_69._sCurQuery=_72;
_69._bItemSelected=false;
if(_69._maxResultsDisplayed!=_69.maxResultsDisplayed){
_69._initList();
}
var _73=Math.min(_68.length,_69.maxResultsDisplayed);
_69._nDisplayedItems=_73;
if(_73>0){
_69._initContainerHelpers();
var _74=_69._aListItems;
for(var i=_73-1;i>=0;i--){
var _75=_74[i];
var _76=_68[i];
_75.innerHTML=_69.formatResult(_76,_72);
_75.style.display="list-item";
_75._sResultKey=_76[0];
_75._oResultData=_76;
}
for(var j=_74.length-1;j>=_73;j--){
var _77=_74[j];
_77.innerHTML=null;
_77.style.display="none";
_77._sResultKey=null;
_77._oResultData=null;
}
if(_69.autoHighlight){
var _78=_74[0];
_69._toggleHighlight(_78,"to");
_69.itemArrowToEvent.fire(_69,_78);
_69._typeAhead(_78,_67);
}else{
_69._oCurItem=null;
}
_69._toggleContainer(true);
}else{
_69._toggleContainer(false);
}
_69.dataReturnEvent.fire(_69,_67,_68);
};
YAHOO.widget.AutoComplete.prototype._clearSelection=function(){
var _79=this._oTextbox.value;
var _80=(this.delimChar)?this.delimChar[0]:null;
var _81=(_80)?_79.lastIndexOf(_80,_79.length-2):-1;
if(_81>-1){
this._oTextbox.value=_79.substring(0,_81);
}else{
this._oTextbox.value="";
}
this._sSavedQuery=this._oTextbox.value;
this.selectionEnforceEvent.fire(this);
};
YAHOO.widget.AutoComplete.prototype._textMatchesOption=function(){
var _82=false;
for(var i=this._nDisplayedItems-1;i>=0;i--){
var _83=this._aListItems[i];
var _84=_83._sResultKey.toLowerCase();
if(_84==this._sCurQuery.toLowerCase()){
_82=true;
break;
}
}
return (_82);
};
YAHOO.widget.AutoComplete.prototype._typeAhead=function(_85,_86){
if(!this.typeAhead){
return;
}
var _87=this._oTextbox;
var _88=this._oTextbox.value;
if(!_87.setSelectionRange&&!_87.createTextRange){
return;
}
var _89=_88.length;
this._updateValue(_85);
var _90=_87.value.length;
this._selectText(_87,_89,_90);
var _91=_87.value.substr(_89,_90);
this.typeAheadEvent.fire(this,_86,_91);
};
YAHOO.widget.AutoComplete.prototype._selectText=function(_92,_93,_94){
if(_92.setSelectionRange){
_92.setSelectionRange(_93,_94);
}else{
if(_92.createTextRange){
var _95=_92.createTextRange();
_95.moveStart("character",_93);
_95.moveEnd("character",_94-_92.value.length);
_95.select();
}else{
_92.select();
}
}
};
YAHOO.widget.AutoComplete.prototype._toggleContainerHelpers=function(_96){
var _97=false;
var _98=this._oContainer._oContent.offsetWidth+"px";
var _99=this._oContainer._oContent.offsetHeight+"px";
if(this.useIFrame&&this._oContainer._oIFrame){
_97=true;
if(_96){
this._oContainer._oIFrame.style.width=_98;
this._oContainer._oIFrame.style.height=_99;
}else{
this._oContainer._oIFrame.style.width=0;
this._oContainer._oIFrame.style.height=0;
}
}
if(this.useShadow&&this._oContainer._oShadow){
_97=true;
if(_96){
this._oContainer._oShadow.style.width=_98;
this._oContainer._oShadow.style.height=_99;
}else{
this._oContainer._oShadow.style.width=0;
this._oContainer._oShadow.style.height=0;
}
}
};
YAHOO.widget.AutoComplete.prototype._toggleContainer=function(_100){
var _101=this._oContainer;
if(this.alwaysShowContainer&&this._bContainerOpen){
return;
}
if(!_100){
this._oContainer._oContent.scrollTop=0;
var _102=this._aListItems;
if(_102&&(_102.length>0)){
for(var i=_102.length-1;i>=0;i--){
_102[i].style.display="none";
}
}
if(this._oCurItem){
this._toggleHighlight(this._oCurItem,"from");
}
this._oCurItem=null;
this._nDisplayedItems=0;
this._sCurQuery=null;
}
if(!_100&&!this._bContainerOpen){
_101._oContent.style.display="none";
return;
}
var _103=this._oAnim;
if(_103&&_103.getEl()&&(this.animHoriz||this.animVert)){
if(!_100){
this._toggleContainerHelpers(_100);
}
if(_103.isAnimated()){
_103.stop();
}
var _104=_101._oContent.cloneNode(true);
_101.appendChild(_104);
_104.style.top="-9000px";
_104.style.display="block";
var wExp=_104.offsetWidth;
var hExp=_104.offsetHeight;
var _107=(this.animHoriz)?0:wExp;
var _108=(this.animVert)?0:hExp;
_103.attributes=(_100)?{width:{to:wExp},height:{to:hExp}}:{width:{to:_107},height:{to:_108}};
if(_100&&!this._bContainerOpen){
_101._oContent.style.width=_107+"px";
_101._oContent.style.height=_108+"px";
}else{
_101._oContent.style.width=wExp+"px";
_101._oContent.style.height=hExp+"px";
}
_101.removeChild(_104);
_104=null;
var _109=this;
var _110=function(){
_103.onComplete.unsubscribeAll();
if(_100){
_109.containerExpandEvent.fire(_109);
}else{
_101._oContent.style.display="none";
_109.containerCollapseEvent.fire(_109);
}
_109._toggleContainerHelpers(_100);
};
_101._oContent.style.display="block";
_103.onComplete.subscribe(_110);
_103.animate();
this._bContainerOpen=_100;
}else{
if(_100){
_101._oContent.style.display="block";
this.containerExpandEvent.fire(this);
}else{
_101._oContent.style.display="none";
this.containerCollapseEvent.fire(this);
}
this._toggleContainerHelpers(_100);
this._bContainerOpen=_100;
}
};
YAHOO.widget.AutoComplete.prototype._toggleHighlight=function(_111,_112){
var _113=this.highlightClassName;
if(this._oCurItem){
YAHOO.util.Dom.removeClass(this._oCurItem,_113);
}
if((_112=="to")&&_113){
YAHOO.util.Dom.addClass(_111,_113);
this._oCurItem=_111;
}
};
YAHOO.widget.AutoComplete.prototype._togglePrehighlight=function(_114,_115){
if(_114==this._oCurItem){
return;
}
var _116=this.prehighlightClassName;
if((_115=="mouseover")&&_116){
YAHOO.util.Dom.addClass(_114,_116);
}else{
YAHOO.util.Dom.removeClass(_114,_116);
}
};
YAHOO.widget.AutoComplete.prototype._updateValue=function(_117){
var _118=this._oTextbox;
var _119=(this.delimChar)?(this.delimChar[0]||this.delimChar):null;
var _120=this._sSavedQuery;
var _121=_117._sResultKey;
_118.focus();
_118.value="";
if(_119){
if(_120){
_118.value=_120;
}
_118.value+=_121+_119;
if(_119!=" "){
_118.value+=" ";
}
}else{
_118.value=_121;
}
if(_118.type=="textarea"){
_118.scrollTop=_118.scrollHeight;
}
var end=_118.value.length;
this._selectText(_118,end,end);
this._oCurItem=_117;
};
YAHOO.widget.AutoComplete.prototype._selectItem=function(_123){
this._bItemSelected=true;
this._updateValue(_123);
this._cancelIntervalDetection(this);
this.itemSelectEvent.fire(this,_123,_123._oResultData);
this._toggleContainer(false);
};
YAHOO.widget.AutoComplete.prototype._jumpSelection=function(){
if(!this.typeAhead){
return;
}else{
this._toggleContainer(false);
}
};
YAHOO.widget.AutoComplete.prototype._moveSelection=function(_124){
if(this._bContainerOpen){
var _125=this._oCurItem;
var _126=-1;
if(_125){
_126=_125._nItemIndex;
}
var _127=(_124==40)?(_126+1):(_126-1);
if(_127<-2||_127>=this._nDisplayedItems){
return;
}
if(_125){
this._toggleHighlight(_125,"from");
this.itemArrowFromEvent.fire(this,_125);
}
if(_127==-1){
if(this.delimChar&&this._sSavedQuery){
if(!this._textMatchesOption()){
this._oTextbox.value=this._sSavedQuery;
}else{
this._oTextbox.value=this._sSavedQuery+this._sCurQuery;
}
}else{
this._oTextbox.value=this._sCurQuery;
}
this._oCurItem=null;
return;
}
if(_127==-2){
this._toggleContainer(false);
return;
}
var _128=this._aListItems[_127];
var _129=this._oContainer._oContent;
var _130=((YAHOO.util.Dom.getStyle(_129,"overflow")=="auto")||(YAHOO.util.Dom.getStyle(_129,"overflowY")=="auto"));
if(_130&&(_127>-1)&&(_127<this._nDisplayedItems)){
if(_124==40){
if((_128.offsetTop+_128.offsetHeight)>(_129.scrollTop+_129.offsetHeight)){
_129.scrollTop=(_128.offsetTop+_128.offsetHeight)-_129.offsetHeight;
}else{
if((_128.offsetTop+_128.offsetHeight)<_129.scrollTop){
_129.scrollTop=_128.offsetTop;
}
}
}else{
if(_128.offsetTop<_129.scrollTop){
this._oContainer._oContent.scrollTop=_128.offsetTop;
}else{
if(_128.offsetTop>(_129.scrollTop+_129.offsetHeight)){
this._oContainer._oContent.scrollTop=(_128.offsetTop+_128.offsetHeight)-_129.offsetHeight;
}
}
}
}
this._toggleHighlight(_128,"to");
this.itemArrowToEvent.fire(this,_128);
if(this.typeAhead){
this._updateValue(_128);
}
}
};
YAHOO.widget.DataSource=function(){
};
YAHOO.widget.DataSource.prototype.ERROR_DATANULL="Response data was null";
YAHOO.widget.DataSource.prototype.ERROR_DATAPARSE="Response data could not be parsed";
YAHOO.widget.DataSource.prototype.maxCacheEntries=15;
YAHOO.widget.DataSource.prototype.queryMatchContains=false;
YAHOO.widget.DataSource.prototype.queryMatchSubset=false;
YAHOO.widget.DataSource.prototype.queryMatchCase=false;
YAHOO.widget.DataSource.prototype.getName=function(){
return this._sName;
};
YAHOO.widget.DataSource.prototype.toString=function(){
return "DataSource "+this._sName;
};
YAHOO.widget.DataSource.prototype.getResults=function(_131,_132,_133){
var _134=this._doQueryCache(_131,_132,_133);
if(_134.length===0){
this.queryEvent.fire(this,_133,_132);
this.doQuery(_131,_132,_133);
}
};
YAHOO.widget.DataSource.prototype.doQuery=function(_135,_136,_137){
};
YAHOO.widget.DataSource.prototype.flushCache=function(){
if(this._aCache){
this._aCache=[];
}
if(this._aCacheHelper){
this._aCacheHelper=[];
}
this.cacheFlushEvent.fire(this);
};
YAHOO.widget.DataSource.prototype.queryEvent=null;
YAHOO.widget.DataSource.prototype.cacheQueryEvent=null;
YAHOO.widget.DataSource.prototype.getResultsEvent=null;
YAHOO.widget.DataSource.prototype.getCachedResultsEvent=null;
YAHOO.widget.DataSource.prototype.dataErrorEvent=null;
YAHOO.widget.DataSource.prototype.cacheFlushEvent=null;
YAHOO.widget.DataSource._nIndex=0;
YAHOO.widget.DataSource.prototype._sName=null;
YAHOO.widget.DataSource.prototype._aCache=null;
YAHOO.widget.DataSource.prototype._init=function(){
var _138=this.maxCacheEntries;
if(isNaN(_138)||(_138<0)){
_138=0;
}
if(_138>0&&!this._aCache){
this._aCache=[];
}
this._sName="instance"+YAHOO.widget.DataSource._nIndex;
YAHOO.widget.DataSource._nIndex++;
this.queryEvent=new YAHOO.util.CustomEvent("query",this);
this.cacheQueryEvent=new YAHOO.util.CustomEvent("cacheQuery",this);
this.getResultsEvent=new YAHOO.util.CustomEvent("getResults",this);
this.getCachedResultsEvent=new YAHOO.util.CustomEvent("getCachedResults",this);
this.dataErrorEvent=new YAHOO.util.CustomEvent("dataError",this);
this.cacheFlushEvent=new YAHOO.util.CustomEvent("cacheFlush",this);
};
YAHOO.widget.DataSource.prototype._addCacheElem=function(_139){
var _140=this._aCache;
if(!_140||!_139||!_139.query||!_139.results){
return;
}
if(_140.length>=this.maxCacheEntries){
_140.shift();
}
_140.push(_139);
};
YAHOO.widget.DataSource.prototype._doQueryCache=function(_141,_142,_143){
var _144=[];
var _145=false;
var _146=this._aCache;
var _147=(_146)?_146.length:0;
var _148=this.queryMatchContains;
if((this.maxCacheEntries>0)&&_146&&(_147>0)){
this.cacheQueryEvent.fire(this,_143,_142);
if(!this.queryMatchCase){
var _149=_142;
_142=_142.toLowerCase();
}
for(var i=_147-1;i>=0;i--){
var _150=_146[i];
var _151=_150.results;
var _152=(!this.queryMatchCase)?encodeURIComponent(_150.query).toLowerCase():encodeURIComponent(_150.query);
if(_152==_142){
_145=true;
_144=_151;
if(i!=_147-1){
_146.splice(i,1);
this._addCacheElem(_150);
}
break;
}else{
if(this.queryMatchSubset){
for(var j=_142.length-1;j>=0;j--){
var _153=_142.substr(0,j);
if(_152==_153){
_145=true;
for(var k=_151.length-1;k>=0;k--){
var _155=_151[k];
var _156=(this.queryMatchCase)?encodeURIComponent(_155[0]).indexOf(_142):encodeURIComponent(_155[0]).toLowerCase().indexOf(_142);
if((!_148&&(_156===0))||(_148&&(_156>-1))){
_144.unshift(_155);
}
}
_150={};
_150.query=_142;
_150.results=_144;
this._addCacheElem(_150);
break;
}
}
if(_145){
break;
}
}
}
}
if(_145){
this.getCachedResultsEvent.fire(this,_143,_149,_144);
_141(_149,_144,_143);
}
}
return _144;
};
YAHOO.widget.DS_XHR=function(_157,_158,_159){
if(typeof _159=="object"){
for(var _160 in _159){
this[_160]=_159[_160];
}
}
if(!_158||(_158.constructor!=Array)){
return;
}else{
this.schema=_158;
}
this.scriptURI=_157;
this._init();
};
YAHOO.widget.DS_XHR.prototype=new YAHOO.widget.DataSource();
YAHOO.widget.DS_XHR.prototype.TYPE_JSON=0;
YAHOO.widget.DS_XHR.prototype.TYPE_XML=1;
YAHOO.widget.DS_XHR.prototype.TYPE_FLAT=2;
YAHOO.widget.DS_XHR.prototype.ERROR_DATAXHR="XHR response failed";
YAHOO.widget.DS_XHR.prototype.connMgr=YAHOO.util.Connect;
YAHOO.widget.DS_XHR.prototype.connTimeout=0;
YAHOO.widget.DS_XHR.prototype.scriptURI=null;
YAHOO.widget.DS_XHR.prototype.scriptQueryParam="query";
YAHOO.widget.DS_XHR.prototype.scriptQueryAppend="";
YAHOO.widget.DS_XHR.prototype.responseType=YAHOO.widget.DS_XHR.prototype.TYPE_JSON;
YAHOO.widget.DS_XHR.prototype.responseStripAfter="\n<!--";
YAHOO.widget.DS_XHR.prototype.doQuery=function(_161,_162,_163){
var _164=(this.responseType==this.TYPE_XML);
var sUri=this.scriptURI+"?"+this.scriptQueryParam+"="+_162;
if(this.scriptQueryAppend.length>0){
sUri+="&"+this.scriptQueryAppend;
}
var _166=null;
var _167=this;
var _168=function(_169){
if(!_167._oConn||(_169.tId!=_167._oConn.tId)){
_167.dataErrorEvent.fire(_167,_163,_162,_167.ERROR_DATANULL);
return;
}
for(var foo in _169){
}
if(!_164){
_169=_169.responseText;
}else{
_169=_169.responseXML;
}
if(_169===null){
_167.dataErrorEvent.fire(_167,_163,_162,_167.ERROR_DATANULL);
return;
}
var _171=_167.parseResponse(_162,_169,_163);
var _172={};
_172.query=decodeURIComponent(_162);
_172.results=_171;
if(_171===null){
_167.dataErrorEvent.fire(_167,_163,_162,_167.ERROR_DATAPARSE);
return;
}else{
_167.getResultsEvent.fire(_167,_163,_162,_171);
_167._addCacheElem(_172);
_161(_162,_171,_163);
}
};
var _173=function(_174){
_167.dataErrorEvent.fire(_167,_163,_162,_167.ERROR_DATAXHR);
return;
};
var _175={success:_168,failure:_173};
if(!isNaN(this.connTimeout)&&this.connTimeout>0){
_175.timeout=this.connTimeout;
}
if(this._oConn){
this.connMgr.abort(this._oConn);
}
_167._oConn=this.connMgr.asyncRequest("GET",sUri,_175,null);
};
YAHOO.widget.DS_XHR.prototype.parseResponse=function(_176,_177,_178){
var _179=this.schema;
var _180=[];
var _181=false;
var nEnd=((this.responseStripAfter!=="")&&(_177.indexOf))?_177.indexOf(this.responseStripAfter):-1;
if(nEnd!=-1){
_177=_177.substring(0,nEnd);
}
switch(this.responseType){
case this.TYPE_JSON:
var _183;
if(window.JSON&&(navigator.userAgent.toLowerCase().indexOf("khtml")==-1)){
var _184=JSON.parse(_177);
if(!_184){
_181=true;
break;
}else{
_183=eval("jsonObjParsed."+_179[0]);
}
}else{
try{
while(_177.substring(0,1)==" "){
_177=_177.substring(1,_177.length);
}
if(_177.indexOf("{")<0){
_181=true;
break;
}
if(_177.indexOf("{}")===0){
break;
}
var _185=eval("("+_177+")");
if(!_185){
_181=true;
break;
}
_183=eval("(jsonObjRaw."+_179[0]+")");
}
catch(e){
_181=true;
break;
}
}
if(!_183){
_181=true;
break;
}
if(_183.constructor!=Array){
_183=[_183];
}
for(var i=_183.length-1;i>=0;i--){
var _186=[];
var _187=_183[i];
for(var j=_179.length-1;j>=1;j--){
var _188=_187[_179[j]];
if(!_188){
_188="";
}
_186.unshift(_188);
}
_180.unshift(_186);
}
break;
case this.TYPE_XML:
var _189=_177.getElementsByTagName(_179[0]);
if(!_189){
_181=true;
break;
}
for(var k=_189.length-1;k>=0;k--){
var _190=_189.item(k);
var _191=[];
for(var m=_179.length-1;m>=1;m--){
var _193=null;
var _194=_190.attributes.getNamedItem(_179[m]);
if(_194){
_193=_194.value;
}else{
var _195=_190.getElementsByTagName(_179[m]);
if(_195&&_195.item(0)&&_195.item(0).firstChild){
_193=_195.item(0).firstChild.nodeValue;
}else{
_193="";
}
}
_191.unshift(_193);
}
_180.unshift(_191);
}
break;
case this.TYPE_FLAT:
if(_177.length>0){
var _196=_177.length-_179[0].length;
if(_177.substr(_196)==_179[0]){
_177=_177.substr(0,_196);
}
var _197=_177.split(_179[0]);
for(var n=_197.length-1;n>=0;n--){
_180[n]=_197[n].split(_179[1]);
}
}
break;
default:
break;
}
_176=null;
_177=null;
_178=null;
if(_181){
return null;
}else{
return _180;
}
};
YAHOO.widget.DS_XHR.prototype._oConn=null;
YAHOO.widget.DS_JSFunction=function(_199,_200){
if(typeof _200=="object"){
for(var _201 in _200){
this[_201]=_200[_201];
}
}
if(!_199||(_199.constructor!=Function)){
return;
}else{
this.dataFunction=_199;
this._init();
}
};
YAHOO.widget.DS_JSFunction.prototype=new YAHOO.widget.DataSource();
YAHOO.widget.DS_JSFunction.prototype.dataFunction=null;
YAHOO.widget.DS_JSFunction.prototype.doQuery=function(_202,_203,_204){
var _205=this.dataFunction;
var _206=[];
_206=_205(_203);
if(_206===null){
this.dataErrorEvent.fire(this,_204,_203,this.ERROR_DATANULL);
return;
}
var _207={};
_207.query=decodeURIComponent(_203);
_207.results=_206;
this._addCacheElem(_207);
this.getResultsEvent.fire(this,_204,_203,_206);
_202(_203,_206,_204);
return;
};
YAHOO.widget.DS_JSArray=function(_208,_209){
if(typeof _209=="object"){
for(var _210 in _209){
this[_210]=_209[_210];
}
}
if(!_208||(_208.constructor!=Array)){
return;
}else{
this.data=_208;
this._init();
}
};
YAHOO.widget.DS_JSArray.prototype=new YAHOO.widget.DataSource();
YAHOO.widget.DS_JSArray.prototype.data=null;
YAHOO.widget.DS_JSArray.prototype.doQuery=function(_211,_212,_213){
var _214=this.data;
var _215=[];
var _216=false;
var _217=this.queryMatchContains;
if(!this.queryMatchCase){
_212=_212.toLowerCase();
}
for(var i=_214.length-1;i>=0;i--){
var _218=[];
if(_214[i]){
if(_214[i].constructor==String){
_218[0]=_214[i];
}else{
if(_214[i].constructor==Array){
_218=_214[i];
}
}
}
if(_218[0]&&(_218[0].constructor==String)){
var _219=(this.queryMatchCase)?encodeURIComponent(_218[0]).indexOf(_212):encodeURIComponent(_218[0]).toLowerCase().indexOf(_212);
if((!_217&&(_219===0))||(_217&&(_219>-1))){
_215.unshift(_218);
}
}
}
this.getResultsEvent.fire(this,_213,_212,_215);
_211(_212,_215,_213);
};

