import mongoClientPromise from "../../libs/mongodb";

const Reset = async (req, res) => { 

    const db = await mongoClientPromise;

    if(req.method == 'POST'){
         
        const { person } = await req.body;

        console.log(person._id);

        const mongoose = require('mongoose');

        const query = {_id: mongoose.Types.ObjectId(person._id)};

        await db.db("badcheck").collection("paticipant").deleteOne(query, function(err, result) {
            if (err) throw err;
            return res.status("202").json({"message": "Accept delete complete"});
        });

    }
}

export default Reset;