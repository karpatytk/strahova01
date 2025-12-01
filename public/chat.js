document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, message }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Повідомлення успішно надіслано!");
        form.reset();
      } else {
        alert("Сталася помилка: " + (data.error || "невідома помилка"));
      }
    } catch (err) {
      alert("Не вдалося підключитися до сервера");
      console.error(err);
    }
  });
});
