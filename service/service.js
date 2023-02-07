import Contact from "../model/contact.js";
import User from "../model/user.js";
import gravtar from "gravatar";
const getAllContacts = async (id, page, limit, favorite) => {
    if (favorite === undefined) {
        return await Contact.find({ owner: id })
            .limit(limit * 1)
            .skip((page - 1) * limit);
    }
    return await Contact.find({ owner: id, favorite })
        .limit(limit * 1)
        .skip((page - 1) * limit);
};
const getOneContact = async (contactId) => {
    try {
        const contacts = await getAllContacts();
        const contact = contacts.find(({ id }) => id === contactId);
        if (contact) {
            return Contact.findById(contact._id);
        } else {

            return Contact.findById(contactId);;
        }
    } catch (error) {
        console.log(error);
    }


};


const createContact = async (body, id) => Contact.create({...body, owner: id});

const deleteContact = async (contactId) => {
    try {
        const contacts = await getAllContacts();
        const contact = contacts.find(({ id }) => id === contactId);
        if (contact) {
            return Contact.findByIdAndDelete(contact._id);
        } else {

            return Contact.findByIdAndDelete(contactId);;
        }
    } catch (error) {
        console.log(error);
    }


};

const updateContact = async (contactId, body) => {
    try {
        const contacts = await getAllContacts();
        const contact = contacts.find(({ id }) => id === contactId);
        if (contact) {
            return Contact.findByIdAndUpdate({ _id: contact._id, }, { $set: body },
                {
                    new: true,
                    runValidators: true,
                    strict: "throw",
                }
            );
        } else {

            return Contact.findByIdAndUpdate({ _id: contactId, }, { $set: body },
                {
                    new: true,
                    runValidators: true,
                    strict: "throw",
                }
            );;
        }
    } catch (error) {
        console.log(error);
    }


};

const findUserByEmail = async (email) => await User.findOne({ email });

const createNewUser = async (body) => {
    const { email, password } = body;
    const avatarURL = gravatar.url(email);
    const newUser = new User({ email, avatarURL });
    await newUser.setPassword(password);
    await newUser.save();
    return newUser;
};

const passwordValidation = async (email, password) => {
    const user = await findUserByEmail(email);
    return user ? await user.validatePassword(password) : false;
};

const addToken = async (id, token) =>
    await User.findByIdAndUpdate(id, { token });

const userLogout = async (id) =>
    await User.findByIdAndUpdate(id, { token: null });

const updateSubscription = async (id, body) =>
    User.findByIdAndUpdate(id, { subscription: body }, { new: true });

const updateAvatar = (id, avatarURL) =>
    User.findByIdAndUpdate(id, { avatarURL });

export {
    getAllContacts,
    getOneContact,
    createContact,
    deleteContact,
    updateContact,
    findUserByEmail,
    createNewUser,
    passwordValidation,
    addToken,
    userLogout,
    updateSubscription,
    updateAvatar
};