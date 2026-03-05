import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from 'uuid';
const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL)

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setForm] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPassword = async() => {
      let req= await fetch(`${API_URL}/`)
      let passwords = await req.json()
      console.log(passwords)
      setPasswordArray(passwords)         
    }
    

    useEffect(() => {
        getPassword()
    }, [])



    const showPassword = () => {
        passwordRef.current.type = "text"
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "text"
        }
        else {
            ref.current.src = "icons/eyecross.png"
            passwordRef.current.type = "password"
        }
    }

    const savePassword = async () => {
        if(form.site.length >3 && form.username.length>3 && form.password.length>3){
        const id = form.id || uuidv4()
        

    //  id any such id exist in db delete it
       if(form.id){
                await fetch(`${API_URL}/`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:id})})
       }

        await fetch(`${API_URL}/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,id:id})})

        const newArray = [...passwordArray.filter(item=>item.id!==id), { ...form, id: id }];
        setPasswordArray(newArray);

     // localStorage.setItem("passwords", JSON.stringify(newArray));
     // console.log(newArray);
        setForm({ site: "", username: "", password: "" })
           toast('Password Saved!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        }
        else{
            toast('Password not saved!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        }
    }

    const editPassword = (id) => {
        setForm({...passwordArray.filter(item=>item.id===id)[0],id:id})
        const newArray = passwordArray.filter(item => item.id !== id);
        setPasswordArray(newArray);
       // localStorage.setItem("passwords", JSON.stringify(newArray));
    }


    const deletePassword = async(id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("Do You Really Want To Delete The Password")
        if (c) {

            const newArray = passwordArray.filter(item => item.id != id)
            setPasswordArray(newArray)
            let res=await fetch(`${API_URL}/`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})})
      //      localStorage.setItem("passwords", JSON.stringify(newArray))
               toast('Password Deleted! ', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = async (text) => {
        toast('copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        await navigator.clipboard.writeText(text)
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            <div>
                <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>
                {/*  p-2 md:p-0 md:mycontainer */}  
              {/*  p-2 md:p-0 md:mycontainer min-h-[88.2vh] */}
                   
                <div className="p-3 max-w-4xl mx-auto md:px-40 md:py-16 min-h-[88.2vh]">
                    <h1 className='text-4xl font-bold text-center'>
                        <span className="text-green-500">&lt;</span>
                        <span>Pass</span>
                        <span className="text-green-500">OP/&gt;</span>
                    </h1>
                    <p className='text-green-700 text-lg text-center'>Your Own Password manager</p>

                    <div className="text-black flex flex-col p-4 gap-8 items-center">

                        <input value={form.site} onChange={handleChange} className="rounded-full border border-green-500  w-full px-4 py-1" placeholder="Enter Website URL" type="text" name="site" id="site" />

                        <div className="flex flex-col md:flex-row  w-full justify-between gap-8">
                            <input value={form.username} onChange={handleChange} className="rounded-full border border-green-500  w-full px-4 py-1" placeholder="Enter Username " type="text" name="username" id="username" />
                            <div className="relative">

                                <input ref={passwordRef} value={form.password} onChange={handleChange} className="rounded-full border border-green-500  w-full px-4 py-1" placeholder="Enter Password" type="password" name="password" id="password" />
                                <span className="absolute right-0.75 top-1 cursor-pointer" onClick={showPassword}>
                                    <img className='p-1' ref={ref} width={26} src="icons/eye.png" alt="eye" />
                                </span>
                            </div>
                        </div>

                        <button onClick={savePassword} className='flex justify-center items-center bg-green-400 hover:bg-green-300 border border-green-900 rounded-full px-8 py-2 w-fit gap-2'>
                            <lord-icon
                                src="https://cdn.lordicon.com/efxgwrkc.json"
                                trigger="hover"
                            >
                            </lord-icon>
                            Save Password</button>

                    </div>



                    <div className="passwords">
                        <h2 className='font-bold text-2xl py-4'>Your Password</h2>
                        {passwordArray.length === 0 && <div>No password to show</div>}
                        {passwordArray.length !== 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Passsword</th>
                                    <th className="py-2">Delete</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item, index) => {
                                    return <tr key={index}>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center'>
                                                <a href={item.site} target='_blank'>{item.site}</a>
                                                <div className='copy cursor-pointer px-1.5' onClick={() => { copyText(item.site) }}>
                                                    <img className=" w-4 h-4  " src="/icons/copy.png" alt="copy logo" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className=' py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center'>
                                                <span>{item.username}</span>
                                                <div className='copy cursor-pointer px-1.5' onClick={() => { copyText(item.username) }}>
                                                    <img className=" w-4 h-4  " src="/icons/copy.png" alt="copy logo" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className=' py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center'>
                                                <span>{"*".repeat(item.password?.length||0)}</span>
                                                <div className='copy cursor-pointer px-1.5' onClick={() => { copyText(item.password) }}>
                                                    <img className=" w-4 h-4  " src="/icons/copy.png" alt="copy logo" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <span className="cursor-pointer mx-1" onClick={() => { editPassword(item.id) }} >
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/exymduqj.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                            <span className="cursor-pointer mx-1" onClick={() => { deletePassword(item.id) }} >
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/xyfswyxf.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>


                                        </td>
                                    </tr>
                                })}

                            </tbody>
                        </table>}

                    </div>
                </div>
            </div>
        </>
    )
}

export default Manager
