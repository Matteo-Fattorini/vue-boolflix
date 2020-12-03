const app = new Vue({
  el: "#main",
  data: {
    key: "375fb5d5a05f3c4fec8077369df2b91e",
    input: "",
    movies: [],
    searchTitle: "Top-Rated",
    flags,
  },

  methods: {
    flagSource(language) {
      language = language.toUpperCase();
      if (language in this.flags) {
        return this.flags[language];
      } else {
        console.log("ok");
        return this.flags["NOTF"];
      }
    },

    log(e) {
      console.log("sono qui");
    },

    getQueryMovies(where, page = 1) {
      this.movies = [];
      if (this.input == "") {
        this.searchTitle = `i più popolari`.toUpperCase();
      } else {
        this.searchTitle = `Risultati per '${this.input}'`;
      }

      axios
        .get("https://api.themoviedb.org/3" + where, {
          params: { api_key: this.key, query: this.input, page: page },
        })
        .then((response) => {
          this.movies = response.data.results;
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
  },
});
