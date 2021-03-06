'use strict';


angular.module('copayApp.controllers').controller('LockExtractController',
    function ($rootScope, $scope, $state, $timeout, storageService, notification, profileService, bwcService, $log, $stateParams, gettext, gettextCatalog, lodash, go, isCordova) {
        let self = this;

        self.showselectwtmove = false   // 选择地址控制器

        self.lockAddress = 'Please enter the EXO extract address';     //  锁仓地址
        self.extractAddress = null;    //  提取地址

        self.lockDappAddress = 'VPASRZVEHGPLDWZY56JBVJYM35MLBTCI'   //  锁仓dapp 地址 (合约地址)
        self.wallet = null;   // 选择的当前钱包id
        let payment = require('Exoduscore/payment.js')
        let utils = require('Exoduscore/utils.js');
        self.showselectlayermove = function () {
            self.showselectwtmove = true
            $scope.index.changesendType('EXO')
        }

        self.findPaymentAddressmove = function (item) {
            console.log(item)
            self.wallet = deepCopyObj(item).wallet
            self.extractAddress = deepCopyObj(item).address
            self.lockAddress = deepCopyObj(item).address

            self.showselectwtmove = false

        }
        self.callData = "51cff8d9"


        //提取
        self._extrac = function () {

            console.log($scope.index)

            //  是否有进行选择
            if (self.lockAddress !== 'Please enter the EXO extract address' && self.extractAddress) {

                //  先判断当前记录第一笔是否是pending 状态
                console.log($scope.index.walletInfomation[self.wallet])
                if ($scope.index.walletInfomation[self.wallet][0].result === 'good') {
                    profileService.setAndStoreFocusToWallet(self.wallet, function () {
                        profileService.unlockFC(null, function (err) {
                            if (err) {
                                $rootScope.$emit('Local/ShowErrorAlert', gettextCatalog.getString('Wrong password'));
                                return;
                            }

                            //  构造calldata

                            utils.stringToHex(self.extractAddress, function (err, res) {

                                /*      console.warn('构造calldata')
                                      console.log(err)
                                      console.log(res)*/
                                if (err) {
                                    $rootScope.$emit('Local/ShowErrorAlert', gettextCatalog.getString(err));
                                    return;
                                } else {
                                    let calldatas = res

                                    let fc = profileService.focusedClient;
                                    let pubkey = utils.getPubkey(fc.credentials.xPrivKey);

                                    //等合约结构
                                    let obj = {
                                        fromAddress: self.lockAddress,
                                        toAddress: self.lockDappAddress,
                                        amount: 0,
                                        callData: self.callData + calldatas,
                                        pubkey: pubkey,
                                        xprivKey: fc.credentials.xPrivKey
                                    }

                                    console.log(obj)

                                    //  构造合约交易
                                    payment.contractTransactionData(obj, function (err, res) {

                                        // console.warn('构造交易结构')
                                        // console.log(err)
                                        // console.log(res)

                                        if (err) {
                                            if (err.match(/not enough spendable/)) {
                                                err = gettextCatalog.getString("not enough spendable");
                                            }
                                            if (err.match(/unable to get nrgPrice/)) {
                                                err = gettextCatalog.getString("network error,please try again.");
                                            }
                                            return $rootScope.$emit('Local/ShowErrorAlert', err);
                                        } else {

                                            //     发送合约交易
                                            payment.sendTransactions(res, function (err, res) {
                                                // console.warn('发送交易后返回的数据')
                                                // console.log(err)
                                                // console.log(res)
                                                if (err) {
                                                    return $rootScope.$emit('Local/ShowErrorAlert', err);
                                                } else {
                                                    $rootScope.$emit('Local/ShowErrorAlert', gettextCatalog.getString('Payment Success'));

                                                }
                                            })
                                        }
                                    })
                                }
                            })


                        })
                    })
                } else {
                    $rootScope.$emit('Local/ShowErrorAlert', gettextCatalog.getString('Please wait for the result of the last consensus'));
                }
            } else {
                $rootScope.$emit('Local/ShowErrorAlert', gettextCatalog.getString('Please select Lock address'));
            }
        }


        // 锁仓点击事件
        self.goTransfer = function () {
            $state.go('LockIn', {
                walletType: null,
                walletId: null,
                address: null,
                name: null,
                image: null,
                ammount: null,
                mnemonic: null,
                mnemonicEncrypted: null,
                _address: self.lockDappAddress
            });
        }

        // 锁仓点击事件
        self.goExtract = function () {
            $state.go('LockExtract');
        }


        //  深拷贝
        function deepCopyObj(obj) {
            if (typeof obj != 'object') {
                return obj;
            }
            var newobj = {};
            for (var attr in obj) {
                newobj[attr] = deepCopyObj(obj[attr]);
            }
            return newobj;
        }

    });
