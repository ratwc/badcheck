const fs = require('fs');  

const Participant = async (req, res) => { 

    if(req.method == 'POST'){
         
        const { name } = await req.body
        
        var logger = fs.createWriteStream('file/participant.txt', {
            flags: 'a' // 'a' means appending (old data will be preserved)
          })
          
        logger.write(name + "," + (Math.floor(Date.now()/1000)).toString() + "\n"); 
        logger.end()

        return res.status(201).json("check in successfully");
    }

    if(req.method == 'GET'){

        fs.readFile('file/participant.txt', 'utf8' , (err, data) => {
            if (err) {
              console.error(err);
              return res.status(500).json({"message": "somthing error!"});
            }
 
            var splitPerson = data.split("\n");
            
            let participants = [];

            splitPerson.forEach(person => {
                if(person.length > 0){
                    var tempDict = {};
                    tempDict['name'] = person.split(",")[0].trim();
                    tempDict['timestamp'] = person.split(",")[1].trim();
                    
                    var unix_timestamp = tempDict['timestamp']
 
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

                    tempDict['time'] = formattedTime;
                    tempDict['date'] = formattedDate;

                    participants.push(tempDict);
                }
            });
            
            return res.status(201).json(participants);
          })

    }
}

export default Participant;