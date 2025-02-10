const helper = {
  allWorking: {
    client: {
      status: "Working",
      color: "green",
    },
    edgeNetwork: {
      status: "Working",
      color: "green",
    },
    webServer: {
      status: "Working",
      color: "green",
    },
  },
  ServerError: {
    client: {
      status: "Working",
      color: "green",
    },
    edgeNetwork: {
      status: "Working",
      color: "green",
    },
    webServer: {
      status: "Error",
      color: "red",
    },
  },
  edgeError: {
    client: {
      status: "Working",
      color: "green",
    },
    edgeNetwork: {
      status: "Error",
      color: "red",
    },
    webServer: {
      status: "Unknown",
      color: "gray",
    },
  },
  edgeBanned: {
    client: {
      status: "Blocked",
      color: "red",
    },
    edgeNetwork: {
      status: "Unknown",
      color: "gray",
    },
    webServer: {
      status: "Unknown",
      color: "gray",
    },
  },
  edgeLimit: {
    client: {
      status: "Too Many Requests",
      color: "red",
    },
    edgeNetwork: {
      status: "Unknown",
      color: "gray",
    },
    webServer: {
      status: "Unknown",
      color: "gray",
    },
  },
};

exports.builderConfig = [
  {
    fileName: "index.html",
    statusCode: 200,
    text: "OK",
    card: helper.allWorking,
    reason: {
      explain:
        "This is cloudflare-custom-pages, a lightweight custom error page written for Cloudflare that uses ejs as a template compiler. Customized for yuna0x0's infrastructure.",
      howtodo:
        "Check the repo on <a href='https://github.com/yuna0x0/cloudflare-custom-pages'>GitHub</a>.",
    },
    footer: [],
  },
  {
    fileName: "5xx-error.html",
    statusCode: "5xx",
    text: "Server-side Error",
    card: helper.ServerError,
    reason: {
      explain: "The web server reported a Server error.",
      howtodo: "Please try again in a few minutes.",
    },
    footer: [
      "Your IP is <code> ::CLIENT_IP:: </code>",
      "Ray ID is <code>::RAY_ID::</code>",
    ],
    script: function () {
      const baseDetils = document.querySelector(".cf-error-details");
      if (!baseDetils) {
        return;
      }
      const ErrorMessage = baseDetils.querySelector("h1").innerText;
      const Explain = baseDetils.querySelector("p").innerText;
      let ErrorNumber = "5xx";
      let POP = "undefined";
      baseDetils.querySelector("ul").childNodes.forEach((e) => {
        if (e.innerText !== undefined) {
          let check = e.innerText.replace("Error reference number: ", "");
          if (check !== e.innerText) {
            ErrorNumber = check;
            return;
          }
          check = e.innerText.replace("Cloudflare Location: ", "");
          if (check !== e.innerText) {
            POP = check;
            return;
          }
        }
      });
      document.querySelector("header main").innerText = ErrorNumber;
      document.querySelector("header description").innerText = ErrorMessage;
      document.querySelector("explain").innerHTML = `<p>${Explain}</p>`;
      document.querySelector("title").innerText = `${ErrorNumber} | ${ErrorMessage}`;

      const utcTime = new Date().toUTCString();
      document.querySelector("text").innerText += `Hit in ${POP}\n\n${utcTime}`;
    },
  },
  {
    fileName: "1xxx-error.html",
    statusCode: "1xxx",
    text: "Cloudflare-side Error",
    card: helper.edgeError,
    reason: {
      explain: "Cloudflare Edge Network reported a error.",
      howtodo: "Please try again in a few minutes.",
    },
    footer: [
      "Your IP is <code> ::CLIENT_IP:: </code>",
      "Ray ID is <code>::RAY_ID::</code>",
    ],
    script: function () {
      const utcTime = new Date().toUTCString();
      document.querySelector("text").innerText += `\n${utcTime}`;

      const baseDetils = document.querySelector(".cf-error-details");
      if (!baseDetils) {
        return;
      }
      const ErrorMessage = baseDetils.querySelector("h1").innerText;
      const Explain =
        baseDetils.querySelector("p").innerHTML +
        baseDetils.querySelector("ul").innerHTML;
      let ErrorNumber = "1xxx";
      baseDetils.querySelector("ul.cferror_details").childNodes.forEach((e) => {
        if (e.innerText !== undefined) {
          let check = e.innerText.replace("Error reference number: ", "");
          if (check !== e.innerText) {
            ErrorNumber = check;
            return;
          }
        }
      });
      document.querySelector("header main").innerText = ErrorNumber;
      document.querySelector("header description").innerText = ErrorMessage;
      document.querySelector("explain div").innerHTML = Explain;
      document.querySelector("title").innerText = `${ErrorNumber} | ${ErrorMessage}`;
    },
  },
  {
    fileName: "block-ip.html",
    statusCode: 1006,
    text: "Your IP address has been banned",
    card: helper.edgeBanned,
    reason: {
      explain:
        "Request the website owner to investigate their Cloudflare security settings or allow your client IP address. Since the website owner blocked your request, Cloudflare support cannot override a customer’s security settings.",
      howtodo:
        "Provide the website owner with a screenshot of the 1006 error message you received.",
    },
    footer: [
      "Your IP is <code> ::CLIENT_IP:: </code>",
      "Ray ID is <code>::RAY_ID::</code>",
    ],
    script: function () {
      const utcTime = new Date().toUTCString();
      document.querySelector("text").innerText += `\n${utcTime}`;
    },
  },
  {
    fileName: "block-waf.html",
    statusCode: 1020,
    text: "Access denied",
    card: helper.edgeBanned,
    reason: {
      explain:
        "A client or browser is blocked by a Cloudflare customer's Firewall Rules.",
      howtodo:
        "Provide the website owner with a screenshot of the 1020 error message you received.",
    },
    footer: [
      "Your IP is <code> ::CLIENT_IP:: </code>",
      "Ray ID is <code>::RAY_ID::</code>",
    ],
  },
  {
    fileName: "1015.html",
    statusCode: 1015,
    text: "Too Many Requests",
    card: helper.edgeLimit,
    reason: {
      explain: "Your request rate to the current site is too fast.",
      howtodo: "Please try again in a few minutes.",
    },
    footer: [
      "Your IP is <code> ::CLIENT_IP:: </code>",
      "Ray ID is <code>::RAY_ID::</code>",
    ],
    script: function () {
      const utcTime = new Date().toUTCString();
      document.querySelector("text").innerText += `\n${utcTime}`;
    },
  },
  {
    fileName: "challenge.html",
    title: "Just a moment...",
    text: "Checking if the site connection is secure...",
    footer: [],
  },
  {
    fileName: "js-challenge.html",
    title: "Just a moment...",
    text: "Checking if the site connection is secure...",
    footer: [],
  },
];

exports.i18n = {
  client: "Your Client",
  edgeNetwork: "Cloudflare",
  webServer: "Web Server",
  provider:
    "This website is using yuna0x0's infrastructure with <a href='https://www.cloudflare.com'>Cloudflare</a>.<br>Contact <a href='https://yuna0x0.com'>yuna0x0</a> if you need help.",
  explain: "What happened?",
  howtodo: "What can I do?",
};
