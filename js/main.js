const app = new Vue({
  el: "#main",
  data: {
    key: "375fb5d5a05f3c4fec8077369df2b91e",
    input: "",
    movies: [],
    tvShows: [],
    searchTitle: "Top-Rated",
    flags,
    hasSearched: false,
    currentPage: 1,
    currentWhere: "",
    maxPage: 1,
  },

  methods: {
    flagSource(language) {
      if (language) {
        language = language.toUpperCase();
        if (language in this.flags) {
          return this.flags[language];
        } else {
          return this.flags["NOTF"];
        }
      }
    },

    stockImage(e) {
      e.target.src = "css/img/notfound.png";
    },

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
                  include_adult: true,
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

    getQueryMovies(where = "/search/multi", page = 1) {
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
            include_adult: true,
          },
        })
        .then((response) => {
          this.movies = response.data.results;
          this.maxPage = response.data.total_pages;
        })
        .catch((err) => {
          console.log("Attenzione" + err);
        });
    },
    voteTransform(vote) {
      return Math.round(vote / 2 / 0.5) * 0.5;
    },
  },

  mounted() {
    this.getQueryMovies("/movie/top_rated");
    this.scroll();
  },
  updated() {
    if (this.input == "" && this.hasSearched == true) {
      this.getQueryMovies("/movie/top_rated");
      this.hasSearched = false;
    }
  },
});
