# 💻 Retro Hacker Terminal: Wireless Security Simulator

A web-based, interactive terminal simulation designed to teach the fundamentals of wireless network security and penetration testing. Built entirely with HTML, CSS, and vanilla JavaScript, this project provides a safe, gamified environment for students to practice using industry-standard cybersecurity tools without the need for virtual machines or physical wireless adapters.

![Terminal Preview](https://via.placeholder.com/800x400.png?text=Add+a+screenshot+of+your+terminal+here!)

## ⚠️ Disclaimer
**This is a purely visual simulation.** This application does not interact with your computer's actual network hardware, nor does it send real packets over the air. It is designed strictly for educational purposes to teach the theory and command syntax of wireless security auditing. Always ensure you have explicit, written permission before testing real networks.

## ✨ Features

* **Authentic Retro Aesthetic:** Deep black background, neon-green monospace font, glowing text shadows, and a CSS-based CRT scanline overlay.
* **Virtual File System (VFS):** Navigate a simulated Linux directory structure using standard commands (`cd`, `ls`, `pwd`, `cat`, `rm`).
* **Gamified Mission System:** A built-in curriculum guides users through Operational Security, Reconnaissance, Active Attacks, and a final Capstone Scenario.
* **Asynchronous Execution:** Heavy computational tasks (like password cracking) feature simulated progress bars that lock the terminal.
* **Global Interrupts:** Fully functional `Ctrl + C` handling to abort continuous processes or progress bars, just like a real Linux terminal.
* **Mock Network Database:** Dynamically generates targets, BSSIDs, connected clients, and simulated vulnerabilities.

## 🛠️ Simulated Tools

The terminal includes a custom command parser that mimics the behavior, flags, and output of the following real-world tools:

### Reconnaissance & OpSec
* `macchanger` - Spoof your MAC address.
* `airmon-ng` - Enable monitor mode on your wireless interface.
* `airodump-ng` - Capture raw 802.11 frames and WPA handshakes.
* `wash` - Identify WPS-enabled access points.
* `kismet` - Passively discover WiFi and Bluetooth devices.
* `nmap` - Perform ping sweeps and port scans on connected networks.

### Attacks & Cracking
* `aireplay-ng` - Inject packets (Deauthentication attacks).
* `reaver` - Brute-force WPS PINs.
* `aircrack-ng` - CPU-based WPA/WPA2 dictionary cracking.
* `hashcat` - High-speed GPU-based hash cracking.
* `mdk4` - Wireless DoS attacks (Deauth and Auth floods).

### Post-Exploitation
* `connect` - Associate with a compromised network.
* `ssh` - Secure shell into simulated target mainframes.

## 🚀 Getting Started

Because this project is built with vanilla web technologies, there are no dependencies, build steps, or servers required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/retro-hacker-terminal.git
