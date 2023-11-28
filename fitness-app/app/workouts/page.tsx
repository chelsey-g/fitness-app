'use client'
import SearchComponent from '@/components/Search';
import Navigation from '@/components/Navigation';
import WorkoutLists from '@/components/WorkoutLists';
import { useState, useEffect } from 'react';

export default function WorkoutsPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [showWorkouts, setShowWorkouts] = useState(true);

    useEffect(() => {
        setShowWorkouts(searchResults.length === 0);
    }, [searchResults]);

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    return (
        <div className="p-space-x-0.5">
            <Navigation />
            <SearchComponent handleSearchResults={handleSearchResults} />
            <div>
                {showWorkouts && <WorkoutLists />}
            </div>
        </div>
    );
}





// workouts
// lists (id, name, description, created, created_by);)
// workouts_lists (id, workout_id, list_id)


// const { data, error } = await supabase.from('lists').select(`
//   id, 
//   name, 
//   workouts ( id, name )
// `)

// <Workouts workouts={data.workouts} />
