const { db } = require('./src/db');

// Do NOT call initDb() - that would reseed and overwrite our updates

function update(title, content) {
  const result = db.prepare("UPDATE modules SET content=?, updated_at=datetime('now') WHERE title=?").run(content, title);
  console.log(result.changes > 0 ? 'Updated: ' + title : 'NOT FOUND: ' + title);
}

update('Module 1: Phishing Basics', `Phishing is one of the oldest and most effective cyberattacks in existence, and the reason it keeps working decade after decade is simple: it targets people, not software. No matter how many security tools an organization deploys, a single employee clicking the wrong link can undo all of it.

What Phishing Actually Is

Phishing is a form of social engineering where an attacker impersonates a trusted entity to trick you into doing something you would not do if you knew the truth. That something could be clicking a link, downloading a file, entering your credentials, or transferring money. The word comes from fishing because attackers cast wide nets hoping someone takes the bait.

The core ingredients of a phishing attack are always the same: a believable identity, a believable reason, and a call to action that benefits the attacker.

Types of Phishing You Will Encounter

Bulk phishing sends the same message to thousands of people at once. These are the emails claiming your Netflix account is suspended or that you have a package waiting.

Spear phishing is targeted. The attacker researches a specific person and crafts a message that references real details like your name, your company, your manager's name, or a project you are working on.

Whaling targets executives specifically. A whaling attack might target a CFO with a fake board communication or a CEO with an urgent legal notice.

Clone phishing takes a legitimate email you actually received, replaces the links with malicious ones, and resends it. Because the format looks familiar it bypasses your mental defenses.

How to Spot a Phishing Email

Urgency is the single most reliable indicator. Legitimate organizations rarely demand you act within hours. Phrases like your account will be suspended, verify immediately, or action required today are designed to short-circuit your critical thinking. Slow down whenever you feel pressured.

Check the sender address carefully. Display names can say anything. The actual email address tells the truth. Look for subtle misspellings like micros0ft.com or paypa1.com, extra subdomains, or domains that are close but wrong.

Hover over links before clicking. The URL shown in the email and the URL the link actually goes to can be completely different. On mobile, press and hold a link to preview the destination. If the domain does not match the supposed sender, do not click.

Watch for unexpected attachments. Legitimate services rarely email you unsolicited attachments. Malicious attachments are often Office documents that ask you to enable macros, password-protected ZIP files, or files with double extensions like invoice.pdf.exe.

What To Do When You Receive Something Suspicious

Do not click, do not reply, do not forward. If the email claims to be from a service you use, go directly to that service by typing the address in your browser rather than using any links in the email.

Report it. Your organization's security team needs to know about phishing attempts to protect everyone else. Use the phishing report button in your email client if available.

If you clicked something and are not sure what happened, report it immediately. Even clicking without entering credentials can trigger drive-by downloads that install malware silently. Early response dramatically reduces the damage from a successful phishing attack.

The Mindset That Protects You

Before you click anything in an unexpected email, ask yourself three questions. Were you expecting this? Does the sender address match who they claim to be? What happens if you go directly to the service instead of using this link? Those three questions will stop the majority of phishing attacks cold.`);

update('Module 2: Credential Theft', `Your credentials, meaning your username and password combinations, are the keys to your digital life. Email, banking, work systems, cloud storage, and dozens of other services are all protected by credentials. Attackers know this, and credential theft is one of the most profitable and widespread forms of cybercrime today.

How Credential Theft Happens

Phishing is the most common method. A fake login page that looks identical to a real service tricks you into entering your username and password. The credentials go directly to the attacker. You may be redirected to the real site afterward so you never realize what happened.

Data breaches are another major source. When a service you use gets breached, your credentials may be included in the stolen data. These credentials are then sold on underground markets.

Credential stuffing takes breached credentials and automatically tries them against hundreds of other services. If you reuse passwords, one breach cascades into many compromised accounts. This is exactly why password reuse is so dangerous.

Keyloggers record every keystroke you type, capturing usernames and passwords as you enter them. They arrive through malware infections, phishing attachments, or malicious downloads.

What Attackers Do With Stolen Credentials

Immediate access lets attackers read your email, use password reset functions to take over other accounts, impersonate you to your contacts, and extract sensitive information.

Account takeover fraud uses your credentials to make purchases, transfer funds, or commit fraud in your name.

Business email compromise uses stolen corporate email credentials to conduct financial fraud, request wire transfers, or redirect payroll.

Building Strong Credential Hygiene

Use a unique password for every account without exception. This is the foundation. When one service is breached, the damage stops there because the credentials do not work anywhere else.

Use a password manager. No human can memorize dozens of strong unique passwords. A password manager generates and stores them for you. You only need to remember one strong master password.

Make passwords long. Length matters more than complexity. A 20-character passphrase is stronger than an 8-character string of random characters and easier to remember.

Enable multi-factor authentication on every account that offers it, particularly email, banking, and work systems. MFA means a stolen password alone is not enough. The attacker still needs your second factor.

Recognizing Credential Phishing Pages

The giveaway is almost always the URL. Look for subtle domain misspellings, extra subdomains, or lookalike domains. The trusted domain is always the last part before the first slash.

Verify the connection is HTTPS. Modern browsers warn you about certificate mismatches.

You were sent there by an email rather than navigating there yourself. Always prefer to type the address directly or use a saved bookmark for sensitive services.

What To Do After a Credential Compromise

Change the compromised password immediately. Then check every other service where you used the same password and change those too.

Review recent account activity for signs of unauthorized access. Look for logins from unfamiliar locations, sent emails you did not send, or changes to account settings.

Enable MFA if you have not already. Notify your organization's security team if corporate credentials were involved. Speed matters because the attacker may be actively using the compromised account.`);

update('Module 3: Business Email Scams', `Business email compromise, commonly called BEC, is responsible for billions of dollars in losses every year and is consistently one of the top causes of financial cybercrime. Unlike many attacks that rely on malware, BEC is almost entirely social engineering. It exploits trust, authority, and urgency rather than technical vulnerabilities.

How Business Email Compromise Works

The attacker's goal is to convince someone inside your organization to take a financial or data-related action. This usually means sending money, providing credentials, or sharing sensitive data like W-2 forms.

The attack often starts with reconnaissance. Attackers research your organization on LinkedIn, company websites, and social media to understand the organizational structure, who handles finances, and what projects are underway.

Account compromise is common. If an attacker gains access to a legitimate internal email account, they can send messages that appear completely genuine because they are coming from a real account. They may monitor the mailbox for weeks before striking.

Domain spoofing creates a sender address that looks like your organization but uses a lookalike domain. Display name spoofing sets the visible name to a legitimate person while using a completely different email address.

Common BEC Scenarios

CEO fraud is the most well-known variant. An email appearing to come from the CEO urgently requests a wire transfer to a new vendor, a gift card purchase, or an immediate payment. The request often includes language asking the recipient to keep it confidential, bypassing normal approval channels.

Invoice fraud targets accounts payable teams. Attackers send realistic-looking invoices for services the company actually uses, but with updated banking details routing payment to the attacker.

Payroll diversion contacts HR with a request to update direct deposit details for an employee. The new account belongs to the attacker.

Red Flags to Watch For

Requests for urgent financial action that bypass normal approval processes are the most consistent warning sign. Real executives understand that financial controls exist for good reasons.

Requests for secrecy around a financial transaction are a major red flag. Legitimate business transactions do not require employees to hide them from colleagues.

Changes to banking or payment details in existing vendor relationships should always be verified through a known phone number, not one provided in the suspicious email.

How to Protect Yourself

Verify financial requests through a second channel. If you receive an email requesting a wire transfer, call the requestor back on a phone number you already have, not one provided in the email. This single step stops the majority of BEC attacks.

Follow your organization's financial approval processes even when asked to bypass them. A real executive who understands security will respect the process.

Implement dual authorization for wire transfers. Require two people to approve significant financial transactions.

Report suspicious emails to your security team even if you are not certain they are fraudulent.`);

update('Module 4: Smishing and Mobile Safety', `Smishing combines SMS with phishing, delivering attacks directly to your phone through text messages. As email security has improved and users have become more aware of email phishing, attackers have shifted significant effort to mobile messaging where defenses are weaker and users tend to be more impulsive.

Why Mobile Attacks Are Particularly Effective

Phone screens show less information. On desktop you can see the full URL before clicking. On mobile, URLs are often truncated and browsers show less of the address bar. This makes it harder to spot lookalike domains.

The context feels different. Email has trained people to be suspicious of unexpected messages, but text messages still carry a feeling of legitimacy and urgency. We expect texts to require quick responses.

Mobile users are often distracted. People check their phones while doing other things, reducing the careful attention that might catch a suspicious message.

Common Smishing Scenarios

Package delivery scams are the most widespread. A text message claims your package has a delivery issue and asks you to click a link to confirm your address or pay a small fee. These work because people are frequently expecting deliveries and react without thinking.

Bank fraud alerts create panic by claiming suspicious activity on your account. The link goes to a fake bank login page harvesting your credentials.

Government impersonation uses tax agencies or law enforcement to create fear. Messages claim you owe taxes or face arrest.

Verification code requests come from someone who claims to have texted you by mistake and asks you to forward a verification code you just received. What actually happened is the attacker triggered a password reset on one of your accounts and needs the code to complete it.

How to Identify Suspicious Text Messages

Ask yourself whether you were expecting this contact. A delivery notification for a package you did not order or a bank alert when your account is fine are warning signs.

Examine the URL carefully before clicking. Expand shortened URLs before visiting them. Check that the domain matches the legitimate organization.

Be suspicious of any message that creates urgency or asks for personal information, payment, or credentials.

Juice Jacking and USB Safety

Juice jacking attacks use modified public USB charging ports to install malware or steal data while your device charges. The USB standard carries both power and data on the same connector.

Use your own charger with an AC outlet rather than public USB charging ports. A USB data blocker device passes power but physically disconnects the data pins, allowing safe charging from public ports.

Disable Bluetooth and Wi-Fi when you are not using them. These can be used to track your location and in some cases to attack your device.

QR Code Risks on Mobile

QR codes are essentially URLs that your camera reads automatically. All the risks of clicking a link apply to scanning a QR code, with even less opportunity to inspect the destination beforehand.

Before acting on a QR code, check the URL your camera shows in the preview before tapping to open it. Malicious QR codes can redirect to phishing pages, trigger downloads, or connect to malicious networks. They can also be placed as stickers over legitimate QR codes in restaurants or public spaces.`);

update('Module 5: Vishing and Phone Based Scams', `Vishing uses voice calls to conduct social engineering attacks. The word combines voice with phishing. What makes modern vishing particularly dangerous is the combination of widely available personal information from data breaches and social media, caller ID spoofing technology, and increasingly convincing AI-generated voice cloning.

Why Voice Attacks Are Uniquely Effective

Voice communication triggers social instincts that text does not. The sound of a human voice, especially one that conveys authority or distress, activates responses that email cannot replicate. We are wired to respond to people speaking to us.

Caller ID is not trustworthy. Modern technology allows any number to be displayed as the caller ID regardless of where the call actually originates. Attackers routinely spoof numbers belonging to banks, government agencies, your company's IT department, or even numbers in your contacts list.

The real-time nature of voice calls creates pressure. Unlike email where you can take time to verify, a caller can keep you on the phone and guide you through actions before you have a chance to think critically.

Common Vishing Scenarios

Tech support fraud is extremely common. A caller claims to be from Microsoft, Apple, or your company's IT department. They claim to have detected a problem with your computer and offer to help. The help involves getting you to install remote access software, providing your credentials, or paying for fake support services.

Bank fraud calls claim suspicious activity has been detected on your account. The caller asks you to verify your identity by providing your account number or one-time passcodes. Legitimate banks never ask for your full PIN or one-time codes.

Government impersonation calls claim to be from the IRS or law enforcement. They threaten arrest or loss of benefits unless you take immediate action. These calls often demand payment via gift cards, which no legitimate government agency ever does.

The One-Time Code Attack

One of the most impactful vishing attacks involves one-time authentication codes. An attacker attempts to log into your account, triggering a real one-time passcode sent to your phone. The attacker then calls you, claims to be from security, and asks you to read back the code.

That code is your authentication code. The moment you provide it, the attacker has full access. No legitimate organization will ever call you and ask you to read a one-time code to them.

Protecting Yourself From Vishing

Never trust the caller ID. If someone claims to be from your bank, hang up and call the number on the back of your card or on the bank's official website.

Do not provide one-time codes, full passwords, PINs, or Social Security numbers to inbound callers regardless of how official they sound.

Verify requests through independent channels. Hang up and use a known good contact method to verify the request.

Understand that legitimate organizations accept delay. If a caller insists you must act immediately and cannot call back, that urgency is a manipulation technique. Hang up.

AI Voice Cloning

AI voice cloning can now produce convincing replicas of real voices from just a few seconds of audio. If you receive an unexpected call from someone requesting money or unusual actions, verify through another channel before acting. Call them back on a known number. A brief delay to verify is far less costly than the alternative.`);

update('Module 6: MFA Fatigue and Push Attacks', `Multi-factor authentication is one of the most effective security controls available, dramatically reducing the risk of account compromise even when passwords are stolen. But attackers have adapted. MFA fatigue attacks, also called push bombing, exploit a specific weakness in push notification-based MFA to bypass this protection.

How Push-Based MFA Works

When you enable push notification MFA, the login process works like this. You enter your username and password. The service sends a push notification to your registered mobile app. You approve the notification. You are logged in.

The weakness is in that approval step. It is a single tap on your phone. There is no verification that you actually initiated the login, and no requirement to match any specific code.

How MFA Fatigue Exploits This

The attacker has already obtained your username and password, typically through a data breach or phishing. They cannot complete the login without your MFA approval, but they simply keep trying.

The attack begins with the attacker attempting to log in with your credentials repeatedly. Each attempt triggers a push notification to your phone. Within minutes you might receive five, ten, or twenty approval requests.

Most people have never seen this before. They know they need to make it stop. Some people approve just to make the notifications stop. Others approve by accident while trying to dismiss them.

Attackers often pair this with a phone call pretending to be from IT support, explaining that there is a technical issue requiring you to approve the notification. This social engineering component dramatically increases success rates.

Recognizing an MFA Fatigue Attack in Progress

You receive MFA approval requests that you did not initiate. This is the clearest signal that someone else has your password and is attempting to use it.

The requests come rapidly and repeatedly. This is designed to create frustration and urgency.

You receive a call from someone claiming to be IT asking you to approve a notification. No legitimate IT person will ever ask you to approve an MFA request.

What To Do When You Receive Unexpected MFA Requests

Do not approve. Even a single approval gives the attacker full access to your account.

Deny the requests if your MFA app provides that option.

Change your password immediately. The attacker clearly has your current password. Changing it will stop the requests because their login attempts will fail at the password step.

Report it to your organization's security team immediately. This is an active attack in progress.

Better MFA Methods

Number matching requires you to enter a code displayed on the login screen into your authenticator app before approving. This prevents blind approvals because you have to actively confirm you see the same code, making blind approvals impossible.

FIDO2 hardware security keys and passkeys are phishing and fatigue resistant by design. The authentication is cryptographically bound to the specific website and requires physical presence.

If your organization offers more secure MFA options, use them. If you have a choice between push notifications and an authenticator code, choose the code.`);

update('Module 7: USB Baiting and Physical Security', `Not all cyberattacks arrive through your inbox or browser. Physical security vulnerabilities give attackers a path into systems that are otherwise well protected digitally. USB baiting, tailgating, impersonation, and dumpster diving are all physical attack techniques used in real attacks against organizations of all sizes.

USB Baiting in Depth

USB baiting exploits human curiosity and helpfulness. An attacker leaves USB drives in locations where target employees are likely to find them. Parking lots, lobbies, conference rooms, and break rooms are all common drop locations. The drives are often labeled with enticing text like salary information, confidential, or layoff list.

When an employee plugs in the drive to identify the owner or see what is on it, the malicious payload executes automatically. This can happen through autorun features, malicious files that exploit vulnerabilities when the drive appears in File Explorer, or specially crafted hardware.

Advanced USB attack devices like the USB Rubber Ducky look like ordinary flash drives but are actually keyboards that automatically type malicious commands faster than any human could.

What To Do With Found USB Devices

Never plug an unknown USB device into any computer, personal or work. There is no safe way to inspect it without heavily isolated equipment.

Turn found drives over to your IT or security team without connecting them. They have tools and procedures for safely examining potentially malicious media.

Report the find to security. Dropped USB drives are often targeted attacks and security teams need to know when they are being probed.

Tailgating and Physical Access

Tailgating means following an authorized person through a secured door without using your own credentials. It exploits social norms around holding doors for others.

The attacker who gains physical access can photograph screens, intercept physical mail, plant hardware keyloggers on computers, access unlocked workstations, steal devices, and gather intelligence for future attacks.

Everyone should badge in individually, even if it feels rude to let a door close on someone behind you. A legitimate visitor who needs access can ask at reception.

If you see someone in a secured area without a badge, it is appropriate to politely ask if they need assistance.

Impersonation in Person

Attackers sometimes pose as IT support, utility workers, fire safety inspectors, or delivery personnel to gain access to facilities. The uniform or clipboard creates the impression of authority.

Verify identity before granting access. Call the help desk to verify any maintenance requests before allowing access to equipment or systems.

Be particularly cautious about anyone asking you to log into a system so they can fix it, asking for your credentials, or requesting information about your systems and network.

Dumpster Diving and Document Disposal

Paper documents containing sensitive information create real security risks if not disposed of properly. Attackers search discarded documents for usernames, passwords, network diagrams, and customer data.

Shred documents containing any sensitive information before disposal. The same principle applies to digital media. Drives being retired should be wiped using appropriate tools or physically destroyed. Simply deleting files is not sufficient.`);

update('Module 8: Safe Browsing and QR Code Risks', `Your web browser is your primary interface with the internet and one of the most targeted attack surfaces in computing. Malicious websites, drive-by downloads, browser vulnerabilities, malicious extensions, and malvertising all use the browser as their entry point. Safe browsing practices significantly reduce your exposure to these threats.

Understanding Browser-Based Threats

Drive-by downloads occur when simply visiting a malicious website causes malware to be downloaded and installed without any explicit action from you. These attacks exploit unpatched vulnerabilities in browsers or plugins. Keeping your browser and plugins updated is the primary defense.

Malvertising uses the legitimate online advertising ecosystem to deliver malicious content. Attackers purchase advertising space on legitimate websites and serve ads that contain malicious code. Even reputable websites can inadvertently display malicious ads because they use third-party ad networks they do not fully control.

Browser hijacking changes your homepage, default search engine, or new tab page without permission. It arrives through malicious browser extensions or bundled software installations.

Fake security warnings are a particularly effective social engineering technique. A webpage displays a convincing alert claiming your computer is infected and instructs you to call a phone number or download software. This is always fraudulent. Legitimate antivirus software does not display alerts in your browser with phone numbers to call.

How to Browse More Safely

Keep your browser updated. Browser vendors release security updates frequently and you should install them promptly.

Use HTTPS for sensitive activities. The padlock icon and HTTPS in the address bar indicate that the connection between your browser and the website is encrypted. However, HTTPS only means the connection is encrypted. It does not mean the website is legitimate or not phishing.

Install an ad blocker. Beyond the convenience benefit, ad blockers reduce your exposure to malvertising by preventing many third-party ad networks from loading at all.

Be selective about browser extensions. Extensions have broad access to everything you do in your browser. Install only extensions from reputable developers and periodically review and remove extensions you no longer use.

Do not trust browser-based security warnings that ask you to call a number. Close the browser tab. If the browser appears frozen, force close it from Task Manager.

Understanding and Verifying URLs

The domain is the last portion before the first slash. In https://login.company.com/auth, the domain is company.com. Attackers create lookalike URLs like https://company.com.evildomain.com/auth where evildomain.com is the actual domain.

Bookmark important sites rather than searching for them each time. Search results can be manipulated to show malicious lookalike sites above legitimate ones, particularly for banking and financial services.

QR Code Security

QR codes encode URLs that your camera reads automatically. The security considerations for QR codes are identical to those for URLs, but with less opportunity to inspect the destination before acting on it.

Before tapping the preview URL that appears when your camera reads a QR code, check that the domain appears legitimate and matches the expected destination.

Be particularly cautious with QR codes in unsolicited emails or text messages, codes placed over existing codes on physical signs, and codes asking you to log in to an account. Malicious stickers can be placed over legitimate QR codes in restaurants, parking meters, and public spaces.`);

update('Module 9: Password and Authentication Hygiene', `Authentication is the gatekeeping mechanism for virtually every digital system you use. Weak authentication practices are the single most common factor in account compromises. Understanding what makes authentication strong and building consistent habits around it is one of the most impactful things you can do for your security.

What Makes a Password Strong

Length is the most important factor. A 20-character password is exponentially harder to crack than a 10-character password even if the shorter one uses more special characters. Each additional character multiplies the search space attackers must cover.

Randomness matters because humans are predictable. When left to create passwords ourselves, we use meaningful words, names, dates, and patterns that attackers specifically target. Common substitutions like replacing a with at symbol are so widely known that attackers include them in their first round of attempts.

Uniqueness means never using the same password on more than one service. Credential stuffing attacks take passwords exposed in one breach and try them everywhere. If you reuse passwords, one compromised service becomes many.

Password Managers Are Not Optional

The requirements for strong authentication, long random unique passwords for every account, are genuinely impossible to meet without a password manager. There is no human who can memorize hundreds of strong unique passwords.

Password managers generate strong random passwords and store them securely. You copy or autofill them when needed. You only need to remember your master password, which should be a long passphrase of four or more random words.

Choose a reputable password manager with end-to-end encryption, meaning even the password manager company cannot read your stored passwords. Bitwarden is open source and free. Enable MFA on your password manager itself.

Multi-Factor Authentication Explained

MFA requires something you know like a password, plus something you have like a code from your phone, or something you are like your fingerprint. A stolen password alone is not sufficient to access your account.

The strongest form of MFA is a hardware security key or passkey. These are cryptographically bound to the specific website and are immune to phishing because they verify the domain before authenticating.

Authenticator apps generate time-based codes that change every 30 seconds. These are significantly stronger than SMS-based codes because they cannot be intercepted through telecom networks.

SMS-based codes are the weakest form of MFA but still dramatically better than no MFA at all. SIM swapping attacks can intercept SMS codes by convincing your carrier to transfer your number to an attacker's SIM.

Enable the strongest form of MFA that each service supports. For most services, an authenticator app is available and should be your choice over SMS.

Common Authentication Mistakes

Using the same password across multiple services is the most common and most dangerous mistake.

Writing passwords down in easily discoverable places defeats the purpose of having a password.

Using personal information in passwords makes them susceptible to targeted attacks. Attackers include dates of birth, family member names, and pet names in their password attempts.

Ignoring MFA enrollment invitations delays protection unnecessarily. Most significant account compromises that MFA would have prevented happened to accounts where MFA was available but not enabled.`);

update('Module 10: Ransomware Awareness', `Ransomware has become one of the most financially devastating forms of cybercrime, affecting hospitals, schools, government agencies, businesses, and individuals. Understanding how ransomware works, how it gets in, and what your best defenses are is critical for anyone who uses a computer.

What Ransomware Actually Does

Ransomware is malware that encrypts your files, making them inaccessible, and then demands payment for the decryption key. Modern ransomware uses strong encryption that cannot be broken without the key. The files are still there but they are scrambled and unreadable.

Once encryption completes, a ransom note appears explaining what happened and providing instructions for paying, usually in cryptocurrency, to receive a decryption key. The note typically includes a deadline after which the price increases or the key is destroyed.

Double extortion has become common. Attackers not only encrypt files but exfiltrate a copy before encrypting. They then threaten to publish the stolen data publicly if the ransom is not paid.

How Ransomware Gets In

Phishing emails with malicious attachments are the primary delivery mechanism. The attachment is often an Office document that prompts you to enable macros, a PDF with an embedded executable, or a ZIP file containing a malicious file.

Macro-enabled documents are particularly dangerous. When you open such a document and click Enable Content or Enable Macros, you are allowing code inside the document to run. This code downloads and installs ransomware. No legitimate document requires macros just to display its content.

Remote Desktop Protocol vulnerabilities allow attackers to connect directly to improperly secured systems. Once connected, they install ransomware manually.

Software vulnerabilities in unpatched systems provide entry points for automated attacks.

The Anatomy of a Ransomware Attack

Initial access gets the malware onto a machine. Lateral movement spreads the attacker's presence across the network. In enterprise environments, ransomware operators often spend days mapping the network before deploying ransomware to maximize impact.

Backup destruction is a common step before encryption. Attackers delete shadow copies, disable backup software, and access backup systems to delete backups before deploying the ransomware. This is why offline and immutable backups are so critical.

Protecting Yourself From Ransomware

The 3-2-1 backup rule means three copies of data, on two different media types, with one copy stored offsite or in a separate cloud account. At least one backup copy should be offline or immutable, meaning it cannot be modified or deleted by ransomware even if ransomware has access to your network.

Test your backups. A backup that cannot be restored is worthless. Periodically verify that your backup data can actually be recovered.

Keep software updated. Many ransomware attacks exploit known vulnerabilities with available patches.

Never enable macros in Office documents you received via email or downloaded from unfamiliar sources.

Responding to a Ransomware Infection

Disconnect immediately. If you notice unusual file activity or ransom notes appearing, disconnect the affected machine from the network. This limits spread to other systems.

Report to your security team immediately. In an enterprise environment every minute counts for limiting the spread.

Do not pay the ransom without consulting law enforcement and security professionals. Payment does not guarantee you will receive working decryption keys and encourages further attacks.

Restore from clean backups once the infection vector has been identified and remediated to prevent reinfection.`);

update('Module 11: Insider Threats', `Most security thinking focuses on external attackers, but some of the most damaging breaches are caused by people inside the organization. Insider threats are particularly challenging because the insider already has legitimate access, knows where valuable data is stored, understands internal processes, and may know about security controls.

Types of Insider Threats

Malicious insiders intentionally misuse their access for personal gain, revenge, or to benefit a competitor. This might be an employee who steals customer data before leaving for a competitor or a disgruntled employee who sabotages systems after receiving a poor performance review.

Negligent insiders cause damage through carelessness rather than malicious intent. This includes employees who fall for phishing attacks, use weak passwords, misconfigure systems, or violate data handling policies without understanding the risks. Negligent insiders are statistically far more common than malicious ones.

Compromised insiders are employees whose credentials or devices have been taken over by external attackers. The insider is not acting maliciously themselves but their access is being used as if they were.

Third-party insiders include contractors, vendors, and partners who have been granted access and may misuse it or have their accounts compromised.

Why Insiders Are Particularly Dangerous

Legitimate access means their activity does not automatically trigger alerts the way external attacker activity does. They are authorized to be on the systems they are using.

Organizational knowledge means a malicious insider knows where the valuable data is, how approval processes work, and where the security gaps are.

Trust reduces scrutiny. Colleagues and security teams are less likely to question familiar people accessing systems they have always had access to.

Behavioral Indicators of Malicious Insider Activity

Unusual data access patterns are often the earliest indicator. An employee suddenly accessing large numbers of files outside their normal work responsibilities warrants investigation.

Large data transfers to external services, personal email, USB drives, or cloud storage outside normal business need are concerning, particularly shortly before an employee resigns.

Accessing systems outside normal working hours from unusual locations or devices can indicate unauthorized credential use.

Protecting Against Insider Threats

Least privilege access means users should have access only to what they need to do their jobs and nothing more. Broad access granted for convenience creates unnecessary risk.

Separation of duties ensures that no single person has complete control over a critical process. Financial approvals and sensitive data handling should require multiple parties.

Offboarding procedures must include immediate account deactivation when employees leave. Former employees with lingering access represent significant risk.

If you notice colleagues exhibiting concerning behaviors, contact your security team or use the anonymous reporting mechanism. You are not making an accusation, you are providing information that trained professionals can assess appropriately.`);

update('Module 12: Social Engineering and Pretexting', `Social engineering is the art of manipulating people into taking actions or revealing information they would not normally share. It is the foundation of phishing, vishing, business email compromise, and physical security attacks. Understanding the psychological principles attackers exploit makes you significantly harder to manipulate.

The Psychology Behind Social Engineering

Attackers study human psychology to identify the most reliable manipulation levers.

Authority is one of the most powerful. People comply with requests from figures they perceive as having authority, often without critically evaluating the request. An attacker who establishes themselves as a senior executive, a government official, or an IT administrator can get people to take actions they would refuse if asked by a peer.

Urgency prevents critical thinking. When people feel they must act immediately, they skip the verification steps they would normally take. Creating artificial time pressure is a core technique in virtually every social engineering attack.

Social proof uses the implication that others have already done the requested thing, making it seem more normal. This might sound like everyone in the department has already updated their credentials.

Liking and rapport building involves establishing a friendly connection before making a request. People are more likely to comply with requests from people they like, even superficially.

Reciprocity makes us feel obligated to comply with requests from people who have done something for us. An attacker who provides genuine help before making a request activates this instinct.

What Pretexting Means

Pretexting is the creation of a fabricated scenario to establish the context and credibility needed to execute a social engineering attack. The pretext is the false backstory that makes the request seem reasonable.

A pretext might involve an attacker pretending to be a new IT vendor performing an audit, a member of the finance team following up on an urgent request, or a researcher from a consulting firm.

Effective pretexts are built on research. Attackers gather information from LinkedIn, company websites, press releases, and data breaches before contact to make their stories believable with accurate organizational details.

Common Social Engineering Attack Scenarios

The IT helpdesk impersonation involves an attacker claiming to be from IT support and needing your credentials to fix an issue. Real IT helpdesks do not need your password to access your account.

The new employee scam uses a new hire pretext to request assistance that violates security policy. People are naturally helpful to new colleagues and may override their normal security instincts.

How to Defend Against Social Engineering

Verify independently. If anyone regardless of their claimed identity asks you to do something sensitive, verify their identity through a channel you already know and trust, not one they provide.

Slow down when you feel urgency. The urgency is almost always artificial and designed to prevent you from thinking critically. Real emergencies can wait the 30 seconds it takes to make a verification call.

Trust your instincts. If something feels wrong, investigate rather than complying. Social engineers rely on people overriding their instincts to seem cooperative.

Know what your colleagues should and should not ask for. IT will never ask for your password. Finance will not ask you to send sensitive data via personal email.`);

update('Module 13: Safe Remote Work and VPN', `Remote work has expanded dramatically and with it the attack surface that organizations must defend. When employees work from home or in public spaces, they connect to corporate systems from networks that are not under IT's control and work in physical environments where sensitive information can be seen or overheard.

The Remote Work Threat Landscape

Home networks are generally less secure than corporate networks. Many home routers run default credentials, have unpatched firmware, and lack enterprise security features. Other devices on the same home network including IoT devices, smart televisions, and gaming systems may be compromised and able to intercept traffic.

Public networks at coffee shops, hotels, airports, and libraries are fundamentally untrusted. You do not know who else is on the network or whether someone is actively monitoring traffic. Evil twin attacks create fake Wi-Fi networks using the same name as a legitimate network to intercept all your traffic.

Physical exposure at home or in public means conversations, screen contents, and printed materials may be visible or audible to people who should not have access.

Understanding VPNs

A VPN creates an encrypted tunnel between your device and a VPN server. All your network traffic is routed through this tunnel, protecting it from interception on the local network.

When you connect to your corporate VPN, your traffic appears to come from the VPN server rather than your home or public network. The encryption means that even if someone on the same network intercepts your traffic, they see only encrypted data they cannot read.

Always use your corporate VPN when accessing work systems from outside the office. This is not optional security advice. It is a fundamental requirement for maintaining the security boundary.

Securing Your Home Office

Update your home router firmware. Log into your router's admin interface and look for a firmware update option.

Change default router credentials. The default admin username and password for most routers are documented online and widely known. Change them to something strong and unique.

Use WPA3 or WPA2 encryption for your Wi-Fi network. Use a strong unique password for your Wi-Fi.

Position your screen so it is not visible from windows or to visitors. This prevents shoulder surfing in your home environment.

Shred work documents before disposal.

Public Wi-Fi Safety

Never use public Wi-Fi for work activities without a VPN. The risk is too high regardless of how apparently legitimate the network appears.

Verify the exact network name with staff before connecting. Attackers set up evil twin networks with names nearly identical to the legitimate network.

Use your mobile hotspot as an alternative when VPN access is not possible. Your cellular data connection is more trustworthy than public Wi-Fi.

Secure Video Conferencing

Review what is visible behind you before joining calls or use a virtual background.

Be aware of who can hear your calls. Sensitive conversations should not happen in public places where they can be overheard.

Verify meeting links before clicking. Fake meeting invitations that capture credentials have become a social engineering technique targeting remote workers.`);

update('Module 14: Data Classification and Handling', `Not all data is equally sensitive, and treating everything the same way creates inefficiency without providing appropriate protection. Data classification systems help organizations understand what data they have, how sensitive it is, what protections it requires, and how it should be handled throughout its lifecycle.

Why Data Classification Matters

Data breaches are most damaging when highly sensitive data is exposed. Knowing which data is most sensitive helps organizations prioritize their protective efforts.

Regulatory compliance requirements like HIPAA for healthcare data, PCI DSS for payment card data, and GDPR for personal data mandate specific handling practices for certain types of data. Classification helps identify which data falls under which regulations.

Common Classification Levels

Public data is information that can be shared freely with anyone without risk. Marketing materials and published press releases are examples.

Internal data is intended for use within the organization but not particularly sensitive. General operational information and non-sensitive project documentation fall here.

Confidential data is sensitive business information that could cause significant harm if exposed. Customer data, financial information, employee personal data, and strategic plans typically fall into this category.

Restricted data is the most sensitive category, covering information that could cause severe harm if exposed. Trade secrets, health information, and credentials fall here. The most stringent handling procedures apply.

Handling Data at Each Classification Level

Transmission handling varies by classification. Public data can be transmitted freely. Confidential and restricted data should only be transmitted through encrypted channels and should not be sent to personal email addresses or unencrypted file sharing services.

Storage requirements include encryption for confidential and restricted data, access controls that limit who can read or modify the data, and secure deletion when the data is no longer needed.

Access control means ensuring only people who need data for legitimate job functions can access it. Over-broad access is a common finding in data security incidents.

Disposal of data must be handled appropriately. Paper documents containing confidential or restricted data must be shredded. Digital media must be properly wiped, not simply deleted.

Practical Data Handling Rules

Never send confidential or restricted data via personal email. Personal email accounts are outside your organization's security controls.

Do not store work data on personal cloud services. These services are not configured to your organization's security standards.

Lock your screen when stepping away from your computer, even briefly.

Be careful about what you print. Printed documents containing sensitive data create a physical security challenge that digital access controls cannot address.

Shadow IT, meaning using consumer apps and cloud services for work data without IT approval, places sensitive data outside organizational security controls and compliance requirements. Always use IT-approved tools for handling sensitive work data.`);

update('Module 15: AI-Powered Attacks and Deepfakes', `Artificial intelligence is transforming the threat landscape in ways that make traditional security indicators less reliable. Attacks that were once detectable by imperfect language, unfamiliar voice, or inconsistent visual content are becoming indistinguishable from legitimate communications.

How AI Is Being Used in Attacks

AI-generated phishing emails represent a significant quality improvement over traditional phishing. Earlier phishing emails were often identifiable by poor grammar and awkward phrasing. AI language models now generate phishing content that is grammatically perfect and contextually appropriate.

AI enables personalization at scale. Previously, well-researched spear phishing campaigns were labor-intensive. AI tools can now gather and synthesize information about thousands of targets and generate personalized messages for each one, making spear phishing economically viable at mass scale.

Voice cloning can replicate a person's voice from as little as a few seconds of audio, which is publicly available for most executives who have appeared in any podcast or video. Cloned voices have been used to authorize fraudulent wire transfers.

Deepfake video creates convincing video of real people appearing to say things they never said. Several organizations have lost significant sums after being sent deepfake video of executives authorizing wire transfers.

Detecting AI-Generated Content

Deepfake video still shows artifacts under scrutiny. Look for unnatural blinking patterns, inconsistent lighting between the face and background, slight blurring around hair and face edges, and lip sync that is slightly off.

Audio deepfakes may have subtle artifacts including slight metallic quality or unusual breath patterns.

Contextual verification remains the most reliable method. If the content or request is unusual, verify through an independent channel regardless of how convincing the voice or video appears.

Adapting Your Defenses

Establish verification protocols for high-risk requests that do not rely on voice or video alone. A verbal code word that only the real person would know provides a verification layer that AI cannot replicate without knowing the code in advance.

Be skeptical of urgency in communications involving financial transactions regardless of how convincingly the request is delivered. The combination of urgency and unusually credentialed requests should raise suspicion.

Multi-channel verification means confirming requests through a communication channel different from the one where the request arrived. A video call followed by a text to a known number provides much stronger confidence than any single channel.

Stay informed about developments in AI-generated content. The threat landscape in this area is evolving rapidly. Understanding that AI-powered attacks exist and knowing the verification steps to take makes you a much harder target.`);

console.log('\nDone. Verifying content lengths...');
const results = db.prepare('SELECT title, length(content) as len FROM modules WHERE section_id = 1 ORDER BY order_index').all();
results.forEach(r => console.log(r.len, r.title));
