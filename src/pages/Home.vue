<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          {{ $t('home.title') }}
        </h1>
        <h2 class="subtitle">
          {{ $t('home.subtitle') }}
        </h2>

        <table class="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th><abbr :title="$t('table.players.number')">#</abbr></th>
              <th>{{ $t('table.players.name') }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in players" :key="index">
              <th>{{ index+1 }}</th>
              <th>{{ player.name }}</th>
              <th><button class="button is-danger" @click="removePlayer(player)">Remove</button></th>
            </tr>
          </tbody>
        </table>

        <div class="field">
          <label class="label">{{ $t('form.add_player.name') }}</label>
          <div class="control">
            <input class="input" :class="{ 'is-danger': errors.first('playerName') }" type="text" name="playerName" v-model="player.name" v-validate="'required|min:3'" required :placeholder="$t('form.add_player.name_placeholder')" @keyup.enter="addPlayer"/>
            <p class="help is-danger">{{ errors.first('playerName') }}</p>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-primary" @click="addPlayer">{{ $t('form.add_player.submit') }}</button>
          </div>
          <div class="control">
            <button class="button is-text">Cancel</button>
          </div>
        </div>

        <router-link to="/board">
          {{ $t('action.play') }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  inject: ['$validator'],
  data() {
    return {
      player: {},
    };
  },
  computed: {
    ...mapGetters({
      players: 'players/getPlayers',
    })
  },
  mounted() {

  },
  methods: {
    addPlayer() {
      this.$validator.validate().then(valid => {
        if (!valid) {
          return;
        }

        this.$store.dispatch('players/addPlayer', { name: this.player.name });
        this.player = {};
      });
    },
    removePlayer() {
      this.$store.dispatch('players/removePlayer', this.player);
    }
  },
}
</script>

