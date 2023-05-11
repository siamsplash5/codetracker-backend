const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const contestModel = mongoose.connection.useDb('contests');

const contestSchema = new mongoose.Schema(
    {
        constestID: {
            type: String,
            unique: true,
            index: true,
        },
        setter: {
            type: [String],
        },
        privacy: {
            type: String,
            enum: ['public', 'protected', 'private'],
        },
        password: {
            type: String,
            // eslint-disable-next-line prettier/prettier, object-shorthand
            required: function () {
                return this.privacy === 'protected' || this.privacy === 'private';
            },
            default: '',
            trim: true,
        },
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: 'pracitce',
        },
        announcement: {
            type: String,
            default: '',
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        beginTime: {
            type: Date,
            default: Date.now() + 300000,
            trim: true,
        },
        duration: {
            type: String,
            required: true,
        },
        problemSet: [
            {
                judge: {
                    type: String,
                    enum: ['atcoder', 'codeforces', 'spoj', 'timus'],
                },
                problemID: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],
        participants: [
            {
                type: String,
                unique: true,
            },
        ],
    },
    { timestamps: true }
);

contestSchema.plugin(uniqueValidator, { message: 'is already taken.' });

const model = contestModel.model('contest', contestSchema);

module.exports = model;
