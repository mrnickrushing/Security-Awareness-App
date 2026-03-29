import React, { useMemo, useState } from "react";

const threatItems = [
  // ── Email & Phishing ──────────────────────────────────────────────────────
  {
    id: 1,
    title: "Phishing Basics",
    category: "Email Security",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Phishing messages impersonate trusted senders to trick users into clicking malicious links, opening harmful attachments, or surrendering credentials.",
    signs: [
      "Urgent language or threats of account suspension",
      "Sender address that does not match the displayed name",
      "Unexpected links or attachments",
      "Requests for login credentials or payment info",
      "Generic greetings like Dear Customer",
    ],
    prevention: [
      "Verify the sender's full email address carefully",
      "Hover over links before clicking to preview the destination",
      "Use trusted bookmarks for important logins",
      "Report suspicious email to IT or security",
      "Never open unexpected attachments without verification",
    ],
    realWorldExample:
      "Attackers impersonated Microsoft in a large campaign sending fake account-locked emails. Victims who clicked were redirected to convincing login pages that harvested credentials in real time.",
  },
  {
    id: 2,
    title: "Spear Phishing",
    category: "Email Security",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Spear phishing targets specific individuals using personal details gathered from social media, LinkedIn, or data breaches to make the attack far more convincing than generic phishing.",
    signs: [
      "Email references your name, role, or recent activity accurately",
      "Message appears to come from a known colleague or vendor",
      "Request is plausible but slightly outside normal process",
      "Link domain is close but not quite right",
    ],
    prevention: [
      "Be skeptical even of emails that seem personally addressed",
      "Verify unusual requests through a second channel",
      "Limit personal information publicly visible on LinkedIn",
      "Check the full sender domain even when the display name looks correct",
    ],
    realWorldExample:
      "Attackers researched a finance manager's LinkedIn connections and sent a convincing wire request appearing to come from a real vendor contact. The carefully personalized message bypassed initial suspicion.",
  },
  {
    id: 3,
    title: "Business Email Compromise",
    category: "Email Security",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "BEC attacks impersonate executives, vendors, or finance staff to request wire transfers, gift cards, or account changes by abusing trust and bypassing normal approval flows.",
    signs: [
      "Urgent payment or transfer requests from leadership",
      "Last-minute bank detail changes from a vendor",
      "Requests to bypass the normal approval or review process",
      "Reply-to address that differs from the From address",
    ],
    prevention: [
      "Always confirm financial requests through a second channel",
      "Follow established approval workflows without exception",
      "Watch for display name spoofing and check the full address",
      "Treat all account or payment changes as high-risk events",
    ],
    realWorldExample:
      "A finance employee received a convincing email appearing to come from the CFO requesting an urgent wire transfer. The domain differed by one character. Over $200,000 was transferred before the fraud was detected.",
  },
  {
    id: 4,
    title: "Whaling Attacks",
    category: "Email Security",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Whaling is spear phishing aimed specifically at executives and senior leadership. Attackers invest significant effort crafting messages that appear to come from boards, regulators, or legal teams.",
    signs: [
      "Legal, regulatory, or board-level urgency in the message",
      "Request for confidential data or financial authorization",
      "Communication channel slightly different from normal",
      "Pressure to act before consulting others",
    ],
    prevention: [
      "Establish out-of-band verification for all executive-level requests",
      "Train executives specifically on whaling tactics",
      "Implement dual authorization for high-value transactions",
      "Verify any legal or regulatory notice through official channels",
    ],
    realWorldExample:
      "A CEO received a convincing email appearing to be from their company's law firm requesting immediate wire payment for a confidential acquisition. The attacker had monitored the CEO's public announcements to time the attack perfectly.",
  },
  {
    id: 5,
    title: "Email Spoofing and Header Forgery",
    category: "Email Security",
    severity: "Medium",
    relatedScenario: "phishing",
    summary:
      "Email spoofing forges the From address to make a message appear to come from a trusted source. Without proper email authentication like SPF, DKIM, and DMARC, spoofed messages can reach inboxes looking completely legitimate.",
    signs: [
      "From address matches a trusted domain but the email feels unusual",
      "Reply-to address is different from the sender address",
      "Message passes visual inspection but the request is out of character",
      "Email headers show unexpected sending servers",
    ],
    prevention: [
      "Check full email headers when a message seems suspicious",
      "Confirm unexpected requests by phone using a known number",
      "Ensure your organization has SPF, DKIM, and DMARC configured",
      "Do not rely on the display name alone to trust a sender",
    ],
    realWorldExample:
      "Attackers spoofed a well-known payroll vendor's domain to send fake direct deposit change requests to HR teams across multiple companies. Many requests were processed before the fraud was identified.",
  },

  // ── Identity & Credentials ─────────────────────────────────────────────────
  {
    id: 6,
    title: "Credential Theft and Account Takeover",
    category: "Identity Protection",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Attackers steal usernames and passwords through fake portals, account reset tricks, or reused credentials from other breaches and then use them to access corporate systems.",
    signs: [
      "Unexpected login prompts or account alerts",
      "Password reset messages you did not request",
      "Unfamiliar or slightly misspelled sign in pages",
      "Alerts for unknown account activity or logins from new locations",
    ],
    prevention: [
      "Use strong unique passwords for every account",
      "Enable MFA on all critical accounts",
      "Type important site addresses directly or use bookmarks",
      "Never enter credentials after clicking a suspicious link",
    ],
    realWorldExample:
      "A major breach exposed over 100 million credentials from a social platform. Attackers used automated tools to test those passwords against corporate VPNs and email portals.",
  },
  {
    id: 7,
    title: "Credential Stuffing",
    category: "Identity Protection",
    severity: "High",
    relatedScenario: "authentication",
    summary:
      "Credential stuffing uses large lists of username and password combinations leaked from previous breaches and automatically tests them against other services where users reused the same credentials.",
    signs: [
      "Unusual login alerts from unfamiliar locations",
      "Account locked notifications you did not trigger",
      "Unexpected password reset emails",
      "Unfamiliar activity in your account history",
    ],
    prevention: [
      "Never reuse passwords across different services",
      "Use a password manager to generate unique credentials",
      "Enable MFA so stolen passwords alone are not enough",
      "Monitor haveibeenpwned.com for breached accounts",
    ],
    realWorldExample:
      "Following a breach of a streaming service exposing 50 million credentials, attackers ran automated tools against banking and corporate portals. Thousands of accounts with reused passwords were compromised within hours.",
  },
  {
    id: 8,
    title: "Password Spraying",
    category: "Identity Protection",
    severity: "High",
    relatedScenario: "authentication",
    summary:
      "Password spraying tries a small number of commonly used passwords against a large number of accounts to avoid triggering lockout policies. Unlike brute force it is slow and deliberate.",
    signs: [
      "Multiple failed login attempts spread across many accounts",
      "Authentication failures at unusual hours",
      "Lockouts across different users at similar times",
      "Login attempts from a single IP across many accounts",
    ],
    prevention: [
      "Enforce MFA to make stolen passwords insufficient on their own",
      "Ban common passwords through your identity provider policy",
      "Monitor for distributed login failure patterns",
      "Implement conditional access policies based on location and device",
    ],
    realWorldExample:
      "A nation-state group used password spraying against a major email provider targeting thousands of accounts with only a handful of common passwords. Hundreds of government and contractor accounts were compromised.",
  },

  // ── Authentication ─────────────────────────────────────────────────────────
  {
    id: 9,
    title: "MFA Fatigue Attacks",
    category: "Authentication",
    severity: "High",
    relatedScenario: "mfa_fatigue",
    summary:
      "When attackers already have a password they may repeatedly send MFA push requests hoping the user accepts one out of frustration, confusion, or habit.",
    signs: [
      "Multiple unexpected MFA approval prompts in a short period",
      "Push notifications at unusual hours",
      "Prompts from unfamiliar device names or locations",
      "Feeling overwhelmed or annoyed by repeated alerts",
    ],
    prevention: [
      "Always deny unexpected MFA prompts and change your password immediately",
      "Use number-matching MFA which requires matching a code to approve",
      "Report repeated unsolicited prompts to your IT security team",
      "Never approve a prompt just to stop the notifications",
    ],
    realWorldExample:
      "In a high-profile breach an attacker sent an employee over 100 MFA push requests over two hours. The employee eventually approved one to make them stop, granting full access to internal systems.",
  },
  {
    id: 10,
    title: "Password Hygiene",
    category: "Authentication",
    severity: "Medium",
    relatedScenario: "authentication",
    summary:
      "Weak or reused passwords dramatically lower the barrier for account takeover, especially when combined with breached credential databases and automated attack tools.",
    signs: [
      "Same password used across multiple services",
      "Passwords based on predictable patterns like names or dates",
      "Shared credentials between team members",
      "Unprotected or unsecured account recovery methods",
    ],
    prevention: [
      "Use a password manager to generate and store unique credentials",
      "Never reuse passwords across different services",
      "Enable MFA everywhere it is supported",
      "Protect account recovery email and phone with strong unique credentials",
    ],
    realWorldExample:
      "A breach of a gaming platform exposed 77 million accounts. Many users had reused those passwords on work email and VPN accounts, allowing attackers to break into corporate systems using the leaked data.",
  },
  {
    id: 11,
    title: "Session Hijacking and Cookie Theft",
    category: "Authentication",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "After a user authenticates, their session token or cookie can be stolen to impersonate them without needing their password or MFA code. This is increasingly used to bypass MFA entirely.",
    signs: [
      "Account activity showing logins from unexpected locations shortly after your own",
      "Sessions appearing in your account that you did not create",
      "Logout events you did not trigger",
      "Access to cloud services from unusual devices",
    ],
    prevention: [
      "Use phishing-resistant MFA such as hardware security keys",
      "Enable session anomaly detection in your identity provider",
      "Log out of sensitive services when done rather than staying signed in",
      "Keep browsers and OS updated to patch cookie handling vulnerabilities",
    ],
    realWorldExample:
      "Attackers used an adversary-in-the-middle phishing kit to steal authenticated session cookies from employees. With the cookie they bypassed MFA entirely and accessed cloud email and file storage within minutes.",
  },

  // ── Mobile & SMS ───────────────────────────────────────────────────────────
  {
    id: 12,
    title: "Smishing and Mobile Safety",
    category: "Mobile Security",
    severity: "Medium",
    relatedScenario: "smishing",
    summary:
      "Smishing uses SMS text messages to lure users into clicking fake delivery, banking, or account alert links on phones where users are more likely to act quickly without scrutiny.",
    signs: [
      "Shortened or unfamiliar URLs in text messages",
      "Delivery alerts for packages you were not expecting",
      "Messages from unknown short codes or numbers",
      "Pressure to act immediately or face consequences",
    ],
    prevention: [
      "Do not tap suspicious links in text messages",
      "Use official carrier or delivery apps directly",
      "Block and report suspicious numbers",
      "Keep your mobile OS and apps updated",
    ],
    realWorldExample:
      "A smishing campaign targeted thousands of mobile users with fake USPS delivery failure texts. Victims who tapped the link were sent to a fake USPS page designed to collect name, address, and credit card data.",
  },
  {
    id: 13,
    title: "Mobile Malware and Malicious Apps",
    category: "Mobile Security",
    severity: "High",
    relatedScenario: "smishing",
    summary:
      "Malicious apps, sideloaded software, and trojanized legitimate apps can steal credentials, record keystrokes, access contacts, or enable remote control of a device.",
    signs: [
      "App requests excessive permissions unrelated to its function",
      "Battery draining unusually fast after installing a new app",
      "Data usage spiking without explanation",
      "App installed from outside official app stores",
    ],
    prevention: [
      "Only install apps from official app stores",
      "Review permissions carefully before installing any app",
      "Keep your mobile OS patched and updated",
      "Use mobile device management software on work phones",
    ],
    realWorldExample:
      "A trojanized version of a popular flashlight app was found in third-party app stores. Once installed it silently harvested banking credentials and contact lists from over 10 million devices.",
  },
  {
    id: 14,
    title: "SIM Swapping",
    category: "Mobile Security",
    severity: "High",
    relatedScenario: "vishing",
    summary:
      "SIM swapping convinces a mobile carrier to transfer a victim's phone number to an attacker-controlled SIM. Once successful the attacker receives all calls and SMS including MFA codes.",
    signs: [
      "Suddenly losing mobile signal without explanation",
      "Unable to make calls or send texts unexpectedly",
      "Receiving notification that your SIM or number has changed",
      "Account alerts for logins you did not make",
    ],
    prevention: [
      "Set a SIM PIN or port freeze with your mobile carrier",
      "Use authenticator apps or hardware keys instead of SMS for MFA",
      "Add extra account security questions with your carrier",
      "Monitor for unexpected loss of mobile service",
    ],
    realWorldExample:
      "An attacker called a telecom support line, posed as a legitimate customer using public social media data for verification, and convinced the agent to transfer the target's phone number. All MFA codes then went to the attacker.",
  },

  // ── Voice ──────────────────────────────────────────────────────────────────
  {
    id: 15,
    title: "Vishing and Phone Scams",
    category: "Voice Security",
    severity: "High",
    relatedScenario: "vishing",
    summary:
      "Vishing attackers use phone calls or voicemail to pressure users into sharing MFA codes, passwords, or sensitive information by impersonating IT support, banks, or government agencies.",
    signs: [
      "Caller urgently requests one-time passcodes or verification codes",
      "Threats of account suspension or legal action",
      "Caller asks you to ignore normal procedures for speed",
      "Spoofed caller ID that looks like your IT desk or bank",
    ],
    prevention: [
      "Hang up and call back using the official number you already know",
      "Never share MFA or account recovery codes over the phone",
      "Verify IT support requests through your internal ticketing system",
      "Report suspicious callers to your security team",
    ],
    realWorldExample:
      "Attackers called employees of a major tech firm claiming to be IT support and convinced several into providing their MFA codes, allowing account takeover within minutes of each call.",
  },
  {
    id: 16,
    title: "AI Voice Cloning and Deepfakes",
    category: "Voice Security",
    severity: "High",
    relatedScenario: "vishing",
    summary:
      "AI can now replicate a person's voice from just a few minutes of public audio. Attackers use cloned voices to authorize financial transactions or request sensitive access, bypassing normal skepticism because the voice sounds completely genuine.",
    signs: [
      "Voice call or voicemail authorizing an unusual financial action",
      "Caller unavailable for callback or immediate follow-up",
      "Urgency combined with a secrecy request or bypass of normal process",
      "Request involves money, credentials, or sensitive data",
    ],
    prevention: [
      "Establish a verbal code word with your team for sensitive authorizations",
      "Always call back on a known number to verify high-stakes requests",
      "Treat voice alone as insufficient authorization for financial actions",
      "Report any suspicious voice-based requests to security immediately",
    ],
    realWorldExample:
      "A finance manager at a multinational firm received a deepfake audio call from what sounded exactly like the CFO requesting an urgent transfer. The voice was synthesized from publicly available earnings call recordings.",
  },

  // ── Physical ───────────────────────────────────────────────────────────────
  {
    id: 17,
    title: "USB Baiting and Physical Security",
    category: "Physical Security",
    severity: "High",
    relatedScenario: "usb_baiting",
    summary:
      "Unknown USB devices and physical access shortcuts can introduce malware, allow data exfiltration, or grant unauthorized network access the moment they are plugged in.",
    signs: [
      "Unlabeled or intriguingly labeled USB drives found in common areas",
      "Tailgating through secure doors behind authorized staff",
      "Unattended or unlocked workstations in shared spaces",
      "Visitors moving through restricted areas unescorted",
    ],
    prevention: [
      "Never plug in a USB drive found in a public or shared space",
      "Challenge or report individuals attempting to tailgate",
      "Lock your workstation every time you step away",
      "Turn found devices in to security or IT without connecting them",
    ],
    realWorldExample:
      "Security researchers dropped hundreds of USB drives in corporate parking lots. Over 45 percent were plugged in by employees within hours, allowing simulated malware execution on company devices.",
  },
  {
    id: 18,
    title: "Tailgating and Piggybacking",
    category: "Physical Security",
    severity: "Medium",
    relatedScenario: "usb_baiting",
    summary:
      "Tailgating occurs when an unauthorized person follows an authorized employee through a secured door. It is one of the simplest ways to gain physical access to restricted areas without any technical skill.",
    signs: [
      "Someone following closely as you badge through a secured door",
      "Visitor without a visible badge in a restricted area",
      "Person who seems lost or asks unusual questions about the building layout",
      "Someone holding a door open for a group without badging themselves",
    ],
    prevention: [
      "Never hold a secure door open for someone you do not recognize",
      "Politely challenge anyone without a visible badge in restricted areas",
      "Report suspicious individuals to facilities or security immediately",
      "Badge-in turnstiles and mantrap entries prevent tailgating by design",
    ],
    realWorldExample:
      "A penetration tester gained access to a secure data center simply by carrying boxes and waiting for an employee to hold the door. No badge or credentials were needed at any point.",
  },
  {
    id: 19,
    title: "Shoulder Surfing and Eavesdropping",
    category: "Physical Security",
    severity: "Medium",
    relatedScenario: "authentication",
    summary:
      "Shoulder surfing involves physically observing someone's screen or keyboard to steal passwords, PINs, or sensitive data. It is common in airports, cafes, public transport, and open-plan offices.",
    signs: [
      "Someone positioned unusually close behind you in a public space",
      "Individual appearing to observe your screen rather than their own device",
      "Conversations about sensitive topics in public or shared spaces",
    ],
    prevention: [
      "Use a privacy screen filter on laptops in public",
      "Position yourself with your back to a wall when working in public spaces",
      "Avoid discussing sensitive topics in public places",
      "Lock your screen immediately when stepping away",
    ],
    realWorldExample:
      "A security researcher demonstrated capturing the login credentials of multiple travelers at an airport by simply sitting nearby and observing screens. No technical tools were needed at any point.",
  },

  // ── Web & Browsing ─────────────────────────────────────────────────────────
  {
    id: 20,
    title: "Safe Browsing and QR Code Risks",
    category: "Web Security",
    severity: "Medium",
    relatedScenario: "phishing",
    summary:
      "Fake websites, typosquatted domains, and malicious QR codes redirect users to credential harvesting pages or malware delivery sites that closely mimic legitimate services.",
    signs: [
      "Domain names with small spelling differences from real sites",
      "QR codes posted in unexpected locations or sent via messages",
      "Login pages that opened from a link rather than your bookmark",
      "Site design that looks close but has minor inconsistencies",
    ],
    prevention: [
      "Use bookmarks for important services rather than clicking links",
      "Preview QR code destinations before opening them",
      "Be cautious with QR codes in public places or unsolicited messages",
      "Verify the full URL is correct before entering any credentials",
    ],
    realWorldExample:
      "Attackers placed fake QR code stickers over legitimate parking meter payment codes in several cities. Drivers who scanned them were sent to fake payment portals that collected card data.",
  },
  {
    id: 21,
    title: "Drive-By Downloads and Malvertising",
    category: "Web Security",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Drive-by downloads silently install malware when a user visits a compromised or malicious website. Malvertising injects malicious code into legitimate ad networks so even trusted sites can deliver attacks.",
    signs: [
      "Unexpected file downloads triggered automatically when visiting a page",
      "Browser prompts to install plugins or update software from a website",
      "System slowdown immediately after visiting an unfamiliar page",
      "Antivirus alerts triggered by web activity",
    ],
    prevention: [
      "Keep browsers and plugins such as PDF readers fully updated",
      "Use an ad blocker on untrusted sites",
      "Enable click-to-play for browser plugins",
      "Report unexpected downloads to IT immediately",
    ],
    realWorldExample:
      "A malvertising campaign injected malicious JavaScript into banner ads served by a major ad network. Visitors to reputable news sites were silently redirected to exploit kits that installed ransomware without any user interaction.",
  },
  {
    id: 22,
    title: "Typosquatting and Lookalike Domains",
    category: "Web Security",
    severity: "Medium",
    relatedScenario: "phishing",
    summary:
      "Typosquatting registers domains that closely resemble legitimate ones with subtle differences such as extra letters, character swaps, or different TLDs. Victims who mistype or click a lookalike link land on attacker-controlled pages.",
    signs: [
      "URL that looks right at a glance but has an extra character or different TLD",
      "Login page that feels slightly off compared to the real site",
      "Link sent via email that resolves to an unfamiliar IP or server",
      "Certificate issued to an unknown organization on a familiar-looking site",
    ],
    prevention: [
      "Bookmark all sites you regularly log in to",
      "Check the full domain carefully before entering credentials",
      "Use a password manager that matches credentials to exact domains",
      "Enable browser warnings for suspected deceptive sites",
    ],
    realWorldExample:
      "Attackers registered over 200 lookalike domains mimicking a major bank with variations like extra hyphens and swapped letters. Targeted phishing emails drove victims to these pages where credentials were harvested.",
  },

  // ── Malware ────────────────────────────────────────────────────────────────
  {
    id: 23,
    title: "Ransomware",
    category: "Malware",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Ransomware encrypts files and demands payment for the decryption key. It most commonly arrives through phishing attachments, malicious links, or infected USB devices and can spread laterally across a network within minutes.",
    signs: [
      "Files renamed with unfamiliar extensions",
      "System slowdown or inability to open documents",
      "Ransom note appearing on screen or desktop",
      "Unusual process activity or network traffic spikes",
    ],
    prevention: [
      "Never enable macros in unexpected documents",
      "Keep endpoint protection updated and active",
      "Back up critical data offline or to isolated cloud storage regularly",
      "Report unexpected downloads or system behavior to IT immediately",
    ],
    realWorldExample:
      "A healthcare network was crippled after an employee opened a macro-enabled Excel file from a fake invoice email. Ransomware spread laterally and encrypted patient records across dozens of facilities within hours.",
  },
  {
    id: 24,
    title: "Trojans and Remote Access Tools",
    category: "Malware",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Trojans disguise themselves as legitimate software. Remote access trojans give attackers persistent invisible control over an infected system, enabling data theft, surveillance, and lateral movement across a network.",
    signs: [
      "Unexpected outbound network connections",
      "Programs running that you did not install",
      "Webcam or microphone activity indicator when not in use",
      "Files or settings changed without your action",
    ],
    prevention: [
      "Only install software from trusted official sources",
      "Scan downloads with endpoint protection before running",
      "Monitor running processes for unfamiliar programs",
      "Isolate and report any device you suspect is compromised",
    ],
    realWorldExample:
      "Attackers distributed a trojanized version of a popular remote work tool via phishing emails. Once installed it gave attackers persistent access to corporate networks across hundreds of organizations.",
  },
  {
    id: 25,
    title: "Keyloggers and Spyware",
    category: "Malware",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Keyloggers record every keystroke typed on an infected device, capturing passwords, credit card numbers, and sensitive messages. Spyware broadly monitors and exfiltrates user activity in the background.",
    signs: [
      "Unexplained slowdown on a previously fast system",
      "Accounts compromised shortly after using a specific device",
      "Unknown processes consuming CPU or network resources",
      "Browser settings changed without your input",
    ],
    prevention: [
      "Use endpoint detection and response software",
      "Avoid entering sensitive data on shared or untrusted devices",
      "Use a password manager to autofill rather than type passwords manually",
      "Regularly audit running processes and installed software",
    ],
    realWorldExample:
      "A keylogger installed via a phishing attachment on a shared office computer silently captured the credentials of every employee who logged into corporate systems over a three week period.",
  },
  {
    id: 26,
    title: "Fileless Malware",
    category: "Malware",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Fileless malware operates entirely in memory without writing files to disk, making it invisible to traditional antivirus tools that scan the filesystem. It often hijacks legitimate system tools like PowerShell to execute attacks.",
    signs: [
      "Unusual PowerShell or scripting engine activity",
      "Memory usage spikes with no obvious running application",
      "Security tools reporting suspicious but unidentified behavior",
      "Unexpected outbound connections from system processes",
    ],
    prevention: [
      "Use behavioral endpoint detection rather than signature-only tools",
      "Restrict PowerShell execution policy to signed scripts only",
      "Enable script block logging for PowerShell activity",
      "Apply application control policies to limit what can execute",
    ],
    realWorldExample:
      "A fileless attack campaign compromised hundreds of banks across dozens of countries by injecting malicious code directly into memory using legitimate Windows administration tools, leaving almost no forensic trace.",
  },

  // ── Human Factors ──────────────────────────────────────────────────────────
  {
    id: 27,
    title: "Social Engineering and Pretexting",
    category: "Human Factors",
    severity: "High",
    relatedScenario: "vishing",
    summary:
      "Social engineering manipulates people rather than systems. Attackers build false context and trust to convince targets to take actions they would otherwise question or refuse.",
    signs: [
      "Requests that create urgency and discourage verification",
      "Scenarios that seem just plausible enough to act on quickly",
      "Pressure to keep a request confidential or act before checking",
      "Appeals to authority, fear, or a desire to be helpful",
    ],
    prevention: [
      "Slow down when someone creates artificial urgency",
      "Verify requests through independent channels before acting",
      "Trust your instincts if something feels off and investigate",
      "Report unusual requests even if they seem minor",
    ],
    realWorldExample:
      "An attacker called a telecom support line, posed as a legitimate customer using public social media data for verification, and convinced the agent to transfer the target's phone number to an attacker-controlled SIM.",
  },
  {
    id: 28,
    title: "Insider Threats",
    category: "Human Factors",
    severity: "High",
    relatedScenario: "authentication",
    summary:
      "Insider threats come from employees, contractors, or partners who misuse their access whether maliciously, negligently, or because they have been manipulated or compromised by an outside actor.",
    signs: [
      "Unusual data access outside of normal job duties",
      "Large file transfers to personal storage or personal email",
      "Access to systems outside normal working hours",
      "Unexplained interest in colleagues' credentials or system access",
    ],
    prevention: [
      "Apply least-privilege access so users only see what they need",
      "Monitor and alert on anomalous data access patterns",
      "Conduct regular access reviews and deprovisioning for departing staff",
      "Foster a culture where employees feel safe reporting concerns",
    ],
    realWorldExample:
      "A database administrator at a financial institution quietly exfiltrated records of over 800,000 customers over 18 months by abusing privileged access that had never been reviewed or restricted.",
  },
  {
    id: 29,
    title: "Baiting and Quid Pro Quo",
    category: "Human Factors",
    severity: "Medium",
    relatedScenario: "usb_baiting",
    summary:
      "Baiting lures victims with something appealing such as a free USB drive or software download. Quid pro quo offers a service in exchange for information, such as IT help in exchange for login credentials.",
    signs: [
      "Unsolicited offer of free software, hardware, or gift cards",
      "Someone offering IT help without a formal request or ticket",
      "Requests for credentials in exchange for resolving a problem quickly",
      "Unexpected prizes or rewards that require account access",
    ],
    prevention: [
      "Never accept unsolicited hardware or software",
      "All IT support should go through official ticketing channels",
      "Never provide credentials as part of receiving help",
      "Report any offer that seems too good or requires sharing access",
    ],
    realWorldExample:
      "Attackers mailed branded USB drives to employees of a targeted company as fake promotional gifts. When plugged in the drives automatically installed a remote access trojan on the corporate network.",
  },

  // ── Network & Infrastructure ───────────────────────────────────────────────
  {
    id: 30,
    title: "Public Wi-Fi and Evil Twin Attacks",
    category: "Network Security",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Public Wi-Fi networks are frequently unsecured. Evil twin attacks create a rogue access point mimicking a legitimate network to intercept all traffic from connected devices.",
    signs: [
      "Multiple networks with similar names in the same location",
      "Network that does not require a password where you expect one",
      "Unusually slow connection despite full signal strength",
      "Certificate warnings when visiting normally secure sites",
    ],
    prevention: [
      "Always use a VPN on public or untrusted Wi-Fi",
      "Verify the exact network name with staff before connecting",
      "Use mobile data instead of public Wi-Fi for sensitive tasks",
      "Disable auto-connect to open networks on all devices",
    ],
    realWorldExample:
      "A security researcher set up a rogue Wi-Fi hotspot at a conference and within 30 minutes had captured login credentials and session tokens from dozens of attendees who connected automatically.",
  },
  {
    id: 31,
    title: "Man-in-the-Middle Attacks",
    category: "Network Security",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "Man-in-the-middle attacks intercept communications between two parties. The attacker can silently read, modify, or inject data into the stream without either party being aware.",
    signs: [
      "Unexpected certificate warnings on familiar secure sites",
      "Session suddenly logged out without your action",
      "Unusual latency or connection behavior on secure sites",
      "Accounts showing activity from unexpected locations",
    ],
    prevention: [
      "Always verify HTTPS and certificate validity before entering credentials",
      "Use a VPN on untrusted networks",
      "Report certificate errors rather than clicking through them",
      "Use phishing-resistant MFA to limit damage if credentials are intercepted",
    ],
    realWorldExample:
      "On a compromised hotel Wi-Fi network, attackers intercepted HTTPS sessions using a spoofed certificate to steal credentials from business travelers connecting to corporate portals.",
  },
  {
    id: 32,
    title: "DNS Hijacking and Cache Poisoning",
    category: "Network Security",
    severity: "High",
    relatedScenario: "phishing",
    summary:
      "DNS hijacking redirects legitimate domain lookups to attacker-controlled IP addresses. Victims type a correct URL and are silently sent to a fake site that looks identical to the real one.",
    signs: [
      "Familiar websites behaving unexpectedly or looking slightly different",
      "Certificate warnings on sites you visit regularly",
      "Login pages that do not recognize your saved credentials",
      "Unexpected redirects from known domains",
    ],
    prevention: [
      "Use DNS over HTTPS to encrypt DNS queries",
      "Monitor for unexpected DNS changes on your network",
      "Use a reputable DNS provider with DNSSEC support",
      "Report certificate anomalies on trusted sites immediately",
    ],
    realWorldExample:
      "Attackers hijacked the DNS records of a major bank's website and redirected customers to a pixel-perfect clone that harvested credentials and OTP codes for several hours before the attack was discovered.",
  },

  // ── Data & Cloud ───────────────────────────────────────────────────────────
  {
    id: 33,
    title: "Data Classification and Handling",
    category: "Data Security",
    severity: "Medium",
    relatedScenario: "authentication",
    summary:
      "Improper handling of sensitive data leads to breaches, regulatory violations, and reputational damage. Most organizations classify data into tiers that determine how it must be stored, transmitted, and shared.",
    signs: [
      "Sensitive files shared over personal email or messaging apps",
      "Confidential data stored on unencrypted personal devices",
      "Overly broad sharing permissions on cloud documents",
      "Data sent to recipients outside their need-to-know scope",
    ],
    prevention: [
      "Know your organization's data classification policy",
      "Never send confidential data over unencrypted or personal channels",
      "Review sharing permissions on cloud documents regularly",
      "Encrypt sensitive data at rest and in transit",
    ],
    realWorldExample:
      "An employee accidentally shared a cloud folder containing confidential HR records with the entire company by selecting the wrong sharing option. The exposure went undetected for several weeks.",
  },
  {
    id: 34,
    title: "Cloud Misconfiguration",
    category: "Data Security",
    severity: "High",
    relatedScenario: "authentication",
    summary:
      "Cloud storage buckets and databases that are misconfigured as publicly accessible expose sensitive data to anyone on the internet. These mistakes are among the most common causes of large-scale data breaches.",
    signs: [
      "Storage buckets without access controls applied",
      "Database ports exposed to the public internet",
      "Default credentials left unchanged on cloud services",
      "Overly permissive IAM roles or service accounts",
    ],
    prevention: [
      "Audit cloud storage permissions regularly using automated tools",
      "Enforce least-privilege on all cloud IAM roles",
      "Enable cloud security posture management tools",
      "Never use default credentials on any cloud resource",
    ],
    realWorldExample:
      "A misconfigured storage bucket at a major company exposed the personal data of over 100 million customers including names, addresses, and credit scores for months before being discovered by an independent researcher.",
  },
  {
    id: 35,
    title: "Shadow IT and Unauthorized Apps",
    category: "Data Security",
    severity: "Medium",
    relatedScenario: "authentication",
    summary:
      "Shadow IT refers to software, services, or devices used by employees without IT approval. These tools often lack enterprise security controls, creating data exposure and compliance risks that IT cannot manage or monitor.",
    signs: [
      "Employees using personal cloud storage for work files",
      "Unapproved messaging or collaboration tools containing sensitive data",
      "Business data accessible from personal devices outside MDM",
      "Third party integrations connected to corporate accounts without review",
    ],
    prevention: [
      "Provide approved tools that meet employee needs so workarounds are unnecessary",
      "Enforce data loss prevention policies on cloud services",
      "Conduct regular audits of connected third-party apps",
      "Educate staff on why unauthorized tools create risk",
    ],
    realWorldExample:
      "An engineering team used a free file sharing service to collaborate on a sensitive project after finding the approved tool too slow. The service was later breached and proprietary source code was exposed publicly.",
  },
];

const CATEGORY_OPTIONS = [
  "Email Security",
  "Identity Protection",
  "Authentication",
  "Mobile Security",
  "Voice Security",
  "Physical Security",
  "Web Security",
  "Malware",
  "Human Factors",
  "Network Security",
  "Data Security",
];

const SCENARIO_LABELS = {
  phishing: "Phishing Scenario",
  smishing: "Smishing Scenario",
  vishing: "Vishing Scenario",
  mfa_fatigue: "MFA Fatigue Scenario",
  usb_baiting: "USB Baiting Scenario",
  authentication: "Authentication Scenario",
  legitimate: "Legitimate Email Scenario",
};

function InfoBadge({ children, background, color }) {
  return (
    <span style={{ display: "inline-block", padding: "6px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, background, color }}>
      {children}
    </span>
  );
}

function ScenarioBadge({ scenarioType }) {
  if (!scenarioType) return null;
  const label = SCENARIO_LABELS[scenarioType];
  if (!label) return null;
  return (
    <span style={{ display: "inline-block", padding: "5px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, background: "#0e3a5a", color: "#67e8f9", border: "1px solid #164e63" }}>
      🎯 {label}
    </span>
  );
}

export default function ThreatLibrary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [selectedThreat, setSelectedThreat] = useState(null);

  const filteredThreats = useMemo(() => {
    return threatItems.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        [item.title, item.category, item.summary, ...(item.signs || []), ...(item.prevention || [])]
          .join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || item.category.toLowerCase() === category.toLowerCase();
      const matchesSeverity = !severity || item.severity.toLowerCase() === severity.toLowerCase();
      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [search, category, severity]);

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", padding: "32px 20px" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ marginBottom: "8px" }}>Threat Library</h1>
          <p style={{ color: "#94a3b8", lineHeight: 1.7, maxWidth: "960px" }}>
            {threatItems.length} threats across email, mobile, voice, authentication, web, physical,
            malware, network, and data security. Each entry includes warning signs, prevention tips,
            and a real-world example.
          </p>
        </div>

        {/* Filters */}
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 260px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search threats, signs, or prevention..."
                style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "#e2e8f0", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "#e2e8f0" }}
              >
                <option value="">All Categories</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ minWidth: "180px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "#e2e8f0" }}
              >
                <option value="">All Severity Levels</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            {(search || category || severity) && (
              <button
                onClick={() => { setSearch(""); setCategory(""); setSeverity(""); }}
                style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #334155", background: "#1e293b", color: "#94a3b8", cursor: "pointer", fontWeight: 600 }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div style={{ marginBottom: "16px", color: "#94a3b8" }}>
          Showing {filteredThreats.length} of {threatItems.length} threats
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
          {filteredThreats.map((item) => (
            <div key={item.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <h3 style={{ margin: 0 }}>{item.title}</h3>
                <InfoBadge
                  background={item.severity === "High" ? "#450a0a" : "#172554"}
                  color={item.severity === "High" ? "#fecaca" : "#bfdbfe"}
                >
                  {item.severity}
                </InfoBadge>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <InfoBadge background="#1e293b" color="#e2e8f0">{item.category}</InfoBadge>
                <ScenarioBadge scenarioType={item.relatedScenario} />
              </div>
              <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.7 }}>{item.summary}</p>
              <button
                onClick={() => setSelectedThreat(item)}
                style={{ marginTop: "auto", width: "100%", padding: "12px 16px", borderRadius: "12px", border: "none", background: "#2563eb", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {filteredThreats.length === 0 && (
          <div style={{ marginTop: "24px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", color: "#94a3b8" }}>
            No threat library items match the current filters.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedThreat && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ width: "100%", maxWidth: "900px", borderRadius: "18px", background: "#111827", color: "#f8fafc", border: "1px solid #334155", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>

            {/* Modal header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexShrink: 0 }}>
              <div>
                <h2 style={{ margin: 0 }}>{selectedThreat.title}</h2>
                <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <InfoBadge background="#1e293b" color="#e2e8f0">{selectedThreat.category}</InfoBadge>
                  <InfoBadge
                    background={selectedThreat.severity === "High" ? "#450a0a" : "#172554"}
                    color={selectedThreat.severity === "High" ? "#fecaca" : "#bfdbfe"}
                  >
                    {selectedThreat.severity}
                  </InfoBadge>
                  <ScenarioBadge scenarioType={selectedThreat.relatedScenario} />
                </div>
              </div>
              <button
                onClick={() => setSelectedThreat(null)}
                style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "10px", padding: "10px 14px", cursor: "pointer", flexShrink: 0 }}
              >
                Close
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "24px", overflowY: "auto" }}>
              <div style={{ marginBottom: "18px", padding: "16px", borderRadius: "14px", background: "#0f172a", border: "1px solid #1e293b" }}>
                <h3 style={{ marginTop: 0 }}>Summary</h3>
                <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: 0 }}>{selectedThreat.summary}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
                <div style={{ padding: "16px", borderRadius: "14px", background: "#450a0a", border: "1px solid #7f1d1d" }}>
                  <h3 style={{ marginTop: 0, color: "#fecaca" }}>Warning Signs</h3>
                  <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 1.8, color: "#fee2e2" }}>
                    {selectedThreat.signs.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div style={{ padding: "16px", borderRadius: "14px", background: "#052e16", border: "1px solid #14532d" }}>
                  <h3 style={{ marginTop: 0, color: "#bbf7d0" }}>Prevention Tips</h3>
                  <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 1.8, color: "#dcfce7" }}>
                    {selectedThreat.prevention.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>

              {selectedThreat.realWorldExample && (
                <div style={{ padding: "16px", borderRadius: "14px", background: "#1c1917", border: "1px solid #44403c" }}>
                  <h3 style={{ marginTop: 0, color: "#fde68a" }}>⚠️ Real-World Example</h3>
                  <p style={{ color: "#fef3c7", lineHeight: 1.7, marginBottom: 0 }}>{selectedThreat.realWorldExample}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
