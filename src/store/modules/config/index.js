const settings = require('../game_settings.json');

const Config = {
  namespaced: true,
  state: {
    config: settings,
  },
  getters: {
    getSettings(state) {
      return state.config.settings;
    },
    getCharacters(state) {
      return state.config.characters;
    },
    getPollutions(state) {
      return state.config.pollutions;
    },
    getCrisis(state) {
      return state.config.crisis;
    },
    getResearchCenter(state) {
      return state.config.research_center;
    }
  },
  actions: {

  },
  mutations: {

  },
};

export default Config;
