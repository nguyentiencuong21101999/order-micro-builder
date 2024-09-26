import fs from "fs";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { Inject, Service } from "typedi";
import { Config, config } from "../../configs";
import { QueueManager, QueueName } from "../../queues/queues";

const rootPath = config.isProduction() ? "src" : "src";
export interface SendMailToQueue {
  email: string;
  subject: string;
  replacement: {
    [key: string]: string;
  };
  templateName: string;
}

@Service()
export class MailerService {
  transporter: nodemailer.Transporter;
  oAuth2Client: OAuth2Client;
  accessToken: string;
  constructor(
    @Inject() private config: Config,
    @Inject() private queueManager: QueueManager
  ) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.config.mailer.username,
        pass: this.config.mailer.password,
      },
    });
  }

  sendMail = (msg: Mail.Options) =>
    new Promise((resolve, reject) => {
      this.transporter.sendMail(msg, (err, info) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(info);
      });
    });

  sendMailToQueue = async (
    to: string,
    subject: string,
    replacement: object,
    templateName: string
  ) => {
    const content = await this.readTemplate(templateName);
    const msg: Mail.Options = {
      from: this.config.mailer.username,
      to: to,
      subject: subject,
      html: this.replacementContent(content, replacement),
    };
    await this.queueManager.getQueue(QueueName.mail).add(QueueName.mail, msg);
  };

  readTemplate = (name: string) =>
    new Promise<string>((resolve, reject) => {
      fs.readFile(
        `${rootPath}/modules/mailer/template/${name}.html`,
        (err, data) => {
          if (err) return reject(err);
          resolve(data.toString());
        }
      );
    });

  replacementContent = (content: string, replacement: object) => {
    Object.keys(replacement).forEach((key) => {
      content = content.replace(key, replacement[key]);
    });
    return content;
  };
}
