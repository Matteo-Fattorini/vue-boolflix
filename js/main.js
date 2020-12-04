const app = new Vue({
  el: "#main",
  data: {
    search,
    key: "375fb5d5a05f3c4fec8077369df2b91e", //chiave api
    input: "", //input v-model su cerca
    movies: [], //risultati del GET, visualizzati con v-for
    searchTitle: "Top-Rated", //mostra quello che abbiamo cercato di default Top-Rated
    flags, //importa le bandiere da data.js
    hasSearched: false, //ci dice se ha già fatto almeno una ricerca,
    currentPage: 1, // pagina principale, usata nell'endless scroll, incrementa ogni volta
    currentWhere: "", //costa stà cercando l'utente, usata per enlsess scroll
    currentSearch: "/search/multi", //where the user is searching
    maxPage: 1, //numero massimo di pagine caricabili nell' endless
    orderBy: "popularity",
    orderByMenu: false, //scroll menu of order-by
    filterByMenu: false, //scroll menu of filter-by
  },

  computed: {
    //return a sorted list of movies by popularity
    sortMovie() {
      return this.movies.sort(function (a, b) {
        let value = app.orderBy;

        return a[`${value}`] > b[`${value}`]
          ? -1
          : b[`${value}`] > a[`${value}`]
          ? 1
          : 0;
      });
    },

    placeholder() {
      switch (this.currentSearch) {
        case "/search/multi":
          return "tutto il database";
        case "/search/tv":
          return "tutte le serie tv";
        case "/search/movie":
          return "tutti i film";
        case "/search/person":
          return "tutte le persone";
        default:
          return "Cerca...";
      }
    },
  },

  methods: {
    flagSource(language) {
      //questa funzione serve ad associare un immagine per ogni bandiera
      if (language) {
        language = language.toUpperCase();
        if (language in this.flags) {
          return this.flags[language];
        } else {
          return this.flags["NOTF"];
        }
      }
    },
    // se API ritorna un immagine nulla, mette un immagine stock
    stockImage(e) {
      e.target.src = "css/img/notfound.png";
    },

    closeHidden() {
      document.getElementById("main").classList.remove("active")
    },

    openHidden() {
      document.getElementById("main").classList.toggle("active");
    },

    // funzione che si occupa dell'endless scroll. Se arriva in fondo alla pagina, carica gli elementi della pagina successiva e li aggiunge a quelli già esistenti
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;

        if (this.currentPage < this.maxPage) {
          if (bottomOfWindow) {
            this.currentPage++;
            axios
              .get("https://api.themoviedb.org/3" + this.currentWhere, {
                params: {
                  api_key: this.key,
                  query: this.input,
                  page: this.currentPage,
                  include_adult: false,
                },
              })
              .then((response) => {
                let res = response.data.results;
                this.movies = [...this.movies, ...res];
              });
          }
        }
      };
    },

    //funzione di ricerca sull API. Di default cerca su tutti i canali, la ricerca può essere ristretta dall'utente.
    getQueryMovies(where, page = 1) {
      this.currentWhere = where;
      this.hasSearched = true;
      this.movies = [];
      if (this.input == "") {
        this.searchTitle = `i più popolari`.toUpperCase();
      } else {
        this.searchTitle = `Risultati per '${this.input}'`;
      }

      axios
        .get("https://api.themoviedb.org/3" + where, {
          params: {
            api_key: this.key,
            query: this.input,
            page: page,
            include_adult: false,
          },
        })
        .then((response) => {
          this.movies = response.data.results;
          this.maxPage = response.data.total_pages;
        });
    },

    //transforma il voto in 10 in uno in scala 1-5
    voteTransform(vote) {
      return Math.round(vote / 2);
    },
  },

  //al mounted di default mette i top rated, e abilita la funzione di endless scroll
  mounted() {
    this.getQueryMovies("/movie/top_rated");
    this.scroll();
  },

  //se l'ultente ha già cercato qualcosa e poi torna indietro lasciando vuoto il campo input ripristina i top-rated
  updated() {
    if (this.input == "" && this.hasSearched == true) {
      this.getQueryMovies("/movie/top_rated");
      this.hasSearched = false;
    }
  },
});
