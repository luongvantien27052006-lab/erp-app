export function autoLogout() {
    const token = localStorage.getItem("token");

    if (!token || !token.includes(".")) return;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const exp = payload.exp * 1000;
        const now = Date.now();

        if (exp < now) {
            localStorage.clear();
            document.cookie = "token=; path=/; max-age=0";
            window.location.href = "/login";
        }
    } catch (err) {
        console.error("Token lỗi:", err);
    }
}