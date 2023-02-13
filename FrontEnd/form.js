document.addEventListener("DOMContentLoaded", () => {
  const form = {
    email: document.querySelector("#signin-email"),
    password: document.querySelector("#signin-password"),
    submit: document.querySelector("#signin-btn-submit"),
  };
  let button = form.submit.addEventListener("click", (e) => {
    e.preventDefault();
    const login = "http://localhost:5678/api/users/login";
    fetch(login, {
      method: "POST",
      headers: {
        Accept: "application/json,",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.userId && data.token) {
          localStorage.setItem("token", data.token);
          window.location.replace("index.html");
        } else {
          document.getElementById("form-message").innerHTML =
            "Email ou mot de passe incorrect. Veuillez recommencer.";
        }
      });
  });
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Token présent dans le localstorage :", token);
  } else {
    console.log("Token absent du localstorage.");
  }
});
