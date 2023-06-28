import mongoose from 'mongoose';

const blackListedJWTDb = mongoose.connection.useDb('blacklistedJWT');

// Define the schema for the blacklisted JWT document
const blackListedJWTSchema = new mongoose.Schema(
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
const BlacklistedJWT = blackListedJWTDb.model('BlacklistedJWT', blackListedJWTSchema);

export default BlacklistedJWT;
