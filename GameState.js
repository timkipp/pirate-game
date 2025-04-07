class GameState {
    constructor() {
        this.resources = {
            gold: 100,
            food: 100,
            morale: 100,
            crewSize: 100
        };
        this.marketCurrency = 0; // Currency for marketplace use
        this.captain = null;
    }

    setCaptain(captain) {
        this.captain = captain;
        this.resources.gold = captain.startingGold;
        this.resources.food = captain.startingFood;
        this.resources.morale = captain.startingMorale;
        this.resources.crewSize = captain.startingCrewSize;
    }

    getResource(resource) {
        return this.resources[resource];
    }

    setResource(resource, value) {
        this.resources[resource] = value;
    }

    getMarketCurrency() {
        return this.marketCurrency;
    }

    setMarketCurrency(value) {
        this.marketCurrency = value;
    }

    applyStatBoost(boost) {
        for (let resource in boost) {
            this.resources[resource] += boost[resource];
        }
    }
}

module.exports = GameState;