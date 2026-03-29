const { db, initDb } = require('./src/db');
initDb();

// Delete duplicate question
db.prepare('DELETE FROM module_quiz_questions WHERE id = 46').run();
console.log('Deleted duplicate id 46');

// Delete duplicate question id 47 from Module 7 (USB Baiting has 4 but should have 3)
const mod7extras = db.prepare(`
  SELECT mq.id FROM module_quiz_questions mq
  JOIN modules m ON m.id = mq.module_id
  WHERE m.title = 'Module 7: USB Baiting and Physical Security'
  ORDER BY mq.id DESC LIMIT 1
`).get();
if (mod7extras) {
  db.prepare('DELETE FROM module_quiz_questions WHERE id = ?').run(mod7extras.id);
  console.log('Deleted extra Module 7 question id', mod7extras.id);
}

function uq(id, question_text, choice_a, choice_b, choice_c, correct_choice, explanation) {
  db.prepare(`
    UPDATE module_quiz_questions
    SET question_text=?, choice_a=?, choice_b=?, choice_c=?, correct_choice=?, explanation=?
    WHERE id=?
  `).run(question_text, choice_a, choice_b, choice_c, correct_choice, explanation, id);
  console.log('Updated question id', id);
}

// ── Module 1: Phishing Basics (ids 1,2,3) ─────────────────────────
// Correct: A, C, B
uq(1,
  'What does hovering over a link in an email before clicking it reveal?',
  'The true destination URL so you can verify it goes where it claims',
  'Whether the email was sent from a verified sender',
  'The date the link was created',
  'A',
  'Hovering reveals the actual destination URL in your browser status bar without loading the page, letting you spot lookalike or malicious domains before clicking.'
);
uq(2,
  'Which of these is a hallmark tactic used in phishing emails?',
  'A polite greeting and professional signature',
  'A newsletter you previously subscribed to',
  'Urgent language threatening account suspension to pressure you into acting without thinking',
  'C',
  'Urgency is the most consistent phishing indicator. Attackers create artificial time pressure to bypass your critical thinking. Slowing down to verify is the correct response.'
);
uq(3,
  'What should you do if you clicked a suspicious link before realizing it was phishing?',
  'Close the browser tab and monitor for anything unusual over the next few days',
  'Report it to IT immediately and change your passwords even if you did not enter credentials',
  'Only act if the page asked you to log in',
  'B',
  'Even clicking without entering credentials can trigger drive-by downloads that install malware silently. Report it immediately so IT can assess and respond.'
);

// ── Module 2: Credential Theft (ids 4,5,6) ───────────────────────
// Correct: C, B, A
uq(4,
  'What is the safest way to reach a login page for your bank or email?',
  'Click the link in the email notification from the service',
  'Search for the site and use the first result',
  'Type the address directly in the browser or use a saved bookmark you created yourself',
  'C',
  'Bookmarks and direct URL entry eliminate the risk of being redirected to a lookalike phishing page. Search results can be manipulated and email links can be fake.'
);
uq(5,
  'A page looks identical to your bank website but something feels wrong. What should you verify first?',
  'Whether the design matches what you remember',
  'The full domain in the address bar to confirm it is the real site',
  'Whether the page loaded quickly',
  'B',
  'Attackers can pixel-perfectly copy any website design. The URL domain is the only reliable indicator. Check that it is exactly right before entering any credentials.'
);
uq(6,
  'Why does using the same password on multiple sites make a single breach catastrophic?',
  'Attackers run automated credential stuffing attacks that try breached passwords against hundreds of other services immediately',
  'Password reuse makes passwords easier for attackers to guess',
  'Reused passwords expire faster than unique ones',
  'A',
  'Credential stuffing automates testing breached credentials across many services. One compromised site cascades to every other site where you reused that password.'
);

// ── Module 3: Business Email Scams (ids 7,8,9) ───────────────────
// Correct: B, A, C
uq(7,
  'You receive an urgent email appearing to be from your CEO requesting a wire transfer before close of business. What is the correct action?',
  'Process it since the CEO name and signature look correct',
  'Call the CEO back on a number you already have to verbally confirm before taking any financial action',
  'Reply to the email asking for a purchase order number first',
  'B',
  'BEC attacks spoof executive addresses perfectly. Always verify financial requests through an independent channel you already have. Replying to the suspicious email reaches the attacker.'
);
uq(8,
  'What makes a request to secretly handle a financial transaction a major red flag?',
  'Legitimate business transactions do not require secrecy from colleagues, so a secrecy request is a manipulation tactic to prevent you from getting a second opinion',
  'Financial transactions always require public announcement before processing',
  'Secrets are only appropriate for surprise events not business transactions',
  'A',
  'Real executives understand that financial controls and transparency protect the organization. Requests for secrecy specifically prevent the verification steps that would expose the fraud.'
);
uq(9,
  'A vendor sends an email saying their bank account details have changed. What should you do?',
  'Update the details immediately to avoid disrupting payment schedules',
  'Reply to the email asking them to confirm the change in writing',
  'Call the vendor on a phone number from your existing records to verbally verify the change before updating anything',
  'C',
  'Bank detail change requests are a primary BEC vector. The confirmation must come through an independent channel. Calling a number from the suspicious email reaches the attacker.'
);

// ── Module 4: Smishing and Mobile Safety (ids 10,11,12) ──────────
// Correct: C, A, B
uq(10,
  'You receive a text about a package delivery problem with a link to confirm your details. What is safest?',
  'Tap the link since delivery notifications are common and usually legitimate',
  'Reply to the text asking for more information before clicking',
  'Open the official carrier app or website directly to check your tracking without using the link',
  'C',
  'Always verify delivery issues through official carrier apps. Smishing links lead to credential harvesting pages designed to look like real carrier sites.'
);
uq(11,
  'Why are mobile users more vulnerable to smishing than desktop users are to email phishing?',
  'Mobile screens show less of the URL, response context encourages quick action, and shortened links hide destinations that would reveal the scam on a full browser',
  'Mobile antivirus software is less effective than desktop antivirus',
  'SMS messages bypass all spam filtering completely',
  'A',
  'The combination of truncated URLs, the informal feel of text messages, and the impulse to respond quickly all reduce the scrutiny mobile users apply compared to email.'
);
uq(12,
  'What is juice jacking and how do you protect against it?',
  'A scam where attackers overcharge for phone repairs at unofficial repair shops',
  'Malware delivery or data theft through compromised public USB charging ports, prevented by using your own charger with an AC outlet or a USB data blocker',
  'A technique for stealing phone data through public Wi-Fi hotspots',
  'B',
  'Modified public USB charging ports can deliver malware or silently copy data while charging your device. Your own AC charger or a USB data blocker that passes power but blocks data pins eliminates this risk.'
);

// ── Module 5: Vishing (ids 13,14,15) ─────────────────────────────
// Correct: B, C, A
uq(13,
  'A caller claims to be from IT and says they need your one-time MFA code to fix a problem with your account. What do you do?',
  'Give them the code since IT legitimately needs access to fix account problems',
  'Refuse immediately. No legitimate IT person or organization will ever ask you to read back a one-time code',
  'Read them only the first three digits as a security compromise',
  'B',
  'One-time codes are yours alone to enter on the website. Any caller requesting you read one back is stealing your authentication code to take over your account.'
);
uq(14,
  'A call comes in showing your company phone number on caller ID. What does this tell you about the call?',
  'The call is definitely from within your organization since the number matches',
  'The number may have routing issues which explains why it shows internally',
  'Nothing definitive since caller ID can be spoofed to display any number regardless of where the call actually originates',
  'C',
  'Caller ID spoofing technology is freely available and widely used by scammers. The displayed number provides no reliable confirmation of the actual caller. Verify through a callback on a number you already have.'
);
uq(15,
  'A caller claims to be from the IRS and says you will be arrested in two hours unless you pay immediately via gift cards. What is this?',
  'A government impersonation scam. No legitimate government agency ever demands payment by gift card or threatens immediate arrest via phone',
  'A legitimate collection method used when tax debts are severely overdue',
  'A payment option only offered to taxpayers with no bank account',
  'A',
  'Gift card payment demands from supposed government agencies are a universally recognized fraud pattern. Real government agencies communicate primarily by mail, accept disputes, and never demand gift card payment.'
);

// ── Module 6: MFA Fatigue (ids 16,17,18) ─────────────────────────
// Correct: C, B, A
uq(16,
  'You receive ten MFA push notification requests in two minutes that you did not initiate. What is happening?',
  'Your authenticator app has a technical glitch causing duplicate notifications',
  'Your account is being synchronized across devices which triggers multiple prompts',
  'An attacker has your password and is flooding you with push requests hoping you approve one out of frustration',
  'C',
  'Unsolicited MFA push notifications always mean someone else has your password and is actively attempting to log in. This is a MFA fatigue attack in progress.'
);
uq(17,
  'What is the correct immediate response to an MFA fatigue attack?',
  'Approve one notification to stop the flood then immediately change your password',
  'Deny all requests, change your password immediately to stop the login attempts, and report the incident',
  'Turn off push notifications and switch to SMS codes temporarily',
  'B',
  'Changing your password stops the attack at the source since the attacker can no longer log in with your old credentials. Approving any notification gives them full access before you can act.'
);
uq(18,
  'What makes number-matching MFA more resistant to fatigue attacks than simple approve or deny push notifications?',
  'Number matching requires matching a code displayed on the login screen to a code in your authenticator app, making blind approvals impossible',
  'Number matching sends fewer notifications making the attack less effective',
  'Number matching only works on registered devices that the attacker does not have',
  'A',
  'Simple push approval requires only a tap without verifying anything. Number matching requires you to read a specific code on the login page and confirm it in the app, preventing the reflexive approvals that MFA fatigue relies on.'
);

// ── Module 7: USB Baiting and Physical Security (ids 19,20,21) ───
// Correct: B, A, C
uq(19,
  'You find a USB drive in the office parking lot labeled Salary Data. What should you do?',
  'Plug it into your computer to find the owner so you can return it',
  'Turn it over to IT or security without connecting it to any device',
  'Take it home and check it on a personal device where it cannot harm work systems',
  'B',
  'USB baiting specifically uses enticing labels to exploit curiosity and helpfulness. Plugging in an unknown drive executes its payload instantly. Turn it over to IT without connecting it anywhere.'
);
uq(20,
  'What is tailgating in physical security and why is it dangerous?',
  'Following an authorized person through a secured door without using your own credentials, bypassing physical access controls entirely',
  'Reading over a colleague shoulder to see sensitive information on their screen',
  'Copying files to a USB drive while a security guard is distracted',
  'A',
  'Tailgating exploits the social norm of holding doors for people. An attacker with physical access can plant hardware, photograph screens, steal devices, and access unlocked workstations.'
);
uq(21,
  'What is dumpster diving in the context of information security?',
  'Searching through old emails and deleted files for forgotten passwords',
  'Installing spyware on discarded computers found in trash areas',
  'Searching through physical trash and recycling for documents containing sensitive information like passwords, network diagrams, or customer data',
  'C',
  'Physical documents in the trash can expose valuable intelligence. Shred all documents with any sensitive content before disposal. This applies to any paper with names, systems, credentials, or organizational information.'
);

// ── Module 8: Safe Browsing and QR Code Risks (ids 22,23,24) ─────
// Correct: A, C, B
uq(22,
  'What does the padlock icon and HTTPS in your browser address bar actually confirm?',
  'The connection between your browser and the server is encrypted, but it does not confirm the site is legitimate or not phishing',
  'The website has been verified as legitimate by your browser vendor',
  'Your antivirus has scanned the site and found no threats',
  'A',
  'HTTPS only confirms the connection is encrypted. Phishing sites routinely obtain valid TLS certificates and display the padlock too. Always verify the domain, not just the padlock.'
);
uq(23,
  'A webpage displays a large security warning saying your computer is infected and provides a phone number to call for help. What should you do?',
  'Call the number immediately since your browser detected the infection',
  'Download the security tool the page offers to remove the infection quickly',
  'Close the browser tab immediately. Legitimate security software never displays infection alerts in a webpage with a phone number to call',
  'C',
  'Browser-based security warnings with phone numbers are always fake tech support scams. Real antivirus software displays alerts in its own application interface, never in a webpage.'
);
uq(24,
  'What should you check before tapping the URL that appears when your camera scans a QR code?',
  'Whether the QR code is in a high-resolution format',
  'That the domain in the URL preview matches the legitimate organization you expect and has not been replaced by a lookalike domain',
  'Whether the QR code was printed recently',
  'B',
  'QR codes are just URLs your camera reads. Malicious stickers can be placed over legitimate QR codes. Always check the destination URL preview before tapping, just as you would hover over a link in email.'
);

// ── Module 9: Password and Authentication Hygiene (ids 25,26,27) ─
// Correct: C, A, B
uq(25,
  'What factor most determines password strength against brute-force attacks?',
  'The inclusion of at least two special characters',
  'Avoiding dictionary words by using random letter substitutions',
  'Length, since each additional character multiplies the search space an attacker must cover exponentially',
  'C',
  'A 20-character passphrase is exponentially stronger than an 8-character complex password. Length matters more than complexity because the math of brute force grows exponentially with each character added.'
);
uq(26,
  'Why is a password manager considered essential rather than a convenience tool?',
  'Without a password manager it is impossible in practice to use long unique random passwords for every account, which is the foundation of credential security',
  'Password managers are required by most workplace security policies',
  'Password managers allow you to share credentials securely with colleagues',
  'A',
  'The human brain cannot memorize dozens of strong unique passwords. Password managers make strong unique credentials practical by generating and storing them, eliminating the password reuse that enables credential stuffing attacks.'
);
uq(27,
  'Which MFA method provides the strongest protection against phishing attacks specifically?',
  'SMS text message codes sent to your phone number',
  'Hardware security keys or passkeys that cryptographically verify the site domain before authenticating',
  'Email verification codes sent to your inbox',
  'B',
  'Hardware keys and passkeys verify the actual domain before authenticating. They will not authenticate to a fake phishing site even if the site looks identical, because the domain does not match what is registered with the key.'
);

// ── Module 10: Ransomware (ids 28,29,30) ─────────────────────────
// Correct: A, C, B
uq(28,
  'An Office document you received by email asks you to click Enable Content to view it. What should you do?',
  'Close the document immediately and report it to IT without enabling macros',
  'Enable the content since the document needs macros to display properly',
  'Enable macros but only read the document without saving any changes',
  'A',
  'Enabling macros in unexpected documents is the primary ransomware delivery mechanism. No legitimate document requires macros just to display its content. This prompt is a social engineering technique.'
);
uq(29,
  'What does the 3-2-1 backup rule specify?',
  'Back up at 3 AM, keep 2 weeks of history, use 1 cloud provider',
  'Three password attempts, two recovery codes, one administrator account',
  'Three copies of data, on two different media types, with one copy offsite or in cloud storage that ransomware on your local system cannot reach',
  'C',
  'The offsite or cloud component is critical for ransomware protection. Ransomware encrypts all accessible storage including attached drives. An isolated offline or cloud backup is the only recovery path without paying the ransom.'
);
uq(30,
  'What is the single most important immediate action when you notice active ransomware encrypting files?',
  'Pay the ransom quickly before the price increases',
  'Disconnect the device from the network immediately to prevent the ransomware from spreading to other networked systems',
  'Shut down the computer to stop the encryption process',
  'B',
  'Network disconnection stops lateral movement to other devices. In enterprise environments ransomware operators deploy across the network simultaneously. Isolating immediately limits how many systems are encrypted.'
);

// ── Module 11: Insider Threats (ids 31,32,33) ────────────────────
// Correct: B, C, A
uq(31,
  'Which type of insider threat is statistically the most common?',
  'Malicious employees deliberately stealing data for financial gain',
  'Negligent employees who cause incidents through carelessness, poor password practices, or falling for phishing rather than malicious intent',
  'Former employees retaining access after leaving the organization',
  'B',
  'Negligent insiders vastly outnumber malicious ones. Employees who click phishing links, mishandle sensitive data, or violate security policies without harmful intent cause the majority of insider-related incidents.'
);
uq(32,
  'An employee who is leaving the company next week suddenly begins accessing large volumes of files outside their normal work area. What does this suggest?',
  'They are trying to catch up on work before their last day',
  'They may be curious about how the company operates in other departments',
  'This is a warning sign of potential data exfiltration. Unusual bulk data access combined with an upcoming departure is a primary insider threat indicator',
  'C',
  'The combination of impending departure and unusual broad data access is one of the most consistent behavioral patterns preceding insider data theft. Monitoring systems flag exactly this pattern for investigation.'
);
uq(33,
  'What is the least privilege principle and how does it reduce insider threat risk?',
  'Each employee should have access only to the data and systems needed for their specific job function, limiting what any single insider can steal or accidentally expose',
  'Employees should have the least number of passwords possible to reduce security fatigue',
  'Junior employees should have fewer system permissions than senior employees regardless of their role requirements',
  'A',
  'Least privilege limits blast radius. An employee who can only access data relevant to their role cannot steal or accidentally expose data they were never authorized to see, regardless of intent.'
);

// ── Module 12: Social Engineering (ids 34,35,36) ─────────────────
// Correct: C, A, B
uq(34,
  'What is pretexting in social engineering?',
  'A legal warning message that must appear before a phishing site loads',
  'An automated script attackers use to generate phishing emails',
  'A fabricated backstory an attacker creates to establish false credibility before making a request for sensitive information or access',
  'C',
  'Pretexting involves creating a false context such as posing as IT support, a new vendor, an auditor, or a law enforcement officer to make the request seem legitimate and lower the target\'s defenses.'
);
uq(35,
  'Which psychological principle do social engineers most consistently rely on across attack types?',
  'Urgency combined with authority, creating pressure to comply with a request from a perceived authority figure before the target has time to verify',
  'Curiosity about new technologies and systems',
  'The desire to appear technically competent to colleagues',
  'A',
  'Urgency prevents critical thinking and authority triggers compliance instincts. Together they are the most reliable manipulation combination across phishing, vishing, BEC, and in-person social engineering.'
);
uq(36,
  'What is the most effective defense against a well-crafted social engineering attack?',
  'Refusing to interact with anyone you do not personally recognize',
  'Verifying unusual requests independently through a communication channel you already trust, regardless of how convincing the original request seems',
  'Installing social engineering detection software that flags suspicious requests',
  'B',
  'Independent verification breaks the social engineering chain entirely. If you call back on a number you already have rather than one the attacker provided, impersonation is defeated regardless of how convincing the pretext was.'
);

// ── Module 13: Safe Remote Work (ids 37,38,39) ───────────────────
// Correct: A, C, B
uq(37,
  'What is an evil twin Wi-Fi attack?',
  'A rogue wireless access point broadcasting the same network name as a legitimate network to intercept the traffic of devices that connect to it',
  'A malware attack that creates a backup copy of your files and sends them to an external server',
  'A phishing attack delivered through fake collaboration tool notifications',
  'A',
  'Evil twin attacks create fake Wi-Fi networks indistinguishable by name from legitimate ones. Devices that connect route all their traffic through the attacker\'s equipment, enabling man-in-the-middle interception.'
);
uq(38,
  'Why is it important to use your corporate VPN when working from home rather than your home internet connection directly?',
  'The corporate VPN is faster than your home internet connection',
  'The corporate VPN prevents your employer from monitoring your personal browsing',
  'The corporate VPN routes work traffic through your organization\'s security infrastructure and encrypts it from exposure on your home network',
  'C',
  'Corporate VPN ensures work traffic passes through organizational security controls, encrypts it across your home network, and provides access to internal resources as if you were physically in the office.'
);
uq(39,
  'What does shoulder surfing mean and how do you protect against it when working in public?',
  'A tactic where attackers observe your screen or keyboard from nearby to capture sensitive information, prevented by positioning against a wall or using a privacy screen filter',
  'A network attack where traffic is captured from nearby Wi-Fi users',
  'A social engineering technique where attackers pretend to need help while observing your login process',
  'A',
  'Shoulder surfing is physical observation of your screen or keyboard. In coffee shops, airports, and shared spaces, positioning yourself against a wall and using a privacy screen filter prevents unauthorized viewing of your work.'
);

// ── Module 14: Data Classification (ids 40,41,42) ────────────────
// Correct: B, A, C
uq(40,
  'Why should confidential data never be transmitted through personal email accounts?',
  'Personal email accounts have smaller attachment size limits',
  'Personal email is outside organizational security controls, creating an unmanaged copy of sensitive data with no access control, audit trail, or encryption guarantee',
  'Personal email is slower and less reliable than corporate email systems',
  'B',
  'Using personal email for work data bypasses every security control the organization has implemented: encryption requirements, access logging, DLP tools, and data retention policies.'
);
uq(41,
  'How should paper documents containing confidential customer information be disposed of?',
  'Shredded using a cross-cut shredder before disposal to prevent reconstruction',
  'Recycled in the standard paper recycling bin since the office handles disposal securely',
  'Folded and placed in a sealed envelope before putting in the trash',
  'A',
  'Documents in recycling bins are accessible and dumpster diving specifically targets improperly disposed documents. Cross-cut shredding makes reconstruction practically impossible.'
);
uq(42,
  'What is shadow IT and why does it create organizational security risk?',
  'Unauthorized access to servers after business hours by disgruntled employees',
  'Employees using personal devices on corporate networks without authorization',
  'Using consumer apps and cloud services for work data without IT approval, placing sensitive data outside organizational security controls and compliance requirements',
  'C',
  'Shadow IT places organizational data in systems IT cannot apply security policies to, cannot audit, cannot ensure proper backup of, and cannot delete from when required by policy or regulation.'
);

// ── Module 15: AI-Powered Attacks (ids 43,44,45) ─────────────────
// Correct: C, A, B
uq(43,
  'What specific capability does AI give attackers that makes phishing significantly more dangerous?',
  'AI allows attackers to bypass email spam filters automatically',
  'AI provides attackers with verified sender addresses that pass email authentication',
  'AI generates grammatically perfect personalized messages at scale, removing the quality indicators that previously helped identify phishing',
  'C',
  'Traditional phishing was detectable by poor grammar, generic greetings, and awkward phrasing. AI removes these tells and enables personalized spear phishing at mass scale, making content quality an unreliable detection method.'
);
uq(44,
  'How should you verify an unexpected financial request from someone whose voice sounds exactly like your CEO?',
  'Contact the person through a completely separate communication channel using contact information you already have independently of the suspicious request',
  'Ask them a personal question that only the real CEO would know',
  'Request that they send a follow-up email to confirm the request in writing',
  'A',
  'AI voice cloning can replicate voices convincingly. Multi-channel verification using independently known contact information defeats cloning because the attacker would need to compromise multiple independent channels simultaneously.'
);
uq(45,
  'What is a verbal code word and why does it provide protection that technology alone cannot?',
  'A passphrase used to encrypt voice messages before sending them',
  'A pre-established secret word known only to the real person that AI cloning cannot replicate without knowing the specific word in advance',
  'A spoken password used to unlock voice-activated security systems',
  'B',
  'A code word agreed upon in advance provides a verification layer that requires prior knowledge of the specific word. AI cloning reproduces the voice but cannot reproduce information the attacker did not already have.'
);

// ── CT Module 1: Diagnosing a Slow PC (ids 47,48,49) ─────────────
// Correct: B, A, C
uq(47,
  'What is the most effective first step when diagnosing an unexpectedly slow Windows computer?',
  'Run a full antivirus scan to check for malware',
  'Open Task Manager and check the Performance and Processes tabs to identify which specific process is consuming CPU, memory, or disk',
  'Restart the computer and see if performance improves',
  'B',
  'Task Manager shows real-time resource consumption per process. Identifying the specific cause of high CPU, memory, or disk usage directs troubleshooting to the actual problem rather than applying random fixes.'
);
uq(48,
  'What is thermal throttling and what symptom does it typically cause?',
  'A processor automatically reducing its clock speed to prevent heat damage, causing slowness that appears only under sustained load while the computer feels normal during light tasks',
  'A Windows feature that reduces screen brightness to save battery when temperatures rise',
  'A storage drive reducing its read speed when approaching capacity limits',
  'A',
  'Thermal throttling is automatic self-protection. A computer that feels slow under load but responsive otherwise is often throttling due to inadequate cooling. Monitoring temperatures with HWMonitor confirms this.'
);
uq(49,
  'How do startup programs affect a computer beyond just slowing boot time?',
  'They only affect the first two minutes after boot and have no ongoing performance impact',
  'They prevent the computer from installing Windows Updates automatically',
  'They consume ongoing CPU, memory, and disk resources in the background throughout the entire session, not just during boot',
  'C',
  'Startup programs launch automatically and continue running as background processes. The combined resource consumption of multiple unnecessary startup items slows the entire computing session, not just the boot.'
);

// ── CT Module 2: BSOD Recovery (ids 50,51,52) ────────────────────
// Correct: C, B, A
uq(50,
  'What is the most useful piece of information to capture when a Blue Screen of Death occurs?',
  'The time the crash occurred for comparison with Event Viewer logs',
  'Which application was running at the time of the crash',
  'The stop code displayed on the screen which identifies the specific category of failure',
  'C',
  'The stop code is a specific error identifier. Searching it reveals targeted solutions and points toward driver, hardware, or system file categories. Without it you are troubleshooting blind.'
);
uq(51,
  'What does the Windows command sfc /scannow do and when should you use it?',
  'It scans for disk errors and repairs bad sectors on your hard drive',
  'It checks protected Windows system files for corruption and repairs them from a cached copy, useful when BSODs are caused by corrupted system files',
  'It scans installed applications for outdated versions that need updating',
  'B',
  'System File Checker addresses BSODs caused by corrupted system files from failed updates, power interruptions during writes, or storage issues. Run it after DISM to ensure it has a good source to restore from.'
);
uq(52,
  'Which tool provides the most specific information about which driver caused a BSOD?',
  'WhoCrashed or WinDbg, which analyze the memory dump file Windows saves during a crash and identify the specific driver responsible',
  'Device Manager which shows which drivers have warning flags',
  'Windows Update which logs which updates coincided with the crash',
  'A',
  'Memory dump analysis reads the crash data Windows saves and specifically identifies the driver or component that triggered the stop error. The stop code tells you the category; dump analysis tells you the exact cause.'
);

// ── CT Module 3: Network Troubleshooting (ids 53,54,55) ──────────
// Correct: A, C, B
uq(53,
  'What is the first diagnostic question that most efficiently narrows down a network problem?',
  'Whether the problem affects one device or all devices, which determines whether the issue is device-specific or network-wide',
  'Whether the router firmware needs an update',
  'Whether the problem is with a specific website or all internet access',
  'A',
  'Scope isolation is the foundation of efficient troubleshooting. One affected device points to a driver, software, or configuration issue on that device. All devices affected points to the router, modem, or ISP.'
);
uq(54,
  'A website that normally loads fine has been failing to connect for hours even though other sites work. What should you try first?',
  'Reinstall the browser since it is likely corrupted',
  'Restart the router to reset the connection to the ISP',
  'Run ipconfig /flushdns to clear the local DNS cache which may contain a stale or corrupted entry for that domain',
  'C',
  'Site-specific failures while others work often indicate a corrupted DNS cache entry for that domain. Flushing the cache forces a fresh DNS lookup, resolving the connection failure without changing any network configuration.'
);
uq(55,
  'Why might switching from 5 GHz Wi-Fi to 2.4 GHz improve connection reliability when you are far from the router?',
  'The 2.4 GHz band is always faster than 5 GHz for streaming video',
  'The 2.4 GHz band penetrates walls and extends range better than 5 GHz despite being slower, providing more stable connectivity at greater distances',
  'The 5 GHz band interferes with Bluetooth which causes connectivity drops',
  'B',
  'Higher frequency radio waves attenuate faster through walls and over distance. At range, 5 GHz signal quality drops significantly while 2.4 GHz remains more stable. The speed trade-off is worth consistent connectivity.'
);

// ── CT Module 4: Driver Problems (ids 56,57,58) ───────────────────
// Correct: C, B, A
uq(56,
  'Where is the correct source for downloading driver updates for your hardware?',
  'Any technology download site that ranks highly in search results',
  'Third-party driver update utilities that automatically scan and update all drivers',
  'The official website of the hardware manufacturer directly',
  'C',
  'Manufacturer official sites are the only trustworthy source. Third-party driver tools frequently install incorrect versions, bundle unwanted software, and have been used to distribute malware alongside drivers.'
);
uq(57,
  'What does a yellow triangle warning icon in Device Manager indicate about a device?',
  'The device is consuming too much power and needs to be replaced',
  'Windows has identified a problem with that device\'s driver requiring attention such as a missing, corrupted, or incompatible driver',
  'The device is working but in a reduced functionality mode due to power settings',
  'B',
  'The yellow warning triangle is Device Manager\'s way of flagging that something is wrong with the device\'s driver relationship with Windows. Right-clicking and viewing Properties reveals the specific error code.'
);
uq(58,
  'When is the Roll Back Driver option the fastest fix for a hardware problem?',
  'When a recent driver update introduced new problems, since rolling back restores the previous working driver version immediately',
  'When the device has never had a driver installed and needs a starting point',
  'When the driver is outdated and needs to be replaced with a newer version',
  'A',
  'If a device worked before a driver update and broke after it, Roll Back Driver is the fastest resolution. It restores the previous working version without requiring a download or research into which older version to install.'
);

// ── CT Module 5: Storage Issues (ids 59,60,61) ────────────────────
// Correct: B, A, C
uq(59,
  'What does a Caution status in CrystalDiskInfo indicate and what should you do immediately?',
  'The drive needs defragmenting to improve performance',
  'The drive\'s own health monitoring has detected warning-level values indicating early failure signs. Back up your data immediately before the drive fails completely',
  'The drive is running slightly warm and needs better ventilation',
  'B',
  'CrystalDiskInfo reads the drive\'s S.M.A.R.T. data. A Caution status means the drive itself has detected and logged health indicators associated with impending failure. Treat it as failing and prioritize data backup now.'
);
uq(60,
  'Why does having less than 10 percent free space on the Windows system drive cause severe performance problems?',
  'Windows requires free space for virtual memory paging when RAM fills up. Insufficient free space prevents paging, causing dramatic slowdowns during any memory-intensive task',
  'Windows reads files more slowly when the drive is fragmented by many small free space gaps',
  'Antivirus software scans slower when the drive has limited free space',
  'A',
  'Windows uses the system drive for virtual memory overflow when physical RAM is exhausted. A drive without sufficient free space for the page file causes constant allocation failures and severe performance degradation.'
);
uq(61,
  'What is the Windows.old folder, how much space can it consume, and is it safe to delete?',
  'A folder containing old program versions from automatic updates, consuming minimal space, always safe to delete',
  'A critical system recovery folder that should never be deleted regardless of available space',
  'A backup of your previous Windows installation created during upgrades that can consume tens of gigabytes, safe to delete after confirming the new version works correctly',
  'C',
  'Windows.old preserves the previous Windows installation for rollback. It can consume 20 gigabytes or more. Once you have used the new version successfully and do not need to roll back, deleting it through Disk Cleanup is safe.'
);

// ── CT Module 6: Browser Problems (ids 62,63,64) ─────────────────
// Correct: A, C, B
uq(62,
  'What specifically does clearing the browser cache fix?',
  'Pages that display incorrectly, show outdated content, or have persistent errors caused by stale or corrupted locally stored resource copies',
  'Slow internet speeds caused by too much data stored in the browser',
  'Saved passwords that are no longer working correctly',
  'A',
  'The cache stores downloaded website resources for faster repeat loading. Outdated or corrupted cached versions of CSS, images, or scripts cause display problems. Clearing forces the browser to download fresh copies.'
);
uq(63,
  'How do you determine which browser extension is causing performance or stability problems?',
  'Disable all extensions and reinstall them one at a time to find the culprit',
  'Check the browser settings page for extension error messages',
  'Open the browser\'s built-in task manager to see resource usage per extension, or test performance in a private window with extensions disabled to confirm an extension is the cause',
  'C',
  'Browser task managers show exactly how much CPU and memory each extension consumes. Testing in a private window disables all extensions simultaneously, confirming whether an extension is the source of the problem.'
);
uq(64,
  'What is a browser hijacker and how does it most commonly get installed?',
  'A virus that steals saved passwords by reading the browser\'s password database directly',
  'Malicious software that changes your homepage, new tab page, or default search engine without permission, typically bundled with free software via pre-checked installer checkboxes',
  'A browser extension that redirects purchases to affiliate links without disclosure',
  'B',
  'Browser hijackers ride into systems through software bundle installers where additional software is pre-selected. Reading installer screens carefully and choosing custom installation allows you to uncheck and decline bundled additions.'
);

// ── CT Module 7: Software Installation (ids 65,66,67) ────────────
// Correct: C, B, A
uq(65,
  'Why should you always choose Custom or Advanced installation rather than clicking through Express or Quick?',
  'Custom installation is always completed faster than Express installation',
  'Express installation uses more disk space because it installs redundant files',
  'Custom installation reveals bundled software, toolbars, and browser modifications that are pre-selected in Express mode and installs silently if you do not manually uncheck them',
  'C',
  'Express installation hides additional software with pre-checked checkboxes. Custom installation shows each component individually. Browser hijackers and unwanted programs commonly arrive this way in free software installers.'
);
uq(66,
  'Why does deleting an application folder leave problems behind compared to using the official uninstaller?',
  'Deleted folders can be restored from the Recycle Bin causing the application to reappear',
  'The official uninstaller removes registry entries, system files, startup entries, and other components installed throughout Windows that simply deleting the folder leaves scattered across the system',
  'Windows prevents folder deletion for applications installed through official installers',
  'B',
  'Applications install components in the Registry, system folders, and startup entries throughout Windows. Only the official uninstaller knows where all these pieces are. Deleting the folder leaves invisible remnants that consume space and cause errors.'
);
uq(67,
  'What security risk do applications you have installed but no longer use create?',
  'Each unused application is an unmonitored attack surface with potentially unpatched vulnerabilities that can be exploited even if you never intentionally run it',
  'Unused applications automatically send telemetry data to the developer consuming your bandwidth',
  'Unused applications gradually corrupt each other\'s files causing eventual system instability',
  'A',
  'Unused applications sit unupdated and unmonitored. Their vulnerabilities are just as exploitable as those in applications you use daily. Removing unused software is one of the simplest ways to reduce attack surface.'
);

// ── CT Module 8: Printer Troubleshooting (ids 68,69,70) ──────────
// Correct: B, C, A
uq(68,
  'What is the Windows print spooler and why does clearing it resolve many common printing problems?',
  'A hardware buffer inside the printer that stores jobs before printing, cleared by turning the printer off and on',
  'A Windows service managing the print queue that becomes stuck when it cannot process a job, blocking all subsequent jobs. Stopping the service, clearing the queue folder, and restarting resolves this',
  'A background process that downloads printer driver updates automatically',
  'B',
  'The print spooler is a Windows service managing the job queue. One unprocessable job blocks everything behind it. The manual reset procedure clears the jam by stopping the service, deleting queue files, and restarting fresh.'
);
uq(69,
  'Why does printing from Notepad work when printing from Microsoft Word fails on the same printer?',
  'Notepad files are smaller and more compatible with all printer types',
  'Word uses more advanced printer features that require specific drivers not installed',
  'The problem is application-specific, meaning Word\'s interaction with the printer driver has an issue while the basic driver function works. Reinstalling the Word printer driver or updating it resolves this',
  'C',
  'When printing works from one application but not another, the printer hardware and basic connectivity are fine. The problem is in how the specific application generates or sends print data. This isolates troubleshooting to the software layer.'
);
uq(70,
  'What is the purpose of printing a self-test page from the printer itself using its buttons?',
  'Testing that the printer hardware functions correctly independently of any computer connection, proving whether the problem is in the printer or on the computer side',
  'Calibrating ink levels and print head alignment before important documents',
  'Resetting the printer firmware to factory default settings',
  'A',
  'A self-test page prints without any computer involvement. If it prints correctly the printer hardware is working and the problem is on the computer. If it fails the problem is in the printer itself, directing troubleshooting appropriately.'
);

// ── CT Module 9: Windows Update (ids 71,72,73) ───────────────────
// Correct: C, A, B
uq(71,
  'What does the Windows Update component reset procedure accomplish?',
  'It reinstalls Windows completely while keeping personal files',
  'It rolls back all updates installed in the past 30 days',
  'It stops update services, clears corrupted cache folders, and restarts services so Windows Update recreates them fresh, resolving most persistent update failures',
  'C',
  'The reset procedure stops the wuauserv and bits services, renames the SoftwareDistribution and catroot2 folders forcing fresh recreation, then restarts the services. This resolves corruption that prevents updates from downloading or installing.'
);
uq(72,
  'Why should you run DISM before running sfc /scannow when troubleshooting Windows corruption?',
  'DISM repairs the Windows component store that SFC uses as its repair source, ensuring SFC has a healthy reference to restore files from',
  'DISM must run first to give SFC the administrator permissions it needs',
  'Running SFC before DISM can permanently delete system files that DISM needs',
  'A',
  'SFC repairs system files by replacing them from the Windows component store. If the component store itself is corrupted, SFC cannot repair correctly. DISM fixes the component store first, making the subsequent SFC run effective.'
);
uq(73,
  'When is briefly pausing Windows Updates appropriate versus when does it create unacceptable risk?',
  'Pausing is always unacceptable since every update contains critical security fixes',
  'Pausing for one to two weeks after major feature releases allows others to identify serious widespread issues before you install, while indefinitely deferring security updates significantly increases vulnerability',
  'Pausing for several months is fine since most vulnerabilities are not actively exploited',
  'B',
  'A brief tactical pause after major releases is reasonable risk management. Indefinite deferral is dangerous because security patches address actively exploited vulnerabilities. The risk of remaining unpatched grows daily after patch release.'
);

// ── CT Module 10: Data Backup (ids 74,75,76) ─────────────────────
// Correct: A, C, B
uq(74,
  'Why is periodically testing your backup by actually restoring files as important as making the backup?',
  'A backup that has never been verified may be corrupt, incomplete, or unrestorable, leaving you with false confidence instead of real data protection',
  'Testing backups updates the backup software to the latest version automatically',
  'Testing is required to maintain the encryption keys that protect backup files',
  'A',
  'Backup failures including media errors, misconfigured software, and incomplete captures are common. Discovering your backup cannot be restored during an actual disaster is catastrophic. Test restores before you need them.'
);
uq(75,
  'Why is file versioning critical for ransomware protection in backup software?',
  'Versioning makes backups run faster by only saving changed files',
  'Versioning tracks which version of the backup application you are running',
  'Versioning retains previous copies of files so you can restore the last known good version before ransomware encrypted them, preventing the encrypted version from overwriting your only backup',
  'C',
  'Without versioning, ransomware that encrypts files before the next backup run causes the backup to overwrite the last good version with the encrypted version. Versioning preserves the pre-encryption copy as a recoverable snapshot.'
);
uq(76,
  'What does the offsite component of the 3-2-1 backup rule protect against that local backups cannot?',
  'Physical disasters like fire, flood, and theft that would destroy both your original data and any local backup drives in the same location simultaneously',
  'Software corruption that affects files stored locally but not files in cloud storage',
  'Hardware compatibility issues that prevent local drives from being read on replacement hardware',
  'A',
  'No local backup survives a fire or flood. The offsite or cloud copy is the only protection against physical catastrophe affecting your location. This is the most commonly overlooked and most critical element of the 3-2-1 rule.'
);

// ── CT Module 11: Overheating (ids 77,78,79) ─────────────────────
// Correct: C, B, A
uq(77,
  'What is the most common cause of a computer that worked fine for years but has recently started running hot?',
  'The processor degrading and generating more heat as it ages',
  'Newer software being less efficient and requiring more processing power',
  'Dust accumulating in heatsinks and fan blades over time, acting as thermal insulation and blocking airflow',
  'C',
  'Dust is the number one cause of gradual thermal degradation in older computers. It accumulates slowly so the change is imperceptible until it reaches a threshold. Annual compressed air cleaning restores cooling to near-original effectiveness.'
);
uq(78,
  'At what temperature range should you be concerned about CPU thermal throttling under full load?',
  'Above 60 degrees Celsius since modern processors should not exceed this under any circumstances',
  'When temperatures consistently exceed 90 degrees Celsius under sustained load, indicating inadequate cooling that will cause throttling and long-term damage',
  'Above 75 degrees Celsius which always indicates a hardware fault requiring immediate replacement',
  'B',
  'Most modern processors operate safely up to about 85 to 90 degrees Celsius under full load. Consistent temperatures above 90 degrees under load indicate a thermal problem. Idle temperatures above 60 degrees also suggest cooling issues.'
);
uq(79,
  'Why does using a laptop on a soft surface like a bed or couch cause overheating?',
  'Soft surfaces block the bottom intake vents that laptop cooling systems use to draw cool air through the heatsink and fan assembly',
  'Soft surfaces conduct heat into the laptop from the surrounding fabric',
  'The uneven surface causes the laptop fans to spin at an angle reducing their efficiency',
  'A',
  'Laptop cooling depends on airflow through bottom vents. Soft surfaces conform to the laptop bottom and completely block these vents. Without airflow the cooling system cannot function and temperatures rise rapidly under any load.'
);

// ── AH Module 1: Firewall (ids 80,81,82) ─────────────────────────
// Correct: B, C, A
uq(80,
  'What advantage does a stateful firewall have over a basic packet filter?',
  'It inspects the content of files being transferred for malware',
  'It tracks the state of network connections, allowing response traffic to outbound connections while blocking unsolicited inbound connections that have no matching outbound request',
  'It automatically updates its rules when new threats are discovered',
  'B',
  'Stateful inspection tracks which connections your system initiated. Responses to your outbound requests are allowed. Unsolicited inbound packets with no matching connection state are dropped, blocking direct internet attacks.'
);
uq(81,
  'Why does Windows Defender Firewall apply more restrictive rules on the Public network profile than the Private profile?',
  'Public networks support fewer connection types so fewer rules are needed',
  'The Private profile allows connections from trusted devices on your home network which are not present on public networks',
  'The Public profile blocks more inbound connections because you do not control or trust public networks and they may contain hostile devices',
  'C',
  'On your home network you know and trust the other devices. On a public network you share space with unknown potentially hostile devices. The Public profile reflects this by allowing fewer inbound connections.'
);
uq(82,
  'An unfamiliar application requests permission to access the network through Windows Firewall. What should you do?',
  'Deny the request, identify what the application is, and only create an exception if you recognize and trust it',
  'Allow it since any application installed on your system was presumably authorized',
  'Allow it temporarily and remove the rule after your current task is complete',
  'A',
  'Unknown applications requesting network access may be malware installed without your knowledge. The correct default is to deny, research, and only allow when you have confirmed the application is legitimate and the access is necessary.'
);

// ── AH Module 2: VPN (ids 83,84,85) ──────────────────────────────
// Correct: C, B, A
uq(83,
  'What does a VPN specifically protect and what threats does it not address?',
  'A VPN protects against all cyber threats including malware, phishing, and account takeover',
  'A VPN only protects browsing in the browser application and does not affect other application traffic',
  'A VPN protects traffic from local network interception and hides your IP from sites you visit, but does not protect against malware on your device, phishing attacks, or tracking by services where you are logged in',
  'C',
  'A VPN is a network-level tool. It encrypts traffic in transit and masks your origin IP. It has no effect on malware already running on your device, social engineering attacks, or services that track you by account rather than IP.'
);
uq(84,
  'Why does choosing a VPN provider with an independently audited no-log policy matter?',
  'Audited providers offer faster connection speeds because they have optimized infrastructure',
  'The VPN provider can see all your traffic since it is decrypted at their server, so their logging practices directly determine whether your privacy is actually protected',
  'Audited providers are exempt from law enforcement requests for user data',
  'B',
  'VPN traffic is decrypted at the VPN server before being forwarded to the internet. The provider has full visibility. Only an independently verified no-log policy provides meaningful assurance they are not retaining records of your activity.'
);
uq(85,
  'What is a DNS leak in VPN usage and why does it undermine privacy?',
  'When VPN data is accidentally transmitted unencrypted due to a protocol error',
  'When the VPN server IP address becomes publicly known reducing anonymity',
  'When DNS queries bypass the VPN tunnel and go through your regular ISP DNS, revealing which domains you visit even though your traffic content travels through the VPN',
  'A',
  'DNS leaks expose your browsing activity at the domain level to your ISP despite the VPN. Even though the content of your traffic is encrypted through the VPN, the ISP can see every domain you look up through their DNS server.'
);

// ── AH Module 3: Home Router (ids 86,87,88) ───────────────────────
// Correct: A, C, B
uq(86,
  'Why are default router admin credentials a critical security vulnerability?',
  'Every router model uses the same published default credentials that are documented in manuals and searchable online, making any router with unchanged defaults trivially accessible to attackers',
  'Default credentials are designed to be easy to remember which makes them easy for attackers to guess',
  'Router manufacturers use default credentials to maintain remote access for warranty support',
  'A',
  'Router manufacturers use the same default username and password across millions of identical devices. These are published in product manuals and aggregated in searchable databases. Any attacker who can reach your router admin interface can log in instantly.'
);
uq(87,
  'Why should you disable WPS on your home router?',
  'WPS slows down Wi-Fi connection speeds for all devices on the network',
  'WPS consumes significant router processing resources that are better used for firewall functions',
  'The WPS PIN method has a fundamental design flaw that allows the 8-digit PIN to be brute-forced in hours, giving attackers full Wi-Fi access regardless of your Wi-Fi password strength',
  'C',
  'WPS PIN validation checks the pin in two halves, effectively making it a 4-digit plus 3-digit check instead of 8-digit. This flaw reduces the effective brute-force space from 100 million to about 11,000 combinations.'
);
uq(88,
  'Why should IoT devices be placed on a separate guest network rather than your main network?',
  'IoT devices use incompatible network protocols that cause problems on regular home networks',
  'Isolating IoT devices on a separate network segment prevents a compromised smart device from directly attacking your computers, phones, and sensitive data on the main network',
  'Guest networks provide faster speeds more suitable for streaming devices like smart TVs',
  'B',
  'IoT devices frequently have poor security practices, slow update cycles, and long operational lives. Isolation means a compromised smart camera cannot pivot to attack your laptop. This is network segmentation applied at home scale.'
);

// ── AH Module 4: MFA Setup (ids 89,90,91) ─────────────────────────
// Correct: B, A, C
uq(89,
  'Why is an authenticator app more secure than SMS text messages for two-factor authentication?',
  'Authenticator apps generate longer codes that are harder for attackers to guess',
  'SMS codes can be intercepted through SIM swapping attacks where attackers transfer your phone number, while authenticator app codes are generated locally without any telecom network involvement',
  'Authenticator apps work without any internet or cellular connection',
  'B',
  'SIM swapping convinces a carrier to transfer your phone number to an attacker\'s SIM, intercepting all your SMS codes. Authenticator app codes are generated locally using a shared secret and the current time, with no network transmission to intercept.'
);
uq(90,
  'Why must backup codes for MFA-protected accounts be stored somewhere other than the device you are protecting?',
  'Backup codes stored with the device are inaccessible when the device is lost or stolen, which is exactly when you would need them to regain account access',
  'Backup codes stored on the device expire faster than those stored externally',
  'Device storage corrupts backup codes over time making them unusable',
  'A',
  'Backup codes exist for the scenario where you cannot access your MFA device. If the backup codes are stored on the same device you lost, you are locked out with no recovery path. Store them in a password manager or secured physical location.'
);
uq(91,
  'Why is your email account the single highest-priority account for enabling MFA?',
  'Email accounts contain more personal messages than any other account type',
  'Email providers process more login attempts making accounts statistically more likely to be targeted',
  'Email is the password reset mechanism for most other accounts, meaning a compromised email account enables immediate takeover of banking, social media, and work accounts through password resets',
  'C',
  'Most online services offer email-based password reset. An attacker with your email can request resets for virtually every account you own. Protecting email with strong MFA protects the master recovery key to your entire digital identity.'
);

// ── AH Module 5: Password Manager (ids 92,93,94) ──────────────────
// Correct: A, C, B
uq(92,
  'What is the most critical technical security requirement when selecting a password manager?',
  'End-to-end encryption where only you can decrypt your vault and the provider cannot read your stored passwords even if their servers are breached',
  'Cross-platform synchronization across all your devices and browsers',
  'Integration with all major browsers for automatic form filling',
  'A',
  'End-to-end encryption means your vault data is encrypted before leaving your device using your master password as the key. Even a complete breach of the provider\'s servers yields only encrypted data useless without your master password.'
);
uq(93,
  'What makes a passphrase of four or more random words an excellent master password?',
  'Passphrases require no special characters which makes them easier for password managers to store',
  'Passphrases are required by most enterprise security policies',
  'Length provides exceptional security through exponentially larger search space while remaining memorable, unlike a random string of characters that is both weak if short and impossible to memorize if long',
  'C',
  'A four-word random passphrase like correct-horse-battery-staple has far more entropy than a typical 8-character complex password and is actually memorable. Length is the primary factor in password strength.'
);
uq(94,
  'How does a password manager browser extension specifically protect against phishing sites?',
  'The extension scans pages for phishing indicators and blocks access to suspicious sites',
  'The extension matches saved credentials to exact domains and will not auto-fill on lookalike sites even if they appear visually identical',
  'The extension encrypts your credentials before they are sent to the web server',
  'B',
  'Password manager extensions use domain matching not visual inspection. A fake site at paypa1.com will not receive your PayPal credentials even if it looks identical, because paypa1.com does not match the saved entry for paypal.com.'
);

// ── AH Module 6: Malware Removal (ids 95,96,97) ───────────────────
// Correct: C, A, B
uq(95,
  'What is the key difference between how a virus spreads and how a trojan gets installed?',
  'Viruses only affect Windows while trojans affect all operating systems',
  'Trojans are more dangerous because they always include ransomware functionality',
  'Viruses self-replicate by attaching to existing files, while trojans disguise malicious functionality as legitimate software relying entirely on the user being tricked into voluntarily installing them',
  'C',
  'Viruses spread autonomously by attaching copies to files. Trojans require user action, disguising themselves as useful software. The deception element makes trojans the primary delivery mechanism for most modern malware.'
);
uq(96,
  'What is a rootkit and why is standard antivirus scanning insufficient to detect it?',
  'A rootkit operates at the kernel or firmware level and intercepts the system calls security software uses to detect threats, making itself and other malware invisible to scanners running within the same compromised operating system',
  'A rootkit that infects the root directory of your hard drive preventing the OS from loading',
  'A rootkit is a collection of administrator tools that hackers use to manage compromised systems remotely',
  'A',
  'Rootkits subvert the operating system itself. Security software that runs within the compromised OS must use the same kernel functions the rootkit controls. The rootkit intercepts these calls and hides itself, requiring scanning from outside the OS.'
);
uq(97,
  'Why is scanning from a bootable recovery environment more effective for serious infections than scanning from within Windows?',
  'Recovery environment scanners have more recently updated malware definitions',
  'Booting from a clean external environment scans the infected drive without the malware being active and able to use rootkit techniques to hide from the scanner',
  'Recovery environments have access to more processing power than Windows does',
  'B',
  'When malware runs within the OS it can intercept and manipulate the same functions security scanners use. A bootable scanner like Kaspersky Rescue Disk operates outside the compromised OS, removing the malware\'s ability to hide itself.'
);

// ── AH Module 7: Browser Security (ids 98,99,100) ────────────────
// Correct: B, C, A
uq(98,
  'What is malvertising and why is an ad blocker effective against it?',
  'Ads with misleading claims, blocked by ad blockers that verify advertising accuracy',
  'Malicious code embedded in legitimate advertising networks affecting even reputable websites, effectively blocked by ad blockers that prevent third-party ad content from loading entirely',
  'Ads that slow your browser by consuming excessive CPU and memory resources',
  'B',
  'Malvertising injects attack code into ad network inventory. Even major reputable sites serve ads from third-party networks they do not fully control. Ad blockers prevent these ad calls from loading, eliminating the attack vector entirely.'
);
uq(99,
  'Why should you be cautious about browser extensions even when installing from official stores?',
  'Official store extensions are slower because they undergo additional security verification before loading',
  'Extensions charge monthly subscription fees that accumulate unnoticed',
  'Extensions have broad access to all browser activity including page content and form data. Malicious extensions have been distributed through official stores after acquiring established popular extensions with existing user bases',
  'C',
  'Browser extensions are powerful code running on every page you visit. The pattern of purchasing legitimate popular extensions and pushing malicious updates to the existing trusted user base is a known attack vector.'
);
uq(100,
  'What is the security benefit of enabling HTTPS-Only Mode or HTTPS-First Mode in your browser?',
  'It prevents your browser from loading pages that lack HTTPS, ensuring all connections are encrypted and warning you before connecting to unencrypted sites',
  'It speeds up page loading by prioritizing secure server connections over standard ones',
  'It blocks all third-party scripts from running on HTTP pages',
  'A',
  'HTTPS-Only Mode prevents the browser from silently loading HTTP pages where traffic is unencrypted and visible to network observers. It forces an upgrade attempt or shows a warning, keeping you on encrypted connections by default.'
);

// ── AH Module 8: Safe File Downloading (ids 101,102,103) ──────────
// get ids
const ahmod8 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'AH Module 8: Safe File Downloading' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(ahmod8[0].id,
  'Where is the only safe source for downloading software to minimize malware risk?',
  'Any website that appears in the top five search results for the software name',
  'Technology review sites that feature software recommendations',
  'The official developer website or established repositories like the Microsoft Store, using bookmarks rather than search results to navigate there',
  'C',
  'Search results for popular software are routinely gamed by malicious sites. Attackers create convincing lookalike download sites. Using bookmarks to official sites eliminates the risk of search result manipulation leading you to a malicious download.'
);
uq(ahmod8[1].id,
  'What does verifying a file hash confirm about a downloaded file?',
  'It confirms the developer signed the file with their official certificate',
  'It confirms the file is byte-for-byte identical to what the developer published, meaning it has not been modified or tampered with during distribution',
  'It confirms the file does not contain any known malware signatures',
  'B',
  'A hash is a mathematical fingerprint of file contents. Even a single changed bit produces a completely different hash. Matching the hash on the download page confirms the file has not been tampered with in transit or on the download server.'
);
uq(ahmod8[2].id,
  'An Office document you downloaded asks you to click Enable Content to view it properly. What is the correct response?',
  'Close the document and report it. Legitimate documents do not require macros just to display content. This is the standard social engineering prompt used to deliver ransomware and trojans',
  'Enable the content since the document needs macros to function as the developer intended',
  'Enable macros but immediately save the document to a sandboxed folder for safety',
  'A',
  'The Enable Content prompt in Office documents is the primary delivery mechanism for macro-based malware including ransomware. No legitimate document requires macros merely to display its content. This prompt is always a warning sign.'
);

// ── AH Module 9: Account Hardening (ids dynamic) ──────────────────
const ahmod9 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'AH Module 9: Account Hardening Best Practices' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(ahmod9[0].id,
  'Why should you use random false answers to security questions rather than real answers?',
  'Real security question answers are easy to forget over time',
  'Real answers to questions like your mother\'s maiden name or first pet are often discoverable through social media, public records, and data brokers, making them ineffective as a second authentication factor',
  'Security systems process fake answers faster than real ones',
  'B',
  'Security questions are effectively a second password. Using discoverable real information makes them weaker than no protection at all. Treat them as password fields and store the random false answers in your password manager.'
);
uq(ahmod9[1].id,
  'What should you do when you receive an MFA prompt you did not initiate?',
  'Deny the request immediately, change your password since someone clearly has it, and report the unauthorized login attempt to your security team',
  'Approve it once to see what account is being accessed then change your password',
  'Ignore it since it will expire automatically after a few minutes',
  'A',
  'An unsolicited MFA prompt means someone is actively trying to log in with your credentials. Denying stops this attempt. Changing your password removes their ability to try again. Reporting alerts the security team to an active attack.'
);
uq(ahmod9[2].id,
  'Why is reviewing connected apps and revoking unused OAuth access part of account hardening?',
  'Connected apps cause slower login times as the platform checks each one during authentication',
  'Unused connected apps accumulate charges that appear on your billing statement',
  'Each connected app retains access to your account data and can post or read on your behalf. Apps you no longer use are unmonitored risks that should be revoked to reduce your account\'s attack surface',
  'C',
  'OAuth connected apps retain ongoing access to your account. An app you authorized years ago and forgot about may have been acquired by a malicious actor, may have been breached, or may be collecting data you no longer consent to share.'
);

// ── AH Module 10: Social Media Security (ids dynamic) ─────────────
const ahmod10 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'AH Module 10: Social Media Security' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(ahmod10[0].id,
  'Why are social media accounts particularly valuable targets for attackers?',
  'They provide access to your entire contact network for impersonation and social engineering, contain personal information valuable for identity theft, and can be used for reputation damage and fraud',
  'Social media passwords are typically weaker than other account passwords',
  'Social media platforms have weaker authentication than banking or email platforms',
  'A',
  'Compromised social media accounts enable attacks on your entire network. Your contacts trust messages from you, making a compromised account an extremely effective social engineering platform. The personal data also feeds targeted attacks.'
);
uq(ahmod10[1].id,
  'You notice your social media account sent messages to your contacts that you did not write. What should you do immediately?',
  'Delete the sent messages and change your profile picture so contacts know the account was compromised',
  'Report it to the platform as a bug since it might be a technical error',
  'Change your password and MFA settings immediately, review and revoke connected apps, and notify your contacts that they may have received malicious messages from your compromised account',
  'C',
  'Account compromise requires immediate action on multiple fronts. Changing credentials stops ongoing access. Reviewing connected apps closes secondary access paths. Warning contacts prevents them from falling for scams sent in your name.'
);
uq(ahmod10[2].id,
  'What is the privacy risk of participating in social media trends that ask you to share childhood memories or personal history details?',
  'These trends are usually data harvesting operations where the real purpose is collecting answers to common security questions like first pet, childhood street, or mother\'s maiden name',
  'These trends use excessive bandwidth that slows your device',
  'These trends share your responses with advertisers who use them to target you',
  'B',
  'Security questions like first pet name, childhood street, and high school mascot are the most common trend formats. The entertaining framing disguises the actual purpose of collecting exactly the answers that unlock account recovery.'
);

// ── AH Module 11: Encryption (ids dynamic) ────────────────────────
const ahmod11 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'AH Module 11: Encryption Basics for Everyone' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(ahmod11[0].id,
  'What does enabling BitLocker on your Windows computer protect against?',
  'It prevents ransomware from encrypting your files',
  'It blocks unauthorized applications from accessing your documents',
  'It encrypts the entire drive so that someone with physical access to your laptop cannot read your files without your password, even if they remove the drive',
  'C',
  'Full disk encryption like BitLocker protects data at rest. Without it, removing the storage drive from a lost or stolen laptop and reading it in another computer bypasses Windows login entirely. With BitLocker the data is unreadable without the key.'
);
uq(ahmod11[1].id,
  'What is the practical difference between transport encryption and end-to-end encryption in messaging?',
  'Transport encryption is faster while end-to-end encryption is more secure but slower',
  'Transport encryption protects messages between your device and the server but the server can read them. End-to-end encryption means only the sender and recipient can read messages and the service provider cannot',
  'Transport encryption is used for text while end-to-end encryption is used for voice calls',
  'B',
  'Most messaging apps use transport encryption protecting messages in transit but storing them decryptably on servers. End-to-end encryption like Signal uses means the provider stores only encrypted data they cannot read.'
);
uq(ahmod11[2].id,
  'Why does encryption not protect against malware already running on your device?',
  'Encryption software is incompatible with most antivirus programs preventing simultaneous protection',
  'Encryption keys expire when malware is detected causing the encrypted data to become permanently inaccessible',
  'Malware running on your device accesses data before it is encrypted or after it is decrypted, when it is in its readable form, bypassing encryption entirely',
  'A',
  'Encryption protects data at rest and in transit. Malware runs on the live system where you work with decrypted data. It captures data in the moment you access it, before encryption applies or after decryption occurs.'
);

// ── NF Module 1: How the Internet Works (dynamic) ─────────────────
const nfmod1 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'NF Module 1: How the Internet Works' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(nfmod1[0].id,
  'What role does the Domain Name System play when you type a website address in your browser?',
  'It verifies that the website has a valid security certificate before allowing connection',
  'It translates the human-readable domain name into the IP address your browser needs to actually connect to the server',
  'It checks whether you have permission to access the requested website',
  'B',
  'DNS is the internet\'s phone book. Your browser cannot connect to an IP address it does not know. DNS resolves the domain name you type into the numerical IP address that network routers use to direct your connection.'
);
uq(nfmod1[1].id,
  'Why does end-to-end encryption provide protection even when your data passes through many routers and networks?',
  'End-to-end encryption is applied at each router hop ensuring the data is re-encrypted with stronger keys as it travels',
  'End-to-end encryption scrambles data on your device in a way that only the intended recipient can unscramble, so even if intermediate routers or networks capture the traffic they see only unreadable data',
  'End-to-end encryption routes traffic through fewer hops reducing the number of systems that can intercept it',
  'A',
  'End-to-end encryption is applied before data leaves your device and removed only at the final destination. Every network, router, and provider the data passes through in between sees only encrypted ciphertext they cannot read.'
);
uq(nfmod1[2].id,
  'What is a DDoS attack and why is it difficult for individual organizations to defend against large ones?',
  'A DDoS attack installs malware on thousands of computers to steal data simultaneously',
  'A DDoS attack uses a compromised user account to access data from many locations at once',
  'A DDoS attack floods a target with traffic from many sources simultaneously overwhelming its capacity. Large volumetric attacks exceed what most organizations can absorb without upstream ISP or CDN mitigation',
  'C',
  'The distributed nature makes DDoS hard to block. Blocking individual source IPs is ineffective when traffic comes from thousands or millions of addresses. Mitigation requires infrastructure at the ISP or CDN level upstream of the target.'
);

// ── NF Module 2: IP Addresses (dynamic) ───────────────────────────
const nfmod2 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'NF Module 2: Understanding IP Addresses' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(nfmod2[0].id,
  'What is the difference between a private IP address and a public IP address?',
  'Private addresses are used within local networks and are not routable on the internet. Public addresses are globally unique and identify your network to the rest of the internet',
  'Private addresses require a password to use while public addresses are freely accessible',
  'Private addresses are assigned by your ISP while public addresses are self-assigned',
  'A',
  'Private addresses like 192.168.x.x are used inside local networks and can be reused in different networks. Public addresses are globally unique and are what the internet uses to route traffic to your location.'
);
uq(nfmod2[1].id,
  'What is Network Address Translation and what problem does it solve?',
  'A security feature that encrypts packets as they cross network boundaries',
  'A method of converting domain names to IP addresses more efficiently than DNS',
  'A technique that allows multiple devices with private IP addresses to share a single public IP address by the router tracking and translating connections',
  'C',
  'NAT solved IPv4 address exhaustion. Rather than every device needing a unique public IP, the router acts as a translator allowing all internal devices to share one public address while maintaining separate private addresses internally.'
);
uq(nfmod2[2].id,
  'How does assigning a static IP or DHCP reservation to your home printer improve reliability?',
  'A static IP makes the printer communicate faster with computers on the network',
  'A static IP ensures the printer always has the same address so computers can always find it, preventing connection failures caused by address changes after DHCP lease renewal',
  'A static IP protects the printer from attacks since only known addresses can connect',
  'B',
  'DHCP assigns addresses dynamically and they can change. If your computer has saved a printer at 192.168.1.50 and the printer gets reassigned to 192.168.1.75, the saved connection fails. A reservation or static IP prevents this.'
);

// ── NF Module 3: Ports and Protocols (dynamic) ────────────────────
const nfmod3 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'NF Module 3: Ports and Protocols' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(nfmod3[0].id,
  'What is the purpose of network ports in TCP/IP communication?',
  'Ports identify the physical network adapter a packet should arrive on',
  'Ports encrypt traffic between specific applications to prevent cross-application data exposure',
  'Ports identify which specific application or service on a device should receive incoming network traffic, allowing multiple services to run simultaneously on one device',
  'C',
  'A single IP address identifies the device. The port number identifies which of many running applications should receive the traffic. Without ports, a web server and email server on the same machine could not coexist.'
);
uq(nfmod3[1].id,
  'Why is RDP on port 3389 considered one of the highest-risk ports to expose to the internet?',
  'RDP traffic is unencrypted making it easy to intercept credentials in transit',
  'RDP has been a primary initial access vector for ransomware attacks through brute-force credential attacks and exploitation of known vulnerabilities in exposed systems',
  'RDP uses more bandwidth than other remote access protocols making it easy to detect',
  'B',
  'Exposed RDP is constantly attacked by automated tools testing credential combinations and known exploits. Many major ransomware incidents began with compromised RDP. It should never be exposed directly to the internet without strong controls.'
);
uq(nfmod3[2].id,
  'What does a port scan reveal about a target system and why do attackers perform them?',
  'Port scans reveal the physical location of a server by measuring response timing',
  'Port scans reveal the last login time on each discovered service to identify unused accounts',
  'Port scans identify which network ports are open and what services are running, giving attackers a map of available attack surfaces and the specific service versions to look up known vulnerabilities for',
  'A',
  'Open ports reveal what services are running on a target. Service version banners often reveal specific software versions. Attackers cross-reference these against vulnerability databases to select applicable exploits.'
);

// ── NF Module 4: Wi-Fi Security Standards (dynamic) ───────────────
const nfmod4 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'NF Module 4: Wi-Fi Security Standards' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(nfmod4[0].id,
  'Why is WEP considered completely insecure and never acceptable for use today?',
  'WEP supports too few simultaneously connected devices for modern households',
  'WEP has fundamental cryptographic weaknesses that allow its encryption key to be cracked using automated tools in minutes regardless of the key length or complexity used',
  'WEP is incompatible with all devices manufactured after 2010',
  'B',
  'WEP\'s RC4 implementation has well-documented cryptographic flaws. Tools like Aircrack-ng can capture enough traffic to derive the key in minutes. Using WEP is effectively the same as using no encryption.'
);
uq(nfmod4[1].id,
  'What specific security improvement does WPA3 provide over WPA2 for home Wi-Fi networks?',
  'WPA3 uses Simultaneous Authentication of Equals which prevents offline dictionary attacks against captured handshakes and provides unique session encryption for each connection',
  'WPA3 doubles the wireless range compared to WPA2 while maintaining the same security level',
  'WPA3 requires a longer minimum password length than WPA2 making brute force harder',
  'A',
  'WPA2 handshakes can be captured and password-guessed offline indefinitely. WPA3 SAE prevents offline cracking because each authentication attempt requires active interaction with the access point, making brute force impractically slow.'
);
uq(nfmod4[2].id,
  'Why does disabling WPS provide meaningful security improvement even if your Wi-Fi password is very strong?',
  'WPS creates a secondary hidden network that bypasses your main network password entirely',
  'WPS shares your Wi-Fi password with nearby devices automatically even without your action',
  'The WPS PIN method has a design flaw allowing the 8-digit PIN to be brute-forced in a few hours, providing access to your network regardless of how strong your actual Wi-Fi passphrase is',
  'C',
  'WPS PIN authentication is independent of your Wi-Fi password. The PIN flaw exists at the protocol level. An attacker who cracks the WPS PIN gains full network access without ever needing to attack your Wi-Fi password.'
);

// ── NF Module 5: Firewalls and NAT (dynamic) ──────────────────────
const nfmod5 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'NF Module 5: Understanding Firewalls and NAT' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(nfmod5[0].id,
  'How does your home router\'s stateful firewall protect internal devices from direct internet attacks?',
  'The router encrypts all internal traffic so attackers cannot read it even if they intercept it',
  'The router blocks all traffic from foreign countries where most attacks originate',
  'The router only forwards response traffic to connections your devices initiated. Unsolicited inbound connection attempts from the internet have no matching state entry and are dropped',
  'C',
  'Stateful inspection tracks which connections your devices opened. An attacker attempting to connect directly to your computer sends traffic the router has no record of initiating, so it discards the packets before they reach your device.'
);
uq(nfmod5[1].id,
  'What security risk does enabling UPnP on your router create?',
  'UPnP consumes excessive router memory potentially causing instability',
  'UPnP allows any device or software on your network including malware to automatically open ports on your router without your knowledge or approval',
  'UPnP shares your router admin password with connected devices for configuration purposes',
  'B',
  'UPnP lets applications configure port forwarding automatically for convenience. Malware on an infected device can use UPnP to open ports creating persistent access paths from the internet to the infected machine without triggering any alerts.'
);
uq(nfmod5[2].id,
  'What is a DMZ in network security and what type of systems are placed in it?',
  'A DMZ is a network segment accessible from the internet but isolated from the internal network, used for servers that must accept public connections like web servers so a compromise there cannot directly reach internal systems',
  'A DMZ is a restricted internal zone where only administrator accounts can operate',
  'A DMZ is a high-speed network segment used for latency-sensitive applications like video conferencing',
  'A',
  'DMZ stands for demilitarized zone. Servers in the DMZ face the internet but firewall rules prevent them from initiating connections to the internal network. A compromised DMZ server cannot pivot to internal systems directly.'
);

// ── NF Module 6: VPNs and Tunneling (dynamic) ─────────────────────
const nfmod6 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'NF Module 6: VPNs and Tunneling' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(nfmod6[0].id,
  'What does a VPN tunnel do to your network traffic?',
  'It encrypts all your traffic and routes it through a VPN server so that local network observers see only encrypted data going to the VPN server rather than your actual destinations and content',
  'It compresses your traffic to make downloads faster through the encrypted channel',
  'It routes your traffic through a government-monitored server that provides additional protection',
  'A',
  'The VPN tunnel wraps your traffic in encryption before it leaves your device. Anyone on your local network, your ISP, or anyone intercepting your traffic sees only encrypted data destined for the VPN server. Your actual destinations are hidden.'
);
uq(nfmod6[1].id,
  'What is split tunneling in a corporate VPN context?',
  'A security feature that automatically disconnects VPN when it detects the user is on a trusted network',
  'A method of dividing VPN encryption keys between two servers for additional security',
  'A configuration where work-related traffic routes through the corporate VPN while personal traffic goes directly to the internet, improving personal browsing performance while maintaining corporate security for work traffic',
  'C',
  'Split tunneling balances security and performance. Work traffic through the VPN gets corporate security controls. Personal traffic bypasses the VPN for better speed. Full tunneling sends all traffic through the VPN giving the organization visibility into everything.'
);
uq(nfmod6[2].id,
  'How does Tor provide stronger anonymity than a VPN?',
  'Tor is faster than VPN so traffic arrives before it can be logged',
  'Tor routes traffic through three independent relays with layered encryption where each relay only knows the previous and next hop, so no single entity knows both the origin and destination',
  'Tor encrypts traffic with military-grade encryption that VPNs are not permitted to use commercially',
  'B',
  'VPN providers know your identity and your destinations. Tor separates this knowledge across three relays using onion encryption. No single relay knows both who you are and where you are going. Even a compromised relay reveals only partial information.'
);

// ── NF Module 7: DNS Security (dynamic) ───────────────────────────
const nfmod7 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'NF Module 7: DNS Security' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(nfmod7[0].id,
  'What is DNS cache poisoning and what harm can it cause?',
  'A performance problem where too many DNS entries fill the cache slowing lookup times',
  'An attack that injects false DNS records into a resolver\'s cache, redirecting users to attacker-controlled sites even when they type correct addresses',
  'A misconfiguration that causes DNS queries to fail intermittently',
  'B',
  'Cache poisoning causes a resolver to serve false IP addresses to everyone who uses it. Users who type correct addresses are silently redirected to fake sites where their credentials are stolen, without any visible warning.'
);
uq(nfmod7[1].id,
  'What does DNS over HTTPS protect that standard DNS does not?',
  'DNS over HTTPS encrypts DNS queries so your ISP and local network cannot monitor which domains you are looking up, protecting your browsing activity from network-level surveillance',
  'DNS over HTTPS verifies that website certificates match their DNS records preventing man-in-the-middle attacks',
  'DNS over HTTPS speeds up DNS resolution by using faster HTTP2 connection multiplexing',
  'A',
  'Standard DNS queries are sent in plain text. Your ISP and anyone on your local network can see every domain you look up even if the subsequent connections are HTTPS encrypted. DoH encrypts the query, hiding this from network observers.'
);
uq(nfmod7[2].id,
  'How does using a malware-blocking DNS provider like Cloudflare 1.1.1.2 or Quad9 add a security layer?',
  'These providers encrypt all traffic not just DNS queries providing VPN-like protection',
  'These providers verify website certificates before returning DNS responses',
  'They refuse to resolve known malicious domains, so even malware that tries to contact command and control servers or phishing pages gets a failed lookup rather than a usable IP address',
  'C',
  'Malware-blocking DNS resolvers maintain lists of known malicious domains. When malware attempts to connect to its command server, the resolver returns an error instead of the real IP address. This limits malware functionality even on infected systems.'
);

// ── NF Module 8: Network Monitoring (dynamic) ─────────────────────
const nfmod8 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'NF Module 8: Network Monitoring Basics' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(nfmod8[0].id,
  'Why does network monitoring improve security incident detection?',
  'Network monitoring prevents attacks by blocking suspicious traffic before it reaches devices',
  'Network monitoring automatically patches vulnerabilities when suspicious traffic is detected',
  'Most security incidents generate distinctive network activity like unusual outbound connections, large data transfers, or scanning patterns. Monitoring converts invisible attacker activity into visible, actionable data',
  'C',
  'Attackers must communicate over the network to exfiltrate data, receive commands, and move laterally. Network monitoring detects these activities even when endpoint security has been evaded. Visibility is the prerequisite for response.'
);
uq(nfmod8[1].id,
  'What is Wireshark and what kind of security analysis can it support?',
  'An automated vulnerability scanner that tests your network for known weaknesses',
  'A packet capture and analysis tool that shows the actual content of network traffic, useful for verifying encryption is working, diagnosing application problems, and investigating suspicious connections',
  'A network performance monitoring tool that tracks bandwidth usage over time',
  'B',
  'Wireshark captures raw network packets and displays their contents. Security analysts use it to see exactly what data is being transmitted, verify that sensitive data is encrypted, and investigate anomalous connections identified by other monitoring.'
);
uq(nfmod8[2].id,
  'Why is maintaining persistent network logs valuable even when no incident is currently occurring?',
  'Persistent logs are required by most internet service provider agreements',
  'Persistent logs allow real-time threat blocking by comparing current traffic against historical baselines',
  'Security incidents are often detected days or weeks after initial compromise. Historical network logs allow investigators to reconstruct what happened during the compromise period and determine scope and impact',
  'A',
  'The gap between initial compromise and detection is often weeks. Without historical logs, investigators cannot determine what data was accessed, which systems were reached, or how the attacker moved. Logs retained before the incident enable retrospective analysis.'
);

// ── NF Module 9: Common Network Attacks (dynamic) ─────────────────
const nfmod9 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'NF Module 9: Common Network Attacks' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(nfmod9[0].id,
  'What is a man-in-the-middle attack and how does HTTPS help defend against it?',
  'An attacker positions themselves between two communicating parties to intercept and potentially modify traffic. HTTPS encryption makes intercepted data unreadable and certificate validation detects unauthorized intermediaries',
  'An attack where a third party joins a two-person video call without invitation, defended against by using end-to-end encrypted calling apps',
  'A social engineering attack where an attacker impersonates both parties in a business negotiation simultaneously',
  'A',
  'MITM attacks intercept traffic between you and your destination. HTTPS makes the intercepted data unreadable ciphertext. Certificate pinning and HSTS prevent attackers from substituting their own certificate to decrypt the traffic.'
);
uq(nfmod9[1].id,
  'What is ARP poisoning and what type of attack does it enable?',
  'A malware attack that corrupts the Windows ARP cache requiring a system reinstall',
  'A network attack that floods the ARP cache with requests causing a denial of service',
  'An attack that sends false ARP responses to redirect local network traffic through an attacker\'s device, enabling man-in-the-middle interception of all local network communications',
  'C',
  'ARP translates IP addresses to MAC addresses on local networks without authentication. An attacker can claim their MAC address is the router\'s address, causing all traffic to flow through their machine where it can be captured and modified.'
);
uq(nfmod9[2].id,
  'How does a DNS amplification attack work and why is it effective for DDoS?',
  'DNS amplification exploits recursive DNS servers to spread malware across networks automatically',
  'DNS amplification sends small DNS queries with a spoofed source address set to the victim\'s IP, causing DNS servers to send large responses directly to the victim, amplifying traffic volume many times over',
  'DNS amplification poisons DNS caches at multiple ISPs simultaneously to redirect all traffic',
  'B',
  'DNS responses are much larger than queries. By spoofing the victim\'s IP as the source, a small query causes a large response to be sent to the victim. Multiplied across thousands of DNS servers, this generates massive traffic the victim cannot absorb.'
);

// ── NF Module 10: Securing Home Network (dynamic) ─────────────────
const nfmod10 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'NF Module 10: Securing Your Network at Home' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(nfmod10[0].id,
  'What is the security benefit of reviewing connected devices in your router admin interface regularly?',
  'It allows you to prioritize bandwidth for your most important devices',
  'It lets you identify unfamiliar devices that may indicate unauthorized network access, a compromised IoT device, or a neighbor using your Wi-Fi',
  'It helps the router firmware update more efficiently by knowing which devices are active',
  'B',
  'Every device on your network is a potential attack surface. Unfamiliar devices warrant investigation. An unknown device may be an unauthorized user, a forgotten forgotten old device, or an attacker who has gained Wi-Fi access.'
);
uq(nfmod10[1].id,
  'Why does placing IoT devices on a separate guest network improve your home security posture?',
  'Guest networks transmit IoT traffic using a more secure encryption standard than the main network',
  'Network segmentation means a compromised IoT device on the guest network cannot directly communicate with your computers and sensitive data on the main network',
  'Guest networks are monitored more closely by ISPs providing better protection for IoT devices',
  'A',
  'IoT devices have poor security track records. Isolating them means a compromised smart camera cannot pivot to attack your laptop. The guest network provides internet access for IoT functions while blocking lateral movement to sensitive devices.'
);
uq(nfmod10[2].id,
  'Why should you use a security-focused DNS provider like Cloudflare 1.1.1.2 or Quad9 at the router level rather than configuring it per device?',
  'Router-level DNS is faster than device-level DNS because it skips one network hop',
  'Router DNS settings only apply to wired connections while device settings also cover wireless',
  'Configuring DNS at the router level applies malware-blocking DNS protection to every device on the network including IoT devices that cannot be individually configured',
  'C',
  'Many IoT devices and smart appliances cannot have their DNS settings individually configured. Setting security DNS at the router level means the protection automatically applies to every device on the network without individual configuration.'
);

// ── SI Module 1: Safe Browsing (dynamic) ──────────────────────────
const simod1 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'SI Module 1: Safe Browsing Fundamentals' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(simod1[0].id,
  'What does the padlock icon in a browser address bar confirm?',
  'The website owner has been verified as a legitimate business by the certificate authority',
  'The website has no malware according to your browser vendor',
  'The connection is encrypted, but not that the site is legitimate. Phishing sites routinely display padlocks too',
  'C',
  'HTTPS certificates are available to anyone including malicious site operators. The padlock only tells you the connection is encrypted. Always verify the actual domain matches what you expect before trusting any site.'
);
uq(simod1[1].id,
  'Why is using bookmarks to navigate to important sites like your bank safer than searching each time?',
  'Bookmarks load faster than search results because they skip the search engine step',
  'Bookmarks go directly to the saved verified URL, while search results can be manipulated to show convincing malicious lookalike sites at the top',
  'Bookmarks are encrypted in the browser preventing them from being tracked',
  'B',
  'Search result manipulation and paid advertising can place convincing malicious lookalike sites above legitimate results, particularly for banking and financial services. Bookmarks bypass this risk by going directly to the verified address.'
);
uq(simod1[2].id,
  'When a download prompt appears unexpectedly on a website you did not deliberately choose to download something from, what should you do?',
  'Accept the download since the site needs to install a component to display content properly',
  'Accept it only if the file is under a few megabytes in size',
  'Decline or close the prompt. Legitimate sites do not initiate unsolicited downloads. This is likely a drive-by download attempt or malicious redirect',
  'A',
  'Unsolicited download prompts are a primary malware distribution mechanism. Legitimate websites do not push downloads without explicit user action. Any unexpected download prompt should be refused and the site abandoned.'
);

// ── SI Module 2: Online Privacy (dynamic) ─────────────────────────
const simod2 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'SI Module 2: Online Privacy Basics' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(simod2[0].id,
  'What is browser fingerprinting and why is it more persistent than cookie-based tracking?',
  'A tracking technique that identifies you based on unique characteristics of your browser and device configuration, and unlike cookies it cannot be cleared or blocked through standard browser settings',
  'A security feature that records your browser history to detect compromised accounts',
  'A technique where advertisers save your photo from social media to identify your browser sessions',
  'A',
  'Browser fingerprinting combines your browser version, screen resolution, fonts, time zone, and dozens of other attributes into a unique identifier. Unlike cookies, fingerprints cannot be deleted and persist across private browsing sessions.'
);
uq(simod2[1].id,
  'What does private browsing mode actually protect you from?',
  'It protects you from all tracking including your ISP, employer network, and the websites you visit',
  'It provides complete anonymity making your activity invisible to all parties',
  'It prevents your local browser from saving history, cookies, and form data, but does not hide your activity from your ISP, employer, or the websites you visit',
  'C',
  'Private browsing is local only. It prevents the browser on that device from storing session data. Your ISP still sees your traffic, your employer\'s network still logs connections, and websites still identify you through your IP address and account logins.'
);
uq(simod2[2].id,
  'How does using email aliases like those from SimpleLogin or Firefox Relay protect your privacy?',
  'Email aliases encrypt your messages before they leave your device providing end-to-end protection',
  'Email aliases block advertising emails automatically without requiring you to unsubscribe',
  'Aliases let you use unique forwarding addresses per service. When a service is breached or sells your address you can identify the source and delete just that alias without changing your real email address',
  'B',
  'Each alias is a unique address that forwards to your real inbox. If you used alias+shopping@service.com and start receiving spam there, you know that shopping service leaked your address. Delete the alias and the spam stops without affecting your real address.'
);

// ── SI Module 3: Social Media Safety (dynamic) ────────────────────
const simod3 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'SI Module 3: Social Media Safety' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(simod3[0].id,
  'Why should you review social media privacy settings periodically rather than setting them once?',
  'Privacy settings expire annually and must be renewed to remain active',
  'Platforms periodically change their default privacy settings, sometimes expanding what is publicly shared after policy updates, so settings that were correct last year may no longer reflect your preferences',
  'Social media algorithms reset privacy preferences based on your activity patterns',
  'B',
  'Social platforms change their interfaces and defaults, sometimes broadening what is visible after policy changes or app updates. Settings you configured correctly when you joined may have been modified without clear notification.'
);
uq(simod3[1].id,
  'What is the privacy risk of participating in popular social media trend formats that ask about your childhood or personal history?',
  'These trends are designed to collect answers to common security questions like first pet, childhood street, and school mascot that are used in account recovery and identity verification systems',
  'These trends harvest your responses to build advertising profiles without your knowledge',
  'These trends expose your approximate age making you more vulnerable to age-targeted scams',
  'A',
  'The most viral trend formats ask exactly the questions that authentication systems use for account recovery: first pet, childhood street, first car, school name. The entertaining framing disguises systematic security question harvesting.'
);
uq(simod3[2].id,
  'A social media friend sends you a message with a link saying you need to see this about yourself. What is the likely situation?',
  'It is a genuine concern from your friend about something they found online involving you',
  'It is a platform notification that your friend tagged you in a post',
  'Your friend\'s account has likely been compromised and is sending malicious links to their contact list. Verify with your friend through a separate channel before clicking',
  'C',
  'Compromised accounts are used to send malicious links to contact lists because friends are more likely to click links from people they trust. Verify through a phone call or separate message before clicking any unexpected link from a contact.'
);

// ── SI Module 4: Safe Online Shopping (dynamic) ───────────────────
const simod4 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'SI Module 4: Safe Online Shopping' ORDER BY mq.id ASC`).all();
// Correct: C, A, B
uq(simod4[0].id,
  'Why do credit cards provide better fraud protection than debit cards for online shopping?',
  'Credit cards have lower transaction fees that make fraud more expensive for merchants',
  'Credit card fraud is covered by law enforcement while debit fraud requires civil litigation',
  'Credit card chargebacks reverse fraudulent charges and the bank absorbs the loss while debit card fraud draws directly from your bank account and recovery is slower and less certain',
  'C',
  'Credit card chargebacks are a strong consumer protection mechanism. The card issuer disputes the charge with the merchant and provisionally credits your account. Debit fraud accesses your actual bank balance and recovery requires a bank investigation that can take weeks.'
);
uq(simod4[1].id,
  'What payment methods should you absolutely refuse to use when shopping online regardless of the reason given?',
  'Wire transfers, gift cards, Zelle, and cryptocurrency. These are irreversible payment methods favored by fraudsters precisely because chargebacks and recovery are impossible',
  'Only debit cards since they lack chargeback protection',
  'International credit cards since they charge higher foreign transaction fees',
  'A',
  'Irreversible payment methods are the universal signature of fraud. No legitimate retailer requires gift cards or wire transfers. When a seller insists on these methods the purchase is almost certainly fraudulent and your money will not be recoverable.'
);
uq(simod4[2].id,
  'What is a virtual card number and how does it protect you when shopping online?',
  'A temporary card number generated by your bank or card issuer for a specific transaction, which limits exposure if the merchant is breached since the number is not your real card',
  'A card number stored only in your browser that cannot be intercepted in transit',
  'A prepaid card number loaded with a specific amount limiting your maximum loss to that amount',
  'B',
  'Virtual card numbers are single-use or merchant-locked numbers linked to your real account. A merchant breach exposes only the virtual number which is useless elsewhere. Your real card number is never exposed to the merchant.'
);

// ── SI Module 5: Email Safety (dynamic) ───────────────────────────
const simod5 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'SI Module 5: Email Safety and Spam' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(simod5[0].id,
  'What is the most important thing to verify when evaluating whether an email is legitimate?',
  'The actual sending email address in the From field, not just the display name which can be set to anything',
  'Whether the email contains a company logo and professional formatting',
  'Whether the email was sent during normal business hours',
  'A',
  'Display names can be set to any text including your CEO\'s name or your bank\'s name. The actual email address in the From field is what reveals the truth. Always expand the sender field to see the full address, not just the display name.'
);
uq(simod5[1].id,
  'Why should you never click an unsubscribe link in an email you did not sign up for?',
  'Unsubscribe links in legitimate emails always work but in spam they should be avoided',
  'Spam filter laws require all commercial emails to include unsubscribe links making them safe to use',
  'Clicking unsubscribe in malicious spam confirms your email address is active and monitored, typically resulting in increased spam rather than reduced',
  'C',
  'Legitimate companies respect unsubscribe requests. In malicious spam, the unsubscribe link is a confirmation trap. Clicking it signals that your address is real and actively monitored, making it more valuable to spammers who then sell it or increase volume.'
);
uq(simod5[2].id,
  'What are SPF, DKIM, and DMARC and what do they collectively protect against?',
  'They are antivirus scanning protocols that check email attachments before delivery',
  'They are browser security standards that verify email sender certificates',
  'They are email authentication standards that allow receiving servers to verify that emails claiming to be from a domain were actually authorized by that domain, protecting against email spoofing',
  'B',
  'SPF specifies authorized sending servers, DKIM adds cryptographic signatures to messages, and DMARC tells receivers what to do with failures. Together they make it significantly harder for attackers to forge your domain in phishing campaigns.'
);

// ── SI Module 6: Public Wi-Fi Safety (dynamic) ────────────────────
const simod6 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'SI Module 6: Public Wi-Fi Safety' ORDER BY mq.id ASC`).all();
// Correct: B, C, A
uq(simod6[0].id,
  'Why does using HTTPS not fully protect you on public Wi-Fi without a VPN?',
  'HTTPS only encrypts file downloads not regular browsing on public networks',
  'HTTPS encrypts the content of your traffic but DNS queries still reveal which domains you visit, your destination IP addresses are visible, and the network operator can still monitor your activity patterns',
  'HTTPS encryption is automatically disabled by most public Wi-Fi networks for compatibility',
  'B',
  'HTTPS encrypts content but metadata remains visible. Your DNS lookups reveal domains even over HTTPS. Your IP connections reveal destinations. A VPN encrypts all of this before it leaves your device, protecting both content and metadata.'
);
uq(simod6[1].id,
  'What is an evil twin Wi-Fi attack and how do you protect against it?',
  'A rogue access point using the same network name as a legitimate one to intercept traffic from devices that connect to it. Protect against it by verifying the exact network name with staff and using a VPN',
  'A man-in-the-middle attack that duplicates websites to capture login credentials',
  'A malware attack that creates a second wireless network adapter on infected devices',
  'C',
  'Evil twin networks are indistinguishable by name from legitimate ones. Always confirm the exact network name with staff. Using a VPN provides protection even if you connect to an evil twin since your traffic is encrypted before leaving your device.'
);
uq(simod6[2].id,
  'Why should you disable auto-connect to open Wi-Fi networks on your mobile devices?',
  'Auto-connect drains battery faster by maintaining constant network scanning',
  'Auto-connect slows down initial connection speeds by trying too many networks simultaneously',
  'Auto-connect causes your device to automatically join networks with the same names as ones you have previously used, which attackers exploit by broadcasting familiar network names',
  'A',
  'Your device broadcasts probe requests for networks it remembers. Attackers use these to identify what networks to name their evil twin. Your device then connects automatically to the attacker\'s network. Disabling auto-connect requires you to consciously choose a network.'
);

// ── SI Module 7: Protecting Children Online (dynamic) ─────────────
const simod7 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'SI Module 7: Protecting Children Online' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(simod7[0].id,
  'What is grooming in the context of online child safety?',
  'The process of teaching children appropriate behavior for video calls and online meetings',
  'A parental control technique for gradually introducing children to internet access',
  'A process where an online predator builds trust with a child over time before attempting exploitation, often involving moving conversations to less monitored platforms',
  'C',
  'Grooming is a deliberate, patient process. Predators establish trust by presenting as peers or mentors, isolating the child from trusted adults, and normalizing inappropriate contact gradually before exploitation attempts.'
);
uq(simod7[1].id,
  'Why is having an open door policy where children can report uncomfortable online experiences without fear of punishment so important?',
  'It reduces the time children spend online by making them more aware of risks',
  'Children who fear punishment for online incidents are less likely to report grooming, harassment, or exploitation, allowing harmful situations to continue longer without adult intervention',
  'Reporting requirements help platforms improve their safety systems faster',
  'B',
  'Children often fear losing device access or getting in trouble more than the harm they are experiencing. A non-punitive approach ensures they come to trusted adults at the earliest sign of trouble rather than suffering in silence.'
);
uq(simod7[2].id,
  'What should you consider when a child wants to join a social media platform with a minimum age of 13?',
  'If the child is mature enough to understand internet safety the minimum age is just a guideline',
  'Age requirements are only suggestions since platforms cannot verify ages anyway',
  'The minimum age exists for real child safety and privacy reasons. Allowing early access means accepting the risks those policies were specifically designed to protect younger children from',
  'A',
  'COPPA minimum ages exist because children under 13 have specific privacy and safety vulnerabilities those platforms are not designed to protect. Allowing early access bypasses these protections deliberately, accepting the associated risks.'
);

// ── SI Module 8: Digital Footprint (dynamic) ──────────────────────
const simod8 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'SI Module 8: Digital Footprint Awareness' ORDER BY mq.id ASC`).all();
// Correct: A, B, C
uq(simod8[0].id,
  'What is the difference between an active and passive digital footprint?',
  'Active footprint consists of things you deliberately post online. Passive footprint is data collected without your direct action through tracking, browsing behavior, and data inference',
  'Active footprint is data you can delete while passive footprint is permanent',
  'Active footprint is public data while passive footprint is stored privately by companies',
  'A',
  'Your active footprint is what you choose to share. Your passive footprint is created automatically through tracking pixels, browsing behavior, app usage, and location data collected without your explicit participation. The passive footprint is typically much larger.'
);
uq(simod8[1].id,
  'What is the most effective way to understand what information is publicly visible about you online?',
  'Contact data broker companies directly and ask for a report of the data they hold',
  'Regularly search for your own name and email addresses in search engines and check image search results to see what is publicly discoverable',
  'Review your own social media profiles while logged in',
  'B',
  'Searching for yourself from a logged-out browser or incognito window shows what strangers and employers see. Search your name with and without quotes, include your location and employer, and check image results to get a realistic picture of your public profile.'
);
uq(simod8[2].id,
  'How do data broker opt-out requests reduce your digital footprint and what is their limitation?',
  'Opt-out requests permanently remove your data from all databases and prevent any future collection',
  'Opt-out requests are legally binding in all countries and must be honored within 24 hours',
  'Opt-out requests ask individual brokers to remove your data and many reputable ones comply, but the process must be repeated for hundreds of brokers and data can be re-collected over time',
  'C',
  'Most reputable data brokers honor opt-out requests but there are hundreds of them. Manual opt-outs are extremely tedious. Data can also be re-collected from public sources after removal. Services like DeleteMe automate and repeat the process but it requires ongoing effort.'
);

// ── SI Module 9: Recognizing Online Scams (dynamic) ───────────────
const simod9 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'SI Module 9: Recognizing Online Scams' ORDER BY mq.id ASC`).all();
// Correct: B, C, A
uq(simod9[0].id,
  'What psychological mechanism do scammers most consistently rely on across different scam types?',
  'Greed triggered by unexpected financial opportunities',
  'Urgency combined with authority, creating pressure to act immediately without time to think critically or verify the request through other channels',
  'Curiosity about surprising or alarming information about the target',
  'B',
  'Urgency prevents verification. Authority suppresses the instinct to question. Together they reliably override normal critical thinking regardless of whether the specific scam is a tech support call, phishing email, or romance scam.'
);
uq(simod9[1].id,
  'You receive an unexpected call from someone who sounds exactly like your adult child saying they are in trouble and need money immediately by wire transfer. What should you do?',
  'Send the money immediately since your child is in danger',
  'Ask them their pet\'s name to verify their identity before sending',
  'Hang up and call your child directly on their known phone number to verify. This is a common grandparent scam pattern using AI voice cloning or simple impersonation',
  'C',
  'Virtual kidnapping and emergency family scams specifically rely on panic preventing verification. Hanging up and calling the supposed victim on their real number takes seconds and immediately confirms whether the crisis is real.'
);
uq(simod9[2].id,
  'What payment method demand is a universal indicator that a transaction is fraudulent?',
  'Any request for payment by gift card, wire transfer, cryptocurrency, or Zelle as these are irreversible methods that no legitimate business requires for standard purchases',
  'Requests for credit card payment since legitimate businesses prefer bank transfers',
  'Any payment method that does not accept personal checks since checks provide a paper trail',
  'A',
  'Irreversible payment methods are the signature of fraud. Fraudsters demand them specifically because chargebacks and recovery are impossible. No legitimate retailer, government agency, or utility company requires gift cards or wire transfers for standard transactions.'
);

// ── SI Module 10: App Permissions (dynamic) ───────────────────────
const simod10 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'SI Module 10: Managing App Permissions' ORDER BY mq.id ASC`).all();
// Correct: C, A, B
uq(simod10[0].id,
  'A flashlight app requests access to your contacts, location, and microphone. What does this indicate?',
  'The app is a premium version that includes additional features requiring these permissions',
  'Modern flashlight apps require sensor data to adjust brightness automatically',
  'The app is requesting far more access than a flashlight requires. This suggests data collection beyond its stated function and the permissions should be denied',
  'C',
  'A flashlight app needs camera flash access only. Requests for contacts, location, and microphone are completely unrelated to its function and indicate the app intends to collect data for other purposes like advertising or resale.'
);
uq(simod10[1].id,
  'What is the privacy advantage of choosing while using the app instead of always for location permissions?',
  'While using the app setting uses less battery by disabling GPS between sessions',
  'While using the app limits location access to when you are actively in the app, preventing it from continuously tracking your movements in the background when you are doing other things',
  'While using the app setting is more accurate than always-on location',
  'A',
  'Always-on location allows apps to record your location continuously building a comprehensive record of everywhere you go. While using the app grants the location function you need without enabling background tracking of your daily movements.'
);
uq(simod10[2].id,
  'Why should you regularly audit and remove permissions from apps you rarely use?',
  'Unused app permissions slow down your device by consuming background processing cycles',
  'Unused app permissions require annual renewal which costs additional storage space',
  'Apps you rarely use may have changed ownership, been acquired by a data broker, or had their privacy practices change. Revoking permissions limits ongoing data collection from apps providing you little value',
  'B',
  'App ownership changes without user notification. An app you trusted years ago may now be owned by a company with very different data practices. Regular permission audits ensure you are only granting ongoing access to apps you actively use and trust.'
);

// ── DS Module 1: Windows Security (dynamic) ───────────────────────
const dsmod1 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'DS Module 1: Securing Windows 10 and 11' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(dsmod1[0].id,
  'Why is using a standard user account for daily computing rather than an administrator account an important security practice?',
  'Malware that infects a standard user account cannot install persistently, modify system settings, or spread because it is constrained by the account\'s limited privileges',
  'Standard accounts load Windows faster because they skip administrative startup checks',
  'Standard accounts are required for connecting to corporate networks by most IT policies',
  'A',
  'Administrator malware automatically inherits administrator privileges and can do anything to the system. Standard account malware is constrained by what that account can do, cannot install drivers, cannot modify security settings, and is significantly easier to remediate.'
);
uq(dsmod1[1].id,
  'What does Controlled Folder Access in Windows Security protect against?',
  'It prevents unauthorized users from accessing specific folders when you share your computer',
  'It blocks access to system folders from standard user accounts',
  'It prevents ransomware and unauthorized applications from modifying files in protected folders by only allowing trusted applications to write to those locations',
  'C',
  'Controlled Folder Access blocks write access to protected folders from any application not on the trusted list. Ransomware attempting to encrypt files in your Documents folder is blocked even if it has user-level access to run.'
);
uq(dsmod1[2].id,
  'What does enabling BitLocker encryption on your Windows system drive protect against?',
  'It protects against malware attempting to modify system files',
  'It prevents ransomware from encrypting your personal files',
  'It ensures that physical theft of your laptop or removal of the drive from your computer does not result in readable access to your files without your password',
  'B',
  'BitLocker protects data at rest. Without it, a thief who removes your hard drive can read every file without needing your Windows login. With BitLocker the drive is unreadable ciphertext without the encryption key.'
);

// ── DS Module 2: Android Security (dynamic) ───────────────────────
const dsmod2 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'DS Module 2: Securing Android Devices' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(dsmod2[0].id,
  'Why is installing apps only from the Google Play Store recommended over sideloading from other sources?',
  'Play Store apps are always free while sideloaded apps often have hidden costs',
  'Play Store apps use less battery than apps from other sources',
  'The Play Store uses Google Play Protect scanning and review processes that catch many malicious apps, while sideloaded apps bypass all these checks and have significantly higher rates of malicious content',
  'C',
  'Sideloaded APKs have no vetting. Play Protect scans Play Store apps continuously. While the Play Store is not perfect, sideloaded apps from unofficial sources are statistically far more likely to contain malware than those from the Play Store.'
);
uq(dsmod2[1].id,
  'What security risk does rooting an Android device create?',
  'Rooting voids the warranty causing the manufacturer to remotely disable security features',
  'Rooting removes Android\'s application sandbox and security model allowing any app to access all data and system resources without permission prompts',
  'Rooting installs unauthorized apps automatically from third-party repositories',
  'B',
  'Android\'s security is built on sandboxing and permission controls. Root access bypasses these, giving any app that obtains root the ability to access all other apps\' data, system files, and hardware without restriction.'
);
uq(dsmod2[2].id,
  'Why is reviewing apps with Accessibility access permission particularly important for Android security?',
  'Accessibility apps consume more battery making devices slow and draining faster',
  'Accessibility apps send usage statistics to Google that reduce your privacy',
  'Accessibility access grants broad device control including reading screen content and simulating user actions, making it a high-value permission that malware specifically targets to bypass other security controls',
  'A',
  'Accessibility services can read everything on screen, simulate taps and swipes, and intercept input. Legitimate accessibility tools for people with disabilities need this. Malware that obtains accessibility access can steal credentials displayed on screen and control the device.'
);

// ── DS Module 3: iOS Security (dynamic) ───────────────────────────
const dsmod3 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'DS Module 3: Securing iOS Devices' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(dsmod3[0].id,
  'What does iOS full disk encryption protect against and when is it automatically enabled?',
  'It protects against malware accessing your files and is enabled when you install a security app',
  'It protects against physical access to your data if the device is lost or stolen and is automatically enabled when you set a passcode',
  'It protects against network interception of iCloud backups and is enabled when you activate iCloud',
  'B',
  'iOS encrypts device storage automatically when a passcode is configured. Without the passcode the encrypted storage is unreadable. A stolen iPhone without a passcode is data-secure unlike older devices or those without passcodes.'
);
uq(dsmod3[1].id,
  'What is the security benefit of enabling Find My iPhone beyond just locating a lost device?',
  'Find My iPhone allows Apple to remotely install security updates on your device',
  'Find My iPhone enables remote lock and remote wipe, allowing you to protect your data from a stolen device even if you cannot physically recover it and enabling the device to report its last known location before the battery dies',
  'Find My iPhone shares your location with Apple for improved mapping services',
  'A',
  'Remote wipe eliminates data on a stolen device preventing access to your information. The send last location feature records where the device was when the battery died, which often helps law enforcement locate the device.'
);
uq(dsmod3[2].id,
  'What is iOS Lockdown Mode and for whom is it designed?',
  'A parental control feature that prevents children from installing apps without parent approval',
  'A feature that locks the device after a specified number of failed passcode attempts',
  'An extreme security hardening mode that disables certain functionality to protect against sophisticated targeted attacks, designed specifically for journalists, activists, executives, and others at elevated risk of state-level attacks',
  'C',
  'Lockdown Mode makes significant usability trade-offs including disabling certain attachment types, web technologies, and connection methods. These trade-offs are appropriate for users facing sophisticated nation-state level attacks but impractical for general use.'
);

// ── DS Module 4: Laptop Security (dynamic) ────────────────────────
const dsmod4 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'DS Module 4: Laptop Security Best Practices' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(dsmod4[0].id,
  'What is the most effective protection if your encrypted laptop is stolen?',
  'Full disk encryption ensures the thief cannot read your files without the encryption key even if they remove the storage drive and connect it to another computer',
  'A strong Windows password prevents access to the laptop since the thief cannot log in',
  'Remote wipe through Find My Device will erase the laptop before the thief can access it',
  'A',
  'Full disk encryption is the definitive protection for physical theft. A strong login password can be bypassed by removing the drive. Remote wipe only works if the device connects to the internet. Encryption protects the data regardless of what the thief does with the hardware.'
);
uq(dsmod4[1].id,
  'What is shoulder surfing and what are two effective countermeasures?',
  'A network attack that captures Wi-Fi traffic from nearby users, countered by using a VPN and HTTPS',
  'Physical theft of a laptop from behind the user while they are distracted, countered by laptop locks and staying in view of belongings',
  'Observing your screen or keyboard from nearby to capture sensitive information, countered by positioning yourself against a wall and using a privacy screen filter',
  'C',
  'Shoulder surfing is low-tech but effective for capturing credentials, sensitive documents, and confidential work. Walls eliminate the angle of attack from behind. Privacy filters make the screen readable only from directly in front of you.'
);
uq(dsmod4[2].id,
  'How should you configure screen timeout and lock settings on a laptop used in shared spaces?',
  'Set a long timeout to avoid frequent interruptions to your workflow',
  'Disable automatic locking since manually locking with the keyboard shortcut is sufficient',
  'Set the screen to lock after one to five minutes of inactivity so a brief absence does not expose your work to unauthorized access',
  'B',
  'Brief absences to use the bathroom, get coffee, or speak with someone are enough time for someone to access an unlocked screen. A one to five minute timeout balances security with the minor inconvenience of re-authenticating after short breaks.'
);

// ── DS Module 5: IoT Security (dynamic) ───────────────────────────
const dsmod5 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'DS Module 5: Smart Home and IoT Security' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(dsmod5[0].id,
  'Why are IoT devices considered particularly high-risk security components in a home network?',
  'IoT devices broadcast their data publicly by default requiring manual privacy configuration',
  'IoT devices are more frequently targeted by hackers because they are more valuable than computers',
  'IoT devices often have weak default credentials, infrequent security updates, long operational lifespans, and limited user interfaces that make security configuration difficult',
  'C',
  'The combination of insecure defaults, rare updates, and long use periods means IoT devices accumulate unpatched vulnerabilities over years. Users rarely interact with their router\'s security settings let alone their smart thermostat\'s.'
);
uq(dsmod5[1].id,
  'What is the most important first security step when setting up any new IoT device?',
  'Register the device with the manufacturer to receive warranty support and security notices',
  'Change the default username and password immediately to a strong unique credential before connecting the device to your network',
  'Disable all features except the ones you specifically intend to use',
  'B',
  'Default credentials for IoT devices are published in manuals, support forums, and attacker databases. A device left with default credentials is effectively accessible to anyone who knows the model. Change credentials before connecting to any network.'
);
uq(dsmod5[2].id,
  'What network configuration best reduces the risk from a compromised IoT device?',
  'Assign each IoT device a static IP address so you can monitor its traffic more easily',
  'Enable MAC address filtering on your router to restrict which devices can join',
  'Place all IoT devices on a separate network segment such as a guest network that provides internet access but cannot communicate with your computers and sensitive devices on the main network',
  'A',
  'Network segmentation is the most effective mitigation for IoT risk. A compromised device on the guest network cannot pivot to attack your laptop or NAS. It may be used for internet-based attacks but your local sensitive data remains protected.'
);

// ── DS Module 6: USB Security (dynamic) ───────────────────────────
const dsmod6 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'DS Module 6: USB and External Storage Security' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(dsmod6[0].id,
  'What is juice jacking and how does a USB data blocker protect against it?',
  'A battery drain attack where charging cables transmit malware through the power pins',
  'An attack using modified public USB charging ports to deliver malware or steal data while your device charges, blocked by a USB data blocker that passes power but physically disconnects the data pins',
  'A credential theft attack targeting mobile banking apps when using public Wi-Fi',
  'B',
  'USB ports carry both power and data. Modified public charging ports use the data pins to attack connected devices. A USB data blocker is a passthrough device that physically breaks the data connections while still allowing the power pins to charge your device.'
);
uq(dsmod6[1].id,
  'What is a USB Rubber Ducky and why is it dangerous?',
  'A USB device that automatically copies files from your computer to a hidden partition for data theft',
  'A hardware device disguised as a USB flash drive that registers as a keyboard and automatically types malicious commands faster than any human could, bypassing application-based security controls',
  'A USB device used by security researchers to test physical security awareness by placing it in visible locations',
  'A',
  'The Rubber Ducky and similar HID attack tools are completely transparent to the operating system because they identify as keyboards, which are inherently trusted. They can execute complex attack sequences in seconds before any user response is possible.'
);
uq(dsmod6[2].id,
  'How should you properly dispose of a hard drive that contains sensitive personal or business data?',
  'Format the drive multiple times using the quick format option to ensure data is overwritten',
  'Delete all files and empty the Recycle Bin before disposing of the drive',
  'Use dedicated data wiping software that overwrites all sectors, or physically destroy the drive if the data sensitivity warrants it. Standard deletion and formatting leaves data recoverable with readily available tools',
  'C',
  'Deleting files and formatting only removes file system references. The actual data remains and is trivially recoverable with free tools. Proper wiping overwrites every sector with random data multiple times, or physical destruction of the platters ensures data cannot be recovered.'
);

// ── DS Module 7: Software Updates (dynamic) ───────────────────────
const dsmod7 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'DS Module 7: Software Updates and Patch Management' ORDER BY mq.id ASC`).all();
// Correct: C, A, B
uq(dsmod7[0].id,
  'Why is the period between a vulnerability being discovered and a patch being applied the most dangerous time?',
  'Security researchers publicly announce vulnerabilities before patches exist giving attackers time to prepare',
  'Antivirus software cannot detect unknown vulnerabilities making systems completely unprotected',
  'Attackers actively scan for and exploit known unpatched vulnerabilities. The longer the delay between patch availability and installation, the greater the risk of exploitation',
  'C',
  'Attackers monitor security advisories and begin targeting known vulnerabilities as soon as they are public. The window between patch release and installation is when exploitation is most likely. Rapid patching closes this window.'
);
uq(dsmod7[1].id,
  'Why should browsers, browser plugins, and PDF readers receive the highest update priority?',
  'These applications are most frequently used making their updates most noticeable to users',
  'Internet-facing applications that process untrusted content from the web are the most frequently targeted by attackers and the most likely to contain exploitable vulnerabilities',
  'Browser updates are automatically applied without user action so they represent the least effort for the most gain',
  'A',
  'Applications that regularly process content from untrusted internet sources are the highest-value exploit targets. Browser vulnerabilities, PDF reader flaws, and plugin exploits are the most commonly used initial access vectors in real attacks.'
);
uq(dsmod7[2].id,
  'What is the benefit of using a software inventory or update management tool for keeping applications current?',
  'These tools negotiate better pricing for software licenses from developers',
  'These tools automatically remove applications that have been unused for more than 30 days',
  'They provide visibility into all installed software versions and can identify outdated applications that manual checking would easily miss, particularly less prominent utilities that do not have prominent update notifications',
  'B',
  'Manual update checking requires you to know every installed application and remember to check each one periodically. Inventory tools provide a comprehensive view and flag outdated versions including small utilities and plugins that rarely prompt for updates.'
);

// ── DS Module 8: Screen Lock and Authentication (dynamic) ─────────
const dsmod8 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'DS Module 8: Screen Lock and Authentication' ORDER BY mq.id ASC`).all();
// Correct: A, B, C
uq(dsmod8[0].id,
  'What is the security difference between biometric authentication and PIN-based authentication in legal contexts?',
  'Biometric authentication such as fingerprints and face can be compelled by legal authority in some jurisdictions while a PIN representing knowledge generally cannot be compelled under the same circumstances',
  'Biometrics are always more secure than PINs because they cannot be guessed or shared',
  'PINs can be legally compelled in all jurisdictions while biometrics cannot be compelled anywhere',
  'A',
  'This is an important distinction for high-risk individuals. In the US and some other jurisdictions, courts have ruled that compelling a biometric is like compelling a physical action while compelling a PIN is like compelling testimony, affording different legal protections.'
);
uq(dsmod8[1].id,
  'Why should you set your device screen to lock automatically after a short idle period rather than relying on manually locking it?',
  'Automatic locking also saves battery life by reducing display-on time between active sessions',
  'Manual locking is unreliable because brief distractions or emergencies cause people to forget, while automatic locking ensures the screen is always secured after a predictable idle period',
  'Automatic locking syncs your lock state with other devices on the same account',
  'B',
  'Manual locking requires remembering in every situation including stressful, rushed, or distracted ones. Automatic timeout ensures that even if you forget, the device locks itself after a short predictable window, limiting the exposure from any unattended moment.'
);
uq(dsmod8[2].id,
  'What makes Windows Hello with biometrics plus a PIN more secure than a password alone?',
  'Windows Hello credentials are stored in the cloud making them inaccessible to local attackers',
  'Windows Hello is required by Windows 11 for all accounts as a security baseline',
  'Windows Hello uses the device\'s secure enclave to store credentials that cannot be extracted, requires physical presence for biometric authentication, and the PIN is device-specific and never transmitted over networks',
  'C',
  'Windows Hello credentials never leave the device and are protected by the TPM. Unlike passwords which can be phished, reused, or captured in transit, Hello credentials are bound to the specific device and require the physical device to authenticate.'
);

// ── DS Module 9: Antivirus (dynamic) ──────────────────────────────
const dsmod9 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'DS Module 9: Antivirus and Endpoint Protection' ORDER BY mq.id ASC`).all();
// Correct: B, C, A
uq(dsmod9[0].id,
  'What is the difference between signature-based detection and behavioral detection in modern endpoint protection?',
  'Signature detection only works on email attachments while behavioral detection works on all file types',
  'Signature detection identifies known malware by matching against a database of known threat patterns, while behavioral detection identifies suspicious activity patterns that indicate malware even for previously unknown threats',
  'Behavioral detection is less reliable than signature detection because it generates false positives',
  'B',
  'Signature detection is blind to new malware until signatures are updated. Behavioral detection watches for ransomware-like file encryption activity, credential dumping behavior, or suspicious process injection regardless of whether the specific malware is known.'
);
uq(dsmod9[1].id,
  'Why should you never disable antivirus software at an application\'s request?',
  'Antivirus software is required by law in most enterprise environments and disabling it creates legal liability',
  'Disabling antivirus is unnecessarily disruptive since legitimate software can be installed with antivirus active',
  'No legitimate software requires antivirus to be disabled for installation. Requests to disable security software are a manipulation technique used by malware to remove protection before executing its payload',
  'C',
  'If an installer cannot run with antivirus active, the antivirus is detecting something concerning about it. Legitimate installers are designed to coexist with security software. This request is the software telling you it cannot survive security scrutiny.'
);
uq(dsmod9[2].id,
  'What is Endpoint Detection and Response and how does it differ from traditional antivirus?',
  'EDR is antivirus software designed specifically for endpoint devices like laptops rather than servers',
  'EDR is a cloud-based antivirus service that updates signatures faster than locally installed software',
  'EDR provides continuous monitoring, behavioral analysis, and forensic investigation capabilities that go far beyond signature scanning, enabling detection of advanced threats and detailed incident response with full activity timelines',
  'A',
  'Traditional antivirus scans files on access. EDR continuously records system activity, correlates events across processes and time, identifies sophisticated attack patterns that span multiple actions, and provides investigators with complete attack timelines.'
);

// ── DS Module 10: Device Disposal (dynamic) ───────────────────────
const dsmod10 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'DS Module 10: Device Disposal and Data Wiping' ORDER BY mq.id ASC`).all();
// Correct: C, A, B
uq(dsmod10[0].id,
  'Why is performing a standard factory reset insufficient for securely wiping a device before disposal?',
  'Factory resets only wipe user settings but leave the operating system files intact which contain browsing history',
  'Factory resets require an internet connection to complete securely and may fail without one',
  'Standard factory resets on older devices without encryption may leave data recoverable with forensic tools. A secure wipe requires encryption followed by factory reset or specialized data destruction software',
  'C',
  'On unencrypted devices, factory reset removes file system pointers but leaves data on storage media recoverable with widely available tools. Encrypting the device first then resetting ensures the reset removes the keys needed to interpret the stored data.'
);
uq(dsmod10[1].id,
  'What is the recommended approach for disposing of a hard drive containing highly sensitive financial or medical records?',
  'Physical destruction of the storage media by shredding, degaussing, or drilling through the platters ensures data cannot be recovered by any means',
  'Formatting the drive three times with the full format option ensures complete data removal',
  'Using a Department of Defense standard wipe tool that overwrites data seven times is sufficient for all sensitivity levels',
  'A',
  'For highly sensitive data, software-based wiping is adequate for most purposes but physical destruction provides absolute certainty. Hard drive shredders, degaussers, and professional data destruction services provide verifiable destruction certificates.'
);
uq(dsmod10[2].id,
  'Before donating your old smartphone to a charity or giving it to a family member, what preparation is required?',
  'Delete all apps manually before performing a factory reset to ensure app data is removed before the reset process',
  'Remove the SIM card and memory card, sign out of all accounts, then perform a factory reset. On modern encrypted devices this effectively secures the data',
  'Simply removing your accounts from the device is sufficient since apps store data in the cloud rather than on the device',
  'B',
  'The critical steps are signing out of all accounts to prevent the recipient from accessing your cloud data and services, and factory resetting to remove local data. On modern encrypted devices the reset removes the encryption key making remaining data unreadable.'
);

// ── PP Module 1: Data Brokers (dynamic) ───────────────────────────
const ppmod1 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'PP Module 1: Understanding Data Brokers' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(ppmod1[0].id,
  'What types of personal information do data brokers typically aggregate and sell?',
  'Name, address, phone number, relatives, estimated income, political affiliation, purchasing behavior, health interests, and location history gathered from public records, loyalty programs, and online tracking',
  'Only information you have deliberately made public on social media profiles',
  'Only financial records obtained from credit reporting agencies',
  'A',
  'Data brokers aggregate information from dozens of sources including public records, voter registrations, social media, loyalty programs, app data, and purchasing records. The resulting profiles are often more detailed than people expect and include sensitive inferences.'
);
uq(ppmod1[1].id,
  'Why can data broker profiles create security risks beyond privacy concerns?',
  'Data broker profiles are used to generate targeted advertising that can include malicious links',
  'Data broker profiles reduce your credit score by increasing the number of entities that have accessed your information',
  'Data broker profiles provide attackers with detailed personal information that can be used to answer security questions, build convincing pretexts for social engineering, and target spear phishing attacks',
  'C',
  'A detailed profile including your relatives names, previous addresses, employer, and daily patterns gives attackers precisely the information needed to build convincing impersonations and answer the security questions protecting your accounts.'
);
uq(ppmod1[2].id,
  'What is the most practical approach to reducing your data broker profile?',
  'Avoiding the internet entirely to prevent new data collection',
  'Contacting each broker individually which takes hours but is free and effective for the brokers you reach',
  'Using a data removal service like DeleteMe that automates opt-out requests across hundreds of brokers and repeats the process since data can be re-collected over time',
  'B',
  'Manual opt-outs are free but there are hundreds of brokers and the process must be repeated. Automated services handle this continuously. The choice depends on your time versus money trade-off and how important reducing your profile is to you.'
);

// ── PP Module 2: Browser Privacy (dynamic) ────────────────────────
const ppmod2 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'PP Module 2: Browser Privacy Settings' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(ppmod2[0].id,
  'What is the purpose of blocking third-party cookies in your browser settings?',
  'Third-party cookies slow down page loading by requiring additional server connections',
  'Third-party cookies are primarily used by advertising and analytics companies to track you across multiple different websites and blocking them significantly reduces cross-site behavioral tracking',
  'Third-party cookies create security vulnerabilities that allow cross-site scripting attacks',
  'B',
  'First-party cookies serve legitimate purposes like keeping you logged in. Third-party cookies from external domains primarily serve cross-site tracking for advertising profiling. Blocking them has minimal impact on functionality while significantly reducing tracking.'
);
uq(ppmod2[1].id,
  'What is browser fingerprinting and why can it track you even when you clear cookies?',
  'Browser fingerprinting identifies you based on the unique combination of your browser version, screen resolution, installed fonts, time zone, and dozens of other device characteristics that persist regardless of cookie deletion',
  'Browser fingerprinting is a security feature that records your activity to detect account compromise',
  'Browser fingerprinting only works when you are logged into a Google or Facebook account',
  'A',
  'Unlike cookies which can be deleted, fingerprint characteristics are properties of your browser and hardware that remain constant. Clearing cookies starts a fresh tracking session but fingerprinting can re-identify you immediately on your next visit.'
);
uq(ppmod2[2].id,
  'What privacy advantage does a search engine like DuckDuckGo offer compared to Google?',
  'DuckDuckGo provides more accurate search results because it indexes more web pages',
  'DuckDuckGo loads search results faster because it does not run advertising code',
  'DuckDuckGo does not build user profiles based on search history or personalize results based on past behavior, preventing your searches from contributing to a detailed behavioral profile',
  'C',
  'Google\'s business model requires building detailed profiles from search activity to serve targeted advertising. DuckDuckGo\'s model does not involve user profiling. Searches are not linked to your identity or history.'
);

// ── PP Module 3: Social Media Privacy (dynamic) ───────────────────
const ppmod3 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'PP Module 3: Privacy on Social Media' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(ppmod3[0].id,
  'What does changing your social media post audience to Friends Only actually accomplish from a privacy standpoint?',
  'It prevents the platform itself from accessing your posts for advertising purposes',
  'It removes your posts from Google and other search engine indexes immediately',
  'It limits post visibility to your accepted connections rather than making posts publicly searchable, though the platform still has full access to your content',
  'C',
  'Friends Only limits who among public internet users can see your posts. The platform itself retains full access to all your content regardless of audience settings. This is an important distinction when evaluating what privacy the setting actually provides.'
);
uq(ppmod3[1].id,
  'Why is reviewing and removing connected third-party apps from your social media accounts an important privacy step?',
  'Connected apps slow down your social media experience by running simultaneously in the background',
  'Connected apps retain ongoing access to your profile data and posting ability. Apps you authorized years ago may have been acquired, breached, or changed their data practices without notification',
  'Connected apps frequently post spam on your behalf to generate revenue for their developers',
  'B',
  'OAuth-connected apps maintain persistent access to your account. An app you trusted in 2018 may now be owned by a data broker or may have been compromised. Regular audits and removal of unused app connections reduces ongoing data exposure.'
);
uq(ppmod3[2].id,
  'What privacy risk does location data in social media posts create beyond simply showing where you are?',
  'Location data slows down post loading for your followers',
  'Location data from posts is automatically shared with law enforcement in most countries',
  'Aggregated location data from posts over time reveals your home address, workplace, daily routine, and regular locations creating a comprehensive movement profile that enables physical security risks and targeted attacks',
  'A',
  'Individual location tags seem harmless but aggregated over time they reveal your home, work, gym, church, and regular schedule. This pattern enables physical surveillance, burglary during known absences, and highly personalized social engineering attacks.'
);

// ── PP Module 4: Secure Messaging (dynamic) ───────────────────────
const ppmod4 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'PP Module 4: Secure Messaging Apps' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(ppmod4[0].id,
  'What does end-to-end encryption in messaging mean and why does it matter?',
  'Messages are encrypted on your device before sending and can only be decrypted by the recipient\'s device, meaning the messaging platform, your carrier, and anyone intercepting the traffic cannot read the content',
  'Messages are encrypted while stored on the messaging company\'s servers but decrypted for delivery',
  'Encryption protects messages from hackers but the platform can still access them for moderation',
  'A',
  'End-to-end encryption means the encryption key never exists on the platform\'s servers. Only the communicating parties have the keys. The platform stores and transmits encrypted ciphertext it mathematically cannot decrypt.'
);
uq(ppmod4[1].id,
  'Why is standard SMS not considered private even though it feels like a direct personal message?',
  'SMS messages are stored publicly in government databases accessible to anyone with a records request',
  'SMS messages are transmitted in plain text through multiple carrier systems and are accessible to carriers, potentially to law enforcement, and vulnerable to interception through SS7 protocol attacks',
  'SMS is shared with your carrier\'s advertising partners to fund the free messaging service',
  'C',
  'SMS was designed for reliability not privacy. Messages pass through carrier infrastructure in a form carriers can read, are subject to government requests, and the SS7 protocol that routes them has known vulnerabilities that enable interception.'
);
uq(ppmod4[2].id,
  'What is metadata in the context of messaging privacy and why does it matter even when messages are encrypted?',
  'Metadata is the file attachments sent along with messages',
  'Metadata is the actual text content of your messages stored separately from the encryption layer',
  'Metadata is information about your communications such as who you contacted, when, and how frequently, without including the content. It can reveal your relationships, daily patterns, and associations even without message content',
  'B',
  'Metadata is communications intelligence. Knowing you called a specific doctor, lawyer, or political organization at a specific time reveals sensitive information about your health, legal situation, or beliefs without reading a single word of the message itself.'
);

// ── PP Module 5: VPNs for Privacy (dynamic) ───────────────────────
const ppmod5 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'PP Module 5: VPNs for Privacy' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(ppmod5[0].id,
  'What does using a VPN actually protect your privacy from?',
  'It prevents all forms of tracking including account-based tracking and browser fingerprinting',
  'It makes you completely anonymous on the internet so your activities cannot be attributed to you',
  'It protects your traffic from ISP monitoring and hides your IP address from websites you visit, but the VPN provider itself can see your traffic and you remain trackable by services where you are logged in',
  'C',
  'A VPN shifts the privacy concern from your ISP to the VPN provider. It masks your IP from sites and prevents ISP traffic analysis. It does not prevent account-based tracking, fingerprinting, or the VPN provider themselves from monitoring your activity.'
);
uq(ppmod5[1].id,
  'Why does the jurisdiction of a VPN provider matter for privacy?',
  'VPN providers in certain countries have faster network infrastructure providing better performance',
  'VPN providers must comply with the laws of their operating jurisdiction including data retention laws, court orders, and intelligence sharing agreements that may require them to provide user data',
  'Some countries offer tax advantages to VPN companies making their services less expensive',
  'B',
  'A VPN provider based in a country with mandatory data retention laws may be legally required to log and retain your activity even if they claim a no-log policy. Jurisdiction determines what legal compulsion the provider faces.'
);
uq(ppmod5[2].id,
  'What advantage does Tor provide over a VPN for users requiring strong anonymity?',
  'Tor routes traffic through three independent relays where each relay knows only the previous and next hop, so no single entity knows both your identity and your destination simultaneously',
  'Tor is significantly faster than commercial VPN services making it suitable for all everyday use',
  'Tor is operated by government agencies providing legal protection that commercial VPNs cannot offer',
  'A',
  'VPN providers know your IP and your destinations. Tor separates this knowledge. The entry relay knows you but not your destination. The exit relay knows the destination but not you. No single relay has the complete picture.'
);

// ── PP Module 6: Email Privacy (dynamic) ──────────────────────────
const ppmod6 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'PP Module 6: Email Privacy' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(ppmod6[0].id,
  'Why is standard email not considered a private communication method?',
  'Standard email is monitored by government agencies in all countries by default',
  'Email messages are stored in readable form on servers, transit through multiple systems, and are accessible to email providers, system administrators, and potentially law enforcement, by design not by accident',
  'Email requires too many security approvals before delivery making it vulnerable to interception',
  'B',
  'Email was designed in the 1970s for reliability and interoperability, not privacy. Messages are stored on and pass through multiple servers in a form their operators can read. This is a fundamental architectural characteristic, not a security flaw that can be patched.'
);
uq(ppmod6[1].id,
  'What security and privacy benefit does ProtonMail specifically provide for messages between ProtonMail users?',
  'End-to-end encryption for messages between ProtonMail accounts meaning Proton\'s servers store only ciphertext they cannot decrypt even under legal compulsion',
  'Automatic deletion of messages after 24 hours preventing long-term data storage exposure',
  'Messages are stored in Switzerland benefiting from Swiss privacy laws regardless of where the recipient is located',
  'A',
  'ProtonMail\'s end-to-end encryption means messages are encrypted on the sender\'s device using the recipient\'s public key. Only the recipient\'s device can decrypt it. Proton\'s servers never have access to the plaintext even for court orders directed at Proton.'
);
uq(ppmod6[2].id,
  'What is an email alias and how does it protect your real email address?',
  'An alias is a nickname for your email account displayed to recipients instead of your real address',
  'An alias is a backup email address used when your primary account is experiencing problems',
  'An email alias is a forwarding address that delivers to your real inbox while hiding your actual email address. Each service gets a unique alias so you can identify and disable any source of spam without changing your real address',
  'C',
  'Aliases create disposable unique addresses per service. If you used alias+amazon@service.com and start receiving spam there, you know Amazon leaked your address. Disable that alias and the spam stops without affecting your real email address or other services.'
);

// ── PP Module 7: Location Privacy (dynamic) ───────────────────────
const ppmod7 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'PP Module 7: Location Privacy' ORDER BY mq.id ASC`).all();
// Correct: A, C, B
uq(ppmod7[0].id,
  'Can apps determine your location even when GPS is disabled? How?',
  'Yes, through Wi-Fi network positioning using known access point locations, cell tower triangulation, and Bluetooth beacon data, all of which can determine location without GPS',
  'No, GPS is the only accurate positioning technology available to mobile apps',
  'Only approximately through IP address geolocation which is accurate only to the city level',
  'A',
  'Multiple positioning technologies work without GPS. Wi-Fi positioning databases map known access points to physical locations. Cell towers triangulate positions from signal strength. Bluetooth beacons provide indoor positioning. Apps can use all of these with appropriate permissions.'
);
uq(ppmod7[1].id,
  'What long-term privacy risk does always-on location access for apps create?',
  'Always-on location drains battery significantly increasing device replacement frequency',
  'Always-on location enables apps to continuously build a comprehensive record of everywhere you go including your home, workplace, religious attendance, medical visits, and daily movement patterns',
  'Always-on location causes GPS satellite overcrowding reducing positioning accuracy for emergency services',
  'C',
  'Continuous location data reveals the most intimate details of your life. Your home address, where you work, which doctor and church you visit, your daily schedule, and your social connections are all inferrable from movement patterns over time.'
);
uq(ppmod7[2].id,
  'What is the most privacy-protective location permission setting for an app that occasionally needs your location?',
  'Deny all location access and manually input your location when the app needs it',
  'Allow only while using the app so location is accessible during active use but the app cannot track your location in the background',
  'Grant precise location only while using the app rather than approximate location to ensure the feature works correctly',
  'B',
  'While using the app grants location access only when you are actively interacting with the app. The moment you switch away or close it, location access stops. This provides necessary functionality without enabling the background tracking that creates the most significant privacy risks.'
);

// ── PP Module 8: Financial Privacy (dynamic) ──────────────────────
const ppmod8 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'PP Module 8: Financial Privacy' ORDER BY mq.id ASC`).all();
// Correct: C, B, A
uq(ppmod8[0].id,
  'What does placing a credit freeze accomplish and when should you use it?',
  'A credit freeze reduces your interest rates by signaling to lenders that you are a low-risk borrower',
  'A credit freeze limits how many credit inquiries lenders can make per year',
  'A credit freeze prevents new credit accounts from being opened in your name by blocking lenders from accessing your credit report, making it the most effective protection against new account identity theft',
  'C',
  'When a lender cannot pull your credit report they will not open new credit in your name. A freeze does not affect existing accounts. Freeze all three bureaus. Unfreeze temporarily when you apply for credit then refreeze.'
);
uq(ppmod8[1].id,
  'Why does using credit cards rather than debit cards for purchases provide better financial privacy protection?',
  'Credit card transactions are encrypted more strongly than debit card transactions',
  'Credit card fraud triggers chargebacks where the bank disputes the charge and credits your account during investigation, while debit fraud directly removes funds from your bank account with slower and less certain recovery',
  'Credit card companies sell less customer data to third parties than debit card issuing banks',
  'B',
  'The fundamental difference is where the money is while a dispute is resolved. Credit card fraud disputes leave your money in your account. Debit fraud drains your actual bank balance immediately, potentially causing cascading financial problems while you wait for investigation.'
);
uq(ppmod8[2].id,
  'Why should you access your bank account using mobile data rather than public Wi-Fi?',
  'Mobile banking apps require a cellular connection to verify your identity through the carrier',
  'Public Wi-Fi networks cannot process the encryption required for banking applications',
  'Mobile data travels through your carrier\'s encrypted infrastructure rather than a potentially monitored or compromised shared public Wi-Fi network, reducing exposure to man-in-the-middle attacks and network-level surveillance',
  'A',
  'Public Wi-Fi networks are shared untrusted environments. Sophisticated attackers can conduct certificate spoofing and session attacks. Your carrier\'s cellular network is a managed private infrastructure with different security characteristics than a coffee shop router.'
);

// ── PP Module 9: Identity Protection (dynamic) ────────────────────
const ppmod9 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'PP Module 9: Identity Protection and Monitoring' ORDER BY mq.id ASC`).all();
// Correct: B, A, C
uq(ppmod9[0].id,
  'What is the difference between a fraud alert and a credit freeze for identity protection?',
  'They are the same protection offered by different bureaus under different names',
  'A fraud alert adds a notice asking lenders to verify identity before extending credit while a freeze is more absolute and blocks lenders from accessing your report entirely',
  'A fraud alert only covers existing accounts while a freeze prevents both existing and new account fraud',
  'B',
  'A fraud alert is advisory, suggesting lenders take extra verification steps. A freeze is enforceable and prevents report access entirely. Freezes are stronger protection but require active management when you need to apply for legitimate credit.'
);
uq(ppmod9[1].id,
  'Why should you use random false answers to security questions rather than accurate personal information?',
  'False answers are easier to remember than real ones since they are more distinctive',
  'Real answers to common security questions like mother\'s maiden name, first pet, and childhood street are frequently discoverable through social media, public records, and data brokers, making them effectively public knowledge that provides no protection',
  'Security systems process incorrect answers faster than correct ones reducing login time',
  'A',
  'Security questions were designed when personal information was less accessible. Today these answers are findable through social media posts, genealogy databases, and data broker profiles. Treating them as passwords with randomly generated false answers stored in your password manager is the correct approach.'
);
uq(ppmod9[2].id,
  'What should you do if you discover your identity has been stolen?',
  'Contact only your bank since financial institutions coordinate all identity theft recovery',
  'Wait a few weeks to see if the problem resolves through normal fraud detection processes',
  'File a report with the FTC at IdentityTheft.gov for a recovery plan, place freezes at all three credit bureaus, contact affected institutions, and file a police report if applicable',
  'C',
  'Identity theft recovery requires coordinated action across multiple organizations. IdentityTheft.gov generates a personalized recovery plan. Freezes prevent new fraud while you recover. Affected institutions need notification. Police reports help with disputing fraudulent accounts.'
);

// ── PP Module 10: Privacy Audit (dynamic) ─────────────────────────
const ppmod10 = db.prepare(`SELECT mq.id FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id WHERE m.title = 'PP Module 10: Privacy Auditing Your Digital Life' ORDER BY mq.id ASC`).all();
// Correct: A, B, C
uq(ppmod10[0].id,
  'What is the correct first step in conducting a personal privacy audit?',
  'Create a comprehensive inventory of all accounts, apps, services, and devices you use before attempting to secure or delete anything',
  'Delete all social media accounts immediately to reduce your exposure as quickly as possible',
  'Change all your passwords to strong unique ones before assessing what needs to be audited',
  'A',
  'You cannot secure what you do not know exists. The inventory step ensures no forgotten accounts with old passwords, unused apps with persistent permissions, or obsolete services with stored payment information are overlooked in the review.'
);
uq(ppmod10[1].id,
  'Why is deleting unused accounts an important part of a privacy audit?',
  'Inactive accounts automatically share your data with advertising partners after a period of inactivity',
  'Unused accounts hold historical personal data, may have outdated weak passwords, lack MFA, and can be compromised without your knowledge to impersonate you or expose your data',
  'Deleted accounts reduce the number of data broker opt-outs required since brokers source from active accounts',
  'B',
  'Every dormant account is an unmonitored risk. Old passwords you changed elsewhere remain in use there. No MFA was ever added. A compromise of an account you forgot existed can expose years of historical data and be used to impersonate you.'
);
uq(ppmod10[2].id,
  'What does checking your email addresses at HaveIBeenPwned.com tell you and what should you do with the results?',
  'It shows you which email addresses have the most followers on social platforms',
  'It shows which companies have shared your email with advertisers',
  'It shows which data breaches have exposed your credentials, allowing you to immediately change passwords for the affected services and any other services where you used the same password',
  'C',
  'HaveIBeenPwned maintains a database of billions of credentials from known breaches. Finding your email there tells you which services were compromised and which passwords are now in attacker databases. Change those passwords immediately and check for reuse.'
);

console.log('\nAll questions updated successfully.');
console.log('Verifying answer distribution...');
const dist = db.prepare('SELECT correct_choice, COUNT(*) as count FROM module_quiz_questions GROUP BY correct_choice ORDER BY correct_choice').all();
dist.forEach(r => console.log(`  ${r.correct_choice}: ${r.count} questions`));
