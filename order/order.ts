
interface Product {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

interface OrderHistoryItem {
  id: number;
  products: Product[];
  total: number;
  createdAt: string;
}
const getQueryParam3 = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};
const loadOrderDetails = async (): Promise<Product | null> => {
  const productId = getQueryParam3("id"); // Get the product ID from the URL
  if (!productId) {
    alert("Product ID not found in the URL.");
    return null;
  }

  try {
    // Fetch product details from the API
    const response = await fetch(`http://localhost:3000/art/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details.");
    }
    const product:Product= await response.json();
    console.log(product);
    return product;
  }
  catch{
    console.log("error on loading the element selected");
    return null;
  }
}

// Fetch order details for the user
const fetchOrderDetails = async (token: string): Promise<Product[]> => {
  try {
    const response = await fetch("http://localhost:3000/order", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order details.");
    }

    const myOrder = await response.json();
    console.log(JSON.stringify(myOrder, null, 2)); // Inspect the response structure

    // Map the API response to match the Product interface
    const products: Product[] = myOrder.flatMap((order: any) =>
      order.items.map((item: any) => ({
        id: item.art?.id || 0,
        title: item.art?.title || "Unknown Title",
        quantity: item?.quantity || 0,
        price: parseFloat(item.art?.price || "0"), // Convert price to a number
      }))
    );

    return products;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return [];
  }
};


// Calculate total price of products
const calculateTotalPrice = (products: Product[]): number => {
  return products.reduce((total, product) => total + product.quantity * product.price, 0);
};

// Render order table
const renderOrderTable = (products: Product[]): void => {
  const tableBody = document.getElementById("order-table-body") as HTMLTableSectionElement;
  const totalPriceElement = document.getElementById("total-price") as HTMLSpanElement;

  tableBody.innerHTML = ""; // Clear existing rows

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.title}</td>
      <td>${product.quantity}</td>
      <td>$${(product.quantity * product.price).toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });

  totalPriceElement.textContent = calculateTotalPrice(products).toFixed(2); // Update total price
};
const orderButton = document.getElementById("order-button") as HTMLButtonElement;
const renderUserDataForm = (): void => {
  const formContainer = document.getElementById("user-data-form") as HTMLDivElement;
  formContainer.innerHTML = `
    <label for="full-name">Full Name:</label>
    <input type="text" id="full-name" placeholder="Enter your full name" required>
    
    <label for="phone">Phone Number:</label>
    <input type="text" id="phone" placeholder="Enter your phone number" required>
    
    <label for="address">Address:</label>
    <input type="text" id="address" placeholder="Enter your address" required>
    <button id="finish-button" class="btn btn-primary mt-3">Finish</button>
  `;
};

// Handle finish button click
const finishButton = document.getElementById("finish-button") as HTMLButtonElement;
const handleFinishButtonClick = async (product: Product, token: string): Promise<void> => {
  const fullname = (document.getElementById("full-name") as HTMLInputElement)?.value.trim();
  const phone = (document.getElementById("phone") as HTMLInputElement)?.value.trim();
  const address = (document.getElementById("address") as HTMLInputElement)?.value.trim();

  if (!fullname || !phone || !address) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullname,
        phone,
        address,
        items: [{ artId: product.id, quantity: 1 }],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to place order.");
    }

    const result = await response.json();
    console.log("Order placed successfully:", result);

    alert("Order placed successfully!");
    finishButton.disabled = true;
    finishButton.textContent = "Order Placed";

    // Update the local product state
    product.quantity -= 1; // Decrement quantity locally
    renderOrderTable([product]); // Update the table
  } catch (error) {
    console.error("Error placing order:", error);
  }
};

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve the token from localStorage or sessionStorage
const finishButton = document.getElementById("finish-button") as HTMLButtonElement;
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  if (!token) {
    alert("You are not logged in. Please log in to continue.");
    window.location.href = "../login/login.html"; // Redirect to login page
    return;
  }

  try {
    // Fetch user-specific order details
    const products: Product[] = [];
    const products1 = await fetchOrderDetails(token);
    const products2 = await loadOrderDetails();
  
    if (products2) {
      products.push(products2); // Add the product only if it's not null
    }
  
    products.push(...products1); // Spread the array of products from fetchOrderDetails
  
    renderOrderTable(products); // Render the table
  
    orderButton.addEventListener("click", () => {
      renderUserDataForm();
      const finishButton = document.getElementById("finish-button") as HTMLButtonElement;
      if (finishButton && products2) {
        finishButton.addEventListener("click", () => {
          handleFinishButtonClick(products2, token);
        });
      }
    });
  } catch (error) {
    console.error("Error initializing page:", error);
    alert("Failed to load order details. Please try again.");
  }
});
// Display user's email
const userEmailElement1 = document.getElementById('loginNav') as HTMLElement;
const username11 = localStorage.getItem('username');

if (username11) {
  userEmailElement1.innerHTML = `Hello,<br> ${username11}`;
} else {
  window.location.href = '../login/index.html';
}
// Example function to render form inputs for user data



// Call renderUserDataForm to display the for