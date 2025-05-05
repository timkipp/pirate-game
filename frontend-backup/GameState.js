class GameState {
    constructor(userID) {
        this.userID = userID;
        this.resources = {
            gold: 100,
            provisions: 100,
            morale: 100,
            crewSize: 100
        };
        this.marketCurrency = 0; // Currency for marketplace use
        this.captain = null;
        this.lost = false; // Track if the game is lost
    }

    setCaptain(captain) {
        this.captain = captain;
        this.resources.gold = captain.startingGold;
        this.resources.provisions = captain.startingFood;
        this.resources.morale = captain.startingMorale;
        this.resources.crewSize = captain.startingCrewSize;
    }

    getResource(resource) {
        return this.resources[resource];
    }

    setResource(resource, value) {
        this.resources[resource] = Math.max(0, Math.min(100, value)); // Ensure value is between 0 and 100
        this.checkIfLost();
    }

    getMarketCurrency() {
        return this.marketCurrency;
    }

    setMarketCurrency(value) {
        this.marketCurrency = value;
    }

    applyStatBoost(boost) {
        for (let resource in boost) {
            this.resources[resource] = Math.max(0, Math.min(100, this.resources[resource] + boost[resource])); // Ensure value is between 0 and 100
        }
        this.checkIfLost();
    }

    checkIfLost() {
        for (let resource in this.resources) {
            if (this.resources[resource] === 0) {
                this.lost = true;
                return;
            }
        }
        this.lost = false;
    }
}

module.exports = GameState;