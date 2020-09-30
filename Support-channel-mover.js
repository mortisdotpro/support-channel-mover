registerPlugin({
    name: 'Support Channel notifyer + channel creator',
    version: '1.1',
    description: 'Automatically opens a channel for your user and moves him in!',
    author: 'Mortis (https://discord.gg/mw2WMpW)',
    vars: [{
            name: 'supportChannel',
            title: 'select Supportchannel',
            type: 'channel'
        },
        {
            name: 'supporterGroupID',
            title: 'Enter Supporter Group ID',
            type: 'string',
        },
        {
            name: 'supporterAFKchannel',
            title: 'Enter Supporter AFK channel',
            type: 'string',
            default: ''
        },
        {
            name: 'supportMoveMessage',
            title: 'Support-Move Message',
            type: 'string',
            placeholder: 'A Supporter has been Notified'
            default: 'A Supporter has been Notified'
        },
        {
            name: 'supporterMessage',
            title: 'Enter supporter Message',
            type: 'string',
            placeholder: 'There is someone in the Support'
            default: 'There is someone in the Support'
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
            name: 'supportChannelID',
            title: 'select parent channel',
            type: 'channel',
        },
        {
            name: 'supportChannelCreateTime',
            title: 'Enter support channel create/user move Time in milliseconds',
            type: 'string',
            placeholder: '5000',
            default: '5000'
        },
        {
            name: 'supportChanneldeleteTime',
            title: 'Enter support channel delete Time in milliseconds',
            type: 'string',
            placeholder: '5000',
            default: '5000'
        },
        {
            name: 'sendOption',
            title: 'How to notify the users',
            type: 'select',
            options: ["Supporter: poke; User: chat", "Supporter: chat; User: poke", "Supporter: poke; User: poke", "Supporter: chat; User: chat"],
            // => 0, 1, 2 or 3 in config.sendOption (confusing)
            placeholder: 'false',
            default: 'false'
        },
        {
            name: 'checkboxchannelcloser',
            title: 'enable channel rename online/offline',
            type: 'checkbox',
            placeholder: 'false',
            default: 'false'
        },
        {
            name: 'waitingroomID',
            title: 'Enter waiting room ID',
            type: 'string',
            placeholder: '20',
            default: '20',
            conditions: [{
                field: 'checkboxchannelcloser',
                value: true
            }],
        },
        {
            name: 'waitingroomonline',
            title: 'channel name if supporters are online',
            type: 'string',
            placeholder: ' Support Waiting room - OPEN',
            default: ' Support Waiting room - OPEN',
            conditions: [{
                field: 'checkboxchannelcloser',
                value: true
            }],
        },
        {
            name: 'waitingroomoffline',
            title: 'channel name if supporters are all offline',
            type: 'string',
            placeholder: ' Support Waiting room - CLOSED',
            default: ' Support Waiting room - CLOSED',
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
            placeholder: ' -1 ',
            default: ' -1 ',
            conditions: [{
                field: 'checkboxchannelcloser',
                value: true
            }],
        },
        {
            name: 'checkboxchanneldescription',
            title: 'set custom channel description with client infos',
            type: 'checkbox',
        },
        {
            name: 'text',
            title: '%country% = client country | %Tconnections% = total connections | %Fconnection% = first connection | %version% = client teamspeak version | %platform% = client operating system',
        },
        {
            name: 'supportChannelDescription',
            title: 'set a custom channel description',
            type: 'multiline',
            conditions: [{
                field: 'checkboxchanneldescription',
                value: true
            }],
        },
        {
            name: 'lang',
            title: 'Language for Months',
            type: 'select',
            options: ["english", "german"],
            // => 0, 1, 2 or 3 in config.sendOption (confusing)
            placeholder: 'select Language',
            conditions: [{
                field: 'checkboxchanneldescription',
                value: true
            }],
        },


    ]
}, function (_, config, meta) {

    const event = require('event');
    const engine = require('engine');
    const backend = require('backend');
    const requestDeleteChannels = [];
    var state = "2";

    const USER = "user"
    const SUPPORTER = "supporter"

    function timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp);
        var months = [];
        months[0] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        months[1] = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        var year = a.getFullYear();
        var month = months[config.lang][a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    function getSupporters() {
        return backend
            .getClients()
            .filter(c => c.getServerGroups().some(g => g.id() === config.supporterGroupID))
            .filter(function (c) {
                (config.supporterAFKchannel.includes(c.getChannels()[0].id()));
                return !(config.supporterAFKchannel.includes(c.getChannels()[0].id()))
            })


    }

    function requestDelete(channel) {
        setTimeout(function () {
            if (channel.getClientCount() === 0) {
                channel.delete()
                requestDeleteChannels.splice(requestDeleteChannels.findIndex(c => c.id() === channel.id()), 1)
            }
        }, config.supportChanneldeleteTime);
    }

    /**
     * Decides whether the user should be poked or notified via message
     */
    function sendMessage(to, msg, type) {
        switch (type) {
            case USER:
                if (config.sendOption == 0 || config.sendOption == 3) {
                    to.chat(msg);
                } else {
                    to.poke(msg);
                }
                break;
            case SUPPORTER:
                if (config.sendOption == 1 || config.sendOption == 3) {
                    to.chat(msg);
                } else {
                    to.poke(msg);
                }
                default:
                    console.log("unknown message type: " + type);
                    break;
        }
    };


    function changeChannel() {
        var channel = backend.getChannelByID(config.waitingroomID);
        if (getSupporters().length > 0) {
            if (state != "1") {
                channel.update({
                    name: config.waitingroomonline,
                    maxClients: config.waitingroomonlinemaxclients
                });
                state = "1";
            }
        } else if (getSupporters().length == 0) {
            if (state != "0") {
                channel.update({
                    name: config.waitingroomoffline,
                    maxClients: config.waitingroomofflinemaxclients
                });
                state = "0";
            }
        }
    }

    function init() {

        event.on('clientMove', (moveEvent) => {
            if (config.checkboxchannelcloser) {
                changeChannel();
            };
            for (let channel of requestDeleteChannels) {
                requestDelete(channel)
            }
            if (!moveEvent.toChannel) {
                return;
            }
            if (moveEvent.client.id() === backend.getBotClientID()) {
                return
            };

            var toChannelId = moveEvent.toChannel.id();

            if (toChannelId === config.supportChannel) {
                sendMessage(moveEvent.client, config.supportMoveMessage, USER);

                var clientName = moveEvent.client.name();

                var clientCountry = moveEvent.client.country();
                var clientTotalConnections = moveEvent.client.getTotalConnections();
                var clientFirstConnection = moveEvent.client.getCreationTime();
                var clientVersion = moveEvent.client.getVersion();
                var clientPlatform = moveEvent.client.getPlatform();

                var supportChannelDescription = config.supportChannelDescription;

                supportChannelDescription.replace('%country%', clientCountry);
                supportChannelDescription.replace('%Tconnections%', clientTotalConnections);
                supportChannelDescription.replace('%Fconnection%', timeConverter(clientFirstConnection));
                supportChannelDescription.replace('%version%', clientVersion);
                supportChannelDescription.replace('%platform%', clientPlatform);

                var supporters = getSupporters();
                supporters.forEach(client => {
                    var supporterMessage = config.supporterMessage.replace('%user%', clientName);
                    sendMessage(client, supporterMessage, SUPPORTER)
                });

                var supportChannelName = config.supportChannelName.replace('%user%', clientName);
                var supportChannelCreateTime = parseInt(config.supportChannelCreateTime);

                setTimeout(function () {
                    var maxClientNumber = config.maxClientNumber
                    var channel = backend.createChannel({
                        name: supportChannelName,
                        parent: config.supportChannelID,
                        permanent: true,
                        maxClients: maxClientNumber,
                        description: supportChannelDescription
                    });
                    moveEvent.client.moveTo(channel);
                    requestDeleteChannels.push(channel)
                }, supportChannelCreateTime);
            }
        });

        event.on('serverGroupAdded', (ev) => {
            changeChannel();
        })
        event.on('serverGroupRemoved', (ev) => {
            changeChannel();
        })
    }


    if (config.supportChannel && config.supporterGroupID) {
        init();
    } else {
        console.log("ERROR: Please set the Support-Channel and the Supporter-Group in the config.")
    }
});