import { useEffect } from "react";

// This URL can be updated if we move away from Calendly in the future
export const MEETING_URL = "https://calendly.com/corewoodteam/30min";

const ScheduleMeeting = () => {
  useEffect(() => {
    window.location.href = MEETING_URL;
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to scheduling page...</p>
    </div>
  );
};

export default ScheduleMeeting; 
