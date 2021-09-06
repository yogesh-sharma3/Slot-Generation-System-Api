const helper = global.helper;
const config = helper.config;
const utilites = require('../../utilities');
const logger = utilites.logger;
const moment = require('moment')


/**
 * 
 * 
 * @param {object} body
 * 
 */

module.exports = (body) => {
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
        }else if (moment(lastEndTime).isBefore(endTime) && !(numberOfSlot === 0)) {
            let slotTime = {}
            slotTime.slotStartTime = startTime.format(format)
            slotTime.slotEndTime = moment(endTime).format(format)
            slot.push(slotTime)
        }
        resolve(slot);
    })
}