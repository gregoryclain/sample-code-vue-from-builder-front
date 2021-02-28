<template>
  <layout-default>
    <div class="home">
      <h1>Liste des modules</h1>
    </div>
    <div class="container-fluid">
      <div class="alert alert-warning alert-dismissible fade show my-2" role="alert" v-if="messageSystem">
        {{ messageSystem }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="emptyAlert()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="row">
        <!-- liste des modèles de modules -->
        <div class="col-md-6">
          <h4>Modules disponibles</h4>
          <table class="table">
            <thead>
              <tr>
                <th>Supprimer</th>
                <th>Nom du module</th>
                <th>Module</th>
                <th>Modifier</th>
                <th>Copier</th>
                <th v-if="currentSite">Utiliser</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mod, index) in modulesList" :key="mod._id">
                <td>
                  <button @click="removeModule(mod, index, 'serveur')" type="button" class="btn btn-danger btn-sm">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                  </button>
                </td>
                <td>{{ mod.name }}</td>
                <td>{{ mod.id }}</td>
                <td>
                  <button @click="goToEditModule(mod, 'serveur')" yype="button" class="btn btn-primary btn-sm">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                  </button>
                </td>
                <td>
                  <button @click="copyModule(mod, 'serveur', index)" type="button" class="btn btn-info btn-sm">
                    <i class="fa fa-files-o" aria-hidden="true"></i>
                  </button>
                </td>
                <td v-if="currentSite">
                  <button @click="addModuleToSite(mod)" type="button" class="btn btn-success btn-sm">
                    Ajouter
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
              <tr v-for="iMod in immutableLinks" :key="iMod._id">
                <td colspan="3">{{ iMod.name }}</td>
                <td></td>
                <td></td>
                <td v-if="currentSite">
                  <button @click="addModuleToSite(iMod)" type="button" class="btn btn-success btn-sm">
                    Ajouter
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- liste des modules utilisés par le site -->
        <div class="col-md-6" v-if="currentSite">
          <h4>Modules ajoutés au site</h4>
          <table class="table">
            <thead>
              <tr>
                <th>Ordre</th>
                <th>Nom du module</th>
                <th>Module</th>
                <th>Role</th>
                <th>Edit.</th>
                <th>Copier</th>
                <th>Sup.</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mod, index) in modulesUsed" :key="mod._id + generateIdKey()">
                <td width="100px">
                  <input class="form-control" type="number" v-model="mod.ordre" />
                </td>
                <td>{{ mod.name }}</td>
                <td>{{ mod.module }}</td>
                <td class="zoneRoles">
                  <select class="form-control" v-model="mod.roles">
                    <option value>Non défini</option>
                    <option value="'ROLE_CLIENT', 'ROLE_COMMERCIAL', 'ROLE_ADMIN'">ROLE_CLIENT</option>
                    <option value="'ROLE_COMMERCIAL', 'ROLE_ADMIN'">ROLE_COMMERCIAL</option>
                    <option value="'ROLE_ADMIN'">ROLE_ADMIN</option>
                  </select>
                </td>
                <td>
                  <button @click="goToEditModule(mod, 'site', index)" type="button" class="btn btn-primary btn-sm" v-if="mod.type == 'module'">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                  </button>
                </td>
                <td>
                  <button @click="copyModule(mod, 'site', index)" type="button" class="btn btn-info btn-sm" v-if="mod.type == 'module'">
                    <i class="fa fa-files-o" aria-hidden="true"></i>
                  </button>
                </td>
                <td>
                  <button @click="removeModule(mod, index, 'site')" type="button" class="btn btn-danger btn-sm">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <td colspan="7">
                <button @click="updateConfigModulesSite()" type="button" class="btn btn-info btn-sm"><i class="fa fa-sort" aria-hidden="true"></i> Sauvegarder</button>
              </td>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </layout-default>
</template>

<script>
/* eslint-disable no-unreachable */
/* eslint-disable space-before-function-paren */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable comma-dangle */
import Vue from "vue";
import { mapState } from "vuex";
import LayoutDefault from "@/layouts/LayoutDefault.vue";
export default {
  computed: {
    ...mapState({
      currentSite: "currentSite",
      configCurrentSite: "configCurrentSite",
    }),
  },
  components: {
    "layout-default": LayoutDefault,
  },
  mounted: function () {
    this.getCurrentSite();
    this.loadmodulesList();
  },
  data() {
    return {
      messageSystem: "",
      modulesList: [],
      modulesUsed: [],

      // variable update menu admin
      menuLinks: [],
      menuClient: [],
      menuCommerciaux: [],
      menuAdmin: [],
      modulesActif: [],

      // modules immuables
      immutableLinks: [
        {
          name: "Gestion des catégories",
          icon: "clear_all",
          href: "admin-categories-liste",
          module: "",
          ordre: 20,
          type: "core",
          roles: "'ROLE_CLIENT', 'ROLE_COMMERCIAL', 'ROLE_ADMIN'",
          _id: this.generateIdKey(),
        },
        {
          name: "Gestion Frais de port",
          icon: "time_to_leave",
          href: "",
          module: "",
          ordre: 21,
          type: "core",
          roles: "'ROLE_CLIENT', 'ROLE_COMMERCIAL', 'ROLE_ADMIN'",
          _id: this.generateIdKey(),
        },
        {
          name: "Gestion Référencement",
          icon: "stars",
          href: "admin-referencement",
          module: "",
          ordre: 22,
          type: "core",
          roles: "'ROLE_COMMERCIAL', 'ROLE_ADMIN'",
          _id: this.generateIdKey(),
        },
        {
          name: "Configuration site client",
          icon: "settings",
          href: "admin-config-site",
          module: "",
          ordre: 23,
          type: "core",
          roles: "'ROLE_ADMIN'",
          _id: this.generateIdKey(),
        },
        {
          name: "Gestion utilisateurs",
          icon: "supervisor_account",
          href: "admin-users-liste",
          module: "",
          ordre: 24,
          type: "core",
          roles: "'ROLE_ADMIN'",
          _id: this.generateIdKey(),
        },
      ],
    };
  },
  methods: {
    generateIdKey() {
      let valueRand = Math.round(Math.random() * 100000);
      valueRand += new Date().getTime();
      return valueRand;
    },
    emptyAlert() {
      this.messageSystem = "";
    },
    goToEditModule(mod, cat, index) {
      if (cat === "serveur") {
        this.$router.push("/modules?edit=" + mod._id);
      } else if (cat === "site") {
        let payload = {
          mod: JSON.stringify(mod),
          index: index,
        };
        this.$store.dispatch("moduleSiteUpdate", payload); // error
        this.$router.push("/modules?editsite=" + mod._id);
      }
    },
    removeModule(mod, index, cat) {
      if (cat === "site") {
        this.modulesUsed.splice(index, 1);
        this.updateConfigModulesSite();
      } else if (cat === "serveur") {
        // mettre a jour la base
        this.$axios
          .delete(this.$api.MODULE_DELETE + mod._id)
          .then((response) => {
            this.modulesList.splice(index, 1);
            this.messageSystem = "Modèle de module supprimé du serveur !";
          })
          .catch((error) => {
            console.log("error", error);
            this.messageSystem = "un problème est survenu, suppression impossible";
          });
      }
    },
    addModuleToSite(mod) {
      this.modulesUsed.push(mod);
      this.updateConfigModulesSite();
    },
    copyModule(mod, cat, index) {
      if (cat === "serveur") {
        this.$axios
          .post(this.$api.MODULE_COPY, mod)
          .then((response) => {
            this.modulesList.push(response.data.last);
            // todo récupérer la réponse pour mettre à jour la liste
          })
          .catch((error) => {
            console.log("error", error);
            this.messageSystem = "un problème est survenu, copie impossible";
          });
      } else if (cat === "site") {
        this.modulesUsed.push(mod);
        this.updateConfigModulesSite();
      }
    },
    updateConfigModulesSite() {
      let payload = {
        name: this.currentSite,
        fileName: "config-products",
        json: this.modulesUsed,
      };

      this.$axios
        .post(this.$api.SITE_GENERATE_JSON, payload)
        .then((response) => {
          console.log("config products REGENERATED", response);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    loadmodulesList() {
      // modules serveur
      this.$axios
        .get(this.$api.MODULE_LIST)
        .then((response) => {
          this.modulesList = response.data.modules;
          console.log("modulesList", this.modulesList);
        })
        .catch((error) => {
          console.log("error", error);
        });

      // modules site
      if (this.currentSite) {
        this.$axios
          .get(this.$api.MODULE_LIST_SITE + this.currentSite)
          .then((response) => {
            this.modulesUsed = response.data.list;

            // si modification module site
            if (this.$route.query.editSite) {
              if (localStorage.getItem("configModule")) {
                let moduleUpdated = JSON.parse(localStorage.getItem("configModule"));
                let idx = localStorage.getItem("configModuleIndex");

                if (localStorage.getItem("configModuleIndex")) {
                  Vue.set(this.modulesUsed, idx, moduleUpdated);
                } else {
                  this.modulesUsed.push(moduleUpdated);
                }

                this.updateConfigModulesSite();
              }
            }
            this.$store.dispatch("moduleSiteUpdateClear");
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
    },
    getCurrentSite() {
      if (localStorage.getItem("currentSite")) {
        this.$store.dispatch("siteConnect", localStorage.getItem("currentSite"));
      }
    },
  },
};
</script>
<style scoped>
.zoneRoles {
  font-size: 0.7em;
}
</style>
