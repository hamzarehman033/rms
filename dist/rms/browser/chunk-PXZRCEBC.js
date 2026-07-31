import{b as Ce}from"./chunk-VVHSIQ6O.js";import{b as xe,c as ye}from"./chunk-BKWOQCXI.js";import"./chunk-WPDRXMQB.js";import{d as _e}from"./chunk-UKYRBNTQ.js";import"./chunk-AABCLXWW.js";import{b as k}from"./chunk-L2CIWTLB.js";import"./chunk-5OZPCLK3.js";import{g as be}from"./chunk-PH5GUBSM.js";import{c as re}from"./chunk-DHBBBG6L.js";import"./chunk-NIRPF3O4.js";import"./chunk-4QDOXXIP.js";import"./chunk-3G3QAZDE.js";import{a as ie}from"./chunk-QHIAVW7Q.js";import"./chunk-CONBI2ER.js";import{J as ge,K as he,b as te,e as ue,p as fe,q as ve}from"./chunk-QBNBWX76.js";import{Ca as ae,Da as $,Fa as ne,Ga as oe,Ia as se,Ka as le,Ma as ce,Sa as pe,Ta as me,Ua as de,wa as ee,xa as T}from"./chunk-77THPLZL.js";import{A as Z,c as S,e as E,i as Y,k as P}from"./chunk-RHGBMX6I.js";import"./chunk-OFLOCURC.js";import{Bb as b,Fb as d,Gb as p,Hb as H,Ib as W,Na as G,Pa as s,Qb as N,R as B,Rb as c,S as _,Sb as C,Tb as J,Ua as g,X as j,Yb as K,_b as w,ab as x,bb as y,ca as f,da as v,eb as R,ga as M,gb as u,gc as Q,hc as X,jc as z,ma as L,mb as U,nb as l,pb as O,qb as q,rb as h,vb as n,wb as r,xb as m}from"./chunk-57IQOT7G.js";import{a as D,b as V}from"./chunk-WWX6BADO.js";var Ie=["*"];function Fe(e,o){if(e&1&&(n(0,"span",3),c(1),r()),e&2){let t=p();s(),C(t.label)}}function Me(e,o){if(e&1&&m(0,"span",5),e&2){let t=p(2);h(t.icon),l("ngClass","p-avatar-icon")}}function Ue(e,o){if(e&1&&u(0,Me,1,3,"span",4),e&2){let t=p(),i=N(5);l("ngIf",t.icon)("ngIfElse",i)}}function Ne(e,o){if(e&1){let t=b();n(0,"img",7),d("error",function(a){f(t);let F=p(2);return v(F.imageError(a))}),r()}if(e&2){let t=p(2);l("src",t.image,G),U("aria-label",t.ariaLabel)}}function ze(e,o){if(e&1&&u(0,Ne,1,2,"img",6),e&2){let t=p();l("ngIf",t.image)}}var ke=({dt:e})=>`
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
`,$e={root:({props:e})=>["p-avatar p-component",{"p-avatar-image":e.image!=null,"p-avatar-circle":e.shape==="circle","p-avatar-lg":e.size==="large","p-avatar-xl":e.size==="xlarge"}],label:"p-avatar-label",icon:"p-avatar-icon"},we=(()=>{class e extends te{name="avatar";theme=ke;classes=$e;static \u0275fac=(()=>{let t;return function(a){return(t||(t=M(e)))(a||e)}})();static \u0275prov=B({token:e,factory:e.\u0275fac})}return e})();var Ae=(()=>{class e extends ue{label;icon;image;size="normal";shape="square";style;styleClass;ariaLabel;ariaLabelledBy;onImageError=new L;_componentStyle=j(we);imageError(t){this.onImageError.emit(t)}get hostClass(){return this.styleClass}static \u0275fac=(()=>{let t;return function(a){return(t||(t=M(e)))(a||e)}})();static \u0275cmp=x({type:e,selectors:[["p-avatar"]],hostVars:19,hostBindings:function(i,a){i&2&&(U("data-pc-name","avatar")("aria-label",a.ariaLabel)("aria-labelledby",a.ariaLabelledBy),q(a.style),h(a.hostClass),O("p-avatar",!0)("p-component",!0)("p-avatar-circle",a.shape==="circle")("p-avatar-lg",a.size==="large")("p-avatar-xl",a.size==="xlarge")("p-avatar-image",a.image!=null))},inputs:{label:"label",icon:"icon",image:"image",size:"size",shape:"shape",style:"style",styleClass:"styleClass",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy"},outputs:{onImageError:"onImageError"},features:[K([we]),R],ngContentSelectors:Ie,decls:6,vars:2,consts:[["iconTemplate",""],["imageTemplate",""],["class","p-avatar-text",4,"ngIf","ngIfElse"],[1,"p-avatar-text"],[3,"class","ngClass",4,"ngIf","ngIfElse"],[3,"ngClass"],[3,"src","error",4,"ngIf"],[3,"error","src"]],template:function(i,a){if(i&1&&(H(),W(0),u(1,Fe,2,1,"span",2)(2,Ue,1,2,"ng-template",null,0,z)(4,ze,1,1,"ng-template",null,1,z)),i&2){let F=N(3);s(),l("ngIf",a.label)("ngIfElse",F)}},dependencies:[P,S,E,T],encapsulation:2,changeDetection:0})}return e})(),Ee=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=y({type:e});static \u0275inj=_({imports:[Ae,T,T]})}return e})();var A=e=>({active:e});function De(e,o){if(e&1){let t=b();n(0,"div",6)(1,"div",7),m(2,"div",8),n(3,"div",9)(4,"form",10)(5,"div",11)(6,"label",12),c(7,"Username"),r(),m(8,"input",13),r(),n(9,"div",11)(10,"label",12),c(11,"Email"),r(),m(12,"input",13),r(),n(13,"div",11)(14,"label",12),c(15,"Phone Number"),r(),m(16,"input",14),r(),n(17,"div",11)(18,"label",12),c(19,"Role"),r(),m(20,"input",13),Q(21,"uppercase"),r(),n(22,"div",15)(23,"p-button",16),d("click",function(){f(t);let a=p();return v(a.onCancel())}),r(),n(24,"p-button",17),d("click",function(){f(t);let a=p();return v(a.onSaveProfile())}),r()()()()()()}if(e&2){let t=p();s(4),l("formGroup",t.profileForm),s(4),l("value",(t.currentUser==null?null:t.currentUser.userName)||"-")("disabled",!0),s(4),l("value",(t.currentUser==null?null:t.currentUser.email)||"-")("disabled",!0),s(8),l("value",X(21,8,t.roleLabel))("disabled",!0),s(4),l("loading",t.isSaving)}}function Ve(e,o){e&1&&(n(0,"tr")(1,"th",23),c(2,"Module"),r(),n(3,"th",24),c(4,"Access"),r()())}function Be(e,o){if(e&1&&(n(0,"tr")(1,"td")(2,"div",25),m(3,"i",26),n(4,"span",27),c(5),r()()(),n(6,"td",28)(7,"span",29),c(8),r()()()),e&2){let t=o.$implicit,i=p(2);s(3),h(t.icon),s(2),C(t.label),s(2),l("ngClass",i.hasModule(t.id)?"success":"info"),s(),J(" ",i.hasModule(t.id)?"Enabled":"Disabled"," ")}}function je(e,o){if(e&1&&(n(0,"div",6)(1,"h3",18),c(2,"Module Permissions"),r(),n(3,"p",19),c(4," View your access rights for each module. Read permission allows you to view content, while Write permission allows you to create, edit, and delete content. "),r(),n(5,"p-table",20),u(6,Ve,5,0,"ng-template",21)(7,Be,9,5,"ng-template",22),r()()),e&2){let t=p();s(5),l("value",t.modules)("loading",t.isLoading)}}function Le(e,o){if(e&1){let t=b();n(0,"div",6)(1,"h3",18),c(2,"Security Settings"),r(),n(3,"form",30)(4,"div",31)(5,"div",9)(6,"h4",32),c(7,"Password"),r(),n(8,"div",33),m(9,"input",34)(10,"input",35),r()(),n(11,"p-button",36),d("click",function(){f(t);let a=p();return v(a.onChangePassword())}),r()()()()}if(e&2){let t=p();s(3),l("formGroup",t.passwordForm),s(8),l("loading",t.isChangingPassword)}}var I=class e{constructor(o,t,i,a){this.fb=o;this.authService=t;this.usersService=i;this.toastService=a}fb;authService;usersService;toastService;profileForm;passwordForm;selectedTab=0;isLoading=!1;isSaving=!1;isChangingPassword=!1;currentUser=null;modules=k;ngOnInit(){this.initializeForm(),this.loadProfile()}initializeForm(){this.profileForm=this.fb.group({phoneNumber:[""]}),this.passwordForm=this.fb.group({oldPassword:["",$.required],newPassword:["",$.required]})}loadProfile(){let t=this.authService.getCurrentUser()?.id;if(!t){this.toastService.showError("Error","Unable to load current user.");return}this.isLoading=!0,this.usersService.getUserById(t).subscribe({next:i=>{this.currentUser=i?.data||i,this.profileForm.patchValue({phoneNumber:this.currentUser?.phoneNumber||""}),this.currentUser?.roles?.includes("SysAdmin")||(this.modules=k.filter(a=>a.id!==10&&a.id!==8)),this.isLoading=!1},error:()=>{this.isLoading=!1,this.toastService.showError("Error","Failed to load profile.")}})}onSaveProfile(){if(this.profileForm.invalid||!this.currentUser?.id)return;let o=this.currentUser.roles||this.currentUser.role||[],t={id:this.currentUser.id,userName:this.currentUser.userName,email:this.currentUser.email,phoneNumber:this.profileForm.value.phoneNumber,role:Array.isArray(o)?o[0]||"":o||"",modules:this.currentUser.modules||[]};this.isSaving=!0,this.usersService.updateUser(this.currentUser.id,t).subscribe({next:()=>{this.currentUser=V(D({},this.currentUser),{phoneNumber:t.phoneNumber}),this.isSaving=!1,this.toastService.showSuccess("Success","Profile updated successfully.")},error:()=>{this.isSaving=!1,this.toastService.showError("Error","Failed to update profile.")}})}onChangePassword(){this.passwordForm.invalid||(this.isChangingPassword=!0,this.authService.changePassword(this.passwordForm.value).subscribe({next:()=>{this.isChangingPassword=!1,this.passwordForm.reset(),this.toastService.showSuccess("Success","Password changed successfully.")},error:()=>{this.isChangingPassword=!1,this.toastService.showError("Error","Failed to change password.")}}))}onUploadPhoto(){}onDownloadPhoto(){console.log("Download photo")}onDeletePhoto(){console.log("Delete photo")}onCancel(){this.profileForm.patchValue({phoneNumber:this.currentUser?.phoneNumber||""})}hasModule(o){return(this.currentUser?.modules||[]).map(i=>Number(i)).includes(o)}get roleLabel(){let o=this.currentUser?.roles||this.currentUser?.role||[];return Array.isArray(o)?o[0]||"-":o||"-"}static \u0275fac=function(t){return new(t||e)(g(pe),g(re),g(be),g(ie))};static \u0275cmp=x({type:e,selectors:[["app-profile"]],standalone:!1,decls:18,vars:12,consts:[[1,"content"],[1,"page-header"],[1,"hstack","justify-between"],[1,"tabs"],[3,"click","ngClass"],["class","card",4,"ngIf"],[1,"card"],[1,"flex","gap-8"],[1,"flex","flex-col","items-center","gap-4"],[1,"flex-1"],[1,"flex","flex-col","gap-3",3,"formGroup"],[1,"form-group"],[1,"block","font-medium"],["pInputText","",1,"w-full",3,"value","disabled"],["pInputText","","formControlName","phoneNumber","placeholder","Phone number",1,"w-full"],[1,"hstack","justify-end","gap-3","mt-6"],["label","Cancel","severity","secondary","icon","pi pi-times",3,"click"],["label","Save Changes","icon","pi pi-check",1,"p-button-primary",3,"click","loading"],[1,"mb-4"],[1,"text-muted-foreground","mb-6","text-sm"],["styleClass","p-datatable-sm","responsiveLayout","scroll",3,"value","loading"],["pTemplate","header"],["pTemplate","body"],[1,"text-left"],[1,"text-center","w-25"],[1,"flex","items-center","gap-3"],[1,"text-primary"],[1,"font-medium"],[1,"text-center"],[1,"badge",3,"ngClass"],[1,"flex","flex-col","gap-3","mb-6",3,"formGroup"],[1,"flex","justify-between","items-end","gap-3","p-4","border","border-border","rounded","mb-4"],[1,"font-semibold","m-0","mb-1"],[1,"grid","cols-2","gap-3","mt-3"],["pInputText","","formControlName","oldPassword","type","password","placeholder","Old password"],["pInputText","","formControlName","newPassword","type","password","placeholder","New password"],["label","Change Password","severity","secondary","icon","pi pi-lock",3,"click","loading"]],template:function(t,i){t&1&&(n(0,"main",0)(1,"div",1)(2,"div")(3,"h1"),c(4,"My Profile"),r(),n(5,"p"),c(6,"Manage your account settings and access permissions."),r()()(),n(7,"div",2)(8,"div",3)(9,"button",4),d("click",function(){return i.selectedTab=0}),c(10,"Profile Settings"),r(),n(11,"button",4),d("click",function(){return i.selectedTab=1}),c(12,"Permissions"),r(),n(13,"button",4),d("click",function(){return i.selectedTab=2}),c(14,"Security"),r()()(),u(15,De,25,10,"div",5)(16,je,8,2,"div",5)(17,Le,12,2,"div",5),r()),t&2&&(s(9),l("ngClass",w(6,A,i.selectedTab===0)),s(2),l("ngClass",w(8,A,i.selectedTab===1)),s(2),l("ngClass",w(10,A,i.selectedTab===2)),s(2),l("ngIf",i.selectedTab===0),s(),l("ngIf",i.selectedTab===1),s(),l("ngIf",i.selectedTab===2))},dependencies:[S,E,se,ae,ne,oe,le,ce,ge,ee,fe,xe,Y],encapsulation:2})};var Ge=[{path:"",component:I}],Pe=class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=y({type:e});static \u0275inj=_({imports:[P,Z.forChild(Ge),de,me,he,ve,_e,ye,Ee,Ce]})};export{Pe as ProfileModule};
