const generate = require('nanoid/generate')

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
      player.uuid = 'u' + generate('1234567890', 10);
      commit('ADD_PLAYER', player);
    },
    removePlayer({ commit }, player) {
      commit('REMOVE_PLAYER', player);
    },
    reset({commit}) {
      commit('RESET');
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
      state.players = state.players.filter((p) => {
        return p.uuid !== player.uuid
      });
    },
    RESET(state) {
      state.players = [];
      state.currentPlayer = null;
    },
    SET_CURRENT_PLAYER(state, player) {
      state.currentPlayer = state.players.indexOf(player);
    },
  },
};

export default Players;
