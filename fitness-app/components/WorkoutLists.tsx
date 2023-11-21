'use client'
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import  Link  from 'next/link';


export default function WorkoutLists() {
    const [workouts, setWorkouts] = useState([]);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        const { data, error } = await supabase
            .from('workouts')
            .select('id, name');
        
        if (error) {
            console.log('Error fetching workouts!', error);
            return;
        }

        setWorkouts(data);
    };

    const handleDeleteWorkout = async (id) => {
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', id);

        if (error) {
            console.log('Error deleting workout!', error);
        } else {
            fetchWorkouts();
            console.log('Workout deleted!');
        }
    }

    return (
        <div className="p-space-x-0.5">
            <div>
                <h1 className="p-4 text-2xl">Workouts</h1>
                <div className="p-4">
                    <h2 className="text-xl">Workout 1</h2>
                    {workouts.map((workout, index) => (
                        <div key={index} className="flex justify-between items-center mb-2">
                            <Link href={`/workouts/exercise/${workout.name}`}>
                                <p className="text-blue-600 hover:text-blue-800 visited:text-purple-600">{workout.name}</p>
                            </Link>
                            <button 
                                onClick={() => handleDeleteWorkout(workout.id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}