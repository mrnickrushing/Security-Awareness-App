const { db } = require('./src/db');

function update(title, content) {
  const result = db.prepare("UPDATE modules SET content=?, updated_at=datetime('now') WHERE title=?").run(content, title);
  console.log(result.changes > 0 ? 'Updated: ' + title : 'NOT FOUND: ' + title);
}

update('CT Module 1: Diagnosing a Slow PC', `A slow computer is one of the most common and frustrating technical problems, and diagnosing it correctly matters because the solution depends entirely on the cause. Blindly trying fixes wastes time and can sometimes make things worse. A systematic approach to diagnosis leads to faster, more reliable resolution.

Starting With Task Manager

Task Manager is your first diagnostic tool on Windows. Open it with Ctrl+Shift+Esc and click More Details if you see a simplified view. The Performance tab shows real-time CPU, memory, disk, and network usage. The Processes tab shows which specific programs are consuming resources.

High CPU usage that is sustained rather than brief spikes usually points to a specific program. Look for processes consuming more than 30 percent of CPU when you are not actively using them. Common culprits include antivirus scans running in the background, browser tabs with resource-heavy content, cryptocurrency mining malware, and runaway software bugs.

High memory usage causes slowness because Windows uses the disk as overflow memory when RAM is full, a process called paging that is dramatically slower than actual RAM. If memory usage is consistently above 80 to 90 percent, you either have too many programs open or insufficient RAM for your workload.

High disk usage often at 100 percent is a common cause of extreme slowness on computers with traditional hard drives. Windows Update downloading in the background, antivirus scans, and the Superfetch service are common causes.

Startup Programs

Too many programs starting automatically when Windows boots is one of the most common causes of slow performance. Open Task Manager, click the Startup tab, and review what is enabled. Many programs install startup entries that provide no benefit while consuming CPU, memory, and disk activity on every boot.

Disable startup entries for programs you do not use immediately on startup. When in doubt, search the process name before disabling it.

Disk Space and Temporary Files

Windows and applications create large amounts of temporary files over time. Run Disk Cleanup by searching for it in the Start menu. The System Files option includes Windows Update cleanup files that can consume significant space and are safe to remove once updates have been applied successfully.

Check available disk space on your primary drive. Windows needs free space to operate effectively, particularly for virtual memory. Less than 10 to 15 percent free space on the system drive causes performance problems.

The SSD vs HDD Factor

Traditional spinning hard drives are dramatically slower than solid state drives for the kind of random access operations that Windows constantly performs. If your computer has a hard drive and feels perpetually slow despite other optimizations, upgrading to an SSD is often the single most impactful improvement available.

Hard drives that are failing also cause significant performance problems as the drive retries reading bad sectors. Check drive health using CrystalDiskInfo, which reads the drive's own health indicators and reports warning or failing status.

Malware and Thermal Throttling

Malware frequently consumes significant system resources. Cryptocurrency miners use CPU and GPU. Botnets use CPU, memory, network bandwidth, and disk. If basic optimization does not resolve slowness and Task Manager shows high resource usage by unfamiliar processes, run a thorough malware scan.

Modern processors automatically reduce their speed when temperatures exceed safe limits, called thermal throttling. A computer that is slow only under load and feels fine for light tasks may be throttling due to overheating. Monitor temperatures using HWMonitor and clean dust from vents and heatsinks if temperatures are high.

The Systematic Approach

When diagnosing slow performance, work through causes in order of likelihood. Start with Task Manager to identify resource consumption, review startup programs, check disk space and health, consider thermal issues, scan for malware, and evaluate hardware limitations last. This methodical approach leads to correct diagnoses far more reliably than trying random fixes.`);

update('CT Module 2: Blue Screen of Death Recovery', `The Blue Screen of Death, or BSOD, is Windows saying something has gone so wrong that continuing to operate risks damaging your data or hardware. Rather than proceeding in an unstable state, Windows stops everything and displays diagnostic information. Understanding what causes BSODs and how to diagnose them removes much of the fear and mystery from these crashes.

Reading the Stop Code

Modern BSODs display a stop code that identifies the type of failure. Common stop codes include CRITICAL_PROCESS_DIED, MEMORY_MANAGEMENT, IRQL_NOT_LESS_OR_EQUAL, and SYSTEM_SERVICE_EXCEPTION. These codes are searchable and each points toward specific categories of causes.

Write down or photograph the stop code before the computer restarts. If Windows restarts automatically before you can read it, find crash information in the Event Viewer under Windows Logs, System, and look for Error level events around the time of the crash.

Common Causes

Driver failures are the most common cause. A driver is software that allows Windows to communicate with a hardware component. Outdated, corrupted, or incompatible drivers cause the kind of instability that triggers a BSOD. Newly installed drivers are a common trigger for BSODs that begin appearing after a system change.

RAM failures cause some of the most difficult to diagnose BSODs because memory errors are intermittent and affect different operations each time. MEMORY_MANAGEMENT and similar codes often point toward RAM issues.

Storage failures create BSODs when Windows cannot read critical files it needs to operate. This can happen as a hard drive begins failing.

Overheating causes sudden crashes that may manifest as BSODs when the system becomes unstable under thermal stress.

Corrupted system files, sometimes caused by failed updates, power interruptions during writes, or storage issues, prevent Windows from loading required components.

Diagnostic Steps

Run Windows Memory Diagnostic by searching for it in the Start menu. This tests your RAM for errors. Run the extended test for more thorough results.

Run System File Checker by opening a command prompt as administrator and typing sfc /scannow. This checks protected Windows system files for corruption and repairs them from a cached copy.

Use the Deployment Image Servicing and Management tool with the command DISM /Online /Cleanup-Image /RestoreHealth to repair the Windows image that SFC uses as its source, then run SFC again. Run DISM first, then SFC, in that order.

Check the Event Viewer for errors in the period leading up to the crash. Critical and Error events in the System and Application logs often provide additional context about what was happening before the crash.

Use WhoCrashed or WinDbg to analyze the memory dump file that Windows creates during a BSOD. These tools identify the specific driver or component responsible for the crash, which is far more useful than the stop code alone.

Driver-Related BSODs

If the BSOD began after a driver or Windows update, roll back that specific update. For driver rollbacks, go to Device Manager, find the relevant device, go to Properties, Driver tab, and click Roll Back Driver if available.

Update drivers directly from the manufacturer website rather than using third-party driver update tools, which frequently install incorrect or problematic versions.

For graphics drivers specifically, the Display Driver Uninstaller tool run in safe mode completely removes all traces of a graphics driver before installing a new version, resolving conflicts caused by incomplete uninstallation.

When to Seek Professional Help

BSODs that appear during the boot process require the Windows Recovery Environment, which offers system restore, startup repair, and command prompt access without booting into the full operating system.

If multiple hardware diagnostic tools indicate hardware failure, particularly in RAM or storage, replacement is the appropriate next step. Continuing to operate on failing hardware risks data loss.`);

update('CT Module 3: Wi-Fi and Network Troubleshooting', `Network problems can range from no connectivity to slow speeds or intermittent drops. A methodical approach that isolates variables is far more effective than random troubleshooting steps.

Establishing the Scope of the Problem

The first diagnostic question is whether the problem affects one device or all devices. Test another device on the same network. If the second device has the same problem, the issue is with the network or internet connection, not the first device. If the second device works fine, the problem is specific to the first device.

The second question is whether the problem is complete loss of connectivity, intermittent connectivity, or connectivity that works but is slow.

The third question is whether the problem is with all internet access or only specific services or websites.

These three questions eliminate large categories of potential causes and focus troubleshooting effort efficiently.

Basic Connectivity Troubleshooting

On Windows, open a command prompt as administrator and run ipconfig /release followed by ipconfig /renew. This releases and renews your IP address assignment from the router.

Run ipconfig /flushdns to clear the local DNS cache. Corrupted or stale DNS entries cause connection failures for specific sites even when your internet connection is working.

Check that airplane mode is not enabled. On laptops, function keys or physical switches can accidentally enable airplane mode.

Run the built-in network troubleshooter through Settings, Network and Internet, Status, Network Troubleshooter.

Router and Modem Issues

Restart the router and modem by unplugging them from power, waiting 30 seconds, plugging the modem in first, waiting for it to fully connect, then plugging in the router. This clears temporary states and re-establishes the upstream connection.

Check the router's admin interface for status information. Most home routers are accessible at 192.168.1.1 or 192.168.0.1 from a browser on the local network. Look for WAN status indicating whether the router has a working internet connection.

Check for service outages with your ISP. Most ISPs have outage maps or status pages.

Device-Specific Network Problems

If the problem is isolated to one device, check the network adapter driver in Device Manager. A yellow exclamation mark indicates a driver problem. Try updating or reinstalling the driver.

Reset the network stack on Windows by running these commands in an elevated command prompt: netsh winsock reset, netsh int ip reset, ipconfig /flushdns. Restart the computer after running these commands.

Check if a VPN or proxy is interfering with normal connectivity. Disable any VPN software temporarily to test.

Diagnosing Slow Wi-Fi

Check signal strength. Wi-Fi signal weakens with distance and physical obstructions. Moving closer to the router often resolves slow performance.

Check for channel congestion from nearby networks. In dense environments with many nearby networks, channel congestion causes performance problems. Wi-Fi analyzers show what channels neighbors are using, allowing you to select a less congested channel in your router settings.

The 5 GHz band provides faster speeds but shorter range than the 2.4 GHz band. If your device is far from the router, the 2.4 GHz band may provide more reliable connectivity even if it is slower at close range.

Test your actual internet speed using speedtest.net while connected via ethernet directly to your router. This establishes a baseline and tells you whether the problem is your Wi-Fi connection or your internet service.

DNS Issues

DNS translates domain names into IP addresses. DNS failures cause problems connecting to websites even when your internet connection is working. Symptoms include being able to ping IP addresses but not load websites by name.

Try using an alternative DNS server by changing your network adapter's DNS settings to use 8.8.8.8 and 8.8.4.4, which are Google's public DNS servers, to rule out ISP DNS problems.

Intermittent Connection Problems

Intermittent problems are the most challenging to diagnose because the problem may not be present when you are actively investigating it. Use ping with a continuous option to a reliable destination to monitor for packet loss over time.

Consider whether the problem correlates with specific times of day, specific applications, or specific locations in your space. Patterns suggest specific causes.

Hardware failures in network adapters, ethernet cables, or routers cause intermittent connectivity problems. Try a different ethernet cable if using wired connectivity.`);

update('CT Module 4: Driver Problems and Updates', `Drivers are the software layer that allows your operating system to communicate with hardware components. They translate generic operating system commands into the specific signals and protocols that each piece of hardware understands. When drivers malfunction, the consequences range from minor performance issues to complete device failure to system crashes.

Understanding What Drivers Do

Every piece of hardware in your computer requires a driver: the graphics card, network adapters, audio hardware, USB controllers, input devices, and dozens of other components. The operating system ships with generic drivers for common hardware and Windows Update provides driver updates for many devices, but manufacturers often release specialized drivers through their own channels that provide better performance and additional features.

When drivers fail, you experience the specific failure mode of whatever that driver controls. A failed graphics driver causes display problems or crashes. A failed network driver causes connectivity problems. A failed storage driver can cause data access issues.

Identifying Driver Problems

Device Manager is the primary tool for identifying driver issues. Access it by right-clicking the Start button or searching for it. Devices with driver problems show a yellow triangle with an exclamation mark or a downward arrow indicating a disabled device.

Right-clicking a problematic device and selecting Properties shows error codes and descriptions that identify the specific problem. Common error codes include Code 10 meaning the device cannot start, Code 43 meaning driver stopped responding, and Code 28 meaning driver not installed.

Check the Event Viewer for driver-related errors in the System log. Filter for Warning and Error level events and look for entries from sources that include the hardware type or driver name.

Updating Drivers Correctly

The manufacturer's website is the correct source for driver updates. Search for your specific hardware model and find the support or downloads section. For graphics cards, go to AMD or NVIDIA directly. For motherboard components like network adapters and audio, go to the motherboard manufacturer's website. For laptops, the laptop manufacturer's support site often provides all drivers in one place.

Avoid third-party driver update utilities. These tools frequently install incorrect driver versions, bundle unwanted software, and have been known to install malware alongside drivers.

Before updating a driver that is currently working, consider whether the update addresses a problem you are experiencing. If the current driver is stable and functional, there is often no need to update.

Rolling Back Problematic Drivers

When a driver update causes new problems, rolling back to the previous version is often the fastest fix. In Device Manager, right-click the device, select Properties, go to the Driver tab, and click Roll Back Driver if available. This option is only available if Windows has retained the previous driver version.

For graphics drivers specifically, the Display Driver Uninstaller tool run in safe mode completely removes all traces of a graphics driver before installing a new version, resolving conflicts caused by incomplete uninstallation.

Safe Mode for Driver Troubleshooting

If a driver update causes the system to become unbootable or unstable, safe mode loads Windows with only the minimum required drivers. This allows you to roll back or uninstall the problematic driver.

Access safe mode by holding Shift while clicking Restart from the Start menu, or by interrupting the boot process three times to trigger automatic recovery mode, then selecting Startup Settings and the appropriate safe mode option.

Common Driver Scenarios

Graphics driver problems manifest as screen artifacts, display corruption, application crashes particularly in games, and BSODs with codes pointing to graphics components. Update to the latest stable driver from the GPU manufacturer, or roll back if the issue began after an update.

Network driver problems cause connectivity failures, slow speeds, or intermittent drops. Check Device Manager for errors, update the driver from the manufacturer, and consider whether the issue correlates with a recent Windows Update.

Audio driver problems result in no sound, crackling, or distortion. The Realtek HD Audio driver is common on consumer systems and updates are available through the Realtek website or your motherboard manufacturer.`);

update('CT Module 5: Storage and Disk Space Issues', `Storage management affects system performance, stability, and your ability to save new files and install updates. A full or failing storage drive creates cascading problems that can make a computer nearly unusable.

How Storage Affects Performance

Windows uses available disk space as virtual memory when physical RAM fills up. This paging process reads and writes to the disk constantly during memory-intensive work, and a full drive with no space for the page file creates severe performance problems.

Windows and applications create temporary files constantly. These include browser caches, Windows Update downloads, installer files, application logs, and system restore points. Without regular cleanup, these accumulate and consume significant space.

Fragmentation affects traditional hard drives where files get broken into pieces scattered across the disk. The drive head must travel to multiple locations to read a single file, slowing access. SSDs do not suffer from fragmentation in the same way and should not be defragmented.

Checking Storage Health and Space

Open File Explorer and right-click your primary drive to check available space. Less than 10 to 15 percent free space on the system drive causes performance issues.

Windows 11 has a built-in Storage page in Settings that shows storage usage by category and automates cleanup of temporary files.

Check drive health using CrystalDiskInfo, a free tool that reads the SMART data drives report about their own health. Look for the overall health assessment and specifically for Reallocated Sectors Count, Pending Sectors, and Uncorrectable Sector Count, which indicate developing drive problems. A Caution or Bad status means you should back up data immediately and plan for drive replacement.

Identifying Large Space Consumers

WinDirStat and TreeSize Free are tools that visualize disk usage as a treemap, making it easy to see exactly which files and folders consume the most space.

Common large space consumers include the Windows.old folder created after Windows upgrades, the hibernate file hiberfil.sys which is the same size as your RAM, old system restore points, and application caches particularly for video editing software, browsers, and game launchers.

Cleaning Up Safely

Disk Cleanup accessed by right-clicking the drive and selecting Properties provides a safe list of file types that can be removed. The Clean up system files option adds additional categories including Windows Update cleanup files.

Manually review the Downloads folder for installer files and other downloads that are no longer needed. This folder often contains gigabytes of files from software installations over the years.

Uninstall applications you no longer use through Settings, Apps. Empty the Recycle Bin regularly.

Moving Data to External Storage or Cloud

External drives provide additional storage for large files like videos, photos, and archives. Move infrequently accessed large files to free space on the primary drive.

Cloud storage services integrated into File Explorer through OneDrive allow files to be stored primarily in the cloud while appearing in File Explorer. Files on demand lets you see files without them consuming local disk space until you open them.

Recognizing a Failing Drive

Clicking or grinding sounds from a traditional hard drive indicate physical media failure. Back up data immediately and replace the drive.

Frequent crashes, very slow file operations, files that become corrupted, and the operating system reporting disk errors in Event Viewer all suggest a failing drive.

If CrystalDiskInfo shows a Caution or Bad status, treat the drive as failing and prioritize data backup immediately. Drive failures can be sudden and complete, leaving no time to recover data after the fact.`);

update('CT Module 6: Browser Problems and Resets', `Web browsers are complex applications that accumulate data, extensions, and configuration changes over time. Browser performance degrades, settings get changed by installed software, and malicious extensions create security and privacy problems. Knowing how to diagnose and fix browser issues restores performance and removes potentially harmful software.

Understanding Browser Problems

Browsers accumulate several types of stored data over time. The cache stores copies of website resources so pages load faster on repeat visits. Cookies store session information, preferences, and tracking data. Browser history, saved passwords, and autofill data also accumulate.

Extensions add functionality to browsers but also add code that runs on every page you visit. Extensions can slow browser performance, inject content into websites, track your browsing, and in malicious cases steal passwords and financial information.

Browser hijackers change your homepage, new tab page, or default search engine to redirect your searches. They arrive through bundled software installers where a pre-selected checkbox installs the hijacker alongside legitimate software.

Diagnosing Browser Performance

Open Task Manager while the browser is running and look for how much CPU and memory it is consuming. Modern browsers can consume significant RAM with many tabs open.

Check for resource-heavy browser extensions by opening the browser's task manager. In Chrome, it is accessible through the More Tools menu. This shows memory and CPU usage per tab and extension, identifying the specific source of resource consumption.

Test browser performance in a private or incognito window with extensions disabled. If the browser performs significantly better without extensions, an extension is causing the problem.

Clearing Cache and Cookies

In Chrome, access this through Settings, Privacy and Security, Clear Browsing Data. Check Cached Images and Files. Clearing the cache resolves problems with websites that look outdated, display incorrectly, or have persistent errors from cached bad data.

Clearing cookies solves problems caused by corrupted session data and helps when a website is behaving oddly despite correct credentials. The downside is losing saved login sessions for all sites.

Managing Extensions

Review installed extensions and remove any you do not use or did not intentionally install. In Chrome, access extensions through the three-dot menu, More Tools, Extensions. In Firefox, through the menu, Add-ons and Themes.

Look for extensions with vague names, extensions you do not remember installing, extensions with broad permissions like access to all website data, and extensions with poor reviews. These warrant removal.

Install extensions only from official extension stores and only from developers with established reputations.

Removing Browser Hijackers

Check your homepage and new tab settings in browser settings and revert anything that was modified without your consent.

Check your default search engine in browser settings and revert it to your preferred choice.

Malicious changes to browser settings sometimes come from installed programs rather than extensions. Check installed programs in Windows Settings for anything unfamiliar and uninstall it.

Run a scan with Malwarebytes, which specifically targets browser hijackers and potentially unwanted programs that general antivirus sometimes misses.

Some persistent hijackers modify browser shortcuts to add arguments that set a specific homepage. Right-click the browser shortcut, select Properties, and check the Target field for any additional text after the browser executable path.

Resetting the Browser

A browser reset returns all settings to default and removes extensions while keeping bookmarks and passwords in some browsers. In Chrome, go to Settings, scroll down to Reset and Clean Up, and select Restore Settings to Their Original Defaults. In Firefox, this is called Refresh Firefox and is accessible through the Help menu, More Troubleshooting Information.

After a reset, selectively reinstall only extensions you need and trust. Do not restore an extension backup that may include the problematic extensions.`);

update('CT Module 7: Software Installation and Removal', `Installing and removing software seems straightforward but doing it incorrectly introduces security risks, creates system instability, and leaves behind unwanted remnants. Understanding best practices for software lifecycle management keeps systems clean, secure, and stable.

Safe Software Sourcing

The source of software is one of the most important security considerations. Software from unofficial sources frequently contains malware bundled with the application. Attackers specifically target popular free software, create lookalike download sites, and distribute their malicious versions through search engine results.

Always download software from the official developer website or from well-known reputable repositories. For Windows software, common legitimate sources include the Microsoft Store, the developer's official website, and established repositories like GitHub for open source software.

Be cautious about search results for software. Search for free PDF editor and the first several results may include malicious lookalike sites designed to distribute malware under the guise of the software you are searching for. Bookmark official websites of software you use regularly.

Verify software before installing it when the source is uncertain. Compare the file hash provided on the official download page against the hash of the file you downloaded using the CertUtil command. Hash mismatches indicate the file has been modified.

The Installation Process

Read installation screens carefully rather than clicking Next through every step. Bundled software, toolbars, browser homepage changers, and other potentially unwanted programs hide in installation screens with pre-selected checkboxes. Unchecking these boxes prevents unwanted additions.

Choose the Custom or Advanced installation option when available. Express or Quick installations often install all bundled software without showing you the individual checkboxes.

Avoid installing software you do not have a clear reason to use. Each installed application is a potential attack surface and a potential performance impact.

User Account Control prompts appear when software requires administrator privileges to install. You should only grant administrator access to software you intended to install. If UAC prompts appear unexpectedly, investigate before approving.

Proper Software Removal

Uninstall software through official channels rather than simply deleting its folder. Proper uninstallation removes registry entries, system files, startup entries, and other components that the installer placed throughout the system. Simply deleting the program folder leaves all of these behind.

In Windows 11, go to Settings, Apps, and find the application in the list to uninstall it. Some applications have their own uninstallers in the application folder or in the Start menu. Use these when available as they are typically more thorough.

For applications that leave significant remnants after standard uninstallation, tools like Revo Uninstaller scan for and remove leftover files and registry entries after the standard uninstaller runs.

Managing Software Overhead

Review your installed applications periodically and remove software you no longer use. Unused software consumes disk space, may run background processes that consume CPU and memory, may install startup entries that slow boot time, and represents security risk through unpatched vulnerabilities in software you are not monitoring.

Use Task Manager's startup tab and check the list of startup programs after installation of new software. Many applications add themselves to startup without asking.

Keeping Software Updated

Outdated software is one of the most common attack vectors. Maintain updates for your operating system, browser, office suite, PDF reader, and any other applications that process content from untrusted sources.

Enable automatic updates where available. For software without automatic updates, periodically check for updates through the application's Help or About menu.`);

update('CT Module 8: Printer and Peripheral Troubleshooting', `Printers are widely regarded as the most frustrating category of computer peripherals. The combination of hardware, drivers, network connectivity, software, and the print spooler service creates many potential failure points. A systematic approach to printer troubleshooting resolves most issues efficiently.

Understanding the Print Process

When you print, the application formats the document and sends it to the print spooler, which is a Windows service that manages the print queue. The spooler sends jobs to the printer driver, which translates them into the specific language the printer understands. The printer receives this data and executes the print job.

Problems can occur at any of these points: the application failing to generate the print job, the spooler becoming stuck or crashing, the driver translating incorrectly, the connection between computer and printer, or the printer itself.

Basic Connectivity Checks

Verify that the printer is powered on, has paper, has ink or toner, and shows no error lights or messages on its own display.

Check the connection. For USB printers, try a different USB port and a different cable. For network printers, verify the printer's network connection is active. Most network printers have a status page accessible through a web browser at the printer's IP address.

The Dreaded Print Spooler

A stuck print spooler is one of the most common causes of printing failures. To clear it, open Services in the Start menu, find Print Spooler, right-click it and select Stop. Navigate to C:\Windows\System32\spool\PRINTERS and delete all files in that folder while leaving the folder itself. Return to Services, find Print Spooler, right-click and select Start. Return to your application and try printing again.

This procedure clears stuck print jobs and resets the spooler to a clean state. It is the single most effective fix for the most common printing problems.

Driver Issues

Printer drivers are frequent culprits in printing problems. Symptoms include garbled output, incorrect formatting, inability to access printer settings, and errors when printing from specific applications.

Remove the existing printer driver through Settings, Bluetooth and Devices, Printers and Scanners. Select the printer and click Remove. Then download the current driver directly from the printer manufacturer's website and install it fresh.

For network printers, use the full driver package from the manufacturer rather than the generic Windows printer class driver. The full package includes additional utilities and more complete functionality.

Network Printer Discovery

Network printers occasionally lose their IP addresses if configured to receive addresses dynamically from DHCP. Assign a static IP address to the printer through the printer's own network settings or through your router's DHCP reservation feature.

When adding a network printer that is not automatically discovered, add it manually using Add Printer, specify the IP address, and choose the TCP/IP port type.

Test Printing and Isolation

Most printers have a built-in self-test page accessible through a combination of buttons without needing to be connected to a computer. Print this test page to verify the printer hardware is functioning independently of any computer connection.

Print from a different application to determine whether the problem is application-specific. A document that fails to print from Microsoft Word might print from Notepad, indicating the problem is with the application's interaction with the driver rather than the printer itself.

USB and Wireless Peripherals

For USB peripherals that are not recognized, try a different USB port, a different USB cable, connecting directly to the computer rather than through a hub, and uninstalling the device in Device Manager before reconnecting.

Wireless keyboards and mice experience range issues, battery depletion, and interference from other wireless devices. Replace batteries first as this resolves a surprising number of intermittent wireless peripheral problems.

Bluetooth devices require the Bluetooth adapter to be working correctly and the device to be paired. Removing and re-pairing a Bluetooth device that is behaving erratically often resolves the issue.`);

update('CT Module 9: Windows Update Problems', `Windows Updates are critical for security and stability but are also a source of frustration when they fail, get stuck, or cause new problems after installation. Understanding the Windows Update mechanism, common failure modes, and resolution approaches makes update management far less stressful.

Why Windows Updates Matter

Microsoft releases security updates monthly on Patch Tuesday, with emergency out-of-band updates for critical vulnerabilities that are actively being exploited. These updates close security holes that attackers specifically target in the period between discovery and patching.

Falling significantly behind on updates increases risk substantially. Attackers specifically target widely-known unpatched vulnerabilities because they know large numbers of systems remain vulnerable long after patches are available.

Common Update Failure Scenarios

Updates stuck at a percentage: Some updates take significant time to install, particularly feature updates. Wait 30 to 60 minutes before assuming a problem. However, a progress bar showing no change for more than an hour usually indicates an actual problem.

Error codes: Windows Update shows error codes when updates fail. Codes like 0x80070005 indicate permissions or corrupted file problems. Code 0x80073712 indicates corrupted update files. Search for specific error codes to find targeted solutions.

Boot loops after updates: Windows should automatically detect this after several failed boot attempts and enter the recovery environment.

The Windows Update Troubleshooter

The built-in Windows Update Troubleshooter detects and fixes many common problems automatically. Access it through Settings, System, Troubleshoot, Other Troubleshooters, Windows Update. Let it run, apply any fixes it suggests, then restart and try updating again.

Repairing the Windows Update Components

More persistent update failures require repairing the update components themselves. Open an elevated command prompt and run these commands in sequence to stop the relevant services, then rename the update cache folders to force them to be recreated, then restart the services.

Stop services: net stop wuauserv, net stop cryptSvc, net stop bits, net stop msiserver

Rename cache folders: ren C:\Windows\SoftwareDistribution SoftwareDistribution.old, ren C:\Windows\System32\catroot2 Catroot2.old

Start services: net start wuauserv, net start cryptSvc, net start bits, net start msiserver

This forces Windows Update to recreate its cache from scratch, resolving most problems caused by corrupted update components.

Using DISM and SFC

Run DISM first: DISM /Online /Cleanup-Image /RestoreHealth to repair the Windows Component Store.

Then run: sfc /scannow to check and repair protected system files.

Restart after both complete, then try updating again. Always run DISM before SFC so that SFC has a healthy component store to reference when replacing corrupted files.

Problematic Updates

If a recent update caused instability, go to Settings, Windows Update, View Update History, Uninstall Updates and find the problematic update by date.

Feature Updates vs Quality Updates

Cumulative quality updates are monthly security and bug fix packages that are important to install promptly.

Feature updates that upgrade Windows to a new version are larger changes that occasionally cause compatibility problems. It is reasonable to wait a few weeks after a feature update's release to let early adopters identify issues before installing it.

When to Seek Additional Help

If Windows Update remains broken after all standard troubleshooting, the Windows Media Creation Tool can repair or reinstall Windows while preserving personal files and applications.`);

update('CT Module 10: Data Backup and Recovery', `Data backup is the single most important data protection measure available to any user. No security software, no careful habits, and no hardware quality can completely eliminate the risk of data loss. Hardware fails. Ransomware encrypts. Accidental deletion happens. The only protection against data loss is having recent copies stored somewhere unaffected by the event that caused the loss.

The 3-2-1 Backup Rule

The 3-2-1 backup rule is the foundational principle of backup strategy. Keep three copies of your data, on two different types of media, with one copy offsite or in the cloud.

Three copies means the original plus two backups. This redundancy ensures that even if one backup fails to restore correctly, you have another option.

Two different media types means not storing all copies on the same type of storage. Three copies on three external hard drives attached to the same computer provides much less protection than copies on a local drive, an external drive, and in cloud storage.

One copy offsite means a backup stored in a different physical location from your primary data. This protects against physical disasters like fire, flood, and theft. Cloud storage fulfills the offsite requirement.

Backup Methods

File backup copies specific files and folders on a schedule. Windows Backup can back up the Documents, Desktop, Pictures, and other key folders to OneDrive automatically. Third-party tools like Macrium Reflect Free provide more comprehensive options.

System image backup captures an exact snapshot of the entire drive including Windows, applications, and all files. This allows complete recovery from a total drive failure.

Cloud backup continuously or frequently uploads files to cloud storage, providing the offsite copy with minimal effort. Backblaze Personal Backup and IDrive are dedicated cloud backup services.

Versioning is an important backup feature that retains multiple versions of files over time. Without versioning, if ransomware encrypts files before the next backup runs, the corrupt or encrypted file overwrites the last good backup. Versioning keeps previous versions so you can recover the last known good state.

Testing Backups

A backup that has never been tested is not a backup, it is a hope. Regularly verify that your backups can actually be restored.

For file backups, periodically restore a random selection of files to verify they restore correctly and the data is intact.

The discovery that a backup is unusable during a recovery attempt is one of the most devastating scenarios in data management. Test your backups before you need them.

Recovery Scenarios and Approaches

Accidental file deletion: Check the Recycle Bin first. For files not there, Windows File History may have previous versions accessible by right-clicking a folder and selecting Properties, Previous Versions. Cloud services with versioning can also recover deleted files.

Drive failure: Replace the drive, then restore from your most recent system image backup.

Ransomware: Restore from a backup made before the encryption occurred. This is why offline or cloud backups that ransomware cannot reach are essential. Backups on drives attached to the encrypted computer at the time of infection may also be encrypted.

Backup Scheduling and Automation

Backups that rely on manual execution are unreliable because they depend on consistently remembering to perform them. Automated scheduled backups happen whether you remember or not.

Set file backups to run daily for active work, and system image backups to run weekly or after significant changes like software installations.

Check backup completion notifications to verify backups are running successfully. Silent backup failures leave you with false confidence.`);

update('CT Module 11: Overheating and Cooling Issues', `Modern processors and graphics cards generate substantial heat, and managing that heat is essential for reliable operation. When temperatures exceed design limits, hardware protects itself by reducing performance, which causes slowness and instability. Sustained overheating damages components and shortens hardware lifespan.

Why Overheating Happens

Processors and graphics cards generate heat proportional to their workload. Under heavy load, a modern CPU can consume over 100 watts, all of which becomes heat that must be dissipated. Cooling systems including heat sinks, fans, and thermal paste are sized to handle the expected heat output under typical operating conditions.

Dust accumulation is the most common cause of overheating in older systems. Dust acts as thermal insulation in heat sinks and reduces airflow by clogging fan blades. A system that worked fine for years and starts overheating has usually accumulated enough dust to meaningfully impair cooling efficiency.

Thermal paste dries out over years, losing its ability to transfer heat from the processor to the heatsink. This is most relevant in laptops, which have small heatsinks and minimal thermal mass. Reapplying thermal paste often dramatically reduces temperatures in older laptops.

Fan failure allows heat to build up rapidly. Fan bearings wear over time, causing noise before eventual failure. Monitoring software that reports fan speeds can detect a failing fan before it causes problems.

Temperature Monitoring

Install HWMonitor or HWiNFO to monitor temperatures in real time. These tools read temperature sensors throughout the system including the CPU, GPU, storage drives, and motherboard.

Normal CPU temperatures at idle are typically 30 to 50 degrees Celsius. Under full load, 70 to 85 degrees Celsius is normal for many modern processors. Temperatures consistently above 90 degrees Celsius under load indicate a thermal problem. Temperatures above 100 degrees Celsius trigger emergency throttling or shutdown.

Normal GPU temperatures under load range from 70 to 85 degrees Celsius for most graphics cards.

Cleaning Dust

For desktops, cleaning should be performed annually or more frequently if the computer is in a dusty environment. Use compressed air to blow dust out of heat sinks, fan blades, and case vents. Hold fan blades still while using compressed air to prevent bearing damage from overspinning.

Avoid vacuum cleaners, which can generate static electricity and physically damage components.

Laptops accumulate dust in their heat sink and fan assembly. Some laptops can be opened relatively easily for cleaning. The laptop manufacturer's service manual describes the process.

Thermal Paste Application

Replacing thermal paste involves removing the heatsink, cleaning the old paste from both the processor and heatsink using isopropyl alcohol and lint-free material, applying a small amount of new thermal paste, and reinstalling the heatsink with proper pressure.

This procedure can reduce temperatures by 10 to 20 degrees Celsius in older systems where the original paste has dried, representing a significant improvement in thermal performance.

Improving Case Airflow for Desktops

Review the placement and direction of all case fans. Front and bottom fans should intake cool air, rear and top fans should exhaust hot air.

Ensure all PCIe slot covers are installed at the rear of the case. Open slots disrupt airflow patterns.

Cable management improves airflow by preventing cables from blocking the path of air through the case.

Laptops and Cooling

Laptop cooling is designed for use on flat hard surfaces that allow intake vents to function. Using a laptop on soft surfaces like beds, couches, and cushions blocks bottom intake vents and causes overheating.

Laptop cooling pads provide additional airflow for the bottom intake vents. For laptops that run consistently hot, a cooling pad can measurably reduce temperatures.`);

update('AH Module 1: Setting Up a Firewall', `A firewall is one of the most fundamental network security tools, acting as a barrier between your device or network and untrusted external networks. Understanding what firewalls do, their limitations, and how to configure them properly is foundational to network defense.

What a Firewall Actually Does

A firewall examines network traffic and makes decisions about whether to allow or block it based on rules you define. These decisions can be based on the source and destination IP addresses, the network ports being used, the protocol type, the application generating the traffic, or the state of the connection.

Firewalls protect against unauthorized inbound connection attempts from the internet or other networks. When properly configured, they ensure that only traffic you specifically expect and want reaches your device or network.

Without a firewall, every networked service running on your computer is potentially accessible to anyone who can reach it over the network, including services that are running without your knowledge as background components.

Windows Firewall in Depth

Windows Defender Firewall is included in Windows 10 and 11 and provides solid baseline protection. It is enabled by default and blocks most unsolicited inbound connections automatically.

The Windows Firewall with Advanced Security snap-in provides detailed control over both inbound and outbound rules. Here you can create rules that allow or block specific applications, specific ports, specific IP addresses, or combinations of these factors.

The three network profiles, Domain, Private, and Public, allow different rule sets depending on what type of network you are connected to. The Public profile is most restrictive and should always be active when connected to public Wi-Fi.

Check that Windows Firewall is enabled by going to Windows Security, Firewall and Network Protection. All three network profiles should show as On.

Inbound vs Outbound Rules

Inbound rules control what network traffic is allowed to reach your computer from outside. The default position for all inbound traffic should be block unless a rule specifically allows it. Windows Firewall works this way by default.

Outbound rules control what your computer is allowed to send to the network. Most firewalls allow all outbound traffic by default. This is a conscious design choice for usability, since blocking outbound traffic requires rules for every legitimate application.

For higher security environments, restricting outbound traffic to only expected applications and destinations limits the damage from malware infections. Malware that cannot make outbound connections cannot exfiltrate data or communicate with command and control servers.

Router Firewalls

Home routers perform basic stateful packet inspection that blocks unsolicited inbound connections from the internet. This means that your devices at home are generally protected from direct internet attacks even if their own software firewalls were disabled, because the router firewall blocks the traffic before it reaches them.

However, this protection does not extend to threats from other devices on the same local network, which is why device-level firewalls remain important even behind a router.

Review router firewall settings in the router admin interface. Port forwarding rules created by old applications that are no longer needed should be removed.

Configuring Application Rules

When an application first attempts to use the network, Windows Firewall prompts you to allow or deny access. Allow access only for applications you recognize and trust. For applications you do not recognize, deny the prompt and investigate before allowing.

Review existing application rules periodically in the Windows Firewall with Advanced Security snap-in. Look for rules created by applications you no longer use and remove them.

Firewall Limitations

Firewalls inspect traffic at the network level but generally cannot detect threats within encrypted HTTPS traffic without additional capabilities. They block connections but cannot assess the content of allowed connections.

Firewalls do not protect against threats that arrive through permitted channels. A phishing email delivered through standard email protocols reaches you through the firewall because email is allowed. The firewall's protection is complementary to other security measures, not a replacement for them.`);

update('AH Module 2: Using a VPN Properly', `VPNs are widely marketed and widely misunderstood. They provide genuine valuable protection in specific scenarios and provide no protection against many of the threats they are sometimes marketed as addressing. Understanding what VPNs actually do enables you to use them effectively and maintain realistic expectations.

What a VPN Does and Does Not Do

A VPN creates an encrypted tunnel between your device and a VPN server. All your internet traffic travels through this tunnel, encrypted, to the VPN server, which then forwards it to the internet. From the perspective of anyone watching your local network, they see only encrypted traffic to the VPN server. From the perspective of websites and services you visit, your traffic appears to come from the VPN server's IP address.

What this protects against: people on your local network monitoring your traffic, your ISP seeing which sites you visit, basic IP-based tracking by websites, and some forms of DNS monitoring.

What this does not protect against: malware already on your device, phishing attacks, the VPN provider itself monitoring your traffic, account-based tracking by services where you are logged in, and advanced tracking techniques like browser fingerprinting that work regardless of IP address.

A VPN does not make you anonymous. Your activities on services you are logged into are fully visible to those services. Your device can be fingerprinted. The VPN provider can see your traffic.

When VPNs Provide Genuine Protection

Public Wi-Fi is the clearest case for VPN use. On untrusted networks, a VPN encrypts your traffic before it leaves your device, preventing network-level interception by other users on the same network or someone who has compromised the router.

ISP monitoring is a legitimate concern for users in certain jurisdictions. A VPN prevents your ISP from building a detailed profile of your browsing activity.

Accessing corporate networks through a corporate VPN establishes a secure tunnel to your organization's internal network, enabling access to internal resources and routing your work traffic through your organization's security infrastructure.

Choosing a VPN Provider

For commercial VPN services, the provider selection matters significantly because the VPN provider can see your traffic, so you are shifting trust from your ISP to the VPN provider.

Look for providers with independently audited no-log policies. No-log claims are common but only audits provide external verification. Providers including Mullvad, ProtonVPN, and ExpressVPN have undergone audits.

Consider jurisdiction. VPN providers must comply with the laws of the country where they operate. Providers based in countries without mandatory data retention laws offer stronger legal protection.

Open protocols like WireGuard and OpenVPN can be independently examined for security. Proprietary protocols cannot be independently verified.

Be skeptical of free VPN services. Free VPNs must generate revenue somehow. Many free VPN services generate revenue by logging and selling user data, which directly undermines the privacy purpose.

VPN Limitations to Understand

Speed is reduced with VPN use because traffic takes an additional hop through the VPN server and encryption adds computational overhead.

VPNs do not protect against malware. If malware is already on your device, the VPN provides no protection against the malware's activities.

DNS leaks occur when DNS queries bypass the VPN tunnel and go through your regular ISP DNS, revealing your browsing activity despite the VPN. Check for DNS leaks and ensure your VPN includes DNS leak protection.

Kill switches are a feature that disconnects your internet if the VPN connection drops, preventing traffic from going out unprotected during VPN reconnection. Enable this on your VPN client if your privacy requirements depend on consistently protected traffic.`);

update('AH Module 3: Securing Your Home Router', `Your home router is the gateway between your home network and the internet. Every device on your network connects to the internet through your router. Securing it properly protects every device on your network from certain categories of attack.

Why Router Security Matters

Compromised routers are extremely valuable to attackers. A compromised router can intercept all traffic on your network, redirect you to malicious websites even when you type correct addresses, prevent security updates from reaching your devices, and be used as part of a botnet.

Router firmware vulnerabilities are discovered regularly and manufacturers release patches. Unlike operating systems that update automatically, many home routers are never updated after initial setup and remain vulnerable to known exploits for years.

Default factory settings on most consumer routers are designed for easy setup, not security. Default credentials are published online and widely known.

Changing Default Credentials

The router admin interface is accessible via a browser at the default gateway address, typically 192.168.1.1 or 192.168.0.1. The default username and password are printed on the router or available in the documentation.

Log into the admin interface and change both the admin password to something strong and unique. Change the Wi-Fi network name to one that does not identify your router model, as model names can help attackers target known vulnerabilities. Change the Wi-Fi password to a strong unique phrase.

Updating Router Firmware

In the router admin interface, look for a firmware update section. Some routers check automatically and display when updates are available. Others require manually checking the manufacturer's website for your router model.

Enable automatic updates if your router supports them. This ensures security patches are applied without requiring you to remember to check manually.

Disabling Unnecessary Features

WPS Wi-Fi Protected Setup is a feature that allows devices to connect by pressing a button or entering an 8-digit PIN. The PIN method has known security vulnerabilities that allow attackers to brute force the PIN and gain network access. Disable WPS in the router settings.

Remote management allows the router admin interface to be accessed from the internet. This is rarely needed by home users and creates an attack surface. Disable it unless you have a specific need.

UPnP Universal Plug and Play allows devices on your network to automatically configure port forwarding rules on the router. While convenient, it also allows malicious software on your network to open ports without your knowledge. Consider disabling it if you do not use applications that require it.

DNS settings in your router determine how your entire network resolves domain names. Changing the router's DNS to a security-focused provider like Cloudflare's 1.1.1.2 for malware blocking or Quad9 provides DNS-level protection against known malicious domains for every device on your network.

Network Segmentation

Guest networks create a separate Wi-Fi network for visitors and IoT devices that cannot access your main network. Devices on the guest network can reach the internet but cannot communicate with your computers, NAS drives, or other sensitive devices on the main network.

Put all IoT devices including smart TVs, cameras, thermostats, and smart speakers on the guest network. These devices frequently have poor security practices and slow update cycles. Isolating them prevents a compromised device from being used to attack your laptop.

Monitoring Connected Devices

Review the list of connected devices in your router admin interface periodically. Unfamiliar devices warrant investigation and potentially removal.

Some routers allow you to block specific devices by MAC address and show notifications when new devices join the network. These features provide visibility into who is using your network.`);

update('AH Module 4: Two Factor Authentication Setup', `Two-factor authentication adds a second verification step to the login process. Even when an attacker knows your password, they cannot access your account without the second factor. Properly implemented MFA is one of the most effective security controls available to individual users.

The Principle Behind MFA

Traditional password authentication relies on something you know. MFA combines this with something you have like your phone or a hardware key, or something you are like your fingerprint. An attacker who steals your password from a breach cannot complete the login without also having access to your second factor.

Microsoft has stated that MFA blocks over 99 percent of automated account attacks. Most credential-based account takeovers target accounts without MFA because compromising an account with MFA requires defeating two independent factors.

Types of Second Factors Ranked by Security

Hardware security keys and passkeys are the most secure option. FIDO2 hardware keys like YubiKey plug into a USB port or tap to an NFC reader. They cryptographically verify the specific website you are logging into, making them immune to phishing because they will not authenticate to a fake site even if you cannot tell the difference.

Authenticator apps generate time-based one-time passwords that change every 30 seconds. These are significantly better than SMS codes because they are not transmitted over the telecom network and cannot be intercepted through SIM swapping. Microsoft Authenticator, Google Authenticator, and Authy are common options.

SMS codes are sent via text message when you log in. While better than no MFA, they are vulnerable to SIM swapping, where an attacker convinces your carrier to transfer your number to a SIM they control. Use SMS MFA when it is the only option but prefer authenticator apps.

Setting Up an Authenticator App

Download a reputable authenticator app: Google Authenticator, Microsoft Authenticator, or Authy. Authy has the advantage of encrypted cloud backup for your authenticator codes, which helps if you lose your phone.

When you enable MFA on an account, the service typically displays a QR code. Open your authenticator app, tap the plus or add account button, and scan the QR code. The app now generates codes for that account.

Test the codes by going through the login process and entering the code from the app. Codes are time-sensitive and expire after 30 seconds, so enter them promptly.

Backup Codes

When you enable MFA on an account, the service typically provides backup codes. These are single-use codes that allow you to log in without your second factor if it is unavailable. Download these codes and store them securely in your password manager.

Do not store backup codes only on the device you are enabling MFA to protect. If that device is the one you lose access to, the backup codes stored on it are also inaccessible.

Priority Accounts for MFA

Enable MFA on these accounts as a minimum. Email accounts are the highest priority because email is the primary recovery mechanism for most other accounts. Compromised email enables password resets on nearly every other account.

Banking and financial accounts contain money and financial information. Work accounts often provide access to sensitive organizational data. Cloud storage accounts frequently contain sensitive personal documents. Password managers require the strongest MFA available given what they protect.

Recovery Planning

Recovery planning is as important as MFA setup. Know how you will regain access to each account if you lose your second factor device. Have recovery codes stored securely before you need them.`);

update('AH Module 5: Password Manager Setup and Use', `A password manager is not a convenience tool that makes life easier at the cost of security. It is a security tool that addresses one of the most fundamental vulnerabilities in how people manage credentials: password reuse. Understanding how to set one up correctly and use it effectively transforms your account security posture.

Why Password Managers Are Essential

The mathematics of password security are unambiguous. A 20-character truly random password is essentially uncrackable. A person cannot remember dozens of different 20-character random passwords. Therefore without a password manager, security and memorability are in direct conflict and security loses.

The typical person has dozens to hundreds of online accounts. Without a password manager, the realistic options are to reuse the same password everywhere which is disastrous when any service is breached, to use variations of the same base password which is only marginally better, or to use weak memorable passwords which are crackable. Password managers make strong unique passwords for every account practical.

When a data breach exposes passwords from a service you used, if that password is unique, the damage ends there. If you reused that password, the breach cascades to every service where you used it.

Choosing a Password Manager

End-to-end encryption is the most important technical requirement. This means only you can decrypt your vault. The password manager company cannot read your passwords. If their servers are breached, your encrypted data is useless to attackers without your master password.

Bitwarden is an excellent free and open source option with strong security practices and third-party audits. The source code is publicly available for inspection. 1Password and Dashlane are other reputable paid options.

Avoid browser password managers as your primary solution. While convenient, they tie your passwords to the browser and are more vulnerable to being extracted by malware than dedicated password managers.

Setting Up Your Password Manager

Install the desktop application and browser extension. The browser extension is what provides auto-fill functionality on websites.

Create your master password carefully. This is the one password you must remember and it protects everything else. Use a passphrase of four or more random words, at least 16 characters. Write it down and store the written copy securely somewhere physically separate from your devices. If you forget your master password and have no recovery method, you lose access to your vault.

Enable two-factor authentication on your password manager account immediately. This is your most critical account and deserves the strongest protection available.

Importing Existing Passwords

Most password managers can import passwords from browsers and other password managers. After importing, audit the imported passwords for duplicates, weak passwords, and old accounts you no longer use. Most password managers have a security audit feature that flags reused and weak passwords.

Using Your Password Manager Daily

When creating a new account, use the password manager's generator to create a strong random password rather than choosing one yourself. Let the generator choose the length and character set. 20 or more characters with mixed case, numbers, and symbols is appropriate for most accounts.

When logging into websites, use the browser extension to auto-fill credentials. This also provides protection against phishing, since the extension will not auto-fill a fake site with a different domain than the saved entry.

Maintaining Your Vault

Periodically review your saved accounts and delete entries for services you no longer use. Fewer active accounts means a smaller attack surface.

Use the health check features in your password manager to identify and fix reused, weak, or breached passwords. Ensure your vault is syncing correctly across devices so your passwords are available on mobile and work computers as needed.`);

update('AH Module 6: Recognizing and Removing Malware', `Malware, malicious software, encompasses a broad category of programs designed to harm, exploit, or gain unauthorized access to your system. Recognizing the signs of infection and knowing how to respond effectively limits the damage malware causes and reduces the time your system remains compromised.

The Malware Landscape

Viruses attach themselves to legitimate files and spread when those files are shared or executed. Traditional viruses were the original malware category and gave malware its common name, though viruses are now a relatively small portion of the malware ecosystem.

Trojans disguise themselves as legitimate software to trick users into installing them. Once installed, they perform hidden malicious functions: downloading additional malware, creating backdoors, stealing data, or encrypting files. Most malware delivered through phishing and malicious downloads is technically a trojan.

Ransomware encrypts your files and demands payment for the decryption key. It is designed to be immediately visible and disruptive.

Spyware operates silently, collecting information about your activities. Keyloggers record everything you type. Screen capture malware takes periodic screenshots. Credential stealers extract passwords from browsers and password managers.

Adware injects advertising into your browsing experience and may redirect searches. It is typically the least harmful category but can slow systems and open doors to worse infections.

Rootkits operate at a low level in the operating system, hiding themselves and other malware from detection by security software. They are among the most difficult malware to detect and remove.

Signs of Malware Infection

Performance degradation: Malware often consumes CPU, memory, or network resources. Unexplained slowness particularly when the system should be idle warrants investigation.

Unusual network activity: Outbound connections to unfamiliar destinations during idle periods, or slow internet speeds despite normal network conditions, suggest malware communicating with external servers.

Security software disabled: Malware often attempts to disable antivirus and other security software. If Windows Defender is turned off and you did not disable it, investigate.

Ransom notes: Ransomware is unambiguous. A ransom note appearing on screen makes the infection obvious.

Credential theft signs: Unauthorized activity in accounts, unexpected password reset emails, contacts receiving messages you did not send, all suggest credentials have been stolen.

Responding to Suspected Malware

Disconnect from the network to prevent data exfiltration and further communication with command and control servers.

Run a full system scan with your primary security software. Update the signatures before scanning to catch recent malware families.

Run a second-opinion scan with Malwarebytes Free, which specializes in detecting potentially unwanted programs and malware that traditional antivirus sometimes misses.

For advanced infections or rootkits, boot from a recovery environment or a bootable antivirus scanner. These scan the system before the operating system loads, preventing malware from hiding itself from the scanner.

For ransomware, check nomoreransom.org for free decryption tools for known ransomware families before paying.

For serious infections that resist removal, a clean reinstall of the operating system from known-good media, followed by restoration from a clean pre-infection backup, is the most reliable remediation.

Cleaning Up After Removal

After removing malware, change passwords for all accounts that may have been accessed from the infected device. If a keylogger was present, assume all credentials entered on the device are compromised.

Review accounts for unauthorized activity, particularly financial accounts and email. Consider what allowed the malware to get in and address that vector to prevent reinfection.`);

update('AH Module 7: Securing Your Browser', `Your browser is the application you spend the most time in and the one most directly exposed to untrusted content from the internet. Browser security configuration significantly reduces your exposure to web-based threats.

Choosing and Maintaining Your Browser

Use a modern actively maintained browser from a reputable vendor. Chrome, Firefox, Edge, and Brave all have robust security programs, rapid security update deployment, and large security research teams. Keep your browser updated. Browser security updates patch vulnerabilities that are actively exploited. Enable automatic updates.

HTTPS and Connection Security

HTTPS encrypts the connection between your browser and websites. Look for the padlock icon and https at the beginning of the URL for any site where you enter sensitive information.

Enable HTTPS-Only Mode in Firefox through Settings, Privacy and Security. This prevents connections to non-HTTPS sites without a warning. In Chrome, HTTPS-First Mode is available in Security settings.

When your browser shows a certificate warning, do not bypass it for sensitive sites. Certificate errors mean the connection is not properly authenticated.

Extension Security

Extensions are one of the highest-risk components of browser security. They have access to everything you do in the browser: pages you visit, content of those pages, form data including passwords, and your browsing history.

Install only extensions you genuinely need. Install only from official extension stores and from developers with established reputations, significant user bases, and ongoing maintenance.

Periodically audit your installed extensions and remove any you no longer use. Malicious actors have purchased legitimate popular extensions and pushed malicious updates to take advantage of existing trust and large install bases.

Privacy Settings

Configure cookie handling to block third-party cookies. Third-party cookies are primarily used for cross-site tracking and have limited legitimate use. Blocking them reduces tracking with minimal impact on functionality.

Enable tracking protection. Firefox has Enhanced Tracking Protection built in. Chrome has Privacy Sandbox features.

Review site permissions regularly. Check which sites have been granted notifications, location access, camera access, microphone access, and other sensitive permissions. Revoke permissions that are not actively needed.

Consider a privacy-respecting search engine. DuckDuckGo, Brave Search, and Startpage offer privacy-respecting alternatives to Google.

DNS over HTTPS encrypts DNS queries so your ISP and local network cannot see which domains you are looking up. Enable it in Firefox through Settings, Privacy and Security, DNS over HTTPS.

Content Blocking

An ad blocker like uBlock Origin reduces your exposure to malvertising by preventing most third-party ad content from loading. This also improves page load times significantly.

Password Manager Integration

Use a dedicated password manager integrated into your browser through an extension rather than relying on the browser's built-in password manager. The browser extension auto-fills credentials and verifies the domain before filling, which provides protection against phishing sites with similar-looking addresses.`);

update('AH Module 8: Safe File Downloading', `File downloads are one of the primary mechanisms through which malware reaches user systems. Developing careful habits around downloading and opening files dramatically reduces your exposure to this risk category.

The Download Threat Landscape

Malware distributed via downloads comes in several common forms. Executable files with .exe, .msi, .bat, and .cmd extensions are the most direct, running code when opened.

Office documents with macros are a historically significant malware vector. Word, Excel, and other Office documents can contain macros that execute within the document. Ransomware and trojans are commonly distributed this way, relying on the prompt to Enable Content or Enable Macros.

PDF files can exploit vulnerabilities in PDF readers. Ensure your PDF reader is updated.

ZIP and compressed files contain other files. The threat is in whatever is inside the archive. Malicious actors use password-protected ZIP files to prevent automatic scanning.

Double extension files like document.pdf.exe appear to be PDF files in environments that hide file extensions but are actually executables. Enable the display of file extensions in Windows Explorer to see actual file types.

Verifying Download Sources

Download software only from official sources: the developer's official website, the Microsoft Store, or established software repositories. Search results for software downloads are routinely gamed by malicious actors who create convincing lookalike sites.

Be particularly cautious about searching for downloads of popular free tools. Anything from free video editors to media players has been used as bait for malicious downloads. Bookmark official websites rather than searching repeatedly.

Check the URL carefully before downloading. Attackers create convincing lookalike domains.

File Hash Verification

When official sources provide file hashes, verify them. To verify a SHA-256 hash in Windows, open a command prompt and run: certutil -hashfile filename.exe SHA256

Compare the output to the hash provided on the official download page. A match confirms the file is identical to what the developer published.

Scanning Downloads Before Opening

Run downloaded files through your antivirus scanner before opening them. Right-click the file and select your security software's scan option.

VirusTotal is an online service that scans uploaded files using dozens of antivirus engines. Submitting a suspicious file there provides broader detection coverage than a single antivirus product.

The Macro Problem

Never enable macros in Office documents you received via email or downloaded from unfamiliar sources. Legitimate business documents rarely require macros. When you see a yellow banner in Word or Excel saying macros have been disabled and prompting you to enable content, this is a warning, not an instruction.

Dangerous File Type Awareness

Be cautious with these file types when received unexpectedly: .exe, .msi, .bat, .cmd, .ps1, .vbs, .js for direct executables; .docm, .xlsm, .pptm for Office files with macros enabled; .lnk for shortcuts that can execute commands; .iso and .img for disk images that can contain executable content; and .scr for screen savers which are executables.

Responding to a Potentially Malicious Download

If you opened a file and your system immediately behaved unusually, disconnect from the network, run a full system scan, and report to your IT team if this occurred on a work system.`);

update('AH Module 9: Account Hardening Best Practices', `Account hardening means implementing all available security measures to make your accounts as difficult to compromise as possible. Beyond strong passwords and MFA, a fully hardened account has multiple layers of protection and is configured to detect unauthorized access quickly.

The Layered Defense Approach

Account security is most effective as a layered system where multiple independent controls each raise the difficulty of compromise. An attacker who bypasses your password still faces MFA. An attacker who defeats MFA finds limited access without your security questions. An attacker who gains access triggers alerts that allow rapid response.

No single control is perfect, but each layer a defender adds requires the attacker to defeat it, increasing cost and reducing the likelihood of success.

Credential Layer

Use passwords generated by your password manager: long, random, and unique to every account. This is the foundation.

Check passwords regularly against breach databases. Most password managers integrate with haveibeenpwned.com to flag credentials that have appeared in breaches. When a breach surfaces your credentials, change them immediately.

Security questions are a weak point in most account systems. Traditional security question answers like mother's maiden name and high school mascot are easily researched or guessed. Use your password manager to generate and store random false answers. The security question is just another password field, not a place for true answers.

Authentication Layer

Enable the strongest available MFA on every account that supports it. Use hardware security keys or authenticator apps in preference to SMS. Configure backup authentication methods and store backup codes securely.

Review trusted devices and active sessions periodically. Most services list devices that have been marked as trusted or sessions currently logged in. Remove unfamiliar devices and revoke sessions that should not be active.

Review connected applications for accounts that support OAuth access. Any app you authorized to access your account appears in this list. Revoke access for apps you no longer use.

Account Recovery Security

Recovery email and phone number security is critical because these are the mechanisms used to regain account access. Your recovery email account must be as secure as or more secure than the accounts it is used to recover.

Review and update account recovery options annually. Outdated phone numbers and email addresses can be recycled and assigned to new users, creating a path for account takeover through recovery mechanisms.

Monitoring Layer

Enable login notifications where available. Many services send email alerts when a login occurs from a new device or location. These provide early warning of unauthorized access.

Review account activity logs periodically. Most major services provide some form of activity log showing recent logins, changes, and actions. Reviewing these catches unauthorized access that MFA and strong passwords missed.

Incident Response Readiness

Know how to respond to account compromise before it happens. For each of your most critical accounts, know: how to force logout of all sessions, how to change the password, how to review recent activity, and how to contact support for suspicious activity.

For financial accounts, know the direct phone number for fraud reporting. Responding quickly when unauthorized financial activity is detected minimizes losses.`);

update('AH Module 10: Social Media Security', `Social media platforms are among the most targeted accounts in cybercrime. They contain personal information valuable for identity theft and social engineering, provide access to your contacts for impersonation attacks, and have significant value for reputation damage.

Why Social Media Accounts Are High Value Targets

Contact access: Social media accounts provide access to your entire network of contacts. A compromised account can spread malicious links, social engineering messages, and fraud to people who trust you.

Personal information: Social media profiles often contain extensive personal information including birth dates, locations, employment, family relationships, and interests. This information feeds targeted attacks, security question answers, and social engineering pretexts.

Financial fraud: Some platforms have payment features. Compromised accounts have been used to send fraudulent payment requests to contacts.

Impersonation: High-follower accounts have reputational value. Compromised accounts can spread disinformation under your identity.

Technical Security Settings

Enable MFA on every social media account. Use an authenticator app rather than SMS where possible.

Use strong unique passwords stored in your password manager. Social media passwords should not be shared with any other service.

Review connected apps and revoke access for any application you no longer actively use. Third-party apps with access to your social media account can post on your behalf, access your messages, and scrape your data.

Review active sessions and devices connected to your account. Most platforms show where you are currently logged in. Remove sessions you do not recognize.

Privacy Configuration

Review post audience settings and default them to Friends or Connections rather than Public unless you specifically intend public content. Public posts are indexed by search engines and visible to anyone.

Profile information visibility settings control what strangers can see about you. Your email address, phone number, birth date, and location need not be publicly visible.

Disable location tagging in posts by default.

Behavioral Security Practices

Be selective about connection requests and follow requests. Fake accounts designed to gain access to your social network are common.

Be cautious about links in direct messages from people you do not know well. Direct message phishing using compromised or fake accounts is a common attack vector.

Avoid clicking on links in social media feeds without verifying the destination.

Do not participate in social media trends that ask for personal information. Common examples include questions about your first pet, the street you grew up on, your childhood hero, or your first car. These are security question answers.

Responding to Account Compromise

If you believe your account has been compromised, act immediately. Change the password, review and update MFA settings, review and revoke connected apps, check for unauthorized posts or messages sent from your account, and notify your contacts that they may have received malicious messages from your compromised account.`);

update('AH Module 11: Encryption Basics for Everyone', `Encryption is the process of transforming readable data into an unreadable form that requires a key to convert back. It is fundamental to modern information security, protecting data on your devices, in transit across networks, and in cloud storage.

What Encryption Does

Encryption converts plaintext readable data into ciphertext scrambled data using a mathematical algorithm and a key. Anyone who does not have the correct key sees random unreadable data. Only someone with the correct key can decrypt the ciphertext back to readable form.

Encryption protects data in two scenarios. Data at rest means data stored on devices, drives, and in the cloud. If a device is lost or stolen, encryption prevents the thief from reading the files without the decryption key. Data in transit means data moving across networks. HTTPS encryption protects your browser traffic from interception. Encrypted messaging protects your messages from interception and from the messaging platform itself if end-to-end encryption is used.

Full Disk Encryption

Full disk encryption scrambles the entire contents of a storage device. When the computer starts, authentication is required to decrypt the drive and access any data on it.

On Windows, BitLocker provides full disk encryption. It is available on Windows 10 and 11 Pro and Enterprise editions. Enable it through the BitLocker Drive Encryption section in Control Panel. Store the recovery key somewhere secure and separate from the device.

On macOS, FileVault provides full disk encryption. Enable it through System Preferences, Security and Privacy, FileVault.

On mobile devices, iPhones use full disk encryption by default when a passcode is set. Android devices use encryption by default in current versions.

Without full disk encryption, someone with physical access to your device can remove the storage drive and read all your files without needing your login credentials. With full disk encryption, the drive is useless without the key.

Encrypted Communication

HTTPS encrypts communication between your browser and websites. The padlock icon in the address bar indicates an encrypted connection.

End-to-end encrypted messaging means only the sender and recipient can read messages, not the messaging platform, not the network provider, and not anyone intercepting the traffic. Signal is the gold standard for end-to-end encrypted messaging. Standard SMS is not encrypted and should not be used for sensitive communications.

Encrypted email services like ProtonMail provide end-to-end encryption for messages between users of the same service.

File and Data Encryption

For specific sensitive files or folders, tools like 7-Zip allow you to create encrypted archives protected with a password. Use AES-256 encryption when the option is available.

VeraCrypt creates encrypted containers or fully encrypted drives, providing strong open-source audited encryption for sensitive data that needs to be stored or transported separately from full disk encryption.

Encryption Limitations

Encryption does not protect against malware already running on your device. If malware intercepts data before you encrypt it, encryption provides no protection. If ransomware runs on your device, it can encrypt the drive contents regardless of your own encryption.

Key management is where encryption fails in practice. Encryption is only as secure as the protection of the key. A strong encryption key stored in an insecure location provides weak protection.

Passphrase strength matters for encryption protected by a password. Weak passphrases can be brute-forced. Use long random passphrases for anything you encrypt manually and store them in your password manager.`);

update('NF Module 1: How the Internet Works', `The internet is the largest and most complex computer network ever built, yet it operates on surprisingly consistent principles. Understanding how data flows from your device to a distant server and back illuminates why certain attacks work, why some security controls are effective, and why others are not.

The Physical Infrastructure

The internet is a network of networks. At the bottom are the physical connections: fiber optic cables spanning continents under oceans, copper and fiber running to neighborhoods, and wireless connections for the last mile to devices.

At the core are internet exchanges, physical facilities where major networks interconnect and exchange traffic. At the edge are ISPs that connect homes and businesses to this backbone. Your device connects to your ISP, which connects to the larger internet.

IP Addressing and Routing

Every device on the internet needs an address. IP addresses serve this function. When you send data, your device divides it into packets and labels each one with the source and destination IP addresses.

Routers throughout the internet read these destination addresses and make forwarding decisions. Each router knows which direction to send packets to reach various address ranges. A packet from your home to a server in another country may pass through twenty or more routers.

The DNS System

Before your browser can connect to a website, it needs to translate the domain name you type into an IP address. The Domain Name System handles this translation.

When you type a website address, your device asks a DNS resolver to look up the IP address for that domain. The resolver queries DNS servers and returns the answer. Your browser then connects to that IP address.

DNS is critical infrastructure. DNS attacks that provide false IP addresses redirect you to malicious sites even when you type correct addresses. DNSSEC and encrypted DNS protocols address these vulnerabilities.

The Protocol Stack

Data communication follows layered protocols that each handle specific aspects of transmission. The TCP/IP model handles routing with IP at the internet layer, manages reliable delivery with TCP or fast delivery with UDP at the transport layer, and contains the protocols you interact with like HTTP at the application layer.

HTTP and HTTPS are the protocols your browser uses to request and receive web pages. HTTP sends data in plain text. HTTPS wraps HTTP in TLS encryption, protecting the communication from interception.

TCP provides reliable ordered delivery by acknowledging received packets and retransmitting lost ones. UDP prioritizes speed over reliability and is used for video streaming and gaming where slight data loss is acceptable.

How Attacks Exploit This Infrastructure

Man-in-the-middle attacks position an attacker between your device and the internet. By controlling the path your packets take, they can read and modify your communications. This is why HTTPS encryption matters: even an attacker who intercepts your traffic cannot read or modify it without detection.

DNS spoofing poisons DNS responses to redirect you to malicious sites. Even when you type a correct address, a compromised DNS path returns a false IP. DNSSEC signatures and encrypted DNS mitigate this.

DDoS attacks flood a target with traffic from many sources simultaneously, overwhelming the target's ability to respond to legitimate requests.

Why This Knowledge Matters

Understanding that your traffic traverses many networks and systems between you and any destination helps explain why trusting individual hops is insufficient. End-to-end encryption protects you regardless of what happens in the middle. DNS security matters because name resolution happens before the connection and affects where you actually connect.`);

update('NF Module 2: Understanding IP Addresses', `IP addresses are the fundamental addressing scheme of the internet. Understanding how they work, the difference between public and private addresses, and how address assignment functions helps you understand network security and troubleshoot connectivity problems.

IPv4 Addressing

IPv4 addresses consist of four groups of numbers separated by dots, each ranging from 0 to 255. A typical home network address looks like 192.168.1.100. This format gives approximately 4.3 billion possible addresses, which seemed sufficient when the protocol was designed but has proven inadequate as the internet grew.

IP addresses have two logical portions: the network portion identifies the network the address belongs to, and the host portion identifies the specific device within that network. A subnet mask defines where the boundary falls between these portions.

Typical home routers use addresses in the 192.168.0.0 to 192.168.255.255 range or the 10.0.0.0 to 10.255.255.255 range. These are defined as private address ranges reserved for internal networks and are not routable on the public internet.

Public vs Private Addresses

Private IP addresses are used within local networks. They can be reused in different local networks without conflict because they are not unique globally. Your home network, your office, and the coffee shop all use private addresses internally.

Public IP addresses are assigned by ISPs and are globally unique. They identify your network on the internet. When you visit a website, the server sees your public IP address, not your private address.

Network Address Translation performed by your router allows many devices with private addresses to share a single public IP address. When you send a request, the router replaces your private IP with the public IP and records the translation. When the response returns, the router uses this record to forward the response to the correct internal device.

IPv6 Addressing

IPv4 address exhaustion led to the development of IPv6. IPv6 addresses use 128 bits compared to IPv4's 32 bits, providing approximately 340 undecillion addresses, enough for every atom on Earth's surface to have many addresses.

IPv6 addresses look like 2001:0db8:85a3:0000:0000:8a2e:0370:7334 and are usually abbreviated by removing leading zeros.

IPv6 eliminates the need for NAT because every device can have a globally unique address. While this simplifies networking, it also means devices are directly addressable from the internet, making firewall configuration more important.

DHCP and Static Addressing

DHCP automatically assigns IP addresses to devices when they connect to a network. Your router runs a DHCP server that assigns available addresses from a configured range.

Dynamic addresses from DHCP may change each time a device connects. Static addresses are manually configured and do not change.

Static addresses are useful for devices like printers, NAS drives, and servers that need a consistent address so other devices can always find them.

For home networks, configuring DHCP reservations assigns a consistent address to specific devices based on their MAC address, providing the consistency of static addressing with the convenience of DHCP management.

Security Relevance of IP Addresses

IP addresses are used in firewall rules to allow or block traffic from specific sources. IP geolocation maps addresses to approximate physical locations. Security systems use this to flag access from unexpected countries or regions.

IP address logging appears in server and router logs. During security investigations, IP address records help reconstruct what happened. Attackers use proxies and VPNs to complicate this attribution.`);

update('NF Module 3: Ports and Protocols', `Network ports are virtual endpoints that allow a single device to run multiple network services simultaneously. Understanding ports and protocols explains how multiple services can run simultaneously on a single computer, how firewalls make granular decisions, and why certain network attacks target specific services.

What Ports Are

A port is a numerical identifier from 0 through 65535 that indicates which application or service on a device should receive network traffic. When a web server and an email server run on the same computer, incoming traffic is directed to the correct application based on the port number.

Port numbers are divided into ranges. Ports 0 through 1023 are well-known ports assigned to standard services. Ports 1024 through 49151 are registered ports for specific applications. Ports 49152 through 65535 are dynamic ports used for temporary client connections.

Common Well-Known Ports

HTTP web traffic uses port 80. HTTPS encrypted web traffic uses port 443. SSH secure shell for remote terminal uses port 22. FTP file transfer uses ports 20 and 21. SMTP email sending uses port 25. IMAP email receiving uses port 143. IMAPS encrypted IMAP uses port 993. DNS domain name resolution uses port 53. RDP Remote Desktop Protocol uses port 3389.

Knowing these helps you understand firewall rules, network monitoring, and why certain ports are common attack targets.

TCP vs UDP

Two transport protocols define how ports carry data. TCP Transmission Control Protocol establishes a connection before data transfer, ensures all data arrives correctly and in order, and confirms receipt. It is reliable but has overhead. Web browsing, email, and file transfer use TCP because reliability matters more than speed.

UDP User Datagram Protocol sends data without establishing a connection and without confirming receipt. It is faster and has lower overhead but provides no delivery guarantees. Video streaming, VoIP, DNS, and gaming use UDP where speed matters more than occasional data loss.

Why Ports Matter for Security

Port scanning is a reconnaissance technique where attackers probe a target to discover which ports are open and what services are running. Open ports reveal what services exist on a target and inform which vulnerabilities to attempt to exploit.

Common attack targets include SSH on port 22 which is constantly targeted with brute force password attacks, RDP on port 3389 which is heavily targeted and was used as the initial access vector in many ransomware campaigns, and database ports like MySQL 3306 and SQL Server 1433 which are high-value targets when exposed to the internet.

Firewall Rules and Port Management

Firewalls use port numbers as one basis for allowing or blocking traffic. On your desktop, Windows Firewall blocks unsolicited inbound connections by default, providing a good baseline.

Review port forwarding rules on your home router and remove those that are not actively needed. Every open port forwarded to an internal device is a potential attack surface accessible from the internet.

Application and Service Awareness

When troubleshooting network connectivity, understanding ports helps diagnose what is failing. If a web application is not loading but other websites work, the application might be using a non-standard port that is blocked by a firewall.

Monitoring tools that show active network connections help you understand what your device is communicating with. The netstat command in Windows shows active connections and listening ports, helping identify unexpected network activity that may indicate malware.`);

update('NF Module 4: Wi-Fi Security Standards', `Wi-Fi security standards have evolved significantly as previous standards were found to have serious weaknesses. Understanding the history of these standards, what each provides, and how to configure them correctly ensures you use the strongest protection your equipment supports.

The History of Wi-Fi Encryption

WEP Wired Equivalent Privacy was the original Wi-Fi security protocol introduced in 1997. It has fundamental cryptographic weaknesses that allow attackers to crack the encryption key in minutes using automated tools. WEP should never be used. Any network using WEP is effectively unencrypted.

WPA Wi-Fi Protected Access was introduced in 2003 as a replacement for WEP while the industry worked on a more comprehensive solution. WPA uses TKIP encryption which has known vulnerabilities. WPA is significantly better than WEP but should be replaced with WPA2 or WPA3 where equipment supports it.

WPA2 introduced in 2004 uses AES encryption with the CCMP protocol. WPA2 with AES is currently the minimum acceptable standard for Wi-Fi security. It has no known practical weaknesses in its fundamental design when properly configured.

WPA3 introduced in 2018 provides significant improvements including Simultaneous Authentication of Equals which protects against offline dictionary attacks and forward secrecy for individual sessions. WPA3 should be used when all devices on the network support it.

WPA2 vs WPA3 Technical Differences

WPA2's pre-shared key authentication is vulnerable to offline dictionary attacks. When a device connects to a WPA2 network, a four-way handshake occurs that an attacker can capture and then attempt to crack offline by testing password guesses. A strong Wi-Fi password significantly increases the time required but does not eliminate the vulnerability.

WPA3 uses Simultaneous Authentication of Equals instead of the four-way handshake. SAE provides forward secrecy, meaning each session uses a unique encryption key. Capturing the handshake does not allow offline password cracking because the session key cannot be derived without completing the actual handshake with the correct password.

Configuration Best Practices

Select WPA3 if all your devices support it. If some devices do not support WPA3, use WPA2/WPA3 transition mode which supports both standards simultaneously.

Use WPA2 with AES only. Avoid TKIP mode even in WPA2. The combination WPA2-AES provides the intended WPA2 security. TKIP in WPA2 mode has additional vulnerabilities.

Use a strong long Wi-Fi password. This directly affects how long it would take to brute-force a captured WPA2 handshake. A random passphrase of 20 or more characters is ideal.

Disable WPS Wi-Fi Protected Setup in your router settings. The WPS PIN method has a known vulnerability that allows an attacker to learn the PIN through a limited number of attempts due to a flaw in how the PIN is validated.

Understanding Open Networks

Open Wi-Fi networks without a password encrypt nothing. All traffic is visible to anyone in range. This is why VPN on public Wi-Fi remains important even as public Wi-Fi security improves. VPN encrypts your traffic before it leaves your device, protecting it even from the network operator.

Frequency Bands

Modern Wi-Fi operates on multiple frequency bands. The 2.4 GHz band provides better range and wall penetration but has limited bandwidth and significant interference from other devices. The 5 GHz band provides faster speeds but shorter range. The 6 GHz band available in Wi-Fi 6E and Wi-Fi 7 provides more spectrum with minimal existing interference.

For security purposes, the frequency band does not affect the encryption security, but it affects signal reach. A 5 GHz network's shorter range means fewer people outside your home can receive the signal at all.`);

update('NF Module 5: Understanding Firewalls and NAT', `Firewalls and Network Address Translation are the two most common network security mechanisms protecting home and enterprise networks. In home networks they typically coexist in the same device, the router, and work together to control what traffic can pass between your network and the internet.

Firewall Types and How They Work

Packet filtering firewalls examine individual packets and make allow or block decisions based on source and destination IP addresses and ports. They are fast but stateless, treating each packet independently without context about the conversation it belongs to.

Stateful firewalls track the state of network connections. They remember that your browser initiated a connection to a web server and expect the response to arrive. Traffic that is a response to an outbound connection is allowed automatically. Unsolicited inbound traffic that does not match any outbound request is blocked. This is more secure than packet filtering because it prevents unsolicited inbound connections without requiring explicit rules for each one.

Application layer firewalls also called next-generation firewalls inspect the content of packets, not just the headers. They can identify the specific application generating traffic regardless of port, allow or block based on application type, and detect threats in the content.

How Stateful Firewalls Protect Home Networks

When your computer initiates a connection to a web server, your router records the connection in its state table. The response packets from the server match this state entry and are allowed through.

When an attacker on the internet tries to connect directly to your computer, they send a packet to your public IP address. The router has no matching state entry for this inbound connection. The stateful firewall drops the packet because it is unsolicited inbound traffic.

This is why home computers are generally protected from direct internet scanning attacks even without individually configuring firewall rules.

Network Address Translation in Detail

NAT operates at the router and maintains a translation table. When your device sends a packet to the internet, your device sends the packet with your private IP as the source, the router replaces the private IP with the public IP and assigns a port from the dynamic port range, the router records this translation, the packet goes to the destination with the public IP as source, the response comes back to the router's public IP, and the router looks up the translation and forwards the response to your private address.

This allows hundreds of devices to share a single public IP address.

Port Forwarding

Port forwarding creates an explicit rule telling the router to send inbound traffic on a specific port to a specific internal device. This is necessary for services that accept inbound connections like a home media server.

Port forwarding bypasses the protection of the stateful firewall for the specified port and destination. Anyone on the internet who sends traffic to that port can attempt to connect to the internal device.

Review port forwarding rules in your router settings and remove any that are not actively needed.

UPnP and Automatic Port Forwarding

Universal Plug and Play allows devices on your network to automatically configure port forwarding rules without your involvement. While convenient, UPnP means any software running on your network including malware can open ports without your knowledge.

Consider disabling UPnP in your router settings if you do not use applications that require it, or review the UPnP port mappings table in your router to see what has been opened.`);

update('NF Module 6: VPNs and Tunneling', `VPN technology creates encrypted connections across untrusted networks, enabling secure remote access and private communication. Understanding the technical underpinning of VPNs helps you use them more effectively and understand their real capabilities and limitations.

What Tunneling Means

Tunneling is the technique of encapsulating one type of network protocol within another. A VPN tunnel takes your normal internet traffic, wraps it in an outer layer of encryption, and routes it through the VPN server. To anyone watching the network, they see only encrypted traffic going to the VPN server, not the actual destinations or contents of your communication.

The tunnel protects your traffic between your device and the VPN exit point. Once traffic exits the VPN server toward its actual destination, it is subject to the same protections and risks as any other internet traffic.

VPN Protocols

OpenVPN is an open-source protocol widely regarded as having strong security. It uses TLS for key exchange and can run over TCP or UDP. It is slower than newer protocols but has a long track record and independent security audits.

WireGuard is a newer modern protocol with significantly better performance than OpenVPN due to a simpler design and modern cryptography. It has been independently audited and is now widely adopted in commercial VPN services.

IKEv2/IPsec provides strong security with good reconnection behavior when network connections change, making it suitable for mobile devices that switch between Wi-Fi and cellular. It is commonly used in corporate VPN solutions.

PPTP is outdated and has known security weaknesses. Do not use it.

Corporate vs Personal VPN Use Cases

Corporate VPNs connect remote employees to their organization's internal network. The VPN client on your device establishes an encrypted tunnel to a corporate VPN concentrator. Once connected, you can access internal systems as if you were physically in the office.

Split tunneling configures the VPN to route only some traffic through the VPN. Corporate traffic uses the VPN while personal browsing uses your direct internet connection. This improves performance for personal browsing while maintaining corporate security requirements for work traffic.

Full tunneling routes all traffic through the VPN including personal browsing. Organizations with strict security policies require full tunneling.

The Trust Shift

Using a VPN shifts your privacy concern from your ISP or local network to the VPN provider. Your ISP can no longer see your traffic. Instead the VPN provider can. This shift is only beneficial if the VPN provider is more trustworthy than your ISP and does not log your activity. Choosing a VPN provider with audited no-log policies and appropriate jurisdiction is therefore important.

Tor vs VPN

Tor routes traffic through three separate relay nodes with layered encryption where each relay knows only the previous and next hop, not the full path. VPNs provide better performance but offer weaker anonymity because the VPN provider knows your real IP and your activity. For most practical privacy needs, a trustworthy VPN is a better balance than Tor.

Common VPN Configuration Issues

DNS leaks occur when DNS queries bypass the VPN tunnel and go through your regular ISP DNS, revealing your browsing activity despite the VPN. Check for DNS leaks using services like dnsleaktest.com.

Kill switches are a feature that disconnects your internet if the VPN connection drops, preventing traffic from going out unprotected during VPN reconnection.

IPv6 leaks occur when the VPN protects IPv4 traffic but IPv6 traffic bypasses the tunnel. Disable IPv6 on your network adapter or use a VPN that handles IPv6 traffic.`);

update('NF Module 7: DNS Security', `The Domain Name System is infrastructure that operates invisibly but critically. Every time you visit a website, send an email, or use almost any internet service, DNS translates the human-readable name into the IP address your device needs to connect. This centrality makes DNS a high-value attack target.

How DNS Works in Detail

DNS is a hierarchical distributed database. At the top are root DNS servers that know where to find the authoritative servers for each top-level domain. Below those are the TLD servers. At the bottom are the authoritative servers for your specific domain that contain the actual records.

When your device looks up a domain name, it contacts a recursive resolver, usually provided by your ISP or a service like Google or Cloudflare. The resolver queries the hierarchy if it does not have the answer cached and returns the result to your device.

DNS records include: A records for IPv4 addresses, AAAA records for IPv6 addresses, MX records for mail servers, CNAME records for aliases, TXT records for text information, and NS records for authoritative name servers.

DNS Vulnerabilities

Traditional DNS was designed without security in mind. Queries and responses are sent in plain text over UDP without authentication. This creates several attack opportunities.

DNS cache poisoning injects false records into a resolver's cache. When your DNS resolver caches a falsified record, everyone using that resolver is directed to the wrong IP address for that domain until the cache expires.

DNS hijacking modifies DNS settings on a router or device to redirect all DNS queries through an attacker-controlled server. Malware that changes DNS settings and compromised routers with changed DNS configuration both achieve this.

DNS tunneling uses DNS queries to exfiltrate data or communicate with malware. Because DNS traffic is allowed through most firewalls, it provides a covert channel.

DNSSEC Authenticating DNS Responses

DNSSEC adds cryptographic signatures to DNS records. Resolvers that validate DNSSEC signatures can verify that records are authentic and have not been tampered with.

Encrypted DNS Protecting Privacy

Traditional DNS queries are visible to anyone on your network and to your ISP. This reveals the websites you visit even if the traffic itself is HTTPS-encrypted.

DNS over HTTPS sends DNS queries through HTTPS connections. This encrypts the queries and makes them look like ordinary web traffic. ISPs and local network observers cannot monitor which domains you look up.

DNS over TLS also encrypts DNS queries but uses a dedicated port and protocol rather than HTTPS.

Browser-level DoH sends DNS queries directly from your browser to a configured DoH provider, bypassing your operating system's DNS settings.

Choosing a DNS Provider

Your DNS provider can see all domains you look up. Choosing a privacy-respecting provider matters.

Cloudflare's 1.1.1.1 service has an audited privacy policy. Cloudflare's 1.1.1.2 is the malware-blocking variant that blocks known malicious domains. Quad9's 9.9.9.9 also blocks known malicious domains and has privacy-focused policies.

Malware-blocking DNS providers add a layer of protection by refusing to resolve known malicious domains. Even if malware on your device tries to connect to its command and control server, a blocking resolver returns an error instead of a usable IP address.`);

update('NF Module 8: Network Monitoring Basics', `Network monitoring is the practice of observing, analyzing, and acting on information about network activity. For security purposes, network monitoring detects suspicious activity, identifies unauthorized devices, and provides the visibility needed to investigate incidents.

Why Network Monitoring Matters for Security

Most security incidents generate distinctive network activity. Malware communicates with command and control servers. Data exfiltration generates large outbound transfers. Lateral movement attempts connections to new systems. Network scans probe many addresses or ports rapidly.

Without visibility into network activity, these indicators of compromise are invisible. Network monitoring converts invisible threat activity into visible actionable data.

For home networks, even basic visibility into connected devices and traffic volumes can reveal compromised devices, unauthorized network users, and bandwidth-consuming applications.

Monitoring Your Router

Your home router's admin interface provides basic network monitoring. Connected devices list shows all devices currently on your network with IP and MAC addresses. Review this regularly for unfamiliar devices. Traffic statistics show bandwidth usage by period. Unusual spikes particularly at odd hours warrant investigation.

Passive vs Active Monitoring

Passive monitoring observes traffic without affecting it. A network tap or port mirror on a managed switch allows a monitoring device to receive a copy of all traffic on the network for analysis.

Active monitoring sends probes to test network state. Ping sweeps test which devices respond. Port scans test which services are running. These activities are appropriate for managing your own network but constitute unauthorized access if performed on networks you do not own.

Network Scanning Tools

Nmap is the standard network scanning tool for mapping what is on a network and what services are running. For your own network, regularly scanning with Nmap helps you maintain an accurate inventory of connected devices.

A basic discovery scan: nmap -sn 192.168.1.0/24 sends ping-like probes to all addresses in the subnet and reports which ones respond.

A service scan: nmap -sV 192.168.1.100 probes a specific device to identify what services and versions are running.

Packet Analysis with Wireshark

Wireshark is a packet capture and analysis tool that shows the actual content of network traffic. This level of visibility helps diagnose application problems, verify encryption is working, and investigate suspicious activity.

For security monitoring, look for connections to unfamiliar external IP addresses, unusually high traffic volumes to single destinations, DNS queries for suspicious domains, and unencrypted transmission of what appears to be credentials.

Security Information and Event Management

Enterprise security teams use SIEM systems to collect logs from across the environment, correlate events, and alert on suspicious patterns. These systems aggregate firewall logs, DNS logs, authentication logs, endpoint logs, and network flow data to provide comprehensive visibility.

Network Monitoring as Incident Response

When responding to a suspected security incident, network monitoring data provides crucial evidence. Which systems communicated with external addresses during the incident window? What data volumes were transferred? Which internal systems communicated with each other unusually?

Maintaining persistent network logs, even basic ones, provides retrospective visibility into what happened during an incident. Security incidents are often detected days or weeks after initial compromise, and retrospective analysis of logs from the period of compromise is essential for understanding scope and impact.`);

update('NF Module 9: Common Network Attacks', `Understanding network attack techniques helps you recognize attack indicators, appreciate why certain security controls exist, and make better defensive decisions. Network attacks range from sophisticated multi-stage intrusions to relatively simple attacks that succeed through volume or exploitation of protocol weaknesses.

Man-in-the-Middle Attacks

A man-in-the-middle attack positions an attacker between two communicating parties, allowing them to intercept, read, and potentially modify communications.

On local networks, ARP poisoning is a common technique. ARP translates IP addresses to MAC addresses on the local network. An attacker can send false ARP responses claiming their MAC address is the router's MAC address, redirecting all traffic through their device before forwarding it to the real destination.

Evil twin attacks create a rogue Wi-Fi access point with the same name as a legitimate one. Devices that connect to the evil twin send all their traffic through the attacker's equipment.

HTTPS protects against man-in-the-middle attacks for traffic to properly configured sites. HTTP Strict Transport Security prevents SSL stripping by instructing browsers to always use HTTPS for a domain.

Denial of Service Attacks

Denial of Service attacks prevent legitimate users from accessing a service. Volume-based DDoS attacks flood the target with traffic overwhelming its bandwidth or processing capacity. Protocol attacks exploit weaknesses in network protocols to exhaust server resources.

DDoS mitigation requires significant infrastructure. CDN providers and DDoS scrubbing services sit in front of targets and absorb and filter attack traffic. Individual organizations cannot defend against large volumetric attacks without upstream mitigation.

Amplification attacks use protocols that send larger responses than requests. By sending requests with a spoofed source address of the victim, attackers direct large volumes of response traffic at the victim. DNS amplification has been used in record-breaking DDoS attacks.

Reconnaissance Attacks

Port scanning identifies which services are running on target systems. SYN scanning sends connection initiation packets and observes responses to identify open ports without completing connections.

OS fingerprinting identifies the operating system from subtle differences in network behavior. Knowing the target OS helps attackers select exploits relevant to that platform.

Banner grabbing connects to services and reads version information from their responses. Version information helps identify unpatched vulnerabilities.

Wireless Network Attacks

Deauthentication attacks send forged management frames to disconnect devices from a Wi-Fi network. WPA2 management frames are not authenticated, making this attack straightforward. This can be used to capture WPA2 handshakes for offline password cracking.

WPA2 handshake capture is the first step in offline password cracking. A long random Wi-Fi password makes this impractical.

Protocol-Level Attacks

BGP hijacking manipulates the Border Gateway Protocol that routers use to exchange routing information. By announcing false routing information, attackers can redirect internet traffic through their infrastructure.

TCP SYN flood exploits the TCP connection establishment process by sending many connection requests without completing them, exhausting the target's connection tracking resources.

IP spoofing forges the source IP address in packets, complicating attack attribution and enabling certain reflection and amplification attacks.

Defense Against Network Attacks

Network segmentation limits what an attacker can reach from any compromise point. Encryption protects against interception attacks. Network monitoring detects attack indicators. Updated software closes vulnerability-based entry points.`);

update('NF Module 10: Securing Your Network at Home', `A secure home network protects every device connected to it, your personal data, and potentially your employer's data if you work from home. Unlike enterprise networks with dedicated security teams, home networks typically receive only initial setup attention and then operate unchanged for years.

The Home Network Threat Model

Home networks face several categories of threats. External attacks attempt to compromise devices on your network from the internet, typically by exploiting vulnerabilities in exposed services or attacking your router. Lateral movement from a compromised device allows attackers who have compromised one device to attack others on the same network. IoT compromise uses poorly secured smart devices as entry points. Unauthorized access uses weak Wi-Fi credentials to join your network.

Router Security

Your router is the most security-critical device on your home network. Update firmware regularly. Change default credentials for both the admin interface and Wi-Fi. Disable remote management so the router admin interface is only accessible from your local network. Disable WPS. Review port forwarding rules and remove those you do not actively need.

Network Segmentation at Home

Create a guest network for visitors and IoT devices. A guest network is isolated from your main network. Devices on the guest network can reach the internet but cannot directly communicate with devices on your main network.

Put these devices on the guest network: smart TVs, streaming devices, gaming consoles, smart speakers, security cameras, thermostats, and any other IoT device. These devices often have poor security practices and long operational lives without updates.

Keep your computers, phones, and tablets on the main network where they can communicate with each other and with your NAS or printer.

DNS Configuration

Configure your router to use a security-focused DNS provider for all devices on the network. This protects every device without individual device configuration.

Cloudflare's 1.1.1.2 blocks known malware domains. Quad9's 9.9.9.9 similarly blocks known malicious domains. Both options provide network-wide protection for every device including IoT devices that cannot be individually configured.

Wireless Security Settings

Use WPA3 if all your devices support it. Use WPA2 with AES as a minimum. Do not use WEP or WPA with TKIP.

Use a strong long Wi-Fi password. This is the primary defense against wireless attacks.

Review connected devices regularly in the router admin interface to identify unauthorized devices.

Device Security Within the Network

Ensure all devices on your network have their software updated, particularly the operating system and browsers.

Disable file sharing on devices that do not need to share files. Use strong passwords on all devices that have login protection. Default credentials on devices like NAS drives and printers on your network are accessible to anyone on the network.

Working From Home Security

If you work from home, your home network directly affects your employer's security. Use your corporate VPN when accessing work systems. Separate personal and work activities where possible. Report any security concerns to your IT department. Reporting potential compromises early limits damage.`);

update('SI Module 1: Safe Browsing Fundamentals', `Safe browsing is the foundation of internet security for most people because the browser is the primary interface through which threats are encountered. Good browsing habits reduce exposure to phishing, malware, scams, and privacy violations without requiring technical expertise.

The Mindset of Safe Browsing

The internet is not uniformly safe. Maintaining an appropriate level of skepticism, particularly about the unexpected, is the core mental habit of safe browsing.

Unexpected prompts, unexpected downloads, unexpected requests for information, and unexpected alerts should all be treated with suspicion. Legitimate websites and services generally do not need to surprise you with urgent messages, request your credentials when you have not tried to log in, or insist that you download something to continue.

Trust signals have become easier to fake. The padlock icon indicates an encrypted connection but not a trustworthy site. Malicious sites routinely obtain valid TLS certificates. Legitimate-looking design can be copied from any site. None of these signals alone establish trustworthiness.

Verifying Where You Are

Before entering any credentials or sensitive information on a website, verify the URL in the address bar. The domain, the part before the first slash after the initial https://, must match the legitimate organization.

Learn to identify common spoofing patterns: paypa1.com instead of paypal.com, microsoft.com.support-center.net where support-center.net is the actual domain, or amazon-security.com which sounds related but is not Amazon.

Bookmark important sites and use bookmarks rather than searching for them repeatedly. Search results can be manipulated to show malicious lookalike sites prominently, particularly for financial services.

HTTPS Fundamentals

HTTPS encrypts the connection between your browser and the server, protecting your data from interception in transit. Always look for HTTPS indicated by the padlock icon before entering any credentials or payment information.

HTTP is unencrypted. Anything you submit on an HTTP page can be read by anyone who can intercept your traffic, including other users on the same public Wi-Fi network.

Remember that HTTPS only means the connection is encrypted. It does not guarantee the site is who it claims to be or that it is not phishing.

Managing Downloads

Only download files from sources you trust. The source matters more than the file format.

Be cautious about download prompts that appear when you visit websites. Legitimate sites do not typically initiate downloads without your explicit action. A prompt to download software you did not request warrants skepticism.

Scan downloads before opening them. Right-click and scan with your security software.

Browser Extensions and Their Risks

Extensions have access to everything you do in your browser. Install only extensions you genuinely need and from developers with established reputations.

An ad blocker like uBlock Origin reduces exposure to malvertising and speeds up browsing. A password manager extension provides secure phishing-resistant credential management.

Periodically review installed extensions and remove those you do not use.

Public Computers and Shared Devices

Public computers in libraries, hotels, and shared offices may be infected with keyloggers or other malware. Avoid accessing sensitive accounts from public computers. If you must, use private browsing mode, manually clear browser data after use, and change passwords from a trusted device afterward.

Log out explicitly from all accounts before leaving a shared device. Closing the browser may not end active sessions.`);

update('SI Module 2: Online Privacy Basics', `Online privacy involves controlling who can collect information about you, what they can collect, and how they can use it. Most people are surprised by the extent of data collection that occurs during normal internet use.

The Data Collection Ecosystem

Websites collect information through multiple mechanisms simultaneously. Cookies are small files stored in your browser that track your activity and preferences. First-party cookies from the site you are visiting serve legitimate purposes like keeping you logged in. Third-party cookies from advertising and analytics companies track you across multiple sites to build behavioral profiles.

Browser fingerprinting identifies you based on characteristics of your browser and device without using cookies. Your browser version, screen resolution, installed fonts, time zone, and dozens of other characteristics combine into a fingerprint that is often unique to your device. Unlike cookies, fingerprints cannot be cleared.

Tracking pixels are tiny invisible images embedded in emails and web pages. When your email client or browser loads the image, the server records your IP address, browser type, and the time you opened the email or visited the page.

JavaScript trackers run code in your browser that reports your activity to third-party analytics services.

What Data Is Collected and Why

Behavioral profiles describe your interests, routines, relationships, health concerns, financial situation, and political views, inferred from your browsing activity. These profiles are used to target advertising, to price discriminate, and to influence behavior.

Data brokers buy this information and aggregate it with data from public records, loyalty programs, and other sources, creating detailed profiles that are sold to marketers, insurers, and employers.

Practical Privacy Tools and Techniques

Browser privacy settings provide a first layer of protection. Enable Enhanced Tracking Protection in Firefox or similar features in other browsers. Block third-party cookies, which are primarily used for cross-site tracking with limited legitimate uses.

A privacy-respecting search engine like DuckDuckGo does not build profiles based on your searches. DuckDuckGo, Brave Search, and Startpage offer alternatives that do not track searches.

Private browsing mode prevents your local browser from saving history, cookies, and form data. It does not prevent your ISP, employer, or the websites you visit from seeing your traffic.

A VPN encrypts your traffic and masks your IP address from sites you visit. This prevents ISP-level tracking and reduces IP-based tracking by advertisers, though it does not prevent fingerprinting or account-based tracking.

Content blockers like uBlock Origin block ads and trackers before they load, reducing data collection that reaches your browser and improving page load times.

Account-Based Privacy

Use email aliases to protect your real email address. Services like SimpleLogin and Firefox Relay generate unique email addresses that forward to your real inbox. If an alias starts receiving spam, you know which service was breached or sold your address, and you can delete that alias.

Use separate email addresses for different purposes. A dedicated email for shopping keeps commercial tracking separate from your primary personal email.

The Privacy vs Convenience Tradeoff

Privacy protection often involves tradeoffs with convenience. Blocking third-party cookies may break some functionality. Using a VPN slows your connection slightly. Starting with practical low-friction measures like blocking third-party cookies, using a privacy search engine, and enabling tracking protection provides meaningful improvement with minimal convenience impact.`);

update('SI Module 3: Social Media Safety', `Social media platforms are both genuinely useful and genuinely risky. They enable connection and communication while also collecting extensive personal data, enabling sophisticated social engineering, and creating reputation risks through permanent discoverable records.

The Data Collection Behind Social Media

Social media platforms know more about users than most people realize. Beyond what you explicitly share, platforms track what you look at even if you do not engage with it, who you interact with and how often, where you are when you use the app if location permission is granted, what other apps you use if permissions allow, and what websites you visit through embedded tracking pixels and login buttons.

This data feeds advertising targeting algorithms. The advertising model means your attention and behavioral data are the product being sold to advertisers.

Account Security Practices

Use a strong unique password for each social media account. Social media accounts are high-value targets and frequently compromised through credential stuffing when users reuse passwords from breached services.

Enable multi-factor authentication on every platform. Review active sessions in account security settings and revoke any you do not recognize. Review third-party app connections regularly.

Privacy Configuration

Each platform has privacy settings that control who can see your content and profile information. Review these settings on every platform you use, not just once but periodically as platforms sometimes change default settings.

Limit profile visibility to friends or connections rather than public where possible. Your birth date, phone number, and email address should not be publicly visible.

Review which posts are public versus restricted. Old posts from years ago may be set to public and contain information you would not share today.

Disable location tagging by default.

Behavioral Safety

Think before posting personal information. Home address, work location, daily routine, travel plans, and financial information in social media posts create risks ranging from burglary to targeted scams.

Be selective about connection requests. Not everyone who sends a connection request is who they appear to be. Fake profiles are created to conduct social engineering, gather information, and spread malicious content.

Be skeptical of links in messages, particularly from accounts you have not interacted with recently. Compromised accounts send malicious links to friends who are more likely to trust them.

Avoid social media trends that involve answering personal questions. Common formats like your childhood nickname plus birth street as your elf name are designed to harvest security question answers.

Handling Harassment and Abuse

Know how to use blocking, muting, and reporting functions on each platform. Document harassment with screenshots before taking action, as evidence may be needed for platform reports or law enforcement.

Limit who can comment on your posts and who can send you messages if you experience harassment.`);

update('SI Module 4: Safe Online Shopping', `Online shopping fraud causes billions in consumer losses annually. The combination of financial transactions, personal data, and high volume creates significant opportunity for fraudsters. Understanding the risks and implementing protective habits significantly reduces your vulnerability.

The Online Shopping Threat Landscape

Fake websites impersonate real retailers or create entirely fictional stores that take payment without delivering goods. They use professional-looking designs, fake reviews, and sometimes even functional browsing experiences that suddenly become unavailable after collecting payment.

Account takeover uses stolen credentials to make unauthorized purchases through legitimate retailer accounts.

Payment card skimming on compromised websites captures card details entered during checkout. Legitimate-looking checkout pages on compromised websites can pass data to attackers simultaneously with legitimate processors.

Invoice and overpayment scams target marketplace sellers, using fake payment confirmations or overpayment schemes to extract goods or funds.

Verifying Sites Before Purchasing

Check the URL carefully. The domain should match the retailer you expect. Slight misspellings, additional words, or wrong top-level domains are warning signs.

Look for business information: physical address, customer service phone number, and return policy. Legitimate retailers provide this clearly.

Search for reviews on independent platforms. Search the business name plus scam or review to find consumer feedback.

Be suspicious of prices that seem unrealistically low. Heavily discounted goods and too-good-to-be-true deals are warning signs.

Payment Methods and Protections

Credit cards provide the best consumer fraud protection. Chargebacks allow you to dispute unauthorized or non-delivered purchases. Use a credit card for all online purchases where possible.

Debit cards offer significantly weaker protection than credit cards. Fraudulent debit transactions draw directly from your bank account and recovery is slower and less certain.

Virtual card numbers are single-use or limited-use card numbers generated by your bank or credit card issuer. They protect your real card number from being stored by merchants and used in future breaches.

Avoid wire transfer, money order, Western Union, Zelle, and gift card payments for retail purchases. These methods are unrecoverable and are the preferred payment method for fraudsters.

Protecting Your Account

Use unique strong passwords for every shopping site. Enable MFA on shopping accounts where available, particularly Amazon and other accounts with saved payment methods.

Avoid saving payment card details on retailer websites. Review order confirmations and account activity regularly to catch unauthorized orders quickly.

After the Purchase

Save order confirmations and tracking numbers. Monitor your credit card and bank statements for unexpected charges after shopping online. Review subscriptions on your statements periodically.`);

update('SI Module 5: Email Safety and Spam', `Email is the most widely used communication tool in both personal and professional contexts and remains the primary attack vector for cybercrime globally. Phishing, malware distribution, business email compromise, and spam all rely primarily on email.

Understanding the Email Threat Landscape

Phishing emails attempt to steal credentials, personal information, or financial details by impersonating trusted entities. Malware distribution via email attaches malicious files or links to malicious downloads. Business email compromise uses email to manipulate organizations into fraudulent financial actions. Spam is unsolicited bulk email.

Email Authentication and What It Means

Three technical email authentication mechanisms protect against spoofing. SPF Sender Policy Framework specifies which mail servers are authorized to send email for a domain. DKIM DomainKeys Identified Mail adds a cryptographic signature to outgoing email that the recipient can verify. DMARC Domain-based Message Authentication Reporting and Conformance tells receiving servers what to do with messages that fail SPF or DKIM checks.

When an email is in your spam folder, it may be there because SPF or DKIM validation failed. Emails that pass authentication are more likely to be legitimate, though authentication can be set up by anyone including phishers using their own domains.

Evaluating Emails Critically

Sender address scrutiny is the most important step. Display names can say anything. The actual email address visible by hovering over or clicking the sender name reveals the truth.

Link verification: Before clicking any link, hover over it on desktop to see where it actually goes. If the destination domain does not match the claimed sender, do not click.

Unexpected attachments: Be suspicious of any attachment you were not expecting. This is especially true for Office documents, ZIP files, and PDFs from unknown senders.

Urgency and threats: Legitimate organizations rarely threaten account suspension or legal action over email and demand immediate action.

Managing Spam Effectively

Use your email provider's spam reporting feature for spam that reaches your inbox.

Unsubscribe from legitimate marketing email you no longer want using the unsubscribe link in the email footer. This works for legitimate companies.

For malicious spam, do not click unsubscribe links. Clicking unsubscribe in malicious spam confirms your address is active and typically results in more spam.

Use separate email addresses for different purposes. A dedicated email for newsletters and retail, distinct from your primary personal email, limits the impact of any single breach.

Email Plus Addressing

Many email providers support plus addressing, adding a plus sign and a tag to your existing address: yourname+shopping@gmail.com. Emails sent to this address arrive in your regular inbox. When you sign up for services using tagged addresses, you can identify which service was the source of any spam you receive.

Email Security Settings

Enable MFA on your email account. This is the highest priority account for MFA since email is the recovery mechanism for most other accounts.

Review authorized apps and devices in your email account security settings. Remove any access that is not actively used. Enable notifications for logins from new devices.`);

update('SI Module 6: Public Wi-Fi Safety', `Public Wi-Fi networks at coffee shops, airports, hotels, libraries, and other locations are convenient but inherently less trustworthy than your home or corporate network. The security risks of public Wi-Fi are real and well-documented.

Why Public Wi-Fi Is Risky

You do not control the network. The network operator may log your traffic. The security configuration may be poor. Other users on the network may attempt to intercept traffic.

Public networks are often open, meaning no password is required and no WPA encryption protects wireless traffic. Any device in range can receive all the wireless traffic on an open network. Even with a password, all users share the same key, so any user can decrypt others' traffic.

Evil twin attacks create rogue access points using the same SSID as a legitimate network. Your device may connect to the evil twin instead of the real network. The attacker then has a man-in-the-middle position on all your traffic.

What HTTPS Protects and What It Does Not

HTTPS encrypts the content of your traffic between your browser and the server. Even on an open unencrypted Wi-Fi network, HTTPS prevents the network operator or other users from reading the content of your HTTPS traffic.

However, HTTPS does not hide which sites you are visiting. Your DNS queries reveal the domains you are connecting to. The destination IP addresses are visible in packet headers.

HTTPS also does not protect applications other than the browser. Email clients, app updates, and other applications may transmit data without encryption.

Using a VPN on Public Wi-Fi

A VPN encrypts all your traffic before it leaves your device and routes it through the VPN server. From the perspective of the public Wi-Fi network, they see only encrypted traffic to the VPN server.

Use a VPN consistently when on public Wi-Fi, particularly for any work-related activity, access to sensitive accounts, or any activity you want to keep private.

Device Configuration for Public Networks

Disable auto-connect to open networks. Your device should not automatically join public networks it has connected to previously, as attackers can create access points with the same names as networks you have visited.

When connecting to a new network, set it as a Public network in Windows to apply the most restrictive firewall profile. Disable file sharing while on public networks. Disable Bluetooth when not in active use.

Practical Guidance for Common Scenarios

For brief low-sensitivity browsing like checking news or weather, the risk of public Wi-Fi is relatively low if you use HTTPS-only sites and no sensitive accounts.

For work activities, sensitive accounts, financial transactions, or anything requiring login credentials, use a VPN consistently on public Wi-Fi.

Consider using your mobile phone's hotspot feature as an alternative to public Wi-Fi for sensitive activities.

Recognizing Rogue Networks

Before connecting, verify the exact network name with staff. Do not connect to networks named similarly to but not exactly matching the establishment's network.

Be suspicious of networks with unusually strong signal strength that appear when you have not moved to a new location.`);

update('SI Module 7: Protecting Children Online', `Children and teenagers navigate digital environments with less life experience and impulse control than adults, making them more vulnerable to specific online threats. Protecting minors online requires a combination of technical controls, open communication, and education that grows more sophisticated as they mature.

The Online Threat Landscape for Minors

Cyberbullying uses digital platforms to harass, intimidate, or embarrass peers. It differs from traditional bullying in that it can follow victims home, content can spread rapidly and permanently, and bullying can be anonymous.

Online predators use social platforms, gaming environments, and direct messaging to build inappropriate relationships with minors. This process called grooming involves building trust over time before attempting exploitation. Predators often pose as peers and move conversations to less monitored platforms.

Inappropriate content is accessible to minors on the internet regardless of design choices, through weak age verification, direct URL access, and peer sharing.

Privacy risks specific to children include over-sharing of personal information, location disclosure, and the creation of permanent digital records through social media that can affect them in adulthood.

Technical Controls

Parental controls built into operating systems, devices, and routers provide content filtering, time limits, and activity monitoring appropriate for different ages.

Windows Family Safety allows content filtering, screen time limits, and spending controls for child accounts. Apple Screen Time provides similar controls for iOS and macOS devices with Family Sharing. Google Family Link manages Android devices for children under 13. Router-level content filtering applies restrictions to every device on the home network.

These technical controls work best as supplements to conversation and education, not replacements for them. Determined children can find ways around most technical controls, and controls become increasingly counterproductive as children mature.

Age-Appropriate Communication

Different conversations are appropriate at different ages. Young children need simple rules: do not talk to strangers online, do not share your real name or where you live, tell an adult if something feels wrong or scary.

Middle school age children benefit from more nuanced conversations about what is appropriate to share online and why strangers might misrepresent themselves.

Teenagers need to understand privacy implications, the permanence of online content, healthy relationship markers online and offline, and how to recognize and respond to manipulation.

Open Door Policy

Children are more likely to report concerning online interactions to adults they trust and who they believe will respond helpfully rather than punitively. Create a clear message that they can come to you with anything uncomfortable they encounter online without judgment.

When they do report something, thank them for trusting you, respond calmly, and focus on helping them rather than blame.

Gaming Safety

Online games provide social interaction that can be genuinely positive but also expose children to adult players and sometimes predatory behavior.

Review the communication features of games your children play. Disable or restrict in-game chat for younger children. Know who they are playing with. Be aware of in-game purchases and set clear expectations.`);

update('SI Module 8: Digital Footprint Awareness', `Your digital footprint is the collection of data created by your online activities. It includes everything you deliberately share as well as data collected without your direct action. Understanding the scope of your footprint, who has access to it, and how to manage it gives you greater control over your digital identity and privacy.

Active vs Passive Footprint

Your active digital footprint consists of things you intentionally put online: social media posts, comments, reviews, photos, forum contributions, professional profiles, and information you provide when creating accounts.

Your passive digital footprint is created without your direct action: browsing history collected by websites, location data collected by apps, purchasing behavior from loyalty programs, traffic and search data, cookies and tracking pixels, and data inferred from your behavior rather than explicitly provided.

The passive footprint is typically much larger and more revealing than most people realize. Aggregated behavioral data reveals patterns about your health, relationships, financial situation, and daily routines that you have never explicitly disclosed.

Data Retention and Permanence

Once information is online, assuming you can fully remove it is unrealistic. Cached copies exist. Search engines index pages. Web archives like the Wayback Machine preserve historical snapshots. Screenshots and shares persist independently.

Content you post assuming it will be seen only by friends can be screenshot and shared widely. Old accounts you no longer use retain data unless you explicitly delete them.

Searching for Your Own Footprint

Regularly searching for your own name in search engines reveals what is publicly visible about you. Search with and without quotes, include your location or employer in some searches, and check image search results.

Search your email addresses. Breached databases that include your email are often findable in search.

Review social media profiles from a logged-out state or in a private browser window to see what is publicly visible to strangers.

Check data broker sites for your information. Search Spokeo, BeenVerified, Whitepages, and similar sites for your name.

Reducing Your Footprint

Account deletion removes data and reduces future data collection from services you no longer use. Delete, not just deactivate, accounts where possible.

Data broker opt-outs request removal from data broker databases. Most reputable brokers comply with opt-out requests, though the process is manual and tedious for the hundreds of brokers that may have your data. Services like DeleteMe and Privacy Bee automate this process.

Minimum information sharing limits what can be collected. Provide only required information to services. Use aliases, temporary email addresses, and virtual phone numbers for services that do not warrant your real details.

Professional Digital Presence

For most people, some digital presence is professionally advantageous. LinkedIn profiles, professional websites, and published work create a controlled professional identity.

Intentional professional presence allows you to shape what appears when someone searches your name. Maintain awareness of what your professional profiles contain and ensure they present you as you wish to be professionally known.`);

update('SI Module 9: Recognizing Online Scams', `Online scams are extraordinarily diverse in their specific forms but remarkably consistent in their underlying mechanisms. They all rely on manipulating human psychology to get victims to take actions against their interests. Understanding these mechanisms and recognizing the warning patterns makes you significantly harder to scam.

The Psychology of Scams

Scammers exploit predictable human responses consistently. Urgency prevents careful thinking. An offer that expires in 10 minutes or a warning that requires immediate action bypasses the critical evaluation you would apply given more time.

Authority exploits compliance with perceived authority figures. Scammers impersonate banks, government agencies, law enforcement, executives, and technical experts.

Fear of loss makes people act impulsively. Threatening that your account will be closed, your benefits stopped, or that you face arrest activates loss aversion in ways that impair rational decision-making.

Social proof implies that others have already done what they want you to do. Fake reviews, fabricated success stories, and claims that your friends have already participated all use social norms to lower your guard.

Greed offers unexpected windfalls. Prize winnings, investment returns, inheritance, and unexpected financial windfalls trigger excitement that overrides skepticism.

Common Scam Categories

Romance scams build fake romantic relationships over weeks or months before the scammer introduces a financial crisis. Victims face embarrassment on top of financial loss that prevents them from reporting. Red flags include always having reasons they cannot meet in person and eventually asking for money.

Tech support fraud involves unsolicited contact claiming your computer has a problem. They want remote access to your device and payment for fake support services. Microsoft, Apple, and legitimate tech companies never cold-call about computer problems.

Investment fraud promises extraordinary returns. Cryptocurrency investment scams, pig butchering schemes that build trust over time before introducing an investment opportunity, and pyramid schemes combine the psychological appeal of financial gain with fabricated legitimacy.

Lottery and prize scams notify you that you have won something you did not enter. Claiming the prize requires payment of taxes or fees. No legitimate prize requires upfront payment.

Government impersonation uses tax authorities or law enforcement to create fear of serious consequences. Real government agencies communicate primarily by mail and never demand immediate payment by gift card.

Red Flags Across All Scam Types

Requests for payment via gift card, wire transfer, cryptocurrency, or Zelle are the clearest red flag. These payment methods are difficult or impossible to recover and are preferred by scammers precisely because of this.

Unsolicited contact about problems you did not know you had, or winnings for contests you did not enter, warrant extreme skepticism.

Requests for secrecy from family members is a major warning sign. Legitimate transactions do not require secrecy from the people who care about you.

Pressure to act immediately without time to verify is a manipulation technique, not a legitimate requirement.`);

update('SI Module 10: Managing App Permissions', `Mobile and desktop applications routinely request access to device capabilities and personal data beyond what they need to function. Managing these permissions protects your privacy, reduces your attack surface, and limits the damage a compromised or malicious application can cause.

Why Permissions Matter

Applications with excessive permissions collect data you have not knowingly shared, create privacy risks through unnecessary data collection, represent a larger attack surface if the application is compromised or turns malicious, and may share your data with third parties beyond the original app developer.

An app with access to your contacts, location, camera, and microphone has considerable visibility into your life. Granting these permissions to every app that requests them aggregates into significant privacy exposure.

The least privilege principle means granting only what is genuinely needed, limiting what can go wrong when an application behaves poorly or is compromised.

Common Permission Categories and When They Are Legitimate

Location: Apps with obvious location functionality like maps and navigation need this. Games, flashlight apps, and productivity tools generally do not need location.

Camera: Camera apps, QR code scanners, video calling apps, and document scanners legitimately need camera access. Be cautious about camera permission requests from apps without obvious camera functionality.

Microphone: Voice assistants, voice messaging, transcription, and video calling apps need microphone access. Be skeptical about requests from apps without obvious voice functionality.

Contacts: Communication apps, email clients, and calling apps legitimately need contact access. Many apps request contacts for social graph building or to send invites on your behalf without clear disclosure.

SMS: Two-factor authentication apps and communication apps need SMS access. Be cautious about other apps requesting SMS access as it can be used to intercept authentication codes.

Reviewing and Managing Permissions on Android

Go to Settings, Apps, select an app, and look at Permissions. Android's Permission Manager in Settings, Privacy, Permission Manager shows all apps grouped by permission type, making it easy to see every app that has camera access or location access.

Android supports location precision settings allowing approximate location instead of precise.

Reviewing and Managing Permissions on iOS

Go to Settings and scroll down to the app to review what it is allowed to access. Settings, Privacy and Security shows each permission category with a list of apps that have requested or been granted access.

iOS supports location precision and allow once options for location, letting you grant access only for the current use without persistent permission.

Desktop Application Permissions

Windows Settings, Privacy and Security shows which apps have access to camera, microphone, location, contacts, and other sensitive resources. macOS System Settings, Privacy and Security provides similar per-app permission controls.

Browser permissions for web applications control which sites have access to camera, microphone, location, and notifications. Review these regularly in browser settings.

The Permission Review Process

When installing a new app, pay attention to permission requests during setup and consider whether they make sense for the app's stated purpose. Deny permissions that do not align with the app's function.

Periodically audit permissions for all installed apps. Remove apps you no longer use. Unused apps with permissions are an attack surface that provides no benefit.`);

update('DS Module 1: Securing Windows 10 and 11', `Windows includes a comprehensive set of security features that many users leave at default settings or disable for convenience. Taking the time to configure these features properly transforms the security posture of any Windows device.

User Account Configuration

Running daily computing tasks as a standard user rather than an administrator is one of the most impactful security decisions for Windows. Administrator accounts can install software, modify system files, and change security settings. Standard accounts cannot.

When malware infects an administrator account, it automatically inherits administrator privileges, allowing it to install persistently, modify security software, and spread. Malware infecting a standard account is significantly constrained by what the account can do.

Create a dedicated administrator account used only for system administration tasks. Use a standard account for everyday computing: browsing, email, office work, and entertainment.

Windows Defender and Security Features

Windows Defender is a capable real-time protection tool that receives regular updates. Ensure Defender is enabled and up to date through Windows Security, Virus and Threat Protection.

Tamper Protection prevents malware from disabling Windows Defender. Enable it in Windows Security, Virus and Threat Protection, Virus and Threat Protection Settings, Manage Settings.

Controlled Folder Access protects important folders from ransomware by allowing only trusted applications to modify files in protected locations. Enable it in Windows Security, Virus and Threat Protection, Ransomware Protection.

Windows Defender Firewall blocks unsolicited inbound connections and should be enabled for all network profiles.

Windows Update and Patching

Enable automatic updates through Settings, Windows Update. Security updates should install promptly because they address actively exploited vulnerabilities.

Feature updates that install major new versions of Windows can be deferred briefly to allow initial bugs to be resolved, but should not be deferred indefinitely.

BitLocker Full Disk Encryption

BitLocker encrypts your entire drive, protecting data if the device is lost or stolen. Without BitLocker, someone with physical access to your device can remove the storage drive and read all your files.

Enable BitLocker through the BitLocker Drive Encryption panel in Control Panel or through the context menu when right-clicking your C: drive. Save the recovery key securely outside the device being encrypted.

Secure Boot and BIOS Security

Secure Boot is a UEFI feature that verifies the bootloader's digital signature before allowing it to execute, preventing the loading of unauthorized bootloaders. Verify Secure Boot is enabled in your BIOS settings.

Set a BIOS password to prevent unauthorized changes to BIOS settings. This is particularly important for laptops that might be stolen.

Windows Hello and Authentication

Windows Hello provides biometric authentication using face recognition or fingerprint reading, backed by a PIN. Configure Windows Hello through Settings, Accounts, Sign-in Options.

Enable the requirement to sign in when waking from sleep. In Settings, Accounts, Sign-in Options, set Require sign-in to immediately or when waking from sleep.

Privacy Settings Review

Review app permissions in Settings, Privacy and Security. Disable permissions for applications that do not need camera, microphone, location, or contact access for their function.

Review diagnostic data settings and adjust telemetry to the minimum required level. Configure your DNS settings to use a security-focused provider as described in the network security modules.`);

update('DS Module 2: Securing Android Devices', `Android's open ecosystem provides great flexibility but also creates unique security challenges. Understanding Android-specific security features and threats allows you to configure your device for appropriate protection.

The Android Security Model

Android uses a permission-based security model where each application runs in its own sandbox, isolated from other applications and system resources. Applications can only access device features and data they have been explicitly granted permission to use.

Application sandboxing limits the damage a malicious application can do. It cannot read other applications' data, cannot access system files, and cannot make system changes without explicit permissions.

Google Play Protect scans applications in the Play Store and on your device for malware. While not perfect, it provides meaningful baseline protection and removes known malicious apps from devices.

App Installation Sources

Install applications only from the Google Play Store for everyday use. The Play Store's review process and Play Protect scanning, while imperfect, significantly reduce the malware risk compared to sideloading.

Sideloading refers to installing applications from outside the Play Store, which are APK files downloaded from websites. The Android setting Install unknown apps controls which applications can install other apps. This setting should be disabled except when you have a specific legitimate use case and trust the source.

Operating System Updates

Keep Android updated. Google releases monthly security patches addressing vulnerabilities in the Android operating system. Apply these updates promptly.

Different manufacturers have different update policies. Google Pixel devices receive updates fastest and for the longest period. When an Android device no longer receives security updates, it becomes progressively more vulnerable to known exploits.

Authentication and Screen Lock

Enable a strong screen lock. A PIN of 6 or more digits or a passphrase provides meaningful protection. Avoid pattern locks which can be guessed from screen smudges, and 4-digit PINs which provide limited protection against dedicated attacks.

Biometric authentication like fingerprint or face is convenient and provides reasonable protection against casual theft, though it can be compelled in certain legal situations where a PIN cannot. Use biometrics backed by a PIN.

Configure the lock timeout to a short period so your screen locks quickly when you put the device down.

Device Administration and Find My Device

Enable Find My Device through Google or your device manufacturer's service. This allows you to locate, lock, and remotely wipe your device if it is lost or stolen.

Review device administrator apps in Settings, Security. This list should contain only things you recognize and trust. Malicious apps sometimes add themselves as device administrators to prevent removal.

Application Permission Audit

Review application permissions periodically. Pay particular attention to apps with SMS access, as this can be used to intercept two-factor authentication codes.

Review apps with Accessibility access, which provides broad device access and is exploited by certain malware. Only accessibility tools you intentionally installed and use should appear here.

Network Security

Use encrypted Wi-Fi where possible and avoid entering sensitive information on unencrypted connections. Be cautious about connecting to public Wi-Fi without a VPN. Disable Wi-Fi and Bluetooth when not actively using them.`);

update('DS Module 3: Securing iOS Devices', `iOS is one of the more secure consumer operating systems available, with strong application sandboxing, strict App Store review, and built-in privacy features. However, the security of any device depends significantly on how it is configured.

The iOS Security Foundation

Apple's security model enforces several principles that significantly limit attack surface. Applications are strictly sandboxed and cannot access data from other applications or system files without explicit permission. The App Store review process applies security and privacy standards to published applications.

iOS uses a secure enclave, a dedicated security processor, to store sensitive data like biometric templates, encryption keys, and Apple Pay credentials. This data cannot be accessed by the processor running iOS, providing strong protection even if the operating system is compromised.

Full disk encryption is enabled automatically on all iOS devices when a passcode is set. The encryption keys are stored in the secure enclave and cannot be extracted without the device passcode.

Authentication Configuration

Enable Face ID or Touch ID for convenient biometric authentication. Back this up with a 6-digit or alphanumeric passcode. A longer alphanumeric passcode provides stronger protection than a 6-digit PIN.

Enable the Erase Data option in Settings, Face ID and Passcode, which wipes the device after 10 failed passcode attempts. This protects against brute-force attacks but ensure you have a backup before enabling it.

Set Require Passcode to immediately so the device locks as soon as the screen turns off.

iCloud and Backup Configuration

Enable iCloud Backup to maintain up-to-date backups of your device. If your device is lost, stolen, or damaged, iCloud backup allows restoration to a new device.

Enable Advanced Data Protection if available in your region. This feature uses end-to-end encryption for iCloud data, meaning only you can access it and Apple cannot read it.

Use a strong unique password for your Apple ID. Your Apple ID provides access to iCloud data, Find My iPhone, App Store purchases, and account recovery.

Find My iPhone

Enable Find My iPhone in Settings. This allows you to locate your device, play a sound on it, remotely lock it, and remotely erase it.

Enable Send Last Location, which sends the device's last known location to Apple before the battery dies.

App Permissions and Privacy

Review application permissions in Settings, Privacy and Security. iOS provides per-app and per-category control over camera, microphone, location, photos, contacts, and other sensitive resources.

Location services can be configured per-app with options including never, ask next time, while using the app, and always. Most apps that need location should be set to while using the app rather than always.

iOS Updates

Install iOS updates promptly. Apple releases security updates addressing vulnerabilities including zero-day exploits being actively used against iOS devices. Enable automatic updates in Settings, General, Software Update, Automatic Updates.

Safari and Browsing

Safari has strong built-in privacy features including Intelligent Tracking Prevention that limits cross-site tracking. Enable Fraudulent Website Warning in Safari settings for protection against known phishing sites. Review and clear browsing history and website data periodically.`);

update('DS Module 4: Laptop Security Best Practices', `Laptops combine the computing power of desktop computers with the physical vulnerability of portable devices. They are stolen, lost, left in public spaces, used in insecure locations, and carry sensitive data that is simultaneously more valuable and harder to protect than data on stationary office equipment.

Physical Security

The most immediate risk of laptop theft or loss is unauthorized access to the data on it. Full disk encryption is the essential foundation. Without it, physical possession of the laptop means access to everything on it.

Screen locks that engage quickly after inactivity prevent shoulder surfers from seeing your work and prevent casual access if you step away briefly. Configure your laptop to lock after one to five minutes of inactivity.

Cable locks provide physical security in fixed locations. A laptop security cable locks the laptop to a desk, deterring opportunistic theft in offices, libraries, and similar locations.

Never leave your laptop unattended in public spaces even briefly. The time needed to steal an unattended laptop is seconds.

Visual Privacy

Consider what is visible on your screen in your working environment. In open offices, coffee shops, and public transport, colleagues and strangers can see your screen. For sensitive work, position yourself against a wall to limit who can see your screen from behind, or use a privacy screen filter.

Privacy screens are physical filters that make the display unreadable from an angle. They are worth considering if you regularly work in public with sensitive information on screen.

Be conscious of sensitive information visible in video calls. Others in the video can see your screen if you share it, and your background may reveal your physical location or sensitive documents.

BIOS Security

Set a BIOS password to prevent unauthorized changes to BIOS settings including disabling Secure Boot. On a laptop, BIOS-level access can allow bypassing operating system security controls.

Enable Secure Boot in your BIOS settings to prevent unauthorized bootloaders from loading before Windows.

Power and Battery Security

Configure your laptop to require a password on waking from sleep or hibernation. This ensures that a brief absence does not leave your session accessible.

Be aware of the risks of leaving a laptop plugged in and unattended in a shared location. A connected laptop provides more attack opportunity than one that is locked away.

Traveling With Laptops

When traveling, be aware of border security requirements in different jurisdictions. Some countries have the legal authority to compel device examination. Consider what data is on the device and whether sensitive information should be transported or accessed via cloud from a clean device.

In hotels, use the in-room safe for your laptop or keep it with you. Hotel rooms are not secure environments.

When working in public spaces like airports and coffee shops, be particularly vigilant about shoulder surfing and about leaving your device unattended even briefly.`);

update('DS Module 5: Smart Home and IoT Security', `Smart home devices including cameras, doorbells, thermostats, and voice assistants often have poor default security. The combination of weak default credentials, infrequent security updates, and long operational lifespans creates a challenging security environment that requires intentional management.

Why IoT Devices Are Particularly Risky

IoT devices are manufactured with a focus on cost and ease of use rather than security. Default credentials are frequently the same across millions of identical devices and are published in product documentation and searchable databases.

Firmware updates for IoT devices are released infrequently compared to computers and phones. Some devices receive no security updates at all after initial release. A smart camera purchased years ago may have unpatched vulnerabilities that are now publicly known and actively exploited.

IoT devices have long operational lifespans. People keep smart thermostats and security cameras for years or decades. This means the security gap between the device's original security posture and current threat landscape grows continuously.

These devices often lack user interfaces that make security configuration visible or accessible. You cannot easily see whether your smart refrigerator's firmware is current.

Securing IoT Devices

Change default credentials immediately when setting up any new IoT device. The default username and password are the same for every device of that model and are documented online. Changing them to strong unique credentials is the single most important step.

Enable automatic firmware updates where the option exists. Check manufacturer websites periodically for firmware updates for devices that do not self-update.

Disable features you do not use. Remote access from outside your home network, UPnP, and other convenience features increase attack surface. If you do not use remote access, disable it.

Review which IoT devices have microphones and cameras. Understand when they are active and what data they send to cloud services.

Network Segmentation for IoT

Place all IoT devices on a separate network segment such as a guest network that provides internet access but cannot communicate with your computers and sensitive devices on the main network.

This means a compromised smart camera cannot be used to attack your laptop. It may still be used for internet-based attacks or to spy through its own camera, but your local sensitive data remains protected.

Consider a dedicated IoT VLAN if your router supports it. This provides stronger isolation than a simple guest network.

Monitoring IoT Devices

Maintain an inventory of every IoT device on your network, including its default and changed credentials, firmware version, and when you last checked for updates.

Review the traffic your IoT devices generate if your router provides per-device statistics. Unusual traffic patterns from a device that should be mostly idle may indicate compromise or unexpected data collection.

Research known vulnerabilities for your specific devices periodically. Security researchers regularly discover and publish vulnerabilities in consumer IoT products.`);

update('DS Module 6: USB and External Storage Security', `USB devices present multiple security risks including malware delivery, data exfiltration, and hardware-based attacks. Understanding these risks and implementing appropriate controls protects both the data on your devices and the integrity of the systems you use.

USB Threat Categories

Malware delivery through USB drives is one of the oldest and most persistent attack vectors. Malicious code can execute automatically when a drive is connected, can be hidden in files that appear normal, or can arrive through applications installed from a drive.

Data exfiltration uses USB devices to copy sensitive data from computers to portable storage. Unauthorized copying of proprietary information, customer data, or intellectual property through USB is a significant insider threat vector.

Hardware attacks use USB devices that contain malicious electronics rather than just storage. The USB Rubber Ducky and similar HID Human Interface Device attack tools look like ordinary flash drives but register as keyboards. They then automatically type malicious commands at speeds no human could match, executing attack sequences in seconds before any defense can respond.

Juice jacking uses modified public USB charging ports to deliver malware or steal data while your device charges. The USB standard carries both power and data on the same physical connector.

Protection Strategies

Never connect unknown USB devices to any computer. This includes drives found in public spaces, drives received in unsolicited packages, and drives given to you by people you do not know. The enticing label on a found USB drive is a social engineering technique.

Use USB data blockers when charging from public USB ports. A USB data blocker passes power but physically disconnects the data pins, allowing safe charging from public ports without data exposure.

Enable USB device control through your security software if available. Enterprise endpoint protection solutions can restrict which USB devices can connect based on device type, manufacturer, or specific device identifiers.

Encrypt sensitive data on external drives. If an encrypted drive is lost or stolen, the data remains protected. BitLocker To Go in Windows and VeraCrypt both provide external drive encryption.

Data on Removed Drives

Be aware that connecting an external drive to a computer leaves traces. File access timestamps, thumbnail caches, recently used file lists, and other metadata on both the drive and the host computer record what files were accessed.

Proper Disposal of Storage Media

Standard deletion and even formatting do not reliably destroy data on storage media. Deleted files can be recovered with freely available tools.

Proper data wiping requires software that overwrites every sector of the drive with random data, multiple times for highest security. DBAN for hard drives and manufacturer secure erase tools for SSDs are appropriate choices.

For highly sensitive data, physical destruction of the storage media provides absolute certainty that data cannot be recovered. Hard drive shredders and degaussers are available through professional data destruction services.`);

update('DS Module 7: Software Updates and Patch Management', `Unpatched software is one of the most common attack vectors in both home and enterprise environments. Understanding why updates matter, how to prioritize them, and how to maintain current software systematically reduces your exposure to known vulnerabilities.

Why Patching Matters So Much

When a security vulnerability is discovered in software, there is a window of time between discovery and when affected systems are patched. During this window, attackers who learn of the vulnerability can exploit it against any unpatched system.

For zero-day vulnerabilities where the software vendor does not yet know about the flaw, no patch exists and users have no defense beyond network controls and behavioral detection. But for known vulnerabilities with available patches, every day a system remains unpatched is a day of unnecessary risk.

Many of the most significant real-world attacks including WannaCry ransomware, NotPetya, and numerous others exploited vulnerabilities that had patches available weeks or months before the attacks occurred. The victims simply had not applied them.

Priority for Updates

Internet-facing applications that process untrusted content are the highest priority for patching. Browsers, browser plugins like PDF readers and Java, email clients, and document editors are constantly exposed to potentially malicious content and are heavily targeted by attackers.

Operating system updates address vulnerabilities in the foundational software that everything else runs on. These should be applied promptly.

Applications that are not internet-facing and do not process untrusted content, like desktop calculators or productivity tools used only with your own files, are lower priority but should still be maintained.

Enabling Automatic Updates

For operating systems, enable automatic updates and configure them to install security updates promptly. Brief deferrals for feature updates are reasonable but security patches should not be deferred.

For browsers, enable automatic updates. Browsers release security updates frequently and running an outdated browser leaves you exposed to known exploits.

For other applications, enable automatic updates where available. Use notification settings to be alerted when updates are available for applications that require manual installation.

Removing Unused Software

Each installed application is a potential attack surface. Unpatched vulnerabilities in software you never use are just as exploitable as those in software you use daily.

Periodically review installed applications and remove those you no longer need. Pay particular attention to plugins and extensions for browsers which can have vulnerabilities independent of the browser itself.

Software Inventory

For environments with multiple computers, maintaining a software inventory helps identify what software needs to be monitored and updated. Tools like WSUS for Windows environments, and third-party patch management tools, provide centralized visibility and control over software versions across a fleet of devices.`);

update('DS Module 8: Screen Lock and Authentication', `Screen locks are the first physical security barrier for your devices. They protect your data when you step away from your computer, when your device is lost or stolen, and in shared environments where others might access your session. Configuring authentication correctly balances security with usability.

Screen Lock Fundamentals

A screen lock that engages quickly after inactivity ensures that brief absences do not leave your device accessible. Configure automatic lock to engage after one to five minutes for devices used in office or public environments. At home with no visitors, a longer timeout may be acceptable.

The requirement to authenticate when waking from sleep should always be enabled. A device that requires a password to log in but does not require it after screen lock provides much weaker protection.

On mobile devices, configure the lock screen to engage immediately when the screen turns off. The brief convenience of not having to authenticate immediately is far outweighed by the security risk.

Authentication Methods and Their Security

Passwords are the baseline authentication method. Strong passwords, meaning long and random, stored in a password manager, provide good security. Weak passwords like the device PIN being the same as other PINs, or a password based on your name or birthday, provide minimal protection.

PINs are more convenient than full passwords for frequent authentication on mobile devices. A 6-digit PIN provides reasonable protection for most use cases. Avoid 4-digit PINs on devices containing sensitive information.

Biometric authentication including fingerprint and facial recognition provides strong convenience. Biometrics are secure against casual theft but can be compelled by legal authority in some jurisdictions while PINs and passwords cannot. Understanding this distinction matters for high-risk users.

Windows Hello combines biometric convenience with the security of the TPM Trusted Platform Module. Credentials are stored in the secure hardware enclave and cannot be extracted. The PIN is device-specific, meaning it only works on that specific device and has no value to an attacker who does not have the physical device.

Pattern Authentication Weaknesses

Swipe patterns on Android devices leave visible traces on screens that can be read. Pattern complexity is also limited by the difficulty of creating and remembering complex patterns, leading most users to choose simple patterns. Prefer PIN or biometric authentication over patterns.

Environment-Specific Considerations

In shared or public environments, be aware of shoulder surfing when entering authentication credentials. Position yourself so others cannot observe your PIN or password entry.

In high-security environments, consider whether biometric authentication is appropriate given the legal compellability concerns.

For devices used by multiple people such as family computers, use separate user accounts for each person rather than sharing a single account. This maintains individual privacy and allows appropriate permission levels for each user.`);

update('DS Module 9: Antivirus and Endpoint Protection', `Modern endpoint protection goes beyond traditional signature-based antivirus to include behavioral analysis, exploit protection, ransomware rollback, and network filtering. Understanding how these tools work and their limitations helps you make better decisions about endpoint security.

Traditional Antivirus and Its Limitations

Traditional antivirus software works by maintaining a database of known malware signatures and scanning files for matches. When a file matches a known malware signature, it is flagged and quarantined.

This approach has a fundamental limitation: it can only detect malware that has been seen before and added to the signature database. New malware, or modified versions of existing malware designed to evade signatures, can pass through signature-based detection undetected.

Signature databases must be kept current to be effective. Outdated signatures miss recently discovered threats. Enable automatic definition updates and ensure your security software is actually updating regularly.

Behavioral Detection

Modern endpoint security products add behavioral analysis that watches how programs behave rather than just what they look like. A program that attempts to encrypt hundreds of files rapidly, modify system processes in unusual ways, or establish connections to known malicious IP addresses triggers behavioral alerts regardless of whether the program matches any known signature.

This approach can detect new and modified malware based on what it does rather than what it looks like. Behavioral detection does produce more false positives than signature scanning, since legitimate programs sometimes exhibit behaviors that look suspicious in isolation.

Windows Defender as a Baseline

Windows Defender Antivirus provides solid baseline protection for Windows devices. It has significantly improved over the years and performs competitively with many commercial antivirus products in independent testing.

For most home users, Windows Defender supplemented by Malwarebytes for periodic second-opinion scanning provides adequate protection. Enable Windows Defender and ensure it is up to date.

Never Disable Security Software

No legitimate software requires antivirus or security software to be disabled for installation. Any application that requests you disable your security software is either poorly designed or malicious. If a legitimate application has a genuine conflict with security software, the correct resolution is to create a specific exception, not to disable protection entirely.

Endpoint Detection and Response

Enterprise environments benefit from Endpoint Detection and Response tools that go beyond detection to provide continuous monitoring, detailed activity logging, and investigation capabilities.

EDR solutions record what processes are running, what files they access, what network connections they make, and how they interact with other processes. This creates a detailed timeline of activity that security teams can use to investigate incidents and understand exactly what happened during a compromise.

The comprehensive logging also supports threat hunting, where security analysts proactively search for indicators of compromise in collected data rather than waiting for alerts.`);

update('DS Module 10: Device Disposal and Data Wiping', `Improperly disposed devices can leak sensitive personal and professional data to anyone who acquires them. Understanding how data persists on storage media and what is required to truly destroy it is essential for secure device lifecycle management.

Why Simple Deletion Is Insufficient

When you delete a file, the operating system removes the file's entry from the file system's directory structure but does not overwrite the actual data on the storage medium. The space occupied by the file is marked as available for future use, but the original data remains intact until that space is physically overwritten by new data.

Recovery tools can easily reconstruct deleted files by examining the raw storage medium for data patterns that match file structures. These tools are freely available and widely used by both legitimate data recovery professionals and people seeking to access discarded devices.

Standard formatting, both quick format and full format on older versions of Windows, does not securely erase data. A quick format only rewrites the file system structure without touching file content at all.

Secure Wiping Methods

Software-based secure wiping tools overwrite every sector of the storage medium with random data, making original content unrecoverable. For traditional hard drives, multiple passes of random data overwriting provide high confidence of data destruction.

DBAN Darik's Boot and Nuke is a widely used free tool for securely wiping traditional hard drives. It boots independently of the operating system and thoroughly overwrites the entire drive.

For solid state drives, software wiping is slightly more complex because SSDs use wear leveling that can cause data to persist in areas not reached by standard sequential overwrites. Use the manufacturer's secure erase utility or the ATA Secure Erase command for SSDs.

Modern Windows devices with BitLocker enabled can be securely wiped by deleting the BitLocker encryption key. Without the key, the encrypted data on the drive is permanently inaccessible even to specialized recovery tools.

Physical Destruction

For highly sensitive data, physical destruction of the storage medium provides absolute certainty. Hard drive platters must be physically destroyed to prevent data recovery. Shredding, degaussing, and disintegration are all used by professional data destruction services.

Professional services provide certificates of destruction that document the destruction process, useful for compliance purposes.

Mobile Device Disposal

Before disposing of a smartphone or tablet, sign out of all accounts to prevent the recipient from accessing your cloud services through the device. Perform a factory reset after signing out. On modern encrypted devices, factory reset removes the encryption key, making remaining data cryptographically unreadable.

Remove SIM cards and memory cards before disposal.

Computers and Laptops

For computers, boot from external media and run a secure wipe tool on the primary drive. Alternatively, encrypt the drive with BitLocker if not already encrypted, then perform a full format, which effectively secures the data by removing the encryption key.

Remove any accounts that are joined to organizational directories or cloud services before disposal. Ensure the device is no longer associated with your Apple ID, Google account, or Microsoft account.`);

update('PP Module 1: Understanding Data Brokers', `Data brokers collect, aggregate, and sell personal information including your name, address, phone number, relatives, income estimate, and political affiliation. They gather data from public records, social media, loyalty programs, and other sources. You can opt out from most data brokers individually or use paid services that automate removal requests.

What Data Brokers Are and What They Collect

Data brokers are companies whose primary business is the collection, aggregation, and sale of personal information. Unlike companies that collect data incidentally as part of their core service, data brokers exist specifically to traffic in personal information.

The data they collect is extensive. Name and aliases, current and historical addresses, phone numbers, email addresses, family member names and relationships, estimated income and net worth, property ownership, vehicle information, criminal and civil court records, political affiliation and voting history, purchasing behavior, social media profiles, and much more.

This data comes from multiple sources. Public records including property records, court records, voter registrations, and business filings are publicly accessible and systematically harvested. Social media profiles provide voluntary personal disclosures. Loyalty programs and purchase history are sold by retailers. Location data is purchased from app developers. Data from other data brokers is purchased and merged.

The resulting profiles are often surprisingly comprehensive, combining information from dozens of sources that most people never realized was being collected or aggregated.

Why This Creates Security Risks Beyond Privacy

Data broker profiles are not just a privacy concern. They create direct security risks. The personal information they contain is exactly what attackers need to conduct successful social engineering and targeted attacks.

A detailed profile enables convincing pretexts for vishing calls. An attacker who knows your relatives' names, your previous addresses, and your current employer can craft a story that sounds genuinely knowledgeable about you.

Data broker information provides ready answers to security questions. Mother's maiden name, childhood street, first car, and high school name are all findable through data broker profiles. This undermines security question-based account recovery across many services.

Spear phishing campaigns use data broker profiles to personalize messages with specific details that lower defenses and increase the likelihood that you will respond.

Reducing Your Data Broker Presence

Individual opt-out requests to each data broker are free but extremely tedious. There are hundreds of data brokers operating in various jurisdictions, each with their own opt-out process.

Automated removal services like DeleteMe, Privacy Bee, and Kanary submit opt-out requests on your behalf and repeat the process regularly since data can be re-collected from public sources after removal. These services charge monthly or annual fees but save significant time.

Reducing the data you generate going forward limits re-collection. This means using fake information where possible for online signups, using email aliases, opting out of data sharing by retailers, and minimizing social media information that is publicly visible.

The expectation should be reduction rather than elimination. Completely removing your data from all data brokers is not practically achievable. The goal is to reduce the depth and detail of profiles to make targeted attacks harder.`);

update('PP Module 2: Browser Privacy Settings', `Modern browsers collect extensive data by default. Configuring your browser to protect privacy reduces tracking, limits data collection, and reduces your exposure to certain attack vectors like malvertising.

Understanding What Browsers Collect and Share

Every website you visit can see your IP address, approximate location, browser type and version, operating system, screen resolution, and dozens of other device characteristics. Advertising networks and analytics services collect this information across many websites to build behavioral profiles.

Cookies store identifying information in your browser that is transmitted back to websites on subsequent visits. First-party cookies from the site you are visiting serve legitimate functions like keeping you logged in. Third-party cookies from other domains serve primarily to track you across different websites.

Browser fingerprinting collects the combination of your browser and device characteristics to create a unique identifier that persists even when cookies are deleted. Your specific combination of browser version, installed fonts, screen resolution, time zone, and dozens of other attributes creates a fingerprint that is often unique.

Configuring Privacy Settings in Your Browser

Block third-party cookies in your browser settings. In Chrome, go to Settings, Privacy and Security, Cookies and other site data. In Firefox, Enhanced Tracking Protection is enabled by default and blocks third-party tracking cookies.

Enable tracking protection features. Firefox's Enhanced Tracking Protection blocks known trackers, fingerprinters, and cryptominers. Brave has aggressive tracking protection enabled by default.

Use HTTPS-Only Mode. In Firefox this is in Settings, Privacy and Security. This prevents connections to HTTP sites without a warning, keeping your traffic encrypted.

Configure DNS over HTTPS to encrypt your DNS queries. In Firefox this is in Settings, Privacy and Security, scroll to DNS over HTTPS. This prevents your ISP from monitoring which domains you visit.

Review and revoke site permissions regularly. Go to browser settings and check which sites have been granted notification access, location, camera, microphone, and other sensitive permissions.

Choosing Privacy-Respecting Tools

Privacy-respecting search engines do not track your searches or build behavioral profiles. DuckDuckGo is the most well-known alternative and provides good search results without tracking. Brave Search uses its own independent index. Startpage shows Google results without passing your search to Google.

Privacy-focused browsers like Brave and Firefox with appropriate configuration provide stronger privacy defaults than Chrome or Edge. Brave has tracking protection and an ad blocker built in and enabled by default.

Content blockers like uBlock Origin block ads and trackers before they load. This is one of the highest-impact privacy interventions available for browsers, significantly reducing the number of companies that can track your browsing.

Browser Fingerprinting Mitigation

Reducing fingerprinting requires either using a browser specifically designed for it like Tor Browser, which standardizes fingerprinting characteristics across all users, or using browser extensions that introduce noise into fingerprinting requests.

Brave has fingerprinting protection built in that randomizes fingerprinting characteristics. Firefox with the privacy.resistFingerprinting setting enabled also reduces fingerprinting effectiveness.`);

update('PP Module 3: Privacy on Social Media', `Social media platforms are built on collecting and monetizing your data. Review privacy settings on every platform you use, limit the audience for your posts, disable location sharing in posts, review which apps have access to your accounts, opt out of ad personalization where possible, and understand that even deleted posts may have been saved by others.

How Social Media Platforms Monetize Your Data

Social media platforms generate revenue primarily through advertising. The more they know about you, the more they can charge advertisers for targeted access to you. This creates a fundamental incentive to collect as much data as possible and to design the platform to maximize your engagement and time on it.

The data collected goes far beyond what you explicitly post. Platforms track what you look at even if you do not interact with it. They track how long you view each piece of content. They record your location if you grant location permission. They may access your contacts if granted permission. They track you across the web through like buttons and share buttons embedded on other websites.

This data is used to build a detailed model of your interests, beliefs, relationships, and behaviors. This model is used to personalize the content you see, to serve targeted advertising, and in some cases to influence your behavior and beliefs.

Privacy Configuration on Social Platforms

Review privacy settings on every platform you use. The location varies by platform but is typically in Settings, Privacy or Settings, Account. Configure the following where available.

Post audience should default to Friends or Connections rather than Public for personal accounts. Public posts are indexed by search engines and visible to anyone on the internet indefinitely.

Profile visibility controls what information strangers can see. Your email address, phone number, birth date, current location, and employer are often set to public by default. These should be restricted to friends or hidden entirely.

Location in posts: Disable automatic location tagging. Even if you manually remove location data, check settings for automatic geotagging.

Story and status visibility: Configure who can see your stories and status updates separately from regular posts if the platform provides this.

Search visibility: Control whether your profile appears in search results, both within the platform and in external search engines.

Managing Third-Party App Access

Every app you connected to your social media account through the Sign in with platform button retains ongoing access to your account data unless you revoke it.

Review connected apps in account security settings on each platform. Most platforms list every connected app with the permissions it holds and the date of last access. Remove any you do not actively use.

Be selective about granting new app access. When an app requests access to read your posts, post on your behalf, or access your friends list, consider whether that access is genuinely necessary for what you are trying to accomplish.

The Permanence Problem

Content you post on social media should be considered permanent. Even if you delete a post, it may have been screenshot by other users, cached by search engines, archived by third-party tools, or stored in the platform's own systems for longer than you expect.

Consider the long-term implications of posts before making them. Content that seems appropriate in a current context may be inappropriate or damaging in a different future context.`);

update('PP Module 4: Secure Messaging Apps', `Standard SMS messages are not encrypted and can be intercepted by carriers, law enforcement, and sophisticated attackers. End-to-end encrypted messaging apps like Signal ensure only the sender and recipient can read messages. Understanding the difference between transport encryption and end-to-end encryption, and reviewing the metadata a messaging app collects even when messages are encrypted, helps you choose appropriate tools for sensitive communications.

Why Standard SMS Is Not Private

SMS was designed in the 1980s and 1990s as a basic text transmission protocol without any security features. Messages are transmitted and stored in plain text by carriers.

Your carrier can read every SMS message you send and receive. They are required to provide this data to law enforcement with appropriate legal process in most jurisdictions. In many countries, carriers are required to retain SMS content for extended periods.

SMS messages are also vulnerable to interception through SS7 Signaling System 7 protocol attacks, where flaws in the telephone network protocol that routes calls and texts between carriers can be exploited to intercept messages. This attack is technically sophisticated but has been demonstrated against real targets including politicians and journalists.

SIM swapping attacks convince carriers to transfer your phone number to a SIM card controlled by an attacker. Once successful, the attacker receives all your SMS messages including two-factor authentication codes.

What End-to-End Encryption Means

End-to-end encryption means messages are encrypted on the sender's device using a key that only the recipient's device holds. The messaging platform stores and transmits encrypted ciphertext that it mathematically cannot decrypt.

This means neither the messaging service provider, nor your carrier, nor anyone who intercepts the transmission in between can read the message content. Only the device with the correct decryption key can do so.

Signal is the gold standard for end-to-end encrypted messaging. It uses the Signal Protocol, which has been independently audited and is considered cryptographically strong. Signal collects minimal metadata and stores very little data on its servers.

WhatsApp uses the Signal Protocol for message encryption but is owned by Meta and collects extensive metadata about who you communicate with and when.

iMessage provides end-to-end encryption for messages between Apple devices, but backups of messages in iCloud are not end-to-end encrypted by default unless Advanced Data Protection is enabled.

Understanding Metadata

Even when messages are encrypted, metadata reveals significant information. Metadata includes who you communicate with, how often, at what times, and the approximate size of messages.

A communication pattern that shows frequent contact with a lawyer, a doctor, a political organization, or a specific company reveals sensitive information about your legal situation, health, political involvement, and business activities without revealing a single word of your messages.

Signal collects minimal metadata. It stores only when you registered and when you last used the service. WhatsApp and most other messaging platforms collect and retain much more detailed metadata.

Choosing Appropriate Tools

For everyday communication with family and friends, iMessage and WhatsApp provide reasonable security for typical threat levels.

For sensitive communications including discussions of legal matters, health conditions, financial situations, or professional information you want to keep confidential, Signal provides stronger protection.

For journalists, activists, lawyers, doctors, and others with heightened privacy requirements, Signal should be the default choice for all sensitive communications.`);

update('PP Module 5: VPNs for Privacy', `VPNs shift trust from your ISP to the VPN provider. Choose providers with independently audited no-log policies, based in privacy-friendly jurisdictions, using open protocols like WireGuard or OpenVPN. Understand that a VPN does not provide anonymity, and that the VPN provider can see your traffic. For stronger anonymity, consider Tor.

The Privacy Case for VPNs

Your ISP can see everything you do online that is not encrypted. They can see which websites you visit through DNS queries and IP connections, even when the content of your HTTPS traffic is encrypted. They can see when and how long you visit sites.

ISPs in many countries sell this browsing data to advertisers. In the United States, ISPs can sell customer browsing data without explicit consent. In other jurisdictions, ISPs may be required to retain and provide traffic data to law enforcement.

A VPN prevents your ISP from building this profile. Your ISP sees only that you connected to a VPN server. The VPN provider sees your actual traffic instead.

The Privacy Shift

Using a VPN shifts the privacy concern from your ISP to the VPN provider. You are placing your trust in a different entity. The VPN provider can see everything your ISP previously saw. If the VPN provider keeps logs and shares them with third parties or law enforcement, your privacy may be no better than without a VPN.

This is why provider selection is so important for privacy-motivated VPN use. You need to choose a provider that you trust more than your ISP.

Key criteria for privacy-focused VPN selection include independently audited no-log policies, jurisdiction in countries with strong privacy laws and no mandatory data retention requirements, open-source and independently audited protocols, transparency reports that document legal requests received, and a history of demonstrating no-log policies under legal scrutiny.

Providers that have had their no-log policies verified under pressure, such as when served with law enforcement requests and genuinely unable to provide user data, provide stronger evidence of their commitment than marketing claims alone.

VPN Jurisdiction Matters

A VPN provider based in a country with mandatory data retention laws may be required to log user activity regardless of their stated policy. The Five Eyes intelligence sharing agreement between the United States, United Kingdom, Canada, Australia, and New Zealand means that providers in these countries face more extensive legal obligations than providers in other jurisdictions.

Providers based in Switzerland, Panama, Iceland, and Romania are often cited for their privacy-friendly legal environments.

What VPNs Do Not Protect

A VPN does not protect you from tracking by websites where you are logged in. Google, Facebook, and other services identify you by your account regardless of your IP address.

A VPN does not prevent browser fingerprinting, which identifies you by device characteristics regardless of IP address.

A VPN does not protect against malware on your device.

A VPN does not make you truly anonymous. Sophisticated adversaries including government agencies have techniques to de-anonymize VPN users. For activities that require genuine anonymity, Tor provides stronger protection despite the significant performance trade-off.`);

update('PP Module 6: Email Privacy', `Standard email is not private by design. Emails are stored in plain text accessible to the provider, and messages pass through multiple servers in transit. Consider using end-to-end encrypted email services like ProtonMail, use email aliases to protect your real address, and be aware that even encrypted email metadata reveals who you communicate with.

Why Standard Email Is Not Private

Email was designed in the 1970s for reliability and interoperability. Privacy was not a design consideration. The SMTP protocol that transmits email was designed to send messages across the internet in plain text. TLS encryption has been added to protect messages in transit between servers, but this is transport encryption, not end-to-end encryption.

Your email provider stores your messages on their servers. Google can read your Gmail. Microsoft can read your Outlook. If law enforcement presents a valid court order to your email provider, the provider can and in most jurisdictions must provide your email content.

Email metadata, who you email, when, and how often, may be retained even when message content is eventually deleted. Metadata reveals extensive information about your relationships, activities, and interests even without revealing message content.

Email also passes through multiple servers in transit. The sending server, the receiving server, and any relay servers in between all handle your message. Each of these is a potential point of access.

End-to-End Encrypted Email

End-to-end encrypted email ensures that messages are encrypted on the sender's device and can only be decrypted by the recipient's device. The email provider stores only encrypted ciphertext they cannot read.

ProtonMail provides end-to-end encryption for messages between ProtonMail accounts. Messages to external email addresses are not end-to-end encrypted unless the recipient uses PGP encryption. ProtonMail is based in Switzerland and subject to Swiss privacy law.

Tutanota is another end-to-end encrypted email provider with strong privacy credentials. Based in Germany and subject to European privacy regulations.

For communicating with people who do not use an encrypted email provider, PGP Pretty Good Privacy allows you to encrypt messages using the recipient's public key. The recipient decrypts with their private key. Setting up PGP requires both parties to generate keys and exchange public keys.

Email Aliases for Privacy

Email aliases are forwarding addresses that deliver to your real inbox while hiding your actual email address. When you sign up for a service using an alias, the service has your alias address but not your real one.

Services like SimpleLogin, AnonAddy, and Firefox Relay generate unique aliases for each service. If a service is breached and your alias address appears in spam, you can identify exactly which service was the source. You can then disable that alias to stop the spam without changing your real email address.

Using aliases also reduces the cross-service tracking that occurs when companies share or sell email address lists.

Email Metadata Remains Revealing

Even with end-to-end encrypted email content, metadata is often not encrypted. Signal stands apart from email in this respect by minimizing metadata collection. Email metadata including sender, recipient, timestamp, and subject line is typically transmitted and stored in accessible form even by encrypted email providers.

For the most sensitive communications, Signal or another end-to-end encrypted messenger with minimal metadata collection provides stronger privacy than encrypted email.`);

update('PP Module 7: Location Privacy', `Your location is one of the most sensitive pieces of personal data. Apps, websites, and carriers all collect location data. Disable location services for apps that do not genuinely need it, use precise versus approximate location settings, regularly audit location history in Google or Apple accounts, and be aware that your location can be inferred even without GPS through Wi-Fi and cell tower data.

Why Location Data Is So Sensitive

Location data reveals where you live, where you work, which medical facilities you visit, which religious institutions you attend, who you spend time with, and your daily patterns and routines. This information can reveal your health conditions, religious beliefs, political affiliations, and personal relationships through inference.

Over time, accumulated location data creates a comprehensive picture of your life. A single location data point is relatively innocuous. Thousands of data points over weeks and months reveal everything about how you live.

Law enforcement has used location data extensively for criminal investigations. Civil litigants use location data in divorce and custody proceedings. Insurance companies use location data to adjust rates. Employers have used location data to monitor remote workers.

The Commercial Location Data Industry

Many mobile apps collect and sell location data as a revenue stream. Apps that have no obvious need for your location may request it for advertising and data monetization purposes.

Location data brokers aggregate precise location data from many apps and sell it commercially. This data has been used to track the movements of specific individuals, identify who attended specific events, and reveal sensitive personal information.

How Location Is Collected Without GPS

GPS is the most accurate location technology but requires explicit permission and is relatively battery-intensive. Apps and services use several other methods to infer location, sometimes without explicit location permission.

Wi-Fi positioning uses databases of known wireless access point locations. When your device scans for available networks, even without connecting, the access points visible provide a location fix accurate to within a few meters in dense urban areas.

Cell tower triangulation uses the signal strength from multiple cellular towers to estimate location. Less precise than GPS but functional and always active when you have cellular service.

Bluetooth beacon positioning uses fixed Bluetooth transmitters in stores, airports, and other locations to provide indoor positioning.

IP address geolocation provides city-level location accuracy based on your internet connection's IP address.

Managing Location Privacy

Review location permissions for every app on your device. For iOS, go to Settings, Privacy and Security, Location Services. For Android, go to Settings, Privacy, Permission Manager, Location.

For each app, consider whether it genuinely needs location and at what precision. Maps and navigation need precise location. Food delivery needs location for delivery. Most other apps have much weaker location needs.

Prefer While Using The App over Always for apps that need location. While Using The App prevents background location collection that builds the detailed movement profiles most concerning from a privacy perspective.

Prefer Approximate Location over Precise Location for apps where the specific address is not necessary. An app that helps you find nearby restaurants needs general area location, not your precise GPS coordinates.

Regularly review and clear location history in your Google account through myaccount.google.com and in your Apple account through Apple Maps settings. These services retain historical location data that can be revealing if accessed.`);

update('PP Module 8: Financial Privacy', `Your financial data is extensively collected by banks, credit bureaus, payment processors, and data brokers. Use credit freezes to prevent unauthorized new accounts, monitor your credit reports regularly, use virtual card numbers for online purchases, be careful with banking apps on public Wi-Fi, and review account statements regularly for unauthorized transactions.

The Financial Privacy Landscape

Financial data is among the most sensitive personal information because it reveals so much about your life and because its compromise creates direct material harm. Banks and payment processors have access to every transaction you make, revealing your health, relationships, habits, and beliefs through spending patterns.

Three credit bureaus, Equifax, Experian, and TransUnion, maintain detailed credit files on virtually every adult in countries with credit reporting systems. These files include your payment history, credit limits, balances, hard inquiries, and public records. Errors in these files can affect your ability to get credit, housing, and employment.

Data brokers purchase financial data from various sources and include it in the profiles they sell commercially.

Credit Freezes and Fraud Alerts

A credit freeze, also called a security freeze, prevents lenders from accessing your credit report to open new accounts. With a freeze in place, even if an attacker has your personal information, they cannot open new credit accounts in your name because lenders cannot see your credit file.

Place a credit freeze at all three bureaus: Equifax, Experian, and TransUnion. Each has a separate website for this. Freezes are free in the United States under federal law. You must temporarily lift the freeze when you apply for legitimate credit.

A fraud alert is less restrictive than a freeze. It adds a notice to your credit report asking lenders to take extra steps to verify your identity before extending credit. A fraud alert at one bureau automatically alerts all three.

Monitoring Your Credit

Request free credit reports from all three bureaus annually at annualcreditreport.com. Review them for accounts you did not open, inquiries you did not authorize, and incorrect personal information.

Many banks and credit cards offer free credit monitoring as a benefit. These services alert you to significant changes in your credit file, potentially catching identity theft early.

Virtual Card Numbers for Online Shopping

Many banks and credit card issuers offer virtual card numbers, single-use or merchant-locked card numbers linked to your real account. Use these for online purchases to protect your real card number from merchant data breaches.

If a virtual card number is stolen or a merchant is breached, only that single number is compromised. Your real card number remains protected and does not need to be replaced.

Reviewing Financial Statements

Review bank and credit card statements monthly for unfamiliar transactions. Fraudulent charges are easiest to dispute when caught early. Most card issuers have a limited window for dispute filing.

Pay particular attention to small charges from unfamiliar merchants. A common fraud technique is to make small test charges before larger fraudulent transactions to verify that a stolen card number works.

Review your credit card statements for subscription charges you no longer use or did not authorize. Free trials that convert to paid subscriptions and recurring charges from services you have long since stopped using are easy to miss.`);

update('PP Module 9: Identity Protection and Monitoring', `Identity theft occurs when someone uses your personal information to commit fraud or open accounts. Monitor your credit, set up fraud alerts, use unique answers to security questions stored in your password manager, be careful with your Social Security number and other identifiers, and know the steps to take if your identity is stolen.

Understanding Identity Theft

Identity theft encompasses a broad range of crimes where someone uses your personal information without your consent for financial gain or other fraudulent purposes.

New account fraud uses your personal information to open new credit cards, loans, utilities, or other accounts in your name. The thief uses the credit and you are left with the debt.

Account takeover uses your credentials or personal information to gain access to existing accounts including banking, investment, and other financial accounts.

Tax identity theft uses your Social Security number to file a fraudulent tax return claiming your refund before you do.

Medical identity theft uses your insurance information to receive medical care or prescription drugs, resulting in incorrect information in your medical records that can affect future care.

Synthetic identity fraud creates entirely new identities by combining real Social Security numbers with fabricated other information. Often targets children or others who have Social Security numbers but no credit file.

How Identity Theft Happens

Data breaches expose personal information including names, addresses, Social Security numbers, dates of birth, and financial account details. This information is sold and used for identity theft.

Phishing and social engineering obtain personal information directly from victims through deception.

Physical theft of mail, wallets, documents, and devices provides direct access to sensitive identifying information.

Data brokers aggregate and sell personal information that can be used in identity theft attacks.

Preventive Measures

Protect your Social Security number carefully. Do not carry your Social Security card. Do not provide your Social Security number unless legally required. Be very cautious about any organization that requests it for non-essential purposes.

Place credit freezes at all three bureaus as described in the financial privacy module. This is the most effective protection against new account fraud.

Use unique strong passwords and enable MFA on financial accounts. Use random false answers to security questions and store them in your password manager.

Enroll in fraud alerts and credit monitoring services. Many services offer free monitoring with alerts for significant changes to your credit file.

Responding to Identity Theft

Act quickly. The faster you respond, the less damage typically occurs and the easier recovery becomes.

File a report with the FTC at IdentityTheft.gov. This generates a personalized recovery plan with specific instructions for your situation and creates an official record.

Place a fraud alert or credit freeze at all three credit bureaus if not already done.

Report the theft to any affected financial institutions. Banks, credit card companies, and other lenders have fraud departments specifically for these situations.

If the theft involves a crime like someone using your identity in a criminal matter, file a police report to document the theft.

For tax identity theft, contact the IRS Identity Protection Specialized Unit.

Recovery can take months to years depending on the scope of the theft. The FTC's IdentityTheft.gov provides a personalized checklist and form letters to send to creditors and bureaus.`);

update('PP Module 10: Privacy Auditing Your Digital Life', `A privacy audit systematically reviews your digital exposure and tightens your security posture. Review all accounts and delete unused ones, update passwords and enable MFA everywhere, review app permissions on all devices, check social media privacy settings, submit data broker opt-outs, review cloud storage permissions, and verify your email has not appeared in known breaches.

What a Privacy Audit Accomplishes

A privacy audit is a deliberate, systematic review of your digital footprint, security posture, and data exposure. Unlike reactive security responses that happen after a problem occurs, a privacy audit proactively identifies and addresses vulnerabilities before they are exploited.

Most people have accumulated digital accounts, app permissions, and data exposures over years without ever reviewing them. Services signed up for and forgotten still hold personal data. Apps granted permissions years ago still collect data. Passwords set in 2015 are still in use on sites that have since been breached.

A regular audit, ideally annual, catches and addresses these accumulated exposures.

Step 1: Account Inventory and Cleanup

Create a comprehensive list of every online account you have. Start with your email inbox and search for terms like welcome, registration, account, and verify to find accounts you may have forgotten.

For each account, decide whether to keep or delete it. Delete accounts for services you no longer use. Deleting is more thorough than deactivating since many services retain data after deactivation but delete it after formal deletion.

For accounts you keep, ensure the password is strong and unique, stored in your password manager, and that MFA is enabled.

Step 2: Password and MFA Review

Export your passwords from your password manager and review them for reuse, weakness, and accounts that appear in breach notifications. Most password managers have a built-in health check that surfaces these issues.

Check haveibeenpwned.com with each of your email addresses to see which breaches have exposed your credentials. For any breach that exposed a password you still use, change that password immediately.

Review which accounts have MFA enabled and enable it on any that offer it but where you have not yet set it up.

Step 3: App Permission Review

On each of your devices, systematically review app permissions. On iOS, go to Settings, Privacy and Security. On Android, go to Settings, Privacy, Permission Manager.

For each sensitive permission category including location, camera, microphone, contacts, and SMS, review every app that has access. Remove permissions from apps that do not need them. Consider whether you still need apps that request excessive permissions.

Step 4: Social Media Privacy Review

Log out of each social media account and view your profile from a public perspective. Is information visible that you would prefer to keep private?

Review and update privacy settings on each platform. Configure post audience defaults, profile visibility, search visibility, and location tagging settings.

Review connected apps and remove access for any you do not actively use.

Step 5: Data Broker Opt-Outs

Search for your name and personal information on the major data broker sites: Spokeo, BeenVerified, Whitepages, Intelius, and others. Where your information appears, follow the opt-out process.

Consider enrolling in a data removal service if the manual process is too time-consuming. Services like DeleteMe submit and repeat opt-outs on your behalf.

Step 6: Cloud Storage and Sharing Review

Review what is stored in your cloud storage services and who has access to it. Remove access for people or apps that no longer need it. Delete old sensitive files that are no longer needed.

Review shared links and documents. Many cloud services allow you to see all active share links. Revoke any that are no longer needed, particularly public links to sensitive documents.

Frequency and Maintenance

An annual comprehensive audit is a good baseline for most people. After major life changes like changing jobs, moving, or ending relationships, a targeted review of affected accounts and sharing permissions is advisable.

The goal is not to achieve perfect privacy, which is not practically achievable, but to systematically reduce unnecessary exposure and ensure that accounts and permissions reflect your current needs and intentions rather than the accumulated defaults of years of online activity.`);

console.log('\nAll 62 modules updated.');
console.log('\nVerifying content lengths:');
const results = db.prepare('SELECT title, length(content) as len FROM modules WHERE section_id > 1 ORDER BY section_id, order_index').all();
results.forEach(r => console.log(r.len, r.title));
