/*jshint esversion: 6 */
registerPlugin({
        name: 'Support Channel notifier + channel creator',
        version: '1.3.1',
        description: 'Automatically opens a channel for your user and moves him in!',
        author: 'Mortis (https://discord.gg/mw2WMpW)',
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
                    {
                        name: 'supportChannelName',
                        title: 'Enter support channel name',
                        type: 'string',
                        placeholder: 'Support » %user%',
                        default: 'Support » %user%'
                    },
                    {
                        name: 'maxClientNumber',
                        title: 'Enter max clients for created channel (-1 to disable)',
                        type: 'string',
                        placeholder: '0',
                        default: '0'
                    },
                    {
                        name: 'parentChannelID',
                        title: 'select parent channel',
                        type: 'channel',

                    },
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
                        placeholder: 'false',
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
                        name: 'text',
                        title: '%country% = client country | %Tconnections% = total connections | %Fconnection% = first connection | %version% = client teamspeak version | %platform% = client operating system',
                    },
                    {
                        name: 'supportChannelDescription',
                        title: 'set a custom channel description (if you do not want a channel description just leave it blank)',
                        type: 'multiline',
                        default: ''
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
                    {
                        name: 'lang',
                        title: 'Language for Months',
                        type: 'select',
                        options: ["english", "german"],
                        placeholder: 'select Language',
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

        function timeConverter(from, UNIX_timestamp) {
            var a = new Date(UNIX_timestamp);
            var months = [];
            months[0] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            months[1] = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
            var year = a.getFullYear();
            var month = months[from.lang][a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
            return time;
        }


        function parseVariables(from, text = " ", moveEvent) {
            var client = moveEvent.client;
            text = text.replace('%user%', client.name());
            text = text.replace('%country%', client.country());
            text = text.replace('%Tconnections%', client.getTotalConnections());
            text = text.replace('%Fconnection%', timeConverter(from, client.getCreationTime()));
            text = text.replace('%version%', client.getVersion());
            text = text.replace('%platform%', client.getPlatform());
            text = text.replace('%supporters%', getSupporters(from).length);
            return text;
        }

        function getSupporters(from) {
            return backend
                .getClients()
                .filter(c => c.getServerGroups().some(function (g) {
                    var found = false;
                    for (var i = 0; i < from.supporterGroupIDs.length; i++) {
                        if (from.supporterGroupIDs[i].id == g.id()) {
                            found = true;
                            break;
                        }
                    }
                    return found;
                }))
                .filter(function (c) {
                    var found = false;
                    if (from.supporterAFKchannels) {
                        for (var i = 0; i < from.supporterAFKchannels.length; i++) {
                            if (from.supporterAFKchannels[i].id == c.getChannels()[0].id()) {
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
                        channel.delete();
                        requestDeleteChannels.splice(requestDeleteChannels.findIndex(c => c.id() === channel.id()), 1);
                    }
                }
            }, config.supportChanneldeleteTime);
        }

        /**
         * Decides whether the user should be poked or notified via message
         */
        function sendMessage(from, to, msg, type) {
            if (type === USER) {
                if (from.sendOptionuser == 1) {
                    to.chat(msg);
                } else if (from.sendOptionuser == 2) {
                    to.poke(msg);
                }
            } else if (type === SUPPORTER) {
                if (from.sendOptionsupporter == 1) {
                    to.chat(msg);
                } else if (from.sendOptionsupporter == 2) {
                    to.poke(msg);
                }
            }
        }


        function changeChannel(from) {
            var waitingroomoffline = from.waitingroomoffline;
            var waitingroomofflinemaxclients = from.waitingroomofflinemaxclients;
            var waitingroomonlinemaxclients = from.waitingroomonlinemaxclients;
            var waitingroomonline = from.waitingroomonline;


            var channel = backend.getChannelByID(from.supportChannel);
            if (getSupporters(from).length > 0) {
                if (from.state != "1") {
                    channel.update({
                        name: waitingroomonline,
                        maxClients: waitingroomonlinemaxclients
                    });
                    from.state = "1";
                }
            } else if (getSupporters(from).length == 0) {
                if (from.state != "0") {
                    channel.update({
                        name: waitingroomoffline,
                        maxClients: waitingroomofflinemaxclients
                    });
                    from.state = "0";
                }
            }
        }

        function handleChannel(moveEvent, i) {
            var from = config.channels[i];
            if (from.checkboxchannelcloser) {
                changeChannel(from);
            }

            if (!moveEvent.toChannel) {
                return;
            }

            if (moveEvent.client.id() === backend.getBotClientID()) {
                return;
            }
            var toChannelId = moveEvent.toChannel.id();
            if (toChannelId !== from.supportChannel) {
                return;
            }

            if (from.whiteBlackListOption) {
                if (from.whiteBlackList) {
                    var found = moveEvent.client.getServerGroups().some(function (g) {
                        var found = false;
                        for (var i = 0; i < from.whiteBlackList.length; i++) {
                            if (from.whiteBlackList[i].id == g.id()) {
                                found = true;
                                break;
                            }
                        }
                        return found;
                    });
                    if (from.whiteBlackListOption == 1 && !found || from.whiteBlackListOption == 2 && found) {
                        var msg = parseVariables(from, from.blockedUserMessage, moveEvent);
                        if (from.blockedSendOptionUser == 1) {
                            moveEvent.client.chat(msg);
                        } else if (from.blockedSendOptionUser == 2) {
                            moveEvent.client.poke(msg);
                        }
                        return;
                    }
                }
            }


            if (from.disableOffline && getSupporters(from).length === 0) {
                var msg = parseVariables(from, from.offlineUserMessage, moveEvent);
                if (from.offlineSendOptionUser == 1) {
                    moveEvent.client.chat(msg);
                } else if (from.offlineSendOptionUser == 2) {
                    moveEvent.client.poke(msg);
                }
                return;
            }

            if (!from.includeMoved && moveEvent.invoker) {
                return;
            }
            if (!from.includeSupporter && moveEvent.client.getServerGroups().some(function (g) {
                    var found = false;
                    for (var i = 0; i < from.supporterGroupIDs.length; i++) {
                        if (from.supporterGroupIDs[i].id == g.id()) {
                            found = true;
                            break;
                        }
                    }
                    return found;
                })) {
                return;
            }
            if (from.userMessage) {
                var userMessage = parseVariables(from, from.userMessage, moveEvent);
                sendMessage(from, moveEvent.client, userMessage, USER);
            }
            if (from.supporterMessage) {
                var supporterMessage = parseVariables(from, from.supporterMessage, moveEvent);
                getSupporters(from).forEach(client => {
                    sendMessage(from, client, supporterMessage, SUPPORTER);
                });
            }

            setTimeout(function () {
                var channel = backend.getChannelByID(from.supportChannel);
                var supportChannelName = parseVariables(from, from.supportChannelName, moveEvent);
                var supportChannelDescription = parseVariables(from, from.supportChannelDescription, moveEvent);
                var channelN = backend.createChannel({
                    name: supportChannelName,
                    parent: from.parentChannelID,
                    permanent: true,
                    maxClients: from.maxClientNumber,
                    description: supportChannelDescription,
                });
                moveEvent.client.moveTo(channelN);

                requestDeleteChannels.push(channelN);

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
