import { timeDifference } from "../../libs/timeDifference";


const Calculate = async (req, res) => { 

    if(req.method == 'POST'){
         
        const { participants, noCourt, costCourt, noHours } = await req.body

        console.log(participants);
        
        var startTime = participants[0].timein

        var usedSecond = noHours * 60 * 60;
        var endTime = usedSecond + parseInt(startTime);

        var costTotal = noCourt * costCourt * noHours;
        
        var sumWeight = 0;

        participants.forEach(person => {
    
            var datein = new Date(parseInt(person.timein) * 1000);

            var dateout = new Date(parseInt((person.status === 0 && person.timeout < endTime) ? person.timeout: endTime) * 1000); 

            const [days, hours, minutes, seconds] = timeDifference(dateout, datein)

            var totalMinutes = days * 1440 + hours * 60 + minutes + Math.ceil(seconds / 60)

            sumWeight += totalMinutes / usedSecond;

            person['used_minutes'] = totalMinutes;
            
        });

        var costPerUnit = costTotal / sumWeight;

        var sumCost = 0;
        participants.forEach(person => {
            var cost = (person.used_minutes * costPerUnit) / usedSecond;
            sumCost += cost;
            person['cost'] = cost.toFixed(2);
        });

        return res.status(200).json({"participants": participants, "costTotal": sumCost});
        
    }

}

export default Calculate;



