import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { route } from "next/dist/server/router";

const Checkin = () => {

    const router = useRouter();

    const checkin = async () => {

        await axios.get("/api/getSession").then(async (res) => {
            if(res.status === 200){
                if(res.data.length > 0){
                    const { value: text } = await Swal.fire({
                        input: "text",
                        inputLabel: "TIME TO CHECK-IN",
                        inputPlaceholder: "Type your name here...",
                        confirmButtonText: "Check in",
                        showCancelButton: true,
                        confirmButtonColor: "#00AB66",
                      });
                      if (text) {
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
                      router.replace("/")
                }
                else {
                    await Swal.fire({
                        icon: "warning",
                        title: "Session not open yet, please open session before check-in",
                        confirmButtonText: "Open session",
                        confirmButtonColor: "#00AB66",
                      }).then((isConfirm) => {
                        if (isConfirm.isConfirmed) {
                          router.replace("/");
                        }
                      });
                }
            }
        })

    } 

    useEffect(async () => {
        checkin();        
    }, [])

    return(
        <>


        </>
    );
}

export default Checkin; 