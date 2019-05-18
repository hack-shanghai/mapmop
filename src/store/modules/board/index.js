const generate = require('nanoid/generate')

const cities = require('../../../assets/cities.json');

const Board = {
  namespaced: true,
  state: {
/**
 * board: {
 *   cities: [
 *     {
 *       uuid: 'UUID of the city',
 *       name: 'Name',
 *       lon: '',
 *       lat: '',
 *       pollutions: {
 *         waste: 0,
 *         weather: 0,
 *         nuclear: 0,
 *       },
 *       buildings: [
 *
 *       ]
 *     }
 *   ],
 *   transitions: [
 *     {
 *       uuid_city_a: '',
 *       uuid_city_b: '',
 *     }
 *   ]
 * }
 */
    cities: [],
    transitions: [],
  },
  getters: {
    getCities(state) {
      return state.cities;
    },
    getTransitions(state) {
      return state.transitions;
    },
  },
  actions: {
    init({ commit }) {
      return new Promise((resolve, reject) => {
        /**
         * Load the list of cities.
         */
        cities.forEach((city) => {
          /**
           * Define the property of the city.
           */
          city.uuid = 'cid' + generate('1234567890', 10);

          commit('ADD_CITY', city);
        });

        /**
         * Generate the transitions.
         */

        resolve();
      });
    },
  },
  mutations: {
    ADD_CITY(state, city) {
        state.cities.push(city);
    },
  },
};

export default Board;
