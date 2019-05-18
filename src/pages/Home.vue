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
            </tr>
          </tbody>
        </table>

        <div class="field">
          <label class="label">{{ $t('form.add_player.name') }}</label>
          <div class="control">
            <input class="input" type="text" v-model="player.name" :placeholder="$t('form.add_player.name_placeholder')"/>
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
      this.$store.dispatch('players/addPlayer', { name: this.player.name });
    },
  },
}
</script>

