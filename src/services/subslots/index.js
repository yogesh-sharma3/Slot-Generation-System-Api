const helper = global.helper;
const config = helper.config;
const utilites = require('../../utilities');
const logger = utilites.logger;
const moment = require('moment');
const {
    levelFromName
} = require('bunyan');
const safePromise = utilites.safePromise;



/**
 * 
 * 
 * @param {object} body
 * 
 */

function slotGen(body) {
    return new Promise((resolve, reject) => {
        const format = 'hh:mm A';
        const startTime = moment(body.startTime, format);
        const endTime = moment(body.endTime, format);
        const slotDuration = body.slotDuration;
        const interval = body.interval;
        let numberOfSlot = body.count;
        let slot = [];
        let lastEndTime;
        while ((startTime).isBefore(endTime) && !(numberOfSlot === 0)) {
            let slotTime = {}
            slotTime.slotStartTime = startTime.format(format)
            lastEndTime = startTime.add(+slotDuration, 'minutes')
            slotTime.slotEndTime = lastEndTime.format(format);
            slot.push(slotTime);
            startTime.add(+interval, 'minutes')
            numberOfSlot--;
        }
        if (slot.length > 0 && (moment(lastEndTime).add(interval, "minutes")).isAfter(endTime) && !(numberOfSlot === 0)) {
            slot[slot.length - 1].slotEndTime = moment(endTime).format(format)
        } else if (moment(lastEndTime).isBefore(endTime) && !(numberOfSlot === 0)) {
            let slotTime = {}
            slotTime.slotStartTime = startTime.format(format)
            slotTime.slotEndTime = moment(endTime).format(format)
            slot.push(slotTime)
        }
        resolve(slot);
    })
}


function getSubSlots(body) {
    return new Promise(async function (resolve, reject) {
        const payload = {
            ...body
        };
        delete payload["subslots"];
        const subSlots = body.subslots;
        const [err, slots] = await safePromise(slotGen(payload));
        const days = body.days
        let final = {}
        let todaysDate = moment();
        const tillDate = moment(todaysDate).add(days, "days")
        while ((tillDate).isAfter(todaysDate)) {
            slots.forEach(function (slot, index) {
                subSlots.forEach( function (element) {
                    let slotStart = moment(slot.slotStartTime, 'hh:mm A');
                    let slotEnd = moment(slot.slotEndTime, 'hh:mm A');
                    let subSlotStart = moment.utc(element.start).local().format()
                    let subSlotEnd = moment.utc(element.start).local().format()
                    let whileDate = todaysDate.format('DD-MM-YYYY')
                    let subSlotStartDate = moment(subSlotStart).format('DD-MM-YYYY')
                    if ((whileDate === subSlotStartDate) && moment(subSlotStart).isBetween(slotStart, slotEnd) && moment(subSlotEnd).isBetween(slotStart, slotEnd)) {
                        subSlotFormated = {}
                        subSlotFormated.start = moment(subSlotStart).format(' hh:mm A DD-MM-YYYY')
                        subSlotFormated.end = moment(subSlotEnd).format(' hh:mm A DD-MM-YYYY')
                        slots[index]["subSlots"] = subSlotFormated;       
                    }
                })
                const todaysDateFormat = todaysDate.format('DD-MM-YYYY')
                final[todaysDateFormat] = slots
            })
            todaysDate = moment(todaysDate).add(1, "days")
        }
        resolve(final)
    })
}

exports.slotGen = slotGen;
exports.getSubSlots = getSubSlots;