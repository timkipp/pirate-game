const User = require('./models/User'); // Import the User model

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

    // Helper method to find a user (consistent with users.js)
    async findUser() {
        try {
            const user = await User.findOne({ userName: this.userID });
            if (!user) {
                throw new Error(`User with username "${this.userID}" not found.`);
            }
            return user;
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }

    // Method to load user data from the database
    async loadUserData() {
        try {
            const user = await this.findUser(); // Use the helper method
            if (user.currentRun) {
                this.resources.gold = Math.min(100, user.currentRun.gold || 0);
                this.resources.provisions = Math.min(100, user.currentRun.provisions || 0);
                this.resources.morale = Math.min(100, user.currentRun.moral || 0);
                this.resources.crewSize = Math.min(100, user.currentRun.crew || 0);
                this.marketCurrency = user.marketCurrency || 0;
            }
            this.checkIfLost(); // Ensure the lost state is recalculated
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    // Method to save user data to the database
    async saveUserData() {
        try {
            const user = await this.findUser(); // Use the helper method
            user.currentRun = {
                gold: this.resources.gold,
                provisions: this.resources.provisions,
                moral: this.resources.morale,
                crew: this.resources.crewSize,
                score: user.currentRun?.score || 0 // Preserve score if it exists
            };
            user.marketCurrency = this.marketCurrency;
            await user.save();
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    // Method to set the captain and update resources
    async setCaptain(captain) {
        this.captain = captain;
        this.resources.gold = Math.min(100, captain.startingGold || 0);
        this.resources.provisions = Math.min(100, captain.provisions || 0);
        this.resources.morale = Math.min(100, captain.startingMorale || 0);
        this.resources.crewSize = Math.min(100, captain.startingCrewSize || 0);
        await this.saveUserData(); // Save updated data
    }

    // Method to get a resource value
    getResource(resource) {
        return this.resources[resource];
    }

    // Method to set a resource value and save data
    async setResource(resource, value) {
        this.resources[resource] = Math.max(0, Math.min(100, value)); // Ensure value is between 0 and 100
        this.checkIfLost();
        await this.saveUserData(); // Save updated data
    }

    // Method to get market currency
    getMarketCurrency() {
        return this.marketCurrency;
    }

    // Method to set market currency and save data
    async setMarketCurrency(value) {
        this.marketCurrency = value;
        await this.saveUserData(); // Save updated data
    }

    // Method to apply stat boosts and save data
    async applyStatBoost(boost) {
        for (let resource in boost) {
            this.resources[resource] = Math.max(0, Math.min(100, this.resources[resource] + boost[resource])); // Ensure value is between 0 and 100
        }
        this.checkIfLost();
        await this.saveUserData(); // Save updated data
    }

    // Method to check if the game is lost
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
