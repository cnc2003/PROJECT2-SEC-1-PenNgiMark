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
        return { resCode: res.status, data: data }
    } catch (error) {
        console.error("Error fetching data:", error)
        throw error
    }
}

// AddHistory (ListOrder Page)

// =========================================
//               Menu mangement
// =========================================
async function addNewCategory(categoryData) {
    try {
        const response = await fetch(`${url}Menus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryData),
        })
        if (!response.ok) {
            throw new Error("Failed to add new category")
        }
        const jsonResponse = await response.json()
        // console.log("New category added successfully:", jsonResponse)
        return jsonResponse // Return the response if needed
    } catch (error) {
        console.error("Error adding new category:", error.message)
        // Handle errors as per your application's requirements
    }
}

async function addNewMenu(categoryId, newMenuData) {
    try {
        const response = await fetch(`${url}Menus/${categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newMenuData),
        })
        if (!response.ok) {
            throw new Error("Failed to add new menu")
        }
        const jsonResponse = await response.json()
        // console.log("New menu added successfully:", jsonResponse)
        return jsonResponse // Return the response if needed
    } catch (error) {
        console.error("Error adding new menu:", error.message)
        // Handle errors as per your application's requirements
    }
}

async function DeleteMenu(categoryId, editedMenuData) {
    try {
        const response = await fetch(`${url}Menus/${categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedMenuData),
        })
        if (!response.ok) {
            throw new Error("Failed to delete menu")
        }
        const jsonResponse = await response.json()
        // console.log("Menu deleted successfully", jsonResponse)
        // Optionally, you can return some data indicating success
        return { success: true }
    } catch (error) {
        console.error("Error deleting menu:", error.message)
        // Handle errors as per your application's requirements
        return { success: false, error: error.message }
    }
}

async function DeleteCate(categoryId) {
    try {
        const response = await fetch(`${url}Menus/${categoryId}`, {
            method: "DELETE",
        })
        if (!response.ok) {
            throw new Error("Failed to delete category")
        }
        const jsonResponse = await response.json()
        // console.log("Category deleted successfully", jsonResponse)
        // Optionally, you can return some data indicating success
        return { success: true }
    } catch (error) {
        console.error("Error deleting category:", error.message)
        // Handle errors as per your application's requirements
        return { success: false, error: error.message }
    }
}

// =========================================
//               Order mangement
// =========================================
// DeleteMenuInOrder (ListOrder Page)
async function DeleteMenuInOrder(restMenu, id) {
    try {
        await fetch(`${url}OrderLists/${id}`, {
            method: "PATCH",
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

async function deleteItemById(path, id) {
    try {
        const res = await fetch(`${url}${path}/${id}`, {
            method: "DELETE",
        })
        return res.status
    } catch (error) {
        // console.log(`error: ${error}`)
    }
}
async function editItem(path, id, editItem) {
    try {
        const res = await fetch(`${url}${path}/${id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                ...editItem,
            }),
        })
        const editedItem = await res.json()
        return editedItem
    } catch (error) {
        // console.log(`error: ${error}`)
    }
}

async function addItem(path, newItem) {
    try {
        const res = await fetch(`${url}${path}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                ...newItem,
            }),
        })
        const addedItem = await res.json()
        return { resCode: res.status, data: addedItem }
    } catch (error) {
        console.log(`error: ${error}`)
    }
}

export {
    getList,
    DeleteMenuInOrder,
    addNewCategory,
    addNewMenu,
    DeleteMenu,
    DeleteCate,
    deleteItemById,
    editItem,
    addItem,
}
