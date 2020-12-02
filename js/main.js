const app = new Vue({
  el: "#main",
  data: {
    key: "375fb5d5a05f3c4fec8077369df2b91e",
    input: "",
    movies: [],
  },
  computed: {},
  methods: {
    getQueryMovies(where) {
      this.movies = [];
      axios
        .get("https://api.themoviedb.org/3" + where, {
          params: { api_key: this.key, query: this.input },
        })
        .then((response) => {
          this.movies = response.data.results;
        })
        .catch((err) => {
          console.log("Attenzione" + err);
        })
        .finally(() => (this.input = ""));
    },
  },

  mounted() {
    this.getQueryMovies("/movie/top_rated");
  },
});
