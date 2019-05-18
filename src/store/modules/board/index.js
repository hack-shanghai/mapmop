const generate = require('nanoid/generate')

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

  },
  actions: {
    init() {

    }
  },
  mutations: {

  }
};

export default Board;
