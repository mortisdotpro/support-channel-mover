registerPlugin({
    name: 'Support Channel notifyer + channel creator',
    version: '1.1',
    description: 'Automatically opens a channel for your user and moves him in!',
    author: 'Mortis (https://discord.gg/mw2WMpW)',
    vars: [
        {
            name: 'supportChannel',
            title: 'select Supportchannel',
            type: 'channel'
        },
        {
            name: 'supporterGroupID',
            title: 'Enter Supporter Group ID',
            type: 'string',
            placeholder: '5'
        },
        {
            name: 'supporterAFKchannel',
            title: 'Enter Supporter AFK channel',
            type: 'string',
        },
        {
            name: 'supportMoveMessage',
            title: 'Support-Move Message',
            type: 'string',
            placeholder: 'A Supporter has been Notified'
        },
        {
            name: 'supporterMessage',
            title: 'Enter supporter Message',
            type: 'string',
            placeholder: 'There is someone in the Support'
        },
        {
            name: 'supportChannelName',
            title: 'Enter support channel name',
            type: 'string',
            placeholder: 'Support » %user%'
        },
        {
            name: 'maxClientNumber',
            title: 'Enter max clients for created channel (-1 to disable)',
            type: 'string',
            placeholder: '0'
        },
        {
            name: 'supportChannelID',
            title: 'select parent channel',
            type: 'channel',
        },
        {
            name: 'supportChannelcreateTime',
            title: 'Enter support channel create/user move Time in milliseconds',
            type: 'string',
            placeholder: '5000'
        },
        {
            name: 'supportChanneldeleteTime',
            title: 'Enter support channel delete Time in milliseconds',
            type: 'string',
            placeholder: '5000'
        },
        {
            name: 'sendOption',
            title: 'How to notify the users',
            type: 'select',
            options: ["Supporter: poke; User: chat", "Supporter: chat; User: poke", "Supporter: poke; User: poke", "Supporter: chat; User: chat"],
            // => 0, 1, 2 or 3 in config.sendOption (confusing)
            placeholder: 'false'
        },
        {
            name: 'checkboxchannelcloser',
            title: 'enable channel rename online/offline',
            type: 'checkbox',
        },
            {
                name: 'waitingroomID',
                title: 'Enter waiting room ID',
                type: 'string',
                placeholder: '20',
                conditions: [{ field: 'checkboxchannelcloser', value: true }],
            },
            {
                name: 'waitingroomonline',
                title: 'channel name if supporters are online',
                type: 'string',
                placeholder: ' Support Waiting room - OPEN',
                conditions: [{ field: 'checkboxchannelcloser', value: true }],
            },
            {
                name: 'waitingroomoffline',
                title: 'channel name if supporters are all offline',
                type: 'string',
                placeholder: ' Support Waiting room - CLOSED',
                conditions: [{ field: 'checkboxchannelcloser', value: true }],
            },
            {
                name: 'waitingroomofflinemaxclients',
                title: 'channel max clients if supporters are all offline (0 to close channel)',
                type: 'string',
                placeholder: ' 0 ',
                conditions: [{ field: 'checkboxchannelcloser', value: true }],
            },
            {
                name: 'waitingroomonlinemaxclients',
                title: 'channel max clients if supporters are online (-1 to disable)',
                type: 'string',
                placeholder: ' -1 ',
                conditions: [{ field: 'checkboxchannelcloser', value: true }],
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
              conditions: [{ field: 'checkboxchanneldescription', value: true }],
            },
            {
                name: 'lang',
                title: 'Language for Months',
                type: 'select',
                options: ["english", "german"],
                // => 0, 1, 2 or 3 in config.sendOption (confusing)
                placeholder: 'select Language',
                conditions: [{ field: 'checkboxchanneldescription', value: true }],
            },


    ]
}, function(_, config, meta) {

    const event = require('event');
    const engine = require('engine');
    const backend = require('backend');
    const requestDeleteChannels = []
    var supportChanneldeleteTime = config.supportChanneldeleteTime;
    var state = "2";
    var supporterAFKchannel = config.supporterAFKchannel;

    const USER = "user"
    const SUPPORTER = "supporter"

    function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp);
      var months = [];
      months[0] = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      months[1] = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
      var year = a.getFullYear();
      var month = months[config.lang][a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
      return time;
    }

    function getSupporters() {
        return backend
          .getClients()
          .filter(c => c.getServerGroups().some(g => g.id() === config.supporterGroupID))
          .filter(function(c){(config.supporterAFKchannel.includes(c.getChannels()[0].id()));return !(config.supporterAFKchannel.includes(c.getChannels()[0].id()))})


    }

    function requestDelete(channel) {
        setTimeout(function(){
            if(channel.getClientCount() === 0) {
                channel.delete()
                requestDeleteChannels.splice(requestDeleteChannels.findIndex(c => c.id() === channel.id()), 1)
            }
        }, supportChanneldeleteTime);
    }

    /**
     * Decides whether the user should be poked or notified via message
     */
    function sendMessage(to, msg, type) {
        if(type === USER) {
            if(config.sendOption == 0 || config.sendOption == 3) {
                to.chat(msg);
            } else {
                to.poke(msg);
            }
        } else if (type === SUPPORTER) {
            if(config.sendOption == 1 || config.sendOption == 3) {
                to.chat(msg);
            } else {
                to.poke(msg);
            }
        }
    };


    function changeChannel(){
      var waitingroomoffline = config.waitingroomoffline
      var waitingroomofflinemaxclients = config.waitingroomofflinemaxclients
      var waitingroomonlinemaxclients = config.waitingroomonlinemaxclients
      var waitingroomonline = config.waitingroomonline
      var waitingroomID = config.waitingroomID

      var channel = backend.getChannelByID(waitingroomID);
      if (getSupporters().length > 0) {
        if (state != "1") {
          channel.update({ name: waitingroomonline, maxClients: waitingroomonlinemaxclients});
          state = "1";
        }
      } else if (getSupporters().length == 0 ) {
        if (state != "0") {
          channel.update({ name: waitingroomoffline, maxClients: waitingroomofflinemaxclients });
          state = "0";
        }
      }
    }
    event.on('clientMove', (moveEvent) => {

      var checkboxchannelcloser = config.checkboxchannelcloser

      if(checkboxchannelcloser){
        changeChannel();
      };



        for(let channel of requestDeleteChannels) {
            requestDelete(channel)
        }


        if(!moveEvent.toChannel) {
            return;
        }

        if(moveEvent.client.id() === backend.getBotClientID()) {
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

            var supportChannelDescription = config.supportChannelDescription.replace('%country%', clientCountry);
            var supportChannelDescription = supportChannelDescription.replace('%Tconnections%', clientTotalConnections);
            var supportChannelDescription = supportChannelDescription.replace('%Fconnection%', timeConverter(clientFirstConnection));
            var supportChannelDescription = supportChannelDescription.replace('%version%', clientVersion);
            var supportChannelDescription = supportChannelDescription.replace('%platform%', clientPlatform);

            var supporters = getSupporters();
            supporters.forEach(client => {
                var supporterMessage = config.supporterMessage.replace('%user%', clientName);
                sendMessage(client, supporterMessage, SUPPORTER)
            });

            var supportChannelName = config.supportChannelName.replace('%user%', clientName);
            var supportChannelID = config.supportChannelID;
            var supportChannelcreateTime = parseInt(config.supportChannelcreateTime);

            setTimeout(function(){
                var maxClientNumber = config.maxClientNumber
                var channel = backend.createChannel({ name: supportChannelName, parent: supportChannelID, permanent: true, maxClients: maxClientNumber, description: supportChannelDescription });
                moveEvent.client.moveTo(channel);

                requestDeleteChannels.push(channel)

            }, supportChannelcreateTime);
        }
    });

    event.on('serverGroupAdded', (ev) => {
      changeChannel();
    })
    event.on('serverGroupRemoved', (ev) => {
      changeChannel();
    })
});
