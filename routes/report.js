const router = require("express").Router();
const verify = require("./verifyToken");
const Report = require("../model/Report");

const { reportValidation } = require("../validation");

router.get("/", verify, async (req, res) => {
  try {
    const report = await Report.find().populate("user", [
      "name",
      "area",
      "divisi",
    ]);

    res.status(200).send({
      status: "success",
      message: "all report fetched",
      data: report,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
});

router.post("/", verify, async (req, res) => {
  try {
    const { error } = reportValidation(req.body);
    if (error)
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });

    const report = new Report({
      user: req.body.user,
      judul: req.body.judul,
      detail: req.body.detail,
    });

    const saveReport = await report.save();
    res.status(200).send({
      status: "success",
      message: "Report has been saved",
      data: saveReport,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const reportUser = await Report.find({
      user: req.params.id,
    }).populate("user", ["name", "area", "divisi"]);
    res.status(200).send({
      status: "success",
      message: "Report has been fetched",
      data: reportUser,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
});

module.exports = router;
