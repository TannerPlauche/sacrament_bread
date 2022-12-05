import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Twilio from 'twilio';
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
    const promise = twilio.messages.create({
        from: recipientPhone,
        to: senderPhone,
        body: message
    });

    promise.then(function (message) {
        console.log('Created message using promises');
        console.log(message.sid);
    }).catch(err => console.log(err));
}

TWILIO_TOKEN
async function getData() {
    return fetch(`https://api.apispreadsheets.com/data/${process.env.FILE_ID}/`).then(res => {
        if (res.status === 200) {
            console.log('success');
            return res.json().then(data => {
                const yourData = data.data;
                return yourData;
            }).catch(err => console.log(err))
        }
        else {
            console.log(`err: ${err}`);
        }
    });
}

export const handler = async () => {

    const data = await getData();
    const today = new Date();
    const filteredData = data.filter(sched => new Date(sched.date) > today);
    // console.log('filteredData: ', filteredData);

    const nextSunday = filteredData[0];
    console.log('nextSunday: ', nextSunday);
    if (!nextSunday) {
        process.exit();
    }

    const message = `Hi ${nextSunday.firstName}, you are scheduled to bring the bread for sacrament this Sunday, ${nextSunday.date}. If you are not able to do this please
let Brother Plauché (${tanner.phone}) or Brother Nelson (${tyler.phone}) know. \n\n\nyou will receive this message Friday, Saturday, and Sunday the week leading up to ${nextSunday.date}`

    console.log('message: ', message);

    await sendMessage(
        nextSunday.phone,
        twilioAccount.phone,
        message
    );

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

}


