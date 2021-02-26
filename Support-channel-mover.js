/*jshint esversion: 6 */
registerPlugin({
        name: 'Support Channel notifier + channel creator',
        version: '1.4',
        description: 'Automatically opens a channel for your user and moves him in!',
        author: 'Mortis, Andreas Fink (https://discord.gg/mw2WMpW)',
        vars: [{
                type: "array",
                name: "channels",
                title: "Channels",
                default: [],
                vars: [{
                        name: 'supportChannel',
                        title: 'select Supportchannel',
                        type: 'channel'
                    },
                    {
                        type: "array",
                        name: 'supporterGroupIDs',
                        title: "Supporters",
                        default: [],
                        vars: [{
                            name: 'id',
                            title: 'Enter Supporter Group ID',
                            type: 'number',
                            placeholder: '0'

                        }]
                    },
                    {
                        type: "array",
                        name: 'supporterAFKchannels',
                        title: "Supporter AFK Channels",
                        default: [],
                        vars: [{
                            name: 'id',
                            title: 'Select channel',
                            type: 'channel'
                        }]
                    },

                    /*
                        White/Blacklist
                    */

                    {
                        name: 'whiteBlackListOption',
                        title: 'Choose the type of the following list',
                        type: 'select',
                        options: ["no white/blacklist", "whitelist", "blacklist"],
                        placeholder: 'false',
                        default: "no white/blacklist"
                    },
                    {
                        type: "array",
                        name: 'whiteBlackList',
                        title: "Group IDs to whitelist",
                        default: [],
                        conditions: [{
                            field: 'whiteBlackListOption',
                            value: 1
                        }],
                        vars: [{
                            name: 'id',
                            title: 'Enter Group ID',
                            type: 'number',
                            placeholder: '0'

                        }]
                    },
                    {
                        type: "array",
                        name: 'whiteBlackList',
                        title: "Group IDs to blacklist",
                        default: [],
                        conditions: [{
                            field: 'whiteBlackListOption',
                            value: 2
                        }],
                        vars: [{
                            name: 'id',
                            title: 'Enter Group ID',
                            type: 'number',
                            placeholder: '0'

                        }]
                    },
                    {
                        name: 'blockedSendOptionUser',
                        title: 'How to notify the user that he is not allowed in support',
                        type: 'select',
                        options: ["no notification", "chat", "poke"],
                        placeholder: 'false',
                        default: '0',
                        conditions: [{
                            field: 'whiteBlackListOption',
                            value: 1
                        }],
                    },
                    {
                        name: 'blockedSendOptionUser',
                        title: 'How to notify the user that he is not allowed in support',
                        type: 'select',
                        options: ["no notification", "chat", "poke"],
                        placeholder: 'false',
                        default: '0',
                        conditions: [{
                            field: 'whiteBlackListOption',
                            value: 2
                        }],
                    },
                    {
                        name: 'blockedUserMessage',
                        title: 'user Message',
                        type: 'string',
                        placeholder: 'Sorry, at least one of your server groups is not allowed in support',
                        default: 'Sorry, at least one of your server groups is not allowed in support',
                        conditions: [{
                            field: 'blockedSendOptionUser',
                            value: 2
                        }],
                    },
                    {
                        name: 'blockedUserMessage',
                        title: 'user Message',
                        type: 'multiline',
                        placeholder: 'Sorry, at least one of your server groups is not allowed in support',
                        default: 'Sorry, at least one of your server groups is not allowed in support',
                        conditions: [{
                            field: 'blockedSendOptionUser',
                            value: 1
                        }],
                    },

                    /*

                        User-Notify

                    */
                    {
                        name: 'sendOptionuser',
                        title: 'How to notify the user',
                        type: 'select',
                        options: ["no notification", "chat", "poke"],
                        placeholder: 'false',
                        default: '0'
                    },
                    {
                        name: 'userMessage',
                        title: 'user Message',
                        type: 'string',
                        placeholder: 'A Supporter has been Notified',
                        default: 'A Supporter has been Notified',
                        conditions: [{
                            field: 'sendOptionuser',
                            value: 2
                        }],
                    },
                    {
                        name: 'userMessage',
                        title: 'user Message',
                        type: 'multiline',
                        placeholder: 'A Supporter has been Notified',
                        default: 'A Supporter has been Notified',
                        conditions: [{
                            field: 'sendOptionuser',
                            value: 1
                        }],
                    },

                    /*

                        supporter-Notify

                    */
                    {
                        name: 'sendOptionsupporter',
                        title: 'How to notify the supporter(s)',
                        type: 'select',
                        options: ["no notification", "chat", "poke"],
                        placeholder: 'false',
                        default: '0'
                    },
                    {
                        name: 'supporterMessage',
                        title: 'supporter message',
                        type: 'string',
                        placeholder: 'An User needs your help',
                        default: 'An User needs your help',
                        conditions: [{
                            field: 'sendOptionsupporter',
                            value: 2
                        }],
                    },
                    {
                        name: 'supporterMessage',
                        title: 'supporter message',
                        type: 'multiline',
                        placeholder: 'An User needs your help',
                        default: 'An User needs your help',
                        conditions: [{
                            field: 'sendOptionsupporter',
                            value: 1
                        }],
                    },

                    /*

                        Channel-options

                        The channel options were first created by https://forum.sinusbot.com/members/tuetchen.10151/, and were taken to that script with permission of Tuetchen. We thank Tuetchen for letting us take that piece of code.
                    */
                    {
                        name: 'text',
                        title: '%country% = client country | %Tconnections% = total connections | %Fconnection% = first connection | %version% = client teamspeak version | %platform% = client operating system',
                    },
                    {
                        name: 'supportChannelChannelType',
                        title: 'ChannelType of created channel',
                        type: 'select',
                        options: ["permanent", "semi-permanent", "temporary"],
                        default: 0,
                    },
                    {
                        name: 'supportChannelDeleteDelay',
                        title: 'Delete Delay of channel in Seconds',
                        indent: 2,
                        type: 'number',
                        placeholder: 2,
                        default: 2,
                        conditions: [{
                            field: 'supportChannelChannelType',
                            value: 2
                        }]
                    },
                    {
                        name: 'supportChannelName',
                        title: 'Enter support channel name',
                        type: 'string',
                        placeholder: 'Support » %user%',
                        default: 'Support » %user%'
                    },
                    {
                        name: 'supportChannelDescription',
                        title: 'set a custom channel description (if you do not want a channel description just leave it blank)',
                        type: 'multiline',
                        default: ''
                    },
                    {
                        name: 'supportChannelTopic',
                        title: 'set a custom channel topic',
                        type: 'string',
                        default: 'Created by SupportChannelMover'
                    },
                    {
                        name: 'supportChannelMaxClients',
                        title: 'Enter max clients for created channel (-1 to disable)',
                        type: 'string',
                        placeholder: '0',
                        default: '-1'
                    },
                    {
                        name: 'supportChannelMaxFamilyClients',
                        title: 'Enter max family clients for created channel (-1 to disable)',
                        type: 'string',
                        placeholder: '0',
                        default: '-1'
                    },
                    {
                        name: 'supportChannelParentChannelID',
                        title: 'select parent channel',
                        type: 'channel',

                    },
                    {
                        name: 'supportChannelPositionID',
                        title: 'select the channel before the destination',
                        type: 'channel',

                    },
                    {
                        name: 'supportChannelEncryption',
                        title: 'Should the Channel be encrypted?',
                        type: 'select',
                        options: [
                            'No',
                            'Yes'
                        ]
                    },
                    {
                        name: 'supportChannelPassword',
                        title: 'Channel Password',
                        type: 'string',
                        default: ''
                    },
                    {
                        name: 'supportChannelchannelCodec',
                        title: 'Channel Codec of the created Channel',
                        type: 'select',
                        options: [
                            'Speex Narrowband',
                            'Speex Wideband',
                            'Speex Ultra-Wideband',
                            'CELT Mono',
                            'Opus Voice',
                            'Opus Music'
                        ]
                    },
                    {
                        name: 'supportChannelchannelCodecQuality',
                        title: 'Codec Quality of the created Channel',
                        type: 'select',
                        options: [
                            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
                        ]
                    },
                    {
                        name: 'supportChannelPermissions',
                        title: 'Custom Channel Permissions',
                        type: 'array',
                        vars: [{
                                name: 'permission',
                                title: 'Channel Permission',
                                type: 'select',
                                options: [
                                    'Custom',
                                    'i_channel_needed_join_power',
                                    'i_channel_needed_subscribe_power',
                                    'i_channel_needed_description_view_power',
                                    'i_channel_needed_modify_power',
                                    'i_channel_needed_delete_power'
                                ]
                            },
                            {
                                name: 'customPermission',
                                title: 'Name of the custom Permission',
                                type: 'string',
                                conditions: [{
                                    field: 'permission',
                                    value: 0
                                }]
                            },
                            {
                                name: 'value',
                                title: 'Value of the chosen Permission',
                                type: 'number'
                            }
                        ]
                    },

                    /*

                       Offline-options

                    */

                    {
                        name: 'disableOffline',
                        title: 'disable channel creation if offline',
                        type: 'checkbox',
                        default: '1'
                    },
                    {
                        name: 'offlineSendOptionUser',
                        title: 'How to notify the user that the support is closed',
                        type: 'select',
                        options: ["no notification", "chat", "poke"],
                        default: '0',
                        conditions: [{
                            field: 'disableOffline',
                            value: true
                        }],
                    },
                    {
                        name: 'offlineUserMessage',
                        title: 'user Message',
                        type: 'string',
                        placeholder: 'Sorry, no supporter is currently available',
                        default: 'Sorry, no supporter is currently available',
                        conditions: [{
                            field: 'offlineSendOptionUser',
                            value: 2
                        }],
                    },
                    {
                        name: 'offlineUserMessage',
                        title: 'user Message',
                        type: 'multiline',
                        placeholder: 'Sorry, no supporter is currently available',
                        default: 'Sorry, no supporter is currently available',
                        conditions: [{
                            field: 'offlineSendOptionUser',
                            value: 1
                        }],
                    },

                    /*

                        Channelcloser-options

                    */

                    {
                        name: 'checkboxchannelcloser',
                        title: 'enable channel rename online/offline',
                        type: 'checkbox',
                        default: 'true'
                    },
                    {
                        name: 'waitingroomonline',
                        title: 'channel name if supporters are online',
                        type: 'string',
                        placeholder: ' Support waitingroom - OPEN',
                        default: ' Support waitingroom - OPEN',
                        conditions: [{
                            field: 'checkboxchannelcloser',
                            value: true
                        }],
                    },
                    {
                        name: 'waitingroomoffline',
                        title: 'channel name if supporters are all offline',
                        type: 'string',
                        placeholder: ' Support Waitingroom - CLOSED',
                        default: ' Support waitingroom - CLOSED',
                        conditions: [{
                            field: 'checkboxchannelcloser',
                            value: true
                        }],
                    },
                    {
                        name: 'waitingroomofflinemaxclients',
                        title: 'channel max clients if supporters are all offline (0 to close channel)',
                        type: 'string',
                        placeholder: '0',
                        default: '0',
                        conditions: [{
                            field: 'checkboxchannelcloser',
                            value: true
                        }],
                    },
                    {
                        name: 'waitingroomonlinemaxclients',
                        title: 'channel max clients if supporters are online (-1 to disable)',
                        type: 'string',
                        placeholder: '-1',
                        default: '-1',
                        conditions: [{
                            field: 'checkboxchannelcloser',
                            value: true
                        }],
                    },



                    {
                        name: 'includeMoved',
                        title: 'also create a supportchannel for moved users',
                        type: 'checkbox',
                        default: 'true',
                    },
                    {
                        name: 'includeSupporter',
                        title: 'also create a supportchannel for supporters',
                        type: 'checkbox',
                        default: 'true'
                    },
                    {
                        name: 'deleteChannel',
                        title: 'delete channel after it is empty',
                        type: 'checkbox',
                        default: 'true',
                    },


                    {
                        name: 'lang',
                        title: 'Custom Months',
                        type: 'checkbox',
                        default: 'false',
                    },

                    {
                        name: 'm1',
                        title: 'January',
                        type: 'string',
                        placeholder: 'January',
                        default: 'January',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm2',
                        title: 'February',
                        type: 'string',
                        placeholder: 'February',
                        default: 'February',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm3',
                        title: 'March',
                        type: 'string',
                        placeholder: 'March',
                        default: 'March',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm4',
                        title: 'April',
                        type: 'string',
                        placeholder: 'April',
                        default: 'April',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm5',
                        title: 'May',
                        type: 'string',
                        placeholder: 'May',
                        default: 'May',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm6',
                        title: 'June',
                        type: 'string',
                        placeholder: 'June',
                        default: 'June',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm7',
                        title: 'July',
                        type: 'string',
                        placeholder: 'July',
                        default: 'July',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm8',
                        title: 'August',
                        type: 'string',
                        placeholder: 'August',
                        default: 'August',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm9',
                        title: 'September',
                        type: 'string',
                        placeholder: 'September',
                        default: 'September',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm10',
                        title: 'October',
                        type: 'string',
                        placeholder: 'October',
                        default: 'October',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm11',
                        title: 'November',
                        type: 'string',
                        placeholder: 'November',
                        default: 'November',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                    {
                        name: 'm12',
                        title: 'December',
                        type: 'string',
                        placeholder: 'December',
                        default: 'December',
                        conditions: [{
                            field: 'lang',
                            value: true
                        }],
                    },
                ]
            },
            {
                name: 'supportChannelcreateTime',
                title: 'Enter support channel create/user move Time in milliseconds',
                type: 'number',
                placeholder: '5000',
                default: '5000'
            },
            {
                name: 'supportChanneldeleteTime',
                title: 'Enter support channel delete Time in milliseconds',
                type: 'number',
                placeholder: '5000',
                default: '5000'
            },
            {
                name: 'debug',
                title: 'DEBUG',
                type: 'checkbox',
                default: '0'
            },
        ]
    },
    function (_, config, meta) {
        const event = require('event');
        const engine = require('engine');
        const backend = require('backend');

        const requestDeleteChannels = [];
        for (var i = 0; i < config.channels.length; i++) {
            config.channels[i].state = "2";
        }

        const USER = "user";
        const SUPPORTER = "supporter";

        function timeConverter(currentLobby, UNIX_timestamp) {
            var a = new Date(UNIX_timestamp);
            var months = [];
            if (currentLobby.lang) {
                months = [currentLobby.m1, currentLobby.m2, currentLobby.m3, currentLobby.m4, currentLobby.m5, currentLobby.m6, currentLobby.m7, currentLobby.m8, currentLobby.m9, currentLobby.m10, currentLobby.m11, currentLobby.m12];
            } else {
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            }
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
            return time;
        }


        function parseVariables(currentLobby, text = " ", moveEvent) {
            var client = moveEvent.client;
            text = text.replace('%user%', client.name());
            text = text.replace('%country%', client.country());
            text = text.replace('%Tconnections%', client.getTotalConnections());
            text = text.replace('%Fconnection%', timeConverter(currentLobby, client.getCreationTime()));
            text = text.replace('%version%', client.getVersion());
            text = text.replace('%platform%', client.getPlatform());
            text = text.replace('%supporters%', getSupporters(currentLobby).length);
            return text;
        }

        function setPermissions(channel, permissions) {
            for (var i in permissions) {
                var currentPermission = permissions[i];
                var defaultPermissions = [
                    currentPermission.customPermission,
                    "i_channel_needed_join_power",
                    "i_channel_needed_subscribe_power",
                    "i_channel_needed_description_view_power",
                    "i_channel_needed_modify_power",
                    "i_channel_needed_delete_power"
                ];
                var permissionName = defaultPermissions[parseInt(currentPermission.permission || "0")];
                var permission = channel.addPermission(permissionName);
                permission.setValue(currentPermission.value);
                permission.save();
            }
        }

        function getSupporters(currentLobby) {
            return backend
                .getClients()
                .filter(c => c.getServerGroups().some(function (g) {
                    var found = false;
                    for (var i = 0; i < currentLobby.supporterGroupIDs.length; i++) {
                        if (currentLobby.supporterGroupIDs[i].id == g.id()) {
                            found = true;
                            break;
                        }
                    }
                    return found;
                }))
                .filter(function (c) {
                    var found = false;
                    if (currentLobby.supporterAFKchannels) {
                        for (var i = 0; i < currentLobby.supporterAFKchannels.length; i++) {
                            if (currentLobby.supporterAFKchannels[i].id == c.getChannels()[0].id()) {
                                found = true;
                                break;
                            }
                        }
                    }
                    return !found;
                });
        }

        function requestDelete(channel) {
            setTimeout(function () {
                if (channel) {
                    if (channel.getClientCount() === 0) {
                        let id = channel.id();
                        channel.delete();
                        requestDeleteChannels.splice(requestDeleteChannels.findIndex(c => c.id() === id), 1);
                    }
                }
            }, config.supportChanneldeleteTime);
        }

        /**
         * Decides whether the user should be poked or notified via message
         */
        function sendMessage(currentLobby, to, msg, type) {
            if (type === USER) {
                if (currentLobby.sendOptionuser == 1) {
                    to.chat(msg);
                } else if (currentLobby.sendOptionuser == 2) {
                    to.poke(msg);
                }
            } else if (type === SUPPORTER) {
                if (currentLobby.sendOptionsupporter == 1) {
                    to.chat(msg);
                } else if (currentLobby.sendOptionsupporter == 2) {
                    to.poke(msg);
                }
            }
        }


        function changeChannel(currentLobby) {
            var waitingroomoffline = currentLobby.waitingroomoffline;
            var waitingroomofflinemaxclients = currentLobby.waitingroomofflinemaxclients;
            var waitingroomonlinemaxclients = currentLobby.waitingroomonlinemaxclients;
            var waitingroomonline = currentLobby.waitingroomonline;


            var channel = backend.getChannelByID(currentLobby.supportChannel);
            if (getSupporters(currentLobby).length > 0) {
                if (currentLobby.state != "1") {
                    channel.update({
                        name: waitingroomonline,
                        maxClients: waitingroomonlinemaxclients
                    });
                    currentLobby.state = "1";
                }
            } else if (getSupporters(currentLobby).length == 0) {
                if (currentLobby.state != "0") {
                    channel.update({
                        name: waitingroomoffline,
                        maxClients: waitingroomofflinemaxclients
                    });
                    currentLobby.state = "0";
                }
            }
        }


        function handleChannel(moveEvent, i) {
            var currentLobby = config.channels[i];
            if (currentLobby.checkboxchannelcloser) {
                changeChannel(currentLobby);
            }

            if (!moveEvent.toChannel) {
                return;
            }

            if (moveEvent.client.id() === backend.getBotClientID()) {
                return;
            }
            var toChannelId = moveEvent.toChannel.id();
            if (toChannelId !== currentLobby.supportChannel) {
                return;
            }

            if (currentLobby.whiteBlackListOption) {
                if (currentLobby.whiteBlackList) {
                    var found = moveEvent.client.getServerGroups().some(function (g) {
                        var found = false;
                        for (var i = 0; i < currentLobby.whiteBlackList.length; i++) {
                            if (currentLobby.whiteBlackList[i].id == g.id()) {
                                found = true;
                                break;
                            }
                        }
                        return found;
                    });
                    if (currentLobby.whiteBlackListOption == 1 && !found || currentLobby.whiteBlackListOption == 2 && found) {
                        var msg = parseVariables(currentLobby, currentLobby.blockedUserMessage, moveEvent);
                        if (currentLobby.blockedSendOptionUser == 1) {
                            moveEvent.client.chat(msg);
                        } else if (currentLobby.blockedSendOptionUser == 2) {
                            moveEvent.client.poke(msg);
                        }
                        return;
                    }
                }
            }


            if (currentLobby.disableOffline && getSupporters(currentLobby).length === 0) {
                var msg = parseVariables(currentLobby, currentLobby.offlineUserMessage, moveEvent);
                if (currentLobby.offlineSendOptionUser == 1) {
                    moveEvent.client.chat(msg);
                } else if (currentLobby.offlineSendOptionUser == 2) {
                    moveEvent.client.poke(msg);
                }
                return;
            }

            if (!currentLobby.includeMoved && moveEvent.invoker) {
                return;
            }
            if (!currentLobby.includeSupporter && moveEvent.client.getServerGroups().some(function (g) {
                    var found = false;
                    for (var i = 0; i < currentLobby.supporterGroupIDs.length; i++) {
                        if (currentLobby.supporterGroupIDs[i].id == g.id()) {
                            found = true;
                            break;
                        }
                    }
                    return found;
                })) {
                return;
            }
            if (currentLobby.userMessage) {
                var userMessage = parseVariables(currentLobby, currentLobby.userMessage, moveEvent);
                sendMessage(currentLobby, moveEvent.client, userMessage, USER);
            }
            if (currentLobby.supporterMessage) {
                var supporterMessage = parseVariables(currentLobby, currentLobby.supporterMessage, moveEvent);
                getSupporters(currentLobby).forEach(client => {
                    sendMessage(currentLobby, client, supporterMessage, SUPPORTER);
                });
            }

            setTimeout(function () {
                /*

                The channel options were first created by https://forum.sinusbot.com/members/tuetchen.10151/, and were taken to that script with permission of Tuetchen. We thank Tuetchen for letting us take that piece of code.

                */
                var channel = backend.getChannelByID(currentLobby.supportChannel);
                var supportChannelName = parseVariables(currentLobby, currentLobby.supportChannelName, moveEvent);
                var supportChannelDescription = parseVariables(currentLobby, currentLobby.supportChannelDescription, moveEvent);
                var channelConfig = {
                    name: supportChannelName,
                    description: supportChannelDescription,
                    topic: currentLobby.supportChannelTopic,
                    maxClients: (+currentLobby.supportChannelMaxClients || -1),
                    maxFamilyClients: (+currentLobby.supportChannelMaxFamilyClients || -1),
                    codec: (+currentLobby.supportChannelchannelCodec || 4),
                    codecQuality: (+currentLobby.supportChannelchannelCodecQuality || 6),
                };
                if (!currentLobby.supportChannelChannelType) {
                    currentLobby.supportChannelChannelType = "0";
                }
                switch (currentLobby.supportChannelChannelType.toString()) {
                    case "0":
                        channelConfig.permanent = true;
                        break;
                    case "1":
                        channelConfig.semiPermanent = true;
                        break;
                    case "2":
                        channelConfig.deleteDelay = (+currentLobby.supportChannelDeleteDelay || 2);
                        break;
                }
                if (currentLobby.supportChannelPassword) channelConfig.password = currentLobby.supportChannelPassword;
                if (currentLobby.supportChannelParentChannelID) {
                    channelConfig.parent = currentLobby.supportChannelParentChannelID;
                } else {
                    channelConfig.parent = null;
                }

                if (currentLobby.supportChannelPositionID) {
                    channelConfig.position = currentLobby.supportChannelPositionID;
                }


                if (currentLobby.supportChannelEncryption == 0) channelConfig.encryped = false;

                engine.log(currentLobby.supportChannelChannelType);
                engine.log(channelConfig);


                let oldChannel = null;
                if (currentLobby.supportChannelChannelType.toString() == "2") {
                    oldChannel = backend.getCurrentChannel();
                }

                var channelN = backend.createChannel(channelConfig);
                engine.log(channelN);
                setPermissions(channelN, currentLobby.supportChannelPermissions);

                if (oldChannel !== null) backend.getBotClient().moveTo(oldChannel);

                moveEvent.client.moveTo(channelN);

                if (currentLobby.deleteChannel) {
                    requestDeleteChannels.push(channelN);
                }

            }, parseInt(config.supportChannelcreateTime));
        }

        function init() {

            for (var i = 0; i < config.channels.length; i++) {
                changeChannel(config.channels[i]);
            }

            event.on('clientMove', (moveEvent) => {
                for (let channel of requestDeleteChannels) {
                    requestDelete(channel);
                }
                for (var i = 0; i < config.channels.length; i++) {
                    handleChannel(moveEvent, i);
                }
            });

            event.on('serverGroupAdded', (ev) => {
                for (var i = 0; i < config.channels.length; i++) {
                    changeChannel(config.channels[i]);
                }
            });
            event.on('serverGroupRemoved', (ev) => {
                for (var i = 0; i < config.channels.length; i++) {
                    changeChannel(config.channels[i]);
                }
            });
        }

        if (backend.isConnected()) {
            init();
        } else {
            event.on("connect", () => init());
        }
    });