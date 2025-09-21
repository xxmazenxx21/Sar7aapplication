export const template=(otp, firstname,subject)=> 
   `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Email Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 500px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          padding: 30px;
          text-align: center;
        }
        h1 {
          color: #4CAF50;
        }
        .otp {
          font-size: 22px;
          font-weight: bold;
          color: #ffffff;
          background: #4CAF50;
          padding: 12px 20px;
          border-radius: 8px;
          display: inline-block;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          color: #777;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
       <h2>👋 Hello ${subject}!</h2>
        <h2>👋 Hello ${firstname}!</h2>
        <p>Thank you for registering in the <b>Sara7a</b> app.</p>
        <p>Your email verification code is:</p>
        <div class="otp">${otp}</div>
        <p>If you didnt request this code, you can safely ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Sara7a App. All Rights Reserved.
        </div>
      </div>
    </body>
    </html>
  `;
