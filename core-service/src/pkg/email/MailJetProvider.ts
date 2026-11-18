
import type {IEmailProvider} from "./email_provider.intreface.js";
import Email from "node-mailjet";

export class MailJetProvider implements IEmailProvider{
    private readonly mailJetClient:Email.Client;
    private readonly fromEmail:string;
    private readonly fromName:string;

    constructor(apiKey:string,apiSecret:string,fromEmail:string ,fromName:string){
        this.mailJetClient = new Email.Client({apiKey, apiSecret});
        this.fromEmail = fromEmail;
        this.fromName = fromName;
    }

    async send(to: string, subject: string, html: string): Promise<void> {
        const data:Email.SendEmailV3_1.Body = {
            Messages: [{
                From: {
                    Email: this.fromEmail,
                    Name: this.fromName,

                },
                To: [{
                    Email: to,

                }],
                Subject: subject,
                HTMLPart:html
            }]
        }
        const result = await this.mailJetClient
            .post('send',{version:'v3.1'}).request(data)

        console.log(result.response.status);
    }



}