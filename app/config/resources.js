angular.module('911app.resources')
    .constant("key", "value")
    .constant("GNOAPI",
        {
            DOCTOR:
            {
                ID:"1",
                NAME:"Pedro Perez Prueba",
                MPPS:"1",
                USERNAME:"pperez",
                PASSWORD:""
            },
            URL:"http://192.168.1.105:8080/gruponueveonce/rest",
            ENV: "development"
        })
    .constant('SERVER',
        {
            STUN_TURN_URL: "https://service.xirsys.com/ice",
            STUN_TURN_IDENT: "diazal",
            STUN_TURN_SECRET: "bf2999d0-ab4b-11e6-8f51-fbea08b724fd",
            STUN_TURN_APP: "default",
            STUN_TURN_ROOM: "default",
            STUN_TURN_DOMAIN: "www.diazal-peerjs.com",
            IP_SERVER: "codigo.trascend.com.ve",
            PORT_SERVER: 8099
        })
    .constant("PEERJS_KEY", "08d9vawi84yam7vi")
    .constant("RESOURCE",
        {
            SESION:"/sesiones/medicos",
            EMERGENCIES:"/video/medico/emergencias",
            VIDEO:"/videoconferencias/medicos",
            CHAT:"/chat/medicos"
        })
    .constant("MAX_BYTES", 699000);