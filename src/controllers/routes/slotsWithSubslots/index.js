const helper = global.helper;
const express = helper.module.express;
const router = express.Router();
const utilites = require('../../../utilities');
const logger = utilites.logger;
const safePromise = utilites.safePromise;
const {slotGen: rules} = require("../../../../rules");

const middlewares = require("../../../middlewares");
const services = require("../../../services");
const {sanitize} = require("../../../middlewares/sanitize");
const validate = middlewares.validate;
const isAuthorized = middlewares.isAuthorized;
const subslots = services.subslots;
const slotGen = require('../../../services/subslots').slotGen;
const getSubSlots = require('../../../services/subslots').getSubSlots;






router.post("/slotGen",async (req, res) => {
    const body = req.payload;
    const [error, result] = await safePromise(slotGen(body));
    if (error) {
        const resp = {
            success: false,
            ...error
        }
        return res.json(resp);
    }
    const resp = {
        success: true,
        total: result.length,
        result
    }
    res.json(resp);
});

router.post("/subSlotGen", async (req, res) => {
    const body = req.body;
    const [error, result] = await safePromise(getSubSlots(body));
    if (error) {
        const resp = {
            success: false,
            ...error
        }
        return res.json(resp);
    }
    const resp = {
        success: true,
        total: result.length,
        result
    }
    res.json(resp);
});

module.exports = router;