// DOM Elements
const inputField = document.getElementById('command-input');
const outputArea = document.getElementById('output');
const terminal = document.getElementById('terminal');
const promptSpan = document.querySelector('.prompt');

// Virtual File System (VFS)
const fileSystem = {
    "root": {
        type: "dir",
        content: {
            "rockyou.txt": { type: "file", data: "123456\npassword\nqwerty\nSuperSecret!\nadmin123" }
        }
    },
    "home": {
        type: "dir",
        content: {
            "student": {
                type: "dir",
                content: {
                    "readme.txt": { type: "file", data: "Welcome to the Wireless Security Simulation Environment.\nUse 'help' to see available commands." },
                    "omnicorp_leak.txt": { type: "file", data: "admin\npassword\nOmniAdmin99!\nletmein123\nwinter2023" }
                }
            }
        }
    },
    "etc": {
        type: "dir",
        content: {}
    }
};

// Advanced Game State
const gameState = {
    current_directory: "/root",
    current_mission: 0,
    active_process_interval: null, // Tracks setInterval IDs for continuous tools and progress bars
    connected_network: null,       // Tracks active WiFi connection
    flags: {
        reaver_success: false,
        handshake_captured: false, // Mission 4 flag
        cpu_crack_success: false,  // Mission 5 flag
        gpu_crack_success: false,  // Mission 6 flag
        omnicorp_hacked: false     // Mission 7 (Win) flag
    },
    interfaces: {
        wlan0: true,
        wlan0mon: false
    },
    mac: {
        original_mac: "00:11:22:33:44:55",
        current_mac: "00:11:22:33:44:55",
        is_spoofed: false
    },
    process: {
        active: false,
        name: null
    },
    // Mock Database
    networks: [
        {
            bssid: "AA:BB:CC:11:22:33", ssid: "Home_Net_5G", channel: "6", encryption: "WPA2", wps: false, password: "password123",
            clients: [
                { mac: "11:22:33:AA:BB:CC", ip: "192.168.1.15", ports: [80, 443, 22] },
                { mac: "22:33:44:BB:CC:DD", ip: "192.168.1.102", ports: [80] }
            ]
        },
        {
            bssid: "1A:2B:3C:4D:5E:6F", ssid: "Cafe_Free_WiFi", channel: "11", encryption: "WPA2", wps: false, password: "password",
            clients: [
                { mac: "AA:11:BB:22:CC:33", ip: "10.0.0.5", ports: [80, 443] }
            ]
        },
        {
            bssid: "12:34:56:78:90:AB", ssid: "Corp_AP_01", channel: "1", encryption: "WPA2", wps: true, password: "SuperSecret!", pin: "12345670",
            clients: [
                { mac: "99:88:77:66:55:44", ip: "172.16.0.50", ports: [80, 443, 3389, 445] }
            ]
        },
        {
            bssid: "FE:DC:BA:98:76:54", ssid: "Hidden_Network", channel: "4", encryption: "WPA3", wps: false, password: "QWERTYUIOP",
            clients: [
                { mac: "55:44:33:22:11:00", ip: "192.168.0.10", ports: [22, 8080] }
            ]
        },
        // Capstone Target
        {
            bssid: "66:66:66:66:66:66", ssid: "OmniCorp_Secure", channel: "9", encryption: "WPA2", wps: false, password: "OmniAdmin99!",
            clients: [
                { mac: "77:77:77:77:77:77", ip: "10.0.0.5", ports: [22, 80, 443, 3306], type: "Mainframe" },
                { mac: "88:88:88:88:88:88", ip: "10.0.0.12", ports: [80], type: "Workstation" }
            ]
        }
    ]
};

// Mission Definitions
const missions = [
    {
        title: "Mission 1: OpSec First",
        objective: "Spoof your MAC address using the 'macchanger' tool on wlan0.",
        check: () => gameState.mac.is_spoofed
    },
    {
        title: "Mission 2: Reconnaissance",
        objective: "Put your wireless card into monitor mode using 'airmon-ng'.",
        check: () => gameState.interfaces.wlan0mon
    },
    {
        title: "Mission 3: The Weak Link",
        objective: "Run 'wash' to find a WPS-enabled network, then use 'reaver' to attack it.",
        check: () => gameState.flags.reaver_success
    },
    {
        title: "Mission 4: The Handshake",
        objective: "Use airodump-ng to target the 'Cafe_Free_WiFi' network (BSSID: 1A:2B:3C:4D:5E:6F) on its specific channel and write the output to a file named 'cafe'.",
        check: () => gameState.flags.handshake_captured
    },
    {
        title: "Mission 5: CPU Cracking",
        objective: "Use aircrack-ng to crack your captured 'cafe-01.cap' file using the 'rockyou.txt' wordlist located in /root.",
        check: () => gameState.flags.cpu_crack_success
    },
    {
        title: "Mission 6: GPU Acceleration",
        objective: "Modern cracking uses GPUs. We've converted your capture to a hashcat format (cafe.hc22000). Use hashcat -m 22000 to crack it with 'rockyou.txt'.",
        check: () => gameState.flags.gpu_crack_success
    },
    {
        title: "Mission 7: Operation OmniCorp",
        objective: "The target is OmniCorp_Secure. Spoof your MAC, capture the handshake, crack it using the leaked wordlist, connect to the network, use nmap to locate the mainframe, and SSH into it.",
        check: () => gameState.flags.omnicorp_hacked
    },
    {
        title: "Simulation Complete",
        objective: "You have completed all current objectives. Feel free to explore the system.",
        check: () => false
    }
];

// Manuals Database
const manuals = {
    "ls": "NAME\n  ls - list directory contents\n\nSYNOPSIS\n  ls [FILE]...\n\nDESCRIPTION\n  List information about the FILEs (the current directory by default).",
    "cd": "NAME\n  cd - change the shell working directory\n\nSYNOPSIS\n  cd [dir]\n\nDESCRIPTION\n  Change the current directory to DIR. The default DIR is the value of the HOME shell variable.",
    "airmon-ng": "NAME\n  airmon-ng - bash script designed to turn wireless cards into monitor mode.\n\nSYNOPSIS\n  airmon-ng <start|stop|check> <interface> [kill]\n\nDESCRIPTION\n  Used to enable monitor mode on wireless interfaces. 'check kill' will kill interfering processes like NetworkManager.",
    "macchanger": "NAME\n  macchanger - MAC address manipulation utility\n\nSYNOPSIS\n  macchanger [-r|-p|-s] <interface>\n\nDESCRIPTION\n  -r : Set fully random MAC\n  -p : Reset to original, permanent hardware MAC\n  -s : Print the MAC address and exit",
    "airodump-ng": "NAME\n  airodump-ng - a wireless packet capture tool for aircrack-ng\n\nSYNOPSIS\n  airodump-ng [-c channel] [--bssid MAC] [-w file] <interface>\n\nDESCRIPTION\n  Used for packet capturing of raw 802.11 frames. Essential for collecting WPA handshakes.",
    "aireplay-ng": "NAME\n  aireplay-ng - inject packets into a wireless network\n\nSYNOPSIS\n  aireplay-ng -0 <count> -a <bssid> -c <client_mac> <interface>\n\nDESCRIPTION\n  Used to generate traffic for later use in aircrack-ng. The -0 flag initiates a deauthentication attack to force clients to reconnect, capturing their handshake.",
    "aircrack-ng": "NAME\n  aircrack-ng - an 802.11 WEP and WPA-PSK keys cracking program\n\nSYNOPSIS\n  aircrack-ng -w <wordlist> <capture_file.cap>\n\nDESCRIPTION\n  Recovers WPA/WPA2 keys once enough data packets or a valid handshake have been captured.",
    "wash": "NAME\n  wash - identify WPS-enabled access points\n\nSYNOPSIS\n  wash -i <interface>\n\nDESCRIPTION\n  A utility for identifying WPS-enabled access points. It passively listens for beacons and probe responses.",
    "reaver": "NAME\n  reaver - WPS PIN cracking tool\n\nSYNOPSIS\n  reaver -i <interface> -b <bssid> -vv\n\nDESCRIPTION\n  Performs a brute force attack against an access point's WiFi Protected Setup (WPS) PIN to recover the WPA/WPA2 passphrase.",
    "hashcat": "NAME\n  hashcat - advanced password recovery utility\n\nSYNOPSIS\n  hashcat -m 22000 <hashfile> <wordlist>\n\nDESCRIPTION\n  World's fastest and most advanced password recovery utility. Mode 22000 is used for modern WPA/WPA2 PMKID/EAPOL cracking.",
    "mdk4": "NAME\n  mdk4 - wireless network exploitation tool\n\nSYNOPSIS\n  mdk4 <interface> <d|a>\n\nDESCRIPTION\n  d : Deauthentication / Disassociation DoS mode\n  a : Authentication Denial of Service mode",
    "nmap": "NAME\n  nmap - Network exploration tool and security / port scanner\n\nSYNOPSIS\n  nmap <-sn|-sV> <target>\n\nDESCRIPTION\n  -sn : Ping Scan - disable port scan (host discovery)\n  -sV : Probe open ports to determine service/version info",
    "connect": "NAME\n  connect - connect to a wireless network\n\nSYNOPSIS\n  connect <ssid> <password>\n\nDESCRIPTION\n  Authenticates and associates with a wireless network using the provided SSID and password.",
    "ssh": "NAME\n  ssh - OpenSSH SSH client (remote login program)\n\nSYNOPSIS\n  ssh <user>@<ip>\n\nDESCRIPTION\n  ssh is a program for logging into a remote machine and for executing commands on a remote machine."
};

// --- Helpers ---
window.onload = async () => {
    await bootSequence();
    cmdMission(); 
    inputField.focus();
};
document.addEventListener('click', () => inputField.focus());

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const generateMac = () => "XX:XX:XX:XX:XX:XX".replace(/X/g, () => "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16)));

function printLine(text, cssClass = 'output-line') {
    const line = document.createElement('div');
    line.className = cssClass;
    line.textContent = text;
    outputArea.appendChild(line);
    scrollToBottom();
}

function printColorLine(text, color) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.style.color = color;
    line.style.textShadow = `0 0 5px ${color}`;
    line.textContent = text;
    outputArea.appendChild(line);
    scrollToBottom();
}

function scrollToBottom() {
    terminal.scrollTop = terminal.scrollHeight;
}

function getArgValue(args, flag) {
    const index = args.indexOf(flag);
    return (index !== -1 && index + 1 < args.length) ? args[index + 1] : null;
}

function updatePrompt() {
    const displayDir = gameState.current_directory === "/root" ? "~" : gameState.current_directory;
    promptSpan.textContent = `root@kali:${displayDir}#`;
}

// --- Progress Bar Utility ---
function simulateProgress(duration, message, successCallback) {
    return new Promise((resolve, reject) => {
        gameState.process.active = true;
        promptSpan.textContent = ""; 
        inputField.disabled = true;
        
        const line = document.createElement('div');
        line.className = 'output-line';
        outputArea.appendChild(line);
        scrollToBottom();

        const startTime = Date.now();
        const barLength = 30;

        gameState.active_process_interval = setInterval(() => {
            if (!gameState.process.active) {
                clearInterval(gameState.active_process_interval);
                gameState.active_process_interval = null;
                reject(new Error("Aborted by user"));
                return;
            }

            const elapsed = Date.now() - startTime;
            let percent = Math.min(100, (elapsed / duration) * 100);

            const filled = Math.floor((percent / 100) * barLength);
            const empty = barLength - filled;
            
            let barInner = '';
            if (filled === 0) {
                barInner = ' '.repeat(barLength);
            } else if (filled === barLength) {
                barInner = '='.repeat(barLength);
            } else {
                barInner = '='.repeat(filled - 1) + '>' + ' '.repeat(empty);
            }
            
            const bar = `[${barInner}]`;
            line.textContent = `${message} ${bar} ${Math.floor(percent)}%`;

            if (percent >= 100) {
                clearInterval(gameState.active_process_interval);
                gameState.active_process_interval = null;
                
                gameState.process.active = false;
                inputField.disabled = false;
                inputField.focus();
                
                if (successCallback) successCallback();
                resolve();
            }
        }, 100);
    });
}

// --- Boot Sequence ---
async function bootSequence() {
    inputField.disabled = true;
    promptSpan.textContent = "";
    
    const banner = `
   ____  _  _  ____  ____  ____  ____    __    _  _  ___  ____  ___ 
  / ___)( \\/ )(  _ \\(  __)(  _ \\(  _ \\  /__\\  ( \\( )/ __)(  __)/ __)
  \\___ \\ \\  /  ) _ < ) _)  )   / )   / /(__)\\  )  (( (_-. ) _) \\__ \\
  (____/ (__) (____/(____)(_)\\_)(_)\\_)(__)(__)(_)\\_)\\___/(____)(___/
    
    :: Wireless Security Simulation Environment ::
    :: Kernel 5.18.0-kali5-amd64                ::
    `;
    
    printColorLine(banner, "#00ff00");
    await sleep(800);
    printLine("Initializing virtual hardware...");
    await sleep(400);
    printLine("Mounting virtual file system (VFS)... [OK]");
    await sleep(400);
    printLine("Loading mock network database... [OK]");
    await sleep(600);
    printLine("");
    printColorLine("Welcome, Student.", "cyan");
    printLine("Type 'help' to see a list of available commands.");
    printLine("Type 'man <command>' to read the manual for a specific tool.");
    printLine("Type 'mission' to review your current objective.");
    printLine("");
    
    updatePrompt();
    inputField.disabled = false;
}

// --- Global Interrupt Handler (Ctrl + C) ---
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'c') {
        if (gameState.active_process_interval !== null || gameState.process.active) {
            
            if (gameState.active_process_interval !== null) {
                clearInterval(gameState.active_process_interval);
                gameState.active_process_interval = null;
            }
            
            gameState.process.active = false;
            gameState.process.name = null;
            
            printLine("^C", "output-line");
            updatePrompt();
            
            inputField.disabled = false;
            inputField.focus();
        }
    }
});

// --- VFS Path Resolution ---
function resolvePath(currentPath, targetPath) {
    if (!targetPath) return currentPath;
    let parts = targetPath.startsWith('/') ? targetPath.split('/') : currentPath.split('/').concat(targetPath.split('/'));
    let resolved = [];
    for (let part of parts) {
        if (part === '' || part === '.') continue;
        if (part === '..') {
            if (resolved.length > 0) resolved.pop();
        } else {
            resolved.push(part);
        }
    }
    return '/' + resolved.join('/');
}

function getNode(path) {
    if (path === '/' || path === '') return { type: 'dir', content: fileSystem };
    let parts = path.split('/').filter(p => p);
    let current = { type: 'dir', content: fileSystem };
    for (let part of parts) {
        if (current.type !== 'dir' || !current.content[part]) return null;
        current = current.content[part];
    }
    return current;
}

// --- Event Listeners ---
inputField.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const inputVal = inputField.value.trim();
        inputField.value = '';
        
        printLine(`${promptSpan.textContent} ${inputVal}`);

        if (inputVal === 'exit' && gameState.process.active) {
            document.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'c' }));
            return;
        } else if (inputVal !== '') {
            inputField.disabled = true;
            await processCommand(inputVal);
            checkObjectives(); 
            
            if (!gameState.process.active) {
                inputField.disabled = false;
                inputField.focus();
            }
        }
    }
});

// --- Mission System ---
function cmdMission() {
    if (gameState.current_mission >= missions.length) return;
    const m = missions[gameState.current_mission];
    printColorLine("========================================", "cyan");
    printColorLine(` ${m.title} `, "cyan");
    printColorLine(` OBJECTIVE: ${m.objective} `, "cyan");
    printColorLine("========================================", "cyan");
}

function checkObjectives() {
    if (gameState.current_mission >= missions.length) return;

    const m = missions[gameState.current_mission];
    if (m.check()) {
        
        // Check if it's the final mission
        if (m.title.includes("OmniCorp")) {
            triggerWinSequence();
            gameState.current_mission++;
            return;
        }

        // Standard Mission Complete
        printColorLine(`
  _     _______     _______ _       ____ ___  __  __ ____  _     _____ _____ _____ 
 | |   | ____\\ \\   / / ____| |     / ___/ _ \\|  \\/  |  _ \\| |   | ____|_   _| ____|
 | |   |  _|  \\ \\ / /|  _| | |    | |  | | | | |\\/| | |_) | |   |  _|   | | |  _|  
 | |___| |___  \\ V / | |___| |___ | |__| |_| | |  | |  __/| |___| |___  | | | |___ 
 |_____|_____|  \\_/  |_____|_____| \\____\\___/|_|  |_|_|   |_____|_____| |_| |_____|
        `, "yellow");
        printColorLine(`[+] ${m.title} Completed!`, "yellow");
        printLine("");
        
        gameState.current_mission++;
        
        // VFS Pre-loading for Mission 6 (Index 5)
        if (gameState.current_mission === 5) { 
            const currentDirNode = getNode(gameState.current_directory);
            if (currentDirNode && currentDirNode.type === 'dir') {
                currentDirNode.content['cafe.hc22000'] = {
                    type: 'file',
                    bssid: "1A:2B:3C:4D:5E:6F", 
                    data: "[Converted Hashcat Format Data]"
                };
                printColorLine("[SYSTEM] Converted capture file 'cafe.hc22000' has been added to your current directory.", "cyan");
                printLine("");
            }
        }

        if (gameState.current_mission < missions.length) {
            cmdMission();
        }
    }
}

// --- Command Router ---
async function processCommand(input) {
    const args = input.split(/\s+/);
    const cmd = args.shift();

    switch (cmd) {
        case 'clear':
            outputArea.innerHTML = '';
            break;
        case 'help':
            printLine("COMMAND CATEGORIES:");
            printLine("  File System     : pwd, ls, cd, cat, rm");
            printLine("  Reconnaissance  : airmon-ng, macchanger, airodump-ng, wash, kismet, nmap");
            printLine("  Attacks         : aireplay-ng, reaver, mdk4");
            printLine("  Cracking        : aircrack-ng, hashcat");
            printLine("  Post-Exploit    : connect, ssh");
            printLine("  Game            : mission, clear");
            printLine("");
            printLine("Tip: Type 'man <command>' to learn how to use a specific tool.");
            break;
        case 'man':
            if (!args[0]) {
                printLine("What manual page do you want?");
            } else if (manuals && manuals[args[0]]) {
                printLine(manuals[args[0]]);
            } else {
                printLine(`No manual entry for ${args[0]}`);
            }
            break;
        case 'mission':
            if (typeof cmdMission === 'function') cmdMission();
            break;
        case 'pwd':
            printLine(gameState.current_directory);
            break;
        case 'ls':
            cmdLs(args);
            break;
        case 'cd':
            cmdCd(args);
            break;
        case 'cat':
            cmdCat(args);
            break;
        case 'rm':
            cmdRm(args);
            break;
        case 'airmon-ng':
            await cmdAirmonNg(args);
            break;
        case 'macchanger':
            await cmdMacchanger(args);
            break;
        case 'airodump-ng':
            await cmdAirodumpNg(args);
            break;
        case 'aireplay-ng':
            await cmdAireplayNg(args);
            break;
        case 'aircrack-ng':
            await cmdAircrackNg(args);
            break;
        case 'wash':
            await cmdWash(args);
            break;
        case 'reaver':
            await cmdReaver(args);
            break;
        case 'hashcat':
            await cmdHashcat(args);
            break;
        case 'mdk4':
            await cmdMdk4(args);
            break;
        case 'kismet':
            await cmdKismet(args);
            break;
        case 'nmap':
            await cmdNmap(args);
            break;
        case 'connect':
            await cmdConnect(args);
            break;
        case 'ssh':
            await cmdSsh(args);
            break;
        default:
            printLine(`bash: ${cmd}: command not found`);
            break;
    }
}

// --- VFS Commands ---
function cmdLs(args) {
    const targetPath = resolvePath(gameState.current_directory, args[0] || '.');
    const node = getNode(targetPath);
    if (!node) {
        printLine(`ls: cannot access '${args[0]}': No such file or directory`);
        return;
    }
    if (node.type === 'file') {
        printLine(args[0]);
    } else {
        const keys = Object.keys(node.content);
        if (keys.length > 0) {
            printLine(keys.join("  "));
        }
    }
}

function cmdCd(args) {
    const targetPath = resolvePath(gameState.current_directory, args[0] || '/root');
    const node = getNode(targetPath);
    if (!node) {
        printLine(`cd: ${args[0]}: No such file or directory`);
    } else if (node.type !== 'dir') {
        printLine(`cd: ${args[0]}: Not a directory`);
    } else {
        gameState.current_directory = targetPath;
        updatePrompt();
    }
}

function cmdCat(args) {
    if (!args[0]) {
        printLine("Usage: cat <filename>");
        return;
    }
    const targetPath = resolvePath(gameState.current_directory, args[0]);
    const node = getNode(targetPath);
    if (!node) {
        printLine(`cat: ${args[0]}: No such file or directory`);
    } else if (node.type === 'dir') {
        printLine(`cat: ${args[0]}: Is a directory`);
    } else {
        printLine(node.data);
    }
}

function cmdRm(args) {
    if (!args[0]) {
        printLine("rm: missing operand");
        return;
    }
    const targetPath = resolvePath(gameState.current_directory, args[0]);
    if (targetPath === '/') {
        printLine("rm: cannot remove root directory");
        return;
    }
    const parts = targetPath.split('/').filter(p => p);
    const filename = parts.pop();
    const parentPath = '/' + parts.join('/');
    const parentNode = getNode(parentPath);

    if (parentNode && parentNode.content[filename]) {
        if (parentNode.content[filename].type === 'dir') {
            printLine(`rm: cannot remove '${args[0]}': Is a directory`);
        } else {
            delete parentNode.content[filename];
        }
    } else {
        printLine(`rm: cannot remove '${args[0]}': No such file or directory`);
    }
}

// --- Tool Implementations ---

async function cmdAirmonNg(args) {
    if (args[0] === 'check' && args[1] === 'kill') {
        printLine("Killing these processes:");
        printLine("  PID Name");
        printLine("  843 NetworkManager");
        printLine("  901 wpa_supplicant");
        await sleep(500);
    } else if (args[0] === 'start' && args[1] === 'wlan0') {
        printLine("PHY     Interface       Driver          Chipset");
        printLine("phy0    wlan0           ath9k           Atheros AR9271");
        await sleep(500);
        printLine("\t\t(mac80211 monitor mode vif enabled for [phy0]wlan0 on [phy0]wlan0mon)");
        printLine("\t\t(mac80211 station mode vif disabled for [phy0]wlan0)");
        gameState.interfaces.wlan0mon = true;
    } else if (args[0] === 'stop' && args[1] === 'wlan0mon') {
        printLine("PHY     Interface       Driver          Chipset");
        printLine("phy0    wlan0mon        ath9k           Atheros AR9271");
        await sleep(500);
        printLine("\t\t(mac80211 station mode vif enabled on [phy0]wlan0)");
        printLine("\t\t(mac80211 monitor mode vif disabled for [phy0]wlan0mon)");
        gameState.interfaces.wlan0mon = false;
    } else {
        printLine("Usage: airmon-ng <start|stop|check> <interface> [kill]");
    }
}

async function cmdMacchanger(args) {
    const iface = args[args.length - 1];
    if (iface !== 'wlan0' && iface !== 'wlan0mon') {
        printLine("Usage: macchanger [-r|-p|-s] <interface>");
        return;
    }

    if (args.includes('-r')) {
        const newMac = generateMac();
        printLine(`Current MAC:   ${gameState.mac.current_mac} (unknown)`);
        await sleep(300);
        printLine(`Permanent MAC: ${gameState.mac.original_mac} (unknown)`);
        await sleep(300);
        printLine(`New MAC:       ${newMac} (unknown)`);
        gameState.mac.current_mac = newMac;
        gameState.mac.is_spoofed = true;
    } else if (args.includes('-p')) {
        printLine(`Current MAC:   ${gameState.mac.current_mac} (unknown)`);
        await sleep(300);
        printLine(`Permanent MAC: ${gameState.mac.original_mac} (unknown)`);
        await sleep(300);
        printLine(`New MAC:       ${gameState.mac.original_mac} (unknown)`);
        gameState.mac.current_mac = gameState.mac.original_mac;
        gameState.mac.is_spoofed = false;
    } else if (args.includes('-s')) {
        printLine(`Current MAC:   ${gameState.mac.current_mac} (unknown)`);
        printLine(`Permanent MAC: ${gameState.mac.original_mac} (unknown)`);
    } else {
        printLine("Usage: macchanger [-r|-p|-s] <interface>");
    }
}

async function cmdAirodumpNg(args) {
    if (!gameState.interfaces.wlan0mon) {
        printLine("Interface wlan0mon not found.");
        return;
    }

    const channel = getArgValue(args, '-c');
    const bssid = getArgValue(args, '--bssid');
    const write = getArgValue(args, '-w');
    const iface = args[args.length - 1];

    if (iface !== 'wlan0mon') {
        printLine("Usage: airodump-ng [-c channel] [--bssid MAC] [-w file] wlan0mon");
        return;
    }

    gameState.process.active = true;
    gameState.process.name = 'airodump-ng';
    promptSpan.textContent = "";

    let loops = 0;
    let handshakeCaptured = false;

    while (gameState.process.active) {
        outputArea.innerHTML = ''; 
        printLine(` CH ${channel || '1-11'} ][ Elapsed: ${loops * 2} s ][ ${new Date().toISOString().split('T')[1].split('.')[0]} `);
        printLine(" ");
        printLine(" BSSID              PWR  Beacons    #Data, #/s  CH   MB   ENC CIPHER  AUTH ESSID");
        
        let targetNetworks = gameState.networks;
        if (bssid) targetNetworks = targetNetworks.filter(n => n.bssid.toLowerCase() === bssid.toLowerCase());
        if (channel) targetNetworks = targetNetworks.filter(n => n.channel === channel);

        targetNetworks.forEach(n => {
            const pwr = Math.floor(Math.random() * 40) - 80;
            const beacons = loops * 10 + Math.floor(Math.random() * 5);
            const data = loops * 2 + Math.floor(Math.random() * 3);
            printLine(` ${n.bssid}  ${pwr}       ${beacons}        ${data}    0  ${n.channel.padEnd(2)}   54e  ${n.encryption.padEnd(3)} CCMP    PSK  ${n.ssid}`);
        });

        printLine(" ");
        printLine(" BSSID              STATION            PWR   Rate    Lost    Frames  Notes  Probes");
        
        targetNetworks.forEach(n => {
            n.clients.forEach(c => {
                const pwr = Math.floor(Math.random() * 40) - 80;
                const frames = loops * 5 + Math.floor(Math.random() * 10);
                printLine(` ${n.bssid}  ${c.mac}  ${pwr}    1e- 1e     0       ${frames}`);
            });
        });

        if (bssid && write && !handshakeCaptured && loops > 3) {
            printLine(` [ WPA handshake: ${bssid.toUpperCase()} ]`);
            const currentDirNode = getNode(gameState.current_directory);
            if (currentDirNode && currentDirNode.type === 'dir') {
                currentDirNode.content[`${write}-01.cap`] = {
                    type: 'file',
                    bssid: bssid.toUpperCase(),
                    data: `[WPA Handshake Capture Data for ${bssid.toUpperCase()}]`
                };
            }
            handshakeCaptured = true;
            
            // Trigger for Mission 4
            if (write === 'cafe' && bssid.toUpperCase() === "1A:2B:3C:4D:5E:6F") {
                gameState.flags.handshake_captured = true;
            }
            
        } else if (handshakeCaptured) {
            printLine(` [ WPA handshake: ${bssid.toUpperCase()} ]`);
        }

        loops++;
        await sleep(2000);
    }
}

async function cmdAireplayNg(args) {
    if (!gameState.interfaces.wlan0mon) {
        printLine("Interface wlan0mon not found.");
        return;
    }

    const count = getArgValue(args, '-0');
    const bssid = getArgValue(args, '-a');
    const client = getArgValue(args, '-c');

    if (!count || !bssid || !client) {
        printLine("Usage: aireplay-ng -0 <count> -a <bssid> -c <client_mac> wlan0mon");
        return;
    }

    printLine(`Waiting for beacon frame (BSSID: ${bssid}) on channel 6`);
    await sleep(1000);
    
    for (let i = 0; i < parseInt(count); i++) {
        printLine(`Sending 64 directed DeAuth (code 7). STMAC: [${client}] [ ${i+1}|${count} ACKs]`);
        await sleep(500);
    }
}

async function cmdAircrackNg(args) {
    const wordlist = getArgValue(args, '-w');
    const capFile = args[args.length - 1];

    if (!wordlist || !capFile || capFile.startsWith('-')) {
        printLine("Usage: aircrack-ng -w <wordlist> <capture_file.cap>");
        return;
    }

    const wlNode = getNode(resolvePath(gameState.current_directory, wordlist));
    const capNode = getNode(resolvePath(gameState.current_directory, capFile));

    if (!wlNode || wlNode.type !== 'file') {
        printLine(`fopen(${wordlist}) failed: No such file or directory`);
        return;
    }
    if (!capNode || capNode.type !== 'file') {
        printLine(`Opening ${capFile}`);
        printLine(`open failed: No such file or directory`);
        return;
    }

    const targetNet = gameState.networks.find(n => n.bssid.toUpperCase() === capNode.bssid);
    if (!targetNet) {
        printLine("No valid handshakes found in capture file.");
        return;
    }

    printLine(`Opening ${capFile}`);
    await sleep(500);
    printLine("Read 14 packets.");
    printLine("");
    printLine("   #  BSSID              ESSID                     Encryption");
    printLine(`   1  ${targetNet.bssid}  ${targetNet.ssid.padEnd(24)} WPA (1 handshake)`);
    printLine("");
    printLine("Choosing first network as target.");
    await sleep(1000);
    printLine("Reading packets, please wait...");
    await sleep(1000);

    try {
        await simulateProgress(5000, "Testing keys", () => {
            updatePrompt();
            printLine("");
            
            if (wlNode.data.includes(targetNet.password)) {
                printColorLine(`                                 KEY FOUND! [ ${targetNet.password} ]`, "#00ff00");
                printLine("");
                printLine("      Master Key     : 5C 2A 3B 4C 5D 6E 7F 8A 9B 0C 1D 2E 3F 4A 5B 6C");
                printLine("      Transient Key  : 1A 2B 3C 4D 5E 6F 7A 8B 9C 0D 1E 2F 3A 4B 5C 6D");
                
                // Trigger for Mission 5
                if (capFile === 'cafe-01.cap') {
                    gameState.flags.cpu_crack_success = true;
                }
            } else {
                printLine("                                 KEY NOT FOUND");
            }
        });
    } catch (e) {
        // Aborted by Ctrl+C
    }
}

async function cmdWash(args) {
    if (!gameState.interfaces.wlan0mon) {
        printLine("Interface wlan0mon not found.");
        return;
    }

    gameState.process.active = true;
    promptSpan.textContent = "";
    
    printLine("BSSID                  Ch  dBm  WPS  Lck  Vendor    ESSID");
    printLine("--------------------------------------------------------------------------------");

    const printWashLines = () => {
        gameState.networks.filter(n => n.wps).forEach(n => {
            const dbm = Math.floor(Math.random() * 30) - 70;
            printLine(`${n.bssid}  ${n.channel.padEnd(2)}  ${dbm}  2.0  No   Broadcom  ${n.ssid}`);
        });
    };

    printWashLines(); 
    gameState.active_process_interval = setInterval(printWashLines, 3000);
}

async function cmdReaver(args) {
    if (!gameState.interfaces.wlan0mon) {
        printLine("Interface wlan0mon not found.");
        return;
    }

    const bssid = getArgValue(args, '-b');
    if (!bssid || !args.includes('-vv')) {
        printLine("Usage: reaver -i wlan0mon -b <bssid> -vv");
        return;
    }

    const target = gameState.networks.find(n => n.bssid.toLowerCase() === bssid.toLowerCase());
    if (!target || !target.wps) {
        printLine("[!] Failed to associate with " + bssid);
        return;
    }

    printLine(`[+] Waiting for beacon from ${bssid}`);
    await sleep(1000);
    printLine(`[+] Associated with ${bssid} (ESSID: ${target.ssid})`);
    await sleep(1000);

    try {
        await simulateProgress(8000, "Trying PIN...", () => {
            gameState.flags.reaver_success = true; 
            updatePrompt();
            printLine("");
            printLine(`[+] Pin cracked in 8 seconds`);
            printColorLine(`[+] WPS PIN: '${target.pin}'`, "#00ff00");
            printLine(`[+] WPA PSK: '${target.password}'`);
            printLine(`[+] AP SSID: '${target.ssid}'`);
        });
    } catch (e) {
        // Aborted by Ctrl+C
    }
}

async function cmdHashcat(args) {
    const mode = getArgValue(args, '-m');
    const hashfile = args[args.length - 2];
    const wordlist = args[args.length - 1];

    if (mode !== '22000' || !hashfile || !wordlist || hashfile.startsWith('-')) {
        printLine("Usage: hashcat -m 22000 <hashfile> <wordlist>");
        return;
    }

    const wlNode = getNode(resolvePath(gameState.current_directory, wordlist));
    const hashNode = getNode(resolvePath(gameState.current_directory, hashfile));

    if (!wlNode || wlNode.type !== 'file') {
        printLine(`${wordlist}: No such file or directory`);
        return;
    }
    if (!hashNode || hashNode.type !== 'file') {
        printLine(`${hashfile}: No such file or directory`);
        return;
    }

    printLine("hashcat (v6.2.6) starting");
    await sleep(1000);
    printLine("* Device #1: CUDA SDK 11.7, NVIDIA GeForce RTX 3080, 10240/10240 MB");
    await sleep(1000);
    printLine(`Dictionary cache built:`);
    printLine(`* Dictionary: ${wordlist}`);
    await sleep(1000);
    printLine("Approaching final keyspace - workload is safe to bypass.");
    await sleep(1000);

    const targetNet = gameState.networks.find(n => n.bssid.toUpperCase() === hashNode.bssid);
    
    try {
        await simulateProgress(2000, "Cracking Hashes", () => {
            updatePrompt();
            printLine("");
            
            if (targetNet && wlNode.data.includes(targetNet.password)) {
                printLine(`2582a3b4c5d6e7f8a9b0c1d2e3f4a5b6c:${targetNet.bssid.replace(/:/g,'')}:112233aabbcc:${targetNet.ssid}:${targetNet.password}`);
                printLine("");
                printLine("Session..........: hashcat");
                printLine("Status...........: Cracked");
                printLine("Hash.Mode........: 22000 (WPA-PBKDF2-PMKID+EAPOL)");
                printLine("Hash.Target......: " + hashfile);
                printLine("Time.Started.....: " + new Date().toTimeString().split(' ')[0]);
                printLine("Speed.Dev.#1.....:   345.2 kH/s (10.11ms)");
                printLine("Recovered........: 1/1 (100.00%) Digests");
                
                // Trigger for Mission 6
                if (hashfile === 'cafe.hc22000') {
                    gameState.flags.gpu_crack_success = true;
                }
            } else {
                printLine("Session..........: hashcat");
                printLine("Status...........: Exhausted");
                printLine("Hash.Mode........: 22000 (WPA-PBKDF2-PMKID+EAPOL)");
                printLine("Hash.Target......: " + hashfile);
                printLine("Recovered........: 0/1 (0.00%) Digests");
            }
        });
    } catch (e) {
        // Aborted by Ctrl+C
    }
}

async function cmdMdk4(args) {
    if (!gameState.interfaces.wlan0mon) {
        printLine("Interface wlan0mon not found.");
        return;
    }

    const mode = args[1];
    if (mode !== 'd' && mode !== 'a') {
        printLine("Usage: mdk4 wlan0mon <d|a>");
        return;
    }

    gameState.process.active = true;
    promptSpan.textContent = "";

    if (mode === 'd') {
        printLine("Starting Deauthentication / Disassociation DoS Mode");
        gameState.active_process_interval = setInterval(() => {
            printLine(`Sending Deauth to broadcast MAC from spoofed AP ${generateMac()}`);
        }, 300);
    } else if (mode === 'a') {
        printLine("Starting Authentication Denial of Service Mode");
        gameState.active_process_interval = setInterval(() => {
            printLine(`Connecting to AP ${generateMac()} with fake client ${generateMac()}... AP unresponsive`);
        }, 200);
    }
}

async function cmdKismet(args) {
    if (!gameState.interfaces.wlan0mon) {
        printLine("Interface wlan0mon not found.");
        return;
    }
    
    gameState.process.active = true;
    promptSpan.textContent = "";
    printLine("Starting Kismet... (Press Ctrl+C to stop)");
    
    gameState.active_process_interval = setInterval(() => {
        const types = ["WiFi", "Bluetooth", "BLE"];
        const type = types[Math.floor(Math.random() * types.length)];
        const mac = generateMac();
        const rssi = Math.floor(Math.random() * -60) - 30;
        printLine(`[KISMET] Discovered new device: ${mac} | Type: ${type} | Signal: ${rssi}dBm`);
    }, 1500);
}

async function cmdNmap(args) {
    const flag = args[0];
    const target = args[1];

    if (!flag || !target) {
        printLine("Usage: nmap <-sn|-sV> <target>");
        return;
    }

    printLine(`Starting Nmap 7.93 ( https://nmap.org ) at ${new Date().toISOString()}`);
    await sleep(1500);

    if (flag === '-sn') {
        let found = 0;
        const subnetBase = target.split('.').slice(0, 3).join('.');

        for (const net of gameState.networks) {
            for (const client of net.clients) {
                if (client.ip.startsWith(subnetBase)) {
                    printLine(`Nmap scan report for ${client.ip}`);
                    printLine(`Host is up (${(Math.random() * 0.05).toFixed(4)}s latency).`);
                    printLine(`MAC Address: ${client.mac} (${client.type || 'Unknown'})`);
                    printLine("");
                    found++;
                    await sleep(500);
                }
            }
        }
        printLine(`Nmap done: 256 IP addresses (${found} hosts up) scanned in 2.45 seconds`);
        
    } else if (flag === '-sV') {
        let targetClient = null;
        for (const net of gameState.networks) {
            const c = net.clients.find(c => c.ip === target);
            if (c) targetClient = c;
        }

        if (!targetClient) {
            printLine(`Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn`);
            printLine(`Nmap done: 1 IP address (0 hosts up) scanned in 3.02 seconds`);
            return;
        }

        printLine(`Nmap scan report for ${targetClient.ip}`);
        printLine(`Host is up (${(Math.random() * 0.05).toFixed(4)}s latency).`);
        printLine(`Not shown: ${1000 - targetClient.ports.length} closed tcp ports (reset)`);
        printLine(`PORT     STATE SERVICE VERSION`);
        
        for (const port of targetClient.ports) {
            let service = "unknown";
            let version = "";
            if (port === 22) { service = "ssh"; version = "OpenSSH 8.2p1 Ubuntu 4ubuntu0.5"; }
            if (port === 80) { service = "http"; version = "Apache httpd 2.4.41"; }
            if (port === 443) { service = "https"; version = "nginx 1.18.0"; }
            if (port === 445) { service = "microsoft-ds"; version = "Samba smbd 4.6.2"; }
            if (port === 3306) { service = "mysql"; version = "MySQL 5.7.33"; } 
            if (port === 3389) { service = "ms-wbt-server"; version = "Microsoft Terminal Services"; }
            if (port === 8080) { service = "http-proxy"; version = "Werkzeug/2.0.2 Python/3.9.2"; }
            
            printLine(`${port.toString().padEnd(8)} open  ${service.padEnd(7)} ${version}`);
            await sleep(400);
        }
        printLine("");
        printLine(`MAC Address: ${targetClient.mac} (${targetClient.type || 'Unknown'})`);
        printLine(`Nmap done: 1 IP address (1 host up) scanned in 12.45 seconds`);
    } else {
        printLine("Unrecognized flag. Use -sn or -sV.");
    }
}

async function cmdConnect(args) {
    const ssid = args[0];
    const password = args[1];

    if (!ssid || !password) {
        printLine("Usage: connect <ssid> <password>");
        return;
    }

    const target = gameState.networks.find(n => n.ssid === ssid);
    if (!target) {
        printLine(`Network '${ssid}' not found in range.`);
        return;
    }

    if (target.password !== password) {
        printLine("Authentication failed: Incorrect password.");
        return;
    }

    printLine(`Authenticating to ${ssid}...`);
    await sleep(1000);
    printLine("Associating...");
    await sleep(1000);
    
    gameState.connected_network = target;
    printColorLine(`Successfully associated with ${ssid}. DHCP IP assigned: 10.0.0.101`, "#00ff00");
}

async function cmdSsh(args) {
    const target = args[0];
    if (!target || !target.includes('@')) {
        printLine("Usage: ssh <user>@<ip>");
        return;
    }

    const [user, ip] = target.split('@');
    
    if (!gameState.connected_network) {
        printLine(`ssh: connect to host ${ip} port 22: Network is unreachable`);
        return;
    }
    
    if (ip === "10.0.0.5" && gameState.connected_network.ssid === "OmniCorp_Secure") {
        printLine(`Connecting to ${ip}...`);
        await sleep(1000);
        
        printLine(`${user}@${ip}'s password: `);
        await sleep(1500); 
        
        if (user === "root") {
            printColorLine("Access Granted.", "#00ff00");
            await sleep(500);
            printLine("Last login: Wed Oct 25 10:14:22 2023 from 10.0.0.2");
            printLine("OmniCorp Mainframe OS v9.1.1");
            gameState.flags.omnicorp_hacked = true; 
        } else {
            printLine("Permission denied. Root access required for mainframe control.");
        }
    } else {
        printLine(`ssh: connect to host ${ip} port 22: Connection refused`);
    }
}

async function triggerWinSequence() {
    inputField.disabled = true;
    promptSpan.textContent = "";
    await sleep(1000);
    
    outputArea.innerHTML = ''; 
    
    const winArt = `
 __  __  ____  __  __    _    _  ____  _  _    _  _  __  __  __  __  
(  )(  )(  _ \\(  )(  )  ( \\/\\/ )(  _ \\( \\( )  ( \\/ )(  )(  )(  )(  ) 
 )(__)(  )___/ )(__)(    )    (  )(_) ))  (    \\  /  )(__)(  )(__)(  
(______) (__) (______)  (__/\\__)(____/(_)\\_)   (__) (______)(______) 
    
    [ SYSTEM COMPROMISED ]
    [ MAINFRAME CONTROL SECURED ]
    `;
    
    printColorLine(winArt, "#00ff00");
    await sleep(2000);
    
    const credits = [
        "Congratulations, Student.",
        "You have successfully navigated the Wireless Security Simulation.",
        "You demonstrated proficiency in:",
        "- Operational Security (MAC Spoofing)",
        "- Passive Reconnaissance (Monitor Mode & Packet Sniffing)",
        "- Active Attacks (Deauthentication & WPS Brute-forcing)",
        "- Cryptographic Cracking (CPU & GPU Hash Cracking)",
        "- Post-Exploitation (Network Mapping & SSH)",
        "",
        "Remember: With great power comes great responsibility.",
        "Always ensure you have explicit, written permission before testing real networks.",
        "",
        "Simulation Terminated."
    ];

    for (let line of credits) {
        printColorLine(line, "cyan");
        await sleep(1200);
    }
}
