window.onload = init;


function init() {

    new Vue({
        el: "#app",
        data: {
            restaurants: [],
            name: '',
            nameResearch: '',
            cuisine: '',
            nbRestaurants: 0,
            nbRestaurantsParPage: 0,
            page: 0,
            modifyMode: false,
            modifyIndex: -1,
        },
        mounted() {
            this.nbRestaurantsParPage = 5;

            this.getRestaurantFromServer();
        },
        methods: {
            buildNameId(index) {
                let buildedString  = "restaurant" + index + "Name";
                console.log(buildedString);
                return buildedString;
            },
            buildCuisineId(index) {
                let buildedString  = "restaurant" + index + "Cuisine";
                console.log(buildedString);
                return buildedString;
            },
            sendModifiedValues(index,r) {

                modifierRestaurant(index,r);

                this.getRestaurantFromServer();

                this.switchModifyMode(0);
            },
            isRowInModify(index) {
                if (index === this.modifyIndex) { return true; }
                return false;
            },
            switchModifyMode(id) {
                this.modifyIndex = id;
                this.modifyMode = !this.modifyMode;

                if(this.modifyMode === false) {
                    this.modifyIndex = -1;
                }
            },
            getRestaurantFromServer() {

                let url = '';
                if(this.nameResearch.length < 1) {
                    url = "http://localhost:8080/api/restaurants?page=" + this.page + "&pagesize=" + this.nbRestaurantsParPage;
                }
                else {
                    url = "http://localhost:8080/api/restaurants?page=" + this.page + "&pagesize=" + this.nbRestaurantsParPage + "&name=" + this.nameResearch;
                    console.log("SPECIFIC SEARCH : " + this.nameResearch);
                }
                fetch(url)
                    .then((reponseJSON) => {
                        //on recupere le json
                        return reponseJSON.json();
                    })
                    .then((reponseJS) => {
                        this.restaurants = reponseJS.data;
                        this.nbRestaurants= reponseJS.count;
                        console.log(this.restaurants);
                    })
            },
            newPageCount() {
                this.page = 0;
                this.getRestaurantFromServer();
            },
            ajouterRestaurant() {
                let donneesFormulaire = new FormData();

                donneesFormulaire.append("nom", this.name);
                donneesFormulaire.append("cuisine", this.cuisine);


                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                    method: "POST",
                    body: donneesFormulaire
                })
                    .then((responseJSON) =>{
                        responseJSON.json()
                            .then((res) => { // arrow function preserve le this
                                // Maintenant res est un vrai objet JavaScript
                                console.log("ajouter");
                                this.getRestaurantFromServer()
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                this.name = "";
                this.cuisine = "";
            },
            supprimer(r) {

                let url = "http://localhost:8080/api/restaurants";

                supprimerRestaurant(url, {
                    method: "DELETE",
                    restaurant: r
                });

                console.log("Suppression de " + r.name );
                this.nom = "";
                this.cuisine = "";
                this.getRestaurantFromServer();
            },
            getColor: function (index) {
                if (index % 2 == 0)
                    return "#ADD8E6";
                else
                    return "white";
            },
            pagePrecedente() {
                //permet de chargé une page precedente
                if (this.page > 0) {
                    this.page--;
                    this.getRestaurantFromServer();
                }
            },
            pageSuivante() {
                if(this.nbRestaurants - this.nbRestaurantsParPage > (this.page * this.nbRestaurantsParPage)) {
                    this.page++;
                    this.getRestaurantFromServer();
                }
            },
            premierePage() {
                this.page = 0;
                this.getRestaurantFromServer()
            },
            dernierePage() {
                this.page =  Math.trunc(this.nbRestaurants / this.nbRestaurantsParPage);
                this.getRestaurantFromServer();
            },
            chercherRestaurants: _.debounce(function () {
                this.page = 0;
                this.getRestaurantFromServer();
            }, 500)
        }
    })
}