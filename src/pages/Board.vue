<template>
  <div>
    <div class="container">
      <div class="level">
        <div class="level-item">
          <p class="title">Map Mop</p>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Actions left</p>
            <p class="title">{{ game.action_left }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="columns">
        <div class="column is-three-quarters">
          <div class="box">
            <mapmop :cities="cities" :connections="connections" @click="onMapClick"/>
          </div>
        </div>
        <div class="column">
          <div v-for="(player) in players" :key="player.uuid">
            <div v-if="player.uuid != currentPlayer.uuid">
              <player-insight :player="player"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <player-hand :player="currentPlayer"/>
    </div>

    <div class="container">
      <div v-for="card in cards" :key="card.uuid">
        {{ card.city.name }} - {{ card.pollution }} - {{ card.type }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Map from "../components/Map";
import PlayerHand from "../components/PlayerHand";
import PlayerInsight from "../components/PlayerInsight";

export default {
  name: "board",
  components: {
    mapmop: Map,
    "player-hand": PlayerHand,
    "player-insight": PlayerInsight
  },
  data() {
    return {
      game: {
        action_left: 3
      }
    };
  },
  computed: {
    ...mapGetters({
      players: "players/getPlayers",
      cities: "board/getCities",
      connections: "board/getTransitions",
      init: "board/isInitialized",
      currentPlayer: "players/getCurrentPlayer",
      cards: "decks/getCards",
    })
  },
  beforeMount() {
    if (!this.init) {
      this.$router.replace("/");
      return;
    }
  },
  mounted() {},
  methods: {
    onMapClick(city) {
      if(this.game.action_left < 1) {
        alert('No more action available!');
        return;
      }

      /**
       * If the user is in the city, we decrease a pollution.
       */
      if (city.uuid == this.currentPlayer.city.uuid) {
        /**
         * If there is no pollution to decrease, we ignore the click.
         */
        if(!Object.keys(city.pollutions).some((k) => city.pollutions[k] > 0)) {
          return;
        }

        this.$store.dispatch('board/decreasePollution', city)
        .then(() => {
          this.decreaseAction();
        });

        return;
      }

       /**
        * If the user is in the city close to the one clicked, we move the user.
        */
        this.$store.dispatch('players/moveToCity', city)
        .then(() => {
          this.decreaseAction();
        }).catch(() => {
          alert("Cannot move to a city not linked with your current city!");
        });
    },
    decreaseAction() {
      this.game.action_left--;

      if(this.game.action_left < 1) {
        // TODO: End the turn, and switch to the next player.
      }
    }
  }
};
</script>
