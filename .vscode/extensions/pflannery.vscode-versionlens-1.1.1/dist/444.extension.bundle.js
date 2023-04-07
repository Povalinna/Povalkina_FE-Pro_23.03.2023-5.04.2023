"use strict";exports.id=444,exports.ids=[444],exports.modules={9279:module=>{module.exports={cmd:(input,doubleEscape)=>{if(!input.length)return'""';let result;if(/[ \t\n\v"]/.test(input)){result='"';for(let i=0;i<=input.length;++i){let slashCount=0;for(;"\\"===input[i];)++i,++slashCount;if(i===input.length){result+="\\".repeat(2*slashCount);break}'"'===input[i]?(result+="\\".repeat(2*slashCount+1),result+=input[i]):(result+="\\".repeat(slashCount),result+=input[i])}result+='"'}else result=input;return result=result.replace(/[ !%^&()<>|"]/g,"^$&"),doubleEscape&&(result=result.replace(/[ !%^&()<>|"]/g,"^$&")),result},sh:input=>{if(!input.length)return"''";if(!/[\t\n\r "#$&'()*;<>?\\`|~]/.test(input))return input;return`'${input.replace(/'/g,"'\\''")}'`.replace(/^(?:'')+(?!$)/,"").replace(/\\'''/g,"\\'")}}},2593:(module,__unused_webpack_exports,__webpack_require__)=>{const{spawn}=__webpack_require__(2081),os=__webpack_require__(2037),which=__webpack_require__(3926),escape=__webpack_require__(9279),promiseSpawn=(cmd,args,opts={},extra={})=>{if(opts.shell)return spawnWithShell(cmd,args,opts,extra);let proc;const p=new Promise(((res,rej)=>{proc=spawn(cmd,args,opts);const stdout=[],stderr=[],reject=er=>rej(Object.assign(er,{cmd,args,...stdioResult(stdout,stderr,opts),...extra}));proc.on("error",reject),proc.stdout&&(proc.stdout.on("data",(c=>stdout.push(c))).on("error",reject),proc.stdout.on("error",(er=>reject(er)))),proc.stderr&&(proc.stderr.on("data",(c=>stderr.push(c))).on("error",reject),proc.stderr.on("error",(er=>reject(er)))),proc.on("close",((code,signal)=>{const result={cmd,args,code,signal,...stdioResult(stdout,stderr,opts),...extra};code||signal?rej(Object.assign(new Error("command failed"),result)):res(result)}))}));return p.stdin=proc.stdin,p.process=proc,p},spawnWithShell=(cmd,args,opts,extra)=>{let command=opts.shell;!0===command&&(command="win32"===process.platform?process.env.ComSpec:"sh");const options={...opts,shell:!1},realArgs=[];let script=cmd;if(/(?:^|\\)cmd(?:\.exe)?$/i.test(command)){let pathToInitial,doubleEscape=!1,initialCmd="",insideQuotes=!1;for(let i=0;i<cmd.length;++i){const char=cmd.charAt(i);if(" "===char&&!insideQuotes)break;initialCmd+=char,'"'!==char&&"'"!==char||(insideQuotes=!insideQuotes)}try{pathToInitial=which.sync(initialCmd,{path:options.env&&options.env.PATH||process.env.PATH,pathext:options.env&&options.env.PATHEXT||process.env.PATHEXT}).toLowerCase()}catch(err){pathToInitial=initialCmd.toLowerCase()}doubleEscape=pathToInitial.endsWith(".cmd")||pathToInitial.endsWith(".bat");for(const arg of args)script+=` ${escape.cmd(arg,doubleEscape)}`;realArgs.push("/d","/s","/c",script),options.windowsVerbatimArguments=!0}else{for(const arg of args)script+=` ${escape.sh(arg)}`;realArgs.push("-c",script)}return promiseSpawn(command,realArgs,options,extra)};promiseSpawn.open=(_args,opts={},extra={})=>{const options={...opts,shell:!0},args=[].concat(_args);let platform=process.platform;"linux"===platform&&os.release().toLowerCase().includes("microsoft")&&(platform="win32");let command=options.command;return command||("win32"===platform?(options.shell=process.env.ComSpec,command='start ""'):command="darwin"===platform?"open":"xdg-open"),spawnWithShell(command,args,options,extra)};const isPipe=(stdio="pipe",fd)=>"pipe"===stdio||null===stdio||!!Array.isArray(stdio)&&isPipe(stdio[fd],fd),stdioResult=(stdout,stderr,{stdioString=!0,stdio})=>{const result={stdout:null,stderr:null};return isPipe(stdio,1)&&(result.stdout=Buffer.concat(stdout),stdioString&&(result.stdout=result.stdout.toString().trim())),isPipe(stdio,2)&&(result.stderr=Buffer.concat(stderr),stdioString&&(result.stderr=result.stderr.toString().trim())),result};module.exports=promiseSpawn},1851:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.fetchPackage=void 0;const packages_1=__webpack_require__(7074);exports.fetchPackage=function fetchPackage(client,request){return client.logger.debug("Queued package: %s",request.package.name),client.fetchPackage(request).then((function(document){return client.logger.info("Fetched %s package from %s: %s@%s",document.providerName,document.response.source,request.package.name,request.package.version),packages_1.ResponseFactory.createSuccess(request,document)})).catch((function(error){return client.logger.error("%s caught an exception.\n Package: %j\n Error: %j",fetchPackage.name,request.package,error),Promise.reject(error)}))}},3081:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.fetchPackages=void 0;const fetchPackage_1=__webpack_require__(1851);exports.fetchPackages=async function(packagePath,client,clientData,dependencies){const{providerName}=client.config,results=[],promises=dependencies.map((function(dependency){const{name,version}=dependency.packageInfo,clientRequest={providerName,clientData,dependency,package:{name,version,path:packagePath},attempt:0};return(0,fetchPackage_1.fetchPackage)(client,clientRequest).then((function(responses){Array.isArray(responses)?results.push(...responses):results.push(responses)}))}));return Promise.all(promises).then((_=>results))}},920:function(__unused_webpack_module,exports,__webpack_require__){var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k);var desc=Object.getOwnPropertyDescriptor(m,k);desc&&!("get"in desc?!m.__esModule:desc.writable||desc.configurable)||(desc={enumerable:!0,get:function(){return m[k]}}),Object.defineProperty(o,k2,desc)}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__exportStar=this&&this.__exportStar||function(m,exports){for(var p in m)"default"===p||Object.prototype.hasOwnProperty.call(exports,p)||__createBinding(exports,m,p)};Object.defineProperty(exports,"__esModule",{value:!0}),__exportStar(__webpack_require__(1851),exports),__exportStar(__webpack_require__(3081),exports)},5141:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.AbstractProviderConfig=void 0;const providers_1=__webpack_require__(6424);exports.AbstractProviderConfig=class{constructor(providerName,config,caching,http){this.providerName=providerName,this.config=config,this.caching=caching,this.http=http,this.supports=[providers_1.ProviderSupport.Releases,providers_1.ProviderSupport.Prereleases]}providerName;config;supports;caching;http}},2502:(__unused_webpack_module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0})},8128:function(__unused_webpack_module,exports,__webpack_require__){var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k);var desc=Object.getOwnPropertyDescriptor(m,k);desc&&!("get"in desc?!m.__esModule:desc.writable||desc.configurable)||(desc={enumerable:!0,get:function(){return m[k]}}),Object.defineProperty(o,k2,desc)}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__exportStar=this&&this.__exportStar||function(m,exports){for(var p in m)"default"===p||Object.prototype.hasOwnProperty.call(exports,p)||__createBinding(exports,m,p)};Object.defineProperty(exports,"__esModule",{value:!0}),__exportStar(__webpack_require__(2502),exports),__exportStar(__webpack_require__(6903),exports),__exportStar(__webpack_require__(2041),exports)},6903:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.RequestLightClient=void 0;const clients_1=__webpack_require__(6502);class RequestLightClient extends clients_1.AbstractCachedRequest{logger;options;xhr;constructor(xhr,requestOptions,requestLogger){super(requestOptions.caching),this.logger=requestLogger,this.options=requestOptions,this.xhr=xhr}async request(method,baseUrl,query={},headers={}){const url=clients_1.UrlHelpers.createUrl(baseUrl,query),cacheKey=method+"_"+url;if(this.cache.cachingOpts.duration>0&&!1===this.cache.hasExpired(cacheKey)){const cachedResp=this.cache.get(cacheKey);return cachedResp.rejected?Promise.reject(cachedResp):Promise.resolve(cachedResp)}return this.xhr({url,type:method,headers,strictSSL:this.options.http.strictSSL}).then((response=>this.createCachedResponse(cacheKey,response.status,response.responseText,!1))).catch((response=>{const result=this.createCachedResponse(cacheKey,response.status,response.responseText,!0);return Promise.reject(result)}))}}exports.RequestLightClient=RequestLightClient},2041:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.createJsonClient=exports.createHttpClient=void 0;const clients_1=__webpack_require__(6502),requestLightClient_1=__webpack_require__(6903);function createHttpClient(options,logger){return new requestLightClient_1.RequestLightClient(__webpack_require__(5260).xhr,options,logger)}exports.createHttpClient=createHttpClient,exports.createJsonClient=function(options,logger){return new clients_1.JsonHttpClient(createHttpClient(options,logger))}},6421:(__unused_webpack_module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0})},7422:function(__unused_webpack_module,exports,__webpack_require__){var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k);var desc=Object.getOwnPropertyDescriptor(m,k);desc&&!("get"in desc?!m.__esModule:desc.writable||desc.configurable)||(desc={enumerable:!0,get:function(){return m[k]}}),Object.defineProperty(o,k2,desc)}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__exportStar=this&&this.__exportStar||function(m,exports){for(var p in m)"default"===p||Object.prototype.hasOwnProperty.call(exports,p)||__createBinding(exports,m,p)};Object.defineProperty(exports,"__esModule",{value:!0}),__exportStar(__webpack_require__(6421),exports),__exportStar(__webpack_require__(1493),exports),__exportStar(__webpack_require__(9398),exports)},1493:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.PromiseSpawnClient=void 0;const clients_1=__webpack_require__(6502);class PromiseSpawnClient extends clients_1.AbstractCachedRequest{promiseSpawn;logger;constructor(promiseSpawnFn,processOpts,processLogger){super(processOpts),this.logger=processLogger,this.promiseSpawn=promiseSpawnFn}async request(cmd,args,cwd){const cacheKey=`${cmd} ${args.join(" ")}`;if(this.cache.cachingOpts.duration>0&&!1===this.cache.hasExpired(cacheKey)){this.logger.debug("cached - %s",cacheKey);const cachedResp=this.cache.get(cacheKey);return cachedResp.rejected?Promise.reject(cachedResp):Promise.resolve(cachedResp)}return this.logger.debug("executing - %s",cacheKey),this.promiseSpawn(cmd,args,{cwd,stdioString:!0}).then((result=>this.createCachedResponse(cacheKey,result.code,result.stdout,!1,clients_1.ClientResponseSource.local))).catch((error=>{const result=this.createCachedResponse(cacheKey,error.code,error.message,!0,clients_1.ClientResponseSource.local);return Promise.reject(result)}))}}exports.PromiseSpawnClient=PromiseSpawnClient},9398:function(__unused_webpack_module,exports,__webpack_require__){var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.createProcessClient=void 0;const promise_spawn_1=__importDefault(__webpack_require__(2593)),promiseSpawnClient_1=__webpack_require__(1493);exports.createProcessClient=function(cachingOpts,logger){return new promiseSpawnClient_1.PromiseSpawnClient(promise_spawn_1.default,cachingOpts,logger)}},9444:function(__unused_webpack_module,exports,__webpack_require__){var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k);var desc=Object.getOwnPropertyDescriptor(m,k);desc&&!("get"in desc?!m.__esModule:desc.writable||desc.configurable)||(desc={enumerable:!0,get:function(){return m[k]}}),Object.defineProperty(o,k2,desc)}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__exportStar=this&&this.__exportStar||function(m,exports){for(var p in m)"default"===p||Object.prototype.hasOwnProperty.call(exports,p)||__createBinding(exports,m,p)};Object.defineProperty(exports,"__esModule",{value:!0}),__exportStar(__webpack_require__(4356),exports),__exportStar(__webpack_require__(2190),exports),__exportStar(__webpack_require__(4381),exports),__exportStar(__webpack_require__(3950),exports),__exportStar(__webpack_require__(517),exports),__exportStar(__webpack_require__(2185),exports),__exportStar(__webpack_require__(4234),exports),__exportStar(__webpack_require__(5851),exports),__exportStar(__webpack_require__(5736),exports),__exportStar(__webpack_require__(6044),exports),__exportStar(__webpack_require__(7830),exports),__exportStar(__webpack_require__(5146),exports)},4356:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.DotNetCli=void 0;const clients_1=__webpack_require__(6502);exports.DotNetCli=class{config;client;logger;constructor(config,client,logger){this.config=config,this.client=client,this.logger=logger}async fetchSources(cwd){const promisedCli=this.client.request("dotnet",["nuget","list","source","--format","short"],cwd);return await promisedCli.then((result=>{const{data}=result;if(data.indexOf("error")>-1)return Promise.reject(result);if(0===data.length||-1===data.indexOf("E"))return[];const splitChar=data.indexOf(crLf)>0?crLf:"\n";let lines=data.split(splitChar);return""===lines[lines.length-1]&&lines.pop(),function(lines){return lines.map((function(line){const enabled="E"===line.substring(0,1),machineWide="M"===line.substring(1,2),offset=machineWide?3:2,url=line.substring(offset);return{enabled,machineWide,url,protocol:clients_1.UrlHelpers.getProtocolFromUrl(url)}}))}(lines).filter((s=>s.enabled))})).then((sources=>[...this.config.nuget.sources.map((function(url){const protocol=clients_1.UrlHelpers.getProtocolFromUrl(url);return{enabled:!0,machineWide:protocol===clients_1.UrlHelpers.RegistryProtocols.file,url,protocol}})),...sources])).catch((error=>[{enabled:!0,machineWide:!1,protocol:clients_1.UrlHelpers.RegistryProtocols.https,url:this.config.fallbackNugetSource}]))}};const crLf="\r\n"},2190:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.NuGetPackageClient=void 0;const suggestions_1=__webpack_require__(804),packages_1=__webpack_require__(7074),clients_1=__webpack_require__(6502),dotnetUtils_1=__webpack_require__(5736);exports.NuGetPackageClient=class{config;client;logger;constructor(config,client,logger){this.config=config,this.client=client,this.logger=logger}async fetchPackage(request){const dotnetSpec=(0,dotnetUtils_1.parseVersionSpec)(request.package.version);return this.fetchPackageRetry(request,dotnetSpec)}async fetchPackageRetry(request,dotnetSpec){const urls=request.clientData.serviceUrls,autoCompleteUrl=urls[request.attempt];return this.createRemotePackageDocument(autoCompleteUrl,request,dotnetSpec).catch((error=>{if(this.logger.debug("Caught exception from %s: %O",packages_1.PackageSourceTypes.Registry,error),request.attempt++,404===error.status&&request.attempt<urls.length)return this.fetchPackageRetry(request,dotnetSpec);const suggestion=suggestions_1.SuggestionFactory.createFromHttpStatus(error.status);return null!=suggestion?packages_1.DocumentFactory.create(packages_1.PackageSourceTypes.Registry,request,error,[suggestion]):Promise.reject(error)}))}async createRemotePackageDocument(url,request,dotnetSpec){const packageUrl=clients_1.UrlHelpers.ensureEndSlash(url)+`${request.package.name.toLowerCase()}/index.json`;return this.client.request(clients_1.HttpClientRequestMethods.get,packageUrl,{},{}).then((function(httpResponse){const{data}=httpResponse,source=packages_1.PackageSourceTypes.Registry,{providerName}=request,requested=request.package,packageInfo=data,response={source:httpResponse.source,status:httpResponse.status},rawVersions=packages_1.VersionHelpers.filterSemverVersions(packageInfo.versions),{releases,prereleases}=packages_1.VersionHelpers.splitReleasesFromArray(rawVersions);if(dotnetSpec.spec&&dotnetSpec.spec.hasFourSegments)return packages_1.DocumentFactory.create(packages_1.PackageSourceTypes.Registry,request,httpResponse,[]);if(null===dotnetSpec.type)return packages_1.DocumentFactory.createNoMatch(providerName,source,packages_1.PackageVersionTypes.Version,requested,packages_1.ResponseFactory.createResponseStatus(httpResponse.source,404),releases.length>0?releases[releases.length-1]:null);const versionRange=dotnetSpec.resolvedVersion,resolved={name:requested.name,version:versionRange},suggestions=(0,suggestions_1.createSuggestions)(versionRange,releases,prereleases);return{providerName,source,response,type:dotnetSpec.type,requested,resolved,suggestions}}))}}},4381:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.NuGetResourceClient=void 0;const clients_1=__webpack_require__(6502);exports.NuGetResourceClient=class{logger;client;constructor(client,logger){this.client=client,this.logger=logger}async fetchResource(source){return this.logger.debug("Requesting PackageBaseAddressService from %s",source.url),await this.client.request(clients_1.HttpClientRequestMethods.get,source.url,{},{}).then((response=>{const foundPackageBaseAddressServices=response.data.resources.filter((res=>res["@type"].indexOf("PackageBaseAddress")>-1))[0]["@id"];return this.logger.debug("Resolved PackageBaseAddressService endpoint: %O",foundPackageBaseAddressServices),foundPackageBaseAddressServices})).catch((error=>(this.logger.error("Could not resolve nuget service index. %O",error),"")))}}},3950:(__unused_webpack_module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0})},6384:(__unused_webpack_module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.DotNetContributions=void 0,function(DotNetContributions){DotNetContributions.Caching="dotnet.caching",DotNetContributions.Http="dotnet.http",DotNetContributions.Nuget="dotnet.nuget",DotNetContributions.DependencyProperties="dotnet.dependencyProperties",DotNetContributions.TagFilter="dotnet.tagFilter",DotNetContributions.FilePatterns="dotnet.files"}(exports.DotNetContributions||(exports.DotNetContributions={}))},8617:(__unused_webpack_module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.NugetContributions=void 0,function(NugetContributions){NugetContributions.Sources="sources"}(exports.NugetContributions||(exports.NugetContributions={}))},2185:(__unused_webpack_module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0})},517:(__unused_webpack_module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0})},4234:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.DotNetConfig=void 0;const abstractProviderConfig_1=__webpack_require__(5141),eDotNetContributions_1=__webpack_require__(6384);class DotNetConfig extends abstractProviderConfig_1.AbstractProviderConfig{constructor(config,caching,http,nugetOpts){super("dotnet",config,caching,http),this.nuget=nugetOpts}nuget;get fileMatcher(){return{language:"xml",scheme:"file",pattern:this.filePatterns}}get filePatterns(){return this.config.get(eDotNetContributions_1.DotNetContributions.FilePatterns)}get dependencyProperties(){return this.config.get(eDotNetContributions_1.DotNetContributions.DependencyProperties)}get tagFilter(){return this.config.get(eDotNetContributions_1.DotNetContributions.TagFilter)}get fallbackNugetSource(){return"https://api.nuget.org/v3/index.json"}}exports.DotNetConfig=DotNetConfig},5146:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.configureContainer=void 0;const awilix_1=__webpack_require__(6675),clients_1=__webpack_require__(6502),http_1=__webpack_require__(8128),process_1=__webpack_require__(7422),dotnetCli_1=__webpack_require__(4356),nugetPackageClient_1=__webpack_require__(2190),nugetResourceClient_1=__webpack_require__(4381),eDotNetContributions_1=__webpack_require__(6384),dotnetConfig_1=__webpack_require__(4234),dotnetSuggestionProvider_1=__webpack_require__(5851),nugetOptions_1=__webpack_require__(7830);exports.configureContainer=function(container){const services={nugetOpts:(0,awilix_1.asFunction)((appConfig=>new nugetOptions_1.NugetOptions(appConfig,eDotNetContributions_1.DotNetContributions.Nuget))).singleton(),dotnetCachingOpts:(0,awilix_1.asFunction)((appConfig=>new clients_1.CachingOptions(appConfig,eDotNetContributions_1.DotNetContributions.Caching,"caching"))).singleton(),dotnetHttpOpts:(0,awilix_1.asFunction)((appConfig=>new clients_1.HttpOptions(appConfig,eDotNetContributions_1.DotNetContributions.Http,"http"))).singleton(),dotnetConfig:(0,awilix_1.asFunction)(((appConfig,dotnetCachingOpts,dotnetHttpOpts,nugetOpts)=>new dotnetConfig_1.DotNetConfig(appConfig,dotnetCachingOpts,dotnetHttpOpts,nugetOpts))).singleton(),dotnetProcess:(0,awilix_1.asFunction)(((dotnetCachingOpts,logger)=>(0,process_1.createProcessClient)(dotnetCachingOpts,logger.child({namespace:"dotnet process"})))).singleton(),dotnetCli:(0,awilix_1.asFunction)(((dotnetConfig,dotnetProcess,logger)=>new dotnetCli_1.DotNetCli(dotnetConfig,dotnetProcess,logger.child({namespace:"dotnet cli"})))).singleton(),dotnetJsonClient:(0,awilix_1.asFunction)(((dotnetCachingOpts,dotnetHttpOpts,logger)=>(0,http_1.createJsonClient)({caching:dotnetCachingOpts,http:dotnetHttpOpts},logger.child({namespace:"dotnet request"})))).singleton(),nugetClient:(0,awilix_1.asFunction)(((dotnetConfig,dotnetJsonClient,logger)=>new nugetPackageClient_1.NuGetPackageClient(dotnetConfig,dotnetJsonClient,logger.child({namespace:"dotnet client"})))).singleton(),nugetResClient:(0,awilix_1.asFunction)(((dotnetJsonClient,logger)=>new nugetResourceClient_1.NuGetResourceClient(dotnetJsonClient,logger.child({namespace:"dotnet resource service"})))).singleton(),dotnetProvider:(0,awilix_1.asFunction)(((dotnetCli,nugetClient,nugetResClient,logger)=>new dotnetSuggestionProvider_1.DotNetSuggestionProvider(dotnetCli,nugetClient,nugetResClient,logger.child({namespace:"dotnet provider"})))).singleton()};return container.register(services),container.cradle.dotnetProvider}},5851:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.DotNetSuggestionProvider=void 0;const packages_1=__webpack_require__(920),clients_1=__webpack_require__(6502),suggestions_1=__webpack_require__(804),dotnetXmlParserFactory_1=__webpack_require__(6044);exports.DotNetSuggestionProvider=class{dotnetClient;nugetPackageClient;nugetResClient;config;logger;suggestionReplaceFn;constructor(dotnetCli,nugetClient,nugetResClient,logger){this.dotnetClient=dotnetCli,this.nugetPackageClient=nugetClient,this.nugetResClient=nugetResClient,this.config=nugetClient.config,this.logger=logger,this.suggestionReplaceFn=suggestions_1.defaultReplaceFn}parseDependencies(packageText){return(0,dotnetXmlParserFactory_1.createDependenciesFromXml)(packageText,this.config.dependencyProperties)}async fetchSuggestions(packagePath,packageDependencies){this.config.nuget.defrost();const promised=(await this.dotnetClient.fetchSources(packagePath)).filter((s=>s.protocol===clients_1.UrlHelpers.RegistryProtocols.https||s.protocol===clients_1.UrlHelpers.RegistryProtocols.http)).map((async remoteSource=>await this.nugetResClient.fetchResource(remoteSource))),serviceUrls=(await Promise.all(promised)).filter((url=>url.length>0));if(0===serviceUrls.length)return this.logger.error("Could not resolve any nuget service urls"),null;const clientData={serviceUrls};return(0,packages_1.fetchPackages)(packagePath,this.nugetPackageClient,clientData,packageDependencies)}}},5736:function(__unused_webpack_module,exports,__webpack_require__){var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.buildVersionSpec=exports.parseVersionSpec=exports.expandShortVersion=void 0;const packages_1=__webpack_require__(7074),semver_1=__importDefault(__webpack_require__(912));function expandShortVersion(value){if(!value||-1!==value.indexOf("[")||-1!==value.indexOf("(")||-1!==value.indexOf(",")||-1!==value.indexOf(")")||-1!==value.indexOf("]")||-1!==value.indexOf("*"))return value;let dotCount=0;for(let i=0;i<value.length;i++){const c=value[i];if("."===c)dotCount++;else if(isNaN(parseInt(c)))return value}let fmtValue="";if(0===dotCount)fmtValue=value+".0.0";else{if(1!==dotCount)return value;fmtValue=value+".0"}return fmtValue}function buildVersionSpec(value){let formattedValue=expandShortVersion(value.trim());if(!formattedValue)return null;if(semver_1.default.parse(formattedValue,{includePrereleases:!0}))return{version:formattedValue,isMinInclusive:!0,isMaxInclusive:!0,hasFourSegments:!1};try{const parsedNodeRange=semver_1.default.validRange(formattedValue,{includePrereleases:!0});if(parsedNodeRange)return{version:parsedNodeRange,isMinInclusive:!0,isMaxInclusive:!0,hasFourSegments:!1}}catch{}if(formattedValue.length<3)return null;const versionSpec={},first=formattedValue[0];if("["===first)versionSpec.isMinInclusive=!0;else{if("("!==first)return packages_1.VersionHelpers.isFourSegmentedVersion(formattedValue)?{hasFourSegments:!0}:null;versionSpec.isMinInclusive=!1}const last=formattedValue[formattedValue.length-1];"]"===last?versionSpec.isMaxInclusive=!0:")"===last&&(versionSpec.isMaxInclusive=!1),formattedValue=formattedValue.substr(1,formattedValue.length-2);const parts=formattedValue.split(",");if(parts.length>2)return null;if(parts.every((x=>!x)))return null;const minVersion=parts[0],maxVersion=2==parts.length?parts[1]:parts[0];if(minVersion){const parsedVersion=buildVersionSpec(minVersion);if(!parsedVersion)return null;versionSpec.minVersionSpec=parsedVersion,versionSpec.hasFourSegments=parsedVersion.hasFourSegments}if(maxVersion){const parsedVersion=buildVersionSpec(maxVersion);if(!parsedVersion)return null;versionSpec.maxVersionSpec=parsedVersion,versionSpec.hasFourSegments=parsedVersion.hasFourSegments}return versionSpec}exports.expandShortVersion=expandShortVersion,exports.parseVersionSpec=function(rawVersion){const spec=buildVersionSpec(rawVersion);let version,isValidVersion=!1,isValidRange=!1;if(spec&&!spec.hasFourSegments){const{valid,validRange}=semver_1.default;version=function(versionSpec){if(versionSpec.version&&versionSpec.isMinInclusive&&versionSpec.isMaxInclusive)return versionSpec.version;if(versionSpec.minVersionSpec&&versionSpec.maxVersionSpec&&versionSpec.minVersionSpec.version===versionSpec.maxVersionSpec.version&&versionSpec.isMinInclusive&&versionSpec.isMaxInclusive)return versionSpec.minVersionSpec.version;let rangeBuilder="";versionSpec.minVersionSpec&&(rangeBuilder+=">",versionSpec.isMinInclusive&&(rangeBuilder+="="),rangeBuilder+=versionSpec.minVersionSpec.version);versionSpec.maxVersionSpec&&(rangeBuilder+=rangeBuilder.length>0?" ":"",rangeBuilder+="<",versionSpec.isMaxInclusive&&(rangeBuilder+="="),rangeBuilder+=versionSpec.maxVersionSpec.version);return rangeBuilder}(spec),isValidVersion=valid(version,packages_1.VersionHelpers.loosePrereleases),isValidRange=!isValidVersion&&null!==validRange(version,packages_1.VersionHelpers.loosePrereleases)}return{type:isValidVersion?packages_1.PackageVersionTypes.Version:isValidRange?packages_1.PackageVersionTypes.Range:null,rawVersion,resolvedVersion:spec?version:"",spec}},exports.buildVersionSpec=buildVersionSpec},6044:function(__unused_webpack_module,exports,__webpack_require__){var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.createDependenciesFromXml=void 0;const xmldoc_1=__importDefault(__webpack_require__(1960));exports.createDependenciesFromXml=function(xml,includePropertyNames){let document=null;try{document=new xmldoc_1.default.XmlDocument(xml)}catch{document=null}return document?function(topLevelNodes,xml,includePropertyNames){const collector=[];function parseVersionNode(itemGroupNode){if(0==includePropertyNames.includes(itemGroupNode.name))return;const dependencyLens=function(node,xml){const nameRange={start:node.startTagPosition,end:node.startTagPosition},versionRange=function(node,attributeName,xml){const lineText=xml.substring(node.startTagPosition,node.position);let start=lineText.toLowerCase().indexOf(attributeName);if(-1===start)return null;start+=attributeName.length;const end=lineText.indexOf('"',start);return{start:node.startTagPosition+start,end:node.startTagPosition+end}}(node,' version="',xml);if(null===versionRange)return null;const packageInfo={name:node.attr.Include||node.attr.Update||node.attr.Name,version:node.attr.Version};return{nameRange,versionRange,packageInfo}}(itemGroupNode,xml);dependencyLens&&collector.push(dependencyLens)}return topLevelNodes.eachChild((function(node){"ItemGroup"===node.name&&node.children.length>0?node.eachChild(parseVersionNode):"Sdk"===node.name&&parseVersionNode(node)})),collector}(document,xml,includePropertyNames):[]}},7830:(__unused_webpack_module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.NugetOptions=void 0;const configuration_1=__webpack_require__(605),eNugetContributions_1=__webpack_require__(8617);class NugetOptions extends configuration_1.Options{constructor(config,section){super(config,section)}get sources(){return this.get(eNugetContributions_1.NugetContributions.Sources)}}exports.NugetOptions=NugetOptions}};
//# sourceMappingURL=444.extension.bundle.js.map