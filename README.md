# 🧩 React Global Error Handling Demo

This is a simple yet powerful React app demonstrating **global error handling**, **API error management**, and **custom error UI overlays** – all with a clean modern design using **Tailwind CSS**.

It fetches data from `jsonplaceholder.typicode.com` by post ID and handles:
- Empty input
- Invalid post ID
- Network/API errors
- Syntax/runtime errors (even globally!)

---

## 🛠 Features

✅ Fetch post by ID  
🚨 Global error overlay with custom UI  
🧯 API error catching with graceful fallback  
🔄 Reload and Retry options  
⚙️ React 19-compatible error boundaries  
✨ Clean & responsive UI with Tailwind CSS

---

## 📦 Tech Stack

- **React (Functional Components)**
- **Tailwind CSS**
- **Error Boundaries (React 19 style)**
- **Global Error Listeners (window.onerror, unhandledrejection, etc.)**
- **Vanilla JavaScript for global error overlay**

---

## 🚀 How to Run

```bash
# Clone the repo
git clone https://github.com/your-username/react-global-error-handler.git
cd react-global-error-handler

# Install dependencies
npm install

# Start dev server
npm run dev
