exports.id=857,exports.ids=[857],exports.modules={4290:module=>{const envExpr=/(?<!\\)(\\*)\$\{([^${}]+)\}/g;module.exports=(f,env)=>f.replace(envExpr,((orig,esc,name)=>{const val=void 0!==env[name]?env[name]:`\${${name}}`;return esc.length%2?orig.slice((esc.length+1)/2):esc.slice(esc.length/2)+val}))},1339:module=>{"use strict";class ErrInvalidAuth extends Error{constructor(problems){let message="Invalid auth configuration found: ";message+=problems.map((problem=>"delete"===problem.action?`\`${problem.key}\` is not allowed in ${problem.where} config`:"rename"===problem.action?`\`${problem.from}\` must be renamed to \`${problem.to}\` in ${problem.where} config`:void 0)).join(", "),message+="\nPlease run `npm config fix` to repair your configuration.`",super(message),this.code="ERR_INVALID_AUTH",this.problems=problems}}module.exports={ErrInvalidAuth}},9857:(module,__unused_webpack_exports,__webpack_require__)=>{const walkUp=__webpack_require__(4743),ini=__webpack_require__(8519),nopt=__webpack_require__(6677),mapWorkspaces=__webpack_require__(2678),rpj=__webpack_require__(4059),log=__webpack_require__(9540),{resolve,dirname,join}=__webpack_require__(1017),{homedir}=__webpack_require__(2037),{readFile,writeFile,chmod,unlink,stat,mkdir}=__webpack_require__(3292),fileExists=(...p)=>stat(resolve(...p)).then((st=>st.isFile())).catch((()=>!1)),dirExists=(...p)=>stat(resolve(...p)).then((st=>st.isDirectory())).catch((()=>!1)),hasOwnProperty=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key),settableGetter=(obj,key,get)=>{Object.defineProperty(obj,key,{get,set(value){Object.defineProperty(obj,key,{value,configurable:!0,writable:!0,enumerable:!0})},configurable:!0,enumerable:!0})},typeDefs=__webpack_require__(4216),nerfDart=__webpack_require__(2325),envReplace=__webpack_require__(4290),parseField=__webpack_require__(4158),typeDescription=__webpack_require__(4203),setEnvs=__webpack_require__(4107),{ErrInvalidAuth}=__webpack_require__(1339),confFileTypes=new Set(["global","user","project"]),confTypes=new Set(["default","builtin",...confFileTypes,"env","cli"]),_loaded=Symbol("loaded"),_get=Symbol("get"),_find=Symbol("find"),_loadObject=Symbol("loadObject"),_loadFile=Symbol("loadFile"),_checkDeprecated=Symbol("checkDeprecated"),_flatten=Symbol("flatten"),_flatOptions=Symbol("flatOptions");const _data=Symbol("data"),_raw=Symbol("raw"),_loadError=Symbol("loadError"),_source=Symbol("source"),_valid=Symbol("valid");class ConfigData{constructor(parent){this[_data]=Object.create(parent&&parent.data),this[_source]=null,this[_loadError]=null,this[_raw]=null,this[_valid]=!0}get data(){return this[_data]}get valid(){return this[_valid]}set source(s){if(this[_source])throw new Error("cannot set ConfigData source more than once");this[_source]=s}get source(){return this[_source]}set loadError(e){if(this[_loadError]||this[_raw])throw new Error("cannot set ConfigData loadError after load");this[_loadError]=e}get loadError(){return this[_loadError]}set raw(r){if(this[_raw]||this[_loadError])throw new Error("cannot set ConfigData raw after load");this[_raw]=r}get raw(){return this[_raw]}}module.exports=class{static get typeDefs(){return typeDefs}constructor({definitions,shorthands,flatten,npmPath,env=process.env,argv=process.argv,platform=process.platform,execPath=process.execPath,cwd=process.cwd(),excludeNpmCwd=!1}){this.definitions=definitions;const types={},defaults={};this.deprecated={};for(const[key,def]of Object.entries(definitions))defaults[key]=def.default,types[key]=def.type,def.deprecated&&(this.deprecated[key]=def.deprecated.trim().replace(/\n +/,"\n"));this[_flatOptions]=null,this[_flatten]=flatten,this.types=types,this.shorthands=shorthands,this.defaults=defaults,this.npmPath=npmPath,this.argv=argv,this.env=env,this.execPath=execPath,this.platform=platform,this.cwd=cwd,this.excludeNpmCwd=excludeNpmCwd,this.globalPrefix=null,this.localPrefix=null,this.localPackage=null,this.home=null;const wheres=[...confTypes];this.data=new Map;let parent=null;for(const where of wheres)this.data.set(where,parent=new ConfigData(parent));this.data.set=()=>{throw new Error("cannot change internal config data structure")},this.data.delete=()=>{throw new Error("cannot change internal config data structure")},this.sources=new Map([]),this.list=[];for(const{data}of this.data.values())this.list.unshift(data);Object.freeze(this.list),this[_loaded]=!1}get loaded(){return this[_loaded]}get prefix(){return this[_get]("global")?this.globalPrefix:this.localPrefix}find(key){if(!this.loaded)throw new Error("call config.load() before reading values");return this[_find](key)}[_find](key){const entries=[...this.data.entries()];for(let i=entries.length-1;i>-1;i--){const[where,{data}]=entries[i];if(hasOwnProperty(data,key))return where}return null}get(key,where){if(!this.loaded)throw new Error("call config.load() before reading values");return this[_get](key,where)}[_get](key,where=null){if(null!==where&&!confTypes.has(where))throw new Error("invalid config location param: "+where);const{data}=this.data.get(where||"cli");return null===where||hasOwnProperty(data,key)?data[key]:void 0}set(key,val,where="cli"){if(!this.loaded)throw new Error("call config.load() before setting values");if(!confTypes.has(where))throw new Error("invalid config location param: "+where);this[_checkDeprecated](key);const{data}=this.data.get(where);data[key]=val,this.data.get(where)[_valid]=null,this[_flatOptions]=null}get flat(){if(this[_flatOptions])return this[_flatOptions];process.emit("time","config:load:flatten"),this[_flatOptions]={};for(const{data}of this.data.values())this[_flatten](data,this[_flatOptions]);return process.emit("timeEnd","config:load:flatten"),this[_flatOptions]}delete(key,where="cli"){if(!this.loaded)throw new Error("call config.load() before deleting values");if(!confTypes.has(where))throw new Error("invalid config location param: "+where);delete this.data.get(where).data[key]}async load(){if(this.loaded)throw new Error("attempting to load npm config multiple times");process.emit("time","config:load"),process.emit("time","config:load:defaults"),this.loadDefaults(),process.emit("timeEnd","config:load:defaults"),process.emit("time","config:load:builtin"),await this.loadBuiltinConfig(),process.emit("timeEnd","config:load:builtin"),process.emit("time","config:load:cli"),this.loadCLI(),process.emit("timeEnd","config:load:cli"),process.emit("time","config:load:env"),this.loadEnv(),process.emit("timeEnd","config:load:env"),process.emit("time","config:load:project"),await this.loadProjectConfig(),process.emit("timeEnd","config:load:project"),process.emit("time","config:load:user"),await this.loadUserConfig(),process.emit("timeEnd","config:load:user"),process.emit("time","config:load:global"),await this.loadGlobalConfig(),process.emit("timeEnd","config:load:global"),this[_loaded]=!0,this.globalPrefix=this.get("prefix"),process.emit("time","config:load:setEnvs"),this.setEnvs(),process.emit("timeEnd","config:load:setEnvs"),process.emit("timeEnd","config:load")}loadDefaults(){this.loadGlobalPrefix(),this.loadHome(),this[_loadObject]({...this.defaults,prefix:this.globalPrefix},"default","default values");const{data}=this.data.get("default");settableGetter(data,"metrics-registry",(()=>this[_get]("registry"))),settableGetter(data,"globalconfig",(()=>resolve(this[_get]("prefix"),"etc/npmrc")))}loadHome(){this.home=this.env.HOME||homedir()}loadGlobalPrefix(){if(this.globalPrefix)throw new Error("cannot load default global prefix more than once");this.env.PREFIX?this.globalPrefix=this.env.PREFIX:"win32"===this.platform?this.globalPrefix=dirname(this.execPath):(this.globalPrefix=dirname(dirname(this.execPath)),this.env.DESTDIR&&(this.globalPrefix=join(this.env.DESTDIR,this.globalPrefix)))}loadEnv(){const conf=Object.create(null);for(const[envKey,envVal]of Object.entries(this.env)){if(!/^npm_config_/i.test(envKey)||""===envVal)continue;let key=envKey.slice("npm_config_".length);key.startsWith("//")||(key=key.replace(/(?!^)_/g,"-").toLowerCase()),conf[key]=envVal}this[_loadObject](conf,"env","environment")}loadCLI(){nopt.invalidHandler=(k,val,type)=>this.invalidHandler(k,val,type,"command line options","cli");const conf=nopt(this.types,this.shorthands,this.argv);nopt.invalidHandler=null,this.parsedArgv=conf.argv,delete conf.argv,this[_loadObject](conf,"cli","command line options")}get valid(){for(const[where,{valid}]of this.data.entries())if(!1===valid||null===valid&&!this.validate(where))return!1;return!0}validate(where){if(where){const obj=this.data.get(where);return obj[_valid]=!0,nopt.invalidHandler=(k,val,type)=>this.invalidHandler(k,val,type,obj.source,where),nopt.clean(obj.data,this.types,this.typeDefs),nopt.invalidHandler=null,obj[_valid]}{let valid=!0;const authProblems=[];for(const entryWhere of this.data.keys()){if("default"===entryWhere||"builtin"===entryWhere||"cli"===entryWhere)continue;const ret=this.validate(entryWhere);if(valid=valid&&ret,["global","user","project"].includes(entryWhere)){for(const key of["_authtoken","-authtoken"])this.get(key,entryWhere)&&authProblems.push({action:"delete",key,where:entryWhere});const nerfedReg=nerfDart(this.get("registry"));for(const key of["_auth","_authToken","username","_password"])this.get(key,entryWhere)&&(("username"!==key||this.get("_password",entryWhere))&&("_password"!==key||this.get("username",entryWhere))?authProblems.push({action:"rename",from:key,to:`${nerfedReg}:${key}`,where:entryWhere}):authProblems.push({action:"delete",key,where:entryWhere}))}}if(authProblems.length)throw new ErrInvalidAuth(authProblems);return valid}}repair(problems){if(!problems)try{this.validate()}catch(err){if("ERR_INVALID_AUTH"!==err.code)throw err;problems=err.problems}finally{problems||(problems=[])}for(const problem of problems)if("delete"===problem.action)this.delete(problem.key,problem.where);else if("rename"===problem.action){const old=this.get(problem.from,problem.where);this.set(problem.to,old,problem.where),this.delete(problem.from,problem.where)}}isDefault(key){const[defaultType,...types]=[...confTypes],defaultData=this.data.get(defaultType).data;return hasOwnProperty(defaultData,key)&&types.every((type=>{const typeData=this.data.get(type).data;return!hasOwnProperty(typeData,key)}))}invalidHandler(k,val,type,source,where){log.warn("invalid config",k+"="+JSON.stringify(val),`set in ${source}`),this.data.get(where)[_valid]=!1,Array.isArray(type)&&(type.includes(typeDefs.url.type)?type=typeDefs.url.type:type.includes(typeDefs.path.type)&&(type=typeDefs.path.type));const typeDesc=typeDescription(type),oneOrMore=-1!==typeDesc.indexOf(Array),mustBe=typeDesc.filter((m=>void 0!==m&&m!==Array)),msg="Must be"+(1===mustBe.length&&oneOrMore?" one or more":mustBe.length>1&&oneOrMore?" one or more of:":mustBe.length>1?" one of:":""),desc=1===mustBe.length?mustBe[0]:mustBe.filter((m=>m!==Array)).map((n=>"string"==typeof n?n:JSON.stringify(n))).join(", ");log.warn("invalid config",msg,desc)}[_loadObject](obj,where,source,er=null){const conf=this.data.get(where);if(conf.source){const m=`double-loading "${where}" configs from ${source}, previously loaded from ${conf.source}`;throw new Error(m)}if(this.sources.has(source)){const m=`double-loading config "${source}" as "${where}", previously loaded as "${this.sources.get(source)}"`;throw new Error(m)}if(conf.source=source,this.sources.set(source,where),er)conf.loadError=er,"ENOENT"!==er.code&&log.verbose("config",`error loading ${where} config`,er);else{conf.raw=obj;for(const[key,value]of Object.entries(obj)){const k=envReplace(key,this.env),v=this.parseField(value,k);"default"!==where&&this[_checkDeprecated](k,where,obj,[key,value]),conf.data[k]=v}}}[_checkDeprecated](key,where,obj,kv){this.deprecated[key]&&log.warn("config",key,this.deprecated[key])}parseField(f,key,listElement=!1){return parseField(f,key,this,listElement)}async[_loadFile](file,type){process.emit("time","config:load:file:"+file),await readFile(file,"utf8").then((data=>this[_loadObject](ini.parse(data),type,file)),(er=>this[_loadObject](null,type,file,er))),process.emit("timeEnd","config:load:file:"+file)}loadBuiltinConfig(){return this[_loadFile](resolve(this.npmPath,"npmrc"),"builtin")}async loadProjectConfig(){if(await this.loadLocalPrefix(),null==this.localPackage&&(this.localPackage=await fileExists(this.localPrefix,"package.json")),!0===this[_get]("global")||"global"===this[_get]("location"))return this.data.get("project").source="(global mode enabled, ignored)",void this.sources.set(this.data.get("project").source,"project");const projectFile=resolve(this.localPrefix,".npmrc");if(projectFile!==this[_get]("userconfig"))return this[_loadFile](projectFile,"project");this.data.get("project").source='(same as "user" config, ignored)',this.sources.set(this.data.get("project").source,"project")}async loadLocalPrefix(){const cliPrefix=this[_get]("prefix","cli");if(cliPrefix)return void(this.localPrefix=cliPrefix);const cliWorkspaces=this[_get]("workspaces","cli"),isGlobal=this[_get]("global")||"global"===this[_get]("location");for(const p of walkUp(this.cwd)){if(this.excludeNpmCwd&&p===this.npmPath)break;const hasPackageJson=await fileExists(p,"package.json");if(this.localPrefix||!hasPackageJson&&!await dirExists(p,"node_modules")){if(this.localPrefix&&hasPackageJson){const pkg=await rpj(resolve(p,"package.json")).catch((()=>!1));if(!pkg)continue;const workspaces=await mapWorkspaces({cwd:p,pkg});for(const w of workspaces.values())if(w===this.localPrefix){await fileExists(this.localPrefix,".npmrc")&&log.warn(`ignoring workspace config at ${this.localPrefix}/.npmrc`);const{data}=this.data.get("default");return data.workspace=[this.localPrefix],this.localPrefix=p,this.localPackage=hasPackageJson,void log.info(`found workspace root at ${this.localPrefix}`)}}}else if(this.localPrefix=p,this.localPackage=hasPackageJson,!1===cliWorkspaces||isGlobal)return}this.localPrefix||(this.localPrefix=this.cwd)}loadUserConfig(){return this[_loadFile](this[_get]("userconfig"),"user")}loadGlobalConfig(){return this[_loadFile](this[_get]("globalconfig"),"global")}async save(where){if(!this.loaded)throw new Error("call config.load() before saving");if(!confFileTypes.has(where))throw new Error("invalid config location param: "+where);const conf=this.data.get(where);if(conf[_raw]={...conf.data},conf[_loadError]=null,"user"===where){const nerfed=nerfDart(this.get("registry")),email=this.get(`${nerfed}:email`,"user");email&&(this.delete(`${nerfed}:email`,"user"),this.set("email",email,"user"))}const iniData=ini.stringify(conf.data).trim()+"\n";if(!iniData.trim())return void await unlink(conf.source).catch((er=>{}));const dir=dirname(conf.source);await mkdir(dir,{recursive:!0}),await writeFile(conf.source,iniData,"utf8");const mode="user"===where?384:438;await chmod(conf.source,mode)}clearCredentialsByURI(uri){const nerfed=nerfDart(uri);if(nerfDart(this.get("registry"))===nerfed){this.delete("-authtoken","user"),this.delete("_authToken","user"),this.delete("_authtoken","user"),this.delete("_auth","user"),this.delete("_password","user"),this.delete("username","user");const email=this.get(`${nerfed}:email`,"user");email&&this.set("email",email,"user")}this.delete(`${nerfed}:_authToken`,"user"),this.delete(`${nerfed}:_auth`,"user"),this.delete(`${nerfed}:_password`,"user"),this.delete(`${nerfed}:username`,"user"),this.delete(`${nerfed}:email`,"user"),this.delete(`${nerfed}:certfile`,"user"),this.delete(`${nerfed}:keyfile`,"user")}setCredentialsByURI(uri,{token,username,password,email,certfile,keyfile}){const nerfed=nerfDart(uri);if(email=email||this.get("email","user"),this.delete(`${nerfed}:always-auth`,"user"),this.delete(`${nerfed}:email`,"user"),certfile&&keyfile&&(this.set(`${nerfed}:certfile`,certfile,"user"),this.set(`${nerfed}:keyfile`,keyfile,"user")),token)this.set(`${nerfed}:_authToken`,token,"user"),this.delete(`${nerfed}:_password`,"user"),this.delete(`${nerfed}:username`,"user");else if(username||password){if(!username)throw new Error("must include username");if(!password)throw new Error("must include password");this.delete(`${nerfed}:_authToken`,"user"),this.set(`${nerfed}:username`,username,"user");const encoded=Buffer.from(password,"utf8").toString("base64");this.set(`${nerfed}:_password`,encoded,"user")}else if(!certfile||!keyfile)throw new Error("No credentials to set.")}getCredentialsByURI(uri){const nerfed=nerfDart(uri),def=nerfDart(this.get("registry")),creds={},email=this.get(`${nerfed}:email`)||this.get("email");email&&(nerfed===def&&this.set("email",email,"user"),creds.email=email);const certfileReg=this.get(`${nerfed}:certfile`),keyfileReg=this.get(`${nerfed}:keyfile`);certfileReg&&keyfileReg&&(creds.certfile=certfileReg,creds.keyfile=keyfileReg);const tokenReg=this.get(`${nerfed}:_authToken`);if(tokenReg)return creds.token=tokenReg,creds;const userReg=this.get(`${nerfed}:username`),passReg=this.get(`${nerfed}:_password`);if(userReg&&passReg){creds.username=userReg,creds.password=Buffer.from(passReg,"base64").toString("utf8");const auth=`${creds.username}:${creds.password}`;return creds.auth=Buffer.from(auth,"utf8").toString("base64"),creds}const authReg=this.get(`${nerfed}:_auth`);if(authReg){const authSplit=Buffer.from(authReg,"base64").toString("utf8").split(":");return creds.username=authSplit.shift(),creds.password=authSplit.join(":"),creds.auth=authReg,creds}return creds}setEnvs(){setEnvs(this)}}},2325:(module,__unused_webpack_exports,__webpack_require__)=>{const{URL}=__webpack_require__(7310);module.exports=url=>{const parsed=new URL(url),from=`${parsed.protocol}//${parsed.host}${parsed.pathname}`,rel=new URL(".",from);return`//${rel.host}${rel.pathname}`}},4158:(module,__unused_webpack_exports,__webpack_require__)=>{const typeDefs=__webpack_require__(4216),envReplace=__webpack_require__(4290),{resolve}=__webpack_require__(1017),{parse:umaskParse}=__webpack_require__(23),parseField=(f,key,opts,listElement=!1)=>{if("string"!=typeof f&&!Array.isArray(f))return f;const{platform,types,home,env}=opts,typeList=new Set([].concat(types[key])),isPath=typeList.has(typeDefs.path.type),isBool=typeList.has(typeDefs.Boolean.type),isString=isPath||typeList.has(typeDefs.String.type),isUmask=typeList.has(typeDefs.Umask.type),isNumber=typeList.has(typeDefs.Number.type),isList=!listElement&&typeList.has(Array);if(Array.isArray(f))return isList?f.map((field=>parseField(field,key,opts,!0))):f;if(f=f.trim(),isList)return parseField(f.split("\n\n"),key,opts);if(isBool&&!isString&&""===f)return!0;if(!isString&&!isPath&&!isNumber)switch(f){case"true":return!0;case"false":return!1;case"null":return null;case"undefined":return}if(f=envReplace(f,env),isPath){f=("win32"===platform?/^~(\/|\\)/:/^~\//).test(f)&&home?resolve(home,f.slice(2)):resolve(f)}if(isUmask)try{return umaskParse(f)}catch(er){return f}return isNumber&&!isNaN(f)&&(f=+f),f};module.exports=parseField},4107:(module,__unused_webpack_exports,__webpack_require__)=>{const envVal=val=>Array.isArray(val)?val.map((v=>envVal(v))).join("\n\n"):null==val||!1===val?"":"object"==typeof val?null:String(val),sameConfigValue=(def,val)=>Array.isArray(val)&&Array.isArray(def)?sameArrayValue(def,val):def===val,sameArrayValue=(def,val)=>{if(def.length!==val.length)return!1;for(let i=0;i<def.length;i++)if(def[i]!==val[i])return!1;return!0},setEnv=(env,rawKey,rawVal)=>{const val=envVal(rawVal),key=((key,val)=>!/^[/@_]/.test(key)&&"string"==typeof envVal(val)&&`npm_config_${key.replace(/-/g,"_").toLowerCase()}`)(rawKey,val);key&&null!==val&&(env[key]=val)};module.exports=config=>{const{env,defaults,definitions,list:[cliConf,envConf]}=config;env.INIT_CWD=process.cwd();const cliSet=new Set(Object.keys(cliConf)),envSet=new Set(Object.keys(envConf));for(const key in cliConf){const{deprecated,envExport=!0}=definitions[key]||{};deprecated||!1===envExport||(sameConfigValue(defaults[key],cliConf[key])?sameConfigValue(envConf[key],cliConf[key])||setEnv(env,key,cliConf[key]):envSet.has(key)&&!cliSet.has(key)||setEnv(env,key,cliConf[key]))}env.HOME=config.home,env.npm_config_global_prefix=config.globalPrefix,env.npm_config_local_prefix=config.localPrefix,cliConf.editor&&(env.EDITOR=cliConf.editor),cliConf["node-options"]&&(env.NODE_OPTIONS=cliConf["node-options"]),__webpack_require__.c[__webpack_require__.s]&&__webpack_require__.c[__webpack_require__.s].filename&&(env.npm_execpath=__webpack_require__.c[__webpack_require__.s].filename),env.NODE=env.npm_node_execpath=config.execPath}},4216:(module,__unused_webpack_exports,__webpack_require__)=>{const nopt=__webpack_require__(6677),{Umask,validate:validateUmask}=__webpack_require__(23),semver=__webpack_require__(912),noptValidatePath=nopt.typeDefs.path.validate;module.exports={...nopt.typeDefs,semver:{type:semver,validate:(data,k,val)=>{const valid=semver.valid(val);if(!valid)return!1;data[k]=valid},description:"full valid SemVer string"},Umask:{type:Umask,validate:validateUmask,description:"octal number in range 0o000..0o777 (0..511)"},url:{...nopt.typeDefs.url,description:'full url with "http://"'},path:{...nopt.typeDefs.path,validate:(data,k,val)=>"string"==typeof val&&noptValidatePath(data,k,val),description:"valid filesystem path"},Number:{...nopt.typeDefs.Number,description:"numeric value"},Boolean:{...nopt.typeDefs.Boolean,description:"boolean value (true or false)"},Date:{...nopt.typeDefs.Date,description:"valid Date string"}},nopt.typeDefs=module.exports},4203:(module,__unused_webpack_exports,__webpack_require__)=>{const typeDefs=__webpack_require__(4216),typeDescription=t=>{if(!t||"function"!=typeof t&&"object"!=typeof t)return t;if(Array.isArray(t))return t.map((t=>typeDescription(t)));for(const{type,description}of Object.values(typeDefs))if(type===t)return description||type;return t};module.exports=t=>[].concat(typeDescription(t)).filter((t=>void 0!==t))},23:module=>{const parse=val=>{if("string"==typeof val){if(/^0o?[0-7]+$/.test(val))return parseInt(val.replace(/^0o?/,""),8);if(/^[1-9][0-9]*$/.test(val))return parseInt(val,10);throw new Error(`invalid umask value: ${val}`)}if("number"!=typeof val)throw new Error(`invalid umask value: ${val}`);if((val=Math.floor(val))<0||val>511)throw new Error(`invalid umask value: ${val}`);return val};module.exports={Umask:class{},parse,validate:(data,k,val)=>{try{return data[k]=parse(val),!0}catch(er){return!1}}}},2678:(module,__unused_webpack_exports,__webpack_require__)=>{const{promisify}=__webpack_require__(3837),path=__webpack_require__(1017),getName=__webpack_require__(330),minimatch=__webpack_require__(6828),rpj=__webpack_require__(4059),pGlob=promisify(__webpack_require__(4230));function getPatterns(workspaces){const workspacesDeclaration=Array.isArray(workspaces.packages)?workspaces.packages:workspaces;if(!Array.isArray(workspacesDeclaration))throw getError({message:"workspaces config expects an Array",code:"EWORKSPACESCONFIG"});return function(patterns){const results=[];for(let pattern of patterns){const excl=pattern.match(/^!+/);excl&&(pattern=pattern.slice(excl[0].length)),pattern=pattern.replace(/^\/+/,"");const negate=excl&&excl[0].length%2==1;results.push({pattern,negate})}return results}(workspacesDeclaration)}function getPackageName(pkg,pathname){const{name}=pkg;return name||getName(pathname)}function pkgPathmame(opts){return(...args)=>{const cwd=opts.cwd?opts.cwd:process.cwd();return path.join.apply(null,[cwd,...args])}}function getError({Type=TypeError,message,code}){return Object.assign(new Type(message),{code})}async function mapWorkspaces(opts={}){if(!opts||!opts.pkg)throw getError({message:"mapWorkspaces missing pkg info",code:"EMAPWORKSPACESPKG"});const{workspaces=[]}=opts.pkg,patterns=getPatterns(workspaces),results=new Map,seen=new Map;if(!patterns.length)return results;const getPackagePathname=pkgPathmame(opts);for(const item of patterns){const matches=await pGlob((pattern=item.pattern,(pattern=pattern.replace(/\\/g,"/")).endsWith("/")?pattern:`${pattern}/`),{...opts,ignore:[...opts.ignore||[],"**/node_modules/**"]});for(const match of matches){let pkg;const packageJsonPathname=getPackagePathname(match,"package.json"),packagePathname=path.dirname(packageJsonPathname);try{pkg=await rpj(packageJsonPathname)}catch(err){if("ENOENT"===err.code)continue;throw err}const name=getPackageName(pkg,packagePathname);let seenPackagePathnames=seen.get(name);seenPackagePathnames||(seenPackagePathnames=new Set,seen.set(name,seenPackagePathnames)),item.negate?seenPackagePathnames.delete(packagePathname):seenPackagePathnames.add(packagePathname)}}var pattern;const errorMessageArray=["must not have multiple workspaces with the same name"];for(const[packageName,seenPackagePathnames]of seen)0!==seenPackagePathnames.size&&(seenPackagePathnames.size>1?addDuplicateErrorMessages(errorMessageArray,packageName,seenPackagePathnames):results.set(packageName,seenPackagePathnames.values().next().value));if(errorMessageArray.length>1)throw getError({Type:Error,message:errorMessageArray.join("\n"),code:"EDUPLICATEWORKSPACE"});return results}function addDuplicateErrorMessages(messageArray,packageName,packagePathnames){messageArray.push(`package '${packageName}' has conflicts in the following paths:`);for(const packagePathname of packagePathnames)messageArray.push("    "+packagePathname)}mapWorkspaces.virtual=function(opts={}){if(!opts||!opts.lockfile)throw getError({message:"mapWorkspaces.virtual missing lockfile info",code:"EMAPWORKSPACESLOCKFILE"});const{packages={}}=opts.lockfile,{workspaces=[]}=packages[""]||{},results=new Map,patterns=getPatterns(workspaces);if(!patterns.length)return results;patterns.push({pattern:"**/node_modules/**",negate:!0});const getPackagePathname=pkgPathmame(opts);for(const packageKey of Object.keys(packages))if(""!==packageKey)for(const item of patterns)if(minimatch(packageKey,item.pattern)){const packagePathname=getPackagePathname(packageKey),name=getPackageName(packages[packageKey],packagePathname);item.negate?results.delete(packagePathname):results.set(packagePathname,name)}return map=results,new Map(Array.from(map,(item=>item.reverse())));var map},module.exports=mapWorkspaces},330:(module,__unused_webpack_exports,__webpack_require__)=>{const{basename,dirname}=__webpack_require__(1017);module.exports=dir=>{return!!dir&&(parent=basename(dirname(dir)),base=basename(dir),"@"===parent.charAt(0)?`${parent}/${base}`:base);var parent,base}}};
//# sourceMappingURL=857.extension.bundle.js.map