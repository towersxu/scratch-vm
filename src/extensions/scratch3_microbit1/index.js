const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
var io = require('socket.io-client');


/**
 * Enum for icon parameter values.
 * @readonly
 * @enum {string}
 */
const IconParam = {
    HEART: 'heart',
    HEART_SMALL: 'heart_small',
    HAPPY: 'happy',
    SMILE: 'smile',
    SAD: 'sad',
    CONFUSED: 'confused',
    ANGRY: 'angry',
    ASLEEP: 'asleep',
    SURPRISED: 'surprised',
    SILLY: 'silly',
    FABULOUS: 'fabulous',
    MEH: 'meh',
    YES: 'yes',
    NO: 'no'
};


/**
 * Enum for button parameter values.
 * @readonly
 * @enum {string}
 */
const ButtonParam = {
    A: 'a',
    B: 'b',
};


/**
 * Enum for button parameter values.
 * @readonly
 * @enum {string}
 */
const AccelerometerParam = {
    X: 'x',
    Y: 'y',
    Z: 'z'
};



class Scratch3MicrobitBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.id = "microbit";
        this.runtime = runtime;
        this.socket = io('//scratch3-adapter.just4fun.site:12358' + '/test', {transports: ['websocket']});
        this.socket.on('sensor', (msg) => {
            this.data = msg.data;
            console.log(this.data);
            if (this.data['id'] === this.id) {
               this.button_a = this.data['data']['button_a'];
               this.button_b = this.data['data']['button_b'];
               this.x = this.data['data']['x'];
               this.y = this.data['data']['y'];
               this.z = this.data['data']['z'];
               this.direction = this.data['data']['direction'];
            }
        });
        this.state = 0;
    }

    /**
     * The key to load & store a target's test-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.microbit';
    }

    /**
     * Initialize button parameters menu with localized strings
     * @returns {array} of the localized text and values for each menu element
     * @private
     */
    _initButtonParam () {
        return [
            {
                text: formatMessage({
                    id: 'cxmicrobit.buttonMenu.a',
                    default: 'a',
                    description: 'label for color element in color picker for pen extension'
                }),
                value: IconParam.A
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.buttonMenu.b',
                    default: 'b',
                    description: 'label for saturation element in color picker for pen extension'
                }),
                value: IconParam.B
            }
        ]
    }


    /**
     * Initialize button parameters menu with localized strings
     * @returns {array} of the localized text and values for each menu element
     * @private
     */
    _initAccelerometerParam () {
        return [
            {
                text: formatMessage({
                    id: 'cxmicrobit.accelerometerMenu.x',
                    default: 'x',
                    description: 'label for color element in color picker for pen extension'
                }),
                value: AccelerometerParam.X
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.accelerometerMenu.y',
                    default: 'y',
                    description: 'label for saturation element in color picker for pen extension'
                }),
                value: AccelerometerParam.Y
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.accelerometerMenu.z',
                    default: 'z',
                    description: 'label for saturation element in color picker for pen extension'
                }),
                value: AccelerometerParam.Z
            }
        ]
    }



    /**
     * Initialize color parameters menu with localized strings
     * @returns {array} of the localized text and values for each menu element
     * @private
     */
    _initColorParam () {
        return [
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.happy',
                    default: 'happy',
                    description: 'label for color element in color picker for pen extension'
                }),
                value: IconParam.HAPPY
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.smile',
                    default: 'smile',
                    description: 'label for saturation element in color picker for pen extension'
                }),
                value: IconParam.SMILE
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.sad',
                    default: 'sad',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.SAD
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.heart',
                    default: 'heart',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.HEART
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.heart_small',
                    default: 'heart_small',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.HEART_SMALL
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.yes',
                    default: 'yes',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.YES
            },

            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.confused',
                    default: 'confused',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.CONFUSED
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.angry',
                    default: 'angry',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.ANGRY
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.asleep',
                    default: 'asleep',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.ASLEEP
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.surprised',
                    default: 'surprised',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.SURPRISED
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.silly',
                    default: 'silly',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.SILLY
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.meh',
                    default: 'meh',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.MEH
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.fabulous',
                    default: 'fabulous',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.FABULOUS
            },
            {
                text: formatMessage({
                    id: 'cxmicrobit.iconMenu.no',
                    default: 'no',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: IconParam.NO
            }
        ];
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'cxmicrobit',
            name: 'Microbit',
            // menuIconURI: menuIconURI,
            // blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'say',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'cxmicrobit.say',
                        default: 'say [STRING]',
                        description: 'pass hello by socket'
                    }),
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: "Hello!"
                        }
                    }
                },
                {
                    opcode: 'whenButtonIsPressed',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'cxmicrobit.whenbuttonispressed',
                        default: 'When Button [BUTTON_PARAM] Is Pressed',
                        description: 'pass hello by socket'
                    }),
                    arguments: {
                        BUTTON_PARAM: {
                            type: ArgumentType.STRING,
                            menu: 'buttonParam',
                            defaultValue: ButtonParam.A
                        }
                    }
                },
                {
                    opcode: 'random',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'cxmicrobit.random',
                        default: 'get random from 0 to [NUMBER]',
                        description: 'pass hello by socket'
                    }),
                    arguments: {
                        NUMBER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 4
                        }
                    }
                },
                {
                    opcode: 'get_accelerometer',
                    // blockType: BlockType.BOOLEAN,
                    blockType: BlockType.REPORTER,
                    // blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'cxmicrobit.get_accelerometer',
                        default: 'Accelerometer [ACCELEROMETER_PARAM]',
                        description: 'pass hello by socket'
                    }),
                    arguments: {
                        ACCELEROMETER_PARAM: {
                            type: ArgumentType.STRING,
                            menu: 'accelerometerParam',
                            defaultValue: AccelerometerParam.X
                        }
                    }
                },
                {
                    opcode: 'get_compass',
                    // blockType: BlockType.BOOLEAN,
                    blockType: BlockType.REPORTER,
                    // blockType: BlockType.COMMAND,
                    text: 'get direction',
                    arguments: {
                    }
                },
                {
                    opcode: 'buttonIsPressed',
                    blockType: BlockType.BOOLEAN,
                    // blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'cxmicrobit.buttonispressed',
                        default: 'Button [BUTTON_PARAM] Is Pressed',
                        description: 'pass hello by socket'
                    }),
                    arguments: {
                        BUTTON_PARAM: {
                            type: ArgumentType.STRING,
                            menu: 'buttonParam',
                            defaultValue: ButtonParam.A
                        }
                    }
                },
                {
                    opcode: 'clearScreen',
                    blockType: BlockType.COMMAND,
                    // blockType: BlockType.REPORTER,
                    text: 'clear screen',
                    arguments: {
                    }
                },
                {
                    opcode: 'showIcon',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'cxmicrobit.showIcon',
                        default: 'showIcon [ICON_PARAM]',
                        description: 'change the icon of microbit'
                    }),
                    arguments: {
                        ICON_PARAM: {
                            type: ArgumentType.STRING,
                            menu: 'iconParam',
                            defaultValue: IconParam.HAPPY
                        }
                    }
                }
            ],
            menus: {
                iconParam: this._initColorParam(),
                buttonParam: this._initButtonParam(),
                accelerometerParam: this._initAccelerometerParam()
            }
        };
    }

    getHats() {
        return {
            microbit_whenbuttonaispressed: {
                restartExistingThreads: false,
                edgeActivated: true
            }
        };
    };

    getMonitored () {
        return {
            microbit_buttonispressed: {}
        };
    }

    whenButtonIsPressed (args, util) {
        if (args.BUTTON_PARAM === 'a') {
            return this.button_a;
        } else if (args.BUTTON_PARAM === 'b') {
            return this.button_b;
        }
    }

    buttonIsPressed (args, util) {
        if (args.BUTTON_PARAM === 'a') {
            return this.button_a;
        } else if (args.BUTTON_PARAM === 'b') {
            return this.button_b;
        }
    }

    say (args, util) {
        this.socket.emit('actuator',
                         {id: this.id,
                          data: String(args.STRING),
                          topic: "actuators/say"});
        return;
    }

    clearScreen (args, util) {
        this.socket.emit('actuator',
                         {id: this.id,
                          data: 'clear',
                          topic: "actuators/clear"});
        return;
    }

    random (args, util) {
        this.socket.emit('actuator',
                         {id: this.id,
                          data: args.NUMBER,
                          topic: "actuators/random"});
        return;
    }

    showIcon (args, util) {
        console.log(args.ICON_PARAM);
        this.socket.emit('actuator',
                         {id: this.id,
                          data: String(args.ICON_PARAM),
                          topic: "actuators/display"});
        return;
    }

    get_accelerometer (args, util) {
        if (args.ACCELEROMETER_PARAM === 'x') {
            return this.x;
        } else if (args.ACCELEROMETER_PARAM === 'y') {
            return this.y;
        } else if (args.ACCELEROMETER_PARAM === 'z') {
            return this.z;
        }
    }

    get_compass (args, util) {
        return this.direction;
    }


}

module.exports = Scratch3MicrobitBlocks;
