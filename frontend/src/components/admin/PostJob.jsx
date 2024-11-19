import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// List of job locations
const locationsList = [
    "Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"
];

const PostJob = () => {
    // State to manage the job posting form data
    const [input, setInput] = useState({
        title: "", description: "", requirements: "", salary: "",
        location: "", jobType: "", experience: "", position: 0, companyId: ""
    });
    
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [selectedLocationIndex, setSelectedLocationIndex] = useState(0); // Location index

    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company); // Fetch company list from Redux store

    // Handle input field changes
    const changeEventHandler = (e) => {
        const { name, value } = e.target;

        // Only allow numeric input for salary and experience fields
        if ((name === "salary" || name === "experience") && !/^\d*$/.test(value)) return;

        // Update form state
        setInput({
            ...input,
            [name]: (name === "salary" || name === "position") ? parseFloat(value) || 0 : value
        });
    };

    // Handle company selection from dropdown
    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany ? selectedCompany._id : "" });
    };

    // Handle location selection
    const handleLocationChange = (index) => {
        setSelectedLocationIndex(index);
        setInput({ ...input, location: locationsList[index] });
    };

    // Handle job posting submission
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); // Set loading state to true while the request is processing
            const res = await axios.post(`https://http://localhost:8000/api/v1/job/post`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true // Ensure credentials are sent with request
            });
            if (res.data.success) {
                toast.success(res.data.message); // Show success message
                navigate("/admin/jobs"); // Redirect to jobs list page
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while posting the job.");
        } finally {
            setLoading(false); // Reset loading state after the request completes
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    {/* Job posting form fields */}
                    <div className='grid grid-cols-2 gap-2'>
                        {/* Title Field */}
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>
                        
                        {/* Description Field */}
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>

                        {/* Requirements Field */}
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        {/* Salary Field */}
                        <div>
                            <Label>Salary (in CTC)</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>

                        {/* Location Selection */}
                        <div>
                            <Label>Location</Label>
                            <Select onValueChange={(value) => handleLocationChange(locationsList.indexOf(value))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={locationsList[selectedLocationIndex]} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {locationsList.map((location, index) => (
                                            <SelectItem key={index} value={location}>
                                                {location}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Job Type Field */}
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>

                        {/* Experience Field */}
                        <div>
                            <Label>Experience (in years)</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        {/* Number of Positions Field */}
                        <div>
                            <Label>No of Positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        {/* Company Selection Dropdown */}
                        {companies.length > 0 && (
                            <Select onValueChange={selectChangeHandler}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Company" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies.map((company) => (
                                            <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Submit Button or Loading Indicator */}
                    {loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">Post New Job</Button>
                    )}

                    {/* Message if no companies are available */}
                    {companies.length === 0 && (
                        <p className='text-xs text-red-600 font-bold text-center my-3'>*Please register a company first, before posting a job</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PostJob;

