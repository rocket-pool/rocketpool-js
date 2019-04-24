import ERC20 from './ERC20';
/**
 * Rocket Pool RPL token manager
 */
class RPL extends ERC20 {
    // Constructor
    constructor(web3, contracts) {
        super(web3, contracts, 'rocketPoolToken');
    }
}
// Exports
export default RPL;
//# sourceMappingURL=rpl.js.map