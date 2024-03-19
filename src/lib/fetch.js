
// ======= Menu list fetch ======= 
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

// ======= Order fetch =======
async function getOrderlist() {
  const res = await fetch("http://localhost:5000/OrderLists")
  let data = await res.json()
  return data
}


async function DeleteMenuInOrder(deleteMenu, t) {
  await fetch(`http://localhost:5000/OrderLists/${t}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deleteMenu),
  })
}

async function DeleteOrder(t) {
  await fetch(`http://localhost:5000/OrderLists/${t}`, {
    method: "DELETE",
  })
}
export { getMenulist , getOrderlist, DeleteMenuInOrder, DeleteOrder }
