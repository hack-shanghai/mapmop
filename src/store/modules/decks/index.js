const generate = require('nanoid/generate')

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


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

        let pollutions = context.rootGetters['config/getPollutions'];
        let cities = context.rootGetters['board/getCities'];

        /**
         * Init the cards according to the city.
         */
        shuffle(cities);

        let pollutionsArray = Object.keys(pollutions);
        let count = 0;
        cities.forEach((city) => {

          let card = {
            uuid: 'cardid' + generate('1234567890', 10),
            name: city.name,
            type: 'research',
            pollution: pollutionsArray[count % pollutionsArray.length],
            description: '', // TODO: Define from city
            image: '', // TODO: Define from city
            city: city,
          };

          context.commit('ADD_CARD', card)
          count++;
        });

        context.commit('SHUFFLE_CARD');

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
    SHUFFLE_CARD(state) {
      shuffle(state.cards);
    },
  },
};

export default Decks;
