<template>
  <div>
    <div class="top-indicator">
      <div class="has-text-centered">
        <div>
          <p class="heading">Actions left</p>
          <p class="title">{{ game.action_left }}</p>
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
          <div v-for="(player, index) in players" :key="player.uuid">
            <div v-if="player.uuid != currentPlayer.uuid">
				      <player-insight :player="player"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <player-hand v-if="currentPlayer" :player="currentPlayer"/>
    </div>
  </div>
</template>

<style>
.top-indicator {
  position:fixed;
  top: 0;
  left: 20%;
  background-color: #212121;
  padding: 20px;
  border-radius: 0 0 20px 20px;
  z-index: 10;
}
</style>

<script>
import { mapGetters } from 'vuex';
import Map from "../components/Map";
import PlayerHand from "../components/PlayerHand";
import PlayerInsight from "../components/PlayerInsight";

export default {
  name: "board",
  components: {
    'mapmop': Map,
    'player-hand': PlayerHand,
		'player-insight': PlayerInsight,
  },
  data() {
    return {
      game: {
        action_left: 0,
        card: null,
        disaster: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      settings: 'config/getSettings',
      players: 'players/getPlayers',
      cities: 'board/getCities',
      connections: 'board/getTransitions',
      init: 'board/isInitialized',
      currentPlayer: 'players/getCurrentPlayer',
      cards: 'decks/getCards',
      cardCount: 'decks/getCount',
    })
  },
  beforeMount() {
    if(!this.init) {
      this.$router.replace('/');
      return;
    }
  },
  mounted() {
    this.game.action_left = this.settings.action_per_turn;
  },
  methods: {
    onMapClick(city) {
      if(this.game.action_left < 1) {
        alert('No more action available!');
        return;
      }

      /**
       * If the user is in the city, we decrease a pollution.
       */
      if(city.uuid == this.currentPlayer.city.uuid) {
        /**
         * If there is no pollution to decrease, we ignore the click.
         */
        if(city.pollutions.waste == 0 &&
          city.pollutions.nuclear == 0 &&
          city.weather == 0) {
          return;
        }

        // TODO: Decreate a pollution.

        this.decreaseAction();
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
        // TODO: End the round, and switch to the next player.

        // Make the next card of the deck visible.
        if(this.cards.length == 0) {
          alert('GAME OVER!');
          return;
        }
        this.game.card = this.cards[0];

        // If it's a research card, we let the user choose which card he want to loose.
        if (this.game.card.type == 'research') {
          return;
        }

        // If it's a disaster card, we display a modal with the disaster.
        this.game.disaster = this.game.card.disaster;
      }
    },
    cardSelectedToDelete(card) {
      this.$store.dispatch('decks/removeCard', this.game.card);
      let newCard = this.game.card;
      this.game.card = null;
      if(this.game.card.uuid == card.uuid) {
        this.nextPlayer();
        return;
      }

      // Remove the old card from the player deck.
      this.$store.dispatch('players/removeCard', card);

      // Add the card in the players deck.
      this.$store.dispatch('players/addCard', newCard);

      this.nextPlayer();
    },
    applyDisaster() {
      this.$store.dispatch('decks/removeCard', this.game.card);
      this.nextPlayer();
    },
    nextPlayer() {
      // Apply increase of pollution in 2 cities.
      // TODO

      // Switch player.
      this.$store.dispatch('players/nextPlayer');

      // Reset turn parameter
      this.game.action_left = this.settings.action_per_turn;
      this.game.card = null;
      this.game.disaster = null;
    },
  },
};
</script>
