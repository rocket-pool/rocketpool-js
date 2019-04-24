import { handleConfirmations } from '../../utils/transaction';
/**
 * Rocket Pool RPB token manager
 */
class RPB {
    // Constructor
    constructor(web3, contracts) {
        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessor
    get tokenContract() {
        return this.contracts.get('rocketBETHToken');
    }
    /**
     * Getters
     */
    // Get the token balance of an account
    balanceOf(account) {
        return this.tokenContract.then((tokenContract) => {
            return tokenContract.methods.balanceOf(account).call();
        });
    }
    // Get the allowance of a spender for an account
    allowance(account, spender) {
        return this.tokenContract.then((tokenContract) => {
            return tokenContract.methods.allowance(account, spender).call();
        });
    }
    /**
     * Mutators - Public
     */
    // Transfer tokens to a recipient
    transfer(to, amountWei, options, onConfirmation) {
        return this.tokenContract.then((tokenContract) => {
            return handleConfirmations(tokenContract.methods.transfer(to, amountWei).send(options), onConfirmation);
        });
    }
    // Approve an allowance for a spender
    approve(spender, amountWei, options, onConfirmation) {
        return this.tokenContract.then((tokenContract) => {
            return handleConfirmations(tokenContract.methods.approve(spender, amountWei).send(options), onConfirmation);
        });
    }
    // Transfer tokens from an account to a recipient if approved
    transferFrom(from, to, amountWei, options, onConfirmation) {
        return this.tokenContract.then((tokenContract) => {
            return handleConfirmations(tokenContract.methods.transferFrom(from, to, amountWei).send(options), onConfirmation);
        });
    }
    // Burn RPB for ETH
    burnForEth(amountWei, options, onConfirmation) {
        return this.tokenContract.then((tokenContract) => {
            return handleConfirmations(tokenContract.methods.burnTokensForEther(amountWei).send(options), onConfirmation);
        });
    }
}
// Exports
export default RPB;
//# sourceMappingURL=rpb.js.map