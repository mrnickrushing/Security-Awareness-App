const { db, initDb } = require('./src/db');
initDb();

function umod(id, content) {
  db.prepare(`UPDATE modules SET content = ? WHERE id = ?`).run(content, id);
  const row = db.prepare(`SELECT title, LENGTH(content) as len FROM modules WHERE id = ?`).get(id);
  console.log(`Updated id ${id} (${row.len} chars): ${row.title}`);
}

// ── Cloud Security ────────────────────────────────────────────────────────────

umod(82, `Cloud computing has changed how individuals and organizations store data, run applications, and deliver services. Instead of maintaining physical servers in a building, cloud computing lets you access computing resources over the internet on demand. Understanding what the cloud is and how it works is the foundation of using it safely.

The three main cloud service models are Infrastructure as a Service, Platform as a Service, and Software as a Service. Infrastructure as a Service provides raw computing resources like virtual machines, storage, and networking. You manage the operating system and everything above it. Platform as a Service provides a managed environment for developers to build and deploy applications without managing the underlying infrastructure. Software as a Service delivers fully managed applications over the internet. Email services, document editors, and video conferencing tools are all common examples.

Deployment models matter for security. A public cloud is operated by a third-party provider and shared across many customers. A private cloud is dedicated to a single organization. A hybrid cloud combines both. A multi-cloud strategy uses services from multiple providers. Each model comes with different security responsibilities and risk profiles.

The shared responsibility model is one of the most important concepts in cloud security. Cloud providers are responsible for securing the underlying infrastructure, physical data centers, and core services. You are responsible for securing everything you put in the cloud, including your data, user accounts, application configurations, and access controls. Misunderstanding this boundary is one of the most common causes of cloud security breaches.

Cloud computing offers real advantages including scalability, redundancy, and access to enterprise-grade infrastructure without large upfront costs. But it also introduces risks. Data stored in the cloud is accessible over the internet, which means misconfigured permissions or weak credentials can expose it to anyone. Cloud environments can become complex quickly, making it easy to lose track of what is running and who has access to it.

Before moving anything to the cloud, understand what data you are handling, who needs access to it, and what the provider is and is not responsible for securing. These three questions will guide every other cloud security decision you make.`);

umod(83, `Identity and access management is the single most important security control in a cloud environment. Unlike a traditional office where physical access to a building provides a layer of protection, cloud resources are accessible from anywhere in the world with just a username and password. This makes controlling who can access what, and how they authenticate, absolutely critical.

Identity and access management systems let you define who can access cloud resources and what actions they are allowed to perform. Every cloud provider offers some form of IAM. Amazon Web Services has IAM roles and policies. Microsoft Azure uses Azure Active Directory. Google Cloud uses Cloud IAM. Despite different names and interfaces, the underlying concepts are consistent across providers.

The principle of least privilege is the foundational rule of cloud IAM. Every user, application, and service should have only the permissions needed to perform its specific function and nothing more. An application that only reads from a database should not have permission to delete records. A developer who works on one project should not automatically have access to all company cloud resources. Overpermissioning is one of the most common cloud security mistakes and one of the most dangerous.

Role-based access control assigns permissions to roles rather than to individual users. Users are then assigned roles based on their job function. This makes managing access at scale much more practical. When someone changes jobs, you change their role assignment rather than manually adjusting dozens of individual permissions.

Multi-factor authentication must be enabled for all cloud accounts, especially any account with administrative permissions. A compromised admin account in a cloud environment can result in the deletion of all data, the creation of unauthorized resources that generate massive costs, or the exfiltration of everything stored in the environment. MFA is the single most effective control against credential compromise.

Service accounts and API keys require the same rigor as human accounts. Hardcoded credentials in application code, publicly exposed API keys in code repositories, and service accounts with excessive permissions are all common attack vectors. Rotate credentials regularly, store them in dedicated secrets management services rather than in code, and audit service account permissions the same way you audit human accounts.

Review access permissions regularly. People change roles, leave organizations, and projects end. Access that was appropriate six months ago may no longer be. Scheduled access reviews catch permission creep before it becomes a security incident.`);

umod(84, `Cloud storage services like Amazon S3, Google Cloud Storage, and Azure Blob Storage make it easy to store and share data at scale. They are also one of the most common sources of data breaches when misconfigured. Understanding how to secure cloud storage correctly is essential for anyone who handles data in cloud environments.

The most dangerous misconfiguration in cloud storage is making buckets or containers publicly accessible when they should be private. A publicly accessible storage bucket means anyone on the internet can read, and sometimes write, the files inside it. Billions of records have been exposed this way. The default setting in most cloud providers has shifted toward private, but legacy configurations and human error still cause public exposure regularly.

Always verify the access control settings on any storage resource you create. Set bucket policies and access control lists explicitly rather than relying on defaults. Enable the block public access settings available in most cloud storage services as a preventive control that overrides any accidental public permission grants.

Encryption protects data even if access controls fail. Cloud storage services offer server-side encryption that automatically encrypts data before writing it to disk. Enable this for all storage resources. For highly sensitive data, consider client-side encryption where you encrypt the data before uploading it, meaning the provider holds only ciphertext they cannot read.

Versioning maintains a history of every change made to stored objects. If ransomware encrypts your cloud storage or someone accidentally deletes critical files, versioning lets you recover previous versions. Enable versioning on any storage containing important data.

Access logging records who accessed what files and when. Enable access logs on cloud storage resources containing sensitive data. These logs are invaluable during incident investigations and help you detect unusual access patterns early.

Object lifecycle policies automatically move or delete data based on age or access patterns. Use these to ensure data is not retained longer than necessary. Data you no longer need is data that cannot be breached.

Regularly audit your cloud storage resources using the access analyzer tools available in most cloud platforms. These tools automatically flag resources that are publicly accessible or shared with external accounts and give you a clear list of things to review and remediate.`);

umod(85, `Cloud networks differ from traditional office networks in important ways. Instead of physical switches, routers, and cables, cloud networks are software-defined. You configure them through management consoles and APIs, which gives tremendous flexibility but also means a single misconfiguration can expose your entire infrastructure to the internet.

Virtual Private Clouds are the foundational network construct in most cloud platforms. A VPC is a logically isolated section of the cloud where you launch resources. Within a VPC you define subnets, which are ranges of IP addresses. Resources in a public subnet can communicate directly with the internet. Resources in a private subnet can only communicate internally or through controlled exit points. Databases, internal application servers, and anything that does not need direct internet access should always be in private subnets.

Security groups act as virtual firewalls attached to individual cloud resources. They control inbound and outbound traffic based on rules you define. Every security group rule should be as specific as possible. Instead of allowing all traffic from any IP address, specify exactly which ports and protocols are needed and restrict source addresses to known ranges wherever possible. The most dangerous security group configuration is allowing inbound access on all ports from all IP addresses, which effectively removes all network-level protection.

Network access control lists provide an additional layer of traffic filtering at the subnet level. Unlike security groups which are stateful and automatically allow return traffic, NACLs are stateless and evaluate every packet independently. Use NACLs as a secondary defense layer for critical subnets.

VPN connections and private connectivity options like AWS Direct Connect or Azure ExpressLink provide encrypted dedicated connections between your on-premises infrastructure and cloud environments. Use these instead of exposing management interfaces over the public internet.

Flow logs capture information about network traffic moving through your cloud infrastructure. Enable flow logs on your VPCs and subnets. When a security incident occurs, flow logs tell you which IP addresses communicated with your resources, on which ports, and how much data moved. Without them you are investigating blind.

Cloud Web Application Firewalls protect internet-facing applications from common attacks including SQL injection, cross-site scripting, and bot traffic. Deploy WAF rules in front of any public-facing web application.`);

umod(86, `You cannot protect what you cannot see. Cloud monitoring and logging give you visibility into what is happening across your cloud environment so you can detect threats, investigate incidents, and demonstrate compliance. Without them, attackers can operate in your environment for months without detection.

Cloud providers offer native logging services that capture activity across your entire account. AWS CloudTrail records every API call made in your account including who made it, from which IP address, and what the outcome was. Azure Monitor and Google Cloud Audit Logs provide equivalent functionality. Enable these services in every region you operate in and store the logs in a separate storage account with restricted access so that an attacker who compromises your environment cannot erase the evidence of their activity.

Security information and event management systems aggregate logs from multiple sources and apply rules to detect suspicious patterns. Many organizations use cloud-native SIEM services or third-party tools that integrate with cloud logging. Key events to alert on include root account or global admin logins, new IAM users or roles being created, security group rules being changed to allow public access, large volumes of data being downloaded or exported, and failed authentication attempts followed by a successful one.

Cloud Security Posture Management tools continuously scan your cloud environment for misconfigurations and compliance violations. They check things like whether storage buckets are publicly accessible, whether encryption is enabled, whether MFA is enforced, and whether network rules follow least privilege. CSPM tools turn what would be a manual audit into an automated continuous process.

Infrastructure as Code tools like Terraform and CloudFormation let you define cloud resources in configuration files. When you use IaC, you can scan your configuration files for security issues before deployment, review changes through pull requests, and maintain a complete history of every change to your infrastructure. This is a significant improvement over manually clicking through a management console.

Anomaly detection services use machine learning to identify unusual behavior in your cloud environment. AWS GuardDuty, Azure Defender, and Google Security Command Center all provide this capability. They detect things like unusual API call patterns, connections to known malicious IP addresses, and credential use from unexpected geographic locations.

Set up billing alerts as an early warning system. Unexpected spikes in cloud spending often indicate that an attacker is using your account to mine cryptocurrency or run other workloads. A billing alert costs nothing and can catch a compromise before it results in a massive unexpected bill.`);

umod(87, `Cloud compliance and data residency are concerns that affect organizations in virtually every industry. Regulations dictate how certain types of data must be handled, where it can be stored, and who can access it. Understanding these requirements before moving data to the cloud prevents costly compliance failures and legal exposure.

Data residency refers to the physical location where data is stored. Many regulations require that certain categories of data remain within specific geographic boundaries. European personal data governed by the General Data Protection Regulation must generally remain within the European Economic Area or be transferred only to countries with equivalent protections. Healthcare data in the United States is subject to HIPAA requirements. Financial data has its own regulatory frameworks depending on jurisdiction. Cloud providers offer regions and availability zones in different countries, and most allow you to specify exactly where your data will be stored.

The shared responsibility model has compliance implications. Cloud providers can certify their infrastructure against standards like SOC 2, ISO 27001, PCI DSS, and FedRAMP. But their certifications cover the infrastructure layer only. You are responsible for ensuring your applications, data handling practices, access controls, and configurations meet the same standards. Storing data in a HIPAA-certified data center does not make your application HIPAA-compliant if you have not implemented the required access controls and audit logging.

Data classification is the starting point for compliance. You need to know what data you have, where it is stored, who can access it, and how sensitive it is before you can implement appropriate controls. Most compliance frameworks require a data inventory and classification scheme.

Audit trails are a compliance requirement across virtually every regulatory framework. The logging capabilities discussed in the previous module directly support compliance by providing evidence that access controls are working, changes to systems are tracked, and unauthorized access attempts are detected and investigated.

Right to erasure provisions in regulations like GDPR require that you be able to delete all data associated with a specific individual on request. Before storing personal data in the cloud, ensure your architecture allows you to identify and delete data by individual, including any backups or replicated copies.

Compliance is not a one-time project. Regulations change, your cloud environment changes, and the data you handle changes. Treat compliance as an ongoing program with regular reviews, not a checkbox that stays checked forever.`);

umod(88, `Applications running in the cloud face the same threats as applications running anywhere else, plus additional risks specific to the cloud environment. Securing cloud applications requires attention to how applications are built, deployed, configured, and monitored.

The OWASP Top Ten is the starting point for application security regardless of where an application runs. Injection attacks, broken authentication, security misconfigurations, and insecure dependencies are all as relevant in cloud applications as in traditional ones. The difference is that cloud applications are often exposed to the entire internet by default, increasing the urgency of addressing these vulnerabilities.

Infrastructure as Code should be used to define application environments. IaC makes deployments repeatable, reviewable, and auditable. It prevents configuration drift where live environments gradually diverge from their documented state through manual changes. Every change goes through version control and can be reviewed before it is applied.

Container security has become central to cloud application security as containerized workloads have become standard. Container images should be scanned for known vulnerabilities before deployment. Base images should be minimal, using only what the application needs. Containers should run as non-root users. Container registries should be private and access controlled. Kubernetes and other orchestration platforms have their own security configurations that must be hardened explicitly.

Secrets management is critical for cloud applications. Database passwords, API keys, encryption keys, and other credentials must never be hardcoded in application code or stored in environment variables that are logged or exposed. Use dedicated secrets management services like AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault. These services store secrets encrypted, control access through IAM policies, and provide audit logs of every secret access.

Dependency management requires ongoing attention. Third-party libraries and packages introduce vulnerabilities that may not be discovered until after they are in production. Use dependency scanning tools in your build pipeline to detect known vulnerabilities in the packages your application uses. Subscribe to security advisories for your key dependencies and have a process for applying patches quickly when critical vulnerabilities are disclosed.

Web Application Firewalls, rate limiting, and DDoS protection should be deployed in front of any internet-facing application. These controls reduce the volume of malicious traffic that reaches your application and provide a layer of defense against common automated attacks.`);

umod(89, `Cloud incidents are different from traditional incidents in important ways. Resources can be created and destroyed in seconds. Logs may be stored in separate services that require specific access to retrieve. The blast radius of a compromised cloud account can be enormous. And the shared responsibility model means the cloud provider handles some aspects of incident response while you handle others.

Preparation is the most important phase of cloud incident response. Before an incident occurs, you need to know what logging is enabled and where those logs are stored, who has authority to take containment actions like revoking credentials or isolating resources, what your escalation path is for different types of incidents, and how to contact your cloud provider for support. Document all of this in an incident response plan and test it with tabletop exercises before you need it.

When a cloud incident occurs, the first priority is containment. In a traditional environment containment might mean disconnecting a server from the network. In the cloud it means revoking compromised credentials immediately, disabling or deleting unauthorized IAM users or roles, modifying security group rules to isolate affected resources, and snapshotting affected systems before making any changes so you preserve forensic evidence.

Credential compromise is the most common type of cloud incident. If you suspect credentials have been compromised, revoke them immediately. Do not wait to confirm the compromise before acting. The cost of revoking valid credentials and reissuing them is far lower than the cost of allowing an attacker continued access while you investigate.

Cloud provider support varies by service tier. Enterprise support contracts typically include access to security incident response teams who can assist with investigation and containment. Know what support tier you have and how to engage it before you are in the middle of an incident.

Forensic investigation in the cloud relies heavily on logs. CloudTrail, VPC flow logs, application logs, and authentication logs together paint a picture of what happened. Preserve these logs by moving copies to isolated storage before taking any remediation actions, since some remediation steps may affect log availability.

After an incident is contained and resolved, conduct a thorough after action review. Identify what detection and prevention controls failed, what worked well in your response, and what changes to make to prevent recurrence. Cloud incidents often reveal gaps in monitoring, overly permissive IAM configurations, or missing automated alerting that, once addressed, significantly reduce future risk.`);

umod(90, `Zero Trust is a security model built on the principle that no user, device, or network connection should be trusted by default, regardless of whether it originates inside or outside the traditional network perimeter. In cloud environments, where the concept of a network perimeter barely exists, Zero Trust is not just a best practice but a practical necessity.

The traditional security model assumed that anything inside the corporate network could be trusted. Once an attacker or malicious insider was inside the perimeter, they often had relatively free movement. Zero Trust eliminates this assumption. Every request for access must be authenticated, authorized, and continuously validated regardless of where it comes from.

The core principles of Zero Trust are verify explicitly, use least privilege access, and assume breach. Verify explicitly means authenticating and authorizing every access request based on all available data points including identity, location, device health, and behavioral signals. Use least privilege means granting only the minimum access required for each specific function. Assume breach means designing systems with the expectation that a breach will occur and minimizing the blast radius when it does.

Identity is the primary control plane in a Zero Trust architecture. Strong authentication including MFA is required for every user and every service. Conditional access policies can require additional verification when access comes from unfamiliar locations or devices. Continuous authentication re-evaluates trust during sessions rather than only at login.

Microsegmentation is a Zero Trust network strategy that divides your cloud environment into small isolated zones, each with its own access controls. Instead of flat networks where any resource can communicate with any other, microsegmentation ensures that a compromised workload can only reach the specific resources it needs and nothing else. This dramatically limits lateral movement by attackers who gain a foothold in your environment.

Device health verification is a component of Zero Trust that evaluates whether the device making an access request meets your security requirements before granting access. Devices running outdated operating systems, missing security patches, or lacking endpoint protection can be denied access or given reduced permissions.

Implementing Zero Trust in a cloud environment is a journey rather than a single project. Start by identifying your most sensitive resources and implementing strong identity verification and least privilege access for those. Gradually extend the model outward. Every step toward Zero Trust reduces your attack surface and limits the damage any single compromise can cause.`);

umod(91, `Shadow IT and uncontrolled cloud spending are two interconnected risks that organizations frequently underestimate. Shadow IT refers to cloud services, applications, and resources that employees create or use without the knowledge or approval of the IT or security team. Cloud cost overruns occur when cloud usage grows faster than it is monitored and controlled.

Shadow IT in the cloud is easy to create and hard to detect. An employee can sign up for a cloud storage service, spin up a virtual machine on a personal credit card, or connect a third-party application to corporate systems in minutes without any approval process. These resources operate outside of your security controls, often store company data without appropriate protections, and may not be discovered until the employee leaves or a breach occurs.

The risk of shadow IT goes beyond security. Data stored in unapproved cloud services may violate compliance requirements. Applications built outside of standard processes may lack proper access controls. And when the employee who created a shadow IT resource leaves, that resource may continue running undetected and accumulating cost.

Cloud cost management and shadow IT detection often go hand in hand. Cloud Access Security Brokers discover cloud services being used across your organization by analyzing network traffic and logs. CASB tools give you visibility into what cloud services your employees are using, how much data is moving to those services, and whether those services meet your security standards.

Tagging policies enforce consistent labeling of cloud resources with metadata like owner, project, cost center, and environment. Tags make it possible to attribute costs, identify orphaned resources, and quickly determine who is responsible for any given resource. Enforce tagging requirements through cloud policies that prevent the creation of untagged resources.

Budget alerts and cost anomaly detection automatically notify you when spending exceeds thresholds or when unusual patterns emerge. A sudden spike in compute costs often indicates either a security incident where someone is using your account for unauthorized workloads, or an accidental misconfiguration that is creating resources unintentionally.

Regular cloud resource audits identify resources that are running but unused, resources with no owner tag, and resources that were created outside of approved processes. Schedule these audits monthly and establish a process for reviewing and either adopting or decommissioning discovered resources.

The solution to shadow IT is not simply prohibition. People create shadow IT because approved tools do not meet their needs or approved processes are too slow. Work with your team to understand what they are trying to accomplish and provide approved alternatives that meet those needs while maintaining appropriate security controls.`);

// ── Incident Response ─────────────────────────────────────────────────────────

umod(92, `A security incident is any event that threatens the confidentiality, integrity, or availability of your information systems or data. Understanding what qualifies as an incident, and how to recognize one when it occurs, is the starting point for effective incident response.

Not every security alert is an incident. Security tools generate enormous volumes of alerts, the vast majority of which are false positives or low-priority events. An incident is a confirmed or suspected security event that requires a coordinated response. The difference between an event and an incident is context, severity, and impact. A single failed login attempt is an event. Ten thousand failed login attempts against your admin accounts in five minutes is an incident.

Common types of security incidents include unauthorized access to systems or data, malware infections, ransomware attacks, data breaches where sensitive information is exfiltrated, denial of service attacks, insider threats, and supply chain compromises. Each type requires a somewhat different response, but the overall process for managing incidents follows consistent phases regardless of type.

Recognizing incidents requires both technical detection capabilities and human judgment. Technical detection comes from security monitoring tools, antivirus alerts, intrusion detection systems, and log analysis. Human recognition comes from employees who notice something wrong with their systems, receive suspicious communications, or observe unusual behavior by colleagues. Both channels matter, and employees need to know how to report suspected incidents quickly without fear of blame.

The cost of late detection is enormous. Studies consistently show that the longer an attacker remains in an environment undetected, the more damage they can cause and the more expensive recovery becomes. The average time to detect a breach has historically been measured in months. Every day of undetected presence allows an attacker to move laterally, escalate privileges, exfiltrate more data, and establish additional persistence mechanisms.

Early detection requires investment in monitoring, alerting, and the human capacity to investigate alerts. It also requires a culture where employees feel comfortable reporting suspected incidents immediately without worrying about being blamed for causing them. An employee who reports clicking a suspicious link within minutes of doing so gives your security team a chance to contain the incident before it spreads. An employee who waits days out of embarrassment gives the attacker days of undetected access.

Establish clear criteria for what constitutes an incident in your organization and make sure everyone knows what to do when they suspect one has occurred.`);

umod(93, `The incident response lifecycle provides a structured framework for managing security incidents from initial detection through final resolution and lessons learned. Having a defined process prevents the chaos and ad-hoc decision making that makes incidents worse and recovery harder.

The most widely used incident response framework comes from the National Institute of Standards and Technology. The NIST framework defines four phases: preparation, detection and analysis, containment eradication and recovery, and post-incident activity. These phases are not strictly sequential but cycle continuously as incidents evolve and new information emerges.

Preparation is the most important phase because it happens before any incident occurs. Preparation includes building and training an incident response team, developing and documenting incident response plans and playbooks, deploying detection and logging tools, establishing communication channels and escalation paths, and conducting tabletop exercises to test your plans. Organizations that invest in preparation respond faster, make better decisions under pressure, and recover more completely than those who improvise.

Detection and analysis involves identifying that an incident has occurred, determining its scope and severity, and gathering the information needed to respond effectively. This phase involves correlating alerts from multiple sources, analyzing logs and forensic artifacts, and making decisions about how serious the incident is and what resources to mobilize.

Containment stops the incident from spreading while you plan eradication and recovery. Containment strategies vary by incident type. For a malware infection, containment might mean isolating affected systems from the network. For a compromised account, it means revoking credentials and terminating active sessions. The goal is to limit damage while preserving forensic evidence.

Eradication removes the threat from your environment. This means removing malware, closing the vulnerability that was exploited, revoking unauthorized access, and verifying that no additional compromises occurred. Eradication must be thorough because attackers frequently establish multiple persistence mechanisms.

Recovery restores affected systems and services to normal operation. Recovery is more than just restoring from backup. It includes verifying the integrity of restored systems, monitoring for signs of re-compromise, and gradually returning systems to production with enhanced monitoring.

Post-incident activity is where lasting improvement happens. The after action review identifies what went wrong, what went right, and what specific changes to make to prevent recurrence and improve future response.`);

umod(94, `An incident response plan is a documented, tested set of procedures that guides your organization through detecting, containing, eradicating, and recovering from security incidents. Without a plan, incident response defaults to improvisation under pressure, which consistently produces worse outcomes than even a mediocre written plan.

The incident response plan should begin with clear definitions. What constitutes an incident at your organization? What are the severity levels and what determines which level applies? Who is on the incident response team and what are their roles? Who has authority to make major decisions like taking systems offline or notifying customers? These questions need answers before an incident occurs, not during one.

Playbooks are the operational heart of an incident response plan. A playbook is a step-by-step guide for responding to a specific type of incident. Common playbooks cover ransomware, data breach, account compromise, malware infection, DDoS attack, and insider threat. Each playbook walks through detection indicators, immediate containment steps, investigation procedures, eradication steps, recovery procedures, and notification requirements. Playbooks reduce decision fatigue during stressful incidents and ensure consistent responses regardless of which team member is leading the response.

Communication plans specify who needs to be notified at each stage of an incident and through what channels. Internal communication includes executives, legal counsel, human resources, and affected business units. External communication may include customers, partners, regulators, and law enforcement depending on the nature of the incident. Pre-drafted communication templates save critical time when you are in the middle of an incident and need to notify stakeholders quickly.

Legal and regulatory notification requirements must be incorporated into your plan. Many jurisdictions require notification of affected individuals and regulators within specific timeframes after a data breach. GDPR requires notification to regulators within 72 hours of becoming aware of a breach. HIPAA has its own notification timeline. Knowing your obligations before an incident occurs ensures you meet them without scrambling to understand the requirements while simultaneously managing the incident.

The plan must be tested. A plan that has never been tested is a plan of unknown reliability. Tabletop exercises simulate incident scenarios and walk the team through the plan in a discussion format. Full simulation exercises actually execute response procedures in a test environment. Test at least annually and after any significant changes to your environment or the threat landscape.`);

umod(95, `Detection and triage are the skills that separate organizations that catch incidents early from those that discover breaches months after they began. Detection is finding that something is wrong. Triage is determining how serious it is and what to do about it first.

Detection relies on a layered approach combining automated tools and human observation. No single detection tool catches everything, which is why defense in depth applies to detection just as it applies to prevention. Antivirus and endpoint detection tools catch known malware and suspicious behavior on individual devices. Network monitoring catches unusual traffic patterns and connections to known malicious infrastructure. Log analysis identifies anomalous patterns in authentication, access, and system activity. Threat intelligence feeds provide indicators of compromise associated with known threat actors and campaigns.

Alert fatigue is the enemy of effective detection. When security tools generate thousands of alerts per day, analysts become desensitized and start dismissing alerts without proper investigation. Tuning your detection tools to reduce false positives is as important as deploying them in the first place. Prioritize high-fidelity alerts that indicate genuine threats and suppress or deprioritize alerts that consistently turn out to be benign.

Threat hunting is the proactive search for threats that have evaded automated detection. Rather than waiting for alerts, threat hunters actively look for indicators of compromise and attacker techniques in your environment. Threat hunting catches sophisticated attackers who specifically design their tools and techniques to avoid triggering common detection rules.

Triage involves quickly assessing the severity and scope of a potential incident to determine the appropriate response level. Key questions during triage include: What systems are affected? What data may be at risk? Is the incident still ongoing? How did the attacker gain access? Are there signs of lateral movement to other systems? The answers determine whether this is a minor event that one analyst can handle or a major incident requiring the full team.

Severity classification helps allocate resources appropriately. A common approach uses four or five levels from informational events that require no immediate action up to critical incidents that require all hands immediately. Define your severity levels clearly with specific criteria for each level so triage decisions are consistent across different analysts and time periods.

Time is critical during triage. Every minute spent debating whether something is an incident is a minute the attacker may be using to move deeper into your environment. When in doubt, treat it as an incident and scale back the response if investigation reveals it was a false alarm. The cost of an unnecessary response is far lower than the cost of delayed response to a real incident.`);

umod(96, `Containment is the phase where you stop an active incident from getting worse. The goal is not to fix everything immediately but to limit damage while you gather enough information to eradicate the threat properly. Moving too fast in containment can destroy forensic evidence. Moving too slow allows the attacker to cause more damage.

Short-term containment actions are immediate steps taken to stop the bleeding without permanently altering affected systems. These include isolating affected systems from the network by disconnecting them or placing them in a quarantine VLAN, blocking malicious IP addresses at the firewall, revoking compromised credentials, and disabling affected user accounts. These actions are reversible and preserve the state of affected systems for forensic analysis.

Evidence preservation must happen in parallel with containment. Before making significant changes to affected systems, capture forensic images of disk contents and take memory dumps if possible. Preserve log files from affected systems and any network devices that may have recorded relevant traffic. Evidence collected before remediation is far more useful than evidence collected after, because remediation actions inevitably alter the state of systems.

Long-term containment strategies may be needed when immediate full eradication is not possible. If you cannot immediately remove malware from a production system without causing unacceptable downtime, you might keep the system running in a highly monitored isolated state while you prepare a clean replacement. This is acceptable when the alternative is extended outage, but it requires careful monitoring to ensure the contained threat does not spread.

Network segmentation during containment prevents lateral movement. If an attacker has compromised one system, they will attempt to use that access to reach other systems. Isolating the compromised segment limits their ability to do so. In cloud environments this means modifying security groups to restrict outbound connections from affected resources.

Communication during containment is critical. The incident response team needs to coordinate actions to avoid stepping on each other. Executives need enough information to make decisions about business continuity without being buried in technical details. Affected users may need to know why their access has been revoked or their systems taken offline. Establish a clear communication cadence during active containment and assign someone specifically to handle internal and external communications so that the technical team can focus on response.`);

umod(97, `Eradication removes the threat from your environment completely. Recovery restores your systems and services to normal operation. These two phases are closely linked but distinct, and rushing through eradication to get to recovery is one of the most common mistakes organizations make during incident response.

Eradication must be thorough. Attackers routinely establish multiple persistence mechanisms to ensure they can regain access even if their primary access method is discovered and removed. Common persistence techniques include creating new user accounts, installing scheduled tasks or cron jobs that re-run malicious code, modifying startup scripts, installing rootkits that survive operating system reinstalls, and establishing command and control connections through legitimate-looking outbound traffic. Your eradication process must identify and remove all of these, not just the most obvious one.

The safest eradication approach for severely compromised systems is complete rebuild from a known good baseline. Rather than attempting to clean an infected system, you provision a new clean instance, restore data from a verified clean backup, and verify the new system is operating correctly before decommissioning the compromised one. This approach takes more time than attempting to clean the existing system but provides much higher confidence that the threat is fully removed.

Vulnerability remediation is an essential component of eradication. The attacker exploited something to gain access. If you remove the attacker without fixing the vulnerability, you have simply reset the clock. Identify the initial access vector, whether it was a phishing email, an unpatched vulnerability, a weak password, or a misconfigured service, and address it as part of eradication.

Recovery involves restoring systems and services carefully rather than simply bringing everything back online as quickly as possible. Prioritize systems based on business criticality. Restore from the most recent verified clean backup. Monitor restored systems more intensively than normal for the first days and weeks after recovery to detect any signs of re-compromise that might indicate the eradication was incomplete.

Credential rotation is required after any incident involving account compromise. Change passwords for all accounts that may have been accessed during the incident, even if there is no specific evidence those accounts were compromised. If the attacker had access to your environment for any significant period, assume they may have harvested credentials. Rotate service account credentials, API keys, and any other secrets that were accessible in the compromised environment.`);

umod(98, `Ransomware has become one of the most disruptive and financially damaging forms of cyberattack. Understanding how ransomware works and how to respond when it strikes is essential knowledge for anyone responsible for systems or data.

Ransomware encrypts your files and demands payment, usually in cryptocurrency, in exchange for the decryption key. Modern ransomware attacks often involve double extortion, where the attackers exfiltrate data before encrypting it and threaten to publish it publicly if the ransom is not paid. Some attacks involve triple extortion, adding threats to notify your customers or attack your customers directly.

Ransomware typically enters environments through phishing emails containing malicious attachments or links, exploitation of unpatched vulnerabilities in internet-facing systems, compromised remote desktop protocol credentials, or malicious downloads. Once inside, ransomware operators often spend weeks or months in an environment before triggering encryption, during which time they establish persistence, escalate privileges, move laterally to reach the most valuable data, and disable backup systems.

When ransomware activates, the first response is containment. Isolate affected systems immediately to prevent the encryption from spreading to additional systems and network shares. Disconnect affected systems from the network but do not power them off, as memory may contain forensic information about the ransomware and potentially the encryption keys.

Do not pay the ransom without exhausting all other options. Payment funds criminal operations and does not guarantee recovery. A significant percentage of organizations that pay ransoms do not receive working decryption keys, or receive keys that only partially decrypt their data. In some jurisdictions, paying ransoms to sanctioned entities may itself be illegal.

Before considering payment, check whether free decryption tools exist for the specific ransomware variant. The No More Ransom project maintains a database of free decryptors for many ransomware families. Ransomware identification tools can help determine which variant you are dealing with.

The best defense against ransomware is immutable offline backups. Backups that ransomware cannot reach or modify are your recovery path when all else fails. Test your backups regularly. Know your recovery time objective and ensure your backup strategy can meet it.`);

umod(99, `Digital forensics is the process of collecting, preserving, and analyzing digital evidence in a way that maintains its integrity and makes it usable in investigations and, if necessary, legal proceedings. Even if you never need to present evidence in court, forensic principles improve the quality of your incident investigations and help you understand exactly what happened during a breach.

The most fundamental principle of digital forensics is evidence preservation. Digital evidence is fragile and can be easily altered or destroyed. The act of booting a compromised system, running programs on it, or even just letting it continue operating changes the evidence. Proper forensic practice involves capturing the state of systems before making any changes. This means taking forensic disk images that capture every bit of data on a drive, taking memory captures that preserve the contents of RAM including running processes and network connections, and preserving log files before any remediation actions alter or delete them.

Chain of custody documentation records every person who handled evidence, what they did with it, and when. This documentation is what allows evidence to be trusted in legal proceedings. Even in internal investigations, maintaining chain of custody discipline instills good habits and produces more reliable evidence.

Disk imaging creates a bit-for-bit copy of a storage device that can be analyzed without touching the original. Forensic analysis is always performed on the image, never on the original evidence. This ensures the original evidence remains unaltered and can be used for verification or future analysis.

Memory forensics analyzes the contents of a system's RAM at a point in time. Memory contains information that is not stored on disk, including encryption keys, running processes and their network connections, recently executed commands, and credentials. Memory captures are extremely valuable in malware investigations because sophisticated malware often operates entirely in memory to avoid leaving traces on disk.

Log analysis is the most practical forensic skill for most security professionals. System logs, application logs, authentication logs, and network logs together create a timeline of what happened. Learning to correlate events across multiple log sources, identify the timestamps of key attacker actions, and trace the path an attacker took through your environment is a skill that pays dividends in every investigation.`);

umod(100, `The after action review, also called a post-incident review or lessons learned session, is the phase where incidents generate lasting improvement. Without structured reflection after incidents, organizations repeat the same mistakes and face the same incidents again and again. With it, each incident makes you measurably more secure.

The after action review should occur within days of an incident being resolved, while details are still fresh. It should include everyone who participated in the response, from the frontline analysts who detected the incident to the executives who made containment decisions. The goal is learning, not blame. A blame-focused review causes people to be defensive and withhold information. A learning-focused review surfaces the real root causes and systemic issues that need to be addressed.

The review should address a standard set of questions. What happened and when? What was the initial detection method and how long did it take to detect? What was the response timeline and where were the delays? What worked well in the response? What did not work as expected? What was the root cause of the incident? What could have prevented it? What changes would make future detection and response faster and more effective?

Root cause analysis goes deeper than identifying the immediate cause. A ransomware incident might have been caused immediately by a phishing email, but the root cause might be inadequate security awareness training, the absence of email filtering controls, or a culture where employees are afraid to report suspicious emails. Addressing root causes prevents recurrence. Addressing only immediate causes means the next incident exploits the same underlying weakness through a different vector.

Action items from the review must be specific, assigned to named individuals, and tracked to completion. Vague recommendations like improve security awareness accomplish nothing. Specific action items like schedule quarterly phishing simulation for all staff by end of quarter with results reviewed monthly are actionable and measurable.

Metrics from incidents help quantify improvement over time. Track mean time to detect, mean time to contain, mean time to recover, and total incident cost. Improvements in these metrics across incidents demonstrate that your investments in detection and response capabilities are paying off.

Share lessons learned appropriately. Within your organization, sharing what happened and what you learned helps other teams avoid similar incidents. In some cases, sharing sanitized incident details with peers in your industry or with sector-specific information sharing organizations helps the broader community defend against the same threats.`);

// ── AI and Deepfake Threats ───────────────────────────────────────────────────

umod(102, `Artificial intelligence is transforming the threat landscape in ways that make attacks faster, cheaper, more convincing, and more scalable than ever before. Understanding how attackers are using AI helps you recognize AI-powered attacks when you encounter them and defend against them more effectively.

AI makes phishing emails dramatically more convincing. Traditional phishing emails were often identifiable by poor grammar, generic greetings, and implausible scenarios. AI language models can generate phishing emails that are grammatically perfect, contextually appropriate, personalized to the target using publicly available information about them, and indistinguishable in writing quality from legitimate correspondence. The volume of high-quality phishing content that can be generated has increased by orders of magnitude while the skill required to create it has dropped to near zero.

AI enables highly targeted spear phishing at scale. Previously, crafting a convincing personalized phishing email required significant research time, which meant attackers reserved spear phishing for high-value targets. AI can automatically research targets by scraping their social media profiles, company websites, and public records, then generate personalized messages that reference real details about the target's role, colleagues, projects, and interests. This level of personalization can now be applied to thousands of targets simultaneously.

AI-powered vulnerability discovery and exploitation tools can identify weaknesses in software and generate working exploit code faster than human researchers. This compresses the window between vulnerability disclosure and active exploitation, reducing the time organizations have to patch before attacks begin.

AI is also being used defensively. Security tools increasingly use machine learning to detect anomalous behavior, identify malware based on behavioral patterns rather than signatures, and analyze vast volumes of log data to surface meaningful signals. The same capabilities that empower attackers are also being applied to defense.

The fundamental challenge posed by AI is that it removes the skill barrier for many types of attack. Activities that previously required significant expertise and time can now be automated and scaled. Attacks that were previously too expensive or difficult to execute become economically viable. Defense must adapt by focusing less on detecting specific attack patterns, which AI can modify endlessly, and more on behavioral detection and identity verification that is harder to fake even with AI assistance.`);

umod(103, `Deepfakes are synthetic media in which a person's likeness, voice, or both have been replaced or manipulated using artificial intelligence. The technology has advanced to the point where deepfake videos and audio can be difficult or impossible to distinguish from authentic recordings with the naked eye and ear. Understanding what deepfakes are and how they are used maliciously is the first step in defending against them.

Video deepfakes replace a person's face in a video with someone else's face, or generate entirely synthetic video of a person doing or saying something they never actually did. The technology uses deep learning models trained on large amounts of video footage of the target person. The more footage available, the more convincing the result. Public figures with extensive video archives online are particularly easy to deepfake convincingly.

Audio deepfakes clone a person's voice to generate synthetic speech that sounds like them saying anything the attacker wants. Voice cloning requires relatively little source audio. A few minutes of audio, obtainable from a YouTube video, podcast, or voicemail greeting, can be sufficient to produce convincing voice clones. The resulting synthetic voice can read any text in a way that sounds authentically like the target person.

Real-time deepfakes modify video streams live, allowing a person in a video call to appear as someone else. This capability is increasingly accessible through consumer software. A fraudster conducting a video call while appearing to be a legitimate executive or job candidate is a real and growing threat.

The malicious applications of deepfakes span financial fraud, disinformation, reputation attacks, and social engineering. Financial fraud using executive voice clones has already resulted in significant losses at multiple organizations. Deepfake videos of public figures making inflammatory statements have been used to spread disinformation. Synthetic intimate imagery created without consent is used for harassment and extortion.

The social and organizational harms of deepfakes extend beyond the immediate victims of specific attacks. The existence of convincing synthetic media erodes trust in authentic recordings. When people know that any video or audio could be fake, the evidentiary value of genuine recordings diminishes. This erosion of trust in media is itself a harm that benefits bad actors.`);

umod(104, `Detecting deepfakes is an ongoing technical challenge because the technology used to create them and the technology used to detect them are locked in a continuous arms race. Detection methods that work today may be defeated by improved generation techniques tomorrow. Understanding current detection approaches while maintaining realistic expectations about their limitations is important for anyone who needs to evaluate potentially synthetic media.

Visual artifacts are the starting point for deepfake detection. Current deepfake generation technology has consistent weaknesses that manifest as visual anomalies. Watch for unnatural blinking patterns or eyes that do not blink at all. Look for inconsistencies around the hairline and face edges where the face replacement meets the background. Examine lighting and shadows on the face, which may not match the lighting in the rest of the scene. Watch for unusual skin texture that looks unnaturally smooth or exhibits strange artifacts when the subject moves. Look at teeth, ears, and jewelry which deepfake models frequently render imperfectly.

Audio artifacts in voice clones include unnatural prosody where the rhythm and emphasis of speech sounds slightly off, inconsistent breathing patterns, background noise that does not match the setting, and subtle digital artifacts particularly in consonant sounds. Comparing a suspected voice clone to known authentic recordings of the same person can help identify subtle differences in speaking style.

Contextual verification is often more reliable than technical detection. Rather than trying to determine whether a video is authentic, verify the claim the video is making through independent channels. If a video purports to show your CEO making a statement, verify with the CEO through a separate communication channel before acting on it. If a video makes an extraordinary claim about a public figure, check whether credible news organizations are reporting the same information.

Automated deepfake detection tools analyze media for statistical patterns associated with AI generation. These tools can process video at scale but are imperfect and are frequently defeated by improved generation techniques. They are most useful as one signal among many rather than as a definitive detector.

The most reliable defense against deepfake-enabled attacks is not technical detection but procedural verification. Establish verification protocols for high-stakes communications and transactions that do not rely solely on the authenticity of audio or video. Out-of-band verification, pre-established code words, and multi-person approval requirements for significant decisions all reduce the effectiveness of deepfake social engineering regardless of how convincing the synthetic media becomes.`);

umod(105, `AI-powered voice cloning scams represent one of the most emotionally manipulative forms of fraud. When you hear what sounds like the voice of someone you trust urgently asking for help, your instinct is to respond immediately. Scammers are exploiting this instinct using synthetic voices that are increasingly indistinguishable from real ones.

The grandparent scam has been updated with voice cloning technology. Traditional versions involved a scammer calling an elderly person and claiming to be their grandchild in trouble and needing money urgently. With voice cloning, the scammer can call using a synthetic version of the grandchild's actual voice, making the deception far more convincing. Similar attacks target parents, siblings, and spouses using cloned voices of their family members.

Executive fraud using voice clones has resulted in significant financial losses at organizations. In documented cases, employees received calls from what they believed to be their CEO or CFO instructing them to wire money urgently for a sensitive business reason. The voice was a clone generated from audio of the real executive available in public speeches, interviews, or earnings calls. Employees who trusted their ears followed the instructions and transferred funds before discovering the fraud.

The attack workflow is straightforward. The attacker finds audio of the target person online, which is widely available for anyone who has ever appeared in a podcast, video, interview, or voicemail greeting. They feed this audio into a voice cloning service, which generates a synthetic voice model. They then use that model to generate any audio they want the target person to appear to say. The call is placed with the synthetic voice delivering the scripted message.

Protection against voice cloning scams relies on verification procedures rather than trying to detect synthetic voices in real time. Establish a family code word that anyone claiming to be a family member in distress must provide before you send money. Organizations should require out-of-band verification for any financial request received by phone regardless of who the caller claims to be. Never send money based solely on a phone call regardless of how familiar the voice sounds.

Caller ID spoofing frequently accompanies voice cloning attacks, making the call appear to come from the genuine person's phone number. A familiar voice calling from a familiar number is the combination attackers use to overcome skepticism. Both elements can be faked.`);

umod(106, `AI-generated disinformation uses artificial intelligence to create and distribute false or misleading information at a scale and speed that human-created disinformation cannot match. Understanding how AI is used to spread disinformation helps you evaluate the information you consume more critically and recognize manipulation when you encounter it.

AI language models can generate realistic-sounding news articles, social media posts, forum comments, product reviews, and other content types indistinguishably from human-written equivalents. This content can be produced in massive quantities, targeted to specific audiences, and distributed through networks of fake accounts with minimal human effort. The economic barrier to conducting large-scale disinformation campaigns has dropped dramatically.

Synthetic personas are AI-generated social media accounts with fake profile photos, consistent posting histories, and realistic engagement patterns. These accounts can be used to amplify specific narratives, create the appearance of grassroots support for positions or products, and manipulate trending algorithms to increase the visibility of disinformation. Detecting synthetic personas requires analyzing behavioral patterns over time rather than just examining individual posts.

Deepfake videos and audio are used in disinformation campaigns to create false records of things that never happened. Synthetic video of a political figure making a controversial statement, of a corporate executive announcing false information, or of an event that did not occur can spread rapidly before being debunked, and the debunking typically reaches far fewer people than the original false content.

Information verification has become a critical skill. When you encounter surprising or emotionally provocative information, slow down before sharing it. Check whether credible independent sources are reporting the same information. Reverse image search photographs to check whether they are authentic. Look for the original context of quotes. Consider whether the information is designed to provoke an emotional reaction, since emotional content is more likely to be shared without verification.

Prebunking, explaining how disinformation techniques work before people encounter specific examples, has been shown to be more effective than debunking after people have already been exposed to false content. Understanding that AI can generate convincing fake quotes, images, and videos makes you more likely to verify before accepting or sharing.`);

umod(107, `AI has dramatically lowered the barrier to conducting sophisticated social engineering attacks. Capabilities that previously required skilled human operators, significant research time, and expensive resources are now accessible to anyone through AI tools. Understanding how AI amplifies social engineering helps you recognize attacks that may be more polished and convincing than anything you have encountered before.

Automated reconnaissance uses AI to rapidly gather and synthesize information about targets from public sources. Social media profiles, company websites, press releases, LinkedIn profiles, and public records can be scraped and analyzed to build detailed target profiles in minutes. This profile informs the social engineering attack with accurate personal details that make the attacker appear knowledgeable and trustworthy.

AI-generated pretexts are more convincing than human-crafted ones because they can incorporate target-specific details naturally. An AI-generated spear phishing email might reference the target's recent conference attendance, their team's current project, their manager's name, and a plausible business scenario specific to their role, all derived from public information. The combination of these accurate details makes the email feel like it comes from someone who genuinely knows the target.

Conversational AI enables attackers to conduct extended interactions through chat, email, or messaging that remain convincing over time. A human social engineer might make mistakes in extended correspondence that reveal the deception. An AI can maintain consistent personas, remember previous parts of a conversation, and generate contextually appropriate responses indefinitely.

AI voice agents can conduct real-time phone conversations using synthetic voices. These agents can answer questions, respond to objections, and maintain a convincing conversation with targets who might detect inconsistencies that would expose a recorded message. Combining a cloned familiar voice with a conversational AI creates a highly effective vishing tool.

The defenses against AI-powered social engineering are the same as for traditional social engineering but need to be applied more consistently because AI-powered attacks are more convincing. Verify all unexpected requests through independent channels. Be suspicious of urgency regardless of how credible the source seems. Establish verification procedures for sensitive actions that cannot be bypassed even when requests seem legitimate.`);

umod(108, `AI fraud detection systems are used by financial institutions, e-commerce platforms, and other organizations to identify fraudulent transactions and activities in real time. Understanding how these systems work helps you understand why certain legitimate activities trigger fraud alerts and why certain fraudulent activities sometimes get through.

Traditional fraud detection relied on rule-based systems that flagged transactions meeting specific criteria like transactions above a certain amount, transactions in foreign countries, or multiple transactions in rapid succession. These rules were effective against known fraud patterns but easily defeated by attackers who learned the rules and structured their activities to avoid triggering them.

Machine learning fraud detection analyzes patterns across millions of transactions to build models of what legitimate behavior looks like for each individual user and account. When a transaction deviates significantly from established patterns, the model flags it for review or blocks it automatically. This behavioral approach is much harder to defeat because it is personalized to each account rather than based on global rules.

Behavioral biometrics analyze how users interact with devices and applications rather than just what they do. Typing rhythm, mouse movement patterns, how a person holds their phone, and how they scroll through an application all create a behavioral signature that is difficult to replicate. Fraud detection systems that incorporate behavioral biometrics can identify account takeovers even when the attacker has valid credentials.

AI is used on the attacker side as well, creating an arms race in fraud detection. Fraud rings use AI to analyze which transaction patterns get through detection systems and optimize their attacks to stay within those patterns. They use AI to generate synthetic identities for account creation and to automate the testing of stolen credentials at scale.

You can support fraud detection systems by notifying your financial institutions promptly when your behavior is going to change. If you are traveling internationally, alert your bank. If you are making an unusually large purchase, be prepared to verify it through the bank's authentication channel. These communications help fraud detection systems calibrate their models and reduce both false positives that block your legitimate transactions and false negatives that allow fraudulent ones.`);

umod(109, `The rapid advancement of AI and deepfake technology has outpaced the legal and ethical frameworks designed to govern it. Understanding the current legal landscape and ethical debates helps you navigate the use of AI tools responsibly and understand your rights when AI is used against you.

Consent is the central legal issue in most AI and deepfake contexts. Creating a realistic likeness of a real person without their consent is the foundation of most deepfake harms. Many jurisdictions have enacted or are developing laws specifically addressing non-consensual intimate deepfakes, which criminalize the creation and distribution of synthetic explicit imagery of real people without consent. Some jurisdictions have broader laws against using someone's likeness without consent for commercial purposes.

Defamation law applies to deepfakes that falsely portray real people doing or saying harmful things. A deepfake video that portrays a real person committing a crime they did not commit could constitute defamation. However, proving defamation requires establishing that the content is false, that it was published to third parties, that it caused harm, and in many jurisdictions that the creator acted with the requisite level of fault. The anonymity of internet distribution often makes identifying and holding creators accountable difficult.

Electoral integrity laws in many jurisdictions address the use of synthetic media in political campaigns. Using deepfakes to impersonate candidates or create false representations of their statements is either explicitly illegal or may constitute election interference under existing laws. Disclosure requirements for AI-generated political advertising are being enacted in multiple jurisdictions.

Intellectual property questions arise around training data and generated content. AI models trained on copyrighted material without licensing raise copyright infringement questions that courts are actively working through. The ownership of AI-generated content is unsettled in most jurisdictions. Using AI tools to generate content that closely mimics a specific artist's style raises both legal and ethical questions.

Ethically, the use of AI to create realistic synthetic media of real people without consent violates their autonomy and dignity even in cases that may not be clearly illegal. The potential for harm from synthetic media of real people is significant, and the ethical standard of obtaining consent before creating realistic representations of others should guide decisions even in legal gray areas.`);

umod(110, `The AI threat landscape is evolving faster than any previous category of security threat. Capabilities that seemed speculative a few years ago are now in active use by attackers. Staying ahead of evolving AI threats requires continuous learning, adaptable defenses, and organizational practices that do not depend on any single technology or detection capability.

Follow the AI security research community. Organizations like the AI Security Initiative, academic research groups studying adversarial AI, and security vendors publishing threat intelligence on AI-powered attacks all produce valuable information about emerging techniques. Setting up news alerts for AI security topics and following relevant researchers on professional platforms helps you stay current without requiring you to read everything.

Focus on durable defenses rather than AI-specific countermeasures. The specific AI techniques attackers use will change continuously, but the underlying objectives remain constant. Attackers want to manipulate people into taking harmful actions, gain unauthorized access to systems, and exfiltrate valuable data. Defenses that address these objectives directly are more durable than defenses tuned to specific AI-generated content patterns.

Verification procedures are among the most durable defenses against AI-powered social engineering. If your organization requires out-of-band verification for financial transactions, sensitive data requests, and access to critical systems regardless of how the request is delivered, AI-generated impersonation attacks become much less effective. The specific medium of the attack, whether voice clone, deepfake video, or AI-generated email, matters less when your procedures require verification anyway.

Update your mental model of what attacks look like. AI-powered attacks are more polished, more personalized, and more convincing than what most security training historically prepared people for. Security awareness training needs to evolve to reflect that you can no longer rely on poor grammar or implausible scenarios as reliable indicators of phishing or fraud.

Invest in threat intelligence specific to your sector. Attackers tend to develop and test AI-powered attack techniques against specific industries before generalizing them. Financial services organizations see AI fraud techniques before smaller organizations in other sectors. Following threat intelligence relevant to your industry gives you early warning of techniques that may not yet be widely discussed in general security media.

The goal is not to develop certainty about what is real and what is synthetic, because that certainty may not always be achievable. The goal is to build systems, procedures, and habits that produce good security outcomes regardless of whether a specific communication or piece of media is authentic or AI-generated.`);

// ── Password and Identity Management ─────────────────────────────────────────

umod(112, `Passwords have been the primary mechanism for authenticating identity online for decades, and they have been failing at that job for decades. Understanding why passwords fail so consistently is the foundation for building authentication systems and personal security habits that actually work.

The fundamental problem with passwords is that they exist at the intersection of two competing requirements. Passwords need to be hard for attackers to guess, which means they should be long, random, and unique. Passwords also need to be remembered by humans, which pushes people toward short, predictable, reused passwords. These two requirements are in direct conflict, and human memory consistently loses.

Password reuse is the most dangerous password behavior and also one of the most common. When you use the same password on multiple sites and one of those sites is breached, every account using that password is immediately at risk. Credential stuffing attacks automate the process of testing breached username and password combinations against hundreds of websites simultaneously. A single breach cascades into dozens of compromised accounts within hours.

Weak passwords are guessable through dictionary attacks that test common words, names, and patterns, and through brute force attacks that systematically test every possible combination. Despite decades of advice to the contrary, the most common passwords in breach databases are still variations of password, 123456, and similar trivially guessable strings. Password complexity requirements that require a mix of characters but allow short passwords are less effective than simply requiring length.

Password reset mechanisms are frequently the weakest link. Security questions with predictable answers, reset links sent to email accounts that may themselves be compromised, and SMS-based reset codes vulnerable to SIM swapping all create paths around even strong passwords.

Phishing attacks steal credentials directly by tricking users into entering them on fake sites. No password strength helps against phishing because the user willingly provides their credentials to the attacker. The password itself is irrelevant when the user hands it over.

Understanding these failure modes points toward solutions. Long unique randomly generated passwords stored in a password manager address the memorability problem. Multi-factor authentication provides protection even when passwords are stolen. Phishing-resistant authentication methods eliminate the credential theft attack entirely.`);

umod(113, `Strong password principles have evolved significantly as researchers have developed a better understanding of how attackers crack passwords and how humans actually behave. Modern guidance differs in important ways from older advice that focused on character complexity at the expense of length and memorability.

Length is the single most important factor in password strength. A longer password with a limited character set is generally stronger than a shorter password with maximum complexity. Every additional character multiplies the number of possible passwords an attacker must test to find yours. A 20-character password of random lowercase letters has more possible combinations than a shorter password using every character type.

Randomness matters as much as length. Human-chosen passwords are not random even when they appear to be. People use predictable patterns like starting with a capital letter, ending with a number or exclamation mark, substituting letters with visually similar numbers, and basing passwords on recognizable words or names. Attackers know these patterns and build them into their cracking tools. A truly random password is stronger than a longer but predictable one.

Passphrases offer a practical middle ground for passwords that must be remembered. A passphrase made of four or more random unrelated words is both memorable and extremely strong. The strength comes from length rather than complexity, and the randomness comes from the words being genuinely unrelated rather than forming a meaningful phrase the attacker might predict.

Uniqueness across accounts is non-negotiable. If you use the same password on multiple accounts and one account is breached, all accounts using that password are compromised. Every account should have its own unique password. This is only practical with a password manager.

Passwords should not be changed on a fixed schedule unless there is reason to believe they have been compromised. Frequent forced password changes without a specific reason cause people to make minimal changes like adding a number to an existing password, which is less secure than maintaining a strong password that is not being changed regularly.

Never use personal information in passwords. Birth dates, names, pet names, addresses, and similar information can be found through social media, data breaches, and public records, and are routinely incorporated into password cracking attacks targeted at specific individuals.`);

umod(114, `A password manager is the single most impactful tool most people can adopt to improve their personal security. It solves the fundamental tension between password strength and memorability by remembering passwords for you, eliminating the need to choose between strong unique passwords and passwords you can actually remember.

Password managers generate cryptographically random passwords of whatever length and character composition you specify. These passwords are strong by definition because they are genuinely random and not based on any pattern a human would choose. They are unique because the password manager generates a different one for every account. And they are stored encrypted so you never need to remember them.

The master password is the one password that protects your entire vault. Choose it carefully. It should be a long memorable passphrase that you have never used anywhere else and that you can remember without writing down. The master password is the only password you actually need to memorize. Everything else is handled by the password manager.

Most password managers include browser extensions that detect login forms on websites and automatically fill in the correct credentials. This auto-fill feature provides an additional security benefit beyond convenience. When a password manager auto-fills credentials, it matches the domain of the current page exactly. If you are on a phishing site that looks like your bank but has a slightly different domain, the password manager will not fill in your banking credentials because the domain does not match, effectively protecting you against some phishing attacks.

Password managers also enable password auditing features. They can identify passwords that have been reused across multiple accounts, passwords that are too weak or too old, and accounts whose passwords appear in known data breaches. These features turn periodic security reviews from a tedious manual process into an automated report.

Consider which password manager fits your needs. Some are cloud-based, syncing your vault across devices through an encrypted server. Some are local-only, storing your vault on your device without cloud sync. Cloud-based managers are more convenient for users with multiple devices. Local-only managers appeal to those who want to minimize trust in third-party servers. Both can be secure when used properly.

The risk of a compromised password manager vault is real but manageable. A strongly encrypted vault protected by a unique master password and MFA is extremely difficult to crack even if the encrypted data is obtained. The risk of using weak or reused passwords is far greater than the risk of using a well-configured password manager.`);

umod(115, `Multi-factor authentication requires presenting two or more independent forms of evidence to prove your identity before being granted access. The independence of these factors is what makes MFA effective. An attacker who steals your password has only one factor and still cannot access your account if a second independent factor is required.

The three categories of authentication factors are something you know, something you have, and something you are. Passwords and PINs are something you know. Authenticator apps, hardware security keys, and physical tokens are something you have. Biometrics like fingerprints and facial recognition are something you are. Strong MFA combines factors from different categories. A password plus an authenticator app combines something you know with something you have.

SMS text message codes are the most widely deployed MFA method and also the weakest. Text messages can be intercepted through SIM swapping attacks where an attacker convinces your carrier to transfer your phone number to a SIM card they control. SS7 protocol vulnerabilities allow interception of SMS messages at the network level. Despite these weaknesses, SMS MFA is dramatically better than no MFA and should be used when stronger options are not available.

Time-based one-time password authenticator apps generate codes on your device using a shared secret and the current time. The codes are generated locally without any network transmission, which eliminates the SIM swapping and SS7 interception vulnerabilities that affect SMS. Authenticator apps are significantly more secure than SMS and should be preferred whenever available.

Hardware security keys are the strongest commonly available MFA method. They use public key cryptography and are phishing-resistant by design. When you authenticate with a hardware key, it verifies that the domain you are authenticating to is the real domain, not a phishing site. This eliminates the credential phishing attack that defeats password plus authenticator app MFA.

Push notification MFA sends a notification to your phone asking you to approve a login. This method is vulnerable to MFA fatigue attacks where an attacker who has your password repeatedly sends approval requests hoping you will approve one out of confusion or frustration. Number-matching push MFA, which requires you to enter a number displayed on the login screen into the authenticator app, significantly reduces this risk.

Enable MFA on every account that supports it, prioritizing accounts that would have the most severe consequences if compromised. Email accounts, password managers, financial accounts, and work accounts all warrant maximum MFA strength.`);

umod(116, `Social engineering attacks targeting passwords are among the most effective because they bypass technical security controls entirely. Instead of cracking or stealing passwords through technical means, social engineers manipulate people into providing their credentials voluntarily. No password strength or complexity helps when the user hands the password to an attacker who asked nicely.

Phishing is the most common password-targeting social engineering attack. The attacker creates a convincing replica of a legitimate login page and directs victims to it through email links, SMS messages, or other means. When the victim enters their credentials, the attacker captures them. Modern phishing sites often proxy the real site in real time, immediately logging the victim into the real site after capturing their credentials so that nothing appears wrong and no suspicion is raised.

Pretexting builds a false scenario that makes a request for credentials seem legitimate. An attacker posing as IT support and calling to say they need your password to resolve a technical issue is pretexting. Attackers posing as HR to collect account information for a system migration, as vendors who need login details to perform integrations, or as security teams performing audits are all pretexting scenarios designed to elicit credentials.

Vishing, voice phishing, is used to gather credentials and other sensitive information through phone calls. Sophisticated vishing attacks use caller ID spoofing to make calls appear to come from legitimate numbers, use accurate personal information gathered from social media to build credibility, and create urgency that pressures targets to provide information before thinking critically.

Credential harvesting through fake customer support is a growing attack vector. Attackers monitor social media for people complaining about service issues and offer to help by asking them to verify their account by providing their credentials. The emotional state of a frustrated customer makes them more susceptible to this manipulation.

The defense against social engineering targeting passwords starts with the firm understanding that legitimate organizations never ask for your password. Help desks can reset passwords. IT teams can access systems through their own administrative accounts. No legitimate technical or security process requires you to share your password with another person. If someone asks for your password regardless of who they claim to be, the answer is always no.`);

umod(117, `Single sign-on systems allow users to authenticate once and access multiple applications without logging into each one separately. Identity providers are the systems that manage authentication and issue credentials that other applications trust. Understanding how SSO and identity providers work helps you use them safely and recognize when they may be targeted by attackers.

SSO works through a trusted relationship between an identity provider and service providers. When you try to access an application using SSO, the application redirects you to the identity provider for authentication. The identity provider verifies your identity and issues a token that tells the application you are authenticated. The application trusts this token because it trusts the identity provider. You never send your credentials directly to the application.

Common identity providers include corporate Active Directory systems federated through protocols like SAML or OIDC, consumer identity providers like Sign in with Google and Sign in with Apple, and purpose-built identity platforms. Each provides a different level of security and control.

The security concentration risk of SSO is its most important characteristic. When all your applications rely on a single identity provider for authentication, the security of the identity provider determines the security of all those applications. A compromised identity provider account provides access to every application that trusts it. This makes the identity provider account extraordinarily valuable to attackers and correspondingly important to protect with the strongest available security controls, including MFA.

Token theft is the primary attack against SSO systems. Rather than stealing credentials, attackers steal the authentication tokens that the identity provider issues. A stolen valid token can be used to access applications without any credentials at all. Token theft typically occurs through malware on the user's device, cross-site scripting vulnerabilities in applications, or man-in-the-middle attacks on insufficient HTTPS implementations.

Conditional access policies add additional validation to token-based authentication. Rather than accepting any valid token without question, conditional access evaluates additional signals like device health, network location, and behavior patterns before granting access. A valid token used from an unusual location or an unmanaged device may be challenged for additional verification.

SSO scope creep occurs when applications are connected to your identity provider over time and old connections are never removed. An application you connected years ago and no longer use may still have access through SSO. Periodically review which applications are connected to your identity provider and revoke access for any you no longer use.`);

umod(118, `Privileged access management addresses the security of accounts and credentials that have elevated permissions in an organization's systems. Administrator accounts, root access, database credentials, and service accounts with broad permissions are all privileged accounts. They are the most valuable targets for attackers and the most damaging when compromised.

The principle of least privilege applied to privileged access means that even administrators should only have the elevated access they need for specific tasks, and only when they need it. Permanent standing administrative access is unnecessary for most administrative tasks and represents persistent elevated risk. Just-in-time privileged access provides elevated permissions only when requested for a specific task and revokes them automatically when the task is complete or a time limit is reached.

Privileged access workstations are dedicated devices used exclusively for administrative tasks. Because administrative activities access the most sensitive systems, they warrant the most secure computing environment. Using a shared general-purpose workstation for administrative tasks means that any compromise of that workstation, through a phishing email or malicious download, immediately has access to administrative capabilities.

Session recording for privileged access provides an audit trail of everything done during administrative sessions. Video recordings of remote desktop sessions, keystroke logs, and command histories help detect malicious insider activity and provide evidence for investigations. The knowledge that sessions are recorded also deters insider misuse.

Credential vaulting stores privileged credentials in a secure vault rather than in the minds of individual administrators or in documents and spreadsheets. Vaulted credentials can be checked out for specific tasks, with the vault automatically rotating the credential after it is returned. This means that even if a credential is somehow captured during use, it will be invalidated shortly after.

Service account management is frequently neglected compared to human account management. Service accounts are non-human accounts used by applications and automated processes. They often have significant permissions and may never be reviewed or rotated. Attackers specifically target service accounts because they are frequently overpermissioned and under-monitored. Inventory all service accounts, apply least privilege, enable logging on service account activity, and rotate service account credentials regularly.`);

umod(119, `Account recovery mechanisms are the safety net for when users lose access to their accounts, but they are also a primary attack vector. If an attacker can trigger and complete your account recovery process, they gain access to your account without ever needing your password. Every account recovery option is a potential path for attackers to take over your account.

Email-based account recovery sends a reset link to a registered email address. This is secure only if the recovery email account is itself secure. If an attacker compromises your recovery email, they can use it to take over every account that uses it for recovery. Your recovery email account needs to be the most secure account you have, with a unique strong password and MFA enabled.

Security questions are a legacy account recovery mechanism that remain widely deployed despite being fundamentally insecure. The answers to common security questions like mother's maiden name, childhood pet, first school, and hometown are frequently discoverable through social media, public records, and data breaches. Using accurate answers to security questions provides minimal security. Using randomly generated false answers treated as passwords and stored in your password manager is the correct approach.

SMS-based recovery codes are vulnerable to SIM swapping, where an attacker transfers your phone number to a device they control by social engineering your carrier. With your phone number redirected, any SMS-based recovery process is compromised. For accounts with significant value, SMS should not be the sole recovery mechanism.

Backup codes are one-time use codes generated when you set up MFA that can be used to access your account if you lose your primary MFA device. These codes should be treated like extremely sensitive credentials. Store them in a secure location, ideally printed and kept physically secure or stored in your password manager. If backup codes are ever compromised, generate a new set immediately and invalidate the old ones.

Recovery phone numbers and alternate email addresses stored for account recovery purposes must be kept current. If the phone number or email address you registered for recovery years ago is no longer accessible to you, you may be permanently locked out of your account if you lose access through another means. Review and update recovery information annually.

Account recovery processes should be treated with the same skepticism as any other request that involves your credentials. Unsolicited messages claiming you need to verify your account or reset your password are phishing attacks. Initiate account recovery yourself by going directly to the service website rather than following links in unsolicited communications.`);

umod(120, `Identity theft occurs when someone uses your personal information without your consent to commit fraud or other crimes. Account takeover is a specific form of identity theft where attackers gain control of your existing accounts. Both can have severe financial and personal consequences that take months or years to fully resolve.

New account fraud uses your stolen personal information to open new accounts in your name. These accounts are used to borrow money, make purchases, or commit other crimes. The victim discovers the fraud when debt collectors call, when unusual accounts appear on credit reports, or when legitimate credit applications are denied due to fraudulent accounts opened in their name.

Account takeover uses stolen or guessed credentials to access your existing accounts. Once inside, attackers change contact information to prevent you from recovering the account, drain financial accounts, make unauthorized purchases, steal sensitive information, or use your account as a platform for further attacks. Email account takeover is particularly damaging because email is used for recovery of so many other accounts.

The warning signs of identity theft include unexpected bills or collection notices for accounts you did not open, unfamiliar accounts appearing on your credit reports, credit applications being denied unexpectedly, missing mail, receiving correspondence about benefits you did not apply for, and notification from a company that your information was involved in a breach.

Credit freezes are the most effective prevention against new account fraud. A credit freeze prevents lenders from accessing your credit report, which means they will not extend new credit in your name even if an attacker has your Social Security number and other personal information. Freezes are free, can be placed and lifted as needed, and do not affect your existing accounts or credit score.

Regular credit monitoring through AnnualCreditReport.com and credit monitoring services detects fraudulent accounts early. Review your credit reports at least annually and investigate any unfamiliar accounts or inquiries immediately. The earlier you detect identity theft, the easier it is to resolve.

If your identity is stolen, report it to the Federal Trade Commission at IdentityTheft.gov, which generates a personalized recovery plan. Place fraud alerts or freezes at all three credit bureaus. File a police report. Contact affected financial institutions directly. Document everything with dates and names of representatives you speak with.`);

umod(121, `Building a personal identity security system means putting in place the practices, tools, and habits that protect your accounts and personal information consistently over time. It is not a single action but an ongoing posture that becomes easier to maintain as the individual components become habits.

The foundation is a password manager. Start by choosing a reputable password manager and migrating your most important accounts to it first. Financial accounts, email accounts, and your primary work accounts should be migrated before lower-priority accounts. As you log into accounts over time, save each one to the password manager and have it generate a new strong unique password for that account. Over a few months you will have replaced most of your passwords without it feeling like a massive project.

Enable MFA on every account that supports it, starting with the highest-priority accounts. Your email account and password manager account are the most critical and should have the strongest available MFA. Work through your financial accounts, social media accounts, and other important accounts. Keep a record of your MFA setup and backup codes in a secure location.

Conduct a periodic account inventory. Set a calendar reminder every three to six months to review which accounts you have, which are still active, and which can be closed. Closed accounts cannot be breached. Dormant accounts with old passwords and no MFA are frequently compromised without the owner noticing.

Monitor your accounts for unauthorized activity. Enable login notifications on accounts that support them. Set up alerts on financial accounts for transactions above certain amounts. Check your credit reports at least annually. Use HaveIBeenPwned to check whether your email addresses have appeared in known data breaches.

Practice good digital hygiene around your personal information. Limit what you share on social media. Be thoughtful about which services you register with and what information they require. Use email aliases for services you do not trust with your primary email. Opt out of data broker profiles when possible.

Be skeptical of unexpected communications requesting account actions. Legitimate services do not send unsolicited messages asking you to verify your account, reset your password, or confirm your personal information by clicking a link. When in doubt, navigate directly to the service website rather than following any link.

Your personal identity security system does not need to be perfect on day one. Start with the highest impact actions, which are a password manager and MFA on your most important accounts, and build from there. Each improvement reduces your risk meaningfully.`);

console.log('\nAll 40 new section modules updated successfully.');
console.log('Verifying content lengths...');
const rows = db.prepare(`
  SELECT m.id, LENGTH(m.content) as len, m.title
  FROM modules m
  WHERE m.id BETWEEN 82 AND 121
  ORDER BY m.id
`).all();
rows.forEach(r => console.log(`${r.len} ${r.title}`));
