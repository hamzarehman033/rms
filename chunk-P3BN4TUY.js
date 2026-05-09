import"./chunk-XDKPAW3V.js";import{f as M}from"./chunk-KBOYJ4EL.js";import"./chunk-5PYJUTW3.js";import"./chunk-WCMJY7B5.js";import{n as xe,o as he}from"./chunk-YRJF7KM4.js";import"./chunk-OFLOCURC.js";import{b as A}from"./chunk-TKRQPRJO.js";import"./chunk-EZQX5YON.js";import{$ as ue,Da as ge,P as me,T as pe,aa as $,da as fe,p as I,q as j,ua as ve}from"./chunk-GYJMF4RC.js";import{c as oe,d as re,e as F,f as ae,g as le,i as L,o as de,q as se,r as ce,u as V}from"./chunk-5FUYYEDJ.js";import{$a as f,Ab as P,Bb as J,Cb as O,Db as T,Gb as X,Hb as r,Ia as Q,Ib as h,Jb as Y,Ka as s,Kb as Z,N as q,O as D,Ob as ee,Pa as b,Pb as te,Qb as C,T as z,Va as E,Wa as w,Z as v,Za as H,_ as g,_b as ie,ba as U,bc as ne,fb as x,gb as c,ha as R,kb as _,mb as W,nb as G,ob as i,pb as n,qb as u,tb as N,ub as y,wb as S,xb as p}from"./chunk-NWPQPIQC.js";import"./chunk-GAL4ENT6.js";var Ee=["item"],we=["list"],_e=t=>({"p-disabled":t}),Oe=()=>({exact:!1}),ye=t=>({$implicit:t}),Te=(t,l)=>l.label;function Fe(t,l){if(t&1&&u(0,"span",13),t&2){let e=p(3).$implicit;c("ngClass",e.icon)("ngStyle",e.iconStyle)}}function Le(t,l){t&1&&N(0)}function Ve(t,l){if(t&1&&(i(0,"a",10),f(1,Fe,1,2,"span",11)(2,Le,1,0,"ng-container",12),n()),t&2){let e=p(2).$implicit,o=p();c("routerLink",e.routerLink)("queryParams",e.queryParams)("ngClass",C(17,_e,e.disabled))("routerLinkActiveOptions",e.routerLinkActiveOptions||te(19,Oe))("target",e.target)("tooltipOptions",e.tooltipOptions)("fragment",e.fragment)("queryParamsHandling",e.queryParamsHandling)("preserveFragment",e.preserveFragment)("skipLocationChange",e.skipLocationChange)("replaceUrl",e.replaceUrl)("state",e.state),x("tabindex",e.disabled||o.readonly?null:e.tabindex?e.tabindex:"-1")("aria-hidden",!0),s(),c("ngIf",e.icon&&!o.itemTemplate&&!o._itemTemplate),s(),c("ngTemplateOutlet",o.itemTemplate||o.itemTemplate)("ngTemplateOutletContext",C(20,ye,e))}}function $e(t,l){if(t&1&&u(0,"span",13),t&2){let e=p(3).$implicit;c("ngClass",e.icon)("ngStyle",e.iconStyle)}}function Ae(t,l){t&1&&N(0)}function Me(t,l){if(t&1&&(i(0,"a",14),f(1,$e,1,2,"span",11)(2,Ae,1,0,"ng-container",12),n()),t&2){let e=p(2),o=e.$implicit,a=e.$index,d=p();c("tooltipPosition",o.tooltipPosition)("tooltipOptions",o.tooltipOptions)("ngClass",C(10,_e,o.disabled))("target",o.target),x("href",o.url||null,Q)("tabindex",o.disabled||a!==d.activeIndex&&d.readonly?null:o.tabindex?o.tabindex:"-1")("aria-hidden",!0),s(),c("ngIf",o.icon&&!d.itemTemplate&&!d._itemTemplate),s(),c("ngTemplateOutlet",d.itemTemplate||d._itemTemplate)("ngTemplateOutletContext",C(12,ye,o))}}function Be(t,l){if(t&1){let e=y();i(0,"li",7),S("click",function(a){v(e);let d=p().$implicit,m=p();return g(m.onItemClick(a,d))})("mouseenter",function(){v(e);let a=p().$index,d=p();return g(d.onItemMouseEnter(a))}),i(1,"div",8),f(2,Ve,3,22,"a",9)(3,Me,3,14,"ng-template",null,1,ie),n()()}if(t&2){let e=X(4),o=p(),a=o.$implicit,d=o.$index,m=p();c("ngClass",m.itemClass(a,d)),x("id",m.getItemId(a,d))("aria-label",a.label)("aria-disabled",m.disabled(a))("data-pc-section","menuitem")("data-p-focused",m.isItemActive(m.getItemId(a,d)))("data-p-disabled",m.disabled(a)||!1),s(),x("data-pc-section","content"),s(),c("ngIf",m.isClickableRouterLink(a))("ngIfElse",e)}}function Re(t,l){if(t&1&&f(0,Be,5,10,"li",6),t&2){let e=l.$implicit;c("ngIf",e.visible!==!1)}}var Ne=({dt:t})=>`
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
`,Pe={root:({instance:t,props:l})=>["p-dock p-component",`p-dock-${l.position}`,{"p-dock-mobile":t.queryMatches}],listContainer:"p-dock-list-container",list:"p-dock-list",item:({instance:t,processedItem:l,id:e})=>["p-dock-item",{"p-focus":t.isItemActive(e),"p-disabled":t.disabled(l)}],itemContent:"p-dock-item-content",itemLink:"p-dock-item-link",itemIcon:"p-dock-item-icon"},ke=(()=>{class t extends fe{name="dock";theme=Ne;classes=Pe;static \u0275fac=(()=>{let e;return function(a){return(e||(e=U(t)))(a||t)}})();static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var K=(()=>{class t extends ve{cd;id;style;styleClass;model=null;position="bottom";ariaLabel;ariaLabelledBy;onFocus=new R;onBlur=new R;listViewChild;currentIndex;tabindex=0;focused=!1;focusedOptionIndex=-1;_componentStyle=z(ke);get focusedOptionId(){return this.focusedOptionIndex!==-1?this.focusedOptionIndex:null}constructor(e){super(),this.cd=e,this.currentIndex=-3}ngOnInit(){super.ngOnInit(),this.id=this.id||pe("pn_id_")}itemTemplate;_itemTemplate;getItemId(e,o){return e&&e?.id?e.id:`${o}`}getItemProp(e,o){return e&&e.item?me(e.item[o]):void 0}disabled(e){return typeof e.disabled=="function"?e.disabled():e.disabled}isItemActive(e){return e===this.focusedOptionIndex}onListMouseLeave(){this.currentIndex=-3,this.cd.markForCheck()}onItemMouseEnter(e){this.currentIndex=e,this.cd.markForCheck()}onItemClick(e,o){o.command&&o.command({originalEvent:e,item:o})}onListFocus(e){this.focused=!0,this.changeFocusedOptionIndex(0),this.onFocus.emit(e)}onListBlur(e){this.focused=!1,this.focusedOptionIndex=-1,this.onBlur.emit(e)}onListKeyDown(e){switch(e.code){case"ArrowDown":{(this.position==="left"||this.position==="right")&&this.onArrowDownKey(),e.preventDefault();break}case"ArrowUp":{(this.position==="left"||this.position==="right")&&this.onArrowUpKey(),e.preventDefault();break}case"ArrowRight":{(this.position==="top"||this.position==="bottom")&&this.onArrowDownKey(),e.preventDefault();break}case"ArrowLeft":{(this.position==="top"||this.position==="bottom")&&this.onArrowUpKey(),e.preventDefault();break}case"Home":{this.onHomeKey(),e.preventDefault();break}case"End":{this.onEndKey(),e.preventDefault();break}case"Enter":case"Space":{this.onSpaceKey(),e.preventDefault();break}default:break}}onArrowDownKey(){let e=this.findNextOptionIndex(this.focusedOptionIndex);this.changeFocusedOptionIndex(e)}onArrowUpKey(){let e=this.findPrevOptionIndex(this.focusedOptionIndex);this.changeFocusedOptionIndex(e)}onHomeKey(){this.changeFocusedOptionIndex(0)}onEndKey(){this.changeFocusedOptionIndex(I(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]').length-1)}onSpaceKey(){let e=j(this.listViewChild.nativeElement,`li[id="${`${this.focusedOptionIndex}`}"]`),o=e&&j(e,'[data-pc-section="action"]');o?o.click():e&&e.click()}findNextOptionIndex(e){let a=[...I(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]')].findIndex(d=>d.id===e);return a>-1?a+1:0}changeFocusedOptionIndex(e){let o=I(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]'),a=e>=o.length?o.length-1:e<0?0:e;this.focusedOptionIndex=o[a].getAttribute("id")}findPrevOptionIndex(e){let a=[...I(this.listViewChild.nativeElement,'li[data-pc-section="menuitem"][data-p-disabled="false"]')].findIndex(d=>d.id===e);return a>-1?a-1:0}get containerClass(){return{[`p-dock p-component  p-dock-${this.position}`]:!0}}isClickableRouterLink(e){return e.routerLink&&!e.disabled}itemClass(e,o){return{"p-dock-item":!0,"p-focus":this.isItemActive(this.getItemId(e,o)),"p-disabled":this.disabled(e)}}templates;ngAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="item"?this._itemTemplate=e.template:this._itemTemplate=e.template})}static \u0275fac=function(o){return new(o||t)(b(ne))};static \u0275cmp=E({type:t,selectors:[["p-dock"]],contentQueries:function(o,a,d){if(o&1&&(P(d,Ee,5),P(d,ue,4)),o&2){let m;O(m=T())&&(a.itemTemplate=m.first),O(m=T())&&(a.templates=m)}},viewQuery:function(o,a){if(o&1&&J(we,5),o&2){let d;O(d=T())&&(a.listViewChild=d.first)}},inputs:{id:"id",style:"style",styleClass:"styleClass",model:"model",position:"position",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy"},outputs:{onFocus:"onFocus",onBlur:"onBlur"},features:[ee([ke]),H],decls:6,vars:12,consts:[["list",""],["elseBlock",""],[3,"ngClass","ngStyle"],[1,"p-dock-list-container"],["role","menu",1,"p-dock-list",3,"focus","blur","keydown","mouseleave","tabindex"],["role","menuitem",3,"ngClass"],["role","menuitem",3,"ngClass","click","mouseenter",4,"ngIf"],["role","menuitem",3,"click","mouseenter","ngClass"],[1,"p-dock-item-content"],["pRipple","","class","p-dock-item-link","pTooltip","",3,"routerLink","queryParams","ngClass","routerLinkActiveOptions","target","tooltipOptions","fragment","queryParamsHandling","preserveFragment","skipLocationChange","replaceUrl","state",4,"ngIf","ngIfElse"],["pRipple","","pTooltip","",1,"p-dock-item-link",3,"routerLink","queryParams","ngClass","routerLinkActiveOptions","target","tooltipOptions","fragment","queryParamsHandling","preserveFragment","skipLocationChange","replaceUrl","state"],["class","p-dock-item-icon",3,"ngClass","ngStyle",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[1,"p-dock-item-icon",3,"ngClass","ngStyle"],["pRipple","","pTooltip","",1,"p-dock-item-link",3,"tooltipPosition","tooltipOptions","ngClass","target"]],template:function(o,a){if(o&1){let d=y();i(0,"div",2)(1,"div",3)(2,"ul",4,0),S("focus",function(k){return v(d),g(a.onListFocus(k))})("blur",function(k){return v(d),g(a.onListBlur(k))})("keydown",function(k){return v(d),g(a.onListKeyDown(k))})("mouseleave",function(){return v(d),g(a.onListMouseLeave())}),W(4,Re,1,1,"li",5,Te),n()()()}o&2&&(_(a.styleClass),c("ngClass",a.containerClass)("ngStyle",a.style),x("data-pc-name","dock"),s(2),c("tabindex",a.tabindex),x("id",a.id)("aria-orientation",a.position==="bottom"||a.position==="top"?"horizontal":"vertical")("aria-activedescendant",a.focused?a.focusedOptionId:void 0)("aria-label",a.ariaLabel)("aria-labelledby",a.ariaLabelledBy)("data-pc-section","menu"),s(2),G(a.model))},dependencies:[L,oe,F,le,ae,V,ce,ge,he,xe,$],encapsulation:2,changeDetection:0})}return t})(),Se=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=w({type:t});static \u0275inj=D({imports:[K,$,$]})}return t})();function Ke(t,l){if(t&1){let e=y();i(0,"button",18),S("click",function(){let a=v(e).$implicit;return g(a.command())}),u(1,"i"),n()}if(t&2){let e=l.$implicit;c("title",e.label),s(),_(e.icon)}}function qe(t,l){if(t&1&&(i(0,"div")(1,"h2",14),r(2,"Live Data"),n(),i(3,"div",19)(4,"div",20)(5,"div",21),r(6,"Grid"),n(),i(7,"div",22),r(8),n(),i(9,"div",16),r(10,"Status: "),i(11,"span",23),r(12),n()()(),i(13,"div",20)(14,"div",21),r(15,"Solar"),n(),i(16,"div",24),r(17),n(),i(18,"div",16),r(19),n()(),i(20,"div",20)(21,"div",21),r(22,"Battery"),n(),i(23,"div",24),r(24),n(),i(25,"div",25),u(26,"div",26),n()(),i(27,"div",20)(28,"div",21),r(29,"Backup Runtime"),n(),i(30,"div",27),r(31),n()()()()),t&2){let e=p();s(8),h(e.liveData.grid.voltage),s(4),h(e.liveData.grid.status),s(5),h(e.liveData.solar.power),s(2),Y("Today: ",e.liveData.solar.today,""),s(5),h(e.liveData.battery.soc),s(7),h(e.liveData.backup.remaining)}}function ze(t,l){if(t&1&&(i(0,"li",29),u(1,"i",30),i(2,"div",31)(3,"div",32),r(4),n(),i(5,"div",16),r(6),n()()()),t&2){let e=l.$implicit;s(),_(e.icon),s(3),h(e.title),s(2),Z("",e.device," \xB7 ",e.time,"")}}function Ue(t,l){if(t&1&&(i(0,"div")(1,"h2",14),r(2,"Site Alerts"),n(),i(3,"ul",15),f(4,ze,7,5,"li",28),n()()),t&2){let e=p();s(4),c("ngForOf",e.alerts)}}function Qe(t,l){t&1&&(i(0,"div")(1,"h2",14),r(2,"Site Devices"),n(),i(3,"div",15)(4,"div",33),u(5,"i",34),i(6,"div",35)(7,"div",36),r(8,"Power Cabinet Sensor"),n(),i(9,"div",37),r(10,"DV-001"),n()(),i(11,"span",38),r(12,"online"),n()(),i(13,"div",33),u(14,"i",39),i(15,"div",35)(16,"div",36),r(17,"Battery Monitor A"),n(),i(18,"div",37),r(19,"DV-002"),n()(),i(20,"span",38),r(21,"online"),n()(),i(22,"div",33),u(23,"i",40),i(24,"div",35)(25,"div",36),r(26,"Solar Panel Inverter"),n(),i(27,"div",37),r(28,"DV-003"),n()(),i(29,"span",38),r(30,"online"),n()()()())}function He(t,l){if(t&1&&(i(0,"div"),u(1,"app-line-chart",42),n()),t&2){let e=p(2);s(),c("options",e.chartOptions)}}function We(t,l){if(t&1&&(i(0,"div")(1,"h2",14),r(2,"Solar Output"),n(),i(3,"p",41),r(4,"System voltage, load & solar \xB7 24h"),n(),f(5,He,2,1,"div",13),n()),t&2){let e=p();s(5),c("ngIf",e.chartOptions)}}function Ge(t,l){t&1&&(i(0,"div")(1,"h2",14),r(2,"Device Specifications"),n(),i(3,"div",43)(4,"div",44)(5,"h3",14),r(6,"Basic Information"),n(),i(7,"div",15)(8,"div")(9,"p",16),r(10,"Device Name"),n(),i(11,"p",17),r(12,"Tower A-1"),n()(),i(13,"div")(14,"p",16),r(15,"Device ID"),n(),i(16,"p",45),r(17,"DEV-2024-00147"),n()()()(),i(18,"div",44)(19,"h3",14),r(20,"Location & Network"),n(),i(21,"div",15)(22,"div")(23,"p",16),r(24,"Location"),n(),i(25,"p",17),r(26,"North Building"),n()(),i(27,"div")(28,"p",16),r(29,"Firmware"),n(),i(30,"p",17),r(31,"v2.3.1"),n()()()()()())}var B=class t{constructor(l,e){this.route=l;this.router=e}route;router;deviceId="";loading=!0;selectedSection="live-data";dockItems1=[{id:"live-data",label:"Live Data",icon:"pi pi-bolt",command:()=>this.selectSection("live-data")},{id:"alerts",label:"Alerts",icon:"pi pi-bell",command:()=>this.selectSection("alerts")},{id:"devices",label:"Devices",icon:"pi pi-server",command:()=>this.selectSection("devices")},{id:"charts",label:"Charts",icon:"pi pi-chart-line",command:()=>this.selectSection("charts")},{id:"specs",label:"Specs",icon:"pi pi-info-circle",command:()=>this.selectSection("specs")}];liveData={grid:{voltage:"230V",status:"ON",device:"GRIDG001"},solar:{current:"18.2A",power:"4.92kW",today:"28.4 kWh",peak:"6.1 kW"},battery:{current:"0A",soc:"100%"},backup:{available:"6.2 hrs",load:"5.16 kW",remaining:"1h 12m"}};alerts=[{id:1,icon:"pi pi-exclamation-circle-fill",title:"Solar Inverter Voltage Warning",device:"DV-003",time:"42 min ago",severity:"major"},{id:2,icon:"pi pi-info-circle-fill",title:"Firmware Update Available",device:"DV-001",time:"5 hrs ago",severity:"info"}];chartOptions=null;chartInitialized=!1;ngOnInit(){this.route.queryParams.subscribe(l=>{this.deviceId=l.id||"DV-001"})}selectSection(l){this.selectedSection=l,l==="charts"&&!this.chartInitialized&&(this.initializeChart(),this.chartInitialized=!0)}initializeChart(){this.chartOptions={xAxisData:["00:00","04:00","08:00","12:00","16:00","20:00","24:00"],seriesData:[{name:"Solar Output (kW)",data:[.2,1.5,4.2,6.1,4.8,1.2,.1],color:"#f59e0b"},{name:"System Load (kW)",data:[4.2,4,4.5,5.2,5.5,5,4.8],color:"#38bdf8"},{name:"Battery SoC (%)",data:[95,97,99,100,100,98,96],color:"#34d399"}],height:"300px",showLegend:!0,smooth:!0,showSymbol:!1}}static \u0275fac=function(e){return new(e||t)(b(de),b(se))};static \u0275cmp=E({type:t,selectors:[["app-device-detail"]],standalone:!1,decls:66,vars:7,consts:[[1,"content","p-0"],[1,"grid","grid-cols-3","gap-6","relative",2,"height","calc(100vh - 105px)"],[1,"col-span-2","flex","flex-col","gap-3"],[1,"grid","grid-cols-4","gap-3",2,"position","absolute","bottom","0px"],[1,"stat"],[1,"row"],[1,"label"],[1,"text-lg","font-medium","mb-1"],[1,"hint"],[1,"text-xs","text-success","ml-2"],[1,"col-span-1","bg-sidebar","border","border-sidebar-border","rounded-lg","p-4","h-100","sticky"],["styleClass","docker-outside",1,"docker-outside",3,"model","position"],[1,"mb-6","pb-6","border-b","border-sidebar-border"],[4,"ngIf"],[1,"text-sm","font-semibold","text-sidebar-foreground","uppercase","mb-3","opacity-75"],[1,"space-y-3"],[1,"text-xs","text-sidebar-foreground","opacity-60"],[1,"text-sidebar-foreground","font-medium"],[2,"background","none","border","none","cursor","pointer",3,"click","title"],[1,"grid","grid-cols-2","gap-3","mb-4"],[1,"bg-sidebar-accent","rounded","p-3"],[1,"text-xs","text-sidebar-foreground","opacity-60","mb-2"],[1,"text-sm","font-semibold","text-sidebar-foreground","mb-2"],[1,"text-green-400"],[1,"text-sm","font-semibold","text-sidebar-foreground","mb-1"],[1,"h-1","bg-sidebar","rounded-full","mt-2",2,"background","#273549"],[1,"h-full","bg-blue-500","rounded-full",2,"width","100%"],[1,"text-sm","font-semibold","text-sidebar-foreground"],["class","bg-sidebar-accent rounded p-3 flex gap-3",4,"ngFor","ngForOf"],[1,"bg-sidebar-accent","rounded","p-3","flex","gap-3"],[1,"text-yellow-400","text-lg","flex-shrink-0","mt-1"],[1,"flex-1","min-w-0"],[1,"font-medium","text-sidebar-foreground"],[1,"bg-sidebar-accent","rounded","p-3","flex","items-center","gap-3"],[1,"pi","pi-thermometer","text-blue-400"],[1,"flex-1"],[1,"text-sm","font-medium","text-sidebar-foreground"],[1,"text-xs","text-sidebar-foreground","opacity-60","font-mono"],[1,"text-xs","px-2","py-1","rounded-full","bg-green-900","text-green-200"],[1,"pi","pi-server","text-cyan-400"],[1,"pi","pi-sun","text-yellow-400"],[1,"text-xs","text-sidebar-foreground","opacity-60","mb-4"],[3,"options"],[1,"space-y-4"],[1,"border-b","border-sidebar-border","pb-3"],[1,"text-sidebar-foreground","font-medium","font-mono","text-sm"]],template:function(e,o){e&1&&(i(0,"main",0)(1,"div",1)(2,"div",2),u(3,"app-device-view"),i(4,"div",3)(5,"div",4)(6,"div",5)(7,"span",6),r(8,"Status"),n()(),i(9,"div")(10,"span",7),r(11,"Online"),n()(),i(12,"div",8),r(13,"Normal"),n()(),i(14,"div",4)(15,"div",5)(16,"span",6),r(17,"Temperature"),n()(),i(18,"div")(19,"span",7),r(20,"34.5\xB0C"),n()(),i(21,"div",8),r(22,"Normal range"),n()(),i(23,"div",4)(24,"div",5)(25,"span",6),r(26,"Uptime"),n()(),i(27,"div")(28,"span",7),r(29,"98.2%"),n(),i(30,"span",9),r(31,"\u2191 5%"),n()(),i(32,"div",8),r(33,"30-day average"),n()(),i(34,"div",4)(35,"div",5)(36,"span",6),r(37,"Signal"),n()(),i(38,"div")(39,"span",7),r(40,"-45dBm"),n()(),i(41,"div",8),r(42,"Excellent strength"),n()()()(),i(43,"div",10)(44,"p-dock",11),f(45,Ke,2,3,"ng-template"),n(),i(46,"div",12),f(47,qe,32,6,"div",13)(48,Ue,5,1,"div",13)(49,Qe,31,0,"div",13)(50,We,6,1,"div",13)(51,Ge,32,0,"div",13),n(),i(52,"div",12)(53,"h3",14),r(54,"Location & Network"),n(),i(55,"div",15)(56,"div")(57,"p",16),r(58,"Location"),n(),i(59,"p",17),r(60,"North Building"),n()(),i(61,"div")(62,"p",16),r(63,"Firmware"),n(),i(64,"p",17),r(65,"v2.3.1"),n()()()()()()()),e&2&&(s(44),c("model",o.dockItems1)("position","left"),s(3),c("ngIf",o.selectedSection==="live-data"),s(),c("ngIf",o.selectedSection==="alerts"),s(),c("ngIf",o.selectedSection==="devices"),s(),c("ngIf",o.selectedSection==="charts"),s(),c("ngIf",o.selectedSection==="specs"))},dependencies:[re,F,M,K,A],encapsulation:2})};var Je=[{path:"",component:B}],Ce=class t{static \u0275fac=function(e){return new(e||t)};static \u0275mod=w({type:t});static \u0275inj=D({imports:[L,V.forChild(Je),M,Se,A]})};export{Ce as DeviceDetailModule};
