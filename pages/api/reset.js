import mongoClientPromise from "../../libs/mongodb";

const Reset = async (req, res) => { 

    const db = await mongoClientPromise;

    if(req.method == 'POST'){

        const { time, participants } = req.body;
         
        let data = {
            time: time,
            participants: participants
        }
        // db.db("badcheck").collection("log").insertOne(data)

        var result = await db.db("badcheck").collection("paticipant").deleteMany({})
        
        if(result) return res.status(200).json({"message": "reset success"})
        else return res.status(500).json({"message": "can't reset"})
    }
}

export default Reset;