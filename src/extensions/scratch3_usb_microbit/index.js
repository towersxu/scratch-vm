const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const io = require("socket.io-client");
const cast = require('../../util/cast');
const log = require('../../util/log');

const USBSendInterval = 100;



var blockIconURI =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTkycHQiIGhlaWdodD0iMTczcHQiIHZpZXdCb3g9IjAgMCAxOTIgMTczIiB2ZXJzaW9uPSIxLjEiPgo8ZyBpZD0ic3VyZmFjZTEiPgo8cGF0aCBzdHlsZT0iIHN0cm9rZTpub25lO2ZpbGwtcnVsZTpldmVub2RkO2ZpbGw6cmdiKDEwMCUsNzIuMTU2ODYzJSwxMS43NjQ3MDYlKTtmaWxsLW9wYWNpdHk6MTsiIGQ9Ik0gMTEyLjgwNDY4OCAxMzYuMzE2NDA2IEMgODMuNTQ2ODc1IDExNi41MzEyNSA3Ni4yMTQ4NDQgOTQuMzYzMjgxIDkwLjgwODU5NCA2OS44MDg1OTQgQyAxMTIuNjk1MzEyIDMyLjk4MDQ2OSAxMjQuMTEzMjgxIDE5LjI0MjE4OCAxMjAuNDQ5MjE5IDAuMTg3NSBDIDEzNC44NzUgMTYuOTIxODc1IDE3Ni40MTc5NjkgNjIuNTAzOTA2IDEzMS43ODkwNjIgMTE1LjQwNjI1IEMgMTMxLjc4OTA2MiA5NC44NjMyODEgMTI3LjA5Mzc1IDgzLjI0NjA5NCAxMTcuNjk5MjE5IDgwLjU0Njg3NSBDIDExMS4yNDIxODggODguMjg5MDYyIDEwOC4wMTE3MTkgOTguMTg3NSAxMDguMDExNzE5IDExMC4yMzgyODEgQyAxMDguMDExNzE5IDEyMi4yOTI5NjkgMTA5LjYwOTM3NSAxMzAuOTg0Mzc1IDExMi44MDQ2ODggMTM2LjMxNjQwNiBaIE0gMTEyLjgwNDY4OCAxMzYuMzE2NDA2ICIvPgo8cGF0aCBzdHlsZT0iIHN0cm9rZTpub25lO2ZpbGwtcnVsZTpldmVub2RkO2ZpbGw6cmdiKDIzLjEzNzI1NSUsMjQuNzA1ODgyJSwyNi42NjY2NjclKTtmaWxsLW9wYWNpdHk6MTsiIGQ9Ik0gMC40MTAxNTYgMTU1LjEzNjcxOSBDIDEuMjIyNjU2IDE1MC4yNDIxODggMy4yOTY4NzUgMTQ2LjQ3NjU2MiA2LjU1ODU5NCAxNDMuNTM5MDYyIEMgMTAuNjMyODEyIDEzOS44NTE1NjIgMTUuODk0NTMxIDEzNC40MjU3ODEgMjEuNTI3MzQ0IDEzNi45ODgyODEgQyAyMi40MTc5NjkgMTM3LjM2MzI4MSAyMy4wMDc4MTIgMTM4LjM0Mzc1IDIyLjQ5MjE4OCAxMzkuOTI1NzgxIEMgMjAuOTMzNTk0IDE0NC41MTk1MzEgMTYuNzg1MTU2IDE0NC4yMTg3NSAxMy4yMjY1NjIgMTQ2Ljg1MTU2MiBDIDEwLjI2NTYyNSAxNDkuMTg3NSA3LjY3MTg3NSAxNTIuMTk5MjE5IDcuNDQ5MjE5IDE1NS44OTA2MjUgQyA3LjMwMDc4MSAxNTggNy42NzE4NzUgMTYwLjg1OTM3NSA5LjAwMzkwNiAxNjIuODk0NTMxIEMgMTAuNTU4NTk0IDE2NS4zNzg5MDYgMTMuMjI2NTYyIDE2NS42Nzk2ODggMTUuODIwMzEyIDE2Ni42NjAxNTYgQyAxOS43NSAxNjguMTY0MDYyIDIyLjM0Mzc1IDE2Mi43NDIxODggMjUuNjAxNTYyIDE2Mi41OTM3NSBDIDI4Ljg2MzI4MSAxNjIuMzY3MTg4IDI2Ljc4OTA2MiAxNjcuMTA5Mzc1IDI2LjA0Njg3NSAxNjguMzE2NDA2IEMgMjIuMzQzNzUgMTc0LjExMzI4MSAxNS40NDkyMTkgMTczLjI4NTE1NiA5Ljc0NjA5NCAxNzEuNjI4OTA2IEMgMi44NTU0NjkgMTY5LjU5NzY1NiAtMC43NzczNDQgMTYyLjU5Mzc1IDAuNDEwMTU2IDE1NS4xMzY3MTkgWiBNIDM1LjA1ODU5NCAxNjguNjc5Njg4IEMgMzAuMDE5NTMxIDE2NS42Njc5NjkgMjcuODcxMDk0IDE1OS4zMzk4NDQgMjkuNSAxNTMuNjE3MTg4IEMgMzAuNjg3NSAxNDkuNDAyMzQ0IDMzLjM1NTQ2OSAxNDcuMjE0ODQ0IDM0LjI0MjE4OCAxNDUuMTA5Mzc1IEMgMzYuMDIzNDM4IDE0MS4wNDI5NjkgNDEuMjEwOTM4IDE0Mi4yNDYwOTQgNDQuMDIzNDM4IDE0NS40MTAxNTYgQyA0NS45NTMxMjUgMTQ3LjY2Nzk2OSA0Ni45ODgyODEgMTUwLjIzMDQ2OSA0Ny42NTYyNSAxNTIuNzg5MDYyIEMgNDkuMjEwOTM4IDE1OC43MzgyODEgNDYuNDcyNjU2IDE2My43ODUxNTYgNDIuNTQyOTY5IDE2OCBDIDQwLjkxNDA2MiAxNjkuNzM0Mzc1IDM3LjA1ODU5NCAxNjkuODA4NTk0IDM1LjA1ODU5NCAxNjguNjc5Njg4IFogTSAzNy40Mjk2ODggMTYxLjIyMjY1NiBDIDQyLjc2NTYyNSAxNjIuNDI5Njg4IDQzLjI4NTE1NiAxNTUuMTk5MjE5IDM5LjI4MTI1IDE1MC43NTc4MTIgQyAzNy42NTIzNDQgMTQ5LjAyMzQzOCAyOS42NDg0MzggMTU5LjQxNzk2OSAzNy40Mjk2ODggMTYxLjIyMjY1NiBaIE0gNTQuMzYzMjgxIDE1Ni4wMjczNDQgQyA1NC4zNjMyODEgMTQ2LjYxMzI4MSA2NS43NzM0MzggMTQ1LjE4MzU5NCA3MS40ODA0NjkgMTQwLjUxNTYyNSBDIDczLjI1NzgxMiAxMzkuMDA3ODEyIDcyLjUxNTYyNSAxMzUuMDkzNzUgNzMuNjI4OTA2IDEzMi41MzEyNSBDIDc0LjY2Nzk2OSAxMzAuNzIyNjU2IDc2LjgxNjQwNiAxMjkuMjE4NzUgNzguNTkzNzUgMTI5Ljk3MjY1NiBDIDc5LjMzNTkzOCAxMzAuMzQ3NjU2IDgxLjAzOTA2MiAxMzEuNDc2NTYyIDgwLjc0MjE4OCAxMzIuOTA2MjUgQyA3Ni40NDUzMTIgMTQ0LjgwODU5NCA3Ni44MTY0MDYgMTU3LjgzNTkzOCA3OC45NjQ4NDQgMTcwLjU2MjUgQyA3OC45NjQ4NDQgMTcxLjIzODI4MSA3Ny4xODc1IDE3Mi4zNzEwOTQgNzYuMDc0MjE5IDE3Mi4zNzEwOTQgQyA3Mi44ODY3MTkgMTcyLjc0NjA5NCA3Mi44ODY3MTkgMTY4IDcxLjEwOTM3NSAxNjcuNjI1IEMgNjguMjE4NzUgMTY3LjYyNSA2NS4zMjgxMjUgMTY4LjQ1MzEyNSA2Mi41ODU5MzggMTY2LjU3MDMxMiBDIDU4Ljk1NzAzMSAxNjQuMDg1OTM4IDU0LjM2MzI4MSAxNjEuNTIzNDM4IDU0LjM2MzI4MSAxNTYuMDI3MzQ0IFogTSA2MS44NDc2NTYgMTU0Ljk3MjY1NiBDIDYyLjM2NzE4OCAxNTguNTg5ODQ0IDY2LjQ0MTQwNiAxNjIuMjAzMTI1IDcwLjM2NzE4OCAxNjAuNzczNDM4IEMgNjkuNzAzMTI1IDE1Ni40MDIzNDQgNzEuMTA5Mzc1IDE1Mi40MTQwNjIgNzEuMTA5Mzc1IDE0OC4xMjEwOTQgQyA2Ny4xODM1OTQgMTQ4LjEyMTA5NCA2MS4xMDU0NjkgMTUwLjMwNDY4OCA2MS44NDc2NTYgMTU0Ljk3MjY1NiBaIE0gODUuNzQ2MDk0IDE1MS42NjAxNTYgQyA4NS41OTc2NTYgMTQ0LjIwMzEyNSA5MS4wMDM5MDYgMTM4Ljc4MTI1IDk4LjI2NTYyNSAxMzkuODM1OTM4IEMgMTA0LjA0Njg3NSAxNDAuNjY0MDYyIDEwOS4zMDg1OTQgMTQ2LjMxMjUgMTA5LjIzNDM3NSAxNTIuNjQwNjI1IEMgMTA4LjA1MDc4MSAxNTYuMjUzOTA2IDk5Ljc1IDE1OS4zMzk4NDQgOTYuOTMzNTk0IDE2Mi4wNTA3ODEgQyA5Ni42MzY3MTkgMTYyLjEyODkwNiA5NS4zMDQ2ODggMTYyLjg3ODkwNiA5NS43NSAxNjMuNjMyODEyIEMgOTguMzM5ODQ0IDE2OC4yMjY1NjIgMTAzLjA4NTkzOCAxNjYuMTk1MzEyIDEwNy4yMzQzNzUgMTY0LjAxMTcxOSBDIDEwOS45MDIzNDQgMTY1Ljk2ODc1IDEwOC40OTIxODggMTcwLjQ4ODI4MSAxMDUuNDU3MDMxIDE3MC45Mzc1IEMgMTAyLjEyMTA5NCAxNzEuNDY0ODQ0IDk4LjQ4ODI4MSAxNzIuMzcxMDk0IDk0LjkzMzU5NCAxNzAuNzg5MDYyIEMgODcuNTIzNDM4IDE2Ny4zOTg0MzggODUuODk0NTMxIDE1OC44OTA2MjUgODUuNzQ2MDk0IDE1MS42NjAxNTYgWiBNIDkzLjgyMDMxMiAxNTUuNSBDIDk3LjMwNDY4OCAxNTUuMzUxNTYyIDEwMC43MTQ4NDQgMTU0LjM3MTA5NCAxMDEuODI0MjE5IDE1MC43NTc4MTIgQyAxMDMuNDUzMTI1IDE0Ni45OTIxODggOTcuMzA0Njg4IDE0NS4wMzEyNSA5NC4zMzk4NDQgMTQ2LjYxMzI4MSBDIDkxLjA3ODEyNSAxNDguMzQ3NjU2IDkyLjA0Mjk2OSAxNTUuMzUxNTYyIDkzLjgyMDMxMiAxNTUuNSBaIE0gMTQ5LjgzMjAzMSAxNzEuOTQxNDA2IEMgMTQ4LjQ5MjE4OCAxNzEuMjUgMTQ4LjIyMjY1NiAxNjkuMzg2NzE5IDE0Ny4xOTE0MDYgMTY5LjQ5NjA5NCBDIDE0MS44NTU0NjkgMTY5LjA3MDMxMiAxMzUuOTkyMTg4IDE2OS45OTIxODggMTMyLjUxOTUzMSAxNjUuMjg1MTU2IEMgMTMwLjI0NjA5NCAxNjIuODAwNzgxIDEzMC41IDE1Ny4zOTQ1MzEgMTMyLjA4MjAzMSAxNTQuNzMwNDY5IEMgMTM3LjE5NTMxMiAxNDUuOTM3NSAxNDcuODU1NDY5IDE0Ny4zOTA2MjUgMTQ3Ljk4MDQ2OSAxNDcuMTQ4NDM4IEMgMTQ4LjUzMTI1IDE0Ni4wMzEyNSAxNDguNjIxMDk0IDE0Mi42MTMyODEgMTQ2Ljk2ODc1IDE0Mi40ODQzNzUgQyAxNDIuNTE5NTMxIDE0MS45Njg3NSAxNDAuMDAzOTA2IDE0NC4yNzczNDQgMTM2LjIzODI4MSAxNDYuMDM5MDYyIEMgMTMzLjQwMjM0NCAxNDcuMzk4NDM4IDEzMi4xMDE1NjIgMTQxLjQwMjM0NCAxMzIuNjk1MzEyIDE0MC42NTYyNSBDIDEzNy42MTcxODggMTM2LjQyOTY4OCAxNDguMzc1IDEzMy4xNzU3ODEgMTUyLjQyOTY4OCAxMzkuODYzMjgxIEMgMTU2LjA0Njg3NSAxNDUuOTE3OTY5IDE1My4xNzU3ODEgMTUyLjY2MDE1NiAxNTMuMzkwNjI1IDE1OS42Nzk2ODggQyAxNTMuNTc0MjE5IDE2NC4yNzczNDQgMTU0LjE3NTc4MSAxNzQuMjg1MTU2IDE0OS44MzIwMzEgMTcxLjk0MTQwNiBaIE0gMTQ2LjY2MDE1NiAxNjMuNDg0Mzc1IEMgMTQ3LjMyODEyNSAxNTkuNjQwNjI1IDE0OS4yNTM5MDYgMTU3LjA4MjAzMSAxNDcuNjI1IDE1My4wODk4NDQgQyAxNDMuMzI0MjE5IDE1NC43NDYwOTQgMTM1LjgzOTg0NCAxNTMuNDY4NzUgMTM1LjY5MTQwNiAxNTkuOTQ1MzEyIEMgMTM1LjYxNzE4OCAxNjMuMjU3ODEyIDE0Ni4wNjY0MDYgMTY0LjkxNDA2MiAxNDYuNjYwMTU2IDE2My40ODQzNzUgWiBNIDE2Ny43MzgyODEgMTcwLjc4OTA2MiBDIDE2Ni45OTYwOTQgMTcwLjYzNjcxOSAxNjYuMTc5Njg4IDE2OS4yMDcwMzEgMTY1LjgxMjUgMTY4LjM3ODkwNiBDIDE2NC45OTYwOTQgMTYxLjMwMDc4MSAxNjUuODEyNSAxNTQuNTk3NjU2IDE2NC4yNTM5MDYgMTQ3LjUxOTUzMSBDIDE2My44MDg1OTQgMTQ2LjMxMjUgMTYyLjY5OTIxOSAxNDQuNzMwNDY5IDE2My4wNzAzMTIgMTQzLjE0ODQzOCBDIDE2My40NDE0MDYgMTQyLjM5ODQzOCAxNjQuMjUzOTA2IDE0MS45NDUzMTIgMTY0LjYyNSAxNDEuMTkxNDA2IEMgMTY0Ljk5NjA5NCAxMzYuNDQ5MjE5IDE2My45NTcwMzEgMTMxLjc3NzM0NCAxNjQuOTk2MDk0IDEyNi45NTcwMzEgQyAxNjUuNTE1NjI1IDEyNC42MjUgMTY4LjkyMTg3NSAxMjEuMDg1OTM4IDE3MC44NTE1NjIgMTIzLjc5Njg3NSBDIDE3NS4wNzQyMTkgMTI4LjE2NDA2MiAxNjguOTIxODc1IDEzNC40ODgyODEgMTcxLjk2MDkzOCAxMzkuOTg4MjgxIEMgMTgwLjE4NzUgMTQwLjM2MzI4MSAxODguNzA3MDMxIDE0My41MjczNDQgMTkxLjM3NSAxNTEuNDMzNTk0IEMgMTkzLjAwNzgxMiAxNTYuMTc5Njg4IDE4OS44MjAzMTIgMTYxLjY3NTc4MSAxODUuOTY0ODQ0IDE2NC40NjA5MzggQyAxODAuNTU4NTk0IDE2OC4zNzg5MDYgMTc0LjMzMjAzMSAxNzEuOTkyMTg4IDE2Ny43MzgyODEgMTcwLjc4OTA2MiBaIE0gMTczLjE0ODQzOCAxNjMuMjU3ODEyIEMgMTcxLjIxODc1IDE1Ny43NTc4MTIgMTcxLjIxODc1IDE1MS44MDg1OTQgMTcxLjIxODc1IDE0Ni4zMTI1IEMgMTc2LjYyODkwNiAxNDUuNTU4NTk0IDE4NC42MzI4MTIgMTQ5LjA5NzY1NiAxODQuNzgxMjUgMTU0LjIxODc1IEMgMTg1LjAwMzkwNiAxNTkuNzE4NzUgMTc4LjE4NzUgMTYyLjg3ODkwNiAxNzMuMTQ4NDM4IDE2My4yNTc4MTIgWiBNIDEyMC42ODc1IDE3MS4yMzQzNzUgQyAxMTguMDM1MTU2IDE3MS4yMzQzNzUgMTE1LjIyNjU2MiAxNjguOTQ5MjE5IDExNS44MTY0MDYgMTYzLjk2MDkzOCBDIDExNi40MTAxNTYgMTU4Ljk3NjU2MiAxMTYuNjgzNTk0IDE2MS41IDExNy4yOTI5NjkgMTUyLjI3NzM0NCBDIDExNy44OTg0MzggMTQzLjA1NDY4OCAxMTcuMjkyOTY5IDEzNC44OTQ1MzEgMTE3LjI5Mjk2OSAxMjguNjI4OTA2IEMgMTE3LjI5Mjk2OSAxMjIuMzYzMjgxIDEwOC4yODkwNjIgMTA0Ljc4NTE1NiAxMjAuNzE0ODQ0IDEwNC43ODUxNTYgQyAxMjYuNDAyMzQ0IDEwNy4wNTg1OTQgMTIzLjU1MDc4MSAxMTMuMDQ2ODc1IDEyMy41NTA3ODEgMTE4LjUzMTI1IEMgMTIzLjU1MDc4MSAxMjQuODAwNzgxIDEyMy41NTA3ODEgMTI3LjQxMDE1NiAxMjMuNTUwNzgxIDEzMC43OTY4NzUgQyAxMjMuNTUwNzgxIDEzNC4xODc1IDEyMy41NTA3ODEgMTQ2LjYwNTQ2OSAxMjMuNTUwNzgxIDE1NS40ODA0NjkgQyAxMjMuNTUwNzgxIDE2NC4zNTU0NjkgMTIzLjM0Mzc1IDE3MS4yMzQzNzUgMTIwLjY4NzUgMTcxLjIzNDM3NSBaIE0gMTIwLjY4NzUgMTcxLjIzNDM3NSAiLz4KPC9nPgo8L3N2Zz4K";
var menuIconURI = blockIconURI;
var TOPIC = "eim/usbMicrobit";


var ButtonParam = {
    A: "A",
    B: "B",
    A_B: "A+B"
};

var analogPin = {
    one: "1",
    two: "2",
};


var gesture = {
    face_up: "face up",
    face_down: "face down",
    shake: "shake",
};


var AccelerometerParam = {
    X: 'X',
    Y: 'Y',
    Z: 'Z'
};


const MicroBitTiltDirection = {
    FRONT: 'front',
    BACK: 'back',
    LEFT: 'left',
    RIGHT: 'right',
    ANY: 'any'
};

var IconParam = {
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

class Scratch3UsbMicrobitBlocks {

    static get TILT_THRESHOLD() {
        return 15;
    }
    static get STATE_KEY() {
        return "Scratch.usbMicrobit";
    }
    static get EXTENSION_ID() {
        return "usbMicrobit";
    }

    constructor(runtime) {
        var _this = this;
        this.runtime = runtime;
        const url = new URL(window.location.href);
        var adapterHost = url.searchParams.get("adapter_host");
        if (!adapterHost) {
            var adapterHost = "codelab-adapter.codelab.club";
        }
        this.socket = io(`//${adapterHost}:12358` + "/test", {
            transports: ["websocket"]
        });
        this.socket.on("sensor", function (msg) {
            console.log('sensor')
            _this.message = msg.message;
            var topic = _this.message.topic;

            if (topic === TOPIC) {
                _this.button_a = _this.message.payload.button_a;
                _this.button_b = _this.message.payload.button_b;
                _this.x = _this.message.payload.x;
                _this.y = _this.message.payload.y;
                _this.z = _this.message.payload.z;
                _this.gesture = _this.message.payload.gesture;
                _this.pin_one = _this.message.payload.pin_one_analog_input;
                _this.pin_two = _this.message.payload.pin_two_analog_input;

            }
        });
        this.state = 0;
    }

    getInfo() {
        return {
            id: "usbMicrobit",
            name: "usbMicrobit",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [{
                    opcode: "whenButtonIsPressed",
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: "usbMicrobit.whenbuttonispressed",
                        default: "When Button [BUTTON_PARAM] Is Pressed",
                        description: "pass hello by socket"
                    }),
                    arguments: {
                        BUTTON_PARAM: {
                            type: ArgumentType.STRING,
                            menu: "buttonParam",
                            defaultValue: ButtonParam.A
                        }
                    }
                },
                {
                    opcode: "buttonIsPressed",
                    blockType: BlockType.BOOLEAN,
                    // blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "usbMicrobit.buttonispressed",
                        default: "Button [BUTTON_PARAM] Is Pressed?",
                        description: "pass hello by socket"
                    }),
                    arguments: {
                        BUTTON_PARAM: {
                            type: ArgumentType.STRING,
                            menu: "buttonParam",
                            defaultValue: ButtonParam.A
                        }
                    }
                },
                '---',
                {
                    opcode: "say",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "usbMicrobit.say",
                        default: "say [TEXT]",
                        description: "pass hello by socket"
                    }),
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Hello!"
                        }
                    }
                },

                {
                    opcode: 'displaySymbol',
                    text: formatMessage({
                        id: 'usbMicrobit.displaySymbol',
                        default: 'display [MATRIX]',
                        description: 'display a pattern on the micro:bit display'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX: {
                            type: ArgumentType.MATRIX,
                            defaultValue: '0101010101100010101000100'
                        }
                    }
                },
                {
                    opcode: 'showIcon',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'usbMicrobit.showIcon',
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
                },
                {
                    opcode: "clearScreen",
                    blockType: BlockType.COMMAND,
                    // blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "usbMicrobit.clearScreen",
                        default: "clear screen",
                        description: "clear screen"
                    }),
                    arguments: {}
                },
                '---',
                {
                    opcode: "get_gesture",
                    // blockType: BlockType.BOOLEAN,
                    blockType: BlockType.BOOLEAN,
                    // blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "usbMicrobit.get_gesture",
                        default: "gesture is[gesture]?",
                        description: "gesture is?"
                    }),
                    arguments: {
                        gesture: {
                            type: ArgumentType.STRING,
                            menu: "gesture",
                            defaultValue: gesture.face_up
                        }
                    }
                },
                {
                    opcode: 'get_accelerometer',
                    // blockType: BlockType.BOOLEAN,
                    blockType: BlockType.REPORTER,
                    // blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'usbMicrobit.get_accelerometer',
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
                    opcode: "getTiltAngle",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "usbMicrobit.get_TiltAngle",
                        default: "tilt angle [tiltDirection]",
                        description: "pass hello by socket"
                    }),
                    arguments: {
                        tiltDirection: {
                            type: ArgumentType.STRING,
                            menu: "tiltDirection",
                            defaultValue: MicroBitTiltDirection.FRONT
                        }
                    }
                },
                {
                    opcode: 'isTilted',
                    text: formatMessage({
                        id: 'usbMicrobit.isTilted',
                        default: 'tilted [tiltDirectionAny]?',
                        description: 'is the micro:bit is tilted in a direction?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        tiltDirectionAny: {
                            type: ArgumentType.STRING,
                            menu: 'tiltDirectionAny',
                            defaultValue: MicroBitTiltDirection.ANY
                        }
                    }
                },
                '---',
                {
                    opcode: "get_analog_input",
                    // blockType: BlockType.BOOLEAN,
                    blockType: BlockType.REPORTER,
                    // blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "usbMicrobit.get_analog_input",
                        default: "Analog pin [ANALOG_PIN] value",
                        description: "pass hello by socket"
                    }),
                    arguments: {
                        ANALOG_PIN: {
                            type: ArgumentType.STRING,
                            menu: "analogPin",
                            defaultValue: analogPin.one
                        }
                    }
                },
                '---',
                {
                    opcode: "python_exec",
                    // 前端打上标记 危险
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "usbMicrobit.python_exec",
                        default: "exec [CODE]",
                        description: "run python code."
                    }),
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'display.show("c")'
                        }
                    }
                }
            ],
            menus: {
                buttonParam: this.initButtonParam(),
                tiltDirection: this.TILT_DIRECTION_MENU,
                tiltDirectionAny: this.TILT_DIRECTION_ANY_MENU,
                analogPin: this.initAnalogPin(),
                gesture: this.initgesture(),
                accelerometerParam: this.initAccelerometerParam(),
                iconParam: this.initColorParam(),
            }
        };
    }

    python_exec(args) {
        console.log(args)
        var python_code = args.CODE;
        this.socket.emit("actuator", {
            payload: python_code,
            topic: TOPIC
        });
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, USBSendInterval);
        });
    }

    initButtonParam() {
        return [{
                text: "A",
                value: ButtonParam.A
            },
            {
                text: "B",
                value: ButtonParam.B
            },
            {
                text: "A+B",
                value: ButtonParam.A_B
            }
        ];
    }

    initColorParam() {
        return [{
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.happy',
                default: 'happy',
                description: 'label for color element in color picker for pen extension'
            }),
            value: IconParam.HAPPY
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.smile',
                default: 'smile',
                description: 'label for saturation element in color picker for pen extension'
            }),
            value: IconParam.SMILE
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.sad',
                default: 'sad',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.SAD
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.heart',
                default: 'heart',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.HEART
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.heart_small',
                default: 'heart_small',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.HEART_SMALL
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.yes',
                default: 'yes',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.YES
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.confused',
                default: 'confused',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.CONFUSED
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.angry',
                default: 'angry',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.ANGRY
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.asleep',
                default: 'asleep',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.ASLEEP
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.surprised',
                default: 'surprised',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.SURPRISED
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.silly',
                default: 'silly',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.SILLY
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.meh',
                default: 'meh',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.MEH
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.fabulous',
                default: 'fabulous',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.FABULOUS
        }, {
            text: formatMessage({
                id: 'usbMicrobit.iconMenu.no',
                default: 'no',
                description: 'label for brightness element in color picker for pen extension'
            }),
            value: IconParam.NO
        }];
    }


    initAccelerometerParam() {
        return [{
                text: "X",
                value: AccelerometerParam.X
            },
            {
                text: "Y",
                value: AccelerometerParam.Y
            },
            {
                text: "Z",
                value: AccelerometerParam.Z
            }
        ];
    }

    initAnalogPin() {
        return [{
                text: "1",
                value: analogPin.one
            },
            {
                text: "2",
                value: analogPin.two
            }
        ];
    }

    initgesture() {
        return [{
                text: formatMessage({
                    id: 'usbMicrobit.gesture.face_up',
                    default: 'face up',
                    description: 'label for front element in tilt direction picker for micro:bit extension'
                }),
                value: gesture.face_up
            },
            {
                text: formatMessage({
                    id: 'usbMicrobit.gesture.face_down',
                    default: 'face down',
                    description: 'label for front element in tilt direction picker for micro:bit extension'
                }),
                value: gesture.face_down
            },
            {
                text: formatMessage({
                    id: 'usbMicrobit.gesture.shake',
                    default: 'shake',
                    description: 'label for front element in tilt direction picker for micro:bit extension'
                }),
                value: gesture.shake
            },
        ];
    }


    get TILT_DIRECTION_MENU() {

        return [{
                text: formatMessage({
                    id: 'microbit.tiltDirectionMenu.front',
                    default: 'front',
                    description: 'label for front element in tilt direction picker for micro:bit extension'
                }),
                value: MicroBitTiltDirection.FRONT
            },
            {
                text: formatMessage({
                    id: 'microbit.tiltDirectionMenu.back',
                    default: 'back',
                    description: 'label for back element in tilt direction picker for micro:bit extension'
                }),
                value: MicroBitTiltDirection.BACK
            },
            {
                text: formatMessage({
                    id: 'microbit.tiltDirectionMenu.left',
                    default: 'left',
                    description: 'label for left element in tilt direction picker for micro:bit extension'
                }),
                value: MicroBitTiltDirection.LEFT
            },
            {
                text: formatMessage({
                    id: 'microbit.tiltDirectionMenu.right',
                    default: 'right',
                    description: 'label for right element in tilt direction picker for micro:bit extension'
                }),
                value: MicroBitTiltDirection.RIGHT
            }
        ];
    }


    get TILT_DIRECTION_ANY_MENU() {
        return [
            ...this.TILT_DIRECTION_MENU,
            {
                text: formatMessage({
                    id: 'microbit.tiltDirectionMenu.any',
                    default: 'any',
                    description: 'label for any direction element in tilt direction picker for micro:bit extension'
                }),
                value: MicroBitTiltDirection.ANY
            }
        ];
    }

    showIcon(args) {
        // todo 不够平坦
        var convert = {
            happy: 'Image.HAPPY',
            smile: 'Image.SMILE',
            sad: 'Image.SAD',
            heart: 'Image.HEART',
            heart_small: 'Image.HEART_SMALL',
            yes: 'Image.YES',
            no: 'Image.NO',
            confused: 'Image.CONFUSED',
            angry: 'Image.ANGRY',
            asleep: 'Image.ASLEEP',
            surprised: 'Image.SURPRISED',
            silly: 'Image.SILLY',
            meh: 'Image.MEH',
            fabulous: 'Image.FABULOUS'
        };
        var python_code = "display.show(".concat(convert[args.ICON_PARAM], ", wait = True, loop = False)"); // console.log(args.ICON_PARAM);

        this.socket.emit('actuator', {
            payload: python_code,
            topic: TOPIC
        });
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, USBSendInterval);
        });
    }
    getHats() {
        return {
            microbit_whenbuttonaispressed: {
                restartExistingThreads: false,
                edgeActivated: true
            }
        };
    }

    getMonitored() {
        return {
            microbit_buttonispressed: {}
        };
    }

    whenButtonIsPressed(args) {
        if (args.BUTTON_PARAM === "A") {
            return this.button_a;
        } else if (args.BUTTON_PARAM === "B") {
            return this.button_b;
        } else if (args.BUTTON_PARAM === "A+B") {
            return this.button_a && this.button_b;
        }
    }

    get_analog_input(args) {
        if (args.ANALOG_PIN === "1") {
            return this.pin_one;
        } else if (args.ANALOG_PIN === "2") {
            return this.pin_two;
        }
    }

    get_accelerometer(args) {
        if (args.ACCELEROMETER_PARAM === 'X') {
            return this.x;
        } else if (args.ACCELEROMETER_PARAM === 'Y') {
            return this.y;
        } else if (args.ACCELEROMETER_PARAM === 'Z') {
            return this.z;
        }
    }
    buttonIsPressed(args) {
        if (args.BUTTON_PARAM === "A") {
            return this.button_a;
        } else if (args.BUTTON_PARAM === "B") {
            return this.button_b;
        } else if (args.BUTTON_PARAM === "A+B") {
            return this.button_a && this.button_b;
        }
    }
    say(args) {
        var python_code = 'display.scroll("'.concat(
            args.TEXT,
            '", wait=False, loop=False)'
        );
        this.socket.emit("actuator", {
            payload: python_code,
            topic: TOPIC
        });
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, USBSendInterval);
        });
    }

    displaySymbol(args) {
        const symbol = cast.toString(args.MATRIX).replace(/\s/g, '');
        var symbol_code = "";
        for (var i = 0; i < symbol.length; i++) {
            if (i % 5 == 0 && i != 0) {
                symbol_code = symbol_code + ":"
            }
            if (symbol[i] != "0") {
                symbol_code = symbol_code + "7";
            } else {
                symbol_code = symbol_code + "0";
            }
        }

        var python_code = 'display.show(Image("'.concat(
            symbol_code,
            '"), wait=True, loop=False)'
        );


        this.socket.emit("actuator", {
            payload: python_code,
            topic: TOPIC
        });

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, USBSendInterval);
        });
    }
    clearScreen(args) {
        var python_code = "display.clear()";
        this.socket.emit("actuator", {
            payload: python_code,
            topic: TOPIC
        });
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, USBSendInterval);
        });
    }

    isTilted(args) {
        return this._isTilted(args.tiltDirectionAny);
    }

    /**
     * @param {object} args - the block's arguments.
     * @property {TiltDirection} DIRECTION - the direction (front, back, left, right) to check.
     * @return {number} - the tilt sensor's angle in the specified direction.
     * Note that getTiltAngle(front) = -getTiltAngle(back) and getTiltAngle(left) = -getTiltAngle(right).
     */
    getTiltAngle(args) {
        return this._getTiltAngle(args.tiltDirection);
    }

    _getTiltAngle(args) {
        switch (args) {
            case MicroBitTiltDirection.FRONT:
                return Math.round(this.y / -10);
            case MicroBitTiltDirection.BACK:
                return Math.round(this.y / 10);
            case MicroBitTiltDirection.LEFT:
                return Math.round(this.x / -10);
            case MicroBitTiltDirection.RIGHT:
                return Math.round(this.x / 10);
            default:
                log.warn(`Unknown tilt direction in _getTiltAngle: ${args}`);
        }
    }

    _isTilted(args) {
        switch (args) {
            case MicroBitTiltDirection.ANY:
                return (Math.abs(this.x / 10) >= Scratch3UsbMicrobitBlocks.TILT_THRESHOLD) ||
                    (Math.abs(this.y / 10) >= Scratch3UsbMicrobitBlocks.TILT_THRESHOLD);
            default:
                console.log(args);
                return this._getTiltAngle(args) >= Scratch3UsbMicrobitBlocks.TILT_THRESHOLD;
        }
    }

    get_gesture(args) {

        switch (args.gesture) {
            case this.gesture:
                return true;
            default:
                return false;
        }
    }
}

module.exports = Scratch3UsbMicrobitBlocks;
