async function getOrderlist() {
    // let dat = null
    // await fetch("http://localhost:5000/OrderLists").then((res)=>res.json()).then(data => dat = data)
    // return dat

    const res = await fetch("http://localhost:5000/OrderLists")
    let data = await res.json()
    return data
}

async function AddManement() {
    const resID = await fetch("http://localhost:5000/Management", {
        // method: "POST",
        // body: JSON.stringify()
    })
    let data = await resID.json()
    console.log(data)
    return data
    
}

 AddManement()
export { getOrderlist, AddManement }
