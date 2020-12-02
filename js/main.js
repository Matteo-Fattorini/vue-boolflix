const app = new Vue({
  el: "#main",
  data: {
    key: "375fb5d5a05f3c4fec8077369df2b91e",
    input: "",
    movies: [],
  },
  computed: {},
  methods: {
    getQueryMovies() {
      this.movies = [];
      axios
        .get("https://api.themoviedb.org/3/search/movie", {
          params: { api_key: this.key, query: this.input },
        })
        .then((response) => {
          this.movies = response.data.results;
          axios.get("https://api.themoviedb.org/3/movie/{movie_id}/images");
          console.log(response.data.results);
        })
        .catch((err) => {
          console.log("Attenzione" + err);
        })
        .finally(() => (this.input = ""));
    },
  },

  mounted() {
    axios
      .get("https://api.themoviedb.org/3/movie/top_rated", {
        params: { api_key: this.key },
      })
      .then((response) => {
        this.movies = response.data.results;
        axios.get("https://api.themoviedb.org/3/movie/{movie_id}/images");
        console.log(response.data.results);
      })
      .catch((err) => {
        console.log("Attenzione" + err);
      });
  },
});
