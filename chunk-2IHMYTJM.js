import"./chunk-XDKPAW3V.js";import{j as N}from"./chunk-IPBTDA4K.js";import{e as Le,i as $e}from"./chunk-GFJIDLHG.js";import{a as we}from"./chunk-O27EAETH.js";import"./chunk-GVNAU7XG.js";import"./chunk-CQ7L22MN.js";import"./chunk-DI5MLU66.js";import{o as Oe,p as Fe}from"./chunk-XWQXKHEW.js";import"./chunk-OFLOCURC.js";import"./chunk-LYXMIL4R.js";import{b as B}from"./chunk-GGKTCEW4.js";import"./chunk-BJSGUKNT.js";import"./chunk-SUB44GRF.js";import{b as Ie,d as Te,m as Ee}from"./chunk-GVY24IDO.js";import"./chunk-K7JRKT2Q.js";import{_ as _e,la as Se,s as I,t as U,va as Ce,wa as R}from"./chunk-XIFB4CKX.js";import{B as V,c as M,d as he,e as P,f as be,g as xe,j as ke,l as A,v as ye,y as De}from"./chunk-O6ITW7WA.js";import{$a as F,C as ee,Db as S,Eb as m,Ib as q,Jb as ce,K as T,Kb as L,La as oe,Lb as $,Na as s,Ob as de,P as te,Pb as l,Q as E,Qb as u,Rb as H,Sa as x,Sb as z,V as ie,Wb as pe,Xb as me,Yb as C,_a as O,aa as g,ba as h,cb as ae,ea as ne,eb as v,ec as ue,f as Y,gc as fe,hc as ve,ka as j,kb as k,lb as d,lc as ge,mb as re,pb as D,q as Z,rb as le,sb as se,tb as n,ub as a,vb as f,yb as W,zb as _}from"./chunk-7IO7J3XD.js";import"./chunk-WWX6BADO.js";var je=["item"],We=["list"],Ae=t=>({"p-disabled":t}),qe=()=>({exact:!1}),Ve=t=>({$implicit:t}),He=(t,o)=>o.label;function ze(t,o){if(t&1&&f(0,"span",13),t&2){let e=m(3).$implicit;d("ngClass",e.icon)("ngStyle",e.iconStyle)}}function Ue(t,o){t&1&&W(0)}function Qe(t,o){if(t&1&&(n(0,"a",10),v(1,ze,1,2,"span",11)(2,Ue,1,0,"ng-container",12),a()),t&2){let e=m(2).$implicit,i=m();d("routerLink",e.routerLink)("queryParams",e.queryParams)("ngClass",C(17,Ae,e.disabled))("routerLinkActiveOptions",e.routerLinkActiveOptions||me(19,qe))("target",e.target)("tooltipOptions",e.tooltipOptions)("fragment",e.fragment)("queryParamsHandling",e.queryParamsHandling)("preserveFragment",e.preserveFragment)("skipLocationChange",e.skipLocationChange)("replaceUrl",e.replaceUrl)("state",e.state),k("tabindex",e.disabled||i.readonly?null:e.tabindex?e.tabindex:"-1")("aria-hidden",!0),s(),d("ngIf",e.icon&&!i.itemTemplate&&!i._itemTemplate),s(),d("ngTemplateOutlet",i.itemTemplate||i.itemTemplate)("ngTemplateOutletContext",C(20,Ve,e))}}function Ge(t,o){if(t&1&&f(0,"span",13),t&2){let e=m(3).$implicit;d("ngClass",e.icon)("ngStyle",e.iconStyle)}}function Je(t,o){t&1&&W(0)}function Xe(t,o){if(t&1&&(n(0,"a",14),v(1,Ge,1,2,"span",11)(2,Je,1,0,"ng-container",12),a()),t&2){let e=m(2),i=e.$implicit,r=e.$index,c=m();d("tooltipPosition",i.tooltipPosition)("tooltipOptions",i.tooltipOptions)("ngClass",C(10,Ae,i.disabled))("target",i.target),k("href",i.url||null,oe)("tabindex",i.disabled||r!==c.activeIndex&&c.readonly?null:i.tabindex?i.tabindex:"-1")("aria-hidden",!0),s(),d("ngIf",i.icon&&!c.itemTemplate&&!c._itemTemplate),s(),d("ngTemplateOutlet",c.itemTemplate||c._itemTemplate)("ngTemplateOutletContext",C(12,Ve,i))}}function Ye(t,o){if(t&1){let e=_();n(0,"li",7),S("click",function(r){g(e);let c=m().$implicit,p=m();return h(p.onItemClick(r,c))})("mouseenter",function(){g(e);let r=m().$index,c=m();return h(c.onItemMouseEnter(r))}),n(1,"div",8),v(2,Qe,3,22,"a",9)(3,Xe,3,14,"ng-template",null,1,ve),a()()}if(t&2){let e=de(4),i=m(),r=i.$implicit,c=i.$index,p=m();d("ngClass",p.itemClass(r,c)),k("id",p.getItemId(r,c))("aria-label",r.label)("aria-disabled",p.disabled(r))("data-pc-section","menuitem")("data-p-focused",p.isItemActive(p.getItemId(r,c)))("data-p-disabled",p.disabled(r)||!1),s(),k("data-pc-section","content"),s(),d("ngIf",p.isClickableRouterLink(r))("ngIfElse",e)}}function Ze(t,o){if(t&1&&v(0,Ye,5,10,"li",6),t&2){let e=o.$implicit;d("ngIf",e.visible!==!1)}}var et=({dt:t})=>`
.p-dock {
    position: absolute;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
}

.p-dock-list-container {
    display: flex;
    pointer-events: auto;
    background: ${t("dock.background")};
    border: 1px solid ${t("dock.border.color")};
    padding: ${t("dock.padding")};
    border-radius: ${t("dock.border.radius")};
}

.p-dock-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: 0 none;
}

.p-dock-item {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
    padding: ${t("dock.item.padding")};
    border-radius: ${t("dock.item.border.radius")};
}

.p-dock-item.p-focus {
    box-shadow: ${t("dock.item.focus.ring.shadow")};
    outline: ${t("dock.item.focus.ring.width")} ${t("dock.item.focus.ring.style")} ${t("dock.item.focus.ring.color")};
    outline-offset: ${t("dock.item.focus.ring.offset")};
}

.p-dock-item-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: default;
    width: ${t("dock.item.size")};
    height: ${t("dock.item.size")};
}

.p-dock-top {
    left: 0;
    top: 0;
    width: 100%;
}

.p-dock-top .p-dock-item {
    transform-origin: center top;
}

.p-dock-bottom {
    left: 0;
    bottom: 0;
    width: 100%;
}

.p-dock-bottom .p-dock-item {
    transform-origin: center bottom;
}

.p-dock-right {
    right: 0;
    top: 0;
    height: 100%;
}

.p-dock-right:dir(rtl) {
    right: auto;
    left: 0;
}

.p-dock-right .p-dock-item {
    transform-origin: center right;
}

.p-dock-right .p-dock-list {
    flex-direction: column;
}

.p-dock-left {
    left: 0;
    top: 0;
    height: 100%;
}

.p-dock-left:dir(rtl) {
    left: auto;
    right: 0;
}

.p-dock-left .p-dock-item {
    transform-origin: center left;
}

.p-dock-left .p-dock-list {
    flex-direction: column;
}

.p-dock-mobile.p-dock-top .p-dock-list-container,
.p-dock-mobile.p-dock-bottom .p-dock-list-container {
    overflow-x: auto;
    width: 100%;
}
.p-dock-mobile.p-dock-top .p-dock-list-container .p-dock-list,
.p-dock-mobile.p-dock-bottom .p-dock-list-container .p-dock-list {
    margin: 0 auto;
}
.p-dock-mobile.p-dock-left .p-dock-list-container,
.p-dock-mobile.p-dock-right .p-dock-list-container {
    overflow-y: auto;
    height: 100%;
}
.p-dock-mobile.p-dock-left .p-dock-list-container .p-dock-list,
.p-dock-mobile.p-dock-right .p-dock-list-container .p-dock-list {
    margin: auto 0;
}
.p-dock-mobile .p-dock-list .p-dock-item {
    transform: none;
    margin: 0;
}
`,tt={root:({instance:t,props:o})=>["p-dock p-component",`p-dock-${o.position}`,{"p-dock-mobile":t.queryMatches}],listContainer:"p-dock-list-container",list:"p-dock-list",item:({instance:t,processedItem:o,id:e})=>["p-dock-item",{"p-focus":t.isItemActive(e),"p-disabled":t.disabled(o)}],itemContent:"p-dock-item-content",itemLink:"p-dock-item-link",itemIcon:"p-dock-item-icon"},Me=(()=>{class t extends Ie{name="dock";theme=et;classes=tt;static \u0275fac=(()=>{let e;return function(r){return(e||(e=ne(t)))(r||t)}})();static \u0275prov=te({token:t,factory:t.\u0275fac})}return t})();var Q=(()=>{class t extends Te{cd;id;style;styleClass;model=null;position="bottom";ariaLabel;ariaLabelledBy;onFocus=new j;onBlur=new j;listViewChild;currentIndex;tabindex=0;focused=!1;focusedOptionIndex=-1;_componentStyle=ie(Me);get focusedOptionId(){return this.focusedOptionIndex!==-1?this.focusedOptionIndex:null}constructor(e){super(),this.cd=e,this.currentIndex=-3}ngOnInit(){super.ngOnInit(),this.id=this.id||Se("pn_id_")}itemTemplate;_itemTemplate;getItemId(e,i){return e&&e?.id?e.id:`${i}`}getItemProp(e,i){return e&&e.item?_e(e.item[i]):void 0}disabled(e){return typeof e.disabled=="function"?e.disabled():e.disabled}isItemActive(e){return e===this.focusedOptionIndex}onListMouseLeave(){this.currentIndex=-3,this.cd.markForCheck()}onItemMouseEnter(e){this.currentIndex=e,this.cd.markForCheck()}onItemClick(e,i){i.command&&i.command({originalEvent:e,item:i})}onListFocus(e){this.focused=!0,this.changeFocusedOptionIndex(0),this.onFocus.emit(e)}onListBlur(e){this.focused=!1,this.focusedOptionIndex=-1,this.onBlur.emit(e)}onListKeyDown(e){switch(e.code){case"ArrowDown":{(this.position==="left"||this.position==="right")&&this.onArrowDownKey(),e.preventDefault();break}case"ArrowUp":{(this.position==="left"||this.position==="right")&&this.onArrowUpKey(),e.preventDefault();break}case"ArrowRight":{(this.position==="top"||this.position==="bottom")&&this.onArrowDownKey(),e.preventDefault();break}case"ArrowLeft":{(this.position==="top"||this.position==="bottom")&&this.onArrowUpKey(),e.preventDefault();break}case"Home":{this.onHomeKey(),e.preventDefault();break}case"End":{this.onEndKey(),e.preventDefault();break}case"Enter":case"Space":{this.onSpaceKey(),e.preventDefault();break}default:break}}onArrowDownKey(){let e=this.findNextOptionIndex(this.focusedOptionIndex);this.changeFocusedOptionIndex(e)}onArrowUpKey(){let e=this.findPrevOptionIndex(this.focusedOptionIndex);this.changeFocusedOptionIndex(e)}onHomeKey(){this.changeFocusedOptionIndex(0)}onEndKey(){this.changeFocusedOptionIndex(I(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]').length-1)}onSpaceKey(){let e=U(this.listViewChild.nativeElement,`li[id="${`${this.focusedOptionIndex}`}"]`),i=e&&U(e,'[data-pc-section="action"]');i?i.click():e&&e.click()}findNextOptionIndex(e){let r=[...I(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]')].findIndex(c=>c.id===e);return r>-1?r+1:0}changeFocusedOptionIndex(e){let i=I(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]'),r=e>=i.length?i.length-1:e<0?0:e;this.focusedOptionIndex=i[r].getAttribute("id")}findPrevOptionIndex(e){let r=[...I(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]')].findIndex(c=>c.id===e);return r>-1?r-1:0}get containerClass(){return{[`p-dock p-component  p-dock-${this.position}`]:!0}}isClickableRouterLink(e){return e.routerLink&&!e.disabled}itemClass(e,i){return{"p-dock-item":!0,"p-focus":this.isItemActive(this.getItemId(e,i)),"p-disabled":this.disabled(e)}}templates;ngAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="item"?this._itemTemplate=e.template:this._itemTemplate=e.template})}static \u0275fac=function(i){return new(i||t)(x(ge))};static \u0275cmp=O({type:t,selectors:[["p-dock"]],contentQueries:function(i,r,c){if(i&1&&(q(c,je,5),q(c,Ce,4)),i&2){let p;L(p=$())&&(r.itemTemplate=p.first),L(p=$())&&(r.templates=p)}},viewQuery:function(i,r){if(i&1&&ce(We,5),i&2){let c;L(c=$())&&(r.listViewChild=c.first)}},inputs:{id:"id",style:"style",styleClass:"styleClass",model:"model",position:"position",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy"},outputs:{onFocus:"onFocus",onBlur:"onBlur"},features:[pe([Me]),ae],decls:6,vars:12,consts:[["list",""],["elseBlock",""],[3,"ngClass","ngStyle"],[1,"p-dock-list-container"],["role","menu",1,"p-dock-list",3,"focus","blur","keydown","mouseleave","tabindex"],["role","menuitem",3,"ngClass"],["role","menuitem",3,"ngClass","click","mouseenter",4,"ngIf"],["role","menuitem",3,"click","mouseenter","ngClass"],[1,"p-dock-item-content"],["pRipple","","class","p-dock-item-link","pTooltip","",3,"routerLink","queryParams","ngClass","routerLinkActiveOptions","target","tooltipOptions","fragment","queryParamsHandling","preserveFragment","skipLocationChange","replaceUrl","state",4,"ngIf","ngIfElse"],["pRipple","","pTooltip","",1,"p-dock-item-link",3,"routerLink","queryParams","ngClass","routerLinkActiveOptions","target","tooltipOptions","fragment","queryParamsHandling","preserveFragment","skipLocationChange","replaceUrl","state"],["class","p-dock-item-icon",3,"ngClass","ngStyle",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[1,"p-dock-item-icon",3,"ngClass","ngStyle"],["pRipple","","pTooltip","",1,"p-dock-item-link",3,"tooltipPosition","tooltipOptions","ngClass","target"]],template:function(i,r){if(i&1){let c=_();n(0,"div",2)(1,"div",3)(2,"ul",4,0),S("focus",function(b){return g(c),h(r.onListFocus(b))})("blur",function(b){return g(c),h(r.onListBlur(b))})("keydown",function(b){return g(c),h(r.onListKeyDown(b))})("mouseleave",function(){return g(c),h(r.onListMouseLeave())}),le(4,Ze,1,1,"li",5,He),a()()()}i&2&&(D(r.styleClass),d("ngClass",r.containerClass)("ngStyle",r.style),k("data-pc-name","dock"),s(2),d("tabindex",r.tabindex),k("id",r.id)("aria-orientation",r.position==="bottom"||r.position==="top"?"horizontal":"vertical")("aria-activedescendant",r.focused?r.focusedOptionId:void 0)("aria-label",r.ariaLabel)("aria-labelledby",r.ariaLabelledBy)("data-pc-section","menu"),s(2),se(r.model))},dependencies:[A,M,P,xe,be,V,De,Ee,Fe,Oe,R],encapsulation:2,changeDetection:0})}return t})(),Re=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=F({type:t});static \u0275inj=E({imports:[Q,R,R]})}return t})();function nt(t,o){if(t&1){let e=_();n(0,"button",12),S("click",function(){let r=g(e).$implicit;return h(r.command())}),f(1,"i"),a()}if(t&2){let e=o.$implicit;d("title",e.label),s(),D(e.icon)}}function ot(t,o){if(t&1&&(n(0,"div",9),l(1," Last packet: "),n(2,"span",24),l(3),ue(4,"date"),a()()),t&2){let e=m(2);s(3),u(fe(4,1,e.lastPacketAt,"yyyy-MM-dd HH:mm:ss"))}}function at(t,o){if(t&1&&(n(0,"div")(1,"h2",7),l(2,"Live Data"),a(),n(3,"div",13),l(4),a(),n(5,"div",14)(6,"div",15)(7,"div",16),l(8,"Grid"),a(),n(9,"div",17),l(10),a(),n(11,"div",9),l(12,"Status: "),n(13,"span",18),l(14),a()()(),n(15,"div",15)(16,"div",16),l(17,"Solar"),a(),n(18,"div",19),l(19),a(),n(20,"div",9),l(21),a()(),n(22,"div",15)(23,"div",16),l(24,"Battery"),a(),n(25,"div",19),l(26),a(),n(27,"div",20),f(28,"div",21),a()(),n(29,"div",15)(30,"div",16),l(31,"Backup Runtime"),a(),n(32,"div",22),l(33),a()()(),v(34,ot,5,4,"div",23),a()),t&2){let e=m();s(4),u((e.selectedDeviceDetails==null?null:e.selectedDeviceDetails.rmsSubscribeTopic)||"-"),s(6),u(e.liveData.grid.voltage),s(4),u(e.liveData.grid.status),s(5),u(e.liveData.solar.power),s(2),H("Today: ",e.liveData.solar.today,""),s(5),u(e.liveData.battery.soc),s(2),re("width",e.liveData.battery.backupMins>0?100:0,"%"),s(5),u(e.liveData.backup.remaining),s(),d("ngIf",e.lastPacketAt)}}function rt(t,o){if(t&1&&(n(0,"li",26),f(1,"i",27),n(2,"div",28)(3,"div",29),l(4),a(),n(5,"div",9),l(6),a()()()),t&2){let e=o.$implicit;s(),D(e.icon),s(3),u(e.title),s(2),z("",e.device," \xB7 ",e.time,"")}}function lt(t,o){if(t&1&&(n(0,"div")(1,"h2",7),l(2,"Site Alerts"),a(),n(3,"ul",8),v(4,rt,7,5,"li",25),a()()),t&2){let e=m();s(4),d("ngForOf",e.alerts)}}function st(t,o){if(t&1&&(n(0,"div")(1,"h2",7),l(2,"Device Details"),a(),n(3,"div",8)(4,"div",30),f(5,"i",31),n(6,"div",32)(7,"div",33),l(8),a(),n(9,"div",34),l(10),a()(),n(11,"span",35),l(12),a()(),n(13,"div",30),f(14,"i",36),n(15,"div",32)(16,"div",33),l(17,"Manufacturer"),a(),n(18,"div",34),l(19),a()(),n(20,"span",37),l(21,"packet"),a()(),n(22,"div",30),f(23,"i",38),n(24,"div",32)(25,"div",33),l(26,"Model"),a(),n(27,"div",34),l(28),a()(),n(29,"span",37),l(30,"packet"),a()()()()),t&2){let e=m();s(8),u((e.selectedDeviceDetails==null?null:e.selectedDeviceDetails.name)||"-"),s(2),u((e.selectedDeviceDetails==null?null:e.selectedDeviceDetails.code)||"-"),s(),d("ngClass",e.isOperational?"bg-green-900 text-green-200":"bg-amber-900 text-amber-200"),s(),H(" ",e.isOperational?"online":"offline"," "),s(7),u(e.packetDeviceInfo.manufacturer||"-"),s(9),u(e.packetDeviceInfo.model||"-")}}function ct(t,o){if(t&1&&(n(0,"div")(1,"h2",7),l(2,"Solar Output"),a(),n(3,"p",39),l(4,"24-hour packet by portalReceiveTime hour"),a(),f(5,"app-line-chart",40),a()),t&2){let e=m();s(5),d("options",e.chartOptions)}}function dt(t,o){if(t&1&&(n(0,"div")(1,"h2",7),l(2,"Device Specifications"),a(),n(3,"div",41)(4,"div",42)(5,"h3",7),l(6,"Basic Information"),a(),n(7,"div",8)(8,"div")(9,"p",9),l(10,"Device Name"),a(),n(11,"p",10),l(12),a()(),n(13,"div")(14,"p",9),l(15,"Device ID"),a(),n(16,"p",43),l(17),a()(),n(18,"div")(19,"p",9),l(20,"Device Type"),a(),n(21,"p",10),l(22),a()(),n(23,"div")(24,"p",9),l(25,"Manufacturer / Model"),a(),n(26,"p",10),l(27),a()()()()()()),t&2){let e=m();s(12),u((e.selectedDeviceDetails==null?null:e.selectedDeviceDetails.name)||"-"),s(5),u((e.selectedDeviceDetails==null?null:e.selectedDeviceDetails.id)||"-"),s(5),u(e.packetDeviceInfo.deviceType||"-"),s(5),z("",e.packetDeviceInfo.manufacturer||"-"," / ",e.packetDeviceInfo.model||"-","")}}var w=class t{constructor(o,e,i,r){this.route=o;this.devicesService=e;this.signalrService=i;this.toastService=r;this.chartOptions=this.initChart()}route;devicesService;signalrService;toastService;deviceId=null;isLoadingDevice=!1;isOperational=!1;selectedDeviceDetails=null;lastPacketAt=null;peakSolarPowerKw=0;selectedSection="live-data";dockItems1=[{id:"live-data",label:"Live Data",icon:"pi pi-bolt",command:()=>this.selectSection("live-data")},{id:"alerts",label:"Alerts",icon:"pi pi-bell",command:()=>this.selectSection("alerts")},{id:"devices",label:"Devices",icon:"pi pi-server",command:()=>this.selectSection("devices")},{id:"charts",label:"Charts",icon:"pi pi-chart-line",command:()=>this.selectSection("charts")},{id:"specs",label:"Specs",icon:"pi pi-info-circle",command:()=>this.selectSection("specs")}];alerts=[{id:1,icon:"pi pi-exclamation-circle-fill",title:"Solar Inverter Voltage Warning",device:"DV-003",time:"42 min ago",severity:"major"},{id:2,icon:"pi pi-info-circle-fill",title:"Firmware Update Available",device:"DV-001",time:"5 hrs ago",severity:"info"}];liveData={grid:{voltage:"-",status:"-",device:"-"},solar:{current:"-",power:"-",today:"-",peak:"-"},battery:{current:"-",soc:"-",backupMins:0},backup:{available:"-",load:"-",remaining:"-"}};packetDeviceInfo={deviceType:"-",manufacturer:"-",model:"-",batteryStatus:"-",batteryRemainingPercent:"-",gensetAvailable:"-",gensetRunning:"-",gensetStartFailure:"-",gensetControlMode:"-",humidity:"-",temperature:"-"};chartOptions;hourlySolarKw=new Map;hourlySolarVoltage=new Map;destroy$=new Y;ngOnInit(){this.initializeRealtimeStream(),this.route.paramMap.pipe(Z(o=>o.get("id")),ee(),T(this.destroy$)).subscribe(o=>{if(!o){this.deviceId=null,this.isOperational=!1,this.selectedDeviceDetails=null,this.resetChartSeries();return}this.deviceId=o,this.loadDeviceDetails(o)})}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}selectSection(o){this.selectedSection=o}loadDeviceDetails(o){this.isLoadingDevice=!0,this.devicesService.getDeviceById(o).pipe(T(this.destroy$)).subscribe({next:e=>{let i=e?.data??e;this.selectedDeviceDetails=i??null,this.isOperational=!1,this.lastPacketAt=null,this.liveData.grid.device=this.selectedDeviceDetails?.code||this.selectedDeviceDetails?.name||"-",this.resetChartSeries(),this.isLoadingDevice=!1},error:()=>{this.isOperational=!1,this.selectedDeviceDetails=null,this.isLoadingDevice=!1,this.toastService.showError("Failed to load device details")}})}initializeRealtimeStream(){this.signalrService.onDeviceData$.pipe(T(this.destroy$)).subscribe(o=>{!o||!this.selectedDeviceDetails?.rmsSubscribeTopic||this.isPacketForSelectedTopic(o)&&this.applyPacketToLiveData(o)})}isPacketForSelectedTopic(o){let e=this.normalizeTopic(this.selectedDeviceDetails?.rmsSubscribeTopic),i=this.normalizeTopic(o.topic);return!!e&&!!i&&e===i}normalizeTopic(o){return(o??"").trim().toLowerCase()}applyPacketToLiveData(o){this.isOperational=!0;let e=o.decodedPayload??{},i=e?.portalReceiveTime??null,r=e.lineAVoltage,c=e.solarCurrent,p=e.solarPowerW,b=e.solarEnergyTodayWh,G=e.batteryCurrent,J=e.batteryRemainingPercent,K=e.batteryBackupTimeMin,X=e.dcLoadPowerW,y=p!==null?p/1e3:null;y!==null&&y>this.peakSolarPowerKw&&(this.peakSolarPowerKw=y),this.updateChartSeries(e,y),this.packetDeviceInfo={deviceType:e?.deviceType?String(e.deviceType):"-",manufacturer:e?.manufacturer?String(e.manufacturer):"-",model:e?.model?String(e.model):"-",batteryStatus:e?.batteryStatus?String(e.batteryStatus):"-",batteryRemainingPercent:e?.batteryRemainingPercent!==void 0&&e?.batteryRemainingPercent!==null?String(e.batteryRemainingPercent):"-",gensetAvailable:e?.gensetAvailable?String(e.gensetAvailable):"-",gensetRunning:e?.gensetRunning?String(e.gensetRunning):"-",gensetStartFailure:e?.gensetStartFailure?String(e.gensetStartFailure):"-",gensetControlMode:e?.gensetControlMode?String(e.gensetControlMode):"-",humidity:e?.humidity!==void 0&&e?.humidity!==null?String(e.humidity):"-",temperature:e?.ambientTemperature1!==void 0&&e?.ambientTemperature1!==null?String(e.ambientTemperature1):"-"},this.liveData={grid:{device:String(e.deviceId??this.selectedDeviceDetails?.code??this.selectedDeviceDetails?.name??"-"),voltage:r!==null?`${r}V`:"-",status:String(e.mainsAvailable??e.systemStatus??"-")},solar:{current:c!==null?`${c}A`:"-",power:y!==null?`${y.toFixed(2)} kW`:"-",today:b!==null?`${(b/1e3).toFixed(2)} kWh`:"-",peak:this.peakSolarPowerKw>0?`${this.peakSolarPowerKw.toFixed(2)} kW`:"-"},battery:{current:G!==null?`${G}A`:"-",soc:J!==null?`${J}%`:"-",backupMins:K??0},backup:{available:this.formatMinutesAsDuration(K),load:X!==null?`${(X/1e3).toFixed(2)} kW`:"-",remaining:this.formatMinutesAsDuration(K)}},this.lastPacketAt=i?String(i):null}updateChartSeries(o,e){let i=o.solarVoltage;if(e===null&&i===null)return;let r=this.parseDateCandidate(o?.portalReceiveTime);if(!r)return;let c=this.toHourStart(r).getTime();e!==null&&this.hourlySolarKw.set(c,Number(e.toFixed(2))),i!==null&&this.hourlySolarVoltage.set(c,Number(i.toFixed(2))),this.patchChartOptions()}resetChartSeries(){this.hourlySolarKw.clear(),this.hourlySolarVoltage.clear(),this.patchChartOptions()}patchChartOptions(){this.chartOptions={xAxisData:["00:00","04:00","08:00","12:00","16:00","20:00","24:00"],seriesData:[{name:"Solar Output (kW)",data:[.2,1.5,4.2,6.1,4.8,1.2,.1],color:"#f59e0b"},{name:"System Load (kW)",data:[4.2,4,4.5,5.2,5.5,5,4.8],color:"#38bdf8"},{name:"Battery SoC (%)",data:[95,97,99,100,100,98,96],color:"#34d399"}]}}parseDateCandidate(o){if(o==null||o==="")return null;let e=new Date(String(o));return Number.isNaN(e.getTime())?null:e}toHourStart(o){let e=new Date(o);return e.setMinutes(0,0,0),e}formatMinutesAsDuration(o){if(o===null||o<=0)return"-";let e=Math.round(o),i=Math.floor(e/60),r=e%60;return i<=0?`${r}m`:r<=0?`${i}h`:`${i}h ${r}m`}initChart(){return{xAxisData:[],seriesData:[{name:"Solar Output (kW)",data:[],color:"#f59e0b"},{name:"Solar Voltage (V)",data:[],color:"#38bdf8"}],height:"300px",showLegend:!0,smooth:!0,showSymbol:!1}}static \u0275fac=function(e){return new(e||t)(x(ye),x($e),x(Le),x(we))};static \u0275cmp=O({type:t,selectors:[["app-device-detail"]],standalone:!1,decls:32,vars:10,consts:[[1,"content","p-0"],[1,"grid","grid-cols-3","gap-6","relative",2,"height","calc(100vh - 105px)"],[1,"col-span-2","flex","flex-col","gap-3"],[1,"col-span-1","bg-sidebar","border","border-sidebar-border","rounded-lg","p-4","h-100","sticky"],["styleClass","docker-outside",1,"docker-outside",3,"model","position"],[1,"mb-6","pb-6","border-b","border-sidebar-border"],[4,"ngIf"],[1,"text-sm","font-semibold","text-sidebar-foreground","uppercase","mb-3","opacity-75"],[1,"space-y-3"],[1,"text-xs","text-sidebar-foreground","opacity-60"],[1,"text-sidebar-foreground","font-medium"],[1,"text-sidebar-foreground","font-medium","font-mono"],[2,"background","none","border","none","cursor","pointer",3,"click","title"],[1,"text-xs","text-sidebar-foreground","opacity-60","mb-3"],[1,"grid","grid-cols-2","gap-3","mb-4"],[1,"bg-sidebar-accent","rounded","p-3"],[1,"text-xs","text-sidebar-foreground","opacity-60","mb-2"],[1,"text-sm","font-semibold","text-sidebar-foreground","mb-2"],[1,"text-green-400"],[1,"text-sm","font-semibold","text-sidebar-foreground","mb-1"],[1,"h-1","bg-sidebar","rounded-full","mt-2",2,"background","#273549"],[1,"h-full","bg-blue-500","rounded-full"],[1,"text-sm","font-semibold","text-sidebar-foreground"],["class","text-xs text-sidebar-foreground opacity-60",4,"ngIf"],[1,"font-mono"],["class","bg-sidebar-accent rounded p-3 flex gap-3",4,"ngFor","ngForOf"],[1,"bg-sidebar-accent","rounded","p-3","flex","gap-3"],[1,"text-yellow-400","text-lg","flex-shrink-0","mt-1"],[1,"flex-1","min-w-0"],[1,"font-medium","text-sidebar-foreground"],[1,"bg-sidebar-accent","rounded","p-3","flex","items-center","gap-3"],[1,"pi","pi-thermometer","text-blue-400"],[1,"flex-1"],[1,"text-sm","font-medium","text-sidebar-foreground"],[1,"text-xs","text-sidebar-foreground","opacity-60","font-mono"],[1,"text-xs","px-2","py-1","rounded-full",3,"ngClass"],[1,"pi","pi-server","text-cyan-400"],[1,"text-xs","px-2","py-1","rounded-full","bg-blue-900","text-blue-200"],[1,"pi","pi-sun","text-yellow-400"],[1,"text-xs","text-sidebar-foreground","opacity-60","mb-4"],[3,"options"],[1,"space-y-4"],[1,"border-b","border-sidebar-border","pb-3"],[1,"text-sidebar-foreground","font-medium","font-mono","text-sm"]],template:function(e,i){e&1&&(n(0,"main",0)(1,"div",1)(2,"div",2),f(3,"app-device-view"),a(),n(4,"div",3)(5,"p-dock",4),v(6,nt,2,3,"ng-template"),a(),n(7,"div",5),v(8,at,35,10,"div",6)(9,lt,5,1,"div",6)(10,st,31,6,"div",6)(11,ct,6,1,"div",6)(12,dt,28,5,"div",6),a(),n(13,"div",5)(14,"h3",7),l(15,"Location & Network"),a(),n(16,"div",8)(17,"div")(18,"p",9),l(19,"Location"),a(),n(20,"p",10),l(21),a()(),n(22,"div")(23,"p",9),l(24,"MQTT Host"),a(),n(25,"p",10),l(26),a()(),n(27,"div")(28,"p",9),l(29,"RMS Topic"),a(),n(30,"p",11),l(31),a()()()()()()()),e&2&&(s(5),d("model",i.dockItems1)("position","left"),s(3),d("ngIf",i.selectedSection==="live-data"),s(),d("ngIf",i.selectedSection==="alerts"),s(),d("ngIf",i.selectedSection==="devices"),s(),d("ngIf",i.selectedSection==="charts"),s(),d("ngIf",i.selectedSection==="specs"),s(9),u((i.selectedDeviceDetails==null?null:i.selectedDeviceDetails.address)||"-"),s(5),u((i.selectedDeviceDetails==null?null:i.selectedDeviceDetails.mqttHost)||"-"),s(5),u((i.selectedDeviceDetails==null?null:i.selectedDeviceDetails.rmsSubscribeTopic)||"-"))},dependencies:[M,he,P,N,Q,B,ke],encapsulation:2})};var pt=[{path:"",component:w},{path:":id",component:w}],Be=class t{static \u0275fac=function(e){return new(e||t)};static \u0275mod=F({type:t});static \u0275inj=E({imports:[A,V.forChild(pt),N,Re,B]})};export{Be as DeviceDetailModule};
