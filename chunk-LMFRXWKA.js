import{b as ye,d as V}from"./chunk-2ECLHGIS.js";import{a as _e,b as xe}from"./chunk-YELGZQAZ.js";import"./chunk-ZEG2IBXZ.js";import"./chunk-AOFN3Z7E.js";import{b as be,c as he}from"./chunk-HHZFTKRI.js";import"./chunk-VJM3YZ7G.js";import"./chunk-USQ3H6QC.js";import"./chunk-AQZVSI42.js";import"./chunk-GVNAU7XG.js";import"./chunk-XWQXKHEW.js";import"./chunk-OFLOCURC.js";import{b as te,d as de,k as ue,l as fe,q as ve,r as ge}from"./chunk-GVY24IDO.js";import{c as ie,d as h,f as ae,g as re,h as z,j as ne,l as oe,m as le,o as se,r as me,s as pe,t as ce}from"./chunk-K7JRKT2Q.js";import{va as ee,wa as T}from"./chunk-XIFB4CKX.js";import{B as Z,c as E,e as F,i as X,l as S}from"./chunk-O6ITW7WA.js";import{$a as y,Db as d,Eb as p,Fb as W,Gb as H,La as L,Na as s,Ob as k,P as B,Pb as l,Q as _,Qb as C,Rb as J,Sa as R,V as U,Wb as Y,Yb as w,_a as x,aa as u,ba as f,cb as G,ea as M,eb as v,ec as K,fc as Q,hc as N,ka as j,kb as $,lb as m,nb as q,ob as O,pb as g,tb as r,ub as i,vb as c,zb as b}from"./chunk-7IO7J3XD.js";import"./chunk-WWX6BADO.js";var Te=["*"];function Pe(e,n){if(e&1&&(r(0,"span",3),l(1),i()),e&2){let t=p();s(),C(t.label)}}function Ie(e,n){if(e&1&&c(0,"span",5),e&2){let t=p(2);g(t.icon),m("ngClass","p-avatar-icon")}}function Me(e,n){if(e&1&&v(0,Ie,1,3,"span",4),e&2){let t=p(),a=k(5);m("ngIf",t.icon)("ngIfElse",a)}}function $e(e,n){if(e&1){let t=b();r(0,"img",7),d("error",function(o){u(t);let I=p(2);return f(I.imageError(o))}),i()}if(e&2){let t=p(2);m("src",t.image,L),$("aria-label",t.ariaLabel)}}function ke(e,n){if(e&1&&v(0,$e,1,2,"img",6),e&2){let t=p();m("ngIf",t.image)}}var Ne=({dt:e})=>`
.p-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${e("avatar.width")};
    height: ${e("avatar.height")};
    font-size: ${e("avatar.font.size")};
    color: ${e("avatar.color")};
    background: ${e("avatar.background")};
    border-radius: ${e("avatar.border.radius")};
}

.p-avatar-image {
    background: transparent;
}

.p-avatar-circle {
    border-radius: 50%;
}

.p-avatar-circle img {
    border-radius: 50%;
}

.p-avatar-icon {
    font-size: ${e("avatar.icon.size")};
    width: ${e("avatar.icon.size")};
    height: ${e("avatar.icon.size")};
}

.p-avatar img {
    width: 100%;
    height: 100%;
}

.p-avatar-lg {
    width: ${e("avatar.lg.width")};
    height: ${e("avatar.lg.width")};
    font-size: ${e("avatar.lg.font.size")};
}

.p-avatar-lg .p-avatar-icon {
    font-size: ${e("avatar.lg.icon.size")};
    width: ${e("avatar.lg.icon.size")};
    height: ${e("avatar.lg.icon.size")};
}

.p-avatar-xl {
    width: ${e("avatar.xl.width")};
    height: ${e("avatar.xl.width")};
    font-size: ${e("avatar.xl.font.size")};
}

.p-avatar-xl .p-avatar-icon {
    font-size: ${e("avatar.xl.font.size")};
    width: ${e("avatar.xl.icon.size")};
    height: ${e("avatar.xl.icon.size")};
}

.p-avatar-group {
    display: flex;
    align-items: center;
}

.p-avatar-group .p-avatar + .p-avatar {
    margin-inline-start: ${e("avatar.group.offset")};
}

.p-avatar-group .p-avatar {
    border: 2px solid ${e("avatar.group.border.color")};
}

.p-avatar-group .p-avatar-lg + .p-avatar-lg {
    margin-inline-start: ${e("avatar.lg.group.offset")};
}

.p-avatar-group .p-avatar-xl + .p-avatar-xl {
    margin-inline-start: ${e("avatar.xl.group.offset")};
}
`,ze={root:({props:e})=>["p-avatar p-component",{"p-avatar-image":e.image!=null,"p-avatar-circle":e.shape==="circle","p-avatar-lg":e.size==="large","p-avatar-xl":e.size==="xlarge"}],label:"p-avatar-label",icon:"p-avatar-icon"},Ce=(()=>{class e extends te{name="avatar";theme=Ne;classes=ze;static \u0275fac=(()=>{let t;return function(o){return(t||(t=M(e)))(o||e)}})();static \u0275prov=B({token:e,factory:e.\u0275fac})}return e})();var A=(()=>{class e extends de{label;icon;image;size="normal";shape="square";style;styleClass;ariaLabel;ariaLabelledBy;onImageError=new j;_componentStyle=U(Ce);imageError(t){this.onImageError.emit(t)}get hostClass(){return this.styleClass}static \u0275fac=(()=>{let t;return function(o){return(t||(t=M(e)))(o||e)}})();static \u0275cmp=x({type:e,selectors:[["p-avatar"]],hostVars:19,hostBindings:function(a,o){a&2&&($("data-pc-name","avatar")("aria-label",o.ariaLabel)("aria-labelledby",o.ariaLabelledBy),O(o.style),g(o.hostClass),q("p-avatar",!0)("p-component",!0)("p-avatar-circle",o.shape==="circle")("p-avatar-lg",o.size==="large")("p-avatar-xl",o.size==="xlarge")("p-avatar-image",o.image!=null))},inputs:{label:"label",icon:"icon",image:"image",size:"size",shape:"shape",style:"style",styleClass:"styleClass",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy"},outputs:{onImageError:"onImageError"},features:[Y([Ce]),G],ngContentSelectors:Te,decls:6,vars:2,consts:[["iconTemplate",""],["imageTemplate",""],["class","p-avatar-text",4,"ngIf","ngIfElse"],[1,"p-avatar-text"],[3,"class","ngClass",4,"ngIf","ngIfElse"],[3,"ngClass"],[3,"src","error",4,"ngIf"],[3,"error","src"]],template:function(a,o){if(a&1&&(W(),H(0),v(1,Pe,2,1,"span",2)(2,Me,1,2,"ng-template",null,0,N)(4,ke,1,1,"ng-template",null,1,N)),a&2){let I=k(3);s(),m("ngIf",o.label)("ngIfElse",I)}},dependencies:[S,E,F,T],encapsulation:2,changeDetection:0})}return e})(),Ee=(()=>{class e{static \u0275fac=function(a){return new(a||e)};static \u0275mod=y({type:e});static \u0275inj=_({imports:[A,T,T]})}return e})();var D=e=>({active:e});function Ae(e,n){if(e&1){let t=b();r(0,"div",6)(1,"div",7)(2,"div",8),c(3,"p-avatar",9),r(4,"p-button",10),d("click",function(){u(t);let o=p();return f(o.onUploadPhoto())}),i(),r(5,"div",11),l(6,"JPG, PNG, GIF max 5MB"),i()(),r(7,"div",12)(8,"form",13)(9,"div",14)(10,"label",15),l(11,"First Name"),i(),c(12,"input",16),i(),r(13,"div",14)(14,"label",15),l(15,"Last Name"),i(),c(16,"input",17),i(),r(17,"div",14)(18,"label",15),l(19,"Email"),i(),c(20,"input",18),i(),r(21,"div",14)(22,"label",15),l(23,"Role"),i(),c(24,"input",19),K(25,"uppercase"),i(),r(26,"div",20)(27,"p-button",21),d("click",function(){u(t);let o=p();return f(o.onCancel())}),i(),r(28,"p-button",22),d("click",function(){u(t);let o=p();return f(o.onSaveProfile())}),i()()()()()()}if(e&2){let t=p();s(3),m("label",t.currentUser.avatar),s(),m("text",!1),s(4),m("formGroup",t.profileForm),s(16),m("value",Q(25,5,t.currentUser.role))("disabled",!0)}}function De(e,n){e&1&&(r(0,"tr")(1,"th",29),l(2,"Module"),i(),r(3,"th",30),l(4,"Read Access"),i(),r(5,"th",30),l(6,"Write Access"),i(),r(7,"th",31),l(8,"Status"),i()())}function Be(e,n){if(e&1&&(r(0,"tr")(1,"td")(2,"div",32),c(3,"i",33),r(4,"span",34),l(5),i()()(),r(6,"td",35),c(7,"p-checkbox",36),i(),r(8,"td",35),c(9,"p-checkbox",36),i(),r(10,"td",35)(11,"span",37),l(12),i()()()),e&2){let t=n.$implicit,a=p(2);s(3),g(t.icon),s(2),C(t.label),s(2),m("formControl",a.getReadControl(t.value))("binary",!0),s(2),m("formControl",a.getWriteControl(t.value))("binary",!0),s(2),m("ngClass",a.isModuleEnabled(t.value)?"success":"info"),s(),J(" ",a.isModuleEnabled(t.value)?"Enabled":"Disabled"," ")}}function Ue(e,n){if(e&1&&(r(0,"div",6)(1,"h3",23),l(2,"Module Permissions"),i(),r(3,"p",24),l(4," View your access rights for each module. Read permission allows you to view content, while Write permission allows you to create, edit, and delete content. "),i(),r(5,"form",25)(6,"p-table",26),v(7,De,9,0,"ng-template",27)(8,Be,13,9,"ng-template",28),i()()()),e&2){let t=p();s(5),m("formGroup",t.profileForm),s(),m("value",t.modules)}}function je(e,n){if(e&1){let t=b();r(0,"div",6)(1,"h3",23),l(2,"Security Settings"),i(),r(3,"div",38)(4,"div",39)(5,"div")(6,"h4",40),l(7,"Password"),i(),r(8,"p",41),l(9,"Last changed 90 days ago"),i()(),r(10,"p-button",42),d("click",function(){u(t);let o=p();return f(o.onChangePassword())}),i()()(),r(11,"div",38)(12,"div",39)(13,"div")(14,"h4",40),l(15,"Two-Factor Authentication"),i(),r(16,"p",41),l(17,"Enhance your account security with 2FA"),i()(),c(18,"p-button",43),i()()()}}var P=class e{constructor(n){this.fb=n}fb;profileForm;selectedTab=0;currentUser={firstName:"Anna",lastName:"Smith",email:"anna@pulse.io",role:"admin",avatar:"A",joinDate:"Jan 10, 2025"};modules=[{label:"Dashboard",value:"dashboard",icon:"pi pi-chart-bar"},{label:"Devices",value:"devices",icon:"pi pi-microchip"},{label:"Locations",value:"locations",icon:"pi pi-map"},{label:"Users",value:"users",icon:"pi pi-users"},{label:"Rules",value:"rules",icon:"pi pi-cog"},{label:"Alarms",value:"alarms",icon:"pi pi-bell"},{label:"Reports",value:"reports",icon:"pi pi-file"},{label:"Settings",value:"settings",icon:"pi pi-sliders-v"}];userPermissions=[{module:"dashboard",read:!0,write:!0},{module:"devices",read:!0,write:!0},{module:"locations",read:!0,write:!0},{module:"users",read:!0,write:!0},{module:"rules",read:!0,write:!0},{module:"alarms",read:!0,write:!0},{module:"reports",read:!0,write:!0},{module:"settings",read:!0,write:!0}];ngOnInit(){this.initializeForm()}initializeForm(){this.profileForm=this.fb.group({firstName:[this.currentUser.firstName,h.required],lastName:[this.currentUser.lastName,h.required],email:[this.currentUser.email,[h.required,h.email]]}),this.modules.forEach(n=>{let t=this.userPermissions.find(a=>a.module===n.value);this.profileForm.addControl(`${n.value}_read`,new z({value:t?.read||!1,disabled:!0})),this.profileForm.addControl(`${n.value}_write`,new z({value:t?.write||!1,disabled:!0}))})}getPermissionForModule(n){return this.userPermissions.find(t=>t.module===n)}onSaveProfile(){if(this.profileForm.valid)try{this.currentUser.firstName=this.profileForm.get("firstName")?.value,this.currentUser.lastName=this.profileForm.get("lastName")?.value,this.currentUser.email=this.profileForm.get("email")?.value,this.modules.forEach(n=>{let t=this.userPermissions.find(a=>a.module===n.value);if(t){let a=this.profileForm.get(`${n.value}_read`)?.value,o=this.profileForm.get(`${n.value}_write`)?.value;t.read=a||!1,t.write=o||!1}}),console.log("Profile saved:",{user:this.currentUser,permissions:this.userPermissions}),V.success("Profile Updated","Your profile and permissions have been saved successfully.")}catch(n){V.error("Failed to Save","An error occurred while saving your profile. Please try again."),console.error("Error saving profile:",n)}}onChangePassword(){console.log("Change password clicked")}onUploadPhoto(){}onCancel(){this.initializeForm()}getReadControl(n){return this.profileForm.get(`${n}_read`)}getWriteControl(n){return this.profileForm.get(`${n}_write`)}isModuleEnabled(n){let t=this.profileForm.get(`${n}_read`)?.value,a=this.profileForm.get(`${n}_write`)?.value;return t||a}static \u0275fac=function(t){return new(t||e)(R(me))};static \u0275cmp=x({type:e,selectors:[["app-profile"]],standalone:!1,decls:18,vars:12,consts:[[1,"content"],[1,"page-header"],[1,"hstack","justify-between"],[1,"tabs"],[3,"click","ngClass"],["class","card",4,"ngIf"],[1,"card"],[1,"flex","gap-8"],[1,"flex","flex-col","items-center","gap-4"],["size","xlarge","shape","circle","styleClass","text-2xl",3,"label"],["label","Upload Photo","severity","secondary","styleClass","p-button-sm",3,"click","text"],[1,"text-xs","text-muted-foreground"],[1,"flex-1"],[1,"flex","flex-col","gap-3",3,"formGroup"],[1,"form-group"],[1,"block","font-medium"],["pInputText","","formControlName","firstName","placeholder","First name",1,"w-full"],["pInputText","","formControlName","lastName","placeholder","Last name",1,"w-full"],["pInputText","","formControlName","email","placeholder","Email address","type","email",1,"w-full"],["pInputText","",1,"w-full",3,"value","disabled"],[1,"hstack","justify-end","gap-3","mt-6"],["label","Cancel","severity","secondary","icon","pi pi-times",3,"click"],["label","Save Changes","icon","pi pi-check",1,"p-button-primary",3,"click"],[1,"mb-4"],[1,"text-muted-foreground","mb-6","text-sm"],[3,"formGroup"],["styleClass","p-datatable-sm","responsiveLayout","scroll",3,"value"],["pTemplate","header"],["pTemplate","body"],[1,"text-left"],[1,"text-center","w-30"],[1,"text-center","w-25"],[1,"flex","items-center","gap-3"],[1,"text-primary"],[1,"font-medium"],[1,"text-center"],[3,"formControl","binary"],[1,"badge",3,"ngClass"],[1,"mb-6"],[1,"flex","justify-between","items-center","p-4","border","border-border","rounded","mb-4"],[1,"font-semibold","m-0","mb-1"],[1,"text-xs","text-muted-foreground","m-0"],["label","Change Password","severity","secondary","icon","pi pi-lock",3,"click"],["label","Enable 2FA","severity","secondary","icon","pi pi-shield"]],template:function(t,a){t&1&&(r(0,"main",0)(1,"div",1)(2,"div")(3,"h1"),l(4,"My Profile"),i(),r(5,"p"),l(6,"Manage your account settings and access permissions."),i()()(),r(7,"div",2)(8,"div",3)(9,"button",4),d("click",function(){return a.selectedTab=0}),l(10,"Profile Settings"),i(),r(11,"button",4),d("click",function(){return a.selectedTab=1}),l(12,"Permissions"),i(),r(13,"button",4),d("click",function(){return a.selectedTab=2}),l(14,"Security"),i()()(),v(15,Ae,29,7,"div",5)(16,Ue,9,2,"div",5)(17,je,19,0,"div",5),i()),t&2&&(s(9),m("ngClass",w(6,D,a.selectedTab===0)),s(2),m("ngClass",w(8,D,a.selectedTab===1)),s(2),m("ngClass",w(10,D,a.selectedTab===2)),s(2),m("ngIf",a.selectedTab===0),s(),m("ngIf",a.selectedTab===1),s(),m("ngIf",a.selectedTab===2))},dependencies:[E,F,ne,ie,ae,re,oe,le,se,ve,ee,ue,be,_e,A,X],encapsulation:2})};var Le=[{path:"",component:P}],Fe=class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=y({type:e});static \u0275inj=_({imports:[S,Z.forChild(Le),ce,pe,ge,fe,he,xe,Ee,ye]})};export{Fe as ProfileModule};
