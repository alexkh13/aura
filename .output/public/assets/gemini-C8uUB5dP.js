var U;(function(e){e.STRING="string",e.NUMBER="number",e.INTEGER="integer",e.BOOLEAN="boolean",e.ARRAY="array",e.OBJECT="object"})(U||(U={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var P;(function(e){e.LANGUAGE_UNSPECIFIED="language_unspecified",e.PYTHON="python"})(P||(P={}));var F;(function(e){e.OUTCOME_UNSPECIFIED="outcome_unspecified",e.OUTCOME_OK="outcome_ok",e.OUTCOME_FAILED="outcome_failed",e.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(F||(F={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H=["user","model","function","system"];var k;(function(e){e.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",e.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",e.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",e.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",e.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",e.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"})(k||(k={}));var j;(function(e){e.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",e.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",e.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",e.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",e.BLOCK_NONE="BLOCK_NONE"})(j||(j={}));var B;(function(e){e.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",e.NEGLIGIBLE="NEGLIGIBLE",e.LOW="LOW",e.MEDIUM="MEDIUM",e.HIGH="HIGH"})(B||(B={}));var K;(function(e){e.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",e.SAFETY="SAFETY",e.OTHER="OTHER"})(K||(K={}));var O;(function(e){e.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",e.STOP="STOP",e.MAX_TOKENS="MAX_TOKENS",e.SAFETY="SAFETY",e.RECITATION="RECITATION",e.LANGUAGE="LANGUAGE",e.BLOCKLIST="BLOCKLIST",e.PROHIBITED_CONTENT="PROHIBITED_CONTENT",e.SPII="SPII",e.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",e.OTHER="OTHER"})(O||(O={}));var Y;(function(e){e.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",e.RETRIEVAL_QUERY="RETRIEVAL_QUERY",e.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",e.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",e.CLASSIFICATION="CLASSIFICATION",e.CLUSTERING="CLUSTERING"})(Y||(Y={}));var q;(function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.AUTO="AUTO",e.ANY="ANY",e.NONE="NONE"})(q||(q={}));var J;(function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.MODE_DYNAMIC="MODE_DYNAMIC"})(J||(J={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m extends Error{constructor(t){super(`[GoogleGenerativeAI Error]: ${t}`)}}class w extends m{constructor(t,n){super(t),this.response=n}}class te extends m{constructor(t,n,o,s){super(t),this.status=n,this.statusText=o,this.errorDetails=s}}class C extends m{}class ne extends m{}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const le="https://generativelanguage.googleapis.com",de="v1beta",ue="0.24.1",fe="genai-js";var y;(function(e){e.GENERATE_CONTENT="generateContent",e.STREAM_GENERATE_CONTENT="streamGenerateContent",e.COUNT_TOKENS="countTokens",e.EMBED_CONTENT="embedContent",e.BATCH_EMBED_CONTENTS="batchEmbedContents"})(y||(y={}));class ge{constructor(t,n,o,s,i){this.model=t,this.task=n,this.apiKey=o,this.stream=s,this.requestOptions=i}toString(){var t,n;const o=((t=this.requestOptions)===null||t===void 0?void 0:t.apiVersion)||de;let i=`${((n=this.requestOptions)===null||n===void 0?void 0:n.baseUrl)||le}/${o}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}}function he(e){const t=[];return e?.apiClient&&t.push(e.apiClient),t.push(`${fe}/${ue}`),t.join(" ")}async function pe(e){var t;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",he(e.requestOptions)),n.append("x-goog-api-key",e.apiKey);let o=(t=e.requestOptions)===null||t===void 0?void 0:t.customHeaders;if(o){if(!(o instanceof Headers))try{o=new Headers(o)}catch(s){throw new C(`unable to convert customHeaders value ${JSON.stringify(o)} to Headers: ${s.message}`)}for(const[s,i]of o.entries()){if(s==="x-goog-api-key")throw new C(`Cannot set reserved header name ${s}`);if(s==="x-goog-api-client")throw new C(`Header name ${s} can only be set using the apiClient field`);n.append(s,i)}}return n}async function me(e,t,n,o,s,i){const a=new ge(e,t,n,o,i);return{url:a.toString(),fetchOptions:Object.assign(Object.assign({},we(i)),{method:"POST",headers:await pe(a),body:s})}}async function S(e,t,n,o,s,i={},a=fetch){const{url:r,fetchOptions:u}=await me(e,t,n,o,s,i);return Ee(r,u,a)}async function Ee(e,t,n=fetch){let o;try{o=await n(e,t)}catch(s){Ce(s,e)}return o.ok||await ye(o,e),o}function Ce(e,t){let n=e;throw n.name==="AbortError"?(n=new ne(`Request aborted when fetching ${t.toString()}: ${e.message}`),n.stack=e.stack):e instanceof te||e instanceof C||(n=new m(`Error fetching from ${t.toString()}: ${e.message}`),n.stack=e.stack),n}async function ye(e,t){let n="",o;try{const s=await e.json();n=s.error.message,s.error.details&&(n+=` ${JSON.stringify(s.error.details)}`,o=s.error.details)}catch{}throw new te(`Error fetching from ${t.toString()}: [${e.status} ${e.statusText}] ${n}`,e.status,e.statusText,o)}function we(e){const t={};if(e?.signal!==void 0||e?.timeout>=0){const n=new AbortController;e?.timeout>=0&&setTimeout(()=>n.abort(),e.timeout),e?.signal&&e.signal.addEventListener("abort",()=>{n.abort()}),t.signal=n.signal}return t}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G(e){return e.text=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),N(e.candidates[0]))throw new w(`${E(e)}`,e);return _e(e)}else if(e.promptFeedback)throw new w(`Text not available. ${E(e)}`,e);return""},e.functionCall=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),N(e.candidates[0]))throw new w(`${E(e)}`,e);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),V(e)[0]}else if(e.promptFeedback)throw new w(`Function call not available. ${E(e)}`,e)},e.functionCalls=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),N(e.candidates[0]))throw new w(`${E(e)}`,e);return V(e)}else if(e.promptFeedback)throw new w(`Function call not available. ${E(e)}`,e)},e}function _e(e){var t,n,o,s;const i=[];if(!((n=(t=e.candidates)===null||t===void 0?void 0:t[0].content)===null||n===void 0)&&n.parts)for(const a of(s=(o=e.candidates)===null||o===void 0?void 0:o[0].content)===null||s===void 0?void 0:s.parts)a.text&&i.push(a.text),a.executableCode&&i.push("\n```"+a.executableCode.language+`
`+a.executableCode.code+"\n```\n"),a.codeExecutionResult&&i.push("\n```\n"+a.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}function V(e){var t,n,o,s;const i=[];if(!((n=(t=e.candidates)===null||t===void 0?void 0:t[0].content)===null||n===void 0)&&n.parts)for(const a of(s=(o=e.candidates)===null||o===void 0?void 0:o[0].content)===null||s===void 0?void 0:s.parts)a.functionCall&&i.push(a.functionCall);if(i.length>0)return i}const Ie=[O.RECITATION,O.SAFETY,O.LANGUAGE];function N(e){return!!e.finishReason&&Ie.includes(e.finishReason)}function E(e){var t,n,o;let s="";if((!e.candidates||e.candidates.length===0)&&e.promptFeedback)s+="Response was blocked",!((t=e.promptFeedback)===null||t===void 0)&&t.blockReason&&(s+=` due to ${e.promptFeedback.blockReason}`),!((n=e.promptFeedback)===null||n===void 0)&&n.blockReasonMessage&&(s+=`: ${e.promptFeedback.blockReasonMessage}`);else if(!((o=e.candidates)===null||o===void 0)&&o[0]){const i=e.candidates[0];N(i)&&(s+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(s+=`: ${i.finishMessage}`))}return s}function R(e){return this instanceof R?(this.v=e,this):new R(e)}function ve(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o=n.apply(e,t||[]),s,i=[];return s={},a("next"),a("throw"),a("return"),s[Symbol.asyncIterator]=function(){return this},s;function a(d){o[d]&&(s[d]=function(l){return new Promise(function(c,p){i.push([d,l,c,p])>1||r(d,l)})})}function r(d,l){try{u(o[d](l))}catch(c){f(i[0][3],c)}}function u(d){d.value instanceof R?Promise.resolve(d.value.v).then(g,h):f(i[0][2],d)}function g(d){r("next",d)}function h(d){r("throw",d)}function f(d,l){d(l),i.shift(),i.length&&r(i[0][0],i[0][1])}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function Oe(e){const t=e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=Se(t),[o,s]=n.tee();return{stream:Ae(o),response:Re(s)}}async function Re(e){const t=[],n=e.getReader();for(;;){const{done:o,value:s}=await n.read();if(o)return G(Ne(t));t.push(s)}}function Ae(e){return ve(this,arguments,function*(){const n=e.getReader();for(;;){const{value:o,done:s}=yield R(n.read());if(s)break;yield yield R(G(o))}})}function Se(e){const t=e.getReader();return new ReadableStream({start(o){let s="";return i();function i(){return t.read().then(({value:a,done:r})=>{if(r){if(s.trim()){o.error(new m("Failed to parse stream"));return}o.close();return}s+=a;let u=s.match(W),g;for(;u;){try{g=JSON.parse(u[1])}catch{o.error(new m(`Error parsing JSON response: "${u[1]}"`));return}o.enqueue(g),s=s.substring(u[0].length),u=s.match(W)}return i()}).catch(a=>{let r=a;throw r.stack=a.stack,r.name==="AbortError"?r=new ne("Request aborted when reading from the stream"):r=new m("Error reading from the stream"),r})}}})}function Ne(e){const t=e[e.length-1],n={promptFeedback:t?.promptFeedback};for(const o of e){if(o.candidates){let s=0;for(const i of o.candidates)if(n.candidates||(n.candidates=[]),n.candidates[s]||(n.candidates[s]={index:s}),n.candidates[s].citationMetadata=i.citationMetadata,n.candidates[s].groundingMetadata=i.groundingMetadata,n.candidates[s].finishReason=i.finishReason,n.candidates[s].finishMessage=i.finishMessage,n.candidates[s].safetyRatings=i.safetyRatings,i.content&&i.content.parts){n.candidates[s].content||(n.candidates[s].content={role:i.content.role||"user",parts:[]});const a={};for(const r of i.content.parts)r.text&&(a.text=r.text),r.functionCall&&(a.functionCall=r.functionCall),r.executableCode&&(a.executableCode=r.executableCode),r.codeExecutionResult&&(a.codeExecutionResult=r.codeExecutionResult),Object.keys(a).length===0&&(a.text=""),n.candidates[s].content.parts.push(a)}s++}o.usageMetadata&&(n.usageMetadata=o.usageMetadata)}return n}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oe(e,t,n,o){const s=await S(t,y.STREAM_GENERATE_CONTENT,e,!0,JSON.stringify(n),o);return Oe(s)}async function se(e,t,n,o){const i=await(await S(t,y.GENERATE_CONTENT,e,!1,JSON.stringify(n),o)).json();return{response:G(i)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ie(e){if(e!=null){if(typeof e=="string")return{role:"system",parts:[{text:e}]};if(e.text)return{role:"system",parts:[e]};if(e.parts)return e.role?e:{role:"system",parts:e.parts}}}function A(e){let t=[];if(typeof e=="string")t=[{text:e}];else for(const n of e)typeof n=="string"?t.push({text:n}):t.push(n);return Te(t)}function Te(e){const t={role:"user",parts:[]},n={role:"function",parts:[]};let o=!1,s=!1;for(const i of e)"functionResponse"in i?(n.parts.push(i),s=!0):(t.parts.push(i),o=!0);if(o&&s)throw new m("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!o&&!s)throw new m("No content is provided for sending chat message.");return o?t:n}function be(e,t){var n;let o={model:t?.model,generationConfig:t?.generationConfig,safetySettings:t?.safetySettings,tools:t?.tools,toolConfig:t?.toolConfig,systemInstruction:t?.systemInstruction,cachedContent:(n=t?.cachedContent)===null||n===void 0?void 0:n.name,contents:[]};const s=e.generateContentRequest!=null;if(e.contents){if(s)throw new C("CountTokensRequest must have one of contents or generateContentRequest, not both.");o.contents=e.contents}else if(s)o=Object.assign(Object.assign({},o),e.generateContentRequest);else{const i=A(e);o.contents=[i]}return{generateContentRequest:o}}function z(e){let t;return e.contents?t=e:t={contents:[A(e)]},e.systemInstruction&&(t.systemInstruction=ie(e.systemInstruction)),t}function Me(e){return typeof e=="string"||Array.isArray(e)?{content:A(e)}:e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],xe={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};function Le(e){let t=!1;for(const n of e){const{role:o,parts:s}=n;if(!t&&o!=="user")throw new m(`First content should be with role 'user', got ${o}`);if(!H.includes(o))throw new m(`Each item should include role field. Got ${o} but valid roles are: ${JSON.stringify(H)}`);if(!Array.isArray(s))throw new m("Content should have 'parts' property with an array of Parts");if(s.length===0)throw new m("Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const r of s)for(const u of X)u in r&&(i[u]+=1);const a=xe[o];for(const r of X)if(!a.includes(r)&&i[r]>0)throw new m(`Content with role '${o}' can't contain '${r}' part`);t=!0}}function Q(e){var t;if(e.candidates===void 0||e.candidates.length===0)return!1;const n=(t=e.candidates[0])===null||t===void 0?void 0:t.content;if(n===void 0||n.parts===void 0||n.parts.length===0)return!1;for(const o of n.parts)if(o===void 0||Object.keys(o).length===0||o.text!==void 0&&o.text==="")return!1;return!0}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z="SILENT_ERROR";class Ge{constructor(t,n,o,s={}){this.model=n,this.params=o,this._requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=t,o?.history&&(Le(o.history),this._history=o.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t,n={}){var o,s,i,a,r,u;await this._sendPromise;const g=A(t),h={safetySettings:(o=this.params)===null||o===void 0?void 0:o.safetySettings,generationConfig:(s=this.params)===null||s===void 0?void 0:s.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(a=this.params)===null||a===void 0?void 0:a.toolConfig,systemInstruction:(r=this.params)===null||r===void 0?void 0:r.systemInstruction,cachedContent:(u=this.params)===null||u===void 0?void 0:u.cachedContent,contents:[...this._history,g]},f=Object.assign(Object.assign({},this._requestOptions),n);let d;return this._sendPromise=this._sendPromise.then(()=>se(this._apiKey,this.model,h,f)).then(l=>{var c;if(Q(l.response)){this._history.push(g);const p=Object.assign({parts:[],role:"model"},(c=l.response.candidates)===null||c===void 0?void 0:c[0].content);this._history.push(p)}else{const p=E(l.response);p&&console.warn(`sendMessage() was unsuccessful. ${p}. Inspect response object for details.`)}d=l}).catch(l=>{throw this._sendPromise=Promise.resolve(),l}),await this._sendPromise,d}async sendMessageStream(t,n={}){var o,s,i,a,r,u;await this._sendPromise;const g=A(t),h={safetySettings:(o=this.params)===null||o===void 0?void 0:o.safetySettings,generationConfig:(s=this.params)===null||s===void 0?void 0:s.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(a=this.params)===null||a===void 0?void 0:a.toolConfig,systemInstruction:(r=this.params)===null||r===void 0?void 0:r.systemInstruction,cachedContent:(u=this.params)===null||u===void 0?void 0:u.cachedContent,contents:[...this._history,g]},f=Object.assign(Object.assign({},this._requestOptions),n),d=oe(this._apiKey,this.model,h,f);return this._sendPromise=this._sendPromise.then(()=>d).catch(l=>{throw new Error(Z)}).then(l=>l.response).then(l=>{if(Q(l)){this._history.push(g);const c=Object.assign({},l.candidates[0].content);c.role||(c.role="model"),this._history.push(c)}else{const c=E(l);c&&console.warn(`sendMessageStream() was unsuccessful. ${c}. Inspect response object for details.`)}}).catch(l=>{l.message!==Z&&console.error(l)}),d}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function De(e,t,n,o){return(await S(t,y.COUNT_TOKENS,e,!1,JSON.stringify(n),o)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $e(e,t,n,o){return(await S(t,y.EMBED_CONTENT,e,!1,JSON.stringify(n),o)).json()}async function Ue(e,t,n,o){const s=n.requests.map(a=>Object.assign(Object.assign({},a),{model:t}));return(await S(t,y.BATCH_EMBED_CONTENTS,e,!1,JSON.stringify({requests:s}),o)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(t,n,o={}){this.apiKey=t,this._requestOptions=o,n.model.includes("/")?this.model=n.model:this.model=`models/${n.model}`,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=ie(n.systemInstruction),this.cachedContent=n.cachedContent}async generateContent(t,n={}){var o;const s=z(t),i=Object.assign(Object.assign({},this._requestOptions),n);return se(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(o=this.cachedContent)===null||o===void 0?void 0:o.name},s),i)}async generateContentStream(t,n={}){var o;const s=z(t),i=Object.assign(Object.assign({},this._requestOptions),n);return oe(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(o=this.cachedContent)===null||o===void 0?void 0:o.name},s),i)}startChat(t){var n;return new Ge(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},t),this._requestOptions)}async countTokens(t,n={}){const o=be(t,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),s=Object.assign(Object.assign({},this._requestOptions),n);return De(this.apiKey,this.model,o,s)}async embedContent(t,n={}){const o=Me(t),s=Object.assign(Object.assign({},this._requestOptions),n);return $e(this.apiKey,this.model,o,s)}async batchEmbedContents(t,n={}){const o=Object.assign(Object.assign({},this._requestOptions),n);return Ue(this.apiKey,this.model,t,o)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ae{constructor(t){this.apiKey=t}getGenerativeModel(t,n){if(!t.model)throw new m("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new ee(this.apiKey,t,n)}getGenerativeModelFromCachedContent(t,n,o){if(!t.name)throw new C("Cached content must contain a `name` field.");if(!t.model)throw new C("Cached content must contain a `model` field.");const s=["model","systemInstruction"];for(const a of s)if(n?.[a]&&t[a]&&n?.[a]!==t[a]){if(a==="model"){const r=n.model.startsWith("models/")?n.model.replace("models/",""):n.model,u=t.model.startsWith("models/")?t.model.replace("models/",""):t.model;if(r===u)continue}throw new C(`Different value for "${a}" specified in modelParams (${n[a]}) and cachedContent (${t[a]})`)}const i=Object.assign(Object.assign({},n),{model:t.model,tools:t.tools,toolConfig:t.toolConfig,systemInstruction:t.systemInstruction,cachedContent:t});return new ee(this.apiKey,i,o)}}function Pe(){return typeof window>"u"?null:localStorage.getItem("google_ai_token")||null}let T=null,L=Pe();function Be(e){L=e,T=new ae(e),typeof window<"u"&&localStorage.setItem("google_ai_token",e)}function D(){if(!L)throw new Error("Google AI API key not set. Please add it in Settings → AI Settings.");return T||(T=new ae(L)),T}function Fe(e){const t=[],n=e.name?.toLowerCase()||"",o=e.category?.toLowerCase()||"";return e.pattern&&e.pattern.toLowerCase()!=="solid"&&t.push(e.pattern),e.color&&!n.includes(e.color.toLowerCase())&&t.push(e.color),e.material&&e.material.toLowerCase()!=="unknown"&&!n.includes(e.material.toLowerCase())&&t.push(e.material),e.style&&!n.includes(e.style.toLowerCase())&&t.push(e.style),t.push(e.name||o||"clothing item"),t.join(" ").trim()}async function He(e,t){return new Promise((n,o)=>{try{console.log("✂️ Cropping image with bounding box:",t);const s=new Image;s.onload=()=>{try{const i=document.createElement("canvas"),a=i.getContext("2d");if(!a)throw new Error("Failed to get canvas context");const r=Math.max(0,Math.floor(t.x*s.width)),u=Math.max(0,Math.floor(t.y*s.height)),g=Math.min(s.width-r,Math.ceil(t.width*s.width)),h=Math.min(s.height-u,Math.ceil(t.height*s.height));if(console.log(`📐 Crop dimensions: ${r},${u} ${g}x${h} from ${s.width}x${s.height}`),g<=0||h<=0)throw new Error("Invalid crop dimensions");i.width=g,i.height=h,a.drawImage(s,r,u,g,h,0,0,g,h);const f=i.toDataURL("image/jpeg",.95);console.log("✅ Image cropped successfully:",f.length,"bytes"),n(f)}catch(i){console.error("❌ Error during cropping operation:",i),o(i)}},s.onerror=()=>{const i=new Error("Failed to load image for cropping");console.error("❌",i.message),o(i)},s.src=e}catch(s){console.error("❌ Error setting up image crop:",s),o(s)}})}async function ke(e,t,n,o){try{console.log("🎨 Starting image generation for:",e);const i=D().getGenerativeModel({model:"gemini-2.5-flash-image"}),a=`Extract the clothing (${e}) from this image and present it as a clean e-commerce product photo.

Remove the model's body completely. Keep the outfit in natural 3D shape, with realistic fabric folds, seams, and textures. Display the garment centered on pure white background. High-resolution, professional lighting, suitable for online fashion catalog.

Target item: ${e}

Requirements:
- Remove background and model completely
- Preserve natural garment shape and drape
- Keep all fabric details, textures, and patterns exactly as they appear
- Center in square (1:1) format
- Pure white background
- Professional catalog-quality result`;console.log("📤 Sending image generation request with 1:1 aspect ratio...");const r={contents:[{role:"user",parts:[{inlineData:{data:t.split(",")[1],mimeType:"image/jpeg"}},{text:a}]}],generationConfig:{temperature:0,topK:1,topP:1,responseModalities:["Image"],imageConfig:{aspectRatio:"1:1"}}};console.log("📐 Request config:",JSON.stringify(r.generationConfig,null,2));const g=await(await i.generateContent(r)).response;console.log("📥 Response received:",g);const h=g.candidates?.[0]?.content?.parts||[];console.log("🔍 Response parts:",h.length,"parts");for(const f of h)if(console.log("Part type:",f),f.inlineData){console.log("✅ Generated image found!");const d=`data:${f.inlineData.mimeType};base64,${f.inlineData.data}`;return console.log("📸 Generated image size:",d.length,"bytes"),await new Promise((l,c)=>{const p=new Image;p.onload=()=>{const _=p.width/p.height,I=Math.abs(_-1)<.1;console.log("📐 Image dimensions:",p.width,"x",p.height,`(${I?"✅ Square!":"⚠️ Not square"})`),I||console.warn("⚠️ Generated image is not square - aspect ratio:",_.toFixed(2)),p.width<512||p.height<512?console.warn("⚠️ Generated image resolution too low:",p.width,"x",p.height):console.log("✅ Image quality validated"),l()},p.onerror=()=>{console.error("❌ Failed to load generated image for validation"),c(new Error("Image validation failed"))},p.src=d}),d}return console.warn("⚠️ No image in response, using original"),t}catch(s){return console.error("❌ Image generation failed, using original:",s),s instanceof Error&&(console.error("Error message:",s.message),console.error("Error stack:",s.stack)),t}}async function Ke(e,t){try{t?.("Initializing Gemini AI...",5);const o=D().getGenerativeModel({model:"gemini-2.0-flash",generationConfig:{temperature:.4,topK:32,topP:1,maxOutputTokens:2048}});t?.("Converting image...",15);const s=await re(e);t?.("Analyzing photo for garments...",30);const a=await o.generateContent([{inlineData:{data:s.split(",")[1],mimeType:e.type}},`You are a fashion expert analyzing this photo. Identify ALL separate clothing items visible in the image.

For EACH distinct garment, provide detailed metadata.

IMPORTANT:
- If this is a photo of a person wearing clothes, identify each visible garment separately (shirt, pants, jacket, etc.)
- If this is a flat-lay or product photo showing multiple items, analyze each one
- If only ONE item is visible, return an array with just that one item
- Do NOT combine multiple garments into one entry

Respond with a JSON array where each object represents ONE garment:

[
  {
    "name": "Item type only without redundant descriptors (e.g., 'Denim Jacket', 'Cotton T-Shirt', 'Wool Sweater')",
    "category": "Top|Bottom|Dress|Outerwear|Shoes|Accessories|Activewear|Other",
    "color": "Primary color name",
    "secondaryColors": ["Additional colors if present"],
    "style": "casual|formal|sporty|elegant|business|bohemian|vintage|etc",
    "occasion": "everyday|work|party|gym|formal event|date|etc",
    "season": "summer|winter|spring|fall|all-season",
    "tags": "#tag1 #tag2 #tag3",
    "notes": "Brief description focusing on unique features, fit, or distinctive details",
    "material": "Specific fabric type (e.g., 'denim', 'cotton', 'wool', 'polyester', 'leather') or 'unknown'",
    "pattern": "solid|striped|floral|checkered|polka dot|geometric|abstract|etc",
    "confidence": 0.95,
    "boundingBox": {
      "x": 0.1,
      "y": 0.2,
      "width": 0.6,
      "height": 0.7
    }
  }
]

Guidelines:
- Keep "name" simple and focused on the garment type (avoid including color/material/style in the name)
- Be specific with material identification when visible
- Choose precise style and occasion descriptors
- Include relevant fashion tags that would help with search and organization
- IMPORTANT: Provide accurate bounding box coordinates for each garment
  - x, y: normalized coordinates (0.0-1.0) of the top-left corner
  - width, height: normalized dimensions (0.0-1.0) of the bounding box
  - Include some padding around the garment (about 10-15% extra space)
  - Ensure the bounding box captures the entire garment

Return ONLY the JSON array, no additional text.`]);t?.("Processing response...",50);const g=(await a.response).text().match(/\[[\s\S]*\]/);if(!g)throw new Error("Invalid response format from Gemini");const h=JSON.parse(g[0]),f=await je(e);t?.("Generating product images...",60);const d=[];for(let l=0;l<h.length;l++){const c=h[l],p=Fe(c),_=60+Math.floor(l/h.length*35);t?.(`Generating image ${l+1}/${h.length}...`,_);const I=!0;let b=f;if(I&&c.boundingBox)try{console.log(`🎯 Cropping garment ${l+1}: ${c.name}`),console.log("📦 Bounding box:",c.boundingBox),b=await He(f,c.boundingBox),console.log("✅ Using cropped image for focused extraction")}catch(x){console.warn(`⚠️ Failed to crop image for "${c.name}", using original:`,x),b=f}else console.log(`ℹ️ ${I?"No bounding box":"Cropping disabled"} for "${c.name}", using full image`);let $=f,v=0;const M=2;for(;v<M;)try{$=await ke(p,b,c,t);break}catch(x){v++,console.warn(`🔄 Image generation attempt ${v} failed for "${c.name}":`,x),v>=M?(console.error("❌ All generation attempts failed, using original image"),t?.(`⚠️ Using original image for ${c.name}`,_)):(console.log(`🔄 Retrying... (attempt ${v+1}/${M})`),await new Promise(ce=>setTimeout(ce,1e3)))}d.push({name:c.name||`Clothing Item ${l+1}`,category:c.category||"Other",color:c.color||"Unknown",tags:c.tags||"",notes:c.notes||"",confidence:c.confidence||.9,imageData:$,metadata:{style:c.style,occasion:c.occasion,season:c.season,material:c.material,pattern:c.pattern,secondaryColors:c.secondaryColors}})}return t?.("Complete!",100),d}catch(n){throw console.error("Multi-garment extraction failed:",n),n instanceof Error&&n.message.includes("API key")?new Error("Please add your Google AI API key in Settings → AI Settings"):n}}async function Ye(e,t,n){try{const s=D().getGenerativeModel({model:"gemini-2.0-flash",generationConfig:{temperature:.7,topK:40,topP:.95,maxOutputTokens:512}}),a=`You are a professional fashion stylist. I have the following wardrobe items:

${e.map((d,l)=>`${l+1}. ${d} (${n[l]}, ${t[l]})`).join(`
`)}

Create an outfit using these items and provide:
1. A creative, catchy name for this outfit
2. The best season for this outfit
3. The occasion this outfit is suitable for
4. Weather conditions this outfit works in
5. Relevant hashtags/tags
6. A brief styling note or description

Respond ONLY with valid JSON in this exact format:
{
  "name": "Outfit name (e.g., 'Casual Weekend Look', 'Business Chic', 'Summer Breeze')",
  "season": "Season (Spring/Summer, Fall, Winter, All Season)",
  "occasion": "Occasion (e.g., 'Casual', 'Work', 'Date Night', 'Party')",
  "weather": "Weather (e.g., 'Warm', 'Cool', 'Mild', 'Cold', 'Any')",
  "tags": "Hashtags (e.g., '#casual #comfortable #weekend')",
  "notes": "Styling tip or brief description (1-2 sentences)"
}

Be creative but practical. Consider the color combinations and item types when suggesting the outfit details.`,h=(await(await s.generateContent(a)).response).text().match(/\{[\s\S]*\}/);if(!h)return console.error("Invalid response format from Gemini"),null;const f=JSON.parse(h[0]);return{name:f.name||"My Outfit",season:f.season||"All Season",occasion:f.occasion,weather:f.weather,tags:f.tags,notes:f.notes}}catch(o){return console.error("Outfit suggestion generation failed:",o),null}}function re(e){return new Promise((t,n)=>{const o=new FileReader;o.onloadend=()=>t(o.result),o.onerror=n,o.readAsDataURL(e)})}function je(e){return re(e)}export{Ke as extractMultipleGarments,Ye as generateOutfitSuggestion,Be as setGoogleAIToken};
