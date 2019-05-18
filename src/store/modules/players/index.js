const generate = require('nanoid/generate')

const Players = {
  namespaced: true,
  state: {
/**
 * player: {
 *   uuid: 'UUID of the user',
 *   name: 'Public name of the user',
 *   character: 'UUID of the character',
 *   cards: [
 *      'UUID of the card',
 *      'UUID of the card',
 *   ],
 *   city: 'UUID of the city',
 * }
 */
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
      player.character = null;
      player.cards = [],
      player.city = null;

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
    init({ commit }) {
      return new Promise((resolve, reject) => {
        /**
         * Init the first cards in the deck.
         */


        resolve();
      });
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
