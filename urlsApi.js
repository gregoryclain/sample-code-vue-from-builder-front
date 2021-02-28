// Pour des raisons de confidentialités, seul une partie du code est visible
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable semi */
const URL_API = process.env.VUE_APP_URL;
export const api = {
  // routes des sections
  SECTIONS_LIST: URL_API + "api/templates/section/list",
  SECTIONS_CREATE: URL_API + "api/templates/section/create",
  SECTIONS_UPDATE: URL_API + "api/templates/section/update/",
  SECTIONS_DELETE: URL_API + "api/templates/section/delete/",
  SECTIONS_SHOW: URL_API + "api/templates/section/show/",
  // routes des pages
  PAGES_LIST: URL_API + "api/templates/page/list",
  PAGES_CREATE: URL_API + "api/templates/page/create",
  PAGES_UPDATE: URL_API + "api/templates/page/update/",
  PAGES_DELETE: URL_API + "api/templates/page/delete/",
  PAGES_SHOW: URL_API + "api/templates/page/show/",
  // routes site
  SITE_GENERATE: URL_API + "api/site/modelecopy/",
  SITE_LIST: URL_API + "api/site/list",
  SITE_JSON: URL_API + "api/site/json/", // prévoir refacto coté back
  SITE_GENERATE_JSON: URL_API + "api/site/json/create",
  SITE_ROUTES_CREATE: URL_API + "api/site/routes/create",
  SITE_PAGES_GENERATE: URL_API + "api/site/pages/generate",
  SITE_PAGES_FILE_CREATE: URL_API + "api/site/pages/file/create",

  // routes des modules
  MODULE_CREATE: URL_API + "api/module/create",
  MODULE_LIST: URL_API + "api/module/list",
  MODULE_DELETE: URL_API + "api/module/delete/",
  MODULE_SHOW: URL_API + "api/module/show/",
  MODULE_EDIT: URL_API + "api/module/update/",
  MODULE_COPY: URL_API + "api/module/copy",
  // MODULE_CREATE_JSON_SITE: URL_API + "api/module/config/create",
  MODULE_LIST_SITE: URL_API + "api/module/config/list/"
};

//...
