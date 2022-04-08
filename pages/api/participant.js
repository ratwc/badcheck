import mongoClientPromise from "../../libs/mongodb";
import { getCurrentTime } from "../../components/currentTime";

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

                    var unix_timestamp = person['timein']
    
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

                    if (person.status === 0) {
    
                        unix_timestamp = person['timeout'];

                        date = new Date(unix_timestamp * 1000);

                        minutes = "0" + date.getMinutes();
                        seconds = "0" + date.getSeconds();

                        formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                        person['endtime'] = formattedTime;

                    }
                });

                return res.status(201).json(result);
                
            }
        })
    }
}

export default Participant;