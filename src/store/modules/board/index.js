import Vue from 'vue';

const map = require('./cities.json');

const Board = {
  namespaced: true,
  state: {
/**
 * board: {
 *   cities: {
 *     uuid: {
 *       uuid: 'UUID of the city',
 *       name: 'Name',
 *       lon: '',
 *       lat: '',
 *       pollutions: {
 *         waste: 0,
 *         weather: 0,
 *         nuclear: 0,
 *       },
 *       pollution: 'Pollution key',
 *       buildings: [
 *
 *       ],
 *       disasters: [
 *
 *       ]
 *     }
 *   },
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
    getCity(state) { return (city_uuid) => {
      if(!city_uuid)
        return null;
      return state.cities[city_uuid];
    }},
  },
  actions: {
    init({ commit, state, rootGetters }) {

      let pollutions = rootGetters['config/getPollutions'];

      return new Promise(resolve => {
        /**
         * Load the list of cities.
         */
        let cityKeys = Object.keys(map.cities);
        cityKeys.forEach((city_key) => {
          let city = map.cities[city_key];
          city.uuid = city_key;

          /**
           * Define the property of the city.
           */
          city.pollutions = {};
          Object.keys(pollutions).forEach((k) => city.pollutions[k] = 0)
          city.buildings = [];

          commit('ADD_CITY', {city_key, city});
        });

        /**
         * Generate the transitions.
         */
        map.transitions.forEach((t) => {
          commit('ADD_TRANSITION', t);
        });

        /**
         * Initialize board.
         */
        Object.keys(pollutions).forEach((p) => {
          let k = cityKeys[Math.floor(Math.random() * cityKeys.length)];
          commit('INCREASE_POLLUTION', { city: state.cities[k], pollution: p });
        });

        commit("SET_INIT", true);
        resolve();
      });
    },
    increasePollution({ commit, state }, { city, pollution }) {

      function increase(c, p, spread) {
        // If pollution is over 3, we dispatch 1 more to the cities linked to it.

        let total = 0;
        Object.keys(c.pollutions).forEach((k) => total += c.pollutions[k]);

        if(total == 3) {
          if(spread) {
            // Explode to other cities linked.
            state.transitions
              .filter((t) => t.city1 == c.uuid || t.city2 == c.uuid)
              .map((t) => t.city1 == c.uuid ? state.cities[t.city2] : state.cities[t.city1])
              .forEach((c1) => increase(c1, p, false));
          }
          return;
        }

        commit('INCREASE_POLLUTION', { city: c, pollution: p });
      }

      return new Promise((resolve) => {
        increase(city, pollution, true);
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
    buildResearchCenter({ commit }, { city, pollution }) {
      commit('BUILD_RESEARCH_CENTER', { city, pollution });
    },
  },
  mutations: {
    ADD_CITY(state, {city_key, city}) {
        Vue.set(state.cities, city_key, city);
    },
    ADD_TRANSITION(state, transition) {
      state.transitions.push(transition);
    },
    INCREASE_POLLUTION(state, { city, pollution }) {
      state.cities[city.uuid].pollutions[pollution]++;
    },
    DECREASE_POLLUTION(state, { city, pollution }) {
      state.cities[city.uuid].pollutions[pollution]--;
    },
    SET_INIT(state, initialized) {
      state.initialized = initialized;
    },
    BUILD_RESEARCH_CENTER(state, { city, pollution }) {
      state.cities[city.uuid].buildings.push(pollution);
    },
  }
};

export default Board;
