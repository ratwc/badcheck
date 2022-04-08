import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import axios from "axios";
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
    if (checkEmpty === true) {
      await Swal.fire({
        icon: "warning",
        title: "Session will be start when you check-in as a first one.",
        showCancelButton: true,
        confirmButtonText: "Check-in",
        confirmButtonColor: "#00AB66",
      }).then((isConfirm) => {
        if (isConfirm.isConfirmed === false) {
          checkinCheck = false;
        }
      });
    }

    if (checkinCheck) {
      const { value: text } = await Swal.fire({
        input: "text",
        inputLabel: "TIME TO CHECK-IN",
        inputPlaceholder: "Type your name here...",
        confirmButtonText: "Check in",
        showCancelButton: true,
        confirmButtonColor: "#00AB66",
      });
      if (text) {
        setName(text);
        await axios.post("/api/participant", { name: text }).then((res) => {
          if (res.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Check-in success",
              showConfirmButton: false,
              timer: 1200,
            });
          }
        });
      }
    }
    getParticipant();
  };

  const calCost = async () => {
    await axios
      .post("/api/calculate", {
        participants: participants,
        noCourt: noCourt,
        costCourt: costCourt,
        noHours: noHours,
      })
      .then((res) => {
        if (res.status === 200) {
          setParticipants(res.data.participants);
          setCostTotal(res.data.costTotal);
          setCalStatus(true);
          Swal.fire({
            icon: "success",
            title: "Calculate success",
            showConfirmButton: false,
            timer: 1200,
          });
        }
      });
  };

  const reset = async () => {
    await Swal.fire({
      icon: "warning",
      title: "Are you sure to reset?",
      showCancelButton: true,
      confirmButtonText: "Reset",
      confirmButtonColor: "#d9534f",
    }).then(async (isConfirm) => {
      if (isConfirm.isConfirmed) {
        await axios.post("/api/reset", { time: timeStart, participants: participants }).then((res) => {
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Reset success",
              showConfirmButton: false,
              timer: 1200,
            });
            getParticipant();
          }
        });
      }
    });
  };

  const getParticipant = async () => {
    await axios.get("/api/participant").then((res) => {
      setParticipants(res.data);
      if (res.data.length > 0) {
        setTimeStart(res.data[0]["date"] + " " + res.data[0]["time"]);
        setCheckEmpty(false);
      } else setCheckEmpty(true);
    });
  };

  const personHandler = async (e) => {
    const id = e.target.id;

    const res = participants.filter(({
      _id
    }) => id.includes(_id));

    const person = res[0];

    if (person.status === 1) {
      await Swal.fire({
        title: '"' + person.name + '" informations',
        text: "check-in: " + person.time,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Check-out',
        confirmButtonColor: "#ca0b00",
        denyButtonText: `Delete Check-in`,
        denyButtonColor: "#000000"
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await Swal.fire({
            icon: "warning",
            title: "Are you sure to check-out",
            showCancelButton: true,
            confirmButtonText: "Check-out",
            confirmButtonColor: "#ca0b00",
          }).then(async (isConfirm) => {
            if (isConfirm.isConfirmed) {
              await axios.post("/api/checkout", { person: person }).then((res) => {
                if (res.status === 201) {
                  Swal.fire({
                    icon: "success",
                    title: "Check-out success",
                    showConfirmButton: false,
                    timer: 1200,
                  });
                  getParticipant();
                }
              });
            }
          });
        } else if (result.isDenied) {
          deletePerson(person);
        }
      })
    }
    else {
      await Swal.fire({
        title: '"' + person.name + '" informations',
        html: "<p>check-in: " + person.time + "</p><br>" + "<p>check-out: " + person.endtime + "</p>",
        showCancelButton: true,
        confirmButtonText: "Delete Check-in",
        confirmButtonColor: "#000000",
      }).then(async (isConfirm) => {
        if (isConfirm.isConfirmed) {
          deletePerson(person);
        }
      });
    }
  }

  const deletePerson = async (person) => {

    const participant = person;
    await Swal.fire({
      icon: "warning",
      title: "Are you sure to delete your check-in",
      text: "your will not be a participant forever!",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#000000",
    }).then(async (isConfirm) => {
      if (isConfirm.isConfirmed) {
        await axios.post("/api/delete", { person: participant }).then((res) => {
          if (res.status === 202) {
            Swal.fire({
              icon: "success",
              title: "Delete success",
              text: "I will always remember you forever~",
              showConfirmButton: false,
              timer: 1500,
            })
            getParticipant();
          }
        });
      }
    });
  }

  useEffect(() => {
    getParticipant();
    setNoCourt(2);
    setCostCourt(160);
    setNoHours(2);
    setCalStatus(false);
  }, [name]);

  // useEffect(() => {
  //   console.log(participants);
  // }, [participants])

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <div className="grid justify-items-center">
          <h2>
            <AiOutlineFieldTime size={40} />
          </h2>
          <h2 className="text-2xl font-bold py-4">Fair Time Check-in</h2>
        </div>
        <div className="flex flex-col">
          {checkEmpty ? (
            <div className="flex grid justify-center justify-items-center text-[#d9534f]">
              <BsEmojiFrown size={60} />
              <h2 className="py-3 text-[#d9534f] text-xl font-bold">
                No One Is Here!
              </h2>
            </div>
          ) : (
            <>
              <div className="flex grid justify-center justify-items-center text-[#d9534f]">
                <h2 className="py-3 text-[#d9534f] text-xl font-bold">
                  START: {timeStart}
                </h2>
              </div>
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-white border-b">
                        <tr>
                          <th
                            scope="col"
                            className="text-md font-medium text-gray-900 px-6 py-4 text-center"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="text-md font-medium text-gray-900 px-6 py-4 text-center"
                          >
                            Time
                          </th>
                          {calStatus ? (
                            <th
                              scope="col"
                              className="text-md font-medium text-[#0275d8] px-6 py-4 text-right"
                            >
                              Cost
                            </th>
                          ) : (
                            <th
                              scope="col"
                              className="text-md font-medium text-gray-900 px-6 py-4 text-center"
                            >
                              Status
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {participants?.map((person) => {
                          return (
                            <tr
                              key={person._id}
                              className="bg-gray-100 border-b"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                <button id={person._id} name={person.name} onClick={personHandler}>{person.name}</button>
                              </td>
                              {(person.status === 1) ?
                                (<>
                                  {calStatus ?
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#00AB66] text-center">
                                      <button id={person._id} name={person.name} onClick={personHandler}>
                                      {person.used_minutes} Min.
                                      </button>
                                    </td>
                                    :
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#00AB66] text-center">
                                      <button id={person._id} name={person.name} onClick={personHandler}>
                                        {person.time}
                                      </button>
                                    </td>
                                  }
                                </>)
                                : (
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#d9534f] text-center">
                                    <button id={person._id} name={person.name} onClick={personHandler}>
                                      {person.used_minutes} Min.
                                    </button>
                                  </td>
                                )
                              }

                              {calStatus ? (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0275d8] text-right">
                                  <button id={person._id} name={person.name} onClick={personHandler}>
                                    {person.cost}
                                  </button>
                                </td>
                              ) : (
                                <>
                                  {(person.status == 1) ? (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#00AB66] text-center">
                                      <button id={person._id} name={person.name} onClick={personHandler}>
                                        Live
                                      </button>
                                    </td>
                                  ) : (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#d9534f] text-center">
                                      <button id={person._id} name={person.name} onClick={personHandler}>
                                        Out
                                      </button>
                                    </td>
                                  )}
                                </>
                              )}
                            </tr>
                          );
                        })}
                        {calStatus ? (
                          <tr className="bg-gray-100 border-b">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center"></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#0275d8] text-center">
                              Total Cost:
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#0275d8] text-right">
                              {costTotal}
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
          <button
            className="rounded-md border-2 border-[#00AB66] px-4 py-4 text-[#00AB66] text-4xl font-bold my-2"
            onClick={checkin}
          >
            {checkEmpty ? "Start session" : "Check-in"}
          </button>
          {checkEmpty ? (
            <></>
          ) : (
            <>
              <div className="justify-center">
                {/* <div className="mb-3 xl:w-96"> */}
                <label
                  htmlFor="no.court"
                  className="form-label inline-block mb-2 text-[#0275d8] font-medium"
                >
                  Number of Court
                </label>
                <input
                  style={{ marginTop: "10px" }}
                  type="number"
                  inputMode="numeric"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-[#0275d8] bg-white bg-clip-padding border border-solid border-[#0275d8] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="no.court"
                  defaultValue={noCourt}
                  min={1}
                  max={5}
                  onChange={(e) => {
                    setNoCourt(e.target.value);
                  }}
                />
                {/* </div> */}
                {/* <div className="mb-3 xl:w-96"> */}
                <label
                  htmlFor="costPerCourt"
                  className="form-label inline-block mb-2 text-[#0275d8] font-medium"
                >
                  Cost / Hour / Court
                </label>
                <input
                  style={{ marginTop: "10px" }}
                  type="number"
                  inputMode="numeric"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-[#0275d8] bg-white bg-clip-padding border border-solid border-[#0275d8] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="costPerCourt"
                  defaultValue={costCourt}
                  min={1}
                  max={1000}
                  onChange={(e) => {
                    setCostCourt(e.target.value);
                  }}
                />
                {/* </div> */}
                {/* <div className="mb-3 xl:w-96"> */}
                <label
                  htmlFor="noHours"
                  className="form-label inline-block mb-2 text-[#0275d8] font-medium"
                >
                  Number of Hours
                </label>
                <input
                  style={{ marginTop: "10px" }}
                  type="number"
                  // inputMode="numeric"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-[#0275d8] bg-white bg-clip-padding border border-solid border-[#0275d8] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="noHours"
                  defaultValue={noHours}
                  min={1}
                  max={5}
                  onChange={(e) => {
                    setNoHours(e.target.value);
                  }}
                />
                {/* </div> */}
              </div>
              <button
                style={{ marginTop: "20px" }}
                className="rounded-md border-2 border-[#0275d8] px-4 py-4 text-[#0275d8] text-md font-bold"
                onClick={calCost}
              >
                Calculate Cost
              </button>
            </>
          )}

          <button
            className="px-4 py-4 text-[#d9534f] text-base font-bold"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
