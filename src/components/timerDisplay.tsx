import React from 'react';


const TimerDisplay = ({ timeDifference }: { timeDifference: string }) => {
    return (
        <>
            ⏲️{timeDifference}
        </>
    );
}

export default TimerDisplay;