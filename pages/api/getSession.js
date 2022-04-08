import mongoClientPromise from "../../libs/mongodb";

const Reset = async (req, res) => { 

    const db = await mongoClientPromise;

    if(req.method == 'GET'){
         
        await db.db("badcheck").collection("paticipant").find({}).toArray(function (err, result) {
            return res.status(200).json(result);
        });
    }
}

export default Reset;