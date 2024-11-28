import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: String, // Changed from Number to String to accept alphanumeric values
        required: true,
        validate: {
            validator: function(value) {
                // Custom validation to allow both numbers and alphabets
                return /^[a-zA-Z0-9\s]*$/.test(value);  // Accepts alphanumeric values and spaces
            },
            message: 'Salary must be alphanumeric.'
        }
    },
    experienceLevel: {
        type: String, // Changed from Number to String to accept alphanumeric values
        required: true,
        validate: {
            validator: function(value) {
                // Custom validation to allow both numbers and alphabets
                return /^[a-zA-Z0-9\s]*$/.test(value);  // Accepts alphanumeric values and spaces
            },
            message: 'Experience Level must be alphanumeric.'
        }
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
}, {timestamps: true});

export const Job = mongoose.model("Job", jobSchema);
