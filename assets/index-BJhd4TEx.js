(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const G=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),P=__DEFINES__;Object.keys(P).forEach(e=>{const t=e.split(".");let n=G;for(let r=0;r<t.length;r++){const o=t[r];r===t.length-1?n[o]=P[e]:n=n[o]||(n[o]={})}});function g(e){"@babel/helpers - typeof";return g=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},g(e)}function Y(e,t){if(g(e)!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(g(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Z(e){var t=Y(e,"string");return g(t)=="symbol"?t:t+""}function u(e,t,n){return(t=Z(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var X=class{constructor(e,t,n){this.logger=e,this.transport=t,this.importUpdatedModule=n,u(this,"hotModulesMap",new Map),u(this,"disposeMap",new Map),u(this,"pruneMap",new Map),u(this,"dataMap",new Map),u(this,"customListenersMap",new Map),u(this,"ctxToListenersMap",new Map),u(this,"currentFirstInvalidatedBy",void 0),u(this,"updateQueue",[]),u(this,"pendingUpdateQueue",!1)}async notifyListeners(e,t){const n=this.customListenersMap.get(e);n&&await Promise.allSettled(n.map(r=>r(t)))}send(e){this.transport.send(e).catch(t=>{this.logger.error(t)})}clear(){this.hotModulesMap.clear(),this.disposeMap.clear(),this.pruneMap.clear(),this.dataMap.clear(),this.customListenersMap.clear(),this.ctxToListenersMap.clear()}async prunePaths(e){await Promise.all(e.map(t=>{const n=this.disposeMap.get(t);if(n)return n(this.dataMap.get(t))})),await Promise.all(e.map(t=>{const n=this.pruneMap.get(t);if(n)return n(this.dataMap.get(t))}))}warnFailedUpdate(e,t){(!(e instanceof Error)||!e.message.includes("fetch"))&&this.logger.error(e),this.logger.error(`Failed to reload ${t}. This could be due to syntax errors or importing non-existent modules. (see errors above)`)}async queueUpdate(e){if(this.updateQueue.push(this.fetchUpdate(e)),!this.pendingUpdateQueue){this.pendingUpdateQueue=!0,await Promise.resolve(),this.pendingUpdateQueue=!1;const t=[...this.updateQueue];this.updateQueue=[],(await Promise.all(t)).forEach(n=>n&&n())}}async fetchUpdate(e){const{path:t,acceptedPath:n,firstInvalidatedBy:r}=e,o=this.hotModulesMap.get(t);if(!o)return;let s;const i=t===n,a=o.callbacks.filter(({deps:c})=>c.includes(n));if(i||a.length>0){const c=this.disposeMap.get(n);c&&await c(this.dataMap.get(n));try{s=await this.importUpdatedModule(e)}catch(l){this.warnFailedUpdate(l,n)}}return()=>{try{this.currentFirstInvalidatedBy=r;for(const{deps:l,fn:p}of a)p(l.map(h=>h===n?s:void 0));const c=i?t:`${n} via ${t}`;this.logger.debug(`hot updated: ${c}`)}finally{this.currentFirstInvalidatedBy=void 0}}}};let ee="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict",te=(e=21)=>{let t="",n=e|0;for(;n--;)t+=ee[Math.random()*64|0];return t};typeof process<"u"&&process.platform;function ne(){let e,t;return{promise:new Promise((n,r)=>{e=n,t=r}),resolve:e,reject:t}}function R(e){const t=new Error(e.message||"Unknown invoke error");return Object.assign(t,e,{runnerError:new Error("RunnerError")}),t}const oe=e=>{if(e.invoke)return{...e,async invoke(n,r){const o=await e.invoke({type:"custom",event:"vite:invoke",data:{id:"send",name:n,data:r}});if("error"in o)throw R(o.error);return o.result}};if(!e.send||!e.connect)throw new Error("transport must implement send and connect when invoke is not implemented");const t=new Map;return{...e,connect({onMessage:n,onDisconnection:r}){return e.connect({onMessage(o){if(o.type==="custom"&&o.event==="vite:invoke"){const s=o.data;if(s.id.startsWith("response:")){const i=s.id.slice(9),a=t.get(i);if(!a)return;a.timeoutId&&clearTimeout(a.timeoutId),t.delete(i);const{error:c,result:l}=s.data;c?a.reject(c):a.resolve(l);return}}n(o)},onDisconnection:r})},disconnect(){return t.forEach(n=>{n.reject(new Error(`transport was disconnected, cannot call ${JSON.stringify(n.name)}`))}),t.clear(),e.disconnect?.()},send(n){return e.send(n)},async invoke(n,r){const o=te(),s={type:"custom",event:"vite:invoke",data:{name:n,id:`send:${o}`,data:r}},i=e.send(s),{promise:a,resolve:c,reject:l}=ne(),p=e.timeout??6e4;let h;p>0&&(h=setTimeout(()=>{t.delete(o),l(new Error(`transport invoke timed out after ${p}ms (data: ${JSON.stringify(s)})`))},p),h?.unref?.()),t.set(o,{resolve:c,reject:l,name:n,timeoutId:h}),i&&i.catch(b=>{clearTimeout(h),t.delete(o),l(b)});try{return await a}catch(b){throw R(b)}}}},re=e=>{const t=oe(e);let n=!t.connect,r;return{...e,...t.connect?{async connect(o){if(n)return;if(r){await r;return}const s=t.connect({onMessage:o??(()=>{}),onDisconnection(){n=!1}});s&&(r=s,await r,r=void 0),n=!0}}:{},...t.disconnect?{async disconnect(){n&&(r&&await r,n=!1,await t.disconnect())}}:{},async send(o){if(t.send){if(!n)if(r)await r;else throw new Error("send was called before connect");await t.send(o)}},async invoke(o,s){if(!n)if(r)await r;else throw new Error("invoke was called before connect");return t.invoke(o,s)}}},T=e=>{const t=e.pingInterval??3e4;let n,r;return{async connect({onMessage:o,onDisconnection:s}){const i=e.createConnection();i.addEventListener("message",async({data:c})=>{o(JSON.parse(c))});let a=i.readyState===i.OPEN;a||await new Promise((c,l)=>{i.addEventListener("open",()=>{a=!0,c()},{once:!0}),i.addEventListener("close",async()=>{if(!a){l(new Error("WebSocket closed without opened."));return}o({type:"custom",event:"vite:ws:disconnect",data:{webSocket:i}}),s()})}),o({type:"custom",event:"vite:ws:connect",data:{webSocket:i}}),n=i,r=setInterval(()=>{i.readyState===i.OPEN&&i.send(JSON.stringify({type:"ping"}))},t)},disconnect(){clearInterval(r),n?.close()},send(o){n.send(JSON.stringify(o))}}};function se(e){const t=new ie;return n=>t.enqueue(()=>e(n))}var ie=class{constructor(){u(this,"queue",[]),u(this,"pending",!1)}enqueue(e){return new Promise((t,n)=>{this.queue.push({promise:e,resolve:t,reject:n}),this.dequeue()})}dequeue(){if(this.pending)return!1;const e=this.queue.shift();return e?(this.pending=!0,e.promise().then(e.resolve).catch(e.reject).finally(()=>{this.pending=!1,this.dequeue()}),!0):!1}};const ae=__HMR_CONFIG_NAME__,ce=__BASE__||"/",le="document"in globalThis?document.querySelector("meta[property=csp-nonce]")?.nonce:void 0;function d(e,t={},...n){const r=document.createElement(e);for(const[o,s]of Object.entries(t))s!==void 0&&r.setAttribute(o,s);return r.append(...n),r}const de=`
:host {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  --monospace: 'SFMono-Regular', Consolas,
  'Liberation Mono', Menlo, Courier, monospace;
  --red: #ff5555;
  --yellow: #e2aa53;
  --purple: #cfa4ff;
  --cyan: #2dd9da;
  --dim: #c9c9c9;

  --window-background: #181818;
  --window-color: #d8d8d8;
}

.backdrop {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
}

.window {
  font-family: var(--monospace);
  line-height: 1.5;
  max-width: 80vw;
  color: var(--window-color);
  box-sizing: border-box;
  margin: 30px auto;
  padding: 2.5vh 4vw;
  position: relative;
  background: var(--window-background);
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
  direction: ltr;
  text-align: left;
}

pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}

pre::-webkit-scrollbar {
  display: none;
}

pre.frame::-webkit-scrollbar {
  display: block;
  height: 5px;
}

pre.frame::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 5px;
}

pre.frame {
  scrollbar-width: thin;
}

.message {
  line-height: 1.3;
  font-weight: 600;
  white-space: pre-wrap;
}

.message-body {
  color: var(--red);
}

.plugin {
  color: var(--purple);
}

.file {
  color: var(--cyan);
  margin-bottom: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.frame {
  color: var(--yellow);
}

.stack {
  font-size: 13px;
  color: var(--dim);
}

.tip {
  font-size: 13px;
  color: #999;
  border-top: 1px dotted #999;
  padding-top: 13px;
  line-height: 1.8;
}

code {
  font-size: 13px;
  font-family: var(--monospace);
  color: var(--yellow);
}

.file-link {
  text-decoration: underline;
  cursor: pointer;
}

kbd {
  line-height: 1.5;
  font-family: ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: rgb(38, 40, 44);
  color: rgb(166, 167, 171);
  padding: 0.15rem 0.3rem;
  border-radius: 0.25rem;
  border-width: 0.0625rem 0.0625rem 0.1875rem;
  border-style: solid;
  border-color: rgb(54, 57, 64);
  border-image: initial;
}
`,ue=()=>d("div",{class:"backdrop",part:"backdrop"},d("div",{class:"window",part:"window"},d("pre",{class:"message",part:"message"},d("span",{class:"plugin",part:"plugin"}),d("span",{class:"message-body",part:"message-body"})),d("pre",{class:"file",part:"file"}),d("pre",{class:"frame",part:"frame"}),d("pre",{class:"stack",part:"stack"}),d("div",{class:"tip",part:"tip"},"Click outside, press ",d("kbd",{},"Esc")," key, or fix the code to dismiss.",d("br"),"You can also disable this overlay by setting ",d("code",{part:"config-option-name"},"server.hmr.overlay")," to ",d("code",{part:"config-option-value"},"false")," in ",d("code",{part:"config-file-name"},ae),".")),d("style",{nonce:le},de)),C=/(?:file:\/\/)?(?:[a-zA-Z]:\\|\/).*?:\d+:\d+/g,k=/^(?:>?\s*\d+\s+\|.*|\s+\|\s*\^.*)\r?\n/gm,{HTMLElement:pe=class{}}=globalThis;var fe=class extends pe{constructor(e,t=!0){super(),u(this,"root",void 0),u(this,"closeOnEsc",void 0),this.root=this.attachShadow({mode:"open"}),this.root.appendChild(ue()),k.lastIndex=0;const n=e.frame&&k.test(e.frame),r=n?e.message.replace(k,""):e.message;e.plugin&&this.text(".plugin",`[plugin:${e.plugin}] `),this.text(".message-body",r.trim());const[o]=(e.loc?.file||e.id||"unknown file").split("?");e.loc?this.text(".file",`${o}:${e.loc.line}:${e.loc.column}`,t):e.id&&this.text(".file",o),n&&this.text(".frame",e.frame.trim()),this.text(".stack",e.stack,t),this.root.querySelector(".window").addEventListener("click",s=>{s.stopPropagation()}),this.addEventListener("click",()=>{this.close()}),this.closeOnEsc=s=>{(s.key==="Escape"||s.code==="Escape")&&this.close()},document.addEventListener("keydown",this.closeOnEsc)}text(e,t,n=!1){const r=this.root.querySelector(e);if(!n)r.textContent=t;else{let o=0,s;for(C.lastIndex=0;s=C.exec(t);){const{0:i,index:a}=s,c=t.slice(o,a);r.appendChild(document.createTextNode(c));const l=document.createElement("a");l.textContent=i,l.className="file-link",l.onclick=()=>{fetch(new URL(`${ce}__open-in-editor?file=${encodeURIComponent(i)}`,import.meta.url))},r.appendChild(l),o+=c.length+i.length}o<t.length&&r.appendChild(document.createTextNode(t.slice(o)))}}close(){this.parentNode?.removeChild(this),document.removeEventListener("keydown",this.closeOnEsc)}};const y="vite-error-overlay",{customElements:E}=globalThis;E&&!E.get(y)&&E.define(y,fe);console.debug("[vite] connecting...");const M=new URL(import.meta.url),me=__SERVER_HOST__,I=__HMR_PROTOCOL__||(M.protocol==="https:"?"wss":"ws"),z=__HMR_PORT__,O=`${__HMR_HOSTNAME__||M.hostname}:${z||M.port}${__HMR_BASE__}`,U=__HMR_DIRECT_TARGET__,S=__BASE__||"/",A=__HMR_TIMEOUT__,$=__WS_TOKEN__,D=re((()=>{let e=T({createConnection:()=>new WebSocket(`${I}://${O}?token=${$}`,"vite-hmr"),pingInterval:A});return{async connect(t){try{await e.connect(t)}catch(n){if(!z){e=T({createConnection:()=>new WebSocket(`${I}://${U}?token=${$}`,"vite-hmr"),pingInterval:A});try{await e.connect(t),console.info("[vite] Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-hmr to remove the previous connection error.")}catch(r){if(r instanceof Error&&r.message.includes("WebSocket closed without opened.")){const o=new URL(import.meta.url),s=o.host+o.pathname.replace(/@vite\/client$/,"");console.error(`[vite] failed to connect to websocket.
your current setup:
  (browser) ${s} <--[HTTP]--> ${me} (server)
  (browser) ${O} <--[WebSocket (failing)]--> ${U} (server)
Check out your Vite / network configuration and https://vite.dev/config/server-options.html#server-hmr .`)}}return}throw console.error(`[vite] failed to connect to websocket (${n}). `),n}},async disconnect(){await e.disconnect()},send(t){e.send(t)}}})());let Q=!1;typeof window<"u"&&window.addEventListener?.("beforeunload",()=>{Q=!0});function N(e){const t=new URL(e,"http://vite.dev");return t.searchParams.delete("direct"),t.pathname+t.search}let B=!0;const q=new WeakSet,he=e=>{let t;return()=>{t&&(clearTimeout(t),t=null),t=setTimeout(()=>{location.reload()},e)}},_=he(20),f=new X({error:e=>console.error("[vite]",e),debug:(...e)=>console.debug("[vite]",...e)},D,async function({acceptedPath:t,timestamp:n,explicitImportRequired:r,isWithinCircularImport:o}){const[s,i]=t.split("?"),a=import(S+s.slice(1)+`?${r?"import&":""}t=${n}${i?`&${i}`:""}`);return o&&a.catch(()=>{console.info(`[hmr] ${t} failed to apply HMR as it's within a circular import. Reloading page to reset the execution order. To debug and break the circular import, you can run \`vite --debug hmr\` to log the circular dependency path if a file change triggered it.`),_()}),await a});D.connect(se(ge));async function ge(e){switch(e.type){case"connected":console.debug("[vite] connected.");break;case"update":if(await f.notifyListeners("vite:beforeUpdate",e),w)if(B&&we()){location.reload();return}else H&&J(),B=!1;await Promise.all(e.updates.map(async t=>{if(t.type==="js-update")return f.queueUpdate(t);const{path:n,timestamp:r}=t,o=N(n),s=Array.from(document.querySelectorAll("link")).find(a=>!q.has(a)&&N(a.href).includes(o));if(!s)return;const i=`${S}${o.slice(1)}${o.includes("?")?"&":"?"}t=${r}`;return new Promise(a=>{const c=s.cloneNode();c.href=new URL(i,s.href).href;const l=()=>{s.remove(),console.debug(`[vite] css hot updated: ${o}`),a()};c.addEventListener("load",l),c.addEventListener("error",l),q.add(s),s.after(c)})})),await f.notifyListeners("vite:afterUpdate",e);break;case"custom":if(await f.notifyListeners(e.event,e.data),e.event==="vite:ws:disconnect"&&w&&!Q){console.log("[vite] server connection lost. Polling for restart...");const t=e.data.webSocket,n=new URL(t.url);n.search="",await ve(n.href),location.reload()}break;case"full-reload":if(await f.notifyListeners("vite:beforeFullReload",e),w)if(e.path&&e.path.endsWith(".html")){const t=decodeURI(location.pathname),n=S+e.path.slice(1);(t===n||e.path==="/index.html"||t.endsWith("/")&&t+"index.html"===n)&&_();return}else _();break;case"prune":await f.notifyListeners("vite:beforePrune",e),await f.prunePaths(e.paths);break;case"error":if(await f.notifyListeners("vite:error",e),w){const t=e.err;H?ye(t):console.error(`[vite] Internal Server Error
${t.message}
${t.stack}`)}break;case"ping":break;default:return e}}const H=__HMR_ENABLE_OVERLAY__,w="document"in globalThis;function ye(e){J();const{customElements:t}=globalThis;if(t){const n=t.get(y);document.body.appendChild(new n(e))}}function J(){document.querySelectorAll(y).forEach(e=>e.close())}function we(){return document.querySelectorAll(y).length}function ve(e){if(typeof SharedWorker>"u"){const o={currentState:document.visibilityState,listeners:new Set},s=()=>{o.currentState=document.visibilityState;for(const i of o.listeners)i(o.currentState)};return document.addEventListener("visibilitychange",s),L(e,o)}const t=new Blob(['"use strict";',`const waitForSuccessfulPingInternal = ${L.toString()};`,`const fn = ${be.toString()};`,`fn(${JSON.stringify(e)})`],{type:"application/javascript"}),n=URL.createObjectURL(t),r=new SharedWorker(n);return new Promise((o,s)=>{const i=()=>{r.port.postMessage({visibility:document.visibilityState})};document.addEventListener("visibilitychange",i),r.port.addEventListener("message",a=>{document.removeEventListener("visibilitychange",i),r.port.close();const c=a.data;if(c.type==="error"){s(c.error);return}o()}),i(),r.port.start()})}function be(e){self.addEventListener("connect",t=>{const n=t.ports[0];if(!e){n.postMessage({type:"error",error:new Error("socketUrl not found")});return}const r={currentState:"visible",listeners:new Set};n.addEventListener("message",o=>{const{visibility:s}=o.data;r.currentState=s,console.debug("[vite] new window visibility",s);for(const i of r.listeners)i(s)}),n.start(),console.debug("[vite] connected from window"),L(e,r).then(()=>{console.debug("[vite] ping successful");try{n.postMessage({type:"success"})}catch(o){n.postMessage({type:"error",error:o})}},o=>{console.debug("[vite] error happened",o);try{n.postMessage({type:"error",error:o})}catch(s){n.postMessage({type:"error",error:s})}})})}async function L(e,t,n=1e3){function r(i){return new Promise(a=>setTimeout(a,i))}async function o(){try{const i=new WebSocket(e,"vite-ping");return new Promise(a=>{function c(){a(!0),p()}function l(){a(!1),p()}function p(){i.removeEventListener("open",c),i.removeEventListener("error",l),i.close()}i.addEventListener("open",c),i.addEventListener("error",l)})}catch{return!1}}function s(i){return new Promise(a=>{const c=l=>{l==="visible"&&(a(),i.listeners.delete(c))};i.listeners.add(c)})}if(!await o())for(await r(n);;)if(t.currentState==="visible"){if(await o())break;await r(n)}else await s(t)}const ke=new Map,Ee=new Map;"document"in globalThis&&(document.querySelectorAll("style[data-vite-dev-id]").forEach(e=>{ke.set(e.getAttribute("data-vite-dev-id"),e)}),document.querySelectorAll('link[rel="stylesheet"][data-vite-dev-id]').forEach(e=>{Ee.set(e.getAttribute("data-vite-dev-id"),e)}));const W=[{name:"Москва",tags:"Moscow,city,street,Russia"},{name:"Париж",tags:"Paris,city,street,France"},{name:"Лондон",tags:"London,city,street,England"},{name:"Берлин",tags:"Berlin,city,street,Germany"},{name:"Рим",tags:"Rome,city,street,Italy"},{name:"Мадрид",tags:"Madrid,city,street,Spain"},{name:"Амстердам",tags:"Amsterdam,city,street,canal,Netherlands"},{name:"Вена",tags:"Vienna,city,street,Austria"},{name:"Прага",tags:"Prague,city,street,Czech Republic"},{name:"Афины",tags:"Athens,city,street,Greece"},{name:"Будапешт",tags:"Budapest,city,street,Hungary"},{name:"Копенгаген",tags:"Copenhagen,city,street,Denmark"},{name:"Стокгольм",tags:"Stockholm,city,street,Sweden"},{name:"Хельсинки",tags:"Helsinki,city,street,Finland"},{name:"Варшава",tags:"Warsaw,city,street,Poland"},{name:"Брюссель",tags:"Brussels,city,street,Belgium"},{name:"Вашингтон",tags:"Washington DC,city,street,USA"},{name:"Мехико",tags:"Mexico City,city,street,Mexico"},{name:"Буэнос-Айрес",tags:"Buenos Aires,city,street,Argentina"},{name:"Бразилиа",tags:"Brasilia,city,street,Brazil"},{name:"Токио",tags:"Tokyo,city,street,Japan"},{name:"Пекин",tags:"Beijing,city,street,China"},{name:"Сеул",tags:"Seoul,city,street,South Korea"},{name:"Бангкок",tags:"Bangkok,city,street,Thailand"},{name:"Дели",tags:"New Delhi,city,street,India"},{name:"Сингапур",tags:"Singapore,city,street"},{name:"Куала-Лумпур",tags:"Kuala Lumpur,city,street,Malaysia"},{name:"Джакарта",tags:"Jakarta,city,street,Indonesia"},{name:"Каир",tags:"Cairo,city,street,Egypt"},{name:"Сидней",tags:"Sydney,city,street,Australia"}];let F=0,m=null,V=[],x=!1;function Me(e){const t=Math.floor(Math.random()*e.length);return e[t]}function j(e){for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}async function v(e){const t="https://loremflickr.com/400/300/"+encodeURIComponent(e)+"?lock="+Math.floor(Math.random()*1e6),r=await(await fetch(t)).blob();return URL.createObjectURL(r)}async function Se(e){const t=document.querySelectorAll(".city-photo"),n=await Promise.all([v(e),v(e),v(e),v(e)]);t.forEach((r,o)=>{r.src=n[o],r.alt="Фото города",r.style.outline=""})}function _e(){const e=document.getElementById("answers");e.innerHTML="",V.forEach(t=>{const n=document.createElement("button");n.textContent=t,n.addEventListener("click",()=>{x||(x=!0,Le(t,n))}),e.appendChild(n)})}function Le(e,t){const n=document.getElementById("result"),r=Array.from(document.querySelectorAll("#answers button"));if(e===m.name)n.textContent="Правильно! Это "+m.name,n.style.color="green",F+=1,document.getElementById("score").textContent=F,t.style.background="#c8f7c5",t.style.color="#000",t.style.fontWeight="bold";else{n.textContent="Неверно. Это была: "+m.name,n.style.color="red",t.style.background="#f7c5c5",t.style.color="#000";const o=r.find(s=>s.textContent===m.name);o&&(o.style.background="#c8f7c5",o.style.color="#000",o.style.textDecoration="underline",o.style.fontWeight="bold")}}async function K(){x=!1;const e=document.getElementById("result");e.textContent="",e.style.color="#1c355e",m=Me(W);const t=W.filter(r=>r.name!==m.name),n=j(t).slice(0,3).map(r=>r.name);V=j([m.name,...n]),_e(),await Se(m.tags)}document.getElementById("next").addEventListener("click",()=>{K()});K();
