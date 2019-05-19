import Vue from 'vue';

const map = require('./cities.json');

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
 *       ],
 *       disasters: [
 *
 *       ]
 *     }
 *   ],
 *   transitions: [
 *     {
 *       city1: '',
 *       city2: '',
 *     }
 *   ]
 * }
 */
    initialized: false,
    cities: {},
    transitions: [],
  },
  getters: {
    isInitialized(state) {
      return state.initialized;
    },
    getCities(state) {
      return Object.keys(state.cities).map((c) => state.cities[c]);
    },
    getTransitions(state) {
      return state.transitions;
    },
    getCity(state, city_uuid) {
      if(!city_uuid)
        return null;
      return state.cities[city_uuid];
    },
  },
  actions: {
    init({ commit }) {
      return new Promise(resolve => {
        /**
         * Load the list of cities.
         */
        Object.keys(map.cities).forEach((city_key) => {
          let city = map.cities[city_key];
          city.uuid = city_key;

          /**
           * Define the property of the city.
           */
          city.pollutions = { // FIXME: Make this init dynamic.
            waste: 0,
            weather: 0,
            nuclear: 0
          };
          city.buildings = [];

          commit('ADD_CITY', {city_key, city});
        });

        /**
         * Generate the transitions.
         */
        map.transitions.forEach((t) => {
          commit('ADD_TRANSITION', t);
        });

        commit("SET_INIT", true);
        resolve();
      });
    },
    // eslint-disable-next-line
    increasePollution({ commit, dispatch }, { city, pollution }) {
      // eslint-disable-next-line
      return new Promise((resolve, reject) => {
        // If pollution is over 3, we dispatch 1 more to the cities linked to it.

        let total = 0;
        Object.keys(city.pollutions).forEach((k) => total += city.pollutions[k]);

        if(total == 3) {
          // Explode to other cities linked.

          // TODO


          resolve();
          return;
        }

        commit('INCREASE_POLLUTION', { city, pollution });
        resolve();
      });
    },
    decreasePollution({ commit }, city) {
      return new Promise((resolve) => {
        let pollution = Object.keys(city.pollutions).filter((k) => city.pollutions[k] > 0)[0];
        commit('DECREASE_POLLUTION', {city, pollution})
        resolve();
      });
    },
  },
  mutations: {
    ADD_CITY(state, {city_key, city}) {
        Vue.set(state.cities, city_key, city);
    },
    ADD_TRANSITION(state, transition) {
      state.transitions.push(transition);
    },
    INCREASE_POLLUTION(state, {city, pollution}) {
      state.cities[city.uuid].pollutions[pollution]++;
    },
    DECREASE_POLLUTION(state, {city, pollution}) {
      state.cities[city.uuid].pollutions[pollution]--;
    },
    SET_INIT(state, initialized) {
      state.initialized = initialized;
    }
  }
};

export default Board;
