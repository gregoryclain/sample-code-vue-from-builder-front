<template>
  <layout-default>
    <div class="container-fluid">
      <div class="home">
        <h1 v-if="!isEdit && !isEditSite">
          Créer un module
          <div class="btn-group" role="group" aria-label="Basic example">
            <button v-if="currentSite" type="button" class="btn btn-success" @click="saveModule('site')">Enregistrer pour le site</button>
            <button type="button" class="btn btn-warning" @click="saveModule('serveur')">Enregistrer comme modèle</button>
          </div>
        </h1>
        <h3 v-if="isEdit">
          Modifier le module d'ID : {{ isEdit }}
          <button type="button" class="btn btn-warning" @click="saveModule('serveur')">Sauvegarder</button>
        </h3>
        <h3 v-if="isEditSite">
          Edition du module d'ID {{ isEditSite }}
          <button type="button" class="btn btn-warning" @click="saveModule('site')">Sauvegarder</button>
        </h3>
      </div>
      <div class="alert alert-warning alert-dismissible fade show my-2" role="alert" v-if="messageSystem">
        {{ messageSystem }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="emptyAlert()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="row">
        <div class="col-md-2"></div>
        <div class="col-md-8">
          <nav class="nav nav-tabs nav-justified">
            <a class="nav-item nav-link active" href="#p1" data-toggle="tab"> <i class="fa fa-list" aria-hidden="true"></i> Champs </a>
            <a class="nav-item nav-link" href="#p2" data-toggle="tab"> <i class="fa fa-file-video-o" aria-hidden="true"></i> Medias </a>
            <a class="nav-item nav-link" href="#p3" data-toggle="tab"> <i class="fa fa-code-fork" aria-hidden="true"></i> Déclinaisons </a>
            <a class="nav-item nav-link" href="#p4" data-toggle="tab"> <i class="fa fa-money" aria-hidden="true"></i> Prix </a>
            <a class="nav-item nav-link" href="#p5" data-toggle="tab"> <i class="fa fa-folder-o" aria-hidden="true"></i> Catégories </a>

            <a class="nav-item nav-link" href="#p6" data-toggle="tab"> <i class="fa fa-gavel" aria-hidden="true"></i> Formats </a>
            <a class="nav-item nav-link" href="#p7" data-toggle="tab"> <i class="fa fa-cog" aria-hidden="true"></i> Config </a>
          </nav>
        </div>
        <div class="col-md-2"></div>
        <div class="col-md-12 text-center">
          <div class="tab-content mt-2">
            <!-- Contenu config champs -->
            <div class="tab-pane active" id="p1">
              <div class="row">
                <div class="col-md-2"></div>
                <div class="col-md-8">
                  <p>
                    <button @click="addChamps()" type="button" class="btn btn-primary"><i class="fa fa-plus" aria-hidden="true"></i> Nouveau champ</button>
                  </p>
                  <table class="table" v-if="moduleConfig.config.length > 0">
                    <thead>
                      <tr>
                        <th>Sup.</th>
                        <th>Afficher en liste</th>
                        <th>Libellé</th>
                        <th>Valeur par défaut</th>
                        <th>Type de champs</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(champ, index) in moduleConfig.config" :key="champ.id">
                        <td>
                          <button type="button" class="btn btn-danger btn-sm" @click="removeChamps(index)">
                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                          </button>
                        </td>
                        <td>
                          <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="exampleCheck1" value="1" v-model="moduleConfig.config[index].affiche" />
                          </div>
                        </td>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.config[index].libelle" />
                        </td>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.config[index].default" />
                        </td>
                        <td>
                          <select class="form-control" id="exampleFormControlSelect1" v-model="moduleConfig.config[index].type">
                            <option value="titre">Titre</option>
                            <option value="description">Description</option>
                            <option value="switch">Switch</option>
                            <option value="liste">Liste</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-2"></div>
              </div>
            </div>
            <!-- Contenu config médias -->
            <div class="tab-pane" id="p2">
              <div class="row">
                <div class="col-md-2"></div>
                <div class="col-md-8">
                  <div class="row">
                    <div class="col-md-4">
                      <button type="button" class="btn btn-primary" @click="addMedias('image')"><i class="fa fa-plus" aria-hidden="true"></i> Ajouter une image</button>
                      <ul class="list-group mt-2">
                        <li class="list-group-item" v-for="(media, index) in moduleConfig.medias.libellesImages" :key="media.id">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <button type="button" class="btn btn-danger btn-sm" @click="removeMedia(index, 'image')">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                              </button>
                              <input type="text" class="form-control" v-model="moduleConfig.medias.libellesImages[index]" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="col-md-4">
                      <button type="button" class="btn btn-primary" @click="addMedias('pdf')"><i class="fa fa-plus" aria-hidden="true"></i> Ajouter un pdf</button>
                      <ul class="list-group mt-2">
                        <li class="list-group-item" v-for="(media, index) in moduleConfig.medias.libellesPdf" :key="media.id">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <button type="button" class="btn btn-danger btn-sm" @click="removeMedia(index, 'pdf')">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                              </button>
                              <input type="text" class="form-control" v-model="moduleConfig.medias.libellesPdf[index]" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="col-md-4">
                      <button type="button" class="btn btn-primary" @click="addMedias('video')"><i class="fa fa-plus" aria-hidden="true"></i> Ajouter une vidéo</button>
                      <ul class="list-group mt-2">
                        <li class="list-group-item" v-for="(media, index) in moduleConfig.medias.libellesVideos" :key="media.id">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <button type="button" class="btn btn-danger btn-sm" @click="removeMedia(index, 'video')">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                              </button>
                              <input type="text" class="form-control" v-model="moduleConfig.medias.libellesVideos[index]" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="row">
                    <hr />
                    <h3>Paramétrage des ThumbNails</h3>
                  </div>

                  <div class="row">
                    <div class="col-md-12">
                      <div v-for="(tn, index) in moduleConfig.tabTn" :key="tn.id">
                        <div class="row">
                          <div class="col-md-1">
                            <div class="btn-group" role="group">
                              <button type="button" class="btn btn-danger" @click="deleteTn(index)" :disabled="index == 0">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                              </button>
                              <button type="button" class="btn btn-info" @click="addTn()" :disabled="index + 1 < moduleConfig.tabTn.length">
                                <i class="fa fa-plus" aria-hidden="true"></i>
                              </button>
                            </div>
                          </div>
                          <div class="col-md-1">Tn{{ index + 1 }} (LxH):</div>
                          <div class="col-md-2">
                            <input type="number" class="form-control" v-model="tn.maxWidthTn" />
                          </div>
                          <div class="col-md-2">
                            <input type="number" class="form-control" v-model="tn.maxHeightTn" />
                          </div>
                          <div class="col-md-">Mode :</div>
                          <div class="col-md-2">
                            <div class="form-group">
                              <select class="form-control" v-model="moduleConfig.tabTn[index].redim" :id="'redim' + index">
                                <option value="libre">Libre</option>
                                <option value="fixe">Fixe (crop)</option>
                                <option value="couleur">Couleur BG</option>
                              </select>
                            </div>
                          </div>
                          <div class="col-md-1">Couleur (hexa)</div>
                          <div class="col-md-2">
                            <div class="form-group">
                              <input type="text" class="form-control" placeholder="#FFFFFF" v-model="tn.bgTn" :id="'couleur' + index" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-2"></div>
              </div>
            </div>
            <!-- Contenu config déclinaisons -->
            <div class="tab-pane text-center" id="p3">
              <div class="row text-center">
                <!-- libellés déclinaisons -->
                <div class="col-md-3 alert alert-primary">
                  <p>
                    <button @click="addDecli()" type="button" class="btn btn-primary"><i class="fa fa-plus" aria-hidden="true"></i> Nouvelle déclinaison</button>
                  </p>

                  <ul class="list-group">
                    <li class="list-group-item" v-for="(champ, index) in moduleConfig.declinaisons" :key="champ.id">
                      <div class="row">
                        <div class="col-md-2">
                          <button type="button" class="btn btn-danger btn-sm" @click="removeDecli(index)">
                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                          </button>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control" v-model="moduleConfig.declinaisons[index]" />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <!-- medias déclinaisons -->
                <div class="col-md-6 alert alert-warning">
                  <div class="row">
                    <div class="col-md-4">
                      <button type="button" class="btn btn-secondary" @click="addMedias('image', true)" disabled><i class="fa fa-plus" aria-hidden="true"></i> Ajouter une image</button>
                      <ul class="list-group mt-2">
                        <li class="list-group-item" v-for="(media, index) in moduleConfig.mediasDeclinaison.libellesImages" :key="media.id">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <button type="button" class="btn btn-danger btn-sm" @click="removeMedia(index, 'image', true)">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                              </button>
                              <input type="text" class="form-control" v-model="moduleConfig.mediasDeclinaison.libellesImages[index]" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="col-md-4">
                      <button type="button" class="btn btn-secondary" @click="addMedias('pdf', true)" disabled><i class="fa fa-plus" aria-hidden="true"></i> Ajouter un pdf</button>
                      <ul class="list-group mt-2">
                        <li class="list-group-item" v-for="(media, index) in moduleConfig.mediasDeclinaison.libellesPdf" :key="media.id">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <button type="button" class="btn btn-danger btn-sm" @click="removeMedia(index, 'pdf', true)">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                              </button>
                              <input type="text" class="form-control" v-model="moduleConfig.mediasDeclinaison.libellesPdf[index]" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="col-md-4">
                      <button type="button" class="btn btn-secondary" @click="addMedias('video', true)" disabled><i class="fa fa-plus" aria-hidden="true"></i> Ajouter une vidéo</button>
                      <ul class="list-group mt-2">
                        <li class="list-group-item" v-for="(media, index) in moduleConfig.mediasDeclinaison.libellesVideos" :key="media.id">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <button type="button" class="btn btn-danger btn-sm" @click="removeMedia(index, 'video', true)">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                              </button>
                              <input type="text" class="form-control" v-model="moduleConfig.mediasDeclinaison.libellesVideos[index]" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <!-- prix déclinaisons -->
                <div class="col-md-3 alert alert-info">
                  <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-8">
                      <p>
                        <button @click="addPrix(true)" type="button" class="btn btn-info"><i class="fa fa-plus" aria-hidden="true"></i> Nouveau champ prix</button>
                      </p>
                      <ul class="list-group">
                        <li class="list-group-item" v-for="(champ, index) in moduleConfig.prixDeclinaisons" :key="champ.id">
                          <div class="row">
                            <div class="col-md-2">
                              <button type="button" class="btn btn-danger btn-sm" @click="removePrix(index, true)">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                              </button>
                            </div>
                            <div class="col-md-4">
                              <span>Libellé</span>
                            </div>
                            <div class="col-md-4">
                              <input type="text" class="form-control" v-model="moduleConfig.prixDeclinaisons[index].libelle" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="col-md-6"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Contenu config prix -->
            <div class="tab-pane" id="p4">
              <div class="row">
                <div class="col-md-2"></div>
                <div class="col-md-8">
                  <p>
                    <button @click="addPrix()" type="button" class="btn btn-primary"><i class="fa fa-plus" aria-hidden="true"></i> Nouveau champs prix</button>
                  </p>
                  <ul class="list-group">
                    <li class="list-group-item" v-for="(champ, index) in moduleConfig.prix" :key="champ.id">
                      <div class="row">
                        <div class="col-md-2">
                          <button type="button" class="btn btn-danger btn-sm" @click="removePrix(index)">
                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                          </button>
                        </div>
                        <div class="col-md-2">
                          <span>Libellé</span>
                        </div>
                        <div class="col-md-4">
                          <input type="text" class="form-control" v-model="moduleConfig.prix[index].libelle" />
                        </div>
                        <div class="col-md-2">Affiche en liste</div>
                        <div class="col-md-2">
                          <input type="checkbox" class="form-check-input" value="1" v-model="champ.affiche" />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="col-md-6"></div>
              </div>
            </div>
            <!-- Contenu config catégories -->
            <div class="tab-pane" id="p5">
              <div class="row text-center">
                <div class="col-md-2"></div>
                <div class="col-md-8">
                  <div class="table">
                    <thead>
                      <tr>
                        <th>
                          <span class="badge badge-info">Client</span>
                        </th>
                        <th>Libellé niveaux</th>
                        <th>Affiche</th>
                        <th>Création</th>
                        <th>Modification</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="2">En-tête global</td>
                        <td colspan="4">
                          <input type="text" class="form-control" v-model="moduleConfig.confCatTitle" />
                        </td>
                      </tr>
                      <tr v-for="i in 4" :key="i.id">
                        <th>Catégorie de niveau {{ i }}</th>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.categories[i - 1].entete" />
                        </td>
                        <td>
                          <p>
                            <input type="checkbox" class="form-check-input" value="1" v-model="moduleConfig.categories[i - 1].affiche" />
                            <i class="fa fa-eye-slash" aria-hidden="true"></i>
                          </p>
                        </td>
                        <td>
                          <input type="checkbox" class="form-check-input" value="1" v-model="moduleConfig.categories[i - 1].droits[0]" />
                        </td>
                        <td>
                          <input type="checkbox" class="form-check-input" value="1" v-model="moduleConfig.categories[i - 1].droits[1]" />
                        </td>
                        <td>
                          <input type="checkbox" class="form-check-input" value="1" v-model="moduleConfig.categories[i - 1].droits[2]" />
                        </td>
                      </tr>
                    </tbody>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contenu sélection format -->
            <div class="tab-pane" id="p6">
              <h3>Sélection de formats possibles pour le module</h3>
              <div class="row">
                <div class="col-md-4"></div>
                <div class="col-md-4">
                  <table class="table">
                    <tr v-for="opt in optionsFormats" :key="opt.id">
                      <td>{{ opt }}</td>
                      <td class="text-left">
                        <div class="form-check">
                          <input type="checkbox" v-model="moduleConfig.format" :value="opt" class="form-check-input" @click="choiceFormat($event)" />
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="col-md-4"></div>
              </div>
            </div>

            <!-- Contenu config divers -->
            <div class="tab-pane" id="p7">
              <div class="row">
                <div class="col-md-2"></div>
                <div class="col-md-8">
                  <table class="table">
                    <tbody>
                      <!-- <tr class="alert" :class="[moduleConfig.actif ? 'alert-success' : 'alert-danger']"> -->
                      <tr class="alert" :class="{ 'alert-success': moduleConfig.actif, 'alert-danger': !moduleConfig.actif }">
                        <td>Module actif dans le menu</td>
                        <td>
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="activmodule1" id="activmodule1" :value="false" v-model="moduleConfig.actif" />
                            <label class="form-check-label" for="activmodule1">Non actif</label>
                          </div>

                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="activmodule2" id="activmodule2" :value="true" v-model="moduleConfig.actif" />
                            <label class="form-check-label" for="activmodule2">Actif</label>
                          </div>
                        </td>
                      </tr>

                      <tr class="alert alert-warning">
                        <td>Identifiant du module</td>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.module" />
                        </td>
                      </tr>
                      <tr>
                        <td>Nom du module</td>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.name" />
                        </td>
                      </tr>
                      <tr>
                        <td>Label pour le titre du module</td>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.labels.title" />
                        </td>
                      </tr>
                      <tr>
                        <td>Label pour la création d'une fiche</td>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.labels.create" />
                        </td>
                      </tr>
                      <tr>
                        <td>Label pour la modification d'une fiche</td>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.labels.edit" />
                        </td>
                      </tr>
                      <tr>
                        <td>Affiche quantité</td>
                        <td>
                          <select class="form-control" v-model="moduleConfig.afficheQte">
                            <option :value="true">Oui</option>
                            <option :value="false">Non</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Type de quantités possibles # {{ moduleConfig.isUnite }} # {{ moduleConfig.isPoids }} # {{ moduleConfig.isInfinite }} #</td>
                        <td>
                          <div class="form-check"><input type="checkbox" class="form-check-input" id="exampleCheck1" value="unite" v-model="moduleConfig.isUnite" /> A l'unité</div>
                          <div class="form-check"><input type="checkbox" class="form-check-input" id="exampleCheck2" value="poids" v-model="moduleConfig.isPoids" /> Au poids</div>
                          <div class="form-check"><input type="checkbox" class="form-check-input" id="exampleCheck3" value="infini" v-model="moduleConfig.isInfinite" /> Infini</div>
                        </td>
                      </tr>
                      <tr>
                        <td>Poids</td>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.poids" />
                        </td>
                      </tr>
                      <tr>
                        <td>Nom de la table</td>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.tableName" />
                        </td>
                      </tr>
                      <tr>
                        <td>Ordre</td>
                        <td>
                          <input type="number" class="form-control" v-model="moduleConfig.ordre" />
                        </td>
                      </tr>
                      <tr>
                        <td>Lien de la page en admin</td>
                        <td>
                          <input type="text" class="form-control" v-model="moduleConfig.href" value="admin-gestion-produits-liste" />
                          admin-gestion-produits-liste<br />
                          admin-gestion-clients-liste
                        </td>
                      </tr>
                      <tr>
                        <td>Role minimum</td>
                        <td>
                          <select class="form-control" v-model="moduleConfig.roles">
                            <option value="'ROLE_CLIENT', 'ROLE_COMMERCIAL', 'ROLE_ADMIN'">ROLE_CLIENT</option>
                            <option value="'ROLE_COMMERCIAL', 'ROLE_ADMIN'">ROLE_COMMERCIAL</option>
                            <option value="'ROLE_ADMIN'">ROLE_ADMIN</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Icône du menu</td>
                        <td align="left">
                          <div class="dropdown">
                            <button type="button" class="btn btn-select" data-toggle="dropdown">
                              Choix de l'icone
                              <i class="material-icons">{{ moduleConfig.icon }}</i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-select">
                              <li v-for="icon in jsonIcons" :key="icon.id">
                                <label class="dropdown-radio">
                                  <input type="radio" :value="icon.name" v-model="moduleConfig.icon" />
                                  <i class="material-icons">{{ icon.name }}</i>
                                  {{ icon.name }}
                                </label>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <!-- <pre>
        {{ this.moduleConfig }}
      </pre>-->
    </div>
  </layout-default>
</template>

<script>
/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable quotes */
/* eslint-disable semi */
import { mapState } from "vuex";
import jsonIcons from "@/datas/icons.json";
import slugme from "slugme";
import LayoutDefault from "@/layouts/LayoutDefault.vue";
export default {
  components: {
    "layout-default": LayoutDefault,
  },
  computed: {
    ...mapState({
      currentSite: "currentSite",
    }),
  },
  mounted: function () {
    if (this.$route.query.edit) {
      this.isEdit = this.$route.query.edit;
      this.loadModule(this.isEdit);
    } else if (this.$route.query.editsite) {
      this.isEditSite = this.$route.query.editsite;
      this.loadModule(this.isEditSite);
    }
  },
  data() {
    return {
      jsonIcons,
      isEdit: "",
      isEditSite: "",
      messageSystem: "",
      moduleConfig: {
        isUnite: false,
        isPoids: false,
        isInfinite: false,
        afficheQte: true,
        actif: true,
        config: [],
        labels: {
          title: "Gestion des news",
          create: "Ajouter une news",
          edit: "Editer une news",
        },
        categories: [
          {
            entete: "Catégorie",
            affiche: true,
            droits: [true, true, true],
          },
          {
            entete: "Sous rubrique 1",
            affiche: true,
            droits: [true, true, true],
          },
          {
            entete: "Sous rubrique 2",
            affiche: false,
            droits: [true, true, true],
          },
          {
            entete: "Sous rubrique 3",
            affiche: false,
            droits: [false, false, false],
          },
        ],
        confCatTitle: "",
        confCatSlug: "",
        medias: {
          images: 0,
          pdfs: 0,
          videos: 0,
          libellesImages: [],
          libellesPdf: [],
          libellesVideos: [],
        },
        mediasDeclinaison: {
          images: 0,
          pdfs: 0,
          videos: 0,
          libellesImages: [],
          libellesPdf: [],
          libellesVideos: [],
        },
        declinaisons: [],
        prixDeclinaisons: [],
        prix: [],
        poids: "",
        id: "",
        tableName: "",
        icon: "",
        format: [],
        tabTn: [
          {
            maxWidthTn: 800,
            maxHeightTn: 600,
          },
        ],
      },
      optionsFormats: ["Slider", "Horizontal", "Vertical", "Fond de site", "Bandeau slider", "Bandeau", "Thumbnails", "Coverflow", "Masonry"],
    };
  },
  methods: {
    // typeQte($event) {
    //   console.log("event", $event.target.value);
    // },
    deleteTn(index) {
      console.log("index", index);
      this.moduleConfig.tabTn.splice(index, 1);
    },
    addTn() {
      this.moduleConfig.tabTn.push({ maxWidthTn: 800, maxHeightTn: 600, redim: "libre", bgTn: "#FFFFFF" });
    },
    choiceFormat($event) {
      if (this.moduleConfig.format.includes($event.target.value)) {
        this.moduleConfig.format.splice(this.moduleConfig.format.indexOf($event.target.value), 1);
      } else {
        this.moduleConfig.format.push($event.target.value);
      }
      console.log("moduleConfig.format", this.moduleConfig.format);
    },
    getCurrentSite() {
      if (localStorage.getItem("currentSite")) {
        this.$store.dispatch("siteConnect", localStorage.getItem("currentSite"));
      }
    },
    emptyAlert() {
      this.messageSystem = "";
    },
    updateModuleConfig() {
      this.moduleConfig.id = slugme(this.moduleConfig.id);
    },
    removeMedia(index, type, isVariant) {
      if (isVariant) {
        if (type === "image") {
          this.moduleConfig.mediasDeclinaison.libellesImages.splice(index, 1);
          this.moduleConfig.mediasDeclinaison.images = this.moduleConfig.mediasDeclinaison.libellesImages.length;
        }
        if (type === "pdf") {
          this.moduleConfig.mediasDeclinaison.libellesPdf.splice(index, 1);
          this.moduleConfig.mediasDeclinaison.pdfs = this.moduleConfig.mediasDeclinaison.libellesPdf.length;
        }
        if (type === "video") {
          this.moduleConfig.mediasDeclinaison.libellesVideos.splice(index, 1);
          this.moduleConfig.mediasDeclinaison.videos = this.moduleConfig.mediasDeclinaison.libellesVideos.length;
        }
      } else {
        if (type === "image") {
          this.moduleConfig.medias.libellesImages.splice(index, 1);
          this.moduleConfig.medias.images = this.moduleConfig.medias.libellesImages.length;
        }
        if (type === "pdf") {
          this.moduleConfig.medias.libellesPdf.splice(index, 1);
          this.moduleConfig.medias.pdfs = this.moduleConfig.medias.libellesPdf.length;
        }
        if (type === "video") {
          this.moduleConfig.medias.libellesVideos.splice(index, 1);
          this.moduleConfig.medias.videos = this.moduleConfig.medias.libellesVideos.length;
        }
      }

      this.updateModuleConfig();
    },
    removePrix(index, isVariant) {
      if (isVariant) {
        this.moduleConfig.prixDeclinaisons.splice(index, 1);
      } else {
        this.moduleConfig.prix.splice(index, 1);
      }
      this.updateModuleConfig();
    },
    removeChamps(index) {
      this.moduleConfig.config.splice(index, 1);
      this.updateModuleConfig();
    },
    removeDecli(index) {
      this.moduleConfig.declinaisons.splice(index, 1);
      this.updateModuleConfig();
    },
    addMedias(type, isVariant) {
      if (isVariant) {
        if (type === "image") {
          this.moduleConfig.mediasDeclinaison.images = this.moduleConfig.mediasDeclinaison.libellesImages.length + 1;
          let initialField = type + this.moduleConfig.mediasDeclinaison.images;
          this.moduleConfig.mediasDeclinaison.libellesImages.push(initialField);
        }
        if (type === "pdf") {
          this.moduleConfig.mediasDeclinaison.pdfs = this.moduleConfig.mediasDeclinaison.libellesPdf.length + 1;
          let initialField = type + this.moduleConfig.mediasDeclinaison.pdfs;
          this.moduleConfig.mediasDeclinaison.libellesPdf.push(initialField);
        }
        if (type === "video") {
          this.moduleConfig.mediasDeclinaison.videos = this.moduleConfig.mediasDeclinaison.libellesVideos.length + 1;
          let initialField = type + this.moduleConfig.mediasDeclinaison.videos;
          this.moduleConfig.mediasDeclinaison.libellesVideos.push(initialField);
        }
      } else {
        if (type === "image") {
          this.moduleConfig.medias.images = this.moduleConfig.medias.libellesImages.length + 1;
          let initialField = type + this.moduleConfig.medias.images;
          this.moduleConfig.medias.libellesImages.push(initialField);
        }
        if (type === "pdf") {
          this.moduleConfig.medias.pdfs = this.moduleConfig.medias.libellesPdf.length + 1;
          let initialField = type + this.moduleConfig.medias.pdfs;
          this.moduleConfig.medias.libellesPdf.push(initialField);
        }
        if (type === "video") {
          this.moduleConfig.medias.videos = this.moduleConfig.medias.libellesVideos.length + 1;
          let initialField = type + this.moduleConfig.medias.videos;
          this.moduleConfig.medias.libellesVideos.push(initialField);
        }
      }

      this.updateModuleConfig();
    },
    addPrix(isVariant) {
      let indice = 0;
      if (isVariant) {
        indice = this.moduleConfig.prixDeclinaisons.length + 1;
      } else {
        indice = this.moduleConfig.prix.length + 1;
      }

      let emptyFields = {
        libelle: "prix" + indice,
        type: "prix",
        champs: "prix" + indice,
      };
      if (isVariant) {
        this.moduleConfig.prixDeclinaisons.push(emptyFields);
      } else {
        this.moduleConfig.prix.push(emptyFields);
      }
      this.updateModuleConfig();
    },
    addChamps() {
      let indice = this.moduleConfig.config.length + 1;
      let emptyFields = {
        libelle: "libelle" + indice,
        type: "titre",
        affiche: false,
        default: "",
      };
      // emptyFields.champs = emptyFields.type + indice;
      this.moduleConfig.config.push(emptyFields);
      this.updateModuleConfig();
    },
    addDecli() {
      let indice = this.moduleConfig.declinaisons.length + 1;
      let initialField = "Déclinaison" + indice;
      this.moduleConfig.declinaisons.push(initialField);
      this.updateModuleConfig();
    },
    saveModule(action) {
      let indexTitre = 0;
      let indexDescription = 0;
      let indexSwitch = 0;
      let indexListe = 0;

      // gestion slug catégories
      if (this.moduleConfig.confCatTitle === "" || this.moduleConfig.confCatTitle === undefined) {
        this.messageSystem = "Vous devez obligatoirement définir un en-tête de catégorie";
      } else {
        this.moduleConfig.confCatSlug = slugme(this.moduleConfig.confCatTitle);
        this.moduleConfig.categories.forEach((cat) => {
          cat.slug = slugme(cat.entete);
        });

        // pour definir les index des champs par type
        this.moduleConfig.config.forEach((mod) => {
          switch (mod.type) {
            case "titre":
              indexTitre++;
              mod.champs = mod.type + indexTitre;
              break;
            case "description":
              indexDescription++;
              mod.champs = mod.type + indexDescription;
              break;
            case "switch":
              indexSwitch++;
              mod.champs = mod.type + indexSwitch;
              break;
            case "liste":
              indexListe++;
              mod.champs = mod.type + indexListe;
              break;
          }
        });

        // definition type module
        this.moduleConfig.type = "module";

        if (action === "serveur") {
          this.updateModuleConfig();
          console.log("to store", this.moduleConfig);
          let url = this.$api.MODULE_CREATE;
          if (this.isEdit) {
            url = this.$api.MODULE_EDIT + this.moduleConfig._id;
            console.log("url", url);
            this.$axios
              .put(url, this.moduleConfig)
              .then((response) => {
                console.log("module updaté", this.moduleConfig);
                this.$router.push("modules/list");
              })
              .catch((error) => {
                this.messageSystem = "Une erreur est survenu, module non enregistré";
                console.log(error);
              });
          } else {
            this.$axios
              .post(url, this.moduleConfig)
              .then((response) => {
                this.$router.push("modules/list");
              })
              .catch((error) => {
                this.messageSystem = "Une erreur est survenu, module non enregistré";
                console.log(error);
              });
          }
        }
        if (action === "site") {
          localStorage.setItem("configModule", JSON.stringify(this.moduleConfig));
          this.$router.push("/modules/list?editSite=1");
        }
      }
    },
    loadModule(id) {
      if (this.isEdit) {
        this.$axios
          .get(this.$api.MODULE_SHOW + id)
          .then((response) => {
            this.moduleConfig = response.data.moduleStructure;
            console.log("response edit", response.data.moduleStructure);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (this.isEditSite) {
        if (localStorage.getItem("configModule")) {
          this.moduleConfig = JSON.parse(localStorage.getItem("configModule"));
        }
      }
    },
  },
};
</script>

<style scoped>
.dropdown-menu-select {
  padding: 0;
  margin-top: -2px;
  border-radius: 0 0 2px 2px;
  border-color: #777;
  max-height: 500px;
  overflow: auto;
}

.dropdown-radio {
  display: block;
  position: relative;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #eaeaea;
  cursor: pointer;
}
.dropdown-radio input {
  visibility: hidden;
  position: absolute;
  left: -30px;
}
.dropdown-radio i {
  font-weight: normal;
  font-style: normal;
  display: inline-block;
  padding: 3px;
}

.btn-select i {
  vertical-align: middle;
}
</style>
