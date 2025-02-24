import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import '../../css_files/Sleep.css';

const Sleep = () => {
    const [sleepHours, setSleepHours] = useState(6);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const goal = 12;

    useEffect(() => {
        const savedData = localStorage.getItem(selectedDate);
        if (savedData) {
            setSleepHours(Number(savedData));
        }
    }, [selectedDate]);

    const percentage = (sleepHours / goal) * 100;

    const changeSleepHours = (e:any) => {
        const hours = e.target.value;
        setSleepHours(hours);
        localStorage.setItem(selectedDate, hours);
    };

    const changeDate = (e:any) => {
        setSelectedDate(e.target.value);
    };

    return (
        <div className='main'>
            <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold mb-6">Sleep Tracker</h1>
                    
                    {/* Date Picker */}
                    <input
                        title='date'
                        type="date"
                        value={selectedDate}
                        onChange={changeDate}
                        className="mb-4 p-2 rounded text-black"
                    />

                    {/* Sleep Bar */}
                    <div className="relative w-1/3 h-64 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 bg-blue-500"
                            initial={{ height: "0%" }}
                            animate={{ height: `${percentage}%` }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute w-full text-lg font-bold text-white flex justify-center items-center h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                        >
                            {sleepHours} hrs / {goal} hrs
                        </motion.div>
                    </div>

                    {/* Range Slider */}
                    <input
                        title='range'
                        type="range"
                        min="0"
                        max="12"
                        step="0.5"
                        value={sleepHours}
                        onChange={changeSleepHours}
                        className="w-1/3 mt-8 cursor-pointer"
                    />
        
                    <p className="mt-2 text-lg">Adjust your sleep hours</p>
                </div>
            </div>
        </div>
    );
};

export default Sleep;