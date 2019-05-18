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

  },
  actions: {
    init({ commit }) {
      return new Promise((resolve, reject) => {
        /**
         * Init the cards according to the city.
         */

        resolve();
      });
    }
  },
  mutations: {

  },
};

export default Decks;
