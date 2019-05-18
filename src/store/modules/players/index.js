const Players = {
  namespaced: true,
  state: {
    players: [],
    currentPlayer: null,
  },
  getters: {
    getCurrentPlayer(state) {
      if(state.currentPlayer)
        return state.players[state.currentPlayer];
      return null;
    },
    getPlayers(state) {
      return state.players;
    },
  },
  actions: {
    addPlayer({ commit }, player) {
      commit('ADD_PLAYER', player);
    },
    removePlayer({ commit }, player) {
      commit('REMOVE_PLAYER', player);
    },
    setCurrentPlayer({ commit }, player) {
      commit('SET_CURRENT_PLAYER', player);
    },
  },
  mutations: {
    ADD_PLAYER(state, player) {
      state.players.push(player);
    },
    REMOVE_PLAYER(state, player) {
      let playerIndex = state.players.indexOf(player);
      state.players.splice(playerIndex, 1);
    },
    SET_CURRENT_PLAYER(state, player) {
      state.currentPlayer = state.players.indexOf(player);
    },
  },
};

export default Players;
