import dotenv from 'dotenv';
// import fetch from 'node-fetch';
import Twilio from 'twilio';
import DataService from './dataService.js';

dotenv.config();

// data here
// https://www.apispreadsheets.com/files/aYWNP5qJD6BhWtFE

// twilio data
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_TOKEN;

const tanner = {
    firstName: 'Tanner',
    lastName: 'Plauché',
    phone: process.env.TANNER_PHONE
}

const tyler = {
    firstName: 'Tanner',
    lastName: 'Plauché',
    phone: process.env.TYLER_PHONE
}

const twilioAccount = {
    firstName: 'Tanner',
    lastName: 'Plauché',
    phone: process.env.TWILIO_PHONE
}

const twilio = new Twilio(accountSid, token);

/**
 * send message via twilio
 * @param {string} recipientPhone
 * @param {string} senderPhone
 * @param {string} message
 */
async function sendMessage(recipientPhone, senderPhone, message) {
    console.log(`sending message to ${recipientPhone} from ${senderPhone}`);
    return twilio.messages.create({
        from: senderPhone,
        to: recipientPhone,
        body: message
    }).then(function (message) {
        console.log(`Message successfully sent to ${recipientPhone}`);
        console.log(message.sid);
    }).catch(err => {
        console.log(`Failed to send message ${JSON.stringify(err)}`)
    });
}

async function getData() {
    // return fetch(`https://api.apispreadsheets.com/data/${process.env.FILE_ID}/`).then(res => {
    //     if (res.status === 200) {
    //         console.log('success');
    //         return res.json().then(data => {
    //             console.log('data: ', data);
    //             const yourData = data.data;
    //             return yourData;
    //         }).catch(err => console.log(err))
    //     } else {
    //         console.log(`err: ${err}`);
    //     }
    // });
    return await DataService.fetchSchedule();
}

function isToday(date) {
    const today = new Date();

    // 👇️ Today's date
    console.log(today);

    if (today.toDateString() === date.toDateString()) {
        return true;
    }

    return false;
}

export const handler = async () => {

    const data = await getData();
    console.log('data: ', data);
    const today = new Date();
    const filteredData = data
        .filter(sched => new Date(sched.date) > today || isToday(new Date(sched.date)))
        .sort((weeka, weekb) => new Date(weeka.date) - new Date(weekb.date));

    // console.log('filteredData: ', filteredData);

    const nextSunday = filteredData[0];
    console.log('nextSunday: ', nextSunday);
    if (!nextSunday) {
        process.exit();
    }

    const message = `Hi ${nextSunday.firstName || 'NO ONE IS SCHEDULED'}, you are scheduled to bring the bread for sacrament this Sunday, ${nextSunday.date}. If you are not able to do this please
    let Brother Plauché (${tanner.phone}) or Brother Nelson (${tyler.phone}) know. \n\n\nYou will receive this message Wednesday, Saturday, and Sunday the week leading up to ${nextSunday.date}`

    console.log('message: ', message);

    if (nextSunday.phone) {
        await sendMessage(
            nextSunday.phone,
            twilioAccount.phone,
            message
        );
    }

    await sendMessage(
        tanner.phone,
        twilioAccount.phone,
        message
    );

    await sendMessage(
        tyler.phone,
        twilioAccount.phone,
        message
    );

    if (nextSunday.parentPhone && nextSunday.parentFirstName) {
        const parentMessage = `Hi ${nextSunday.parentFirstName}, ${nextSunday.firstName} is scheduled to bring the bread for sacrament this Sunday, ${nextSunday.date}. If ${nextSunday.firstName} is not able to do this please
        let Brother Plauché (${tanner.phone}) or Brother Nelson (${tyler.phone}) know. \n\n\nYou will receive this message Wednesday, Saturday, and Sunday the week leading up to ${nextSunday.date}`
        console.log('parentMessage: ', parentMessage);

        await sendMessage(
            nextSunday.parentPhone,
            twilioAccount.phone,
            parentMessage
        );
    }

}
