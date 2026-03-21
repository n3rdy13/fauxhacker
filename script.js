<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <title>Faux Hacker</title>
    <link rel="stylesheet" href="./style.css">

  </head>
    
  <body>
  <!-- CRT Scanline Overlay -->
<div class="scanlines"></div>
<!-- Bootcamp Briefing Overlay -->
<div id="bootcamp-modal">
  <div class="bootcamp-content">
    <h1>[ SYSTEM PRE-FLIGHT BRIEFING ]</h1>
    <p>Welcome, Recruit. Before you are granted access to the terminal, you must review the operational basics.</p>
    
    <div class="module">
      <h3>MODULE 1: The Terminal</h3>
      <p>Forget the mouse. In this environment, you speak directly to the machine using the Command Line Interface (CLI). You will type commands to navigate, scan, and execute tools.</p>
    </div>

    <div class="module">
      <h3>MODULE 2: Digital Fingerprints</h3>
      <p>Every network card has a permanent, physical serial number called a MAC address. If you attack with your real MAC, you leave a footprint. <strong>Always spoof your MAC address before an engagement.</strong></p>
    </div>

    <div class="module">
      <h3>MODULE 3: Invisible Radios</h3>
      <p>Normally, your WiFi card only listens to data meant for you. By putting it into <strong>Monitor Mode</strong>, you take the blinders off and can see every invisible data packet flying through the air around you.</p>
    </div>

    <div class="module">
      <h3>MODULE 4: The Secret Handshake</h3>
      <p>Devices don't shout passwords through the air. They use a cryptographic "Handshake" to prove they know the password. If you capture this handshake, you can take it offline and use a wordlist to crack the password.</p>
    </div>

    <div class="survival-guide">
      <h3>--- TERMINAL SURVIVAL GUIDE (CRITICAL) ---</h3>
      <ul>
        <li><strong>[ Ctrl + C ] : The Escape Hatch.</strong> If a tool (like wash or airodump-ng) runs forever and you can't type, press Ctrl+C to stop the process and get your prompt back.</li>
        <li><strong>[ Up / Down Arrows ] : Command History.</strong> Don't type the same long command twice. Use the up arrow to bring back your last typed command.</li>
        <li><strong>[ Tab ] : Autocomplete.</strong> Start typing a file name (like 'rock') and press Tab to auto-complete it to 'rockyou.txt'.</li>
      </ul>
    </div>

    <div class="bootcamp-footer">
      <p class="blink-text">> PRESS [ ENTER ] TO ACKNOWLEDGE AND BOOT SYSTEM <</p>
    </div>
  </div>
</div>
<!-- Main Terminal Window -->
<div id="terminal">
  <div id="output">
    <div class="output-line">Kali GNU/Linux Rolling (tty1)</div>
    <div class="output-line">Welcome to the Wireless Security Simulation Environment.</div>
    <div class="output-line">Type a command to begin...</div>
    <br>
  </div>
  
  <!-- Active Input Area -->
  <div class="input-line">
    <span class="prompt">root@kali:~#</span>
    <input type="text" id="command-input" autocomplete="off" spellcheck="false" autofocus>
  </div>
</div>
    <script  src="./script.js"></script>

  </body>
  
</html>
