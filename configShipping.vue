<template>
  <layout-default>
    <h1>Frais de port</h1>
    <div class="row">
      <div class="col-md-12">
        <button type="button" class="btn btn-primary" @click="newFp()">
          <i class="fa fa-plus-square" aria-hidden="true"></i>
          Ajouter un type de frais de port
        </button>
        <button type="button" class="btn btn-success ml-2" @click="saveJsonFp()">
          <i class="fa fa-check-square-o" aria-hidden="true"></i>
          Sauvegarder
        </button>
      </div>
    </div>
    <div class="row my-2">
      <div class="col-md-12">
        <table class="table">
          <thead>
            <tr>
              <th>Actions</th>
              <th>Actif</th>
              <th>Type de frais de port</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(shipping, index) in shippingTypes" :key="shipping.id">
              <td>
                <div class="btn-group" role="group" aria-label="Basic example">
                  <button type="button" class="btn btn-info" @click="editFp(index, shipping.type)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</button>
                  <button type="button" class="btn btn-danger" @click="deleteFp(index)"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</button>
                </div>
              </td>
              <td>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="true" v-model="shipping.actif" />
                </div>
              </td>
              <td>
                <div class="form-group" @change="updateLibelle(shipping.type, index)">
                  <input type="text" class="form-control" placeholder="Type" v-model="shipping.type" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr />

    <div class="row" v-if="selectedType[0]">
      <!-- <pre>{{selectedType[0].tarifs}}</pre> -->
      <div class="col-md-12">
        <table class="table table-striped">
          <thead>
            <tr>
              <th width="20%">Infos</th>
              <th width="20%">Descriptif</th>
              <th width="20%">Pays</th>
              <th width="30%">Tranches de poids</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tarif, idx) in selectedType[0].tarifs" :key="tarif.id">
              <td>
                <div class="row">
                  <div class="col-md-6">
                    <strong>Libellé :</strong>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input type="text" class="form-control" placeholder=" ex: 60" v-model="tarif.libelle" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <strong>Calcul :</strong>
                  </div>
                  <div class="col-md-6">
                    <select v-model="shippingTypes[selectedIndexTypeFP].modes[idx].calcul" class="form-control mb-3">
                      <option value>Aucun calcul</option>
                      <option value="poids">Au poids</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <strong>Zone :</strong>
                  </div>
                  <div class="col-md-6">
                    <select v-model="shippingTypes[selectedIndexTypeFP].modes[idx].zone" class="form-control mb-3">
                      <option value>Aucun zone</option>
                      <option value="pays">Pays</option>
                      <option value="cp">Code postal</option>
                      <option value="transporteur">Transporteur</option>
                    </select>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <strong>Franco :</strong>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input type="text" class="form-control" placeholder=" ex: 60" v-model="tarif.franco" />
                    </div>
                  </div>
                </div>
                <div class="row" v-show="shippingTypes[selectedIndexTypeFP].modes[idx].calcul != 'poids'">
                  <div class="col-md-6">
                    <strong>Montant :</strong>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input type="text" class="form-control" placeholder=" ex: 10" v-model="tarif.prix" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <strong>Actif :</strong>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="true" v-model="tarif.actif" />
                    </div>
                  </div>
                </div>
              </td>

              <td>
                <div class="form-group">
                  <textarea class="form-control" cols="30" rows="10" v-model="shippingTypes[selectedIndexTypeFP].modes[idx].description"></textarea>
                </div>

                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="true" v-model="shippingTypes[selectedIndexTypeFP].modes[idx].afficheDescription" />
                  <i class="fa fa-eye-slash" aria-hidden="true"></i>
                </div>
              </td>
              <td>
                <div class="form-group">
                  <textarea class="form-control" cols="30" rows="10" v-model="shippingTypes[selectedIndexTypeFP].modes[idx].pays"></textarea>
                </div>
              </td>

              <td>
                <table class="table" v-show="shippingTypes[selectedIndexTypeFP].modes[idx].calcul == 'poids'">
                  <thead>
                    <tr>
                      <th>Poids min (kg)</th>
                      <th>Poids max (kg)</th>
                      <th>Prix (€)</th>
                      <th>Sup.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(tranche, idx2) in tarif.poids" :key="idx2 + '-' + idx">
                      <td>
                        <div class="form-group">
                          <input type="text" class="form-control" placeholder="Type" v-model="tranche.min" />
                        </div>
                      </td>
                      <td>
                        <div class="form-group">
                          <input type="text" class="form-control" placeholder="Type" v-model="tranche.max" />
                        </div>
                      </td>
                      <td>
                        <div class="form-group">
                          <input type="text" class="form-control" placeholder="Type" v-model="tranche.prix" />
                        </div>
                      </td>
                      <td>
                        <button type="button" class="btn btn-danger" @click="deleteTranche(tarif.poids, idx2)">
                          <i class="fa fa-trash-o" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button type="button" class="btn btn-info" @click="addTranche(tarif.poids)" v-show="shippingTypes[selectedIndexTypeFP].modes[idx].calcul == 'poids'">Ajouter une tranche</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="btn btn-warning" @click="addTarif()">Ajouter un tarif</button>
      </div>
    </div>
  </layout-default>
</template>
<script>
/* eslint-disable no-unreachable */
/* eslint-disable space-before-function-paren */
/* eslint-disable quotes */
/* eslint-disable semi */
// import Vue from "vue";
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
    this.loadCurrentPreset("config-fp");
    this.loadCurrentPreset("config-fp-tarifs");
  },
  data() {
    return {
      messageSystem: "",
      shippingTypes: [],
      shippingFees: [],
      currentAction: null,
      selectedIndexTypeFP: 0,
      selectedType: "",
    };
  },
  methods: {
    // editFp(index, typeFP) {
    editFp(index) {
      this.selectedIndexTypeFP = index;
      // this.selectedType = this.shippingFees.filter(shipping => {
      //   return shipping.type.toLowerCase().match(typeFP.toLowerCase());
      // });
      this.selectedType = [this.shippingFees[index]];
      this.selectedType[0].type = this.shippingTypes[index].type;
    },
    getCurrentSite() {
      if (localStorage.getItem("currentSite")) {
        this.$store.dispatch("siteConnect", localStorage.getItem("currentSite"));
      }
    },
    loadCurrentPreset(fileName) {
      this.$axios
        .get(this.$api.SITE_JSON + this.currentSite + "/" + fileName)
        .then((response) => {
          // console.log("response.data", response.data.dataJson);

          switch (fileName) {
            case "config-fp":
              this.shippingTypes = response.data.dataJson;
              break;
            case "config-fp-tarifs":
              this.shippingFees = response.data.dataJson;
              break;
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    addTranche(currendFp) {
      currendFp.push({
        min: currendFp[currendFp.length - 1].max,
        max: 0,
        prix: 0,
      });
    },
    deleteTranche(tarif, indexT) {
      tarif.splice(indexT, 1);
    },
    deleteFp(index) {
      this.shippingTypes.splice(index, 1);
      this.shippingFees.splice(index, 1);
    },
    saveJsonFp() {
      let payload1 = {
        name: this.currentSite,
        fileName: "config-fp",
        json: this.shippingTypes,
      };
      let payload2 = {
        name: this.currentSite,
        fileName: "config-fp-tarifs",
        json: this.shippingFees,
      };

      let req1 = this.$axios.post(this.$api.SITE_GENERATE_JSON, payload1);
      let req2 = this.$axios.post(this.$api.SITE_GENERATE_JSON, payload2);
      // promess all axios

      this.$axios
        .all([req1, req2])
        .then((response) => {
          // this.$router.push("modules/list");
          console.log("FP ok");
        })
        .catch((error) => {
          this.messageSystem = "Une erreur est survenu, Frais de port non enregistrés";
          console.log(error);
        });
    },
    updateLibelle(type, idx) {
      this.shippingTypes[idx].type = type;
      this.shippingFees[idx].type = type;
    },
    newFp() {
      console.log("add new fp");
      let emptyShippingTypes = {
        type: "Nouveau type" + parseInt(this.shippingTypes.length + 1),
        actif: false,
        modes: [
          {
            libelle: "",
            pays: [],
            actif: true,
            description: "",
            calcul: "",
            afficheDescription: true,
            zone: "",
          },
        ],
      };
      let emptyShippingFees = {
        type: "Nouveau type" + parseInt(this.shippingTypes.length + 1),
        tarifs: [
          {
            libelle: "",
            franco: "",
            poids: [
              {
                min: 0.001,
                max: 0.25,
                prix: 4.95,
              },
            ],
          },
        ],
      };
      this.shippingTypes.push(emptyShippingTypes);
      this.shippingFees.push(emptyShippingFees);
    },
    addTarif(idx) {
      let emptyTypeVariant = {
        libelle: "",
        franco: 0,
        poids: [
          {
            min: 0.001,
            max: 0.25,
            prix: 4.95,
          },
        ],
        prix: 0,
        actif: false,
      };
      let emptyTarif = {
        actif: false,
        afficheDescription: true,
        calcul: "",
        description: "",
        libelle: "",
      };
      this.shippingTypes[this.selectedIndexTypeFP].modes.push(emptyTarif);
      this.selectedType[0].tarifs.push(emptyTypeVariant);
    },
  },
};
</script>
