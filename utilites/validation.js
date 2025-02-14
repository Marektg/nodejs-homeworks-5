import Joi from "joi";

const schemaCreateContact = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z0-9- ]{3,30}$/).required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "pl"] },
        })
        .required(),
    phone: Joi.string()
        .pattern(/^(\+48\s+)?\d{3}(\s*|\-)\d{3}(\s*|\-)\d{3}$/)
        .required(),
});
const schemaUpdateContact = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z0-9- ]{3,30}$/).optional(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "pl"] },
        })
        .optional(),
    phone: Joi.string()
        .pattern(/^(\+48\s+)?\d{3}(\s*|\-)\d{3}(\s*|\-)\d{3}$/)
        .optional(),
}).min(1);
const schemaUpdateStatusContact = Joi.object({
    favorite: Joi.boolean().required(),
});
const validate = (schema, obj, next, res) => {
    const { error } = schema.validate(obj);
    if (error) {
        const [{ message }] = error.details;
        console.log(error);
        return res.json({
            status: "failure",
            code: 400,
            message: `Field ${message.replace(/"/g, "")}`,
        });
    }
    next();
};
function createContact(req, res, next) {
    return validate(schemaCreateContact, req.body, next, res);
};
function updatingContact(req, res, next) {
    return validate(schemaUpdateContact, req.body, next, res);
};
function updateStatusContact(req, res, next) {
    return validate(schemaUpdateStatusContact, req.body, next, res);
};

const schemafindUserByEmail = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "pl"] },
        })
        .required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(6).required(),
});
const schemaPatchSubscription = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const schemaVerifyEmail = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "pl"] },
        })
        .required(),
});

function findUserByEmail(req, res, next) {
    return validate(schemafindUserByEmail, req.body, next, res);
};
function patchSubscription(req, res, next) {
    return validate(schemaPatchSubscription, req.body, next, res);
};
function verifyEmail(req, res, next) {
    return validate(schemaVerifyEmail, req.body, next, res);
};

export { createContact, updatingContact, updateStatusContact, findUserByEmail, patchSubscription, verifyEmail };