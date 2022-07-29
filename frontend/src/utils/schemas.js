import * as Yup from 'yup';

const required = 'This field is required';
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /^05\d([-]{0,1})\d{7}$/;

const registrationSchema = Yup.object().shape({
    email: Yup.string().trim().matches(emailRegex, "Email isn't valid").required(required),
    password: Yup.string().trim().min(6, 'Password must contains at least 6 characters').required(required),
    firstName: Yup.string().trim().required(required),
    lastName: Yup.string().trim().required(required),
    phone: Yup.string().matches(phoneRegex, "Phone number isn't valid").required(required)
});

const loginSchema = Yup.object().shape({
    email: Yup.string().trim().matches(emailRegex, "Email isn't valid").required(required),
    password: Yup.string().trim().min(6, 'Password must contains at least 6 characters').required(required),
});

const personalDetailsSchema = Yup.object().shape({
    firstName: Yup.string().trim().required(required),
    lastName: Yup.string().trim().required(required),
    email: Yup.string().trim().matches(emailRegex, "Email isn't valid").required(required),
    phone: Yup.string().matches(phoneRegex, "Phone number isn't valid").required(required)
});

const personalDetailsSchemaV2 = Yup.object().shape({
    firstName: Yup.string().trim().required(required),
    lastName: Yup.string().trim().required(required),
    phone: Yup.string().matches(phoneRegex, "Phone number isn't valid").required(required)
});

const addressSchema = Yup.object().shape({
    city: Yup.string().trim().required(required),
    street: Yup.string().trim().required(required),
    house: Yup.number().integer().min(1, "House number isn't valid").required(required),
    floor: Yup.number().integer().min(1, "Floor number isn't valid").required(required),
});

export {
    registrationSchema,
    loginSchema,
    personalDetailsSchema,
    personalDetailsSchemaV2,
    addressSchema
};