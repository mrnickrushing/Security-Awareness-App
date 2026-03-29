const { upsertFaq } = require("../schema");

function seedFaq(db) {
  const items = [
    {
      question: "What is phishing?",
      answer: "Phishing is a social engineering attack where attackers impersonate trusted entities through email, text, or phone to trick you into revealing credentials, clicking malicious links, or transferring money. The name comes from fishing, using bait to hook victims.",
      category: "Threats", order_index: 1,
    },
    {
      question: "What is multi-factor authentication and why do I need it?",
      answer: "Multi-factor authentication requires two or more verification methods to log in, typically your password plus a one-time code from an app or hardware key. Even if an attacker steals your password, they cannot log in without the second factor. Enable it on every account that supports it, starting with email.",
      category: "Authentication", order_index: 2,
    },
    {
      question: "How do I recognize a phishing email?",
      answer: "Look for urgency or threats demanding immediate action, sender addresses that do not match the organization they claim to be from, links whose hover preview does not match the displayed text, requests for credentials or payment through unusual channels, and unexpected attachments. When in doubt, contact the sender through a known phone number rather than replying.",
      category: "Threats", order_index: 3,
    },
    {
      question: "What should I do if I clicked a suspicious link?",
      answer: "Do not enter any credentials on the page that opened. Disconnect from the network if you are on a work device. Report the incident to IT immediately even if you did not enter anything, since simply loading a page can trigger drive-by downloads. Change passwords for any accounts you accessed recently and monitor for unusual activity.",
      category: "Incident Response", order_index: 4,
    },
    {
      question: "Is it safe to use public Wi-Fi?",
      answer: "Public Wi-Fi is untrusted. Anyone on the same network can potentially intercept traffic that is not properly encrypted. Use a VPN whenever you must use public Wi-Fi for sensitive work. Avoid accessing banking or other sensitive accounts on public networks. Disable auto-connect to open networks on your devices.",
      category: "Network Security", order_index: 5,
    },
    {
      question: "What makes a strong password?",
      answer: "Length is the most important factor. A passphrase of four or more random words is both strong and memorable. Avoid dictionary words, names, dates, and anything personally connected to you. Use a unique password for every account and store them in a password manager. Never reuse passwords across sites.",
      category: "Authentication", order_index: 6,
    },
    {
      question: "What is a password manager and is it safe?",
      answer: "A password manager is software that generates and securely stores unique passwords for every account. Reputable managers like Bitwarden use end-to-end encryption so even the provider cannot read your vault. The master password never leaves your device. Using one is significantly safer than reusing passwords or writing them down.",
      category: "Authentication", order_index: 7,
    },
    {
      question: "What should I do if I think my account has been compromised?",
      answer: "Change your password immediately. Enable or update multi-factor authentication. Review active sessions and sign out of all other sessions. Check for forwarding rules or unauthorized changes in email settings. Review connected third-party apps and revoke any you do not recognize. Report to IT if it is a work account.",
      category: "Incident Response", order_index: 8,
    },
    {
      question: "How do I know if a website is safe to use?",
      answer: "Verify the exact domain in your browser address bar matches the organization you expect. The padlock icon only confirms the connection is encrypted, not that the site is legitimate. Phishing sites can have padlocks too. Navigate to important sites using bookmarks you created yourself rather than clicking links in emails or search results.",
      category: "Web Security", order_index: 9,
    },
    {
      question: "What is ransomware and how do I protect against it?",
      answer: "Ransomware is malware that encrypts your files and demands payment for the decryption key. It typically arrives through phishing emails with malicious attachments or links. Protect against it by maintaining regular offline or cloud backups, keeping software updated, never enabling macros in unexpected documents, and using endpoint protection with behavioral detection.",
      category: "Threats", order_index: 10,
    },
    {
      question: "Should I pay the ransom if I am hit by ransomware?",
      answer: "The FBI and security professionals advise against paying. Payment does not guarantee you will receive a working decryption key, funds criminal operations directly, and marks you as a target willing to pay. The best defense is having current backups that allow you to restore without paying. Report ransomware attacks to the FBI at ic3.gov.",
      category: "Incident Response", order_index: 11,
    },
    {
      question: "What is social engineering?",
      answer: "Social engineering manipulates people rather than exploiting software. Attackers build trust, create urgency, or impersonate authority figures to trick victims into revealing information or taking actions that benefit the attacker. The best defense is slowing down when you feel pressure, and verifying requests through an independent channel you already trust.",
      category: "Threats", order_index: 12,
    },
    {
      question: "How do I report a phishing email at work?",
      answer: "Most organizations have a dedicated email address like phishing@yourcompany.com or a button in your email client for reporting. If unsure, forward the suspicious email to your IT or security team and ask. Reporting helps the security team track campaigns, block malicious domains, and alert other employees who may have received the same message.",
      category: "Incident Response", order_index: 13,
    },
    {
      question: "What is the difference between a virus and malware?",
      answer: "Malware is the broad category covering all malicious software including viruses, trojans, ransomware, spyware, adware, and worms. A virus is a specific type of malware that spreads by attaching copies of itself to legitimate files. People often use the terms interchangeably but malware is the correct umbrella term.",
      category: "Threats", order_index: 14,
    },
    {
      question: "Why do I keep getting spam even after unsubscribing?",
      answer: "Clicking unsubscribe in malicious spam confirms your address is active and monitored, which typically increases spam rather than reducing it. Only use unsubscribe links in email from companies you deliberately subscribed to. For unsolicited spam, mark it as spam and let your filter handle it. Consider using email aliases so you can cut off compromised addresses.",
      category: "Email Security", order_index: 15,
    },
    {
      question: "How do I protect myself on social media?",
      answer: "Use strong unique passwords and enable multi-factor authentication. Review privacy settings periodically since platforms change defaults. Limit what personal information is visible publicly, especially information that matches common security questions. Be cautious about trends asking for personal history details. Audit and remove connected third-party apps regularly.",
      category: "Privacy", order_index: 16,
    },
    {
      question: "What is a VPN and do I need one?",
      answer: "A VPN encrypts your internet traffic and routes it through a server in another location, hiding your activity from your ISP and local network observers. It is most valuable on public Wi-Fi, for hiding browsing from your ISP, and for accessing region-restricted content. It does not protect against malware, account-based tracking, or services where you are logged in.",
      category: "Privacy", order_index: 17,
    },
    {
      question: "How can I tell if an email is really from my bank?",
      answer: "Banks never ask for your full password, PIN, or one-time codes via email. Check the actual sending address by expanding the From field, not just the display name. Navigate to your bank by typing the address directly or using a bookmark rather than clicking any email link. When in doubt, call the number on the back of your card.",
      category: "Email Security", order_index: 18,
    },
    {
      question: "What should I do if I receive unexpected MFA codes I did not request?",
      answer: "Unexpected MFA codes mean someone has your password and is attempting to log in. Do not share the code with anyone. Change your password immediately to stop the login attempts. Report it to IT if it is a work account. Enable a stronger MFA method if available. The codes themselves expire quickly so there is no risk from the codes you received.",
      category: "Authentication", order_index: 19,
    },
    {
      question: "Is it safe to use the same password manager across all my devices?",
      answer: "Yes, reputable password managers are designed for cross-device use with end-to-end encryption. Your vault is encrypted on your device before syncing, so the provider never has your plaintext passwords. Crucially, enable multi-factor authentication on the password manager itself, and use a strong unique master passphrase that you do not use anywhere else.",
      category: "Authentication", order_index: 20,
    },
  ];

  for (const item of items) {
    upsertFaq(db, item.question, item.answer, item.category, item.order_index);
  }
}

module.exports = { seedFaq };
