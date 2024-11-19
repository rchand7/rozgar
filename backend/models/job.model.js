import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    description: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    requirements: [
        {
            type: mongoose.Schema.Types.Mixed,
        },
    ],
    salary: {
        type: mongoose.Schema.Types.Mixed, // Allows any type of value
        required: true,
    },
    experienceLevel: {
        type: mongoose.Schema.Types.Mixed, // Allows any type of value
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    jobType: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    position: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
        },
    ],
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);
