const generate = require('nanoid/generate')

const Decks = {
  namespaced: true,
  state: {
/**
 * card: {
 *   uuid: 'UUID of the card',
 *   name: 'Name of the card',
 *   type: 'disaster|research',
 *   pollution: 'Type of pollution (nuclear, weather, waste)',
 *   description: 'Description of the card',
 *   image: 'URL of the image',
 *   city: 'UUID of the city',
 * }
 */
    cards: [],
  },
  getters: {
    getCards(state) {
      return state.cards;
    },
    getResearchCards(state) {
      return state.cards.filter(c => c.type == 'research');
    },
  },
  actions: {
    init(context) {
      return new Promise((resolve, reject) => {
        /**
         * Init the cards according to the city.
         */
        let cities = context.rootGetters['board/getCities'];
        cities.forEach((city) => {
          let card = {
            uuid: 'cardid' + generate('1234567890', 10),
            name: city.name,
            type: 'research',
            pollution: 'nuclear', // TODO: Change
            description: '', // TODO: Define
            image: '', // TODO: Define
            city: city.uuid,
          };

          context.commit('ADD_CARD', card)
        });

        resolve();
      });
    },
    popResearchCard({ state }) {
      return state.cards.pop();
    },
    removeCard({ commit }, card) {
      commit('REMOVE_CARD', card);
    },
  },
  mutations: {
    ADD_CARD(state, card) {
      state.cards.push(card);
    },
    REMOVE_CARD(state, card) {
      state.cards.splice(state.cards.indexOf(card), 1);
    },
  },
};

export default Decks;
