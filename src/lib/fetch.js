// Path URL
const url = import.meta.env.VITE_BASE_URL

// GetData (All page)
async function getList(path) {
  try {
    const res = await fetch(`${url}${path}`)
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}

// AddHistory (ListOrder Page)
async function AddHistoryOrder(SelectedMenusWithTime, path) {
  try {
    await fetch(`${url}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(SelectedMenusWithTime),
    })
  } catch (error) {
    console.error("Error posting history order:", error)
    throw error
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
    })
  } catch (error) {
    console.error("Error posting menu:", error)
    throw error
  }
}


// =========================================
//               Menu mangement
// =========================================
async function addNewCategory(categoryData) {
  try {
      const response = await fetch(`${url}Menus`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(categoryData)
      });
      if (!response.ok) {
          throw new Error('Failed to add new category');
      }
      const jsonResponse = await response.json();
      console.log('New category added successfully:', jsonResponse);
      return jsonResponse; // Return the response if needed
  } catch (error) {
      console.error('Error adding new category:', error.message);
      // Handle errors as per your application's requirements
  }
}

async function addNewMenu(categoryId, newMenuData) {
  try {
      const response = await fetch(`${url}Menus/${categoryId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newMenuData)
      });

      if (!response.ok) {
          throw new Error('Failed to add new menu');
      }

      const jsonResponse = await response.json();
      console.log('New menu added successfully:', jsonResponse);
      return jsonResponse; // Return the response if needed
  } catch (error) {
      console.error('Error adding new menu:', error.message);
      // Handle errors as per your application's requirements
  }
}

async function DeleteMenu(categoryId, menuName) {
  try {
      const response = await fetch(`${url}Menus/${categoryId}/menus/${menuName}`, {
          method: 'DELETE'
      });

      if (!response.ok) {
          throw new Error('Failed to delete menu');
      }

      console.log('Menu deleted successfully');
      // Optionally, you can return some data indicating success
      return { success: true };
  } catch (error) {
      console.error('Error deleting menu:', error.message);
      // Handle errors as per your application's requirements
      return { success: false, error: error.message };
  }
}



// =========================================
//               Order mangement
// =========================================
// DeleteMenuInOrder (ListOrder Page)
async function DeleteMenuInOrder(restMenu, id) {
  try {
    await fetch(`${url}OrderLists/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restMenu),
    })
  } catch (error) {
    console.error("Error deleting menu in order:", error)
    throw error
  }
}

// DeleteOrder (ListOrder Page)
async function DeleteOrder(id) {
  try {
    await fetch(`${url}OrderLists/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error("Error deleting order:", error)
    throw error
  }
}

export { getList, AddHistoryOrder, DeleteMenuInOrder, DeleteOrder, PostMenu }