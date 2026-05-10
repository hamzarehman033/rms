import"./chunk-XDKPAW3V.js";import{f as A}from"./chunk-VL6UG73I.js";import"./chunk-FPD563NF.js";import"./chunk-TW3Q4K36.js";import{n as ve,o as ke}from"./chunk-LEG2NN5S.js";import"./chunk-OFLOCURC.js";import{b as he}from"./chunk-AVCXGF4Z.js";import"./chunk-EZQX5YON.js";import{$ as me,Da as ge,P as ce,T as pe,aa as $,da as ue,p as S,q as N,ua as fe}from"./chunk-OH3YFB7M.js";import{c as ne,d as oe,e as F,f as re,g as ae,j as L,p as le,r as de,s as se,v as V}from"./chunk-2KE6EERX.js";import{$a as v,Ab as P,Bb as G,Cb as O,Db as T,Gb as J,Hb as a,Ia as Q,Ib as h,Jb as X,Ka as s,Kb as Y,N as K,O as D,Ob as Z,Pa as b,Pb as ee,Qb as I,T as q,Va as w,Wa as E,Z as f,Za as U,_ as g,_b as te,ba as z,bc as ie,fb as k,gb as c,ha as R,kb as _,mb as H,nb as W,ob as n,pb as o,qb as u,tb as B,ub as y,wb as C,xb as m}from"./chunk-NWPQPIQC.js";import"./chunk-GAL4ENT6.js";var we=["item"],Ee=["list"],_e=t=>({"p-disabled":t}),Oe=()=>({exact:!1}),ye=t=>({$implicit:t}),Te=(t,l)=>l.label;function Fe(t,l){if(t&1&&u(0,"span",13),t&2){let e=m(3).$implicit;c("ngClass",e.icon)("ngStyle",e.iconStyle)}}function Le(t,l){t&1&&B(0)}function Ve(t,l){if(t&1&&(n(0,"a",10),v(1,Fe,1,2,"span",11)(2,Le,1,0,"ng-container",12),o()),t&2){let e=m(2).$implicit,i=m();c("routerLink",e.routerLink)("queryParams",e.queryParams)("ngClass",I(17,_e,e.disabled))("routerLinkActiveOptions",e.routerLinkActiveOptions||ee(19,Oe))("target",e.target)("tooltipOptions",e.tooltipOptions)("fragment",e.fragment)("queryParamsHandling",e.queryParamsHandling)("preserveFragment",e.preserveFragment)("skipLocationChange",e.skipLocationChange)("replaceUrl",e.replaceUrl)("state",e.state),k("tabindex",e.disabled||i.readonly?null:e.tabindex?e.tabindex:"-1")("aria-hidden",!0),s(),c("ngIf",e.icon&&!i.itemTemplate&&!i._itemTemplate),s(),c("ngTemplateOutlet",i.itemTemplate||i.itemTemplate)("ngTemplateOutletContext",I(20,ye,e))}}function $e(t,l){if(t&1&&u(0,"span",13),t&2){let e=m(3).$implicit;c("ngClass",e.icon)("ngStyle",e.iconStyle)}}function Ae(t,l){t&1&&B(0)}function Me(t,l){if(t&1&&(n(0,"a",14),v(1,$e,1,2,"span",11)(2,Ae,1,0,"ng-container",12),o()),t&2){let e=m(2),i=e.$implicit,r=e.$index,d=m();c("tooltipPosition",i.tooltipPosition)("tooltipOptions",i.tooltipOptions)("ngClass",I(10,_e,i.disabled))("target",i.target),k("href",i.url||null,Q)("tabindex",i.disabled||r!==d.activeIndex&&d.readonly?null:i.tabindex?i.tabindex:"-1")("aria-hidden",!0),s(),c("ngIf",i.icon&&!d.itemTemplate&&!d._itemTemplate),s(),c("ngTemplateOutlet",d.itemTemplate||d._itemTemplate)("ngTemplateOutletContext",I(12,ye,i))}}function Re(t,l){if(t&1){let e=y();n(0,"li",7),C("click",function(r){f(e);let d=m().$implicit,p=m();return g(p.onItemClick(r,d))})("mouseenter",function(){f(e);let r=m().$index,d=m();return g(d.onItemMouseEnter(r))}),n(1,"div",8),v(2,Ve,3,22,"a",9)(3,Me,3,14,"ng-template",null,1,te),o()()}if(t&2){let e=J(4),i=m(),r=i.$implicit,d=i.$index,p=m();c("ngClass",p.itemClass(r,d)),k("id",p.getItemId(r,d))("aria-label",r.label)("aria-disabled",p.disabled(r))("data-pc-section","menuitem")("data-p-focused",p.isItemActive(p.getItemId(r,d)))("data-p-disabled",p.disabled(r)||!1),s(),k("data-pc-section","content"),s(),c("ngIf",p.isClickableRouterLink(r))("ngIfElse",e)}}function Be(t,l){if(t&1&&v(0,Re,5,10,"li",6),t&2){let e=l.$implicit;c("ngIf",e.visible!==!1)}}var Pe=({dt:t})=>`
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
`,Ne={root:({instance:t,props:l})=>["p-dock p-component",`p-dock-${l.position}`,{"p-dock-mobile":t.queryMatches}],listContainer:"p-dock-list-container",list:"p-dock-list",item:({instance:t,processedItem:l,id:e})=>["p-dock-item",{"p-focus":t.isItemActive(e),"p-disabled":t.disabled(l)}],itemContent:"p-dock-item-content",itemLink:"p-dock-item-link",itemIcon:"p-dock-item-icon"},xe=(()=>{class t extends ue{name="dock";theme=Pe;classes=Ne;static \u0275fac=(()=>{let e;return function(r){return(e||(e=z(t)))(r||t)}})();static \u0275prov=K({token:t,factory:t.\u0275fac})}return t})();var j=(()=>{class t extends fe{cd;id;style;styleClass;model=null;position="bottom";ariaLabel;ariaLabelledBy;onFocus=new R;onBlur=new R;listViewChild;currentIndex;tabindex=0;focused=!1;focusedOptionIndex=-1;_componentStyle=q(xe);get focusedOptionId(){return this.focusedOptionIndex!==-1?this.focusedOptionIndex:null}constructor(e){super(),this.cd=e,this.currentIndex=-3}ngOnInit(){super.ngOnInit(),this.id=this.id||pe("pn_id_")}itemTemplate;_itemTemplate;getItemId(e,i){return e&&e?.id?e.id:`${i}`}getItemProp(e,i){return e&&e.item?ce(e.item[i]):void 0}disabled(e){return typeof e.disabled=="function"?e.disabled():e.disabled}isItemActive(e){return e===this.focusedOptionIndex}onListMouseLeave(){this.currentIndex=-3,this.cd.markForCheck()}onItemMouseEnter(e){this.currentIndex=e,this.cd.markForCheck()}onItemClick(e,i){i.command&&i.command({originalEvent:e,item:i})}onListFocus(e){this.focused=!0,this.changeFocusedOptionIndex(0),this.onFocus.emit(e)}onListBlur(e){this.focused=!1,this.focusedOptionIndex=-1,this.onBlur.emit(e)}onListKeyDown(e){switch(e.code){case"ArrowDown":{(this.position==="left"||this.position==="right")&&this.onArrowDownKey(),e.preventDefault();break}case"ArrowUp":{(this.position==="left"||this.position==="right")&&this.onArrowUpKey(),e.preventDefault();break}case"ArrowRight":{(this.position==="top"||this.position==="bottom")&&this.onArrowDownKey(),e.preventDefault();break}case"ArrowLeft":{(this.position==="top"||this.position==="bottom")&&this.onArrowUpKey(),e.preventDefault();break}case"Home":{this.onHomeKey(),e.preventDefault();break}case"End":{this.onEndKey(),e.preventDefault();break}case"Enter":case"Space":{this.onSpaceKey(),e.preventDefault();break}default:break}}onArrowDownKey(){let e=this.findNextOptionIndex(this.focusedOptionIndex);this.changeFocusedOptionIndex(e)}onArrowUpKey(){let e=this.findPrevOptionIndex(this.focusedOptionIndex);this.changeFocusedOptionIndex(e)}onHomeKey(){this.changeFocusedOptionIndex(0)}onEndKey(){this.changeFocusedOptionIndex(S(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]').length-1)}onSpaceKey(){let e=N(this.listViewChild.nativeElement,`li[id="${`${this.focusedOptionIndex}`}"]`),i=e&&N(e,'[data-pc-section="action"]');i?i.click():e&&e.click()}findNextOptionIndex(e){let r=[...S(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]')].findIndex(d=>d.id===e);return r>-1?r+1:0}changeFocusedOptionIndex(e){let i=S(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]'),r=e>=i.length?i.length-1:e<0?0:e;this.focusedOptionIndex=i[r].getAttribute("id")}findPrevOptionIndex(e){let r=[...S(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]')].findIndex(d=>d.id===e);return r>-1?r-1:0}get containerClass(){return{[`p-dock p-component  p-dock-${this.position}`]:!0}}isClickableRouterLink(e){return e.routerLink&&!e.disabled}itemClass(e,i){return{"p-dock-item":!0,"p-focus":this.isItemActive(this.getItemId(e,i)),"p-disabled":this.disabled(e)}}templates;ngAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="item"?this._itemTemplate=e.template:this._itemTemplate=e.template})}static \u0275fac=function(i){return new(i||t)(b(ie))};static \u0275cmp=w({type:t,selectors:[["p-dock"]],contentQueries:function(i,r,d){if(i&1&&(P(d,we,5),P(d,me,4)),i&2){let p;O(p=T())&&(r.itemTemplate=p.first),O(p=T())&&(r.templates=p)}},viewQuery:function(i,r){if(i&1&&G(Ee,5),i&2){let d;O(d=T())&&(r.listViewChild=d.first)}},inputs:{id:"id",style:"style",styleClass:"styleClass",model:"model",position:"position",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy"},outputs:{onFocus:"onFocus",onBlur:"onBlur"},features:[Z([xe]),U],decls:6,vars:12,consts:[["list",""],["elseBlock",""],[3,"ngClass","ngStyle"],[1,"p-dock-list-container"],["role","menu",1,"p-dock-list",3,"focus","blur","keydown","mouseleave","tabindex"],["role","menuitem",3,"ngClass"],["role","menuitem",3,"ngClass","click","mouseenter",4,"ngIf"],["role","menuitem",3,"click","mouseenter","ngClass"],[1,"p-dock-item-content"],["pRipple","","class","p-dock-item-link","pTooltip","",3,"routerLink","queryParams","ngClass","routerLinkActiveOptions","target","tooltipOptions","fragment","queryParamsHandling","preserveFragment","skipLocationChange","replaceUrl","state",4,"ngIf","ngIfElse"],["pRipple","","pTooltip","",1,"p-dock-item-link",3,"routerLink","queryParams","ngClass","routerLinkActiveOptions","target","tooltipOptions","fragment","queryParamsHandling","preserveFragment","skipLocationChange","replaceUrl","state"],["class","p-dock-item-icon",3,"ngClass","ngStyle",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[1,"p-dock-item-icon",3,"ngClass","ngStyle"],["pRipple","","pTooltip","",1,"p-dock-item-link",3,"tooltipPosition","tooltipOptions","ngClass","target"]],template:function(i,r){if(i&1){let d=y();n(0,"div",2)(1,"div",3)(2,"ul",4,0),C("focus",function(x){return f(d),g(r.onListFocus(x))})("blur",function(x){return f(d),g(r.onListBlur(x))})("keydown",function(x){return f(d),g(r.onListKeyDown(x))})("mouseleave",function(){return f(d),g(r.onListMouseLeave())}),H(4,Be,1,1,"li",5,Te),o()()()}i&2&&(_(r.styleClass),c("ngClass",r.containerClass)("ngStyle",r.style),k("data-pc-name","dock"),s(2),c("tabindex",r.tabindex),k("id",r.id)("aria-orientation",r.position==="bottom"||r.position==="top"?"horizontal":"vertical")("aria-activedescendant",r.focused?r.focusedOptionId:void 0)("aria-label",r.ariaLabel)("aria-labelledby",r.ariaLabelledBy)("data-pc-section","menu"),s(2),W(r.model))},dependencies:[L,ne,F,ae,re,V,se,ge,ke,ve,$],encapsulation:2,changeDetection:0})}return t})(),Ce=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=E({type:t});static \u0275inj=D({imports:[j,$,$]})}return t})();function Ke(t,l){if(t&1){let e=y();n(0,"button",11),C("click",function(){let r=f(e).$implicit;return g(r.command())}),u(1,"i"),o()}if(t&2){let e=l.$implicit;c("title",e.label),s(),_(e.icon)}}function qe(t,l){if(t&1&&(n(0,"div")(1,"h2",7),a(2,"Live Data"),o(),n(3,"div",12)(4,"div",13)(5,"div",14),a(6,"Grid"),o(),n(7,"div",15),a(8),o(),n(9,"div",9),a(10,"Status: "),n(11,"span",16),a(12),o()()(),n(13,"div",13)(14,"div",14),a(15,"Solar"),o(),n(16,"div",17),a(17),o(),n(18,"div",9),a(19),o()(),n(20,"div",13)(21,"div",14),a(22,"Battery"),o(),n(23,"div",17),a(24),o(),n(25,"div",18),u(26,"div",19),o()(),n(27,"div",13)(28,"div",14),a(29,"Backup Runtime"),o(),n(30,"div",20),a(31),o()()()()),t&2){let e=m();s(8),h(e.liveData.grid.voltage),s(4),h(e.liveData.grid.status),s(5),h(e.liveData.solar.power),s(2),X("Today: ",e.liveData.solar.today,""),s(5),h(e.liveData.battery.soc),s(7),h(e.liveData.backup.remaining)}}function ze(t,l){if(t&1&&(n(0,"li",22),u(1,"i",23),n(2,"div",24)(3,"div",25),a(4),o(),n(5,"div",9),a(6),o()()()),t&2){let e=l.$implicit;s(),_(e.icon),s(3),h(e.title),s(2),Y("",e.device," \xB7 ",e.time,"")}}function Qe(t,l){if(t&1&&(n(0,"div")(1,"h2",7),a(2,"Site Alerts"),o(),n(3,"ul",8),v(4,ze,7,5,"li",21),o()()),t&2){let e=m();s(4),c("ngForOf",e.alerts)}}function Ue(t,l){t&1&&(n(0,"div")(1,"h2",7),a(2,"Site Devices"),o(),n(3,"div",8)(4,"div",26),u(5,"i",27),n(6,"div",28)(7,"div",29),a(8,"Power Cabinet Sensor"),o(),n(9,"div",30),a(10,"DV-001"),o()(),n(11,"span",31),a(12,"online"),o()(),n(13,"div",26),u(14,"i",32),n(15,"div",28)(16,"div",29),a(17,"Battery Monitor A"),o(),n(18,"div",30),a(19,"DV-002"),o()(),n(20,"span",31),a(21,"online"),o()(),n(22,"div",26),u(23,"i",33),n(24,"div",28)(25,"div",29),a(26,"Solar Panel Inverter"),o(),n(27,"div",30),a(28,"DV-003"),o()(),n(29,"span",31),a(30,"online"),o()()()())}function He(t,l){t&1&&(n(0,"div")(1,"h2",7),a(2,"Solar Output"),o(),n(3,"p",34),a(4,"System voltage, load & solar \xB7 24h"),o()())}function We(t,l){t&1&&(n(0,"div")(1,"h2",7),a(2,"Device Specifications"),o(),n(3,"div",35)(4,"div",36)(5,"h3",7),a(6,"Basic Information"),o(),n(7,"div",8)(8,"div")(9,"p",9),a(10,"Device Name"),o(),n(11,"p",10),a(12,"Tower A-1"),o()(),n(13,"div")(14,"p",9),a(15,"Device ID"),o(),n(16,"p",37),a(17,"DEV-2024-00147"),o()()()()()())}var M=class t{constructor(l,e){this.route=l;this.router=e}route;router;deviceId="";loading=!0;selectedSection="live-data";dockItems1=[{id:"live-data",label:"Live Data",icon:"pi pi-bolt",command:()=>this.selectSection("live-data")},{id:"alerts",label:"Alerts",icon:"pi pi-bell",command:()=>this.selectSection("alerts")},{id:"devices",label:"Devices",icon:"pi pi-server",command:()=>this.selectSection("devices")},{id:"charts",label:"Charts",icon:"pi pi-chart-line",command:()=>this.selectSection("charts")},{id:"specs",label:"Specs",icon:"pi pi-info-circle",command:()=>this.selectSection("specs")}];liveData={grid:{voltage:"230V",status:"ON",device:"GRIDG001"},solar:{current:"18.2A",power:"4.92kW",today:"28.4 kWh",peak:"6.1 kW"},battery:{current:"0A",soc:"100%"},backup:{available:"6.2 hrs",load:"5.16 kW",remaining:"1h 12m"}};alerts=[{id:1,icon:"pi pi-exclamation-circle-fill",title:"Solar Inverter Voltage Warning",device:"DV-003",time:"42 min ago",severity:"major"},{id:2,icon:"pi pi-info-circle-fill",title:"Firmware Update Available",device:"DV-001",time:"5 hrs ago",severity:"info"}];chartOptions=null;chartInitialized=!1;ngOnInit(){this.route.queryParams.subscribe(l=>{this.deviceId=l.id||"DV-001"})}selectSection(l){this.selectedSection=l,l==="charts"&&!this.chartInitialized&&(this.initializeChart(),this.chartInitialized=!0)}initializeChart(){this.chartOptions={xAxisData:["00:00","04:00","08:00","12:00","16:00","20:00","24:00"],seriesData:[{name:"Solar Output (kW)",data:[.2,1.5,4.2,6.1,4.8,1.2,.1],color:"#f59e0b"},{name:"System Load (kW)",data:[4.2,4,4.5,5.2,5.5,5,4.8],color:"#38bdf8"},{name:"Battery SoC (%)",data:[95,97,99,100,100,98,96],color:"#34d399"}],height:"300px",showLegend:!0,smooth:!0,showSymbol:!1}}static \u0275fac=function(e){return new(e||t)(b(le),b(de))};static \u0275cmp=w({type:t,selectors:[["app-device-detail"]],standalone:!1,decls:27,vars:7,consts:[[1,"content","p-0"],[1,"grid","grid-cols-3","gap-6","relative",2,"height","calc(100vh - 105px)"],[1,"col-span-2","flex","flex-col","gap-3"],[1,"col-span-1","bg-sidebar","border","border-sidebar-border","rounded-lg","p-4","h-100","sticky"],["styleClass","docker-outside",1,"docker-outside",3,"model","position"],[1,"mb-6","pb-6","border-b","border-sidebar-border"],[4,"ngIf"],[1,"text-sm","font-semibold","text-sidebar-foreground","uppercase","mb-3","opacity-75"],[1,"space-y-3"],[1,"text-xs","text-sidebar-foreground","opacity-60"],[1,"text-sidebar-foreground","font-medium"],[2,"background","none","border","none","cursor","pointer",3,"click","title"],[1,"grid","grid-cols-2","gap-3","mb-4"],[1,"bg-sidebar-accent","rounded","p-3"],[1,"text-xs","text-sidebar-foreground","opacity-60","mb-2"],[1,"text-sm","font-semibold","text-sidebar-foreground","mb-2"],[1,"text-green-400"],[1,"text-sm","font-semibold","text-sidebar-foreground","mb-1"],[1,"h-1","bg-sidebar","rounded-full","mt-2",2,"background","#273549"],[1,"h-full","bg-blue-500","rounded-full",2,"width","100%"],[1,"text-sm","font-semibold","text-sidebar-foreground"],["class","bg-sidebar-accent rounded p-3 flex gap-3",4,"ngFor","ngForOf"],[1,"bg-sidebar-accent","rounded","p-3","flex","gap-3"],[1,"text-yellow-400","text-lg","flex-shrink-0","mt-1"],[1,"flex-1","min-w-0"],[1,"font-medium","text-sidebar-foreground"],[1,"bg-sidebar-accent","rounded","p-3","flex","items-center","gap-3"],[1,"pi","pi-thermometer","text-blue-400"],[1,"flex-1"],[1,"text-sm","font-medium","text-sidebar-foreground"],[1,"text-xs","text-sidebar-foreground","opacity-60","font-mono"],[1,"text-xs","px-2","py-1","rounded-full","bg-green-900","text-green-200"],[1,"pi","pi-server","text-cyan-400"],[1,"pi","pi-sun","text-yellow-400"],[1,"text-xs","text-sidebar-foreground","opacity-60","mb-4"],[1,"space-y-4"],[1,"border-b","border-sidebar-border","pb-3"],[1,"text-sidebar-foreground","font-medium","font-mono","text-sm"]],template:function(e,i){e&1&&(n(0,"main",0)(1,"div",1)(2,"div",2),u(3,"app-device-view"),o(),n(4,"div",3)(5,"p-dock",4),v(6,Ke,2,3,"ng-template"),o(),n(7,"div",5),v(8,qe,32,6,"div",6)(9,Qe,5,1,"div",6)(10,Ue,31,0,"div",6)(11,He,5,0,"div",6)(12,We,18,0,"div",6),o(),n(13,"div",5)(14,"h3",7),a(15,"Location & Network"),o(),n(16,"div",8)(17,"div")(18,"p",9),a(19,"Location"),o(),n(20,"p",10),a(21,"North Building"),o()(),n(22,"div")(23,"p",9),a(24,"Firmware"),o(),n(25,"p",10),a(26,"v2.3.1"),o()()()()()()()),e&2&&(s(5),c("model",i.dockItems1)("position","left"),s(3),c("ngIf",i.selectedSection==="live-data"),s(),c("ngIf",i.selectedSection==="alerts"),s(),c("ngIf",i.selectedSection==="devices"),s(),c("ngIf",i.selectedSection==="charts"),s(),c("ngIf",i.selectedSection==="specs"))},dependencies:[oe,F,A,j],encapsulation:2})};var Ge=[{path:"",component:M}],Ie=class t{static \u0275fac=function(e){return new(e||t)};static \u0275mod=E({type:t});static \u0275inj=D({imports:[L,V.forChild(Ge),A,Ce,he]})};export{Ie as DeviceDetailModule};
