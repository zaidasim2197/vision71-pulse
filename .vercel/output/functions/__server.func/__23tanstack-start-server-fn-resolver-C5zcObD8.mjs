//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-C5zcObD8.js
var manifest = { "b2e8283837c9de85e38739fbde0fd8505397e43c141b6e86cac3450b0a37b490": {
	functionName: "queryGeminiServerFn_createServerFn_handler",
	importer: () => import("./_ssr/aiServer-jqvIG1Oh.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
