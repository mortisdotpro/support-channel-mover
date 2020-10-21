registerPlugin({
    name: 'Support Channel notifyer + channel creator',
    version: '1.2',
    description: 'Automatically opens a channel for your user and moves him in!',
    author: 'Mortis (https://discord.gg/mw2WMpW)',
    vars: [{
      type: "array",
      name: "channels",
      title: "Channels",
      default: [],
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
            name: 'sendOptionuser',
            title: 'How to notify the user',
            type: 'select',
            options: ["no notification", "chat", "poke"],
            placeholder: 'false'
        },
        {
            name: 'userMessage',
            title: 'user Message',
            type: 'string',
            placeholder: 'A Supporter has been Notified',
            conditions: [{ field: 'sendOptionuser', value: 2 }],
        },
        {
            name: 'userMessage',
            title: 'user Message',
            type: 'multiline',
            placeholder: 'A Supporter has been Notified',
            conditions: [{ field: 'sendOptionuser', value: 1 }],
        },
        {
            name: 'sendOptionsupporter',
            title: 'How to notify the supporter(s)',
            type: 'select',
            options: ["no notification", "chat", "poke"],
            placeholder: 'false'
        },
        {
            name: 'supporterMessage',
            title: 'supporter message',
            type: 'string',
            placeholder: 'A Supporter has been Notified',
            conditions: [{ field: 'sendOptionsupporter', value: 2 }],
        },
        {
            name: 'supporterMessage',
            title: 'supporter message',
            type: 'multiline',
            placeholder: 'A Supporter has been Notified',
            conditions: [{ field: 'sendOptionsupporter', value: 1 }],
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
            name: 'parentChannelID',
            title: 'select parent channel',
            type: 'channel',

        },
        {
            name: 'checkboxchannelcloser',
            title: 'enable channel rename online/offline',
            type: 'checkbox',
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
            name: 'lang',
            title: 'Language for Months',
            type: 'select',
            options: ["english", "german"],
            // => 0, 1, 2 or 3 in from.sendOption (confusing)
            placeholder: 'select Language',
        },
      ]
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
        name: 'supporterAFKchannel',
        title: 'Enter Supporter AFK channel',
        type: 'string',
    },
  ]
}, function(_, config, meta) {

    const event = require('event');
    const engine = require('engine');
    const backend = require('backend');
    const requestDeleteChannels = []
    for (var i = 0; i < config.channels.length; i++) {
      config.channels[i].state = "2";
    }

    const USER = "user"
    const SUPPORTER = "supporter"

    function timeConverter(from,UNIX_timestamp){
      var a = new Date(UNIX_timestamp);
      var months = [];
      months[0] = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      months[1] = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
      var year = a.getFullYear();
      var month = months[from.lang][a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
      return time;
    }


    function parseVariables(from,text,moveEvent){
      var client = moveEvent.client;
      var text = text.replace('%user%', client.name());
      var text = text.replace('%country%', client.country());
      var text = text.replace('%Tconnections%', client.getTotalConnections());
      var text = text.replace('%Fconnection%', timeConverter(from,client.getCreationTime()));
      var text = text.replace('%version%', client.getVersion());
      var text = text.replace('%platform%', client.getPlatform());
      var text = text.replace('%supporters%', getSupporters(from).length);
      return text;
    }

    function getSupporters(from) {
        return backend
          .getClients()
          .filter(c => c.getServerGroups().some(g => g.id() === from.supporterGroupID))
          .filter(function(c){(config.supporterAFKchannel.includes(c.getChannels()[0].id()));return !(config.supporterAFKchannel.includes(c.getChannels()[0].id()))})


    }

    function requestDelete(channel) {
        setTimeout(function(){
            if(channel.getClientCount() === 0) {
                channel.delete()
                requestDeleteChannels.splice(requestDeleteChannels.findIndex(c => c.id() === channel.id()), 1)
            }
        }, config.supportChanneldeleteTime);
    }

    /**
     * Decides whether the user should be poked or notified via message
     */
    function sendMessage(from, to, msg, type) {
        if(type === USER) {
            if(from.sendOptionuser == 1) {
                to.chat(msg);
            } else if (from.sendOptionuser == 2) {
                to.poke(msg);
            }
        } else if (type === SUPPORTER) {
            if(from.sendOptionsupporter == 1) {
                to.chat(msg);
            } else if (from.sendOptionsupporter == 2){
                to.poke(msg);
            }
        }
    };


    function changeChannel(from){
      var waitingroomoffline = from.waitingroomoffline
      var waitingroomofflinemaxclients = from.waitingroomofflinemaxclients
      var waitingroomonlinemaxclients = from.waitingroomonlinemaxclients
      var waitingroomonline = from.waitingroomonline


      var channel = backend.getChannelByID(from.supportChannel);
      if (getSupporters(from).length > 0) {
        if (from.state != "1") {
          channel.update({ name: waitingroomonline, maxClients: waitingroomonlinemaxclients});
          from.state = "1";
        }
      } else if (getSupporters(from).length == 0 ) {
        if (from.state != "0") {
          channel.update({ name: waitingroomoffline, maxClients: waitingroomofflinemaxclients });
          from.state = "0";
        }
      }
    }
    function init(){
      event.on('clientMove', (moveEvent) => {
        for(let channel of requestDeleteChannels) {
            requestDelete(channel)
        }
        for (var i = 0; i < config.channels.length; i++) {

          var from = config.channels[i];
            if(from.checkboxchannelcloser){
              changeChannel(from);
            };

            if(!moveEvent.toChannel) {
                return;
            }

            if(moveEvent.client.id() === backend.getBotClientID()) {
                return
            };

            var toChannelId = moveEvent.toChannel.id();

            if (toChannelId === from.supportChannel) {
                var userMessage = parseVariables(from,from.userMessage, moveEvent);
                sendMessage(from, moveEvent.client, userMessage, USER);

                var supporters = getSupporters(from);
                supporters.forEach(client => {
                    var supporterMessage = parseVariables(from,from.supporterMessage, moveEvent);
                    sendMessage(from, client, supporterMessage, SUPPORTER)
                });


                setTimeout(function(){
                  engine.log("Debug: Called with :: supportChannel:" + backend.getChannelByID(from.supportChannel).name() + " | creationtype:" + from.creationtype);
                  var channel = backend.getChannelByID(from.supportChannel);
                  var supportChannelName = parseVariables(from,from.supportChannelName, moveEvent);
                  var supportChannelDescription = parseVariables(from, from.supportChannelDescription, moveEvent);
                  var parentChannelID = from.parentChannelID;
                  var maxClientNumber = from.maxClientNumber;

                      var channelN = backend.createChannel({ name: supportChannelName, parent: parentChannelID, permanent: true, maxClients: maxClientNumber, description: supportChannelDescription });
                      moveEvent.client.moveTo(channelN);

                      requestDeleteChannels.push(channelN)

                }, parseInt(config.supportChannelcreateTime));
            }
        }
      });

      event.on('serverGroupAdded', (ev) => {
        for (var i = 0; i < config.channels.length; i++) {
            changeChannel(config.channels[i]);
        }
      })
      event.on('serverGroupRemoved', (ev) => {
        for (var i = 0; i < config.channels.length; i++) {
            changeChannel(config.channels[i]);
        }
      })
    }
    if (backend.isConnected()) {
        init();
    }
    else {
        event.on("connect", () => init());
    }
});
