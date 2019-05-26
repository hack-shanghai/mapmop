<template>
  <div>
    <div class="top-indicator" @click="skipTurn">
      <div class="has-text-centered">
        <div>
          <p class="heading">Actions left</p>
          <p class="title">{{ game.action_left }}
            <span class="skip">Click here to skip</span>
          </p>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="columns">
        <div class="column is-three-quarters">
          <div class="box">
            <mapmop v-if="currentPlayer" :cities="cities" :connections="connections" @click="onMapClick" ref="map"/>
          </div>
        </div>
        <div class="column" v-if="currentPlayer">
          <div class="has-text-centered">
            <div class="title">Turn {{ Math.floor(countTurns / players.length)+1 }}</div>
            <button v-if="!autoplay" class="button is-danger" @click="autoplay = true; launchAutoplay()">Autoplay</button>
            <button v-if="autoplay" class="button is-warning" @click="autoplay = false">Autoplay running...</button>
          </div>
          <div v-for="(player) in players" :key="player.uuid">
            <div v-if="player.uuid != currentPlayer.uuid">
              <player-insight :player="player" @player-focus="playerFocus"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <player-hand v-if="currentPlayer" :player="currentPlayer" :pendingCard="game.card" @throw="cardSelectedToDelete" @building="buildResearchCenter" @player-focus="playerFocus"/>
    </div>

    <div :class="{'is-active': game.disaster}" class="modal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <header class="modal-card-head">
          <p class="modal-card-title">Disaster!</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          {{ game.disaster }}
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="applyDisaster">OK</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style>
.top-indicator {
  position: fixed;
  top: 0;
  left: 20%;
  background-color: #212121;
  padding: 20px;
  border-radius: 0 0 20px 20px;
  z-index: 10;
  cursor: pointer;
}

.skip {
  display: block;
  font-size: 12px;
  color: #ccc;
}
</style>

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
        action_left: 0,
        card: null,
        disaster: null
      },
      countTurns: 0,
      autoplay: false,
    };
  },
  computed: {
    ...mapGetters({
      settings: 'config/getSettings',
      players: 'players/getPlayers',
      pollutions: 'config/getPollutions',
      cities: 'board/getCities',
      connections: 'board/getTransitions',
      init: 'board/isInitialized',
      currentPlayer: 'players/getCurrentPlayer',
      cards: 'decks/getCards',
      cardCount: 'decks/getCount'
    })
  },
  beforeMount() {
    if (!this.init) {
      this.$router.replace("/");
      return;
    }
  },
  mounted() {
    this.game.action_left = this.settings.action_per_turn;
  },
  methods: {
    onMapClick(city) {
      if (this.game.action_left < 1) {
        alert("No more action available!");
        return;
      }

      /**
       * If the user is in the city, we decrease a pollution.
       */
      if (city.uuid == this.currentPlayer.city.uuid) {
        /**
         * If there is no pollution to decrease, we ignore the click.
         */
        if(Object.keys(city.pollutions).some((k) => city.pollutions[k] > 0)) {
          this.$store.dispatch('board/decreasePollution', city)
          .then(() => {
            this.decreaseAction();
          });
        }
        return;
      }

      /**
       * If the user is in the city close to the one clicked, we move the user.
       */
      this.$store
        .dispatch("players/moveToCity", city)
        .then(() => {
          this.decreaseAction();
        })
        .catch(() => {
          alert("Cannot move to a city not linked with your current city!");
        });
    },
    decreaseAction() {
      this.game.action_left--;

      if(this.checkGameEndedSuccess()) {
        alert('GAME WON!');
        return;
      }

      if(this.game.action_left < 1) {
        // Make the next card of the deck visible.
        if (this.cards.length == 0) {
          alert("GAME OVER!");
          return;
        }

        // If the user has space in his hand, we animate the addition of the card in his hand.
        if(this.currentPlayer.cards.length < this.settings.player_max_deck_size) {
          let card = this.cards[0];
          this.$store.dispatch('decks/removeCard', card);
          this.$store.dispatch('players/addCard', card);
          this.nextPlayer();
          return;
        }

        this.game.card = this.cards[0];

        // If it's a research card, we let the user choose which card he want to loose.
        if (this.game.card.type == "research") {
          return;
        }

        // If it's a disaster card, we display a modal with the disaster.
        this.game.disaster = this.game.card.disaster;
      }
    },
    skipTurn() {
      if(this.game.action_left == 0) {
        return;
      }

      this.game.action_left = 1;
      this.decreaseAction();
    },
    cardSelectedToDelete(card) {
      this.$store.dispatch("decks/removeCard", this.game.card);
      let newCard = this.game.card;
      this.game.card = null;
      if (newCard.uuid == card.uuid) {
        this.nextPlayer();
        return;
      }

      // Remove the old card from the player deck.
      this.$store.dispatch("players/removeCard", card);

      // Add the card in the players deck.
      this.$store.dispatch("players/addCard", newCard);

      this.nextPlayer();
    },
    applyDisaster() {
      this.$store.dispatch("decks/removeCard", this.game.card);
      this.nextPlayer();
    },
    playerFocus(player) {
      this.$refs.map.centerPlayer(player);
    },
    nextPlayer() {
      this.countTurns++;
      // Apply increase of pollution in x cities.
      let pollutionsKeys = Object.keys(this.pollutions);
      for(let i = 0; i < this.settings.new_stack_per_turn; i++) {
        let randCity = Math.floor(Math.random() * this.cities.length);
        let randPollution = Math.floor(Math.random() * pollutionsKeys.length);
        // eslint-disable-next-line
        console.log('Increase pollution in ' + this.cities[randCity].name);
        this.$store.dispatch('board/increasePollution', { city: this.cities[randCity], pollution: pollutionsKeys[randPollution] });
      }

      // Switch player.
      this.$store.dispatch("players/nextPlayer");

      // Reset turn parameter
      this.game.action_left = this.settings.action_per_turn;
      this.game.card = null;
      this.game.disaster = null;
    },
    buildResearchCenter(cards) {
      if (this.game.action_left < 1) {
        alert("No more action available!");
        return;
      }
      cards.forEach((card) => this.$store.dispatch('players/removeCard', card));
      this.$store.dispatch('board/buildResearchCenter', { city: this.currentPlayer.city, pollution: null });
    },
    checkGameEndedSuccess() {
      let researchCenters = 0;
      let ended = !Object.keys(this.cities).some((k) => {
        let city = this.cities[k];
        if(city.buildings.length > 0) {
          researchCenters++;
        }
        return Object.keys(city.pollutions).some((p) => city.pollutions[p] > 0);
      });

      if(ended) {
        return researchCenters >= Object.keys(this.pollutions).length;
      }
      return false;
    },
    launchAutoplay() {
      /**
       * Autoplay the game.
       */
      if(this.checkGameEndedSuccess() || this.cards.length == 0) {
        // eslint-disable-next-line
        console.log('Game ended!');
        return false;
      }

      let currentPlayer = this.currentPlayer;
      /**
        * Play move.
        */
      for(let i = 0; i < this.game.action_left; i++) {
        let currentCity = this.cities.filter((c) => c.uuid == currentPlayer.city.uuid)[0];

        // TODO: Check if a center can be build.

        // TODO: Define strategy to check if it is necessary to remove a pollution.
        let pollutionCount = 0;
        Object.keys(currentCity.pollutions).forEach((k) => pollutionCount += currentCity.pollutions[k]);

        if(pollutionCount > 0) {
          // eslint-disable-next-line
          console.log(currentPlayer.name + " remove a pollution in " + currentCity.name);
          this.onMapClick(currentCity);
          continue;
        }

        // TODO: Define strategy to choose the city.
        let citiesNearBy = this.connections.filter((t) => t.city1 == currentCity.uuid || t.city2 == currentCity.uuid)
          .map((t) => {
            if(t.city1 == currentCity.uuid)
              return this.cities.filter((c) => c.uuid == t.city2)[0];

            return this.cities.filter((c) => c.uuid == t.city1)[0];
          });

        let nextCity = citiesNearBy[Math.floor(Math.random() * citiesNearBy.length)];
        // eslint-disable-next-line
        console.log(currentPlayer.name + " move in " + currentCity.name);
        this.onMapClick(nextCity);
      }

      /**
        * Player has changed.
        */
      if(currentPlayer.uuid != this.currentPlayer.uuid) {
        // eslint-disable-next-line
        console.log('Player had changed!');
        return;
      }

      /**
        * Choose card if required.
        */
      if(this.game.card != null) {
        let card = currentPlayer.cards[0]; // TODO: Define strategy to select the card.
        if(card != null) {
          // eslint-disable-next-line
          console.log(currentPlayer.name + " choose to remove card " + card.name);
          this.cardSelectedToDelete(card);
        }
      }

      // eslint-disable-next-line
      console.log('Actions ended!');

      if(this.autoplay) {
        setTimeout(this.launchAutoplay, 1000);
      }
    },
  },
};
</script>
