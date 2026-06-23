// ✅ URL se user_id lo aur store karo + postMessage listener
const initUserData = () => {
  const params = new URLSearchParams(window.location.search);
  const userIdFromUrl = params.get("user_id");

  if (userIdFromUrl) {
    sessionStorage.setItem("app_user_id", userIdFromUrl);
    console.log("✅ user_id URL se save hua:", userIdFromUrl);
  } else {
    console.warn(
      "⚠️ URL mein user_id nahi mila, sessionStorage check kar raha hoon...",
    );
  }

  // ✅ postMessage se pura user data receive karo (name, image, id)
  window.addEventListener("message", (event) => {
    if (event.origin !== "http://localhost:3000") return;

    if (event.data?.type === "USER_DATA") {
      const { user_id, name, image } = event.data.payload;

      sessionStorage.setItem("app_user_id", user_id);
      sessionStorage.setItem("app_user_name", name || "");
      sessionStorage.setItem("app_user_image", image || "");

      console.log("✅ User data postMessage se mila:", {
        user_id,
        name,
        image,
      });

      // ✅ Navbar ko batao ki data aa gaya
      window.dispatchEvent(new CustomEvent("USER_DATA_RECEIVED"));
    }
  });
};

initUserData();

export const getUserId = () => {
  const id = sessionStorage.getItem("app_user_id") || "1";
  console.log("👤 getUserId called, returning:", id);
  return id;
};

export const getUserName = () => {
  return sessionStorage.getItem("app_user_name") || null;
};

export const getUserImage = () => {
  return sessionStorage.getItem("app_user_image") || null;
};
