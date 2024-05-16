const axios = require("axios");
const { newError } = require("../utils");
require("dotenv").config();

const apiUrl = "https://api.brevo.com/v3/smtp/email";
const apiKey = process.env.BREVO_API_KEY;

const sendBrevoMail = async (emailTo, clientName, subject, template) => {
  const requestData = {
    sender: {
      name: "Mike from Leyou",
      email: "nwabuezesc@gmail.com",
    },
    to: [
      {
        email: emailTo,
        name: clientName,
      },
    ],
    subject: subject,
    htmlContent: template,
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
    });

    return response.status;
  } catch (error) {
    return newError(error.response.data.code, error.response.data);
  }
};

module.exports = sendBrevoMail;
