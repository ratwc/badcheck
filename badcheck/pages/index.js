import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
// import { participant } from '../file/participant'
import Swal from 'sweetalert2'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { AiOutlineFieldTime } from "react-icons/ai";
import { BsEmojiFrown } from "react-icons/bs";

export default function Home() {

  const [name, setName] = useState();
  const [participants, setParticipants] = useState();
  const [noCourt, setNoCourt] = useState();
  const [costCourt, setCostCourt] = useState();
  const [noHours, setNoHours] = useState();

  const [calStatus, setCalStatus] = useState(false);
  const [costTotal, setCostTotal] = useState();
  const [checkEmpty, setCheckEmpty] = useState();
  const [timeStart, setTimeStart] = useState();
  // const [session, setSession] = useState();

  const checkin = async () => {

    var checkinCheck = true;
    if(checkEmpty === true){
      await Swal.fire({
        icon: "warning",
        title: "If you check-in as a first one, session will be start!",
        showCancelButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: "#00AB66"
      }).then((isConfirm) => {
        if (isConfirm.isConfirmed === false) {
          checkinCheck = false;
        } 
      })
    }

    if(checkinCheck){
      const { value: text } = await Swal.fire({
        input: 'text',
        inputLabel: 'TIME TO CHECK-IN',
        inputPlaceholder: 'Type your name here...',
        confirmButtonText: 'Check in',
        showCancelButton: true,
        confirmButtonColor: "#00AB66"
      })
      if (text) {
        setName(text)
        await axios.post("/api/participant", {"name": text} ).then((res) => {
          if(res.status === 201){
            Swal.fire({
              icon: "success",
              title: "Check-in success",
              showConfirmButton: false,
              timer: 1500
            });
          }
        }); 
      }
    }
  }

  const calCost = async () => {

    await axios.post("/api/calculate", {"participants": participants, "noCourt": noCourt, "costCourt": costCourt, "noHours": noHours} ).then((res) => {
      if(res.status === 200){
        setParticipants(res.data.participants);
        setCostTotal(res.data.costTotal);
        setCalStatus(true);
      }
    }); 
  }

  const reset = async () => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure to reset?",
      showCancelButton: true,
      confirmButtonText: 'Reset',
      confirmButtonColor: "#d9534f"

    }).then( async (isConfirm) => {
      if (isConfirm) {
        await axios.post("/api/reset").then((res) => {
          if(res.status === 200) getParticipant();
        })
      } 
    })


  }

  const getParticipant = async () => {
    await axios.get("/api/participant").then((res) => {
      setParticipants(res.data);
      if(res.data.length > 0){
        setTimeStart(res.data[0]["date"] + " " + res.data[0]["time"]);
        setCheckEmpty(false);
      }
      else setCheckEmpty(true);
    })
  }

  useEffect(() => {
    getParticipant();
    setNoCourt(2);
    setCostCourt(160);
    setNoHours(2);
  }, [name])

  // useEffect(() => {
  //   console.log(participants);
  // }, [participants])

  return (
    <>
    <div className="container mx-auto px-4 py-4">

    <div className='grid justify-items-center'>
      <h2><AiOutlineFieldTime size={40}/></h2>
      <h2 className='text-2xl font-bold py-4'>Fair Time Check-in</h2>
    </div>  
    <div className="flex flex-col">
      {checkEmpty ? 
            <div className='flex grid justify-center justify-items-center text-[#d9534f]'>
              <BsEmojiFrown size={60}/>
              <h2 className='py-3 text-[#d9534f] text-xl font-bold'>No One Is Here!</h2>
            </div> 
            :
            <>
              <div className='flex grid justify-center justify-items-center text-[#d9534f]'>
                <h2 className='py-3 text-[#d9534f] text-xl font-bold'>{timeStart}</h2>
              </div> 
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-white border-b">
                        <tr>
                          <th scope="col" className="text-md font-medium text-gray-900 px-6 py-4 text-center">Name</th>
                          <th scope="col" className="text-md font-medium text-gray-900 px-6 py-4 text-center">Time</th>
                          {calStatus ? 
                              <th scope="col" className="text-md font-medium text-[#00AB66] px-6 py-4 text-right">Cost</th> :
                              <></>
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {participants?.map((person) => {
                          return (
                            <tr key={person.name} className="bg-gray-100 border-b">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{person.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{person.time}</td>
                              {calStatus ? 
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#00AB66] text-right">{person.cost}</td> :
                                  <></>
                              }
                            </tr>
                          )
                        })}
                        {calStatus ? 
                          <tr className="bg-gray-100 border-b">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center"></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#00AB66] text-center">Total Cost:</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#00AB66] text-right">{costTotal}</td>
                          </tr>
                          :
                          <></>
                        }
                      </tbody>
                    </table>        
                  </div>
                </div>
              </div>
            </>
          }
        <button className="rounded-md border-2 border-[#00AB66] px-4 py-4 text-[#00AB66] text-4xl font-bold my-2" onClick={checkin}>Check in</button>
        {checkEmpty ? 
            <></>
            : 
            <>
            <div className="justify-center">
              <div className="mb-3 xl:w-96">
                <label htmlFor="no.court" className="form-label inline-block mb-2 text-[#0275d8] font-medium">Number of Court</label>
                <input type="number"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-[#0275d8] bg-white bg-clip-padding border border-solid border-[#0275d8] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="no.court"
                  defaultValue={noCourt}
                  min={1} max={5}
                  onChange={(e)=>{
                    setNoCourt(e.target.value)
                  }}
                />
              </div>
              <div className="mb-3 xl:w-96">
                <label htmlFor="costPerCourt" className="form-label inline-block mb-2 text-[#0275d8] font-medium">Cost / Hour / Court</label>
                <input type="number"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-[#0275d8] bg-white bg-clip-padding border border-solid border-[#0275d8] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="costPerCourt"
                  defaultValue={costCourt}
                  min={1} max={1000}
                  onChange={(e)=>{
                    setCostCourt(e.target.value)
                  }}
                />
              </div>
              <div className="mb-3 xl:w-96">
                <label htmlFor="noHours" className="form-label inline-block mb-2 text-[#0275d8] font-medium">Number of Hours</label>
                <input type="number"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-[#0275d8] bg-white bg-clip-padding border border-solid border-[#0275d8] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="noHours"
                  defaultValue={noHours}
                  min={1} max={5}
                  onChange={(e)=>{
                    setNoHours(e.target.value)
                  }}
                />
              </div>
            </div>
            <button className='rounded-md border-2 border-[#0275d8] px-4 py-4 text-[#0275d8] text-md font-bold' onClick={calCost}>Calculate Cost</button>
            </>
       }
        
        <button className='px-4 py-4 text-[#d9534f] text-base font-bold' onClick={reset}>Reset</button>
      </div>
    </div>
    </>
    
  )
}
