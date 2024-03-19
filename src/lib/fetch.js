
async function getOrderlist() {
  // let dat = null
  // await fetch("http://localhost:5000/OrderLists").then((res)=>res.json()).then(data => dat = data)
  // return dat

  const res = await fetch("http://localhost:5000/OrderLists")
  let data = await res.json()
  return data
}
async function getMenulist() {
  let data = null
  try {
    await fetch("http://localhost:5000/Menus")
      .then((response) => response.json())
      .then((dataResponse) => (data = dataResponse))
  } catch (error) {
    console.log(error)
  }
  return data
}

async function DeleteMenuInOrder(restMenu, id) {
  await fetch(`http://localhost:5000/OrderLists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restMenu),
  })
}

async function DeleteOrder(id) {
  await fetch(`http://localhost:5000/OrderLists/${id}`, {
    method: "DELETE",
  })
}
export { getMenulist , getOrderlist, DeleteMenuInOrder, DeleteOrder }
