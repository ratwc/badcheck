import mongoClientPromise from "../../libs/mongodb";
import { timeDifference } from "../../components/timeDifference";

const Participant = async (req, res) => { 

    const db = await mongoClientPromise;

    if(req.method == 'POST'){
         
        const { person } = await req.body;

        const mongoose = require('mongoose');

        var timeout = (Math.floor(Date.now()/1000)).toString();
        var timein = person.timein;

        var dateout = new Date(parseInt(timeout) * 1000);
        var datein = new Date(parseInt(timein) * 1000);

        const [days, hours, minutes, seconds] = timeDifference(dateout, datein)

        var totalMinutes = days * 1440 + hours * 60 + minutes + Math.ceil(seconds / 60)

        const query = {_id: mongoose.Types.ObjectId(person._id)};
        const newValue = { $set: { "timeout": timeout, status: 0, used_minutes: totalMinutes} };

        await db.db("badcheck").collection("paticipant").updateOne(query, newValue, function(err, result) {
            if (err) throw err;
            return res.status(201).json({"message": "check-out success"});
        });

    }

}

export default Participant;