export function Name() { return "MCHOSE Ace 68 Turbo"; }
export function VendorId() { return 0x3837; }
export function ProductId() { return 0x3026; }
export function Publisher() { return "Lukkrn"; } 
export function DefaultPosition() { return [10, 10]; }
export function DefaultScale() { return 5.0; }
export function DeviceType() { return "Keyboard"; }
export function LedNames() { return vKeyNames; }
export function LedPositions() { return vKeyPositions; }
export function Size() { return [16, 5]; }


export function ControllableParameters() 
{
    return [
        {"property":"isMappingMode", "label":"Mapping Mode (Zum Testen AN)", "type":"boolean", "default":"false"},
        {"property":"testLedIndex", "label":"Hardware LED Scanner", "min":"0", "max":"127", "type":"number", "default":"0"},
        {"property":"shutdownColor", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"000000"},
        {"property":"LightingMode", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
        {"property":"forcedColor", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"}
    ];
}

const vKeyNames = [
    "Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-_", "=+", "Backspace", "~",
    "Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\", "Del",
    "CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter", "PgUp",
    "Left Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Right Shift", "Up Arrow", "PgDn",
    "Left Ctrl", "Left Win", "Left Alt", "Space", "Right Alt", "Fn", "Right Ctrl", "Left Arrow", "Down Arrow", "Right Arrow",
    "Space2", "Space3", "Space4", "Space5"
];

const vKeys = [
    // row 0: Esc 1 2 3 4 5 6 7  8 9 0 -_ =+ Bksp ~
     0, 10, 20, 30, 40, 50, 60, 70,  1, 11, 21, 31, 41, 51, 71,
    // row 1: Tab Q W E R T Y U  I O P [ ] \ Del
     2, 12, 22, 32, 42, 52, 62, 72,  3, 13, 23, 33, 43, 53, 63,
    // row 2: Caps A S D F G H J  K L ; ' Enter PgUp
     4, 14, 24, 34, 44, 54, 64, 74,  5, 15, 25, 35, 45, 55,
    // row 3: LShift Z X C V B N  M , . / RShift Up PgDn
     6, 26, 36, 46, 56, 66, 76,  7, 17, 27, 37, 47, 57, 65,
    // row 4: LCtrl LWin LAlt Space  RAlt Fn RCtrl LArrow DArrow RArrow
     8, 18, 28, 38, 48, 58, 68, 78, 67, 77,
    // Space extra LEDs
    82, 83, 84, 85
];

const vKeyPositions = [
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [15, 0],
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [10, 1], [11, 1], [12, 1], [13, 1], [15, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [11, 2], [12, 2], [15, 2],
    [0, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [14, 3], [15, 3],
    [0, 4], [1, 4], [2, 4], [6, 4], [10, 4], [11, 4], [12, 4], [13, 4], [14, 4], [15, 4],
    [4, 4], [5, 4], [7, 4], [8, 4]
];

export function Initialize() {
    device.setName("MCHOSE Ace 68");
    device.setSize([16, 5]);
    device.setControllableLeds(vKeyNames, vKeyPositions);
    device.log("MCHOSE Ace 68 Initialized");
}

export function Validate(endpoint) {
    return endpoint.interface === 1;
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let colors = [];
  colors[0] = parseInt(result[1], 16);
  colors[1] = parseInt(result[2], 16);
  colors[2] = parseInt(result[3], 16);

  return colors;
}

export function Render() {
    sendColors(false);
}

export function Shutdown() {
    sendColors(true);
}

function sendColors(isShutdown) {
    let colorBuffer = new Array(392).fill(0);
    
    if (isMappingMode) {
        let hwIndex = Math.floor(testLedIndex) * 3;
        colorBuffer[hwIndex]     = 0xFF;
        colorBuffer[hwIndex + 1] = 0x00;
        colorBuffer[hwIndex + 2] = 0x00;
    } 
    else {
        for (let i = 0; i < vKeys.length; i++) {
            let col = [0, 0, 0];
            
            if (isShutdown) {
                col = hexToRgb(shutdownColor);
            } else if (LightingMode === "Forced") {
                col = hexToRgb(forcedColor);
            } else {
                let x = vKeyPositions[i][0];
                let y = vKeyPositions[i][1];
                col = device.color(x, y); 
            }

            let hwLedId = vKeys[i]; 
            let bufferIndex = hwLedId * 3;
            
            colorBuffer[bufferIndex]     = col[0];
            colorBuffer[bufferIndex + 1] = col[1];
            colorBuffer[bufferIndex + 2] = col[2];
        }
    }

    for (let i = 0; i < 7; i++) {
        let offset = i * 56;
        let chunk = colorBuffer.slice(offset, offset + 56);

        let packet = new Array(65).fill(0);
        packet[0] = 0x00; 
        packet[1] = 0x55; 
        packet[2] = 0xDD;
        packet[3] = 0x00;
        
        packet[5] = chunk.length;
        packet[6] = offset & 0xFF;
        packet[7] = (offset >> 8) & 0xFF;
        packet[8] = 0x00;

        for (let j = 0; j < chunk.length; j++) {
            packet[9 + j] = chunk[j];
        }

        let checksum = 0;
        for (let c = 5; c < 65; c++) {
            checksum += packet[c];
        }
        packet[4] = checksum & 0xFF;

        device.write(packet, 65);
        device.pause(2);
    }
}