import{c as Ri,d as ii,f as ni,h as oi,i as ri,k as si}from"./chunk-OFLOCURC.js";import{a as Ht,b as Fi,c as re,d as xn,e as se,f as ae,g as le,i as tt,j as bt,k as In}from"./chunk-D27VZS43.js";import{$ as ut,$a as k,Ab as it,Bb as oe,Cb as K,Db as Z,Eb as Vi,Fb as Sn,Gb as we,Hb as Xe,Ib as Je,Ka as E,L as Ke,M as ie,Ma as Ze,N as I,O as H,Oa as Ce,Ob as D,Pa as w,Pb as wn,Q as Mt,Qb as st,Ra as vn,Rb as Ee,Sa as Mi,Sb as ti,T as v,U as bn,Va as L,Wa as W,Xa as A,Xb as En,Y as J,Z as Kt,Za as _,_ as Zt,_b as xe,ba as b,bb as _n,bc as ei,cb as Cn,da as Li,f as kt,fb as R,fc as O,gb as g,gc as Bt,ha as z,hb as Qe,hc as It,ia as Nt,ib as nt,ic as Tt,jb as Ye,jc as Ie,k as gn,ka as Pt,kb as N,la as Qt,ma as pt,ob as P,p as mn,pb as B,qa as ne,qb as j,rb as ht,sb as ft,tb as xt,ub as Se,v as yn,wb as gt,xb as T,yb as ot,zb as rt}from"./chunk-NWPQPIQC.js";import{a as f,b as et}from"./chunk-GAL4ENT6.js";var Rn=(()=>{class e{_renderer;_elementRef;onChange=t=>{};onTouched=()=>{};constructor(t,i){this._renderer=t,this._elementRef=i}setProperty(t,i){this._renderer.setProperty(this._elementRef.nativeElement,t,i)}registerOnTouched(t){this.onTouched=t}registerOnChange(t){this.onChange=t}setDisabledState(t){this.setProperty("disabled",t)}static \u0275fac=function(i){return new(i||e)(w(Ce),w(Qt))};static \u0275dir=A({type:e})}return e})(),ar=(()=>{class e extends Rn{static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275dir=A({type:e,features:[_]})}return e})(),yi=new Mt("");var lr={provide:yi,useExisting:ie(()=>$n),multi:!0};function cr(){let e=Fi()?Fi().getUserAgent():"";return/android (\d+)/.test(e.toLowerCase())}var dr=new Mt(""),$n=(()=>{class e extends Rn{_compositionMode;_composing=!1;constructor(t,i,o){super(t,i),this._compositionMode=o,this._compositionMode==null&&(this._compositionMode=!cr())}writeValue(t){let i=t??"";this.setProperty("value",i)}_handleInput(t){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(t)}_compositionStart(){this._composing=!0}_compositionEnd(t){this._composing=!1,this._compositionMode&&this.onChange(t)}static \u0275fac=function(i){return new(i||e)(w(Ce),w(Qt),w(dr,8))};static \u0275dir=A({type:e,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(i,o){i&1&&gt("input",function(s){return o._handleInput(s.target.value)})("blur",function(){return o.onTouched()})("compositionstart",function(){return o._compositionStart()})("compositionend",function(s){return o._compositionEnd(s.target.value)})},standalone:!1,features:[D([lr]),_]})}return e})();function Hi(e){return e==null||zi(e)===0}function zi(e){return e==null?null:Array.isArray(e)||typeof e=="string"?e.length:e instanceof Set?e.size:null}var bi=new Mt(""),vi=new Mt(""),ur=/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,Tn=class{static min(n){return pr(n)}static max(n){return hr(n)}static required(n){return fr(n)}static requiredTrue(n){return gr(n)}static email(n){return mr(n)}static minLength(n){return yr(n)}static maxLength(n){return br(n)}static pattern(n){return vr(n)}static nullValidator(n){return kn()}static compose(n){return Wn(n)}static composeAsync(n){return Un(n)}};function pr(e){return n=>{if(n.value==null||e==null)return null;let t=parseFloat(n.value);return!isNaN(t)&&t<e?{min:{min:e,actual:n.value}}:null}}function hr(e){return n=>{if(n.value==null||e==null)return null;let t=parseFloat(n.value);return!isNaN(t)&&t>e?{max:{max:e,actual:n.value}}:null}}function fr(e){return Hi(e.value)?{required:!0}:null}function gr(e){return e.value===!0?null:{required:!0}}function mr(e){return Hi(e.value)||ur.test(e.value)?null:{email:!0}}function yr(e){return n=>{let t=n.value?.length??zi(n.value);return t===null||t===0?null:t<e?{minlength:{requiredLength:e,actualLength:t}}:null}}function br(e){return n=>{let t=n.value?.length??zi(n.value);return t!==null&&t>e?{maxlength:{requiredLength:e,actualLength:t}}:null}}function vr(e){if(!e)return kn;let n,t;return typeof e=="string"?(t="",e.charAt(0)!=="^"&&(t+="^"),t+=e,e.charAt(e.length-1)!=="$"&&(t+="$"),n=new RegExp(t)):(t=e.toString(),n=e),i=>{if(Hi(i.value))return null;let o=i.value;return n.test(o)?null:{pattern:{requiredPattern:t,actualValue:o}}}}function kn(e){return null}function Nn(e){return e!=null}function Pn(e){return _n(e)?gn(e):e}function Bn(e){let n={};return e.forEach(t=>{n=t!=null?f(f({},n),t):n}),Object.keys(n).length===0?null:n}function Hn(e,n){return n.map(t=>t(e))}function _r(e){return!e.validate}function zn(e){return e.map(n=>_r(n)?n:t=>n.validate(t))}function Wn(e){if(!e)return null;let n=e.filter(Nn);return n.length==0?null:function(t){return Bn(Hn(t,n))}}function jn(e){return e!=null?Wn(zn(e)):null}function Un(e){if(!e)return null;let n=e.filter(Nn);return n.length==0?null:function(t){let i=Hn(t,n).map(Pn);return yn(i).pipe(mn(Bn))}}function Gn(e){return e!=null?Un(zn(e)):null}function On(e,n){return e===null?[n]:Array.isArray(e)?[...e,n]:[e,n]}function qn(e){return e._rawValidators}function Kn(e){return e._rawAsyncValidators}function $i(e){return e?Array.isArray(e)?e:[e]:[]}function li(e,n){return Array.isArray(e)?e.includes(n):e===n}function Dn(e,n){let t=$i(n);return $i(e).forEach(o=>{li(t,o)||t.push(o)}),t}function An(e,n){return $i(n).filter(t=>!li(e,t))}var ci=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(n){this._rawValidators=n||[],this._composedValidatorFn=jn(this._rawValidators)}_setAsyncValidators(n){this._rawAsyncValidators=n||[],this._composedAsyncValidatorFn=Gn(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(n){this._onDestroyCallbacks.push(n)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(n=>n()),this._onDestroyCallbacks=[]}reset(n=void 0){this.control&&this.control.reset(n)}hasError(n,t){return this.control?this.control.hasError(n,t):!1}getError(n,t){return this.control?this.control.getError(n,t):null}},Yt=class extends ci{name;get formDirective(){return null}get path(){return null}},Vt=class extends ci{_parent=null;name=null;valueAccessor=null},di=class{_cd;constructor(n){this._cd=n}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}},Cr={"[class.ng-untouched]":"isUntouched","[class.ng-touched]":"isTouched","[class.ng-pristine]":"isPristine","[class.ng-dirty]":"isDirty","[class.ng-valid]":"isValid","[class.ng-invalid]":"isInvalid","[class.ng-pending]":"isPending"},ol=et(f({},Cr),{"[class.ng-submitted]":"isSubmitted"}),rl=(()=>{class e extends di{constructor(t){super(t)}static \u0275fac=function(i){return new(i||e)(w(Vt,2))};static \u0275dir=A({type:e,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(i,o){i&2&&nt("ng-untouched",o.isUntouched)("ng-touched",o.isTouched)("ng-pristine",o.isPristine)("ng-dirty",o.isDirty)("ng-valid",o.isValid)("ng-invalid",o.isInvalid)("ng-pending",o.isPending)},standalone:!1,features:[_]})}return e})(),sl=(()=>{class e extends di{constructor(t){super(t)}static \u0275fac=function(i){return new(i||e)(w(Yt,10))};static \u0275dir=A({type:e,selectors:[["","formGroupName",""],["","formArrayName",""],["","ngModelGroup",""],["","formGroup",""],["form",3,"ngNoForm",""],["","ngForm",""]],hostVars:16,hostBindings:function(i,o){i&2&&nt("ng-untouched",o.isUntouched)("ng-touched",o.isTouched)("ng-pristine",o.isPristine)("ng-dirty",o.isDirty)("ng-valid",o.isValid)("ng-invalid",o.isInvalid)("ng-pending",o.isPending)("ng-submitted",o.isSubmitted)},standalone:!1,features:[_]})}return e})();var Te="VALID",ai="INVALID",ce="PENDING",Oe="DISABLED",zt=class{},ui=class extends zt{value;source;constructor(n,t){super(),this.value=n,this.source=t}},De=class extends zt{pristine;source;constructor(n,t){super(),this.pristine=n,this.source=t}},Ae=class extends zt{touched;source;constructor(n,t){super(),this.touched=n,this.source=t}},de=class extends zt{status;source;constructor(n,t){super(),this.status=n,this.source=t}},ki=class extends zt{source;constructor(n){super(),this.source=n}},Ni=class extends zt{source;constructor(n){super(),this.source=n}};function Wi(e){return(_i(e)?e.validators:e)||null}function Sr(e){return Array.isArray(e)?jn(e):e||null}function ji(e,n){return(_i(n)?n.asyncValidators:e)||null}function wr(e){return Array.isArray(e)?Gn(e):e||null}function _i(e){return e!=null&&!Array.isArray(e)&&typeof e=="object"}function Zn(e,n,t){let i=e.controls;if(!(n?Object.keys(i):i).length)throw new Ke(1e3,"");if(!i[t])throw new Ke(1001,"")}function Qn(e,n,t){e._forEachChild((i,o)=>{if(t[o]===void 0)throw new Ke(1002,"")})}var ue=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(n,t){this._assignValidators(n),this._assignAsyncValidators(t)}get validator(){return this._composedValidatorFn}set validator(n){this._rawValidators=this._composedValidatorFn=n}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(n){this._rawAsyncValidators=this._composedAsyncValidatorFn=n}get parent(){return this._parent}get status(){return It(this.statusReactive)}set status(n){It(()=>this.statusReactive.set(n))}_status=Tt(()=>this.statusReactive());statusReactive=pt(void 0);get valid(){return this.status===Te}get invalid(){return this.status===ai}get pending(){return this.status==ce}get disabled(){return this.status===Oe}get enabled(){return this.status!==Oe}errors;get pristine(){return It(this.pristineReactive)}set pristine(n){It(()=>this.pristineReactive.set(n))}_pristine=Tt(()=>this.pristineReactive());pristineReactive=pt(!0);get dirty(){return!this.pristine}get touched(){return It(this.touchedReactive)}set touched(n){It(()=>this.touchedReactive.set(n))}_touched=Tt(()=>this.touchedReactive());touchedReactive=pt(!1);get untouched(){return!this.touched}_events=new kt;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(n){this._assignValidators(n)}setAsyncValidators(n){this._assignAsyncValidators(n)}addValidators(n){this.setValidators(Dn(n,this._rawValidators))}addAsyncValidators(n){this.setAsyncValidators(Dn(n,this._rawAsyncValidators))}removeValidators(n){this.setValidators(An(n,this._rawValidators))}removeAsyncValidators(n){this.setAsyncValidators(An(n,this._rawAsyncValidators))}hasValidator(n){return li(this._rawValidators,n)}hasAsyncValidator(n){return li(this._rawAsyncValidators,n)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(n={}){let t=this.touched===!1;this.touched=!0;let i=n.sourceControl??this;this._parent&&!n.onlySelf&&this._parent.markAsTouched(et(f({},n),{sourceControl:i})),t&&n.emitEvent!==!1&&this._events.next(new Ae(!0,i))}markAllAsTouched(n={}){this.markAsTouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(t=>t.markAllAsTouched(n))}markAsUntouched(n={}){let t=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=n.sourceControl??this;this._forEachChild(o=>{o.markAsUntouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:i})}),this._parent&&!n.onlySelf&&this._parent._updateTouched(n,i),t&&n.emitEvent!==!1&&this._events.next(new Ae(!1,i))}markAsDirty(n={}){let t=this.pristine===!0;this.pristine=!1;let i=n.sourceControl??this;this._parent&&!n.onlySelf&&this._parent.markAsDirty(et(f({},n),{sourceControl:i})),t&&n.emitEvent!==!1&&this._events.next(new De(!1,i))}markAsPristine(n={}){let t=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=n.sourceControl??this;this._forEachChild(o=>{o.markAsPristine({onlySelf:!0,emitEvent:n.emitEvent})}),this._parent&&!n.onlySelf&&this._parent._updatePristine(n,i),t&&n.emitEvent!==!1&&this._events.next(new De(!0,i))}markAsPending(n={}){this.status=ce;let t=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new de(this.status,t)),this.statusChanges.emit(this.status)),this._parent&&!n.onlySelf&&this._parent.markAsPending(et(f({},n),{sourceControl:t}))}disable(n={}){let t=this._parentMarkedDirty(n.onlySelf);this.status=Oe,this.errors=null,this._forEachChild(o=>{o.disable(et(f({},n),{onlySelf:!0}))}),this._updateValue();let i=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new ui(this.value,i)),this._events.next(new de(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(et(f({},n),{skipPristineCheck:t}),this),this._onDisabledChange.forEach(o=>o(!0))}enable(n={}){let t=this._parentMarkedDirty(n.onlySelf);this.status=Te,this._forEachChild(i=>{i.enable(et(f({},n),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent}),this._updateAncestors(et(f({},n),{skipPristineCheck:t}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(n,t){this._parent&&!n.onlySelf&&(this._parent.updateValueAndValidity(n),n.skipPristineCheck||this._parent._updatePristine({},t),this._parent._updateTouched({},t))}setParent(n){this._parent=n}getRawValue(){return this.value}updateValueAndValidity(n={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===Te||this.status===ce)&&this._runAsyncValidator(i,n.emitEvent)}let t=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new ui(this.value,t)),this._events.next(new de(this.status,t)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._parent&&!n.onlySelf&&this._parent.updateValueAndValidity(et(f({},n),{sourceControl:t}))}_updateTreeValidity(n={emitEvent:!0}){this._forEachChild(t=>t._updateTreeValidity(n)),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?Oe:Te}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(n,t){if(this.asyncValidator){this.status=ce,this._hasOwnPendingAsyncValidator={emitEvent:t!==!1};let i=Pn(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(o=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(o,{emitEvent:t,shouldHaveEmitted:n})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let n=this._hasOwnPendingAsyncValidator?.emitEvent??!1;return this._hasOwnPendingAsyncValidator=null,n}return!1}setErrors(n,t={}){this.errors=n,this._updateControlsErrors(t.emitEvent!==!1,this,t.shouldHaveEmitted)}get(n){let t=n;return t==null||(Array.isArray(t)||(t=t.split(".")),t.length===0)?null:t.reduce((i,o)=>i&&i._find(o),this)}getError(n,t){let i=t?this.get(t):this;return i&&i.errors?i.errors[n]:null}hasError(n,t){return!!this.getError(n,t)}get root(){let n=this;for(;n._parent;)n=n._parent;return n}_updateControlsErrors(n,t,i){this.status=this._calculateStatus(),n&&this.statusChanges.emit(this.status),(n||i)&&this._events.next(new de(this.status,t)),this._parent&&this._parent._updateControlsErrors(n,t,i)}_initObservables(){this.valueChanges=new z,this.statusChanges=new z}_calculateStatus(){return this._allControlsDisabled()?Oe:this.errors?ai:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(ce)?ce:this._anyControlsHaveStatus(ai)?ai:Te}_anyControlsHaveStatus(n){return this._anyControls(t=>t.status===n)}_anyControlsDirty(){return this._anyControls(n=>n.dirty)}_anyControlsTouched(){return this._anyControls(n=>n.touched)}_updatePristine(n,t){let i=!this._anyControlsDirty(),o=this.pristine!==i;this.pristine=i,this._parent&&!n.onlySelf&&this._parent._updatePristine(n,t),o&&this._events.next(new De(this.pristine,t))}_updateTouched(n={},t){this.touched=this._anyControlsTouched(),this._events.next(new Ae(this.touched,t)),this._parent&&!n.onlySelf&&this._parent._updateTouched(n,t)}_onDisabledChange=[];_registerOnCollectionChange(n){this._onCollectionChange=n}_setUpdateStrategy(n){_i(n)&&n.updateOn!=null&&(this._updateOn=n.updateOn)}_parentMarkedDirty(n){let t=this._parent&&this._parent.dirty;return!n&&!!t&&!this._parent._anyControlsDirty()}_find(n){return null}_assignValidators(n){this._rawValidators=Array.isArray(n)?n.slice():n,this._composedValidatorFn=Sr(this._rawValidators)}_assignAsyncValidators(n){this._rawAsyncValidators=Array.isArray(n)?n.slice():n,this._composedAsyncValidatorFn=wr(this._rawAsyncValidators)}},pi=class extends ue{constructor(n,t,i){super(Wi(t),ji(i,t)),this.controls=n,this._initObservables(),this._setUpdateStrategy(t),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(n,t){return this.controls[n]?this.controls[n]:(this.controls[n]=t,t.setParent(this),t._registerOnCollectionChange(this._onCollectionChange),t)}addControl(n,t,i={}){this.registerControl(n,t),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}removeControl(n,t={}){this.controls[n]&&this.controls[n]._registerOnCollectionChange(()=>{}),delete this.controls[n],this.updateValueAndValidity({emitEvent:t.emitEvent}),this._onCollectionChange()}setControl(n,t,i={}){this.controls[n]&&this.controls[n]._registerOnCollectionChange(()=>{}),delete this.controls[n],t&&this.registerControl(n,t),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}contains(n){return this.controls.hasOwnProperty(n)&&this.controls[n].enabled}setValue(n,t={}){Qn(this,!0,n),Object.keys(n).forEach(i=>{Zn(this,!0,i),this.controls[i].setValue(n[i],{onlySelf:!0,emitEvent:t.emitEvent})}),this.updateValueAndValidity(t)}patchValue(n,t={}){n!=null&&(Object.keys(n).forEach(i=>{let o=this.controls[i];o&&o.patchValue(n[i],{onlySelf:!0,emitEvent:t.emitEvent})}),this.updateValueAndValidity(t))}reset(n={},t={}){this._forEachChild((i,o)=>{i.reset(n?n[o]:null,{onlySelf:!0,emitEvent:t.emitEvent})}),this._updatePristine(t,this),this._updateTouched(t,this),this.updateValueAndValidity(t)}getRawValue(){return this._reduceChildren({},(n,t,i)=>(n[i]=t.getRawValue(),n))}_syncPendingControls(){let n=this._reduceChildren(!1,(t,i)=>i._syncPendingControls()?!0:t);return n&&this.updateValueAndValidity({onlySelf:!0}),n}_forEachChild(n){Object.keys(this.controls).forEach(t=>{let i=this.controls[t];i&&n(i,t)})}_setUpControls(){this._forEachChild(n=>{n.setParent(this),n._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(n){for(let[t,i]of Object.entries(this.controls))if(this.contains(t)&&n(i))return!0;return!1}_reduceValue(){let n={};return this._reduceChildren(n,(t,i,o)=>((i.enabled||this.disabled)&&(t[o]=i.value),t))}_reduceChildren(n,t){let i=n;return this._forEachChild((o,r)=>{i=t(i,o,r)}),i}_allControlsDisabled(){for(let n of Object.keys(this.controls))if(this.controls[n].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(n){return this.controls.hasOwnProperty(n)?this.controls[n]:null}};var Pi=class extends pi{};var Me=new Mt("",{providedIn:"root",factory:()=>Ci}),Ci="always";function Yn(e,n){return[...n.path,e]}function hi(e,n,t=Ci){Ui(e,n),n.valueAccessor.writeValue(e.value),(e.disabled||t==="always")&&n.valueAccessor.setDisabledState?.(e.disabled),xr(e,n),Tr(e,n),Ir(e,n),Er(e,n)}function fi(e,n,t=!0){let i=()=>{};n.valueAccessor&&(n.valueAccessor.registerOnChange(i),n.valueAccessor.registerOnTouched(i)),mi(e,n),e&&(n._invokeOnDestroyCallbacks(),e._registerOnCollectionChange(()=>{}))}function gi(e,n){e.forEach(t=>{t.registerOnValidatorChange&&t.registerOnValidatorChange(n)})}function Er(e,n){if(n.valueAccessor.setDisabledState){let t=i=>{n.valueAccessor.setDisabledState(i)};e.registerOnDisabledChange(t),n._registerOnDestroy(()=>{e._unregisterOnDisabledChange(t)})}}function Ui(e,n){let t=qn(e);n.validator!==null?e.setValidators(On(t,n.validator)):typeof t=="function"&&e.setValidators([t]);let i=Kn(e);n.asyncValidator!==null?e.setAsyncValidators(On(i,n.asyncValidator)):typeof i=="function"&&e.setAsyncValidators([i]);let o=()=>e.updateValueAndValidity();gi(n._rawValidators,o),gi(n._rawAsyncValidators,o)}function mi(e,n){let t=!1;if(e!==null){if(n.validator!==null){let o=qn(e);if(Array.isArray(o)&&o.length>0){let r=o.filter(s=>s!==n.validator);r.length!==o.length&&(t=!0,e.setValidators(r))}}if(n.asyncValidator!==null){let o=Kn(e);if(Array.isArray(o)&&o.length>0){let r=o.filter(s=>s!==n.asyncValidator);r.length!==o.length&&(t=!0,e.setAsyncValidators(r))}}}let i=()=>{};return gi(n._rawValidators,i),gi(n._rawAsyncValidators,i),t}function xr(e,n){n.valueAccessor.registerOnChange(t=>{e._pendingValue=t,e._pendingChange=!0,e._pendingDirty=!0,e.updateOn==="change"&&Xn(e,n)})}function Ir(e,n){n.valueAccessor.registerOnTouched(()=>{e._pendingTouched=!0,e.updateOn==="blur"&&e._pendingChange&&Xn(e,n),e.updateOn!=="submit"&&e.markAsTouched()})}function Xn(e,n){e._pendingDirty&&e.markAsDirty(),e.setValue(e._pendingValue,{emitModelToViewChange:!1}),n.viewToModelUpdate(e._pendingValue),e._pendingChange=!1}function Tr(e,n){let t=(i,o)=>{n.valueAccessor.writeValue(i),o&&n.viewToModelUpdate(i)};e.registerOnChange(t),n._registerOnDestroy(()=>{e._unregisterOnChange(t)})}function Or(e,n){e==null,Ui(e,n)}function Dr(e,n){return mi(e,n)}function Gi(e,n){if(!e.hasOwnProperty("model"))return!1;let t=e.model;return t.isFirstChange()?!0:!Object.is(n,t.currentValue)}function Ar(e){return Object.getPrototypeOf(e.constructor)===ar}function Lr(e,n){e._syncPendingControls(),n.forEach(t=>{let i=t.control;i.updateOn==="submit"&&i._pendingChange&&(t.viewToModelUpdate(i._pendingValue),i._pendingChange=!1)})}function qi(e,n){if(!n)return null;Array.isArray(n);let t,i,o;return n.forEach(r=>{r.constructor===$n?t=r:Ar(r)?i=r:o=r}),o||i||t||null}function Mr(e,n){let t=e.indexOf(n);t>-1&&e.splice(t,1)}function Ln(e,n){let t=e.indexOf(n);t>-1&&e.splice(t,1)}function Mn(e){return typeof e=="object"&&e!==null&&Object.keys(e).length===2&&"value"in e&&"disabled"in e}var Le=class extends ue{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(n=null,t,i){super(Wi(t),ji(i,t)),this._applyFormState(n),this._setUpdateStrategy(t),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),_i(t)&&(t.nonNullable||t.initialValueIsDefault)&&(Mn(n)?this.defaultValue=n.value:this.defaultValue=n)}setValue(n,t={}){this.value=this._pendingValue=n,this._onChange.length&&t.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,t.emitViewToModelChange!==!1)),this.updateValueAndValidity(t)}patchValue(n,t={}){this.setValue(n,t)}reset(n=this.defaultValue,t={}){this._applyFormState(n),this.markAsPristine(t),this.markAsUntouched(t),this.setValue(this.value,t),this._pendingChange=!1}_updateValue(){}_anyControls(n){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(n){this._onChange.push(n)}_unregisterOnChange(n){Ln(this._onChange,n)}registerOnDisabledChange(n){this._onDisabledChange.push(n)}_unregisterOnDisabledChange(n){Ln(this._onDisabledChange,n)}_forEachChild(n){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(n){Mn(n)?(this.value=this._pendingValue=n.value,n.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=n}};var Vr=e=>e instanceof Le;var Fr={provide:Vt,useExisting:ie(()=>Ki)},Vn=Promise.resolve(),Ki=(()=>{class e extends Vt{_changeDetectorRef;callSetDisabledState;control=new Le;static ngAcceptInputType_isDisabled;_registered=!1;viewModel;name="";isDisabled;model;options;update=new z;constructor(t,i,o,r,s,a){super(),this._changeDetectorRef=s,this.callSetDisabledState=a,this._parent=t,this._setValidators(i),this._setAsyncValidators(o),this.valueAccessor=qi(this,r)}ngOnChanges(t){if(this._checkForErrors(),!this._registered||"name"in t){if(this._registered&&(this._checkName(),this.formDirective)){let i=t.name.previousValue;this.formDirective.removeControl({name:i,path:this._getPath(i)})}this._setUpControl()}"isDisabled"in t&&this._updateDisabled(t),Gi(t,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(t){this.viewModel=t,this.update.emit(t)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){hi(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(t){Vn.then(()=>{this.control.setValue(t,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(t){let i=t.isDisabled.currentValue,o=i!==0&&O(i);Vn.then(()=>{o&&!this.control.disabled?this.control.disable():!o&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(t){return this._parent?Yn(t,this._parent):[t]}static \u0275fac=function(i){return new(i||e)(w(Yt,9),w(bi,10),w(vi,10),w(yi,10),w(ei,8),w(Me,8))};static \u0275dir=A({type:e,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[D([Fr]),_,J]})}return e})();var ll=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275dir=A({type:e,selectors:[["form",3,"ngNoForm","",3,"ngNativeValidate",""]],hostAttrs:["novalidate",""],standalone:!1})}return e})();var Zi=new Mt(""),Rr={provide:Vt,useExisting:ie(()=>$r)},$r=(()=>{class e extends Vt{_ngModelWarningConfig;callSetDisabledState;viewModel;form;set isDisabled(t){}model;update=new z;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(t,i,o,r,s){super(),this._ngModelWarningConfig=r,this.callSetDisabledState=s,this._setValidators(t),this._setAsyncValidators(i),this.valueAccessor=qi(this,o)}ngOnChanges(t){if(this._isControlChanged(t)){let i=t.form.previousValue;i&&fi(i,this,!1),hi(this.form,this,this.callSetDisabledState),this.form.updateValueAndValidity({emitEvent:!1})}Gi(t,this.viewModel)&&(this.form.setValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.form&&fi(this.form,this,!1)}get path(){return[]}get control(){return this.form}viewToModelUpdate(t){this.viewModel=t,this.update.emit(t)}_isControlChanged(t){return t.hasOwnProperty("form")}static \u0275fac=function(i){return new(i||e)(w(bi,10),w(vi,10),w(yi,10),w(Zi,8),w(Me,8))};static \u0275dir=A({type:e,selectors:[["","formControl",""]],inputs:{form:[0,"formControl","form"],isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"]},outputs:{update:"ngModelChange"},exportAs:["ngForm"],standalone:!1,features:[D([Rr]),_,J]})}return e})(),kr={provide:Yt,useExisting:ie(()=>Nr)},Nr=(()=>{class e extends Yt{callSetDisabledState;get submitted(){return It(this._submittedReactive)}set submitted(t){this._submittedReactive.set(t)}_submitted=Tt(()=>this._submittedReactive());_submittedReactive=pt(!1);_oldForm;_onCollectionChange=()=>this._updateDomValue();directives=[];form=null;ngSubmit=new z;constructor(t,i,o){super(),this.callSetDisabledState=o,this._setValidators(t),this._setAsyncValidators(i)}ngOnChanges(t){t.hasOwnProperty("form")&&(this._updateValidators(),this._updateDomValue(),this._updateRegistrations(),this._oldForm=this.form)}ngOnDestroy(){this.form&&(mi(this.form,this),this.form._onCollectionChange===this._onCollectionChange&&this.form._registerOnCollectionChange(()=>{}))}get formDirective(){return this}get control(){return this.form}get path(){return[]}addControl(t){let i=this.form.get(t.path);return hi(i,t,this.callSetDisabledState),i.updateValueAndValidity({emitEvent:!1}),this.directives.push(t),i}getControl(t){return this.form.get(t.path)}removeControl(t){fi(t.control||null,t,!1),Mr(this.directives,t)}addFormGroup(t){this._setUpFormContainer(t)}removeFormGroup(t){this._cleanUpFormContainer(t)}getFormGroup(t){return this.form.get(t.path)}addFormArray(t){this._setUpFormContainer(t)}removeFormArray(t){this._cleanUpFormContainer(t)}getFormArray(t){return this.form.get(t.path)}updateModel(t,i){this.form.get(t.path).setValue(i)}onSubmit(t){return this._submittedReactive.set(!0),Lr(this.form,this.directives),this.ngSubmit.emit(t),this.form._events.next(new ki(this.control)),t?.target?.method==="dialog"}onReset(){this.resetForm()}resetForm(t=void 0){this.form.reset(t),this._submittedReactive.set(!1),this.form._events.next(new Ni(this.form))}_updateDomValue(){this.directives.forEach(t=>{let i=t.control,o=this.form.get(t.path);i!==o&&(fi(i||null,t),Vr(o)&&(hi(o,t,this.callSetDisabledState),t.control=o))}),this.form._updateTreeValidity({emitEvent:!1})}_setUpFormContainer(t){let i=this.form.get(t.path);Or(i,t),i.updateValueAndValidity({emitEvent:!1})}_cleanUpFormContainer(t){if(this.form){let i=this.form.get(t.path);i&&Dr(i,t)&&i.updateValueAndValidity({emitEvent:!1})}}_updateRegistrations(){this.form._registerOnCollectionChange(this._onCollectionChange),this._oldForm&&this._oldForm._registerOnCollectionChange(()=>{})}_updateValidators(){Ui(this.form,this),this._oldForm&&mi(this._oldForm,this)}static \u0275fac=function(i){return new(i||e)(w(bi,10),w(vi,10),w(Me,8))};static \u0275dir=A({type:e,selectors:[["","formGroup",""]],hostBindings:function(i,o){i&1&&gt("submit",function(s){return o.onSubmit(s)})("reset",function(){return o.onReset()})},inputs:{form:[0,"formGroup","form"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[D([kr]),_,J]})}return e})();var Pr={provide:Vt,useExisting:ie(()=>Br)},Br=(()=>{class e extends Vt{_ngModelWarningConfig;_added=!1;viewModel;control;name=null;set isDisabled(t){}model;update=new z;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(t,i,o,r,s){super(),this._ngModelWarningConfig=s,this._parent=t,this._setValidators(i),this._setAsyncValidators(o),this.valueAccessor=qi(this,r)}ngOnChanges(t){this._added||this._setUpControl(),Gi(t,this.viewModel)&&(this.viewModel=this.model,this.formDirective.updateModel(this,this.model))}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}viewToModelUpdate(t){this.viewModel=t,this.update.emit(t)}get path(){return Yn(this.name==null?this.name:this.name.toString(),this._parent)}get formDirective(){return this._parent?this._parent.formDirective:null}_setUpControl(){this.control=this.formDirective.addControl(this),this._added=!0}static \u0275fac=function(i){return new(i||e)(w(Yt,13),w(bi,10),w(vi,10),w(yi,10),w(Zi,8))};static \u0275dir=A({type:e,selectors:[["","formControlName",""]],inputs:{name:[0,"formControlName","name"],isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"]},outputs:{update:"ngModelChange"},standalone:!1,features:[D([Pr]),_,J]})}return e})();var Jn=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({})}return e})(),Bi=class extends ue{constructor(n,t,i){super(Wi(t),ji(i,t)),this.controls=n,this._initObservables(),this._setUpdateStrategy(t),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;at(n){return this.controls[this._adjustIndex(n)]}push(n,t={}){this.controls.push(n),this._registerControl(n),this.updateValueAndValidity({emitEvent:t.emitEvent}),this._onCollectionChange()}insert(n,t,i={}){this.controls.splice(n,0,t),this._registerControl(t),this.updateValueAndValidity({emitEvent:i.emitEvent})}removeAt(n,t={}){let i=this._adjustIndex(n);i<0&&(i=0),this.controls[i]&&this.controls[i]._registerOnCollectionChange(()=>{}),this.controls.splice(i,1),this.updateValueAndValidity({emitEvent:t.emitEvent})}setControl(n,t,i={}){let o=this._adjustIndex(n);o<0&&(o=0),this.controls[o]&&this.controls[o]._registerOnCollectionChange(()=>{}),this.controls.splice(o,1),t&&(this.controls.splice(o,0,t),this._registerControl(t)),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}get length(){return this.controls.length}setValue(n,t={}){Qn(this,!1,n),n.forEach((i,o)=>{Zn(this,!1,o),this.at(o).setValue(i,{onlySelf:!0,emitEvent:t.emitEvent})}),this.updateValueAndValidity(t)}patchValue(n,t={}){n!=null&&(n.forEach((i,o)=>{this.at(o)&&this.at(o).patchValue(i,{onlySelf:!0,emitEvent:t.emitEvent})}),this.updateValueAndValidity(t))}reset(n=[],t={}){this._forEachChild((i,o)=>{i.reset(n[o],{onlySelf:!0,emitEvent:t.emitEvent})}),this._updatePristine(t,this),this._updateTouched(t,this),this.updateValueAndValidity(t)}getRawValue(){return this.controls.map(n=>n.getRawValue())}clear(n={}){this.controls.length<1||(this._forEachChild(t=>t._registerOnCollectionChange(()=>{})),this.controls.splice(0),this.updateValueAndValidity({emitEvent:n.emitEvent}))}_adjustIndex(n){return n<0?n+this.length:n}_syncPendingControls(){let n=this.controls.reduce((t,i)=>i._syncPendingControls()?!0:t,!1);return n&&this.updateValueAndValidity({onlySelf:!0}),n}_forEachChild(n){this.controls.forEach((t,i)=>{n(t,i)})}_updateValue(){this.value=this.controls.filter(n=>n.enabled||this.disabled).map(n=>n.value)}_anyControls(n){return this.controls.some(t=>t.enabled&&n(t))}_setUpControls(){this._forEachChild(n=>this._registerControl(n))}_allControlsDisabled(){for(let n of this.controls)if(n.enabled)return!1;return this.controls.length>0||this.disabled}_registerControl(n){n.setParent(this),n._registerOnCollectionChange(this._onCollectionChange)}_find(n){return this.at(n)??null}};function Fn(e){return!!e&&(e.asyncValidators!==void 0||e.validators!==void 0||e.updateOn!==void 0)}var cl=(()=>{class e{useNonNullable=!1;get nonNullable(){let t=new e;return t.useNonNullable=!0,t}group(t,i=null){let o=this._reduceControls(t),r={};return Fn(i)?r=i:i!==null&&(r.validators=i.validator,r.asyncValidators=i.asyncValidator),new pi(o,r)}record(t,i=null){let o=this._reduceControls(t);return new Pi(o,i)}control(t,i,o){let r={};return this.useNonNullable?(Fn(i)?r=i:(r.validators=i,r.asyncValidators=o),new Le(t,et(f({},r),{nonNullable:!0}))):new Le(t,i,o)}array(t,i,o){let r=t.map(s=>this._createControl(s));return new Bi(r,i,o)}_reduceControls(t){let i={};return Object.keys(t).forEach(o=>{i[o]=this._createControl(t[o])}),i}_createControl(t){if(t instanceof Le)return t;if(t instanceof ue)return t;if(Array.isArray(t)){let i=t[0],o=t.length>1?t[1]:null,r=t.length>2?t[2]:null;return this.control(i,o,r)}else return this.control(t)}static \u0275fac=function(i){return new(i||e)};static \u0275prov=I({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var dl=(()=>{class e{static withConfig(t){return{ngModule:e,providers:[{provide:Me,useValue:t.callSetDisabledState??Ci}]}}static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({imports:[Jn]})}return e})(),ul=(()=>{class e{static withConfig(t){return{ngModule:e,providers:[{provide:Zi,useValue:t.warnOnNgModelWithFormControl??"always"},{provide:Me,useValue:t.callSetDisabledState??Ci}]}}static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({imports:[Jn]})}return e})();function Xt(e,n){return e?e.classList?e.classList.contains(n):new RegExp("(^| )"+n+"( |$)","gi").test(e.className):!1}function vt(e,n){if(e&&n){let t=i=>{Xt(e,i)||(e.classList?e.classList.add(i):e.className+=" "+i)};[n].flat().filter(Boolean).forEach(i=>i.split(" ").forEach(t))}}function zr(){return window.innerWidth-document.documentElement.offsetWidth}function pe(e){for(let n of document?.styleSheets)try{for(let t of n?.cssRules)for(let i of t?.style)if(e.test(i))return{name:i,value:t.style.getPropertyValue(i).trim()}}catch{}return null}function fl(e="p-overflow-hidden"){let n=pe(/-scrollbar-width$/);n?.name&&document.body.style.setProperty(n.name,zr()+"px"),vt(document.body,e)}function Ft(e,n){if(e&&n){let t=i=>{e.classList?e.classList.remove(i):e.className=e.className.replace(new RegExp("(^|\\b)"+i.split(" ").join("|")+"(\\b|$)","gi")," ")};[n].flat().filter(Boolean).forEach(i=>i.split(" ").forEach(t))}}function gl(e="p-overflow-hidden"){let n=pe(/-scrollbar-width$/);n?.name&&document.body.style.removeProperty(n.name),Ft(document.body,e)}function to(e){let n={width:0,height:0};return e&&(e.style.visibility="hidden",e.style.display="block",n.width=e.offsetWidth,n.height=e.offsetHeight,e.style.display="none",e.style.visibility="visible"),n}function Si(){let e=window,n=document,t=n.documentElement,i=n.getElementsByTagName("body")[0],o=e.innerWidth||t.clientWidth||i.clientWidth,r=e.innerHeight||t.clientHeight||i.clientHeight;return{width:o,height:r}}function Qi(){let e=document.documentElement;return(window.pageXOffset||e.scrollLeft)-(e.clientLeft||0)}function Yi(){let e=document.documentElement;return(window.pageYOffset||e.scrollTop)-(e.clientTop||0)}function ml(e,n,t=!0){var i,o,r,s;if(e){let a=e.offsetParent?{width:e.offsetWidth,height:e.offsetHeight}:to(e),l=a.height,c=a.width,d=n.offsetHeight,p=n.offsetWidth,u=n.getBoundingClientRect(),h=Yi(),m=Qi(),x=Si(),y,C,S="top";u.top+d+l>x.height?(y=u.top+h-l,S="bottom",y<0&&(y=h)):y=d+u.top+h,u.left+c>x.width?C=Math.max(0,u.left+m+p-c):C=u.left+m,e.style.top=y+"px",e.style.left=C+"px",e.style.transformOrigin=S,t&&(e.style.marginTop=S==="bottom"?`calc(${(o=(i=pe(/-anchor-gutter$/))==null?void 0:i.value)!=null?o:"2px"} * -1)`:(s=(r=pe(/-anchor-gutter$/))==null?void 0:r.value)!=null?s:"")}}function yl(e,n){e&&(typeof n=="string"?e.style.cssText=n:Object.entries(n||{}).forEach(([t,i])=>e.style[t]=i))}function Ot(e,n){if(e instanceof HTMLElement){let t=e.offsetWidth;if(n){let i=getComputedStyle(e);t+=parseFloat(i.marginLeft)+parseFloat(i.marginRight)}return t}return 0}function bl(e,n,t=!0){var i,o,r,s;if(e){let a=e.offsetParent?{width:e.offsetWidth,height:e.offsetHeight}:to(e),l=n.offsetHeight,c=n.getBoundingClientRect(),d=Si(),p,u,h="top";c.top+l+a.height>d.height?(p=-1*a.height,h="bottom",c.top+p<0&&(p=-1*c.top)):p=l,a.width>d.width?u=c.left*-1:c.left+a.width>d.width?u=(c.left+a.width-d.width)*-1:u=0,e.style.top=p+"px",e.style.left=u+"px",e.style.transformOrigin=h,t&&(e.style.marginTop=h==="bottom"?`calc(${(o=(i=pe(/-anchor-gutter$/))==null?void 0:i.value)!=null?o:"2px"} * -1)`:(s=(r=pe(/-anchor-gutter$/))==null?void 0:r.value)!=null?s:"")}}function Ve(e){return typeof HTMLElement=="object"?e instanceof HTMLElement:e&&typeof e=="object"&&e!==null&&e.nodeType===1&&typeof e.nodeName=="string"}function Xi(e){let n=e;return e&&typeof e=="object"&&(e.hasOwnProperty("current")?n=e.current:e.hasOwnProperty("el")&&(e.el.hasOwnProperty("nativeElement")?n=e.el.nativeElement:n=e.el)),Ve(n)?n:void 0}function Ji(e,n){let t=Xi(e);if(t)t.appendChild(n);else throw new Error("Cannot append "+n+" to "+e)}function wi(e,n={}){if(Ve(e)){let t=(i,o)=>{var r,s;let a=(r=e?.$attrs)!=null&&r[i]?[(s=e?.$attrs)==null?void 0:s[i]]:[];return[o].flat().reduce((l,c)=>{if(c!=null){let d=typeof c;if(d==="string"||d==="number")l.push(c);else if(d==="object"){let p=Array.isArray(c)?t(i,c):Object.entries(c).map(([u,h])=>i==="style"&&(h||h===0)?`${u.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}:${h}`:h?u:void 0);l=p.length?l.concat(p.filter(u=>!!u)):l}}return l},a)};Object.entries(n).forEach(([i,o])=>{if(o!=null){let r=i.match(/^on(.+)/);r?e.addEventListener(r[1].toLowerCase(),o):i==="p-bind"||i==="pBind"?wi(e,o):(o=i==="class"?[...new Set(t("class",o))].join(" ").trim():i==="style"?t("style",o).join(";").trim():o,(e.$attrs=e.$attrs||{})&&(e.$attrs[i]=o),e.setAttribute(i,o))}})}}function vl(e,n={},...t){if(e){let i=document.createElement(e);return wi(i,n),i.append(...t),i}}function eo(e,n){if(e){e.style.opacity="0";let t=+new Date,i="0",o=function(){i=`${+e.style.opacity+(new Date().getTime()-t)/n}`,e.style.opacity=i,t=+new Date,+i<1&&(window.requestAnimationFrame&&requestAnimationFrame(o)||setTimeout(o,16))};o()}}function Wr(e,n){return Ve(e)?Array.from(e.querySelectorAll(n)):[]}function _t(e,n){return Ve(e)?e.matches(n)?e:e.querySelector(n):null}function tn(e,n){e&&document.activeElement!==e&&e.focus(n)}function io(e,n=""){let t=Wr(e,`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n}`),i=[];for(let o of t)getComputedStyle(o).display!="none"&&getComputedStyle(o).visibility!="hidden"&&i.push(o);return i}function _l(e,n){let t=io(e,n);return t.length>0?t[0]:null}function Dt(e){if(e){let n=e.offsetHeight,t=getComputedStyle(e);return n-=parseFloat(t.paddingTop)+parseFloat(t.paddingBottom)+parseFloat(t.borderTopWidth)+parseFloat(t.borderBottomWidth),n}return 0}function no(e){if(e){let n=e.parentNode;return n&&n instanceof ShadowRoot&&n.host&&(n=n.host),n}return null}function Cl(e){var n;if(e){let t=(n=no(e))==null?void 0:n.childNodes,i=0;if(t)for(let o=0;o<t.length;o++){if(t[o]===e)return i;t[o].nodeType===1&&i++}}return-1}function Sl(e,n){let t=io(e,n);return t.length>0?t[t.length-1]:null}function oo(e){if(e){let n=e.getBoundingClientRect();return{top:n.top+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0),left:n.left+(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0)}}return{top:"auto",left:"auto"}}function Ct(e,n){if(e){let t=e.offsetHeight;if(n){let i=getComputedStyle(e);t+=parseFloat(i.marginTop)+parseFloat(i.marginBottom)}return t}return 0}function wl(){if(window.getSelection)return window.getSelection().toString();if(document.getSelection)return document.getSelection().toString()}function jr(e){return!!(e!==null&&typeof e<"u"&&e.nodeName&&no(e))}function ro(e,n){var t;if(e)switch(e){case"document":return document;case"window":return window;case"body":return document.body;case"@next":return n?.nextElementSibling;case"@prev":return n?.previousElementSibling;case"@parent":return n?.parentElement;case"@grandparent":return(t=n?.parentElement)==null?void 0:t.parentElement;default:if(typeof e=="string")return document.querySelector(e);let o=Xi((r=>!!(r&&r.constructor&&r.call&&r.apply))(e)?e():e);return o?.nodeType===9||jr(o)?o:void 0}}function At(e){if(e){let n=e.offsetWidth,t=getComputedStyle(e);return n-=parseFloat(t.paddingLeft)+parseFloat(t.paddingRight)+parseFloat(t.borderLeftWidth)+parseFloat(t.borderRightWidth),n}return 0}function en(e){return!!(e&&e.offsetParent!=null)}function Jt(){return"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0}function so(e){var n;e&&("remove"in Element.prototype?e.remove():(n=e.parentNode)==null||n.removeChild(e))}function ao(e,n){let t=Xi(e);if(t)t.removeChild(n);else throw new Error("Cannot remove "+n+" from "+e)}function El(e,n){let t=getComputedStyle(e).getPropertyValue("borderTopWidth"),i=t?parseFloat(t):0,o=getComputedStyle(e).getPropertyValue("paddingTop"),r=o?parseFloat(o):0,s=e.getBoundingClientRect(),l=n.getBoundingClientRect().top+document.body.scrollTop-(s.top+document.body.scrollTop)-i-r,c=e.scrollTop,d=e.clientHeight,p=Ct(n);l<0?e.scrollTop=c+l:l+p>d&&(e.scrollTop=c+l-d+p)}function xl(e,n="",t){Ve(e)&&t!==null&&t!==void 0&&e.setAttribute(n,t)}function lo(){let e=new Map;return{on(n,t){let i=e.get(n);return i?i.push(t):i=[t],e.set(n,i),this},off(n,t){let i=e.get(n);return i&&i.splice(i.indexOf(t)>>>0,1),this},emit(n,t){let i=e.get(n);i&&i.slice().map(o=>{o(t)})},clear(){e.clear()}}}var Ur=Object.defineProperty,co=Object.getOwnPropertySymbols,Gr=Object.prototype.hasOwnProperty,qr=Object.prototype.propertyIsEnumerable,uo=(e,n,t)=>n in e?Ur(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,Kr=(e,n)=>{for(var t in n||(n={}))Gr.call(n,t)&&uo(e,t,n[t]);if(co)for(var t of co(n))qr.call(n,t)&&uo(e,t,n[t]);return e};function Y(e){return e==null||e===""||Array.isArray(e)&&e.length===0||!(e instanceof Date)&&typeof e=="object"&&Object.keys(e).length===0}function nn(e,n,t=new WeakSet){if(e===n)return!0;if(!e||!n||typeof e!="object"||typeof n!="object"||t.has(e)||t.has(n))return!1;t.add(e).add(n);let i=Array.isArray(e),o=Array.isArray(n),r,s,a;if(i&&o){if(s=e.length,s!=n.length)return!1;for(r=s;r--!==0;)if(!nn(e[r],n[r],t))return!1;return!0}if(i!=o)return!1;let l=e instanceof Date,c=n instanceof Date;if(l!=c)return!1;if(l&&c)return e.getTime()==n.getTime();let d=e instanceof RegExp,p=n instanceof RegExp;if(d!=p)return!1;if(d&&p)return e.toString()==n.toString();let u=Object.keys(e);if(s=u.length,s!==Object.keys(n).length)return!1;for(r=s;r--!==0;)if(!Object.prototype.hasOwnProperty.call(n,u[r]))return!1;for(r=s;r--!==0;)if(a=u[r],!nn(e[a],n[a],t))return!1;return!0}function Zr(e,n){return nn(e,n)}function ho(e){return!!(e&&e.constructor&&e.call&&e.apply)}function M(e){return!Y(e)}function Ei(e,n){if(!e||!n)return null;try{let t=e[n];if(M(t))return t}catch{}if(Object.keys(e).length){if(ho(n))return n(e);if(n.indexOf(".")===-1)return e[n];{let t=n.split("."),i=e;for(let o=0,r=t.length;o<r;++o){if(i==null)return null;i=i[t[o]]}return i}}return null}function on(e,n,t){return t?Ei(e,t)===Ei(n,t):Zr(e,n)}function Dl(e,n){if(e!=null&&n&&n.length){for(let t of n)if(on(e,t))return!0}return!1}function Al(e,n){let t=-1;if(M(e))try{t=e.findLastIndex(n)}catch{t=e.lastIndexOf([...e].reverse().find(n))}return t}function St(e,n=!0){return e instanceof Object&&e.constructor===Object&&(n||Object.keys(e).length!==0)}function mt(e,...n){return ho(e)?e(...n):e}function Wt(e,n=!0){return typeof e=="string"&&(n||e!=="")}function po(e){return Wt(e)?e.replace(/(-|_)/g,"").toLowerCase():e}function xi(e,n="",t={}){let i=po(n).split("."),o=i.shift();return o?St(e)?xi(mt(e[Object.keys(e).find(r=>po(r)===o)||""],t),i.join("."),t):void 0:mt(e,t)}function Ii(e,n=!0){return Array.isArray(e)&&(n||e.length!==0)}function Ll(e){return e instanceof Date&&e.constructor===Date}function fo(e){return M(e)&&!isNaN(e)}function Ml(e=""){return M(e)&&e.length===1&&!!e.match(/\S| /)}function at(e,n){if(n){let t=n.test(e);return n.lastIndex=0,t}return!1}function Fe(...e){let n=(t={},i={})=>{let o=Kr({},t);return Object.keys(i).forEach(r=>{St(i[r])&&r in t&&St(t[r])?o[r]=n(t[r],i[r]):o[r]=i[r]}),o};return e.reduce((t,i,o)=>o===0?i:n(t,i),{})}function te(e){return e&&e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g,"").replace(/ {2,}/g," ").replace(/ ([{:}]) /g,"$1").replace(/([;,]) /g,"$1").replace(/ !/g,"!").replace(/: /g,":")}function lt(e){if(e&&/[\xC0-\xFF\u0100-\u017E]/.test(e)){let t={A:/[\xC0-\xC5\u0100\u0102\u0104]/g,AE:/[\xC6]/g,C:/[\xC7\u0106\u0108\u010A\u010C]/g,D:/[\xD0\u010E\u0110]/g,E:/[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g,G:/[\u011C\u011E\u0120\u0122]/g,H:/[\u0124\u0126]/g,I:/[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g,IJ:/[\u0132]/g,J:/[\u0134]/g,K:/[\u0136]/g,L:/[\u0139\u013B\u013D\u013F\u0141]/g,N:/[\xD1\u0143\u0145\u0147\u014A]/g,O:/[\xD2-\xD6\xD8\u014C\u014E\u0150]/g,OE:/[\u0152]/g,R:/[\u0154\u0156\u0158]/g,S:/[\u015A\u015C\u015E\u0160]/g,T:/[\u0162\u0164\u0166]/g,U:/[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g,W:/[\u0174]/g,Y:/[\xDD\u0176\u0178]/g,Z:/[\u0179\u017B\u017D]/g,a:/[\xE0-\xE5\u0101\u0103\u0105]/g,ae:/[\xE6]/g,c:/[\xE7\u0107\u0109\u010B\u010D]/g,d:/[\u010F\u0111]/g,e:/[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g,g:/[\u011D\u011F\u0121\u0123]/g,i:/[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g,ij:/[\u0133]/g,j:/[\u0135]/g,k:/[\u0137,\u0138]/g,l:/[\u013A\u013C\u013E\u0140\u0142]/g,n:/[\xF1\u0144\u0146\u0148\u014B]/g,p:/[\xFE]/g,o:/[\xF2-\xF6\xF8\u014D\u014F\u0151]/g,oe:/[\u0153]/g,r:/[\u0155\u0157\u0159]/g,s:/[\u015B\u015D\u015F\u0161]/g,t:/[\u0163\u0165\u0167]/g,u:/[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g,w:/[\u0175]/g,y:/[\xFD\xFF\u0177]/g,z:/[\u017A\u017C\u017E]/g};for(let i in t)e=e.replace(t[i],i)}return e}function Ti(e){return Wt(e)?e.replace(/(_)/g,"-").replace(/[A-Z]/g,(n,t)=>t===0?n:"-"+n.toLowerCase()).toLowerCase():e}function rn(e){return Wt(e)?e.replace(/[A-Z]/g,(n,t)=>t===0?n:"."+n.toLowerCase()).toLowerCase():e}var Oi={};function Rt(e="pui_id_"){return Oi.hasOwnProperty(e)||(Oi[e]=0),Oi[e]++,`${e}${Oi[e]}`}function Qr(){let e=[],n=(s,a,l=999)=>{let c=o(s,a,l),d=c.value+(c.key===s?0:l)+1;return e.push({key:s,value:d}),d},t=s=>{e=e.filter(a=>a.value!==s)},i=(s,a)=>o(s,a).value,o=(s,a,l=0)=>[...e].reverse().find(c=>a?!0:c.key===s)||{key:s,value:l},r=s=>s&&parseInt(s.style.zIndex,10)||0;return{get:r,set:(s,a,l)=>{a&&(a.style.zIndex=String(n(s,!0,l)))},clear:s=>{s&&(t(r(s)),s.style.zIndex="")},getCurrent:s=>i(s,!0)}}var Rl=Qr();var Yr=Object.defineProperty,Xr=Object.defineProperties,Jr=Object.getOwnPropertyDescriptors,Di=Object.getOwnPropertySymbols,yo=Object.prototype.hasOwnProperty,bo=Object.prototype.propertyIsEnumerable,go=(e,n,t)=>n in e?Yr(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,Et=(e,n)=>{for(var t in n||(n={}))yo.call(n,t)&&go(e,t,n[t]);if(Di)for(var t of Di(n))bo.call(n,t)&&go(e,t,n[t]);return e},sn=(e,n)=>Xr(e,Jr(n)),$t=(e,n)=>{var t={};for(var i in e)yo.call(e,i)&&n.indexOf(i)<0&&(t[i]=e[i]);if(e!=null&&Di)for(var i of Di(e))n.indexOf(i)<0&&bo.call(e,i)&&(t[i]=e[i]);return t};function Gl(...e){return Fe(...e)}var ts=lo(),ct=ts;function mo(e,n){Ii(e)?e.push(...n||[]):St(e)&&Object.assign(e,n)}function es(e){return St(e)&&e.hasOwnProperty("value")&&e.hasOwnProperty("type")?e.value:e}function is(e){return e.replaceAll(/ /g,"").replace(/[^\w]/g,"-")}function an(e="",n=""){return is(`${Wt(e,!1)&&Wt(n,!1)?`${e}-`:e}${n}`)}function vo(e="",n=""){return`--${an(e,n)}`}function ns(e=""){let n=(e.match(/{/g)||[]).length,t=(e.match(/}/g)||[]).length;return(n+t)%2!==0}function _o(e,n="",t="",i=[],o){if(Wt(e)){let r=/{([^}]*)}/g,s=e.trim();if(ns(s))return;if(at(s,r)){let a=s.replaceAll(r,d=>{let u=d.replace(/{|}/g,"").split(".").filter(h=>!i.some(m=>at(h,m)));return`var(${vo(t,Ti(u.join("-")))}${M(o)?`, ${o}`:""})`}),l=/(\d+\s+[\+\-\*\/]\s+\d+)/g,c=/var\([^)]+\)/g;return at(a.replace(c,"0"),l)?`calc(${a})`:a}return s}else if(fo(e))return e}function os(e,n,t){Wt(n,!1)&&e.push(`${n}:${t};`)}function he(e,n){return e?`${e}{${n}}`:""}var fe=(...e)=>rs(V.getTheme(),...e),rs=(e={},n,t,i)=>{if(n){let{variable:o,options:r}=V.defaults||{},{prefix:s,transform:a}=e?.options||r||{},c=at(n,/{([^}]*)}/g)?n:`{${n}}`;return i==="value"||Y(i)&&a==="strict"?V.getTokenValue(n):_o(c,void 0,s,[o.excludedKeyRegex],t)}return""};function ss(e,n={}){let t=V.defaults.variable,{prefix:i=t.prefix,selector:o=t.selector,excludedKeyRegex:r=t.excludedKeyRegex}=n,s=(c,d="")=>Object.entries(c).reduce((p,[u,h])=>{let m=at(u,r)?an(d):an(d,Ti(u)),x=es(h);if(St(x)){let{variables:y,tokens:C}=s(x,m);mo(p.tokens,C),mo(p.variables,y)}else p.tokens.push((i?m.replace(`${i}-`,""):m).replaceAll("-",".")),os(p.variables,vo(m),_o(x,m,i,[r]));return p},{variables:[],tokens:[]}),{variables:a,tokens:l}=s(e,i);return{value:a,tokens:l,declarations:a.join(""),css:he(o,a.join(""))}}var wt={regex:{rules:{class:{pattern:/^\.([a-zA-Z][\w-]*)$/,resolve(e){return{type:"class",selector:e,matched:this.pattern.test(e.trim())}}},attr:{pattern:/^\[(.*)\]$/,resolve(e){return{type:"attr",selector:`:root${e}`,matched:this.pattern.test(e.trim())}}},media:{pattern:/^@media (.*)$/,resolve(e){return{type:"media",selector:`${e}{:root{[CSS]}}`,matched:this.pattern.test(e.trim())}}},system:{pattern:/^system$/,resolve(e){return{type:"system",selector:"@media (prefers-color-scheme: dark){:root{[CSS]}}",matched:this.pattern.test(e.trim())}}},custom:{resolve(e){return{type:"custom",selector:e,matched:!0}}}},resolve(e){let n=Object.keys(this.rules).filter(t=>t!=="custom").map(t=>this.rules[t]);return[e].flat().map(t=>{var i;return(i=n.map(o=>o.resolve(t)).find(o=>o.matched))!=null?i:this.rules.custom.resolve(t)})}},_toVariables(e,n){return ss(e,{prefix:n?.prefix})},getCommon({name:e="",theme:n={},params:t,set:i,defaults:o}){var r,s,a,l,c,d,p;let{preset:u,options:h}=n,m,x,y,C,S,q,G;if(M(u)&&h.transform!=="strict"){let{primitive:dt,semantic:Lt,extend:Re}=u,be=Lt||{},{colorScheme:$e}=be,ke=$t(be,["colorScheme"]),Ne=Re||{},{colorScheme:Pe}=Ne,ve=$t(Ne,["colorScheme"]),_e=$e||{},{dark:Be}=_e,He=$t(_e,["dark"]),ze=Pe||{},{dark:We}=ze,je=$t(ze,["dark"]),Ue=M(dt)?this._toVariables({primitive:dt},h):{},Ge=M(ke)?this._toVariables({semantic:ke},h):{},qe=M(He)?this._toVariables({light:He},h):{},un=M(Be)?this._toVariables({dark:Be},h):{},pn=M(ve)?this._toVariables({semantic:ve},h):{},hn=M(je)?this._toVariables({light:je},h):{},fn=M(We)?this._toVariables({dark:We},h):{},[Wo,jo]=[(r=Ue.declarations)!=null?r:"",Ue.tokens],[Uo,Go]=[(s=Ge.declarations)!=null?s:"",Ge.tokens||[]],[qo,Ko]=[(a=qe.declarations)!=null?a:"",qe.tokens||[]],[Zo,Qo]=[(l=un.declarations)!=null?l:"",un.tokens||[]],[Yo,Xo]=[(c=pn.declarations)!=null?c:"",pn.tokens||[]],[Jo,tr]=[(d=hn.declarations)!=null?d:"",hn.tokens||[]],[er,ir]=[(p=fn.declarations)!=null?p:"",fn.tokens||[]];m=this.transformCSS(e,Wo,"light","variable",h,i,o),x=jo;let nr=this.transformCSS(e,`${Uo}${qo}`,"light","variable",h,i,o),or=this.transformCSS(e,`${Zo}`,"dark","variable",h,i,o);y=`${nr}${or}`,C=[...new Set([...Go,...Ko,...Qo])];let rr=this.transformCSS(e,`${Yo}${Jo}color-scheme:light`,"light","variable",h,i,o),sr=this.transformCSS(e,`${er}color-scheme:dark`,"dark","variable",h,i,o);S=`${rr}${sr}`,q=[...new Set([...Xo,...tr,...ir])],G=mt(u.css,{dt:fe})}return{primitive:{css:m,tokens:x},semantic:{css:y,tokens:C},global:{css:S,tokens:q},style:G}},getPreset({name:e="",preset:n={},options:t,params:i,set:o,defaults:r,selector:s}){var a,l,c;let d,p,u;if(M(n)&&t.transform!=="strict"){let h=e.replace("-directive",""),m=n,{colorScheme:x,extend:y,css:C}=m,S=$t(m,["colorScheme","extend","css"]),q=y||{},{colorScheme:G}=q,dt=$t(q,["colorScheme"]),Lt=x||{},{dark:Re}=Lt,be=$t(Lt,["dark"]),$e=G||{},{dark:ke}=$e,Ne=$t($e,["dark"]),Pe=M(S)?this._toVariables({[h]:Et(Et({},S),dt)},t):{},ve=M(be)?this._toVariables({[h]:Et(Et({},be),Ne)},t):{},_e=M(Re)?this._toVariables({[h]:Et(Et({},Re),ke)},t):{},[Be,He]=[(a=Pe.declarations)!=null?a:"",Pe.tokens||[]],[ze,We]=[(l=ve.declarations)!=null?l:"",ve.tokens||[]],[je,Ue]=[(c=_e.declarations)!=null?c:"",_e.tokens||[]],Ge=this.transformCSS(h,`${Be}${ze}`,"light","variable",t,o,r,s),qe=this.transformCSS(h,je,"dark","variable",t,o,r,s);d=`${Ge}${qe}`,p=[...new Set([...He,...We,...Ue])],u=mt(C,{dt:fe})}return{css:d,tokens:p,style:u}},getPresetC({name:e="",theme:n={},params:t,set:i,defaults:o}){var r;let{preset:s,options:a}=n,l=(r=s?.components)==null?void 0:r[e];return this.getPreset({name:e,preset:l,options:a,params:t,set:i,defaults:o})},getPresetD({name:e="",theme:n={},params:t,set:i,defaults:o}){var r;let s=e.replace("-directive",""),{preset:a,options:l}=n,c=(r=a?.directives)==null?void 0:r[s];return this.getPreset({name:s,preset:c,options:l,params:t,set:i,defaults:o})},applyDarkColorScheme(e){return!(e.darkModeSelector==="none"||e.darkModeSelector===!1)},getColorSchemeOption(e,n){var t;return this.applyDarkColorScheme(e)?this.regex.resolve(e.darkModeSelector===!0?n.options.darkModeSelector:(t=e.darkModeSelector)!=null?t:n.options.darkModeSelector):[]},getLayerOrder(e,n={},t,i){let{cssLayer:o}=n;return o?`@layer ${mt(o.order||"primeui",t)}`:""},getCommonStyleSheet({name:e="",theme:n={},params:t,props:i={},set:o,defaults:r}){let s=this.getCommon({name:e,theme:n,params:t,set:o,defaults:r}),a=Object.entries(i).reduce((l,[c,d])=>l.push(`${c}="${d}"`)&&l,[]).join(" ");return Object.entries(s||{}).reduce((l,[c,d])=>{if(d?.css){let p=te(d?.css),u=`${c}-variables`;l.push(`<style type="text/css" data-primevue-style-id="${u}" ${a}>${p}</style>`)}return l},[]).join("")},getStyleSheet({name:e="",theme:n={},params:t,props:i={},set:o,defaults:r}){var s;let a={name:e,theme:n,params:t,set:o,defaults:r},l=(s=e.includes("-directive")?this.getPresetD(a):this.getPresetC(a))==null?void 0:s.css,c=Object.entries(i).reduce((d,[p,u])=>d.push(`${p}="${u}"`)&&d,[]).join(" ");return l?`<style type="text/css" data-primevue-style-id="${e}-variables" ${c}>${te(l)}</style>`:""},createTokens(e={},n,t="",i="",o={}){return Object.entries(e).forEach(([r,s])=>{let a=at(r,n.variable.excludedKeyRegex)?t:t?`${t}.${rn(r)}`:rn(r),l=i?`${i}.${r}`:r;St(s)?this.createTokens(s,n,a,l,o):(o[a]||(o[a]={paths:[],computed(c,d={}){var p,u;return this.paths.length===1?(p=this.paths[0])==null?void 0:p.computed(this.paths[0].scheme,d.binding):c&&c!=="none"?(u=this.paths.find(h=>h.scheme===c))==null?void 0:u.computed(c,d.binding):this.paths.map(h=>h.computed(h.scheme,d[h.scheme]))}}),o[a].paths.push({path:l,value:s,scheme:l.includes("colorScheme.light")?"light":l.includes("colorScheme.dark")?"dark":"none",computed(c,d={}){let p=/{([^}]*)}/g,u=s;if(d.name=this.path,d.binding||(d.binding={}),at(s,p)){let m=s.trim().replaceAll(p,C=>{var S;let q=C.replace(/{|}/g,""),G=(S=o[q])==null?void 0:S.computed(c,d);return Ii(G)&&G.length===2?`light-dark(${G[0].value},${G[1].value})`:G?.value}),x=/(\d+\w*\s+[\+\-\*\/]\s+\d+\w*)/g,y=/var\([^)]+\)/g;u=at(m.replace(y,"0"),x)?`calc(${m})`:m}return Y(d.binding)&&delete d.binding,{colorScheme:c,path:this.path,paths:d,value:u.includes("undefined")?void 0:u}}}))}),o},getTokenValue(e,n,t){var i;let r=(l=>l.split(".").filter(d=>!at(d.toLowerCase(),t.variable.excludedKeyRegex)).join("."))(n),s=n.includes("colorScheme.light")?"light":n.includes("colorScheme.dark")?"dark":void 0,a=[(i=e[r])==null?void 0:i.computed(s)].flat().filter(l=>l);return a.length===1?a[0].value:a.reduce((l={},c)=>{let d=c,{colorScheme:p}=d,u=$t(d,["colorScheme"]);return l[p]=u,l},void 0)},getSelectorRule(e,n,t,i){return t==="class"||t==="attr"?he(M(n)?`${e}${n},${e} ${n}`:e,i):he(e,M(n)?he(n,i):i)},transformCSS(e,n,t,i,o={},r,s,a){if(M(n)){let{cssLayer:l}=o;if(i!=="style"){let c=this.getColorSchemeOption(o,s);n=t==="dark"?c.reduce((d,{type:p,selector:u})=>(M(u)&&(d+=u.includes("[CSS]")?u.replace("[CSS]",n):this.getSelectorRule(u,a,p,n)),d),""):he(a??":root",n)}if(l){let c={name:"primeui",order:"primeui"};St(l)&&(c.name=mt(l.name,{name:e,type:i})),M(c.name)&&(n=he(`@layer ${c.name}`,n),r?.layerNames(c.name))}return n}return""}},V={defaults:{variable:{prefix:"p",selector:":root",excludedKeyRegex:/^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi},options:{prefix:"p",darkModeSelector:"system",cssLayer:!1}},_theme:void 0,_layerNames:new Set,_loadedStyleNames:new Set,_loadingStyles:new Set,_tokens:{},update(e={}){let{theme:n}=e;n&&(this._theme=sn(Et({},n),{options:Et(Et({},this.defaults.options),n.options)}),this._tokens=wt.createTokens(this.preset,this.defaults),this.clearLoadedStyleNames())},get theme(){return this._theme},get preset(){var e;return((e=this.theme)==null?void 0:e.preset)||{}},get options(){var e;return((e=this.theme)==null?void 0:e.options)||{}},get tokens(){return this._tokens},getTheme(){return this.theme},setTheme(e){this.update({theme:e}),ct.emit("theme:change",e)},getPreset(){return this.preset},setPreset(e){this._theme=sn(Et({},this.theme),{preset:e}),this._tokens=wt.createTokens(e,this.defaults),this.clearLoadedStyleNames(),ct.emit("preset:change",e),ct.emit("theme:change",this.theme)},getOptions(){return this.options},setOptions(e){this._theme=sn(Et({},this.theme),{options:e}),this.clearLoadedStyleNames(),ct.emit("options:change",e),ct.emit("theme:change",this.theme)},getLayerNames(){return[...this._layerNames]},setLayerNames(e){this._layerNames.add(e)},getLoadedStyleNames(){return this._loadedStyleNames},isStyleNameLoaded(e){return this._loadedStyleNames.has(e)},setLoadedStyleName(e){this._loadedStyleNames.add(e)},deleteLoadedStyleName(e){this._loadedStyleNames.delete(e)},clearLoadedStyleNames(){this._loadedStyleNames.clear()},getTokenValue(e){return wt.getTokenValue(this.tokens,e,this.defaults)},getCommon(e="",n){return wt.getCommon({name:e,theme:this.theme,params:n,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},getComponent(e="",n){let t={name:e,theme:this.theme,params:n,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return wt.getPresetC(t)},getDirective(e="",n){let t={name:e,theme:this.theme,params:n,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return wt.getPresetD(t)},getCustomPreset(e="",n,t,i){let o={name:e,preset:n,options:this.options,selector:t,params:i,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return wt.getPreset(o)},getLayerOrderCSS(e=""){return wt.getLayerOrder(e,this.options,{names:this.getLayerNames()},this.defaults)},transformCSS(e="",n,t="style",i){return wt.transformCSS(e,n,i,t,this.options,{layerNames:this.setLayerNames.bind(this)},this.defaults)},getCommonStyleSheet(e="",n,t={}){return wt.getCommonStyleSheet({name:e,theme:this.theme,params:n,props:t,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},getStyleSheet(e,n,t={}){return wt.getStyleSheet({name:e,theme:this.theme,params:n,props:t,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},onStyleMounted(e){this._loadingStyles.add(e)},onStyleUpdated(e){this._loadingStyles.add(e)},onStyleLoaded(e,{name:n}){this._loadingStyles.size&&(this._loadingStyles.delete(n),ct.emit(`theme:${n}:load`,e),!this._loadingStyles.size&&ct.emit("theme:load"))}};var as=0,Co=(()=>{class e{document=v(Ht);use(t,i={}){let o=!1,r=t,s=null,{immediate:a=!0,manual:l=!1,name:c=`style_${++as}`,id:d=void 0,media:p=void 0,nonce:u=void 0,first:h=!1,props:m={}}=i;if(this.document){if(s=this.document.querySelector(`style[data-primeng-style-id="${c}"]`)||d&&this.document.getElementById(d)||this.document.createElement("style"),!s.isConnected){r=t;let x=this.document.head;h&&x.firstChild?x.insertBefore(s,x.firstChild):x.appendChild(s),wi(s,{type:"text/css",media:p,nonce:u,"data-primeng-style-id":c})}return s.textContent!==r&&(s.textContent=r),{id:d,name:c,el:s,css:r}}}static \u0275fac=function(i){return new(i||e)};static \u0275prov=I({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var ge={_loadedStyleNames:new Set,getLoadedStyleNames(){return this._loadedStyleNames},isStyleNameLoaded(e){return this._loadedStyleNames.has(e)},setLoadedStyleName(e){this._loadedStyleNames.add(e)},deleteLoadedStyleName(e){this._loadedStyleNames.delete(e)},clearLoadedStyleNames(){this._loadedStyleNames.clear()}},ls=({dt:e})=>`
*,
::before,
::after {
    box-sizing: border-box;
}

/* Non ng overlay animations */
.p-connected-overlay {
    opacity: 0;
    transform: scaleY(0.8);
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),
        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-connected-overlay-visible {
    opacity: 1;
    transform: scaleY(1);
}

.p-connected-overlay-hidden {
    opacity: 0;
    transform: scaleY(1);
    transition: opacity 0.1s linear;
}

/* NG based overlay animations */
.p-connected-overlay-enter-from {
    opacity: 0;
    transform: scaleY(0.8);
}

.p-connected-overlay-leave-to {
    opacity: 0;
}

.p-connected-overlay-enter-active {
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),
        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-connected-overlay-leave-active {
    transition: opacity 0.1s linear;
}

/* Toggleable Content */
.p-toggleable-content-enter-from,
.p-toggleable-content-leave-to {
    max-height: 0;
}

.p-toggleable-content-enter-to,
.p-toggleable-content-leave-from {
    max-height: 1000px;
}

.p-toggleable-content-leave-active {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);
}

.p-toggleable-content-enter-active {
    overflow: hidden;
    transition: max-height 1s ease-in-out;
}

.p-disabled,
.p-disabled * {
    cursor: default;
    pointer-events: none;
    user-select: none;
}

.p-disabled,
.p-component:disabled {
    opacity: ${e("disabled.opacity")};
}

.pi {
    font-size: ${e("icon.size")};
}

.p-icon {
    width: ${e("icon.size")};
    height: ${e("icon.size")};
}

.p-unselectable-text {
    user-select: none;
}

.p-overlay-mask {
    background: ${e("mask.background")};
    color: ${e("mask.color")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-mask-enter {
    animation: p-overlay-mask-enter-animation ${e("mask.transition.duration")} forwards;
}

.p-overlay-mask-leave {
    animation: p-overlay-mask-leave-animation ${e("mask.transition.duration")} forwards;
}
/* Temporarily disabled, distrupts PrimeNG overlay animations */
/* @keyframes p-overlay-mask-enter-animation {
    from {
        background: transparent;
    }
    to {
        background: ${e("mask.background")};
    }
}
@keyframes p-overlay-mask-leave-animation {
    from {
        background: ${e("mask.background")};
    }
    to {
        background: transparent;
    }
}*/

.p-iconwrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
`,cs=({dt:e})=>`
.p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
}

.p-hidden-accessible input,
.p-hidden-accessible select {
    transform: scale(0);
}

.p-overflow-hidden {
    overflow: hidden;
    padding-right: ${e("scrollbar.width")};
}

/* @todo move to baseiconstyle.ts */

.p-icon {
    display: inline-block;
    vertical-align: baseline;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`,F=(()=>{class e{name="base";useStyle=v(Co);theme=void 0;css=void 0;classes={};inlineStyles={};load=(t,i={},o=r=>r)=>{let r=o(mt(t,{dt:fe}));return r?this.useStyle.use(te(r),f({name:this.name},i)):{}};loadCSS=(t={})=>this.load(this.css,t);loadTheme=(t={},i="")=>this.load(this.theme,t,(o="")=>V.transformCSS(t.name||this.name,`${o}${i}`));loadGlobalCSS=(t={})=>this.load(cs,t);loadGlobalTheme=(t={},i="")=>this.load(ls,t,(o="")=>V.transformCSS(t.name||this.name,`${o}${i}`));getCommonTheme=t=>V.getCommon(this.name,t);getComponentTheme=t=>V.getComponent(this.name,t);getDirectiveTheme=t=>V.getDirective(this.name,t);getPresetTheme=(t,i,o)=>V.getCustomPreset(this.name,t,i,o);getLayerOrderThemeCSS=()=>V.getLayerOrderCSS(this.name);getStyleSheet=(t="",i={})=>{if(this.css){let o=mt(this.css,{dt:fe}),r=te(`${o}${t}`),s=Object.entries(i).reduce((a,[l,c])=>a.push(`${l}="${c}"`)&&a,[]).join(" ");return`<style type="text/css" data-primeng-style-id="${this.name}" ${s}>${r}</style>`}return""};getCommonThemeStyleSheet=(t,i={})=>V.getCommonStyleSheet(this.name,t,i);getThemeStyleSheet=(t,i={})=>{let o=[V.getStyleSheet(this.name,t,i)];if(this.theme){let r=this.name==="base"?"global-style":`${this.name}-style`,s=mt(this.theme,{dt:fe}),a=te(V.transformCSS(r,s)),l=Object.entries(i).reduce((c,[d,p])=>c.push(`${d}="${p}"`)&&c,[]).join(" ");o.push(`<style type="text/css" data-primeng-style-id="${r}" ${l}>${a}</style>`)}return o.join("")};static \u0275fac=function(i){return new(i||e)};static \u0275prov=I({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var X=(()=>{class e{static STARTS_WITH="startsWith";static CONTAINS="contains";static NOT_CONTAINS="notContains";static ENDS_WITH="endsWith";static EQUALS="equals";static NOT_EQUALS="notEquals";static IN="in";static LESS_THAN="lt";static LESS_THAN_OR_EQUAL_TO="lte";static GREATER_THAN="gt";static GREATER_THAN_OR_EQUAL_TO="gte";static BETWEEN="between";static IS="is";static IS_NOT="isNot";static BEFORE="before";static AFTER="after";static DATE_IS="dateIs";static DATE_IS_NOT="dateIsNot";static DATE_BEFORE="dateBefore";static DATE_AFTER="dateAfter"}return e})(),bc=(()=>{class e{static AND="and";static OR="or"}return e})(),vc=(()=>{class e{filter(t,i,o,r,s){let a=[];if(t)for(let l of t)for(let c of i){let d=Ei(l,c);if(this.filters[r](d,o,s)){a.push(l);break}}return a}filters={startsWith:(t,i,o)=>{if(i==null||i.trim()==="")return!0;if(t==null)return!1;let r=lt(i.toString()).toLocaleLowerCase(o);return lt(t.toString()).toLocaleLowerCase(o).slice(0,r.length)===r},contains:(t,i,o)=>{if(i==null||typeof i=="string"&&i.trim()==="")return!0;if(t==null)return!1;let r=lt(i.toString()).toLocaleLowerCase(o);return lt(t.toString()).toLocaleLowerCase(o).indexOf(r)!==-1},notContains:(t,i,o)=>{if(i==null||typeof i=="string"&&i.trim()==="")return!0;if(t==null)return!1;let r=lt(i.toString()).toLocaleLowerCase(o);return lt(t.toString()).toLocaleLowerCase(o).indexOf(r)===-1},endsWith:(t,i,o)=>{if(i==null||i.trim()==="")return!0;if(t==null)return!1;let r=lt(i.toString()).toLocaleLowerCase(o),s=lt(t.toString()).toLocaleLowerCase(o);return s.indexOf(r,s.length-r.length)!==-1},equals:(t,i,o)=>i==null||typeof i=="string"&&i.trim()===""?!0:t==null?!1:t.getTime&&i.getTime?t.getTime()===i.getTime():t==i?!0:lt(t.toString()).toLocaleLowerCase(o)==lt(i.toString()).toLocaleLowerCase(o),notEquals:(t,i,o)=>i==null||typeof i=="string"&&i.trim()===""?!1:t==null?!0:t.getTime&&i.getTime?t.getTime()!==i.getTime():t==i?!1:lt(t.toString()).toLocaleLowerCase(o)!=lt(i.toString()).toLocaleLowerCase(o),in:(t,i)=>{if(i==null||i.length===0)return!0;for(let o=0;o<i.length;o++)if(on(t,i[o]))return!0;return!1},between:(t,i)=>i==null||i[0]==null||i[1]==null?!0:t==null?!1:t.getTime?i[0].getTime()<=t.getTime()&&t.getTime()<=i[1].getTime():i[0]<=t&&t<=i[1],lt:(t,i,o)=>i==null?!0:t==null?!1:t.getTime&&i.getTime?t.getTime()<i.getTime():t<i,lte:(t,i,o)=>i==null?!0:t==null?!1:t.getTime&&i.getTime?t.getTime()<=i.getTime():t<=i,gt:(t,i,o)=>i==null?!0:t==null?!1:t.getTime&&i.getTime?t.getTime()>i.getTime():t>i,gte:(t,i,o)=>i==null?!0:t==null?!1:t.getTime&&i.getTime?t.getTime()>=i.getTime():t>=i,is:(t,i,o)=>this.filters.equals(t,i,o),isNot:(t,i,o)=>this.filters.notEquals(t,i,o),before:(t,i,o)=>this.filters.lt(t,i,o),after:(t,i,o)=>this.filters.gt(t,i,o),dateIs:(t,i)=>i==null?!0:t==null?!1:t.toDateString()===i.toDateString(),dateIsNot:(t,i)=>i==null?!0:t==null?!1:t.toDateString()!==i.toDateString(),dateBefore:(t,i)=>i==null?!0:t==null?!1:t.getTime()<i.getTime(),dateAfter:(t,i)=>i==null?!0:t==null?!1:(t.setHours(0,0,0,0),t.getTime()>i.getTime())};register(t,i){this.filters[t]=i}static \u0275fac=function(i){return new(i||e)};static \u0275prov=I({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})(),_c=(()=>{class e{messageSource=new kt;clearSource=new kt;messageObserver=this.messageSource.asObservable();clearObserver=this.clearSource.asObservable();add(t){t&&this.messageSource.next(t)}addAll(t){t&&t.length&&this.messageSource.next(t)}clear(t){this.clearSource.next(t||null)}static \u0275fac=function(i){return new(i||e)};static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})(),So=(()=>{class e{clickSource=new kt;clickObservable=this.clickSource.asObservable();add(t){t&&this.clickSource.next(t)}static \u0275fac=function(i){return new(i||e)};static \u0275prov=I({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var me=(()=>{class e{template;type;name;constructor(t){this.template=t}getType(){return this.name}static \u0275fac=function(i){return new(i||e)(w(Ze))};static \u0275dir=A({type:e,selectors:[["","pTemplate",""]],inputs:{type:"type",name:[0,"pTemplate","name"]}})}return e})(),Q=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({imports:[tt]})}return e})(),Cc=(()=>{class e{static STARTS_WITH="startsWith";static CONTAINS="contains";static NOT_CONTAINS="notContains";static ENDS_WITH="endsWith";static EQUALS="equals";static NOT_EQUALS="notEquals";static NO_FILTER="noFilter";static LT="lt";static LTE="lte";static GT="gt";static GTE="gte";static IS="is";static IS_NOT="isNot";static BEFORE="before";static AFTER="after";static CLEAR="clear";static APPLY="apply";static MATCH_ALL="matchAll";static MATCH_ANY="matchAny";static ADD_RULE="addRule";static REMOVE_RULE="removeRule";static ACCEPT="accept";static REJECT="reject";static CHOOSE="choose";static UPLOAD="upload";static CANCEL="cancel";static PENDING="pending";static FILE_SIZE_TYPES="fileSizeTypes";static DAY_NAMES="dayNames";static DAY_NAMES_SHORT="dayNamesShort";static DAY_NAMES_MIN="dayNamesMin";static MONTH_NAMES="monthNames";static MONTH_NAMES_SHORT="monthNamesShort";static FIRST_DAY_OF_WEEK="firstDayOfWeek";static TODAY="today";static WEEK_HEADER="weekHeader";static WEAK="weak";static MEDIUM="medium";static STRONG="strong";static PASSWORD_PROMPT="passwordPrompt";static EMPTY_MESSAGE="emptyMessage";static EMPTY_FILTER_MESSAGE="emptyFilterMessage";static SHOW_FILTER_MENU="showFilterMenu";static HIDE_FILTER_MENU="hideFilterMenu";static SELECTION_MESSAGE="selectionMessage";static ARIA="aria";static SELECT_COLOR="selectColor";static BROWSE_FILES="browseFiles"}return e})();var us=(()=>{class e{theme=pt(void 0);csp=pt({nonce:void 0});isThemeChanged=!1;document=v(Ht);baseStyle=v(F);constructor(){Ie(()=>{ct.on("theme:change",t=>{It(()=>{this.isThemeChanged=!0,this.theme.set(t)})})}),Ie(()=>{let t=this.theme();this.document&&t&&(this.isThemeChanged||this.onThemeChange(t),this.isThemeChanged=!1)})}ngOnDestroy(){V.clearLoadedStyleNames(),ct.clear()}onThemeChange(t){V.setTheme(t),this.document&&this.loadCommonTheme()}loadCommonTheme(){if(this.theme()!=="none"&&!V.isStyleNameLoaded("common")){let{primitive:t,semantic:i,global:o,style:r}=this.baseStyle.getCommonTheme?.()||{},s={nonce:this.csp?.()?.nonce};this.baseStyle.load(t?.css,f({name:"primitive-variables"},s)),this.baseStyle.load(i?.css,f({name:"semantic-variables"},s)),this.baseStyle.load(o?.css,f({name:"global-variables"},s)),this.baseStyle.loadGlobalTheme(f({name:"global-style"},s),r),V.setLoadedStyleName("common")}}setThemeConfig(t){let{theme:i,csp:o}=t||{};i&&this.theme.set(i),o&&this.csp.set(o)}static \u0275fac=function(i){return new(i||e)};static \u0275prov=I({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})(),ln=(()=>{class e extends us{ripple=pt(!1);platformId=v(ne);inputStyle=pt(null);inputVariant=pt(null);overlayOptions={};csp=pt({nonce:void 0});filterMatchModeOptions={text:[X.STARTS_WITH,X.CONTAINS,X.NOT_CONTAINS,X.ENDS_WITH,X.EQUALS,X.NOT_EQUALS],numeric:[X.EQUALS,X.NOT_EQUALS,X.LESS_THAN,X.LESS_THAN_OR_EQUAL_TO,X.GREATER_THAN,X.GREATER_THAN_OR_EQUAL_TO],date:[X.DATE_IS,X.DATE_IS_NOT,X.DATE_BEFORE,X.DATE_AFTER]};translation={startsWith:"Starts with",contains:"Contains",notContains:"Not contains",endsWith:"Ends with",equals:"Equals",notEquals:"Not equals",noFilter:"No Filter",lt:"Less than",lte:"Less than or equal to",gt:"Greater than",gte:"Greater than or equal to",is:"Is",isNot:"Is not",before:"Before",after:"After",dateIs:"Date is",dateIsNot:"Date is not",dateBefore:"Date is before",dateAfter:"Date is after",clear:"Clear",apply:"Apply",matchAll:"Match All",matchAny:"Match Any",addRule:"Add Rule",removeRule:"Remove Rule",accept:"Yes",reject:"No",choose:"Choose",upload:"Upload",cancel:"Cancel",pending:"Pending",fileSizeTypes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],chooseYear:"Choose Year",chooseMonth:"Choose Month",chooseDate:"Choose Date",prevDecade:"Previous Decade",nextDecade:"Next Decade",prevYear:"Previous Year",nextYear:"Next Year",prevMonth:"Previous Month",nextMonth:"Next Month",prevHour:"Previous Hour",nextHour:"Next Hour",prevMinute:"Previous Minute",nextMinute:"Next Minute",prevSecond:"Previous Second",nextSecond:"Next Second",am:"am",pm:"pm",dateFormat:"mm/dd/yy",firstDayOfWeek:0,today:"Today",weekHeader:"Wk",weak:"Weak",medium:"Medium",strong:"Strong",passwordPrompt:"Enter a password",emptyMessage:"No results found",searchMessage:"Search results are available",selectionMessage:"{0} items selected",emptySelectionMessage:"No selected item",emptySearchMessage:"No results found",emptyFilterMessage:"No results found",fileChosenMessage:"Files",noFileChosenMessage:"No file chosen",aria:{trueLabel:"True",falseLabel:"False",nullLabel:"Not Selected",star:"1 star",stars:"{star} stars",selectAll:"All items selected",unselectAll:"All items unselected",close:"Close",previous:"Previous",next:"Next",navigation:"Navigation",scrollTop:"Scroll Top",moveTop:"Move Top",moveUp:"Move Up",moveDown:"Move Down",moveBottom:"Move Bottom",moveToTarget:"Move to Target",moveToSource:"Move to Source",moveAllToTarget:"Move All to Target",moveAllToSource:"Move All to Source",pageLabel:"{page}",firstPageLabel:"First Page",lastPageLabel:"Last Page",nextPageLabel:"Next Page",prevPageLabel:"Previous Page",rowsPerPageLabel:"Rows per page",previousPageLabel:"Previous Page",jumpToPageDropdownLabel:"Jump to Page Dropdown",jumpToPageInputLabel:"Jump to Page Input",selectRow:"Row Selected",unselectRow:"Row Unselected",expandRow:"Row Expanded",collapseRow:"Row Collapsed",showFilterMenu:"Show Filter Menu",hideFilterMenu:"Hide Filter Menu",filterOperator:"Filter Operator",filterConstraint:"Filter Constraint",editRow:"Row Edit",saveEdit:"Save Edit",cancelEdit:"Cancel Edit",listView:"List View",gridView:"Grid View",slide:"Slide",slideNumber:"{slideNumber}",zoomImage:"Zoom Image",zoomIn:"Zoom In",zoomOut:"Zoom Out",rotateRight:"Rotate Right",rotateLeft:"Rotate Left",listLabel:"Option List",selectColor:"Select a color",removeLabel:"Remove",browseFiles:"Browse Files",maximizeLabel:"Maximize"}};zIndex={modal:1100,overlay:1e3,menu:1e3,tooltip:1100};translationSource=new kt;translationObserver=this.translationSource.asObservable();getTranslation(t){return this.translation[t]}setTranslation(t){this.translation=f(f({},this.translation),t),this.translationSource.next(this.translation)}setConfig(t){let{csp:i,ripple:o,inputStyle:r,inputVariant:s,theme:a,overlayOptions:l,translation:c,filterMatchModeOptions:d}=t||{};i&&this.csp.set(i),o&&this.ripple.set(o),r&&this.inputStyle.set(r),s&&this.inputVariant.set(s),l&&(this.overlayOptions=l),c&&this.setTranslation(c),d&&(this.filterMatchModeOptions=d),a&&this.setThemeConfig({theme:a,csp:i})}static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})(),ps=new Mt("PRIME_NG_CONFIG");function Dc(...e){let n=e?.map(i=>({provide:ps,useValue:i,multi:!1})),t=Cn(()=>{let i=v(ln);e?.forEach(o=>i.setConfig(o))});return bn([...n,t])}var wo=(()=>{class e extends F{name="common";static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})(),$=(()=>{class e{document=v(Ht);platformId=v(ne);el=v(Qt);injector=v(Li);cd=v(ei);renderer=v(Ce);config=v(ln);baseComponentStyle=v(wo);baseStyle=v(F);scopedStyleEl;rootEl;dt;get styleOptions(){return{nonce:this.config?.csp().nonce}}get _name(){return this.constructor.name.replace(/^_/,"").toLowerCase()}get componentStyle(){return this._componentStyle}attrSelector=Rt("pc");themeChangeListeners=[];_getHostInstance(t){if(t)return t?this.hostName?t.name===this.hostName?t:this._getHostInstance(t.parentInstance):t.parentInstance:void 0}_getOptionValue(t,i="",o={}){return xi(t,i,o)}ngOnInit(){this.document&&this._loadStyles()}ngAfterViewInit(){this.rootEl=this.el?.nativeElement,this.rootEl&&this.rootEl?.setAttribute(this.attrSelector,"")}ngOnChanges(t){if(this.document&&!In(this.platformId)){let{dt:i}=t;i&&i.currentValue&&(this._loadScopedThemeStyles(i.currentValue),this._themeChangeListener(()=>this._loadScopedThemeStyles(i.currentValue)))}}ngOnDestroy(){this._unloadScopedThemeStyles(),this.themeChangeListeners.forEach(t=>ct.off("theme:change",t))}_loadStyles(){let t=()=>{ge.isStyleNameLoaded("base")||(this.baseStyle.loadGlobalCSS(this.styleOptions),ge.setLoadedStyleName("base")),this._loadThemeStyles()};t(),this._themeChangeListener(()=>t())}_loadCoreStyles(){!ge.isStyleNameLoaded("base")&&this._name&&(this.baseComponentStyle.loadCSS(this.styleOptions),this.componentStyle&&this.componentStyle?.loadCSS(this.styleOptions),ge.setLoadedStyleName(this.componentStyle?.name))}_loadThemeStyles(){if(!V.isStyleNameLoaded("common")){let{primitive:t,semantic:i,global:o,style:r}=this.componentStyle?.getCommonTheme?.()||{};this.baseStyle.load(t?.css,f({name:"primitive-variables"},this.styleOptions)),this.baseStyle.load(i?.css,f({name:"semantic-variables"},this.styleOptions)),this.baseStyle.load(o?.css,f({name:"global-variables"},this.styleOptions)),this.baseStyle.loadGlobalTheme(f({name:"global-style"},this.styleOptions),r),V.setLoadedStyleName("common")}if(!V.isStyleNameLoaded(this.componentStyle?.name)&&this.componentStyle?.name){let{css:t,style:i}=this.componentStyle?.getComponentTheme?.()||{};this.componentStyle?.load(t,f({name:`${this.componentStyle?.name}-variables`},this.styleOptions)),this.componentStyle?.loadTheme(f({name:`${this.componentStyle?.name}-style`},this.styleOptions),i),V.setLoadedStyleName(this.componentStyle?.name)}if(!V.isStyleNameLoaded("layer-order")){let t=this.componentStyle?.getLayerOrderThemeCSS?.();this.baseStyle.load(t,f({name:"layer-order",first:!0},this.styleOptions)),V.setLoadedStyleName("layer-order")}this.dt&&(this._loadScopedThemeStyles(this.dt),this._themeChangeListener(()=>this._loadScopedThemeStyles(this.dt)))}_loadScopedThemeStyles(t){let{css:i}=this.componentStyle?.getPresetTheme?.(t,`[${this.attrSelector}]`)||{},o=this.componentStyle?.load(i,f({name:`${this.attrSelector}-${this.componentStyle?.name}`},this.styleOptions));this.scopedStyleEl=o?.el}_unloadScopedThemeStyles(){this.scopedStyleEl?.remove()}_themeChangeListener(t=()=>{}){ge.clearLoadedStyleNames(),ct.on("theme:change",t),this.themeChangeListeners.push(t)}cx(t,i){let o=this.parent?this.parent.componentStyle?.classes?.[t]:this.componentStyle?.classes?.[t];return typeof o=="function"?o({instance:this}):typeof o=="string"?o:t}sx(t){let i=this.componentStyle?.inlineStyles?.[t];return typeof i=="function"?i({instance:this}):typeof i=="string"?i:f({},i)}get parent(){return this.parentInstance}static \u0275fac=function(i){return new(i||e)};static \u0275dir=A({type:e,inputs:{dt:"dt"},features:[D([wo,F]),J]})}return e})();var hs=({dt:e})=>`
.p-inputtext {
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;
    color: ${e("inputtext.color")};
    background: ${e("inputtext.background")};
    padding-block: ${e("inputtext.padding.y")};
    padding-inline: ${e("inputtext.padding.x")};
    border: 1px solid ${e("inputtext.border.color")};
    transition: background ${e("inputtext.transition.duration")}, color ${e("inputtext.transition.duration")}, border-color ${e("inputtext.transition.duration")}, outline-color ${e("inputtext.transition.duration")}, box-shadow ${e("inputtext.transition.duration")};
    appearance: none;
    border-radius: ${e("inputtext.border.radius")};
    outline-color: transparent;
    box-shadow: ${e("inputtext.shadow")};
}

.p-inputtext.ng-invalid.ng-dirty {
    border-color: ${e("inputtext.invalid.border.color")};
}

.p-inputtext:enabled:hover {
    border-color: ${e("inputtext.hover.border.color")};
}

.p-inputtext:enabled:focus {
    border-color: ${e("inputtext.focus.border.color")};
    box-shadow: ${e("inputtext.focus.ring.shadow")};
    outline: ${e("inputtext.focus.ring.width")} ${e("inputtext.focus.ring.style")} ${e("inputtext.focus.ring.color")};
    outline-offset: ${e("inputtext.focus.ring.offset")};
}

.p-inputtext.p-invalid {
    border-color: ${e("inputtext.invalid.border.color")};
}

.p-inputtext.p-variant-filled {
    background: ${e("inputtext.filled.background")};
}
    
.p-inputtext.p-variant-filled:enabled:hover {
    background: ${e("inputtext.filled.hover.background")};
}

.p-inputtext.p-variant-filled:enabled:focus {
    background: ${e("inputtext.filled.focus.background")};
}

.p-inputtext:disabled {
    opacity: 1;
    background: ${e("inputtext.disabled.background")};
    color: ${e("inputtext.disabled.color")};
}

.p-inputtext::placeholder {
    color: ${e("inputtext.placeholder.color")};
}

.p-inputtext.ng-invalid.ng-dirty::placeholder {
    color: ${e("inputtext.invalid.placeholder.color")};
}

.p-inputtext-sm {
    font-size: ${e("inputtext.sm.font.size")};
    padding-block: ${e("inputtext.sm.padding.y")};
    padding-inline: ${e("inputtext.sm.padding.x")};
}

.p-inputtext-lg {
    font-size: ${e("inputtext.lg.font.size")};
    padding-block: ${e("inputtext.lg.padding.y")};
    padding-inline: ${e("inputtext.lg.padding.x")};
}

.p-inputtext-fluid {
    width: 100%;
}
`,fs={root:({instance:e,props:n})=>["p-inputtext p-component",{"p-filled":e.filled,"p-inputtext-sm":n.size==="small","p-inputtext-lg":n.size==="large","p-invalid":n.invalid,"p-variant-filled":n.variant==="filled","p-inputtext-fluid":n.fluid}]},Eo=(()=>{class e extends F{name="inputtext";theme=hs;classes=fs;static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})();var Jc=(()=>{class e extends ${ngModel;variant;fluid;pSize;filled;_componentStyle=v(Eo);get hasFluid(){let i=this.el.nativeElement.closest("p-fluid");return Y(this.fluid)?!!i:this.fluid}constructor(t){super(),this.ngModel=t}ngAfterViewInit(){super.ngAfterViewInit(),this.updateFilledState(),this.cd.detectChanges()}ngDoCheck(){this.updateFilledState()}onInput(){this.updateFilledState()}updateFilledState(){this.filled=this.el.nativeElement.value&&this.el.nativeElement.value.length||this.ngModel&&this.ngModel.model}static \u0275fac=function(i){return new(i||e)(w(Ki,8))};static \u0275dir=A({type:e,selectors:[["","pInputText",""]],hostAttrs:[1,"p-inputtext","p-component"],hostVars:14,hostBindings:function(i,o){if(i&1&&gt("input",function(s){return o.onInput(s)}),i&2){let r;nt("p-filled",o.filled)("p-variant-filled",((r=o.variant)!==null&&r!==void 0?r:o.config.inputStyle()||o.config.inputVariant())==="filled")("p-inputtext-fluid",o.hasFluid)("p-inputtext-sm",o.pSize==="small")("p-inputfield-sm",o.pSize==="small")("p-inputtext-lg",o.pSize==="large")("p-inputfield-lg",o.pSize==="large")}},inputs:{variant:"variant",fluid:[2,"fluid","fluid",O],pSize:"pSize"},features:[D([Eo]),_]})}return e})(),td=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({})}return e})();var jt=(()=>{class e{static zindex=1e3;static calculatedScrollbarWidth=null;static calculatedScrollbarHeight=null;static browser;static addClass(t,i){t&&i&&(t.classList?t.classList.add(i):t.className+=" "+i)}static addMultipleClasses(t,i){if(t&&i)if(t.classList){let o=i.trim().split(" ");for(let r=0;r<o.length;r++)t.classList.add(o[r])}else{let o=i.split(" ");for(let r=0;r<o.length;r++)t.className+=" "+o[r]}}static removeClass(t,i){t&&i&&(t.classList?t.classList.remove(i):t.className=t.className.replace(new RegExp("(^|\\b)"+i.split(" ").join("|")+"(\\b|$)","gi")," "))}static removeMultipleClasses(t,i){t&&i&&[i].flat().filter(Boolean).forEach(o=>o.split(" ").forEach(r=>this.removeClass(t,r)))}static hasClass(t,i){return t&&i?t.classList?t.classList.contains(i):new RegExp("(^| )"+i+"( |$)","gi").test(t.className):!1}static siblings(t){return Array.prototype.filter.call(t.parentNode.children,function(i){return i!==t})}static find(t,i){return Array.from(t.querySelectorAll(i))}static findSingle(t,i){return this.isElement(t)?t.querySelector(i):null}static index(t){let i=t.parentNode.childNodes,o=0;for(var r=0;r<i.length;r++){if(i[r]==t)return o;i[r].nodeType==1&&o++}return-1}static indexWithinGroup(t,i){let o=t.parentNode?t.parentNode.childNodes:[],r=0;for(var s=0;s<o.length;s++){if(o[s]==t)return r;o[s].attributes&&o[s].attributes[i]&&o[s].nodeType==1&&r++}return-1}static appendOverlay(t,i,o="self"){o!=="self"&&t&&i&&this.appendChild(t,i)}static alignOverlay(t,i,o="self",r=!0){t&&i&&(r&&(t.style.minWidth=`${e.getOuterWidth(i)}px`),o==="self"?this.relativePosition(t,i):this.absolutePosition(t,i))}static relativePosition(t,i,o=!0){let r=S=>{if(S)return getComputedStyle(S).getPropertyValue("position")==="relative"?S:r(S.parentElement)},s=t.offsetParent?{width:t.offsetWidth,height:t.offsetHeight}:this.getHiddenElementDimensions(t),a=i.offsetHeight,l=i.getBoundingClientRect(),c=this.getWindowScrollTop(),d=this.getWindowScrollLeft(),p=this.getViewport(),h=r(t)?.getBoundingClientRect()||{top:-1*c,left:-1*d},m,x;l.top+a+s.height>p.height?(m=l.top-h.top-s.height,t.style.transformOrigin="bottom",l.top+m<0&&(m=-1*l.top)):(m=a+l.top-h.top,t.style.transformOrigin="top");let y=l.left+s.width-p.width,C=l.left-h.left;s.width>p.width?x=(l.left-h.left)*-1:y>0?x=C-y:x=l.left-h.left,t.style.top=m+"px",t.style.left=x+"px",o&&(t.style.marginTop=origin==="bottom"?"calc(var(--p-anchor-gutter) * -1)":"calc(var(--p-anchor-gutter))")}static absolutePosition(t,i,o=!0){let r=t.offsetParent?{width:t.offsetWidth,height:t.offsetHeight}:this.getHiddenElementDimensions(t),s=r.height,a=r.width,l=i.offsetHeight,c=i.offsetWidth,d=i.getBoundingClientRect(),p=this.getWindowScrollTop(),u=this.getWindowScrollLeft(),h=this.getViewport(),m,x;d.top+l+s>h.height?(m=d.top+p-s,t.style.transformOrigin="bottom",m<0&&(m=p)):(m=l+d.top+p,t.style.transformOrigin="top"),d.left+a>h.width?x=Math.max(0,d.left+u+c-a):x=d.left+u,t.style.top=m+"px",t.style.left=x+"px",o&&(t.style.marginTop=origin==="bottom"?"calc(var(--p-anchor-gutter) * -1)":"calc(var(--p-anchor-gutter))")}static getParents(t,i=[]){return t.parentNode===null?i:this.getParents(t.parentNode,i.concat([t.parentNode]))}static getScrollableParents(t){let i=[];if(t){let o=this.getParents(t),r=/(auto|scroll)/,s=a=>{let l=window.getComputedStyle(a,null);return r.test(l.getPropertyValue("overflow"))||r.test(l.getPropertyValue("overflowX"))||r.test(l.getPropertyValue("overflowY"))};for(let a of o){let l=a.nodeType===1&&a.dataset.scrollselectors;if(l){let c=l.split(",");for(let d of c){let p=this.findSingle(a,d);p&&s(p)&&i.push(p)}}a.nodeType!==9&&s(a)&&i.push(a)}}return i}static getHiddenElementOuterHeight(t){t.style.visibility="hidden",t.style.display="block";let i=t.offsetHeight;return t.style.display="none",t.style.visibility="visible",i}static getHiddenElementOuterWidth(t){t.style.visibility="hidden",t.style.display="block";let i=t.offsetWidth;return t.style.display="none",t.style.visibility="visible",i}static getHiddenElementDimensions(t){let i={};return t.style.visibility="hidden",t.style.display="block",i.width=t.offsetWidth,i.height=t.offsetHeight,t.style.display="none",t.style.visibility="visible",i}static scrollInView(t,i){let o=getComputedStyle(t).getPropertyValue("borderTopWidth"),r=o?parseFloat(o):0,s=getComputedStyle(t).getPropertyValue("paddingTop"),a=s?parseFloat(s):0,l=t.getBoundingClientRect(),d=i.getBoundingClientRect().top+document.body.scrollTop-(l.top+document.body.scrollTop)-r-a,p=t.scrollTop,u=t.clientHeight,h=this.getOuterHeight(i);d<0?t.scrollTop=p+d:d+h>u&&(t.scrollTop=p+d-u+h)}static fadeIn(t,i){t.style.opacity=0;let o=+new Date,r=0,s=function(){r=+t.style.opacity.replace(",",".")+(new Date().getTime()-o)/i,t.style.opacity=r,o=+new Date,+r<1&&(window.requestAnimationFrame&&requestAnimationFrame(s)||setTimeout(s,16))};s()}static fadeOut(t,i){var o=1,r=50,s=i,a=r/s;let l=setInterval(()=>{o=o-a,o<=0&&(o=0,clearInterval(l)),t.style.opacity=o},r)}static getWindowScrollTop(){let t=document.documentElement;return(window.pageYOffset||t.scrollTop)-(t.clientTop||0)}static getWindowScrollLeft(){let t=document.documentElement;return(window.pageXOffset||t.scrollLeft)-(t.clientLeft||0)}static matches(t,i){var o=Element.prototype,r=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.msMatchesSelector||function(s){return[].indexOf.call(document.querySelectorAll(s),this)!==-1};return r.call(t,i)}static getOuterWidth(t,i){let o=t.offsetWidth;if(i){let r=getComputedStyle(t);o+=parseFloat(r.marginLeft)+parseFloat(r.marginRight)}return o}static getHorizontalPadding(t){let i=getComputedStyle(t);return parseFloat(i.paddingLeft)+parseFloat(i.paddingRight)}static getHorizontalMargin(t){let i=getComputedStyle(t);return parseFloat(i.marginLeft)+parseFloat(i.marginRight)}static innerWidth(t){let i=t.offsetWidth,o=getComputedStyle(t);return i+=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),i}static width(t){let i=t.offsetWidth,o=getComputedStyle(t);return i-=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),i}static getInnerHeight(t){let i=t.offsetHeight,o=getComputedStyle(t);return i+=parseFloat(o.paddingTop)+parseFloat(o.paddingBottom),i}static getOuterHeight(t,i){let o=t.offsetHeight;if(i){let r=getComputedStyle(t);o+=parseFloat(r.marginTop)+parseFloat(r.marginBottom)}return o}static getHeight(t){let i=t.offsetHeight,o=getComputedStyle(t);return i-=parseFloat(o.paddingTop)+parseFloat(o.paddingBottom)+parseFloat(o.borderTopWidth)+parseFloat(o.borderBottomWidth),i}static getWidth(t){let i=t.offsetWidth,o=getComputedStyle(t);return i-=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight)+parseFloat(o.borderLeftWidth)+parseFloat(o.borderRightWidth),i}static getViewport(){let t=window,i=document,o=i.documentElement,r=i.getElementsByTagName("body")[0],s=t.innerWidth||o.clientWidth||r.clientWidth,a=t.innerHeight||o.clientHeight||r.clientHeight;return{width:s,height:a}}static getOffset(t){var i=t.getBoundingClientRect();return{top:i.top+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0),left:i.left+(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0)}}static replaceElementWith(t,i){let o=t.parentNode;if(!o)throw"Can't replace element";return o.replaceChild(i,t)}static getUserAgent(){if(navigator&&this.isClient())return navigator.userAgent}static isIE(){var t=window.navigator.userAgent,i=t.indexOf("MSIE ");if(i>0)return!0;var o=t.indexOf("Trident/");if(o>0){var r=t.indexOf("rv:");return!0}var s=t.indexOf("Edge/");return s>0}static isIOS(){return/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream}static isAndroid(){return/(android)/i.test(navigator.userAgent)}static isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}static appendChild(t,i){if(this.isElement(i))i.appendChild(t);else if(i&&i.el&&i.el.nativeElement)i.el.nativeElement.appendChild(t);else throw"Cannot append "+i+" to "+t}static removeChild(t,i){if(this.isElement(i))i.removeChild(t);else if(i.el&&i.el.nativeElement)i.el.nativeElement.removeChild(t);else throw"Cannot remove "+t+" from "+i}static removeElement(t){"remove"in Element.prototype?t.remove():t.parentNode.removeChild(t)}static isElement(t){return typeof HTMLElement=="object"?t instanceof HTMLElement:t&&typeof t=="object"&&t!==null&&t.nodeType===1&&typeof t.nodeName=="string"}static calculateScrollbarWidth(t){if(t){let i=getComputedStyle(t);return t.offsetWidth-t.clientWidth-parseFloat(i.borderLeftWidth)-parseFloat(i.borderRightWidth)}else{if(this.calculatedScrollbarWidth!==null)return this.calculatedScrollbarWidth;let i=document.createElement("div");i.className="p-scrollbar-measure",document.body.appendChild(i);let o=i.offsetWidth-i.clientWidth;return document.body.removeChild(i),this.calculatedScrollbarWidth=o,o}}static calculateScrollbarHeight(){if(this.calculatedScrollbarHeight!==null)return this.calculatedScrollbarHeight;let t=document.createElement("div");t.className="p-scrollbar-measure",document.body.appendChild(t);let i=t.offsetHeight-t.clientHeight;return document.body.removeChild(t),this.calculatedScrollbarWidth=i,i}static invokeElementMethod(t,i,o){t[i].apply(t,o)}static clearSelection(){if(window.getSelection)window.getSelection().empty?window.getSelection().empty():window.getSelection().removeAllRanges&&window.getSelection().rangeCount>0&&window.getSelection().getRangeAt(0).getClientRects().length>0&&window.getSelection().removeAllRanges();else if(document.selection&&document.selection.empty)try{document.selection.empty()}catch{}}static getBrowser(){if(!this.browser){let t=this.resolveUserAgent();this.browser={},t.browser&&(this.browser[t.browser]=!0,this.browser.version=t.version),this.browser.chrome?this.browser.webkit=!0:this.browser.webkit&&(this.browser.safari=!0)}return this.browser}static resolveUserAgent(){let t=navigator.userAgent.toLowerCase(),i=/(chrome)[ \/]([\w.]+)/.exec(t)||/(webkit)[ \/]([\w.]+)/.exec(t)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t)||/(msie) ([\w.]+)/.exec(t)||t.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t)||[];return{browser:i[1]||"",version:i[2]||"0"}}static isInteger(t){return Number.isInteger?Number.isInteger(t):typeof t=="number"&&isFinite(t)&&Math.floor(t)===t}static isHidden(t){return!t||t.offsetParent===null}static isVisible(t){return t&&t.offsetParent!=null}static isExist(t){return t!==null&&typeof t<"u"&&t.nodeName&&t.parentNode}static focus(t,i){t&&document.activeElement!==t&&t.focus(i)}static getFocusableSelectorString(t=""){return`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        .p-inputtext:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        .p-button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`}static getFocusableElements(t,i=""){let o=this.find(t,this.getFocusableSelectorString(i)),r=[];for(let s of o){let a=getComputedStyle(s);this.isVisible(s)&&a.display!="none"&&a.visibility!="hidden"&&r.push(s)}return r}static getFocusableElement(t,i=""){let o=this.findSingle(t,this.getFocusableSelectorString(i));if(o){let r=getComputedStyle(o);if(this.isVisible(o)&&r.display!="none"&&r.visibility!="hidden")return o}return null}static getFirstFocusableElement(t,i=""){let o=this.getFocusableElements(t,i);return o.length>0?o[0]:null}static getLastFocusableElement(t,i){let o=this.getFocusableElements(t,i);return o.length>0?o[o.length-1]:null}static getNextFocusableElement(t,i=!1){let o=e.getFocusableElements(t),r=0;if(o&&o.length>0){let s=o.indexOf(o[0].ownerDocument.activeElement);i?s==-1||s===0?r=o.length-1:r=s-1:s!=-1&&s!==o.length-1&&(r=s+1)}return o[r]}static generateZIndex(){return this.zindex=this.zindex||999,++this.zindex}static getSelection(){return window.getSelection?window.getSelection().toString():document.getSelection?document.getSelection().toString():document.selection?document.selection.createRange().text:null}static getTargetElement(t,i){if(!t)return null;switch(t){case"document":return document;case"window":return window;case"@next":return i?.nextElementSibling;case"@prev":return i?.previousElementSibling;case"@parent":return i?.parentElement;case"@grandparent":return i?.parentElement.parentElement;default:let o=typeof t;if(o==="string")return document.querySelector(t);if(o==="object"&&t.hasOwnProperty("nativeElement"))return this.isExist(t.nativeElement)?t.nativeElement:void 0;let s=(a=>!!(a&&a.constructor&&a.call&&a.apply))(t)?t():t;return s&&s.nodeType===9||this.isExist(s)?s:null}}static isClient(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}static getAttribute(t,i){if(t){let o=t.getAttribute(i);return isNaN(o)?o==="true"||o==="false"?o==="true":o:+o}}static calculateBodyScrollbarWidth(){return window.innerWidth-document.documentElement.offsetWidth}static blockBodyScroll(t="p-overflow-hidden"){document.body.style.setProperty("--scrollbar-width",this.calculateBodyScrollbarWidth()+"px"),this.addClass(document.body,t)}static unblockBodyScroll(t="p-overflow-hidden"){document.body.style.removeProperty("--scrollbar-width"),this.removeClass(document.body,t)}static createElement(t,i={},...o){if(t){let r=document.createElement(t);return this.setAttributes(r,i),r.append(...o),r}}static setAttribute(t,i="",o){this.isElement(t)&&o!==null&&o!==void 0&&t.setAttribute(i,o)}static setAttributes(t,i={}){if(this.isElement(t)){let o=(r,s)=>{let a=t?.$attrs?.[r]?[t?.$attrs?.[r]]:[];return[s].flat().reduce((l,c)=>{if(c!=null){let d=typeof c;if(d==="string"||d==="number")l.push(c);else if(d==="object"){let p=Array.isArray(c)?o(r,c):Object.entries(c).map(([u,h])=>r==="style"&&(h||h===0)?`${u.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}:${h}`:h?u:void 0);l=p.length?l.concat(p.filter(u=>!!u)):l}}return l},a)};Object.entries(i).forEach(([r,s])=>{if(s!=null){let a=r.match(/^on(.+)/);a?t.addEventListener(a[1].toLowerCase(),s):r==="pBind"?this.setAttributes(t,s):(s=r==="class"?[...new Set(o("class",s))].join(" ").trim():r==="style"?o("style",s).join(";").trim():s,(t.$attrs=t.$attrs||{})&&(t.$attrs[r]=s),t.setAttribute(r,s))}})}}static isFocusableElement(t,i=""){return this.isElement(t)?t.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i}`):!1}}return e})(),ye=class{element;listener;scrollableParents;constructor(n,t=()=>{}){this.element=n,this.listener=t}bindScrollListener(){this.scrollableParents=jt.getScrollableParents(this.element);for(let n=0;n<this.scrollableParents.length;n++)this.scrollableParents[n].addEventListener("scroll",this.listener)}unbindScrollListener(){if(this.scrollableParents)for(let n=0;n<this.scrollableParents.length;n++)this.scrollableParents[n].removeEventListener("scroll",this.listener)}destroy(){this.unbindScrollListener(),this.element=null,this.listener=null,this.scrollableParents=null}};var xo=(()=>{class e extends ${autofocus=!1;_autofocus=!1;focused=!1;platformId=v(ne);document=v(Ht);host=v(Qt);ngAfterContentChecked(){this.autofocus===!1?this.host.nativeElement.removeAttribute("autofocus"):this.host.nativeElement.setAttribute("autofocus",!0),this.focused||this.autoFocus()}ngAfterViewChecked(){this.focused||this.autoFocus()}autoFocus(){bt(this.platformId)&&this._autofocus&&setTimeout(()=>{let t=jt.getFocusableElements(this.host?.nativeElement);t.length===0&&this.host.nativeElement.focus(),t.length>0&&t[0].focus(),this.focused=!0})}static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275dir=A({type:e,selectors:[["","pAutoFocus",""]],inputs:{autofocus:[2,"autofocus","autofocus",O],_autofocus:[0,"pAutoFocus","_autofocus"]},features:[_]})}return e})(),dd=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({})}return e})();var gs=({dt:e})=>`
.p-badge {
    display: inline-flex;
    border-radius: ${e("badge.border.radius")};
    justify-content: center;
    padding: ${e("badge.padding")};
    background: ${e("badge.primary.background")};
    color: ${e("badge.primary.color")};
    font-size: ${e("badge.font.size")};
    font-weight: ${e("badge.font.weight")};
    min-width: ${e("badge.min.width")};
    height: ${e("badge.height")};
    line-height: ${e("badge.height")};
}

.p-badge-dot {
    width: ${e("badge.dot.size")};
    min-width: ${e("badge.dot.size")};
    height: ${e("badge.dot.size")};
    border-radius: 50%;
    padding: 0;
}

.p-badge-circle {
    padding: 0;
    border-radius: 50%;
}

.p-badge-secondary {
    background: ${e("badge.secondary.background")};
    color: ${e("badge.secondary.color")};
}

.p-badge-success {
    background: ${e("badge.success.background")};
    color: ${e("badge.success.color")};
}

.p-badge-info {
    background: ${e("badge.info.background")};
    color: ${e("badge.info.color")};
}

.p-badge-warn {
    background: ${e("badge.warn.background")};
    color: ${e("badge.warn.color")};
}

.p-badge-danger {
    background: ${e("badge.danger.background")};
    color: ${e("badge.danger.color")};
}

.p-badge-contrast {
    background: ${e("badge.contrast.background")};
    color: ${e("badge.contrast.color")};
}

.p-badge-sm {
    font-size: ${e("badge.sm.font.size")};
    min-width: ${e("badge.sm.min.width")};
    height: ${e("badge.sm.height")};
    line-height: ${e("badge.sm.height")};
}

.p-badge-lg {
    font-size: ${e("badge.lg.font.size")};
    min-width: ${e("badge.lg.min.width")};
    height: ${e("badge.lg.height")};
    line-height: ${e("badge.lg.height")};
}

.p-badge-xl {
    font-size: ${e("badge.xl.font.size")};
    min-width: ${e("badge.xl.min.width")};
    height: ${e("badge.xl.height")};
    line-height: ${e("badge.xl.height")};
}

/* For PrimeNG (directive)*/

.p-overlay-badge {
    position: relative;
}

.p-overlay-badge > .p-badge {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
    margin: 0;
}
`,ms={root:({props:e,instance:n})=>["p-badge p-component",{"p-badge-circle":M(e.value)&&String(e.value).length===1,"p-badge-dot":Y(e.value)&&!n.$slots.default,"p-badge-sm":e.size==="small","p-badge-lg":e.size==="large","p-badge-xl":e.size==="xlarge","p-badge-info":e.severity==="info","p-badge-success":e.severity==="success","p-badge-warn":e.severity==="warn","p-badge-danger":e.severity==="danger","p-badge-secondary":e.severity==="secondary","p-badge-contrast":e.severity==="contrast"}]},Io=(()=>{class e extends F{name="badge";theme=gs;classes=ms;static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})();var cn=(()=>{class e extends ${styleClass=Pt();style=Pt();badgeSize=Pt();size=Pt();severity=Pt();value=Pt();badgeDisabled=Pt(!1,{transform:O});_componentStyle=v(Io);containerClass=Tt(()=>{let t="p-badge p-component";return M(this.value())&&String(this.value()).length===1&&(t+=" p-badge-circle"),this.badgeSize()==="large"?t+=" p-badge-lg":this.badgeSize()==="xlarge"?t+=" p-badge-xl":this.badgeSize()==="small"&&(t+=" p-badge-sm"),Y(this.value())&&(t+=" p-badge-dot"),this.styleClass()&&(t+=` ${this.styleClass()}`),this.severity()&&(t+=` p-badge-${this.severity()}`),t});static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["p-badge"]],hostVars:6,hostBindings:function(i,o){i&2&&(Ye(o.style()),N(o.containerClass()),Qe("display",o.badgeDisabled()?"none":null))},inputs:{styleClass:[1,"styleClass"],style:[1,"style"],badgeSize:[1,"badgeSize"],size:[1,"size"],severity:[1,"severity"],value:[1,"value"],badgeDisabled:[1,"badgeDisabled"]},features:[D([Io]),_],decls:1,vars:1,template:function(i,o){i&1&&Xe(0),i&2&&Je(o.value())},dependencies:[tt,Q],encapsulation:2,changeDetection:0})}return e})(),To=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({imports:[cn,Q,Q]})}return e})();var bs=["*"],vs=`
.p-icon {
    display: inline-block;
    vertical-align: baseline;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`,_s=(()=>{class e extends F{name="baseicon";inlineStyles=vs;static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})();var yt=(()=>{class e extends ${label;spin=!1;styleClass;role;ariaLabel;ariaHidden;ngOnInit(){super.ngOnInit(),this.getAttributes()}getAttributes(){let t=Y(this.label);this.role=t?void 0:"img",this.ariaLabel=t?void 0:this.label,this.ariaHidden=t}getClassNames(){return`p-icon ${this.styleClass?this.styleClass+" ":""}${this.spin?"p-icon-spin":""}`}static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["ng-component"]],hostAttrs:[1,"p-component","p-iconwrapper"],inputs:{label:"label",spin:[2,"spin","spin",O],styleClass:"styleClass"},features:[D([_s]),_],ngContentSelectors:bs,decls:1,vars:0,template:function(i,o){i&1&&(ot(),rt(0))},encapsulation:2,changeDetection:0})}return e})();var $d=(()=>{class e extends yt{static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["BlankIcon"]],features:[_],decls:2,vars:0,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["width","1","height","1","fill","currentColor","fill-opacity","0"]],template:function(i,o){i&1&&(ut(),P(0,"svg",0),j(1,"rect",1),B())},encapsulation:2})}return e})();var Pd=(()=>{class e extends yt{static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["CheckIcon"]],features:[_],decls:2,vars:5,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z","fill","currentColor"]],template:function(i,o){i&1&&(ut(),P(0,"svg",0),j(1,"path",1),B()),i&2&&(N(o.getClassNames()),R("aria-label",o.ariaLabel)("aria-hidden",o.ariaHidden)("role",o.role))},encapsulation:2})}return e})();var zd=(()=>{class e extends yt{static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["ChevronDownIcon"]],features:[_],decls:2,vars:5,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z","fill","currentColor"]],template:function(i,o){i&1&&(ut(),P(0,"svg",0),j(1,"path",1),B()),i&2&&(N(o.getClassNames()),R("aria-label",o.ariaLabel)("aria-hidden",o.ariaHidden)("role",o.role))},encapsulation:2})}return e})();var Gd=(()=>{class e extends yt{pathId;ngOnInit(){this.pathId="url(#"+Rt()+")"}static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["SearchIcon"]],features:[_],decls:6,vars:7,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["fill-rule","evenodd","clip-rule","evenodd","d","M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(i,o){i&1&&(ut(),P(0,"svg",0)(1,"g"),j(2,"path",1),B(),P(3,"defs")(4,"clipPath",2),j(5,"rect",3),B()()()),i&2&&(N(o.getClassNames()),R("aria-label",o.ariaLabel)("aria-hidden",o.ariaHidden)("role",o.role),E(),R("clip-path",o.pathId),E(3),g("id",o.pathId))},encapsulation:2})}return e})();var Ai=(()=>{class e extends yt{pathId;ngOnInit(){this.pathId="url(#"+Rt()+")"}static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["SpinnerIcon"]],features:[_],decls:6,vars:7,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(i,o){i&1&&(ut(),P(0,"svg",0)(1,"g"),j(2,"path",1),B(),P(3,"defs")(4,"clipPath",2),j(5,"rect",3),B()()()),i&2&&(N(o.getClassNames()),R("aria-label",o.ariaLabel)("aria-hidden",o.ariaHidden)("role",o.role),E(),R("clip-path",o.pathId),E(3),g("id",o.pathId))},encapsulation:2})}return e})();var Xd=(()=>{class e extends yt{static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["TimesIcon"]],features:[_],decls:2,vars:5,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z","fill","currentColor"]],template:function(i,o){i&1&&(ut(),P(0,"svg",0),j(1,"path",1),B()),i&2&&(N(o.getClassNames()),R("aria-label",o.ariaLabel)("aria-hidden",o.ariaHidden)("role",o.role))},encapsulation:2})}return e})();var Cs=({dt:e})=>`
/* For PrimeNG */
.p-ripple {
    overflow: hidden;
    position: relative;
}

.p-ink {
    display: block;
    position: absolute;
    background: ${e("ripple.background")};
    border-radius: 100%;
    transform: scale(0);
}

.p-ink-active {
    animation: ripple 0.4s linear;
}

.p-ripple-disabled .p-ink {
    display: none !important;
}

@keyframes ripple {
    100% {
        opacity: 0;
        transform: scale(2.5);
    }
}
`,Ss={root:"p-ink"},Oo=(()=>{class e extends F{name="ripple";theme=Cs;classes=Ss;static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})();var Do=(()=>{class e extends ${zone=v(Nt);_componentStyle=v(Oo);animationListener;mouseDownListener;timeout;constructor(){super(),Ie(()=>{bt(this.platformId)&&(this.config.ripple()?this.zone.runOutsideAngular(()=>{this.create(),this.mouseDownListener=this.renderer.listen(this.el.nativeElement,"mousedown",this.onMouseDown.bind(this))}):this.remove())})}ngAfterViewInit(){super.ngAfterViewInit()}onMouseDown(t){let i=this.getInk();if(!i||this.document.defaultView?.getComputedStyle(i,null).display==="none")return;if(Ft(i,"p-ink-active"),!Dt(i)&&!At(i)){let a=Math.max(Ot(this.el.nativeElement),Ct(this.el.nativeElement));i.style.height=a+"px",i.style.width=a+"px"}let o=oo(this.el.nativeElement),r=t.pageX-o.left+this.document.body.scrollTop-At(i)/2,s=t.pageY-o.top+this.document.body.scrollLeft-Dt(i)/2;this.renderer.setStyle(i,"top",s+"px"),this.renderer.setStyle(i,"left",r+"px"),vt(i,"p-ink-active"),this.timeout=setTimeout(()=>{let a=this.getInk();a&&Ft(a,"p-ink-active")},401)}getInk(){let t=this.el.nativeElement.children;for(let i=0;i<t.length;i++)if(typeof t[i].className=="string"&&t[i].className.indexOf("p-ink")!==-1)return t[i];return null}resetInk(){let t=this.getInk();t&&Ft(t,"p-ink-active")}onAnimationEnd(t){this.timeout&&clearTimeout(this.timeout),Ft(t.currentTarget,"p-ink-active")}create(){let t=this.renderer.createElement("span");this.renderer.addClass(t,"p-ink"),this.renderer.appendChild(this.el.nativeElement,t),this.renderer.setAttribute(t,"aria-hidden","true"),this.renderer.setAttribute(t,"role","presentation"),this.animationListener||(this.animationListener=this.renderer.listen(t,"animationend",this.onAnimationEnd.bind(this)))}remove(){let t=this.getInk();t&&(this.mouseDownListener&&this.mouseDownListener(),this.animationListener&&this.animationListener(),this.mouseDownListener=null,this.animationListener=null,so(t))}ngOnDestroy(){this.config&&this.config.ripple()&&this.remove(),super.ngOnDestroy()}static \u0275fac=function(i){return new(i||e)};static \u0275dir=A({type:e,selectors:[["","pRipple",""]],hostAttrs:[1,"p-ripple"],features:[D([Oo]),_]})}return e})();var ws=["content"],Es=["loadingicon"],xs=["icon"],Is=["*"],Vo=e=>({class:e});function Ts(e,n){e&1&&xt(0)}function Os(e,n){if(e&1&&j(0,"span",8),e&2){let t=T(3);g("ngClass",t.iconClass()),R("aria-hidden",!0)("data-pc-section","loadingicon")}}function Ds(e,n){if(e&1&&j(0,"SpinnerIcon",9),e&2){let t=T(3);g("styleClass",t.spinnerIconClass())("spin",!0),R("aria-hidden",!0)("data-pc-section","loadingicon")}}function As(e,n){if(e&1&&(ht(0),k(1,Os,1,3,"span",6)(2,Ds,1,4,"SpinnerIcon",7),ft()),e&2){let t=T(2);E(),g("ngIf",t.loadingIcon),E(),g("ngIf",!t.loadingIcon)}}function Ls(e,n){}function Ms(e,n){if(e&1&&k(0,Ls,0,0,"ng-template",10),e&2){let t=T(2);g("ngIf",t.loadingIconTemplate||t._loadingIconTemplate)}}function Vs(e,n){if(e&1&&(ht(0),k(1,As,3,2,"ng-container",2)(2,Ms,1,1,null,5),ft()),e&2){let t=T();E(),g("ngIf",!t.loadingIconTemplate&&!t._loadingIconTemplate),E(),g("ngTemplateOutlet",t.loadingIconTemplate||t._loadingIconTemplate)("ngTemplateOutletContext",st(3,Vo,t.iconClass()))}}function Fs(e,n){if(e&1&&j(0,"span",8),e&2){let t=T(2);N(t.icon),g("ngClass",t.iconClass()),R("data-pc-section","icon")}}function Rs(e,n){}function $s(e,n){if(e&1&&k(0,Rs,0,0,"ng-template",10),e&2){let t=T(2);g("ngIf",!t.icon&&(t.iconTemplate||t._iconTemplate))}}function ks(e,n){if(e&1&&(ht(0),k(1,Fs,1,4,"span",11)(2,$s,1,1,null,5),ft()),e&2){let t=T();E(),g("ngIf",t.icon&&!t.iconTemplate&&!t._iconTemplate),E(),g("ngTemplateOutlet",t.iconTemplate||t._iconTemplate)("ngTemplateOutletContext",st(3,Vo,t.iconClass()))}}function Ns(e,n){if(e&1&&(P(0,"span",12),Xe(1),B()),e&2){let t=T();R("aria-hidden",t.icon&&!t.label)("data-pc-section","label"),E(),Je(t.label)}}function Ps(e,n){if(e&1&&j(0,"p-badge",13),e&2){let t=T();g("value",t.badge)("severity",t.badgeSeverity)}}var Bs=({dt:e})=>`
.p-button {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    color: ${e("button.primary.color")};
    background: ${e("button.primary.background")};
    border: 1px solid ${e("button.primary.border.color")};
    padding-block: ${e("button.padding.y")};
    padding-inline: ${e("button.padding.x")};
    font-size: 1rem;
    font-family: inherit;
    font-feature-settings: inherit;
    transition: background ${e("button.transition.duration")}, color ${e("button.transition.duration")}, border-color ${e("button.transition.duration")},
            outline-color ${e("button.transition.duration")}, box-shadow ${e("button.transition.duration")};
    border-radius: ${e("button.border.radius")};
    outline-color: transparent;
    gap: ${e("button.gap")};
}

.p-button-icon,
.p-button-icon:before,
.p-button-icon:after {
    line-height: inherit;
}

.p-button:disabled {
    cursor: default;
}

.p-button-icon-right {
    order: 1;
}

.p-button-icon-right:dir(rtl) {
    order: -1;
}

.p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
    order: 1;
}

.p-button-icon-bottom {
    order: 2;
}

.p-button-icon-only {
    width: ${e("button.icon.only.width")};
    padding-inline-start: 0;
    padding-inline-end: 0;
    gap: 0;
}

.p-button-icon-only.p-button-rounded {
    border-radius: 50%;
    height: ${e("button.icon.only.width")};
}

.p-button-icon-only .p-button-label {
    visibility: hidden;
    width: 0;
}

.p-button-sm {
    font-size: ${e("button.sm.font.size")};
    padding-block: ${e("button.sm.padding.y")};
    padding-inline: ${e("button.sm.padding.x")};
}

.p-button-sm .p-button-icon {
    font-size: ${e("button.sm.font.size")};
}

.p-button-sm.p-button-icon-only {
    width: ${e("button.sm.icon.only.width")};
}

.p-button-sm.p-button-icon-only.p-button-rounded {
    height: ${e("button.sm.icon.only.width")};
}

.p-button-lg {
    font-size: ${e("button.lg.font.size")};
    padding-block: ${e("button.lg.padding.y")};
    padding-inline: ${e("button.lg.padding.x")};
}

.p-button-lg .p-button-icon {
    font-size: ${e("button.lg.font.size")};
}

.p-button-lg.p-button-icon-only {
    width: ${e("button.lg.icon.only.width")};
}

.p-button-lg.p-button-icon-only.p-button-rounded {
    height: ${e("button.lg.icon.only.width")};
}

.p-button-vertical {
    flex-direction: column;
}

.p-button-label {
    font-weight: ${e("button.label.font.weight")};
}

.p-button-fluid {
    width: 100%;
}

.p-button-fluid.p-button-icon-only {
    width: ${e("button.icon.only.width")};
}

.p-button:not(:disabled):hover {
    background: ${e("button.primary.hover.background")};
    border: 1px solid ${e("button.primary.hover.border.color")};
    color: ${e("button.primary.hover.color")};
}

.p-button:not(:disabled):active {
    background: ${e("button.primary.active.background")};
    border: 1px solid ${e("button.primary.active.border.color")};
    color: ${e("button.primary.active.color")};
}

.p-button:focus-visible {
    box-shadow: ${e("button.primary.focus.ring.shadow")};
    outline: ${e("button.focus.ring.width")} ${e("button.focus.ring.style")} ${e("button.primary.focus.ring.color")};
    outline-offset: ${e("button.focus.ring.offset")};
}

.p-button .p-badge {
    min-width: ${e("button.badge.size")};
    height: ${e("button.badge.size")};
    line-height: ${e("button.badge.size")};
}

.p-button-raised {
    box-shadow: ${e("button.raised.shadow")};
}

.p-button-rounded {
    border-radius: ${e("button.rounded.border.radius")};
}

.p-button-secondary {
    background: ${e("button.secondary.background")};
    border: 1px solid ${e("button.secondary.border.color")};
    color: ${e("button.secondary.color")};
}

.p-button-secondary:not(:disabled):hover {
    background: ${e("button.secondary.hover.background")};
    border: 1px solid ${e("button.secondary.hover.border.color")};
    color: ${e("button.secondary.hover.color")};
}

.p-button-secondary:not(:disabled):active {
    background: ${e("button.secondary.active.background")};
    border: 1px solid ${e("button.secondary.active.border.color")};
    color: ${e("button.secondary.active.color")};
}

.p-button-secondary:focus-visible {
    outline-color: ${e("button.secondary.focus.ring.color")};
    box-shadow: ${e("button.secondary.focus.ring.shadow")};
}

.p-button-success {
    background: ${e("button.success.background")};
    border: 1px solid ${e("button.success.border.color")};
    color: ${e("button.success.color")};
}

.p-button-success:not(:disabled):hover {
    background: ${e("button.success.hover.background")};
    border: 1px solid ${e("button.success.hover.border.color")};
    color: ${e("button.success.hover.color")};
}

.p-button-success:not(:disabled):active {
    background: ${e("button.success.active.background")};
    border: 1px solid ${e("button.success.active.border.color")};
    color: ${e("button.success.active.color")};
}

.p-button-success:focus-visible {
    outline-color: ${e("button.success.focus.ring.color")};
    box-shadow: ${e("button.success.focus.ring.shadow")};
}

.p-button-info {
    background: ${e("button.info.background")};
    border: 1px solid ${e("button.info.border.color")};
    color: ${e("button.info.color")};
}

.p-button-info:not(:disabled):hover {
    background: ${e("button.info.hover.background")};
    border: 1px solid ${e("button.info.hover.border.color")};
    color: ${e("button.info.hover.color")};
}

.p-button-info:not(:disabled):active {
    background: ${e("button.info.active.background")};
    border: 1px solid ${e("button.info.active.border.color")};
    color: ${e("button.info.active.color")};
}

.p-button-info:focus-visible {
    outline-color: ${e("button.info.focus.ring.color")};
    box-shadow: ${e("button.info.focus.ring.shadow")};
}

.p-button-warn {
    background: ${e("button.warn.background")};
    border: 1px solid ${e("button.warn.border.color")};
    color: ${e("button.warn.color")};
}

.p-button-warn:not(:disabled):hover {
    background: ${e("button.warn.hover.background")};
    border: 1px solid ${e("button.warn.hover.border.color")};
    color: ${e("button.warn.hover.color")};
}

.p-button-warn:not(:disabled):active {
    background: ${e("button.warn.active.background")};
    border: 1px solid ${e("button.warn.active.border.color")};
    color: ${e("button.warn.active.color")};
}

.p-button-warn:focus-visible {
    outline-color: ${e("button.warn.focus.ring.color")};
    box-shadow: ${e("button.warn.focus.ring.shadow")};
}

.p-button-help {
    background: ${e("button.help.background")};
    border: 1px solid ${e("button.help.border.color")};
    color: ${e("button.help.color")};
}

.p-button-help:not(:disabled):hover {
    background: ${e("button.help.hover.background")};
    border: 1px solid ${e("button.help.hover.border.color")};
    color: ${e("button.help.hover.color")};
}

.p-button-help:not(:disabled):active {
    background: ${e("button.help.active.background")};
    border: 1px solid ${e("button.help.active.border.color")};
    color: ${e("button.help.active.color")};
}

.p-button-help:focus-visible {
    outline-color: ${e("button.help.focus.ring.color")};
    box-shadow: ${e("button.help.focus.ring.shadow")};
}

.p-button-danger {
    background: ${e("button.danger.background")};
    border: 1px solid ${e("button.danger.border.color")};
    color: ${e("button.danger.color")};
}

.p-button-danger:not(:disabled):hover {
    background: ${e("button.danger.hover.background")};
    border: 1px solid ${e("button.danger.hover.border.color")};
    color: ${e("button.danger.hover.color")};
}

.p-button-danger:not(:disabled):active {
    background: ${e("button.danger.active.background")};
    border: 1px solid ${e("button.danger.active.border.color")};
    color: ${e("button.danger.active.color")};
}

.p-button-danger:focus-visible {
    outline-color: ${e("button.danger.focus.ring.color")};
    box-shadow: ${e("button.danger.focus.ring.shadow")};
}

.p-button-contrast {
    background: ${e("button.contrast.background")};
    border: 1px solid ${e("button.contrast.border.color")};
    color: ${e("button.contrast.color")};
}

.p-button-contrast:not(:disabled):hover {
    background: ${e("button.contrast.hover.background")};
    border: 1px solid ${e("button.contrast.hover.border.color")};
    color: ${e("button.contrast.hover.color")};
}

.p-button-contrast:not(:disabled):active {
    background: ${e("button.contrast.active.background")};
    border: 1px solid ${e("button.contrast.active.border.color")};
    color: ${e("button.contrast.active.color")};
}

.p-button-contrast:focus-visible {
    outline-color: ${e("button.contrast.focus.ring.color")};
    box-shadow: ${e("button.contrast.focus.ring.shadow")};
}

.p-button-outlined {
    background: transparent;
    border-color: ${e("button.outlined.primary.border.color")};
    color: ${e("button.outlined.primary.color")};
}

.p-button-outlined:not(:disabled):hover {
    background: ${e("button.outlined.primary.hover.background")};
    border-color: ${e("button.outlined.primary.border.color")};
    color: ${e("button.outlined.primary.color")};
}

.p-button-outlined:not(:disabled):active {
    background: ${e("button.outlined.primary.active.background")};
    border-color: ${e("button.outlined.primary.border.color")};
    color: ${e("button.outlined.primary.color")};
}

.p-button-outlined.p-button-secondary {
    border-color: ${e("button.outlined.secondary.border.color")};
    color: ${e("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-secondary:not(:disabled):hover {
    background: ${e("button.outlined.secondary.hover.background")};
    border-color: ${e("button.outlined.secondary.border.color")};
    color: ${e("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-secondary:not(:disabled):active {
    background: ${e("button.outlined.secondary.active.background")};
    border-color: ${e("button.outlined.secondary.border.color")};
    color: ${e("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-success {
    border-color: ${e("button.outlined.success.border.color")};
    color: ${e("button.outlined.success.color")};
}

.p-button-outlined.p-button-success:not(:disabled):hover {
    background: ${e("button.outlined.success.hover.background")};
    border-color: ${e("button.outlined.success.border.color")};
    color: ${e("button.outlined.success.color")};
}

.p-button-outlined.p-button-success:not(:disabled):active {
    background: ${e("button.outlined.success.active.background")};
    border-color: ${e("button.outlined.success.border.color")};
    color: ${e("button.outlined.success.color")};
}

.p-button-outlined.p-button-info {
    border-color: ${e("button.outlined.info.border.color")};
    color: ${e("button.outlined.info.color")};
}

.p-button-outlined.p-button-info:not(:disabled):hover {
    background: ${e("button.outlined.info.hover.background")};
    border-color: ${e("button.outlined.info.border.color")};
    color: ${e("button.outlined.info.color")};
}

.p-button-outlined.p-button-info:not(:disabled):active {
    background: ${e("button.outlined.info.active.background")};
    border-color: ${e("button.outlined.info.border.color")};
    color: ${e("button.outlined.info.color")};
}

.p-button-outlined.p-button-warn {
    border-color: ${e("button.outlined.warn.border.color")};
    color: ${e("button.outlined.warn.color")};
}

.p-button-outlined.p-button-warn:not(:disabled):hover {
    background: ${e("button.outlined.warn.hover.background")};
    border-color: ${e("button.outlined.warn.border.color")};
    color: ${e("button.outlined.warn.color")};
}

.p-button-outlined.p-button-warn:not(:disabled):active {
    background: ${e("button.outlined.warn.active.background")};
    border-color: ${e("button.outlined.warn.border.color")};
    color: ${e("button.outlined.warn.color")};
}

.p-button-outlined.p-button-help {
    border-color: ${e("button.outlined.help.border.color")};
    color: ${e("button.outlined.help.color")};
}

.p-button-outlined.p-button-help:not(:disabled):hover {
    background: ${e("button.outlined.help.hover.background")};
    border-color: ${e("button.outlined.help.border.color")};
    color: ${e("button.outlined.help.color")};
}

.p-button-outlined.p-button-help:not(:disabled):active {
    background: ${e("button.outlined.help.active.background")};
    border-color: ${e("button.outlined.help.border.color")};
    color: ${e("button.outlined.help.color")};
}

.p-button-outlined.p-button-danger {
    border-color: ${e("button.outlined.danger.border.color")};
    color: ${e("button.outlined.danger.color")};
}

.p-button-outlined.p-button-danger:not(:disabled):hover {
    background: ${e("button.outlined.danger.hover.background")};
    border-color: ${e("button.outlined.danger.border.color")};
    color: ${e("button.outlined.danger.color")};
}

.p-button-outlined.p-button-danger:not(:disabled):active {
    background: ${e("button.outlined.danger.active.background")};
    border-color: ${e("button.outlined.danger.border.color")};
    color: ${e("button.outlined.danger.color")};
}

.p-button-outlined.p-button-contrast {
    border-color: ${e("button.outlined.contrast.border.color")};
    color: ${e("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-contrast:not(:disabled):hover {
    background: ${e("button.outlined.contrast.hover.background")};
    border-color: ${e("button.outlined.contrast.border.color")};
    color: ${e("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-contrast:not(:disabled):active {
    background: ${e("button.outlined.contrast.active.background")};
    border-color: ${e("button.outlined.contrast.border.color")};
    color: ${e("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-plain {
    border-color: ${e("button.outlined.plain.border.color")};
    color: ${e("button.outlined.plain.color")};
}

.p-button-outlined.p-button-plain:not(:disabled):hover {
    background: ${e("button.outlined.plain.hover.background")};
    border-color: ${e("button.outlined.plain.border.color")};
    color: ${e("button.outlined.plain.color")};
}

.p-button-outlined.p-button-plain:not(:disabled):active {
    background: ${e("button.outlined.plain.active.background")};
    border-color: ${e("button.outlined.plain.border.color")};
    color: ${e("button.outlined.plain.color")};
}

.p-button-text {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.primary.color")};
}

.p-button-text:not(:disabled):hover {
    background: ${e("button.text.primary.hover.background")};
    border-color: transparent;
    color: ${e("button.text.primary.color")};
}

.p-button-text:not(:disabled):active {
    background: ${e("button.text.primary.active.background")};
    border-color: transparent;
    color: ${e("button.text.primary.color")};
}

.p-button-text.p-button-secondary {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.secondary.color")};
}

.p-button-text.p-button-secondary:not(:disabled):hover {
    background: ${e("button.text.secondary.hover.background")};
    border-color: transparent;
    color: ${e("button.text.secondary.color")};
}

.p-button-text.p-button-secondary:not(:disabled):active {
    background: ${e("button.text.secondary.active.background")};
    border-color: transparent;
    color: ${e("button.text.secondary.color")};
}

.p-button-text.p-button-success {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.success.color")};
}

.p-button-text.p-button-success:not(:disabled):hover {
    background: ${e("button.text.success.hover.background")};
    border-color: transparent;
    color: ${e("button.text.success.color")};
}

.p-button-text.p-button-success:not(:disabled):active {
    background: ${e("button.text.success.active.background")};
    border-color: transparent;
    color: ${e("button.text.success.color")};
}

.p-button-text.p-button-info {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.info.color")};
}

.p-button-text.p-button-info:not(:disabled):hover {
    background: ${e("button.text.info.hover.background")};
    border-color: transparent;
    color: ${e("button.text.info.color")};
}

.p-button-text.p-button-info:not(:disabled):active {
    background: ${e("button.text.info.active.background")};
    border-color: transparent;
    color: ${e("button.text.info.color")};
}

.p-button-text.p-button-warn {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.warn.color")};
}

.p-button-text.p-button-warn:not(:disabled):hover {
    background: ${e("button.text.warn.hover.background")};
    border-color: transparent;
    color: ${e("button.text.warn.color")};
}

.p-button-text.p-button-warn:not(:disabled):active {
    background: ${e("button.text.warn.active.background")};
    border-color: transparent;
    color: ${e("button.text.warn.color")};
}

.p-button-text.p-button-help {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.help.color")};
}

.p-button-text.p-button-help:not(:disabled):hover {
    background: ${e("button.text.help.hover.background")};
    border-color: transparent;
    color: ${e("button.text.help.color")};
}

.p-button-text.p-button-help:not(:disabled):active {
    background: ${e("button.text.help.active.background")};
    border-color: transparent;
    color: ${e("button.text.help.color")};
}

.p-button-text.p-button-danger {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.danger.color")};
}

.p-button-text.p-button-danger:not(:disabled):hover {
    background: ${e("button.text.danger.hover.background")};
    border-color: transparent;
    color: ${e("button.text.danger.color")};
}

.p-button-text.p-button-danger:not(:disabled):active {
    background: ${e("button.text.danger.active.background")};
    border-color: transparent;
    color: ${e("button.text.danger.color")};
}

.p-button-text.p-button-plain {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.plain.color")};
}

.p-button-text.p-button-plain:not(:disabled):hover {
    background: ${e("button.text.plain.hover.background")};
    border-color: transparent;
    color: ${e("button.text.plain.color")};
}

.p-button-text.p-button-plain:not(:disabled):active {
    background: ${e("button.text.plain.active.background")};
    border-color: transparent;
    color: ${e("button.text.plain.color")};
}

.p-button-text.p-button-contrast {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.contrast.color")};
}

.p-button-text.p-button-contrast:not(:disabled):hover {
    background: ${e("button.text.contrast.hover.background")};
    border-color: transparent;
    color: ${e("button.text.contrast.color")};
}

.p-button-text.p-button-contrast:not(:disabled):active {
    background: ${e("button.text.contrast.active.background")};
    border-color: transparent;
    color: ${e("button.text.contrast.color")};
}

.p-button-link {
    background: transparent;
    border-color: transparent;
    color: ${e("button.link.color")};
}

.p-button-link:not(:disabled):hover {
    background: transparent;
    border-color: transparent;
    color: ${e("button.link.hover.color")};
}

.p-button-link:not(:disabled):hover .p-button-label {
    text-decoration: underline;
}

.p-button-link:not(:disabled):active {
    background: transparent;
    border-color: transparent;
    color: ${e("button.link.active.color")};
}

/* For PrimeNG */
.p-button-icon-right {
    order: 1;
}

p-button[iconpos='right'] spinnericon {
    order: 1;
}
`,Hs={root:({instance:e,props:n})=>["p-button p-component",{"p-button-icon-only":e.hasIcon&&!n.label&&!n.badge,"p-button-vertical":(n.iconPos==="top"||n.iconPos==="bottom")&&n.label,"p-button-loading":n.loading,"p-button-link":n.link,[`p-button-${n.severity}`]:n.severity,"p-button-raised":n.raised,"p-button-rounded":n.rounded,"p-button-text":n.text,"p-button-outlined":n.outlined,"p-button-sm":n.size==="small","p-button-lg":n.size==="large","p-button-plain":n.plain,"p-button-fluid":n.fluid}],loadingIcon:"p-button-loading-icon",icon:({props:e})=>["p-button-icon",{[`p-button-icon-${e.iconPos}`]:e.label}],label:"p-button-label"},Gt=(()=>{class e extends F{name="button";theme=Bs;classes=Hs;static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})();var Ut={button:"p-button",component:"p-component",iconOnly:"p-button-icon-only",disabled:"p-disabled",loading:"p-button-loading",labelOnly:"p-button-loading-label-only"},Ao=(()=>{class e extends ${_componentStyle=v(Gt);static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275dir=A({type:e,selectors:[["","pButtonLabel",""]],hostVars:2,hostBindings:function(i,o){i&2&&nt("p-button-label",!0)},features:[D([Gt]),_]})}return e})(),Lo=(()=>{class e extends ${_componentStyle=v(Gt);static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275dir=A({type:e,selectors:[["","pButtonIcon",""]],hostVars:2,hostBindings:function(i,o){i&2&&nt("p-button-icon",!0)},features:[D([Gt]),_]})}return e})(),Du=(()=>{class e extends ${iconPos="left";loadingIcon;set label(t){this._label=t,this.initialized&&(this.updateLabel(),this.updateIcon(),this.setStyleClass())}set icon(t){this._icon=t,this.initialized&&(this.updateIcon(),this.setStyleClass())}get loading(){return this._loading}set loading(t){this._loading=t,this.initialized&&(this.updateIcon(),this.setStyleClass())}_buttonProps;iconSignal=Mi(Lo);labelSignal=Mi(Ao);isIconOnly=Tt(()=>!!(!this.labelSignal()&&this.iconSignal()));set buttonProps(t){this._buttonProps=t,t&&typeof t=="object"&&Object.entries(t).forEach(([i,o])=>this[`_${i}`]!==o&&(this[`_${i}`]=o))}_severity;get severity(){return this._severity}set severity(t){this._severity=t,this.initialized&&this.setStyleClass()}raised=!1;rounded=!1;text=!1;outlined=!1;size=null;plain=!1;fluid;_label;_icon;_loading=!1;initialized;get htmlElement(){return this.el.nativeElement}_internalClasses=Object.values(Ut);isTextButton=Tt(()=>!!(!this.iconSignal()&&this.labelSignal()&&this.text));get label(){return this._label}get icon(){return this._icon}get buttonProps(){return this._buttonProps}spinnerIcon=`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon-spin">
        <g clip-path="url(#clip0_417_21408)">
            <path
                d="M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z"
                fill="currentColor"
            />
        </g>
        <defs>
            <clipPath id="clip0_417_21408">
                <rect width="14" height="14" fill="white" />
            </clipPath>
        </defs>
    </svg>`;_componentStyle=v(Gt);ngAfterViewInit(){super.ngAfterViewInit(),vt(this.htmlElement,this.getStyleClass().join(" ")),this.createIcon(),this.createLabel(),this.initialized=!0}ngOnChanges(t){super.ngOnChanges(t);let{buttonProps:i}=t;if(i){let o=i.currentValue;for(let r in o)this[r]=o[r]}}getStyleClass(){let t=[Ut.button,Ut.component];return this.icon&&!this.label&&Y(this.htmlElement.textContent)&&t.push(Ut.iconOnly),this.loading&&(t.push(Ut.disabled,Ut.loading),!this.icon&&this.label&&t.push(Ut.labelOnly),this.icon&&!this.label&&!Y(this.htmlElement.textContent)&&t.push(Ut.iconOnly)),this.text&&t.push("p-button-text"),this.severity&&t.push(`p-button-${this.severity}`),this.plain&&t.push("p-button-plain"),this.raised&&t.push("p-button-raised"),this.size&&t.push(`p-button-${this.size}`),this.outlined&&t.push("p-button-outlined"),this.rounded&&t.push("p-button-rounded"),this.size==="small"&&t.push("p-button-sm"),this.size==="large"&&t.push("p-button-lg"),this.hasFluid&&t.push("p-button-fluid"),t}get hasFluid(){let i=this.el.nativeElement.closest("p-fluid");return Y(this.fluid)?!!i:this.fluid}setStyleClass(){let t=this.getStyleClass();this.removeExistingSeverityClass(),this.htmlElement.classList.remove(...this._internalClasses),this.htmlElement.classList.add(...t)}removeExistingSeverityClass(){let t=["success","info","warn","danger","help","primary","secondary","contrast"],i=this.htmlElement.classList.value.split(" ").find(o=>t.some(r=>o===`p-button-${r}`));i&&this.htmlElement.classList.remove(i)}createLabel(){if(!_t(this.htmlElement,".p-button-label")&&this.label){let i=this.document.createElement("span");this.icon&&!this.label&&i.setAttribute("aria-hidden","true"),i.className="p-button-label",i.appendChild(this.document.createTextNode(this.label)),this.htmlElement.appendChild(i)}}createIcon(){if(!_t(this.htmlElement,".p-button-icon")&&(this.icon||this.loading)){let i=this.document.createElement("span");i.className="p-button-icon",i.setAttribute("aria-hidden","true");let o=this.label?"p-button-icon-"+this.iconPos:null;o&&vt(i,o);let r=this.getIconClass();r&&vt(i,r),!this.loadingIcon&&this.loading&&(i.innerHTML=this.spinnerIcon),this.htmlElement.insertBefore(i,this.htmlElement.firstChild)}}updateLabel(){let t=_t(this.htmlElement,".p-button-label");if(!this.label){t&&this.htmlElement.removeChild(t);return}t?t.textContent=this.label:this.createLabel()}updateIcon(){let t=_t(this.htmlElement,".p-button-icon"),i=_t(this.htmlElement,".p-button-label");this.loading&&!this.loadingIcon&&t?t.innerHTML=this.spinnerIcon:t?.innerHTML&&(t.innerHTML=""),t?this.iconPos?t.className="p-button-icon "+(i?"p-button-icon-"+this.iconPos:"")+" "+this.getIconClass():t.className="p-button-icon "+this.getIconClass():this.createIcon()}getIconClass(){return this.loading?"p-button-loading-icon "+(this.loadingIcon?this.loadingIcon:"p-icon"):this.icon||"p-hidden"}ngOnDestroy(){this.initialized=!1,super.ngOnDestroy()}static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275dir=A({type:e,selectors:[["","pButton",""]],contentQueries:function(i,o,r){i&1&&(Vi(r,o.iconSignal,Lo,5),Vi(r,o.labelSignal,Ao,5)),i&2&&Sn(2)},hostVars:4,hostBindings:function(i,o){i&2&&nt("p-button-icon-only",o.isIconOnly())("p-button-text",o.isTextButton())},inputs:{iconPos:"iconPos",loadingIcon:"loadingIcon",loading:"loading",severity:"severity",raised:[2,"raised","raised",O],rounded:[2,"rounded","rounded",O],text:[2,"text","text",O],outlined:[2,"outlined","outlined",O],size:"size",plain:[2,"plain","plain",O],fluid:[2,"fluid","fluid",O],label:"label",icon:"icon",buttonProps:"buttonProps"},features:[D([Gt]),_,J]})}return e})(),zs=(()=>{class e extends ${type="button";iconPos="left";icon;badge;label;disabled;loading=!1;loadingIcon;raised=!1;rounded=!1;text=!1;plain=!1;severity;outlined=!1;link=!1;tabindex;size;variant;style;styleClass;badgeClass;badgeSeverity="secondary";ariaLabel;autofocus;fluid;onClick=new z;onFocus=new z;onBlur=new z;contentTemplate;loadingIconTemplate;iconTemplate;_buttonProps;get buttonProps(){return this._buttonProps}set buttonProps(t){this._buttonProps=t,t&&typeof t=="object"&&Object.entries(t).forEach(([i,o])=>this[`_${i}`]!==o&&(this[`_${i}`]=o))}get hasFluid(){let i=this.el.nativeElement.closest("p-fluid");return Y(this.fluid)?!!i:this.fluid}_componentStyle=v(Gt);templates;_contentTemplate;_iconTemplate;_loadingIconTemplate;ngAfterContentInit(){this.templates?.forEach(t=>{switch(t.getType()){case"content":this._contentTemplate=t.template;break;case"icon":this._iconTemplate=t.template;break;case"loadingicon":this._loadingIconTemplate=t.template;break;default:this._contentTemplate=t.template;break}})}ngOnChanges(t){super.ngOnChanges(t);let{buttonProps:i}=t;if(i){let o=i.currentValue;for(let r in o)this[r]=o[r]}}spinnerIconClass(){return Object.entries(this.iconClass()).filter(([,t])=>!!t).reduce((t,[i])=>t+` ${i}`,"p-button-loading-icon")}iconClass(){return{[`p-button-loading-icon pi-spin ${this.loadingIcon??""}`]:this.loading,"p-button-icon":!0,"p-button-icon-left":this.iconPos==="left"&&this.label,"p-button-icon-right":this.iconPos==="right"&&this.label,"p-button-icon-top":this.iconPos==="top"&&this.label,"p-button-icon-bottom":this.iconPos==="bottom"&&this.label}}get buttonClass(){return{"p-button p-component":!0,"p-button-icon-only":(this.icon||this.iconTemplate||this._iconTemplate||this.loadingIcon||this.loadingIconTemplate||this._loadingIconTemplate)&&!this.label,"p-button-vertical":(this.iconPos==="top"||this.iconPos==="bottom")&&this.label,"p-button-loading":this.loading,"p-button-loading-label-only":this.loading&&!this.icon&&this.label&&!this.loadingIcon&&this.iconPos==="left","p-button-link":this.link,[`p-button-${this.severity}`]:this.severity,"p-button-raised":this.raised,"p-button-rounded":this.rounded,"p-button-text":this.text||this.variant=="text","p-button-outlined":this.outlined||this.variant=="outlined","p-button-sm":this.size==="small","p-button-lg":this.size==="large","p-button-plain":this.plain,"p-button-fluid":this.hasFluid,[`${this.styleClass}`]:this.styleClass}}static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["p-button"]],contentQueries:function(i,o,r){if(i&1&&(it(r,ws,5),it(r,Es,5),it(r,xs,5),it(r,me,4)),i&2){let s;K(s=Z())&&(o.contentTemplate=s.first),K(s=Z())&&(o.loadingIconTemplate=s.first),K(s=Z())&&(o.iconTemplate=s.first),K(s=Z())&&(o.templates=s)}},inputs:{type:"type",iconPos:"iconPos",icon:"icon",badge:"badge",label:"label",disabled:[2,"disabled","disabled",O],loading:[2,"loading","loading",O],loadingIcon:"loadingIcon",raised:[2,"raised","raised",O],rounded:[2,"rounded","rounded",O],text:[2,"text","text",O],plain:[2,"plain","plain",O],severity:"severity",outlined:[2,"outlined","outlined",O],link:[2,"link","link",O],tabindex:[2,"tabindex","tabindex",Bt],size:"size",variant:"variant",style:"style",styleClass:"styleClass",badgeClass:"badgeClass",badgeSeverity:"badgeSeverity",ariaLabel:"ariaLabel",autofocus:[2,"autofocus","autofocus",O],fluid:[2,"fluid","fluid",O],buttonProps:"buttonProps"},outputs:{onClick:"onClick",onFocus:"onFocus",onBlur:"onBlur"},features:[D([Gt]),_,J],ngContentSelectors:Is,decls:7,vars:14,consts:[["pRipple","",3,"click","focus","blur","ngStyle","disabled","ngClass","pAutoFocus"],[4,"ngTemplateOutlet"],[4,"ngIf"],["class","p-button-label",4,"ngIf"],[3,"value","severity",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"ngClass",4,"ngIf"],[3,"styleClass","spin",4,"ngIf"],[3,"ngClass"],[3,"styleClass","spin"],[3,"ngIf"],[3,"class","ngClass",4,"ngIf"],[1,"p-button-label"],[3,"value","severity"]],template:function(i,o){i&1&&(ot(),P(0,"button",0),gt("click",function(s){return o.onClick.emit(s)})("focus",function(s){return o.onFocus.emit(s)})("blur",function(s){return o.onBlur.emit(s)}),rt(1),k(2,Ts,1,0,"ng-container",1)(3,Vs,3,5,"ng-container",2)(4,ks,3,5,"ng-container",2)(5,Ns,2,3,"span",3)(6,Ps,1,2,"p-badge",4),B()),i&2&&(g("ngStyle",o.style)("disabled",o.disabled||o.loading)("ngClass",o.buttonClass)("pAutoFocus",o.autofocus),R("type",o.type)("aria-label",o.ariaLabel)("data-pc-name","button")("data-pc-section","root")("tabindex",o.tabindex),E(2),g("ngTemplateOutlet",o.contentTemplate||o._contentTemplate),E(),g("ngIf",o.loading),E(),g("ngIf",!o.loading),E(),g("ngIf",!o.contentTemplate&&!o._contentTemplate&&o.label),E(),g("ngIf",!o.contentTemplate&&!o._contentTemplate&&o.badge))},dependencies:[tt,re,se,le,ae,Do,xo,Ai,To,cn,Q],encapsulation:2,changeDetection:0})}return e})(),Au=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({imports:[tt,zs,Q,Q]})}return e})();var Ws=["*"],js=({dt:e})=>`
.p-iconfield {
    position: relative;
    display: block;
}

.p-inputicon {
    position: absolute;
    top: 50%;
    margin-top: calc(-1 * (${e("icon.size")} / 2));
    color: ${e("iconfield.icon.color")};
    line-height: 1;
}

.p-iconfield .p-inputicon:first-child {
    inset-inline-start: ${e("form.field.padding.x")};
}

.p-iconfield .p-inputicon:last-child {
    inset-inline-end: ${e("form.field.padding.x")};
}

.p-iconfield .p-inputtext:not(:first-child) {
    padding-inline-start: calc((${e("form.field.padding.x")} * 2) + ${e("icon.size")});
}

.p-iconfield .p-inputtext:not(:last-child) {
    padding-inline-end: calc((${e("form.field.padding.x")} * 2) + ${e("icon.size")});
}

.p-iconfield:has(.p-inputfield-sm) .p-inputicon {
    font-size: ${e("form.field.sm.font.size")};
    width: ${e("form.field.sm.font.size")};
    height: ${e("form.field.sm.font.size")};
    margin-top: calc(-1 * (${e("form.field.sm.font.size")} / 2));
}

.p-iconfield:has(.p-inputfield-lg) .p-inputicon {
    font-size: ${e("form.field.lg.font.size")};
    width: ${e("form.field.lg.font.size")};
    height: ${e("form.field.lg.font.size")};
    margin-top: calc(-1 * (${e("form.field.lg.font.size")} / 2));
}
`,Us={root:"p-iconfield"},Fo=(()=>{class e extends F{name="iconfield";theme=js;classes=Us;static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})();var Wu=(()=>{class e extends ${iconPosition="left";get _styleClass(){return this.styleClass}styleClass;_componentStyle=v(Fo);static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["p-iconfield"],["p-iconField"],["p-icon-field"]],hostAttrs:[1,"p-iconfield"],hostVars:6,hostBindings:function(i,o){i&2&&(N(o._styleClass),nt("p-iconfield-left",o.iconPosition==="left")("p-iconfield-right",o.iconPosition==="right"))},inputs:{iconPosition:"iconPosition",styleClass:"styleClass"},features:[D([Fo]),_],ngContentSelectors:Ws,decls:1,vars:0,template:function(i,o){i&1&&(ot(),rt(0))},dependencies:[tt],encapsulation:2,changeDetection:0})}return e})();var Gs=["*"],qs={root:"p-inputicon"},Ro=(()=>{class e extends F{name="inputicon";classes=qs;static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})(),np=(()=>{class e extends ${styleClass;get hostClasses(){return this.styleClass}_componentStyle=v(Ro);static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275cmp=L({type:e,selectors:[["p-inputicon"],["p-inputIcon"]],hostVars:4,hostBindings:function(i,o){i&2&&(N(o.hostClasses),nt("p-inputicon",!0))},inputs:{styleClass:"styleClass"},features:[D([Ro]),_],ngContentSelectors:Gs,decls:1,vars:0,template:function(i,o){i&1&&(ot(),rt(0))},dependencies:[tt,Q],encapsulation:2,changeDetection:0})}return e})();var ee=class e{static isArray(n,t=!0){return Array.isArray(n)&&(t||n.length!==0)}static isObject(n,t=!0){return typeof n=="object"&&!Array.isArray(n)&&n!=null&&(t||Object.keys(n).length!==0)}static equals(n,t,i){return i?this.resolveFieldData(n,i)===this.resolveFieldData(t,i):this.equalsByValue(n,t)}static equalsByValue(n,t){if(n===t)return!0;if(n&&t&&typeof n=="object"&&typeof t=="object"){var i=Array.isArray(n),o=Array.isArray(t),r,s,a;if(i&&o){if(s=n.length,s!=t.length)return!1;for(r=s;r--!==0;)if(!this.equalsByValue(n[r],t[r]))return!1;return!0}if(i!=o)return!1;var l=this.isDate(n),c=this.isDate(t);if(l!=c)return!1;if(l&&c)return n.getTime()==t.getTime();var d=n instanceof RegExp,p=t instanceof RegExp;if(d!=p)return!1;if(d&&p)return n.toString()==t.toString();var u=Object.keys(n);if(s=u.length,s!==Object.keys(t).length)return!1;for(r=s;r--!==0;)if(!Object.prototype.hasOwnProperty.call(t,u[r]))return!1;for(r=s;r--!==0;)if(a=u[r],!this.equalsByValue(n[a],t[a]))return!1;return!0}return n!==n&&t!==t}static resolveFieldData(n,t){if(n&&t){if(this.isFunction(t))return t(n);if(t.indexOf(".")==-1)return n[t];{let i=t.split("."),o=n;for(let r=0,s=i.length;r<s;++r){if(o==null)return null;o=o[i[r]]}return o}}else return null}static isFunction(n){return!!(n&&n.constructor&&n.call&&n.apply)}static reorderArray(n,t,i){let o;n&&t!==i&&(i>=n.length&&(i%=n.length,t%=n.length),n.splice(i,0,n.splice(t,1)[0]))}static insertIntoOrderedArray(n,t,i,o){if(i.length>0){let r=!1;for(let s=0;s<i.length;s++)if(this.findIndexInList(i[s],o)>t){i.splice(s,0,n),r=!0;break}r||i.push(n)}else i.push(n)}static findIndexInList(n,t){let i=-1;if(t){for(let o=0;o<t.length;o++)if(t[o]==n){i=o;break}}return i}static contains(n,t){if(n!=null&&t&&t.length){for(let i of t)if(this.equals(n,i))return!0}return!1}static removeAccents(n){return n&&(n=n.normalize("NFKD").replace(new RegExp("\\p{Diacritic}","gu"),"")),n}static isDate(n){return Object.prototype.toString.call(n)==="[object Date]"}static isEmpty(n){return n==null||n===""||Array.isArray(n)&&n.length===0||!this.isDate(n)&&typeof n=="object"&&Object.keys(n).length===0}static isNotEmpty(n){return!this.isEmpty(n)}static compare(n,t,i,o=1){let r=-1,s=this.isEmpty(n),a=this.isEmpty(t);return s&&a?r=0:s?r=o:a?r=-o:typeof n=="string"&&typeof t=="string"?r=n.localeCompare(t,i,{numeric:!0}):r=n<t?-1:n>t?1:0,r}static sort(n,t,i=1,o,r=1){let s=e.compare(n,t,o,i),a=i;return(e.isEmpty(n)||e.isEmpty(t))&&(a=r===1?i:r),a*s}static merge(n,t){if(!(n==null&&t==null)){{if((n==null||typeof n=="object")&&(t==null||typeof t=="object"))return f(f({},n||{}),t||{});if((n==null||typeof n=="string")&&(t==null||typeof t=="string"))return[n||"",t||""].join(" ")}return t||n}}static isPrintableCharacter(n=""){return this.isNotEmpty(n)&&n.length===1&&n.match(/\S| /)}static getItemValue(n,...t){return this.isFunction(n)?n(...t):n}static findLastIndex(n,t){let i=-1;if(this.isNotEmpty(n))try{i=n.findLastIndex(t)}catch{i=n.lastIndexOf([...n].reverse().find(t))}return i}static findLast(n,t){let i;if(this.isNotEmpty(n))try{i=n.findLast(t)}catch{i=[...n].reverse().find(t)}return i}static deepEquals(n,t){if(n===t)return!0;if(n&&t&&typeof n=="object"&&typeof t=="object"){var i=Array.isArray(n),o=Array.isArray(t),r,s,a;if(i&&o){if(s=n.length,s!=t.length)return!1;for(r=s;r--!==0;)if(!this.deepEquals(n[r],t[r]))return!1;return!0}if(i!=o)return!1;var l=n instanceof Date,c=t instanceof Date;if(l!=c)return!1;if(l&&c)return n.getTime()==t.getTime();var d=n instanceof RegExp,p=t instanceof RegExp;if(d!=p)return!1;if(d&&p)return n.toString()==t.toString();var u=Object.keys(n);if(s=u.length,s!==Object.keys(t).length)return!1;for(r=s;r--!==0;)if(!Object.prototype.hasOwnProperty.call(t,u[r]))return!1;for(r=s;r--!==0;)if(a=u[r],!this.deepEquals(n[a],t[a]))return!1;return!0}return n!==n&&t!==t}static minifyCSS(n){return n&&n.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g,"").replace(/ {2,}/g," ").replace(/ ([{:}]) /g,"$1").replace(/([;,]) /g,"$1").replace(/ !/g,"!").replace(/: /g,":")}static toFlatCase(n){return this.isString(n)?n.replace(/(-|_)/g,"").toLowerCase():n}static isString(n,t=!0){return typeof n=="string"&&(t||n!=="")}},$o=0;function bp(e="pn_id_"){return $o++,`${e}${$o}`}function Ks(){let e=[],n=(r,s)=>{let a=e.length>0?e[e.length-1]:{key:r,value:s},l=a.value+(a.key===r?0:s)+2;return e.push({key:r,value:l}),l},t=r=>{e=e.filter(s=>s.value!==r)},i=()=>e.length>0?e[e.length-1].value:0,o=r=>r&&parseInt(r.style.zIndex,10)||0;return{get:o,set:(r,s,a)=>{s&&(s.style.zIndex=String(n(r,a)))},clear:r=>{r&&(t(o(r)),r.style.zIndex="")},getCurrent:()=>i(),generateZIndex:n,revertZIndex:t}}var qt=Ks();var ko=["content"],Zs=["overlay"],Qs=["*"],Ys=(e,n,t,i,o,r,s,a,l,c,d,p,u,h)=>({"p-overlay p-component":!0,"p-overlay-modal p-overlay-mask p-overlay-mask-enter":e,"p-overlay-center":n,"p-overlay-top":t,"p-overlay-top-start":i,"p-overlay-top-end":o,"p-overlay-bottom":r,"p-overlay-bottom-start":s,"p-overlay-bottom-end":a,"p-overlay-left":l,"p-overlay-left-start":c,"p-overlay-left-end":d,"p-overlay-right":p,"p-overlay-right-start":u,"p-overlay-right-end":h}),Xs=(e,n,t)=>({showTransitionParams:e,hideTransitionParams:n,transform:t}),Js=e=>({value:"visible",params:e}),ta=e=>({mode:e}),ea=e=>({$implicit:e});function ia(e,n){e&1&&xt(0)}function na(e,n){if(e&1){let t=Se();P(0,"div",3,1),gt("click",function(o){Kt(t);let r=T(2);return Zt(r.onOverlayContentClick(o))})("@overlayContentAnimation.start",function(o){Kt(t);let r=T(2);return Zt(r.onOverlayContentAnimationStart(o))})("@overlayContentAnimation.done",function(o){Kt(t);let r=T(2);return Zt(r.onOverlayContentAnimationDone(o))}),rt(2),k(3,ia,1,0,"ng-container",4),B()}if(e&2){let t=T(2);N(t.contentStyleClass),g("ngStyle",t.contentStyle)("ngClass","p-overlay-content")("@overlayContentAnimation",st(11,Js,ti(7,Xs,t.showTransitionOptions,t.hideTransitionOptions,t.transformOptions[t.modal?t.overlayResponsiveDirection:"default"]))),E(3),g("ngTemplateOutlet",t.contentTemplate||t._contentTemplate)("ngTemplateOutletContext",st(15,ea,st(13,ta,t.overlayMode)))}}function oa(e,n){if(e&1){let t=Se();P(0,"div",3,0),gt("click",function(){Kt(t);let o=T();return Zt(o.onOverlayClick())}),k(2,na,4,17,"div",2),B()}if(e&2){let t=T();N(t.styleClass),g("ngStyle",t.style)("ngClass",En(5,Ys,[t.modal,t.modal&&t.overlayResponsiveDirection==="center",t.modal&&t.overlayResponsiveDirection==="top",t.modal&&t.overlayResponsiveDirection==="top-start",t.modal&&t.overlayResponsiveDirection==="top-end",t.modal&&t.overlayResponsiveDirection==="bottom",t.modal&&t.overlayResponsiveDirection==="bottom-start",t.modal&&t.overlayResponsiveDirection==="bottom-end",t.modal&&t.overlayResponsiveDirection==="left",t.modal&&t.overlayResponsiveDirection==="left-start",t.modal&&t.overlayResponsiveDirection==="left-end",t.modal&&t.overlayResponsiveDirection==="right",t.modal&&t.overlayResponsiveDirection==="right-start",t.modal&&t.overlayResponsiveDirection==="right-end"])),E(2),g("ngIf",t.visible)}}var ra=({dt:e})=>`
.p-overlay {
    position: absolute;
    top: 0;
}

.p-overlay-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-content {
    transform-origin: inherit;
}

.p-overlay-modal > .p-overlay-content {
    z-index: 1;
    width: 90%;
}

/* Position */
/* top */
.p-overlay-top {
    align-items: flex-start;
}
.p-overlay-top-start {
    align-items: flex-start;
    justify-content: flex-start;
}
.p-overlay-top-end {
    align-items: flex-start;
    justify-content: flex-end;
}

/* bottom */
.p-overlay-bottom {
    align-items: flex-end;
}
.p-overlay-bottom-start {
    align-items: flex-end;
    justify-content: flex-start;
}
.p-overlay-bottom-end {
    align-items: flex-end;
    justify-content: flex-end;
}

/* left */
.p-overlay-left {
    justify-content: flex-start;
}
.p-overlay-left-start {
    justify-content: flex-start;
    align-items: flex-start;
}
.p-overlay-left-end {
    justify-content: flex-start;
    align-items: flex-end;
}

/* right */
.p-overlay-right {
    justify-content: flex-end;
}
.p-overlay-right-start {
    justify-content: flex-end;
    align-items: flex-start;
}
.p-overlay-right-end {
    justify-content: flex-end;
    align-items: flex-end;
}
`,No=(()=>{class e extends F{name="overlay";theme=ra;static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})(),sa=ri([ni({transform:"{{transform}}",opacity:0}),ii("{{showTransitionParams}}")]),aa=ri([ii("{{hideTransitionParams}}",ni({transform:"{{transform}}",opacity:0}))]),la=(()=>{class e extends ${overlayService;zone;get visible(){return this._visible}set visible(t){this._visible=t,this._visible&&!this.modalVisible&&(this.modalVisible=!0)}get mode(){return this._mode||this.overlayOptions?.mode}set mode(t){this._mode=t}get style(){return ee.merge(this._style,this.modal?this.overlayResponsiveOptions?.style:this.overlayOptions?.style)}set style(t){this._style=t}get styleClass(){return ee.merge(this._styleClass,this.modal?this.overlayResponsiveOptions?.styleClass:this.overlayOptions?.styleClass)}set styleClass(t){this._styleClass=t}get contentStyle(){return ee.merge(this._contentStyle,this.modal?this.overlayResponsiveOptions?.contentStyle:this.overlayOptions?.contentStyle)}set contentStyle(t){this._contentStyle=t}get contentStyleClass(){return ee.merge(this._contentStyleClass,this.modal?this.overlayResponsiveOptions?.contentStyleClass:this.overlayOptions?.contentStyleClass)}set contentStyleClass(t){this._contentStyleClass=t}get target(){let t=this._target||this.overlayOptions?.target;return t===void 0?"@prev":t}set target(t){this._target=t}get appendTo(){return this._appendTo||this.overlayOptions?.appendTo}set appendTo(t){this._appendTo=t}get autoZIndex(){let t=this._autoZIndex||this.overlayOptions?.autoZIndex;return t===void 0?!0:t}set autoZIndex(t){this._autoZIndex=t}get baseZIndex(){let t=this._baseZIndex||this.overlayOptions?.baseZIndex;return t===void 0?0:t}set baseZIndex(t){this._baseZIndex=t}get showTransitionOptions(){let t=this._showTransitionOptions||this.overlayOptions?.showTransitionOptions;return t===void 0?".12s cubic-bezier(0, 0, 0.2, 1)":t}set showTransitionOptions(t){this._showTransitionOptions=t}get hideTransitionOptions(){let t=this._hideTransitionOptions||this.overlayOptions?.hideTransitionOptions;return t===void 0?".1s linear":t}set hideTransitionOptions(t){this._hideTransitionOptions=t}get listener(){return this._listener||this.overlayOptions?.listener}set listener(t){this._listener=t}get responsive(){return this._responsive||this.overlayOptions?.responsive}set responsive(t){this._responsive=t}get options(){return this._options}set options(t){this._options=t}visibleChange=new z;onBeforeShow=new z;onShow=new z;onBeforeHide=new z;onHide=new z;onAnimationStart=new z;onAnimationDone=new z;overlayViewChild;contentViewChild;contentTemplate;templates;_contentTemplate;_visible=!1;_mode;_style;_styleClass;_contentStyle;_contentStyleClass;_target;_appendTo;_autoZIndex;_baseZIndex;_showTransitionOptions;_hideTransitionOptions;_listener;_responsive;_options;modalVisible=!1;isOverlayClicked=!1;isOverlayContentClicked=!1;scrollHandler;documentClickListener;documentResizeListener;_componentStyle=v(No);documentKeyboardListener;window;transformOptions={default:"scaleY(0.8)",center:"scale(0.7)",top:"translate3d(0px, -100%, 0px)","top-start":"translate3d(0px, -100%, 0px)","top-end":"translate3d(0px, -100%, 0px)",bottom:"translate3d(0px, 100%, 0px)","bottom-start":"translate3d(0px, 100%, 0px)","bottom-end":"translate3d(0px, 100%, 0px)",left:"translate3d(-100%, 0px, 0px)","left-start":"translate3d(-100%, 0px, 0px)","left-end":"translate3d(-100%, 0px, 0px)",right:"translate3d(100%, 0px, 0px)","right-start":"translate3d(100%, 0px, 0px)","right-end":"translate3d(100%, 0px, 0px)"};get modal(){if(bt(this.platformId))return this.mode==="modal"||this.overlayResponsiveOptions&&this.document.defaultView?.matchMedia(this.overlayResponsiveOptions.media?.replace("@media","")||`(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches}get overlayMode(){return this.mode||(this.modal?"modal":"overlay")}get overlayOptions(){return f(f({},this.config?.overlayOptions),this.options)}get overlayResponsiveOptions(){return f(f({},this.overlayOptions?.responsive),this.responsive)}get overlayResponsiveDirection(){return this.overlayResponsiveOptions?.direction||"center"}get overlayEl(){return this.overlayViewChild?.nativeElement}get contentEl(){return this.contentViewChild?.nativeElement}get targetEl(){return ro(this.target,this.el?.nativeElement)}constructor(t,i){super(),this.overlayService=t,this.zone=i}ngAfterContentInit(){this.templates?.forEach(t=>{t.getType()==="content"?this._contentTemplate=t.template:this._contentTemplate=t.template})}show(t,i=!1){this.onVisibleChange(!0),this.handleEvents("onShow",{overlay:t||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&tn(this.targetEl),this.modal&&vt(this.document?.body,"p-overflow-hidden")}hide(t,i=!1){if(this.visible)this.onVisibleChange(!1),this.handleEvents("onHide",{overlay:t||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&tn(this.targetEl),this.modal&&Ft(this.document?.body,"p-overflow-hidden");else return}alignOverlay(){!this.modal&&jt.alignOverlay(this.overlayEl,this.targetEl,this.appendTo)}onVisibleChange(t){this._visible=t,this.visibleChange.emit(t)}onOverlayClick(){this.isOverlayClicked=!0}onOverlayContentClick(t){this.overlayService.add({originalEvent:t,target:this.targetEl}),this.isOverlayContentClicked=!0}onOverlayContentAnimationStart(t){switch(t.toState){case"visible":this.handleEvents("onBeforeShow",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.autoZIndex&&qt.set(this.overlayMode,this.overlayEl,this.baseZIndex+this.config?.zIndex[this.overlayMode]),jt.appendOverlay(this.overlayEl,this.appendTo==="body"?this.document.body:this.appendTo,this.appendTo),this.alignOverlay();break;case"void":this.handleEvents("onBeforeHide",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.modal&&vt(this.overlayEl,"p-overlay-mask-leave");break}this.handleEvents("onAnimationStart",t)}onOverlayContentAnimationDone(t){let i=this.overlayEl||t.element.parentElement;switch(t.toState){case"visible":this.visible&&(this.show(i,!0),this.bindListeners());break;case"void":if(!this.visible){this.hide(i,!0),this.modalVisible=!1,this.unbindListeners(),jt.appendOverlay(this.overlayEl,this.targetEl,this.appendTo),qt.clear(i),this.cd.markForCheck();break}}this.handleEvents("onAnimationDone",t)}handleEvents(t,i){this[t].emit(i),this.options&&this.options[t]&&this.options[t](i),this.config?.overlayOptions&&(this.config?.overlayOptions)[t]&&(this.config?.overlayOptions)[t](i)}bindListeners(){this.bindScrollListener(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindDocumentKeyboardListener()}unbindListeners(){this.unbindScrollListener(),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindDocumentKeyboardListener()}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new ye(this.targetEl,t=>{(!this.listener||this.listener(t,{type:"scroll",mode:this.overlayMode,valid:!0}))&&this.hide(t,!0)})),this.scrollHandler.bindScrollListener()}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}bindDocumentClickListener(){this.documentClickListener||(this.documentClickListener=this.renderer.listen(this.document,"click",t=>{let o=!(this.targetEl&&(this.targetEl.isSameNode(t.target)||!this.isOverlayClicked&&this.targetEl.contains(t.target)))&&!this.isOverlayContentClicked;(this.listener?this.listener(t,{type:"outside",mode:this.overlayMode,valid:t.which!==3&&o}):o)&&this.hide(t),this.isOverlayClicked=this.isOverlayContentClicked=!1}))}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null)}bindDocumentResizeListener(){this.documentResizeListener||(this.documentResizeListener=this.renderer.listen(this.document.defaultView,"resize",t=>{(this.listener?this.listener(t,{type:"resize",mode:this.overlayMode,valid:!Jt()}):!Jt())&&this.hide(t,!0)}))}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindDocumentKeyboardListener(){this.documentKeyboardListener||this.zone.runOutsideAngular(()=>{this.documentKeyboardListener=this.renderer.listen(this.document.defaultView,"keydown",t=>{if(this.overlayOptions.hideOnEscape===!1||t.code!=="Escape")return;(this.listener?this.listener(t,{type:"keydown",mode:this.overlayMode,valid:!Jt()}):!Jt())&&this.zone.run(()=>{this.hide(t,!0)})})})}unbindDocumentKeyboardListener(){this.documentKeyboardListener&&(this.documentKeyboardListener(),this.documentKeyboardListener=null)}ngOnDestroy(){this.hide(this.overlayEl,!0),this.overlayEl&&(jt.appendOverlay(this.overlayEl,this.targetEl,this.appendTo),qt.clear(this.overlayEl)),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.unbindListeners(),super.ngOnDestroy()}static \u0275fac=function(i){return new(i||e)(w(So),w(Nt))};static \u0275cmp=L({type:e,selectors:[["p-overlay"]],contentQueries:function(i,o,r){if(i&1&&(it(r,ko,4),it(r,me,4)),i&2){let s;K(s=Z())&&(o.contentTemplate=s.first),K(s=Z())&&(o.templates=s)}},viewQuery:function(i,o){if(i&1&&(oe(Zs,5),oe(ko,5)),i&2){let r;K(r=Z())&&(o.overlayViewChild=r.first),K(r=Z())&&(o.contentViewChild=r.first)}},inputs:{visible:"visible",mode:"mode",style:"style",styleClass:"styleClass",contentStyle:"contentStyle",contentStyleClass:"contentStyleClass",target:"target",appendTo:"appendTo",autoZIndex:"autoZIndex",baseZIndex:"baseZIndex",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",listener:"listener",responsive:"responsive",options:"options"},outputs:{visibleChange:"visibleChange",onBeforeShow:"onBeforeShow",onShow:"onShow",onBeforeHide:"onBeforeHide",onHide:"onHide",onAnimationStart:"onAnimationStart",onAnimationDone:"onAnimationDone"},features:[D([No]),_],ngContentSelectors:Qs,decls:1,vars:1,consts:[["overlay",""],["content",""],[3,"ngStyle","class","ngClass","click",4,"ngIf"],[3,"click","ngStyle","ngClass"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,o){i&1&&(ot(),k(0,oa,3,20,"div",2)),i&2&&g("ngIf",o.modalVisible)},dependencies:[tt,re,se,le,ae,Q],encapsulation:2,data:{animation:[Ri("overlayContentAnimation",[oi(":enter",[si(sa)]),oi(":leave",[si(aa)])])]},changeDetection:0})}return e})(),Bp=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({imports:[la,Q,Q]})}return e})();var Po=["content"],ca=["item"],da=["loader"],ua=["loadericon"],pa=["element"],ha=["*"],fa=(e,n,t)=>({"p-virtualscroller":!0,"p-virtualscroller-inline":e,"p-virtualscroller-both p-both-scroll":n,"p-virtualscroller-horizontal p-horizontal-scroll":t}),dn=(e,n)=>({$implicit:e,options:n}),ga=e=>({"p-virtualscroller-content":!0,"p-virtualscroller-loading ":e}),ma=e=>({"p-virtualscroller-loader-mask":e}),ya=e=>({numCols:e}),Ho=e=>({options:e}),ba=()=>({styleClass:"p-virtualscroller-loading-icon"}),va=(e,n)=>({rows:e,columns:n});function _a(e,n){e&1&&xt(0)}function Ca(e,n){if(e&1&&(ht(0),k(1,_a,1,0,"ng-container",10),ft()),e&2){let t=T(2);E(),g("ngTemplateOutlet",t.contentTemplate||t._contentTemplate)("ngTemplateOutletContext",Ee(2,dn,t.loadedItems,t.getContentOptions()))}}function Sa(e,n){e&1&&xt(0)}function wa(e,n){if(e&1&&(ht(0),k(1,Sa,1,0,"ng-container",10),ft()),e&2){let t=n.$implicit,i=n.index,o=T(3);E(),g("ngTemplateOutlet",o.itemTemplate||o._itemTemplate)("ngTemplateOutletContext",Ee(2,dn,t,o.getOptions(i)))}}function Ea(e,n){if(e&1&&(P(0,"div",11,3),k(2,wa,2,5,"ng-container",12),B()),e&2){let t=T(2);Ye(t.contentStyle),N(t.contentStyleClass),g("ngClass",st(8,ga,t.d_loading)),R("data-pc-section","content"),E(2),g("ngForOf",t.loadedItems)("ngForTrackBy",t._trackBy)}}function xa(e,n){if(e&1&&j(0,"div",13),e&2){let t=T(2);g("ngStyle",t.spacerStyle),R("data-pc-section","spacer")}}function Ia(e,n){e&1&&xt(0)}function Ta(e,n){if(e&1&&(ht(0),k(1,Ia,1,0,"ng-container",10),ft()),e&2){let t=n.index,i=T(4);E(),g("ngTemplateOutlet",i.loaderTemplate||i._loaderTemplate)("ngTemplateOutletContext",st(4,Ho,i.getLoaderOptions(t,i.both&&st(2,ya,i.numItemsInViewport.cols))))}}function Oa(e,n){if(e&1&&(ht(0),k(1,Ta,2,6,"ng-container",15),ft()),e&2){let t=T(3);E(),g("ngForOf",t.loaderArr)}}function Da(e,n){e&1&&xt(0)}function Aa(e,n){if(e&1&&(ht(0),k(1,Da,1,0,"ng-container",10),ft()),e&2){let t=T(4);E(),g("ngTemplateOutlet",t.loaderIconTemplate||t._loaderIconTemplate)("ngTemplateOutletContext",st(3,Ho,wn(2,ba)))}}function La(e,n){e&1&&j(0,"SpinnerIcon",16),e&2&&(g("styleClass","p-virtualscroller-loading-icon pi-spin"),R("data-pc-section","loadingIcon"))}function Ma(e,n){if(e&1&&k(0,Aa,2,5,"ng-container",6)(1,La,1,2,"ng-template",null,5,xe),e&2){let t=we(2),i=T(3);g("ngIf",i.loaderIconTemplate||i._loaderIconTemplate)("ngIfElse",t)}}function Va(e,n){if(e&1&&(P(0,"div",14),k(1,Oa,2,1,"ng-container",6)(2,Ma,3,2,"ng-template",null,4,xe),B()),e&2){let t=we(3),i=T(2);g("ngClass",st(4,ma,!i.loaderTemplate)),R("data-pc-section","loader"),E(),g("ngIf",i.loaderTemplate||i._loaderTemplate)("ngIfElse",t)}}function Fa(e,n){if(e&1){let t=Se();ht(0),P(1,"div",7,1),gt("scroll",function(o){Kt(t);let r=T();return Zt(r.onContainerScroll(o))}),k(3,Ca,2,5,"ng-container",6)(4,Ea,3,10,"ng-template",null,2,xe)(6,xa,1,2,"div",8)(7,Va,4,6,"div",9),B(),ft()}if(e&2){let t=we(5),i=T();E(),N(i._styleClass),g("ngStyle",i._style)("ngClass",ti(12,fa,i.inline,i.both,i.horizontal)),R("id",i._id)("tabindex",i.tabindex)("data-pc-name","scroller")("data-pc-section","root"),E(2),g("ngIf",i.contentTemplate||i._contentTemplate)("ngIfElse",t),E(3),g("ngIf",i._showSpacer),E(),g("ngIf",!i.loaderDisabled&&i._showLoader&&i.d_loading)}}function Ra(e,n){e&1&&xt(0)}function $a(e,n){if(e&1&&(ht(0),k(1,Ra,1,0,"ng-container",10),ft()),e&2){let t=T(2);E(),g("ngTemplateOutlet",t.contentTemplate||t._contentTemplate)("ngTemplateOutletContext",Ee(5,dn,t.items,Ee(2,va,t._items,t.loadedColumns)))}}function ka(e,n){if(e&1&&(rt(0),k(1,$a,2,8,"ng-container",17)),e&2){let t=T();E(),g("ngIf",t.contentTemplate||t._contentTemplate)}}var Na=({dt:e})=>`
.p-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.p-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.p-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.p-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${e("virtualscroller.loader.mask.background")};
    color: ${e("virtualscroller.loader.mask.color")};
}

.p-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-virtualscroller-loading-icon {
    font-size: ${e("virtualscroller.loader.icon.size")};
    width: ${e("virtualscroller.loader.icon.size")};
    height: ${e("virtualscroller.loader.icon.size")};
}

.p-virtualscroller-horizontal > .p-virtualscroller-content {
    display: flex;
}

.p-virtualscroller-inline .p-virtualscroller-content {
    position: static;
}
`,Bo=(()=>{class e extends F{name="virtualscroller";theme=Na;static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})();var Pa=(()=>{class e extends ${zone;get id(){return this._id}set id(t){this._id=t}get style(){return this._style}set style(t){this._style=t}get styleClass(){return this._styleClass}set styleClass(t){this._styleClass=t}get tabindex(){return this._tabindex}set tabindex(t){this._tabindex=t}get items(){return this._items}set items(t){this._items=t}get itemSize(){return this._itemSize}set itemSize(t){this._itemSize=t}get scrollHeight(){return this._scrollHeight}set scrollHeight(t){this._scrollHeight=t}get scrollWidth(){return this._scrollWidth}set scrollWidth(t){this._scrollWidth=t}get orientation(){return this._orientation}set orientation(t){this._orientation=t}get step(){return this._step}set step(t){this._step=t}get delay(){return this._delay}set delay(t){this._delay=t}get resizeDelay(){return this._resizeDelay}set resizeDelay(t){this._resizeDelay=t}get appendOnly(){return this._appendOnly}set appendOnly(t){this._appendOnly=t}get inline(){return this._inline}set inline(t){this._inline=t}get lazy(){return this._lazy}set lazy(t){this._lazy=t}get disabled(){return this._disabled}set disabled(t){this._disabled=t}get loaderDisabled(){return this._loaderDisabled}set loaderDisabled(t){this._loaderDisabled=t}get columns(){return this._columns}set columns(t){this._columns=t}get showSpacer(){return this._showSpacer}set showSpacer(t){this._showSpacer=t}get showLoader(){return this._showLoader}set showLoader(t){this._showLoader=t}get numToleratedItems(){return this._numToleratedItems}set numToleratedItems(t){this._numToleratedItems=t}get loading(){return this._loading}set loading(t){this._loading=t}get autoSize(){return this._autoSize}set autoSize(t){this._autoSize=t}get trackBy(){return this._trackBy}set trackBy(t){this._trackBy=t}get options(){return this._options}set options(t){this._options=t,t&&typeof t=="object"&&(Object.entries(t).forEach(([i,o])=>this[`_${i}`]!==o&&(this[`_${i}`]=o)),Object.entries(t).forEach(([i,o])=>this[`${i}`]!==o&&(this[`${i}`]=o)))}onLazyLoad=new z;onScroll=new z;onScrollIndexChange=new z;elementViewChild;contentViewChild;height;_id;_style;_styleClass;_tabindex=0;_items;_itemSize=0;_scrollHeight;_scrollWidth;_orientation="vertical";_step=0;_delay=0;_resizeDelay=10;_appendOnly=!1;_inline=!1;_lazy=!1;_disabled=!1;_loaderDisabled=!1;_columns;_showSpacer=!0;_showLoader=!1;_numToleratedItems;_loading;_autoSize=!1;_trackBy;_options;d_loading=!1;d_numToleratedItems;contentEl;contentTemplate;itemTemplate;loaderTemplate;loaderIconTemplate;templates;_contentTemplate;_itemTemplate;_loaderTemplate;_loaderIconTemplate;first=0;last=0;page=0;isRangeChanged=!1;numItemsInViewport=0;lastScrollPos=0;lazyLoadState={};loaderArr=[];spacerStyle={};contentStyle={};scrollTimeout;resizeTimeout;initialized=!1;windowResizeListener;defaultWidth;defaultHeight;defaultContentWidth;defaultContentHeight;_contentStyleClass;get contentStyleClass(){return this._contentStyleClass}set contentStyleClass(t){this._contentStyleClass=t}get vertical(){return this._orientation==="vertical"}get horizontal(){return this._orientation==="horizontal"}get both(){return this._orientation==="both"}get loadedItems(){return this._items&&!this.d_loading?this.both?this._items.slice(this._appendOnly?0:this.first.rows,this.last.rows).map(t=>this._columns?t:t.slice(this._appendOnly?0:this.first.cols,this.last.cols)):this.horizontal&&this._columns?this._items:this._items.slice(this._appendOnly?0:this.first,this.last):[]}get loadedRows(){return this.d_loading?this._loaderDisabled?this.loaderArr:[]:this.loadedItems}get loadedColumns(){return this._columns&&(this.both||this.horizontal)?this.d_loading&&this._loaderDisabled?this.both?this.loaderArr[0]:this.loaderArr:this._columns.slice(this.both?this.first.cols:this.first,this.both?this.last.cols:this.last):this._columns}_componentStyle=v(Bo);constructor(t){super(),this.zone=t}ngOnInit(){super.ngOnInit(),this.setInitialState()}ngOnChanges(t){super.ngOnChanges(t);let i=!1;if(this.scrollHeight=="100%"&&(this.height="100%"),t.loading){let{previousValue:o,currentValue:r}=t.loading;this.lazy&&o!==r&&r!==this.d_loading&&(this.d_loading=r,i=!0)}if(t.orientation&&(this.lastScrollPos=this.both?{top:0,left:0}:0),t.numToleratedItems){let{previousValue:o,currentValue:r}=t.numToleratedItems;o!==r&&r!==this.d_numToleratedItems&&(this.d_numToleratedItems=r)}if(t.options){let{previousValue:o,currentValue:r}=t.options;this.lazy&&o?.loading!==r?.loading&&r?.loading!==this.d_loading&&(this.d_loading=r.loading,i=!0),o?.numToleratedItems!==r?.numToleratedItems&&r?.numToleratedItems!==this.d_numToleratedItems&&(this.d_numToleratedItems=r.numToleratedItems)}this.initialized&&!i&&(t.items?.previousValue?.length!==t.items?.currentValue?.length||t.itemSize||t.scrollHeight||t.scrollWidth)&&(this.init(),this.calculateAutoSize())}ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"content":this._contentTemplate=t.template;break;case"item":this._itemTemplate=t.template;break;case"loader":this._loaderTemplate=t.template;break;case"loadericon":this._loaderIconTemplate=t.template;break;default:this._itemTemplate=t.template;break}})}ngAfterViewInit(){super.ngAfterViewInit(),Promise.resolve().then(()=>{this.viewInit()})}ngAfterViewChecked(){this.initialized||this.viewInit()}ngOnDestroy(){this.unbindResizeListener(),this.contentEl=null,this.initialized=!1,super.ngOnDestroy()}viewInit(){bt(this.platformId)&&!this.initialized&&en(this.elementViewChild?.nativeElement)&&(this.setInitialState(),this.setContentEl(this.contentEl),this.init(),this.defaultWidth=At(this.elementViewChild?.nativeElement),this.defaultHeight=Dt(this.elementViewChild?.nativeElement),this.defaultContentWidth=At(this.contentEl),this.defaultContentHeight=Dt(this.contentEl),this.initialized=!0)}init(){this._disabled||(this.setSize(),this.calculateOptions(),this.setSpacerSize(),this.bindResizeListener(),this.cd.detectChanges())}setContentEl(t){this.contentEl=t||this.contentViewChild?.nativeElement||_t(this.elementViewChild?.nativeElement,".p-virtualscroller-content")}setInitialState(){this.first=this.both?{rows:0,cols:0}:0,this.last=this.both?{rows:0,cols:0}:0,this.numItemsInViewport=this.both?{rows:0,cols:0}:0,this.lastScrollPos=this.both?{top:0,left:0}:0,this.d_loading=this._loading||!1,this.d_numToleratedItems=this._numToleratedItems,this.loaderArr=[]}getElementRef(){return this.elementViewChild}getPageByFirst(t){return Math.floor(((t??this.first)+this.d_numToleratedItems*4)/(this._step||1))}isPageChanged(t){return this._step?this.page!==this.getPageByFirst(t??this.first):!0}scrollTo(t){this.elementViewChild?.nativeElement?.scrollTo(t)}scrollToIndex(t,i="auto"){if(this.both?t.every(r=>r>-1):t>-1){let r=this.first,{scrollTop:s=0,scrollLeft:a=0}=this.elementViewChild?.nativeElement,{numToleratedItems:l}=this.calculateNumItems(),c=this.getContentPosition(),d=this.itemSize,p=(C=0,S)=>C<=S?0:C,u=(C,S,q)=>C*S+q,h=(C=0,S=0)=>this.scrollTo({left:C,top:S,behavior:i}),m=this.both?{rows:0,cols:0}:0,x=!1,y=!1;this.both?(m={rows:p(t[0],l[0]),cols:p(t[1],l[1])},h(u(m.cols,d[1],c.left),u(m.rows,d[0],c.top)),y=this.lastScrollPos.top!==s||this.lastScrollPos.left!==a,x=m.rows!==r.rows||m.cols!==r.cols):(m=p(t,l),this.horizontal?h(u(m,d,c.left),s):h(a,u(m,d,c.top)),y=this.lastScrollPos!==(this.horizontal?a:s),x=m!==r),this.isRangeChanged=x,y&&(this.first=m)}}scrollInView(t,i,o="auto"){if(i){let{first:r,viewport:s}=this.getRenderedRange(),a=(d=0,p=0)=>this.scrollTo({left:d,top:p,behavior:o}),l=i==="to-start",c=i==="to-end";if(l){if(this.both)s.first.rows-r.rows>t[0]?a(s.first.cols*this._itemSize[1],(s.first.rows-1)*this._itemSize[0]):s.first.cols-r.cols>t[1]&&a((s.first.cols-1)*this._itemSize[1],s.first.rows*this._itemSize[0]);else if(s.first-r>t){let d=(s.first-1)*this._itemSize;this.horizontal?a(d,0):a(0,d)}}else if(c){if(this.both)s.last.rows-r.rows<=t[0]+1?a(s.first.cols*this._itemSize[1],(s.first.rows+1)*this._itemSize[0]):s.last.cols-r.cols<=t[1]+1&&a((s.first.cols+1)*this._itemSize[1],s.first.rows*this._itemSize[0]);else if(s.last-r<=t+1){let d=(s.first+1)*this._itemSize;this.horizontal?a(d,0):a(0,d)}}}else this.scrollToIndex(t,o)}getRenderedRange(){let t=(r,s)=>s||r?Math.floor(r/(s||r)):0,i=this.first,o=0;if(this.elementViewChild?.nativeElement){let{scrollTop:r,scrollLeft:s}=this.elementViewChild.nativeElement;if(this.both)i={rows:t(r,this._itemSize[0]),cols:t(s,this._itemSize[1])},o={rows:i.rows+this.numItemsInViewport.rows,cols:i.cols+this.numItemsInViewport.cols};else{let a=this.horizontal?s:r;i=t(a,this._itemSize),o=i+this.numItemsInViewport}}return{first:this.first,last:this.last,viewport:{first:i,last:o}}}calculateNumItems(){let t=this.getContentPosition(),i=(this.elementViewChild?.nativeElement?this.elementViewChild.nativeElement.offsetWidth-t.left:0)||0,o=(this.elementViewChild?.nativeElement?this.elementViewChild.nativeElement.offsetHeight-t.top:0)||0,r=(c,d)=>d||c?Math.ceil(c/(d||c)):0,s=c=>Math.ceil(c/2),a=this.both?{rows:r(o,this._itemSize[0]),cols:r(i,this._itemSize[1])}:r(this.horizontal?i:o,this._itemSize),l=this.d_numToleratedItems||(this.both?[s(a.rows),s(a.cols)]:s(a));return{numItemsInViewport:a,numToleratedItems:l}}calculateOptions(){let{numItemsInViewport:t,numToleratedItems:i}=this.calculateNumItems(),o=(a,l,c,d=!1)=>this.getLast(a+l+(a<c?2:3)*c,d),r=this.first,s=this.both?{rows:o(this.first.rows,t.rows,i[0]),cols:o(this.first.cols,t.cols,i[1],!0)}:o(this.first,t,i);this.last=s,this.numItemsInViewport=t,this.d_numToleratedItems=i,this.showLoader&&(this.loaderArr=this.both?Array.from({length:t.rows}).map(()=>Array.from({length:t.cols})):Array.from({length:t})),this._lazy&&Promise.resolve().then(()=>{this.lazyLoadState={first:this._step?this.both?{rows:0,cols:r.cols}:0:r,last:Math.min(this._step?this._step:this.last,this.items.length)},this.handleEvents("onLazyLoad",this.lazyLoadState)})}calculateAutoSize(){this._autoSize&&!this.d_loading&&Promise.resolve().then(()=>{if(this.contentEl){this.contentEl.style.minHeight=this.contentEl.style.minWidth="auto",this.contentEl.style.position="relative",this.elementViewChild.nativeElement.style.contain="none";let[t,i]=[At(this.contentEl),Dt(this.contentEl)];t!==this.defaultContentWidth&&(this.elementViewChild.nativeElement.style.width=""),i!==this.defaultContentHeight&&(this.elementViewChild.nativeElement.style.height="");let[o,r]=[At(this.elementViewChild.nativeElement),Dt(this.elementViewChild.nativeElement)];(this.both||this.horizontal)&&(this.elementViewChild.nativeElement.style.width=o<this.defaultWidth?o+"px":this._scrollWidth||this.defaultWidth+"px"),(this.both||this.vertical)&&(this.elementViewChild.nativeElement.style.height=r<this.defaultHeight?r+"px":this._scrollHeight||this.defaultHeight+"px"),this.contentEl.style.minHeight=this.contentEl.style.minWidth="",this.contentEl.style.position="",this.elementViewChild.nativeElement.style.contain=""}})}getLast(t=0,i=!1){return this._items?Math.min(i?(this._columns||this._items[0]).length:this._items.length,t):0}getContentPosition(){if(this.contentEl){let t=getComputedStyle(this.contentEl),i=parseFloat(t.paddingLeft)+Math.max(parseFloat(t.left)||0,0),o=parseFloat(t.paddingRight)+Math.max(parseFloat(t.right)||0,0),r=parseFloat(t.paddingTop)+Math.max(parseFloat(t.top)||0,0),s=parseFloat(t.paddingBottom)+Math.max(parseFloat(t.bottom)||0,0);return{left:i,right:o,top:r,bottom:s,x:i+o,y:r+s}}return{left:0,right:0,top:0,bottom:0,x:0,y:0}}setSize(){if(this.elementViewChild?.nativeElement){let t=this.elementViewChild.nativeElement.parentElement.parentElement,i=this._scrollWidth||`${this.elementViewChild.nativeElement.offsetWidth||t.offsetWidth}px`,o=this._scrollHeight||`${this.elementViewChild.nativeElement.offsetHeight||t.offsetHeight}px`,r=(s,a)=>this.elementViewChild.nativeElement.style[s]=a;this.both||this.horizontal?(r("height",o),r("width",i)):r("height",o)}}setSpacerSize(){if(this._items){let t=this.getContentPosition(),i=(o,r,s,a=0)=>this.spacerStyle=et(f({},this.spacerStyle),{[`${o}`]:(r||[]).length*s+a+"px"});this.both?(i("height",this._items,this._itemSize[0],t.y),i("width",this._columns||this._items[1],this._itemSize[1],t.x)):this.horizontal?i("width",this._columns||this._items,this._itemSize,t.x):i("height",this._items,this._itemSize,t.y)}}setContentPosition(t){if(this.contentEl&&!this._appendOnly){let i=t?t.first:this.first,o=(s,a)=>s*a,r=(s=0,a=0)=>this.contentStyle=et(f({},this.contentStyle),{transform:`translate3d(${s}px, ${a}px, 0)`});if(this.both)r(o(i.cols,this._itemSize[1]),o(i.rows,this._itemSize[0]));else{let s=o(i,this._itemSize);this.horizontal?r(s,0):r(0,s)}}}onScrollPositionChange(t){let i=t.target,o=this.getContentPosition(),r=(y,C)=>y?y>C?y-C:y:0,s=(y,C)=>C||y?Math.floor(y/(C||y)):0,a=(y,C,S,q,G,dt)=>y<=G?G:dt?S-q-G:C+G-1,l=(y,C,S,q,G,dt,Lt)=>y<=dt?0:Math.max(0,Lt?y<C?S:y-dt:y>C?S:y-2*dt),c=(y,C,S,q,G,dt=!1)=>{let Lt=C+q+2*G;return y>=G&&(Lt+=G+1),this.getLast(Lt,dt)},d=r(i.scrollTop,o.top),p=r(i.scrollLeft,o.left),u=this.both?{rows:0,cols:0}:0,h=this.last,m=!1,x=this.lastScrollPos;if(this.both){let y=this.lastScrollPos.top<=d,C=this.lastScrollPos.left<=p;if(!this._appendOnly||this._appendOnly&&(y||C)){let S={rows:s(d,this._itemSize[0]),cols:s(p,this._itemSize[1])},q={rows:a(S.rows,this.first.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0],y),cols:a(S.cols,this.first.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],C)};u={rows:l(S.rows,q.rows,this.first.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0],y),cols:l(S.cols,q.cols,this.first.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],C)},h={rows:c(S.rows,u.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0]),cols:c(S.cols,u.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],!0)},m=u.rows!==this.first.rows||h.rows!==this.last.rows||u.cols!==this.first.cols||h.cols!==this.last.cols||this.isRangeChanged,x={top:d,left:p}}}else{let y=this.horizontal?p:d,C=this.lastScrollPos<=y;if(!this._appendOnly||this._appendOnly&&C){let S=s(y,this._itemSize),q=a(S,this.first,this.last,this.numItemsInViewport,this.d_numToleratedItems,C);u=l(S,q,this.first,this.last,this.numItemsInViewport,this.d_numToleratedItems,C),h=c(S,u,this.last,this.numItemsInViewport,this.d_numToleratedItems),m=u!==this.first||h!==this.last||this.isRangeChanged,x=y}}return{first:u,last:h,isRangeChanged:m,scrollPos:x}}onScrollChange(t){let{first:i,last:o,isRangeChanged:r,scrollPos:s}=this.onScrollPositionChange(t);if(r){let a={first:i,last:o};if(this.setContentPosition(a),this.first=i,this.last=o,this.lastScrollPos=s,this.handleEvents("onScrollIndexChange",a),this._lazy&&this.isPageChanged(i)){let l={first:this._step?Math.min(this.getPageByFirst(i)*this._step,this.items.length-this._step):i,last:Math.min(this._step?(this.getPageByFirst(i)+1)*this._step:o,this.items.length)};(this.lazyLoadState.first!==l.first||this.lazyLoadState.last!==l.last)&&this.handleEvents("onLazyLoad",l),this.lazyLoadState=l}}}onContainerScroll(t){if(this.handleEvents("onScroll",{originalEvent:t}),this._delay&&this.isPageChanged()){if(this.scrollTimeout&&clearTimeout(this.scrollTimeout),!this.d_loading&&this.showLoader){let{isRangeChanged:i}=this.onScrollPositionChange(t);(i||this._step&&this.isPageChanged())&&(this.d_loading=!0,this.cd.detectChanges())}this.scrollTimeout=setTimeout(()=>{this.onScrollChange(t),this.d_loading&&this.showLoader&&(!this._lazy||this._loading===void 0)&&(this.d_loading=!1,this.page=this.getPageByFirst()),this.cd.detectChanges()},this._delay)}else!this.d_loading&&this.onScrollChange(t)}bindResizeListener(){bt(this.platformId)&&(this.windowResizeListener||this.zone.runOutsideAngular(()=>{let t=this.document.defaultView,i=Jt()?"orientationchange":"resize";this.windowResizeListener=this.renderer.listen(t,i,this.onWindowResize.bind(this))}))}unbindResizeListener(){this.windowResizeListener&&(this.windowResizeListener(),this.windowResizeListener=null)}onWindowResize(){this.resizeTimeout&&clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>{if(en(this.elementViewChild?.nativeElement)){let[t,i]=[At(this.elementViewChild?.nativeElement),Dt(this.elementViewChild?.nativeElement)],[o,r]=[t!==this.defaultWidth,i!==this.defaultHeight];(this.both?o||r:this.horizontal?o:this.vertical&&r)&&this.zone.run(()=>{this.d_numToleratedItems=this._numToleratedItems,this.defaultWidth=t,this.defaultHeight=i,this.defaultContentWidth=At(this.contentEl),this.defaultContentHeight=Dt(this.contentEl),this.init()})}},this._resizeDelay)}handleEvents(t,i){return this.options&&this.options[t]?this.options[t](i):this[t].emit(i)}getContentOptions(){return{contentStyleClass:`p-virtualscroller-content ${this.d_loading?"p-virtualscroller-loading":""}`,items:this.loadedItems,getItemOptions:t=>this.getOptions(t),loading:this.d_loading,getLoaderOptions:(t,i)=>this.getLoaderOptions(t,i),itemSize:this._itemSize,rows:this.loadedRows,columns:this.loadedColumns,spacerStyle:this.spacerStyle,contentStyle:this.contentStyle,vertical:this.vertical,horizontal:this.horizontal,both:this.both}}getOptions(t){let i=(this._items||[]).length,o=this.both?this.first.rows+t:this.first+t;return{index:o,count:i,first:o===0,last:o===i-1,even:o%2===0,odd:o%2!==0}}getLoaderOptions(t,i){let o=this.loaderArr.length;return f({index:t,count:o,first:t===0,last:t===o-1,even:t%2===0,odd:t%2!==0},i)}static \u0275fac=function(i){return new(i||e)(w(Nt))};static \u0275cmp=L({type:e,selectors:[["p-scroller"],["p-virtualscroller"],["p-virtual-scroller"],["p-virtualScroller"]],contentQueries:function(i,o,r){if(i&1&&(it(r,Po,4),it(r,ca,4),it(r,da,4),it(r,ua,4),it(r,me,4)),i&2){let s;K(s=Z())&&(o.contentTemplate=s.first),K(s=Z())&&(o.itemTemplate=s.first),K(s=Z())&&(o.loaderTemplate=s.first),K(s=Z())&&(o.loaderIconTemplate=s.first),K(s=Z())&&(o.templates=s)}},viewQuery:function(i,o){if(i&1&&(oe(pa,5),oe(Po,5)),i&2){let r;K(r=Z())&&(o.elementViewChild=r.first),K(r=Z())&&(o.contentViewChild=r.first)}},hostVars:2,hostBindings:function(i,o){i&2&&Qe("height",o.height)},inputs:{id:"id",style:"style",styleClass:"styleClass",tabindex:"tabindex",items:"items",itemSize:"itemSize",scrollHeight:"scrollHeight",scrollWidth:"scrollWidth",orientation:"orientation",step:"step",delay:"delay",resizeDelay:"resizeDelay",appendOnly:"appendOnly",inline:"inline",lazy:"lazy",disabled:"disabled",loaderDisabled:"loaderDisabled",columns:"columns",showSpacer:"showSpacer",showLoader:"showLoader",numToleratedItems:"numToleratedItems",loading:"loading",autoSize:"autoSize",trackBy:"trackBy",options:"options"},outputs:{onLazyLoad:"onLazyLoad",onScroll:"onScroll",onScrollIndexChange:"onScrollIndexChange"},features:[D([Bo]),_,J],ngContentSelectors:ha,decls:3,vars:2,consts:[["disabledContainer",""],["element",""],["buildInContent",""],["content",""],["buildInLoader",""],["buildInLoaderIcon",""],[4,"ngIf","ngIfElse"],[3,"scroll","ngStyle","ngClass"],["class","p-virtualscroller-spacer",3,"ngStyle",4,"ngIf"],["class","p-virtualscroller-loader",3,"ngClass",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"ngClass"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"p-virtualscroller-spacer",3,"ngStyle"],[1,"p-virtualscroller-loader",3,"ngClass"],[4,"ngFor","ngForOf"],[3,"styleClass"],[4,"ngIf"]],template:function(i,o){if(i&1&&(ot(),k(0,Fa,8,16,"ng-container",6)(1,ka,2,1,"ng-template",null,0,xe)),i&2){let r=we(2);g("ngIf",!o._disabled)("ngIfElse",r)}},dependencies:[tt,re,xn,se,le,ae,Ai,Q],encapsulation:2})}return e})(),ah=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({imports:[Pa,Q,Q]})}return e})();var Ba=({dt:e})=>`
.p-tooltip {
    position: absolute;
    display: none;
    max-width: ${e("tooltip.max.width")};
}

.p-tooltip-right,
.p-tooltip-left {
    padding: 0 ${e("tooltip.gutter")};
}

.p-tooltip-top,
.p-tooltip-bottom {
    padding: ${e("tooltip.gutter")} 0;
}

.p-tooltip-text {
    white-space: pre-line;
    word-break: break-word;
    background: ${e("tooltip.background")};
    color: ${e("tooltip.color")};
    padding: ${e("tooltip.padding")};
    box-shadow: ${e("tooltip.shadow")};
    border-radius: ${e("tooltip.border.radius")};
}

.p-tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    scale: 2;
}

.p-tooltip-right .p-tooltip-arrow {
    top: 50%;
    left: 0;
    margin-top: calc(-1 * ${e("tooltip.gutter")});
    border-width: ${e("tooltip.gutter")} ${e("tooltip.gutter")} ${e("tooltip.gutter")} 0;
    border-right-color: ${e("tooltip.background")};
}

.p-tooltip-left .p-tooltip-arrow {
    top: 50%;
    right: 0;
    margin-top: calc(-1 * ${e("tooltip.gutter")});
    border-width: ${e("tooltip.gutter")} 0 ${e("tooltip.gutter")} ${e("tooltip.gutter")};
    border-left-color: ${e("tooltip.background")};
}

.p-tooltip-top .p-tooltip-arrow {
    bottom: 0;
    left: 50%;
    margin-left: calc(-1 * ${e("tooltip.gutter")});
    border-width: ${e("tooltip.gutter")} ${e("tooltip.gutter")} 0 ${e("tooltip.gutter")};
    border-top-color: ${e("tooltip.background")};
    border-bottom-color: ${e("tooltip.background")};
}

.p-tooltip-bottom .p-tooltip-arrow {
    top: 0;
    left: 50%;
    margin-left: calc(-1 * ${e("tooltip.gutter")});
    border-width: 0 ${e("tooltip.gutter")} ${e("tooltip.gutter")} ${e("tooltip.gutter")};
    border-top-color: ${e("tooltip.background")};
    border-bottom-color: ${e("tooltip.background")};
}
`,Ha={root:"p-tooltip p-component",arrow:"p-tooltip-arrow",text:"p-tooltip-text"},zo=(()=>{class e extends F{name="tooltip";theme=Ba;classes=Ha;static \u0275fac=(()=>{let t;return function(o){return(t||(t=b(e)))(o||e)}})();static \u0275prov=I({token:e,factory:e.\u0275fac})}return e})();var Ch=(()=>{class e extends ${zone;viewContainer;tooltipPosition;tooltipEvent="hover";appendTo;positionStyle;tooltipStyleClass;tooltipZIndex;escape=!0;showDelay;hideDelay;life;positionTop;positionLeft;autoHide=!0;fitContent=!0;hideOnEscape=!0;content;get disabled(){return this._disabled}set disabled(t){this._disabled=t,this.deactivate()}tooltipOptions;_tooltipOptions={tooltipLabel:null,tooltipPosition:"right",tooltipEvent:"hover",appendTo:"body",positionStyle:null,tooltipStyleClass:null,tooltipZIndex:"auto",escape:!0,disabled:null,showDelay:null,hideDelay:null,positionTop:null,positionLeft:null,life:null,autoHide:!0,hideOnEscape:!0,id:Rt("pn_id_")+"_tooltip"};_disabled;container;styleClass;tooltipText;showTimeout;hideTimeout;active;mouseEnterListener;mouseLeaveListener;containerMouseleaveListener;clickListener;focusListener;blurListener;documentEscapeListener;scrollHandler;resizeListener;_componentStyle=v(zo);interactionInProgress=!1;constructor(t,i){super(),this.zone=t,this.viewContainer=i}ngAfterViewInit(){super.ngAfterViewInit(),bt(this.platformId)&&this.zone.runOutsideAngular(()=>{let t=this.getOption("tooltipEvent");if((t==="hover"||t==="both")&&(this.mouseEnterListener=this.onMouseEnter.bind(this),this.mouseLeaveListener=this.onMouseLeave.bind(this),this.clickListener=this.onInputClick.bind(this),this.el.nativeElement.addEventListener("mouseenter",this.mouseEnterListener),this.el.nativeElement.addEventListener("click",this.clickListener),this.el.nativeElement.addEventListener("mouseleave",this.mouseLeaveListener)),t==="focus"||t==="both"){this.focusListener=this.onFocus.bind(this),this.blurListener=this.onBlur.bind(this);let i=this.el.nativeElement.querySelector(".p-component");i||(i=this.getTarget(this.el.nativeElement)),i.addEventListener("focus",this.focusListener),i.addEventListener("blur",this.blurListener)}})}ngOnChanges(t){super.ngOnChanges(t),t.tooltipPosition&&this.setOption({tooltipPosition:t.tooltipPosition.currentValue}),t.tooltipEvent&&this.setOption({tooltipEvent:t.tooltipEvent.currentValue}),t.appendTo&&this.setOption({appendTo:t.appendTo.currentValue}),t.positionStyle&&this.setOption({positionStyle:t.positionStyle.currentValue}),t.tooltipStyleClass&&this.setOption({tooltipStyleClass:t.tooltipStyleClass.currentValue}),t.tooltipZIndex&&this.setOption({tooltipZIndex:t.tooltipZIndex.currentValue}),t.escape&&this.setOption({escape:t.escape.currentValue}),t.showDelay&&this.setOption({showDelay:t.showDelay.currentValue}),t.hideDelay&&this.setOption({hideDelay:t.hideDelay.currentValue}),t.life&&this.setOption({life:t.life.currentValue}),t.positionTop&&this.setOption({positionTop:t.positionTop.currentValue}),t.positionLeft&&this.setOption({positionLeft:t.positionLeft.currentValue}),t.disabled&&this.setOption({disabled:t.disabled.currentValue}),t.content&&(this.setOption({tooltipLabel:t.content.currentValue}),this.active&&(t.content.currentValue?this.container&&this.container.offsetParent?(this.updateText(),this.align()):this.show():this.hide())),t.autoHide&&this.setOption({autoHide:t.autoHide.currentValue}),t.id&&this.setOption({id:t.id.currentValue}),t.tooltipOptions&&(this._tooltipOptions=f(f({},this._tooltipOptions),t.tooltipOptions.currentValue),this.deactivate(),this.active&&(this.getOption("tooltipLabel")?this.container&&this.container.offsetParent?(this.updateText(),this.align()):this.show():this.hide()))}isAutoHide(){return this.getOption("autoHide")}onMouseEnter(t){!this.container&&!this.showTimeout&&this.activate()}onMouseLeave(t){this.isAutoHide()?this.deactivate():!(Xt(t.relatedTarget,"p-tooltip")||Xt(t.relatedTarget,"p-tooltip-text")||Xt(t.relatedTarget,"p-tooltip-arrow"))&&this.deactivate()}onFocus(t){this.activate()}onBlur(t){this.deactivate()}onInputClick(t){this.deactivate()}activate(){if(!this.interactionInProgress){if(this.active=!0,this.clearHideTimeout(),this.getOption("showDelay")?this.showTimeout=setTimeout(()=>{this.show()},this.getOption("showDelay")):this.show(),this.getOption("life")){let t=this.getOption("showDelay")?this.getOption("life")+this.getOption("showDelay"):this.getOption("life");this.hideTimeout=setTimeout(()=>{this.hide()},t)}this.getOption("hideOnEscape")&&(this.documentEscapeListener=this.renderer.listen("document","keydown.escape",()=>{this.deactivate(),this.documentEscapeListener()})),this.interactionInProgress=!0}}deactivate(){this.interactionInProgress=!1,this.active=!1,this.clearShowTimeout(),this.getOption("hideDelay")?(this.clearHideTimeout(),this.hideTimeout=setTimeout(()=>{this.hide()},this.getOption("hideDelay"))):this.hide(),this.documentEscapeListener&&this.documentEscapeListener()}create(){this.container&&(this.clearHideTimeout(),this.remove()),this.container=document.createElement("div"),this.container.setAttribute("id",this.getOption("id")),this.container.setAttribute("role","tooltip");let t=document.createElement("div");t.className="p-tooltip-arrow",this.container.appendChild(t),this.tooltipText=document.createElement("div"),this.tooltipText.className="p-tooltip-text",this.updateText(),this.getOption("positionStyle")&&(this.container.style.position=this.getOption("positionStyle")),this.container.appendChild(this.tooltipText),this.getOption("appendTo")==="body"?document.body.appendChild(this.container):this.getOption("appendTo")==="target"?Ji(this.container,this.el.nativeElement):Ji(this.getOption("appendTo"),this.container),this.container.style.display="none",this.fitContent&&(this.container.style.width="fit-content"),this.isAutoHide()?this.container.style.pointerEvents="none":(this.container.style.pointerEvents="unset",this.bindContainerMouseleaveListener())}bindContainerMouseleaveListener(){if(!this.containerMouseleaveListener){let t=this.container??this.container.nativeElement;this.containerMouseleaveListener=this.renderer.listen(t,"mouseleave",i=>{this.deactivate()})}}unbindContainerMouseleaveListener(){this.containerMouseleaveListener&&(this.bindContainerMouseleaveListener(),this.containerMouseleaveListener=null)}show(){if(!this.getOption("tooltipLabel")||this.getOption("disabled"))return;this.create(),this.el.nativeElement.closest("p-dialog")?setTimeout(()=>{this.container&&(this.container.style.display="inline-block"),this.container&&this.align()},100):(this.container.style.display="inline-block",this.align()),eo(this.container,250),this.getOption("tooltipZIndex")==="auto"?qt.set("tooltip",this.container,this.config.zIndex.tooltip):this.container.style.zIndex=this.getOption("tooltipZIndex"),this.bindDocumentResizeListener(),this.bindScrollListener()}hide(){this.getOption("tooltipZIndex")==="auto"&&qt.clear(this.container),this.remove()}updateText(){let t=this.getOption("tooltipLabel");if(t instanceof Ze){let i=this.viewContainer.createEmbeddedView(t);i.detectChanges(),i.rootNodes.forEach(o=>this.tooltipText.appendChild(o))}else this.getOption("escape")?(this.tooltipText.innerHTML="",this.tooltipText.appendChild(document.createTextNode(t))):this.tooltipText.innerHTML=t}align(){let t=this.getOption("tooltipPosition"),i={top:[this.alignTop,this.alignBottom,this.alignRight,this.alignLeft],bottom:[this.alignBottom,this.alignTop,this.alignRight,this.alignLeft],left:[this.alignLeft,this.alignRight,this.alignTop,this.alignBottom],right:[this.alignRight,this.alignLeft,this.alignTop,this.alignBottom]};for(let[o,r]of i[t].entries())if(o===0)r.call(this);else if(this.isOutOfBounds())r.call(this);else break}getHostOffset(){if(this.getOption("appendTo")==="body"||this.getOption("appendTo")==="target"){let t=this.el.nativeElement.getBoundingClientRect(),i=t.left+Qi(),o=t.top+Yi();return{left:i,top:o}}else return{left:0,top:0}}get activeElement(){return this.el.nativeElement.nodeName.startsWith("P-")?_t(this.el.nativeElement,".p-component"):this.el.nativeElement}alignRight(){this.preAlign("right");let t=this.activeElement,i=Ot(t),o=(Ct(t)-Ct(this.container))/2;this.alignTooltip(i,o)}alignLeft(){this.preAlign("left");let t=Ot(this.container),i=(Ct(this.el.nativeElement)-Ct(this.container))/2;this.alignTooltip(-t,i)}alignTop(){this.preAlign("top");let t=(Ot(this.el.nativeElement)-Ot(this.container))/2,i=Ct(this.container);this.alignTooltip(t,-i)}alignBottom(){this.preAlign("bottom");let t=(Ot(this.el.nativeElement)-Ot(this.container))/2,i=Ct(this.el.nativeElement);this.alignTooltip(t,i)}alignTooltip(t,i){let o=this.getHostOffset(),r=o.left+t,s=o.top+i;this.container.style.left=r+this.getOption("positionLeft")+"px",this.container.style.top=s+this.getOption("positionTop")+"px"}setOption(t){this._tooltipOptions=f(f({},this._tooltipOptions),t)}getOption(t){return this._tooltipOptions[t]}getTarget(t){return Xt(t,"p-inputwrapper")?_t(t,"input"):t}preAlign(t){this.container.style.left="-999px",this.container.style.top="-999px";let i="p-tooltip p-component p-tooltip-"+t;this.container.className=this.getOption("tooltipStyleClass")?i+" "+this.getOption("tooltipStyleClass"):i}isOutOfBounds(){let t=this.container.getBoundingClientRect(),i=t.top,o=t.left,r=Ot(this.container),s=Ct(this.container),a=Si();return o+r>a.width||o<0||i<0||i+s>a.height}onWindowResize(t){this.hide()}bindDocumentResizeListener(){this.zone.runOutsideAngular(()=>{this.resizeListener=this.onWindowResize.bind(this),window.addEventListener("resize",this.resizeListener)})}unbindDocumentResizeListener(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new ye(this.el.nativeElement,()=>{this.container&&this.hide()})),this.scrollHandler.bindScrollListener()}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}unbindEvents(){let t=this.getOption("tooltipEvent");if((t==="hover"||t==="both")&&(this.el.nativeElement.removeEventListener("mouseenter",this.mouseEnterListener),this.el.nativeElement.removeEventListener("mouseleave",this.mouseLeaveListener),this.el.nativeElement.removeEventListener("click",this.clickListener)),t==="focus"||t==="both"){let i=this.el.nativeElement.querySelector(".p-component");i||(i=this.getTarget(this.el.nativeElement)),i.removeEventListener("focus",this.focusListener),i.removeEventListener("blur",this.blurListener)}this.unbindDocumentResizeListener()}remove(){this.container&&this.container.parentElement&&(this.getOption("appendTo")==="body"?document.body.removeChild(this.container):this.getOption("appendTo")==="target"?this.el.nativeElement.removeChild(this.container):ao(this.getOption("appendTo"),this.container)),this.unbindDocumentResizeListener(),this.unbindScrollListener(),this.unbindContainerMouseleaveListener(),this.clearTimeouts(),this.container=null,this.scrollHandler=null}clearShowTimeout(){this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null)}clearHideTimeout(){this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=null)}clearTimeouts(){this.clearShowTimeout(),this.clearHideTimeout()}ngOnDestroy(){this.unbindEvents(),super.ngOnDestroy(),this.container&&qt.clear(this.container),this.remove(),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.documentEscapeListener&&this.documentEscapeListener()}static \u0275fac=function(i){return new(i||e)(w(Nt),w(vn))};static \u0275dir=A({type:e,selectors:[["","pTooltip",""]],inputs:{tooltipPosition:"tooltipPosition",tooltipEvent:"tooltipEvent",appendTo:"appendTo",positionStyle:"positionStyle",tooltipStyleClass:"tooltipStyleClass",tooltipZIndex:"tooltipZIndex",escape:[2,"escape","escape",O],showDelay:[2,"showDelay","showDelay",Bt],hideDelay:[2,"hideDelay","hideDelay",Bt],life:[2,"life","life",Bt],positionTop:[2,"positionTop","positionTop",Bt],positionLeft:[2,"positionLeft","positionLeft",Bt],autoHide:[2,"autoHide","autoHide",O],fitContent:[2,"fitContent","fitContent",O],hideOnEscape:[2,"hideOnEscape","hideOnEscape",O],content:[0,"pTooltip","content"],disabled:[0,"tooltipDisabled","disabled"],tooltipOptions:"tooltipOptions"},features:[D([zo]),_,J]})}return e})(),Sh=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=W({type:e});static \u0275inj=H({})}return e})();export{Xt as a,vt as b,fl as c,Ft as d,gl as e,Si as f,ml as g,yl as h,Ot as i,bl as j,Ji as k,vl as l,Wr as m,_t as n,tn as o,io as p,_l as q,Cl as r,Sl as s,Ct as t,wl as u,Jt as v,El as w,xl as x,Y as y,Zr as z,M as A,Ei as B,on as C,Dl as D,Al as E,Ll as F,Ml as G,Rt as H,X as I,bc as J,vc as K,_c as L,So as M,me as N,Q as O,Cc as P,Gl as Q,F as R,Dc as S,yi as T,$n as U,Tn as V,Vt as W,rl as X,sl as Y,Le as Z,Ki as _,ll as $,$r as aa,Nr as ba,Br as ca,cl as da,dl as ea,ul as fa,$ as ga,jt as ha,ye as ia,xo as ja,dd as ka,Wu as la,yt as ma,$d as na,Pd as oa,zd as pa,Gd as qa,Ai as ra,Xd as sa,np as ta,Jc as ua,td as va,ee as wa,bp as xa,qt as ya,la as za,Bp as Aa,Do as Ba,Pa as Ca,ah as Da,Ch as Ea,Sh as Fa,cn as Ga,To as Ha,Du as Ia,zs as Ja,Au as Ka};
