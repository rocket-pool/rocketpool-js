import { handleConfirmations } from '../../utils/transaction';
import ERC20 from './ERC20';
/**
 * Rocket Pool RPB token manager
 */
class RPB extends ERC20 {
    // Constructor
    constructor(web3, contracts) {
        super(web3, contracts, 'rocketBETHToken');
    }
    /**
     * Mutators - Public
     */
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