import { handleConfirmations } from '../../utils/transaction';
/**
 * ERC20 token contract
 */
class ERC20 {
    // Constructor
    constructor(web3, contracts, tokenContractName) {
        this.web3 = web3;
        this.contracts = contracts;
        this.tokenContractName = tokenContractName;
    }
    // Contract accessor
    get tokenContract() {
        return this.contracts.get(this.tokenContractName);
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
}
// Exports
export default ERC20;
//# sourceMappingURL=ERC20.js.map