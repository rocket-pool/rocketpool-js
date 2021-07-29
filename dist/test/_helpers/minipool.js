'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getNodeMinipoolCount = getNodeMinipoolCount;
exports.getNodeStakingMinipoolCount = getNodeStakingMinipoolCount;
exports.getMinipoolMinimumRPLStake = getMinipoolMinimumRPLStake;
exports.createMinipool = createMinipool;
exports.stakeMinipool = stakeMinipool;
exports.submitMinipoolWithdrawable = submitMinipoolWithdrawable;
exports.payoutMinipool = payoutMinipool;
exports.withdrawMinipool = withdrawMinipool;
exports.dissolveMinipool = dissolveMinipool;
exports.closeMinipool = closeMinipool;

var _beacon = require('../_utils/beacon');

var _contract = require('../_utils/contract');

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Get the number of minipools a node has
function getNodeMinipoolCount(web3, rp, nodeAddress) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return rp.minipool.getNodeMinipoolCount(nodeAddress);

                    case 2:
                        return _context.abrupt('return', _context.sent);

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
}
// Get the number of minipools a node has in Staking status
function getNodeStakingMinipoolCount(web3, rp, nodeAddress) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return rp.minipool.getNodeStakingMinipoolCount(nodeAddress);

                    case 2:
                        return _context2.abrupt('return', _context2.sent);

                    case 3:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));
}
// Get the minimum required RPL stake for a minipool
function getMinipoolMinimumRPLStake(web3, rp) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var rocketDAOProtocolSettingsMinipool, rocketDAOProtocolSettingsNode, _ref, _ref2, depositUserAmount, minMinipoolStake, rplPrice;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return rp.contracts.get('rocketDAOProtocolSettingsMinipool');

                    case 2:
                        rocketDAOProtocolSettingsMinipool = _context3.sent;
                        _context3.next = 5;
                        return rp.contracts.get('rocketDAOProtocolSettingsNode');

                    case 5:
                        rocketDAOProtocolSettingsNode = _context3.sent;
                        _context3.next = 8;
                        return Promise.all([rocketDAOProtocolSettingsMinipool.methods.getHalfDepositUserAmount().call().then(function (value) {
                            return web3.utils.toBN(value);
                        }), rocketDAOProtocolSettingsNode.methods.getMinimumPerMinipoolStake().call().then(function (value) {
                            return web3.utils.toBN(value);
                        }), rp.network.getRPLPrice().then(function (value) {
                            return web3.utils.toBN(value);
                        })]);

                    case 8:
                        _ref = _context3.sent;
                        _ref2 = _slicedToArray(_ref, 3);
                        depositUserAmount = _ref2[0];
                        minMinipoolStake = _ref2[1];
                        rplPrice = _ref2[2];
                        return _context3.abrupt('return', depositUserAmount.mul(minMinipoolStake).div(rplPrice));

                    case 14:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));
}
// Create a minipool
function createMinipool(web3, rp, options) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var minipoolManagerAddress, txReceipt, minipoolCreatedEvents;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return rp.contracts.address('rocketMinipoolManager');

                    case 2:
                        minipoolManagerAddress = _context4.sent;
                        _context4.next = 5;
                        return rp.node.deposit(web3.utils.toWei('0', 'ether'), options);

                    case 5:
                        txReceipt = _context4.sent;

                        // Get minipool created events
                        minipoolCreatedEvents = (0, _contract.getTxContractEvents)(web3, txReceipt, minipoolManagerAddress, 'MinipoolCreated', [{ type: 'address', name: 'minipool', indexed: true }, { type: 'address', name: 'node', indexed: true }, { type: 'uint256', name: 'created' }]);
                        // Return minipool instance

                        if (minipoolCreatedEvents.length) {
                            _context4.next = 9;
                            break;
                        }

                        return _context4.abrupt('return', null);

                    case 9:
                        return _context4.abrupt('return', rp.minipool.getMinipoolContract(minipoolCreatedEvents[0].minipool));

                    case 10:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));
}
// Progress a minipool to staking
function stakeMinipool(web3, rp, minipool, validatorPubkey, options) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var withdrawalCredentials, depositData, depositDataRoot;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        // Create validator pubkey
                        if (!validatorPubkey) validatorPubkey = (0, _beacon.getValidatorPubkey)();
                        // Get withdrawal credentials
                        _context5.next = 3;
                        return minipool.getWithdrawalCredentials();

                    case 3:
                        withdrawalCredentials = _context5.sent;

                        // Get validator deposit data
                        depositData = {
                            pubkey: validatorPubkey,
                            withdrawalCredentials: Buffer.from(withdrawalCredentials.substr(2), 'hex'),
                            amount: BigInt(32000000000),
                            signature: (0, _beacon.getValidatorSignature)()
                        };
                        depositDataRoot = (0, _beacon.getDepositDataRoot)(depositData);
                        // Stake

                        _context5.next = 8;
                        return minipool.stake(depositData.pubkey, depositData.signature, depositDataRoot, options);

                    case 8:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));
}
// Submit a minipool withdrawable event
function submitMinipoolWithdrawable(web3, rp, minipoolAddress, options) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return rp.minipool.submitMinipoolWithdrawable(minipoolAddress, options);

                    case 2:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));
}
// Send validator balance to a minipool
function payoutMinipool(minipool) {
    var confirm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var options = arguments[2];

    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return minipool.contract.methods.payout(confirm).send(options);

                    case 2:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));
}
// Withdraw node balances & rewards from a minipool and destroy it
function withdrawMinipool(minipool, options) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return minipool.withdraw(options);

                    case 2:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));
}
// Dissolve a minipool
function dissolveMinipool(minipool, options) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return minipool.dissolve(options);

                    case 2:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));
}
// Close a dissolved minipool and destroy it
function closeMinipool(minipool, options) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.next = 2;
                        return minipool.close(options);

                    case 2:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    }));
}
//# sourceMappingURL=minipool.js.map