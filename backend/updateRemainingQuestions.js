const { db, initDb } = require('./src/db');
initDb();

function uq(id, question_text, choice_a, choice_b, choice_c, correct_choice, explanation) {
  db.prepare(`
    UPDATE module_quiz_questions
    SET question_text=?, choice_a=?, choice_b=?, choice_c=?, correct_choice=?, explanation=?
    WHERE id=?
  `).run(question_text, choice_a, choice_b, choice_c, correct_choice, explanation, id);
  console.log('Updated question id', id);
}

// ── Section 1 continued: ids 234-277 ──────────────────────────────────────────
// These are the stale block from the tail of section 1 seeds.
// Target pattern across this block: A, B, C rotating

// id 234 already correct_choice=B — rewrite content, keep B
uq(234,
  'What is the most reliable way to verify a suspicious email link before clicking it?',
  'Forward the email to a colleague and ask if it looks legitimate',
  'Hover over the link to preview the destination URL without clicking it',
  'Right-click and choose open in a new tab to isolate any risk',
  'B',
  'Hovering reveals the actual destination URL in your browser status bar. This lets you confirm the domain matches what the email claims before your browser makes any request.'
);

// id 235 was B — reassign to A
uq(235,
  'Which email characteristic is the strongest single indicator of a phishing attempt?',
  'A sender address that uses a domain subtly different from the real organization such as paypa1.com instead of paypal.com',
  'An email that arrives outside of normal business hours',
  'An email that contains a logo or branded image',
  'A',
  'Domain spoofing is the most reliable technical indicator. Attackers register lookalike domains with character substitutions, extra words, or different top-level domains to bypass quick visual checks.'
);

// id 236 was B — reassign to C
uq(236,
  'You accidentally clicked a phishing link but did not enter any credentials. What is the correct next step?',
  'Monitor your accounts for unusual activity over the next week before reporting anything',
  'Clear your browser cache to remove any tracking cookies the site may have set',
  'Report the incident to your IT or security team immediately even without entering credentials',
  'C',
  'Simply loading a malicious page can trigger drive-by downloads that silently install malware. IT needs to assess and respond even when no credentials were entered.'
);

// id 237 was B — rewrite content keep B
uq(237,
  'What is the safest method for navigating to a login page you use regularly?',
  'Search for the site by name and use the first result that appears',
  'Use a bookmark you personally saved or type the address directly into the address bar',
  'Click the login link in the most recent email you received from the service',
  'B',
  'Bookmarks and direct entry eliminate the risk of landing on a lookalike phishing site. Search results can include paid ads pointing to fake sites and email links can be crafted by attackers.'
);

// id 238 was B — reassign to A
uq(238,
  'What is the single most trustworthy way to confirm you are on the real website for your bank?',
  'Verify the exact domain spelling in the browser address bar and confirm it matches what you expect',
  'Check that the page design and color scheme match what you remember from previous visits',
  'Look for a padlock icon anywhere on the page itself',
  'A',
  'Attackers pixel-perfect clone website designs. The URL domain is the only indicator they cannot fake while also directing your browser to their server. Always verify the full domain before entering credentials.'
);

// id 239 was B — reassign to C
uq(239,
  'Why does multi-factor authentication protect accounts even when a password is stolen?',
  'MFA encrypts stored passwords so stolen password databases cannot be used',
  'MFA alerts the original account owner whenever their password is used on a new device',
  'MFA requires a second proof of identity that attackers typically cannot obtain even after stealing the password',
  'C',
  'A stolen password alone is useless when the attacker also needs your physical device, authenticator app, or biometric confirmation. MFA breaks the single-credential attack model entirely.'
);

// id 240 was C — already not B, but rewrite for quality
uq(240,
  'You receive an urgent wire transfer request appearing to come from your CFO while she is traveling. What do you do?',
  'Process the transfer since the email address and signature look authentic',
  'Reply to the email requesting additional documentation to confirm the request',
  'Call the CFO directly using a phone number from your company directory to verbally confirm',
  'C',
  'BEC attacks during travel are a classic pattern because urgency and unavailability are plausible. Always verify financial requests through an independent channel you already have. Replying to the suspicious email only reaches the attacker.'
);

// id 241 was B — rewrite keep B
uq(241,
  'A vendor emails to say their banking details have changed and asks you to update payment records. What is the correct response?',
  'Update the records immediately since delayed payments could damage the vendor relationship',
  'Call the vendor on a phone number from your existing records to verbally confirm the change before making any updates',
  'Reply to the email asking them to resend from their official domain to confirm authenticity',
  'B',
  'Payment detail change requests are one of the most common BEC vectors. Verification must go through an independent channel you already trust. Calling a number provided in the suspicious email reaches the attacker.'
);

// id 242 was B — reassign to A
uq(242,
  'Which characteristic is the strongest indicator of a business email compromise attempt?',
  'An urgent request for a financial transaction combined with instructions to keep it confidential from other team members',
  'An email from a domain that uses https encryption in the web address',
  'An email that includes the recipient\'s full name and job title in the greeting',
  'A',
  'Urgency combined with secrecy is the signature of BEC fraud. Real executives understand that financial controls exist to protect the organization. A request to bypass those controls or hide the transaction from colleagues is a social engineering tactic.'
);

// id 243 was B — reassign to C
uq(243,
  'You receive a text claiming your package is on hold and asking you to click a link to confirm delivery details. What should you do?',
  'Click the link since package delivery texts are a common legitimate notification method',
  'Reply to the text asking for the full tracking number before clicking anything',
  'Go directly to the carrier website by typing the URL yourself and use your actual tracking number to check status',
  'C',
  'Smishing attacks frequently impersonate delivery services because the premise is plausible and creates mild urgency. Always navigate to the carrier site independently rather than following links in unsolicited texts.'
);

// id 244 was B — rewrite keep B
uq(244,
  'What makes smishing attacks particularly effective compared to email phishing?',
  'Text messages are not subject to the same spam filtering that email providers apply',
  'People tend to trust text messages more than emails and often act on them faster without applying the same level of scrutiny',
  'Carrier networks automatically verify the sender identity of all SMS messages',
  'B',
  'The familiarity and immediacy of text messaging lower people\'s guard. Most people have been conditioned to respond to texts quickly, and SMS lacks the visual red flag cues that email phishing training focuses on.'
);

// id 245 was B — reassign to A
uq(245,
  'What is the most effective habit for reducing your exposure to smishing attacks?',
  'Never clicking links in unsolicited text messages and navigating to services directly instead',
  'Blocking all unknown numbers so only saved contacts can send you messages',
  'Replying STOP to suspicious texts to remove yourself from attacker lists',
  'A',
  'Replying to smishing texts confirms your number is active and can increase contact. Blocking all unknowns is impractical. The most reliable defense is simply not following links from unsolicited texts and going directly to the relevant website.'
);

// id 246 was B — rewrite keep B
uq(246,
  'A caller claims to be from IT support and needs your password to fix an urgent access issue. What do you do?',
  'Provide the password since IT legitimately needs access to your account to troubleshoot it',
  'Tell the caller you will never share your password, hang up, and call IT back on the number from your company directory',
  'Ask the caller to email you a ticket number first before sharing anything',
  'B',
  'Legitimate IT staff do not need your password to work on systems. This is a classic vishing pretext. Always verify by calling back on a number you already have, never on one the caller provides.'
);

// id 247 was B — reassign to C
uq(247,
  'A call arrives showing your company name on caller ID but something about the conversation feels wrong. What matters most?',
  'Caller ID display name is verified by the phone carrier and can be trusted',
  'The correct response is to ask the caller for their employee ID before continuing',
  'Caller ID can be trivially spoofed, so the display name provides no authentication and you should verify the caller through an independent channel',
  'C',
  'Caller ID spoofing requires no technical expertise. The display name you see is provided by the caller, not verified by the carrier. Anyone can make a call appear to come from your company phone number.'
);

// id 248 was B — rewrite keep B
uq(248,
  'What is the safest policy for handling unsolicited calls requesting sensitive information or system access?',
  'Comply if the caller can provide two pieces of identifying information such as your name and department',
  'Politely end the call and initiate contact yourself using contact information from official company records',
  'Ask the caller to hold while you get a supervisor to listen in before sharing anything',
  'B',
  'The safest policy is to never act on the inbound call itself. Instead hang up and call back using a number you already have. This defeats spoofing and pretexting because the attacker cannot control the return call.'
);

// id 249 was B — reassign to A
uq(249,
  'You receive ten MFA push notification requests within five minutes that you did not initiate. What does this indicate?',
  'An attacker has obtained your password and is repeatedly trying to get you to approve their access by overwhelming you with notifications',
  'Your authenticator app has a synchronization bug causing duplicate notifications from a single login event',
  'Your account was logged into by IT for a scheduled maintenance task without prior notification',
  'A',
  'MFA fatigue attacks work by sending repeated push requests hoping the user approves one out of confusion or frustration. Unsolicited MFA requests mean your password is already compromised. Deny all requests and change your password immediately.'
);

// id 250 was B — reassign to C
uq(250,
  'Why does number-matching MFA make fatigue attacks significantly harder to execute?',
  'Number-matching adds a time delay between push attempts that slows attackers down',
  'Number-matching sends an alert to your IT team after three consecutive failed push approvals',
  'Number-matching requires the user to type a code displayed on the login screen into the authenticator app, meaning blind approval of an unsolicited notification is not possible',
  'C',
  'Standard push MFA allows approving a request without any interaction with the actual login screen. Number-matching forces the user to view the login screen and actively match a code, which an attacker conducting a remote fatigue attack cannot do.'
);

// id 251 was B — rewrite keep B
uq(251,
  'What do unexpected MFA prompts you did not initiate most likely indicate?',
  'Your authenticator app is performing a routine verification refresh',
  'Someone who has your password is actively trying to log in to your account right now',
  'The service provider is conducting a scheduled security audit of active sessions',
  'B',
  'MFA prompts are triggered by login attempts. An unsolicited prompt means a login attempt is occurring that you did not initiate, which almost always means your password has been compromised.'
);

// id 252 was B — reassign to A
uq(252,
  'You find a USB drive in the office lobby labeled Payroll Review Q4. What is the safest action?',
  'Turn it in to IT or security without plugging it in anywhere',
  'Plug it into an isolated test machine first to see what files are on it before passing it to IT',
  'Leave it where you found it since IT regularly sweeps for lost media',
  'A',
  'Labeled USB drives are a classic baiting attack. The enticing label is designed to make people plug it in. Any USB of unknown origin should go directly to IT without being connected to any machine.'
);

// id 253 was B — reassign to C
uq(253,
  'Someone you do not recognize walks closely behind you through a secured door as you badge in. What should you do?',
  'Continue walking since challenging people is not your responsibility as a non-security employee',
  'Hold the door open as a courtesy since they are likely a new employee or visitor',
  'Politely ask if they have a badge and direct them to the front desk if they do not, then report the incident to security',
  'C',
  'Tailgating is a primary physical security breach method. Holding the door as a courtesy directly undermines access control systems. Every person in a secured area should be able to badge through independently.'
);

// id 255 was B — rewrite keep B (id 254 does not exist per original output)
uq(255,
  'What is the safest way to check where a QR code will take you before fully loading the destination?',
  'Scan the QR code with your default camera app and check the URL preview before tapping to open it',
  'Use a QR scanner app that shows you the decoded URL before your browser opens it so you can inspect the destination domain',
  'Scan the QR code on a separate device from the one you use for sensitive accounts',
  'B',
  'A dedicated scanner that previews the URL before loading it lets you inspect the domain just like hovering over a hyperlink. This prevents automatic browser loading of the destination, which could trigger exploits before you can react.'
);

// id 256 was B — reassign to A
uq(256,
  'Your browser displays a certificate warning on a website you use regularly. What is the safest interpretation?',
  'Something has changed with the site\'s identity verification, which could indicate the site was compromised or you are being intercepted, and you should not proceed',
  'The site\'s certificate expired accidentally and it is safe to click through since the content has not changed',
  'The warning was triggered by a known browser bug and can be dismissed since regular sites always have valid certificates',
  'A',
  'Certificate warnings mean your browser cannot verify the site\'s identity. On a familiar site this is more alarming than on an unknown one. Possible causes include a compromised site, a man-in-the-middle attack, or misconfiguration. Do not proceed until the cause is confirmed.'
);

// id 257 was B — reassign to C
uq(257,
  'What habit most reliably protects against typosquatting attacks?',
  'Typing website addresses slowly and carefully to avoid making character errors',
  'Using browser search rather than the address bar so the search engine filters out typosquatting domains',
  'Using bookmarks you personally created for every site you visit regularly so you never type addresses directly',
  'C',
  'Bookmarks completely eliminate the typosquatting attack surface for sites you visit regularly. You cannot arrive at a typosquatted domain from a bookmark you set yourself from the legitimate site.'
);

// id 258 was B — rewrite keep B
uq(258,
  'What is the most effective approach to managing unique strong passwords across dozens of accounts?',
  'Create a personal system using a memorable base password with site-specific suffixes appended',
  'Use a reputable password manager to generate and store fully random unique passwords for every account',
  'Write passwords in a secure notebook kept at home as an offline backup independent of any software',
  'B',
  'A password manager generates cryptographically random passwords and stores them encrypted. This is the only practical way to have truly unique strong passwords for every account without relying on patterns that reduce security.'
);

// id 259 was B — reassign to A
uq(259,
  'Why does reusing passwords across multiple sites create catastrophic risk from a single breach?',
  'Attackers run automated credential stuffing that instantly tests breached username and password pairs against hundreds of other services',
  'Password reuse makes patterns detectable by sophisticated password cracking algorithms',
  'Services automatically detect reused passwords and require changes that draw attention to the vulnerability',
  'A',
  'Credential stuffing is fully automated. Within hours of a breach being sold or leaked, botnets test those credentials across banking sites, email providers, and social media simultaneously. One reused password cascades across every service where you used it.'
);

// id 260 was B — reassign to C
uq(260,
  'Someone calls claiming to be from IT and needs your password to restore your account access. What is the correct response?',
  'Provide the password if they can correctly identify your manager\'s name and your department',
  'Ask them to send a help desk ticket number to your email first before sharing any credentials',
  'Tell them you do not share passwords with anyone, hang up, and call IT back on the official number from your company directory',
  'C',
  'Legitimate IT teams never need your password to work on accounts or systems. This is a textbook vishing pretext. Hang up and verify by calling IT yourself using a number you already have.'
);

// id 261 was B — rewrite keep B
uq(261,
  'A Word document you received by email asks you to click Enable Macros to view the full content. What do you do?',
  'Enable macros since Word requires them to display certain document formats and formatting',
  'Close the document immediately and report it to your security team without enabling macros',
  'Enable macros only if the email was sent from someone on your contact list',
  'B',
  'Macro-enabled documents are one of the primary malware delivery vectors. Legitimate documents do not require macros to display content. This prompt is a social engineering technique used to execute malicious code.'
);

// id 262 was B — reassign to A
uq(262,
  'Your files suddenly have unfamiliar extensions and you cannot open them. What has most likely happened?',
  'Your system has been infected with ransomware that encrypted your files and is now demanding payment',
  'A Windows update changed the default file associations requiring you to reassign programs to file types',
  'A storage drive failure caused partial data corruption affecting file headers',
  'A',
  'Sudden unexplained file extension changes with inaccessible content is the signature symptom of ransomware encryption. Disconnect the device from the network immediately to prevent spread before taking any other action.'
);

// id 263 was B — reassign to C
uq(263,
  'What is the single most important defense against ransomware?',
  'Keeping antivirus software up to date so it can detect ransomware before it executes',
  'Paying the ransom quickly since data recovery from backups is slower and less complete',
  'Maintaining tested offline or immutable backups so you can restore your data without paying the ransom',
  'C',
  'Backups that ransomware cannot reach or modify are the only reliable recovery path. Antivirus helps but cannot catch every variant. Paying ransoms funds criminal operations and does not guarantee full recovery.'
);

// id 264 was B — rewrite keep B
uq(264,
  'A colleague is copying large amounts of company data to a personal USB drive before a scheduled resignation. What should you do?',
  'Assume there is a legitimate business reason since the person is still employed',
  'Report the behavior to your manager or security team since large data transfers before a departure are a recognized insider threat indicator',
  'Approach the colleague directly and ask them to stop before escalating to management',
  'B',
  'Data exfiltration before departure is one of the most consistent insider threat patterns. Reporting it to security through the proper channel is the correct action. Direct confrontation can trigger faster exfiltration or destruction of evidence.'
);

// id 265 was B — reassign to A
uq(265,
  'What does the principle of least privilege mean in practice for a regular employee?',
  'Each user should only have access to the specific systems and data required for their job and nothing beyond that',
  'Employees should use administrator accounts only when performing tasks that require elevated permissions',
  'Sensitive systems should require two employees to log in simultaneously to perform any action',
  'A',
  'Least privilege limits blast radius when an account is compromised. An attacker who gains access to a limited account can only reach systems that account can access. Overprivileged accounts turn a single compromise into a full breach.'
);

// id 266 was B — reassign to C
uq(266,
  'Which factor most significantly increases the risk that an employee becomes an insider threat?',
  'Having administrator access to critical systems',
  'Working remotely with less direct oversight from management',
  'Experiencing financial stress, job dissatisfaction, or a perceived grievance against the organization combined with access to sensitive systems',
  'C',
  'Insider threat research consistently identifies motivational factors combined with access as the primary risk profile. Technical access alone does not create an insider threat. The combination of motive and opportunity defines the risk.'
);

// id 267 was B — rewrite keep B
uq(267,
  'An auditor you have not met before calls asking for system access credentials for a compliance review. What do you do?',
  'Provide the credentials since compliance reviews are mandatory and auditors are authorized to request access',
  'Verify the audit through your management chain and have IT provide controlled access through proper channels rather than sharing credentials',
  'Ask the auditor to email their credentials request on official letterhead before acting',
  'B',
  'Legitimate audits are coordinated in advance through management and access is granted through formal IT processes. Auditors requesting credentials directly by phone is a social engineering pretext. Verify the audit exists before any access is provided.'
);

// id 268 was B — reassign to A
uq(268,
  'What is pretexting in the context of social engineering?',
  'Creating a fabricated but plausible scenario to manipulate a target into taking an action they would not otherwise take',
  'Sending a preliminary test email to verify an address is active before launching a phishing campaign',
  'Using technical reconnaissance to gather information about a target organization before attacking',
  'A',
  'Pretexting establishes a false context that makes a request seem legitimate. Examples include posing as IT support, a vendor, an auditor, or an executive. The believability of the scenario is the entire mechanism of the attack.'
);

// id 269 was B — reassign to C
uq(269,
  'Which response best counters social engineering pressure during a real-time interaction?',
  'Agreeing to the request and then quietly reversing the action after the call ends',
  'Matching the caller\'s urgency to demonstrate cooperation while asking clarifying questions that slow the process',
  'Slowing down, stating that you need to verify the request through official channels, and ending the interaction to do so independently',
  'C',
  'Social engineering exploits real-time pressure and the desire to be helpful. Slowing down and verifying independently completely defeats the attack. Any legitimate request will survive a brief verification delay.'
);

// id 270 was B — rewrite keep B
uq(270,
  'You are working from a coffee shop and need to access company resources. What is the minimum security requirement before doing so?',
  'Connect only if the cafe network has a password since open networks are the only ones unsafe',
  'Connect through your corporate VPN before accessing any company systems or data',
  'Use your phone as a hotspot only for email and use the cafe Wi-Fi for everything else',
  'B',
  'All public Wi-Fi is untrusted regardless of whether it has a password. A corporate VPN encrypts traffic between your device and company infrastructure, preventing interception on the local network.'
);

// id 271 was B — reassign to A
uq(271,
  'What is the primary security risk of using personal devices for work tasks without IT management?',
  'Personal devices lack the security controls, patch management, and endpoint visibility that IT-managed devices have, creating gaps attackers can exploit to access company data',
  'Personal devices automatically sync company data to personal cloud accounts creating uncontrolled data copies',
  'Using personal devices for work invalidates device warranties under most manufacturer agreements',
  'A',
  'Unmanaged personal devices cannot be verified for patch status, encryption, or malware presence. IT has no visibility into incidents and cannot remotely wipe them if lost. They represent a persistent blind spot in organizational security.'
);

// id 272 was B — reassign to C
uq(272,
  'Why should you lock your screen every time you step away from your computer even briefly?',
  'Screen savers reduce monitor burn-in but only activate after the lock screen is engaged',
  'Company policy requires it and violations are a disciplinary matter',
  'An unlocked unattended computer can be accessed by anyone in the physical environment in seconds, bypassing all network and authentication controls entirely',
  'C',
  'Physical access to an unlocked computer bypasses every logical security control. It takes seconds to copy files, install malware, or send emails from your account. No password, MFA, or network security protects an unlocked session.'
);

// id 273 was B — rewrite keep B
uq(273,
  'A colleague asks you to email them a confidential HR document so they can work on it from home. What is correct?',
  'Send it to their personal email since their work email may not be accessible from home',
  'Only share the document through company-approved secure channels and confirm the request through a separate communication before doing so',
  'Attach the document to a calendar invite so it is tracked in the calendar system',
  'B',
  'Sharing sensitive documents outside approved channels creates uncontrolled copies. Personal email has different security properties than company systems. Verifying the request separately prevents social engineering impersonation of a colleague.'
);

// id 274 was B — reassign to A
uq(274,
  'When you are uncertain how to classify a file or piece of information, what is the correct default action?',
  'Treat it as the most sensitive classification level applicable until a data owner or security team member clarifies the correct classification',
  'Share it only with your immediate team while the classification question is resolved',
  'Apply the classification of the most recent document you handled since that reflects current policy',
  'A',
  'Default to the highest applicable sensitivity when uncertain. Over-protecting information temporarily causes minimal harm. Under-protecting sensitive data can cause a breach that cannot be undone.'
);

// id 275 was B — reassign to C
uq(275,
  'Which of the following is an example of improper data handling?',
  'Emailing an encrypted file to a verified business partner using a company email account',
  'Printing a confidential document and collecting it immediately from the printer',
  'Discussing client account details in a public area where others can hear the conversation',
  'C',
  'Verbal disclosure of sensitive information in public spaces is a data handling failure regardless of whether any electronic system is involved. Shoulder surfing and overheard conversations are legitimate data loss vectors.'
);

// id 276 was B — rewrite keep B
uq(276,
  'You receive a voice message that sounds exactly like your manager asking you to transfer funds urgently. What should you do?',
  'Process the transfer since voice messages from known contacts are reliable authentication',
  'Call your manager back directly on their known number to verbally confirm the request before taking any action',
  'Reply to the voicemail by calling the number it came from to confirm',
  'B',
  'AI voice cloning can replicate anyone\'s voice from a small audio sample. The only reliable verification is reaching the person through a channel you already have, not the number or method used in the suspicious message.'
);

// id 277 was B — reassign to A
uq(277,
  'Why are AI-generated phishing emails harder to detect than traditional phishing emails?',
  'AI removes the spelling errors, grammatical mistakes, and awkward phrasing that were the most reliable visual indicators of phishing emails',
  'AI-generated emails are sent from verified domains making them bypass standard email authentication filters',
  'AI tools allow attackers to send emails that appear to come from inside your own organization',
  'A',
  'Traditional phishing training focused heavily on language quality as a detection signal. AI generation produces fluent professional prose indistinguishable from legitimate email, eliminating the most commonly taught detection cues.'
);

// id 278 was B — reassign to C
uq(278,
  'What is the most effective organizational defense against deepfake audio and video impersonation attacks?',
  'Training employees to analyze audio and video for compression artifacts that indicate AI generation',
  'Implementing AI-powered deepfake detection software on all incoming video calls',
  'Establishing verbal code words or out-of-band verification protocols for any request involving money, access, or sensitive data regardless of how convincing the request seems',
  'C',
  'Technical deepfake detection is an arms race that defenders are currently losing. Process-based controls like code words and mandatory independent verification are attacker-agnostic and work regardless of how convincing the impersonation becomes.'
);

// ── Section 2: Computer Troubleshooting remaining stale ids 279-311 ───────────

// id 279 was B — rewrite keep B
uq(279,
  'Your PC has become very slow. What is the first tool to use for diagnosis?',
  'Run a full antivirus scan since slowdown is almost always caused by malware',
  'Open Task Manager and sort by CPU and memory usage to identify any process consuming excessive resources',
  'Restart the computer and see if the slowdown persists before investigating further',
  'B',
  'Task Manager gives you immediate visibility into what is actually consuming your resources. Guessing the cause before looking at real data wastes time and may lead to unnecessary steps.'
);

// id 280 was B — reassign to A
uq(280,
  'Which of the following is a common cause of gradual PC performance degradation over months of use?',
  'Accumulated startup programs, browser extensions, and background services that were added incrementally and never removed',
  'Hard drive magnetism decreasing as the drive ages causing slower read and write speeds',
  'CPU clock speeds permanently reducing after extended use as a thermal protection measure',
  'A',
  'Startup bloat is the most common cause of gradual slowdowns that are not hardware-related. Each installed application that adds a startup entry or background service consumes resources before you even open anything.'
);

// id 281 was B — reassign to C
uq(281,
  'Task Manager shows a process using 95% of your CPU but you do not recognize the process name. What is the safest next step?',
  'End the process immediately in Task Manager to restore performance',
  'Restart the computer to clear the process and monitor whether it returns',
  'Search the exact process name online to determine if it is a legitimate system process or potential malware before taking action',
  'C',
  'Ending an unknown process could crash a legitimate system service or cause data loss. Searching the process name first tells you what it does, whether it is expected behavior, and the correct way to handle it if it is malicious.'
);

// id 282 was B — rewrite keep B
uq(282,
  'Your PC shows a Blue Screen of Death with the stop code MEMORY_MANAGEMENT. What does this indicate?',
  'Your operating system installation has become corrupted and needs a clean reinstall',
  'Windows detected a critical error related to RAM, which could indicate faulty memory, driver conflicts, or corrupted system files',
  'Your storage drive is failing and the BSOD is triggered when Windows tries to use the page file',
  'B',
  'MEMORY_MANAGEMENT stop codes point to RAM-related problems. The next step is running Windows Memory Diagnostic to test physical RAM and checking recent driver installs that may have introduced a conflict.'
);

// id 283 was B — reassign to A
uq(283,
  'What does the Windows command sfc /scannow do and when should you run it?',
  'It scans all protected Windows system files and replaces corrupted ones with cached correct versions, and you should run it when experiencing unexplained crashes or errors',
  'It scans your hard drive for bad sectors and marks them to prevent future writes, and you should run it monthly as preventive maintenance',
  'It scans installed applications for outdated versions and queues updates, and you should run it before major Windows updates',
  'A',
  'SFC specifically targets Windows system file integrity. It is the correct tool when you suspect OS file corruption is causing instability. Run DISM first to ensure the repair source itself is healthy before SFC uses it.'
);

// id 284 was B — reassign to C
uq(284,
  'How do you access Windows Memory Diagnostic to test your RAM?',
  'Open Device Manager, right-click your RAM under the Memory section, and select Run Diagnostic',
  'Open Command Prompt as administrator and run the command memcheck /full',
  'Search for Windows Memory Diagnostic in the Start menu, choose to restart now and check for problems, and review Event Viewer after the reboot',
  'C',
  'Windows Memory Diagnostic is a built-in tool accessible from the Start menu. It requires a reboot to run outside of Windows and logs results to Event Viewer under Windows Logs, System, after the test completes.'
);

// id 285 was B — rewrite keep B
uq(285,
  'Your internet is not working on your laptop but other devices on the same network work fine. Where do you start troubleshooting?',
  'Restart your router since the issue is always at the router level when only one device is affected',
  'Run the network troubleshooter on the laptop and check if the Wi-Fi adapter is enabled and the correct network is selected',
  'Reinstall your network adapter driver since device-specific issues indicate a driver problem',
  'B',
  'When only one device has the issue the problem is almost certainly on that device. The Windows network troubleshooter catches common issues like disabled adapters, wrong network selection, and IP conflicts before you resort to driver reinstalls.'
);

// id 286 was B — reassign to A
uq(286,
  'What command displays your current IP address and network configuration on Windows?',
  'ipconfig typed in Command Prompt, which shows your IP address, subnet mask, default gateway, and DNS servers for each network adapter',
  'netstat typed in Command Prompt, which shows your current IP address alongside all active network connections',
  'ping localhost typed in Command Prompt, which returns your local IP address in the response header',
  'A',
  'ipconfig is the correct command for viewing your current IP configuration. netstat shows active connections and ports. ping localhost tests the loopback interface but does not display your network configuration.'
);

// id 287 was B — reassign to C
uq(287,
  'Your IP address shows as 169.254.x.x. What does this indicate and what should you do?',
  'This is a valid private IP range assigned by your router to devices on the guest network',
  'This indicates you have been assigned a static IP that conflicts with another device and you should release and renew your lease',
  'This is an APIPA address meaning your device failed to obtain an IP from the DHCP server, indicating a connectivity problem with the router or DHCP service',
  'C',
  '169.254.x.x addresses are self-assigned by Windows when DHCP fails. The device cannot communicate beyond itself at this point. Check the physical connection, restart the router, and run ipconfig /release then ipconfig /renew.'
);

// id 288 was B — rewrite keep B
uq(288,
  'Where in Windows do you go to see which devices have driver problems?',
  'Open System Information from the Start menu and check the Components section for any devices listed with errors',
  'Open Device Manager from the Start menu or by right-clicking the Start button, where devices with problems show a yellow warning triangle',
  'Open the Settings app, go to Windows Update, and check the optional updates section for pending driver updates',
  'B',
  'Device Manager is the central location for hardware status. Yellow triangles indicate driver problems. Right-clicking a flagged device gives you options to update, roll back, or uninstall the driver.'
);

// id 289 — already C, rewrite for quality
uq(289,
  'Where is the correct and safest source for downloading driver updates?',
  'Use a third-party driver update utility since these tools scan all hardware simultaneously',
  'Download from the first search result for your hardware model since manufacturers rank highest',
  'Download only from the hardware manufacturer\'s official website or through Windows Update to avoid bundled malware',
  'C',
  'Third-party driver download sites frequently bundle adware or malware. The manufacturer\'s official site and Windows Update are the only trustworthy sources. Always navigate directly to the manufacturer\'s domain rather than following search result links.'
);

// id 290 was B — reassign to A
uq(290,
  'After installing a new driver your PC starts crashing immediately. What is the fastest fix?',
  'Roll back the driver in Device Manager by right-clicking the device and selecting Roll Back Driver to restore the previous working version',
  'Uninstall Windows and perform a clean install to ensure the corrupted driver is fully removed',
  'Download the driver again from the manufacturer site and reinstall over the existing version',
  'A',
  'Roll Back Driver in Device Manager is designed exactly for this scenario. It restores the previous working driver in seconds without reinstalling Windows or requiring a download.'
);

// id 291 was B — reassign to C
uq(291,
  'Your C drive shows only 2GB free out of 256GB. What should you do first?',
  'Immediately purchase an external drive and migrate all personal files before anything else fails',
  'Run Disk Defragmenter to consolidate file fragments and recover wasted space between files',
  'Open Disk Cleanup or Storage Sense to remove temporary files, Windows Update cache, and other recoverable space before investigating further',
  'C',
  'Disk Cleanup and Storage Sense often recover several gigabytes of space from temporary files, update remnants, and the Recycle Bin in minutes. This is always the first step before looking at what files to move or delete.'
);

// id 292 was B — rewrite keep B
uq(292,
  'Which built-in Windows feature automatically frees up disk space by removing temporary files on a schedule?',
  'Disk Cleanup, which you must run manually but can be scheduled through Task Scheduler',
  'Storage Sense, which can be configured in Settings to automatically delete temporary files, old downloads, and Recycle Bin contents on a schedule',
  'Windows Defender, which removes quarantined files and scan logs automatically after 30 days',
  'B',
  'Storage Sense is the modern automatic version of disk cleanup. Configure it in Settings under System, Storage. It runs automatically based on your schedule and can dramatically reduce the manual maintenance required to keep drives from filling up.'
);

// id 293 — already A, rewrite for quality
uq(293,
  'What is the recommended minimum free disk space to maintain on your primary Windows drive for healthy performance?',
  'At least 10 to 15 percent of the total drive capacity, since Windows needs free space for virtual memory, update staging, and system restore points',
  'At least 1GB free since Windows only needs space for the active page file',
  'Free space does not affect performance on solid state drives since they have no moving parts',
  'A',
  'Windows uses free space for the page file, update downloads, temporary files, and system restore points. Below 10 percent performance degrades noticeably. SSDs also have reduced write performance when nearly full due to how NAND flash works.'
);

// id 294 was B — reassign to C
uq(294,
  'Your browser homepage keeps changing back to an unfamiliar site after you reset it. What is most likely happening?',
  'Your browser profile is syncing the unwanted homepage from another device logged into the same account',
  'A Windows Update changed browser default settings as part of a compatibility patch',
  'A browser hijacker installed as an extension or program is overriding your settings and needs to be removed through Programs and Features and a full browser extension audit',
  'C',
  'Persistent homepage hijacking that survives a manual reset means something is actively overwriting your setting. Check installed extensions first, then Programs and Features for anything installed around the time the problem started.'
);

// id 295 was B — rewrite keep B
uq(295,
  'What is the safest first step when fixing a slow or crashing browser?',
  'Uninstall and reinstall the browser to get a clean installation with no profile corruption',
  'Disable all extensions in the browser settings and test performance to determine if an extension is the cause before removing anything',
  'Clear the browser cache and history since accumulated data is always the cause of browser slowdowns',
  'B',
  'Disabling all extensions first isolates the cause without destroying your profile or data. If performance improves with extensions disabled you can re-enable them one at a time to identify the problem one.'
);

// id 296 was B — reassign to A
uq(296,
  'After resetting your browser the problem persists. What should you investigate next?',
  'Check installed programs for anything that might have added itself as a browser helper object or background service that reinstates the hijacked settings after each reset',
  'Reinstall Windows since browser resets that do not resolve the issue indicate OS-level corruption',
  'Try a different browser since the problem is specific to your current browser installation',
  'A',
  'Browser hijackers often have a companion program outside the browser that restores their settings after each reset. Check Programs and Features sorted by install date and look for unfamiliar entries added around the time the problem started.'
);

// id 297 was B — reassign to C
uq(297,
  'You want to completely remove a program from Windows. What is the correct method?',
  'Delete the application folder from Program Files since this removes all files the application installed',
  'Drag the application icon from the Desktop to the Recycle Bin to uninstall it',
  'Use Programs and Features in the Control Panel or Apps in Settings to run the official uninstaller which removes registry entries and system files that folder deletion leaves behind',
  'C',
  'Deleting the application folder leaves registry entries, scheduled tasks, startup entries, and system files scattered across Windows. The official uninstaller is designed to clean all of these up properly.'
);

// id 298 was B — rewrite keep B
uq(298,
  'Where should you always download software from to minimize security risk?',
  'The top result in a Google search for the software name since legitimate software ranks first',
  'The official website of the software developer or through a trusted platform store like the Microsoft Store',
  'A well-known software aggregator site since these curate safe versions and check for malware',
  'B',
  'Aggregator sites and search results frequently serve bundled installers containing adware or malware. The only sources you can trust are the developer\'s own domain, which you should navigate to directly, or verified platform stores.'
);

// id 299 — already A, rewrite for quality
uq(299,
  'After installing new software your PC becomes very slow. What is the most likely cause and first step?',
  'The new software added startup programs or background services that are running continuously. Check Task Manager startup tab and disable any new entries, then check Services for anything unfamiliar.',
  'The installation modified your system PATH variable causing Windows to search more directories before finding executables',
  'The software installed an incompatible version of a shared library that is slowing down all programs that depend on it',
  'A',
  'Most legitimate applications and nearly all bloatware add startup entries during installation. The Startup tab in Task Manager shows impact ratings and lets you disable entries without uninstalling anything.'
);

// id 300 was B — reassign to C
uq(300,
  'Your printer shows as offline in Windows even though it is powered on and connected. What is the first thing to check?',
  'Reinstall the printer driver since offline status always indicates a driver problem',
  'Run the Windows Printer Troubleshooter which automatically detects and fixes common offline status causes',
  'Check that the Use Printer Offline option is not enabled in the printer queue, then verify the physical connection and restart the print spooler service if needed',
  'C',
  'Windows sometimes sets printers to offline mode and forgets to clear it. This one-click fix is in the printer queue window under Printer menu. If that does not help, check the physical connection and restart the spooler before reinstalling drivers.'
);

// id 301 was B — rewrite keep B
uq(301,
  'How do you clear a stuck print queue on Windows when jobs will not delete?',
  'Restart the printer and computer simultaneously so both clear their job queues at the same time',
  'Stop the Print Spooler service in Services, delete files in the spool printer documents folder, then restart the service',
  'Open the printer queue, select all jobs, and press delete, then wait for the spooler to process the empty queue',
  'B',
  'Stuck print jobs cannot be deleted while the spooler service holds them open. Stopping the service releases the lock, allowing you to delete the spool files manually. Restarting the service completes the process.'
);

// id 302 was B — reassign to A
uq(302,
  'A USB device is not recognized by Windows when you plug it in. What is the correct troubleshooting sequence?',
  'Try a different USB port, then test the device on another computer to determine if the issue is the port, the device, or the driver',
  'Immediately reinstall the USB controller drivers since unrecognized devices always indicate a driver problem',
  'Format the USB device since unrecognized devices have corrupted file systems that Windows cannot mount',
  'A',
  'Isolation testing is always the first step. A different port rules out a dead port. Testing on another computer tells you whether the device itself is the problem. Only then do you investigate drivers or OS-level issues.'
);

// id 303 was B — reassign to C
uq(303,
  'A Windows update has been stuck at 35 percent for several hours. What should you do?',
  'Hold the power button to force shut down immediately since the update has failed and needs to be restarted',
  'Wait a full 24 hours before taking any action since large feature updates legitimately take this long on slower hardware',
  'Wait at least two to three hours, then if genuinely stuck use the Windows Update Troubleshooter, and only force restart as a last resort after understanding the risks of interrupting an update',
  'C',
  'Force-interrupting an update mid-install can corrupt the OS. Two to three hours is a reasonable threshold for deciding the update is genuinely stuck versus slow. The Update Troubleshooter can often resolve it without a forced restart.'
);

// id 304 — already A, rewrite for quality
uq(304,
  'How do you roll back a Windows update that is causing problems after installation?',
  'Open Settings, go to Windows Update, select Update History, then Uninstall Updates, and choose the problematic update to remove it',
  'Run sfc /scannow in Command Prompt which automatically reverses the most recent update if system files were changed',
  'Use System Restore to roll back the entire OS to before the update was applied',
  'A',
  'The Uninstall Updates option under Update History lets you remove specific updates without affecting anything else. System Restore is a more drastic option that affects system settings and application changes beyond the update itself.'
);

// id 305 was B — reassign to C
uq(305,
  'What does the Windows Update error code 0x80070005 indicate?',
  'Windows Update servers are temporarily unavailable and the update will retry automatically',
  'The update download was corrupted in transit and needs to be downloaded again',
  'Access denied, meaning Windows Update cannot write to a required location due to a permissions problem or security software blocking it',
  'C',
  '0x80070005 is the Windows access denied error. In the context of Windows Update it means the update process cannot write to a required file or registry location. Check that security software is not blocking the update and that your user account has the required permissions.'
);

// id 306 was B — rewrite keep B
uq(306,
  'What does the 3-2-1 backup rule specify?',
  'Back up daily, weekly, and monthly on three separate schedules to cover different recovery scenarios',
  'Keep three copies of your data on two different types of storage media with one copy stored offsite or offline',
  'Use three separate backup applications to ensure at least one works if another fails',
  'B',
  'The 3-2-1 rule ensures survivability against multiple failure modes. Three copies means one failure does not lose your data. Two media types protect against media-specific failures. Offsite storage protects against local disasters like fire and theft.'
);

// id 307 was B — reassign to A
uq(307,
  'You accidentally deleted an important folder and emptied the Recycle Bin. What should you try first?',
  'Check whether File History, a restore point, or your backup solution has a recoverable version of the folder before attempting any data recovery software',
  'Run data recovery software immediately since it has the highest success rate before any other approach',
  'Contact your cloud storage provider since deleted files are always retained for 30 days',
  'A',
  'File History and backup solutions provide clean, reliable recovery without the uncertainty of raw data recovery scanning. Try these first. Data recovery software is the fallback when no backup exists, not the first step.'
);

// id 308 was B — reassign to C
uq(308,
  'How often should you test your backups to confirm they are usable?',
  'Testing is only necessary after a major system change like a hardware upgrade or OS reinstall',
  'Annual testing during a scheduled IT review is sufficient for home users',
  'At minimum quarterly, and always after any change to the backup system, by actually restoring test files to confirm the backup is complete and readable',
  'C',
  'Backups that have never been tested have an unknown reliability. Silent failures in backup software, storage degradation, and configuration errors are only discovered during a restore test. Discovering a backup failure during an actual emergency is far worse than finding it during a test.'
);

// id 309 was B — rewrite keep B
uq(309,
  'Your laptop suddenly shuts down during demanding tasks but works fine during light use. What is most likely causing this?',
  'The laptop battery has degraded to the point where it cannot supply sufficient current for high-demand workloads',
  'Thermal shutdown is occurring because the CPU or GPU is reaching its maximum safe temperature and the system is cutting power to protect itself',
  'The power adapter is insufficient for the laptop\'s maximum power draw under load',
  'B',
  'Thermal shutdown is a protection mechanism. Shutdown only during demanding tasks is the signature pattern because intensive workloads generate far more heat than idle use. Clean the vents and check that the fan is operating before investigating other causes.'
);

// id 310 was B — reassign to A
uq(310,
  'What is the best tool for monitoring your CPU temperature in real time on Windows?',
  'HWMonitor or Core Temp, which are free utilities that display real-time temperatures for every CPU core along with historical minimums and maximums',
  'Task Manager, which shows CPU temperature in the Performance tab under CPU details',
  'Device Manager, which displays current hardware temperatures under the Processors section',
  'A',
  'Task Manager does not display CPU temperature. Device Manager shows hardware status but not live temperatures. HWMonitor and Core Temp are the standard free tools for real-time thermal monitoring with per-core granularity.'
);

// id 311 was B — reassign to C
uq(311,
  'What is the most common cause of overheating in a laptop that worked fine when new?',
  'CPU performance increasing over time as the processor learns usage patterns and boosts clock speeds higher',
  'Battery expansion pressing against internal components and restricting airflow pathways',
  'Dust accumulation in the vents and on the heatsink blocking airflow and reducing the cooling system\'s ability to dissipate heat',
  'C',
  'Dust is the primary cause of thermal degradation in laptops over time. It accumulates on heatsink fins and blocks vents, reducing airflow dramatically. A laptop that ran cool for years and now runs hot almost always has a dust problem.'
);

// ── Section 3: Anti-Hacking remaining stale ids 312-343 ──────────────────────

// id 312 was B — rewrite keep B
uq(312,
  'What is the primary function of a firewall?',
  'A firewall encrypts all data leaving your computer so it cannot be read in transit',
  'A firewall monitors and controls incoming and outgoing network traffic based on rules that determine what connections are allowed or blocked',
  'A firewall scans files for malware before they are downloaded to your device',
  'B',
  'Firewalls are traffic control systems. They examine connections and apply rules to allow or block them. They do not encrypt data or scan file content, which are functions of VPNs and antivirus software respectively.'
);

// id 313 was B — reassign to A
uq(313,
  'Where do you configure Windows Defender Firewall rules for specific applications?',
  'Open Windows Security, go to Firewall and Network Protection, then click Allow an App Through Firewall to manage per-application rules',
  'Open Device Manager and right-click your network adapter to access firewall rule settings',
  'Open Network and Sharing Center and select the connection type to configure its firewall profile',
  'A',
  'Windows Security is the correct location for Windows Defender Firewall settings. The Allow an App Through Firewall option is where you grant or revoke network access for specific applications under the relevant profile.'
);

// id 314 was B — reassign to C
uq(314,
  'An unfamiliar application on your PC is requesting permission to access the internet through your firewall. What should you do?',
  'Allow it since blocking legitimate applications creates more problems than it solves',
  'Allow it only on private networks to limit exposure while still letting it function',
  'Research the application name to determine its purpose before deciding whether to allow or deny the request',
  'C',
  'Unknown applications requesting firewall access should be identified before you grant them network connectivity. Search the executable name to determine if it is a legitimate system process, a known application, or potential malware.'
);

// id 315 was B — rewrite keep B
uq(315,
  'What does a VPN primarily protect you from?',
  'A VPN primarily protects you from malware by routing your traffic through servers that scan for threats',
  'A VPN primarily protects your internet traffic from being monitored by your ISP, network administrators, or anyone else on the same network as you',
  'A VPN primarily protects you from websites tracking your browsing by assigning you an anonymous IP address',
  'B',
  'A VPN\'s core function is encrypting traffic between your device and the VPN server. This prevents your ISP, network operator, and local network attackers from seeing your traffic content. It provides privacy from network observers, not from websites or malware.'
);

// id 316 was B — reassign to A
uq(316,
  'What should you look for when choosing a VPN provider?',
  'An independently audited no-logs policy, transparent ownership, jurisdiction outside of surveillance alliances, and a clear privacy policy',
  'The largest server network available since more servers means better privacy and higher speeds',
  'Free VPN services since paid providers have financial incentives to collect and sell your data',
  'A',
  'Free VPNs frequently monetize user data, which defeats the purpose entirely. Independent audits verify no-logs claims. Jurisdiction matters because providers in certain countries are legally required to retain and share data with governments.'
);

// id 317 was B — reassign to C
uq(317,
  'Does using a VPN make you completely anonymous online?',
  'Yes, a VPN hides your real IP address which is the only way websites identify you',
  'Yes, a VPN encrypts your traffic and masks your identity from all observers including the websites you visit',
  'No, a VPN shifts trust to the VPN provider, does not prevent tracking by cookies and browser fingerprinting, and websites can still identify you through your account logins',
  'C',
  'VPNs provide network-layer privacy. They do not prevent websites from identifying you through cookies, fingerprinting, or account logins. The VPN provider itself can see your traffic. Anonymity requires more than a VPN.'
);

// id 318 was B — rewrite keep B
uq(318,
  'What is the first security step you should take when setting up a new home router?',
  'Enable the router\'s built-in parental controls to restrict access to malicious domains',
  'Change the default administrator username and password to strong unique credentials before doing anything else',
  'Update the router firmware to the latest version before making any other configuration changes',
  'B',
  'Default credentials are published in public databases and known to attackers. Changing them immediately prevents anyone who can reach the router\'s admin interface from taking control of your network. Firmware updates are important but come second.'
);

// id 319 was B — reassign to A
uq(319,
  'Which Wi-Fi encryption standard should you use on your home network?',
  'WPA3 if your router supports it, or WPA2 with AES-CCMP as the minimum acceptable option',
  'WEP since it is the most widely supported standard and works with the oldest devices',
  'WPA with TKIP since it provides stronger encryption than WPA2 with a simpler key exchange',
  'A',
  'WPA3 is the current standard providing the strongest protection. WPA2 with AES is acceptable if WPA3 is unavailable. WEP is completely broken and WPA with TKIP has known vulnerabilities. Never use either for a network carrying sensitive traffic.'
);

// id 320 was B — reassign to C
uq(320,
  'What is the security benefit of setting up a guest network on your home router?',
  'Guest networks use stronger encryption than your main network providing better protection for visitors',
  'Guest networks allow faster speeds for visitors by prioritizing bandwidth allocation',
  'A guest network isolates visitor and IoT device traffic from your main network so compromised devices cannot reach your computers and sensitive data',
  'C',
  'Network segmentation is the security benefit. A compromised guest device or IoT device on the guest network cannot communicate with devices on your main network. This containment limits the blast radius of any compromise on the isolated segment.'
);

// id 321 was B — rewrite keep B
uq(321,
  'Why is an authenticator app more secure than SMS text messages for MFA?',
  'Authenticator apps use longer codes that are harder for attackers to guess than the six-digit SMS codes',
  'SMS codes can be intercepted through SIM swapping attacks or SS7 vulnerabilities, while authenticator app codes are generated locally on your device and never transmitted over the phone network',
  'Authenticator apps expire codes after 30 seconds while SMS codes remain valid indefinitely until used',
  'B',
  'SMS travels over the phone network and depends on carrier security. SIM swapping redirects your number to an attacker\'s device. SS7 protocol weaknesses allow interception. Authenticator codes are generated locally using a shared secret and never leave your device.'
);

// id 322 was B — reassign to A
uq(322,
  'What should you do with the backup codes provided when you set up MFA on an account?',
  'Print or write them down and store them in a physically secure location separate from your primary device in case you lose access to your authenticator',
  'Store them in a note in your email account so they are always accessible when you need them',
  'Screenshot them and keep the screenshot in your photos since cloud backup makes them always available',
  'A',
  'Backup codes exist specifically for when you lose your primary MFA device. Storing them in email or cloud photos means that anyone who compromises those accounts can also bypass your MFA. They need to be physically secured offline.'
);

// id 323 was B — reassign to C
uq(323,
  'Which accounts should have MFA enabled as the highest priority?',
  'Social media accounts since these are targeted most frequently by casual attackers',
  'Work accounts since corporate data is more valuable than personal accounts',
  'Email and password manager accounts first since email is the recovery method for almost every other account and a password manager breach exposes all credentials simultaneously',
  'C',
  'Email account compromise enables account takeover of everything else through password reset flows. Password manager compromise is similarly catastrophic. These two account types have a multiplier effect on every other account you own.'
);

// id 324 was B — rewrite keep B
uq(324,
  'What is the main security benefit of using a password manager?',
  'Password managers encrypt your internet connection so passwords cannot be captured in transit',
  'Password managers make it practical to use a completely unique random strong password for every account without needing to remember any of them',
  'Password managers automatically change your passwords on a schedule so old passwords cannot be used in credential stuffing attacks',
  'B',
  'The core value proposition of a password manager is enabling unique credentials everywhere. Human memory forces password reuse and patterns. A password manager removes both limitations, making the actual security benefit far greater than any individual password strength improvement.'
);

// id 325 was B — reassign to A
uq(325,
  'Which type of encryption should your password manager use to protect your stored vault?',
  'AES-256 bit encryption with zero-knowledge architecture so the provider cannot decrypt your vault even if legally compelled',
  'RSA-2048 public key encryption so you can share encrypted passwords securely with trusted contacts',
  'SHA-256 hashing so your master password cannot be reversed even if the provider is breached',
  'A',
  'Zero-knowledge AES-256 means only you can decrypt your vault. The provider stores only encrypted data and has no mechanism to read it. SHA-256 is a hashing algorithm not encryption and RSA is not used for vault storage.'
);

// id 326 was B — reassign to C
uq(326,
  'What should you do if your password manager reports that a stored password appeared in a known data breach?',
  'Delete the affected account entirely since any compromised account is permanently unsafe',
  'Change the password on the affected account but only if you actively use that account',
  'Immediately change the password on the affected service and check every other service where you may have reused that same password',
  'C',
  'Breach notifications mean that password is in attacker databases used for credential stuffing. Change it immediately on the affected service. If you ever reused it, every service where that password exists is also at risk.'
);

// id 327 was B — rewrite keep B
uq(327,
  'Which of these is a common sign of an active malware infection?',
  'Your computer takes slightly longer to start up after a major Windows update',
  'Unexplained network activity, unfamiliar processes running at high CPU, browser redirects to unexpected sites, or new toolbars and extensions you did not install',
  'Your browser asks to save passwords more frequently than it used to',
  'B',
  'Malware symptoms vary by type but commonly manifest as unexpected resource usage, unexplained network traffic, or unauthorized browser modification. Any combination of these warrants a full scan with a second-opinion scanner.'
);

// id 328 was B — reassign to A
uq(328,
  'What is the safest way to remove a stubborn malware infection that survives normal removal attempts?',
  'Boot from a trusted bootable rescue environment like Malwarebytes Rescue or Windows Defender Offline Scan so the malware cannot run while it is being detected and removed',
  'Reinstall all your applications over the existing installation to overwrite any infected files',
  'Run three different antivirus tools simultaneously to maximize detection coverage',
  'A',
  'Malware running in the active OS can hide from scanners, restart itself when terminated, or reinfect cleaned files. Booting from an external rescue environment gives the scanner access to the full file system without any malicious code running to interfere.'
);

// id 329 — already A, rewrite for quality
uq(329,
  'After removing malware from your system, what important step should you take?',
  'Change passwords for any accounts accessed on the device after the infection may have begun, starting with email and any financial accounts',
  'Reinstall the operating system regardless of how successful the removal appeared to be',
  'Scan the system one more time with a different tool to confirm all threats were removed',
  'A',
  'Malware often includes keyloggers or credential stealers that may have captured passwords during the infection period. Changing passwords from a clean device closes this exposure regardless of whether removal was successful.'
);

// id 330 was B — reassign to C
uq(330,
  'Why should you keep your browser updated?',
  'Browser updates improve rendering speed which reduces the time your credentials are in memory during login',
  'Browser updates add new privacy features that block advertising trackers more effectively over time',
  'Browser updates patch security vulnerabilities in the rendering engine, JavaScript engine, and sandbox that attackers actively exploit to run malicious code through compromised websites',
  'C',
  'Browser vulnerabilities are among the most actively exploited attack surfaces because everyone uses a browser constantly. Zero-day browser exploits are valuable and expensive precisely because they enable compromise through normal web browsing.'
);

// id 331 was B — rewrite keep B
uq(331,
  'What is HTTPS-only mode in a browser and what does it protect against?',
  'HTTPS-only mode blocks all websites that do not have a business registration, protecting against fraudulent domains',
  'HTTPS-only mode forces your browser to use encrypted connections and warns you before loading any site over unencrypted HTTP, protecting against passive interception of page content and credentials',
  'HTTPS-only mode verifies website ownership certificates against a trusted registry before loading any page',
  'B',
  'HTTP traffic is sent in plaintext that can be read by anyone on the same network. HTTPS-only mode prevents your browser from silently downgrading to HTTP on sites that support both, which is a common attack vector on public Wi-Fi.'
);

// id 332 was B — reassign to A
uq(332,
  'You download a file named Invoice.pdf.exe. What does this tell you?',
  'The real file type is an executable program, not a PDF. The .pdf portion is part of the filename and is a deception technique designed to make you believe the file is a document.',
  'The file is a self-extracting archive that contains a PDF and requires the .exe to install a PDF reader',
  'The double extension means the file was scanned and verified as safe before being renamed by the antivirus software',
  'A',
  'Windows hides known file extensions by default, making double-extension files particularly deceptive. The actual file type is always the last extension. A .pdf.exe is an executable program, not a PDF document.'
);

// id 333 was B — reassign to C
uq(333,
  'What is a file hash and why is it useful when downloading software?',
  'A file hash is an encrypted version of the filename that verifies the file comes from a trusted domain',
  'A file hash is a digital signature applied by the developer that proves the file has not been modified since signing',
  'A file hash is a fixed-length fingerprint of the file contents that lets you verify your downloaded copy exactly matches what the developer published, confirming no corruption or tampering occurred',
  'C',
  'Hash functions produce a unique fingerprint for any given file content. If even one bit changes, the hash changes completely. Comparing your download\'s hash to the one published by the developer confirms the file is intact and unmodified.'
);

// id 334 was B — rewrite keep B
uq(334,
  'What should you do before opening any downloaded file, especially executables?',
  'Open the file in a text editor first to check whether the content looks like a legitimate document',
  'Scan it with your antivirus software and verify the file extension matches the expected file type before opening it',
  'Wait 24 hours after downloading so your antivirus can receive updated signature definitions that might detect newer threats',
  'B',
  'Antivirus scanning catches known malware signatures before execution. Verifying the file extension prevents double-extension deception. Both steps together significantly reduce the risk of executing malicious files disguised as documents.'
);

// id 335 was B — reassign to A
uq(335,
  'What does reviewing connected apps and revoking unused access on your accounts accomplish?',
  'It removes third-party applications that no longer need access to your account data, reducing the number of places where a breach of a third-party service could expose your account',
  'It deletes the data that third-party applications collected while they had access to your account',
  'It notifies the connected applications that their access was revoked so they can prompt you to reconnect',
  'A',
  'Third-party apps with account access represent persistent access grants that survive your password changes. A breach of any of those apps gives attackers their access token. Revoking unused access is housekeeping that reduces your attack surface over time.'
);

// id 336 was B — reassign to C
uq(336,
  'Why should you enable login notifications on important accounts?',
  'Login notifications automatically block suspicious sign-ins from unrecognized devices before they complete',
  'Login notifications trigger an automatic password reset if a login occurs from a new geographic location',
  'Login notifications alert you in real time when your account is accessed so you can immediately revoke access and secure the account if you did not initiate the login',
  'C',
  'Notifications give you the earliest possible warning of unauthorized access. Minutes matter when an account is compromised. Real-time alerts let you respond before significant damage occurs rather than discovering the breach days later during a routine check.'
);

// id 337 was B — rewrite keep B
uq(337,
  'You notice an active session on your account from a location and device you do not recognize. What do you do immediately?',
  'Change your password and see if the session disappears on its own within the next hour',
  'End all active sessions through your account security settings, change your password, revoke any connected apps you do not recognize, and enable MFA if it was not already active',
  'Log out of your own session and log back in, which forces all other sessions to re-authenticate',
  'B',
  'Changing a password alone does not always terminate active sessions immediately on all platforms. Explicitly ending all sessions, rotating the password, reviewing connected apps, and enabling MFA together close every access path the attacker used.'
);

// id 338 was B — reassign to A
uq(338,
  'Why is oversharing on social media a security risk beyond simple privacy concerns?',
  'Details like your employer, job title, travel dates, family members, and daily routines are used by social engineers to craft convincing pretexts and by physical criminals to plan theft or access attacks',
  'Social media posts are indexed by employer background check services and can affect future employment opportunities',
  'Oversharing increases your algorithmic exposure to phishing advertisements on the platform itself',
  'A',
  'Social media reconnaissance is a primary step in targeted attacks. Your public profile provides the building blocks for convincing impersonation, spear phishing, and physical security attacks. The information feels harmless individually but is powerful in combination.'
);

// id 339 was B — reassign to C
uq(339,
  'You receive a direct message from a friend\'s account asking you to click a link to vote in a contest. What should you do?',
  'Click it since you recognize your friend\'s account and profile picture',
  'Ask your friend through the same messaging platform to confirm they sent it before clicking',
  'Contact your friend through a separate channel such as a text or call to verify they actually sent the message before clicking anything',
  'C',
  'Account compromises frequently result in messages sent to the victim\'s contacts to spread malware or phishing. The message comes from the real account because the attacker controls it. Only a response through an independent channel confirms your friend actually sent it.'
);

// id 340 was B — rewrite keep B
uq(340,
  'What should you do with old social media accounts you no longer use?',
  'Leave them inactive since dormant accounts cannot be targeted by attackers without recent activity',
  'Delete or formally deactivate them since abandoned accounts with old weak passwords and no MFA are regularly compromised and used to impersonate you',
  'Change the password on them and leave them since the updated credentials make them secure enough',
  'B',
  'Abandoned accounts represent unmonitored risk. They hold historical personal data, have outdated passwords you changed everywhere else, and lack MFA. Compromised old accounts can be used to impersonate you or as a pivot to recover access to active accounts.'
);

// id 341 was B — reassign to A
uq(341,
  'What does full disk encryption protect against?',
  'Full disk encryption protects against physical theft of your device by making all data on the drive unreadable to anyone who does not have your decryption key or password',
  'Full disk encryption protects against malware accessing your files while the device is powered on and unlocked',
  'Full disk encryption protects against remote attackers accessing your files over the network',
  'A',
  'Encryption at rest protects data when the device is off or locked. It specifically addresses the scenario where someone physically takes your drive or device. It provides no protection against threats while the device is unlocked and running.'
);

// id 342 was B — reassign to C
uq(342,
  'Which built-in Windows feature provides full disk encryption for your system drive?',
  'Windows Defender, which includes a drive encryption module in its advanced settings',
  'EFS, Encrypting File System, which encrypts individual files and folders including the entire system drive',
  'BitLocker, which encrypts the entire drive including the operating system partition and requires a PIN or TPM to unlock at boot',
  'C',
  'BitLocker is the Windows full disk encryption feature. EFS encrypts individual files within the running OS, which is different from encrypting the drive itself. EFS alone does not protect against cold boot attacks or offline access to the drive.'
);

// id 343 was B — rewrite keep B
uq(343,
  'Does enabling full disk encryption protect you from malware while the device is actively running?',
  'Yes, full disk encryption prevents malware from reading or modifying encrypted files even while the device is in use',
  'No, full disk encryption only protects data when the device is powered off or the drive is removed. Once you unlock and boot the device, files are accessible to everything running on the system including malware.',
  'It depends on whether the malware attempts to access encrypted or unencrypted partitions',
  'B',
  'Encryption protects data at rest. When you boot and authenticate, the drive is decrypted for use. Malware running in that session has the same access to your files that you do. Encryption and malware protection address completely different threat models.'
);

// ── Section 4: Network remaining stale ids 344-373 ──────────────────────────

// id 344 — already A, rewrite for quality
uq(344,
  'What is an IP address?',
  'A unique numerical label assigned to each device on a network that serves as its address for sending and receiving data',
  'A code that encrypts network traffic between your device and a router',
  'The physical address burned into your network adapter during manufacturing',
  'A',
  'IP addresses are logical addresses assigned to devices for communication. They differ from MAC addresses, which are physical hardware identifiers. IP addresses can change while MAC addresses are fixed to the hardware.'
);

// id 345 was B — reassign to C
uq(345,
  'What is a packet in networking?',
  'A packet is the encryption wrapper applied to data before it is sent across a network',
  'A packet is a connection session between two devices that persists for the duration of their communication',
  'A packet is a small unit of data with a header containing source and destination addresses that networks use to route information from one device to another',
  'C',
  'Networks break data into packets for transmission. Each packet travels independently and may take different routes to the destination. The receiving device reassembles packets into the original data. This design makes networks efficient and fault-tolerant.'
);

// id 346 was B — rewrite keep B
uq(346,
  'What does DNS stand for and what does it do?',
  'DNS stands for Data Network Security and it verifies that websites are authentic before your browser loads them',
  'DNS stands for Domain Name System and it translates human-readable domain names like example.com into the IP addresses that computers use to locate servers',
  'DNS stands for Dynamic Network Switch and it manages IP address assignments across a local network',
  'B',
  'DNS is the internet\'s phonebook. You type a domain name and DNS returns the corresponding IP address so your browser knows which server to connect to. Without DNS you would need to memorize IP addresses for every website.'
);

// id 347 was B — reassign to A
uq(347,
  'What is the difference between a public and a private IP address?',
  'Private IP addresses are used within a local network and are not routable on the internet, while public IP addresses are assigned by ISPs and are used for communication across the internet',
  'Public IP addresses are encrypted while private IP addresses are sent in plaintext across network infrastructure',
  'Private IP addresses are assigned permanently to devices while public IP addresses change with every new connection',
  'A',
  'Private IP ranges like 192.168.x.x exist only within local networks. Your router holds the public IP that the internet sees and uses NAT to translate between public and private addresses for all devices on your network.'
);

// id 348 was B — reassign to C
uq(348,
  'What does DHCP do?',
  'DHCP encrypts the connection between your device and the router during initial network authentication',
  'DHCP resolves domain names to IP addresses for devices on a local network',
  'DHCP automatically assigns IP addresses, subnet masks, gateways, and DNS server addresses to devices joining a network so they do not need manual configuration',
  'C',
  'DHCP handles the automatic configuration that lets devices connect to a network without manual setup. When you connect a device it requests configuration from the DHCP server, which responds with all the settings needed to communicate on that network.'
);

// id 349 was B — rewrite keep B
uq(349,
  'Which IP address range is always private and used inside local networks?',
  'The 8.x.x.x range is reserved for private networks by international standards',
  'The 192.168.x.x range along with 10.x.x.x and 172.16.x.x through 172.31.x.x are the three private IP address ranges defined by RFC 1918 that are not routed on the public internet',
  'The 127.x.x.x range is the private addressing range while 192.168.x.x is used for semi-public networks',
  'B',
  'RFC 1918 defines three private ranges: 10.0.0.0 through 10.255.255.255, 172.16.0.0 through 172.31.255.255, and 192.168.0.0 through 192.168.255.255. The 127.x.x.x range is the loopback range, not a private network range.'
);

// id 350 was B — reassign to A
uq(350,
  'What port does HTTPS use by default?',
  'Port 443, which is the standard port for encrypted HTTPS web traffic',
  'Port 80, which is the standard port for all web traffic including encrypted connections',
  'Port 8443, which is the secure alternative to the standard HTTP port 80',
  'A',
  'HTTPS uses port 443 by default. HTTP uses port 80. When you type a URL without specifying a port your browser automatically uses 443 for HTTPS and 80 for HTTP. Other ports can be used but require explicit specification in the URL.'
);

// id 351 was B — reassign to C
uq(351,
  'What is the purpose of port 22?',
  'Port 22 is the default port for HTTPS secure web traffic',
  'Port 22 is used for remote desktop protocol connections to Windows machines',
  'Port 22 is the default port for SSH, the Secure Shell protocol used for encrypted remote command-line access to servers and network devices',
  'C',
  'SSH on port 22 provides encrypted terminal access to remote systems. It replaced older unencrypted protocols like Telnet. Port 22 being open on a public IP is a common target for brute force attacks, which is why security-conscious administrators often move SSH to a non-standard port.'
);

// id 352 was B — rewrite keep B
uq(352,
  'Why should you close unused ports on a firewall?',
  'Unused ports slow down network throughput by creating unnecessary routing overhead for every packet',
  'Every open port is a potential entry point that attackers scan for. Closing ports for services you do not use reduces your attack surface to only what is necessary.',
  'Closing unused ports prevents your ISP from throttling traffic associated with those port numbers',
  'B',
  'Port scanning is one of the first steps in reconnaissance attacks. Every open port represents a service that might have vulnerabilities. Closing ports for unused services means attackers cannot find and exploit what does not exist.'
);

// id 353 was B — reassign to A
uq(353,
  'Why should you never use WEP encryption for your Wi-Fi network?',
  'WEP was broken by researchers in 2001 and can be cracked in minutes with freely available tools regardless of password complexity, providing essentially no protection for your network',
  'WEP uses an outdated key length that modern hardware can brute force in a few hours with dedicated equipment',
  'WEP is no longer supported by any modern device manufacturer so enabling it causes compatibility problems',
  'A',
  'WEP\'s RC4 implementation has fundamental cryptographic flaws that allow an attacker to recover the key from captured packets in minutes. Password length and complexity are irrelevant. WEP provides no meaningful security against anyone with basic wireless tools.'
);

// id 354 was B — reassign to C
uq(354,
  'What is the main security improvement WPA3 offers over WPA2?',
  'WPA3 uses a longer encryption key by default making brute force attacks take significantly longer',
  'WPA3 requires certificate-based device authentication instead of a shared password',
  'WPA3 uses Simultaneous Authentication of Equals which protects against offline dictionary attacks and provides forward secrecy so captured traffic cannot be decrypted even if the password is later discovered',
  'C',
  'SAE replaces WPA2\'s four-way handshake, which was vulnerable to offline dictionary attacks where captured handshakes could be tested against password lists indefinitely. Forward secrecy means each session uses unique keys so past traffic remains protected even after a compromise.'
);

// id 355 was B — rewrite keep B
uq(355,
  'What encryption cipher should you use with WPA2 when WPA3 is not available?',
  'TKIP since it was specifically designed as the WPA2 replacement for the older WEP cipher',
  'AES-CCMP since TKIP has known vulnerabilities and AES is the only cipher considered secure for WPA2',
  'RC4 since it is the original Wi-Fi encryption cipher and has the widest device compatibility',
  'B',
  'TKIP was a stopgap measure and has known weaknesses. AES-CCMP is mandatory for WPA2 certification and is the only cipher that provides actual security. Most routers still offer TKIP as an option for old device compatibility but it should never be used if AES is available.'
);

// id 356 was B — reassign to A
uq(356,
  'What is the difference between a stateful and a stateless firewall?',
  'A stateful firewall tracks the state of active connections and allows return traffic for established sessions automatically, while a stateless firewall evaluates every packet individually against fixed rules without any connection context',
  'A stateful firewall requires user authentication for each connection while a stateless firewall allows traffic based on IP address rules alone',
  'A stateful firewall logs all traffic for review while a stateless firewall processes traffic without recording it',
  'A',
  'Connection state tracking is the key difference. A stateful firewall knows a packet is a legitimate response to a connection you initiated. A stateless firewall would need explicit rules to allow each direction of traffic independently, making it harder to configure correctly.'
);

// id 357 was B — reassign to C
uq(357,
  'What does NAT do in a home router?',
  'NAT encrypts traffic between your home network and your ISP to prevent interception at the local loop',
  'NAT assigns IP addresses to devices on your network by acting as a DHCP server',
  'NAT translates between your single public IP address and the multiple private IP addresses of your home devices, allowing all devices to share one public IP and communicate with the internet',
  'C',
  'Network Address Translation solves the problem of having many devices but only one public IP. The router tracks which internal device initiated each connection and routes return traffic to the correct device. This is why all your home devices appear to share one IP on the internet.'
);

// id 358 was B — rewrite keep B
uq(358,
  'Why does NAT provide a basic level of security for home networks?',
  'NAT encrypts all traffic passing through the router providing confidentiality for local network communications',
  'NAT prevents unsolicited inbound connections from reaching internal devices because the router has no record of who should receive unexpected incoming traffic',
  'NAT verifies that outbound traffic comes from registered devices before allowing it to leave the network',
  'B',
  'NAT does not accept unsolicited inbound connections because it has no entry in its translation table for traffic that was not initiated from inside the network. This incidentally blocks many direct attack attempts, though it is not a substitute for a real firewall.'
);

// id 359 was B — reassign to A
uq(359,
  'What does a VPN tunnel do to your network traffic?',
  'A VPN tunnel encrypts all traffic from your device and routes it through the VPN server, making your traffic appear to originate from the VPN server\'s IP address rather than your own',
  'A VPN tunnel creates a dedicated physical connection between your device and the VPN server with no shared infrastructure',
  'A VPN tunnel splits your traffic so sensitive requests go through the encrypted path while regular browsing uses your normal connection',
  'A',
  'The tunnel encapsulates your encrypted traffic inside a second layer of packets. From the outside all anyone sees is encrypted traffic going to your VPN server. The VPN server decrypts it and forwards your actual requests, substituting its IP for yours.'
);

// id 360 was B — reassign to C
uq(360,
  'What is split tunneling in a VPN context?',
  'Split tunneling is a VPN attack where an attacker intercepts half of the encrypted tunnel and redirects it through a malicious server',
  'Split tunneling is the practice of running two VPN connections simultaneously to different servers for redundancy',
  'Split tunneling routes only specific traffic through the VPN while the rest uses your regular connection, which can improve performance but may expose some traffic to local network observation',
  'C',
  'Split tunneling is a performance and routing configuration. In corporate VPNs it allows internet browsing to bypass the VPN while work traffic goes through it. The security tradeoff is that the non-VPN traffic is visible on the local network.'
);

// id 361 was B — rewrite keep B
uq(361,
  'Your company VPN is connected and a colleague says you are slowing down the internet for everyone. What is likely happening?',
  'VPN connections automatically limit bandwidth for all devices on the same network as a security measure',
  'Your VPN may be configured without split tunneling so all your internet traffic is routing through the corporate network, consuming its bandwidth for non-work browsing',
  'Corporate VPNs prioritize company traffic over internet traffic causing all users to experience reduced speeds',
  'B',
  'Without split tunneling every byte of your internet activity goes through the corporate network first. Streaming video or large downloads while on VPN can saturate bandwidth that other employees are sharing. This is a configuration issue to discuss with IT.'
);

// id 362 was B — reassign to A
uq(362,
  'What is DNS cache poisoning and what harm can it cause?',
  'An attacker inserts false DNS records into a resolver\'s cache causing it to return a malicious IP address for legitimate domain names, redirecting users to attacker-controlled servers',
  'DNS cache poisoning fills a DNS resolver\'s cache with so many entries that it cannot process new requests, causing a denial of service for DNS resolution',
  'Malware that infects a device and modifies its local DNS cache to redirect banking sites to credential harvesting pages',
  'A',
  'Cache poisoning targets the DNS infrastructure itself rather than individual devices. A poisoned resolver sends everyone who queries it to malicious IPs, enabling man-in-the-middle attacks at scale. DNSSEC and DNS over HTTPS both help defend against this.'
);

// id 363 was B — reassign to C
uq(363,
  'What does DNS over HTTPS provide that standard DNS does not?',
  'DNS over HTTPS adds authentication to DNS responses so you can verify that query results have not been tampered with',
  'DNS over HTTPS encrypts DNS queries within the HTTPS protocol so they are protected by the same certificates that secure websites',
  'DNS over HTTPS encrypts DNS queries so your ISP and network observers cannot see which domains you are looking up, and makes tampering with DNS responses significantly harder',
  'C',
  'Standard DNS queries are sent in plaintext. Your ISP, network administrator, or anyone monitoring the network can see every domain you look up. DNS over HTTPS encrypts queries inside HTTPS connections, hiding your DNS lookups from local network observers.'
);

// id 364 was B — rewrite keep B
uq(364,
  'Which DNS provider is generally recommended for both privacy and malware blocking?',
  'Your ISP\'s default DNS is recommended since they are contractually required to protect your privacy',
  'Cloudflare 1.1.1.1 or Quad9 9.9.9.9 are generally recommended, with Quad9 providing additional malware and phishing domain blocking',
  'Google 8.8.8.8 is the most privacy-protective DNS since Google is subject to strict US privacy regulations',
  'B',
  'Cloudflare emphasizes privacy and does not log queries beyond 24 hours. Quad9 adds threat intelligence blocking, refusing to resolve known malicious domains. Google\'s DNS is fast but Google is an advertising company with incentives to analyze DNS data.'
);

// id 365 was B — reassign to A
uq(365,
  'How can you see all devices currently connected to your home network?',
  'Log into your router\'s admin interface and check the DHCP client list or connected devices section, which shows current connections by IP address, MAC address, and often device name',
  'Use Windows Network and Sharing Center which displays all devices on your network in real time',
  'Run the command netstat -a in Command Prompt which lists all devices connected to your network',
  'A',
  'The router is the authoritative source for connected devices since all traffic passes through it. Netstat shows connections from your device only. Network and Sharing Center shows a limited view. The router admin interface shows everything.'
);

// id 366 was B — reassign to C
uq(366,
  'You notice an unfamiliar device connected to your home network. What should you do?',
  'Immediately change your Wi-Fi password to disconnect all devices and reconnect only your own devices afterward',
  'Block the device by MAC address in your router settings since MAC blocking is a reliable security control',
  'Identify the device by checking the MAC address manufacturer prefix, change your Wi-Fi password to disconnect unauthorized devices, and consider whether guest network access controls need tightening',
  'C',
  'MAC address blocking is easily defeated by spoofing. Changing the password disconnects everyone and forces re-authentication. Identifying the device first helps determine if it is an unauthorized intruder or a forgotten device you own before taking action.'
);

// id 367 was B — rewrite keep B
uq(367,
  'What is Wireshark used for?',
  'Wireshark is an antivirus tool that monitors network traffic in real time and blocks malicious packets before they reach your device',
  'Wireshark is a network protocol analyzer that captures and displays network traffic in detail, allowing security professionals to analyze communication patterns, diagnose network problems, and investigate potential intrusions',
  'Wireshark is a vulnerability scanner that tests your network for open ports and misconfigured services',
  'B',
  'Wireshark is a passive capture tool. It does not block anything. It records raw network traffic and lets analysts examine protocols, payloads, and communication patterns in detail. It is essential for network troubleshooting and security analysis.'
);

// id 368 was B — reassign to A
uq(368,
  'What is a man-in-the-middle attack?',
  'An attacker positions themselves between two communicating parties and intercepts or modifies their communication without either party knowing the other is not being reached directly',
  'An attacker uses a compromised middle-tier server in a three-tier application to steal data passing between the frontend and database',
  'An attacker who has gained physical access to a building intercepts network cables to capture unencrypted traffic',
  'A',
  'MITM attacks intercept communication in transit. The attacker relays messages between the victims who believe they are communicating directly. This enables credential theft, session hijacking, and traffic manipulation. HTTPS with proper certificate validation defeats most MITM attempts.'
);

// id 369 was B — reassign to C
uq(369,
  'What is a DDoS attack?',
  'A DDoS attack is where an attacker takes over a single high-bandwidth server and uses it to flood a target with traffic',
  'A DDoS attack is a method of overwhelming a target\'s defenses by distributing malware across multiple vectors simultaneously',
  'A Distributed Denial of Service attack uses a large number of compromised devices to flood a target with traffic, overwhelming its capacity and making it unavailable to legitimate users',
  'C',
  'The distributed aspect is what makes DDoS difficult to defend against. Traffic comes from thousands or millions of sources simultaneously, making IP-based blocking ineffective. Specialized mitigation services absorb and filter this traffic before it reaches the target.'
);

// id 370 was B — rewrite keep B
uq(370,
  'How does HTTPS protect against man-in-the-middle attacks?',
  'HTTPS prevents MITM attacks by routing traffic through a trusted third-party server that verifies both parties before relaying communication',
  'HTTPS uses certificate-based authentication and encryption so an interceptor cannot read traffic content and cannot impersonate a legitimate server without possessing its private key',
  'HTTPS detects packet tampering through checksums and automatically re-routes traffic around compromised network segments',
  'B',
  'The certificate system ties domain ownership to a cryptographic private key that only the legitimate server possesses. An interceptor can see encrypted traffic but cannot read it and cannot present a valid certificate for the domain without the private key.'
);

// id 371 was B — reassign to A
uq(371,
  'What is network segmentation and why is it a security best practice?',
  'Network segmentation divides a network into isolated zones so a compromise in one zone cannot automatically spread to others, limiting the blast radius of any single breach',
  'Network segmentation distributes processing load across multiple network segments to prevent any single segment from becoming a bottleneck',
  'Network segmentation assigns different encryption levels to different parts of the network based on the sensitivity of the data traversing each segment',
  'A',
  'Containment is the security value of segmentation. An attacker who compromises a device on a segmented network faces a barrier preventing lateral movement to other segments. Flat networks where every device can reach every other device allow one compromised device to threaten everything.'
);

// id 372 was B — reassign to C
uq(372,
  'Why should you disable remote management on your home router?',
  'Remote management consumes router CPU resources that slow down local network performance',
  'Remote management uses an unencrypted protocol that exposes your router credentials to ISP monitoring',
  'Remote management exposes your router\'s admin interface to the internet, allowing anyone who can reach your public IP to attempt login, and home users have no legitimate need for internet-facing router management',
  'C',
  'Remote management is intended for ISPs and managed service providers. For home users it creates a publicly accessible attack surface with no operational benefit. Disable it and manage your router only from inside your network.'
);

// id 373 was B — rewrite keep B
uq(373,
  'How often should you update your router\'s firmware?',
  'Router firmware should only be updated when you experience a specific problem that the release notes indicate is fixed in a new version',
  'Check for firmware updates every few months or enable automatic updates if your router supports them, since firmware patches fix security vulnerabilities that attackers actively exploit',
  'Router firmware should be updated annually during a scheduled network maintenance window to minimize disruption',
  'B',
  'Routers are internet-facing devices that run continuously. Unpatched router vulnerabilities are actively exploited for network hijacking and traffic interception. Many consumer routers support automatic updates which is the easiest way to stay current.'
);

// ── Section 5: Safe Internet remaining stale ids 374-399 ─────────────────────

// id 374 was B — reassign to A
uq(374,
  'Before entering your banking credentials on a website, what should you verify?',
  'Verify that the full domain in the address bar exactly matches your bank\'s real domain and that HTTPS is in use, navigating there directly rather than following any link',
  'Verify that the page loaded over a connection showing a padlock icon, which confirms the site is your legitimate bank',
  'Verify that the page design and layout match what you remember from your last visit',
  'A',
  'HTTPS padlocks only confirm the connection is encrypted, not that the site is legitimate. Attackers get valid certificates for fake domains constantly. The domain name is the only indicator of whether you are on the real bank site.'
);

// id 375 was B — reassign to C
uq(375,
  'What is malvertising?',
  'Malvertising is a phishing technique that uses fake advertisement emails to direct victims to credential harvesting pages',
  'Malvertising is the practice of advertising fake security software that is itself malware',
  'Malvertising embeds malicious code in legitimate advertising networks so even trusted websites can serve ads that exploit browser vulnerabilities or redirect to malware',
  'C',
  'Malvertising does not require you to click anything on some vulnerable browsers. Legitimate websites running compromised ad network content can trigger exploits automatically. An ad blocker prevents malicious ad content from loading entirely.'
);

// id 376 was B — rewrite keep B
uq(376,
  'Why should you use bookmarks for important sites rather than searching or clicking links?',
  'Bookmarks load pages faster since the browser caches the full page content alongside the bookmark',
  'Bookmarks you created yourself from a verified visit guarantee you return to the legitimate site and eliminate risks from typosquatting, poisoned search results, and malicious links',
  'Bookmarks prevent websites from changing their content after you add them, preserving the version you originally trusted',
  'B',
  'A bookmark is a direct reference to the URL you verified when you created it. No search result manipulation, typo, or malicious link can redirect a bookmark to a different site. For banking and email it is the most reliable navigation method available.'
);

// id 377 was B — reassign to A
uq(377,
  'What does private browsing or incognito mode actually protect you from?',
  'Private browsing prevents your browser from saving your history, cookies, and form data locally on the device you are using, but does not hide your activity from your ISP, employer network, or the websites you visit',
  'Private browsing encrypts your connection and hides your IP address from websites and your ISP',
  'Private browsing deletes any malware or tracking software that your browser picks up during the session when you close the window',
  'A',
  'Incognito mode is local session privacy only. No one looking at your computer sees the history. But your ISP sees your traffic, your network administrator sees your traffic, and websites see your IP and can fingerprint your browser. It provides far less protection than most people assume.'
);

// id 378 was B — reassign to C
uq(378,
  'Why should you regularly clear your browser cookies?',
  'Cookies slow down page loading over time as the cookie store grows larger and requires longer parsing',
  'Clearing cookies removes stored passwords so you benefit from re-entering them which reinforces memory of your credentials',
  'Cookies enable persistent cross-site tracking by advertising networks and can maintain sessions to compromised accounts. Regular clearing reduces tracking continuity and removes any session tokens that may have been stolen.',
  'C',
  'Third-party cookies are how advertising networks track you across the web. Persistent session cookies can be stolen in XSS attacks and used to hijack accounts without a password. Regular clearing limits both the tracking window and the exposure window for stolen session tokens.'
);

// id 379 was B — rewrite keep B
uq(379,
  'What is the most privacy-respecting approach to protecting your browser activity?',
  'Using a VPN at all times since this hides all browsing from every observer',
  'Using a privacy-focused browser with tracking protection enabled, a content blocker, and DNS over HTTPS while avoiding unnecessary extensions',
  'Using private browsing mode for all sessions since this prevents any persistent tracking',
  'B',
  'Layered browser privacy combines blocking tracking scripts at the browser level, preventing DNS-based tracking with DoH, and limiting the browser attack surface by avoiding unnecessary extensions. No single setting achieves all of these simultaneously.'
);

// id 380 was B — reassign to A
uq(380,
  'What information should you avoid sharing publicly on social media?',
  'Your home address, daily routine, travel dates, workplace details, financial information, and combinations of personal details that could answer security questions or enable social engineering',
  'Your opinions on products and services since these can be used to craft targeted advertising',
  'Your job title and employer since this information is used for hiring decisions by competitors',
  'A',
  'Individually harmless details combine into a detailed profile useful for targeted attacks. Home addresses enable physical threats. Travel dates signal empty homes. Security question answers are often findable from public posts. The combination is the real risk.'
);

// id 381 was B — reassign to C
uq(381,
  'You receive a friend request from someone you do not recognize who has mutual friends. What is the safest approach?',
  'Accept it since mutual friends verify the person is legitimate',
  'Send a message asking how you know each other before accepting',
  'Decline it or verify directly with your mutual friends through a separate channel that this person is real, since fake accounts actively exploit mutual connection credibility',
  'C',
  'Mutual connections are a manipulation technique. Attackers create fake accounts that friend multiple real people to gain the social proof needed to expand their reach. The mutual connection tells you nothing about whether the account is genuine.'
);

// id 382 was B — rewrite keep B
uq(382,
  'What is the risk of publicly posting that you are going on vacation?',
  'Vacation posts violate most social media terms of service which prohibit sharing location-based future plans',
  'Broadcasting an empty home to your entire follower list and anyone their followers can reach creates an obvious physical security risk that criminals actively monitor social media to exploit',
  'Insurance companies monitor social media and may deny theft claims if a break-in occurs after you publicly announced your absence',
  'B',
  'Burglars do monitor social media. A post saying you will be away for two weeks tells everyone who can see it that your home is unoccupied. Even with privacy settings your content can reach people you did not intend through shares and friend-of-friend visibility.'
);

// id 383 was B — reassign to A
uq(383,
  'Why is a credit card preferable to a debit card for online purchases?',
  'Credit card fraud results in a chargeback dispute where the bank covers the charge during investigation while debit fraud immediately removes real money from your bank account with slower and less certain recovery',
  'Credit cards use stronger encryption protocols than debit cards for online transactions',
  'Credit cards do not require a PIN during checkout which reduces the risk of PIN interception',
  'A',
  'The fundamental difference is whose money is at risk during a dispute. A credit card dispute leaves your money in your account. A debit fraud drains your actual bank balance immediately, which can cause cascading financial problems while you wait for investigation and recovery.'
);

// id 384 was B — reassign to C
uq(384,
  'An unfamiliar website is selling a popular item for significantly less than everywhere else. What should you do before purchasing?',
  'Buy it immediately since flash sales on new sites are a common legitimate retail strategy',
  'Check the return policy before buying since sites with good return policies are verified businesses',
  'Research the domain age, look for reviews on independent sites, verify a physical address and contact method exist, and consider using a virtual card number to limit exposure',
  'C',
  'Fake shopping sites are common fraud vectors especially for high-demand items. Domain age tools, independent review searches, and verifying a real contact method take minutes and catch most fraudulent sites. Virtual card numbers limit your financial exposure even if the site is legitimate but later breached.'
);

// id 385 was B — rewrite keep B
uq(385,
  'What is a virtual card number and why is it useful for online shopping?',
  'A virtual card number is a temporary unique number that represents your real card for a single transaction or merchant, limiting fraud exposure to that specific number rather than your actual account',
  'A virtual card number is a card number that only exists in your password manager and is deleted after use so it cannot be used for future unauthorized transactions',
  'A virtual card number is issued by a third-party service that holds funds in escrow until you confirm receipt of your purchase',
  'B',
  'Virtual card numbers limit blast radius. If a merchant is breached or commits fraud, only the virtual number is exposed. Your real card number remains safe. Most virtual card services let you set spending limits and expiry dates on each virtual number.'
);

// id 386 was B — reassign to A
uq(386,
  'You receive an email with a .zip attachment from your bank asking you to review your statement. What should you do?',
  'Do not open the attachment. Log into your bank account directly by navigating to the bank\'s website yourself to check for any real notifications or statements.',
  'Open the zip file since bank emails with attached statements are a standard legitimate practice',
  'Forward the email to your bank\'s customer service address to ask if they sent it before opening the attachment',
  'A',
  'Banks communicate account information through secure messages within their online banking portal, not via unsolicited zip attachments. Even if this email came from your real bank\'s domain, the correct response is always to navigate to the bank independently.'
);

// id 387 — already A, rewrite for quality
uq(387,
  'What is the security benefit of using separate email addresses for different purposes?',
  'Using separate addresses for financial accounts, shopping, social media, and general use means that a breach of one address only exposes accounts created with that address, containing the damage from any single compromise',
  'Separate email addresses require attackers to compromise multiple providers instead of one to access all your accounts',
  'Email providers give higher security priority to accounts with no third-party service registrations',
  'A',
  'Compartmentalization limits cross-contamination. If your shopping email is compromised and used for spam, your financial account email remains unaffected. It also makes it obvious when a service you never gave your financial email to suddenly contacts that address.'
);

// id 388 was B — reassign to C
uq(388,
  'How do you verify that an email is genuinely from who it claims to be from?',
  'Check that the sender\'s display name matches a contact in your address book',
  'Look for a blue verification checkmark next to the sender\'s name in your email client',
  'Inspect the full email headers to check the actual sending domain and look for SPF and DKIM authentication results, then verify any requests independently through a channel you already have',
  'C',
  'Display names are trivially set to anything. Most email clients hide the actual sending address by default. Full headers reveal the true sending infrastructure. SPF and DKIM results show whether the email actually came from servers authorized to send for that domain.'
);

// id 389 was B — rewrite keep B
uq(389,
  'What is an evil twin attack on public Wi-Fi?',
  'An evil twin attack is when malware on a public Wi-Fi router duplicates network traffic and sends copies to an attacker\'s server',
  'An evil twin attack creates a rogue access point with the same or similar name as a legitimate network to trick devices into connecting to it so the attacker can intercept traffic',
  'An evil twin attack uses a compromised device on a legitimate network to create a secondary connection that captures credentials from other users',
  'B',
  'Evil twin attacks exploit the fact that devices automatically connect to known network names. The attacker broadcasts the same SSID as the coffee shop network, often with stronger signal, and devices connect without user interaction. All traffic then passes through the attacker.'
);

// id 390 — already C, rewrite for quality
uq(390,
  'You need to check your bank account urgently and only public Wi-Fi is available. What is the safest approach?',
  'Connect to the public Wi-Fi and ensure the banking site shows HTTPS before logging in',
  'Find a network with a password since password-protected Wi-Fi networks are safe for banking',
  'Use your phone\'s mobile data instead of public Wi-Fi, or connect through your corporate or personal VPN if mobile data is truly unavailable',
  'C',
  'Mobile data travels through your carrier\'s managed network rather than a shared public environment. Public Wi-Fi with or without a password is an untrusted shared network susceptible to evil twin attacks and traffic monitoring. A VPN provides the same protection if mobile data is not an option.'
);

// id 391 was B — reassign to A
uq(391,
  'Why should you disable auto-connect to open Wi-Fi networks on your devices?',
  'Auto-connect allows attackers to set up rogue networks with common names that your device joins automatically without any user interaction, exposing your traffic without you realizing you switched networks',
  'Auto-connect consumes additional battery by keeping the Wi-Fi radio in a continuous scanning state',
  'Auto-connect sends your device\'s MAC address to every network it scans even before connecting, enabling physical location tracking',
  'A',
  'Evil twin attacks succeed most easily against devices set to auto-connect. Your phone might have silently joined a malicious network named Free Airport Wi-Fi while you were not looking. Requiring manual confirmation of new network connections prevents silent automatic connections.'
);

// id 392 was B — reassign to C
uq(392,
  'What is the most effective way to protect a child from inappropriate online content?',
  'Block all internet access except a small list of pre-approved educational sites',
  'Rely on the content filtering systems built into major platforms since these are professionally maintained',
  'Combine technical controls like router-level filtering with ongoing age-appropriate conversations about online safety so children develop judgment rather than just encountering barriers',
  'C',
  'Technical controls alone fail when children encounter content on devices or networks outside your control. Building genuine understanding through ongoing conversations gives children the judgment to handle situations where filters do not apply.'
);

// id 393 was B — rewrite keep B
uq(393,
  'What personal information should children never share online?',
  'Children should avoid sharing their favorite subjects and hobbies since this information can be used for targeted grooming',
  'Children should never share their full name, home address, school name, phone number, daily schedule, or photos that reveal their location, as this information enables real-world targeting',
  'Children should avoid sharing their age since this information is used by advertisers to target them with age-inappropriate content',
  'B',
  'The combination of name, school, and location gives a stranger enough to physically locate a child. Daily schedule information tells them when the child will be alone or in a predictable place. These categories of information must be protected regardless of how trustworthy the online contact seems.'
);

// id 394 was B — reassign to A
uq(394,
  'Your child receives a friend request from an adult on a gaming platform. What should you do?',
  'Review the account together with your child, decline the request, and use it as a teaching moment about why adult strangers should not be seeking friendships with children on gaming platforms',
  'Allow it if your child says they have been playing games with this person for a while and considers them a friend',
  'Contact the platform to report the account since all adult contact with children on gaming platforms violates terms of service',
  'A',
  'Adults initiating contact with children on gaming platforms is a grooming risk regardless of how long they have been playing together online. The conversation is more valuable than the decision itself because it builds the judgment your child needs when you are not watching.'
);

// id 395 was B — reassign to C
uq(395,
  'Why should you periodically search for your own name online?',
  'To monitor your credit reputation since lenders search for your name before making credit decisions',
  'To identify positive content that should be amplified to improve your professional reputation',
  'To discover what information about you is publicly accessible and take action to remove or correct anything that creates a privacy or security risk',
  'C',
  'You cannot manage exposure you do not know exists. Searching your own name reveals data broker listings, old accounts, news mentions, and social media profiles that show what a stranger could learn about you. This informs where to focus your privacy cleanup efforts.'
);

// id 396 was B — rewrite keep B
uq(396,
  'How can you reduce your digital footprint when creating new online accounts?',
  'Use your real name and accurate information since false information violates terms of service and can limit account recovery options',
  'Provide only the minimum information required by the service, use an email alias rather than your primary address, and avoid connecting new accounts to existing social media profiles',
  'Use the same username across all services since consistency makes account management easier and does not increase your risk',
  'B',
  'Minimum information disclosure limits what is exposed if the service is breached. Aliases prevent the service from being connected to your primary email identity. Avoiding social login prevents data sharing between platforms and cross-service tracking.'
);

// id 397 was B — reassign to A
uq(397,
  'Someone online claims you have won a lottery you never entered and asks for personal information to process your prize. What is this?',
  'This is a classic advance fee or prize scam. There is no prize. Any personal information or fees you provide go directly to the scammer with no legitimate purpose.',
  'This is likely a marketing promotion where the lottery entry was automatic based on a previous online activity',
  'This is a standard identity verification process used by legitimate sweepstakes to confirm winners are real people',
  'A',
  'You cannot win a lottery you did not enter. Requests for information or fees to claim a prize are advance fee fraud regardless of how official the communication appears. Legitimate sweepstakes do not require you to pay anything to receive a prize.'
);

// id 398 was B — reassign to C
uq(398,
  'A pop-up warns that your computer is infected and gives you a phone number to call for immediate help. What is this?',
  'This is a legitimate Windows Security alert since Windows displays phone numbers for certified support partners',
  'This may be legitimate if the pop-up appeared while visiting a known security software provider\'s website',
  'This is a tech support scam. Legitimate security software never displays phone numbers to call. Close the browser tab or window and run your own antivirus scan independently.',
  'C',
  'Tech support scams use alarming pop-ups to pressure victims into calling fake support lines. Real antivirus software never tells you to call a phone number. Close the pop-up by ending the browser process in Task Manager if it will not close normally.'
);

// id 399 — already C, rewrite for quality
uq(399,
  'What payment method do legitimate organizations never use to collect money?',
  'Bank transfers to business accounts',
  'Credit card payments through established payment processors',
  'Gift cards, wire transfers, or cryptocurrency, as these are irreversible payment methods that legitimate organizations have no reason to request',
  'C',
  'Gift cards and wire transfers are irreversible. Legitimate businesses use traceable reversible payment methods. Any request for payment via gift card regardless of the stated reason is a scam. The irreversibility is the feature that makes these methods attractive to fraudsters.'
);

// ── Section 6: Device Security remaining stale ids 400-432 ──────────────────

// id 400 was B — rewrite keep B
uq(400,
  'A flashlight app requests access to your contacts, microphone, and location. What should you do?',
  'Grant all permissions since the developer probably has a legitimate reason even if it is not immediately obvious',
  'Deny all permissions a flashlight app does not need to function. A flashlight requires only the camera flash. Any additional permission request is a signal of data harvesting or malicious intent.',
  'Grant location only since this is less sensitive than contacts or microphone access',
  'B',
  'Permissions should match app functionality. A flashlight uses the camera LED and nothing else. Requesting contacts, microphone, or location reveals that the app intends to harvest data beyond its stated purpose. Deny permissions that have no legitimate functional justification.'
);

// id 401 was B — reassign to A
uq(401,
  'How often should you review the permissions granted to apps on your devices?',
  'At minimum every few months and whenever you notice unexpected battery drain, data usage, or background activity, since apps may have added new permission requests through updates',
  'Only when installing a new app since permissions cannot change after installation without your explicit approval',
  'Annually during a scheduled security review is sufficient since permissions rarely change on installed apps',
  'A',
  'App updates can add new functionality that exercises permissions you granted previously without asking again. Periodic reviews catch situations where an app you trusted with one permission is now using it in ways you did not anticipate.'
);

// id 402 was B — reassign to C
uq(402,
  'What is the principle of least privilege as it applies to app permissions on a mobile device?',
  'Apps should request permissions one at a time rather than all at once to avoid overwhelming the user',
  'Apps should default to the most restrictive permission level and request additional access only when a feature that needs it is first used',
  'Each app should only be granted the specific permissions required for the features you actually use, and those permissions should be revoked if the features are not in use',
  'C',
  'Least privilege for apps means granting exactly what is needed for legitimate functionality and nothing more. Location access can be limited to while using the app. Contacts, microphone, and camera can be denied for apps that do not demonstrably need them.'
);

// id 403 was B — rewrite keep B
uq(403,
  'Why should you use a standard user account for daily computer use instead of an administrator account?',
  'Standard accounts have faster login times since they skip the administrator privilege verification process at startup',
  'Malware executed under a standard user account cannot install system-wide software, modify protected system files, or make changes that persist across reboots without elevation, significantly limiting the damage it can do',
  'Standard accounts encrypt user files automatically while administrator accounts do not for compatibility reasons',
  'B',
  'The malware runs with the same privileges as the user who executed it. A standard account limits those privileges significantly. Malware that could compromise an entire system under an admin account may be limited to the user profile under a standard account.'
);

// id 404 was B — reassign to A
uq(404,
  'What does Secure Boot protect against?',
  'Secure Boot verifies that the bootloader and operating system components have not been tampered with before allowing them to load, preventing bootkits and rootkits that attempt to establish persistence before the OS starts',
  'Secure Boot encrypts the contents of the boot partition so the operating system cannot be read if the drive is removed',
  'Secure Boot blocks all external storage devices from being used as boot media to prevent unauthorized OS boots',
  'A',
  'Bootkit malware targets the boot process specifically because anything that runs before the OS is invisible to security software running inside it. Secure Boot uses cryptographic signatures to verify that only trusted code runs at startup.'
);

// id 405 was B — reassign to C
uq(405,
  'Why should Windows Update be set to install updates automatically?',
  'Automatic updates improve PC performance by scheduling updates during off-peak hours when the PC is idle',
  'Automatic updates ensure compatibility with new software releases since developers target the latest Windows version',
  'Security patches are frequently released in response to actively exploited vulnerabilities, and the gap between patch release and installation is a window during which attackers specifically target unpatched systems',
  'C',
  'The time between a patch being released and it being installed is when attacks peak. Attackers reverse-engineer patches to understand what was fixed, then immediately target systems that have not yet applied them. Automatic updates minimizes this exposure window.'
);

// id 406 was B — rewrite keep B
uq(406,
  'What is the risk of installing apps from outside the official app store on Android?',
  'Apps from outside the Play Store automatically request more permissions than store-approved apps since they bypass the permission review process',
  'Sideloaded apps bypass Google\'s malware scanning and policy enforcement, so there is no automated check that the app does not contain malware or overly invasive data collection',
  'Apps from outside the Play Store do not receive security updates since the update mechanism requires store infrastructure',
  'B',
  'Google Play scans apps for malware before distribution. Sideloaded APKs receive no such review. Attackers distribute modified versions of legitimate popular apps through unofficial channels specifically because users have more trust in familiar app names.'
);

// id 407 was B — reassign to A
uq(407,
  'Why should you avoid rooting your Android device?',
  'Rooting removes the security boundaries that separate apps from each other and from system resources, allowing malicious apps with root access to steal data from all other apps, install persistent malware, and disable security features',
  'Rooted devices cannot connect to cellular networks since carriers detect root status and block connectivity',
  'Rooting invalidates the device warranty and disables the ability to receive official software updates',
  'A',
  'The Android security model relies on process isolation and privilege separation. Root access bypasses all of this. A malicious app that gains root access can read data from banking apps, intercept credentials, and modify the system in ways that survive factory resets.'
);

// id 408 was B — reassign to C
uq(408,
  'What should you do if your Android device is lost or stolen?',
  'Contact your carrier immediately to suspend service since this prevents all use of the device',
  'Wait 24 hours before taking action since most lost phones are found and returned within a day',
  'Use Find My Device to locate it if possible, remotely lock it with a recovery message, and remotely wipe it if recovery seems unlikely to prevent access to your accounts and data',
  'C',
  'Remote wipe eliminates the most significant risk from device theft which is data access rather than hardware loss. Enable Find My Device before losing a device. Carrier suspension stops calls and data but does not protect the data already on the device.'
);

// id 409 was B — rewrite keep B
uq(409,
  'Why is a 6-digit PIN more secure than a 4-digit PIN for device lock screens?',
  'Six-digit PINs are encrypted with a stronger algorithm than four-digit PINs in iOS and Android',
  'A 6-digit PIN has one million possible combinations compared to ten thousand for a 4-digit PIN, making brute force attacks one hundred times more difficult',
  'Six-digit PINs time out more quickly after failed attempts than four-digit PINs reducing the practical attack window',
  'B',
  'The math is straightforward. 10,000 possible 4-digit PINs versus 1,000,000 possible 6-digit PINs. Combined with device lockout policies that limit attempts, the search space increase makes a significant practical difference against offline attacks.'
);

// id 410 was B — reassign to A
uq(410,
  'What does Lockdown Mode do on iOS?',
  'Lockdown Mode severely restricts attack surface by disabling message attachment previews, blocking wired device connections, disabling certain web technologies, and preventing unsolicited FaceTime calls, designed for individuals facing targeted nation-state attacks',
  'Lockdown Mode encrypts all data on the device and disables network connectivity until a PIN is entered',
  'Lockdown Mode prevents all app installations and restricts Safari to a pre-approved list of trusted websites',
  'A',
  'Lockdown Mode was designed for high-risk individuals like journalists, activists, and executives who face sophisticated targeted attacks. It trades convenience for a dramatically reduced attack surface by disabling features that sophisticated exploits commonly target.'
);

// id 411 was B — reassign to C
uq(411,
  'Why should you keep iOS updated promptly?',
  'iOS updates add features that make the device more compatible with new accessories and third-party apps',
  'Apple releases updates on a monthly cycle and older versions stop receiving app updates from developers',
  'iOS updates frequently patch zero-day vulnerabilities that are actively exploited in the wild, and Apple\'s rapid patching cycle means the window between exploit discovery and patch release is short but not zero',
  'C',
  'Apple has a strong security update track record but iOS zero-days are valuable and actively sold to governments and criminals. Prompt updates minimize the window during which your device is vulnerable to publicly known exploits.'
);

// id 412 was B — rewrite keep B
uq(412,
  'Why is full disk encryption especially important for laptops compared to desktop computers?',
  'Laptops use lower-quality storage drives that are more susceptible to data corruption, making encryption a necessary backup for data integrity',
  'Laptops are frequently carried outside secure environments making physical theft a realistic risk. Full disk encryption ensures that a stolen drive yields nothing readable without the decryption key.',
  'Laptops connect to more networks than desktops making network-based data theft more likely, and encryption prevents this type of interception',
  'B',
  'Theft is the threat model that disk encryption addresses. A laptop left in a car, checked bag, or cafe is a realistic theft scenario. Without encryption, anyone with the drive can read every file regardless of your Windows password.'
);

// id 413 was B — reassign to A
uq(413,
  'What is shoulder surfing?',
  'Shoulder surfing is when someone observes your screen, keyboard, or actions from nearby to capture passwords, PINs, or sensitive information you are entering or viewing',
  'Shoulder surfing is a network attack where malware on a nearby device captures Wi-Fi traffic from your device without connecting to the same network',
  'Shoulder surfing is when an attacker stands behind you at an ATM and physically blocks the camera to prevent your PIN from being recorded while they observe it directly',
  'A',
  'Shoulder surfing is simple opportunistic surveillance. Crowded spaces, coffee shops, and public transport create many opportunities. Privacy screens, body positioning, and awareness of your surroundings are the defenses.'
);

// id 414 was B — reassign to C
uq(414,
  'How long should your screen lock idle timeout be set to?',
  'No more than 30 minutes since this balances security with the inconvenience of frequent re-authentication',
  'No more than 15 minutes since this is the standard recommended by most enterprise security policies',
  'No more than 5 minutes on mobile devices and no more than a few minutes on unattended workstations, since a shorter timeout minimizes the window during which an unattended device can be accessed',
  'C',
  'Screen lock timeout is your last line of defense when you forget to lock manually. Shorter is always better from a security perspective. Most users find 5 minutes or less on mobile and 2 to 5 minutes on workstations an acceptable balance between security and convenience.'
);

// id 415 was B — rewrite keep B
uq(415,
  'Why are IoT devices considered high security risks in home and business networks?',
  'IoT devices generate large amounts of network traffic that creates confusion for security monitoring tools',
  'IoT devices typically run embedded operating systems that rarely receive security updates, use default credentials, lack security controls, and cannot run endpoint security software, making them persistently vulnerable targets',
  'IoT devices are always connected to cloud services that have weaker security than local network resources',
  'B',
  'The IoT security problem is structural. Manufacturers prioritize cost and time to market. Security updates are infrequent or stop entirely after a few years. The device continues running indefinitely with known unpatched vulnerabilities on your network.'
);

// id 416 was B — reassign to A
uq(416,
  'What should you do with IoT device features you do not use?',
  'Disable them in the device settings to reduce the attack surface since unused features with network access create vulnerabilities that serve no purpose for your use case',
  'Leave them enabled since disabling features can cause unexpected compatibility problems with future firmware updates',
  'Enable them all initially and disable only the ones that cause problems since manufacturers enable features by default for good reasons',
  'A',
  'Every enabled feature is a potential attack vector. Remote access, UPnP, cloud connectivity, and microphone activation are all features that have been exploited on IoT devices. If you do not use a feature, disabling it removes that attack surface at zero cost.'
);

// id 417 was B — reassign to C
uq(417,
  'Why should IoT devices be placed on a separate network segment from your main devices?',
  'IoT devices use communication protocols incompatible with standard networks and function better in isolated segments',
  'IoT devices consume disproportionate bandwidth that degrades performance for computers and phones on the same segment',
  'A compromised IoT device on a separate network cannot directly communicate with your computers, phones, and sensitive data on the main network, containing the damage from an inevitable IoT compromise',
  'C',
  'IoT devices will eventually be compromised because they have poor security hygiene. Network segmentation accepts this reality and ensures that when it happens, the attacker cannot use the compromised device as a pivot point to reach your more sensitive devices.'
);

// id 418 was B — rewrite keep B
uq(418,
  'What is juice jacking?',
  'Juice jacking is a physical attack where a modified charging cable installs malware on your device when you connect it to charge',
  'Juice jacking is an attack that uses compromised USB charging ports in public places to install malware on or steal data from devices that connect for charging',
  'Juice jacking is a technique that overcharges a device battery to cause permanent damage, used as a targeted physical sabotage method',
  'B',
  'Public USB ports are data connections, not just power sources. A compromised charging station can enumerate your device, install malware, or exfiltrate data while it charges. Using a USB data blocker or your own AC adapter eliminates this attack surface entirely.'
);

// id 419 was B — reassign to A
uq(419,
  'How can you safely charge your phone at a public USB charging station?',
  'Use a USB data blocker between your cable and the public port, which passes power but blocks data pins, or use your own AC power adapter and wall outlet instead',
  'Enable airplane mode before connecting since this disables the data transfer capability of the USB port',
  'Use only USB-C ports since the USB-C standard includes hardware controls that prevent unauthorized data transfer during charging',
  'A',
  'USB data blockers are inexpensive and completely eliminate the juice jacking threat by physically blocking the data pins. Airplane mode does not disable USB data transfer. USB-C standard does not inherently block data transfer without an explicit data blocker.'
);

// id 420 was B — reassign to C
uq(420,
  'What should you do with sensitive data stored on a device you are about to sell or donate?',
  'Delete all personal files and photos, then factory reset the device, which is sufficient for most consumer devices',
  'Remove the SIM card and memory card, then perform a factory reset since those contain all your personal data',
  'Perform a factory reset and then use a secure erase tool to overwrite the storage, or use the manufacturer\'s secure erase feature designed for this purpose, to ensure data cannot be recovered by the next owner',
  'C',
  'Simple factory resets on some devices do not securely overwrite storage and can be reversed with recovery tools. Dedicated secure erase overwrites data with random content making recovery impractical. For HDDs, multiple overwrite passes provide additional assurance.'
);

// ── Section 7: Privacy remaining stale ids 421-461 ──────────────────────────

// id 421 was B — rewrite keep B
uq(421,
  'Why do attackers specifically target unpatched software?',
  'Unpatched software is easier to access remotely since updates include new authentication requirements',
  'Unpatched software contains known vulnerabilities that have public exploits available, making attacks reliable and requiring minimal attacker skill since the exploitation techniques are already documented and often automated',
  'Unpatched software runs slower, creating timing vulnerabilities that sophisticated attackers can exploit for code execution',
  'B',
  'Public CVEs include technical details about vulnerabilities. Proof-of-concept exploits are often published. Automated exploit frameworks incorporate known vulnerabilities as modules. A known unpatched vulnerability is not a technical challenge for an attacker, it is a free entry point.'
);

// id 422 was B — reassign to A
uq(422,
  'What is the risk of leaving software installed that you no longer use?',
  'Unused software continues receiving no security updates while retaining vulnerabilities and access to your system, creating a persistently exploitable attack surface that provides you no benefit',
  'Unused software consumes license keys that could be used for new installations',
  'Unused software degrades system performance by maintaining registry entries and scheduled tasks even when not running',
  'A',
  'Every installed application is an attack surface. Unused apps stop receiving your attention and their vulnerabilities go unpatched. An attacker does not care whether you use an application, only whether it provides a path onto your system.'
);

// id 423 was B — reassign to C
uq(423,
  'Which type of software is particularly critical to keep patched because it is directly exposed to untrusted content?',
  'System utility software like disk management tools since these have deep OS access that could be exploited',
  'Database software since it stores credentials and sensitive data that are high-value targets',
  'Browsers, PDF readers, office suites, and media players since these directly process untrusted content from the internet and are the primary delivery mechanism for client-side exploits',
  'C',
  'Client-side software that processes arbitrary external content is the primary target for exploitation. A browser rendering a malicious page, a PDF reader opening a crafted document, or a media player loading a booby-trapped video are all standard attack chains.'
);

// id 424 was B — rewrite keep B
uq(424,
  'What is the strongest authentication combination for a mobile device lock screen?',
  'A face ID scan combined with a location check so the device only unlocks when you are in a trusted location',
  'Biometric authentication like fingerprint or face ID plus a strong PIN or passphrase as the fallback, since biometrics are convenient but the PIN is the actual cryptographic key used to protect encrypted storage',
  'A complex alphanumeric password since this provides more combinations than any biometric system',
  'B',
  'Device encryption is tied to the PIN or passphrase, not the biometric. The biometric is a convenient shortcut that unlocks the PIN-protected session without making you type it every time. The PIN\'s strength determines the encryption protection. A weak PIN undermines strong biometrics.'
);

// id 425 was B — reassign to A
uq(425,
  'Why is a swipe pattern less secure than a PIN on Android?',
  'Swipe patterns leave visible smudge traces on screens that can reveal the pattern to anyone who holds the device up to a light source, and the number of practical patterns people actually use is far smaller than the theoretical possibilities',
  'Android assigns numerical values to swipe patterns that are stored in a recoverable format unlike PIN hashes',
  'Pattern recognition software bundled with unlock tools can identify patterns from screen recording in seconds',
  'A',
  'Smudge attacks are a documented threat. Screen oils leave traces of the swipe path that are visible under certain lighting. Additionally, people gravitate toward predictable shapes like letters or simple geometric forms, dramatically reducing the effective pattern space.'
);

// id 426 was B — reassign to C
uq(426,
  'What should you do when you leave your computer even briefly?',
  'Close any sensitive applications before stepping away since this prevents unauthorized access to open documents',
  'Log out of your user account completely so the session cannot be accessed without re-entering your password',
  'Lock the screen immediately using Win+L on Windows or the equivalent shortcut, since logging out is unnecessary for brief absences but an unlocked screen can be accessed in seconds',
  'C',
  'Screen locking takes one keystroke and allows you to resume instantly when you return. Logging out completely requires restarting all applications. Locking is the correct balance for brief absences and the habit of always locking prevents the accidental unlocked departure.'
);

// id 427 was B — rewrite keep B
uq(427,
  'What is the difference between traditional antivirus and modern endpoint security?',
  'Traditional antivirus runs as a background service while modern endpoint security requires manual scans to detect threats',
  'Traditional antivirus primarily uses signature databases to identify known malware, while modern endpoint security adds behavioral analysis, exploit protection, network monitoring, and rollback capabilities to detect threats that have no known signature',
  'Traditional antivirus protects only local files while modern endpoint security also scans cloud storage and email attachments',
  'B',
  'Signature-based detection is effective only against known malware with published signatures. New malware variants evade it trivially. Behavioral detection identifies suspicious activity patterns regardless of whether the specific malware is recognized, catching zero-day and polymorphic threats.'
);

// id 428 was B — reassign to A
uq(428,
  'Is Windows Defender sufficient protection for most home users?',
  'Yes, modern Windows Defender has matured significantly and consistently performs well in independent testing, making it a reasonable baseline that most home users can rely on when combined with good security habits',
  'No, Windows Defender lacks real-time protection and only scans on demand which creates dangerous gaps in coverage',
  'No, Microsoft has a conflict of interest that prevents Defender from fully protecting against Windows-specific threats',
  'A',
  'Windows Defender has dramatically improved and now consistently ranks competitively in AV-Comparatives and AV-Test evaluations. For home users who also practice good habits, it provides adequate baseline protection without the performance overhead of some third-party alternatives.'
);

// id 429 was B — reassign to C
uq(429,
  'What does a behavioral detection engine in antivirus software do differently than signature-based detection?',
  'Behavioral detection compares files against a cloud database of known good files rather than known bad ones, flagging anything not on the approved list',
  'Behavioral detection scans files before they are executed while signature detection can only identify threats after they start running',
  'Behavioral detection monitors what programs actually do at runtime, flagging actions like process injection, registry modification, and network callbacks that are characteristic of malicious activity even when no signature matches',
  'C',
  'Behavior monitoring catches threats based on what they do rather than what they are. A new ransomware variant with no signature will still trigger behavioral rules when it begins encrypting files in rapid succession. This detection method is effective against novel and polymorphic malware.'
);

// id 430 was B — rewrite keep B
uq(430,
  'Why is simply deleting files and formatting a hard drive insufficient for secure disposal?',
  'Formatting removes file system indexes but does not overwrite the underlying data sectors, meaning deleted files remain physically present on the drive and recoverable with standard forensic or recovery tools',
  'Modern hard drives use journaling file systems that maintain copies of deleted data in a protected log that formatting cannot reach',
  'Operating systems maintain shadow copies of all deleted files in a hidden system partition that survives standard formatting',
  'B',
  'Delete and format operations mark storage space as available without overwriting the actual data. The original content remains in those sectors until overwritten by new data. Forensic recovery of formatted drives is routine and does not require specialized hardware.'
);

// id 431 was B — reassign to A
uq(431,
  'What is the most secure way to dispose of an old hard drive containing sensitive data?',
  'For HDDs, use a verified secure erase tool that overwrites all sectors with random data or perform NIST 800-88 compliant wiping. For SSDs, use the manufacturer\'s ATA Secure Erase command. Physical destruction is the only guarantee when cryptographic erasure is not verifiable.',
  'Format the drive three times using different file systems since each format cycle overwrites the previous data',
  'Remove the drive from the enclosure since drives are only readable when installed in a compatible system',
  'A',
  'Standard formatting is insufficient. NIST 800-88 provides the authoritative framework for media sanitization. SSD secure erase differs from HDD overwriting due to wear leveling. Physical destruction is the correct choice for highly sensitive data or when software erasure cannot be verified.'
);

// id 432 was B — reassign to C
uq(432,
  'Before donating a smartphone, what must you do?',
  'Remove the SIM card, delete all apps, and clear the browser history to remove your personal data',
  'Sign out of all accounts and then factory reset the device',
  'Sign out of all accounts, disable Find My, perform a factory reset, and verify the device shows the initial setup screen before handing it over to confirm all personal data has been removed',
  'C',
  'Each step matters. Account sign-out prevents the new owner from accessing your services. Find My deactivation allows the device to be set up under a new Apple ID. The factory reset removes data. Verifying the initial setup screen confirms the process completed fully.'
);

// id 433 was B — rewrite keep B
uq(433,
  'What is a data broker?',
  'A data broker is a financial intermediary that connects companies seeking to monetize customer data with advertisers willing to pay for it',
  'A data broker is a company that collects personal information from public records, social media, purchase history, and other sources and sells it to third parties without any direct relationship with the individuals whose data it holds',
  'A data broker is a regulated entity that helps individuals and businesses securely transfer personal records between institutions',
  'B',
  'Data brokers operate largely without the knowledge of the people they profile. They aggregate information from hundreds of sources into detailed profiles covering home addresses, family members, employment history, purchasing behavior, and more, and sell this to anyone willing to pay.'
);

// id 434 was B — reassign to A
uq(434,
  'How can you reduce your exposure to data broker collection?',
  'Submit opt-out requests to major data brokers directly using services like DeleteMe or by navigating each broker\'s opt-out process, and repeat this periodically since brokers re-add data over time',
  'Contact the FTC to have your information removed from all data broker databases simultaneously through the official federal opt-out registry',
  'Sue data brokers under GDPR regardless of your location since European privacy law applies to any company that collects data about EU residents',
  'A',
  'There is no single registry or federal opt-out for US data brokers. Each broker requires a separate opt-out request. Services like DeleteMe automate submissions across many brokers simultaneously. Periodic repetition is necessary because brokers continuously re-acquire data from new sources.'
);

// id 435 was B — reassign to C
uq(435,
  'Why is your email address particularly valuable to data brokers and advertisers?',
  'Email addresses contain demographic information in their format that helps brokers identify age, gender, and location',
  'Email addresses are used as primary identifiers in data broker databases making them the key that links records from different sources',
  'Email addresses serve as persistent cross-platform identifiers that link your activity across websites, purchases, and services, enabling trackers to build a unified profile of your behavior across the entire internet',
  'C',
  'Email is the universal account identifier. Your email address appears in purchase confirmations, account registrations, newsletter subscriptions, and support tickets across thousands of services. Data brokers and advertisers use it as the common key to merge profiles from different sources into one comprehensive record.'
);

// id 436 was B — rewrite keep B
uq(436,
  'What is browser fingerprinting?',
  'Browser fingerprinting is when a website stores a unique identifier in your browser cookies to track your return visits',
  'Browser fingerprinting identifies you by collecting a combination of technical characteristics about your browser and device including screen resolution, installed fonts, timezone, and hardware details that together form a unique identifier that persists across browsing sessions even without cookies',
  'Browser fingerprinting is a security technique websites use to detect whether you are using a genuine browser or an automated bot',
  'B',
  'Fingerprinting is passive and consent-free. It does not store anything on your device. The combination of dozens of browser and device attributes creates a statistically unique identifier that tracks you even in private mode, after clearing cookies, or across different networks.'
);

// id 437 was B — reassign to A
uq(437,
  'Why should you block third-party cookies?',
  'Third-party cookies are set by advertising networks and analytics companies rather than the site you are visiting, and they enable persistent cross-site tracking of your browsing behavior across every website that uses those networks',
  'Third-party cookies consume significant browser memory that degrades performance on older devices',
  'Third-party cookies are a common delivery mechanism for browser-based malware that executes when the cookie is loaded',
  'A',
  'Third-party cookies are the technical mechanism behind ad tracking networks. When you visit any site in the network\'s reach, a cookie from the tracker\'s domain is set. Over time this builds a detailed record of your interests and browsing patterns used to target ads and sell to data brokers.'
);

// id 438 was B — reassign to C
uq(438,
  'Which type of search engine better protects your privacy?',
  'Search engines owned by companies headquartered in countries with strict privacy legislation',
  'Search engines that offer HTTPS connections since this prevents your ISP from seeing your queries',
  'Search engines like DuckDuckGo or Brave Search that do not log search queries tied to your identity, preventing the creation of a search history profile that can be sold or subpoenaed',
  'C',
  'Traditional search engines tie your queries to your account or device over time, building a detailed profile of your interests, health concerns, political views, and intentions. Privacy-focused search engines break this by not linking searches to an identity, even if individual queries are visible.'
);

// id 439 was B — rewrite keep B
uq(439,
  'What does adjusting your social media post audience to Friends only accomplish?',
  'Restricting to Friends only prevents social media platforms from including your posts in algorithmic recommendation feeds',
  'Restricting to Friends only limits who can see your posts to people you have accepted as connections, reducing exposure to strangers, data scrapers, and employers but not eliminating privacy risks since friends can share or screenshot your content',
  'Restricting to Friends only also prevents the platform itself from using your posts for advertising targeting',
  'B',
  'Friends-only settings reduce your public exposure but do not eliminate risk. The platform still has access to your content. Any friend can screenshot or share your post. The setting is a useful baseline but not a guarantee of privacy for anything sensitive.'
);

// id 440 was B — reassign to A
uq(440,
  'Why should you review which third-party apps have access to your social media accounts?',
  'Connected apps may retain access permissions long after you stop using them and a breach of any connected app can provide attackers with the same access level you originally granted',
  'Third-party apps connected to social media accounts automatically post on your behalf which can damage your professional reputation',
  'Social media platforms charge additional fees for accounts with many third-party app connections',
  'A',
  'Every connected app is a persistent access grant. If that app is breached, attackers inherit its access to your social media account. Apps you connected years ago for a game or quiz may still have read access to your contacts, posts, or messages.'
);

// id 441 was B — reassign to C
uq(441,
  'Can you truly delete a post from social media?',
  'Yes, deleting a post removes it from all servers within 24 hours as required by the platform\'s terms of service',
  'Yes, deleted posts are immediately removed from all views including other users\' feeds and cached versions',
  'Not reliably, since platforms may retain deleted content in their systems, other users may have screenshotted or shared it, and search engine caches may index it before deletion. Treat every post as permanent before publishing.',
  'C',
  'Digital content persistence is a real privacy risk. Screenshots are instantaneous. Platform data retention policies are often opaque. Search indexing can happen within minutes. The practical approach is to never post anything you would not want to exist permanently.'
);

// id 442 was B — rewrite keep B
uq(442,
  'What is end-to-end encryption in messaging?',
  'End-to-end encryption means the messaging provider encrypts messages on their servers so employees cannot read them during storage',
  'End-to-end encryption means messages are encrypted on the sender\'s device and can only be decrypted on the recipient\'s device, so the messaging service itself cannot read the content even if legally compelled to produce it',
  'End-to-end encryption means messages are encrypted during transmission but stored in decryptable form so account recovery is possible',
  'B',
  'The key distinction is that only the communicating devices hold the decryption keys. The service provider stores only ciphertext it cannot read. Subpoenas served to the provider yield unreadable data. This is fundamentally different from provider-encrypted storage where the provider holds the keys.'
);

// id 443 was B — reassign to A
uq(443,
  'Why is Signal considered more private than WhatsApp for sensitive communications?',
  'Signal is open-source and nonprofit with minimal metadata collection, stores almost nothing about users, and does not retain message logs, while WhatsApp collects extensive metadata including who you message, when, and from where even though message content is end-to-end encrypted',
  'Signal uses a proprietary encryption algorithm stronger than the one WhatsApp uses',
  'Signal does not require a phone number for registration while WhatsApp ties your identity to your mobile number',
  'A',
  'End-to-end encryption protects message content in both apps. The difference is in metadata. WhatsApp is owned by Meta and collects communication metadata that reveals your social graph, habits, and relationships. Signal collects almost none of this by design.'
);

// id 444 was B — reassign to C
uq(444,
  'What is metadata in the context of messaging privacy?',
  'Metadata in messaging refers to the message text before it is encrypted for transmission',
  'Metadata is the technical header information that routing systems use to deliver messages, separate from any user-generated content',
  'Metadata is data about your communications such as who you messaged, when, how often, from what location, and for how long, which reveals your relationships and habits even when the content itself is encrypted',
  'C',
  'Metadata can be more revealing than content. Knowing that someone called a suicide hotline, an oncologist, and a law firm on consecutive days reveals something profound about their situation without a single word of conversation. Encrypted content with unprotected metadata is still a significant privacy exposure.'
);

// id 445 was B — rewrite keep B
uq(445,
  'When you use a VPN, who can see your internet traffic?',
  'Nobody can see your traffic when using a VPN since all data is encrypted end-to-end between your device and every website you visit',
  'Your ISP sees only encrypted VPN traffic and cannot read the content, but the VPN provider can see all your unencrypted traffic and the websites you visit, along with any websites you visit that do not use HTTPS',
  'Your ISP sees your normal traffic since VPNs only encrypt traffic after it reaches the VPN server, not between your device and the server',
  'B',
  'A VPN shifts trust from your ISP to your VPN provider. Your ISP sees only encrypted packets going to the VPN server. But the VPN provider sees everything you do after the tunnel endpoint. Choosing a trustworthy provider with a verified no-logs policy matters for this reason.'
);

// id 446 was B — reassign to A
uq(446,
  'What makes a VPN provider\'s jurisdiction important for privacy?',
  'VPN providers in countries outside of intelligence-sharing alliances like Five Eyes cannot be compelled by those governments to secretly log and hand over user data, while providers within member countries may be subject to such orders',
  'VPN providers are only licensed to operate in their country of jurisdiction meaning they can only accept customers from that country',
  'VPN providers in certain jurisdictions must use government-approved encryption algorithms that are weaker than commercial standards',
  'A',
  'Five Eyes and other intelligence alliances coordinate data sharing between member governments. A VPN provider in a member country may receive a lawful order to log specific users and produce that data silently. Jurisdiction outside these alliances reduces but does not eliminate this risk.'
);

// id 447 was B — reassign to C
uq(447,
  'What is Tor and how does it differ from a VPN for privacy?',
  'Tor is a VPN service operated by a nonprofit that provides stronger privacy than commercial VPNs because it is not motivated by profit',
  'Tor is an encrypted tunnel that routes traffic through two servers instead of one, doubling the protection compared to standard VPN connections',
  'Tor routes traffic through three independently operated relays so no single node knows both who you are and what you are accessing, providing stronger anonymity than a VPN at the cost of much slower speeds',
  'C',
  'The three-hop architecture is the key difference. With a VPN, the provider knows your IP and can see your traffic. With Tor, the entry node knows your IP but not your destination, and the exit node sees your destination but not your IP. No single operator has the full picture.'
);

// id 448 was B — rewrite keep B
uq(448,
  'Why is standard email not considered private?',
  'Standard email is not private because email providers automatically scan and analyze message content for advertising targeting purposes',
  'Standard email travels through multiple servers in plaintext by default, can be read by administrators at any server it passes through, and is stored indefinitely on provider servers that can be subject to legal orders or breaches',
  'Standard email uses a shared encryption key for each domain meaning anyone on the same email domain can read messages addressed to that domain',
  'B',
  'Email was designed for reliability not privacy. SMTP transfers between servers are often unencrypted. Server administrators can read stored email. Legal orders can require providers to produce message contents. End-to-end encrypted email requires both sender and recipient to use compatible tools.'
);

// id 449 was B — reassign to A
uq(449,
  'What is an email alias and why is it useful for privacy?',
  'An email alias forwards messages to your real address without exposing your real address to the sender or service, allowing you to receive email without revealing your actual identity and making it easy to disable the alias if it receives spam or is involved in a breach',
  'An email alias is an alternative display name attached to your real email address that changes how your name appears to recipients',
  'An email alias is a temporary email address that automatically expires after 24 hours, useful for one-time signups to untrusted services',
  'A',
  'Aliases create a layer of indirection. The service gets the alias, not your real address. If the alias starts receiving spam or is part of a breach notification, you disable it without affecting your real address or any other service. Services like SimpleLogin and Apple Hide My Email automate this.'
);

// id 450 was B — reassign to C
uq(450,
  'What does ProtonMail provide that standard email does not?',
  'ProtonMail provides a guarantee that no advertising targeting will ever be applied to your account based on message content',
  'ProtonMail provides military-grade encryption for all emails including those sent to external addresses on any email provider',
  'ProtonMail provides end-to-end encryption between ProtonMail users so the company cannot read stored messages, and is headquartered in Switzerland under strong privacy laws with a zero-knowledge architecture for stored email',
  'C',
  'ProtonMail\'s zero-knowledge design means only you can decrypt your messages. The company cannot produce readable email content in response to legal orders because they do not hold the keys. End-to-end encryption applies between ProtonMail accounts. Emails to external providers are encrypted in transit but not end-to-end.'
);

// id 451 was B — rewrite keep B
uq(451,
  'Can apps determine your location even without GPS access?',
  'No, GPS is the only technology that provides location data. Denying GPS access fully prevents location determination.',
  'Yes, apps can use Wi-Fi positioning from nearby access point databases, cell tower triangulation, Bluetooth beacon triangulation, and IP address geolocation to determine location even when GPS is denied',
  'Only partially. Without GPS, apps can only determine your country and general region but not city-level or more precise location.',
  'B',
  'Multiple non-GPS positioning technologies work simultaneously. Wi-Fi positioning databases map access point MAC addresses to physical locations with street-level accuracy. Cell towers triangulate from signal strength. Bluetooth beacons provide indoor positioning. Denying only GPS access does not prevent location tracking.'
);

// id 452 was B — reassign to A
uq(452,
  'What is the privacy risk of always-on location access for apps?',
  'Always-on location access allows apps to continuously record your movement patterns, building a complete record of everywhere you go including your home, workplace, medical appointments, religious attendance, and social connections that can be sold or exposed in a breach',
  'Always-on location increases cellular data usage significantly as the device continuously uploads coordinates to the app\'s servers',
  'Always-on location allows apps to activate your camera when you enter certain locations without requiring additional permissions',
  'A',
  'Movement data is among the most intimate personal data that exists. Over weeks and months it reveals your home address, employer, doctors, places of worship, social relationships, and daily schedule. This information is regularly sold by data brokers and has been used for targeting, stalking, and discrimination.'
);

// id 453 was B — reassign to C
uq(453,
  'What is the most privacy-protective location permission setting for an app that needs your location occasionally?',
  'Deny location access entirely and enter your location manually when the app requests it',
  'Grant precise location while using the app since precision improves functionality and the access is limited to active use sessions',
  'Grant approximate location only while using the app, which provides sufficient accuracy for most legitimate features while denying the app precise coordinates and background access',
  'C',
  'Approximate location prevents the app from pinpointing your exact address or precise movement while still enabling location-dependent features like local search or weather. Combining approximate with while using the app prevents background tracking entirely.'
);

// id 454 was B — rewrite keep B
uq(454,
  'What does a credit freeze do?',
  'A credit freeze temporarily lowers your credit score to make you less attractive to lenders offering pre-approved credit',
  'A credit freeze prevents new credit accounts from being opened in your name by blocking lenders from accessing your credit report, which is required to approve credit applications',
  'A credit freeze notifies you by email or text whenever a lender attempts to access your credit report',
  'B',
  'A credit freeze is the strongest protection against new account identity theft. Lenders cannot approve credit without pulling your report. When your report is frozen, that pull fails and the application is denied. Freeze all three major bureaus and unfreeze temporarily when you legitimately apply for credit.'
);

// id 455 was B — reassign to A
uq(455,
  'How often should you check your credit report?',
  'At minimum annually from each of the three major bureaus through AnnualCreditReport.com, and more frequently if you have had a recent data breach notification or suspect identity theft',
  'Monthly monitoring is required to catch identity theft within the window where damage can be undone',
  'Credit report checks damage your credit score each time you pull one so limiting checks to once every three years is the recommended practice',
  'A',
  'Free annual reports from all three bureaus are legally guaranteed. Staggering requests every four months gives more frequent coverage. Your own inquiries are soft pulls that do not affect your score, only lender inquiries are hard pulls.'
);

// id 456 was B — reassign to C
uq(456,
  'What is the risk of accessing your bank account on public Wi-Fi without a VPN?',
  'The bank connection is protected by HTTPS so public Wi-Fi adds no risk beyond slightly slower speeds',
  'Public Wi-Fi networks block banking connections as a terms of service requirement to prevent fraud liability',
  'Traffic on public Wi-Fi can be monitored or intercepted, and evil twin attacks can position an attacker between you and your bank despite HTTPS, particularly if your device connects automatically or the attacker has a compromised certificate',
  'C',
  'HTTPS protects against passive monitoring but sophisticated attacks on public Wi-Fi can still intercept sessions. Evil twin attacks present rogue networks. Certificate mis-issuance attacks are rare but documented. The risk is low for most users but the consequence is high given what is at stake.'
);

// id 457 was B — rewrite keep B
uq(457,
  'What is a fraud alert and how does it differ from a credit freeze?',
  'A fraud alert prevents all credit activity for 12 months while a freeze is permanent until you lift it',
  'A fraud alert adds a notice to your credit file asking lenders to take extra verification steps before extending credit, while a freeze is more absolute and blocks lenders from accessing your report entirely until you lift it',
  'A fraud alert and a credit freeze are identical protections offered under different names by different bureaus',
  'B',
  'A fraud alert is advisory. Lenders are asked to verify identity more carefully but are not technically blocked from accessing your report. A freeze is enforceable and blocks report access entirely. Freezes are stronger protection but require you to temporarily lift them when you legitimately apply for credit.'
);

// id 458 was B — reassign to A
uq(458,
  'Why should you use unique false answers to security questions rather than your actual information?',
  'Real answers to common security questions like mother\'s maiden name, childhood street, and first pet are easily discoverable through social media and public records, making them effectively public knowledge that provides no security benefit',
  'Security question answers must be at least 8 characters to provide meaningful protection and real answers to common questions are often too short',
  'Using false answers prevents the company from using your personal information for targeted marketing',
  'A',
  'Security questions were designed before personal information was so widely accessible online. Today answers to common questions are findable in social media posts, genealogy databases, and data broker profiles. Treating them as passwords with randomly generated false answers stored in your password manager is the correct approach.'
);

// id 459 was B — reassign to C
uq(459,
  'What is the first step in conducting a privacy audit of your digital life?',
  'Delete all social media accounts immediately to reduce exposure as quickly as possible',
  'Change all passwords to long unique ones before auditing what accounts exist',
  'Create a complete inventory of all accounts, apps, services, and devices you use before taking any other action, since you cannot secure what you do not know exists',
  'C',
  'The inventory step is foundational. Forgotten accounts with old passwords and no MFA are a common source of compromise. Unknown apps with persistent permissions create ongoing exposure. The audit cannot be complete without first knowing everything that needs to be reviewed.'
);

// id 460 was B — rewrite keep B
uq(460,
  'Why should you delete accounts you no longer use?',
  'Inactive accounts are automatically shared with advertising partners after a period of inactivity per standard platform terms of service',
  'Unused accounts hold historical personal data, use passwords you changed elsewhere but not there, lack MFA, and can be compromised without your knowledge to impersonate you or expose your data in a breach',
  'Deleting unused accounts improves your credit score by removing associated financial accounts from your record',
  'B',
  'Dormant accounts are unmonitored risks. You never got around to enabling MFA. The password is from years ago before you started using a password manager. A breach of that service exposes historical data you forgot existed, and the account can be used to impersonate you before you even know it happened.'
);

// id 461 was B — reassign to A
uq(461,
  'What website lets you check if your email has appeared in a known data breach?',
  'HaveIBeenPwned.com, which maintains a database of billions of credentials from known breaches and tells you which breaches exposed your email address',
  'DataBreachRegistry.gov, which is the official federal database of all reported data breaches affecting US citizens',
  'CreditKarma.com, which monitors both your credit file and known data breaches that included your email address',
  'A',
  'HaveIBeenPwned was created by security researcher Troy Hunt and is the most widely used and trusted breach notification service. It is free for individual lookups. Finding your email there tells you which services were compromised and which passwords are in attacker databases.'
);

// ── Late duplicate/overflow ids 462-483 ──────────────────────────────────────
// These were already correct answers or B. Rewrite all content, keep correct answers as indicated.

// id 462 — already C
uq(462,
  'You receive a text claiming your package is delayed and provides a link to reschedule delivery. What is the safest response?',
  'Click the link since this is a standard notification format used by all major carriers',
  'Reply to the text with your tracking number to receive a legitimate callback from the carrier',
  'Go directly to the carrier\'s website by typing the URL yourself and look up your actual shipment status',
  'C',
  'Delivery scams are one of the most common smishing formats because nearly everyone has a package in transit at any given time. Navigating directly to the carrier site eliminates the risk of landing on a credential-harvesting page designed to look like the carrier.'
);

// id 463 — already A
uq(463,
  'What makes smishing more effective than email phishing for many people?',
  'People apply significantly less skepticism to text messages than emails and are more likely to act on them immediately due to the personal and urgent nature of SMS communication',
  'Carrier networks certify sender identities for SMS making messages appear more trustworthy',
  'Text messages bypass all content filtering since carriers do not inspect message content',
  'A',
  'Behavioral research confirms lower scrutiny of SMS compared to email. People read texts almost immediately and respond quickly. The brevity of texts also provides less context for evaluating legitimacy than a full email with headers and formatting.'
);

// id 464 was B — rewrite keep B
uq(464,
  'What is the most effective first step when diagnosing a slow computer?',
  'Run a full antivirus scan first since malware is the most common cause of sudden slowdowns',
  'Open Task Manager and check CPU, memory, and disk usage to identify which resource is constrained and which process is responsible before taking any other action',
  'Restart the computer since this clears temporary files and resolves most performance issues without further investigation',
  'B',
  'Data before action. Task Manager tells you exactly what is happening in seconds. Without looking at resource usage first you risk wasting time on steps that target the wrong cause. The reading takes less than a minute and immediately directs your troubleshooting.'
);

// id 465 — already C
uq(465,
  'What is the most useful piece of information to capture when a BSOD occurs?',
  'The time the BSOD occurred so you can search event logs for entries from that exact minute',
  'The color and brightness of the screen since this indicates whether the fault is hardware or software',
  'The stop code and any module names displayed, which identify the type of failure and the component responsible so you can search for the specific cause',
  'C',
  'Stop codes are the diagnostic key. Memory management, page fault in non-paged area, kernel security check failure each point to different root causes. Module names like ntfs.sys or nvlddmkm.sys identify the driver involved. This information transforms a cryptic crash into a searchable specific problem.'
);

// id 466 — already A
uq(466,
  'What is the first diagnostic question that most effectively narrows down a connectivity problem?',
  'Is the problem on this device only or on all devices, since this single question determines whether the issue is with the device, the local network, or the internet connection itself',
  'What websites are affected, since the answer determines whether a DNS problem or routing problem is more likely',
  'How long has the problem been occurring, since duration helps distinguish hardware failures from software configuration changes',
  'A',
  'This question divides the problem space immediately. Device-specific issues point to drivers, settings, or the network adapter. Network-wide issues point to the router or ISP. This single question determines whether to troubleshoot the device or the infrastructure.'
);

// id 467 — already C
uq(467,
  'Where is the only safe source for downloading driver updates?',
  'The top search result for your specific hardware model and Windows version',
  'A reputable third-party driver updater application that scans all installed hardware simultaneously',
  'The hardware manufacturer\'s official website navigated to directly, or Windows Update for drivers Microsoft has tested and approved',
  'C',
  'Third-party driver sites and update utilities frequently bundle adware, install generic drivers that cause instability, or distribute malware. The manufacturer\'s site and Windows Update are the only sources with verified driver authenticity.'
);

// id 468 was B — rewrite keep B
uq(468,
  'What does a Caution status in CrystalDiskInfo indicate about your hard drive?',
  'A Caution status means the drive is running at a higher temperature than optimal but is otherwise healthy',
  'A Caution status means the drive has reallocated sectors or other S.M.A.R.T. attributes that suggest developing hardware problems. Back up your data immediately and plan to replace the drive.',
  'A Caution status is a routine notification that the drive is due for a firmware update from the manufacturer',
  'B',
  'Reallocated sectors mean the drive detected bad sectors and moved data away from them to spare sectors. This is a reliable early warning of physical failure. A drive in Caution status will likely reach Bad status without warning. Treat it as a critical backup prompt.'
);

// id 469 — already A
uq(469,
  'What specifically does clearing the browser cache fix?',
  'Clearing the cache forces the browser to download fresh copies of website files, which fixes display problems caused by outdated cached content that no longer matches the current version of a page',
  'Clearing the cache removes all saved passwords and autofill data returning the browser to a clean state',
  'Clearing the cache fixes slow browsing by permanently reducing the amount of data the browser stores on disk',
  'A',
  'The cache stores static assets like images, scripts, and stylesheets for faster loading. When a website updates those files, cached copies can conflict with new server content causing broken layouts or missing features. Cache clearing forces a fresh download resolving these mismatches.'
);

// id 470 — already C
uq(470,
  'Why should you always choose Custom or Advanced install options when installing software?',
  'Custom install options provide access to professional features not available in the standard installation',
  'Custom install options allow you to choose a non-default installation directory which reduces the risk of file conflicts',
  'Custom install options let you see and deselect bundled software, browser toolbars, and default-on extras that the Express install silently adds without your review',
  'C',
  'Express installs are designed to get you through setup quickly by hiding the things you would deselect if you saw them. Browser toolbar installations, default search engine changes, and bundled utilities are all routinely installed this way.'
);

// id 471 was B — rewrite keep B
uq(471,
  'What is the Windows print spooler and why does clearing it fix many printer problems?',
  'The print spooler is the driver that translates document formats into printer-specific commands, and clearing it reinstalls these translations fixing format errors',
  'The print spooler is a service that queues print jobs and manages communication with the printer. Stuck or corrupted jobs in the queue can block all printing, and stopping the spooler and deleting spool files clears these blockages.',
  'The print spooler is a temporary file storage location that fills over time and must be periodically cleared to maintain printer communication speed',
  'B',
  'Print jobs that fail mid-transmission can lock the queue, preventing any subsequent jobs from printing. The spooler service holds open file handles on these stuck jobs. Stopping the service releases the locks, allowing manual deletion of the spool files and a fresh start.'
);

// id 472 — already C
uq(472,
  'What does the Windows Update component reset process do?',
  'It reinstalls Windows Update as a fresh application removing accumulated update history',
  'It resets the Windows Update policy to the factory defaults overriding any group policy settings',
  'It stops Windows Update services, clears the cached update download folder, re-registers update-related DLLs, and restarts the services to resolve common update errors caused by corrupted update components',
  'C',
  'Update component resets are the correct fix for persistent Windows Update errors. Corrupted downloads in the SoftwareDistribution folder and misregistered COM components cause many update failures. The reset clears these without affecting installed updates or the OS itself.'
);

// id 473 — already A
uq(473,
  'Why is periodically testing your backup by actually restoring files critically important?',
  'Silent backup failures, storage media degradation, and software misconfiguration can make backups unreadable when you actually need them, and only a restore test reveals these problems before an emergency',
  'Testing backups updates the backup index making subsequent backup operations faster',
  'Restore tests verify that your backup software license is active and will not expire during an emergency recovery',
  'A',
  'Untested backups have unknown reliability. Backup software can report success while writing corrupted data. Storage media can degrade silently. Configuration changes can exclude critical folders. Discovering a backup failure during an actual emergency when you have no data is catastrophic.'
);

// id 474 — already C
uq(474,
  'What is the most common cause of a computer that works for light tasks but shuts down under load?',
  'Insufficient RAM causing the system to crash when virtual memory demands exceed page file limits',
  'Power supply degradation preventing sufficient current delivery during peak demand',
  'Thermal shutdown triggered when the CPU or GPU reaches its maximum safe temperature under heavy workload, caused by dust buildup, fan failure, or degraded thermal paste',
  'C',
  'Thermal shutdown is a safety mechanism. Light tasks generate far less heat than gaming or video encoding. If the cooling system cannot dissipate heat fast enough under load, the CPU throttles first and then the system shuts down to prevent damage. Clean the vents and verify the fan is spinning before investigating other causes.'
);

// id 475 was B — rewrite keep B
uq(475,
  'What does a stateful firewall do that a basic packet filter cannot?',
  'A stateful firewall inspects encrypted packet contents while a packet filter can only read unencrypted headers',
  'A stateful firewall tracks the state of active connections and automatically allows return traffic for sessions you initiated, while a packet filter evaluates each packet independently without any awareness of the connection it belongs to',
  'A stateful firewall blocks all inbound traffic by default while a packet filter requires explicit deny rules for each blocked port',
  'B',
  'Connection state awareness is the key advantage. When you initiate a connection, the stateful firewall creates an entry permitting return traffic for that session. Without state, you would need explicit rules permitting inbound traffic for every service you use, which is difficult to manage correctly.'
);

// id 476 — already C
uq(476,
  'Why does Windows Defender Firewall configured to use different profiles for domain, private, and public networks improve security?',
  'Different profiles apply different encryption levels to traffic based on the trustworthiness of the connected network',
  'Different profiles block different categories of content with the public profile being the most restrictive for adult content',
  'Public network profiles apply stricter rules than private or domain profiles since public environments contain untrusted devices and potential attackers, while home and work networks have a higher baseline of trust',
  'C',
  'The public profile assumes the worst about the network you are on. Stricter default rules block more inbound connections that would be acceptable on a trusted home or corporate network. This context-aware configuration reduces attack surface automatically when you connect to public Wi-Fi.'
);

// id 477 — already C
uq(477,
  'What does a VPN specifically protect and what threats does it not address?',
  'A VPN protects against all network threats including malware, phishing, and identity theft while connected',
  'A VPN protects your device from unauthorized access attempts by filtering all inbound connection requests',
  'A VPN encrypts traffic between your device and the VPN server protecting it from ISP monitoring and local network interception, but does not protect against malware on your device, phishing websites, or tracking by sites you are logged into',
  'C',
  'VPNs solve the network surveillance problem. They do not solve the endpoint problem or the application layer problem. Malware already on your device operates above the VPN layer. Phishing sites are reached through the VPN tunnel. Login-based tracking persists regardless of IP masking.'
);

// id 478 — already A
uq(478,
  'Why are default router admin credentials a critical security vulnerability?',
  'Default credentials for every router model are publicly documented and searchable online, meaning anyone who can reach your router admin interface can log in immediately without any technical skill',
  'Default credentials are shared across all routers on a manufacturer\'s network allowing one compromised router to affect others',
  'Default credentials use weak encryption that can be cracked in seconds by modern hardware',
  'A',
  'Router manufacturers publish default credentials in their manuals and support documentation. Security databases compile these into easily searchable tables. An attacker who finds your router admin interface exposed needs only a database lookup to gain full control of your network.'
);

// id 479 was B — rewrite keep B
uq(479,
  'Why is an authenticator app more secure than SMS for multi-factor authentication?',
  'Authenticator apps generate longer codes that are more resistant to guessing attacks than the short codes sent via SMS',
  'SMS codes are vulnerable to SIM swapping where an attacker convinces your carrier to transfer your number to their device, while authenticator app codes are generated locally and never pass through the phone network',
  'Authenticator apps require biometric verification before displaying codes adding an additional factor that SMS does not have',
  'B',
  'SIM swapping requires social engineering your carrier, which is a documented attack with many victims. SS7 protocol weaknesses also allow interception at the network level in some scenarios. Authenticator apps generate codes using a shared secret and current time entirely on your device with no network transmission.'
);

// id 480 — already A
uq(480,
  'What is the most critical technical security requirement for a password manager to be trustworthy?',
  'Zero-knowledge architecture where the provider encrypts your vault with a key derived from your master password that the provider never possesses, meaning only you can decrypt your vault',
  'Two-factor authentication on the password manager account itself since this protects against unauthorized access',
  'Automatic password changing that rotates credentials on a schedule without requiring your involvement',
  'A',
  'Zero-knowledge is the non-negotiable requirement. A password manager that holds your encryption key or can decrypt your vault is a single point of compromise. A breach of such a provider exposes every credential you stored. Zero-knowledge means a breach yields only ciphertext the provider cannot decrypt.'
);

// id 481 — already C
uq(481,
  'What is the key difference between how a virus spreads and how a worm spreads?',
  'Viruses attack only executable files while worms attack only document files',
  'Viruses require administrator privileges to spread while worms can spread under any user account',
  'A virus requires a host file and spreads when that file is executed or shared, while a worm is self-replicating and spreads automatically across networks without requiring any user action',
  'C',
  'Self-replication without user action is what makes worms particularly dangerous. A virus depends on someone running the infected file. A worm exploits network vulnerabilities to propagate automatically, which is why worm outbreaks like WannaCry spread globally in hours rather than days.'
);

// id 482 was B — rewrite keep B
uq(482,
  'What is malvertising and why is an ad blocker effective against it?',
  'Malvertising is malicious software disguised as a legitimate ad-blocking browser extension designed to inject ads into pages that do not normally have them',
  'Malvertising is the delivery of malicious code through legitimate advertising networks, and an ad blocker prevents the malicious ad content from loading entirely so it never reaches your browser',
  'Malvertising is a phishing technique that uses fake online ads to redirect users to credential harvesting websites',
  'B',
  'Ad blockers work at the content level. They prevent ad network scripts from loading at all, which means malvertised ads never execute in your browser. This is a categorical defense rather than a signature-based one, making it effective against new malvertising campaigns immediately.'
);

// id 483 — already A
uq(483,
  'What is the correct first step in conducting a personal privacy audit?',
  'Create a comprehensive inventory of every account, app, service, device, and subscription you currently have before attempting to secure, delete, or modify anything',
  'Change all passwords to unique strong ones before auditing so that any accounts you find during the audit are already secured',
  'Delete all social media accounts immediately to eliminate the largest source of personal data exposure',
  'A',
  'You cannot protect what you do not know exists. Forgotten accounts, unused apps, and old subscriptions are often the weakest links. The inventory gives you the complete picture needed to make informed decisions about what to keep, secure, delete, or revoke.'
);

console.log('\nAll remaining questions updated successfully.');
console.log('Verifying final answer distribution...');
const dist = db.prepare('SELECT correct_choice, COUNT(*) as count FROM module_quiz_questions GROUP BY correct_choice ORDER BY correct_choice').all();
dist.forEach(r => console.log(`  ${r.correct_choice}: ${r.count} questions`));
