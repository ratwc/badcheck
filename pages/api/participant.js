import mongoClientPromise from "../../libs/mongodb";

const Participant = async (req, res) => { 

    const db = await mongoClientPromise;

    if(req.method == 'POST'){
         
        const { name } = await req.body

        let data = {
            "name": name,
            "timestamp": (Math.floor(Date.now()/1000)).toString()
        }
        var result = await db.db("badcheck").collection("paticipant").insertOne(data);

        if (result){
            return res.status(201).json("check in successfully");
        }
        return res.status(500).json("save error");
    }

    if(req.method == 'GET'){


        await db.db("badcheck").collection("paticipant").find({}).toArray(function (err, result) {
            if (err) {
                return res.status(500).json(err);
            } else {
               let participants = [];

               result.forEach(person => {

                    var unix_timestamp = person['timestamp']
    
                        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                    var date = new Date(unix_timestamp * 1000);

                    var hours = date.getHours();
                    var minutes = "0" + date.getMinutes();
                    var seconds = "0" + date.getSeconds();

                    const monthNames = ["January", "February", "March", "April", "May", "June",
                                        "July", "August", "September", "October", "November", "December"
                                        ];

                    var formattedDate = date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();

                    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                    person['time'] = formattedTime;
                    person['date'] = formattedDate;
                });
                return res.status(201).json(result);
            }
        })
    }
}

export default Participant;