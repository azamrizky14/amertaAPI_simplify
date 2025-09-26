const express = require('express');
const router = express.Router();
const ScheduleController = require('../../controllers/ScheduleController/Schedule.Controller');

router.get('/getschedulebycompany/:domain', ScheduleController.getScheduleByCompanyNameWithValidFromAndTo);
router.get('/getschedulebyid/:id', ScheduleController.getScheduleById);
router.get("/getSchedulePrefix/:type/:date", ScheduleController.getTicketPrefix);
router.post('/createschedule', ScheduleController.createSchedule);
router.put('/updateschedule/:id', ScheduleController.updateSchedule);

// Filter Member Id
router.get('/findschedulebymember/:memberId', ScheduleController.findScheduleByMemberId);

module.exports = router;