import mongoose from 'mongoose';

const db = mongoose.connection.useDb('codetrackervj');

// Define the schema for the blacklisted JWT document
const blacklistedTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 'expiresAt' },
        },
    },
    { timestamps: true }
);

// Create and export the blacklisted JWT model
const BlacklistedTokens = db.model('BlacklistedTokens', blacklistedTokenSchema);

export default BlacklistedTokens;
