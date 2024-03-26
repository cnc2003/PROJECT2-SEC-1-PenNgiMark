

// Path URL
const url = import.meta.env.VITE_BASE_URL

// GetData (All page)
async function getList(path) {
  const res = await fetch(`${url}${path}`)
  let data = await res.json()
  return data
}

// AddHistory (ListOrder Page)
async function PostHistoryOrder(SelectedMenusWithTime,path) {
  await fetch(`${url}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(SelectedMenusWithTime),
  })

}

async function PostMenu(filterResult,path) {
  await fetch(`${url}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filterResult),
  })

}

async function PutMenu() {
  await fetch("http://localhost:5000/Menus/236e", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({Tako:"tako"}),
  })

}
// PutMenu()
// DeleteMenuInOrder (ListOrder Page)
async function DeleteMenuInOrder(restMenu, id) {
  await fetch(`${url}OrderLists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restMenu),
  })

}

// DeleteOrder (ListOrder Page)
async function DeleteOrder(id) {
  await fetch(`${url}OrderLists/${id}`, {
    method: "DELETE",
  })
}

export { getList ,PostHistoryOrder, DeleteMenuInOrder, DeleteOrder,PostMenu}

