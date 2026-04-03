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

// ── Cloud Security Module 1 (ids 501-503) — A, C, B ──────────────────────────
uq(501,
  'What does the shared responsibility model mean in cloud security?',
  'The cloud provider is responsible for securing the infrastructure while you are responsible for securing your data, accounts, and configurations within the cloud',
  'The cloud provider is responsible for all security including your data and applications because they own the infrastructure',
  'Security responsibility is shared equally with both parties responsible for 50 percent of all security controls',
  'A',
  'The shared responsibility model defines a boundary between what the provider secures and what the customer secures. Providers secure physical data centers and core infrastructure. Customers secure everything they put in the cloud including data, access controls, and application configurations.'
);
uq(502,
  'Which of the following is always the customer\'s responsibility regardless of which cloud service model is used?',
  'Patching the hypervisor and underlying virtualization layer',
  'Securing the physical data center against unauthorized entry',
  'Protecting your own data and managing who has access to it',
  'C',
  'Data protection and identity management are always the customer\'s responsibility across all cloud service models. The provider secures the infrastructure but cannot control what data you store or who you grant access to.'
);
uq(503,
  'What is the primary security risk of misunderstanding the shared responsibility model?',
  'It causes cloud providers to charge higher rates for customers who report security incidents',
  'It leads customers to assume the provider is securing things the customer is actually responsible for, leaving critical gaps unaddressed',
  'It results in duplicate security controls that slow down cloud performance',
  'B',
  'The most common cloud breach cause is a customer incorrectly assuming the provider secured something the customer was responsible for. Misconfigured storage buckets and overly permissive IAM policies are classic examples of customer-side gaps.'
);

// ── Cloud Security Module 2 (ids 504-506) — A, C, B ──────────────────────────
uq(504,
  'What is the principle of least privilege and why is it critical in cloud IAM?',
  'Each user and service should have only the minimum permissions required for their specific function, limiting the damage that can result from a compromised account',
  'Privileged users should be granted access automatically based on their seniority level to minimize friction in enterprise environments',
  'Access permissions should be reviewed annually and adjusted based on actual usage logs from the previous year',
  'A',
  'Least privilege limits blast radius. A compromised account with minimal permissions can only reach what that account was allowed to access. An overpermissioned account gives an attacker broad access to your entire environment.'
);
uq(505,
  'Why should cloud service accounts and API keys never be hardcoded in application source code?',
  'Hardcoded credentials slow down application compilation and increase build times significantly',
  'Modern cloud platforms automatically rotate credentials so hardcoded values become invalid quickly',
  'Source code is frequently shared, committed to version control repositories, or accidentally exposed, making hardcoded credentials accessible to anyone who can read the code',
  'C',
  'Credentials committed to source code are frequently exposed through public repositories, leaked backups, or insider access. Use dedicated secrets management services that store credentials encrypted and provide audit logs of every access.'
);
uq(506,
  'What is multi-factor authentication and why is it especially important for cloud administrator accounts?',
  'MFA requires a minimum password length of 16 characters and is important because cloud administrators manage large amounts of data',
  'MFA requires a second form of verification beyond a password and is critical for admin accounts because a compromised admin account can result in deletion of all data, creation of unauthorized resources, and full environment compromise',
  'MFA is a compliance requirement that applies only to regulated industries and is important because auditors specifically check admin account configurations',
  'B',
  'Cloud admin accounts have the power to destroy or exfiltrate everything in an environment. MFA means a stolen password alone is not enough to access these accounts. The potential damage from an unprotected admin account justifies the strongest available MFA method.'
);

// ── Cloud Security Module 3 (ids 507-509) — C, A, B ──────────────────────────
uq(507,
  'How should you determine who can access a cloud storage bucket containing sensitive data?',
  'Allow access to all users in your organization by default and remove specific users who should not have access',
  'Follow the cloud provider\'s default settings which are optimized for security in enterprise environments',
  'Explicitly define access using the principle of least privilege, granting access only to the specific users and services that need it for their function',
  'C',
  'Explicit least-privilege access control is always the correct approach for sensitive data storage. Never rely on defaults and never start with broad access and remove exceptions. Define exactly who needs access and grant only that.'
);
uq(508,
  'What is server-side encryption in cloud storage and what threat does it address?',
  'Server-side encryption automatically encrypts data before it is written to disk so that the physical storage media cannot be read without the encryption key even if someone obtains it directly',
  'Server-side encryption protects data in transit between your device and the cloud storage service by encrypting the network connection',
  'Server-side encryption prevents unauthorized users from accessing your storage bucket by encrypting the access control list',
  'A',
  'Server-side encryption protects data at rest. Even if someone physically removed the storage drives from a data center, they would only have encrypted data that cannot be read without the key. It complements access controls by providing protection against physical storage theft.'
);
uq(509,
  'Why is versioning an important security feature for cloud storage?',
  'Versioning reduces storage costs by automatically compressing older versions of files that are no longer actively accessed',
  'Versioning maintains a history of all changes to stored objects so that previous versions can be recovered if data is accidentally deleted, corrupted, or encrypted by ransomware',
  'Versioning automatically detects unauthorized modifications to files and alerts administrators when unexpected changes occur',
  'B',
  'Versioning provides recovery capability. Ransomware that encrypts cloud storage, accidental deletions, and malicious modifications can all be recovered from when versioning is enabled. Without versioning, the most recent state of data is the only state available.'
);

// ── Cloud Security Module 4 (ids 510-512) — A, C, B ──────────────────────────
uq(510,
  'What is a Virtual Private Cloud and what security benefit does it provide?',
  'A VPC is a logically isolated section of the cloud where you launch resources, providing network isolation that prevents your resources from being directly accessible to other customers or the public internet by default',
  'A VPC is a dedicated physical server reserved exclusively for one customer, providing hardware-level isolation from other cloud tenants',
  'A VPC is a virtual firewall service that inspects and filters all traffic entering and leaving your cloud environment',
  'A',
  'VPCs provide logical network isolation. Resources in a VPC are not directly accessible from the internet or from other customers\' environments by default. You control network access through subnets, security groups, and routing rules.'
);
uq(511,
  'What is the correct approach to configuring security groups for cloud resources?',
  'Allow all inbound traffic by default and create deny rules for known malicious IP addresses to block specific threats',
  'Use a single security group for all resources in an environment to simplify management and ensure consistent rules',
  'Follow the principle of least privilege by allowing only the specific ports and source addresses required for each resource\'s function and denying everything else',
  'C',
  'Security groups should implement least privilege at the network level. Each resource should only accept traffic on the ports it actually uses from the sources that legitimately need to reach it. The most dangerous configuration allows all traffic from all sources on all ports.'
);
uq(512,
  'Why should production and development cloud environments be in separate accounts or projects?',
  'Keeping them separate reduces cloud costs because providers charge less for development workloads that are in dedicated development accounts',
  'Separating environments prevents misconfigurations or security incidents in development from affecting production systems and limits the blast radius of any compromise',
  'Regulatory requirements mandate separate cloud accounts for production and non-production workloads in all industries',
  'B',
  'Environment separation is a fundamental blast radius control. A developer accidentally exposing credentials in a development environment should not result in a production breach. Separate accounts with separate permissions ensure that development activity cannot affect production.'
);

// ── Cloud Security Module 5 (ids 513-515) — A, C, B ──────────────────────────
uq(513,
  'What type of cloud activity should immediately trigger a security alert?',
  'A new IAM administrator account being created, security group rules being changed to allow public access, or large volumes of data being exported outside normal business operations',
  'Users logging in during business hours from their registered office locations using verified credentials',
  'Automated backup jobs running on their scheduled intervals and completing within expected time windows',
  'A',
  'High-privilege account creation, security configuration changes, and unusual data movement are all high-fidelity indicators of potential compromise or insider threat. These should trigger immediate review regardless of the time of day or who appears to be responsible.'
);
uq(514,
  'What information do cloud access logs typically capture that makes them valuable for security investigations?',
  'Cloud logs capture only failed authentication attempts because successful logins are considered normal activity and not worth recording',
  'Cloud logs capture the content of all data accessed so investigators can see exactly what information was viewed or downloaded during an incident',
  'Cloud logs capture who made each API call, from which IP address, at what time, what action was requested, and whether it succeeded, creating a complete audit trail of activity',
  'C',
  'The who, what, when, and from where captured in cloud logs allows investigators to reconstruct the timeline of an attack, identify which resources were accessed, and determine the scope of a breach. Without logs, investigation relies on incomplete information and guesswork.'
);
uq(515,
  'Why should cloud logs be stored in a separate account or write-once storage?',
  'Storing logs separately improves query performance because log analysis tools work faster on isolated datasets',
  'Storing logs in the same account an attacker has compromised allows them to delete or modify logs to cover their tracks, destroying the forensic evidence needed to investigate the incident',
  'Regulatory frameworks require log storage in geographically separate locations to ensure availability during regional outages',
  'B',
  'Log integrity is critical for forensic investigation. An attacker who compromises your cloud account and can also delete your logs can erase the evidence of their activity. Immutable or separate-account log storage ensures that investigation remains possible even after a full account compromise.'
);

// ── Cloud Security Module 6 (ids 516-518) — A, C, B ──────────────────────────
uq(516,
  'What is data residency and why does it matter for organizations using cloud services?',
  'Data residency refers to the physical location where data is stored, which matters because some regulations require specific categories of data to remain within certain geographic boundaries',
  'Data residency refers to how long data can be stored in the cloud before it must be deleted, which matters because storage costs increase significantly for data held beyond standard retention periods',
  'Data residency refers to the number of copies of data maintained by the cloud provider, which matters because redundancy requirements affect recovery time objectives',
  'A',
  'Regulations like GDPR impose geographic restrictions on where certain personal data can be stored and processed. Organizations must understand which regulations apply to their data and configure their cloud environments to store regulated data only in compliant regions.'
);
uq(517,
  'How should an organization approach a cloud provider\'s compliance certifications when evaluating their own compliance posture?',
  'A cloud provider\'s compliance certifications fully cover the organization because the provider\'s infrastructure is the foundation of everything the organization runs',
  'Provider certifications are not relevant to the organization\'s compliance because each layer must be independently certified regardless of the infrastructure beneath it',
  'Provider certifications cover the infrastructure layer only, and the organization must separately implement and document controls for everything they build on top of that infrastructure to achieve their own compliance',
  'C',
  'The shared responsibility model applies directly to compliance. A certified infrastructure is a necessary foundation but not sufficient. The organization must implement appropriate controls for their applications, data handling, access management, and audit logging to be compliant themselves.'
);
uq(518,
  'What is a cloud provider\'s Business Associate Agreement and when is it required?',
  'A BAA is a performance guarantee that commits the provider to specific uptime and response time levels and is required for all enterprise cloud customers regardless of the type of data they process',
  'A BAA is a legal agreement required when an organization processes protected health information using a cloud provider, establishing that the provider will appropriately safeguard that information as required by HIPAA',
  'A BAA is a data processing addendum required by GDPR for all cloud providers operating in Europe and applies to any organization that has European customers',
  'B',
  'HIPAA requires covered entities to have a BAA with any business associate that handles protected health information on their behalf. Without a BAA, using a cloud provider to process PHI is a HIPAA violation regardless of the technical security controls in place.'
);

// ── Cloud Security Module 7 (ids 519-521) — A, C, B ──────────────────────────
uq(519,
  'What is a container and what security consideration does containerization introduce?',
  'A container is a lightweight isolated runtime environment for applications that shares the host operating system kernel, which means a kernel vulnerability can potentially affect all containers on the same host',
  'A container is a virtual machine variant that provides complete hardware emulation and introduces security considerations around hypervisor vulnerabilities',
  'A container is a cloud storage format that packages application data and introduces security considerations around encryption of stored data',
  'A',
  'Containers share the host kernel, which distinguishes them from virtual machines that have their own. This shared kernel means a container escape vulnerability could allow a compromised container to affect the host and other containers. Container images must be kept updated and minimal.'
);
uq(520,
  'Why should secrets like database passwords never be stored in environment variables that are logged?',
  'Environment variables are automatically encrypted by container runtimes so storing secrets there is actually more secure than using dedicated secrets management services',
  'Environment variables are not accessible to application code so using them to store secrets prevents the application from actually using those credentials',
  'Logged environment variables expose secrets in log files that may be stored, transmitted, and accessed by many systems and people, turning a log access incident into a credential compromise',
  'C',
  'Logging environment variables is a common misconfiguration. Application frameworks, debugging tools, and crash reporters frequently log environment variables. A secret in an environment variable that gets logged is effectively stored in plaintext in every system that receives those logs.'
);
uq(521,
  'What is a Web Application Firewall and what threat does it primarily address?',
  'A WAF is a network firewall designed for cloud environments that controls access between virtual machines within the same VPC',
  'A WAF inspects HTTP traffic to and from web applications and blocks common application-layer attacks like SQL injection, cross-site scripting, and malicious bots before they reach your application',
  'A WAF is a distributed denial of service mitigation service that absorbs large volumes of traffic during attacks to keep applications available',
  'B',
  'WAFs operate at the application layer analyzing the content of HTTP requests. They block attacks targeting application vulnerabilities that network firewalls cannot see because those firewalls only examine network-layer information like IP addresses and ports.'
);

// ── Cloud Security Module 8 (ids 522-524) — A, C, B ──────────────────────────
uq(522,
  'What is the first action you should take when you detect that cloud credentials have been compromised?',
  'Revoke the compromised credentials immediately, even before fully confirming the compromise, because the cost of revoking valid credentials is far lower than allowing continued attacker access during investigation',
  'Document the incident thoroughly before taking any action to ensure you have a complete record of the compromise before remediation changes the state of the environment',
  'Notify the cloud provider and wait for their incident response team to take containment action as they have more visibility into their infrastructure',
  'A',
  'Speed of credential revocation is the most important factor in limiting damage from a cloud credential compromise. Delay allows the attacker to escalate privileges, create additional access methods, and exfiltrate data. Revoke first, investigate simultaneously.'
);
uq(523,
  'Why is forensic investigation more challenging in cloud environments compared to traditional on-premises incidents?',
  'Cloud providers encrypt all data at rest which prevents forensic investigators from accessing the contents of storage even with valid credentials',
  'Cloud regulations prohibit the preservation of forensic evidence because storing captured memory and disk images violates data privacy laws in most jurisdictions',
  'Cloud resources can be terminated and replaced in seconds eliminating forensic artifacts, logs may be in separate services requiring specific access, and the ephemeral nature of cloud infrastructure means evidence can disappear quickly without proper preservation',
  'C',
  'Cloud investigation requires preserving evidence before taking remediation actions. Terminating a compromised instance deletes its memory and any local artifacts. Log services must be specifically enabled and accessible. The speed and automation of cloud infrastructure works against investigation without deliberate evidence preservation.'
);
uq(524,
  'What should an organization do with a compromised cloud instance before terminating it?',
  'Terminate it immediately to stop any ongoing malicious activity as quickly as possible and prevent further data exfiltration',
  'Leave it running and fully connected to the network while investigation proceeds to capture as much attacker activity as possible',
  'Take a snapshot of the disk, capture relevant logs, and isolate it from the network before termination to preserve forensic evidence while preventing further damage',
  'C',
  'Forensic preservation before termination captures the state of the system at the time of compromise. Disk snapshots and logs provide the evidence needed to understand what happened, how the attacker gained access, and what was affected. Terminating without preservation eliminates this evidence permanently.'
);

// ── Cloud Security Module 9 (ids 525-527) — A, C, B ──────────────────────────
uq(525,
  'What does the zero trust principle of never trust, always verify mean in practice?',
  'Every access request must be authenticated and authorized based on verified identity, device health, and context regardless of whether the request comes from inside or outside the traditional network boundary',
  'Users must re-enter their password every time they switch between applications to continuously verify their identity throughout a work session',
  'All network traffic must be encrypted and no unencrypted connections are permitted within the organization\'s cloud environment',
  'A',
  'Zero trust eliminates the concept of a trusted internal network. Every request is evaluated on its own merits using all available signals. A request from inside the corporate network receives the same scrutiny as one from outside because network location is no longer a reliable trust indicator.'
);
uq(526,
  'How does continuous verification differ from traditional perimeter-based security in protecting cloud resources?',
  'Continuous verification is faster than perimeter security because it caches authentication decisions for 24 hours rather than requiring repeated authentication',
  'Traditional perimeter security assumes that once inside the network boundary a user or device can be trusted, while continuous verification re-evaluates trust throughout a session based on ongoing behavior and context',
  'Continuous verification requires more expensive hardware than perimeter security and is therefore only practical for organizations with large security budgets',
  'B',
  'Perimeter security creates a hard outside and soft inside. Zero trust continuous verification eliminates the soft inside by evaluating every request regardless of its origin. Unusual activity, changed device health, or suspicious behavior can trigger additional verification or access revocation mid-session.'
);
uq(527,
  'What role does device health play in a zero trust access decision?',
  'Device health determines the bandwidth allocation for the device\'s cloud connection to ensure performance remains consistent regardless of security posture',
  'Device health is evaluated as one input to the access decision, with devices running outdated software, missing patches, or lacking endpoint protection potentially being denied access or restricted to lower privilege levels',
  'Device health monitoring is only relevant for mobile devices because desktop computers managed by IT are assumed to meet minimum security requirements by default',
  'B',
  'Zero trust evaluates the security posture of the device making an access request. A compromised device with valid credentials represents a higher risk than a healthy device with the same credentials. Requiring devices to meet minimum security standards before granting access reduces the risk of credential theft enabling access from an already-compromised device.'
);

// ── Cloud Security Module 10 (ids 528-530) — A, C, B ──────────────────────────
uq(528,
  'What is shadow cloud IT and why is it a security concern?',
  'Shadow cloud IT refers to cloud services, accounts, and resources created by employees without IT knowledge or approval, which creates security gaps because these resources operate outside of organizational security controls and monitoring',
  'Shadow cloud IT refers to backup copies of cloud resources maintained by the provider in undisclosed locations, which is a concern because organizations cannot audit or control data in these shadow copies',
  'Shadow cloud IT refers to cloud services that compete with the organization\'s official cloud provider, which is a concern because using competitor services may violate vendor contracts',
  'A',
  'Shadow IT bypasses security controls, compliance requirements, and cost management. Data stored in unapproved services may lack appropriate encryption, access controls, or audit logging. When the employee who created a shadow resource leaves, that resource may continue operating undetected.'
);
uq(529,
  'Which of the following is an example of shadow cloud IT creating a specific security risk?',
  'An IT administrator deploying a new approved application in the organization\'s primary cloud account without updating the asset inventory',
  'A developer using the organization\'s approved cloud storage service to share work files with a colleague in another department',
  'An employee uploading confidential customer data to a personal free cloud storage account for convenience, storing regulated data outside of security controls without organizational knowledge',
  'C',
  'Uploading regulated data to a personal account is shadow IT with direct compliance and security consequences. The organization has no visibility into the security of the personal account, cannot enforce access controls, and has no audit trail of who accessed the data.'
);
uq(530,
  'What is the most effective organizational approach to reducing shadow IT rather than simply prohibiting it?',
  'Implement strict monitoring of all network traffic to detect when employees access unapproved cloud services and issue disciplinary action for violations',
  'Prohibit the use of personal credit cards for any purchases related to work activities to prevent employees from independently subscribing to cloud services',
  'Understand why employees create shadow IT by identifying unmet needs, and provide approved alternatives that satisfy those needs while maintaining appropriate security controls and visibility',
  'C',
  'People create shadow IT because approved tools do not meet their needs or approved processes are too slow. Simply prohibiting it without addressing the underlying need drives the behavior underground where it is even harder to detect. Providing good approved alternatives removes the motivation for shadow IT.'
);

// ── Incident Response Module 1 (ids 531-533) — A, C, B ──────────────────────
uq(531,
  'Which of the following best describes a security incident?',
  'A confirmed or suspected security event that threatens the confidentiality, integrity, or availability of information systems or data and requires a coordinated response',
  'Any security alert generated by a monitoring tool regardless of whether it represents actual malicious activity or a false positive',
  'A security vulnerability discovered in software that has not yet been exploited by any attacker',
  'A',
  'An incident is distinguished from a security event by the threat it poses and the response it requires. Not every alert is an incident. An incident is something that warrants coordinated organizational response because of its actual or potential impact.'
);
uq(532,
  'What is the difference between a security event and a security incident?',
  'Security events are external threats while security incidents are internal threats caused by employees or insiders',
  'Security events are caused by technical failures while security incidents are caused by deliberate malicious activity',
  'A security event is any observable occurrence in a system while a security incident is a security event that has been confirmed or is strongly suspected to represent an actual threat requiring a response',
  'C',
  'The distinction is about confirmation and impact. Security monitoring generates thousands of events. Incidents are the subset of events that have been evaluated and determined to represent actual threats to the organization that require a structured response.'
);
uq(533,
  'Why is early detection of security incidents important beyond just limiting the immediate damage?',
  'Early detection allows organizations to avoid mandatory breach notification requirements because incidents detected and contained within 24 hours do not require regulatory reporting in most jurisdictions',
  'Early detection reduces response costs, limits the volume of data an attacker can exfiltrate, prevents the attacker from establishing additional persistence mechanisms, and reduces recovery complexity',
  'Early detection is primarily important for insurance purposes because most cyber insurance policies require detection within a specific timeframe to be eligible for coverage',
  'B',
  'Time in an environment is what attackers use to cause maximum damage. Every day of undetected presence allows lateral movement, privilege escalation, data exfiltration, and additional persistence. Early detection limits all of these by cutting the attacker\'s time before they are removed.'
);

// ── Incident Response Module 2 (ids 534-536) — A, C, B ──────────────────────
uq(534,
  'What is the primary goal of the containment phase in incident response?',
  'To stop the incident from spreading or causing additional damage while preserving forensic evidence and gathering enough information to plan effective eradication',
  'To completely remove all traces of the attacker from the environment as quickly as possible before they can take any additional actions',
  'To restore affected systems to normal operation while monitoring for signs of re-compromise during the recovery process',
  'A',
  'Containment is about limiting damage, not about complete remediation. Moving too fast to full eradication before understanding the scope can destroy forensic evidence and miss additional compromises. Containment buys time to investigate while preventing the situation from getting worse.'
);
uq(535,
  'Why must eradication happen before recovery in the incident response lifecycle?',
  'Regulatory frameworks require that eradication be documented and approved before recovery can begin to maintain a proper audit trail',
  'Recovering systems before completely removing the threat means restoring potentially compromised data or configurations that allow the attacker to regain access, effectively undoing the recovery',
  'Eradication requires the systems to be offline while recovery can happen with systems online, so the order is determined by operational requirements rather than security considerations',
  'B',
  'Recovering from a backup while the threat is still present means the attacker can immediately re-exploit whatever initial access vector they used. Eradication must address the root cause and all persistence mechanisms before recovery so that restored systems are not immediately recompromised.'
);
uq(536,
  'What is the purpose of the post-incident activity phase and why do many organizations skip it?',
  'Post-incident activity documents the incident for insurance claims and is skipped because most organizations self-insure against cyber incidents',
  'Post-incident activity closes the incident ticket in the security management system and is skipped because analysts prefer to move on to new work rather than revisiting completed incidents',
  'Post-incident activity generates lasting security improvements through structured lessons-learned review and is skipped because organizations prioritize returning to normal operations over reflection when under pressure to move on',
  'C',
  'The after action review is where incidents convert to security improvements. Without it, organizations face the same incidents repeatedly. It is frequently skipped because it feels less urgent than active response work, but it is where the investment in incident response pays long-term dividends.'
);

// ── Incident Response Module 3 (ids 537-539) — A, C, B ──────────────────────
uq(537,
  'What is the most critical element to establish in an incident response plan before any incident occurs?',
  'Clear definitions of what constitutes an incident, who has authority to make major decisions, and what the escalation path and communication channels are for different types and severities of incidents',
  'A complete list of all possible attack types with specific technical remediation steps for each one documented in advance',
  'Contractual agreements with external incident response firms who will take over response activities when internal resources are overwhelmed',
  'A',
  'Decision-making authority, escalation paths, and communication channels are the elements most needed under pressure. Technical playbooks help but can be developed over time. Not knowing who has authority to take systems offline or notify customers during an active incident causes critical delays.'
);
uq(538,
  'Why should an incident response plan include out-of-band communication channels?',
  'Out-of-band channels are required by security frameworks and compliance standards as a documentation requirement rather than for practical operational reasons',
  'If an attacker has compromised your primary communication systems including email and chat, you need independent channels to coordinate response without the attacker monitoring or disrupting your communications',
  'Out-of-band channels provide faster communication during incidents because primary corporate systems are often overloaded during major security events',
  'B',
  'An attacker who has compromised your email system can monitor your incident response communications, receive password reset emails, and interfere with coordination. Having pre-established alternative channels ensures you can communicate securely even when primary systems are compromised.'
);
uq(539,
  'How often should an incident response plan be tested and updated?',
  'Incident response plans should be tested only after a real incident reveals specific gaps because simulated tests do not accurately reflect real-world response conditions',
  'Plans should be reviewed quarterly and tested through tabletop exercises at least annually and after any significant changes to the environment, key personnel, or the threat landscape',
  'Plans should be tested monthly through full simulation exercises to ensure all team members maintain proficiency in their incident response responsibilities',
  'B',
  'Annual tabletop exercises test the plan without the cost of full simulations. Updates after significant changes ensure the plan reflects current reality. Monthly full simulations are impractical for most organizations. Testing only after real incidents means the first test happens under the worst possible conditions.'
);

// ── Incident Response Module 4 (ids 540-542) — A, C, B ──────────────────────
uq(540,
  'What is alert fatigue and why is it a serious security problem?',
  'Alert fatigue occurs when security tools generate so many alerts that analysts become desensitized and begin dismissing alerts without proper investigation, causing real threats to be missed',
  'Alert fatigue is a hardware problem caused by security monitoring systems running too many simultaneous queries that degrades system performance',
  'Alert fatigue refers to the psychological burnout experienced by security analysts after responding to major incidents and results in high staff turnover in security operations centers',
  'A',
  'High alert volumes with low signal quality cause analysts to treat all alerts as noise. When a genuine high-priority alert arrives it receives the same cursory review as the hundreds of false positives that preceded it. Tuning detection to reduce false positives is as important as detection capability itself.'
);
uq(541,
  'A user reports that their computer is running slowly and showing pop-up messages they did not install. What is the correct initial triage question?',
  'Have any other users reported similar symptoms, and has the affected user recently opened email attachments, clicked unusual links, or installed any new software?',
  'What is the make and model of the affected computer because hardware failures are more common than malware and should be ruled out first',
  'Has the user recently changed their password because account compromise is the most likely cause of unusual system behavior',
  'A',
  'Understanding whether the issue is isolated or widespread, and identifying recent user actions that might explain it, immediately narrows the investigation. A single affected user after clicking a link suggests malware. Multiple users with the same symptoms suggests a broader compromise or network-level issue.'
);
uq(542,
  'What information should be gathered during initial triage to determine incident severity?',
  'A complete inventory of all software installed on affected systems to identify potential vulnerability sources',
  'The affected system count, nature of the threat, what data may be at risk, whether the incident is ongoing, and how the attacker gained access if known',
  'The financial cost estimate for remediation so that appropriate budget can be approved before response activities begin',
  'B',
  'Severity determination requires understanding scope and impact. How many systems are affected determines resource needs. Whether the incident is ongoing affects urgency. Data at risk determines notification requirements. Access method affects containment strategy. These questions together drive the severity classification.'
);

// ── Incident Response Module 5 (ids 543-545) — A, C, B ──────────────────────
uq(543,
  'What is the tradeoff between aggressive containment and a slower deliberate approach?',
  'Aggressive containment stops damage faster but risks destroying forensic evidence and missing additional compromises if done without preserving evidence first, while deliberate containment preserves evidence but allows the attacker more time to cause damage',
  'Aggressive containment is always the correct approach because the cost of additional damage always outweighs the value of forensic evidence in any incident scenario',
  'Deliberate containment is always the correct approach because forensic evidence is required for legal proceedings and legal outcomes are always the primary goal of incident response',
  'A',
  'The right balance depends on the specific incident. Active ransomware spreading to new systems requires aggressive containment immediately. An attacker who has been in an environment for months and whose access method is unknown warrants more deliberate containment that preserves evidence to understand the full scope.'
);
uq(544,
  'Why is network isolation a common first containment step for malware infections?',
  'Network isolation prevents the malware from communicating with its command and control infrastructure and spreading to other systems while preserving the state of the infected system for forensic analysis',
  'Network isolation allows security tools to run more effectively because they do not have to process legitimate network traffic while scanning for malicious activity',
  'Network isolation is required by most cyber insurance policies as a mandatory first step that must be documented before coverage applies to the incident',
  'A',
  'Malware that cannot reach its command and control cannot receive new instructions, exfiltrate data, or spread to new systems. Isolation cuts the attacker\'s operational capability immediately while keeping the system available for forensic investigation without requiring immediate shutdown.'
);
uq(545,
  'What does preserving evidence during containment mean and why does it matter?',
  'Preserving evidence means taking forensic disk images and memory captures of affected systems before making changes, because remediation actions alter system state and can destroy the artifacts needed to understand what happened',
  'Preserving evidence means keeping all affected systems running in their compromised state until a full forensic investigation is complete, regardless of how long that takes',
  'Preserving evidence means documenting the incident in a ticketing system before taking any containment actions so there is a written record of the initial discovery',
  'A',
  'Digital forensic evidence is fragile. Rebooting a system clears memory. Cleaning malware removes artifacts. Installing tools modifies file system metadata. Evidence captured before remediation is reliable and complete. Evidence gathered after remediation may be partial, altered, or missing entirely.'
);

// ── Incident Response Module 6 (ids 546-548) — A, C, B ──────────────────────
uq(546,
  'Why is simply running antivirus after an incident insufficient for complete eradication?',
  'Antivirus can only detect known malware signatures and will miss novel malware, may not detect all persistence mechanisms the attacker established, and cannot remove rootkits that hide themselves from the operating system',
  'Antivirus tools are too slow to run during an active incident because they require a full system scan that takes hours to complete',
  'Antivirus removes the malware but does not address the vulnerability that was exploited, leaving the system vulnerable to the same attack through a different piece of malware',
  'A',
  'Sophisticated attackers install multiple persistence mechanisms. Antivirus may find and remove the obvious malware while missing a backdoor user account, a scheduled task that reinstalls the malware, or a rootkit designed to hide from security tools. Complete eradication requires understanding all attacker actions taken during their time in the environment.'
);
uq(547,
  'What is the safest approach to recovering a system that was severely compromised by an attacker who had extended access?',
  'Run a comprehensive antivirus scan and remove all detected threats, then monitor the system intensively for two weeks to verify the attacker is no longer present',
  'Restore the system from the most recent backup taken before the compromise began and verify the backup was not itself affected by the attacker',
  'Provision a completely clean replacement system from a known-good baseline and restore only verified clean data to it rather than attempting to clean the compromised system',
  'C',
  'An attacker with extended access may have modified system files, created hidden accounts, installed rootkits, and established persistence mechanisms that survive antivirus scanning. A clean rebuild from a known-good baseline provides higher confidence than any cleaning process that assumes a compromised system can be trusted.'
);
uq(548,
  'What must be verified before returning recovered systems to production?',
  'The total cost of recovery must be approved by finance and the incident must be closed in the ticketing system before systems can be returned to production',
  'Legal counsel must review and approve all remediation actions taken during eradication before affected systems can be returned to production use',
  'The restored systems must be verified as clean through security scans, the initial access vulnerability must be confirmed as remediated, and enhanced monitoring must be in place before returning to production',
  'B',
  'Recovery is not complete when systems are back online. Verification that the threat is fully removed, that the attack vector is closed, and that monitoring is in place to detect re-compromise are all required before normal operations resume. Returning unverified systems risks immediate recompromise.'
);

// ── Incident Response Module 7 (ids 549-551) — A, C, B ──────────────────────
uq(549,
  'Why should incident communications be kept to a need-to-know basis during an active incident?',
  'Limiting communication protects the organization legally by ensuring that only authorized statements about the incident are made to minimize liability exposure',
  'Wide distribution of incident details wastes response team time as non-essential personnel ask questions and offer advice that distracts from active response work',
  'If an attacker has insider access or is monitoring communications, broad incident discussions reveal the scope of detection and response actions, potentially allowing the attacker to adapt their approach or accelerate their objectives before containment is complete',
  'A',
  'Need-to-know communication during an active incident protects response operations. An attacker who learns they have been detected may accelerate data exfiltration, delete logs, or activate additional persistence before containment is complete. The response team needs to work with the element of surprise whenever possible.'
);
uq(550,
  'What triggers mandatory external breach notification requirements?',
  'Any security incident involving more than ten affected user accounts automatically triggers mandatory notification regardless of the type of data involved',
  'Mandatory notification is triggered only when an organization publicly acknowledges a breach, so private containment without acknowledgment avoids notification requirements',
  'Mandatory notification is triggered by incidents involving specific categories of protected data such as personal information, health records, or financial data, with timelines varying by regulation and jurisdiction',
  'C',
  'Notification requirements are tied to data types and applicable regulations rather than incident size. GDPR requires notification within 72 hours for breaches involving personal data. HIPAA has specific notification requirements for health information. Many US states have their own breach notification laws with varying thresholds and timelines.'
);
uq(551,
  'What is the role of legal counsel in incident response communications?',
  'Legal counsel drafts all external communications to ensure they are factually accurate and comprehensive, providing affected parties with complete information about the incident',
  'Legal counsel reviews external communications, advises on notification obligations, guides decisions about law enforcement engagement, and helps ensure communications do not inadvertently create additional legal liability',
  'Legal counsel\'s role is limited to reviewing final breach notification letters before they are sent to regulatory bodies and affected individuals',
  'B',
  'Legal involvement in incident response goes far beyond reviewing notification letters. Legal counsel advises on privilege protections for investigation documents, guides decisions about law enforcement cooperation, reviews all external statements, and helps navigate the complex intersection of security operations and legal obligations throughout the incident.'
);

// ── Incident Response Module 8 (ids 552-554) — A, C, B ──────────────────────
uq(552,
  'What is the most effective preparation against ransomware before an attack occurs?',
  'Maintaining tested offline or cloud-isolated immutable backups of all critical data so that recovery is possible without paying the ransom, combined with network segmentation to limit lateral spread',
  'Installing the latest version of antivirus software with ransomware-specific protection modules on all endpoints because antivirus is the primary defense against ransomware infections',
  'Training all employees to recognize phishing emails because phishing is the only delivery mechanism for ransomware and eliminating phishing eliminates all ransomware risk',
  'A',
  'Backups are the only reliable recovery mechanism when other defenses fail. Antivirus misses novel variants. Phishing training reduces but cannot eliminate human error. Immutable backups that ransomware cannot reach or encrypt ensure recovery is possible regardless of which delivery method is used.'
);
uq(553,
  'If an organization decides to pay a ransomware demand, what must they understand first?',
  'Payment can only be made after law enforcement has approved the transaction and confirmed the payment recipient is not a sanctioned entity',
  'Payment guarantees decryption because ransomware operators have a business incentive to provide working decryptors to maintain their reputation for future attacks',
  'Payment does not guarantee recovery, funds criminal operations, may be legally prohibited if the ransomware group is on a sanctions list, and should only be considered after exhausting all other recovery options',
  'C',
  'Paying ransoms is a last resort with no guarantees. A significant percentage of paying organizations receive partial or non-functional decryptors. Paying funds the criminal ecosystem. In some jurisdictions paying sanctioned entities is itself illegal. Before paying, check for free decryptors, exhaust backup recovery options, and consult legal counsel.'
);
uq(554,
  'What should be the first technical action when ransomware is actively encrypting files?',
  'Immediately disconnect affected systems from the network to stop the encryption from spreading to network shares and other connected systems, then assess scope before taking further action',
  'Run an immediate full backup of all affected systems before the encryption completes to capture the most recent state of all files',
  'Power off all systems on the network simultaneously to stop all encryption activity and preserve the state of partially encrypted files',
  'A',
  'Network disconnection stops spread to network shares and other systems immediately. Running backups of encrypting systems captures encrypted and partially encrypted files that cannot be recovered. Powering off all systems simultaneously prevents orderly forensic capture and disrupts legitimate operations far beyond the affected systems.'
);

// ── Incident Response Module 9 (ids 555-557) — A, C, B ──────────────────────
uq(555,
  'What is the order of volatility and why does it matter in digital forensics?',
  'The order of volatility describes which evidence is most ephemeral and will be lost first, starting with CPU registers and memory which disappear immediately on power loss, through to disk data which persists, guiding the sequence in which evidence should be collected',
  'The order of volatility describes how quickly evidence degrades in quality over time, with older evidence being less reliable than recent evidence regardless of the storage medium',
  'The order of volatility is a legal framework that determines which types of evidence are admissible in court proceedings based on their technical collection methodology',
  'A',
  'Understanding that memory disappears on power loss while disk persists means investigators collect memory first before shutting down systems. CPU cache, running processes, network connections, and system memory all disappear on power off. Disk contents and logs persist. Collecting in order of volatility prevents irreversible evidence loss.'
);
uq(556,
  'What does maintaining a chain of custody mean for digital evidence?',
  'It means storing all digital evidence on encrypted media that requires multiple authorized personnel to decrypt, ensuring no single person has unilateral access to sensitive investigation materials',
  'It means using only court-approved forensic tools to collect and analyze evidence to ensure the methodology is legally defensible',
  'It means documenting every person who handled the evidence, what they did with it, when they had access, and how it was stored, creating an unbroken record that establishes the evidence has not been tampered with',
  'C',
  'Chain of custody documentation is what makes evidence trustworthy. If evidence changes hands without documentation, opposing parties in legal proceedings can argue the evidence was altered. Even in internal investigations, chain of custody discipline produces more reliable evidence and better investigation outcomes.'
);
uq(557,
  'Why should responders avoid running programs on a suspected compromised system?',
  'Running programs on a compromised system may trigger malware defenses that cause it to self-destruct, destroying evidence and potentially causing system damage',
  'Programs run on a compromised system may themselves be compromised and return false results, and running any program modifies file system timestamps and potentially overwrites memory containing forensic evidence',
  'Running programs on a compromised system extends the time required for forensic imaging because the system\'s resources are being used for other tasks simultaneously',
  'B',
  'A compromised system cannot be trusted. Malware may intercept system calls and return false information. Every program run modifies the file system through access timestamps and temporary files. Memory is constantly being overwritten. Forensic work on a live compromised system degrades evidence quality and may produce unreliable results.'
);

// ── Incident Response Module 10 (ids 558-560) — A, C, B ──────────────────────
uq(558,
  'What is the primary purpose of a post-incident after action review?',
  'To generate specific documented improvements to detection, response, and prevention capabilities based on what actually happened during the incident, so the organization becomes more secure as a result',
  'To assign responsibility and accountability for the security failures that allowed the incident to occur so that appropriate disciplinary action can be taken',
  'To document the total financial cost of the incident for insurance claims, regulatory reports, and executive briefings',
  'A',
  'The after action review exists for improvement, not accountability. A blame-focused review causes people to withhold information to protect themselves, which prevents surfacing the real root causes. A learning-focused review identifies systemic issues that, when addressed, prevent recurrence and improve future response.'
);
uq(559,
  'Which of the following is a valuable output of an after action review?',
  'A comprehensive technical report documenting every action taken during the incident for regulatory compliance purposes',
  'An executive summary suitable for board presentation that summarizes the incident without identifying any operational weaknesses',
  'Specific action items assigned to named individuals with deadlines that address identified gaps in detection, response, or prevention capabilities',
  'C',
  'Vague recommendations accomplish nothing. Specific assigned action items with deadlines are what convert lessons learned into actual security improvements. Without specific ownership and timelines, action items from after action reviews are routinely deprioritized and never implemented.'
);
uq(560,
  'How should an organization treat the metrics from security incidents over time?',
  'Incident metrics should be kept confidential and shared only with the board of directors because sharing them more broadly could attract attention from attackers',
  'Incident metrics are only useful for the specific incident they describe and have no value for planning future security investments or evaluating program effectiveness',
  'Tracking mean time to detect, contain, and recover across incidents over time reveals whether security investments are improving response capability and helps justify future security budget requests',
  'C',
  'Metrics create accountability and demonstrate value. Improving mean time to detect from weeks to days represents a concrete security improvement that can be quantified and presented to leadership. Metrics over time also reveal trends that help prioritize where additional investment will have the greatest impact.'
);

// ── AI and Deepfake Threats Module 1 (ids 561-563) — A, C, B ──────────────────
uq(561,
  'How does AI change the traditional indicators used to identify phishing emails?',
  'AI eliminates the grammatical errors, generic greetings, and poor writing quality that were the most commonly taught indicators of phishing, making AI-generated phishing indistinguishable in writing quality from legitimate emails',
  'AI makes phishing emails easier to identify because AI-generated text has a distinctive formal tone that differs from how humans actually write casual business communications',
  'AI primarily affects the technical delivery of phishing emails by improving spoofing capabilities but does not change the content quality of the messages themselves',
  'A',
  'Security awareness training that focused on language quality as a detection signal is now less effective. AI generates fluent professional prose. The absence of obvious writing errors can no longer be taken as evidence that an email is legitimate. Detection must shift to behavioral and contextual signals.'
);
uq(562,
  'What capability does AI give attackers when conducting spear phishing campaigns?',
  'AI allows attackers to simultaneously generate thousands of highly personalized phishing messages incorporating accurate details about each target gathered automatically from public sources, without requiring manual research for each target',
  'AI allows attackers to bypass email security filters by generating messages that contain no detectable phishing indicators because AI learns which content triggers filters',
  'AI allows attackers to impersonate specific individuals by perfectly replicating their writing style in phishing messages, making it impossible to distinguish AI-generated messages from authentic ones',
  'A',
  'Personalization at scale is the key capability change. Previously spear phishing required significant manual research per target, limiting its use to high-value targets. AI automates both the research and the message generation, making high-personalization attacks economically viable at any scale.'
);
uq(563,
  'Beyond phishing, in what other ways are attackers using AI to conduct attacks?',
  'Attackers use AI exclusively for generating phishing content because other attack types do not benefit from AI capabilities',
  'Attackers use AI for automated vulnerability discovery and exploit generation, creating malware that adapts to evade detection, conducting large-scale credential stuffing with adaptive behavior, and generating synthetic identities for account fraud',
  'Attackers use AI primarily to improve the user interfaces of their phishing sites to make them more convincing replicas of legitimate websites',
  'B',
  'AI applications in attacks extend far beyond phishing content. Automated vulnerability research compresses the time between disclosure and exploitation. Adaptive malware evades signature-based detection by modifying itself. AI-driven automation scales attacks that previously required significant human operator time.'
);

// ── AI and Deepfake Threats Module 2 (ids 564-566) — A, C, B ──────────────────
uq(564,
  'What is a deepfake and what makes current deepfake technology particularly concerning?',
  'A deepfake is AI-generated synthetic media that realistically depicts a real person doing or saying something they never did, with current technology producing results that are increasingly difficult to distinguish from authentic recordings',
  'A deepfake is a digitally altered photograph that replaces one person\'s face with another\'s using basic image editing software available to anyone',
  'A deepfake is a fabricated written document that falsely attributes statements to a real person, representing a type of forgery that has existed long before AI',
  'A',
  'The concern with deepfakes is the combination of realism and accessibility. High-quality synthetic video and audio of real people used to require expensive professional resources. Current AI tools produce convincing results accessible to anyone, dramatically expanding who can create this type of media and for what purposes.'
);
uq(565,
  'Which of the following represents a real-world threat from deepfake technology that has already caused harm?',
  'Deepfake technology has been used primarily to create entertaining parody content of celebrities and has not yet been used for harmful purposes in documented cases',
  'Deepfake audio clones of executives have been used to fraudulently authorize large wire transfers, and non-consensual intimate deepfake imagery has been used for harassment and extortion of real individuals',
  'The only documented harmful use of deepfakes has been in election interference campaigns targeting political candidates in national elections',
  'B',
  'Both financial fraud using executive voice clones and non-consensual intimate deepfake imagery are documented, ongoing harms. Financial losses from voice clone fraud have been confirmed at multiple organizations. Non-consensual intimate deepfakes affect thousands of people and have led to significant legislation in multiple jurisdictions.'
);
uq(566,
  'How much video or audio of a person does an attacker typically need to create a convincing voice clone?',
  'An attacker needs at least several hours of high-quality studio recordings to produce a convincing voice clone because voice cloning requires extensive training data',
  'An attacker needs the person\'s complete vocal range including specific phonemes in isolation which typically requires recording sessions of 30 minutes or more under controlled conditions',
  'A few minutes of audio available from sources like YouTube videos, podcasts, conference recordings, or voicemail greetings is sufficient to create a convincing voice clone using current AI tools',
  'C',
  'The accessibility of voice cloning is the key threat. Anyone who has appeared in any audio or video recording available online is a potential target. Public figures, executives, and anyone with a public presence has likely generated sufficient audio for a convincing clone without being aware of it.'
);

// ── AI and Deepfake Threats Module 3 (ids 567-569) — A, C, B ──────────────────
uq(567,
  'What visual artifacts have historically indicated deepfake video but may become less reliable as technology improves?',
  'Unnatural blinking patterns, inconsistencies around hair and face edges, lighting that does not match the scene, and unusual skin texture or rendering artifacts particularly around teeth and ears',
  'Deepfake videos always have lower resolution than authentic videos because the face replacement process degrades image quality in ways that remain detectable regardless of generation quality',
  'Deepfake videos consistently show the subject looking slightly to the left because of how face-tracking algorithms calibrate gaze direction during generation',
  'A',
  'These artifacts reflect current limitations of deepfake generation models. They are useful detection signals today but will become less reliable as models improve. Relying solely on artifact detection without procedural verification leaves you vulnerable when the technology advances past current artifact-producing limitations.'
);
uq(568,
  'What is the most reliable way to verify the identity of someone making a request in a high-stakes situation?',
  'Analyze the audio or video carefully for deepfake artifacts using your knowledge of current detection techniques and only proceed if you cannot identify any obvious signs of synthesis',
  'Ask the person a question that only the real person would know the answer to because deepfake technology cannot generate accurate responses to personal questions in real time',
  'Contact the person through an independent communication channel you already have and trust, such as calling their known phone number directly, rather than relying on the authenticity of the current communication',
  'C',
  'Independent verification through a trusted channel is the most reliable defense because it works regardless of how convincing the deepfake is. A cloned voice calling you sounds authentic. If you call the real person back on their actual number and they confirm they made no such request, the verification is complete regardless of deepfake quality.'
);
uq(569,
  'What technical tool can organizations use to verify the integrity of video content at scale?',
  'Automated deepfake detection software that analyzes video for statistical patterns associated with AI generation, used as one signal among multiple verification methods rather than a definitive detector',
  'Blockchain-based video authentication that creates an unalterable record of the original video at creation time, making any subsequent modification detectable through hash comparison',
  'Watermarking tools that embed invisible identifiers in video at capture time that cannot be removed during deepfake generation, allowing verification of authentic origin',
  'A',
  'Automated detection tools are useful but imperfect and are frequently defeated by improved generation techniques. They should be one layer of a defense-in-depth approach that also includes procedural verification. No automated tool should be treated as definitive given the ongoing arms race between generation and detection.'
);

// ── AI and Deepfake Threats Module 4 (ids 570-572) — A, C, B ──────────────────
uq(570,
  'How does an AI voice cloning emergency scam typically work?',
  'The attacker clones the voice of a family member or trusted person using audio available online, then calls the target using that synthetic voice claiming the person is in distress and needs immediate financial help, exploiting the emotional response to urgency to bypass critical thinking',
  'The attacker sends a deepfake video of the family member rather than using voice cloning because video is more convincing than audio alone for creating a sense of emergency',
  'The attacker uses the cloned voice only to initiate contact and then transfers the call to a human operator to conduct the actual social engineering because AI cannot handle unexpected questions',
  'A',
  'The combination of a familiar voice and an emergency scenario is designed to trigger an emotional response that bypasses rational evaluation. The urgency prevents the target from taking time to verify. The familiar voice provides the credibility needed to make the scenario believable.'
);
uq(571,
  'What organizational control specifically protects against voice clone fraud targeting employees?',
  'Requiring all financial requests to be submitted through an official ticketing system rather than by phone, so that voice-based requests are structurally excluded from triggering financial actions',
  'Training employees to analyze voice quality during calls and identify subtle artifacts that indicate synthetic speech rather than a real human voice',
  'Establishing pre-agreed verbal code words for high-stakes requests that the requester must provide before any sensitive action is taken, verifying identity regardless of how convincing the voice sounds',
  'C',
  'Code words work because they are known only to the parties involved and cannot be derived from public audio of the target person. A voice clone can sound exactly like the real person but cannot know a private code word. This control defeats voice clone fraud regardless of the sophistication of the synthesis.'
);
uq(572,
  'Why is urgency a particularly effective element when combined with voice cloning in fraud attacks?',
  'Urgency gives the target a justifiable reason to bypass normal verification procedures because time pressure makes verification appear impractical, while the familiar voice provides the credibility to make the urgency seem legitimate',
  'Urgency is effective because it causes targets to focus on the technical details of the request rather than on whether the caller is who they claim to be',
  'Urgency works because most organizations have policies that allow employees to skip approval processes in genuine emergencies, and attackers exploit these legitimate policy exceptions',
  'A',
  'Urgency and credibility working together is the core mechanism of voice clone fraud. The cloned familiar voice establishes credibility. The urgency scenario provides justification for bypassing verification. Each element amplifies the other. The defense is to establish verification procedures that cannot be bypassed regardless of urgency.'
);

// ── AI and Deepfake Threats Module 5 (ids 573-575) — A, C, B ──────────────────
uq(573,
  'What makes AI-generated disinformation more dangerous than traditional disinformation?',
  'AI enables the creation and distribution of high-quality false content at a scale, speed, and personalization level that human-created disinformation cannot match, dramatically lowering the cost and skill required to conduct large-scale influence operations',
  'AI-generated disinformation is more dangerous because AI can target specific individuals with personalized false content while traditional disinformation only works at a population level',
  'AI makes disinformation more dangerous primarily because it can generate false content in any language simultaneously, enabling cross-border influence operations that were previously limited by translation costs',
  'A',
  'Scale and accessibility are the key changes. Large-scale disinformation campaigns previously required significant resources and infrastructure. AI makes them accessible to anyone with basic technical knowledge. The volume of plausible-sounding false content that can now be generated far exceeds human capacity to verify and debunk it.'
);
uq(574,
  'How should you approach viral content that triggers a strong emotional reaction before sharing it?',
  'Verify the content through independent credible sources before sharing, recognizing that emotionally provocative content is specifically designed to spread before people have time to verify it',
  'Share the content immediately if you agree with its message because delaying sharing reduces its reach and impact on public discourse',
  'Report the content to the platform\'s moderation team and wait for their determination before forming any opinion about its authenticity',
  'A',
  'Emotional provocation is a feature of disinformation design. Content that makes you angry, afraid, or excited spreads faster because people share before thinking. The verification step is deliberately bypassed by the emotional response. Slowing down to verify breaks the disinformation distribution mechanism.'
);
uq(575,
  'What is a synthetic social media persona and how is it used in disinformation campaigns?',
  'A synthetic persona is an AI-generated social media account with a fake profile photo, consistent posting history, and realistic engagement patterns used to amplify specific narratives and create false impressions of grassroots support',
  'A synthetic persona is a real person\'s social media account that has been compromised and repurposed by attackers to spread disinformation using the original account\'s established follower base and credibility',
  'A synthetic persona is a parody account that clearly identifies itself as satirical but uses realistic presentation to comment on current events in a way that may be mistaken for genuine reporting',
  'A',
  'Synthetic personas create the appearance of organic support for specific narratives. Networks of these accounts can make fringe positions appear mainstream, amplify specific content to trending status, and manufacture the social proof that makes people more likely to accept false information as credible.'
);

// ── AI and Deepfake Threats Module 6 (ids 576-578) — A, C, B ──────────────────
uq(576,
  'How does AI change the research phase of a social engineering attack?',
  'AI can automatically gather and synthesize information about targets from public sources in minutes, building detailed profiles that previously required hours of manual research and enabling personalized attacks at any scale',
  'AI enables attackers to access private databases and internal systems to gather target information without the manual hacking that was previously required for detailed reconnaissance',
  'AI changes social engineering research primarily by improving the quality of publicly available information about targets rather than changing how quickly that information can be gathered',
  'A',
  'Speed and scale of reconnaissance is the key change. A human researcher might spend hours profiling one target. AI can profile thousands simultaneously using publicly available information. This makes sophisticated personalized attacks economically viable at scales that were previously impractical.'
);
uq(577,
  'What is a chatbot-based social engineering attack and how does it work?',
  'A conversational AI poses as a customer service representative, technical support agent, or other trusted persona to build rapport with targets over extended interactions and eventually extract sensitive information or manipulate them into harmful actions',
  'A chatbot attack automatically generates phishing emails by having an AI converse with itself to produce increasingly convincing message templates',
  'A chatbot attack is a denial of service technique that floods customer service chatbots with automated messages to prevent legitimate customers from receiving support',
  'A',
  'AI-powered conversational attacks can maintain consistent personas through extended interactions that would expose human social engineers. They can answer questions, handle objections, and remember previous conversation context indefinitely. The target may never suspect they are communicating with an automated system rather than a person.'
);
uq(578,
  'What remains the most effective defense against AI-enhanced social engineering attacks?',
  'Verification procedures that require independent confirmation of identity and authorization for sensitive actions, applied consistently regardless of how convincing the request seems or what medium it arrives through',
  'AI-powered social engineering detection tools that analyze communication patterns and flag messages likely to be AI-generated before they reach potential targets',
  'Restricting all employee communications to official channels that are monitored and filtered by security tools, preventing attackers from reaching employees through unofficial contact methods',
  'A',
  'Procedural verification is attacker-agnostic. It works regardless of whether the attack uses a human social engineer, a voice clone, a deepfake video, or an AI chatbot. The specific technology used becomes irrelevant when the procedure requires independent verification that cannot be satisfied by the attack itself.'
);

// ── AI and Deepfake Threats Module 7 (ids 579-581) — A, C, B ──────────────────
uq(579,
  'How does your public social media presence affect your risk from AI-powered scams?',
  'Public social media provides attackers with the audio, video, and personal information needed to create convincing voice clones, deepfakes, and highly personalized social engineering attacks targeting you or people in your life',
  'Public social media presence has no meaningful impact on AI scam risk because attackers use data broker databases rather than social media for target research',
  'Public social media increases scam risk only for public figures with large followings because attackers only target people whose compromise would generate significant attention',
  'A',
  'Anyone with a public social presence has generated sufficient raw material for AI-powered attacks against them. Voice recordings from videos enable cloning. Personal details enable personalization. Photos enable deepfake generation. Privacy settings that limit public exposure directly reduce the materials available for these attacks.'
);
uq(580,
  'What is a family safe word and how does it protect against AI voice cloning scams?',
  'A family safe word is a pre-agreed code word that any family member claiming to be in distress must provide to verify their identity, defeating voice cloning attacks because the code word cannot be derived from public recordings of the real person',
  'A family safe word is a password used to access family accounts on shared devices, protecting against account takeover attacks rather than voice cloning',
  'A family safe word is a verbal trigger that activates a predetermined response protocol, protecting against social engineering by ensuring family members respond consistently to distress calls',
  'A',
  'Code words work because they are private information that is not in any recording, public document, or database that an attacker could access. A voice clone sounds exactly like the real person but cannot know a privately agreed word. The code word converts identity verification from a voice recognition problem into an information verification problem.'
);
uq(581,
  'Why is it important to verify AI-related claims and content through multiple independent sources?',
  'AI can generate convincing false content including fake news articles, fabricated quotes, synthetic images, and misleading statistics, making independent verification essential before acting on or sharing any information that has significant consequences',
  'Independent verification of AI content is important primarily for technical claims about AI capabilities because non-technical people may misunderstand AI limitations',
  'Verifying AI-related content through multiple sources is only necessary for content that will be published or presented professionally because personal information consumption does not require the same rigor',
  'A',
  'The ease of generating convincing false content means that a single source is insufficient verification for any consequential information. Multiple independent credible sources that have separately verified information provide meaningful confirmation. A single viral post, regardless of how professional it appears, could be entirely AI-generated.'
);

// ── AI and Deepfake Threats Module 8 (ids 582-584) — A, C, B ──────────────────
uq(582,
  'How do banks use AI to detect fraudulent transactions?',
  'AI builds behavioral models of normal transaction patterns for each individual account and flags transactions that deviate significantly from established patterns, enabling detection of fraud even when the attacker has valid credentials',
  'Banks use AI exclusively to verify that customers are physically present at ATMs through facial recognition, preventing card skimming attacks at automated terminals',
  'Banks use AI to analyze the language of online communications with customers to detect scam victims who may be being coached by fraudsters to authorize transactions',
  'A',
  'Behavioral modeling is what makes modern fraud detection effective against sophisticated attacks. Rule-based systems that blocked transactions above certain amounts or from foreign countries were easily defeated by attackers who understood the rules. Behavioral models are personalized to each account and harder to predict and evade.'
);
uq(583,
  'What is the limitation of AI-based deepfake detection tools that organizations should understand?',
  'AI deepfake detection tools are expensive and slow, requiring dedicated hardware that only large organizations can afford to deploy at scale',
  'AI deepfake detection tools can only analyze video and cannot process audio deepfakes, leaving voice clone attacks completely undetected',
  'AI deepfake detection tools are frequently defeated by improved generation techniques and should be used as one signal among multiple verification methods rather than as a definitive detector',
  'C',
  'Detection and generation are in an arms race. Improved generation techniques specifically target and defeat known detection methods. A detection tool effective today may be easily bypassed by next-generation synthesis. Relying solely on automated detection creates a single point of failure that will eventually be defeated.'
);
uq(584,
  'Why should you respond to a bank\'s fraud alert system even when you believe the flagged transaction is legitimate?',
  'Responding to fraud alerts trains the AI model on your legitimate behavior patterns, improving its accuracy for your account and reducing future false positives',
  'Banks legally require acknowledgment of all fraud alerts within a specified timeframe and failure to respond may result in account restrictions regardless of whether fraud occurred',
  'Responding confirms the transaction is legitimate and helps the fraud detection system calibrate its model, while ignoring alerts may cause the bank to automatically reverse the transaction assuming fraud occurred',
  'A',
  'Your responses to fraud alerts are training data for your behavioral model. Confirming legitimate transactions and reporting fraudulent ones both improve the model\'s accuracy for your specific patterns. An uncalibrated model generates more false positives that block legitimate transactions and potentially misses real fraud.'
);

// ── AI and Deepfake Threats Module 9 (ids 585-587) — A, C, B ──────────────────
uq(585,
  'What legal issue arises when someone creates and distributes realistic deepfake imagery of a real person without their consent?',
  'Creating non-consensual realistic deepfake imagery of real people can constitute violations of right of publicity laws, defamation law if the content is false and harmful, and specific deepfake legislation that has been enacted in multiple jurisdictions, with criminal penalties applying in some cases',
  'Non-consensual deepfakes are legal as long as they are clearly labeled as synthetic content because labeling provides notice that the content is not authentic',
  'Deepfake creation is only illegal when it involves public figures because private individuals do not have legally recognized rights to control their likeness',
  'A',
  'The legal landscape around deepfakes is evolving but multiple legal theories apply. Non-consensual intimate deepfakes are criminalized in many jurisdictions. Defamatory deepfakes expose creators to civil liability. Right of publicity laws protect individuals\' control over commercial use of their likeness. The specific laws vary by jurisdiction but the legal exposure is real and growing.'
);
uq(586,
  'Why are content creators who use AI to generate realistic fake quotes or statements attributed to real people exposed to legal and reputational risk?',
  'Using real people\'s names in AI-generated content violates platform terms of service which prohibit mentioning real individuals in any generated content',
  'AI-generated fake quotes attributed to real people may constitute defamation if they portray the person falsely in a harmful way, and even satirical or parody content can create liability when the synthetic nature is not sufficiently clear',
  'Content creators are exposed to risk because AI companies retain ownership of all content generated using their tools and can pursue legal action against creators who monetize that content',
  'B',
  'Defamation law does not require malicious intent. Publishing false statements attributed to real people that damage their reputation can create liability even when the creator intended satire. When AI-generated fake quotes are realistic enough that audiences cannot tell they are fabricated, the satirical defense becomes harder to establish.'
);
uq(587,
  'What responsibility do organizations have regarding the ethical use of AI tools in their operations?',
  'Organizations should establish clear policies governing how AI tools can be used, ensure transparency when AI is used in consequential decisions, and consider the potential for bias and harm in AI outputs before deploying them in contexts that affect people',
  'Organizations have no special responsibility regarding AI beyond following existing laws because AI tools are simply software and the same ethical and legal standards that apply to other software apply equally to AI',
  'Organizations are responsible only for ensuring that AI tools they develop internally are ethical, and bear no responsibility for the ethical implications of third-party AI tools they purchase and deploy',
  'A',
  'AI deployment creates organizational responsibility regardless of who developed the tool. Consequential decisions made with AI assistance must be explainable. AI outputs in hiring, lending, and similar contexts may perpetuate or amplify bias. Transparency about AI use respects the autonomy of people affected by AI-assisted decisions.'
);

// ── AI and Deepfake Threats Module 10 (ids 588-590) — A, C, B ──────────────────
uq(588,
  'What habit provides durable protection against AI-powered attacks as the technology continues to evolve?',
  'Requiring independent verification through trusted channels for any request involving money, access to sensitive systems, or sensitive information, applied consistently regardless of how the request is delivered or how convincing it appears',
  'Staying current with the latest AI detection tools and techniques so you can identify AI-generated content whenever you encounter it',
  'Minimizing your use of digital communication channels and reverting to in-person communication for all sensitive discussions to eliminate the attack surface for AI-powered remote attacks',
  'A',
  'Procedural verification is technology-agnostic. It does not matter whether the attack uses today\'s AI or a more sophisticated future version. If your procedures require independent verification that the attacker cannot satisfy, the specific technology used is irrelevant. This durability is what makes it the most valuable single defense habit.'
);
uq(589,
  'How should you approach a request that feels emotionally urgent and comes from a seemingly trusted source?',
  'Slow down deliberately, recognize that urgency is a manipulation technique, and apply your verification procedure regardless of how legitimate the request seems, because the emotional response to urgency is exactly what attackers are designed to trigger',
  'Respond to the urgency appropriately since genuine emergencies do require fast action and excessive skepticism can cause real harm if you delay responding to an authentic emergency',
  'Ask clarifying questions of the requester to give yourself time to evaluate the situation while appearing cooperative and not dismissive of their request',
  'A',
  'Urgency is an attacker\'s most powerful tool because it bypasses rational evaluation. The correct response is to slow down rather than speed up. Legitimate emergencies can withstand a brief verification delay. If the requester objects strongly to verification, that objection is itself a red flag that the urgency is manufactured.'
);
uq(590,
  'What is the most useful mindset shift for staying protected against evolving AI threats?',
  'Focus on building verification habits and security procedures that produce good outcomes regardless of the specific attack technology, rather than trying to stay ahead of each new AI capability as it emerges',
  'Treat all digital communication as potentially AI-generated and refuse to take any action based on digital communication alone, requiring in-person confirmation for all consequential requests',
  'Focus on understanding the technical details of how AI attacks work so you can identify them through technical analysis when you encounter them',
  'A',
  'Chasing specific AI capabilities is a losing strategy because the technology evolves faster than individual awareness can track. Verification procedures that do not depend on the authenticity of any specific medium are durable. The goal is not to detect synthetic media but to make its presence or absence irrelevant to your security outcomes.'
);

// ── Password and Identity Module 1 (ids 591-593) — A, C, B ──────────────────
uq(591,
  'What is a credential stuffing attack and why is password reuse the prerequisite that makes it possible?',
  'Credential stuffing automates the testing of username and password combinations from one breach against hundreds of other services simultaneously, which only works because users who reuse passwords have the same credentials on multiple sites',
  'Credential stuffing is a brute force attack that tests millions of randomly generated passwords against a single account until finding one that works',
  'Credential stuffing is a phishing technique that tricks users into entering their credentials on fake sites that then test those credentials against real services',
  'A',
  'Breached credentials only cascade to other accounts when those accounts share the same password. Unique passwords on every account mean a breach of one site gives the attacker credentials that work nowhere else. Credential stuffing is a volume game that depends entirely on the prevalence of password reuse.'
);
uq(592,
  'Why are passwords based on personal information like birthdays and pet names fundamentally insecure?',
  'Personal information is frequently discoverable through social media profiles, public records, data breaches, and data broker databases, and attackers incorporate this information into targeted password cracking attempts against specific individuals',
  'Personal information makes passwords too short because names and dates typically fall below the minimum length requirements that make passwords resistant to brute force attacks',
  'Personal information-based passwords are insecure because they are too easy to remember, which means users never update them even when prompted to do so by security policies',
  'A',
  'Targeted attacks against specific individuals incorporate everything known about them. Social media posts about pets, family members\' names, meaningful dates, and hometowns are all incorporated into wordlists used for targeted password cracking. The more publicly available information about a person, the more effectively their personal-information passwords can be attacked.'
);
uq(593,
  'What is a rainbow table attack and what defense neutralizes it?',
  'A rainbow table attack uses precomputed hash-to-password mappings to reverse password hashes without brute force computation, and salting passwords with unique random values neutralizes it by ensuring identical passwords produce different hashes',
  'A rainbow table attack tests every possible character combination against a password hash in sequence from shortest to longest, and long passwords neutralize it by making the search space too large',
  'A rainbow table attack intercepts password hashes during transmission and cracks them offline, and encrypting network connections neutralizes it by preventing interception',
  'A',
  'Rainbow tables trade storage space for computation time. Precomputed tables allow instant reversal of unsalted hashes. Salting adds a unique random value to each password before hashing, meaning identical passwords produce different hashes and precomputed tables become useless. Every modern password storage system should use salted hashing.'
);

// ── Password and Identity Module 2 (ids 594-596) — C, B, A ──────────────────
uq(594,
  'Which of the following is the strongest password?',
  'P@ssw0rd123! which includes uppercase, lowercase, numbers, and symbols',
  'Correct-Horse-Battery-Staple which is a passphrase of four common words',
  'xK9#mQ2$vL7nP4@w which is a 16-character random string of mixed characters',
  'C',
  'Random strings of mixed characters provide maximum entropy per character. The first example is a predictable pattern that appears in most cracking wordlists. The passphrase is strong due to length but less random than a truly random string. Length and randomness together determine strength, not the presence of specific character types alone.'
);
uq(595,
  'Why do complexity requirements like mandatory symbols and numbers not make passwords as strong as length requirements?',
  'Symbols and numbers are not recognized by all login systems so requiring them causes compatibility problems that outweigh their security benefit',
  'Complexity requirements cause people to make minimal predictable changes like adding an exclamation mark to the end of a word rather than creating genuinely random passwords, while length requirements significantly increase the mathematical search space for any cracking attempt',
  'Complexity requirements are weaker than length requirements because attackers have developed cracking tools that specifically bypass symbol and number requirements',
  'B',
  'Human response to complexity requirements is predictable. Password1! satisfies typical complexity requirements while being trivially guessable. Length directly and mathematically increases resistance to brute force. A 20-character lowercase password has more possible combinations than an 8-character password with full complexity requirements.'
);
uq(596,
  'How often should you change a password that has not been compromised?',
  'Every 90 days as recommended by most security policies because regular rotation limits the exposure window of any compromised password',
  'Whenever the service notifies you of a breach or when you have reason to believe the password may have been compromised, rather than on a fixed schedule that encourages minimal predictable changes',
  'Every year as a general security hygiene practice even without evidence of compromise',
  'B',
  'NIST updated its guidance to recommend against mandatory periodic password rotation without evidence of compromise. Forced rotation causes people to make minimal changes like incrementing a number, which is less secure than maintaining a strong unique password. Change passwords when there is a reason to, not on an arbitrary schedule.'
);

// ── Password and Identity Module 3 (ids 597-599) — A, C, B ──────────────────
uq(597,
  'Why does using a password manager allow you to have a stronger overall security posture than trying to manage passwords yourself?',
  'A password manager generates and stores truly random unique passwords for every account, eliminating the password reuse and predictable patterns that result from human memory limitations',
  'Password managers automatically update your passwords when security vulnerabilities are detected, keeping all your accounts protected without requiring manual intervention',
  'Password managers encrypt your passwords using military-grade encryption that is stronger than the encryption used by websites to store passwords themselves',
  'A',
  'The core value is enabling behavior that is otherwise impossible at scale. Human memory cannot hold hundreds of unique random passwords. A password manager removes this limitation entirely, making strong unique credentials on every account practical rather than aspirational.'
);
uq(598,
  'What should you do if a website says it does not support passwords with special characters?',
  'Use a password without special characters but make it significantly longer to compensate for the reduced character set',
  'Use the longest password the site accepts without special characters and report the limitation to the site because restrictions on password characters often indicate poor password storage practices',
  'Choose a different service because any site that restricts password characters is inherently insecure and should not be trusted with your information',
  'C',
  'Character restrictions on passwords frequently indicate that the service is storing passwords in plaintext or using a format that requires special character escaping. Either practice represents a serious security flaw. The restriction itself is a red flag about the security practices of the service.'
);
uq(599,
  'What is the most critical account to protect with the strongest available authentication?',
  'Your primary email account, because email is used as the recovery mechanism for virtually every other account you have, making its compromise a cascade failure for all dependent accounts',
  'Your primary social media account, because its compromise would allow attackers to impersonate you to all your contacts and spread misinformation to your followers',
  'Your primary banking account, because financial loss from account compromise is the most directly measurable harm from credential theft',
  'A',
  'Email is the master key. Password reset flows for nearly every service send reset links to email. A compromised email account enables takeover of every account that uses that email for recovery. The email account deserves the strongest available password, the strongest available MFA, and a unique recovery email address.'
);

// ── Password and Identity Module 4 (ids 600-602) — A, C, B ──────────────────
uq(600,
  'Why does multi-factor authentication remain effective even when your password is stolen?',
  'MFA requires a second independent form of verification that the attacker typically cannot obtain even after stealing the password, meaning the stolen credential alone is insufficient to access the account',
  'MFA automatically changes your password when it detects that your current password has appeared in a known data breach, rendering the stolen credential invalid',
  'MFA works by encrypting your password with a key stored only on your device, so a stolen password hash cannot be used without also compromising your device',
  'A',
  'Independence of factors is what makes MFA effective. The attacker has the first factor but lacks the second. For authenticator apps, they would also need physical access to your device. For hardware keys, they would need the physical key. The stolen password is useless without the factor the attacker does not have.'
);
uq(601,
  'Which MFA method is most resistant to phishing and SIM swapping attacks?',
  'SMS one-time codes because they are sent to your registered phone number which is tied to your identity through your carrier account',
  'Time-based one-time password authenticator apps because they generate codes locally on your device without any network transmission that could be intercepted',
  'Hardware security keys using public key cryptography because they verify the domain of the site they are authenticating to and will not respond to a phishing site that has a different domain than the legitimate service',
  'C',
  'Hardware keys provide phishing resistance that authenticator apps do not. When you authenticate with a hardware key it cryptographically verifies the domain. A phishing site with a different domain cannot obtain a valid response from your key. This is qualitatively different from authenticator app codes which can be relayed in real time from phishing sites.'
);
uq(602,
  'What should you do if you receive an MFA code prompt that you did not initiate?',
  'Deny the prompt and immediately change your password because an unsolicited MFA prompt means someone who has your password is actively attempting to log into your account right now',
  'Approve the prompt and then change your password afterward to prevent future unauthorized access attempts from succeeding',
  'Ignore the prompt because it is likely a technical error or test from your service provider and does not indicate any security concern',
  'A',
  'Unsolicited MFA prompts are the alarm bell. They mean your password is already in an attacker\'s hands and they are attempting to use it right now. Denying the prompt stops this specific attempt. Changing your password immediately prevents the attacker from making additional attempts with the same credential.'
);

// ── Password and Identity Module 5 (ids 603-605) — C, A, B ──────────────────
uq(603,
  'A caller claims to be from IT support and says they need your password to fix an urgent account problem. What is the correct response?',
  'Provide the password if the caller can verify their identity by telling you your employee ID and department name',
  'Ask the caller to send a support ticket number to your email first so you can verify the request is logged in the system',
  'Tell the caller that you never share your password with anyone including IT staff, hang up, and call the IT helpdesk back using the number from your company directory to report the contact',
  'C',
  'Legitimate IT teams do not need your password. They have administrative access to systems through their own accounts. Any request for your password is a social engineering attempt regardless of who the caller claims to be or how urgent the situation sounds. Hang up and verify through an independent channel.'
);
uq(604,
  'What is MFA fatigue and how does it work as an attack technique?',
  'An attacker who has stolen your password sends repeated MFA push notification requests hoping you will eventually approve one out of frustration, confusion, or the mistaken belief that approving it will stop the notifications',
  'MFA fatigue refers to users disabling MFA on their accounts after finding it inconvenient, which attackers exploit by targeting accounts where MFA has been removed',
  'MFA fatigue is a technical vulnerability in authenticator apps that allows attackers to replay old authentication codes after extended periods of continuous code generation',
  'A',
  'MFA fatigue exploits human psychology. Repeated push notifications are annoying. People approve them to make them stop. The attacker is counting on confusion or frustration to generate an accidental approval. Number-matching MFA defeats this by requiring active engagement with the login screen that the attacker cannot see.'
);
uq(605,
  'How do attackers use fake IT helpdesk calls to defeat MFA?',
  'Attackers call targets claiming to be IT support, tell them they need to approve an MFA push notification for a system update or security check, and use the approved notification to complete their unauthorized login',
  'Attackers call targets and convince them to install a remote access tool that intercepts MFA codes as they are generated by the authenticator app',
  'Attackers call targets and persuade them to temporarily disable MFA citing a claimed incompatibility with a system upgrade that requires MFA to be turned off',
  'A',
  'Real-time MFA interception through social engineering is an active attack technique. The attacker already has the password. They call the target, establish a pretextual reason for an MFA notification, then trigger the login while the target is on the phone. The target approves what they believe is a legitimate system notification.'
);

// ── Password and Identity Module 6 (ids 606-608) — A, C, B ──────────────────
uq(606,
  'What is single sign-on and what is the main security advantage it provides?',
  'SSO allows users to authenticate once with an identity provider and access multiple applications without re-authenticating for each one, which reduces the number of passwords users must manage and enables centralized enforcement of strong authentication policies',
  'SSO automatically generates unique strong passwords for each application a user accesses and rotates them on a scheduled basis without requiring user involvement',
  'SSO encrypts all communication between users and applications using keys managed by the identity provider, providing end-to-end encryption for all enterprise application traffic',
  'A',
  'The security advantage of SSO is centralization. Instead of managing authentication security for dozens of applications independently, you enforce strong authentication at the identity provider and all connected applications inherit that protection. MFA at the SSO layer protects every connected application simultaneously.'
);
uq(607,
  'What is the biggest security risk associated with single sign-on?',
  'SSO creates a single high-value target where compromise of the identity provider account provides access to every application that trusts it, making the identity provider account significantly more valuable and dangerous than any individual application account',
  'SSO is inherently insecure because identity providers must store all user credentials in a central location that represents an attractive target for attackers',
  'SSO reduces security by allowing users to stay authenticated for extended periods without re-entering credentials, increasing the risk of session hijacking',
  'A',
  'Concentration of risk is the core SSO security concern. One compromised identity provider account unlocks every connected application. This concentration justifies applying the strongest available authentication controls to identity provider accounts. The blast radius of a compromised SSO account is far larger than any individual application account.'
);
uq(608,
  'When you click Log in with Google or Log in with Apple on a third-party website, what is actually happening?',
  'You are sharing your Google or Apple account credentials directly with the third-party website so they can verify your identity against those providers\' user databases',
  'The third-party website receives your email address only, which it uses to look up your account in its own user database without any ongoing access to your Google or Apple account',
  'The identity provider authenticates you and issues a token that tells the third-party application you are authenticated without sharing your password, while the application may receive specific profile information you authorize',
  'B',
  'OAuth-based login does not share credentials with the third-party application. The identity provider handles authentication and issues a token. The application receives the token and the specific profile information you authorize, but never sees your password. This is more secure than creating another site-specific password that could be breached.'
);

// ── Password and Identity Module 7 (ids 609-611) — A, C, B ──────────────────
uq(609,
  'Why should administrators use separate accounts for privileged tasks rather than using their regular accounts for everything?',
  'Using a regular account for privileged tasks means that any compromise of the regular account through phishing or malware immediately grants the attacker administrative access, while separate privileged accounts limit exposure by restricting when and from where elevated access is used',
  'Regulatory frameworks require separate administrator accounts for compliance purposes and the security benefit is secondary to the audit trail requirements',
  'Separate privileged accounts are required because regular user accounts technically cannot perform administrative functions in modern operating systems and enterprise systems',
  'A',
  'Privileged account separation limits blast radius. A regular user account is at risk from phishing, malicious downloads, and browsing activity. If that account also has administrative privileges, so does any attacker who compromises it. A separate privileged account used only for administrative tasks from a secure workstation is exposed to far fewer threats.'
);
uq(610,
  'What is just-in-time privileged access and why is it more secure than standing administrative access?',
  'Just-in-time access provides elevated permissions only for the duration of a specific authorized task and automatically revokes them afterward, eliminating the persistent elevated access that standing administrator accounts provide',
  'Just-in-time access is a backup authentication method that provides emergency access when primary credentials are unavailable, used as a fallback rather than a primary access control',
  'Just-in-time access is a monitoring feature that logs administrator actions in real time and alerts security teams when privileged operations occur outside of approved maintenance windows',
  'A',
  'Standing administrative access means privileged credentials exist and are usable at all times. Compromising an account with standing admin access gives the attacker those privileges immediately and indefinitely. JIT access means there is no standing privilege to compromise. Elevated access exists only during the specific window it is needed.'
);
uq(611,
  'What is a privileged access workstation and what threat does it specifically address?',
  'A PAW is a dedicated device used exclusively for administrative tasks that is hardened and isolated from general internet browsing and email, protecting privileged credentials from the threats that regular workstations face through routine use',
  'A PAW is a virtual machine that runs inside a regular workstation, providing isolation between privileged administrative work and regular user activities on the same physical device',
  'A PAW is a network-isolated server that administrators connect to remotely to perform privileged tasks, protecting the server from external threats by keeping it off the public network',
  'A',
  'Administrative credentials are valuable. Performing administrative tasks from a workstation also used for email, browsing, and running general applications exposes those credentials to every threat those activities carry. A dedicated hardened workstation used only for administration reduces the attack surface for credential theft dramatically.'
);

// ── Password and Identity Module 8 (ids 612-614) — A, C, B ──────────────────
uq(612,
  'Why are traditional security questions a weak account recovery mechanism?',
  'The answers to common security questions like mother\'s maiden name, first pet, and childhood street are frequently discoverable through social media, public records, genealogy databases, and data breaches, making them effectively public knowledge for many people',
  'Security questions are weak because users frequently forget the answers they provided when setting up their accounts, making them ineffective for legitimate recovery as well as for security',
  'Security questions are cryptographically weak because the answer space is small and can be brute-forced by automated tools in a matter of seconds',
  'A',
  'Security questions were designed when personal information was less accessible. Today the information these questions ask about is frequently findable. Social media makes family names and pet names public. Genealogy databases expose maiden names. Data brokers compile personal histories. The questions provide minimal security against anyone who researches their target.'
);
uq(613,
  'What is the safest approach to configuring backup codes for MFA-protected accounts?',
  'Store backup codes in a cloud-synced notes app so they are accessible from any device in case you need them when your primary device is unavailable',
  'Store backup codes in your password manager or print them and keep them in a physically secure location separate from your primary device, and generate a new set immediately if you suspect they have been compromised',
  'Share backup codes with a trusted family member so someone else can help you regain access in case of emergency, ensuring you are never permanently locked out of important accounts',
  'B',
  'Backup codes are a high-sensitivity credential. In your email or cloud notes they are accessible to anyone who compromises those accounts. Sharing them with others creates additional risk. They should be stored with the same security as any high-value credential, either encrypted in a password manager or physically secured offline.'
);
uq(614,
  'Why should your account recovery email address have stronger security than the accounts it recovers?',
  'If an attacker compromises your recovery email address they can trigger password resets for every account that uses it for recovery, making the recovery email account a master key that should be protected as carefully as or more carefully than any account it can unlock',
  'Recovery email addresses process more authentication requests than regular accounts and therefore face a higher volume of attack attempts that require stronger defensive measures',
  'Recovery email addresses are stored in plaintext by some email providers making them easier to target than regular accounts that benefit from additional encryption',
  'A',
  'The recovery email is a backdoor into every account that uses it. An account you can reset is an account you can take over. If your recovery email has weaker security than the accounts it recovers, attackers will target the recovery email as the path of least resistance to reach everything else.'
);

// ── Password and Identity Module 9 (ids 615-617) — A, C, B ──────────────────
uq(615,
  'What is the difference between identity theft and account takeover?',
  'Identity theft uses your personal information to create new fraudulent accounts or commit fraud in your name, while account takeover uses stolen credentials or other means to gain control of your existing accounts',
  'Identity theft involves physical document theft while account takeover is exclusively a digital crime involving only online accounts and credentials',
  'Identity theft is committed by strangers who purchase your information while account takeover is typically committed by people who know you personally and have access to your login information',
  'A',
  'The distinction matters for response. Identity theft requires monitoring for new fraudulent accounts and often involves credit bureaus and law enforcement. Account takeover requires regaining control of existing accounts and assessing what the attacker did while in control. Both require action but the specific steps differ.'
);
uq(616,
  'What should you do if you discover that your information was included in a data breach notification?',
  'Wait to see if any fraud occurs before taking action because breach notifications often overstate the impact and your information may not actually be misused',
  'Change the password for the breached service immediately, change the same password anywhere else you used it, enable or strengthen MFA on the breached account, and monitor the breached account and your credit reports for signs of misuse',
  'Close the account at the breached service because continued use of the account after a breach creates ongoing risk regardless of what actions you take to secure it',
  'B',
  'Prompt action limits damage. The breached password is now in attacker databases used for credential stuffing. Changing it immediately prevents it from being used successfully. Checking for reuse addresses the cascade risk. MFA provides protection even if the password is still being tested by automated tools.'
);
uq(617,
  'What is a credit freeze and when should you consider using one?',
  'A credit freeze prevents new credit accounts from being opened in your name by blocking lenders from accessing your credit report, and you should consider placing one if you have been a victim of identity theft or if your Social Security number has been exposed in a data breach',
  'A credit freeze temporarily lowers your credit score to make you less attractive to identity thieves who target people with high credit scores for premium fraud',
  'A credit freeze blocks all financial transactions on your existing accounts until you lift it, protecting you from unauthorized charges during a period of heightened risk',
  'A',
  'Credit freezes are the strongest available protection against new account fraud. A lender who cannot access your credit report will not open new credit in your name. Freezes are free, do not affect existing accounts or your credit score, and can be lifted temporarily when you need to apply for legitimate credit.'
);

// ── Password and Identity Module 10 (ids 618-620) — A, C, B ──────────────────
uq(618,
  'What is the correct priority order for improving personal account security?',
  'Start with a password manager and MFA on your email and password manager accounts first because these two steps address the highest-impact vulnerabilities, then progressively extend to financial accounts and other important services',
  'Start by reviewing and deleting all accounts you no longer use because eliminating unnecessary accounts reduces your attack surface more than improving security on accounts you keep',
  'Start by enabling MFA on all accounts simultaneously before addressing password strength because MFA provides more protection than strong passwords and should be deployed everywhere first',
  'A',
  'Impact-first prioritization maximizes the security improvement per unit of effort. Email and password manager accounts are the highest-value targets with the most severe consequences if compromised. Improving their security first provides the greatest risk reduction. Progressive extension to other accounts builds the habit while ensuring the most critical accounts are protected.'
);
uq(619,
  'How should you handle a service that does not support MFA?',
  'Use a unique strong password generated by your password manager for that account, monitor it for breach notifications through HaveIBeenPwned, and consider whether the service is necessary given its security limitations',
  'Avoid using the service entirely because any service that does not offer MFA has unacceptable security practices and cannot be trusted with any personal information',
  'Use a slightly weaker but more memorable password for services without MFA because the inability to use MFA means password strength is less important for those accounts',
  'A',
  'A unique strong password is the best available protection when MFA is not an option. Breach monitoring ensures you are notified if the service is compromised so you can change the password before credential stuffing attacks test it elsewhere. Deciding whether the service is necessary given its security limitations is a valid consideration for sensitive accounts.'
);
uq(620,
  'What ongoing habit keeps your personal identity security posture strong over time?',
  'Conducting periodic reviews of your accounts and credentials including checking for unused accounts to close, verifying MFA is still active on important accounts, rotating any credentials that may have been exposed, and checking breach notifications for your email addresses',
  'Changing all your passwords on a fixed monthly schedule to ensure that any compromised credentials are regularly rotated out of use',
  'Reviewing your credit report annually as the single most important ongoing action because credit monitoring detects both account compromise and identity theft',
  'A',
  'Periodic comprehensive reviews catch security drift. MFA settings can be removed accidentally. Accounts accumulate over time. Passwords may be compromised without immediate notification. A regular review habit ensures your security posture reflects your intentions rather than drifting as your digital life changes.'
);

console.log('\nAll new section quiz questions updated successfully.');
console.log('Verifying answer distribution for new questions...');
const dist = db.prepare('SELECT correct_choice, COUNT(*) as count FROM module_quiz_questions WHERE module_id BETWEEN 82 AND 121 GROUP BY correct_choice ORDER BY correct_choice').all();
dist.forEach(r => console.log(`  ${r.correct_choice}: ${r.count} questions`));
