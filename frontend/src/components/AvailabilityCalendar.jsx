import { useState, useEffect } from 'react';
import { format, eachDayOfInterval } from 'date-fns';
import { getAvailability } from '../services/proposals';

function AvailabilityCalendar({ proposalId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        loadAvailability();
    }, [proposalId]);

    const loadAvailability = async () => {
        try {
            const result = await getAvailability(proposalId);
            setData(result);
        } catch (err) {
            console.error('Failed to load availability:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-gray-600">Loading availability...</p>;
    }

    if (!data || data.slots.length === 0) {
       return (
         <div className="text-center py-8">
             <p className="text-gray-600">No availability submitted yet.</p>
             <p className="text-sm text-gray-500 mt-2">
             Share the invite link to collect responses!
             </p>
         </div>
       );
    }

    const allDays = eachDayOfInterval({
        start: new Date(data.proposal.date_range_start),
        end: new Date(data.proposal.date_range_end)
    });

    // Calculate availability for each day
    const dayAvailability = {};

    allDays.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const available = data.slots.filter(slot => {
            if (!slot.availability) return false;
            return slot.availability.some(entry => entry.date === dateStr);
        });

        dayAvailability[dateStr] = {
            count: available.length,
            total: data.slots.length,
            slots: available
        };
    });

    const getColorClass = (count, total) => {
        const percentage = (count / total) * 100;

        if ( percentage === 100){
        return 'bg-green-500 text-white'; // Everyone available
        } else if (percentage >= 70) {
        return 'bg-green-300 text-gray-900'; // Most available
        } else if (percentage >= 40) {
        return 'bg-yellow-300 text-gray-900'; // Some available
        } else if (percentage > 0) {
        return 'bg-red-300 text-gray-900'; // Few available
        } else {
        return 'bg-gray-200 text-gray-500'; // None available
        }
    };

    const handleDayClick = (dateStr) => {
        setSelectedDate(selectedDate === dateStr ? null : dateStr);
    };

    return (
    <div>
      <div className="mb-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Everyone free</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-300 rounded"></div>
          <span>Some free</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300 rounded"></div>
          <span>Few free</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>None free</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before the start of the month */}
        {Array.from({ length: allDays[0]?.getDay() || 0 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        
        {allDays.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayData = dayAvailability[dateStr];
          const colorClass = getColorClass(dayData.count, dayData.total);
          
          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(dateStr)}
              className={`aspect-square rounded-lg ${colorClass} hover:ring-2 hover:ring-blue-500 transition flex flex-col items-center justify-center p-1 ${
                selectedDate === dateStr ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              <div className="text-sm font-semibold">{format(day, 'd')}</div>
              <div className="text-xs">{dayData.count}/{dayData.total}</div>
            </button>
          );
        })}
      </div>

      {selectedDate && dayAvailability[selectedDate] && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">
            {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
          </h3>
          
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-1">
                Available ({dayAvailability[selectedDate].count}):
              </h4>
              {dayAvailability[selectedDate].slots.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {dayAvailability[selectedDate].slots.map(slot => {
                    const dayEntry = slot.availability.find(a => a.date === selectedDate);
                    const busyTimes = dayEntry?.busy_times || [];
                    
                    return (
                      <li key={slot.id} className="text-gray-700">
                        <span className="font-medium">{slot.name}</span>
                        {busyTimes.length > 0 && (
                          <span className="text-gray-500 ml-2">
                            (busy: {busyTimes.map(bt => `${bt.start}-${bt.end}`).join(', ')})
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No one available</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-red-700 mb-1">
                Not Available ({dayAvailability[selectedDate].total - dayAvailability[selectedDate].count}):
              </h4>
              {data.slots
                .filter(slot => !dayAvailability[selectedDate].slots.find(s => s.id === slot.id))
                .map(slot => (
                  <li key={slot.id} className="text-sm text-gray-700">
                    {slot.name}
                  </li>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailabilityCalendar;