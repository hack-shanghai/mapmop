const generate = require("nanoid/generate");

const cities = require("../../../assets/cities.json");
const connections = require("../../../assets/connections.json");

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
    initialized: false,
    cities: [],
    transitions: []
  },
  getters: {
    isInitialized(state) {
      return state.initialized;
    },
    getCities(state) {
      return state.cities;
    },
    getTransitions(state) {
      return state.transitions;
    },
    getCity(state, city_uuid) {
      if (!city_uuid) return null;
      return state.cities.filter(c => c.uuid == city_uuid)[0];
    }
  },
  actions: {
    init({ commit }) {
      return new Promise(resolve => {
        /**
         * Load the list of cities.
         */
        cities.forEach(city => {
          /**
           * Define the property of the city.
           */
          city.uuid = "cid" + generate("1234567890", 10);
          city.pollutions = {
            waste: 0,
            weather: 0,
            nuclear: 0
          };
          city.buildings = [];
          commit("ADD_CITY", city);
        });

        /**
         * Generate the transitions.
         */
        connections.forEach(c => {
          commit("ADD_TRANSITION", c);
        });

        commit("SET_INIT", true);
        resolve();
      });
    }
  },
  mutations: {
    ADD_CITY(state, city) {
      state.cities.push(city);
    },
    ADD_TRANSITION(state, transition) {
      state.transitions.push(transition);
    },
    SET_INIT(state, initialized) {
      state.initialized = initialized;
    }
  }
};

export default Board;
