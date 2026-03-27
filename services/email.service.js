// As per user request, simplifying email setup. We will just simulate sending emails for now.
exports.sendExpiryEmail = async (userEmail, itemName, daysLeft) => {
    console.log(`\n================================`);
    console.log(`[EMAIL COMPONENT - SIMULATION]`);
    console.log(`To: ${userEmail}`);
    if (daysLeft === 0) {
        console.log(`Subject: 🚨 EXPIRED: ${itemName}`);
        console.log(`Body: Your item "${itemName}" has expired today!`);
    } else {
        console.log(`Subject: ⚠️ EXPIRING SOON: ${itemName} (${daysLeft} days)`);
        console.log(`Body: Your item "${itemName}" is expiring in ${daysLeft} days.`);
    }
    console.log(`================================\n`);
    return true;
};
