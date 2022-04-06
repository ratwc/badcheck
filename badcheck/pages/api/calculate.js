
const Calculate = async (req, res) => { 

    if(req.method == 'POST'){
         
        const { participants, noCourt, costCourt, noHours } = await req.body
        
        var startTime = participants[0].timestamp

        var usedSecond = noHours * 60 * 60;
        var costTotal = noCourt * costCourt * noHours;
        
        var sumWeight = 0;

        participants.forEach(person => {
            sumWeight += (usedSecond - (person.timestamp - startTime)) / usedSecond;
        });

        var costPerUnit = costTotal / sumWeight;

        var sumCost = 0;
        participants.forEach(person => {
            var cost = ((usedSecond - (person.timestamp - startTime)) * costPerUnit) / usedSecond;
            sumCost += cost;
            person['cost'] = cost.toFixed(2);
        });

        return res.status(200).json({"participants": participants, "costTotal": costTotal});
        
    }

    
}

export default Calculate;