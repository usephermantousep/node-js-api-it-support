//VALIDATION
const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().min(4).required().email(),
    password: Joi.string().min(4).required(),
    notifId: Joi.string().min(4).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(4).required().email(),
    password: Joi.string().min(4).required(),
  });
  return schema.validate(data);
};

const reqeustAccountValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string().min(4).required(),
  });
  return schema.validate(data);
};

const reportValidation = (data) => {
  const schema = Joi.object({
    user: Joi.string().min(4).required(),
    judul: Joi.string().min(4).required(),
    detail: Joi.string().min(4).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.reqeustAccountValidation = reqeustAccountValidation;
module.exports.reportValidation = reportValidation;
