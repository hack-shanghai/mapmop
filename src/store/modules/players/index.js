const generate = require("nanoid/generate");

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
     *      {}
     *      {}
     *   ],
     *   city: 'UUID of the city',
     * }
     */
    players: [],
    currentPlayer: null
  },
  getters: {
    getCurrentPlayer(state) {
      if (state.currentPlayer !== null)
        return state.players[state.currentPlayer];
      return null;
    },
    getPlayers(state) {
      return state.players;
    }
  },
  actions: {
    addPlayer({ commit }, player) {
      player.uuid = "u" + generate("1234567890", 10);
      player.character = null;
      (player.cards = []), (player.city = null);

      commit("ADD_PLAYER", player);
    },
    removePlayer({ commit }, player) {
      commit("REMOVE_PLAYER", player);
    },
    reset({ commit }) {
      commit("RESET");
    },
    setCurrentPlayer({ commit }, player) {
      commit("SET_CURRENT_PLAYER", player);
    },
    init(context) {
      return new Promise(resolve => {
        /**
         * Init the first cards in the deck.
         */

        let cards = context.rootGetters["decks/getResearchCards"];
        let cities = context.rootGetters["board/getCities"];
        let characters = context.rootGetters["config/getCharacters"];
        let settings = context.rootGetters["config/getSettings"];

        let charactersArray = Object.keys(characters);
        shuffle(charactersArray);
        let count = 0;
        context.state.players.forEach(p => {
          let rand = Math.floor(Math.random() * cities.length);
          p.city = cities[rand];
          for (let i = 0; i < settings.player_max_deck_size; i++) {
            let card = cards.pop();
            if (card) {
              p.cards.push(card);
              context.dispatch("decks/removeCard", card, { root: true });
            }
          }
          p.character = charactersArray[count % charactersArray.length];
          count++;
        });

        /**
         * Set the current player.
         */
        context.commit("SET_CURRENT_PLAYER", context.state.players[0]);

        resolve();
      });
    },
    moveToCity({ commit, getters, rootGetters }, city) {

      let player = getters.getCurrentPlayer;
      return new Promise((resolve, reject) => {
        let cityFound = rootGetters['board/getTransitions'].some((transition) => {
          if(player.city.uuid == transition.city1 && city.uuid == transition.city2) {
            return true;
          }
          if(player.city.uuid == transition.city2 && city.uuid == transition.city1) {
            return true;
          }
          return false;
        });

        if(!cityFound) {
          reject();
          return;
        }

        commit('CHANGE_CITY', city);
        resolve();
      });
    },
    addCard({ commit }, card) {
      commit('ADD_CARD', card);
    },
    removeCard({ commit }, card) {
      commit('REMOVE_CARD', card);
    },
    nextPlayer({ commit }) {
      commit('NEXT_PLAYER');
    },
  },
  mutations: {
    ADD_PLAYER(state, player) {
      state.players.push(player);
    },
    REMOVE_PLAYER(state, player) {
      state.players = state.players.filter(p => {
        return p.uuid !== player.uuid;
      });
    },
    RESET(state) {
      state.players = [];
      state.currentPlayer = null;
    },
    SET_CURRENT_PLAYER(state, player) {
      state.currentPlayer = state.players.indexOf(player);
    },
    CHANGE_CITY(state, city) {
      state.players[state.currentPlayer].city = city;
    },
    ADD_CARD(state, card) {
      state.players[state.currentPlayer].cards.push(card);
    },
    REMOVE_CARD(state, card) {
      let newCards = state.players[state.currentPlayer].cards.filter((c) => c.uuid != card.uuid);
      state.players[state.currentPlayer].cards = newCards;
    },
    NEXT_PLAYER(state) {
      state.currentPlayer = (state.currentPlayer + 1) % state.players;
    },
  },
};

export default Players;
