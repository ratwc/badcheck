import mongoClientPromise from "../../libs/mongodb";
import { getCurrentTime } from "../../components/currentTime";
import { timeFormat } from "../../components/timeFormat";

const Participant = async (req, res) => { 

    const db = await mongoClientPromise;

    if(req.method == 'POST'){
         
        const { name } = await req.body

        let data = {
            "name": name,
            "timein": (Math.floor(getCurrentTime()/1000)).toString(),
            "timeout": "-",
            "status": 1
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

               result.forEach(person => {

                    var unix_timestamp_in = person['timein']
    
                        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                    var datein = new Date(unix_timestamp_in * 1000);

                    const monthNames = ["January", "February", "March", "April", "May", "June",
                                        "July", "August", "September", "October", "November", "December"
                                        ];

                    var formattedDate = datein.getDate() + " " + monthNames[datein.getMonth()] + " " + datein.getFullYear();

                    person['time'] = timeFormat(datein);
                    person['date'] = formattedDate;

                    if (person.status === 0) {
    
                        var unix_timestamp_out = person['timeout'];

                        var dateout = new Date(unix_timestamp_out * 1000);

                        person['endtime'] = timeFormat(dateout);

                    }
                });

                return res.status(201).json(result);
                
            }
        })
    }
}

export default Participant;