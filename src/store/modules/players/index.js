const generate = require('nanoid/generate')

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
      if(state.currentPlayer !== null)
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
    init(context) {
      console.log(context);
      return new Promise((resolve, reject) => {
        /**
         * Init the first cards in the deck.
         */

        let cards = context.rootGetters['decks/getResearchCards'];
        let cities = context.rootGetters['board/getCities'];
        let characters = context.rootGetters['config/getCharacters'];
        let settings = context.rootGetters['config/getSettings'];

        let charactersArray = Object.keys(characters);
        shuffle(charactersArray);
        let count = 0;
        context.state.players.forEach((p) => {
          let rand = Math.floor((Math.random() * cities.length));
          p.city = cities[rand];
          for(let i = 0; i < settings.player_max_deck_size; i++) {
            let card = cards.pop();
            if(card) {
              p.cards.push(card);
              context.dispatch('decks/removeCard', card, {root: true});
            }
          }
          p.character = charactersArray[count % charactersArray.length];
          count++;
        });

        /**
         * Set the current player.
         */
        context.commit('SET_CURRENT_PLAYER', context.state.players[0]);

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
