const GlobalState = {
  namespaced: true,
  state: {
    loading: 0,
  },
  getters: {
    isLoading(state) {
      return state.loading > 0;
    },
    getEnv() {
      return process.env;
    },
  },
  actions: {
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading);
    },
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading += loading ? 1 : -1;
    },
  },
};

export default GlobalState;

