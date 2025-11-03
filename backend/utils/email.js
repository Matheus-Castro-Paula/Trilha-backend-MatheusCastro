const nodemailer = require('nodemailer');

// Cria o "transportador" do Nodemailer
// usando as credenciais do .env (do Mailtrap)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Função auxiliar para enviar e-mails
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    console.log('E-mail de recuperação enviado para:', to);
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
  }
};

module.exports = sendEmail;