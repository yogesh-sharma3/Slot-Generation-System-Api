'use strict'
const utilites = require("../../utilities");
const logger = utilites.logger;

const log = logger('sanitize.index');

let sanitize = (req, res, next) => {
  const payload = req.body;
  const sanitized_payload = {};
  log.info("Incoming Headers", JSON.stringify(req.headers));
  log.info("Req Body", JSON.stringify(payload));

  //Sanitize input payload - Example
  if (payload.startTime || payload.StartTime || payload.starttime) {
    sanitized_payload.startTime = (payload.startTime || payload.StartTime || payload.starttime).toString().trim();
  }
  if (payload.endTime || payload.EndTime || payload.endtime) {
    sanitized_payload.endTime = (payload.endTime || payload.EndTime || payload.endtime).toString().trim();
  }
  if (payload.slotDuration || payload.slotduration || payload.SlotDuration) {
    sanitized_payload.slotDuration = (payload.slotDuration || payload.slotduration || payload.SlotDuration).toString().trim();
  }
  if (payload.count || payload.Count || payload.COUNT ) {
    sanitized_payload.count = (payload.count || payload.Count || payload.COUNT).toString().trim();
  }
  if (payload.interval || payload.Interval || payload.INTERVAL) {
    sanitized_payload.interval = (payload.interval || payload.Interval || payload.INTERVAL).toString().trim();
  }

  req.payload = sanitized_payload;

  next();
}


module.exports = {
  sanitize
}