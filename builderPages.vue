<template>
  <!-- Pour des raisons de confidentialités, seul une partie du code est visible -->
  <layout-default>
    <div class="home">
      <h1 class="green" v-if="currentSite">
        <i class="fa fa-smile-o fa-4" aria-hidden="true"></i> Site connecté :
        <strong>{{ currentSite }}</strong>
      </h1>
      <h1 class="red" v-else><i class="fa fa-exclamation-triangle fa-4" aria-hidden="true"></i> Aucun site connecté !</h1>
    </div>

    <div class="row" v-if="currentSite">
      <div class="col-md-12 text-center">
        <div class="btn-group" role="group" aria-label="Basic example">
          <button class="btn btn-primary" type="button" disabled v-if="loaderRoutes">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Processing...
          </button>
          <button @click="generateRoutes(true)" v-if="!loaderRoutes" type="button" class="btn btn-success"><i class="fa fa-road" aria-hidden="true"></i> Sauvegarder les routes</button>
          <button @click="showModaladdPage()" type="button" class="btn btn-info"><i class="fa fa-plus-square" aria-hidden="true"></i> Ajouter une route</button>
          <button @click="disconnectSite()" type="button" class="btn btn-danger"><i class="fa fa-chain-broken" aria-hidden="true"></i> Se déconnecter</button>
        </div>
      </div>
    </div>

    <div class="row" v-else>
      <div class="col-md-6 text-right">
        <button @click="showModalAddSite()" v-if="!currentSite" type="button" class="btn btn-primary"><i class="fa fa-refresh" aria-hidden="true"></i> Générer un site</button>
      </div>
      <div class="col-md-6 text-left">
        <div class="row">
          ou
          <div class="col-md-3">
            <input type="text" v-model="searchSite" class="form-control" placeholder="Connecter un site" />
          </div>
          <div class="col-md-4">
            <div class="wrapper text-left" v-if="searchSite.length > 1">
              <div v-for="site in filteredFolders" :key="site.id">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="connectSite(site)">
                  <i class="fa fa-link" aria-hidden="true"></i>
                  {{ site }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-warning alert-dismissible fade show my-2" role="alert" v-if="messageSystem">
      {{ messageSystem }}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="emptyAlert()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="alert alert-danger alert-dismissible fade show my-2" role="alert" v-if="messageError">
      <strong>{{ messageError }}</strong>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="emptyAlert()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <!-- LISTE DES ROUTES -->
    <div class="col-md-12" v-if="currentSite">
      <section v-for="(zone, idx) in arrayZones" :key="idx + '+' + zone">
        <h2 v-if="filteredDispo(zone) && filteredDispo(zone).length > 0 && zone != 'Haut-Catégories-dropdown'">{{ zone }}</h2>

        <table class="table table-striped table-bordered" v-if="filteredDispo(zone) && filteredDispo(zone).length > 0 && zone != 'Haut-Catégories-dropdown'">
          <thead class="thead-light">
            <tr>
              <!-- <th scope="col" colspan="2">Gestion modules</th> -->
              <th>Générer la page</th>
              <th scope="col">Libellé</th>
              <th scope="col">Icone</th>
              <th scope="col">Slug</th>
              <th scope="col">Menu</th>
              <th scope="col">Ordre</th>
              <th scope="col">Layout</th>
              <th scope="col">Sup.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(page, index) in filteredDispo(zone)" :key="index + '-' + page.slug">
              <!-- Commenté temporairement en attendant de revoir la gestion des modules -->
              <!--
              <td>
                <button type="button" class="btn btn-warning btn-sm" @click="showModalConfigModules(page)" :disabled="page.disposition === 'Dropdown'"><i class="fa fa-cog" aria-hidden="true"></i> Modules</button>
              </td>

              <td style="width:200px">
                <span v-for="modulePage in page.modules" :key="modulePage.module" class="badge badge-pill badge-secondary m-1">{{ modulePage.module }}</span>
              </td>
              -->
              <td>
                <button type="button" class="btn btn-warning" @click="generatePage(page)"><i class="fa fa-warning" aria-hidden="true"></i> Générer</button>
                <!-- <select v-model="page.createPage" class="form-control">
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select> -->
              </td>
              <td>
                <input type="text" class="form-control" v-model="page.libelle" :disabled="page.disposition === 'Dropdown'" />
              </td>
              <td>
                <input type="text" class="form-control" v-model="page.icone" disabled />
              </td>

              <td>
                <input type="text" class="form-control" v-model="page.slug" :disabled="page.disposition === 'Dropdown'" />
              </td>

              <td>
                <select class="form-control" v-model="page.disposition" @change="setupDD($event, page, index)">
                  <optgroup label="ZONES">
                    <option selected value="Non actif">Non actif</option>
                    <option value="Haut">Haut</option>
                    <option value="Haut-Catégories-dropdown">-- Catégories Dropdown</option>
                    <option value="Gauche">Gauche</option>
                    <option value="All">All</option>
                    <option value="Core">Core</option>
                    <option value="Dropdown">Dropdown</option>
                  </optgroup>
                  <optgroup label="MENU DROPDOWN" v-if="page.disposition !== 'Dropdown'">
                    <option v-for="dropHead in arrayDrop" :key="dropHead.libelle" :value="dropHead.parent.libelle">{{ dropHead.parent.libelle }}</option>
                  </optgroup>
                </select>
              </td>

              <td class="ordre-col">
                <input type="number" class="form-control input-sm text-center" v-model="page.ordre" />
              </td>

              <td>
                <div class="alert alert-danger" role="alert">En attente</div>
                <!--
                  <select
                  class="form-control"
                  v-model="page.layout"
                  :disabled="page.disposition === 'Dropdown'"
                >
                  <optgroup label="LAYOUT">
                    <option value="no-aside">No Aside</option>
                    <option value="aside-left">Aside Left</option>
                    <option value="aside-right">Aside Right</option>
                    <option value="no-header-aside-left">No Header Aside Left</option>
                    <option value="no-header-aside-right">No Header Aside Right</option>
                    <option value="no-header-no-aside">No Header No aside</option>
                    <option value="nav-only">Nav only</option>
                  </optgroup>
                  <optgroup label="TEMPLATES">
                    <option v-for="template in pageTemplates" :key="template.id">{{ template.name }}</option>
                  </optgroup>
                </select>
                -->
              </td>

              <td>
                <button type="button" @click="removePage(page)" class="btn btn-danger btn-sm" :disabled="page.disposition === 'Dropdown'">
                  <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <!-- <pre>{{ listePages }}</pre> -->
      <!-- <hr />
      <pre>{{ arrayDrop }}</pre>-->
    </div>
    <!-- Modal modules-->
    <modal-modules v-show="isModalVisible" @close="closeModal" @newModule="updateModule" :selectedPage="selectedPage"></modal-modules>
    <!-- Modal add page -->
    <modal-add-page v-show="isModalVisibleAddPage" @close="closeModal" @newPage="addPage"></modal-add-page>
    <!-- Modal add site -->
    <modal-add-site v-show="isModalVisibleAddSite" @close="closeModal" @newSite="addSite"></modal-add-site>
  </layout-default>
</template>

<script>
/* eslint-disable space-before-function-paren */
/* eslint-disable quotes */
/* eslint-disable semi */
// import Vue from "vue";
import { mapState } from "vuex";
import ModalModules from "@/components/ModalModules.vue";
import ModalAddPage from "@/components/ModalAddPage.vue";
import ModalAddSite from "@/components/ModalAddSite.vue";
import LayoutDefault from "@/layouts/LayoutDefault.vue";
import jsonDefaultRoutes from "@/datas/default-routes.json";

export default {
  components: {
    "layout-default": LayoutDefault,
    "modal-modules": ModalModules,
    "modal-add-page": ModalAddPage,
    "modal-add-site": ModalAddSite,
  },
  computed: {
    filteredFolders: function () {
      return this.listFolders.filter((folder) => {
        return folder.toLowerCase().match(this.searchSite.toLowerCase());
      });
    },
    ...mapState({
      currentSite: "currentSite",
    }),
  },
  mounted: function () {
    this.getCurrentSite();
    this.loadRoutes();
    this.loadSites();
    this.fetchTemplates();
  },
  data() {
    return {
      arrayZones: ["Haut", "Gauche", "All", "Non actif", "Dropdown"],
      listeModules: [],
      listePages: [],
      isModalVisible: false,
      isModalVisibleAddPage: false,
      isModalVisibleAddSite: false,
      selectedPage: null,
      pageTemplates: [],
      // currentSite: "",
      messageSystem: "",
      messageError: "",
      listFolders: [],
      searchSite: "",
      jsonDefaultRoutes,
      loaderRoutes: false,
      arrayDrop: [],
    };
  },
  methods: {
    emptyAlert() {
      this.messageSystem = "";
      this.messageError = "";
    },

    generatePage(page) {
      let payload = {
        siteName: this.currentSite,
        page: page,
      };
      // EN COURS
      this.$axios
        .post(this.$api.SITE_PAGES_FILE_CREATE, payload)
        .then((response) => {
          console.log("Page généré ou pas", response);
          // faire alerte message
        })
        .catch((error) => {
          console.log("error", error);
        });
    },

    async setupDD(event, page, index, indexDD) {
      let zoneTarget = event.target.value;

      // ajout des nouvelles zone dans la liste
      if (!this.arrayZones.includes(zoneTarget)) {
        this.arrayZones.push(zoneTarget);
      }

      // si supression deplacement parent, alors enfant sont recatégorisés
      if (zoneTarget !== "Dropdown") {
        this.listePages.forEach((infoPage, idx) => {
          if (infoPage.disposition === page.libelle) {
            this.listePages[idx].disposition = "Non actif";
          }
        });
      }

      // on vide les modules si element dropdown
      if (zoneTarget === "Dropdown") {
        page.modules = [];
      }

      await this.generateRoutes();
    },

    filteredDispo(zone) {
      if (this.listePages.length > 0) {
        return this.listePages.filter((page) => {
          return page.disposition.toString() === zone;
          // return page.disposition.match(zone);
        });
      }
    },

    fetchTemplates() {
      this.$axios
        .get(this.$api.PAGES_LIST)
        .then((response) => {
          if (response.data.pages.length > 0) {
            this.pageTemplates = response.data.pages;
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    loadRoutes() {
      this.listePages = [];
      // si currentSite, alors fetch routes du site
      // sinon fetch default routes

      if (this.currentSite) {
        this.$axios
          .get(this.$api.SITE_JSON + this.currentSite + "/config-routes")
          .then((response) => {
            this.listePages = response.data.dataJson;
            // console.log("listePages", this.listePages);
            // traitement dropdown 1
            this.arrayDrop = [];
            if (this.listePages.length > 0) {
              this.listePages.forEach((el, idx) => {
                if (el.disposition === "Dropdown") {
                  let newDrop = {
                    parent: el,
                    childrens: [],
                  };
                  this.arrayDrop.push(newDrop);
                }

                if (!this.arrayZones.includes(el.disposition)) {
                  this.arrayZones.push(el.disposition);
                }
              });

              // ajout des childrens dropdown
              // TODO: A vérifier utilité
              this.listePages.forEach((el, idx) => {
                if (!this.arrayZones.includes(el.disposition)) {
                  this.arrayDrop.forEach((elmDrop) => {
                    if (elmDrop.parent.libelle === el.disposition) {
                      elmDrop.childrens.push(el);
                    }
                  });
                }
              });
              console.log("this.listePages", this.listePages);
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else {
        // console.log("je dois récupérer routes par default");
        this.jsonDefaultRoutes.forEach((el) => {
          this.listePages.push(el);
        });
      }

      this.listePages = this.listePages.sort(function (a, b) {
        return parseFloat(a.ordre) - parseFloat(b.ordre);
      });
    },
    addPage($event) {
      this.listePages.push($event);
    },
    addSite($event) {
      this.emptyAlert();
      this.messageSystem = $event.message;
      if ($event.sitename) {
        this.$store.dispatch("siteConnect", $event.sitename);
        if (this.currentSite) {
          // pour actualiser la liste des routes avec celles présentes sur le git
          this.loadRoutes();
        }
        this.loadSites();
      }
    },
    removePage(page) {
      let indice = 0;
      this.listePages.forEach((elm, index) => {
        if (elm === page) {
          this.listePages.splice(indice, 1);
          return;
        }
        indice++;
      });
      this.generateRoutes();
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.isModalVisibleAddPage = false;
      this.isModalVisibleAddSite = false;
    },
    removeModule(page, modulePage, idx) {
      //
    },
    updateModule() {
      console.log("j'update le module");
    },
    showModaladdPage() {
      this.isModalVisibleAddPage = true;
    },
    showModalAddSite() {
      this.isModalVisibleAddSite = true;
    },
    showModalConfigModules(page) {
      this.selectedPage = page;
      this.isModalVisible = true;
    },
    getCurrentSite() {
      if (localStorage.getItem("currentSite")) {
        this.$store.dispatch("siteConnect", localStorage.getItem("currentSite"));
      }
    },
    loadSites() {
      this.$axios
        .get(this.$api.SITE_LIST)
        .then((response) => {
          this.listFolders = response.data.allFolder;
          // console.log("response", response.data.allFolder);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    connectSite(siteName) {
      this.emptyAlert();
      if (siteName !== "") {
        this.$store.dispatch("siteConnect", siteName);
        this.loadRoutes();
      }
    },
    disconnectSite() {
      this.emptyAlert();
      this.searchSite = "";
      this.$store.dispatch("siteDisconnect");
      this.messageError = "Site déconnecté";
      this.loadRoutes();
    },

    async generateRoutes(generagePageToo) {
      this.loaderRoutes = true;
      let payload = {
        name: this.currentSite,
        fileName: "config-routes",
        json: this.listePages,
      };

      this.$axios
        .post(this.$api.SITE_GENERATE_JSON, payload)
        .then((response) => {
          this.checkConfigProducts();
          // window.location.href = "./"; // a decommenter
        })
        .then((resp) => {
          if (generagePageToo) {
            let payloadGenerate = {
              siteName: this.currentSite,
              routes: this.listePages,
            };
            this.$axios
              .post(this.$api.SITE_PAGES_GENERATE, payloadGenerate)
              .then((resp) => {
                console.log("pages are generated");
              })
              .catch((error) => {
                console.log("error", error);
              });
          }
        })
        .catch((error) => {
          console.log("error", error);
        })
        .then(() => {
          this.loaderRoutes = false;
        });
    },
    // vérifier si config-products existe, si c'est pas le cas création d'une config de base
    async checkConfigProducts() {
      this.$axios
        .get(this.$api.SITE_JSON + this.currentSite + "/config-products")
        .then((resp) => {
          if (!resp.data.dataJson) {
            let payload = {
              name: this.currentSite,
              fileName: "config-products",
              json: [],
            };
            this.generateJsonConfigProducts(payload);
            //
          } else {
            console.log("config products existe deja");
            this.createRoutes();
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    generateJsonConfigProducts(payload) {
      this.$axios
        .post(this.$api.SITE_GENERATE_JSON, payload)
        .then((response) => {
          console.log("config-products créé");
          this.createRoutes();
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // création du fichier routes.js qui sert pour le parametrage du router du cms
    createRoutes() {
      let payload = {
        name: this.currentSite,
        fileName: "routes",
      };
      this.$axios
        .post(this.$api.SITE_ROUTES_CREATE, payload)
        .then((response) => {
          console.log("response routes.js", response.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
};
</script>
<style>
.ordre-col {
  width: 90px;
}
.red {
  color: darkred;
}
.green {
  color: darkgreen;
}
h1 strong {
  color: goldenrod;
}
.wrapper {
  /* width:200px;
padding:20px; */
  max-height: 150px;
  overflow: auto;
}
</style>
