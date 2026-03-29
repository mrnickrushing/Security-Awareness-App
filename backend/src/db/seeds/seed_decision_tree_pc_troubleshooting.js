const { upsertSimulation, upsertDecisionTree } = require("../schema");

function seedDecisionTreePCTroubleshooting(db) {
  const sim = {
    title: "PC Won't Boot: Troubleshooting Walkthrough",
    prompt: "Your coworker calls you in a panic. Their Windows PC is completely unresponsive at startup. Walk through the troubleshooting steps to diagnose and resolve the issue.",
    explanation: "Systematic troubleshooting always starts with the simplest physical checks before moving to software. Skipping steps wastes time and can make the problem worse.",
    sender_name: "Help Desk Training",
    sender_email: "helpdesk@training.local",
    subject: "PC Won't Boot: Troubleshooting Walkthrough",
    sent_at: "",
    body_text: "",
    link_label: "",
    link_url: "",
    attachment_name: "",
    is_phishing: 0,
    landing_page_type: "none",
    difficulty: "easy",
    scenario_type: "decision_tree",
    channel: "email",
  };

  const nodes = [
    {
      node_key: "start",
      is_root: 1,
      prompt: "Your coworker says their PC shows a completely black screen when they press the power button. The power button light does not turn on at all. What do you check first?",
      context: "This is the first report. You have not seen the machine yet.",
      image_hint: "Dark office desk with a black monitor and a desktop tower",
      choices: [
        {
          choice_text: "Check that the power cable is firmly seated at both the wall outlet and the back of the PC",
          outcome_text: "Smart start. Power delivery is always the first physical check before anything else.",
          is_correct: 1,
          next_node_key: "power_confirmed",
        },
        {
          choice_text: "Immediately open the case and reseat the RAM",
          outcome_text: "Jumping inside the case before checking basic power is skipping too many steps. Always verify the simple stuff first.",
          is_correct: 0,
          next_node_key: "power_confirmed",
        },
        {
          choice_text: "Tell your coworker to buy a new PC",
          outcome_text: "Way too drastic without any diagnosis. Most boot failures have simple causes.",
          is_correct: 0,
          next_node_key: "power_confirmed",
        },
      ],
    },
    {
      node_key: "power_confirmed",
      is_root: 0,
      prompt: "The power cable looks fine and the outlet works. The PC still does not respond. You notice the surge protector has a small red indicator light instead of green. What do you do?",
      context: "The surge protector sits under the desk and has seen heavy use for several years.",
      image_hint: "Power strip under a desk with a red warning light glowing",
      choices: [
        {
          choice_text: "Reset the surge protector by pressing its reset button, then try powering on the PC again",
          outcome_text: "Surge protectors have built in breakers that trip under load spikes. Resetting it is the correct next step.",
          is_correct: 1,
          next_node_key: "surge_reset",
        },
        {
          choice_text: "Ignore the surge protector light and plug the PC directly into the wall",
          outcome_text: "Plugging directly into the wall bypasses surge protection but does confirm whether the strip is the problem. Not wrong but skips the simpler reset step.",
          is_correct: 0,
          next_node_key: "surge_reset",
        },
        {
          choice_text: "Assume the PC power supply is dead and order a replacement",
          outcome_text: "Ordering parts before finishing basic checks is expensive and wasteful. The surge protector has not been ruled out yet.",
          is_correct: 0,
          next_node_key: "surge_reset",
        },
      ],
    },
    {
      node_key: "surge_reset",
      is_root: 0,
      prompt: "After resetting the surge protector the PC now powers on but stops at a black screen with the message: 'No bootable device found. Press any key to reboot.' What does this mean and what do you do next?",
      context: "The BIOS POST completed successfully. The system just cannot find an operating system to load.",
      image_hint: "Monitor showing white text on black background reading No bootable device found",
      choices: [
        {
          choice_text: "Enter the BIOS and confirm the primary hard drive appears in the boot device list",
          outcome_text: "Correct. If the drive does not appear in the BIOS at all it is either failed or disconnected. This tells you which problem you are dealing with.",
          is_correct: 1,
          next_node_key: "bios_check",
        },
        {
          choice_text: "Reinstall Windows immediately using a USB drive",
          outcome_text: "Reinstalling the OS before confirming the drive is healthy could wipe recoverable data for no reason.",
          is_correct: 0,
          next_node_key: "bios_check",
        },
        {
          choice_text: "Press any key repeatedly to keep rebooting and hope it fixes itself",
          outcome_text: "Rebooting a machine with no bootable device will loop indefinitely. This does not address the underlying issue.",
          is_correct: 0,
          next_node_key: "bios_check",
        },
      ],
    },
    {
      node_key: "bios_check",
      is_root: 0,
      prompt: "Inside the BIOS you can see the hard drive listed under boot devices, but the boot order shows the USB drive at the top with a bootable USB still plugged in from a previous job. What do you do?",
      context: "A USB flash drive is visible in one of the front ports. The drive has a Linux live environment on it from a previous technician visit.",
      image_hint: "BIOS screen showing boot order with USB drive listed above the internal hard drive",
      choices: [
        {
          choice_text: "Remove the USB drive and reboot, or move the internal hard drive to the top of the boot order",
          outcome_text: "The machine was trying to boot from a non-bootable USB. Removing it or reordering the boot priority resolves the issue immediately.",
          is_correct: 1,
          next_node_key: "resolution",
        },
        {
          choice_text: "Leave the USB in and change nothing since the drive shows up in the BIOS",
          outcome_text: "Seeing the drive in the BIOS does not mean it will boot correctly if something else is higher in the boot order.",
          is_correct: 0,
          next_node_key: "resolution",
        },
        {
          choice_text: "Format the USB drive from inside the BIOS",
          outcome_text: "The BIOS does not have a format utility and this is not the right tool for the job. Removing or deprioritizing the USB is all that is needed.",
          is_correct: 0,
          next_node_key: "resolution",
        },
      ],
    },
    {
      node_key: "resolution",
      is_root: 0,
      prompt: "After removing the USB drive the PC boots into Windows normally. Your coworker asks why this happened and how to prevent it. What do you tell them?",
      context: "The coworker is non-technical and wants a simple explanation.",
      image_hint: "Windows desktop loading screen appearing on the monitor",
      choices: [
        {
          choice_text: "Explain that a USB drive was left plugged in from a previous visit and the PC tried to boot from it instead of the hard drive. Advise removing USB drives when not in use.",
          outcome_text: "Clear, accurate, and actionable. This is exactly the right explanation for a non-technical user.",
          is_correct: 1,
          next_node_key: "",
        },
        {
          choice_text: "Tell them the PC is getting old and will probably keep having problems",
          outcome_text: "This is vague, unhelpful, and likely inaccurate. The problem had a simple cause and a simple fix.",
          is_correct: 0,
          next_node_key: "",
        },
        {
          choice_text: "Say nothing and just walk away since the PC works now",
          outcome_text: "Leaving without an explanation means the same issue will likely happen again. User education is part of good technical support.",
          is_correct: 0,
          next_node_key: "",
        },
      ],
    },
  ];

  const simId = upsertSimulation(db, sim);
  upsertDecisionTree(db, simId, nodes);
  console.log(`Seeded decision tree: ${sim.title} (simulation id ${simId})`);
}

module.exports = { seedDecisionTreePCTroubleshooting };
