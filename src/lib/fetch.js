// Path URL
const url = import.meta.env.VITE_BASE_URL;

// GetData (All page)
async function getList(path) {
  try {
    const res = await fetch(`${url}${path}`);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// AddHistory (ListOrder Page)
async function PostHistoryOrder(SelectedMenusWithTime, path) {
  try {
    await fetch(`${url}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(SelectedMenusWithTime),
    });
  } catch (error) {
    console.error('Error posting history order:', error);
    throw error;
  }
}

async function PostMenu(filterResult, path) {
  try {
    await fetch(`${url}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filterResult),
    });
  } catch (error) {
    console.error('Error posting menu:', error);
    throw error;
  }
}

// async function PutMenu() {
//   try {
//     await fetch("http://localhost:5000/Menus/236e", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ Tako: "tako" }),
//     });
//   } catch (error) {
//     console.error('Error putting menu:', error);
//     throw error;
//   }
// }

// DeleteMenuInOrder (ListOrder Page)
async function DeleteMenuInOrder(restMenu, id) {
  try {
    await fetch(`${url}OrderLists/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restMenu),
    });
  } catch (error) {
    console.error('Error deleting menu in order:', error);
    throw error;
  }
}

// DeleteOrder (ListOrder Page)
async function DeleteOrder(id) {
  try {
    await fetch(`${url}OrderLists/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

export { getList, PostHistoryOrder, DeleteMenuInOrder, DeleteOrder, PostMenu };
