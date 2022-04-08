import mongoClientPromise from "../../libs/mongodb";

const Participant = async (req, res) => { 

    const db = await mongoClientPromise;

    if(req.method == 'POST'){
         
        const { person } = await req.body;

        console.log(person._id);

        const mongoose = require('mongoose');

        const query = {_id: mongoose.Types.ObjectId(person._id)};
        const newValue = { $set: { "timeout": (Math.floor(Date.now()/1000)).toString(), status: 0} };

        await db.db("badcheck").collection("paticipant").updateOne(query, newValue, function(err, result) {
            if (err) throw err;
            return res.status(201).json({"message": "check-out success"});
        });

    }

}

export default Participant;